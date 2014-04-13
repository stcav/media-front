function init() {
	get_content_metainfo();
	get_state_video();
}

function get_state_video() {
	$.ajax({
		url : "/ContentProcessorServer/StateProcessorServlet",
		data : "ack",
		type : "POST",
		cache : true,
		success : function(response) {
			var obj = jQuery.parseJSON(response);
			var video = document.getElementById("video");
			video.src = obj.dato;
			console.log(obj.dato);
			console.log(document.getElementById("video").src);
			video.load();
			//video.play();
			document.getElementById('processingDiv').innerHTML = "";
			document.getElementById('alertPlace').innerHTML = obj.descripcion;
			document.getElementById('alertPlace').className = "emphasis";

			console.log("Video procesado *_*");
		}
	});
}

function get_content_metainfo() {
	$.ajax({
		url : "/ContentProcessorServer/ObjectImportServlet",
		data : "dependencia=0&mainObject=1",
		type : "POST",
		cache : true,
		success : function(response) {
			var obj = jQuery.parseJSON(response);
			document.getElementById('titulo').innerHTML = obj.titulo;
			document.getElementById('sinopsis').innerHTML = obj.sinopsis;
			document.getElementById('fuente').innerHTML = obj.fuente;
			get_content_tag();
		}
	});
}

function get_content_tag() {
	$.ajax({
		url : "/ContentProcessorServer/TagProcessorServlet",
		data : "operation=0",
		type : "POST",
		cache : true,
		success : function(response) {
			var tags = response;
			document.getElementById('etiquetas').innerHTML = tags;
		}
	});
}

function redirect(url) {
	window.location = url;
}

function see_windows_edit() {
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

	create_window_edit("div_edit", "NN", 400, 100, fees, "#FFFFFF", "#333333", "#000000", "/ContentProcessorServer/ContentProcessorServlet", "6","Editar Contenido");
}

function do_send_data_we(URL, data_) {
	console.log("URL: " + URL + " data: " + data_);
	$.ajax({
		url : URL,
		data : data_,
		type : "POST",
		cache : true,
		success : function(response) {
			console.log("response: " + response);
			get_content_metainfo()
		}
	});
}