//Lib para habilitar la integridad de la sesion entre servidores

function user_reference() {
	$.ajax({
		//url : "http://192.168.119.98:8080/stcav/ReferenceServlet",
		//url: "http://localhost:38415/STCAV/ReferenceServlet",
		url: "/STCAV/ReferenceServlet",
		data : "operation=1",
		type : "POST",
		dataType: "script",
		async : false
	}).responseText;
}

function community_reference() {
	$.ajax({
		//url : "http://192.168.119.98:8080/stcav/ReferenceServlet",
		//url: "http://localhost:38415/STCAV/ReferenceServlet",
		url: "/STCAV/ReferenceServlet",
		data : "operation=2",
		type : "POST",
		dataType: "script",
		async : false
	}).responseText
}

//Metodo llamado a traves de JSONP
function redirect(reference,operation){
	console.info("INFO JSONP: "+operation+" "+reference);
		$.ajax({
		url : "/ContentProcessorServer/ReferenceServlet",
		data : "operation="+operation+"&"+reference,
		type : "POST",
		async : false
	}).responseText
	init();
}

