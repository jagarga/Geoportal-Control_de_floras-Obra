<?php

$server = "mysql.hostinger.es";
$user = "u390172309_javi";
$pass = "bergerat";
$bd = "u390172309_test";
$resultado = $_POST['timeopen'];
$resultado2 = $_POST['timefinish'];
//Creamos la conexión
$conexion = mysqli_connect($server, $user, $pass,$bd) 
or die("Ha sucedido un error inexperado en la conexion de la base de datos");

//generamos la consulta
$sql = "SELECT
T1.flow_id, T1.origin,T1.destination, T1.dumper_id,T1.loader_id, T1.load_x,T1.load_y, T1.load_z, T1.dump_x,T1.dump_y, T1.dump_z, T1.time,T2.analysis_id, T2.value AS 'Payload',  T3.value AS 'Cycle_time', T4.value AS 'Load_time', T5.value AS 'Travel_time_loaded', T6.value AS 'Stopped_time_loaded', T7.value AS 'Travel_time_empty', T8.value AS 'Stopped_time_empty'
FROM
 Cycle_Data T1
INNER JOIN Analysis_Data T2 ON T1.flow_id = T2.flow_id 
INNER JOIN Analysis_Data T3 ON T2.flow_id = T3.flow_id
INNER JOIN Analysis_Data T4 ON T3.flow_id = T4.flow_id
INNER JOIN Analysis_Data T5 ON T4.flow_id = T5.flow_id
INNER JOIN Analysis_Data T6 ON T5.flow_id = T6.flow_id
INNER JOIN Analysis_Data T7 ON T6.flow_id = T7.flow_id
INNER JOIN Analysis_Data T8 ON T7.flow_id = T8.flow_id
WHERE (T2.value_attribute ='none') AND (T3.value_attribute ='cycle_time') AND (T4.value_attribute ='load_time') AND (T5.value_attribute ='travel_time_loaded') AND (T6.value_attribute ='stopped_time_loaded') AND (T7.value_attribute ='travel_time_empty') AND (T8.value_attribute ='stopped_time_empty') AND `time` BETWEEN '".$resultado."' AND '".$resultado2."';";

//WHERE (T2.value_attribute ='none') AND (T3.value_attribute ='cycle_time') AND (T4.value_attribute ='load_time') AND (T5.value_attribute ='travel_time_loaded') AND (T6.value_attribute ='stopped_time_loaded') AND (T7.value_attribute ='travel_time_empty') AND (T8.value_attribute ='stopped_time_empty') AND `time` BETWEEN '2016-06-01 00:00:00' AND '2016-06-14 10:00:00';";


mysqli_set_charset($conexion, "utf8"); //formato de datos utf8

if(!$result = mysqli_query($conexion, $sql)) die();

$clientes = array(); //creamos un array

while($row = mysqli_fetch_array($result)) 
{ 
	$flow_id=$row['flow_id'];
	$origin=$row['origin'];
	$destination=$row['destination'];
	$dumper_id=$row['dumper_id'];
	$loader_id=$row['loader_id'];
	$load_x=$row['load_x'];
	$load_y=$row['load_y'];
	$load_z=$row['load_z'];
	$dump_x=$row['dump_x'];
	$dump_y=$row['dump_y'];
	$dump_z=$row['dump_z'];
	$time=$row['time'];
	$analysis_id=$row['analysis_id'];
	$payload=$row['Payload'];
	$cycle_time=$row['Cycle_time'];
	$Travel_time_loaded=$row['Travel_time_loaded'];
	$Stopped_time_loaded=$row['Stopped_time_loaded'];
	$Load_time=$row['Load_time'];
	$Travel_time_empty=$row['Travel_time_empty'];
	$Stopped_time_empty=$row['Stopped_time_empty'];
	//$value_attribute=$row['value_attribute'];
	

	$clientes[] = array('flow_id'=> $flow_id, 'analysis_id'=> $analysis_id, 'origin'=> $origin, 'destination'=> $destination,'sn'=> $dumper_id, 'loader'=> $loader_id,
	                     'x_loadcoord'=> $load_x, 'y_loadcoord'=> $load_y, 'z_loadcoord'=> $load_z, 'x_dumpcoord'=> $dump_x, 'y_dumpcoord'=> $dump_y, 'z_dumpcoord'=> $dump_z, 'time'=> $time,
						'payload_truck'=> $payload, 'cycle_time'=> $cycle_time, 'Travel_time_loaded'=> $Travel_time_loaded, 'Stopped_time_loaded'=> $Stopped_time_loaded, 'Load_time'=> $Load_time, 'Travel_time_empty'=> $Travel_time_empty, 'Stopped_time_empty'=> $Stopped_time_empty);

}
	
//desconectamos la base de datos
$close = mysqli_close($conexion) 
or die("Ha sucedido un error inexperado en la desconexion de la base de datos");
  

//Creamos el JSON
//$clientes['clientes'] = $clientes;
$json_string = json_encode($clientes);
echo $json_string;

//Si queremos crear un archivo json, sería de esta forma:
/*
$file = 'clientes.json';
file_put_contents($file, $json_string);
*/
	

?>