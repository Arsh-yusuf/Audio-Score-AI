FROM python:3.10-slim

# Install system dependencies (including ffmpeg and ffprobe)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set up a new user named "user" with UID 1000 (required by Hugging Face Spaces)
RUN useradd -m -u 1000 user
WORKDIR /code

# Copy requirements and install dependencies
COPY requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the rest of the application code
COPY --chown=user . /code

# Create temporary upload/processing directories and set correct ownership
RUN mkdir -p /code/temp /code/uploads && chown -R user:user /code

# Switch to the non-root user
USER user

# Set environment variables
ENV PORT=7860
ENV TEMP_FOLDER=/code/temp
ENV UPLOAD_FOLDER=/code/uploads

# Expose the port Hugging Face listens on
EXPOSE 7860

# Start FastAPI application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
