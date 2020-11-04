FROM python:alpine

WORKDIR /app
COPY requirements.txt /app
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 5006

ENTRYPOINT python3 app.py 0.0.0.0:5006
