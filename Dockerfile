FROM --platform=$TARGETPLATFORM nginx:alpine

LABEL maintainer="Karbob <karbobc@gmail.com>"

RUN set -x \
    && rm -f /etc/nginx/conf.d/* \
    && rm -f /usr/share/nginx/html/*

COPY ./nginx /etc/nginx/conf.d/ 
COPY ./dist /usr/share/nginx/html/
COPY ./entrypoint /docker-entrypoint.sh/

CMD ["nginx", "-g", "daemon off;"]