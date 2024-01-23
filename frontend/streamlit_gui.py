"""The main gui."""
import streamlit as st
from loguru import logger
import requests
import os
import dotenv

from frontend.markdown_utility import convert_json_to_markdown_list, MD_HEADER

dotenv.load_dotenv()

CHAT_URL = os.getenv("CHAT_URL")
CHAT_PORT = os.getenv("CHAT_PORT")

# Constants
PDF_FILE_TYPE = "pdf"
META_DATA_HEIGHT = 500
EXPLANATION_HEIGHT = 300

logger.info("Starting Application.")

# Set small icon in the tab bar
st.set_page_config(page_title="Chatbot", page_icon=":mag:", layout="wide")

# Create title
st.title("💬 OneCX Chatbot")


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
            "conversationId": conversation_id,
            "correlationId": "StreamlitUI",
            "message": message,
            "type": "user",
            "creationDate": 0
        }
        
        response = requests.post(url="http://" + CHAT_URL + ":" + CHAT_PORT + "/chat", json=body)    
        response.raise_for_status()
        response_json = response.json()

        return True, convert_json_to_markdown_list(response_json["message"])
    except Exception as e:
        return False, e


if "messages" not in st.session_state:
    st.session_state["messages"] = [{"role": "assistant",
                                     "content": "Wie kann ich dir helfen?"}]

for msg in st.session_state.messages:
    st.chat_message(msg["role"]).markdown(msg["content"])

if prompt := st.chat_input():
    st.session_state.messages.append({"role": "user", "content": prompt})
    st.chat_message("user").write(prompt)
    # send request
    success, response_list = send_chat(prompt)

    assistant_message = st.chat_message("assistant")
    if success:
        if "kein passender Eintrag" not in response_list[0]:
            assistant_message.markdown(MD_HEADER)
        for response in response_list:
            # check response
            st.session_state.messages.append(
                {"role": "assistant", "content": response})
            assistant_message.markdown(response)
    else:
        st.session_state.messages.append(
            {"role": "assistant", "content": response_list})
        assistant_message.error(response_list)
