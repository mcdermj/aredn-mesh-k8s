 /*
   * Map browser configuration
   *
   */

  /* Default projection */
  PROJECTION( "EPSG:900913" );

  /* Default center and scale */
  CENTER    ( -122.894726, 44.530288 );
  SCALE     ( 100 );

  SERVER("http://nh6z-aprs-client.local.mesh:80");

  ICONPATH("aprsd");

  DEFAULT_ICON(61);

  /*
   * Layers.
   *
   * Use the LAYERS function to define map layers. This function takes some options and an array
   * of layers as arguments. Use options to tell if layers are base-layers, and to set a
   * predicate (a function that returns a boolean to say if layers should be displayed or not.
   * You can also use these options to set projection or the attribution.
   *
   * Use OpenLayers to define layers:  http://openlayers.org/en/latest/apidoc/ol.layer.html
   * An option 'name' should be set on all layers to identify each of them in the layer
   * switcher list.
   *
   * The createLayer_WFS is a convenience function to simplify creation of WFS layer
   * (see example below).
   */

  LAYERS(
     { base: true,
       predicate: TRUE,
       projection: "EPSG:900913",
       attribution: "Openstreetmap"
     },
     [
        new ol.layer.Tile({
          name: 'OpenStreetMap',
          source: new ol.source.OSM({
              url: 'http://nh6z-tiles.local.mesh/osm_tiles/{z}/{x}/{y}.png'
          })
        })
     ]
  );
