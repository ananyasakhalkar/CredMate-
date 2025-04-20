import cv2
import face_recognition
import whisper
import pyaudio
import wave
import threading
import numpy as np
from datetime import datetime
import os
import re
from fastapi import FastAPI
from pydantic import BaseModel

# Initialize FastAPI app
app = FastAPI()

# Pydantic model for input
class LoanRequest(BaseModel):
    transcription: str

# ====== Setup Directories ======
output_dir = "recordings"
os.makedirs(output_dir, exist_ok=True)

# ====== Filenames ======
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
video_filename = os.path.join(output_dir, f"recording_{timestamp}.avi")
audio_filename = os.path.join(output_dir, f"recording_{timestamp}.wav")
transcription_filename = os.path.join(output_dir, f"transcription_{timestamp}.txt")

# ====== Initialize Whisper Model ======
model = whisper.load_model("base")

# ====== Video Setup ======
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 320)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 240)
cap.set(cv2.CAP_PROP_FPS, 10)

ret, frame = cap.read()

if not ret or frame is None:
    print("[ERROR] Could not access the camera or invalid frame received.")
    cap.release()
    exit()

# Ensure frame is a NumPy array and correctly formatted
frame = np.array(frame, dtype=np.uint8)

# Convert grayscale to RGB if needed
if len(frame.shape) == 2:
    frame = cv2.cvtColor(frame, cv2.COLOR_GRAY2RGB)

# Convert BGR to RGB
rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

# Debugging output
print(f"Frame dtype: {rgb_frame.dtype}, shape: {rgb_frame.shape}, min: {rgb_frame.min()}, max: {rgb_frame.max()}")

# Use OpenCV's Haar cascade face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

if len(faces) == 0:
    print("[ERROR] No face detected for enrollment. Exiting...")
    cap.release()
    exit()

print("[INFO] Face enrollment successful.")

# ====== Start Audio Thread ======
recording = True
def record_audio():
    """Record audio smoothly in a separate thread."""
    print("[INFO] Recording audio... Automatically stopping in 10 seconds.")
    
    stream = pyaudio.PyAudio().open(
        format=pyaudio.paInt16,
        channels=1,
        rate=16000,
        input=True,
        frames_per_buffer=4096
    )
    
    frames = []
    for _ in range(int(16000 / 4096 * 10)):  # Record for 10 seconds
        data = stream.read(4096, exception_on_overflow=False)
        frames.append(data)
    
    stream.stop_stream()
    stream.close()
    
    wf = wave.open(audio_filename, 'wb')
    wf.setnchannels(1)
    wf.setsampwidth(pyaudio.PyAudio().get_sample_size(pyaudio.paInt16))
    wf.setframerate(16000)
    wf.writeframes(b''.join(frames))
    wf.close()
    print(f"[INFO] Audio saved as: {audio_filename}")

audio_thread = threading.Thread(target=record_audio)
audio_thread.start()
audio_thread.join()

# ====== Transcribe Audio ======
print("[INFO] Transcribing audio...")
if os.path.exists(audio_filename):
    try:
        transcription_result = model.transcribe(audio_filename)
        transcription = transcription_result["text"].strip()
        print(f"[INFO] Transcription: {transcription}")

        # Save transcription
        with open(transcription_filename, "w", encoding="utf-8") as f:
            f.write(transcription)
    except Exception as e:
        print(f"[ERROR] Transcription failed: {e}")
        transcription = ""
else:
    print("[ERROR] Audio file not found.")
    transcription = ""

# ====== Loan Eligibility Evaluation ======
def extract_income(text):
    """Extract income from transcription."""
    income_patterns = [
        r"(?i)rs\.?\s*(\d{1,3}(?:,\d{3})*|\d+)",
        r"(?i)rupees\s*(\d{1,3}(?:,\d{3})*|\d+)",
        r"(?i)(\d{1,3}(?:,\d{3})*|\d+)\s*rupees",
        r"(?i)(\d{1,3}(?:,\d{3})*|\d+)k",
    ]
    for pattern in income_patterns:
        match = re.search(pattern, text)
        if match:
            income_str = match.group(1).replace(",", "")
            return int(income_str) * 1000 if "k" in pattern else int(income_str)
    return None

def extract_age(text):
    """Extract age from transcription."""
    age_patterns = [
        r"I am (\d{1,3}) years old",
        r"I'm (\d{1,3})",
        r"age (\d{1,3})"
    ]
    for pattern in age_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            age = int(match.group(1))
            if 18 <= age <= 100:
                return age
    return None

def evaluate_loan_eligibility(transcription):
    """Evaluate loan eligibility based on extracted info."""
    print("[INFO] Evaluating Loan Eligibility...")
    age = extract_age(transcription)
    income = extract_income(transcription)
    reasons = []
    
    if age is None:
        reasons.append("Age not mentioned.")
    elif age < 18:
        reasons.append("Applicant must be at least 18 years old.")

    if income is None:
        reasons.append("Income not mentioned.")
    elif income < 15000:
        reasons.append("Income too low.")
    elif 15000 <= income < 25000:
        reasons.append("More financial info needed.")
    
    decision = "✅ Approved" if not reasons else "❌ Rejected" if "Income too low." in reasons or "Applicant must be at least 18 years old." in reasons else "🔄 More Info Needed"
    
    return decision, reasons

@app.post("/evaluate/")
def evaluate_loan(request: LoanRequest):
    import requests
    # Extract Loan Info from Transcription
    age = extract_age(transcription)
    income = extract_income(transcription)
    purpose = "home"  # Placeholder (can improve with NLP)
    cibil_score = 700  # Assume average score
past_repayment_history = "clean"
employment_type = "salaried"
monthly_debts = 10000  # Placeholder
loan_amount = 500000  # Placeholder
loan_tenure = 10  # Placeholder
collateral_provided = True
co_applicant = False

# Prepare API Payload
if age and income:
    loan_payload = {
        "age": age,
        "income": income,
        "purpose": purpose,
        "cibil_score": cibil_score,
        "past_repayment_history": past_repayment_history,
        "employment_type": employment_type,
        "monthly_debts": monthly_debts,
        "loan_amount": loan_amount,
        "loan_tenure": loan_tenure,
        "collateral_provided": collateral_provided,
        "co_applicant": co_applicant
    }

    # Send Data to Loan API
    response = requests.post("http://127.0.0.1:8000/evaluate_loan", json=loan_payload)

    # Print API Response
    print("[INFO] Loan API Response:", response.json())

else:
    print("[ERROR] Could not extract necessary loan details.")
