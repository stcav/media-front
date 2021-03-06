//Variable para habilitar el menu vertical emergente
var swap_id=0;
var is_init_processing=false;

function init() {
	get_contents();

	//configurando el buscador por token AJAX
	search_element = document.getElementById("tf_search");
	search_element.onkeyup = function() {
		$.ajax({
			url : "/ContentProcessorServer/ContentProcessorServlet",
			data : "operation=4&token=" + this.value,
			type : "POST",
			contentType: "application/x-www-form-urlencoded;charset=iso-8859-1",
			cache : true,
			success : function(response) {
				//Obteniendo elemento de la BD
				console.log("response: " + response);
				var contents = jQuery.parseJSON(response);
				creation_grid(contents, "div_contents");
				load_content_panel(contents);
			}
		});
	}
	is_processing_content();
}

function is_processing_content() {
  $.ajax({
			url : "/ContentProcessorServer/ProcessingContentServlet",
			data : "ack",
			type : "POST",
			contentType: "application/x-www-form-urlencoded;charset=iso-8859-1",
			cache : true,
			success : function(response) {
				//Obteniendo elemento de la BD
				console.log("response: " + response);
				var ba = jQuery.parseJSON(response);
				if(ba.estado==0){
					if(document.getElementById("div_processing")!=undefined){
						if(!is_init_processing){
							div_pros = document.getElementById("div_processing");

							//Creando la division para el icono de espera y el mensaje de contenido en proceso de adaptacion
							var table=document.createElement("table");
							table.width = "100%";
							table.border = 0;
							var newRow = table.insertRow(-1);
							var newCell = newRow.insertCell(-1);

							//Creando el elemento grafico de espera
							img_clock= document.createElement("img");
							img_clock.src="/archivos/clock.gif";
							img_clock.width=30;
							img_clock.height=40;
							newCell.appendChild(img_clock);

							//Creando texto de espera de terminacion de proceso de adaptacion
							var newCell = newRow.insertCell(-1);
							newCell.innerText=ba.descripcion;

							//Anadiendo la tabla al div correspondiente
							div_pros.appendChild(table);

							//dando por inicializado el proceso de presentacion de estado de adaptacion
							is_init_processing=true;
						}


					}else{
						div_pros = document.createElement("div");
						//div_pros.innerHTML=ba.descripcion;
						div_pros.id="div_processing";
						div_pros.className="div_wait_processing_video";
						document.getElementById("processing_td").appendChild(div_pros);
					}
					setTimeout(function() {is_processing_content();}, 500);
				}
				else{
					div_pros = document.getElementById("div_processing");
					if(div_pros!=null){
						div_pros.innerHTML="";
						get_contents();
					}
					is_init_processing=false;
				}

			}
	});
}

/*
* create all grid system associated with user's videos
*
* @param ignoreMetric [boolean], add ignore_metric url param into ajax url
*/
function get_contents(ignoreMetric) {
	//peticion AJAX para obtener los valores del elemento asociado
	var ignoreMetricParam = "";

	if(ignoreMetric == true){
		ignoreMetricParam = "&ignore_metric=true";
	}
	//peticion AJAX para obtener los valores del elemento asociado
	$.ajax({
		url : "/ContentProcessorServer/ContentProcessorServlet",
		data : "operation=0&management_record=11"+ignoreMetricParam,
		type : "POST",
		contentType: "application/x-www-form-urlencoded;charset=iso-8859-1",
		success : function(response) {
			//Obteniendo elemento de la BD
			console.log("response: " + response);
			var contents = jQuery.parseJSON(response);
			creation_grid(contents, "div_contents");
			load_content_panel(contents);
		}
	});
}

//Plantilla Grid para los elementos Thumb del panel
function creation_grid(obj, divID) {
	//limpiamos el contenedor
	div_container = document.getElementById(divID);
	div_container.innerHTML = "";
	//creamos la tabla
	var tabla = document.createElement("table");
	tabla.id = "tabla_thumb";
	tabla.width = "100%";
	tabla.border = 0;
	//obtenemos el numero de filas
	var num_fil = Math.round(obj.length / 2);
	console.log(num_fil);
	//creamos la grid con dos elementos por fila
	for(var i = 0; i < num_fil; i++) {
		var nuevaFila = tabla.insertRow(-1);
		nuevaFila.id = "g_fila_" + i;
		//nuevaFila.className = ".Celda_Thumbnail";
		for(var j = 0; j < 4; j++) {
			var nuevaCelda = nuevaFila.insertCell(-1);
			nuevaCelda.className = ".Celda_Thumbnail";
			nuevaCelda.id = "g_celda_" + ((4 * i) + 1 + j);
			nuevaCelda.innerHTML = '&nbsp;';
		}
	}
	div_container.appendChild(tabla);
}

