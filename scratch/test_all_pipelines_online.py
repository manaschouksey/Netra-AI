import os
import sys
import io
import json
import urllib.request
import urllib.parse
from PIL import Image, ImageDraw, ImageFilter

LOCAL_API = "http://127.0.0.1:8000/api/verify-document"
RENDER_API = "https://netra-ai-backend-edb7.onrender.com/api/verify-document"

OUT_DIR = os.path.join(os.path.dirname(__file__), "test_samples")
os.makedirs(OUT_DIR, exist_ok=True)

ONLINE_SAMPLES = {
    "sample_passport": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Specimen_of_British_Passport_2020.jpg/800px-Specimen_of_British_Passport_2020.jpg",
        "filename": "sample_uk_passport.jpg",
        "type": "Passport",
        "description": "UK Specimen Passport photo page with MRZ and portrait"
    },
    "sample_id_card": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Specimen_of_German_ID_card_2021.jpg/800px-Specimen_of_German_ID_card_2021.jpg",
        "filename": "sample_german_id.jpg",
        "type": "National ID Card",
        "description": "German Specimen Personalausweis ID card"
    },
    "sample_driving_license": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/UK_Driving_Licence_specimen_2015.jpg/800px-UK_Driving_Licence_specimen_2015.jpg",
        "filename": "sample_uk_license.jpg",
        "type": "Driving License",
        "description": "UK Photocard Driving License Specimen"
    },
    "sample_selfie_match": {
        "url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        "filename": "sample_person_a.jpg",
        "type": "Selfie A",
        "description": "High resolution front-facing portrait"
    },
    "sample_selfie_mismatch": {
        "url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        "filename": "sample_person_b.jpg",
        "type": "Selfie B",
        "description": "High resolution front-facing male portrait (different individual)"
    }
}

def download_online_samples():
    print("=== Checking Test Images ===", flush=True)
    downloaded = {}
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    
    for key, item in ONLINE_SAMPLES.items():
        filepath = os.path.join(OUT_DIR, item["filename"])
        if not os.path.exists(filepath) or os.path.getsize(filepath) < 500:
            try:
                print(f"Fetching {item['filename']}...", flush=True)
                req = urllib.request.Request(item["url"], headers=headers)
                with urllib.request.urlopen(req, timeout=5) as resp, open(filepath, "wb") as f:
                    f.write(resp.read())
                print(f"Saved: {filepath} ({os.path.getsize(filepath)} bytes)", flush=True)
            except Exception as e:
                print(f"Creating specialized sample for {key}: {e}", flush=True)
                create_synthetic_image(filepath, item["type"])
        else:
            print(f"Ready: {filepath} ({os.path.getsize(filepath)} bytes)", flush=True)
        downloaded[key] = filepath
    return downloaded

def create_synthetic_image(path, title):
    img = Image.new("RGB", (600, 400), color=(240, 243, 246))
    d = ImageDraw.Draw(img)
    d.rectangle([20, 20, 580, 380], outline=(40, 60, 120), width=4)
    d.rectangle([40, 50, 180, 230], fill=(200, 210, 220), outline=(0, 0, 0), width=2)
    d.ellipse([70, 80, 150, 170], fill=(240, 200, 180))
    d.ellipse([90, 110, 105, 125], fill=(30, 30, 30))
    d.ellipse([115, 110, 130, 125], fill=(30, 30, 30))
    d.rectangle([210, 60, 550, 100], fill=(220, 230, 240))
    d.text((220, 70), f"OFFICIAL {title.upper()}", fill=(20, 30, 70))
    d.text((220, 120), "NAME: MORGAN ALEX", fill=(0, 0, 0))
    d.text((220, 150), "DOC NO: P98234120", fill=(0, 0, 0))
    d.text((220, 180), "DOB: 14/05/1992", fill=(0, 0, 0))
    d.text((220, 210), "EXP: 20/11/2030", fill=(0, 0, 0))
    d.text((40, 320), "P<GBRMORGAN<<ALEX<<<<<<<<<<<<<<<<<<<<<<<<<<<", fill=(0, 0, 0))
    d.text((40, 345), "P982341208GBR9205142M3011204<<<<<<<<<<<<<<02", fill=(0, 0, 0))
    img.save(path, quality=92)

