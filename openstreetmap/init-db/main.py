#!/usr/bin/penv python3

from TileStache import WSGITileServer

app = WSGITileServer('/etc/tilestache/tilestache.cfg')