"""
This file contains functions for building and updating interface elements.
"""
import streamlit as st
from PIL import Image

RESOURCES_DIR = "./resources/"


def display_response(success_flag: bool, responses: list):
    """
    Displays the given responses based on success flag.
    Args:
        success_flag: indicating whether the response is a success or error.
        responses: A list of strings containing the markdown responses to display.
    """
    placeholder = st.empty()
    if success_flag:
        # Join responses with line breaks
        markdown_response = "\n<br>".join(responses)
        placeholder.markdown(markdown_response, unsafe_allow_html=True)
        st.session_state.messages.append(
            {"role": "assistant", "content": "\n".join(responses)})
    else:
        st.session_state.messages.append(
            {"role": "assistant", "content": responses})
        placeholder.error(responses)


def load_ui_from_html():
    """Loads and displays the UI from the specified HTML file."""
    try:
        with open(RESOURCES_DIR + "style.html", 'r') as file:
            html = file.read()
        st.write(html, unsafe_allow_html=True)
    except FileNotFoundError as e:
        print(f"File not found: {e}")


def load_custom_avatar(filename: str) -> Image:
    """Loads a custom avatar image from the specified file.
    Args:
        filename: The name of the avatar image file.
    """
    avatar_file_path = RESOURCES_DIR + filename
    try:
        avatar = Image.open(avatar_file_path)
    except FileNotFoundError as e:
        print(f"Avatar image not found: {avatar_file_path} \n{e}")
        return None
    return avatar
