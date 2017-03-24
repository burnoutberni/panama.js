#!/bin/bash

set -xe
trap "kill -SIGTERM 0" SIGINT EXIT

rm -f /tmp/mpv.socket && \
mpv --input-unix-socket /tmp/mpv.socket \
    --ytdl-format=best \
    --reset-on-next-file=all \
    --idle=yes --keep-open=yes &

node dist/server.js
