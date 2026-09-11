from typing import Set
from fastapi import UploadFile, HTTPException
from app.core.config import settings
from app.core.logging import logger

async def read_and_validate_upload(
    file: UploadFile,
    field_name: str,
    allowed_types: Set[str],
) -> bytes:
    """
    Validates content-type, reads bytes, and checks size limits for uploaded files.
    """
    if file is None:
        raise HTTPException(
            status_code=400,
            detail=f"{field_name}: file is required",
        )

    # Validate Content-Type
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=(
                f"{field_name}: unsupported content type '{file.content_type}'. "
                f"Allowed types: {', '.join(sorted(allowed_types))}"
            ),
        )

    # Read binary stream
    try:
        data = await file.read()
    except Exception as exc:
        logger.exception("Failed to read uploaded file: %s", field_name)
        raise HTTPException(
            status_code=400,
            detail=f"{field_name}: unable to read file",
        ) from exc

    # Empty check
    if not data:
        raise HTTPException(
            status_code=400,
            detail=f"{field_name}: empty file",
        )

    # Size limit check
    if len(data) > settings.MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=(
                f"{field_name}: file exceeds "
                f"{settings.MAX_FILE_SIZE_BYTES // (1024 * 1024)}MB limit"
            ),
        )

    return data
