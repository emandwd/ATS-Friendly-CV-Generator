# app.py - Main Flask API Server
from flask import Flask, request, jsonify, send_file, after_this_request, send_from_directory
from flask_cors import CORS
import json
import os
import sys
import tempfile
import shutil
from datetime import datetime
from backend_1 import CVProcessor
from cv_generator import CVGenerator

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = Flask(__name__)
CORS(app, expose_headers=["Content-Disposition"])  # Allow frontend requests

# Configuration
UPLOAD_FOLDER = 'temp_uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def clean_temp_files(file_paths):
    """Clean up temporary files"""
    for file_path in file_paths:
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except:
                pass

@app.route('/api/process-cv', methods=['POST'])
def process_cv():
    """Main endpoint to process CV data"""
    temp_files_to_clean = []
    
    try:
        # Get JSON data from frontend
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Generate unique session ID
        session_id = datetime.now().strftime("%Y%m%d_%H%M%S_") + str(hash(str(data)))[:8]
        
        # Create temporary files for this session
        temp_json1 = os.path.join(UPLOAD_FOLDER, f'{session_id}_input.json')
        temp_json2 = os.path.join(UPLOAD_FOLDER, f'{session_id}_structured.json')
        temp_docx = os.path.join(UPLOAD_FOLDER, f'{session_id}_cv.docx')
        
        temp_files_to_clean.extend([temp_json1, temp_json2, temp_docx])
        
        # 1. Save input to first JSON file
        with open(temp_json1, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        # 2. Process with OpenAI
        api_key = os.environ.get('OPENAI_API_KEY')
        
        processor = CVProcessor(
            input_file=temp_json1,
            output_file=temp_json2,
            api_key=api_key,
            system_prompt_file="system_prompt.txt"
        )
        
        # Run processor
        processor.run()
        
        # 3. Generate CV DOCX
        generator = CVGenerator()
        cv_path = generator.generate_cv(temp_json2)
        
        # Copy the generated file to our temp location
        shutil.copy(cv_path, temp_docx)
        
        # 4. Clean up original temp file from cv_generator
        if os.path.exists(cv_path):
            os.remove(cv_path)
        
        # 5. Clean JSON files
        processor.wipe_json_file(temp_json1)
        processor.wipe_json_file(temp_json2)
        
        @after_this_request
        def cleanup(response):
            """Clean up temporary files after sending response"""
            try:
                clean_temp_files(temp_files_to_clean)
            except:
                pass
            return response
        
        # 6. Send the DOCX file
        user_name = data.get('full_name', 'Enhanced')
        
        safe_name = "".join([c for c in user_name if c.isalnum() or c in " -_"]).strip()
        safe_name = safe_name.replace(" ", "_")
        
        if not safe_name:
            safe_name = "Enhanced"

        return send_file(
            temp_docx,
            as_attachment=True,
            download_name=f'Enhanced_CV_{session_id}.docx',
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
        
    except Exception as e:
        # Clean up on error
        clean_temp_files(temp_files_to_clean)
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'CV Builder API'})

@app.route('/')
def serve_index():
    return send_file('index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
