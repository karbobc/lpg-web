#!/usr/bin/env sh

[ -z "$LPG_WEB_TITLE" ] || sed -i "s|\(<title>\).*\(</title>\)|\1${LPG_WEB_TITLE}\2|g" /usr/share/nginx/html/index.html
