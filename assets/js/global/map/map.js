/****************************************
	GLOBAL VARIABLES
****************************************/
var navBarMargin = 52;
var propertyList = [];

if($('body').is('#mapBody')){
	/****************************************
	ADJUST MAP BASED ON WINDOW HEIGHT
	****************************************/
	
	// Adjust the map div to the screen size first
	$("#map").height($(window).height()- navBarMargin).width($(window).width());
	$(window).on("resize", resize);
	
	
	/****************************************
	ADDING GOOGLE MAP LAYERS
	****************************************/
	var map = L.map('map', {center: new L.LatLng(54.0000, -125.0000), zoom: 6});
		
		var esriStreet = new L.esri.basemapLayer('Streets');
		var esriTopo = new L.esri.basemapLayer('Topographic');
		var esriImagery = new L.esri.basemapLayer('Imagery');
		var esriTerrain = new L.esri.basemapLayer('Terrain');
		
		var baseMaps = {
		    'Street': esriStreet,
		    'Imagery':esriImagery, 
		    'Terrain': esriTerrain,
		    'Topographic': esriTopo
		};
		  
	/****************************************
	BASEMAP AND LAYER CONTROL FOR LEGEND
	****************************************/
	map.addLayer(esriStreet);
	var layerControl = L.control.layers(baseMaps);
	layerControl.addTo(map);
	/****************************************
	ADD LEAFLET-DRAW
	****************************************/
	 var editableLayers = new L.FeatureGroup();
	 map.addLayer(editableLayers);
	 
	 var options = {
        position: 'topleft',
        draw: {
            polyline: {
                shapeOptions: {
                    color: '#f357a1',
                    weight: 10
                }
            },
            polygon: {
                allowIntersection: true, // Restricts shapes to simple polygons
                shapeOptions: {
                    color: '#FF0000'
                }
            },
            circle: true, // Turns off (false) this drawing tool
            rectangle: {
                shapeOptions: {
                    clickable: false
                }
            },
            marker: true
        },
        edit: {
            featureGroup: editableLayers, //REQUIRED!!
            remove: true
        }
    };
    
    var drawControl = new L.Control.Draw(options);
    map.addControl(drawControl);
    
    map.on('draw:created', function (e) {
		var type = e.layerType,
			layer = e.layer;
		var geojson = layer.toGeoJSON();
		var geojsonGeometry = JSON.stringify(geojson.geometry);

		var content = getPopupContent(layer);
        if (content !== null) {
        	console.log(content);
            //layer.bindPopup(content);
        }
		
		var content = '<div class="form-group"><div class="ui-widget"><input type="text" class="form-control" id="search-properties" placeholder="Enter property name..."></div></div>';

        layer.bindPopup('<div id="propPopup">' + content + '</br><button type="button" class="btn btn-success">Save</button>' + '</div>');

		editableLayers.addLayer(layer);
		layerControl.addOverlay(editableLayers, 'Drawn Asset');
	});
	
	map.on('draw:edited', function (e) {
		var layer = e.layers;
     	var geojson = layer.toGeoJSON();
     	var geojsonGeometry = JSON.stringify(geojson.features[0].geometry);
        
        console.log(geojson);
        console.log(geojsonGeometry);
	});
	
	map.on('popupopen', function (e) {
	    initializeAutoComplete();
	});
   
   getProperties();
};

/****************************************
	GLOBAL FUNCTIONS
****************************************/

//Resizes Map when window is resized
function resize(){
	$('#map').css("height", ($(window).height() - navBarMargin));
	$('#map').css("width", ($(window).width()));    
}

function removePanel(){
	$('.close-upload-panel').on('click',function(){
		var effect = $(this).data('effect');
	    $(this).closest('.panel')[effect]();
	});
}

// Truncate value based on number of decimals
var _round = function(num, len) {
    return Math.round(num*(Math.pow(10, len)))/(Math.pow(10, len));
};

// Helper method to format LatLng object (x.xxxxxx, y.yyyyyy)
var strLatLng = function(latlng) {
    return "("+_round(latlng.lat, 6)+", "+_round(latlng.lng, 6)+")";
};

var getPopupContent = function(layer) {
    // Marker - add lat/long
    if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        return strLatLng(layer.getLatLng());
    // Circle - lat/long, radius
    } else if (layer instanceof L.Circle) {
        var center = layer.getLatLng(),
            radius = layer.getRadius();
        return "Center: "+strLatLng(center)+"<br />"
              +"Radius: "+_round(radius, 2)+" m";
    // Rectangle/Polygon - area
    } else if (layer instanceof L.Polygon) {
        var latlngs = layer._defaultShape ? layer._defaultShape() : layer.getLatLngs(),
            area = L.GeometryUtil.geodesicArea(latlngs);
        return "Area: "+L.GeometryUtil.readableArea(area, true);
    // Polyline - distance
    } else if (layer instanceof L.Polyline) {
        var latlngs = layer._defaultShape ? layer._defaultShape() : layer.getLatLngs(),
            distance = 0;
        if (latlngs.length < 2) {
            return "Distance: N/A";
        } else {
            for (var i = 0; i < latlngs.length-1; i++) {
                distance += latlngs[i].distanceTo(latlngs[i+1]);
            }
            return "Distance: "+_round(distance, 2)+" m";
        }
    }
    return null;
};

function getProperties(){
	$.ajax('/properties/getRecords',{
      success: function(data) {
      	for(var i = 0; i < data.length; i++){
      		propertyList.push('[' + data[i].id +'] - ' + data[i].client[0].client);
      	}
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
};

function initializeAutoComplete(){
	$( "#search-properties" ).autocomplete();
        
    $( "#search-properties" ).autocomplete({
	  source: propertyList
	});
}

