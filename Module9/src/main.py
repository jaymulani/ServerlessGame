import json
from google.cloud import language_v1
from flask import jsonify, make_response, request
import boto3

# Function to extract specific types of tags using Google Cloud Natural Language API
def extract_tags(question):
    client = language_v1.LanguageServiceClient()
    document = language_v1.Document(content=question, type_=language_v1.Document.Type.PLAIN_TEXT)
    response = client.analyze_entities(request={'document': document})

    # Types of entities to extract as tags 
    desired_types = [
        language_v1.Entity.Type.PERSON,
        language_v1.Entity.Type.LOCATION,
        language_v1.Entity.Type.ORGANIZATION,
        language_v1.Entity.Type.EVENT,
        language_v1.Entity.Type.WORK_OF_ART,
        language_v1.Entity.Type.CONSUMER_GOOD,
    ]

    tags = []

    for entity in response.entities:
        if entity.type in desired_types:
            tags.append(entity.name)

    return tags

# Google Cloud Function entry point
def extractTags(request):
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)
        
    try:
        # Parse JSON data from HTTP request
        request_data = request.get_json()

        # Get the question from the request data
        question = request_data.get('question')

        if not question:
            return make_response(jsonify({'error': 'Question not provided in the request.'}), 400)

        # Call the extract_tags function to get the specific tags
        tags = extract_tags(question)

        response_data = {'tags': tags}
        response = jsonify(response_data)
        
        # Add CORS headers to the response
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        # Return the tags in the HTTP response
        return (response, 200, headers)

    except Exception as e:
        return make_response(jsonify({'error': str(e)}), 500)