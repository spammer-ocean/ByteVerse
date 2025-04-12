from fastapi import UploadFile
from io import BytesIO
from pypdf import PdfReader

async def extract_pdf_text(file:UploadFile)->str:
    pdf_bytes = await file.read()
    reader = PdfReader(BytesIO(pdf_bytes))
    text = "\n".join(page.extract_text() for page in reader.pages if page.extract_text())
    return text
