FROM node:20-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci and npm cache clean --force

COPY . .

#Stage 2: Run the application
FROM node:20-slim

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app ./

EXPOSE 3000

USER node

CMD ["npm", "start"]