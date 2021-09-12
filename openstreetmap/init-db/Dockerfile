FROM ubuntu:20.04 AS osm-base

ENV DEBIAN_FRONTEND=noninteractive
RUN ln -sf /usr/share/zoneinfo/America/Los_Angeles /etc/localtime && \
    apt-get update && apt-get install -y \
    	osm2pgsql \
        git \
        python3-psycopg2 \
        python3-yaml \
        python3-requests \
        python3-numpy \
        python3-colormath \
        gdal-bin \
        wget \
    && \
    rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/gravitystorm/openstreetmap-carto.git /home/renderer/openstreetmap-carto
COPY external-data.yml /home/renderer/openstreetmap-carto/

FROM osm-base AS osm-init-db
COPY init.sh /

RUN mkdir -p /downloads /home/renderer/openstreetmap-carto/data
VOLUME /downloads

CMD [ "/init.sh" ]

FROM tiangolo/meinheld-gunicorn:python3.7 AS osm-tile-renderer
RUN apt-get update && apt-get install -y --no-install-recommends \
    	osm2pgsql \
        git \
        python3-psycopg2 \
        python3-yaml \
        python3-requests \
        python3-numpy \
        python3-colormath \
        python3-mapnik \
        gdal-bin \
        wget \
        libmapnik-dev \
        libboost-python-dev \
        nodejs \
        npm \
        fonts-noto-cjk \
        fonts-noto-hinted \
        fonts-noto-unhinted \
        fonts-noto-color-emoji \
        fonts-noto-cjk-extra \
        fonts-noto-extra \
        fonts-noto-mono \
        fonts-noto-ui-extra \
        fonts-noto \
        fonts-hanazono \
        unifont \
    && \
    pip3 install TileStache python-memcached && \
    rm -rf /var/lib/{apt,dpkg,cache,log}/

RUN git clone --depth=1 --branch=v3.0.x https://github.com/mapnik/python-mapnik.git /tmp/python-mapnik && \
    (cd /tmp/python-mapnik && python3 setup.py install) && \
    rm -rf /tmp/python-mapnik

COPY --from=osm-base /home/renderer/openstreetmap-carto /home/renderer/openstreetmap-carto
RUN npm install -g carto@0.18.2
RUN mkdir -p /etc/tilestache && carto /home/renderer/openstreetmap-carto/project.mml > /home/renderer/openstreetmap-carto/mapnik.xml
COPY external-data.yml /home/renderer/openstreetmap-carto/
COPY main.py /app/
COPY tilestache.cfg /etc/tilestache/
COPY gunicorn_conf.py /app/