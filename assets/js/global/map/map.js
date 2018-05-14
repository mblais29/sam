/****************************************
	GLOBAL VARIABLES
****************************************/
var mapOnLoadCenter = new L.LatLng(49.8880,-119.4960); //new L.LatLng(56.1304, -106.3468);
var mapOnLoadZoom = 15; //4;
var navBarMargin = 52;
var layerControl = "";
var currentLayers = [];
var overlayLayers = {};
var editedLayerProperties = {};
var editedLayer = false;

var map = "";


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
	map = L.map('map', {center: mapOnLoadCenter, zoom: mapOnLoadZoom});
		
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
	BASEMAP LAYERS AND LAYER CONTROL FOR LEGEND
	****************************************/
	getAllMapLayers();
	map.addLayer(esriStreet);
	layerControl = L.control.layers(baseMaps);
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
            marker: true,
            circlemarker: false
        },
        edit: {
            featureGroup: editableLayers, //REQUIRED!!
            remove: true
        }
    };
    
    var drawControl = new L.Control.Draw(options);
    map.addControl(drawControl);
    
	var mapToolControls = L.Control.extend({
	 
	  options: {
	    position: 'bottomright' 
	  },
	 
	  onAdd: function (map) {
	    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
	    container.style.backgroundColor = 'white';
	    container.style.padding = '2px';
	    var insideDiv = "";
	    insideDiv += '<a href="#" title="Reset View" onclick="resetMapView(); return false"><i class="fa fa-expand fa-2x" aria-hidden="true" style="color:black; padding:3px"></i></a>';
	    
	    container.innerHTML = insideDiv;

	    return container;
	  }
	 
	});
	
	map.addControl(new mapToolControls());

    map.on('draw:created', function (e) {
    	editedLayer = false;
		var type = e.layerType,
			layer = e.layer;
		var geojson = layer.toGeoJSON();
		var form = '<select class="selectLayerpicker" data-live-search="true"></select><button type="button" class="btn btn-info" id="layerEnterInfo">Enter Info</button>';
		
		layer.bindPopup(form).on('popupopen', function (popup) {
			addLayersToPopup();
	    });
	   
		editableLayers.addLayer(layer);
		layerControl.addOverlay(editableLayers, 'Drawn Asset');
		
	});
	
	map.on('draw:edited', function (e) {
		
		var layer = e.layers;
     	var geojson = layer.toGeoJSON();

		console.log(geojson);
		
		if(editedLayer) {
			if(geojson.features[0].geometry.type == "polygon" || geojson.features[0].geometry.type == "Polygon"){
		 		geojson.features[0].properties = editedLayerProperties;
		 		editableLayers.clearLayers();
		 	}
			saveEditedLayer(geojson, e);
		}
	});
	
	map.on('draw:deleted', function (e) {
		layerControl.removeLayer(editableLayers);
	});
	
	map.on('moveend', function(){
		//editableLayers.clearLayers();
		removeLayers();
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
	map.setView(mapOnLoadCenter, mapOnLoadZoom);
}

// Truncate value based on number of decimals
var _round = function(num, len) {
    return Math.round(num*(Math.pow(10, len)))/(Math.pow(10, len));
};

// Helper method to format LatLng object (x.xxxxxx, y.yyyyyy)
var strLatLng = function(latlng) {
    return "("+_round(latlng.lat, 6)+", "+_round(latlng.lng, 6)+")";
};

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
		layerControl.addOverlay(propertyGroup, 'Properties Found');
	}
	propertyGroup.addTo(map);
	map.fitBounds(propertyGroup.getBounds());
}

function getAllMapLayers(){
	$.ajax('/map/getAllMapLayers',{
      success: function(data) {
		handleLayerData(data);
      },
      done: function(data){
		
      },
      error: function(err) {
         console.log(err);
      }
   });

}

