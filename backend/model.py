import tensorflow as tf
import numpy as np
from tensorflow.keras.models import load_model
import librosa
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from tensorflow.keras.layers import (
    Dense, Dropout, BatchNormalization, Conv2D, 
    MaxPooling2D, Flatten, Input
)
from tensorflow.keras.models import Model
import io
import traceback
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, 
    Spacer, Image, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import os
import time
from datetime import datetime

# Constants
MODEL_PATH = "./lsm_model3"
CLINICAL_THRESHOLDS = {
    'jitter': {'normal': {'max': 1.04}},
    'shimmer': {'normal': {'max': 3.81}},
    'hnr': {'normal': {'min': 20.0}}
}

# Load model
try:
    base_model = load_model(MODEL_PATH)
except Exception as e:
    print(f"Error loading model: {str(e)}")
    base_model = None

label_mapping = {
    0: "Healthy",
    1: "Laryngitis",
    2: "Vocal Polyp"
}

def extract_audio_features(file_path, max_length=128):
    """Extract comprehensive audio features"""
    try:
        # Load and preprocess audio
        y, sr = librosa.load(file_path, sr=22050, duration=5.0)
        y = librosa.util.normalize(y)
        
        # Basic features for model input
        mel_spec = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128)
        mel_spec_db = librosa.power_to_db(mel_spec, ref=np.max)
        
        # Ensure exact size of 128x128 for model input
        if mel_spec_db.shape[1] > max_length:
            mel_spec_db = mel_spec_db[:, :max_length]
        else:
            pad_width = max_length - mel_spec_db.shape[1]
            mel_spec_db = np.pad(mel_spec_db, ((0, 0), (0, pad_width)))
        
        # Normalize for model input
        mel_spec_db = (mel_spec_db - np.min(mel_spec_db)) / (np.max(mel_spec_db) - np.min(mel_spec_db))
        
        # Additional features for analysis
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        
        # Calculate Jitter
        f0, voiced_flag, voiced_probs = librosa.pyin(y, fmin=librosa.note_to_hz('C2'), 
                                                    fmax=librosa.note_to_hz('C7'))
        f0 = f0[~np.isnan(f0)]
        jitter = np.mean(np.abs(np.diff(f0))) / np.mean(f0) * 100 if len(f0) > 1 else 0
        
        # Calculate Shimmer
        rms = librosa.feature.rms(y=y)[0]
        shimmer = np.mean(np.abs(np.diff(rms))) / np.mean(rms) * 100
        
        # Calculate HNR
        hnr = np.mean(librosa.effects.harmonic(y)) / np.mean(librosa.effects.percussive(y))
        
        # Formant Analysis
        frame_length = 2048
        hop_length = 512
        pre_emphasis = 0.97
        y_pre = np.append(y[0], y[1:] - pre_emphasis * y[:-1])
        
        formants = []
        for frame in librosa.util.frame(y_pre, frame_length=frame_length, hop_length=hop_length):
            if len(frame) == frame_length:
                lpc = librosa.lpc(frame, order=8)
                roots = np.roots(lpc)
                roots = roots[np.imag(roots) >= 0]
                angles = np.arctan2(np.imag(roots), np.real(roots))
                freqs = angles * sr / (2 * np.pi)
                formants.append(sorted(freqs))
        
        formants = np.mean(formants, axis=0) if formants else np.zeros(3)
        
        # Calculate additional metrics
        f0_clean = f0[~np.isnan(f0)]
        f0_mean = np.mean(f0_clean) if len(f0_clean) > 0 else 0
        f0_std = np.std(f0_clean) if len(f0_clean) > 0 else 0
        
        # Voice period
        voice_period = 1.0 / f0_mean if f0_mean > 0 else 0
        
        # Voiced ratio
        voiced_ratio = np.mean(voiced_flag) if len(voiced_flag) > 0 else 0
        
        # Return both model input and analysis features
        model_input = mel_spec_db.reshape(1, 128, 128, 1)  # Shaped for model input
        
        analysis_features = {
            'waveform': y,
            'sr': sr,
            'mel_spectrogram': mel_spec,
            'mfccs': mfccs,
            'f0_mean': f0_mean,
            'f0_std': f0_std,
            'jitter': jitter,
            'shimmer': shimmer,
            'hnr': hnr,
            'voice_period': voice_period,
            'voiced_ratio': voiced_ratio,
            'formants': formants
        }
        
        return model_input, analysis_features
        
    except Exception as e:
        print(f"Error in feature extraction: {str(e)}")
        traceback.print_exc()
        return None, None

