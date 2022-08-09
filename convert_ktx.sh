#!/bin/bash

for f in ./out/*.ktx; do
    ./PVRTexToolCLI -i $f -o tmp.pvr -f r8g8b8a8 -d $f.png
done
