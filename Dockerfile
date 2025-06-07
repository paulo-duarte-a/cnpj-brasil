FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app /app

RUN npm install pm2 -g

EXPOSE 80

CMD ["pm2-runtime", "npm", "--", "start"]
