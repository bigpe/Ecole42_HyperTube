FROM python

WORKDIR /app

COPY requirements.txt .

RUN apt update && apt install deluge
RUN pip3 install --no-cache-dir -r requirements.txt

EXPOSE 5006

CMD "deluged"

ENTRYPOINT deluged && python3 app.py 0.0.0.0:5006
