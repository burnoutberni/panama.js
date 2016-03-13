#!/bin/bash

set -xe
trap "kill -SIGTERM 0" SIGINT EXIT

mpv --input-unix-socket /tmp/mpv.socket \
    --ytdl-format=best \
    --reset-on-next-file=all \
    --idle=yes --keep-open=yes --pause &

node dist/server.js
