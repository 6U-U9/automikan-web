#!/bin/sh
API_BASE_URL=${API_BASE_URL:-http://localhost:8236}
sed -i "s#{{API_BASE_URL}}#${API_BASE_URL}#g" /etc/nginx/conf.d/default.conf
exec nginx -g "daemon off;"