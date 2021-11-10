FROM node
EXPOSE 3000
RUN npm i -g npm
WORKDIR /usr/src/app
COPY . .
RUN npm i --production
CMD micro