from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import pytesseract
from PIL import Image
import io
import base64
import wikipedia
import requests
import speech_recognition as sr
import pyttsx3
import datetime
import re
import webbrowser

app = Flask(__name__)
CORS(app)

@app.route('/api/ocr', methods=['POST'])
def process_image():
    """Process an image using OCR to extract text"""
    try:
       
        data = request.json
        image_data = data.get('image')
        
     
        return jsonify({
            'success': True,
            'text': 'Sample OCR extracted text. This would come from pytesseract in a real implementation.'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/wiki/search', methods=['GET'])
def search_wikipedia():
    """Search Wikipedia for the given query"""
    query = request.args.get('q', '')
    try:
        # Search Wikipedia
        search_results = wikipedia.search(query, results=5)
        results = []
        
        for title in search_results:
            try:
                # Get a summary for each result
                summary = wikipedia.summary(title, sentences=2)
                page = wikipedia.page(title)
                results.append({
                    'title': title,
                    'summary': summary,
                    'page_id': page.pageid,
                    'url': page.url
                })
            except:
                # Skip if there's an issue with a particular result
                continue
                
        return jsonify({'success': True, 'results': results})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/wiki/article', methods=['GET'])
def get_wikipedia_article():
    """Get a Wikipedia article by page ID"""
    page_id = request.args.get('id')
    try:
        # For mock purposes:
        return jsonify({
            'success': True,
            'content': 'This would be the actual article content from Wikipedia.'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/voice/process', methods=['POST'])
def process_voice_command():
    """Process a voice command"""
    data = request.json
    command = data.get('command', '').lower()
    
    # Simple command parsing
    if 'weather' in command:
        # In a real implementation, we'd call a weather API
        response = "It's currently 22°C with partly cloudy skies."
    elif 'time' in command:
        response = f"The current time is {datetime.datetime.now().strftime('%I:%M %p')}"
    elif 'open' in command:
        # Parse what to open
        match = re.search(r'open\s+(.*)', command)
        if match:
            app_name = match.group(1)
            response = f"Opening {app_name}"
            # In a real implementation, we'd have code to open applications
        else:
            response = "I'm not sure what you want me to open."
    else:
        response = "I'm not sure how to help with that."
        
    return jsonify({'success': True, 'response': response})

@app.route('/api/weather', methods=['GET'])
def get_weather():
    """Get weather information for a location"""
    location = request.args.get('location', 'New York')
    
    # In a real implementation, we'd call a weather API like OpenWeatherMap
    # For mock purposes:
    mock_data = {
        'location': location,
        'temperature': 22,
        'condition': 'Partly Cloudy',
        'humidity': 65,
        'wind_speed': 12,
        'forecast': [
            {'day': 'Today', 'min': 18, 'max': 24, 'condition': 'Partly Cloudy'},
            {'day': 'Tomorrow', 'min': 17, 'max': 23, 'condition': 'Sunny'},
            {'day': 'Wednesday', 'min': 16, 'max': 22, 'condition': 'Cloudy'}
        ]
    }
    
    return jsonify({'success': True, 'data': mock_data})

if __name__ == '__main__':
    app.run(debug=True, port=5000)