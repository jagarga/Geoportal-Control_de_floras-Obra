function query(timeopen, timefinish) {

jsShowWindowLoad('');  //Mostramos al usuario una pantalla de bloqueo mientras se cargan los datos

//VARIABLES GLOBALES
var valores;
var zones;
//Variables para almacenar las coordenadas de carga
var loadxcoords = [];
var loadycoords = [];

			//función que devuelve el parametro pasado por la url desde el objeto padre
function getParameter(parameter){
			
                  // Obtiene la cadena completa de URL
                  var url = location.href;
                  /* Obtiene la posicion donde se encuentra el signo ?, ahi es donde empiezan los parametros */
                  var index = url.indexOf("?");
                  /* Obtiene la posicion donde termina el nombre del parametro e inicia el signo = */
                  index = url.indexOf(parameter,index) + parameter.length;
                  /* Verifica que efectivamente el valor en la posicion actuales el signo = */
                  if (url.charAt(index) == "="){
                  // Obtiene el valor del parametro
                  var result = url.indexOf("&",index);
                  if (result == -1){result=url.length;};
                  // Despliega el valor del parametro
                  var resultado = url.substring(index + 1,result);
				  return resultado;
                  //alert(resultado);
                  }

    } 

//NO SE USA
// Builds the HTML Table out of json data from Ivy restful service.
function obtaindata() {

    //Obtenemos las cabeceras
	var columns = addAllColumnHeaders(valores);	

    for (var i = 0; i < valores.length; i++) {

	
	var cellValue = valores[i]["x_loadcoord"];
	loadxcoords.push(cellValue);
	var cellValue2 = valores[i]["y_loadcoord"];
	loadycoords.push(cellValue2);	
	
    }
	
}

//NO SE USA
// obtiene todas las cabeceras
function addAllColumnHeaders(valores) {
    
	var columnSet = [];

    for (var i = 0; i < valores.length; i++) {
        var rowHash = valores[i];
        for (var key in rowHash) {
            if ($.inArray(key, columnSet) == -1) {
                columnSet.push(key);
            }
        }
    }

    return columnSet;
}



//Main function, connection with the romain database PRODUCTION DATA
/*
$(function() {

    $.ajax({
        type: "GET",
        //crossDomain: true,
        url: "http://fleetGIS:mangeonsdespatates@54.154.103.152:3000/truckdata?site=cvh&startdate=" + timeopen + "&enddate=" + timefinish,

        dataType: 'json',
		async: false,

        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa("fleetGIS" + ":" + "mangeonsdespatates"));
        },

        success: function(data, textStatus, jqXHR) {

            valores = data.rows;
           // obtaindata();

        },

        fail: function(jqXHR, textStatus, errorThrown) {
            if (console && console.log) {
                console.log("Something failed: " + textStatus);
            }
        }

    })
});
*/

$(function() {

    $.ajax({
        type: "GET",
        //crossDomain: true,
        url: "generarJSON.php",
        dataType: 'json',
		async: false,



        success: function(data, textStatus, jqXHR) {

					var caca = JSON.stringify(data)


            valores = data;
           // obtaindata();

        },

        fail: function(jqXHR, textStatus, errorThrown) {
            if (console && console.log) {
                console.log("Something failed: " + textStatus);
            }
			
        }

    })
});


jsRemoveWindowLoad();//Quitamos la pantalla de espera



return valores;
}



function queryzones() {

//VARIABLES GLOBALES
var zones;


//Main function, connection with the romain database ZONES
$(function() {
    
	//Origin
    $.ajax({
        type: "GET",
        //crossDomain: true,
        url: "http://fleetGIS:mangeonsdespatates@54.154.103.152:3000/origin?startdate=2000-04-04%2015:00&enddate=2100-04-04%2016:00",

        dataType: 'json',
		async: false,

        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa("fleetGIS" + ":" + "mangeonsdespatates"));
        },

        success: function(data, textStatus, jqXHR) {

            zones = data.rows[0]["st_asgeojson"];
			//alert(zones);

        },

        fail: function(jqXHR, textStatus, errorThrown) {
            if (console && console.log) {
                console.log("Something failed: " + textStatus);
            }
        }

    })
});


return zones;
}