function handleLayerData(data){
	for(i = 0; i < data.length; i++){
		var geojsonURL = data[i].url;
		var layerName = data[i].name;
		var layerid = data[i].layerid;
		var layertableref = data[i].layertableref;
		var layerForm = data[i].layerassignedform;
		var layerstyle = data[i].layerstyle;
		var minZoom = data[i].minzoom;
		var maxZoom = data[i].maxzoom;
		var layer = {};
		layer["url"] = geojsonURL;
		layer["name"] = layerName;
		layer["id"] = layerid;
		layer["layertableref"] = layertableref;
		layer["layerassignedform"] = layerForm;
		layer["layerstyle"] = layerstyle;
		layer["minzoom"] = minZoom;
		layer["maxzoom"] = maxZoom;
		
		currentLayers.push(layer);
	}
	addLayers();
}

function addLayersToPopup(){
	for (var k in currentLayers) {
		var layerTable = currentLayers[k]["layertableref"];
		var layerName = currentLayers[k]["name"];
		var layerForm = "";
		/* Only assign layers that have forms assigned */
		if(currentLayers[k]["layerassignedform"].length > 0){
			layerForm = currentLayers[k]["layerassignedform"][0]["formid"];
			var createOption = '<option data-tokens="' + layerForm + '">' + layerName + '</option>';
			$('.selectLayerpicker').append(createOption);
		}
	}
	$('.selectLayerpicker').selectpicker();
}

function addLayers(){
	/* Loop through the layers in the database and add to the layercontrol */
	for (var k in currentLayers) {
		(function (k) {
	      	var layerUrl = currentLayers[k]["url"];
			var layerId = currentLayers[k]["id"];
			var layerName = currentLayers[k]["name"];
			var layerTable = currentLayers[k]["layertableref"];
			var layerStyle = currentLayers[k]["layerstyle"];
			var layerMinZoom = currentLayers[k]["minzoom"];
			var layerMaxZoom = currentLayers[k]["maxzoom"];
			var layersInControl = layerControl._layers;
			
			var currentLayerMarker = "";
			var currentLayerStyle = "";
			
			
			if(layerStyle[0] !== undefined){
				switch (layerStyle[0].type) {
				    case 'point':
				        currentLayerMarker = L.AwesomeMarkers.icon({
							icon: layerStyle[0]["markerIcon"],
							prefix: layerStyle[0]["prefix"],
							markerColor: layerStyle[0]["markerColour"],
							iconColor: layerStyle[0]["markerIconColor"]
					    });
					    $.getJSON(layerUrl + "&bbox=" + map.getBounds().toBBoxString(), function(data) {
							  	overlayLayers[layerId] = new L.GeoJSON(data, {
								  							pointToLayer: function(geoJsonPoint, latlng) {
															    return L.marker(latlng, {icon: currentLayerMarker});
															},
						  									onEachFeature: function(feature, layer){
						  										layer.feature.properties.layer_id = layerId;
						  										layer.feature.properties.layer_table = layerTable;
						  										layer.type = "point";
						  										
						  										layer.on('contextmenu', function(e){
						  											editedLayer = true;
						  											editableLayers.addLayer(layer);
						  											document.querySelector(".leaflet-draw-edit-edit").click();
						  										});
						  									}
														  });
								if(map.getZoom() >= layerMinZoom){
									layerControl.addOverlay(overlayLayers[layerId], layerName);
								}					  
							});
				        break;
				    case 'polygon':
				    	currentLayerStyle = layerStyle[0]["style"];
				        $.getJSON(layerUrl + "&bbox=" + map.getBounds().toBBoxString(), function(data) {
							  	overlayLayers[layerId] = new L.GeoJSON(data, {
		  							style: currentLayerStyle,
  									onEachFeature: function(feature, layer){
  										layer.feature.properties.layer_id = layerId;
  										layer.feature.properties.layer_table = layerTable;
  										layer.type = "polygon";
  										
  										layer.on('contextmenu', function(e){
	  										var geom = feature.geometry; 
										    var props = feature.properties;
										    editedLayerProperties = props;
											editedLayer = true;
										     if (geom.type === 'MultiPolygon'){
										     	var newPolygon = "";
										        for (var i = 0; i < geom.coordinates.length; i++){
										            newPolygon = {
										               'type':'Polygon', 
										               'coordinates':geom.coordinates[i],
										               'properties': props
										               };
										        }
										        var createGeoJson = L.GeoJSON.geometryToLayer(newPolygon);

										        editableLayers.addLayer(createGeoJson);
										     } 
  											document.querySelector(".leaflet-draw-edit-edit").click();
  										});
  									}
								  });
								if(map.getZoom() >= layerMinZoom){
									layerControl.addOverlay(overlayLayers[layerId], layerName);
								}					  
							});
				        break;
				}
			}else{
				$.getJSON(layerUrl + "&bbox=" + map.getBounds().toBBoxString(), function(data) {
				  	overlayLayers[layerId] = new L.GeoJSON(data, {
		  									onEachFeature: function(feature, layer){
		  										layer.feature.properties.layer_id = layerId;
		  										layer.feature.properties.layer_table = layerTable;
		  										layer.type = "polygon";
		  										
		  										layer.on('contextmenu', function(e){
		  											editedLayer = true;
		  											editableLayers.addLayer(layer);
		  											document.querySelector(".leaflet-draw-edit-edit").click();
		  										});
		  									}
										  });
					if(map.getZoom() >= layerMinZoom){
						layerControl.addOverlay(overlayLayers[layerId], layerName);
					}					  
				  	
				});
			}
	  	})(k);
	}
}

