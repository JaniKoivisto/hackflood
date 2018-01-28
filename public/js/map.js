var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var today = new Date();

var cameraLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'data/points.geojson',
      format: new ol.format.GeoJSON()
    }),
    style: pointStyleFunction
  });
  function pointStyleFunction(feature) {
      return new ol.style.Style({
        image: new ol.style.Icon({
          src: 'img/camera.png',
          scale: 0.03,
          opacity: 0.7
        })
      });
    }

var overlay = new ol.Overlay(({
    element: container,
    autoPan: true,
    autoPanAnimation: {
      duration: 250
    }
  }));

var vectorSource = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    url: function() {
        return 'http://paikkatieto.ymparisto.fi/arcgis/rest/services/Tulva/Tulvariskiaineistot_perusskenaariot_toistuvuuksittain/MapServer/9/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=geojson';
    }
});

var raster = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
    })
});

var fluvial_flood_plain_1000 = new ol.layer.Image({
    title : 'Määritetyt tulva-alueet, meritulva, 1 1000a',
    opacity : 0.6,
    visible : true,
    source: new ol.source.ImageWMS({
        url: 'http://paikkatieto.ymparisto.fi/arcgis/services/Tulva/Tulvariskiaineistot_perusskenaariot_toistuvuuksittain_WGS/MapServer/WMSServer?',
        params: {
            'LAYERS': '43',
            'VERSION': '1.3.0'
        }
        
    })
});

var roads_under_flood_1000 = new ol.layer.Vector({
    source: vectorSource,
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(255, 75, 75, 0.7)',
            width: 2
        })
    })
});

var map = new ol.Map({
    target: 'map',
    overlays: [overlay],
    layers: [raster
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([28.843625187, 64.189471432]),
        zoom: 6
    })
});

var myEl = document.getElementById('go-button');

myEl.addEventListener('click', function() {
    map.addLayer(roads_under_flood_1000);
    map.addLayer(fluvial_flood_plain_1000);
    map.addLayer(cameraLayer);
    map.setView( new ol.View({
        center: ol.proj.fromLonLat([21.800925866, 61.489358102]),
        zoom: 13
    }));


map.on('singleclick', function(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function(feature) {
          return feature;
        });

        if (feature) {
            var coordinates = feature.getGeometry().getCoordinates();
            var imageSrc = feature.get('image');
            var name = feature.get('name');
            content.innerHTML = '<p>'+ name +' ' + today + '</p>' + '<img src="' + imageSrc +' ">';
            overlay.setPosition(coordinates);
        }
        else {
            content.innerHTML = 
                '<b><p id="popup-text">Report a flood event</p></b>' + 
                '<p id="popup-text-lower">Severity:</p>' + 
                '<label class="radio-inline"><input type="radio" name="optradio">1</label>' +
                '<label class="radio-inline"><input type="radio" name="optradio">2</label>' +
                '<label class="radio-inline"><input type="radio" name="optradio">3</label>' +
                '<label class="radio-inline"><input type="radio" name="optradio">4</label>' +
                '<label class="radio-inline"><input type="radio" name="optradio">5</label>' +
                '<button type="button" id="submit-button"class="btn btn-default btn-xs" data-dismiss="modal">Submit</button>';
            coordinates = evt.coordinate;
            overlay.setPosition(coordinates);
        }
});

closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};

});
