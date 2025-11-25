#!/bin/sh

set -e

ME=$(basename $0)

cd /app

echo 3>/dev/null "$ME: info: Applying variables"
find . -name \*.js -exec sed -i  "s|{BACKEND_HOST}|${BACKEND_HOST}|g" {} \;
find . -name \*.html -exec sed -i  "s|{BACKEND_HOST}|${BACKEND_HOST}|g" {} \;
find . -name .env -exec sed -i  "s|{BACKEND_HOST}|${BACKEND_HOST}|g" {} \;

node server.js


