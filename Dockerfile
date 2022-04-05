FROM node:14.18-alpine as base

ENV CODE=/code

WORKDIR ${CODE}

COPY ["package.json", "package-lock.json", "jsconfig.json", "yarn.lock","./"]

RUN npm install

FROM base as builder

COPY . .

RUN npm run build

FROM base as dev

CMD ["npm", "run", "dev"]

