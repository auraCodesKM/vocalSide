# Voice Analysis Application

This application analyzes voice recordings to detect potential voice pathologies. It consists of a Next.js frontend and a Flask backend with a TensorFlow machine learning model.

## Project Structure

The project is organized into two main directories:

- `frontend/`: Contains the Next.js frontend application
- `backend/`: Contains the Flask backend application and machine learning model

## Setup and Installation

### Quick Start

You can use the provided shell script to start both the frontend and backend servers:

```
chmod +x start.sh  # Make the script executable (if not already)
./start.sh
```

This will start both servers and you can access the application at http://localhost:3000.

### Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```
   python3.10 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```
   python app.py
   ```
   The backend server will run on http://localhost:8080

#### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install the required dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   The frontend application will run on http://localhost:3000

## Usage

1. Open your browser and navigate to http://localhost:3000
2. Upload a .wav file or record your voice using the recording feature
3. Click "Analyze" to process the audio
4. View the results, including the prediction, visualization, and detailed report

## Features

- Voice recording and file upload
- Voice pathology detection (Healthy, Laryngitis, Vocal Polyp)
- Detailed PDF report generation with acoustic measurements
- Visualizations of voice characteristics

## Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Flask, Python
- **Machine Learning**: TensorFlow, Librosa
- **Visualization**: Matplotlib
- **Report Generation**: ReportLab
