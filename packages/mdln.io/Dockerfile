# Select basic image.
FROM node:14-alpine3.10

# Create app directory.
WORKDIR /mdln.io

# Add bash, git.
RUN apk add --no-cache bash git

# Copy source, install dependencies, configure environment.
COPY . .
RUN npm i -g mdln.io
RUN npm i
RUN rm -rf $(npm root --global)/mdln.io
RUN ln -s . $(npm root --global)/mdln.io
RUN ln -s ./lib/cjs/index.js $(npm bin --global)/mdln.io

# Run tests.
CMD ["npm", "run", "test"]