FROM python:3.8-slim

RUN pip install --upgrade pip

COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY . /shopping-land
WORKDIR /shopping-land

ENTRYPOINT ["sh", "/shopping-land/entrypoint.sh"]