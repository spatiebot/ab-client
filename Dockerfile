# use 16 instead of the latest: 18 gives an error message, https://github.com/mozilla/source-map/issues/454
FROM node:16-alpine as builder
WORKDIR /build
# clear cache: especially changing env stuff may be ignored 
RUN rm -rf .parcel-cache
RUN rm -rf dist

COPY package*.json ./
RUN npm i

COPY . .
#hidden files are ignored by default
COPY .env . 

RUN npm run build 

FROM nginx:alpine
COPY --from=builder /build/dist/ /usr/share/nginx/html/