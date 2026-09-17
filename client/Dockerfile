FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_URL=http://localhost:5000/api
ARG VITE_DEFAULT_LAT=23.2599
ARG VITE_DEFAULT_LNG=77.4126
ARG VITE_DEFAULT_CITY=Bhopal
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_DEFAULT_LAT=$VITE_DEFAULT_LAT
ENV VITE_DEFAULT_LNG=$VITE_DEFAULT_LNG
ENV VITE_DEFAULT_CITY=$VITE_DEFAULT_CITY
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
