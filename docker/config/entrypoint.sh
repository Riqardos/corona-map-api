#!/bin/sh

rm -rf /usr/share/nginx/html/env.js
touch /usr/share/nginx/html/env.js
echo "window.env = { API_URL:\"$REACT_APP_BASE_URL\"};" >> /usr/share/nginx/html/env.js
nginx -g 'daemon off;'


