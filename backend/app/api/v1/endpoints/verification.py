import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from starlette.concurrency import run_in_threadpool

from app.core.config import settings
from app.core.logging import logger
from app.utils.file_helpers import read_and_validate_upload
from app.utils.score_helpers import (
    safe_dict,
    extract_face_score,
    get_face_status,
    get_match_level,
)
from app.services.ocr_service import extract_text
from app.services.validation_service import validate_document
from app.services.tampering_service import detect_tampering
from app.services.face_service import verify_face
from app.services.risk_service import calculate_risk

router = APIRouter()

@router.post(
    "/verify-document",
    tags=["Verification"],
    summary="Verify government document authenticity and face match",
)
async def verify_document_endpoint(
    document: UploadFile = File(..., description="Government ID document image or PDF"),
    live_photo: UploadFile = File(None, description="Reference live photo/selfie"),
):
    request_id = uuid.uuid4().hex[:8]
    logger.info("[%s] verify-document request received", request_id)

    # 1. Read and validate document
    doc_bytes = await read_and_validate_upload(
        document,
        "document",
        settings.ALLOWED_DOCUMENT_TYPES,
    )

    # 2. Read and validate optional face photo
    live_photo_bytes = None
    if live_photo is not None:
        live_photo_bytes = await read_and_validate_upload(
            live_photo,
            "live_photo",
            settings.ALLOWED_FACE_TYPES,
        )

    # 3. OCR extraction
    try:
        logger.info("[%s] Starting OCR stage", request_id)
        ocr_result = await run_in_threadpool(
            extract_text,
            doc_bytes,
            document.filename or "",
        )
        ocr_result = safe_dict(ocr_result)
        logger.info("[%s] OCR completed", request_id)
    except Exception as exc:
        logger.exception("[%s] OCR stage failed", request_id)
        raise HTTPException(status_code=502, detail="OCR processing failed") from exc

    # 4. Document validation
    try:
        logger.info("[%s] Starting document validation", request_id)
        validation_result = await run_in_threadpool(validate_document, ocr_result)
        validation_result = safe_dict(validation_result)
        logger.info("[%s] Document validation completed", request_id)
    except Exception as exc:
        logger.exception("[%s] Validation stage failed", request_id)
        raise HTTPException(status_code=502, detail="Document validation failed") from exc

    # 5. Tampering detection
    try:
        logger.info("[%s] Starting tampering detection", request_id)
        tamper_result = await run_in_threadpool(detect_tampering, doc_bytes)
        tamper_result = safe_dict(tamper_result)
        logger.info("[%s] Tampering detection completed", request_id)
    except Exception as exc:
        logger.exception("[%s] Tampering detection failed", request_id)
        raise HTTPException(status_code=502, detail="Tampering detection failed") from exc

    # 6. Face verification
    try:
        logger.info("[%s] Starting face verification", request_id)
        face_result = await run_in_threadpool(verify_face, doc_bytes, live_photo_bytes)
        face_result = safe_dict(face_result)
        logger.info("[%s] Face verification completed", request_id)
    except Exception as exc:
        logger.warning("[%s] Face verification encountered exception, using fallback: %s", request_id, exc)
        face_result = {
            "face_detected_on_document": True,
            "face_detected_on_live_photo": True if live_photo_bytes else None,
            "match": False if live_photo_bytes else None,
            "similarity_score": 0.0 if live_photo_bytes else None,
            "method": "exception_fallback",
            "notes": f"Face evaluation encountered exception: {exc}",
        }

    # 7. Face metrics extraction
    face_score = extract_face_score(face_result)
    face_status = get_face_status(face_result)
    face_match_level = get_match_level(face_score)

    # 8. Composite risk calculation
    try:
        logger.info("[%s] Calculating composite risk score", request_id)
        risk_summary = await run_in_threadpool(
            calculate_risk,
            ocr_data=ocr_result,
            validation_data=validation_result,
            tamper_data=tamper_result,
            face_data=face_result,
        )
        risk_summary = safe_dict(risk_summary)
        logger.info("[%s] Risk calculation completed", request_id)
    except Exception as exc:
        logger.exception("[%s] Risk scoring failed", request_id)
        raise HTTPException(status_code=502, detail="Risk scoring failed") from exc

    raw_risk_score = risk_summary.get("score", 0)
    try:
        risk_score = round(max(0.0, min(100.0, float(raw_risk_score))), 2)
    except (TypeError, ValueError):
        risk_score = 0.0

    recommendation = risk_summary.get("recommendation", "Awaiting officer decision")
    document_number = ocr_result.get("document_number") or f"DOC-{uuid.uuid4().hex[:5].upper()}"
    document_type = ocr_result.get("document_type", "Government ID")
    document_matched = bool(validation_result.get("is_valid", False))
    document_match_count = 1 if document_matched else 0

    # Assemble comprehensive response payload
    final_result = {
        "requestId": request_id,
        "docId": document_number,
        "docType": document_type,
        "submittedAt": "Just now",
        "officer": "Officer System",
        "thumbnailLabel": document.filename or "Uploaded Document",
        "status": recommendation,
        "riskScore": risk_score,
        "riskBreakdown": risk_summary.get("breakdown", {}),
        "faceMatch": {
            "score": face_score,
            "percentage": face_score,
            "status": face_status,
            "level": face_match_level,
        },
        "documentMatch": {
            "matched": document_matched,
            "count": document_match_count,
        },
        "modules": {
            "ocr": ocr_result,
            "validation": validation_result,
            "tampering": tamper_result,
            "face_verification": face_result,
        },
        "summary": {
            "ocrCompleted": True,
            "validationCompleted": True,
            "tamperingAnalysisCompleted": True,
            "faceVerificationCompleted": True,
            "faceMatchScore": face_score,
            "faceMatchLevel": face_match_level,
            "documentMatched": document_matched,
            "documentsMatched": document_match_count,
            "riskScore": risk_score,
            "recommendation": recommendation,
        },
    }

    logger.info(
        "[%s] Verification completed | risk=%s | face=%s | level=%s",
        request_id,
        risk_score,
        face_score,
        face_match_level,
    )

    return final_result
