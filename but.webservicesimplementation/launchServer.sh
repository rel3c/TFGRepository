#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE}")" ; pwd -P )

mkdir -p "$parent_path"/logs

nohup nodejs "$parent_path"/src/com/openbravo/webservicesimplementation/servers/ButFakeServer.js >> "$parent_path"/logs/fakeServer.log 2>&1 &





