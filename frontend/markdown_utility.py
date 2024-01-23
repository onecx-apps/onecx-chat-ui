import json

MD_HEADER = "# Troubleshooting Solutions"

# loading markdown template
try:
    with open("./resources/troubleshooting_template.md", 'r') as file:
        markdown_template = file.read()
except FileNotFoundError as e:
    print(f"File not found: {e}")


def markdown_link(text, url) -> str:
    """
    Generates a Markdown hyperlink.
    Args:
        text (str): The anchor text.
        url (str): The URL to link to.
    """
    return f"[{text}]({url})"


def markdown_list(items: list, numbered=False) -> str:
    """
    Converts a list of items to a Markdown-formatted list.
    Args:
        items (list): List of items to be converted to a Markdown list.
        numbered (bool): Whether to display the list as numbered.
    """
    if numbered:
        list_str = "\n".join([f"1. {item}" for item in items])
    else:
        list_str = "\n".join([f"- {item}" for item in items])
    return list_str


def markdown_image(image_url, alt_text="Image"):
    """
    Embeds an image into Markdown content.
    Args:
      image_url (str): The URL or path to the image.
      alt_text (str): The alternative text for the image.
    """
    return f"![{alt_text}]({image_url})"


def convert_json_to_markdown_list(response_str: str) -> list:
    """
    Converts a JSON response to a Markdown list of solutions.
    Args:
        response_str (str): The JSON response string.
    Returns:
        list: A list of Markdown formatted solutions.
    """
    try:
        response_dict = json.loads(response_str)[0]["solutions"]
    except ValueError:
        return [response_str]

    solution_list = []
    for index, solution in enumerate(response_dict):
        image_list = [markdown_image(image["image_url"], alt_text=f"Image {i+1}")
                      for i, image in enumerate(solution["images"])]
        images_markdown = markdown_list(image_list, numbered=True)
        url_markdown = markdown_link("Read more", solution["url"])
        solution_markdown = markdown_template.format(
            index + 1, solution["headline"], solution["summary"],
            images_markdown, url_markdown)
        solution_list.append(solution_markdown)

    return solution_list
