"""The main gui."""
import streamlit as st
from loguru import logger
import requests
import os
import dotenv

dotenv.load_dotenv()

# Constants
PDF_FILE_TYPE = "pdf"
META_DATA_HEIGHT = 500
EXPLANATION_HEIGHT = 300

CHAT_URL = os.getenv("CHAT_URL")
CHAT_PORT = os.getenv("CHAT_PORT")

logger.info("Starting Application.")

# Set small icon in the tab bar
st.set_page_config(page_title="Chatbot", page_icon=":mag:", layout="wide")

# Create title
st.title("💬 OneCX Chatbot")

def upload_files(uploaded_files):
    if len(uploaded_files) == 0:
        return "No file submitted!"
    files = []
    for file in uploaded_files:
        file_tuple = ("documents", (file.name, file.getvalue(), file.type))
        files.append(file_tuple)

    try:
        with st.spinner(text="Upload in progess..."):
            response = requests.post("http://" + CHAT_URL + ":" + CHAT_PORT + "/document/uploadMultiple/0", files=files)
            response.raise_for_status()
            st.toast(response.json())
        return "File upload successful!"
    except Exception as e:
        logger.error(e)
        return e
    
if "messages" not in st.session_state:
    st.session_state["messages"] = [{"role": "assistant", "content": "Wie kann ich dir helfen?"}]

for msg in st.session_state.messages:
    #if len(st.session_state.messages) == 1:
    st.chat_message(msg["role"]).write(msg["content"])

if prompt := st.chat_input():
    st.session_state.messages.append({"role": "user", "content": prompt})
    st.chat_message("user").write(prompt)
    #send request
    #
    #check response 
    msg = "BOT RESPONSE"
    st.session_state.messages.append({"role": "assistant", "content": msg})
    st.chat_message("assistant").write(msg)
    
with st.sidebar:
    st.subheader("Expend the bots knowledge with your pdfs:")
    # # Upload PDF files
    with st.form ("Upload Form", clear_on_submit=True):
        uploaded_files = st.file_uploader("Upload PDF Files", type=PDF_FILE_TYPE, accept_multiple_files=True)
        for file in uploaded_files:
            bytes_data = file.read()

        submitted = st.form_submit_button("Upload")
        if submitted:
            logger.info("Started Upload")
            st.toast(upload_files(uploaded_files=uploaded_files), icon="🚨")
