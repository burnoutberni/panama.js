#!/bin/bash

PATH=$(pwd)/node_modules/.bin:$PATH
SERVER_ARGS='src/ -x .js -d dist'
CLIENT_ARGS="src/client.js -t [ babelify ] --outfile dist/client.js"
TAG_ARGS="src/tags dist/tags.js"

set -xe
trap "kill -SIGTERM 0" SIGINT EXIT
mkdir -p dist

cd ./dist; ln -sf ../index.html ./index.html; cd -

if [[ "${1}" == "watch" ]]; then
    babel -w ${SERVER_ARGS} &
    riot -w ${TAG_ARGS} &
    watchify ${CLIENT_ARGS}

elif [[ "${1}" == "clean" ]]; then
    rm -r dist/*
else
    babel ${SERVER_ARGS}
    riot ${TAG_ARGS}
    browserify ${CLIENT_ARGS}
fi
