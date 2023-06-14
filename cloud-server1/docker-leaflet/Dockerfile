# Specifies the base image we're extending
FROM node:9

# Specify the "working directory" for the rest of the Dockerfile
WORKDIR /src

# Install packages using NPM 5 (bundled with the node:9 image)
COPY ./app/package.json /src/package.json
RUN npm install --silent

# Add application code
COPY ./app/data/* /src/data/
COPY ./app/app.js /src/app.js
COPY ./app/index.html /src/index.html

# Set environment to "development" by default
ENV NODE_ENV development

# Run the application
CMD ["npm", "start"]