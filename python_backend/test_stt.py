from google.cloud import speech
import os
import json
from dotenv import load_dotenv

def test_speech_to_text(audio_file_path):
    """Test Google Speech-to-Text with a local audio file"""
    
    # Load environment variables
    load_dotenv()
    
    # Set up credentials
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("STT_API_KEY")
    
    # Initialize client
    client = speech.SpeechClient()
    
    print("Reading audio file...")
    with open(audio_file_path, "rb") as audio_file:
        content = audio_file.read()
    
    # Configure audio and recognition settings
    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.MP3,  
        sample_rate_hertz=16000,
        language_code="hi-IN",  # Primary language (Hindi)
        alternative_language_codes=["hi-IN", "gu-IN", "mr-IN", "kn-IN", "ta-IN"],  # Other languages
        enable_automatic_punctuation=True,
        model="latest_long"
    )

    print("Sending request to Google STT...")
    try:
        # Perform the transcription
        response = client.recognize(config=config, audio=audio)
        
        # Collect results in a dictionary
        transcription_results = []
        for i, result in enumerate(response.results, 1):
            transcript = result.alternatives[0]
            result_data = {
                "result_number": i,
                "transcript": transcript.transcript,
                "confidence": f"{transcript.confidence:.2%}"
            }
            transcription_results.append(result_data)
        
        # Save the results to a JSON file
        output_file = "src/transcription_results.json"
        with open(output_file, "w") as json_file:
            json.dump(transcription_results, json_file, indent=4)
        
        print(f"\nTranscription results saved to {output_file}")
    
    except Exception as e:
        print(f"Error during transcription: {str(e)}")

if __name__ == "__main__":
    # Replace with path to your test audio file
    TEST_AUDIO_FILE = os.path.abspath("test_voice/recording.mp3")
    print(TEST_AUDIO_FILE)

    if os.path.exists(TEST_AUDIO_FILE):
        test_speech_to_text(TEST_AUDIO_FILE)
    else:
        print(f"Error: Audio file not found at {TEST_AUDIO_FILE}")
