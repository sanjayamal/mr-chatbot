FROM python:3.11

ARG env_file=.env.production

WORKDIR /app

RUN pip install pipenv

ENV PIPENV_DOTENV_LOCATION ${env_file}
COPY Pipfile* .
RUN pipenv install

RUN pipenv install gunicorn

COPY . .

EXPOSE 5000
CMD [ "pipenv", "run", "gunicorn", "app:app" ]