def generate_report(prediction_result, features):
    """Generate comprehensive PDF report with analysis results"""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch)
    styles = getSampleStyleSheet()
    elements = []
    
    # Custom styles
    styles.add(ParagraphStyle(
        name='SectionHeader',
        parent=styles['Heading1'],
        fontSize=14,
        spaceBefore=15,
        spaceAfter=10,
        backColor=colors.HexColor('#E8F5E9'),
        textColor=colors.HexColor('#000000')
    ))
    
    styles.add(ParagraphStyle(
        name='Disclaimer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.HexColor('#666666'),
        alignment=1,
        spaceBefore=30
    ))
    
    # First Page - Header with Logo
    # Create a table for the header
    logo_path = "assets/vocalwell_logo.png"  # Updated path
    if os.path.exists(logo_path):
        img = Image(logo_path, width=1.5*inch, height=0.75*inch)
        header_data = [[img, Paragraph("VOICE PATHOLOGY MEDICAL REPORT", 
            ParagraphStyle('Title', parent=styles['Title'], 
                         fontSize=20, 
                         alignment=1,  # Center alignment
                         textColor=colors.HexColor('#2C3E50')))]]
        header_table = Table(header_data, colWidths=[2*inch, 4*inch])
        header_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LEFTPADDING', (0, 0), (-1, -1), 20),
            ('RIGHTPADDING', (0, 0), (-1, -1), 20),
        ]))
        elements.append(header_table)
    else:
        print(f"Warning: Logo file not found at {logo_path}")
        elements.append(Paragraph("VOICE PATHOLOGY MEDICAL REPORT", 
            ParagraphStyle('Title', parent=styles['Title'], 
                         fontSize=20, 
                         spaceAfter=20,
                         alignment=1,
                         textColor=colors.HexColor('#2C3E50'))))
    
    elements.append(Spacer(1, 20))
    
    # Medical Report Title
    elements.append(Paragraph("Patient Information", styles['SectionHeader']))
    elements.append(Paragraph(
        f"Analysis Date: {datetime.now().strftime('%Y-%m-%d')}<br/>"
        f"Predicted Condition: {prediction_result['predicted_class']} "
        f"({prediction_result['confidence']:.2f}%)",
        styles['Normal']
    ))
    elements.append(Spacer(1, 20))
    
    # Acoustic Measurements Section with green background
    elements.append(Paragraph("Acoustic Measurements", styles['SectionHeader']))
    metrics_data = [
        ['Parameter', 'Value', 'Normal Range', 'Unit'],
        ['Fundamental Frequency (Mean)', f"{features['f0_mean']:.2f}", '85-255', 'Hz'],
        ['Fundamental Frequency (Std)', f"{features['f0_std']:.2f}", '0-20', 'Hz'],
        ['Jitter', f"{features['jitter']:.2f}", '0-2.2', '%'],
        ['Shimmer', f"{features['shimmer']:.2f}", '0-3.81', '%'],
        ['Harmonic Ratio', f"{features['hnr']:.3f}", '0.15-0.25', ''],
        ['Voice Period', f"{features['voice_period']:.4f}", '0.003-0.005', 's'],
        ['Voiced Segments Ratio', f"{features['voiced_ratio']:.2f}", '0.4-0.8', ''],
        ['Formant Frequency', f"{features['formants'][0]:.2f}", '500-2000', 'Hz']
    ]
    
    table = Table(metrics_data, colWidths=[180, 100, 120, 60])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#E8F5E9')),  # Green header
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8F8F8')])
    ]))
    elements.append(table)
    elements.append(Spacer(1, 20))
    
    # Detailed Analysis with improved summary
    elements.append(Paragraph("Detailed Analysis", styles['SectionHeader']))
    summary_text = generate_detailed_summary(prediction_result, features)
    elements.append(Paragraph(summary_text, styles['Normal']))
    
    # Page break for second page
    elements.append(PageBreak())
    
    # Second Page - Voice Waveform and Spectrogram
    elements.append(Paragraph("Voice Analysis Visualizations", styles['SectionHeader']))
    
    # 1. Waveform
    elements.append(Paragraph("1. Voice Waveform", styles['Heading2']))
    plt.figure(figsize=(10, 3))
    time_axis = np.arange(len(features['waveform'])) / features['sr']
    plt.plot(time_axis, features['waveform'], color='#3498db', linewidth=0.5)
    plt.title('Temporal Waveform Pattern')
    plt.xlabel('Time (seconds)')
    plt.ylabel('Amplitude')
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    img_buffer = io.BytesIO()
    plt.savefig(img_buffer, format='png', dpi=300, bbox_inches='tight')
    plt.close()
    elements.append(Image(img_buffer, width=450, height=150))
    elements.append(Spacer(1, 20))
    
    # 2. Mel Spectrogram
    elements.append(Paragraph("2. Spectral Analysis", styles['Heading2']))
    plt.figure(figsize=(10, 4))
    librosa.display.specshow(
        librosa.power_to_db(features['mel_spectrogram'], ref=np.max),
        y_axis='mel',
        x_axis='time',
        sr=features['sr'],
        fmax=8000,
        cmap='magma'
    )
    plt.colorbar(format='%+2.0f dB', label='Intensity (dB)')
    plt.title('Mel-frequency Spectrogram')
    plt.tight_layout()
    img_buffer = io.BytesIO()
    plt.savefig(img_buffer, format='png', dpi=300, bbox_inches='tight')
    plt.close()
    elements.append(Image(img_buffer, width=450, height=200))
    
    # Page break for third page
    elements.append(PageBreak())
    
    # Third Page - MFCC and Formant Analysis
    elements.append(Paragraph("Advanced Voice Analysis", styles['SectionHeader']))
    
    # MFCC Analysis
    elements.append(Paragraph("1. MFCC Analysis", styles['Heading2']))
    plt.figure(figsize=(10, 4))
    librosa.display.specshow(
        features['mfccs'],
        x_axis='time',
        sr=features['sr'],
        cmap='viridis'
    )
    plt.colorbar(label='Magnitude (dB)')
    plt.title('Mel-frequency Cepstral Coefficients')
    plt.ylabel('MFCC Coefficients')
    plt.xlabel('Time (s)')
    plt.grid(True, alpha=0.3, linestyle='--')
    plt.tight_layout()
    img_buffer = io.BytesIO()
    plt.savefig(img_buffer, format='png', dpi=300, bbox_inches='tight')
    plt.close()
    elements.append(Image(img_buffer, width=450, height=200))
    
    # MFCC interpretation
    mfcc_text = """
    MFCC Analysis provides insights into the vocal tract configuration and voice quality:
    • Coefficients 1-4: Represent overall spectral shape and vocal tract resonances
    • Coefficients 5-8: Capture detailed spectral variations
    • Coefficients 9-13: Indicate fine harmonic structure and voice quality
    """
    elements.append(Paragraph(mfcc_text, styles['Normal']))
    elements.append(Spacer(1, 20))
    
    # Formant Analysis
    elements.append(Paragraph("2. Formant Analysis", styles['Heading2']))
    
    # Calculate formant statistics
    formant_freqs = features['formants'][:3]
    formant_names = ['F1', 'F2', 'F3']
    typical_ranges = {
        'F1': (300, 800),    # Male: 300-800 Hz
        'F2': (850, 2500),   # Male: 850-2500 Hz
        'F3': (2500, 3500)   # Male: 2500-3500 Hz
    }
    
    # Formant visualization
    plt.figure(figsize=(10, 4))
    bars = plt.bar(formant_names, formant_freqs, 
                  color=['#2196F3', '#4CAF50', '#FFC107'])
    
    # Add typical range markers
    for i, name in enumerate(formant_names):
        range_min, range_max = typical_ranges[name]
        plt.plot([i-0.2, i+0.2], [range_min, range_min], 'r--', alpha=0.5)
        plt.plot([i-0.2, i+0.2], [range_max, range_max], 'r--', alpha=0.5)
    
    plt.title('Formant Frequencies Analysis')
    plt.ylabel('Frequency (Hz)')
    plt.grid(True, alpha=0.3)
    
    # Add value labels on bars
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height,
                f'{height:.0f}Hz',
                ha='center', va='bottom')
    
    plt.tight_layout()
    img_buffer = io.BytesIO()
    plt.savefig(img_buffer, format='png', dpi=300, bbox_inches='tight')
    plt.close()
    elements.append(Image(img_buffer, width=450, height=200))
    
    # Add formant interpretation
    formant_text = f"""
    Formant Analysis Results:
    • First Formant (F1): {formant_freqs[0]:.0f} Hz - {get_formant_status(formant_freqs[0], typical_ranges['F1'])}
    • Second Formant (F2): {formant_freqs[1]:.0f} Hz - {get_formant_status(formant_freqs[1], typical_ranges['F2'])}
    • Third Formant (F3): {formant_freqs[2]:.0f} Hz - {get_formant_status(formant_freqs[2], typical_ranges['F3'])}
    
    Interpretation:
    • F1 relates to vowel height and jaw opening
    • F2 indicates tongue advancement and retraction
    • F3 reflects voice quality and resonance characteristics
    """
    elements.append(Paragraph(formant_text, styles['Normal']))
    
    # Add disclaimer at the bottom of the last page
    elements.append(Spacer(1, 30))
    disclaimer_text = (
        "DISCLAIMER: This report is generated by VocalWell's AI voice analysis system. "
        "This is an automated screening tool and should not replace professional medical advice. "
        "Please consult with a healthcare provider for proper diagnosis and treatment."
    )
    elements.append(Paragraph(disclaimer_text, styles['Disclaimer']))
    
    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    return buffer

