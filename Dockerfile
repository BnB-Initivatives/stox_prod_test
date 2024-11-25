# syntax=docker/dockerfile:1.4
# Use the official Node.js image as the base image for development
FROM node:lts AS development

ENV CI=true
# Default port for React
ENV PORT=3000 
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
# Set the working directory
WORKDIR /code
# Copy package.json and package-lock.json for dependency installation
COPY package.json /code/package.json
COPY package-lock.json /code/package-lock.json
# Install dependencies
RUN npm ci

# Copy the rest of the application source code
COPY . .
# Start the React development server
CMD [ "npm", "start" ]

# for production
FROM development AS builder

RUN npm run build

# Additional dev tools
# FROM development as dev-envs
# RUN <<EOF
# apt-get update
# apt-get install -y --no-install-recommends git
# EOF

# RUN <<EOF
# useradd -s /bin/bash -m vscode
# groupadd docker
# usermod -aG docker vscode
# EOF
# # install Docker tools (cli, buildx, compose)
# COPY --from=gloursdocker/docker / /
# CMD [ "npm", "start" ]

FROM nginx:1.13-alpine

COPY --from=builder /code/build /usr/share/nginx/html