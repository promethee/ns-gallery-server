#!/bin/sh
docker run -d -v /home/$USER/data:/usr/src/app/data --name $(basename "$PWD") $USER/$(basename "$PWD"):latest