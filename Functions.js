	//FUNCIONES PARA LA GESTION DE LAS CAPAS DE PRODUCCION
	var featureselected = 0; //Variable para reiniciar la seleccion de features
	var indices = []; //Array para guardar los indices de cada cluster
	var indices2 = []; //variable auxiliar para clonar los indices
	var indices3 = []; //variable auxiliar para clonar los indices
	var valores = []; //Variable para almacenar los datos de la base de datos
	var valoresseleccionados = []; //Variable para almacenar los valores de los registros seleccionados
	var evento;
	//Arrays para almacenar los datos por zonas
	var orizones = [];
	var destizones = [];

	function drawzones(map, zones) {

	    alert(zones);

	    // Definicion del EPSG a utilizar
	    proj4.defs("EPSG:32631", "+proj=utm +zone=31 +ellps=WGS84 +datum=WGS84 +units=m +no_defs");

	    var extent = [166021.4431, 0.0000, 833978.5569, 9329005.1825];
	    var projection = ol.proj.get('EPSG:32631');
	    projection.setExtent(extent);

	    //Pasamos el string a JSON
	    data = JSON.parse(zones);

	    for (var i = 0; i < data["coordinates"][0][0].length; i++) {

	        //Extraemos las coordenadas y las pasamos a string
	        var coordinates = JSON.stringify(data["coordinates"][0][0][i]);
	        //Obtenemos latitudy longitud
	        var array = coordinates.split(',');
	        var lon = array[0].substr(1, array[0].length);
	        var lat = array[1].substr(0, array[1].length - 1);
	        //Reproyectamos las coordenadas
	        var reproyectada = ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:32631')
	            //Añadimos la coordenada reproyectada el Geojson inicial
	        data["coordinates"][0][0][i] = JSON.parse("[" + reproyectada[0] + "," + reproyectada[1] + "]");

	    }

	    zones = JSON.stringify(data);
	    //alert(JSON.stringify(data));

	    zonespre = '{"type": "FeatureCollection", "crs": {"type": "name","properties": {"name": "EPSG:32631"}},"features": [{"type": "Feature","geometry":';
	    zonespost = '}]}';
	    zones = zonespre + zones + zonespost;


	    var vectorSource = new ol.source.Vector({
	        features: (new ol.format.GeoJSON()).readFeatures(zones),
	        projection: 'EPSG:32631'
	    });

	    var vectorZones = new ol.layer.Vector({
	        source: vectorSource,
	        name: 'Zones',
	    });


	    //Capas overlay
	    var zoneslayer = new ol.layer.Group({
	        name: 'Zones',
	        layers: [
	            vectorZones
	        ]
	    })

	    map.addLayer(zoneslayer);



	    //Llamamos a la funcion del gestor de capas		
	    gestorcapasoverlays(zoneslayer);

	    //Hacemos zoom extension a las dos capas y las activamos			
	    var extent = ol.extent.createEmpty();
	    zoneslayer.getLayers().forEach(function(layer) {
	        ol.extent.extend(extent, layer.getSource().getExtent());
	        layer.setVisible('true');
	    });
	    map.getView().fit(extent, map.getSize());

	}

	function display(map, production, valores) {

	    /*Proj4js.defs["EPSG:32631"] = "+proj=utm +zone=31 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
		

	var projection = new ol.proj.Projection({
  code: 'EPSG:32631',
  // The extent is used to determine zoom level 0. Recommended values for a
  // projection's validity extent can be found at http://epsg.io/.
  extent: [166021.4431, 0.0000, 833978.5569, 9329005.1825],
  units: 'm'
  });
ol.proj.addProjection(projection);  */

	    //Minizamos el panel de seleccion de intervalos de tiempo
	    $("#taskpane").removeClass("panel-collapese collapse in");
	    $("#taskpane").addClass("panel-collapese collapse");
	    applyMargins();

	    var timeopen = $('#datetimepicker6 input').val();
	    var timefinish = $('#datetimepicker6 input').val();
	    $("#intervalo").html(timeopen + ' to ' + timefinish);
	    $("#intervalo").show(); //Mostramos el tiempo seleccionado

	    map.unByKey(evento); //Desactivamos el evento de crear popups por si ya hubiesemos consultado antes y se hubiera quedado abierto

	    proj4.defs("EPSG:32631", "+proj=utm +zone=31 +ellps=WGS84 +datum=WGS84 +units=m +no_defs");



	    //Popup
	    var popup = new ol.Overlay.Popup();
	    map.addOverlay(popup);

	    // Source and vector layer payloads
	    var vectorSource = new ol.source.Vector({
	        projection: 'EPSG:3857',
	    });

	    var vectorSource2 = new ol.source.Vector({
	        projection: 'EPSG:3857',
	    });

	    // Source and vector layer payloads per zone
	    var vectorSource3 = new ol.source.Vector({
	        projection: 'EPSG:3857',
	    });

	    var vectorSource4 = new ol.source.Vector({
	        projection: 'EPSG:3857',
	    });



	    //Clusters de datos
	    var clusterSource = new ol.source.Cluster({
	        distance: 40,
	        source: vectorSource
	    });

	    var clusterSource2 = new ol.source.Cluster({
	        distance: 40,
	        source: vectorSource2
	    });

	    var clusterSource3 = new ol.source.Cluster({
	        distance: 70,
	        source: vectorSource3
	    });

	    var clusterSource4 = new ol.source.Cluster({
	        distance: 70,
	        source: vectorSource4
	    });



	    //Capas vector payloads
	    var vectorLayer = new ol.layer.Vector({
	        source: clusterSource,
	        name: 'Cycle Loads',

	        style: function(feature) {
	            var size = feature.get('features').length;
	            var text = feature.get('features').length;
	            var text2 = 0;

	            //Recorremos las features de cada elemento y mediante su indice obtenemos a carga y la sumamos para mostrarsela al usuario
	            for (var i = 0; i < size; i++) {

	                var indice = feature.get('features')[i].getId()
	                text2 = parseFloat(text2) + parseFloat(valores[indice]["payload_truck"].replace(",", "."));

	            }


	            if (size < 30) {
	                size = 30;
	            }
	            if (size > 100) {
	                size = 100;
	            }

	            style = [new ol.style.Style({
	                image: new ol.style.Circle({
	                    radius: size / 3,
	                    stroke: new ol.style.Stroke({
	                        color: '#fff'
	                    }),
	                    fill: new ol.style.Fill({
	                        color: '#5AE5F5'
	                            //color: '#D4305C'			
	                    })
	                }),
	                text: new ol.style.Text({
	                    text: text2.toFixed(0).toString(),
	                    fill: new ol.style.Fill({
	                        color: '#fff'
	                    })
	                })
	            })];
	            return style;
	        },

	    });

	    vectorLayer.set('color', '#5AE5F5'); //Le ponemos a la capa la propiedad color para pdoer dibujar la leyenda

	    var vectorLayer2 = new ol.layer.Vector({
	        source: clusterSource2,
	        name: 'Cycle Dumps',

	        style: function(feature) {
	            var size = feature.get('features').length;
	            var text = feature.get('features').length;

	            var text2 = 0;

	            //Recorremos las features de cada elemento y mediante su indice obtenemos a carga y la sumamos para mostrarsela al usuario
	            for (var i = 0; i < size; i++) {

	                var indice = feature.get('features')[i].getId()
	                text2 = parseFloat(text2) + parseFloat(valores[indice]["payload_truck"].replace(",", "."));
	            }

	            if (size < 30) {
	                size = 30;
	            }
	            if (size > 100) {
	                size = 100;
	            }

	            style = [new ol.style.Style({
	                image: new ol.style.Circle({
	                    radius: size / 3,
	                    stroke: new ol.style.Stroke({
	                        color: '#fff'
	                    }),
	                    fill: new ol.style.Fill({
	                        //color: '#3399CC'
	                        color: '#86F73B'
	                    })
	                }),
	                text: new ol.style.Text({
	                    text: text2.toFixed(0).toString(),
	                    fill: new ol.style.Fill({
	                        color: '#fff'
	                    })
	                })
	            })];
	            return style;
	        },

	    });

	    vectorLayer2.set('color', '#86F73B'); //Le ponemos a la capa la propiedad color para pdoer dibujar la leyenda

	    var vectorLayer3 = new ol.layer.Vector({
	        source: clusterSource3,
	        name: 'Loads per Zone',

	        style: function(feature) {
	            var size = feature.get('features').length;
	            var text = feature.get('features').length;

	            var text2 = 0;
	            var text3;
	            var text4 = [];

	            //Recorremos las features de cada elemento y mediante su indice obtenemos a carga y la sumamos para mostrarsela al usuario
	            for (var i = 0; i < size; i++) {

	                var payload = feature.get('features')[i].getId();
	                text2 = parseFloat(text2) + parseFloat(payload);
	                text3 = feature.get('features')[i].get('name'); //obtenemos el ombre de la zona y comprobamos si ya esta para no añadirla o si no esta para añadirla

	                //comprobamos si existe la zona 

	                if (text4.contains(text3)) {

	                    //No hacemos nada

	                } else {

	                    text4.push(text3);

	                }

	            }

	            var text5 = text4[0];
	            //recorremos el array con las zonas y formamos un string con estos
	            for (var i = 1; i < (text4.length); i++) {

	                text5 = text5 + " \n " + text4[i];

	            }

	            size = (text2.toFixed(0)) / 40; //establecemos la relacion payload tamaño

	            if (size < 25) {
	                size = 25;
	            }
	            if (size > 40) {
	                size = 40;
	            }

	            style = [new ol.style.Style({
	                image: new ol.style.Circle({
	                    radius: size,
	                    stroke: new ol.style.Stroke({
	                        color: '#fff'
	                    }),
	                    fill: new ol.style.Fill({
	                        //color: '#3399CC'
	                        color: '#0B29EF'
	                    })
	                }),
	                text: new ol.style.Text({
	                    //text: text2.toString(),
	                    text: text5 + "\n" + (text2.toFixed(0).toString()),
	                    fill: new ol.style.Fill({
	                        color: '#fff'
	                    })
	                })
	            })];
	            return style;
	        },


	        visible: false,
	    });

	    vectorLayer3.set('color', '#0B29EF'); //Le ponemos a la capa la propiedad color para pdoer dibujar la leyenda

	    var vectorLayer4 = new ol.layer.Vector({
	        source: clusterSource4,
	        name: 'Dumps per Zone',

	        style: function(feature) {
	            var size = feature.get('features').length;
	            var text = feature.get('features').length;

	            var text2 = 0;
	            var text3;
	            var text4 = [];

	            //Recorremos las features de cada elemento y mediante su indice obtenemos a carga y la sumamos para mostrarsela al usuario
	            for (var i = 0; i < size; i++) {

	                var payload = feature.get('features')[i].getId();
	                text2 = parseFloat(text2) + parseFloat(payload);
	                text3 = feature.get('features')[i].get('name'); //obtenemos el nombre de la zona y comprobamos si ya esta para no añadirla o si no esta para añadirla

	                //comprobamos si existe la zona 

	                if (text4.contains(text3)) {

	                    //No hacemos nada

	                } else {

	                    text4.push(text3);

	                }

	            }

	            var text5 = text4[0];
	            //recorremos el array con las zonas y formamos un string con estos
	            for (var i = 1; i < (text4.length); i++) {

	                text5 = text5 + " \n " + text4[i];

	            }

	            size = (text2.toFixed(0)) / 40; //establecemos la relacion payload tamaño

	            if (size < 25) {
	                size = 25;
	            }
	            if (size > 40) {
	                size = 40;
	            }

	            style = [new ol.style.Style({
	                image: new ol.style.Circle({
	                    radius: size,
	                    stroke: new ol.style.Stroke({
	                        color: '#fff'
	                    }),
	                    fill: new ol.style.Fill({
	                        //color: '#3399CC'
	                        color: '#2D8B4C'
	                    })
	                }),
	                text: new ol.style.Text({
	                    text: text5 + "\n" + (text2.toFixed(0).toString()),
	                    fill: new ol.style.Fill({
	                        color: '#fff'
	                    })
	                })
	            })];
	            return style;
	        },


	        visible: false,
	    });

	    vectorLayer4.set('color', '#2D8B4C'); //Le ponemos a la capa la propiedad color para pdoer dibujar la leyenda

	    //Capas overlay
	    var production = new ol.layer.Group({
	        name: 'Production',
	        layers: [
	            vectorLayer, vectorLayer2, vectorLayer3, vectorLayer4
	        ]
	    })

	    map.addLayer(production);



	    //Llamamos a la funcion del gestor de capas		
	    gestorcapasoverlays(production);

	    obtaindata(valores, vectorSource, vectorSource2, production, 'EPSG:4326');
	    obtaindata2(valores, vectorSource3, vectorSource4, production, 'EPSG:4326');



	    //FUNCIONES EVENTOS DEL MAPA


	    //Evento para mostrar un menu con el click derecho
		
		//funcion del clcik derecho que abre una ventana nueva mostrando los graficos de los datos seleccionados
var graphics = function(obj){
	
	//alert(valoresseleccionados.length);
	var pagina = (obj.data.marker);
	window.open('Statistics.html?pagina=' + pagina);
	
}
	    //Variable con los elementos a introducir en el menu
		
		var menu1 = {
				text: 'Production',
				//icon: url_center
	            callback: graphics		
		}
		
				var menu2 = {
				text: 'Potential for improvement',
				//icon: url_center
	            callback: graphics		
		}
		
				var menu3 = {
				text: 'Machine',
				//icon: url_center
	            callback: graphics		
		}
		
				var menu4 = {
				text: 'Full Report',
				//icon: url_center
	            callback: graphics		
		}
		
	menu1.data = {
      marker: '1',
    };
	
		menu2.data = {
      marker: '2',
    };
	
		menu3.data = {
      marker: '3',
    };
	
		menu4.data = {
      marker: '4',
    };
	/*    var contextmenu_items = [{
	            text: 'Production',
				//icon: url_center
	            callback: graphics
	        }, {
	            text: 'Potential for improvement',
	            //icon: url_marker,
	            callback: graphics
	        },
			{
	            text: 'Machine',
	            //icon: url_marker,
	            callback: graphics
	        },
	        '-', // this is a separator
			{
	            text: 'Full Report',
	            //icon: url_marker,
	            callback: graphics
	        }
	    ];  */

	    //Creacion del objeto menu
	    var contextmenu = new ContextMenu({
	        width: 190,
	        default_items: false,
	        //items: contextmenu_items
	    });
	    map.addControl(contextmenu);


	    //Metodo al abrir el menu
	    contextmenu.on('open', function(e) {

	        //Primero comprobamos que se ha hecho click derecho sobre una feature, si no es asi se cierra el menu
	        var feature = map.forEachFeatureAtPixel(e.pixel, function(ft, l) {
	            return ft;
	        });

	        if (!feature) {
	            contextmenu.close() //cerramos el menu
	        } else {
				contextmenu.clear()  //Vaciamos el menu para no repetir elementos
				//Añadimos los items al menu
                contextmenu.push(menu1);
				contextmenu.push(menu2);
				contextmenu.push(menu3);
				contextmenu.push(menu4);
				
				
	            valoresseleccionados = seleccion(e, popup);

	        }

	    });

		



	    //Funcion para habilitar que el usuario seleccione cuando pasa el raton por encima de una feature				

	    var styledefecto;

	    map.on("pointermove", function(e) {

	        if (featureselected != 0) { //Si hay alguna feature seleccionada previa, devovemos su estilo al original

	            featureselected.setStyle(styledefecto);

	        }


	        map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {

	            if (featureselected != 0) { //Si hay alguna feature seleccionada previa, devovemos su estilo al original

	                featureselected.setStyle(styledefecto);

	            }

	            //Obtenemos la feature seleccionada
	            featureselected = map.forEachFeatureAtPixel(e.pixel, function(feature) {
	                return feature;
	            });

	            styledefecto = featureselected.getStyle(); //guardamos el estilo que tenia la feature antes de seleccionarla


	            //Ahora obteniendo la propiedad type del feature diferenciamos si la capa es por zona o movimineto simple para aplicarle un tamaño u otro
	            var type = featureselected.get('features')[0].get('type');

	            if (type == 'zone') {

	                var payload = featureselected.get('features')[0].getId();
	                var divisor = 1; //divisor para dividir el size en el stilo
	                text2 = parseFloat(payload);

	                size = (text2.toFixed(0)) / 40; //establecemos la relacion payload tamaño

	                if (size < 25) {
	                    size = 25;
	                }
	                if (size > 40) {
	                    size = 40;
	                }



	            } else {

	                var divisor = 3; //divisor para dividir el size en el stilo
	                var size = featureselected.get('features').length;
	                var text2 = 0;
	                if (size < 30) {
	                    size = 30;
	                }
	                if (size > 100) {
	                    size = 100;
	                }

	            }

	            featureselected.setStyle(new ol.style.Style({
	                image: new ol.style.Circle({
	                    radius: size / divisor,
	                    stroke: new ol.style.Stroke({
	                        color: '#EB7070',
	                        width: 2,
	                    }),
	                    fill: new ol.style.Fill({
	                        //color: '#3399CC'
	                        color: '#FAF1F1'
	                    })
	                }),
	                /*text: new ol.style.Text({
	                    text:  text2.toFixed(0).toString(),
	                    fill: new ol.style.Fill({
	                        color: '#fff'
	                    })
	                })*/
	            }))
	        })
	    });



	    //Evento para mostrar un popup con informacion de cada feature
	    evento = map.on("dblclick", function(e) {

		
	        map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {

			
				var text3;
	            var text4 = [];
	            var type = featureselected.get('features')[0].get('type'); //Obtenemos el tipo de geometria
                var size = feature.get('features').length;
						

	            //Recorremos las features de cada elemento y mediante su indice obtenemos a carga y la sumamos para mostrarsela al usuario
	            for (var i = 0; i < size; i++) {

	                text3 = feature.get('features')[i].get('name'); //obtenemos el nombre de la zona y comprobamos si ya esta para no añadirla o si no esta para añadirla

	                //comprobamos si existe la zona 

	                if (text4.contains(text3)) {

	                    //No hacemos nada

	                } else {

	                    text4.push(text3);

	                }

	            }

	            var text5 = text4[0];
	            //recorremos el array con las zonas y formamos un string con estos
	            for (var i = 1; i < (text4.length); i++) {

	                text5 = text5 + " \ " + text4[i];

	            }	
						
						
	            showpopup(feature, layer, popup, e, text5); //Funcion que recibe las features seleccionadas y mustra su informacion basica en un popup
	        })

	    });



	    //Evento para mostrar solo la información seleccionada por el usuario, tanto el flujo de entrada como el de salida
	    evento = map.on("singleclick", function(e) {

	        var featuresclick = [];
	        popup.hide();

	        map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {

	            featuresclick.push(feature); //guardamos las features seleccionadoas, para posteriormente saber si no se ha seleccionado ninguna

	            indices2 = []; //Vaciamos la variable auxiliar de indices
	            valoresseleccionados = []; //Vaciamos la variable de valores seleccionados
	            //Ahora obteniendo la propiedad type del feature diferenciamos si la capa es por zona o movimineto simple para aplicarle un tamaño u otro
	            var t2 = 0; //Variable para almacenar el tiempo en segundos
	            var indice2 = 0;
	            var sizefeatures = featureselected.get('features').length;

	            var type = featureselected.get('features')[0].get('type'); //Obtenemos el tipo de geometria

	            if (type == 'zone') {


	                for (var k = 0; k < sizefeatures; k++) {

	                    //Obtenemos los datos de las feature seleccionadas	            
	                    indice2 = featureselected.get('features')[k].get('id');
	                    indices2 = indice2.split(","); //guardamos un array con todos los indices correspondientes al flow_id (id de cada flujo)

	                    for (var i = 0; i < indices2.length; i++) { //Buscamos en los datos de la consulta "valores" las filas correspondiententes a lo selecionado para guardarlas en otro array nuevo

	                        for (var j = 0; j < valores.length; j++) {

	                            if (valores[j]["flow_id"] == indices2[i]) {

	                                valoresseleccionados.push(valores[j]);

	                            }

	                        }
	                    }

	                }
	                //alert(JSON.stringify(valoresseleccionados));

	                //Obtenemos las visibilidad de las capas, para dejar la misma cuando se cambien los datos vistos sobre el mapa
	                var visibility = vectorLayer.getVisible();
	                var visibility2 = vectorLayer2.getVisible();
	                var visibility3 = vectorLayer3.getVisible();
	                var visibility4 = vectorLayer4.getVisible();


	                vectorLayer.getSource().getSource().clear(); //Vaciamos los source de las capas
	                vectorLayer2.getSource().getSource().clear();
	                vectorLayer3.getSource().getSource().clear();
	                vectorLayer4.getSource().getSource().clear();
	                obtaindata2(valoresseleccionados, vectorSource3, vectorSource4, production, 'EPSG:4326'); //Llamamos al método que creaba las capas pero esta vez pasandole como valores solo lo seleccionado
	                obtaindata(valoresseleccionados, vectorSource, vectorSource2, production, 'EPSG:4326');


	                //Volvemos a dejar la visibilidad de las capas como estaban antes
	                vectorLayer.setVisible(visibility);
	                vectorLayer2.setVisible(visibility2);
	                vectorLayer3.setVisible(visibility3);
	                vectorLayer4.setVisible(visibility4);

	                //Dejamos el check del input radio de html como este la capa
	                $('#check0').prop("checked", visibility)
	                $('#check1').prop("checked", visibility2)
	                $('#check2').prop("checked", visibility3)
	                $('#check3').prop("checked", visibility4)

	            } else {


								

	                for (var k = 0; k < sizefeatures; k++) {

	                    //Obtenemos los datos de las feature seleccionadas	            
	                    indice2 = featureselected.get('features')[k].getId();

	                        for (var j = 0; j < valores.length; j++) {

	                            if (valores[j]["flow_id"] == indice2) {

	                                valoresseleccionados.push(valores[j]);

	                            }

	                        }

	                }
	                //alert(JSON.stringify(valoresseleccionados));

	                //Obtenemos las visibilidad de las capas, para dejar la misma cuando se cambien los datos vistos sobre el mapa
	                var visibility = vectorLayer.getVisible();
	                var visibility2 = vectorLayer2.getVisible();
	                var visibility3 = vectorLayer3.getVisible();
	                var visibility4 = vectorLayer4.getVisible();


	                vectorLayer.getSource().getSource().clear(); //Vaciamos los source de las capas
	                vectorLayer2.getSource().getSource().clear();
	                vectorLayer3.getSource().getSource().clear();
	                vectorLayer4.getSource().getSource().clear();
	                obtaindata2(valoresseleccionados, vectorSource3, vectorSource4, production, 'EPSG:4326'); //Llamamos al método que creaba las capas pero esta vez pasandole como valores solo lo seleccionado
	                obtaindata(valoresseleccionados, vectorSource, vectorSource2, production, 'EPSG:4326');


	                //Volvemos a dejar la visibilidad de las capas como estaban antes
	                vectorLayer.setVisible(visibility);
	                vectorLayer2.setVisible(visibility2);
	                vectorLayer3.setVisible(visibility3);
	                vectorLayer4.setVisible(visibility4);

	                //Dejamos el check del input radio de html como este la capa
	                $('#check0').prop("checked", visibility)
	                $('#check1').prop("checked", visibility2)
	                $('#check2').prop("checked", visibility3)
	                $('#check3').prop("checked", visibility4)
				

	            }


	            //showpopup (feature, layer, popup, e); //Funcion que recibe las features seleccionadas y mustra su informacion basica en un popup

	        })



	        //Si el numero de geometrias seleccionadas es de 0, volvemos a mostrar todos los datos sobre el mapa usando el array original de datos "valores"
	        if (featuresclick.length == 0 & valoresseleccionados.length != 0) {

	            //Obtenemos las visibilidad de las capas, para dejar la misma cuando se cambien los datos vistos sobre el mapa
	            var visibility = vectorLayer.getVisible();
	            var visibility2 = vectorLayer2.getVisible();
	            var visibility3 = vectorLayer3.getVisible();
	            var visibility4 = vectorLayer4.getVisible();

	            vectorLayer.getSource().getSource().clear(); //Vaciamos los source de las capas
	            vectorLayer2.getSource().getSource().clear();
	            vectorLayer3.getSource().getSource().clear();
	            vectorLayer4.getSource().getSource().clear();
	            obtaindata(valores, vectorSource, vectorSource2, production, 'EPSG:4326');
	            obtaindata2(valores, vectorSource3, vectorSource4, production, 'EPSG:4326');


	            //Volvemos a dejar la visibilidad de las capas como estaban antes
	            vectorLayer.setVisible(visibility);
	            vectorLayer2.setVisible(visibility2);
	            vectorLayer3.setVisible(visibility3);
	            vectorLayer4.setVisible(visibility4);

	            //Dejamos el check del input radio de html como este la capa
	            $('#check0').prop("checked", visibility)
	            $('#check1').prop("checked", visibility2)
	            $('#check2').prop("checked", visibility3)
	            $('#check3').prop("checked", visibility4)

	        }

	    });



	    //Ponemos como no visibles por defector las capas de loads y dumps simpels
	    vectorLayer.setVisible(false);
	    vectorLayer2.setVisible(false);

	    $('#check0').prop("checked", false)
	    $('#check1').prop("checked", false)

	    return production; //Devolvemos al mapa original el grupo de capas de produccion

	}



	//Funcion que recibe las features seleccionadas y muestra su informacion basica en un popup
	function showpopup(feature, layer, popup, e, name) {

valoresseleccionados = seleccion(e, popup); //Obtenemos los valores seleccionados para pasarselos a la pagina de estadisticas

	    indices = []; //Vaciamos la variable auxiliar de indices

	    var payload = 0;
	    var distanceloaded = 0;
	    var distanceempty = 0;
	    var time = "00:00:00";
	    var size = featureselected.get('features').length;


	    //Ahora obteniendo la propiedad type del feature diferenciamos si la capa es por zona o movimineto simple para aplicarle un tamaño u otro
	    var type = featureselected.get('features')[0].get('type');
	    var t2 = 0; //Variable para almacenar el tiempo en segundos
	    var indice = 0;

	    if (type == 'zone') {


	        //Recorremos las features de cada elemento y mediante su indice obtenemos los datos
	        for (var i = 0; i < size; i++) {

	            indice = featureselected.get('features')[i].getId();

	            indices.push(indice); //guardamos un array con todos los indices
	            payload = parseFloat(payload) + parseFloat(indice);
	            //distanceloaded = parseFloat(distanceloaded) + parseFloat(valores[indice]["distance_loaded"]);
	            //distanceempty = parseFloat(distanceempty) + parseFloat(valores[indice]["distance_empty"]);

	            //Sumamos los ciclos de tiempo
	            t2 = parseFloat(t2) + parseFloat(featureselected.get('features')[i].get('time'));


	        }

	        time = sumTimes(time, t2.toString());


	        //Obtenemos el numero de movimientos de lo seleccionado            
	        var indice2 = featureselected.get('features')[0].get('id');
	        var indices2 = indice2.split(","); //guardamos un array con todos los indices correspondientes al flow_id (id de cada flujo)
	        size = indices2.length;

	        indices3 = indices2; //variable con los id para pasarselos al metodo que hace el grafico 

	    } else {

	        //Recorremos las features de cada elemento y mediante su indice obtenemos los datos
	        for (var i = 0; i < size; i++) {

	            indice = featureselected.get('features')[i].getId();

	            indices.push(indice); //guardamos un array con todos los indices
	            payload = parseFloat(payload) + parseFloat(valores[indice]["payload_truck"].replace(",", "."));
	            //distanceloaded = parseFloat(distanceloaded) + parseFloat(valores[indice]["distance_loaded"]);
	            //distanceempty = parseFloat(distanceempty) + parseFloat(valores[indice]["distance_empty"]);

	            //Sumamos los ciclos de tiempo
	            t2 = parseFloat(t2) + parseFloat(valores[indice]["cycle_time"]);



	        }
	        time = sumTimes(time, t2.toString());
	        indices3 = indices; //variable con los id para pasarselos al metodo que hace el grafico 
	        name = 'Selected data'; //Si el Popup no es sobre las zonas ponemos un titulo fijo
		
		}


	    var content = '<dt>Number of loads</dt><dd>' + size + '</dd><dt>Payload</dt><dd>' + payload.toFixed(0) + '</dd><dt>Cycle Time</dt><dd>' + time + '</dd>';

	    var plot = '<br><div id="grafico" style="height:350px;width:270px; display: none;"></div>';
	    tipo = type;
		//var boton = ' <div class="btn-group">  <button class="btn btn-default dropdown-toggle" data-toggle="dropdown">Show Statistics <span class="caret"></span></button>   <ul class="dropdown-menu"> <li><a href="#" id="action1-1">Production</a></li>  <li><a href="#" id="action1-2">Potential for improvement</a></li>   <li><a href="#" id="action1-3">Machine</a></li>  <li><a href="#" id="action1-4">Full Report</a></li> </ul>  </div> ';

		popup.show(e.coordinate, '<div class="panel panel-primary"><div class="panel-heading"><h3 class="panel-title"><center>' + name + '</center></h3></div><div class="panel-body"><dl class="dl-horizontal">' + content + '</dl></div></div>'  + '<center><b>STATISTICS</b></center><br><center><div class="btn-group-vertical" role="group" aria-label="..."><button type="button" class="btn btn-default" onclick= window.open("Statistics.html?pagina=1"); >Production</button>' + '<button type="button" class="btn btn-default" onclick= window.open("Statistics.html?pagina=2"); >Potential for improvement</button>' + '<button type="button" class="btn btn-default" onclick= window.open("Statistics.html?pagina=3"); >Machine</button>' + '<button type="button" class="btn btn-default" onclick= window.open("Statistics.html?pagina=4"); >Full Report</button></div></center>' 
);
	    //popup.show(e.coordinate, '<div class="panel panel-primary"><div class="panel-heading"><h3 class="panel-title"><center>' + name + '</center></h3></div><div class="panel-body"><dl class="dl-horizontal">' + content + '</dl></div></div>' + '<center><button type="button" class="btn btn-default" onclick=" statistics(valores, indices3, tipo); ">Show statistics</button></center>' + plot);


	    indices = []; //Vaciamos la variable de indices



	}




	//funcion para recorrer los datos de la peticion a la base de datos y crear la capa de payload por zona.	
	function obtaindata2(valores, vectorSource3, vectorSource4, production, projection) {


	    var auxzones = []; //variable auxiliar para localziar la poscion de la zona
	    var auxzones2 = [];
	    orizones = [];
	    destizones = [];

	    // recorremos los valores devueltos por la base de datos y creamos un array con una fila por cada zona con sus coordendas y su carga total
	    for (var i = 0; i < valores.length; i++) {

	        //obtenemos las zonas
	        var zoneorigin = (valores[i]["origin"]);
	        var zonedestin = (valores[i]["destination"]);
	        //Obtenemos las toneladas cargadas
	        var payload = (valores[i]["payload_truck"]).replace(",", ".");

	        //obtenemos las coordenadas y el tiempo de ciclo
	        var xload = (valores[i]["x_loadcoord"]).replace(",", ".");
	        var xdump = (valores[i]["x_dumpcoord"]).replace(",", ".");

	        var yload = (valores[i]["y_loadcoord"]).replace(",", ".");
	        var ydump = (valores[i]["y_dumpcoord"]).replace(",", ".");

	        //Tiempo de ciclo
	        var cycletime = (valores[i]["cycle_time"]);

	        //Identificador de flujo
	        var id = (valores[i]["flow_id"]);

	        //comprobamos si existe la zona 

	        if (auxzones.contains(zoneorigin)) { //si existe le sumamos la carga

	            var pos = auxzones.indexOf(zoneorigin);
	            orizones[pos][1] = parseFloat(orizones[pos][1]) + parseFloat(payload);
	            orizones[pos][4] = parseInt(orizones[pos][4]) + parseInt(cycletime);
	            orizones[pos][5] = (orizones[pos][5]) + ',' + (id);

	        } else { //si no existe creamos la fila perteniente a esa zona

	            auxzones.push(zoneorigin);
	            orizones.push([zoneorigin, payload, xload, yload, cycletime, id]);

	        }




	        //lo mismo pero con el destino
	        if (auxzones2.contains(zonedestin)) { //si existe le sumamos la carga

	            var pos = auxzones2.indexOf(zonedestin);
	            destizones[pos][1] = parseFloat(destizones[pos][1]) + parseFloat(payload);
	            destizones[pos][4] = parseInt(destizones[pos][4]) + parseInt(cycletime);
	            destizones[pos][5] = (destizones[pos][5]) + ',' + (id);


	        } else { //si no existe creamos la fila perteniente a esa zona

	            auxzones2.push(zonedestin);
	            destizones.push([zonedestin, payload, xdump, ydump, cycletime, id]);

	        }

	    }

	    var features2 = [];
	    var features3 = [];

	    for (var i = 0; i < orizones.length; i++) {

	        //creamos geometrias coordenadas de carga y descarga
	        geom3 = new ol.geom.Point(
	            ol.proj.transform([parseFloat(orizones[i][2]), parseFloat(orizones[i][3])], 'EPSG:4326', 'EPSG:3857'),
	            //ol.proj.fromLonLat([xload.replace(",", "."), yload.replace(",", ".")]),
	            parseFloat(orizones[i][1])
	        );
	        //alert(geom.getLayout());

	        var feature2 = new ol.Feature(geom3);
	        feature2.setId(parseFloat(orizones[i][1]));
	        feature2.set('name', orizones[i][0]);
	        feature2.set('time', orizones[i][4]);
	        feature2.set('id', orizones[i][5]);
	        feature2.set('type', 'zone');
	        features2.push(feature2);


	    }

	    for (var i = 0; i < destizones.length; i++) {

	        //creamos geometrias coordenadas de carga y descarga
	        geom4 = new ol.geom.Point(
	            ol.proj.transform([parseFloat(destizones[i][2]), parseFloat(destizones[i][3])], 'EPSG:4326', 'EPSG:3857'),
	            //ol.proj.fromLonLat([xload.replace(",", "."), yload.replace(",", ".")]),
	            parseFloat(destizones[i][1])
	        );
	        //alert(geom.getLayout());

	        var feature3 = new ol.Feature(geom4);
	        feature3.setId(parseFloat(destizones[i][1]));
	        feature3.set('name', destizones[i][0]);
	        feature3.set('time', destizones[i][4]);
	        feature3.set('id', destizones[i][5]);
	        feature3.set('type', 'zone');
	        features3.push(feature3);


	    }

	    //añadimos las features a la capa
	    vectorSource3.addFeatures(features2);
	    vectorSource4.addFeatures(features3);

	}

	
	//funcion para recorrer los datos de la peticion a la base de datos y crer la capa de payloads. 
	function obtaindata(valores, vectorSource, vectorSource2, production, projection) {


	    //Variables para almacenar las coordenadas de carga


	    var i, lat, lon, geom, feature, features = [],
	        feature2, features2 = [];

	    // recoremos los valores devueltos por la base de datos
	    for (var i = 0; i < valores.length; i++) {

	        //obtenemos las coordenadas
	        var xload = (valores[i]["x_loadcoord"]).replace(",", ".");
	        var xdump = (valores[i]["x_dumpcoord"]).replace(",", ".");

	        var yload = (valores[i]["y_loadcoord"]).replace(",", ".");
	        var ydump = (valores[i]["y_dumpcoord"]).replace(",", ".");
			

	        //Obtenemos las toneladas cargadas
	        var payload = parseFloat(valores[i]["payload_truck"].replace(",", "."));

	        if (xload != 0 & yload != 0 & xdump != 0 & ydump != 0) {

	            //creamos geometrias coordenadas de carga y descarga
	            geom = new ol.geom.Point(
	                ol.proj.transform([parseFloat(xload), parseFloat(yload)], 'EPSG:4326', 'EPSG:3857'),
	                //ol.proj.fromLonLat([xload.replace(",", "."), yload.replace(",", ".")]),
	                payload
	            );
	            //alert(geom.getLayout());

	            feature = new ol.Feature(geom);
	            feature.setId(i);
	            feature.set('type', 'load');
	            features.push(feature);


	            geom2 = new ol.geom.Point(
	                ol.proj.transform([parseFloat(xdump), parseFloat(ydump)], 'EPSG:4326', 'EPSG:3857'),
	                //ol.proj.fromLonLat([xdump.replace(",", "."), ydump.replace(",", ".")]),
	                payload
	            );


	            feature2 = new ol.Feature(geom2);
	            feature2.setId(i);
	            feature2.set('type', 'dump');
	            //feature2.setStyle(style2);
	            features2.push(feature2);

	        }
	    }

	    //añadimos los features a las capas
	    vectorSource.addFeatures(features);
	    vectorSource2.addFeatures(features2);


	    //Hacemos zoom extension a las dos capas y las activamos			
	    var extent = ol.extent.createEmpty();
	    production.getLayers().forEach(function(layer) {
	        ol.extent.extend(extent, layer.getSource().getSource().getExtent());
	        layer.setVisible('true');
	    });
	    map.getView().fit(extent, map.getSize());


	    /*var london2 = ol.proj.transform([-0.12755, 51.507222], 'EPSG:4326', 'EPSG:3857');
	doPan(london2);*/
	
	}

	//Funcion para mostrar un grafico del peso dentro del Popup     FUNCION ACTUALMENTE SIN USAR
	function statistics(valores, indices, type) {

	    $("#grafico").show(); //hacemos visible el grafico

	    var nombres = []; //Array para guardar los nombres de las maquinas
	    var s1 = []; //Array para guardar los valores del grafico
	    var ticks = []; //Array para guardar los nombres

	    //Diferenciamos si la capa es por zona o movimineto simple
	    if (type == 'zone') {

	        for (var i = 0; i < indices.length; i++) { //Buscamos en los datos de la consulta "valores" las filas correspondiententes a lo selecionado para guardarlas en otro array nuevo

	            for (var j = 0; j < valores.length; j++) {

	                if (valores[j]["flow_id"] == indices[i]) {

	                    var nombre = valores[j]["sn"];

	                    //comprobamos si el nombre existe y si no lo guardamos, para obtener un array con los nombres sin repetir
	                    if (nombres.contains(nombre)) {

	                    } else {

	                        nombres.push(nombre);

	                    }

	                }

	            }
	        }


	        //recorremos el shape de nombres para obtener para cada nombre todas sus cargas utiles y sumarlas
	        for (var i = 0; i < nombres.length; i++) {

	            var payload = 0;
	            ticks.push(nombres[i]);


	            for (var j = 0; j < indices.length; j++) {

	                for (var k = 0; k < valores.length; k++) {

	                    if (valores[k]["flow_id"] == indices[j]) {

	                        if (valores[k]["sn"] == nombres[i]) {

	                            var peso = valores[k]["payload_truck"]

	                            payload = parseFloat(payload) + parseFloat(peso.replace(",", "."));
	                        }
	                    }
	                }

	            }

	            s1.push(payload);

	        }




	    } else {


	        for (var i = 0; i < indices.length; i++) { //recorremos todos los datos y creamos un array con los nombres de las maquinas sin repetir

	            var nombre = valores[indices[i]]["sn"];

	            //comprobamos si el nombre existe y si no lo guardamos, para obtener un array con los nombres sin repetir
	            if (nombres.contains(nombre)) {

	            } else {

	                nombres.push(nombre);

	            }

	        }

	        //recorremos el shape de nombres para obtener para cada nombre todas sus cargas utiles y sumarlas
	        for (var i = 0; i < nombres.length; i++) {

	            var payload = 0;
	            ticks.push(nombres[i]);


	            for (var j = 0; j < indices.length; j++) {

	                if (valores[indices[j]]["sn"] == nombres[i]) {

	                    var peso = valores[indices[j]]["payload_truck"]

	                    payload = parseFloat(payload) + parseFloat(peso.replace(",", "."));

	                }

	            }

	            s1.push(payload);

	        }

	    }

	    $.jqplot.config.enablePlugins = true;
	    //var s1 = [2, 6, 7, 10];
	    //var ticks = ['a', 'b', 'c', 'd'];

	    plot1 = $.jqplot('grafico', [s1], {
	        title: 'Payload per truck',
	        // Only animate if we're not using excanvas (not in IE 7 or IE 8)..
	        animate: !$.jqplot.use_excanvas,
	        seriesDefaults: {
	            renderer: $.jqplot.BarRenderer,
	            pointLabels: {
	                show: true
	            }
	        },
	        axesDefaults: {
	            tickRenderer: $.jqplot.CanvasAxisTickRenderer,

	        },

	        axes: {
	            xaxis: {
	                renderer: $.jqplot.CategoryAxisRenderer,
	                ticks: ticks,
	                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
	                tickOptions: {
	                    angle: 90,
	                    labelPosition: 'middle',
	                    fontSize: '9pt'
	                },

	            }
	        },
	        highlighter: {
	            show: false
	        }
	    });




	}


	//funcion para dibujar los simbolos de la leyenda
	function draw(element, ancho, color) {

	    var c = document.getElementById(element);
	    var ctx = c.getContext("2d");
	    ctx.beginPath();
	    ctx.arc(10, 12, 8, 0, 2 * Math.PI);
	    ctx.strokeStyle = "#FFFFFF";
	    ctx.stroke();
	    ctx.fillStyle = color;
	    ctx.fill();

	}

	//Funcion para a partir del evento pasado se obtenga los features seleccionados y los datos de la base de datos unicamente de estos features seleccionados
	function seleccion(e, popup) {

	    var featuresclick = [];
	    popup.hide();

	    map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {

	        featuresclick.push(feature); //guardamos las features seleccionadoas, para posteriormente saber si no se ha seleccionado ninguna

	        indices2 = []; //Vaciamos la variable auxiliar de indices
	        valoresseleccionados = []; //Vaciamos la variable de valores seleccionados
	        //Ahora obteniendo la propiedad type del feature diferenciamos si la capa es por zona o movimineto simple para aplicarle un tamaño u otro
	        var t2 = 0; //Variable para almacenar el tiempo en segundos
	        var indice2 = 0;
	        var sizefeatures = featureselected.get('features').length;

	        var type = featureselected.get('features')[0].get('type'); //Obtenemos el tipo de geometria

	        if (type == 'zone') {


	            for (var k = 0; k < sizefeatures; k++) {

	                //Obtenemos los datos de las feature seleccionadas	            
	                indice2 = featureselected.get('features')[k].get('id');
	                indices2 = indice2.split(","); //guardamos un array con todos los indices correspondientes al flow_id (id de cada flujo)

	                for (var i = 0; i < indices2.length; i++) { //Buscamos en los datos de la consulta "valores" las filas correspondiententes a lo selecionado para guardarlas en otro array nuevo

	                    for (var j = 0; j < valores.length; j++) {

	                        if (valores[j]["flow_id"] == indices2[i]) {

	                            valoresseleccionados.push(valores[j]);

	                        }

	                    }
	                }

	            }

	        }
	    })

	    return valoresseleccionados;
	}

	
	
				
