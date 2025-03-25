FROM python:3.10-slim

WORKDIR /app

# Copy requirements first to leverage Docker caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Make sure gunicorn is in requirements.txt or add it here
RUN pip install gunicorn

# Copy the rest of the application
COPY . .

# Create necessary directories
RUN mkdir -p ./temp ./plots ./reports ./data

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"] 