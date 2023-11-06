"""The main gui."""
import streamlit as st
from loguru import logger

# Constants
PDF_FILE_TYPE = "pdf"
META_DATA_HEIGHT = 500
EXPLANATION_HEIGHT = 300


logger.info("Starting Application.")

# Set small icon in the tab bar
st.set_page_config(page_title="Chatbot", page_icon=":mag:", layout="wide")

# Create title
st.title("💬 OneCX Chatbot")

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