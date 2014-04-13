
//Estructura de un elemento Form
FormEditElement = function() {
	//1-> TextField 2 -> TextBox
	this.id="";
	this.type = 0;
	this.tag = "";
	this.width = 0;
	this.height = 0;
}

function create_window_edit(id, callerID, width, height, formEditElements, colorFont, backgroundColor, borderColor, URLServer, operation, name, extra) {
	//Comprobamos que la venta de edicion no este creada actualemnte
	if(document.getElementById(id)==undefined){
		div = document.createElement("div");
	}else{
		div=document.getElementById(id);
	}
	//creamos la capa background
	div_back = document.createElement("div");
	div_back.id=id+"_background";
	div_back.style.position="absolute";
	div_back.style.zIndex=2;
	div_back.style.left="0px";
	div_back.style.top="0px";
	canvas_back = document.createElement("canvas");
	canvas_back.width=1150;
	canvas_back.height=990;
	canvas_back.getContext('2d').fillStyle="rgba(44,44,44,0.8)";
	canvas_back.getContext('2d').fillRect(0,0,1150,990);
	div_back.appendChild(canvas_back);
	document.body.appendChild(div_back);
	//Creamos la cadena descriptora de los elementos que estan dentro del WindowsEdit WE 
	var ids_elements = formEditElements.length+"¬"+callerID+"¬";
	//Configuramos la capa de edicion
	console.log(window.screen.availWidth);
	console.log(window.screen.availHeight);
	div.id = id;
	div.className = "div_edit_temp";
	div.style.left=(((1150)/2)-(width/2))+"px";
	div.style.top=(((820)/2)-(height/2))+"px";
	/*div.style.left="500px";
	div.style.top="200px";*/
	div.style.width = width;
	div.style.height = height;
	div.style.color = colorFont;
	div.style.backgroundColor = backgroundColor;
	div.style.borderColor = borderColor;
	div.innerHTML = "";
	div.style.visibility="visible";
	div.style.zIndex=3;

	//creamos la grid y los elementos de la WE
	var tabla = document.createElement("table");
	tabla.width = "100%";
	tabla.border = 0;
	div_title = document.createElement("div");
	div_title.style.textAlign="center";
	div_title.style.width="100%";
	div_title.style.color=colorFont;
	div_title.style.fontWeight="Bold";
	div_title.innerHTML=name;	
	for(i in formEditElements) {
		var nuevaFila = tabla.insertRow(-1);

		var nuevaCelda = nuevaFila.insertCell(-1);
		var fee = formEditElements[i];
		nuevaCelda.innerHTML = fee.tag;

		var nuevaCelda = nuevaFila.insertCell(-1);
		var element;
		//comprobamos el tipo de elemento Form que es para poder dibujarlo.
		switch(fee.type) {
			case 1: {
				element = document.createElement("input");
				element.type="text";
				element.id=id+"_"+fee.id;
				element.size=fee.width;
				break;
			}
			case 2: {
				element = document.createElement("textarea");
				element.id=id+"_"+fee.id;
				element.rows=fee.height;
				element.cols=fee.width;				
				break;
			}
			default:{
				breaK;
			}
		}
		
		ids_elements+=""+element.id+"¬";
		
		nuevaCelda.appendChild(element);
	}
	var nuevaFila = tabla.insertRow(-1);
	
	var nuevaCelda = nuevaFila.insertCell(-1);
	boton = document.createElement("input");
	boton.id="c_"+id;
	boton.type="button";
	boton.value="Cancelar";
	boton.onclick = function(){
		//console.log((this.id+"").substr(2));
		div = document.getElementById((this.id+"").substr(2));
		div.innerHTML="";
		div.style.zIndex=(-1);
		div.style.visibility="hidden";	
		document.body.removeChild(document.getElementById((this.id+"").substr(2)+"_background"));	
	}
	nuevaCelda.align="left";
	nuevaCelda.appendChild(boton);
	
	var nuevaCelda = nuevaFila.insertCell(-1);
	boton = document.createElement("input");
	boton.id="a_"+id;
	boton.type="button";
	boton.value=" Aceptar ";
	boton.onclick = function(){
		//Accedemos al ID de la capa del WE
		div = document.getElementById((this.id+"").substr(2));
		var data = document.getElementById("hidden_"+((this.id+"").substr(2))).value.split('¬');
		var extra_ = document.getElementById("hidden_extra_"+((this.id+"").substr(2))).value;
		var dataText="operation="+data[(data.length-1)];
		console.log(data[2].replace((this.id+"").substr(2)+"_",""));
		//Analizamos los valores extraidos de los campos.
		for(var i=2;i<(data.length-2);i++){
			console.log(data[i]+" i: "+i);
			var dataForm = document.getElementById(data[i]).value;
			if(dataForm==""){
				alert("Por favor no deje espacios vacios...")
				return;
			}
			//Creamos el DataText para la funcion de comunicacion posterior
			dataText+="&"+data[i].replace((this.id+"").substr(2)+"_","")+"="+dataForm; 
		}
		
		dataText+="&id="+data[1]+"&"+extra_;
		console.log("DataText + extra: "+dataText);
		//Borramos la inf de la capa y la capa en si, su labor de edicion fue terminada
		div.innerHTML="";
		div.style.zIndex=(-1);
		div.style.visibility="hidden";
		//***********************************************************************************************************
		//OJO es necesario sobrecargar este metodo en el script principal, para aplicar la funcion de comunicacion
		do_send_data_we(data[data.length-2],dataText);
		//***********************************************************************************************************
		document.body.removeChild(document.getElementById((this.id+"").substr(2)+"_background"));
	}
	nuevaCelda.align="right";
	nuevaCelda.appendChild(boton);
	//Creamos un campo oculto con la info data de descripcion de los elementos
	hidden = document.createElement("input");
	hidden.id="hidden_"+id;
	hidden.type="hidden";
	hidden.value=ids_elements+URLServer+"¬"+operation;
	console.log(hidden.value);
	//Creamos otro campo oculto con info extra
	hidden_ = document.createElement("input");
	hidden_.id="hidden_extra_"+id;
	hidden_.type="hidden";
	hidden_.value=extra+"";
	
	div.appendChild(hidden);
	div.appendChild(hidden_);
	div.appendChild(div_title);
	div.appendChild(tabla);
	document.body.appendChild(div);

}


