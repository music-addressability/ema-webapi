FROM node:18 as builder
LABEL maintainer="Raffaele Viglianti for CRIM"

WORKDIR /var/romajs

COPY . .

RUN npm install
CMD ["npm", "start"]
