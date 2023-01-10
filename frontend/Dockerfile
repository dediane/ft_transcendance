FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npm run build

FROM nginx:1.19
COPY --from=0 /usr/src/app/build /usr/share/nginx/html

EXPOSE 80
