# Specifies the base image we're extending
FROM node:12

# Specify the "working directory" for the rest of the Dockerfile
WORKDIR /src

# Install packages using NPM (bundled with the node:12 image)
RUN npm install express --silent
RUN npm install request --silent

# Add application code
COPY ./app/lb.js /src/app/lb.js

# Set environment to "development" by default
ENV NODE_ENV development

# Run the application directly via node
CMD ["node", "/src/app/lb.js"]