   /*
    * This is an example of how an application can be constructed using polaric components.
    * Se also config.js for configuration of the application.
    *
    * This is minimal version. It is just map-browsing and two menu items.
    */


    /*
     * Display a warning if MSIE is used.
     * Note that to display this for IE browser and to be able to use IE11
     * and other old browser be sure to use the compiled/minified javascript code,
     * including this file.
     */
    var mobile = navigator.platform.match(/i(Phone|Pad)|Android/i);
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    var trident = ua.indexOf('Trident/');
    if (msie > 0 || trident > 0)
       alert("Note that MSIE is not supported. A more recent browser is recommended");

   /*
    * Read the URL GET parameters
    */
   var urlArgs = getParams(window.location.href);
   if (urlArgs['car'] != null)
	CONFIG.store('display.in-car', true);

   /*
    * Instantiate the map browser.
    */
   var browser = new pol.core.MapBrowser('map', CONFIG);
   CONFIG.browser = browser;
   setTimeout(pol.widget.restore, 1500);
    // $('#map').append('<img class="logo" src="'+CONFIG.get('logo')+'">"');


   /*
    * Set up application-specific context menus. We may define named contexts. The toolbar
    * define its own context, 'TOOLBAR'.
    *
    * A callback function is associated with a named context and is called when we need to
    * activate the menu. Use it to add menu items. Adding null means adding a separator.
    */

    /*
     * Add a tracking-layer using a polaric server backend.
     */
    const srv = new pol.tracking.PolaricServer();
    CONFIG.server = srv;
    setTimeout( () => {
        const mu = new pol.tracking.Tracking(srv);
        const flt = new pol.tracking.Filters(mu);
        CONFIG.tracks = mu;
        if (urlArgs['track'] != null)
        	CONFIG.tracks.setTracked(urlArgs['track']);

        if (srv.auth.userid != null) {
            const not = new pol.tracking.Notifier();
            CONFIG.notifier = not;
        }

        /* Get updates when sharing of objects are changed */
        srv.pubsub.subscribe("sharing", x => {
            console.log("Change to object sharing");
            getWIDGET("layers.List").getMyLayers();
            getWIDGET("core.AreaList").getMyAreas();
            getWIDGET("tracking.db.Sharing").getShares();
        });
        srv.pubsub.subscribe("object", x => {
            console.log("Change to object:", x);
            if (x=="area")
                getWIDGET("core.AreaList").getMyAreas();
            else if (x=="layer")
                getWIDGET("layers.List").getMyLayers();
        });

    }, 1000);

    CONFIG.labelStyle = new pol.tracking.LabelStyle();

    /* FIXME: May put init into Edit class constructor */
    pol.features.init(CONFIG.browser.map);

    /*********************************************************
     * Toolbar menu
     *********************************************************/

    browser.ctxMenu.addCallback("TOOLBAR", function(m, ctxt) {
        m.add('Find position', ()=>
            WIDGET("core.refSearch", [50,70], true));
        m.add('Area List', ()=>
            WIDGET("core.AreaList", [50,70], true));
    });

/**
 * Get the URL parameters
 * source: https://css-tricks.com/snippets/javascript/get-url-variables/
 * @param  {String} url The URL
 * @return {Object}     The URL parameters
 */
    function getParams(url) {
        var params = {};
        var parser = document.createElement('a');
        parser.href = url;
        var query = parser.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                params[pair[0]] = decodeURIComponent(pair[1]);
        }
        return params;
    };
