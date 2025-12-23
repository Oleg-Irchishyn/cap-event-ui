#!/bin/sh
set -e
cd /app

: "${BACKEND_HOST:?}"
: "${NEXT_PUBLIC_ONELOGIN_CLIENT_ID:?}"
: "${NEXT_PUBLIC_ONELOGIN_SUBDOMAIN:?}"

esc() { printf '%s' "$1" | sed 's/[&]/\\&/g'; }

BH="$(esc "$BACKEND_HOST")"
CID="$(esc "$NEXT_PUBLIC_ONELOGIN_CLIENT_ID")"
SUB="$(esc "$NEXT_PUBLIC_ONELOGIN_SUBDOMAIN")"

# replace in Next artifacts
find /app -type f \( -name '*.js' -o -name '*.html' \) \
  -exec sed -i \
    -e "s|__BACKEND_HOST__|$BH|g" \
    -e "s|__NEXT_PUBLIC_ONELOGIN_CLIENT_ID__|$CID|g" \
    -e "s|__NEXT_PUBLIC_ONELOGIN_SUBDOMAIN__|$SUB|g" \
  {} \;

exec node server.js
