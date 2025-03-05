import streamlit as st
import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Constants
API_BASE_URL = "http://localhost:8081"

def init_session_state():
    """Initialize session state variables"""
    if 'messages' not in st.session_state:
        st.session_state.messages = []
    if 'chat_id' not in st.session_state:
        st.session_state.chat_id = None
    if 'logged_in' not in st.session_state:
        st.session_state.logged_in = False
    if 'token' not in st.session_state:
        st.session_state.token = None

def signup():
    """Handle user signup"""
    st.title("Sign Up")
    with st.form("signup_form"):
        email = st.text_input("Email")
        password = st.text_input("Password", type="password")
        submit = st.form_submit_button("Sign Up")
        
        if submit:
            try:
                response = requests.post(
                    f"{API_BASE_URL}/auth/signup",
                    json={"email": email, "password": password}
                )
                if response.status_code == 201:
                    st.success("Signup successful! You can now log in.")
                elif response.status_code == 409:
                    st.error("User already exists.")
                else:
                    st.error("Signup failed. Please try again.")
            except Exception as e:
                st.error(f"Connection error: {str(e)}")

def login():
    """Handle user authentication"""
    st.title("Login")
    with st.form("login_form"):
        email = st.text_input("Email")
        password = st.text_input("Password", type="password")
        submit = st.form_submit_button("Login")
        
        if submit:
            try:
                response = requests.post(
                    f"{API_BASE_URL}/auth/login",
                    json={"email": email, "password": password}
                )
                if response.status_code == 200:
                    data = response.json()
                    st.session_state.token = data['access_token']
                    st.session_state.logged_in = True
                    st.success("Login successful! YAYAY")
                    st.rerun()
                else:
                    st.error("Login failed. Please check your credentials.")
            except Exception as e:
                st.error(f"Connection error: {str(e)}")

def process_text_input(user_input, chat_id, token):
    """Handle text message processing"""
    headers = {'Authorization': f'Bearer {token}'}
    try:
        response = requests.post(
            f"{API_BASE_URL}/chat",
            headers=headers,
            json={
                "chat_id": chat_id,
                "message": user_input
            }
        )
        if response.status_code == 200:
            return response.json()
        return None
    except Exception as e:
        st.error(f"Error processing message: {str(e)}")
        return None

def process_audio_input(audio_file, chat_id, token):
    """Handle audio file processing"""
    headers = {'Authorization': f'Bearer {token}'}
    try:
        files = {'audio': audio_file}
        data = {'chat_id': chat_id}
        
        response = requests.post(
            f"{API_BASE_URL}/voice",
            headers=headers,
            files=files,
            data=data
        )
        
        if response.status_code == 200:
            return response.json()
        return None
    except Exception as e:
        st.error(f"Error processing audio: {str(e)}")
        return None

def chat_interface():
    """Main chat interface"""
    st.title("Real Estate Assistant")
    
    # Initialize chat if needed
    if not st.session_state.chat_id:
        headers = {'Authorization': f'Bearer {st.session_state.token}'}
        response = requests.post(f"{API_BASE_URL}/start_chat", headers=headers)
        if response.status_code == 200:
            st.session_state.chat_id = response.json()['chat_id']
    
    # Chat container for scrollable history
    chat_container = st.container()
    
    # Display chat history
    with chat_container:
        for msg in st.session_state.messages:
            with st.chat_message(msg["role"]):
                st.write(msg["content"])
    
    # Text input
    if prompt := st.chat_input("Type your message here..."):
        # Add user message to chat
        with st.chat_message("user"):
            st.write(prompt)
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        # Get AI response
        response_data = process_text_input(prompt, st.session_state.chat_id, st.session_state.token)
        if response_data:
            with st.chat_message("assistant"):
                st.write(response_data["response"])
            st.session_state.messages.append({"role": "assistant", "content": response_data["response"]})

    # Audio input
    st.write("---")
    audio_file = st.file_uploader("Or upload an audio file", type=['wav', 'mp3'])
    if audio_file:
        with st.spinner("Processing audio..."):
            response_data = process_audio_input(audio_file, st.session_state.chat_id, st.session_state.token)
            if response_data:
                # Show transcription
                with st.chat_message("user"):
                    st.write(f"🎤 {response_data['transcription']}")
                st.session_state.messages.append({"role": "user", "content": response_data['transcription']})
                
                # Show AI response
                with st.chat_message("assistant"):
                    st.write(response_data["response"])
                st.session_state.messages.append({"role": "assistant", "content": response_data["response"]})

    # Additional features
    with st.sidebar:
        st.write("Actions")
        if st.button("Get Conversation Summary"):
            headers = {'Authorization': f'Bearer {st.session_state.token}'}
            response = requests.post(
                f"{API_BASE_URL}/summarize_conversation",
                headers=headers,
                json={"chat_id": st.session_state.chat_id}
            )
            if response.status_code == 200:
                with st.expander("Conversation Summary"):
                    st.write(response.json()["summary"])

def main():
    init_session_state()
    
    if not st.session_state.logged_in:
        page = st.sidebar.selectbox("Select an option", ["Login", "Sign Up"])
        if page == "Sign Up":
            signup()
        else:
            login()
    else:
        if st.sidebar.button("Logout"):
            for key in st.session_state.keys():
                del st.session_state[key]
            st.rerun()
        else:
            chat_interface()

if __name__ == "__main__":
    main()