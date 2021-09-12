FROM nginx

ENV DEBIAN_FRONTEND=noninteractive
RUN ln -sf /usr/share/zoneinfo/America/Los_Angeles /etc/localtime && \
    apt-get update && apt-get install -y \
    	git \
    && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/share/nginx/html
RUN rm -rf /usr/share/nginx/html/* && \
    git clone https://mapping.kg6wxc.net/git/meshmap . && \
    find . -maxdepth 1 -not -name webpage -exec rm -rf {} \; && \
    mv webpage/* . && \
    rmdir webpage
COPY default.conf /etc/nginx/conf.d
