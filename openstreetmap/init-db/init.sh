#!/bin/bash

wget -S -N -O /downloads/import.osm.pbf ${DOWNLOAD_URL}

osm2pgsql -d gis --create --slim -G --hstore \
          --tag-transform-script /home/renderer/openstreetmap-carto/openstreetmap-carto.lua \
          --number-processes 8 -S /home/renderer/openstreetmap-carto/openstreetmap-carto.style \
           /downloads/import.osm.pbf

psql -d gis -f /home/renderer/openstreetmap-carto/indexes.sql

python3 /home/renderer/openstreetmap-carto/scripts/get-external-data.py \
        -c /home/renderer/openstreetmap-carto/external-data.yml \
        -D /home/renderer/openstreetmap-carto/data