def get_formant_status(value, range_tuple):
    """Helper function to determine if formant is within normal range"""
    min_val, max_val = range_tuple
    if min_val <= value <= max_val:
        return "Within normal range"
    elif value < min_val:
        return "Below normal range"
    else:
        return "Above normal range"

def generate_detailed_summary(prediction_result, features):
    """Generate detailed summary based on analysis results"""
    condition = prediction_result['predicted_class']
    confidence = prediction_result['confidence']
    
    if condition == "Healthy":
        return (
            "The acoustic and clinical analysis indicates normal voice characteristics. "
            "All measured parameters fall within typical ranges, suggesting healthy vocal function. "
            "No significant abnormalities were detected in fundamental frequency, jitter, "
            "shimmer, or harmonic ratios."
        )
    
    summaries = {
        "Laryngitis": (
            f"The acoustic and clinical analysis indicates a {confidence:.1f}% likelihood of laryngitis, "
            "characterized by inflammation of the laryngeal mucosa and associated voice quality changes. "
            "Key findings include elevated jitter and shimmer measures, reduced harmonic ratio, and a "
            "higher-than-normal fundamental frequency. These abnormalities are consistent with laryngeal "
            "inflammation and mucosal swelling, which typically result in hoarseness, vocal fatigue, "
            "and reduced vocal performance."
            "To treat laryngitis, rest your voice by speaking minimally and avoiding whispering, which "
            "can strain your vocal cords. Stay hydrated by drinking warm fluids like herbal tea or "
            "honey-infused water to soothe your throat. Use a humidifier or inhale steam to keep your vocal "
            "cords moist. Gargle with warm salt water to reduce irritation and clear mucus. Avoid spicy and "
            "acidic foods if acid reflux is a trigger. If caused by an infection, let it run its course "
            "while managing symptoms, but seek medical help if it lasts over two weeks."
        ),
        "Vocal Polyp": (
            f"The acoustic and clinical analysis suggests a {confidence:.1f}% probability of vocal polyp presence. "
            "The analysis reveals significant perturbations in voice quality parameters, particularly in "
            "frequency and amplitude stability measures. Notable findings include increased jitter and "
            "shimmer values, reduced harmonic-to-noise ratio, and irregular fundamental frequency patterns. "
            "These characteristics are typical of structural lesions affecting vocal fold vibration."
            "To prevent vocal polyps, stay hydrated, avoid yelling, and use proper singing techniques with "
            "breath support. Limit caffeine, alcohol, and smoking while protecting your voice from irritants "
            "like dust and pollution. Manage acid reflux by avoiding spicy or acidic foods before bed, and rest "
            "your voice when sick. If you use your voice heavily, take breaks and warm up properly to prevent strain."
        )
    }
    
    return summaries.get(condition, "Unable to generate detailed summary.")

