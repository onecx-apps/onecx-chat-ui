"""The main gui."""
import streamlit as st
from loguru import logger
import requests
import os
import dotenv

dotenv.load_dotenv()

CHAT_URL = os.getenv("CHAT_URL")
CHAT_PORT = os.getenv("CHAT_PORT")

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
    
def get_conversation_id(conv_type = "Q_AND_A", return_sys_message = False):
    if "conversation_id" in st.session_state:
        return st.session_state.conversation_id
    
    body = {"conversation_type": conv_type}
    
    response = requests.post(url="http://" + CHAT_URL + ":" + CHAT_PORT + "/startConversation", json=body)
    response.raise_for_status()
    response_json = response.json()
    st.session_state.conversation_id = response_json["conversationId"]
    logger.info(f"Started conversation: {st.session_state.conversation_id}")
    
    if return_sys_message:
        return st.session_state.conversation_id, response_json["history"][0]["message"]
    return st.session_state.conversation_id

def send_chat(message):
    try:
        conversation_id = get_conversation_id()
        
        body = {
                "chat_message": {
                    "conversationId": conversation_id,
                    "correlationId": "StreamlitUI",
                    "message": message,
                    "type": "user",
                    "creationDate": 0
                }
        }
        
        response = requests.post(url="http://" + CHAT_URL + ":" + CHAT_PORT + "/chat", json=body)    
        response.raise_for_status()
        response_json = response.json()
        
        return True, response_json["message"]
    except Exception as e:
        return False, e
    
if "messages" not in st.session_state:
    try:
        conversation_id, first_message = get_conversation_id(return_sys_message=True)
        st.session_state["messages"] = [{"role": "assistant", "content": first_message}]
    except:
        st.session_state["messages"] = [{"role": "assistant", "content": "Wie kann ich dir helfen?"}]

for msg in st.session_state.messages:
    #if len(st.session_state.messages) == 1:
    st.chat_message(msg["role"]).write(msg["content"])

if prompt := st.chat_input():
    st.session_state.messages.append({"role": "user", "content": prompt})
    st.chat_message("user").write(prompt)
    #send request
    success, response = send_chat(prompt)
    
    #check response 
    st.session_state.messages.append({"role": "assistant", "content": response})
    if success:
        st.chat_message("assistant").write(response)
    else:
        st.chat_message("assistant").error(response)
    
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