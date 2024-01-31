# onecx-chat-ui
OneCx chat Management UI

Frontend runs with streamlit.

```bash
streamlit run frontend/streamlit_gui.py
```


# Docker

docker build -t onecx-ai-ui:latest . 
docker tag onecx-ai-ui:latest 728986473007.dkr.ecr.us-east-1.amazonaws.com/onecx/onecx-ai-ui:main
docker push 728986473007.dkr.ecr.us-east-1.amazonaws.com/onecx/onecx-ai-ui:main