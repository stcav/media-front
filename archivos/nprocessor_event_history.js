var events;
var eventSelected;
var index;
var edit = false;

function init() {
	get_event_from_prog();
}

function get_event_from_prog() {
	$.ajax({
		url : "/ProgrammeProcessorServer/EventProcessorServlet",
		data : "operation=0",
		type : "POST",
		contentType: "application/x-www-form-urlencoded;charset=iso-8859-1",
		cache : true,
		success : function(response) {
			console.log(response);
			events = jQuery.parseJSON(response);
			if(events.length > 0) {
				var elements_t = new Array();
				for(i in events) {
					elements_t.push(events[i].nombre + "");
				}
				font = new FontCanvas();
				font.font = "Arial";
				font.size = 13;
				font.color = "#FFFFFF";
				bar = create_menu_bar("programsBar", elements_t, 195, events.length * 20, font, "#101010", "#51504B", false);
				bar.onclick = function() {
					index = get_id_click_element_menuBar(this.id, event.clientY);
					eventSelected = events[index].idEvento;
					console.log(index);
					font = new FontCanvas();
					font.font = "Arial";
					font.size = 13;
					font.color = "#FFFFFF";
					elements_t = ["Reproducir","Editar","Informacion","Eliminar"];
					ver_menu = create_listening_menu("div_vertical_menu", elements_t, font, "#101010", "#51504B");
					//sobrecargando el evento del elemento retornado para hacer uso del menu
					ver_menu.onmousedown = function() {
						type_element = get_id_click_element_menuBar(this.id, event.clientY) + 1;
						console.log(type_element);
						switch(type_element){
							case 1:{
								$.ajax({
								url : "/ProgrammeProcessorServer/EventProcessorServlet",
								data : "operation=7&id=" + eventSelected,
								type : "POST",
								contentType: "application/x-www-form-urlencoded;charset=iso-8859-1",
								cache : true,
								success : function(response) {
									//Obteniendo elemento de la BD
									console.log("response: " + response);
									var e = jQuery.parseJSON(response);
									video = document.getElementById("video");
									video.src = "/ProgramRepository/" + e.ruta;
									video.load();
									video.play();
								}
								});
								break;
							}
							case 2:{
								$.ajax({
								url : "/ProgrammeProcessorServer/EventProcessorServlet",
								data : "operation=8&id=" + eventSelected,
								type : "POST",
								contentType: "application/x-www-form-urlencoded;charset=iso-8859-1",
								cache : true,
								success : function(response) {
									//Obteniendo elemento de la BD
									console.log("response: " + response);
									window.location="nD4me.html";
								}
								});
								break;
							}
							case 4:{
								if(confirm("Esta seguro de querer eliminar este evento?")) { 
									
									deleteProcessorEvent(eventSelected);
      							}
								break;
							}
							default:{
								break;
							}
						}
					}
				}
				div = document.getElementById("div_events");
				div.innerHTML="";
				div.appendChild(bar);
			}
		}
	});
}

function deleteProcessorEvent(idEve){
	$.ajax({
		url : "/ProgrammeProcessorServer/EventProcessorServlet",
		data : "operation=2&id=" + idEve,
		type : "POST",
		contentType: "application/x-www-form-urlencoded;charset=iso-8859-1",
		cache : true,
		success : function(response) {
				deleteECByID("programsBar");
				get_event_from_prog();
				video = document.getElementById("video");
				video.src = "";
			}
	});
} 

function create_event() {
	fees= new Array();
	fee = new FormEditElement();
	fee.id = "nombre";
	fee.type = 1;
	fee.tag = "Nombre";
	fee.width = 60;
	fee.height = 1;
	fees.push(fee);
	fee = new FormEditElement();
	fee.id = "descripcion";
	fee.type = 2;
	fee.tag = "Descripcion";
	fee.width = 59;
	fee.height = 5;
	fees.push(fee);

	create_window_edit("div_create_event", "NAN", 400,100, fees, "#FFFFFF", "#333333", "#000000", "/ProgrammeProcessorServer/EventProcessorServlet", "3", "Crear Evento");
}

//Metodo sobrecargado para enviar la peticion desde la venta de edcion temporal
function do_send_data_we(URL, data_) {
	console.log("URL: " + URL + " data: " + data_);
	$.ajax({
		url : URL,
		data : data_,
		type : "POST",
		contentType: "application/x-www-form-urlencoded;charset=iso-8859-1",
		cache : true,
		success : function(response) {
			console.log("response: " + response);
			deleteECByID("programsBar");
			get_event_from_prog();
			if(edit){

			}else {
				window.location = response;
			}
		}
	});
}