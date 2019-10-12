FROM node:11.15.0-alpine
RUN mkdir /api
WORKDIR /api
COPY . .
RUN npm i -g nodemon \
    && npm install
CMD ["npm", "run", "start"]
ARG name=juancarestre/shopping-service:latest