
function init(){
	do_process_video();
	get_tags();
}


/************************  Etiquetas *********************************/

function get_tags() {
	$.ajax({
		url : "/ContentProcessorServer/ObjectImportServlet",
		data : "dependencia=0&mainObject=3",
		type : "POST",
		contentType: "application/x-www-form-urlencoded;charset=iso-8859-1",
		cache : true,
		success : function(response) {
			console.log(response);
			var obj = jQuery.parseJSON(response);
			var select = document.getElementById("select");
			for(var i = 0; i < obj.length; i++) {
				var element = document.createElement("option");
				element.value = obj[i].idEtiquetas
				element.innerText = obj[i].nombre;
				select.appendChild(element);
			}
		}
	});
}

/************************  Procesador de video *****************************/
function do_process_video() {
	$.ajax({
		url : "/ContentProcessorServer/ProcessorFileServlet",
		data : "ack",
		type : "POST",
		cache : true,
		success : function(response) {
			console.log("Video Procesado :)");
		}
	});
}

/****************************** Rotulacion de Video ***************************************/
function do_label_content() {
	$.ajax({
		url : "/ContentProcessorServer/ContentLabeling",
		data : "operation=1&" + get_data_form() + "&TimeStamp=" + new Date().getTime(),
		type : "POST",
		contentType: "application/x-www-form-urlencoded;charset=iso-8859-1",
		cache : true,
		success : function(response) {
			if(response != "" && response.substring(0, 9) != "redirect:") {
				//document.getElementById("placeHolder").innerHTML = respuestaTexto;
				document.getElementById('div_log').className="error";
				document.getElementById('div_log').innerHTML = response;
			} else if(response.substring(0, 9) == "redirect:" && response != "") {
				window.location = response.substr(9);
			}
		}
	});
}

function get_data_form()//Esta funcion construye una cadena con los 3 datos
{
	//Cogemos los datos de cada campo y los metemos en una variable cada uno
	var Titulo = document.getElementById("titulo").value;
	var Sinopsis = document.getElementById("sinopsis").value;
	var Fuente = document.getElementById("fuente").value;

	//var selected = new Array();
	var etiquetas_existentes = "";
	var mySelect = document.forms["formTags"].elements["select"];
	while(mySelect.selectedIndex != -1) {
		if(mySelect.selectedIndex != 0) {
			//selected.push(mySelect.options[mySelect.selectedIndex].value);
			etiquetas_existentes += mySelect.options[mySelect.selectedIndex].value + ",";
		}

		mySelect.options[mySelect.selectedIndex].selected = false;
	}

	var etiquetas_nuevas = document.getElementById("etiquetas").value;

	//Construimos una cadena con ellos con el formato est�ndar de enviar informaci�n
	var data = "Titulo=" + Titulo + "&Sinopsis=" + Sinopsis + "&Fuente=" + Fuente + "&Etiquetas_d=" + etiquetas_existentes + "&Etiquetas_n=" + etiquetas_nuevas;
	//console.log(data);
	return data;
	//Devolvemos la cadena que se usara en otras funciones
}



