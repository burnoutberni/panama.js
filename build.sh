#!/bin/bash

PATH=$(pwd)/node_modules/.bin:$PATH
SERVER_ARGS='src/ -x .js -d dist'
CLIENT_ARGS="src/client.js -t [ babelify --presets es2015 ] --outfile dist/client.js"

set -xe
trap "kill -SIGTERM 0" SIGINT EXIT
mkdir -p dist

if [[ "${1}" == "watch" ]]; then
    babel -w ${SERVER_ARGS} &
    watchify ${CLIENT_ARGS}
elif [[ "${1}" == "clean" ]]; then
    rm dist/*
else
    babel ${SERVER_ARGS}
    browserify ${CLIENT_ARGS}
fi
