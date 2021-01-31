FROM python

WORKDIR /app

COPY requirements.txt .

RUN apt update && apt install -y deluge deluged
RUN pip3 install --no-cache-dir -r requirements.txt

EXPOSE 5006

CMD "deluged"

ENTRYPOINT deluged && python3 app.py localhost:5006
