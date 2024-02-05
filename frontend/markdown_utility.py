import json


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
        list_str = "\n".join([f"{index+1}. {item}"
                              for index, item in enumerate(items)])
    else:
        list_str = "\n".join([f"- {item}" for item in items])
    return list_str


def markdown_image(image_url, alt_text="Image") -> str:
    """
    Embeds an image into Markdown content.
    Args:
      image_url (str): The URL or path to the image.
      alt_text (str): The alternative text for the image.
    """
    return f"![{alt_text}]({image_url})"


def markdown_row_grid(data) -> str:
    """
    Generate a Markdown row grid with given data list.
    Args:
     data (list): List representing the grid cells.
    """
    row_length = len(data)

    # Create the header row
    header_row = "|".join(f"Image {i+1}" for i in range(row_length))
    header_row = f"|{header_row}|"

    # Create the separator row
    separator = "|".join([":-:"] * row_length)
    separator = f"|{separator}|"

    # Create the data row
    row_str = "|".join(img for img in data)
    row_str = f"|{row_str}|"

    # Combine all parts to form the grid
    grid = "\n".join([header_row, separator, row_str])
    return grid


def convert_json_to_markdown_list(response_str: str) -> list:
    """
    Converts a JSON response to a Markdown list of solutions.
    Args:
        response_str (str): The JSON response string.
    Returns:
        list: A list of Markdown formatted solutions.
    """
    # convert response to dict
    try:
        response_dict = json.loads(response_str)
        # return general answer if no solution found
        if not response_dict["solutions"]:
            return [response_dict["general_answer"]]
    except ValueError:
        return [response_str]
    # loading markdown template
    try:
        with open("./resources/troubleshooting_template.md", 'r') as file:
            markdown_template = file.read()
    except FileNotFoundError as e:
        print(f"File not found: {e}")
        return [response_str]

    solution_list = [response_dict["general_answer"]]
    for index, solution in enumerate(response_dict["solutions"]):
        image_list = [markdown_image(image["image_url"], alt_text=f"Image {i+1}")
                      for i, image in enumerate(solution["images"])]
        images_markdown = markdown_row_grid(data=image_list)
        url_markdown = markdown_link(text=solution["url"], url=solution["url"])
        solution_markdown = markdown_template.format(
            index=index + 1, headline=solution["headline"],
            summary=solution["summary"],
            url=url_markdown, images=images_markdown)
        solution_list.append(solution_markdown)

    return solution_list
