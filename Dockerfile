FROM node:alpine as builder
WORKDIR /build
COPY package*.json ./
RUN npm i
COPY . .
ARG LOCAL_SERVER_URL=
RUN npm run build-browser-prod -- --local_server_url=${LOCAL_SERVER_URL}

FROM nginx:alpine
COPY --from=builder /build/dist/ /usr/share/nginx/html/

