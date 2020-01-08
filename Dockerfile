# Use a lighter version of Node as a parent image
FROM node:10
RUN apt-get -q update
RUN apt-get -qy --assume-yes install ffmpeg netcat
WORKDIR ./
COPY ./bin/* ./bin
COPY package*.json ./
RUN npm install --production
COPY dist ./dist
EXPOSE ${EXPOSED_PORT}
CMD ["node", "./dist/server/index.js"]