function removeLayers(){
	var activeLayers = [];
	
	for (var k in overlayLayers) {
		if(map.hasLayer(overlayLayers[k])){
			map.removeLayer(overlayLayers[k]);
			activeLayers.push(k);
		}
		layerControl.removeLayer(overlayLayers[k]);
	}
	overlayLayers = {};
	
	renderLayers(activeLayers);
	
	
}

function renderLayers(activeLayers){
	/* Loop through the layers in the database and add to the layercontrol */
	var currentLayerMarker = "";
	var currentLayerStyle = "";
	for (var k in currentLayers) {
		(function (k) {
	      	var layerUrl = currentLayers[k]["url"];
			var layerId = currentLayers[k]["id"];
			var layerName = currentLayers[k]["name"];
			var layerTable = currentLayers[k]["layertableref"];
			var layerStyle = currentLayers[k]["layerstyle"];
			var layerMinZoom = currentLayers[k]["minzoom"];
			var layerMaxZoom = currentLayers[k]["maxzoom"];
			var layersInList = layerControl._layers;
			var layerExists = false;
			
			if(layerStyle[0]!== undefined ){
				switch (layerStyle[0].type) {
					case 'point':
							currentLayerMarker = L.AwesomeMarkers.icon({
								icon: layerStyle[0]["markerIcon"],
								prefix: layerStyle[0]["prefix"],
								markerColor: layerStyle[0]["markerColour"],
								iconColor: layerStyle[0]["markerIconColor"]
							});
						$.getJSON(layerUrl + "&bbox=" + map.getBounds().toBBoxString(), function(data) {
							/* Check to see if layer was active before refreshing the page */
							if($.inArray( layerId, activeLayers ) > -1){
								overlayLayers[layerId] = new L.GeoJSON(data, {
													pointToLayer: function(geoJsonPoint, latlng) {
													    return L.marker(latlng, {icon: currentLayerMarker});
													},
													onEachFeature: function(feature, layer){
														layer.feature.properties.layer_id = layerId;
														layer.feature.properties.layer_table = layerTable;
														layer.on('contextmenu', function(e){
				  											editableLayers.addLayer(layer);
				  											document.querySelector(".leaflet-draw-edit-edit").click();
				  										});
													}
												  }).addTo(map);
							}else{
								overlayLayers[layerId] = new L.GeoJSON(data, {
													pointToLayer: function(geoJsonPoint, latlng) {
													    return L.marker(latlng, {icon: currentLayerMarker});
													},
													onEachFeature: function(feature, layer){
														layer.feature.properties.layer_id = layerId;
														layer.feature.properties.layer_table = layerTable;
														layer.on('contextmenu', function(e){
				  											editableLayers.addLayer(layer);
				  											document.querySelector(".leaflet-draw-edit-edit").click();
				  										});
													}
												  });
							}
							if(map.getZoom() >= layerMinZoom){
								layerControl.removeLayer(overlayLayers[layerId]);
	
								for(var i = 0; i < layersInList.length; i++){
									if(layerControl._layers[i].name === layerName){
										layerExists = true;
									}
								}
								if(!layerExists) {
									layerControl.addOverlay(overlayLayers[layerId], layerName);
								}
							}
						});
						break;
					case 'polygon':
						$.getJSON(layerUrl + "&bbox=" + map.getBounds().toBBoxString(), function(data) {
							/* Check to see if layer was active before refreshing the page */
							if($.inArray( layerId, activeLayers ) > -1){
								overlayLayers[layerId] = new L.GeoJSON(data, {
													style: layerStyle[0]["style"],
													onEachFeature: function(feature, layer){
														layer.feature.properties.layer_id = layerId;
														layer.feature.properties.layer_table = layerTable;
														
														layer.on('contextmenu', function(e){
					  										var geom = feature.geometry; 
														    var props = feature.properties;
														    editedLayerProperties = props;
				
														     if (geom.type === 'MultiPolygon'){
														     	var newPolygon = "";
														        for (var i = 0; i < geom.coordinates.length; i++){
														            newPolygon = {
														               'type':'Polygon', 
														               'coordinates':geom.coordinates[i],
														               'properties': props
														               };
														        }
														        var createGeoJson = L.GeoJSON.geometryToLayer(newPolygon);
				
														        editableLayers.addLayer(createGeoJson);
														     } 
				  											document.querySelector(".leaflet-draw-edit-edit").click();
				  										});
													}
												  }).addTo(map);
							}else{
								overlayLayers[layerId] = new L.GeoJSON(data, {
													style: layerStyle[0]["style"],
													onEachFeature: function(feature, layer){
														layer.feature.properties.layer_id = layerId;
														layer.feature.properties.layer_table = layerTable;
														
														layer.on('contextmenu', function(e){
					  										var geom = feature.geometry; 
														    var props = feature.properties;
														    editedLayerProperties = props;
				
														     if (geom.type === 'MultiPolygon'){
														     	var newPolygon = "";
														        for (var i = 0; i < geom.coordinates.length; i++){
														            newPolygon = {
														               'type':'Polygon', 
														               'coordinates':geom.coordinates[i],
														               'properties': props
														               };
														        }
														        var createGeoJson = L.GeoJSON.geometryToLayer(newPolygon);
				
														        editableLayers.addLayer(createGeoJson);
														     } 
				  											document.querySelector(".leaflet-draw-edit-edit").click();
				  										});
													}
												  });
							}
							if(map.getZoom() >= layerMinZoom){
								layerControl.removeLayer(overlayLayers[layerId]);
								for(var i = 0; i < layersInList.length; i++){
									if(layerControl._layers[i].name === layerName){
										layerExists = true;
									}
								}
								if(!layerExists) {
									layerControl.addOverlay(overlayLayers[layerId], layerName);
								}
							}
						});
						break;
				}
			}else{
				$.getJSON(layerUrl + "&bbox=" + map.getBounds().toBBoxString(), function(data) {
					/* Check to see if layer was active before refreshing the page */
					if($.inArray( layerId, activeLayers ) > -1){
						overlayLayers[layerId] = new L.GeoJSON(data, {
											onEachFeature: function(feature, layer){
												layer.feature.properties.layer_id = layerId;
												layer.feature.properties.layer_table = layerTable;
											}
										  }).addTo(map);
					}else{
						overlayLayers[layerId] = new L.GeoJSON(data, {
											onEachFeature: function(feature, layer){
												layer.feature.properties.layer_id = layerId;
												layer.feature.properties.layer_table = layerTable;
												
												layer.on('contextmenu', function(e){
		  											editableLayers.addLayer(layer);
		  											document.querySelector(".leaflet-draw-edit-edit").click();
		  										});
											}
										  });
					}
					if(map.getZoom() >= layerMinZoom){
						layerControl.removeLayer(overlayLayers[layerId]);
						for(var i = 0; i < layersInList.length; i++){
							if(layerControl._layers[i].name === layerName){
								layerExists = true;
							}
						}
						if(!layerExists) {
							layerControl.addOverlay(overlayLayers[layerId], layerName);
						}
					}
				});
			}
	  	})(k);
	}
}

