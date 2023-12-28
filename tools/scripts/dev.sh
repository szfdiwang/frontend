#!/bin/bash

# download assets for the running instance
yarn svg:build-sprite
echo ""

# generate envs.js file and run the app
dotenv \
  -e .env.secrets \
  -e .env.local \
  -- bash -c './deploy/scripts/make_envs_script.sh && next dev -- -p $NEXT_PUBLIC_APP_PORT' |
pino-pretty