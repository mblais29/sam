/****************************************
	GLOBAL VARIABLES
****************************************/
var mapOnLoadCenter = new L.LatLng(56.1304, -106.3468);
var mapOnLoadZoom = 4;
var navBarMargin = 52;
var propertyList = [];
var mapProperties = L.featureGroup();
var propertyMarkers = L.featureGroup();
var propertyLayer = new L.geoJson();
var propertyGroup = L.featureGroup();


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
            polyline: false, /*{
                shapeOptions: {
                    color: '#f357a1',
                    weight: 10
                }
            },*/
            polygon: {
                allowIntersection: true, // Restricts shapes to simple polygons
                shapeOptions: {
                    color: '#FF0000'
                }
            },
            circle: false, // Turns off (false) this drawing tool
            rectangle: false, /*{
                shapeOptions: {
                    clickable: false
                }
            },*/
            marker: false
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
	    insideDiv += '<a href="#" title="Zoom to All Properties" onclick="zoomToAllProperties(); return false" ><i class="fa fa-map-marker fa-2x" aria-hidden="true" style="color:black"></i></a>';
	    insideDiv += '<a href="#" title="Reset View" onclick="resetMapView(); return false"><i class="fa fa-expand fa-2x" aria-hidden="true" style="color:black; padding:3px"></i></a>';
	    insideDiv += '<a href="#" id="locateProperties" title="Locate Property" data-toggle="modal" data-target="#locate-property" ><i class="fa fa-arrows fa-2x" aria-hidden="true" style="color:black; padding:3px"></i></a>';
	    
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
	
	map.on('draw:deleted', function (e) {
		layerControl.removeLayer(editableLayers);
	});
	
	map.on('popupopen', function (e) {
	    initializeAutoComplete();
	});
    
    /****************************************
	ADD ESRI GEOCODING SERVICE API
	****************************************/
	
    var searchControl = L.esri.Geocoding.geosearch({
    	title: 'Address Search'
    }).addTo(map);

    var results = L.layerGroup().addTo(map);

    searchControl.on("results", function(data) {
        results.clearLayers();
        for (var i = data.results.length - 1; i >= 0; i--) {
            results.addLayer(L.marker(data.results[i].latlng));
        }
    });
    
   getProperties();
   getPropertyLocations();
   
   $('body#mapBody').append('<div id="locate-property" class="modal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button><h4 class="modal-title">Locate Property</h4></div><div class="modal-body"><div id="search-canvas"><table id="table-property-records" class="table table-striped" data-sorting="true" data-filtering="true"><thead><tr><!--- Must have data-type="html" on all data-breakpoints="all" or <ahref=""> table data in Footable Plugin ---><th>Client</th><th>Address</th></tr></thead><tbody></tbody></table></div></div><div class="modal-footer"><button type="button" id="propertySearchSubmit" data-dismiss="modal" class="btn btn-default pull-right ">Submit</button><button type="button" id="propertySearchClose" data-dismiss="modal" class="btn btn-default pull-right btn-close">Close</button></div></div></div></div>');

   $('#propertySearchClose').on('click', function(){
		$('#locate-property').modal('toggle');
	});
	
   $('#propertySearchSubmit').on('click', function(){
		getPropertyData();
	});
	
   
	populatePropertySearch();
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
	/*if(map.hasLayer(mapProperties) || map.hasLayer(propertyMarkers)){
		layerControl.removeLayer(mapProperties);
		layerControl.removeLayer(propertyMarkers);
		map.removeLayer(mapProperties);
		map.removeLayer(propertyMarkers);
		mapProperties = L.featureGroup();
		propertyMarkers = L.featureGroup();
	}*/
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
			var propertyId = properties[i].property_id;
			
			var property = L.geoJSON(propertyGeojson, {
			    /*pointToLayer: function (feature, latlng) {
			        return L.circleMarker(latlng, geojsonMarkerOptions);
			    }*/
			   	onEachFeature: function (feature, layer) {
			   		if(feature.type === 'Polygon' || feature.type === 'MultiPolygon'){
			   			var centroid = layer.getBounds().getCenter();
			   			var marker = L.marker(centroid);
			   			if(!map.hasLayer(propertyMarkers)){
			   				propertyMarkers.addLayer(marker);
			   			}
			   			createPropertyPopup(propertyId, layer);
			   		}
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
	if(!map.hasLayer(mapProperties) || map.hasLayer(propertyMarkers)){
		layerControl.addOverlay(mapProperties, 'Properties');
		layerControl.addOverlay(propertyMarkers, 'Property Markers');
	}
	
}

function zoomToAllProperties(){
	map.fitBounds(mapProperties.getBounds());
	map.addLayer(propertyMarkers);
}

function createPropertyPopup(property_id, layer){
	$.ajax('/map/getPropertyRecords?property_id=' + property_id,{
      success: function(data) {

      	var popupInfo = "";
      		popupInfo += '<b>Client: </b>' + data[0].client[0].client + '</br>';
      		popupInfo += '<b>Address: </b>' + data[0].address + '</br>';
      		popupInfo += '<b>Description: </b>' + data[0].description + '</br>';

      	layer.bindPopup('<div class="propertyPopupDiv">' + popupInfo + '</div>');
      },
      done: function(data){

      },
      error: function(err) {
         console.log(err);
      }
    });
}

function populatePropertySearch(){
	$.ajax('/map/getAllPropertyRecords',{
      success: function(data) {
      	if(data.length){
      		$('#table-property-records tbody').empty();
      	}
      	for(var i = 0; i < data.length; i++){
      		var addRow = create_table_row(data[i]);
      		$('#table-property-records').append(addRow);
      	}
      	$('#table-property-records').footable().trigger('footable_initialize');
      },
      done: function(data){

      },
      error: function(err) {
         console.log(err);
      }
    });
};

function create_table_row (data) {
	var row = $('<tr><td><div class="form-check"><label class="form-check-label"><input class="property-check-input" type="checkbox" value="' + data.id + '"></label> ' + data.client[0].client + '</div></td><td>' + data.address + '</td></tr>');
    return row;
}

function getPropertyData(){
	$(".property-check-input").each(function() {
        var propertyId = $(this).val();
        if($(this).prop('checked')){
	        $.ajax('/map/getSelectedProperties?property_id=' + propertyId,{
		      success: function(data) {
		      	convertToLayer(data);
		      },
		      done: function(data){
		
		      },
		      error: function(err) {
		         console.log(err);
		      }
		    });
	    }
    });
}

function convertToLayer(data){
	var properties = data.rows;
	var myStyle = {
	    "color": "#ff0000",
	    "weight": 3,
	    "opacity": 0.65
	};
	var listOfLayers = [];
	var layersInGroup = propertyGroup.getLayers();
	
	/* If the feature group has layers loop through the layers and place the property id inside an array */
	if(layersInGroup.length > 0){
		for(var k = 0; k < layersInGroup.length; k++){
			listOfLayers.push(layersInGroup[k].options.property_id);
		}
	}
	
	for(var i = 0; i < properties.length; i++){
		var obj = JSON.parse(properties[i]["geometry"]);
			obj["property_id"] = properties[i]["property_id"];
		var exists = $.inArray(properties[i]["property_id"], listOfLayers);
		
		/* If the property does not exist add to the propertyGroup feature group*/
		if(exists == -1){
			var prop = L.geoJSON(obj, {style: myStyle, property_id: properties[i]["property_id"]});
			propertyGroup.addLayer(prop);
		}
	}
	
	if(!map.hasLayer(propertyGroup)){
		layerControl.addOverlay(propertyGroup, 'Searched Properties');
	}
	propertyGroup.addTo(map);
	map.fitBounds(propertyGroup.getBounds());
}


