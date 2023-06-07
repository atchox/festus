FROM node:current-alpine

WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

COPY package.json yarn.lock ./
RUN \
  yarn install && \
  yarn cache clean --all

COPY . .

RUN \
  chmod +x *.sh && \
  chown -R node:node ./

USER node

CMD ["./cmd.sh"]