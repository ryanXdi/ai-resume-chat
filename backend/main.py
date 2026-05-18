from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq
import pypdf
import io
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

resume_text = ""

@app.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    global resume_text
    contents = await file.read()
    pdf_reader = pypdf.PdfReader(io.BytesIO(contents))
    resume_text = ""
    for page in pdf_reader.pages:
        resume_text += page.extract_text()
    return {"message": "Resume uploaded successfully"}

@app.post("/chat")
async def chat(data: dict):
    question = data.get("question")
    prompt = f"""
    You are a helpful assistant that answers questions based on the following resume:

    {resume_text}

    Question: {question}
    """
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )
    return {"answer": response.choices[0].message.content}