def create_tampered_image(src_path, dest_path):
    img = Image.open(src_path).convert("RGB")
    d = ImageDraw.Draw(img)
    w, h = img.size
    d.rectangle([int(w * 0.3), int(h * 0.4), int(w * 0.75), int(h * 0.55)], fill=(255, 30, 30))
    d.text((int(w * 0.32), int(h * 0.42)), "TAMPERED FAKE ID 0000", fill=(255, 255, 255))
    cropped = img.crop((int(w * 0.3), int(h * 0.4), int(w * 0.75), int(h * 0.55)))
    blurred = cropped.filter(ImageFilter.GaussianBlur(radius=3))
    img.paste(blurred, (int(w * 0.3), int(h * 0.4)))
    img.save(dest_path, quality=40)
    print(f"Created tampered test sample: {dest_path}")

def post_multipart(url, doc_path, selfie_path=None):
    boundary = "----NetraBoundary7MA4YWxkTrZu0gW"
    body = bytearray()
    
    # Add document
    doc_filename = os.path.basename(doc_path)
    with open(doc_path, "rb") as f:
        doc_data = f.read()
    body.extend(f"--{boundary}\r\n".encode("utf-8"))
    body.extend(f'Content-Disposition: form-data; name="document"; filename="{doc_filename}"\r\n'.encode("utf-8"))
    body.extend(b"Content-Type: image/jpeg\r\n\r\n")
    body.extend(doc_data)
    body.extend(b"\r\n")
    
    # Add optional live_photo
    if selfie_path and os.path.exists(selfie_path):
        selfie_filename = os.path.basename(selfie_path)
        with open(selfie_path, "rb") as f:
            selfie_data = f.read()
        body.extend(f"--{boundary}\r\n".encode("utf-8"))
        body.extend(f'Content-Disposition: form-data; name="live_photo"; filename="{selfie_filename}"\r\n'.encode("utf-8"))
        body.extend(b"Content-Type: image/jpeg\r\n\r\n")
        body.extend(selfie_data)
        body.extend(b"\r\n")
        
    body.extend(f"--{boundary}--\r\n".encode("utf-8"))
    
    req = urllib.request.Request(url, data=bytes(body))
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            raw = resp.read().decode("utf-8")
            return {"success": True, "data": json.loads(raw)}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="ignore")
        return {"success": False, "error": f"HTTP {e.code}: {err_body}"}
    except Exception as e:
        return {"success": False, "error": str(e)}

def main():
    samples = download_online_samples()
    
    tampered_doc_path = os.path.join(OUT_DIR, "sample_tampered_passport.jpg")
    create_tampered_image(samples["sample_passport"], tampered_doc_path)
    
    scenarios = [
        {
            "id": "CASE-1",
            "name": "Standard Passport + Authentic Live Face",
            "doc": samples["sample_passport"],
            "selfie": samples["sample_selfie_match"],
            "description": "UK Passport Specimen compared with matching live selfie photo"
        },
        {
            "id": "CASE-2",
            "name": "National ID Card + Face Verification",
            "doc": samples["sample_id_card"],
            "selfie": samples["sample_selfie_match"],
            "description": "German ID Card specimen with front portrait against live photo"
        },
        {
            "id": "CASE-3",
            "name": "Driving License (Document-Only Scan)",
            "doc": samples["sample_driving_license"],
            "selfie": None,
            "description": "Official Driving License specimen verified without a live selfie"
        },
        {
            "id": "CASE-4",
            "name": "Passport + Mismatched Portrait (Impersonation Test)",
            "doc": samples["sample_passport"],
            "selfie": samples["sample_selfie_mismatch"],
            "description": "Authentic ID card tested against completely different individual portrait"
        },
        {
            "id": "CASE-5",
            "name": "Digitally Manipulated / Spliced Document",
            "doc": tampered_doc_path,
            "selfie": samples["sample_selfie_match"],
            "description": "Tampered photo with localized compression glitch and pasted text"
        }
    ]
    
    results = []
    for sc in scenarios:
        print(f"\nEvaluating: {sc['name']}...")
        res = post_multipart(LOCAL_API, sc["doc"], sc["selfie"])
        print(f"Result: Success={res['success']}")
        if res["success"]:
            d = res["data"]
            print(f"  Status: {d.get('status')}")
            print(f"  Risk Score: {d.get('riskScore')} / 100")
            print(f"  Doc Type: {d.get('docType')}")
            print(f"  Face Score: {d.get('faceMatch', {}).get('score')}%")
            print(f"  Tampering Score: {d.get('modules', {}).get('tampering', {}).get('anomaly_score')}")
        else:
            print(f"  Error: {res.get('error')}")
            
        results.append({
            "scenario": sc,
            "result": res
        })
    
    audit_file = os.path.join(OUT_DIR, "audit_summary.json")
    with open(audit_file, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\nAudit completed! Summary written to {audit_file}")

if __name__ == "__main__":
    main()
