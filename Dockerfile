# Base image
FROM python:3.12-slim

#Working directory inside the container
WORKDIR /app

#Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

#Copy the rest of the backend
COPY . .

#FastAPI/uvicorn listens on 8000 inside the container
EXPOSE 8000

#Run the FastAPI app with uvicorn
CMD ["uvicorn", "server.app:app", "--host", "0.0.0.0", "--port", "8000"]
