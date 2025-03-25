from flask import Flask, render_template, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import os
import pandas as pd
import numpy as np
from model import *
import matplotlib
matplotlib.use('Agg')  # Use a non-GUI backend
import matplotlib.pyplot as plt
import time
import librosa
import json
from datetime import datetime

app = Flask(__name__)
# Configure CORS to allow requests from your frontend domain
CORS(app, resources={r"/*": {"origins": ["https://your-frontend-domain.com", "https://your-vercel-app-url.vercel.app", "http://localhost:3000"]}})

# Create necessary directories
os.makedirs('./temp', exist_ok=True)
os.makedirs('./plots', exist_ok=True)
os.makedirs('./reports', exist_ok=True)
os.makedirs('./data', exist_ok=True)

@app.route('/audio', methods=['POST', 'GET'])
def audio():
    if request.method == 'POST':
        try:
            if 'audio' not in request.files:
                return jsonify({"error": "No audio file in request"}), 400
                
            audio_file = request.files['audio']
            if audio_file.filename == '':
                return jsonify({"error": "No file selected"}), 400
            
            # Save uploaded file
            timestamp = int(time.time())
            temp_path = os.path.join('./temp', f'temp_{timestamp}.wav')
            audio_file.save(temp_path)
            
            try:
                # Process audio and get prediction
                predicted_class_label, risk_level, pdf_buffer = predict_with_interpretable_probabilities(temp_path)
                
                if predicted_class_label is None:
                    raise ValueError("Prediction failed")
                
                # Save PDF report
                report_filename = f'voice_analysis_report_{timestamp}.pdf'
                report_path = os.path.join('./reports', report_filename)
                with open(report_path, 'wb') as f:
                    f.write(pdf_buffer.getvalue())
                
                # Create response
                result = {
                    "Prediction": f"Your voice shows {risk_level} indication of {predicted_class_label}" 
                                if predicted_class_label != "Healthy" 
                                else "Your voice appears to be healthy",
                    "PlotPath": f'analysis_plot_{timestamp}.png',
                    "ReportPath": report_filename,
                    "Class": predicted_class_label,
                    "RiskLevel": risk_level
                }
                
                return jsonify(result)
                
            except Exception as e:
                print(f"Processing error: {str(e)}")
                return jsonify({"error": f"Could not process audio file: {str(e)}"}), 400
            finally:
                # Cleanup
                if os.path.exists(temp_path):
                    os.remove(temp_path)
                
        except Exception as e:
            print(f"Server error: {str(e)}")
            return jsonify({"error": f"Server error: {str(e)}"}), 500
            
    return jsonify({"error": "Method not allowed"}), 405

@app.route('/report/<path:report_path>', methods=['GET'])
def get_report(report_path):
    try:
        report_file = os.path.join('./reports', report_path)
        if not os.path.exists(report_file):
            return jsonify({"error": "Report not found"}), 404
            
        # Check if download is requested
        download = request.args.get('download', 'false').lower() == 'true'
        
        if download:
            return send_file(
                report_file,
                mimetype='application/pdf',
                as_attachment=True,
                download_name='voice_analysis_report.pdf'
            )
        else:
            # For viewing in browser
            return send_file(
                report_file,
                mimetype='application/pdf',
                as_attachment=False
            )
            
    except Exception as e:
        return jsonify({"error": f"Error retrieving report: {str(e)}"}), 500

@app.route('/plot/<path:plot_path>', methods=['GET'])
def plot(plot_path):
    try:
        # Ensure the plot path is within the plots directory
        plot_file = os.path.join('./plots', plot_path)
        if os.path.exists(plot_file):
            return send_file(plot_file, mimetype='image/png')
        else:
            return jsonify({"error": "Plot not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Error retrieving plot: {str(e)}"}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

# Add CORS headers
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST')
    return response

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)