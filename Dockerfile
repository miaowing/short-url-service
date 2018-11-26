FROM node:8.10
MAINTAINER zfeng <i@zfeng.net>

ENV VERSION 0.0.1

WORKDIR /usr/src/app

ADD . ./
RUN rm -rf build node_modules
RUN npm install --registry=https://registry.npm.taobao.org
RUN npm run build

ENV NODE_ENV production

CMD ["npm", "run", "start:prod"]

EXPOSE 4444