def predict_with_interpretable_probabilities(audio_file_path):
    """Generate predictions with confidence scores and report"""
    try:
        # Extract features
        model_input, analysis_features = extract_audio_features(audio_file_path)
        if model_input is None:
            raise ValueError("Feature extraction failed")
            
        # Get predictions using the properly formatted input
        predictions = base_model.predict(model_input, verbose=0)
        predicted_class = np.argmax(predictions[0])
        
        # Calculate confidence scores
        confidence_scores = {
            label_mapping[i]: float(prob * 100)
            for i, prob in enumerate(predictions[0])
        }
        
        # Sort by confidence
        confidence_scores = dict(sorted(
            confidence_scores.items(),
            key=lambda x: x[1],
            reverse=True
        ))
        
        # Generate visualization
        timestamp = int(time.time())
        plt.figure(figsize=(10, 6))
        
        # Plot confidence scores
        labels = list(confidence_scores.keys())
        probs = list(confidence_scores.values())
        plt.bar(labels, probs, color=['#2ecc71', '#e74c3c', '#f1c40f'])
        plt.title('Prediction Confidence')
        plt.ylabel('Confidence (%)')
        plt.ylim(0, 100)
        
        # Save the plot
        plot_filename = f'analysis_plot_{timestamp}.png'
        plot_path = os.path.join('./plots', plot_filename)
        plt.savefig(plot_path, dpi=300, bbox_inches='tight')
        plt.close()
        
        # Prepare results for report
        prediction_result = {
            'predicted_class': label_mapping[predicted_class],
            'confidence': confidence_scores[label_mapping[predicted_class]],
            'all_probabilities': confidence_scores
        }
        
        # Generate PDF report
        pdf_buffer = generate_report(prediction_result, analysis_features)
        
        # Determine risk level
        confidence = confidence_scores[label_mapping[predicted_class]]
        risk_level = "high" if confidence > 80 else "moderate" if confidence > 60 else "low"
        
        return label_mapping[predicted_class], risk_level, pdf_buffer
        
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        traceback.print_exc()
        return None, None, None

def get_recommendation(prediction_result):
    """Generate basic recommendation based on prediction"""
    try:
        confidence = prediction_result['confidence']
        condition = prediction_result['predicted_class']
        
        if condition == "Healthy":
            return "Your voice appears healthy. Continue good vocal habits."
        
        severity = "high" if confidence > 80 else "moderate" if confidence > 60 else "low"
        
        return f"You show {severity} indicators ({confidence:.1f}%) of {condition}. Consider consulting a specialist."
        
    except Exception as e:
        print(f"Error generating recommendation: {str(e)}")
        return "Unable to generate recommendation"

