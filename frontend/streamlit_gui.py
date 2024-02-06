"""The main gui."""
import streamlit as st
from loguru import logger
import requests
import os
import dotenv

import utility.markdown_utility as md
import utility.frontend_utility as ui

dotenv.load_dotenv()

CHAT_URL = os.getenv("CHAT_URL")
CHAT_PORT = os.getenv("CHAT_PORT")

# Constants
PDF_FILE_TYPE = "pdf"
META_DATA_HEIGHT = 500
EXPLANATION_HEIGHT = 300
ASSISTANT_AVATAR = ui.load_custom_avatar("assistant_avatar.png")

logger.info("Starting Application.")

# Set small icon in the tab bar
st.set_page_config(page_title="Chatbot",
                   page_icon="./resources/favicon.ico", layout="wide")

# Create title
st.title("💬 OneCX Chatbot")

# loading UI from html file
ui.load_ui_from_html()


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

        response = requests.post(url=f"http://{CHAT_URL}:{CHAT_PORT}/chat",
                                 json=body)
        response.raise_for_status()
        response_json = response.json()

        return True, md.convert_json_to_markdown_list(response_json["message"])
    except Exception as e:
        return False, e


if "messages" not in st.session_state:
    st.session_state["messages"] = [{"role": "assistant",
                                     "content": "Wie kann ich dir helfen?"}]

for msg in st.session_state.messages:
    if msg["role"] == "assistant":
        st.chat_message(msg["role"], avatar=ASSISTANT_AVATAR).markdown(
            msg["content"])
    else:
        st.chat_message(msg["role"]).markdown(msg["content"])

if prompt := st.chat_input("Ihre Nachricht"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    st.chat_message("user").write(prompt)

# Generate a new response if last message is not from assistant
if st.session_state.messages[-1]["role"] != "assistant":
    with st.chat_message("assistant", avatar=ASSISTANT_AVATAR):
        with st.spinner("Tippe..."):
            # send request
            http_success, response_list = send_chat(prompt)
            ui.display_response(success_flag=http_success,
                                responses=response_list)
