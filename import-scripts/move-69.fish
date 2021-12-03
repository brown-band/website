#!/usr/bin/env fish

mv $argv[1] (dirname (dirname $argv[1]))/
