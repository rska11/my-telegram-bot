#!/usr/bin/env bash
set -e

npm install
npm install --save-dev @types/node
npm run build
