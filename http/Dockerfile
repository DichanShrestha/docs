# Base image for dependency installation
FROM node:20 AS BASE

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies first
RUN npm install

# Development stage
FROM BASE AS development

ENV NODE_ENV=development

COPY . .

CMD ["npm", "run", "dev"]

# Production stage
FROM BASE AS production

ENV NODE_ENV=production

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]
