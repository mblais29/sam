/****************************************
	GLOBAL VARIABLES
****************************************/
var mapOnLoadCenter = new L.LatLng(56.1304, -106.3468);
var mapOnLoadZoom = 4;
var navBarMargin = 52;
var propertyList = [];
var mapProperties = L.featureGroup();


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
	var map = L.map('map', {center: mapOnLoadCenter, zoom: mapOnLoadZoom});
		
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
    
	var propertyControl = L.Control.extend({
	 
	  options: {
	    position: 'bottomright' 
	  },
	 
	  onAdd: function (map) {
	    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
	    container.style.backgroundColor = 'white';
	    container.style.padding = '2px';
	    var insideDiv = "";
	    insideDiv += '<a href="#" title="Zoom to All Properties" onclick="getPropertyLocations()" ><i class="fa fa-map-marker fa-2x" aria-hidden="true" style="color:black"></i></a>';
	    insideDiv += '<a href="#" title="Reset View" onclick="resetMapView()"><i class="fa fa-expand fa-2x" aria-hidden="true" style="color:black; padding:3px"></i></a>';
	    
	    container.innerHTML = insideDiv;

	    return container;
	  }
	 
	});
	
	map.addControl(new propertyControl());

    map.on('draw:created', function (e) {
		var type = e.layerType,
			layer = e.layer;
		var geojson = layer.toGeoJSON();
		propertyGeojsonGeometry = JSON.stringify(geojson.geometry);
		
		var content = getPopupContent(layer);
        if (content !== null) {
        	console.log(content);
            //layer.bindPopup(content);
        }
		
		var content = '<div class="form-group"><div class="ui-widget"><input type="text" class="form-control" id="search-properties" placeholder="Enter property name..."></div></div>';

        layer.bindPopup('<div id="propPopup">' + content + '</br><button type="button" class="btn btn-success" onclick="saveProperty()">Save</button></div>');

		editableLayers.addLayer(layer);
		layerControl.addOverlay(editableLayers, 'Drawn Asset');
		
	});
	
	map.on('draw:edited', function (e) {
		var layer = e.layers;
     	var geojson = layer.toGeoJSON();
     	propertyGeojsonGeometry = JSON.stringify(geojson.features[0].geometry);
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

function resetMapView(){
	if(map.hasLayer(mapProperties)){
		layerControl.removeLayer(mapProperties);
		map.removeLayer(mapProperties);
		mapProperties = L.featureGroup();
	}
	map.setView(mapOnLoadCenter, mapOnLoadZoom);
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
};

function saveProperty(){
	var record = $('#search-properties').val();
	
	var regex = /\[(.*?)\]/g;
	var newStr = record.match(regex);
	var id = "";
	if(newStr != null){
		id = newStr[0].replace(/[\[\]']+/g, '');
	}
	//console.log(id);
	//console.log(propertyGeojsonGeometry);
	
	$.ajax('/map/saveProperty?id=' + id + '&geom=' + JSON.stringify(propertyGeojsonGeometry),{
      success: function(data) {
      	location.reload();
      },
      done: function(data){
      	
      },
      error: function(err) {
         console.log(err);
      }
    });
}

function getPropertyLocations(){
	$.ajax('/properties/getPropertyLocations',{
      success: function(data) {
      	var properties = data.rows;
		for(var i = 0; i < properties.length; i++){
			var propertyGeojson = JSON.parse(properties[i].geojson);
			var property = L.geoJSON(propertyGeojson, {
			    /*pointToLayer: function (feature, latlng) {
			        return L.circleMarker(latlng, geojsonMarkerOptions);
			    }*/
			   	onEachFeature: function (feature, layer) {
			   		//console.log(feature);
			   		//console.log(layer);
			   	}
			});
			if(!map.hasLayer(mapProperties)){
				mapProperties.addLayer(property);
			}
		}
		createProperty();
      },
      done: function(data){

      },
      error: function(err) {
         console.log(err);
      }
    });
}

function createProperty(){
	if(!map.hasLayer(mapProperties)){
		layerControl.addOverlay(mapProperties, 'Properties');
		map.addLayer(mapProperties);
	}
	map.fitBounds(mapProperties.getBounds());
	
}
