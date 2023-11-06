FROM python:3.10

WORKDIR /app

COPY . /app

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    software-properties-common \
    git \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install -r requirements.txt

# Expose the ports that your app uses
EXPOSE 8501

# Add a command to run your application
CMD ["bash", "-c", "streamlit run frontend/streamlit_gui.py"]
