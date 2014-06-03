var programs;
var isLayoutDecription = false;
var programSelected;
var index;
var edit = false;

function init() {
	get_program_from_com();
}

function get_program_from_com() {
	$.ajax({
		url : "/ProgrammeProcessorServer/ProgrammmeProcessorServlet",
		data : "operation=0",
		type : "POST",
		cache : true,
		success : function(response) {
			console.log(response);
			programs = jQuery.parseJSON(response);
			if(programs.length > 0) {

				var elements_t = [];
				for(i in programs) {
					elements_t[i] = programs[i].nombre + "";
					console.log("arreglo i: " + i);
				}
				font = new FontCanvas();
				font.font = "Arial";
				font.size = 13;
				font.color = "#FFFFFF";
				bar = create_menu_bar("programsBar", elements_t, 195, programs.length * 25, font, "#222222", "#51504B", false);
				bar.onclick = function() {
					index = get_id_click_element_menuBar(this.id, event.clientY);
					programSelected = programs[index].idPrograma;
					generateDescription(programs[index]);
					console.log(index);
				}
				div = document.getElementById("div_programs");
				div.innerHTML = "";
				div.appendChild(bar);
				if(edit) {
					generateDescription(programs[index]);
					edit = false;
				}
			}
		}
	});
}

function generateDescription(program) {
	//adecuando la plantilla para que pueda volver a ser utlizada como descriptor del porgrama
	if(!isLayoutDecription) {
		document.getElementById("placeMsg").innerHTML = " ";
		document.getElementById("bottonEvent").innerHTML = "<input  type='button' value='Ver Eventos' onclick='eventsByProgram()'/>";
		document.getElementById("bottonDel").innerHTML = "<p  onclick='deleteProcessorProgram()'>Eliminar</p>";
		document.getElementById("editLink").innerHTML = "<p  onclick='editProgram()'>Editar</p>";
		document.getElementById("tagTitle").innerHTML = "Nombre";
		document.getElementById("tagDescription").innerHTML = "Descripcion";
		document.getElementById("tagHour").innerHTML = "Horario";
		isLayoutDecription = true;
	}

	//a�adiendo todos los elementos de la descripcion
	document.getElementById("Title").innerHTML = program.nombre;
	document.getElementById("Description").innerHTML = program.descripcion;
	var img = document.createElement("img");
	img.src = "/ProgramRepository/PosterProgram/" + program.rutascreenshot;
	img.width = 158;
	img.height = 158;
	document.getElementById("imageProgram").innerHTML = "";
	document.getElementById("imageProgram").appendChild(img);
	console.log(program.dia);
	hour_= new Date(program.hora).getHours()+":"+new Date(program.hora).getMinutes()+" h";
	switch (program.dia) {
		case '0':
			document.getElementById("Hour").innerHTML = "No asignado";

			break;
		case '1':
			document.getElementById("Hour").innerHTML = "Lunes a las " + hour_;

			break;
		case '2':
			{
				document.getElementById("Hour").innerHTML = "Martes a las " + hour_;
			}
			break;
		case '3':
			{
				document.getElementById("Hour").innnrHTML = "Miercoles a las " + hour_;
			}
			break;
		case '4':
			{
				document.getElementById("Hour").innerHTML = "Jueves a las " + hour_;
			}
			break;
		case '5':
			{
				document.getElementById("Hour").innerHTML = "Viernes a las " + hour_;
			}
			break;
		case '6':
			{
				document.getElementById("Hour").innerHTML = "Sabado a las " + hour_;
			}
			break;
		case '7':
			{
				document.getElementById("Hour").innerHTML = "Domingo a las " + hour_;
			}
			break;
		default:
			{
				console.log("default");
			}
			break;
	}

}

function eventsByProgram() {

	$.ajax({
		url : "/ProgrammeProcessorServer/SessionProgramServlet",
		data : "idPrg=" + programSelected,
		type : "POST",
		cache : true,
		success : function(response) {
			window.location = response;
		}
	});

}

function deleteProcessorProgram() {
	var agree = confirm("¿Esta seguro que quiere eliminar el programa?");
	if(agree) {
		$.ajax({
		url : "/ProgrammeProcessorServer/ProgrammmeProcessorServlet",
		data : "operation=2&idPrg=" + programSelected,
		type : "POST",
		cache : true,
		success : function(response) {
			console.log(response);
			deleteECByID("programsBar");
			document.getElementById("placeMsg").innerHTML = "Por favor seleccione un programa";
			document.getElementById("bottonEvent").innerHTML = "";
			document.getElementById("bottonDel").innerHTML = "";
			document.getElementById("editLink").innerHTML = "";
			document.getElementById("tagTitle").innerHTML = "";
			document.getElementById("tagDescription").innerHTML = "";
			document.getElementById("tagHour").innerHTML = "";
			document.getElementById("Hour").innerHTML = "";
			document.getElementById("imageProgram").innerHTML = "";
			document.getElementById("Title").innerHTML = "";
			document.getElementById("Description").innerHTML = "";
			isLayoutDecription = false;
			get_program_from_com();
		}
	});
		console.log("si");
	} else {
		console.log("no");
		return;
	}

}

function create_program() {
	fees = new Array();
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

	create_window_edit("div_create_program", "NAN", 400, 100, fees, "#FFFFFF", "#333333", "#000000", "/ProgrammeProcessorServer/ProgrammmeProcessorServlet", "3", "Crear Programa");
}

function editProgram() {
	fees = new Array();
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
	edit = true;
	create_window_edit("div_edit_program", programSelected, 400, 100, fees, "#FFFFFF", "#333333", "#000000", "/ProgrammeProcessorServer/ProgrammmeProcessorServlet", "4", "Editar Programa");
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
			get_program_from_com();
		}
	});
}

function community_reference() {
	$.ajax({
		//url : "http://192.168.119.98:8080/stcav/ReferenceServlet",
		//url : "http://localhost:38415/STCAV/ReferenceServlet",
		url : "/STCAV/ReferenceServlet",
		data : "operation=2",
		type : "POST",
		dataType : "script",
		async : false
	}).responseText
}

//Metodo llamado a traves de JSONP
function redirect(reference, operation) {

	console.info("INFO JSONP: " + operation + " " + reference);
	$.ajax({
		url : "/ProgrammeProcessorServer/ReferenceServlet",
		data : "operation=" + operation + "&" + reference,
		type : "POST",
		async : false
	}).responseText

	console.info("INFO JSONP_: "+operation+" "+reference);
	$.ajax({
		url : "/ContentProcessorServer/ReferenceServlet",
		data : "operation="+operation+"&"+reference,
		type : "POST",
		async : false
	}).responseText
	init();
}
