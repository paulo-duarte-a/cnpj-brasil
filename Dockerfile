FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

RUN npm install -g serve pm2

COPY --from=builder /app /app

EXPOSE 80

CMD ["pm2-runtime", "serve", "dist", "--port", "80", "--single"]
