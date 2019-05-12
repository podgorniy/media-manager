# Use a lighter version of Node as a parent image
FROM node:10
WORKDIR ./
COPY package*.json ./
RUN npm install --production
COPY dist ./dist
EXPOSE 8080
USER node
CMD ["npm", "run", "prod"]
