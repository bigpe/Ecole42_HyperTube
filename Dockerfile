FROM debian

WORKDIR /app
COPY requirements.txt /app
RUN apt update && apt install -y nocache python3 python3-pip deluge
RUN pip3 install --no-cache-dir -r requirements.txt
RUN apt install -y deluged
EXPOSE 5006
CMD "deluged"
CMD "python3 delugeSetup.py"

ENTRYPOINT deluged && python3 delugeSetup.py && python3 app.py 0.0.0.0:5006
