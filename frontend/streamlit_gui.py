"""The main gui."""
import streamlit as st
from loguru import logger
import requests
import os
import dotenv

from markdown_utility import convert_json_to_markdown_list, MD_HEADER

dotenv.load_dotenv()

CHAT_URL = os.getenv("CHAT_URL")
CHAT_PORT = os.getenv("CHAT_PORT")

# Constants
PDF_FILE_TYPE = "pdf"
META_DATA_HEIGHT = 500
EXPLANATION_HEIGHT = 300
RESOURCES_DIR = "./resources/"

logger.info("Starting Application.")

# Set small icon in the tab bar
st.set_page_config(page_title="Chatbot",
                   page_icon=RESOURCES_DIR + "favicon.ico", layout="wide")

# loading UI from html file
try:
    with open(RESOURCES_DIR + "style.html", 'r') as file:
        html = file.read()
        st.write(html, unsafe_allow_html=True)
except FileNotFoundError as e:
    print(f"File not found: {e}")

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

        return True, convert_json_to_markdown_list(response_json["message"])
    except Exception as e:
        return False, e


def display_response(success_flag: bool, responses: list):
    placeholder = st.empty()
    if success_flag:
        markdown_response = ''
        # checks if entries are found
        entry_found = False if "kein passender Eintrag" in responses[0] else True
        if entry_found:
            markdown_response += MD_HEADER
            for response in response_list:
                markdown_response += response + "\n<br>"
                placeholder.markdown(markdown_response, unsafe_allow_html=True)
        else:
            markdown_response = responses[0]
            placeholder.warning(markdown_response)
        st.session_state.messages.append(
            {"role": "assistant", "content": markdown_response})
        # replace new line with HTML tag
        # response = full_response.replace('\n\n', '\n<br>')
    else:
        st.session_state.messages.append(
            {"role": "assistant", "content": responses})
        placeholder.exception(responses)


if "messages" not in st.session_state:
    st.session_state["messages"] = [{"role": "assistant",
                                     "content": "Wie kann ich dir helfen?"}]

for msg in st.session_state.messages:
    st.chat_message(msg["role"]).markdown(msg["content"])

if prompt := st.chat_input("Ihre Nachricht"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    st.chat_message("user").write(prompt)

# Generate a new response if last message is not from assistant
if st.session_state.messages[-1]["role"] != "assistant":
    with st.chat_message("assistant"):
        with st.spinner("Denken...", ):
            # send request
            http_success, response_list = send_chat(prompt)
            display_response(success_flag=http_success, responses=response_list)