//FUNCIONES PARA MOSTRAR O BORRAR UNA PANTALLA DE BLOQUEO MIENTRAS SE CARGAN LOS DATOS
function jsRemoveWindowLoad() {
	// eliminamos el div que bloquea pantalla
    $("#WindowLoad").remove();

}

function jsShowWindowLoad(mensaje) {
	//eliminamos si existe un div ya bloqueando
    jsRemoveWindowLoad();
   
    //si no enviamos mensaje se pondra este por defecto
    if (mensaje === undefined) mensaje = "Procesando la información<br>Espere por favor";
   
    //centrar imagen gif
    height = 20;//El div del titulo, para que se vea mas arriba (H)
    var ancho = 0;
    var alto = 0;
	
	//obtenemos el ancho y alto de la ventana de nuestro navegador, compatible con todos los navegadores
    if (window.innerWidth == undefined) ancho = window.screen.width;
    else ancho = window.innerWidth;
    if (window.innerHeight == undefined) alto = window.screen.height;
    else alto = window.innerHeight;
    
	//operación necesaria para centrar el div que muestra el mensaje
    var heightdivsito = alto/2 - parseInt(height)/2;//Se utiliza en el margen superior, para centrar
	
   //imagen que aparece mientras nuestro div es mostrado y da apariencia de cargando
    imgCentro = "<div style='text-align:center;height:" + alto + "px;'><div  style='color:#000;margin-top:" + heightdivsito + "px; font-size:20px;font-weight:bold'>" + mensaje + "</div><img  src='img/load.gif'></div>";

        //creamos el div que bloquea grande------------------------------------------
        div = document.createElement("div");
        div.id = "WindowLoad"
        div.style.width = ancho + "px";
        div.style.height = alto + "px";
        $("body").append(div);

        //creamos un input text para que el foco se plasme en este y el usuario no pueda escribir en nada de atras
        input = document.createElement("input");
        input.id = "focusInput";
        input.type = "text"

		//asignamos el div que bloquea
        $("#WindowLoad").append(input);
        
		//asignamos el foco y ocultamos el input text 
        $("#focusInput").focus();
        $("#focusInput").hide();
		
		//centramos el div del texto
        $("#WindowLoad").html(imgCentro);

}
	
	
	//FUNCIONES PARA SUMAR TIEMPOS

	function padNmb(nStr, nLen) {
	    var sRes = String(nStr);
	    var sCeros = "0000000000";
	    return sCeros.substr(0, nLen - sRes.length) + sRes;
	}

	function stringToSeconds(tiempo) {
	    var sep1 = tiempo.indexOf(":");
	    var sep2 = tiempo.lastIndexOf(":");
	    var hor = tiempo.substr(0, sep1);
	    var min = tiempo.substr(sep1 + 1, sep2 - sep1 - 1);
	    var sec = tiempo.substr(sep2 + 1);
	    return (Number(sec) + (Number(min) * 60) + (Number(hor) * 3600));
	}

	function secondsToTime(secs) {
	    var hor = Math.floor(secs / 3600);
	    var min = Math.floor((secs - (hor * 3600)) / 60);
	    var sec = secs - (hor * 3600) - (min * 60);
	    return padNmb(hor, 2) + ":" + padNmb(min, 2) + ":" + padNmb(sec, 2);
	}

	function substractTimes(t1, t2) {
	    var secs1 = stringToSeconds(t1);
	    var secs2 = stringToSeconds(t2);
	    var secsDif = secs1 - secs2;
	    return secondsToTime(secsDif);
	}

	function sumTimes(t1, t2) {
	    var secs1 = stringToSeconds(t1);
	    var secs2 = stringToSeconds(t2);
	    var secsSum = secs1 + secs2;
	    return secondsToTime(secsSum);
	}


	//Metodos para os distintos tipos de zoom
	function doPan(location) {
	    // pan from the current center
	    var pan = ol.animation.pan({
	        source: map.getView().getCenter()
	    });
	    map.beforeRender(pan);
	    // when we set the new location, the map will pan smoothly to it
	    map.getView().setCenter(location);
	}

	Array.prototype.contains = function(elem) {
	    for (var i in this) {
	        if (this[i] == elem) return true;
	    }
	    return false;
	}


	/**
	 * Array.prototype.[method name] allows you to define/overwrite an objects method
	 * needle is the item you are searching for
	 * this is a special variable that refers to "this" instance of an Array.
	 * returns true if needle is in the array, and false otherwise
	 */
	Array.prototype.contains = function(needle) {
	    for (i in this) {
	        if (this[i] == needle) return true;
	    }
	    return false;
	}