//********************************************* DECLARACION DE VARIABLES ******************************************************//
var ver_contenido = false;
var content_temp;
var type_element=1;
//variable para el id de los elementos con menu vertical desplegable
var swap_id=0;
//-----------------------------------------------
var vector_edicion = new Array();
// tipo*src*corte_inicial*corte_final*duracion*
var intercambio;
var index_drop = 0;
var index_drop_temp = 0;
var isCutteable = false;
var idElementEdit = 0;
//Objeto de edicion
obj_edicion = function(){
	this.id=0;
    this.idContent = "";
    this.duration = 0;
    this.cut_home = 0;
    this.cut_end = 0;
    this.idTransition = "";
    this.src = "";
}
//-----------------------------------------------
var indice_play = 0;
var trans_on = false;
var trans_off = false;
var end_video = false;
var alpha = 255;
var corte_inicial = 0;
var corte_final = 0;
var idCanvasVideo = "canvas_video";
var idVideo = "video";
var test_flag = false;
var vol=50;
var time_edit=0;
var time_factor=0;
var acummulated_time=0;

//*****************************************************************************************************************************//
function init() {
	load_panel();
	get_contents();
	create_progressbar_();
	create_progressbar_p();
	set_value_progres_bar("bar_vol", 50);
	set_value_progres_bar("bar_p", 0);
	search_element = document.getElementById("tf_search");
	search_element.onkeyup = function() {
		if(type_element==1){
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
	}
}

//********************************************** SOLO CARGA INICIAL DE ELEMENTOS **********************************************//
function load_panel() {
	div_ = document.getElementById("div_panel");
	elements_t = ["Contenidos Multimedia", "Transiciones"];
	//bar = createMenuBar("menuBar", elements_t, 500, 20, "13px Arial");
	font = new FontCanvas();
	font.font = "Arial";
	font.size = 13;
	font.color = "#FFFFFF";
	bar = create_menu_bar("menuBar", elements_t, 380, 20, font, "#53524E", "#7A7574", true);
	bar.onclick = function() {
		type_element = get_id_click_element_menuBar(this.id, event.clientX) + 1;
		console.log(type_element);
		switch (type_element) {
			case 1: {
				//peticion AJAX para obtener los valores del elemento asociado
				get_contents(true);
				break;
			}
			case 2: {
				//peticion AJAX para obtener los valores del elemento asociado
				$.ajax({
					url : "/PartenonServer/TransitionProcessorServlet",
					data : "operation=0",
					type : "POST",
					contentType: "application/x-www-form-urlencoded;charset=iso-8859-1",
					cache : true,
					success : function(response) {
						//Obteniendo elemento de la BD
						console.log("response: " + response);
						var transitions = jQuery.parseJSON(response);
						creation_grid(transitions, "div_contents");//deberia llamarse div_elements...
						load_transition_panel(transitions);
					}
				});
				break;
			}
			default:{
				break;
			}
		}
	}
	div_.appendChild(bar);
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
		data : "operation=0"+ignoreMetricParam,
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
					PlayContentbyID(this.id)
				}
				imagen.ondragstart = function(){
					intercambiar(this.id,0,this.src)
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

//Cargar el panel de transiciones multimedia
function load_transition_panel(transitions){
    var idTransition;
    for (i in transitions){
        idTransition = transitions[i].idTransicion;
        for (var j = 0; j < 2; j++){
            if (j == 0){
                imagen = document.createElement("img");
                imagen.className = "Thumbnail";
                imagen.id = idTransition;
                imagen.src = "/PartenonRepository/Transitions/" + transitions[i].screenshot;
                imagen.onmouseover = function(){
                    resaltar_PE(this.id, 0);
                }
                imagen.onmouseout = function(){
                    resaltar_PE(this.id, 1);
                }
                imagen.onclick = function(){
                    console.log("click!!!");
                }
                imagen.ondragstart = function(){
                    intercambiar(this.id,1,this.src)
                }
                document.getElementById("g_celda_" + ((2 * i) + j + 1)).appendChild(imagen);
            }
            else{
                document.getElementById("g_celda_" + ((2 * i) + j + 1)).innerHTML = transitions[i].nombre;
            }

        }
    }
}



//******************************************************************************************************************************//

//****************************************************** SOLO INTERFAZ *********************************************************//
function create_progressbar_() {
	bar_vol = create_progres_bar("bar_vol", 100, 15, "#000000", "#D7FF53", "#333333")
	div = document.getElementById("div_bar_vol");
	div.appendChild(bar_vol);
}

function create_progressbar_p() {
	bar_p = create_progres_bar("bar_p", 635, 15, "#000000", "#45FF78", "#333333")
	div = document.getElementById("div_bar_p");
	div.appendChild(bar_p);
}

function PlayContentbyID(id){
	$.ajax({
		url : "/ContentProcessorServer/ObjectImportServlet",
		data : "dependencia=0&mainObject=1&mainId=" + id,
		type : "POST",
		contentType: "application/x-www-form-urlencoded;charset=iso-8859-1",
		cache : true,
		success : function(response) {
			var content = jQuery.parseJSON(response);
    		ver_video(content);
		}
	});
}

function ver_video(content){
    // este content es el asociado al content json y NO al obj_edicion

    var vid_temp = document.getElementById("video");
    vid_temp.src = "ContentRepository/" + content.rutafuente;
    vid_temp.load();
    //vid_temp.play();
    //creamos la capa background
	div_back = document.createElement("div");
	div_back.id="_background";
	div_back.style.position="absolute";
	div_back.style.zIndex=2;
	div_back.style.left="0px";
	div_back.style.top="0px";
	canvas_back = document.createElement("canvas");
	canvas_back.width=1100;
	canvas_back.height=650;
	canvas_back.getContext('2d').fillStyle="rgba(44,44,44,0.8)";
	canvas_back.getContext('2d').fillRect(0,0,1100,650);
	div_back.appendChild(canvas_back);
	document.body.appendChild(div_back);
    document.getElementById("C_Video").style.visibility = "visible";
    document.getElementById("C_Video").style.zIndex=5;
	document.getElementById("C_Video").style.left="227px";
	document.getElementById("C_Video").style.top="118px";
    ver_contenido = true;
    if (isCutteable){
        // Esta variable se examina para ver si la accion del play video esta asociada con la linea de tiempo, si es asi, se muestran las cursosr de corte
        var celda = document.getElementById("cut_video");
        celda.style.backgroundColor = "#000000";
        celda.innerHTML = "";
        line_cut = document.createElement("div");
        line_cut.id = "c_barra_tiempo";
        text_cut=document.createElement("div");
        text_cut.width=30;
        text_cut.height=0;
        text_cut.style.position="relative";
        text_cut.style.left="540px";
        text_cut.style.top="-20px";
        text_cut.style.width="30px";
        text_cut.style.height="0px";

        celda.appendChild(line_cut);
        celda.appendChild(text_cut);
		var width_lin_cut=501;
		var width_cursors=10;

		//****************** estableciendo el texto de corte ********************//
		var text_canvas = document.createElement("canvas");
		text_canvas.id="text_cut";
		text_cut.appendChild(text_canvas);
        //****************** estableciendo los cursores ********************//
        //viendo el estado de los cursores, si el video ya fue editado
        var temp_object = vector_edicion[idElementEdit];
        pos_cur1 = (temp_object.cut_home * (width_lin_cut-width_cursors*2)) / temp_object.duration;
        pos_cur2 = (temp_object.cut_end * (width_lin_cut-width_cursors*2)) / temp_object.duration;
        console.log(" posiciones iniciales cur1 :" + pos_cur1 + " cur2: " + pos_cur2);

		//--------------------------------------------------------------------------------------//

		var stage = new Kinetic.Stage({
          container: 'c_barra_tiempo',
          width: width_lin_cut,
          height: 30
        });

        var layer = new Kinetic.Layer();
        var areas = new Kinetic.Group();
        var scrollbars = new Kinetic.Group();
        var container = stage.getContainer();
        var posr= stage.getWidth()-10;
        var posl= 10;

        /*
         * horizontal scrollbars
         */
        var hscrollArea = new Kinetic.Rect({
          x: 0,
          y: stage.getHeight() - 30,
          width: stage.getWidth(),
          height: 20,
          fill: "black",
          alpha: 0.3
        });

        var hscroll_l = new Kinetic.Rect({
          x: pos_cur1,
          y: stage.getHeight() - 30,
          width: width_cursors,
          height: 20,
          fill: "#9f005b",
          draggable: true,
          dragConstraint: "horizontal",
          dragBounds: {
            left: 0,
            right: posr,
            setRight: function(r){
            	this.right=r;
          	}
          },
          getDragBounds:function(){
          	return this.dragBounds;
          },
          alpha: 0.9,
          stroke: "black",
          strokeWidth: 1
        });

        var hscroll_r = new Kinetic.Rect({
          x: pos_cur2+10,
          y: stage.getHeight() - 30,
          width: width_cursors,
          height: 20,
          fill: "#9f005b",
          draggable: true,
          dragConstraint: "horizontal",
          dragBounds: {
            left: posl,
            right: stage.getWidth() - 10,
            setLeft: function(l){
            	this.left=l;
            }
          },
          getDragBounds: function(){
            return dragBounds;
          },
          alpha: 0.9,
          stroke: "black",
          strokeWidth: 1
        });

        /*
         * scrollbars
         */
        scrollbars.on("mouseover", function() {
          document.body.style.cursor = "pointer";
        });
        scrollbars.on("mouseout", function() {
          document.body.style.cursor = "default";
        });
        layer.beforeDraw(function() {
          hscroll_l.getDragBounds().setRight(hscroll_r.getPosition().x-10);
          hscroll_r.getDragBounds().setLeft(hscroll_l.getPosition().x+10);
          pos_cur1=hscroll_l.getPosition().x;
          pos_cur2=hscroll_r.getPosition().x-10;
          var text_canvas=document.getElementById("text_cut");
          text_canvas.height=20;
          text_canvas.style.height="20px";
          text_canvas.width=100;
          text_canvas.style.width="100px";
          text_canvas.style.top="0px";
          //text_canvas.width=text_canvas.width;
          var c_=text_canvas.getContext("2d")

          c_.font = "18px Arial";
		  // Use a brown fill for our text
		  c_.fillStyle = '#FFFFFF';
		  // Text can be aligned when displayed
		  c_.textAlign = 'left';
		  c_.textBaseline = "top";//top, hanging, middle, alphabetic, ideographic, bottom
		  // Draw the text in the middle of the canvas with a max
		  //  width set to center properly
		  c_.fillText("1: "+Math.round(((pos_cur1 * temp_object.duration) / 481))+' S. | 2: '+Math.round((pos_cur2 * temp_object.duration) / 481)+" S.", 0, 0, 100); //fillText (text, x, y, maxwidth), strokeText (text, x, y, maxwidth)
          cortar_contenido = true;
        });

        areas.add(hscrollArea);
        scrollbars.add(hscroll_l);
        scrollbars.add(hscroll_r);
        layer.add(areas);
        layer.add(scrollbars);
        stage.add(layer);

        //--------------------------------------------------------------------------------------//


    }

}

function cerrar_video(){
    var vid_temp = document.getElementById("video");
    if (!vid_temp.paused){
        vid_temp.pause();
    }
	document.body.removeChild(document.getElementById("_background"));
    document.getElementById("C_Video").style.visibility = "hidden";
    document.getElementById("C_Video").style.zIndex = "0";
    ver_contenido = false;
    if (isCutteable){
        var celda = document.getElementById("cut_video");
        celda.innerHTML = "";
        isCutteable = false;
        if (cortar_contenido){
        	console.log("--> "+pos_cur1+"  "+pos_cur2);
            // vemos si hubo cambio en los cursores para cortar el contenido
            var temp_object = vector_edicion[idElementEdit];
            var cutHome = (pos_cur1 * temp_object.duration) / 481;
            // de esta forma obtengo la pos en segundos del cursor 1, recordar que el maximo valor de cuantificacion para este caso es de 481 pasos
            var cutEnd = (pos_cur2 * temp_object.duration) / 481;
            // de esta forma obtengo la pos en segundos del cursor 1, recordar que el maximo valor de cuantificacion para este caso es de 481 pasos
            temp_object.cut_home = cutHome;
            temp_object.cut_end = cutEnd;

            console.log("los puntos de corte son: home: " + cutHome + " end: " + cutEnd)

            vector_edicion[idElementEdit] = temp_object;

            console.log("Elemento editado fue id: " + idElementEdit + " idContent: " + vector_edicion[idElementEdit].idContent + " home: " + vector_edicion[idElementEdit].cut_home + " end: " + vector_edicion[idElementEdit].cut_end + " transition " + vector_edicion[idElementEdit].idTransition);

            cortar_contenido = false;
        }

        pos_cur1 = 0;
        pos_cur2 = lim_x - 10;
    }

}

function resaltar_PELT(id, estado){
    if (estado == 0){
        //entra
        canvas = document.getElementById(id);
        context = canvas.getContext('2d');
        context.fillStyle = '#D7FF53';
        context.fillRect(0, 0, 100, 100);

    }
    else{
        //sale
        canvas = document.getElementById(id);
        canvas.width = canvas.width;
        // artilugio para borrar el lienzo del canvas
        context = canvas.getContext('2d');
        context.fillStyle = '#6699FF';
        context.fillRect(0, 0, 100, 100);
    }
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

function vol_down(){
	vol--;
	if(vol<=0){
		vol=0;
	}
	video.volume=vol/100;
	set_value_progres_bar("bar_vol", vol);
}

function vol_up(){
	vol++;
	if(vol>=99){
		vol=99;
	}
	video.volume=vol/100;
	set_value_progres_bar("bar_vol", vol);
}
//******************************************************************************************************************************//

//***************************************************** SOLO PRE EDICION *******************************************************//
function addContentVE_AJAX(id){
	index_drop_temp=index_drop;
	console.log("EPA! estoy añadiendo el index"+index_drop_temp);
	$.ajax({
		url : "/ContentProcessorServer/ObjectImportServlet",
		data : "dependencia=0&mainObject=1&mainId=" + id,
		type : "POST",
		contentType: "application/x-www-form-urlencoded;charset=iso-8859-1",
		cache : true,
		success : function(response) {
			var content = jQuery.parseJSON(response);
    		addContentVE(content,index_drop_temp);
		}
	});
}

function addContentVE(content,index){
    temp_object = new obj_edicion();
    temp_object.id = index;
    temp_object.idContent = content.idContenido;
    temp_object.duration = content.duracion;
    temp_object.cut_home = 0;
    temp_object.cut_end = content.duracion;
    temp_object.idTransition = ( - 1);
    temp_object.src = content.rutafuente;
    vector_edicion.push(temp_object);
    console.log("registrado");
    for (i in vector_edicion){
        console.log("id r: "+vector_edicion[i].id+" id c: " + vector_edicion[i].idContent + " id t: " + vector_edicion[i].idTransition);
    }
}

function intercambiar(id, tipo, src){
    intercambio = id + "*" + tipo + "*"+src+"*";
    console.log("intercambio: " + intercambio);
}

function dropContent(id){
    if (obtenerElemento(intercambio, 1, '*') == 0){
        // verificamos si el elemento arrastrado pertenece al dropContent
        //removiendo el canvas utlizado para hacer el drop
        var canvas = document.getElementById(id);
        canvas.parentNode.removeChild(canvas);

        //obteniendo la celda en la cual se va a insertar el nuevo contenido
        celda = document.getElementById(index_drop + "_" + "c_");
        var thumbnail = document.createElement("img");

        //generando e insertand nuevo contenido
        console.log(obtenerElemento(intercambio, 2, '*'));
        thumbnail.src = obtenerElemento(intercambio, 2, '*');
        thumbnail.height=90;
        thumbnail.width=110;
        thumbnail.id = "LT" + index_drop + "_" + obtenerElemento(intercambio, 0, '*') + "_";
        //LT_(id_imagen) si esto no se hace habria un conflicto al querer obtener el elemento por medio de su id
        thumbnail.onclick = function(){
        	//guardando temporalmente el id del elemento clickeado
			swap_id=this.id;
			font = new FontCanvas();
			font.font = "Arial";
			font.size = 13;
			font.color = "#FFFFFF";
			elements_t = ["Editar","Eliminar"];
			ver_menu = create_listening_menu("div_vertical_menu", elements_t, font, "#101010", "#51504B");
			//Sobrecargando el evento onmousedown del elemento ver_menu
			ver_menu.onmousedown = function() {
				type_element = get_id_click_element_menuBar(this.id, event.clientY) + 1;
				console.log(type_element);
				switch(type_element){
					case 1:{
						//console.log("this: " + document.getElementById(swap_id).parentNode.id);
            			//idElementEdit = obtenerElemento(document.getElementById(swap_id).parentNode.id, 0, '_');
            			index = obtenerElemento(document.getElementById(swap_id).parentNode.id, 0, '_');
            			//console.log(index);
            			idElementEdit = search_idElement_by_index(index);
            			isCutteable = true;
            			//console.log("--------> "+idElementEdit+" "+obtenerElemento(document.getElementById(swap_id).id, 1, '_'));
           				PlayContentbyID(obtenerElemento(document.getElementById(swap_id).id, 1, '_'));
						break;
					}
					case 2:{
						index = obtenerElemento(document.getElementById(swap_id).parentNode.id, 0, '_');
						delete_element_vector_edition(search_idElement_by_index(index));
						document.all.fila_tiempo.deleteCell(document.getElementById(swap_id).parentNode.cellIndex+1);
						document.all.fila_tiempo.deleteCell(document.getElementById(swap_id).parentNode.cellIndex);
						break;
						}
					default:{
						break;
					}
				}
			}
            // click en la linea de tiempo
            /*console.log("this: " + this.parentNode.id);
            idElementEdit = obtenerElemento(this.parentNode.id, 0, '_');
            isCutteable = true;
            PlayContentbyID(obtenerElemento(this.id, 1, '_'));*/
        }
        celda.appendChild(thumbnail);

        //a�adiendo contenido al descriptor  de informacion sobre el vector de edicion
        addContentVE_AJAX(obtenerElemento(intercambio, 0, '*'));
        //Id real no el del thumbnail, puesto que este ha sido modificado con LT_
        //**************************************************haciendo las nuevas celdas drop
        index_drop++;
        //garantiza la restriccion unica de los ID de los contenidos dropeados
        var FILA = document.getElementById("fila_tiempo");
        var C_C = FILA.insertCell( - 1);
        C_C.id = index_drop + "_c_";
        var C_T = FILA.insertCell( - 1);
        C_T.id = index_drop + "_t_";

        //canvas drop para transicion, solo se crea cuando se hace un drop de contenido
        canvas_t = document.createElement("canvas");
        canvas_t.id = index_drop + "_LT_T";
        canvas_t.width = "25";
        canvas_t.height = "90";
        canvas_t.getContext('2d').fillStyle = '#6699FF';
        canvas_t.getContext('2d').fillRect(0, 0, 100, 100);
        canvas_t.onmouseover = function(event){
            resaltar_PELT(this.id, '0');
        }
        canvas_t.onmouseout = function(){
            resaltar_PELT(this.id, '1');
        }
        canvas_t.ondragover = function(){
            OverDrag();
        }
        canvas_t.ondrop = function(){
            dropTransition(this.id);
        }

        //canvas drop para contenido
        canvas_c = document.createElement("canvas");
        canvas_c.id = index_drop + "_LT_C";
        canvas_c.width = "100";
        canvas_c.height = "90";
        canvas_c.getContext('2d').fillStyle = '#6699FF';
        canvas_c.getContext('2d').fillRect(0, 0, 100, 100);
        canvas_c.onmouseover = function(){
            resaltar_PELT(this.id, '0');
        }
        canvas_c.onmouseout = function(){
            resaltar_PELT(this.id, '1');
        }
        canvas_c.ondragover = function(){
            OverDrag();
        }
        canvas_c.ondrop = function(){
            dropContent(this.id);
        }

        C_T.appendChild(canvas_t);
        C_C.appendChild(canvas_c);
    } else{
        console.log("elemento de transicion");
        if (vector_edicion[obtenerElemento(id, 0, '_')] != null){
            console.log("Transicion no activada");
        }

    }
}

function search_idElement_by_index(id){
	for(i in vector_edicion){
		if(vector_edicion[i].id==id){
			return i;
		}
	}
}

function delete_element_vector_edition(index){
	vector_edicion.splice(index,1);
}

function dropTransition(id){
    if (obtenerElemento(intercambio, 1, '*') == 1){
        //comprobando si pertenece a una transicion
        console.log("Elemento de transicion");
        index=search_idElement_by_index(obtenerElemento(id, 0, '_'))
        if (vector_edicion[index] != null){
            console.log("Transicion activada");
            //removiendo el canvas utlizado para hacer el drop
            var canvas = document.getElementById(id);
            canvas.parentNode.removeChild(canvas);

            //obteniendo la celda en la cual se va a insertar el nuevo contenido
            celda = document.getElementById(obtenerElemento(id, 0, '_') + "_t_");
            celda.width = "25px";
            var thumbnail = document.createElement("img");

            //generando e insertando nuevo contenido  width="25" height="90"
            thumbnail.src = obtenerElemento(intercambio, 2, '*');
            thumbnail.style.width = "25px";
            thumbnail.style.height = "90px";
            thumbnail.id = "LT_" + obtenerElemento(id, 0, '_') + "_" + obtenerElemento(intercambio, 0, '*') + "_T_";
            //LT_(id_imagen) si esto no se hace habria un conflicto al querer obtener el elemento por medio de su id
            celda.appendChild(thumbnail);

            //Modificando el estado de la transicon del elemnto seleccionado
            var temp_object_ = vector_edicion[index];
            console.log("id transicion cambiada " + obtenerElemento(intercambio, 0, '*'));
            temp_object_.idTransition = obtenerElemento(intercambio, 0, '*');
            vector_edicion[index] = temp_object_;

        }
    }
}

function OverDrag(){
    event = event || window.event;
    event.returnValue = false;
}
//******************************************************************************************************************************//

//***************************************************** SOLO EDICION ***********************************************************//
var processor = {

	timerCallback : function() {

		if(ver_contenido) {
			return;
		}

		if(end_video) {
			return;
			//this.video.pause();
		}

		//console.log(this.video.currentTime);
		if(this.video.currentTime > corte_final) {
			//acummulated_time=corte_final;
			if(trans_on) {
				if(test_flag) {
					//***************** TEST
					test_flag = false;
					console.log(this.video.currentTime);
					console.log("Estoy en redireccion de transicion");
				}
				set_value_progres_bar("bar_p", Math.round(((this.video.currentTime-corte_inicial+acummulated_time)*time_factor)));
				this.transicion();
				var self = this;
				setTimeout(function() {
					self.timerCallback();
				}, 0);
				return;
			}

			if(indice_play < (vector_edicion.length - 1)) {
				acummulated_time+=(vector_edicion[indice_play].cut_end-vector_edicion[indice_play].cut_home);
				indice_play++;
				//******************************************
				console.log("estoy en play " + indice_play);

				this.video.src = "/ContentRepository/" + vector_edicion[indice_play].src;
				console.log(this.video.src);
				this.video.load();
				corte_inicial = vector_edicion[indice_play].cut_home;

				console.log(vector_edicion[indice_play].cut_end);
				corte_final = vector_edicion[indice_play].cut_end;

				if(vector_edicion[indice_play] != null && vector_edicion[indice_play].idTransition != '-1') {
					//corte_final=(corte_final-5);
					corte_final=corte_final-4;
					trans_on = true;
					test_flag = true;
					//*************** TEST
				}

				console.log(corte_final);

				if(corte_inicial > 0) {
					//setTimeout("document.getElementById('video').currentTime=corte_inicial",100);
					video.addEventListener("loadeddata", function() {
						console.log("loaded data!!!");
						this.currentTime = corte_inicial;
						this.play();
					}, false);
				} else {
					video.play();
				}

			} else {
				this.video.pause();
				console.log("termino!!!!!");
				time_factor=0;
				acummulated_time=0;
				time_edit=0;
				indice_play = 0;
				trans_on = false;
				alpha = 255;
				end_video = true;
			}
		} else {
			set_value_progres_bar("bar_p", Math.round(((this.video.currentTime-corte_inicial+acummulated_time)*time_factor)));
			this.processorFrame();
		}

		//***************************
		var self = this;
		setTimeout(function() {
			self.timerCallback();
		}, 0);
	},
	doLoad : function() {
		this.video = document.getElementById("video");
		this.c = document.getElementById("canvas_video");
		this.ctx = this.c.getContext("2d");

		var self = this;
		this.video.addEventListener("play", function() {
			self.width = self.video.videoWidth / 2;
			self.height = self.video.videoHeight / 2;

			self.timerCallback();
		}, false);
		console.log("estoy en processor.doLoad");
	},
	processorFrame : function() {
		if(!trans_off) {
			this.ctx.drawImage(this.video, 0, 0, 300, 144);

			return;
		} else {
			this.ctx.drawImage(this.video, 0, 0, 300, 144);
			var frame = this.ctx.getImageData(0, 0, 380, 320);
			var l = frame.data.length / 4;
			for(var i = 0; i < l; i++) {
				frame.data[i * 4 + 3] = alpha;
			}

			this.ctx.putImageData(frame, 0, 0);
			//alert(alpha);
			alpha = alpha + 2;
			if(alpha > 254) {
				//this.video.pause();
				this.ctx.putImageData(frame, 0, 0);
				trans_off = false;

			}
			return;
		}
	},
	transicion : function() {
		console.log("Transicion !!!");
		if(fade_out(idCanvasVideo, idVideo)) {
			console.log(this.video.currentTime);
			trans_on = false;
		}
		return;
	}
};

function play() {
	for(i in vector_edicion){
		time_edit+=(vector_edicion[i].cut_end-vector_edicion[i].cut_home);
	}
	time_factor=(100/time_edit);
	//console.log("time edit: "+time_factor);
	var video = document.getElementById("video");
	video.volume=vol/100;
	if(vector_edicion[0] != null) {

		var carga = false;
		end_video = false;
		indice_play = 0;
		console.log("estoy en play " + indice_play);
		//video.src=obtenerElemento(vector_edicion[0],1,'*');
		video.src = "/ContentRepository/" + vector_edicion[0].src;
		video.load();
		console.log(vector_edicion[0].src);
		//corte_inicial=obtenerElemento(vector_edicion[0],2,'*');
		corte_inicial = Math.round(vector_edicion[0].cut_home);
		corte_final = (vector_edicion[0].cut_end);
		console.log(vector_edicion[0].cut_end);

		if(vector_edicion[0] != null && vector_edicion[0].idTransition != "-1") {
			//OJO aqui hay un problema de tiempos cuando el video por ejemplo se corta en menos de cinco segundos
			//corte_final=(corte_final);//OJO esta sentencia ya no es necesaria, la forma como se dise�o el algoritmo no necesita ajustarse el tiempo el mismo lo ajusta, con esto se revierte la advertencia del anterior renglon
			corte_final=corte_final-4;
			trans_on = true;
			test_flag = true;
			//*************** TEST
		}

		if(corte_inicial > 0) {
			video.addEventListener("loadeddata", function() {
				console.log("loaded data!!!");
				this.currentTime = corte_inicial;
				this.play();
			}, false);
		} else {
			video.play();
		}

	} else {
		alert('Ud no ha colocado elementos en la linea de tiempo')
	}

}

function pause() {
	var video = document.getElementById("video");
	video.pause();
}
//******************************************************************************************************************************//

//********************************************************* OTROS **************************************************************//
function obtenerElemento(chain, numElemento, token){
    // funcion analoga al split, anteponerle siempre al ultimo dato el token ejemplo "dato*"
    if (chain == "" || chain == null){
        return null;
    }

    var moreElements = true;
    var elemento = "";
    //var texto = chain;
    var len = chain.length;
    var indexOfToken = 0,
    lastIndex = 0;
    var nE = 0;

    while (moreElements){
        indexOfToken = chain.indexOf(token, lastIndex);
        elemento = chain.substring(lastIndex, indexOfToken);
        lastIndex = indexOfToken + 1;
        if (lastIndex >= len){
            moreElements = false;
        }
        if (numElemento == nE){
            return elemento;
        }
        nE++;
    }
    return null;

}

function do_save(){
	//codifico en JSON el descriptor
	console.log("do save");
    jsonStr = JSON.stringify(vector_edicion);
    //peticion AJAX para obtener los valores del elemento asociado
    $.ajax({
        url: "/ContentProcessorServer/ContentProcessorServlet",
        data: "operation=7&descriptor=" + jsonStr,
        type: "POST",
        contentType: "application/x-www-form-urlencoded;charset=iso-8859-1",
        cache: true,
        success: function(response){
            //Obteniendo elemento de la BD
            console.log("response: " + response);
            if (response != "" && response.substring(0, 9) != "redirect:"){
                console.log(response);

            } else if (response.substring(0, 9) == "redirect:" && response != ""){
                window.location = response.substr(9);
            }
        }
    });
}
//******************************************************************************************************************************//
