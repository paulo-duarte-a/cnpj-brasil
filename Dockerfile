FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

RUN npm install -g serve pm2

COPY --from=builder /app/dist /app

CMD ["pm2-runtime", "serve", ".", "--port", "3000"]