//Cargar el panel de contenidos multimedia
function load_content_panel(contents) {
	//Cargamos todos los contenidos habilitados para el historial
	var idContenido;
	var rutafuente;
	for(i in contents) {
		idContenido = contents[i].idContenido;
		rutafuente = "ContentRepository/" + contents[i].rutafuente;
		for(var j = 0; j < 2; j++) {
			if(j == 0) {
				//var imagen ='<img src="PosterRepository/'+contents[i].rutascreenshot+'" width="94" height="70" class="Thumbnail" id="'+idContenido+'" onmouseover="resaltar_PE(id,'+0+')" onmouseout="resaltar_PE(id,'+1+')" onclick="PlayContentbyID(id)" ondragstart="intercambiar(id,0)"/>';
				imagen = document.createElement("img");
				imagen.className = "Thumbnail";
				imagen.id = idContenido;
				imagen.src = "/PosterRepository/" + contents[i].rutascreenshot;
				imagen.onmouseover = function() {
					resaltar_PE(this.id, 0);
				}
				imagen.onmouseout = function() {
					resaltar_PE(this.id, 1);
				}
				imagen.onclick = function() {
					//guardando temporalmente el id del elemento clickeado
					swap_id=this.id;
					font = new FontCanvas();
					font.font = "Arial";
					font.size = 13;
					font.color = "#FFFFFF";
					elements_t = ["Reproducir", "Editar"];
					ver_menu = create_listening_menu("div_vertical_menu", elements_t, font, "#101010", "#51504B");
					//sobrecargando el evento del elemento retornado para hacer uso del menu
					ver_menu.onmousedown = function() {
						type_element = get_id_click_element_menuBar(this.id, event.clientY) + 1;
						console.log(type_element);
						switch(type_element){
							// play picked video
							case 1:{
								$.ajax({
								url : "/ContentProcessorServer/ContentProcessorServlet",
								data : "operation=2&id=" + swap_id + "&management_record=12",
								type : "POST",
								contentType: "application/x-www-form-urlencoded;charset=iso-8859-1",
								cache : true,
								success : function(response) {
									//Obteniendo elemento de la BD
									console.log("response: " + response);
									var content = jQuery.parseJSON(response);
									video = document.getElementById("video");
									video.src = "/ContentRepository/" + content.rutafuente;
									video.load();
									video.play();
								}
								});
								break;
							}
							// edit picked video
							case 2:{
									fees = new Array();
									fee = new FormEditElement();
									fee.id = "titulo";
									fee.type = 1;
									fee.tag = "Titulo";
									fee.width = 60;
									fee.height = 1;
									fees.push(fee);
									fee = new FormEditElement();
									fee.id = "sinopsis";
									fee.type = 2;
									fee.tag = "Sinopsis";
									fee.width = 59;
									fee.height = 5;
									fees.push(fee);
									fee = new FormEditElement();
									fee.id = "fuente";
									fee.type = 1;
									fee.tag = "Fuente";
									fee.width = 60;
									fee.height = 1;
									fees.push(fee);

									create_window_edit("div_edit_content", swap_id, 400, 100, fees, "#FFFFFF", "#333333", "#000000", "/ContentProcessorServer/ContentProcessorServlet", "8","Editar Contenido");
									get_content_metainfo(swap_id);
								break;
							}
							default:{
								break;
							}
						}
					}
				}
				document.getElementById("g_celda_" + ((2 * i) + j + 1)).appendChild(imagen);

				//console.log(imagen);
				//document.getElementById("g_celda_"+((2*i)+j+1)).innerHTML=imagen;
			} else {
				title_temp = contents[i].titulo;
				if(title_temp.length>10){
					title_temp=title_temp.substring(0,9)+"...";
				}
				document.getElementById("g_celda_" + ((2 * i) + j + 1)).innerHTML = "<br>" + title_temp + "<br>" + contents[i].duracion + " s";
			}

		}
	}
}

//Metodo sobrecargado para enviar la peticion desde la venta de edcion temporal
function do_send_data_we(URL, data_) {
	console.log("URL: " + URL + " data: " + data_);
	$.ajax({
		url : URL,
		data : data_+"&management_record=14",
		type : "POST",
		contentType: "application/x-www-form-urlencoded;charset=iso-8859-1",
		cache : true,
		success : function(response) {
			console.log("response: " + response);
			get_contents(true);
		}
	});
}

//Obteniendo metainfo
function get_content_metainfo(id) {
	$.ajax({
		url : "/ContentProcessorServer/ContentProcessorServlet",
		data : "operation=2&id="+ id + "&management_record=13",
		type : "POST",
		contentType: "application/x-www-form-urlencoded;charset=iso-8859-1",
		cache : true,
		success : function(response) {
			var obj = jQuery.parseJSON(response);
			document.getElementById('div_edit_content_titulo').value = obj.titulo;
			document.getElementById('div_edit_content_sinopsis').value = obj.sinopsis;
			document.getElementById('div_edit_content_fuente').value = obj.fuente;
		}
	});
}

//Funcion de diseño para resaltar los thumbs cdon el mouse
function resaltar_PE(id, estado) {
	if(estado == 0) {
		//entra
		document.getElementById(id).border = "2px";
	} else {
		//sale
		document.getElementById(id).border = "0px";
	}
}

function playVideo(url) {
	this.video = document.getElementById("video");
	video.src = url;
	video.load();
	video.play();
}
