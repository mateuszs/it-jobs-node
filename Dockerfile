FROM node:14.16.0
WORKDIR /api
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
CMD [ "npm", "run", "start" ]