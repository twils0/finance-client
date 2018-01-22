# tried out Docker and ECS;
# S3 static hosting backed by
# Lambda apis, managed by serverless,
# ended up being a better fit

FROM alpine/git:latest as intermediate

WORKDIR /

ARG GITHUB_TOKEN

RUN git config --global url."https://${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"

RUN git clone https://github.com/twils0/finance-client.git

RUN git config --global --unset url."https://${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"


FROM node:9.11

RUN mkdir finance_client

COPY --from=intermediate /finance_client /finance_client

WORKDIR /finance_client

RUN apt-get update && apt-get install -y --no-install-recommends nasm

RUN npm install

EXPOSE 8080

CMD [ "npm", "run", "prod" ]
