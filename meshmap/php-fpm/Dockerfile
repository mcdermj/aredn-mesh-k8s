FROM bitnami/php-fpm AS base

ENV DEBIAN_FRONTEND=noninteractive
RUN ln -sf /usr/share/zoneinfo/America/Los_Angeles /etc/localtime && \
    apt-get update && apt-get install -y \
    	git \
    && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN git clone https://mapping.kg6wxc.net/git/meshmap .

COPY init.sh /init.sh
CMD [ "/init.sh" ]
