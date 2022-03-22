FROM python:3.9-alpine3.14

# install chromedriver
RUN apk update
RUN apk upgrade -U -a
RUN apk add build-base
RUN apk add libffi-dev
RUN pip install --upgrade pip
RUN pip install selenium
RUN pip install webdriver-manager
RUN apk add chromium 
RUN apk add chromium-chromedriver
# RUN export PATH=$PATH:/home/tester/.wdm/drivers/chromedriver/**/*/**/*
# RUN adduser -D tester

# USER tester


# ENTRYPOINT ["/bin/sh"]