function saveEditedLayer(geojson, e){
	var newMultiPolygon = {};
	var updatedLayerGeojsonGeometry = {};
	var updatedLayerGeojsonId = "";
	var updatedLayerGeojsonTable = "";
	var updatedLayerGeojson = geojson.features[0].geometry;
		
	if (updatedLayerGeojson.type === 'Polygon'){
        for (var i = 0; i < updatedLayerGeojson.coordinates.length; i++){
            newMultiPolygon = {
               'type':'MultiPolygon', 
               'coordinates': [[updatedLayerGeojson.coordinates[i]]],
               'properties': {}
               };
             newMultiPolygon.crs =  {
				  "type": "name",
				  "properties": {
				    "name": "epsg:4326"
				    }
				 };
        }
        updatedLayerGeojsonGeometry = JSON.stringify(newMultiPolygon);
		updatedLayerGeojsonId = geojson.features[0].properties.gid;
		updatedLayerGeojsonTable = geojson.features[0].properties.layer_table;
		
		$.ajax({
		url: window.location.origin + '/csrfToken',
		success: function(response) {
			  $.ajax({
				  url: '/maplayers/saveEditedLayerRecord',
				  type:"post",
				  async: false,
				  data: {
				  	id: updatedLayerGeojsonId,
				  	geom: updatedLayerGeojsonGeometry,
				  	table: updatedLayerGeojsonTable
				  },
				   beforeSend: function(xhr, settings){
				      xhr.setRequestHeader('X-CSRF-Token', response._csrf);
				  },
				  success: function(data) {
				  	if(!data){
				  		location.reload();
				  	}else{
				  		editableLayers.clearLayers();
				  		removeLayers();
				  	}
				  },
				  done: function(data){
				  	
				  },
				  error: function(err) {
				     console.log(err);
				  }
				});
			}
		});
		return;
	}else{
		updatedLayerGeojson = geojson.features[0].geometry;
		updatedLayerGeojson.crs =  {
		  "type": "name",
		  "properties": {
		    "name": "epsg:4326"
		    }
		 };
		 
		updatedLayerGeojsonGeometry = JSON.stringify(updatedLayerGeojson);
		updatedLayerGeojsonId = geojson.features[0].properties.gid;
		updatedLayerGeojsonTable = geojson.features[0].properties.layer_table;
		
		$.ajax({
		url: window.location.origin + '/csrfToken',
		success: function(response) {
			  $.ajax({
				  url: '/maplayers/saveEditedLayerRecord',
				  type:"post",
				  data: {
				  	id: updatedLayerGeojsonId,
				  	geom: updatedLayerGeojsonGeometry,
				  	table: updatedLayerGeojsonTable
				  },
				   beforeSend: function(xhr, settings){
				      xhr.setRequestHeader('X-CSRF-Token', response._csrf);
				  },
				  success: function(data) {
				  	if(!data){
				  		location.reload();
				  	}else{
				  		editableLayers.clearLayers();
				  		removeLayers();
				  	}
				  },
				  done: function(data){
				  	
				  },
				  error: function(err) {
				     console.log(err);
				  }
				});
			}
		});
		return;
	} 
	
}


