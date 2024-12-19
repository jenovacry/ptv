FROM mcr.microsoft.com/playwright:latest

RUN curl -fsSL https://bun.sh/install | bash

ENV PATH="/root/.bun/bin:$PATH"

WORKDIR /usr/src/app

COPY package*.json ./
COPY bun.lockb ./

RUN bun install

COPY . .

CMD ["bun", "start"]