#!/bin/bash

find pages/scripts -iname '*.69' -print0 | xargs -n 1 -0 fish move-69.fish
