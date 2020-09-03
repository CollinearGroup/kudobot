FROM node:12.18.3-alpine
WORKDIR /usr/src/app
# Only copy the package.json file to work directory
COPY package.json package-lock.json ./
# Install all Packages
RUN npm ci
# Copy all other source code to work directory
ADD . /usr/src/app
# Start
CMD [ "npm", "start" ]
EXPOSE 3978
