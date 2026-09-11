import io
import json
import urllib.request
from PIL import Image, ImageDraw

def create_sample_id_card(name="JOHN DOE", doc_num="Z1234567", dob="15/08/1990", add_photo=True):
    img = Image.new("RGB", (600, 380), color=(240, 242, 245))
    draw = ImageDraw.Draw(img)
    
    # Header banner
    draw.rectangle([(0, 0), (600, 60)], fill=(31, 22, 51))
    draw.text((20, 18), "REPUBLIC OF IDENTITY - PASSPORT CARD", fill=(255, 255, 255))
    
    # Photo box with a simple face portrait
    if add_photo:
        draw.rectangle([(40, 90), (190, 270)], fill=(200, 210, 225), outline=(54, 45, 89), width=2)
        draw.ellipse([(85, 120), (145, 180)], fill=(235, 195, 170))  # Head
        draw.ellipse([(95, 140), (105, 150)], fill=(40, 30, 20))     # Left eye
        draw.ellipse([(125, 140), (135, 150)], fill=(40, 30, 20))    # Right eye
        draw.line([(100, 165), (130, 165)], fill=(180, 50, 50), width=2) # Mouth
        draw.arc([(65, 190), (165, 290)], 180, 360, fill=(40, 80, 150), width=18) # Shoulders
    
    # Card details text
    draw.text((220, 95), "DOCUMENT TYPE: PASSPORT CARD", fill=(80, 80, 90))
    draw.text((220, 130), f"FULL NAME: {name}", fill=(20, 20, 30))
    draw.text((220, 165), f"DOCUMENT NO: {doc_num}", fill=(20, 20, 30))
    draw.text((220, 200), f"DATE OF BIRTH: {dob}", fill=(20, 20, 30))
    draw.text((220, 235), "NATIONALITY: IND / GBR", fill=(20, 20, 30))
    draw.text((220, 270), "EXPIRATION: 20/12/2030", fill=(20, 20, 30))
    
    # MRZ Machine Readable Zone
    draw.rectangle([(20, 310), (580, 360)], fill=(225, 228, 232))
    draw.text((30, 318), f"P<UTO{name.replace(' ', '<')}<<<<<<<<<<<<<<<<<<<<<<", fill=(10, 10, 10))
    draw.text((30, 338), f"{doc_num}0UTO9008154M3012208<<<<<<<<<<<4", fill=(10, 10, 10))
    
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=95)
    return buf.getvalue()

def create_sample_selfie(matching=True):
    img = Image.new("RGB", (400, 400), color=(230, 235, 240))
    draw = ImageDraw.Draw(img)
    
    draw.ellipse([(140, 100), (260, 220)], fill=(235, 195, 170))  # Head
    draw.ellipse([(165, 135), (185, 155)], fill=(40, 30, 20))     # Left eye
    draw.ellipse([(215, 135), (235, 155)], fill=(40, 30, 20))     # Right eye
    draw.line([(180, 185), (220, 185)], fill=(180, 50, 50), width=3) # Mouth
    
    if matching:
        draw.arc([(100, 230), (300, 420)], 180, 360, fill=(40, 80, 150), width=35) # Same shirt
    else:
        draw.arc([(100, 230), (300, 420)], 180, 360, fill=(180, 40, 40), width=35) # Different person

    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=95)
    return buf.getvalue()

def send_verification_request(doc_bytes, selfie_bytes, endpoint_url):
    boundary = "----WebKitFormBoundaryNetraAuditPipeline"
    body = bytearray()
    
    body.extend(f"--{boundary}\r\nContent-Disposition: form-data; name=\"document\"; filename=\"id_card.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n".encode())
    body.extend(doc_bytes)
    body.extend(f"\r\n--{boundary}\r\nContent-Disposition: form-data; name=\"live_photo\"; filename=\"selfie.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n".encode())
    body.extend(selfie_bytes)
    body.extend(f"\r\n--{boundary}--\r\n".encode())

    req = urllib.request.Request(
        endpoint_url,
        data=bytes(body),
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}
    )
    
    with urllib.request.urlopen(req, timeout=90) as res:
        return json.loads(res.read().decode())

def main():
    print("=================================================================")
    print("NETRA TRUSTID AI - FULL PIPELINE END-TO-END AUDIT & VERIFICATION")
    print("=================================================================")
    
    doc_a = create_sample_id_card("MICHAEL SCOTT", "Z9876543", "15/03/1985")
    selfie_a = create_sample_selfie(matching=True)

    # 1. Audit against Local Backend
    print("\n[AUDIT 1] Testing Local Backend (http://127.0.0.1:8000/api/verify-document)...")
    try:
        res_local = send_verification_request(doc_a, selfie_a, "http://127.0.0.1:8000/api/verify-document")
        print("-> LOCAL BACKEND STATUS: 200 OK")
        print(f"   Verdict Status: {res_local.get('status')}")
        print(f"   Composite Risk Score: {res_local.get('riskScore')}")
        print(f"   OCR Pipeline: {res_local['modules']['ocr'].get('document_type')} (Confidence: {res_local['modules']['ocr'].get('ocr_confidence')}%)")
        print(f"   Validation Pipeline: Valid={res_local['modules']['validation'].get('is_valid')}")
        print(f"   Tampering Pipeline: Score={res_local['modules']['tampering'].get('tamper_score')} Risk={res_local['modules']['tampering'].get('risk_level')}")
        print(f"   Face Pipeline: Match={res_local['modules']['face_verification'].get('match')} Score={res_local['modules']['face_verification'].get('similarity_score')}%")
    except Exception as e:
        print("-> LOCAL BACKEND ERROR:", e)
        res_local = None

    # 2. Audit against Render Production Backend
    print("\n[AUDIT 2] Testing Production Render Backend (https://netra-ai-backend-edb7.onrender.com/api/verify-document)...")
    try:
        res_render = send_verification_request(doc_a, selfie_a, "https://netra-ai-backend-edb7.onrender.com/api/verify-document")
        print("-> RENDER PRODUCTION STATUS: 200 OK")
        print(f"   Verdict Status: {res_render.get('status')}")
        print(f"   Composite Risk Score: {res_render.get('riskScore')}")
        print(f"   OCR Pipeline: {res_render['modules']['ocr'].get('document_type')} (Confidence: {res_render['modules']['ocr'].get('ocr_confidence')}%)")
        print(f"   Validation Pipeline: Valid={res_render['modules']['validation'].get('is_valid')}")
        print(f"   Tampering Pipeline: Score={res_render['modules']['tampering'].get('tamper_score')} Risk={res_render['modules']['tampering'].get('risk_level')}")
        print(f"   Face Pipeline: Match={res_render['modules']['face_verification'].get('match')} Score={res_render['modules']['face_verification'].get('similarity_score')}%")
    except Exception as e:
        print("-> RENDER PRODUCTION ERROR:", e)
        res_render = None

    # Save summary report
    with open("scratch/audit_report.json", "w") as f:
        json.dump({"local": res_local, "render": res_render}, f, indent=2)
    print("\n-> Audit report saved to scratch/audit_report.json.")

if __name__ == "__main__":
    main()
