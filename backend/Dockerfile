# Use an official Python image
FROM python:3.8-slim

# Set the working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose port 5000 and run the Flask app
EXPOSE 5000
CMD ["python", "app.py"]
