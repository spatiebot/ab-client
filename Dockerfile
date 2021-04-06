FROM node:alpine as builder
WORKDIR /build
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build-prod

FROM nginx:alpine
COPY --from=builder /build/dist/ /usr/share/nginx/html/

