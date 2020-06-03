# Use a lighter version of Node as a parent image
FROM node:12
RUN apt-get -q update
# For wait-for script≠
RUN apt-get -qy --assume-yes install netcat
WORKDIR /srv
COPY . mm/
WORKDIR /srv/mm/
RUN npm install --production
EXPOSE ${EXPOSED_PORT}
CMD ["node", "./dist/server/index.js"]
