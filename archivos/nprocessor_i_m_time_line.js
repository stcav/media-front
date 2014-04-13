// JavaScript Document Update 0700611
var swap;
// 1 -> content + Transitions,  2 -> Color, 3 -> Text, 4 -> Services
var type_element = 0;
// tamaño en pixeles de las lineas del mapa de interactividad
var size_line = 1800;
var elements_lc;
var elements_lt;
var elements_li;

var canvasWidth = 1800;
var canvasHeight = 100;
var elementY = 20;
var elementHeight = canvasHeight - elementY;
var tamCurSize = 4;

var color_element_normal = "rgba(0,0,0,0.5)";
var color_element_over = "rgba(174,238,26,0.1)";
var color_transition = "rgba(255,128,0,0.5)";
var color_bar = "rgb(88,88,88)";
var color_cursor = "rgb(0,0,0)";
var color_lines = "#3322FF";

var color_default_duration = 10;
var text_default_duration = 10;
var service_default_duration = 60;

var homeElementTemp=0;
var endElementTemp=0;

ElementsLine = function(){
    this.elements = new Array();
    this.seconds = 0;
    this.pixels = 0;
    this.elementOverNow = new Element();
    //dice si el evento over ya ha sido lanzado, estara activo siempre que haya un elemento en over 
    this.flagOver = false;
    //variable para efectos de integridad grafica cuando se realice un over sobre un elemento reciendo droppeado
    this.isDropOverNow = false;
    //tipo de ElementLine 1-> content 2-> Texto 3-> Servicio interactivo
    this.type = 0;

    //**** Solo para format operation: resize & move, los parametros son compartidos ****//
    //bandera para establecer si se inicio la accion de modificacion en move o en resize
    this.isMove = false;
    this.limXL = 0;
    this.limXR = 0;
    this.referencePoint = 0;
    this.finalPoint = 0;
    //0-> move,1->resize
    this.action = 0;
    //solo para resize, 0-> left 1-> rigth
    this.cursor = 0;

    //***** solo para click ******//
    this.isClick = true;
}

Element = function(){
    this.id = "";
    this.home = "";
    this.end = "";
    //1-> contenido + transiciones, 2 -> Color, 3->Texto, 4-> Servicios
    this.type = "";
    this.duration = "";
    this.isMovable = false;
    this.isResizable = false;
    //Solo para elementos de video
    this.availableTransition = false;
    this.homeTransition = ( - 1);
    this.endTransition = ( - 1);
    //Solo para elementos de color
    this.color = "rgb(0,0,0)";
    //solo para elementos de texto
    this.font = "";
    this.text = "";
}

function verificando(){
    console.log(get_cursor_canvas_positionX(document.getElementById("line_content"), event.clientX));
    console.log("Ahora para Y");
    console.log(get_cursor_canvas_positionY(document.getElementById("line_content"), event.clientY));

}

function init(){
    console.log("Init");
    elements_lc = new ElementsLine();
    elements_lc.type = 1;
    elements_lt = new ElementsLine();
    elements_lt.type = 2;
    elements_li = new ElementsLine();
    elements_li.type = 3;


    //************ Creando el line time METRICA a base de canvas *****************//
    div_metrica = document.getElementById("div_metrica");
    canvas = document.createElement("canvas");
    canvas.id = "line_metrica";
    canvas.height = "30";
    canvas.width = canvasWidth;
    canvas.getContext('2d').fillStyle = '#000000';
    canvas.getContext('2d').fillRect(0, 0, size_line + 4, 30);
    canvas.getContext('2d').strokeRect(0, 0, size_line + 4, 30);

    //Marco de metrica de pixeles de la linea de tiempo
    canvas.getContext('2d').fillStyle = '#000000';
    canvas.getContext('2d').fillRect(0, 0, size_line + 4, 30);

    //Numeros de la metrica
    canvas.getContext('2d').font = "15px verdana";
    canvas.getContext('2d').fillStyle = '#FFFFFF';
    canvas.getContext('2d').textAlign = 'left';
    for (var i = 0; i < 36; i++){
        canvas.getContext('2d').fillText("|" + (i * 50), (i * 50), 20, 60);
    }
    div_metrica.appendChild(canvas);

    //************************ Creando el line time CONTENT a base de canvas ***********************//
    div_lc = document.getElementById("div_lc");
    canvas = document.createElement("canvas");
    canvas.id = "line_content";
    canvas.height = canvasHeight;
    canvas.width = canvasWidth;

    canvas.getContext('2d').strokeStyle = "rgb(0, 0, 0)";
    //rgba(0,0,0,0) para transparencias 
    canvas.getContext('2d').lineWidth = 1;
    canvas.getContext('2d').fillStyle = color_lines;
    canvas.getContext('2d').fillRect(0, 0, size_line + 4, canvasHeight);
    canvas.getContext('2d').strokeRect(0, 0, size_line + 4, canvasHeight);

    canvas.getContext('2d').fillStyle = color_bar;
    canvas.getContext('2d').fillRect(0, 0, size_line + 4, elementY);
    canvas.getContext('2d').strokeRect(0, 0, size_line + 4, elementY);

    //Estableciendo los eventos por medio de funciones anonimas
    canvas.ondragover = function(){
        OverDrag();
    }
    canvas.ondrop = function(){
        dropContent(this.id);
    }
    canvas.onmouseup = function(){
        //console.log("mouse up!");
        processor_over_up(this.id, elements_lc);
    }
    canvas.onmousedown = function(){
        //console.log("mouse down!");
        processor_over_down(this.id, elements_lc);
    }
    canvas.onmouseout = function(){
        //console.log("mouse out!");
        normalize_line(this.id, elements_lc);
    }
    canvas.onmouseover = function(){
        //console.log("mouse over!");
        }
    canvas.onmousemove = function(){
        //console.log("mouse move!");
        move_line(this.id, elements_lc);
    }
    canvas.onclick = function(){
        clickElement(this.id, elements_lc)
    }
    div_lc.appendChild(canvas);

    //************************ Creando el line time TEXT a base de canvas ***********************//
    div_lt = document.getElementById("div_lt");
    canvas = document.createElement("canvas");
    canvas.id = "line_text";
    canvas.height = canvasHeight;
    canvas.width = canvasWidth;

    canvas.getContext('2d').strokeStyle = "rgb(0, 0, 0)";
    //rgba(0,0,0,0) para transparencias 
    canvas.getContext('2d').lineWidth = 1;
    canvas.getContext('2d').fillStyle = color_lines;
    canvas.getContext('2d').fillRect(0, 0, size_line + 4, canvasHeight);
    canvas.getContext('2d').strokeRect(0, 0, size_line + 4, canvasHeight);

    canvas.getContext('2d').fillStyle = color_bar;
    canvas.getContext('2d').fillRect(0, 0, size_line + 4, elementY);
    canvas.getContext('2d').strokeRect(0, 0, size_line + 4, elementY);

    //Estableciendo los eventos por medio de funciones anonimas
    canvas.ondragover = function(){
        OverDrag();
    }
    canvas.ondrop = function(){
        dropText(this.id);
    }
    canvas.onmouseup = function(){
        //console.log("mouse up!");
        processor_over_up(this.id, elements_lt);
    }
    canvas.onmousedown = function(){
        //console.log("mouse down!");
        processor_over_down(this.id, elements_lt);
    }
    canvas.onmouseout = function(){
        //console.log("mouse out!");
        normalize_line(this.id, elements_lt);
    }
    canvas.onmouseover = function(){
        //console.log("mouse over!");
        }
    canvas.onmousemove = function(){
        //console.log("mouse move!");
        move_line(this.id, elements_lt);
    }
    canvas.onclick = function(){
        clickElement(this.id, elements_lt)
    }
    div_lt.appendChild(canvas);

    //************************ Creando el line time INTERACTIVE a base de canvas ***********************//
    div_li = document.getElementById("div_li");
    canvas = document.createElement("canvas");
    canvas.id = "line_interactive";
    canvas.height = canvasHeight;
    canvas.width = canvasWidth;

    canvas.getContext('2d').strokeStyle = "rgb(0, 0, 0)";
    //rgba(0,0,0,0) para transparencias 
    canvas.getContext('2d').lineWidth = 1;
    canvas.getContext('2d').fillStyle = color_lines;
    canvas.getContext('2d').fillRect(0, 0, size_line + 4, canvasHeight);
    canvas.getContext('2d').strokeRect(0, 0, size_line + 4, canvasHeight);

    canvas.getContext('2d').fillStyle = color_bar;
    canvas.getContext('2d').fillRect(0, 0, size_line + 4, elementY);
    canvas.getContext('2d').strokeRect(0, 0, size_line + 4, elementY);

    //Estableciendo los eventos por medio de funciones anonimas
    canvas.ondragover = function(){
        OverDrag();
    }
    canvas.ondrop = function(){
        dropServices(this.id);
    }
    canvas.onmouseup = function(){
        //console.log("mouse up!");
        processor_over_up(this.id, elements_li);
    }
    canvas.onmousedown = function(){
        //console.log("mouse down!");
        processor_over_down(this.id, elements_li);
    }
    canvas.onmouseout = function(){
        //console.log("mouse out!");
        normalize_line(this.id, elements_li);
    }
    canvas.onmouseover = function(){
        //console.log("mouse over!");
        }
    canvas.onmousemove = function(){
        //console.log("mouse move!");
        move_line(this.id, elements_li);
    }
    canvas.onclick = function(){
        clickElement(this.id, elements_li)
    }
    div_li.appendChild(canvas);

    //************************************** Barra de menu ***************************************//
    elements_t = ["Multimedia", "Transiciones", "Colores", "Texto","Servicios"];
    bar = createMenuBar("menuBar", elements_t, 500, 20, "12px Impact");
    bar.onclick = function(){
    	type_element=get_id_click_element_menuBar(this.id, event.clientX)+1;
        console.log(type_element);
        procesor_menu_elements(type_element);
    }
    div_container=document.getElementById("div_bar_menu");
    div_container.className="C_Menu";
    div_container.appendChild(bar);

	//********************************** Panel de elementos **************************************//
	div_container=document.getElementById("div_element_menu");
	div_container.className="C_Panel";
	
	//*********************************** Panel de busquedas *************************************//
	div_container=document.getElementById("div_element_search");
	div_container.className="C_Search";
	search_element=document.getElementById("search_element");
	search_element.onkeyup= function(){
		if(type_element!=1){
			return;
		}
		$.ajax({
			        	url:  "/ContentProcessorServer/ContentProcessorServlet",
				        data: "operation=3&idCommunity="+1+"&token="+this.value,
				        type: "POST",
				        cache: true,
				        success: function(response){
				            //Obteniendo elemento de la BD
				            console.log("response: " + response);
				            var contents = jQuery.parseJSON(response);
				            var contents = jQuery.parseJSON(response);
	           	 			creation_grid(contents,"div_element_menu");
	            			load_content_panel(contents);
				       }
		    	});
		
	}
	//************************************ Panel de video ****************************************//
	td_container=document.getElementById("td_canvas_video");
	td_container.className="TD_Video";
	div_container=document.getElementById("div_canvas_video");
	div_container.className="C_Video";
	video_=document.createElement("video");
	video_.id="video_element_im";
	video_.width=500;
	video_.height=356;
	video_.videoWidth=492;
	video_.videoHeight=277;
	video_.controls=true;
	video_.addEventListener("loadeddata", function () {
	  console.log("loaded data!!!");
	  this.play();
	}, false);
	div_container.appendChild(video_);

    //******************************* metodos de la capa info ************************************//
    document.getElementById("doneinfo").onclick = function(){
        deactivate_bloq();
    }

    console.log("ancho disponible " + screen.availWidth);

    div_bloq = document.createElement("div");
    div_bloq.id = "div_bloq";
    div_bloq.width = 1150;
    div_bloq.height = 990;
    div_bloq.style.left = 0;
    div_bloq.style.top = 0;
    div_bloq.style.position = "absolute";
    div_bloq.style.zIndex = ( - 1);
    div_bloq.style.visibility = "hidden";

    canvas_bloq = document.createElement("canvas");
    canvas_bloq.width = 1150;
    canvas_bloq.height = 990;
    canvas_bloq.getContext('2d').fillStyle = 'rgba(0,0,0,0.7)';
    canvas_bloq.getContext('2d').fillRect(0, 0, 1150, 990);

    div_bloq.appendChild(canvas_bloq);
    document.body.appendChild(div_bloq);

    //***************************** Varios *****************************//
    //Centrando la capa INFO
    document.getElementById("info").style.left = (1150 / 2) - 238;
    document.getElementById("info").style.top = (990 / 2) - 129;
    //mostrando el primer menu -> multimedia
    type_element=1;
    procesor_menu_elements(type_element);
}

//************************************************************************************************************************//
//************************************************ Funciones PARTENON ****************************************************//
//************************************************************************************************************************//
function clickElement(id, e){
    if (!e.isClick){
        e.isClick = true;
        return;
    }

    canvas = document.getElementById(id);
    posX = get_cursor_canvas_positionX(canvas, event.clientX);
    index_element = is_over_line(posX, e);
    if (index_element == ( - 1)){
        return;
    }

    //activando la capa de bloqueo
    document.getElementById("div_bloq").style.zIndex = 2;
    document.getElementById("div_bloq").style.visibility = "visible";

    var url = "";
    var option = "";

    switch (e.elements[index_element].type){
    case 1:
        {
            console.log("content");
            url = "/ContentProcessorServer/ContentProcessorServlet";
            option = "2";
            break;
        }
    case 2:
        {
            console.log("color");
            url = "/PartenonServer/ColorProcessorServlet";
            option = "1";
            break;
        }
    case 3:
        {
            console.log("text");
            url = "/PartenonServer/TextProcessorServlet";
            option = "1";
            break;
        }
    case 4:
        {
        	console.log("interactive");
            url = "/AssociateInteractiveServer/ServicesProcessorServlet";
            option = "1";
            break;
        }
    default:
        {
            console.log("BUG!");
            break;
        }
    }

    $.ajax({
        url:
        url,
        data: "operation=" + option + "&id=" + e.elements[index_element].id,
        type: "POST",
        cache: true,
        success: function(response){
            //Obteniendo elemento de la BD
            console.log("response: " + response);
            var obj = jQuery.parseJSON(response);


            switch (e.elements[index_element].type){
            case 1:
                {
                    //**Detalles de imagen
                    imgTemp = document.createElement("img");
                    imgTemp.src = "/PosterRepository/" + obj.rutascreenshot;
                    imgTemp.width=150;
                    imgTemp.height=84;
                    imgTemp.onload = function(){
                        document.getElementById("imageInfo").innerHTML = "";
                        document.getElementById("imageInfo").appendChild(imgTemp);
                    }
                    //**Detalles de id
                    textField = document.getElementById("titleInfo");
                    textField.innerHTML = "<b>" + obj.titulo;
                    textField.innerHTML += "<br> Contenido";
                    //**Detalles varios
                    textField = document.getElementById("detailInfo");
                    textField.innerHTML = "Duracion: " + obj.duracion + " Segundos";
                    textField.innerHTML += "<br> Sinopsis: " + obj.sinopsis;
                    //**Edicion
                    editionField = document.getElementById("editionInfo");

                    //limpiando los antiguos elementos graficos y logicos
                    document.getElementById("editionInfo").innerHTML = "";
                    div_edition_transition(e, index_element);

                    break;
                }
            case 2:
                {
                    //**Detalles de imagen
                    canvas_temp = document.createElement("canvas");
                    canvas_temp.width = 100;
                    canvas_temp.height = 100;
                    canvas_temp.getContext('2d').fillStyle = obj.codigoRGB;
                    canvas_temp.getContext('2d').fillRect(0, 0, 100, 100);
                    imgTemp = document.createElement("img");
                    imgTemp.src = canvas_temp.toDataURL("image/jpeg");
                    imgTemp.width=100;
                    imgTemp.height=100;
                    imgTemp.onload = function(){
                        document.getElementById("imageInfo").innerHTML = "";
                        document.getElementById("imageInfo").appendChild(imgTemp);
                    }
                    //**Detalles de id
                    textField = document.getElementById("titleInfo");
                    textField.innerHTML = "<b>" + obj.nombre;
                    textField.innerHTML += "<br> Color";
                    //**Detalles varios
                    textField = document.getElementById("detailInfo");
                    textField.innerHTML = "Duracion: " + e.elements[index_element].duration + " Segundos";
                    //**Edicion    
                    editionField = document.getElementById("editionInfo");

                    //limpiando los antiguos elementos graficos y logicos
                    document.getElementById("editionInfo").innerHTML = "";
                    div_edition_transition(e, index_element);
                    break;
                }
            case 3:
                {
                    //**Detalles de imagen
                    canvas_temp = document.createElement("canvas");
                    canvas_temp.width = 100;
                    canvas_temp.height = 100;
                    canvas_temp.getContext('2d').fillStyle = "rgb(0,0,0)";
                    canvas_temp.getContext('2d').fillRect(0, 0, 100, 100);
                    canvas_temp.getContext('2d').font = "20px " + obj.font;;
                    canvas_temp.getContext('2d').fillStyle = '#FFFFFF';
                    canvas_temp.getContext('2d').textAlign = 'center';
                    canvas_temp.getContext('2d').textBaseline = "middle";
                    canvas_temp.getContext('2d').fillText('AaBbCc', 50, 50, 100);

                    imgTemp = document.createElement("img");
                    imgTemp.src = canvas_temp.toDataURL("image/jpeg");
                    imgTemp.onload = function(){
                        document.getElementById("imageInfo").innerHTML = "";
                        document.getElementById("imageInfo").appendChild(imgTemp);
                    }
                    //**Detalles de id
                    textField = document.getElementById("titleInfo");
                    textField.innerHTML = "<b>" + obj.font;
                    textField.innerHTML += "<br> Texto";
                    //**Detalles varios
                    textField = document.getElementById("detailInfo");
                    textField.innerHTML = "Duracion: " + e.elements[index_element].duration + " Segundos";

                    //**Edicion
                    editionField = document.getElementById("editionInfo");
                    //limpiando los antiguos elementos graficos y logicos
                    document.getElementById("editionInfo").innerHTML = "";
                    fieldText = document.createElement("textarea");
                    fieldText.id = "text_temp";
                    fieldText.cols = 50;
                    fieldText.rows = 5;
                    fieldText.value = e.elements[index_element].text;
                    fieldText.onkeyup = function(){
                        index_element = findIndexElementOverNow(e);
                        e.elements[index_element].text = document.getElementById("text_temp").value;
                    }
                    //****************************************************************************************//
                    fieldText_= document.createElement("input");
                    fieldText_.type="text";
                    fieldText_.id="text_h";
                    fieldText_.size=3; 
                    fieldText_.value=elements_lt.elements[index_element].home;   
                    fieldText_.onclick = function(){
                        index_element = findIndexElementOverNow(elements_lt);
                        value_=parseInt(document.getElementById("text_h").value);
                        if(value_>=0 && value_< (parseInt(elements_lt.elements[index_element].end)-4)){
                        	elements_lt.elements[index_element].home=parseInt(document.getElementById("text_h").value);
	                        elements_lt.elements[index_element].duration=(parseInt(elements_lt.elements[index_element].end)-parseInt(elements_lt.elements[index_element].home));
	                        graphicCleanerLineSegment(document.getElementById("line_text"), 0, 1799);
	                        graphicUpdateElementsSinceIndex(document.getElementById("line_text"), elements_lt, 0);
                        }else{
                        	console.log("parametros invalidos");
                        }
                        
                    }          
                    fieldText__= document.createElement("input");
                    fieldText__.type="text";
                    fieldText__.id="text_duration";
                    fieldText__.size=3;
                    fieldText__.value=e.elements[index_element].duration;
                    fieldText__.onclick = function(){
                        index_element = findIndexElementOverNow(e);
                        value_=parseInt(document.getElementById("text_duration").value);
                        max_= parseInt(e.elements[index_element].home)+value_;
                        if(max_<1800 && value_>1){
                        	e.elements[index_element].duration=document.getElementById("text_duration").value;
                        	e.elements[index_element].end=(parseInt(e.elements[index_element].home)+parseInt(e.elements[index_element].duration));
                        	graphicCleanerLineSegment(document.getElementById("line_text"), 0, 1799);
                        	graphicUpdateElementsSinceIndex(document.getElementById("line_text"), elements_lt, 0);
                        }
                        else{
                        	console.log("parametros no validos");
                        }                       
                    }
                    fieldText___= document.createElement("input");
                    fieldText___.type="text";
                    fieldText___.id="text_color";
                    fieldText___.size=4;
                    if(e.elements[index_element].color=="rgb(0,0,0)"){
                    	e.elements[index_element].color="white";
                    }
                    fieldText___.value=e.elements[index_element].color;
                    fieldText___.onclick = function(){
                        index_element = findIndexElementOverNow(e);
                        value_=document.getElementById("text_color").value;
                        if(value_==""){
                        	e.elements[index_element].color="white"
                        }else{
                        	e.elements[index_element].color=value_; 
                        }                  
                    }
                    editionField = document.getElementById("editionInfo");
                    editionField.appendChild(fieldText);
                    //editionField.innerHTML+="<br>&nbsp;Inicio Duraci&oacute;n Color<br>";
                    editionField.appendChild(fieldText_);
                    editionField.appendChild(fieldText__);
                    editionField.appendChild(fieldText___);
                    //****************************************************************************************//
                    div_edition_transition(e, index_element);                    
                    break;
                }
            case 4:
                {
                    //**Detalles de imagen
                    imgTemp = document.createElement("img");
                    imgTemp.src = "/ServicePosterRepository/" + obj.rutascreenshot;
                    imgTemp.width=150;
                    imgTemp.height=84;
                    imgTemp.onload = function(){
                        document.getElementById("imageInfo").innerHTML = "";
                        document.getElementById("imageInfo").appendChild(imgTemp);
                    }
                    //**Detalles de id
                    textField = document.getElementById("titleInfo");
                    textField.innerHTML = "<b>" + obj.nombre;
                    textField.innerHTML += "<br> Servicio";
                    //**Detalles varios
                    textField = document.getElementById("detailInfo");
                    textField.innerHTML = "Duracion: " + e.elements[index_element].duration + " Segundos";
                    //**Edicion
                    editionField = document.getElementById("editionInfo");

                    //limpiando los antiguos elementos graficos y logicos
                    document.getElementById("editionInfo").innerHTML = "";
                    //Analizando si los servicios asociados corresponden a InfoAsociada  -> 1 o  Valoracion -> 2
					//esto genera que la ventana de edicion ytenga un campo de texto
					if(e.elements[index_element].id==1 || e.elements[index_element].id==2) {
						fieldText = document.createElement("textarea");
						fieldText.id = "text_temp";
						fieldText.cols = 50;
						fieldText.rows = 2;
						fieldText.value = e.elements[index_element].text;
						fieldText.onkeyup = function(){
							isServiceInfoAssociate=true;
							if(fieldText.value.length>69){
								alert("Lo sentimos, la informacion no puede exceder un maximo de setenta caracteres");
								fieldText.value=fieldText.value.substring(0,69);
								return;
							}
						 	index_element = findIndexElementOverNow(e);
						 	e.elements[index_element].text = document.getElementById("text_temp").value;
						}
						editionField.appendChild(fieldText);
					}
					//****************************************************************************************//
                    fieldText_= document.createElement("input");
                    fieldText_.type="text";
                    fieldText_.id="text_h";
                    fieldText_.size=3; 
                    fieldText_.value=elements_li.elements[index_element].home;   
                    fieldText_.onclick = function(){
                        index_element = findIndexElementOverNow(elements_li);
                        value_=parseInt(document.getElementById("text_h").value);
                        if(value_>=0 && value_< (parseInt(elements_li.elements[index_element].end)-4)){
                        	elements_li.elements[index_element].home=parseInt(document.getElementById("text_h").value);
	                        elements_li.elements[index_element].duration=(parseInt(elements_li.elements[index_element].end)-parseInt(elements_li.elements[index_element].home));
	                        graphicCleanerLineSegment(document.getElementById("line_interactive"), 0, 1799);
	                        graphicUpdateElementsSinceIndex(document.getElementById("line_interactive"), elements_li, 0);
                        }else{
                        	console.log("parametros invalidos");
                        }
                        
                    }          
                    fieldText__= document.createElement("input");
                    fieldText__.type="text";
                    fieldText__.id="text_duration";
                    fieldText__.size=3;
                    fieldText__.value=e.elements[index_element].duration;
                    fieldText__.onclick = function(){
                        index_element = findIndexElementOverNow(e);
                        value_=parseInt(document.getElementById("text_duration").value);
                        max_= parseInt(e.elements[index_element].home)+value_;
                        if(max_<1800 && value_>1){
                        	e.elements[index_element].duration=document.getElementById("text_duration").value;
                        	e.elements[index_element].end=(parseInt(e.elements[index_element].home)+parseInt(e.elements[index_element].duration));
                        	graphicCleanerLineSegment(document.getElementById("line_interactive"), 0, 1799);
                        	graphicUpdateElementsSinceIndex(document.getElementById("line_interactive"), elements_li, 0);
                        }
                        else{
                        	console.log("parametros no validos");
                        }                       
                    }
                    editionField = document.getElementById("editionInfo");
                    //editionField.appendChild(fieldText);
                    //editionField.innerHTML+="<br>&nbsp;Inicio Duraci&oacute;n<br>";
                    editionField.appendChild(fieldText_);
                    editionField.appendChild(fieldText__);
                    //****************************************************************************************//
                    div_edition_transition(e, index_element);

                    break;
                }
            default:
                {

                    break;
                }
            }
            info = document.getElementById("info");
            info.style.zIndex = 3;
            info.style.visibility = "visible";
        }
    });


}

function processor_over_up(id, e){
    canvas = document.getElementById(id);
    if (!e.isMove){
        return;
    }
    if (e.action == 0){
        //actualizacion para move
        index_temp = findIndexElementOverNow(e);
        e.flagOver = false;
        e.isMove = false;
        //limpiando  las lineas graficas
        graphicCleanerBarSegment(canvas, e.elementOverNow.home + (e.finalPoint - e.referencePoint), e.elementOverNow.end + (e.finalPoint - e.referencePoint));
        console.log("***********///////////////************* Limpiando desde: "+ (e.elementOverNow.home - 1)+" un espacio de: "+(e.elementOverNow.end - e.elementOverNow.home + 2));
        canvas.getContext("2d").clearRect(e.elementOverNow.home - 1, elementY + 1, e.elementOverNow.end - e.elementOverNow.home + 2, elementHeight - 1);
        //actualizando el elemento logica
        e.elements[index_temp].home += e.finalPoint - e.referencePoint;
        e.elements[index_temp].end += e.finalPoint - e.referencePoint;
        //actializando el elemento grafico
        GraphicUpdateElement(canvas, index_temp, e, true);
    } else{
        //actualizacion para resize
        index_temp = findIndexElementOverNow(e);
        console.log("datos anteriores: seconds: " + e.seconds + " pixels: " + e.pixels);
        //borrando las dimensiones y el tiempo del elemento seconds y pixels, para darle paso a las nuevas
        e.seconds = e.seconds - do_pixels_to_seconds(e.elements[index_temp].end - e.elements[index_temp].home, size_line);
        e.pixels = e.pixels - (e.elements[index_temp].end - e.elements[index_temp].home);
        if (e.cursor == 0){
            //Left
            e.elements[index_temp].home = e.finalPoint;
        } else{
            //rigth
            e.elements[index_temp].end = e.finalPoint;
        }
        //estableciendo la duracion del nuevo elemento
        e.elements[index_temp].duration = do_pixels_to_seconds(e.elements[index_temp].end - e.elements[index_temp].home, size_line);
        //Estableciendo el nuevo valor de seconds y pixels
        e.seconds += e.elements[index_temp].duration;
        e.pixels += e.elements[index_temp].end - e.elements[index_temp].home;
        console.log("datos nuevos: seconds: " + e.seconds + " pixels: " + e.pixels);
        //Borrando la linea de elementos
        graphicCleanBar(canvas, index_temp, e);
        graphicCleanerBarSegment(canvas, e.elements[index_temp].end, tamCurSize);
        console.log("***********///////////////************* Limpiando desde: "+ (homeElementTemp )+" un espacio de: "+(endElementTemp - homeElementTemp + 2));
        canvas.getContext("2d").clearRect(homeElementTemp, elementY + 1, endElementTemp - homeElementTemp + 2 + 2, elementHeight - 1);
        //el 2 de e.referencePoint-2 se obtuvo por analisis grafico
        graphicCleanerElementsSegment(canvas, index_temp, e, e.referencePoint - 1);
        //actualizando elementos a nivel logico (Solo para la linea de contenidos, modelo uno-detras-otro)
        if (e.type == 1){
            width_temp = e.finalPoint - e.referencePoint;
            if (e.cursor == 0){
                //left
                //desplaza hacia la izq desde el index_temp
                logicUpdateElementSinceIndex(index_temp, e, width_temp, false);
            } else{
                //rigth
                //desplaza hacia la izq si width_temp es negativo y a la der si es positivo
                logicUpdateElementSinceIndex(index_temp + 1, e, width_temp, true);
            }
        }
        //Actualizando linea grafica
        graphicUpdateElementsSinceIndex(canvas, e, index_temp);
        e.flagOver = false;
        e.isMove = false;
    }
}

function processor_over_down(id, e){
    canvas = document.getElementById(id);
    //Analizando la existencia de un elemento en over
    if (!e.flagOver){
        return;
    }
    posX = get_cursor_canvas_positionX(canvas, event.clientX);
    posY = get_cursor_canvas_positionY(canvas, event.clientY);
    console.log("posicion del cursor down x: " + posX + " y: " + posY);
    //verificando que se cumpla la opcion movable
    if (e.elementOverNow.isMovable){
        //verficando que el cursor este en accion movable segun el elemento, se debe verificar a nivel X y Y
        if (posX > (e.elementOverNow.home) && posX < (e.elementOverNow.end) && posY > elementY){
            console.log("movable");
            e.isMove = true;
            // action en move
            e.action = 0;
            e.finalPoint = posX;
            e.referencePoint = posX;
            index_temp = findIndexElementOverNow(e);
            
            
            if (index_temp != ( - 1)){
                if (index_temp == 0){
                    e.limXL = 0;
                    if (e.elements.length > 1){
                        e.limXR = e.elements[index_temp + 1].home - tamCurSize;
                    } else{
                        e.limXR = size_line - tamCurSize;
                    }
                } else{
                    e.limXL = e.elements[index_temp - 1].end;
                    if (index_temp == (e.elements.length - 1)){
                        e.limXR = size_line - tamCurSize;
                    } else{
                        e.limXR = e.elements[index_temp + 1].home - tamCurSize;
                    }
                }
            }
            return;
        }


    }
    if (e.elementOverNow.isResizable){
        //actualizando cursor en L, posteriormente cursor R
        if (posX > (e.elementOverNow.home) && posX < (e.elementOverNow.home + tamCurSize) && posY < elementY){
            console.log("resize L");
            e.referencePoint = e.elementOverNow.home;
            e.cursor = 0;
            //estableciendo los limites L y R del cursor
            index_temp = findIndexElementOverNow(e);
            
            homeElementTemp = e.elements[index_temp].home;
            endElementTemp = e.elements[index_temp].end;
            
            if (index_temp == 0){
                //limite en L de 0 px
                e.limXL = 0;
                //limite en R dependiente del end del mismo elemento, esto evita que el cursor se pase
                e.limXR = e.elementOverNow.end - tamCurSize;
            } else{
                //limite en L dependiente del end del elemento anterior
                e.limXL = e.elements[index_temp - 1].end;
                //limite en R dependiente del end del mismo elemento, esto evita que el cursor se pase
                e.limXR = e.elementOverNow.end - tamCurSize;
            }
        } else if (posX > (e.elementOverNow.end - tamCurSize) && posX < (e.elementOverNow.end) && posY < elementY){
            console.log("resize R");
            e.referencePoint = e.elementOverNow.end;
            e.cursor = 1;
            //estableciendo los limites L y R del cursor
            index_temp = findIndexElementOverNow(e);
            
            homeElementTemp = e.elements[index_temp].home;
            endElementTemp = e.elements[index_temp].end;
            
            if (index_temp == (e.elements.length - 1)){
                //limite en L dependiente del home del mismo elemento, esto evita que el cursor se pase
                e.limXL = e.elementOverNow.home + tamCurSize;
                //limite en R es el maximo de la linea del elementos, esto aplica si es el ultimo
                e.limXR = size_line;
            } else{
                //limite en L dependiente del end del elemento anterior
                e.limXL = e.elementOverNow.home + tamCurSize;
                //limite en R dependiente del end del mismo elemento, esto evita que el cursor se pase
                e.limXR = e.elements[index_temp + 1].home;
                if (e.type == 1){
                    //esto me garantiza q en el caso de la linea de contenidos el resiza soporte aunentar el tamaño aun cuando
                    //hay elementos despues
                    e.limXR += size_line - e.elements[e.elements.length - 1].end;
                }
            }

        } else{
            console.log("Fuera de area, o el elemento no soporta esta accion");
            return;
        }
        e.isMove = true;
        //action en resize
        e.action = 1;
        e.finalPoint = posX;
        //e.referencePoint = posX;
        return;
    }

}

function OverDrag(){
    event = event || window.event;
    event.returnValue = false;
}

function dropServices(id){
    canvas = document.getElementById(id);

    //afectando el DropOverNow, para efectos de integridad grafica
    elements_lc.isDropOverNow = true;

    //Obteniendo las coordenadas absolutas y reltivas con respecto a linea de tiempo
    posX = get_cursor_canvas_positionX(canvas, event.clientX);

    console.log("la posicion del canvas contenedor es " + posCanvas + " la posicion absoluta con respecto a la linea de tiempo es " + posX + " el tama�o de la ventana es " + document.body.offsetWidth);
    console.log("posX: " + posX);

    //modificando el type_element 
    //type_element = document.getElementById("type_element").value;

    switch (type_element){
    case 5:
        {
            console.log("Services");
            line_interactive_services(swap, posX);
            break;
        }
    default:
        {
            alert("Este elemento no pertence a esta linea");
            break;
        }

    }
}

function dropText(id){
    canvas = document.getElementById(id);

    //afectando el DropOverNow, para efectos de integridad grafica
    elements_lc.isDropOverNow = true;

    //Obteniendo las coordenadas absolutas y reltivas con respecto a linea de tiempo
    posX = get_cursor_canvas_positionX(canvas, event.clientX);

    console.log("la posicion del canvas contenedor es " + posCanvas + " la posicion absoluta con respecto a la linea de tiempo es " + posX + " el tama�o de la ventana es " + document.body.offsetWidth);
    console.log("posX: " + posX);

    //modificando el type_element 
    //type_element = document.getElementById("type_element").value;

    switch (type_element){
    case 4:
        {
            console.log("Text");
            line_text_text(swap, posX);
            break;
        }
    default:
        {
            alert("Este elemento no pertence a esta linea");
            break;
        }

    }
}

function dropContent(id){
    canvas = document.getElementById(id);

    //afectando el DropOverNow, para efectos de integridad grafica
    elements_lc.isDropOverNow = true;

    //Obteniendo las coordenadas absolutas y reltivas con respecto a linea de tiempo
    posX = get_cursor_canvas_positionX(canvas, event.clientX);

    console.log("la posicion del canvas contenedor es " + posCanvas + " la posicion absoluta con respecto a la linea de tiempo es " + posX + " el tama�o de la ventana es " + document.body.offsetWidth);
    console.log("posX: " + posX);

    //modificando el type_element 
    //type_element = document.getElementById("type_element").value;
	console.log("content tipo elemento "+type_element);
    switch (type_element){
    case 1:
        {
            console.log("Contenido");
            line_content_content(swap, posX);
            break;
        }
    case 2:
        {
            console.log("Transicion");
            //No es tomado como un elemento logico
            line_content_transition(swap, posX);
            break;
        }
    case 3:
        {
            console.log("Color");
            line_content_color(swap, posX);
            break;
        }
    default:
        {
            alert("Este elemento no pertence a esta linea");
            break;
        }

    }
}

function line_content_content(id, pos){
    //Genero el nuevo objecto con la informacion para agregarlo a la linea de interactividad
    var element_content = new Element();

    //indice temporal de ubicacion del nuevo elemento
    index_temp = 0;

    //Accion de insercion
    //0-> Elemento insertado virgen, 1 -> elemento con insercion sobre otro elemento, 2 -> elemento insertado sobre ningun elemento
    action_insertion = 0;

    //Verificacion de la integridad grafica de la linea de contenidos
    if (elements_lc.elements.length > 0){
        //analizando la posicion logica absoluta del elemento con respecto a los demas elementos
        index_element = is_over_line(pos, elements_lc);
        if (index_element == ( - 1)){
            //*** Linea con elementos, cursor sobre ningun elemento
            //el home de este elemento correponde al end del ultimo elemento
            action_insertion = 2;
            element_content.home = elements_lc.elements[(elements_lc.elements.length - 1)].end;
            index_temp = elements_lc.elements.length;
            //verificar si este indice si esta bien con relacion al splice de JS 
        } else{
            //*** Linea con elementos, cursor sobre un elemento
            action_insertion = 1;
            //El home de este elemento corresponde al end del elemento anterior relacinado con el cursor
            if (index_element == 0){
                // si el index es cero, no habria elemento anterior
                element_content.home = 0;
                index_temp = 0;
            } else{
                element_content.home = elements_lc.elements[(index_element - 1)].end;
                index_temp = index_element;
                //verificar si este indice si esta bien con relacion al splice de JS
            }
        }
    } else{
        //*** Linea vacia
        action_insertion = 0;
        console.log("esta insertando el primer elemento");
        //es el primer elemento
        element_content.home = 0;
        index_temp = 0;
    }

    element_content.id = id;
    element_content.type = 1;
    element_content.isMovable = false;
    element_content.isResizable = false;

    //*******************************OJO no olvidar afectar la posicion de los demas elementos************************
    //peticion AJAX para obtener los valores del elemento asociado
    $.ajax({
        url: "/ContentProcessorServer/ContentProcessorServlet",
        data: "operation=2&id=" + id,
        type: "POST",
        cache: true,
        success: function(response){
            //Obteniendo elemento de la BD
            console.log("response: " + response);
            var content = jQuery.parseJSON(response);
            //analizando y trasponiendo la duracion vs pixeles del elemento
            temp_dur = do_seconds_to_pixels(content.duracion, size_line);
            //verificando que la duracion no sobrepase el limite en segundos
            console.log("************************ " + elements_lc.elements.length);
            if ((elements_lc.seconds + content.duracion) > size_line){
                console.log("El contenido que esta intentando insertar sobrepasa el limite de tiempo en minutos");
                alert("El contenido que desea insertar sobrepasa el limite de tiempo permitido");
                return;
            }
            //** Implementacion grafica del elemento
            //compensar los pixeles en perdida de cuantificacion de segundos en pixeles
            if ((elements_lc.pixels + temp_dur) > size_line){
                temp_dur = size_line - elements_lc.pixels;
                //garantizamos con esto la integridad grafica del elemento
            }
            canvas = document.getElementById("line_content");
            canvas.getContext("2d").fillStyle = color_element_normal;
            canvas.getContext("2d").fillRect(element_content.home, elementY, temp_dur, elementHeight);
            canvas.getContext('2d').strokeRect(element_content.home, elementY, temp_dur, elementHeight);
            //actualizar la duracion y pixeles del elements_lc
            elements_lc.seconds = elements_lc.seconds + Math.round(content.duracion);
            elements_lc.pixels = elements_lc.pixels + temp_dur;
            //actualizar y añadir nuevo elemnto al elements_lc - end,duration
            element_content.end = element_content.home + temp_dur;
            //en pixeles
            element_content.duration = content.duracion;
            //en segundos
            //Añadiendo el elemento al vector de linea de contenidos
            elements_lc.elements.splice(index_temp, 0, element_content);
            //OJO ver si es mejor colocar este proceso antes de pintar el canvas
            //actualizar la posicion de los elementos afectados por la insercion
            switch (action_insertion){
            case 0:
                {
                    console.log("nada que actualizar");
                    break;
                }
            case 1:
                {
                    console.log("Actualizando posiciones logicas y graficas");
                    //Actualizando posiciones logicas
                    /*for (var i = (index_temp + 1); i < elements_lc.elements.length; i++){
                        elements_lc.elements[i].home += temp_dur;
                        elements_lc.elements[i].end += temp_dur;
                        console.log("i: " + i + " id: " + elements_lc.elements[i].id);
                    }*/
                    logicUpdateElementSinceIndex(index_temp + 1, elements_lc, temp_dur, true);
                    //Actualizando posiciones graficas
                    /*canvas.getContext("2d").clearRect(elements_lc.elements[index_temp].home, elementY, width_cleaning(index_temp, elements_lc), elementHeight);
                    canvas.getContext("2d").fillStyle = color_element_normal;
                    console.log("Empezando la actualizacion grafica, length => " + elements_lc.elements.length);
                    for (var j = (index_temp); j < elements_lc.elements.length; j++){
                        //-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+--+-+-+
                        GraphicUpdateElement(canvas, j, elements_lc, true);
                        console.log("j: " + j + " id: " + elements_lc.elements[j].id + " home: " + elements_lc.elements[j].home + " end: " + elements_lc.elements[j].end);
                    }*/
                    graphicUpdateElementsSinceIndex(canvas, elements_lc, index_temp);
                    break;
                }
            case 2:
                {
                    console.log("Nada que actualizar");
                    break;
                }
            default:
                {
                    console.log("BUG!");
                    break;
                }
            }
            //Log del vector
            console.log("La linea logica esta asi:");
            for (var i = 0; i < elements_lc.elements.length; i++){
                console.log("i: " + i + " id: " + elements_lc.elements[i].id + " home: " + elements_lc.elements[i].home + " end:  " + elements_lc.elements[i].end);
            };

        }
    });
}

function move_line(id, e){
    //Anlizando el FlagOver
    //OJO recordar resetear el FlagOver cuando se accione el evento out
    canvas = document.getElementById(id);
    posX = get_cursor_canvas_positionX(canvas, event.clientX);

    if (e.isMove){
        //evitamos que cuando se haga down move up se confunda con un click
        e.isClick = false;
        //Evento move con accion Resize o move
        //Analizando que tipo de accion sera realizada
        if (e.action == 0){
            //move
            //limpiando los dos cursores, con los valores anteriores de home y end del elementOverNow
            graphicCleanerBarSegment(canvas, e.elementOverNow.home + (e.finalPoint - e.referencePoint), e.elementOverNow.end + (e.finalPoint - e.referencePoint));
            //graphicCleanerBarSegment(canvas, e.elementOverNow.end - tamCurSize, tamCurSize);
            e.finalPoint = posX;
            delta = e.finalPoint - e.referencePoint;
            if ((e.elementOverNow.end + delta) >= e.limXR){
                posX = e.limXR - (e.elementOverNow.end - e.referencePoint);
            }
            if ((e.elementOverNow.home + delta) < e.limXL){
                posX = e.limXL + (e.referencePoint - e.elementOverNow.home);
            }
            e.finalPoint = posX;
            delta = e.finalPoint - e.referencePoint;
            graphicPaintBar(canvas, e.elementOverNow.home + delta, tamCurSize);
            graphicPaintBar(canvas, e.elementOverNow.end + delta, tamCurSize);
        } else{
            //resize
            //OJO arreglar la repeticion de este ciclo sin sentido, que limpia la posicion del cursor implicado
            if (e.cursor == 0){
                //cursor left
                graphicCleanerBarSegment(canvas, e.elementOverNow.home, tamCurSize);
            } else{
                //cursor rigth
                graphicCleanerBarSegment(canvas, e.elementOverNow.end - tamCurSize, tamCurSize);
            }
            //limpiando el anterior movimiento del cursor
            graphicCleanerBarSegment(canvas, e.finalPoint, tamCurSize);
            //comprobando que el cursor este sobre limites establecidos, el -4 salio por deduccion grafica (se lo quite)
            if (posX >= e.limXR){
                posX = e.limXR;
            }
            if (posX < e.limXL){
                posX = e.limXL;
            }
            e.finalPoint = posX;
            graphicPaintBar(canvas, e.finalPoint, tamCurSize);

        }


    } else{
        //Evento move normal
        if (!e.flagOver){
            //analizar la posicion del cursor con repecto de los elementos de la linea
            //console.log("Posicion absolute: "+posX)
            index_element = is_over_line(posX, e);
            //Analizar las reglas del objeto afectado (isMovable, isResizable, isFirst)
            if (index_element == ( - 1)){
                //si no esta sobre ningun elemento, retorne
                return;
            }
            //guardar en cache el elemento afectado (elementOverNow)
            e.elementOverNow = e.elements[index_element];
            e.flagOver = true;
        } else{
            //verificando que el cursor siga estando dentro del elemento overNow
            //Se afecta cuando hay un archivo recien droppeado
            if (e.isDropOverNow){
                //analizar la posicion del cursor con repecto de los elementos de la linea
                index_element = is_over_line(posX, e);
                //Analizar las reglas del objeto afectado (isMovable, isResizable, isFirst)
                if (index_element == ( - 1)){
                    //si no esta sobre ningun elemento, retorne
                    e.flagOver = false;
                    return;
                }
                //guardar en cache el elemento afectado (elementOverNow)
                e.elementOverNow = e.elements[index_element];
                e.flagOver = true;
                e.isDropOverNow = false;
            }
            if (posX > e.elementOverNow.home && posX < e.elementOverNow.end){

                } else{

                //restableciendo el anterior elemento//-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
                normalize_line(id, e);

                //Estableciendo el nuevo elemento
                //analizar la posicion del cursor con repecto de los elementos de la linea
                index_element = is_over_line(posX, e);
                //Analizar las reglas del objeto afectado (isMovable, isResizable, isFirst)
                if (index_element == ( - 1)){
                    //si no esta sobre ningun elemento, retorne
                    e.flagOver = false;
                    return;
                }
                //guardar en cache el elemento afectado (elementOverNow)
                e.elementOverNow = e.elements[index_element];
                e.flagOver = true;

            }

        }
        //actualizacion grafica del elemento afectado//-+-+-+---+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+OVER
        canvas.getContext("2d").fillStyle = color_element_over;
        GraphicUpdateDropElementNow(canvas, e, false);
    }
}

function normalize_line(id, e){
    if (!e.flagOver){
        return;
    }
    e.flagOver = false;
    //restableciendo el anterior elemento
    canvas = document.getElementById(id);
    //+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    canvas.getContext("2d").clearRect(e.elementOverNow.home, elementY, width_elementOverNow(e), elementHeight);
    canvas.getContext("2d").clearRect(e.elementOverNow.home - 1, 0, width_elementOverNow(e) + 1, elementY);
    graphicCleanBar(canvas, findIndexElementOverNow(e), e);

    canvas.getContext("2d").fillStyle = color_element_normal;
    GraphicUpdateDropElementNow(canvas, e, true);
}

function line_interactive_services(id, posX){
    //Genero el nuevo objecto con la informacion para agregarlo a la linea de interactividad
    var element_service = new Element();

    //indice temporal de ubicacion del nuevo elemento
    index_temp = 0;

    //Accion de insercion
    //0-> Elemento insertado virgen, 1 -> elemento fuera del rango, 2 -> elemento insertado entre elemento
    action_insertion = 0;

    //Verificacion de la integridad grafica de la linea de texto
    if (elements_li.elements.length > 0){
        //analizando la posicion logica absoluta del elemento con respecto a los demas elementos
        if (posX > elements_li.elements[elements_li.elements.length - 1].end){
            //*** El elemento insertado esta por fuera del rango logico de los elementos previos
            action_insertion = 1;
            index_temp = elements_li.elements.length;
            //Analizando las posibilidades de insercion con respecto al espeacio restante en el punto de insercion
            if (do_seconds_to_pixels(service_default_duration, size_line) < (size_line - posX)){
                element_service.home = posX;
                element_service.end = (posX + do_seconds_to_pixels(service_default_duration, size_line));
                element_service.duration = service_default_duration;
            }
            else if (do_seconds_to_pixels(service_default_duration, size_line) < ((size_line - posX) + (posX - elements_li.elements[elements_li.elements.length - 1].end))){
                element_service.home = size_line - do_seconds_to_pixels(service_default_duration, size_line);
                element_service.end = element_service.home + do_seconds_to_pixels(service_default_duration, size_line);
                element_service.duration = service_default_duration;
            } else{
                element_service.home = elements_li.elements[elements_li.elements.length - 1].end;
                element_service.end = size_line;
                element_service.duration = do_pixels_to_seconds(element_service.end - element_service.home, size_line);
            }
        } else{
            index_element = is_between_line(posX, elements_li);
            if (index_element != ( - 1)){
                //*** El elemento fue insertado entre dos elementos existentes
                action_insertion = 2;
                index_temp = index_element;
                //Analizando las posibilidades de insercion con respecto al espeacio restante en el punto de insercion
                if (do_seconds_to_pixels(service_default_duration, size_line) < (elements_li.elements[index_temp].home - posX)){
                    element_service.home = posX;
                    element_service.end = (posX + do_seconds_to_pixels(service_default_duration, size_line));
                    element_service.duration = service_default_duration;
                }
                else if (do_seconds_to_pixels(service_default_duration, size_line) < ((elements_li.elements[index_temp].home - posX) + (posX - elements_li.elements[index_temp - 1].end))){
                    element_service.home = elements_li.elements[index_temp].home - do_seconds_to_pixels(service_default_duration, size_line);
                    element_service.end = element_service.home + do_seconds_to_pixels(service_default_duration, size_line);
                    element_service.duration = service_default_duration;
                } else{
                    element_service.home = elements_li.elements[index_temp - 1].end;
                    element_service.end = elements_li.elements[index_temp].home;
                    element_service.duration = do_pixels_to_seconds(element_service.end - element_service.home, size_line);
                }
            }
        }
    } else{
        //*** Linea vacia
        action_insertion = 0;
        console.log("esta insertando el primer elemento");
        //es el primer elemento
        element_service.home = posX;
        element_service.end = (posX + do_seconds_to_pixels(service_default_duration, size_line));
        element_service.duration = service_default_duration;
        index_temp = 0;
    }

    element_service.id = id;
    element_service.type = 4;
    element_service.isMovable = true;
    element_service.isResizable = true;


    //peticion AJAX para obtener los valores del elemento asociado
    $.ajax({
        url: "/AssociateInteractiveServer/ServicesProcessorServlet",
        data: "operation=1&id=" + id,
        type: "POST",
        cache: true,
        success: function(response){
            //Obteniendo elemento de la BD
            console.log("response: " + response);
            var service = jQuery.parseJSON(response);
            //analizando y trasponiendo la duracion vs pixeles del elemento
            temp_dur = do_seconds_to_pixels(element_service.duration, size_line);
            //****************** Implementacion grafica del elemento *********************//
            canvas = document.getElementById("line_interactive");
            canvas.getContext("2d").fillStyle = color_element_normal;
            canvas.getContext("2d").fillRect(element_service.home, elementY, temp_dur, elementHeight);
            canvas.getContext('2d').strokeRect(element_service.home, elementY, temp_dur, elementHeight);

            //Falta la parte del color!! ???????????????????????????????????????????????????????????????????????????????
            //actualizar la duracion y pixeles del elements_li
            elements_li.seconds += Math.round(element_service.duration);
            elements_li.pixels += temp_dur;
            //actualizar y añadir nuevo elemnto al elements_li - end,color
            //Añadiendo el elemento al vector de linea de contenidos
            elements_li.elements.splice(index_temp, 0, element_service);
            //actualizar la posicion de los elementos afectados por la insercion
            //Borrar el action_insertion
            //Log del vector
            console.log("La linea logica esta asi:");
            for (var i = 0; i < elements_li.elements.length; i++){
                console.log("i: " + i + " id: " + elements_li.elements[i].id + " home: " + elements_li.elements[i].home + " end:  " + elements_li.elements[i].end);
            };

        }
    });
}

function line_text_text(id, posX){

    //Genero el nuevo objecto con la informacion para agregarlo a la linea de interactividad
    var element_text = new Element();

    //indice temporal de ubicacion del nuevo elemento
    index_temp = 0;

    //Accion de insercion
    //0-> Elemento insertado virgen, 1 -> elemento fuera del rango, 2 -> elemento insertado entre elemento
    action_insertion = 0;

    //Verificacion de la integridad grafica de la linea de texto
    if (elements_lt.elements.length > 0){
        //analizando la posicion logica absoluta del elemento con respecto a los demas elementos
        if (posX > elements_lt.elements[elements_lt.elements.length - 1].end){
            //*** El elemento insertado esta por fuera del rango logico de los elementos previos
            action_insertion = 1;
            index_temp = elements_lt.elements.length;
            //Analizando las posibilidades de insercion con respecto al espeacio restante en el punto de insercion
            if (do_seconds_to_pixels(text_default_duration, size_line) < (size_line - posX)){
                element_text.home = posX;
                element_text.end = (posX + do_seconds_to_pixels(text_default_duration, size_line));
                element_text.duration = text_default_duration;
            }
            else if (do_seconds_to_pixels(text_default_duration, size_line) < ((size_line - posX) + (posX - elements_lt.elements[elements_lt.elements.length - 1].end))){
                element_text.home = size_line - do_seconds_to_pixels(text_default_duration, size_line);
                element_text.end = element_text.home + do_seconds_to_pixels(text_default_duration, size_line);
                element_text.duration = text_default_duration;
            } else{
                element_text.home = elements_lt.elements[elements_lt.elements.length - 1].end;
                element_text.end = size_line;
                element_text.duration = do_pixels_to_seconds(element_text.end - element_text.home, size_line);
            }
        } else{
            index_element = is_between_line(posX, elements_lt);
            if (index_element != ( - 1)){
                //*** El elemento fue insertado entre dos elementos existentes
                action_insertion = 2;
                index_temp = index_element;
                //Analizando las posibilidades de insercion con respecto al espeacio restante en el punto de insercion
                if (do_seconds_to_pixels(text_default_duration, size_line) < (elements_lt.elements[index_temp].home - posX)){
                    element_text.home = posX;
                    element_text.end = (posX + do_seconds_to_pixels(text_default_duration, size_line));
                    element_text.duration = text_default_duration;
                }
                else if (do_seconds_to_pixels(text_default_duration, size_line) < ((elements_lt.elements[index_temp].home - posX) + (posX - elements_lt.elements[index_temp - 1].end))){
                    element_text.home = elements_lt.elements[index_temp].home - do_seconds_to_pixels(text_default_duration, size_line);
                    element_text.end = element_text.home + do_seconds_to_pixels(text_default_duration, size_line);
                    element_text.duration = text_default_duration;
                } else{
                    element_text.home = elements_lt.elements[index_temp - 1].end;
                    element_text.end = elements_lt.elements[index_temp].home;
                    element_text.duration = do_pixels_to_seconds(element_text.end - element_text.home, size_line);
                }
            }
        }
    } else{
        //*** Linea vacia
        action_insertion = 0;
        console.log("esta insertando el primer elemento");
        //es el primer elemento
        element_text.home = posX;
        element_text.end = (posX + do_seconds_to_pixels(text_default_duration, size_line));
        element_text.duration = text_default_duration;
        index_temp = 0;
    }

    element_text.id = id;
    element_text.type = 3;
    element_text.isMovable = true;
    element_text.isResizable = true;


    //peticion AJAX para obtener los valores del elemento asociado
    $.ajax({
        url: "/PartenonServer/TextProcessorServlet",
        data: "operation=1&id=" + id,
        type: "POST",
        cache: true,
        success: function(response){
            //Obteniendo elemento de la BD
            console.log("response: " + response);
            var text = jQuery.parseJSON(response);
            //analizando y trasponiendo la duracion vs pixeles del elemento
            temp_dur = do_seconds_to_pixels(element_text.duration, size_line);
            //****************** Implementacion grafica del elemento *********************//
            canvas = document.getElementById("line_text");
            canvas.getContext("2d").fillStyle = color_element_normal;
            canvas.getContext("2d").fillRect(element_text.home, elementY, temp_dur, elementHeight);
            canvas.getContext('2d').strokeRect(element_text.home, elementY, temp_dur, elementHeight);

            //Falta la parte del color!! ???????????????????????????????????????????????????????????????????????????????
            //actualizar la duracion y pixeles del elements_lt
            elements_lt.seconds += Math.round(element_text.duration);
            elements_lt.pixels += temp_dur;
            //actualizar y añadir nuevo elemnto al elements_lt - end,color
            element_text.font = text.font;
            //Añadiendo el elemento al vector de linea de contenidos
            elements_lt.elements.splice(index_temp, 0, element_text);
            //actualizar la posicion de los elementos afectados por la insercion
            //Borrar el action_insertion
            //Log del vector
            console.log("La linea logica esta asi:");
            for (var i = 0; i < elements_lt.elements.length; i++){
                console.log("i: " + i + " id: " + elements_lt.elements[i].id + " home: " + elements_lt.elements[i].home + " end:  " + elements_lt.elements[i].end);
            };

        }
    });
}

function line_content_transition(id, pos){
    //OJO el ID es el del SWAP
    index_element = is_over_line(pos, elements_lc);
    if (index_element == ( - 1)){
        return;
    }
    //peticion AJAX para obtener los valores del elemento asociado
    $.ajax({
        url: "/PartenonServer/TransitionProcessorServlet",
        data: "operation=1&id=" + id,
        type: "POST",
        cache: true,
        success: function(response){
            //Obteniendo elemento de la BD
            console.log("response AJAX Transition: " + response);
            console.log("ID de la transicion: " + id);
            var transition = jQuery.parseJSON(response);
            elements_lc.elements[index_element].availableTransition = true;
            if (transition.tipo == 0){
                elements_lc.elements[index_element].homeTransition = id;
            } else{
                elements_lc.elements[index_element].endTransition = id;
            }
            //Actualizando la interfaz grafica
            GraphicUpdateElement(document.getElementById("line_content"), index_element, elements_lc, true);
        }
    });
}

function line_content_color(id, pos){
    //Genero el nuevo objecto con la informacion para agregarlo a la linea de interactividad
    var element_content = new Element();

    //indice temporal de ubicacion del nuevo elemento
    index_temp = 0;

    //Accion de insercion
    //0-> Elemento insertado virgen, 1 -> elemento con insercion sobre otro elemento, 2 -> elemento insertado sobre ningun elemento
    action_insertion = 0;

    //Verificacion de la integridad grafica de la linea de contenidos
    if (elements_lc.elements.length > 0){
        //analizando la posicion logica absoluta del elemento con respecto a los demas elementos
        index_element = is_over_line(pos, elements_lc);
        if (index_element == ( - 1)){
            //*** Linea con elementos, cursor sobre ningun elemento
            //el home de este elemento correponde al end del ultimo elemento
            action_insertion = 2;
            element_content.home = elements_lc.elements[(elements_lc.elements.length - 1)].end;
            index_temp = elements_lc.elements.length;
            //verificar si este indice si esta bien con relacion al splice de JS 
        } else{
            //*** Linea con elementos, cursor sobre un elemento
            action_insertion = 1;
            //El home de este elemento corresponde al end del elemento anterior relacinado con el cursor
            if (index_element == 0){
                // si el index es cero, no habria elemento anterior
                element_content.home = 0;
                index_temp = 0;
            } else{
                element_content.home = elements_lc.elements[(index_element - 1)].end;
                index_temp = index_element;
                //verificar si este indice si esta bien con relacion al splice de JS
            }
        }
    } else{
        //*** Linea vacia
        action_insertion = 0;
        console.log("esta insertando el primer elemento");
        //es el primer elemento
        element_content.home = 0;
        index_temp = 0;
    }

    element_content.id = id;
    element_content.type = 2;
    element_content.isMovable = false;
    element_content.isResizable = true;
    element_content.duration = color_default_duration;

    //peticion AJAX para obtener los valores del elemento asociado
    $.ajax({
        url: "/PartenonServer/ColorProcessorServlet",
        data: "operation=1&id=" + id,
        type: "POST",
        cache: true,
        success: function(response){
            //Obteniendo elemento de la BD
            console.log("response: " + response);
            var color = jQuery.parseJSON(response);
            //verificando que la duracion no sobrepase el limite en segundos
            //console.log("************************ " + elements_lc.elements.length);
            if ((elements_lc.seconds + element_content.duration) > size_line){
                console.log("El contenido que esta intentando insertar sobrepasa el limite de tiempo en segundos");
                console.log("Redimensionando...")
                if ((size_line - element_content.duration) <= 0){
                    alert("Ud ha excedido el tiempo permitido de contenido");
                    return;
                } else{
                    element_content.duration = size_line - element_content.duration;
                    console.log("elemento redimensionado a " + element_content.duration);
                }
            }
            //analizando y trasponiendo la duracion vs pixeles del elemento
            temp_dur = do_seconds_to_pixels(element_content.duration, size_line);
            //****************** Implementacion grafica del elemento *********************//
            //compensar los pixeles en perdida de cuantificacion de segundos en pixeles
            if ((elements_lc.pixels + temp_dur) > size_line){
                temp_dur = size_line - elements_lc.pixels;
                //garantizamos con esto la integridad grafica del elemento
            }
            canvas = document.getElementById("line_content");
            canvas.getContext("2d").fillStyle = color_element_normal;
            canvas.getContext("2d").fillRect(element_content.home, elementY, temp_dur, elementHeight);
            canvas.getContext('2d').strokeRect(element_content.home, elementY, temp_dur, elementHeight);

            //Falta la parte del color!! ???????????????????????????????????????????????????????????????????????????????
            //actualizar la duracion y pixeles del elements_lc
            elements_lc.seconds = elements_lc.seconds + Math.round(element_content.duration);
            elements_lc.pixels = elements_lc.pixels + temp_dur;
            //actualizar y añadir nuevo elemnto al elements_lc - end,color
            element_content.end = element_content.home + temp_dur;
            element_content.color = color.codigoRGB;
            //Añadiendo el elemento al vector de linea de contenidos
            elements_lc.elements.splice(index_temp, 0, element_content);
            //OJO ver si es mejor colocar este proceso antes de pintar el canvas
            //actualizar la posicion de los elementos afectados por la insercion
            switch (action_insertion){
            case 0:
                {
                    console.log("nada que actualizar");
                    break;
                }
            case 1:
                {
                    console.log("Actualizando posiciones logicas y graficas");
                    //Actualizando posiciones logicas
                    for (var i = (index_temp + 1); i < elements_lc.elements.length; i++){
                        elements_lc.elements[i].home += temp_dur;
                        elements_lc.elements[i].end += temp_dur;
                        console.log("i: " + i + " id: " + elements_lc.elements[i].id);
                    }
                    //Actualizando posiciones graficas
                    //Limpiando el sector grafico afectado
                    canvas.getContext("2d").clearRect(elements_lc.elements[index_temp].home, elementY, width_cleaning(index_temp, elements_lc), elementHeight);
                    canvas.getContext("2d").fillStyle = color_element_normal;
                    console.log("Empezando la actualizacion grafica, length => " + elements_lc.elements.length);
                    for (var j = (index_temp); j < elements_lc.elements.length; j++){
                        //+-+-
                        canvas.getContext("2d").fillStyle = color_element_normal;
                        GraphicUpdateElement(canvas, j, elements_lc, true);
                        console.log("j: " + j + " id: " + elements_lc.elements[j].id + " home: " + elements_lc.elements[j].home + " end: " + elements_lc.elements[j].end);
                    }
                    break;
                }
            case 2:
                {
                    console.log("Nada que actualizar");
                    break;
                }
            default:
                {
                    console.log("BUG!");
                    break;
                }
            }
            //Log del vector
            console.log("La linea logica esta asi:");
            for (var i = 0; i < elements_lc.elements.length; i++){
                console.log("i: " + i + " id: " + elements_lc.elements[i].id + " home: " + elements_lc.elements[i].home + " end:  " + elements_lc.elements[i].end);
            };

        }
    });
}

function graphicUpdateElementsSinceIndex(canvas, e, index){
    canvas.getContext("2d").clearRect(e.elements[index].home, elementY, width_cleaning(index, e), elementHeight);
    canvas.getContext("2d").fillStyle = color_element_normal;
    console.log("Empezando la actualizacion grafica, length => " + e.elements.length);
    for (var j = (index); j < e.elements.length; j++){
        GraphicUpdateElement(canvas, j, e, true);
        console.log("j: " + j + " id: " + e.elements[j].id + " home: " + e.elements[j].home + " end: " + e.elements[j].end);
    }
}

function graphicPaintBar(canvas, home, width){
    canvas.getContext("2d").fillStyle = color_cursor;
    canvas.getContext("2d").fillRect(home, 1, width, elementY - 1);
}

function graphicCleanerElementsSegment(canvas, index, e, pos){
    //si pos es -1 significa que el cleaner comenzara desde el home de elemento, y no desde un punto especifico
    if (pos != ( - 1)){
        canvas.getContext("2d").clearRect(pos, elementY, e.elements[e.elements.length - 1].end + 1, elementHeight);
    } else{
        canvas.getContext("2d").clearRect(e.elements[index].home - 1, elementY, e.elements[e.elements.length - 1].end + 2, elementHeight);
    }
}

function graphicCleanBar(canvas, index, e){
    canvas.getContext("2d").fillStyle = color_bar;
    canvas.getContext("2d").fillRect(e.elements[index].home - 1, 1, get_width_element(index, e) + 2, elementY - 1);
    //canvas.getContext('2d').strokeRect(e.elements[index].home, 0, get_width_element(index, e), elementY);
}

function graphicCleanerLineSegment(canvas, home, width){
    canvas.getContext("2d").fillStyle = color_lines;
    canvas.getContext("2d").fillRect(home, elementY , width, elementHeight);
}

function graphicCleanerBarSegment(canvas, home, width){
    canvas.getContext("2d").fillStyle = color_bar;
    canvas.getContext("2d").fillRect(home, 1, width, elementY - 1);
}

function logicUpdateElementSinceIndex(index, e, delta, toIncrease){
    factorIncrease = 1;
    if (!toIncrease){
        factorIncrease = ( - 1);
    }
    console.log("Actualizando posiciones logicas y graficas");
    for (var i = (index); i < e.elements.length; i++){
        e.elements[i].home += (factorIncrease * delta);
        e.elements[i].end += (factorIncrease * delta);
        console.log("i: " + i + " id: " + e.elements[i].id);
    }
}

function GraphicUpdateElement(canvas, index, e, isNormal){

    /*Estas dos sentencias se ejecutaran asi el elemento este en Normal o en Over, son comunes, lo unico en que se diferencian
	es en su estilo, y la forma en que son llamadas*/
    canvas.getContext("2d").fillRect(e.elements[index].home, elementY, get_width_element(index, e), elementHeight);
    canvas.getContext('2d').strokeRect(e.elements[index].home, elementY, get_width_element(index, e), elementHeight);

    if (isNormal){
        //is NORMAL
        //Solo para colores
        if (e.elements[index].type == 2){
            canvas.getContext("2d").fillStyle = e.elements[index].color;
            canvas.getContext("2d").fillRect(e.elements[index].home + 1, elementY + 1, get_width_element(index, e) - 1, elementHeight - 1);
            canvas.getContext('2d').strokeRect(e.elements[index].home + 1, elementY + 1, get_width_element(index, e) - 1, elementHeight - 1);
            canvas.getContext("2d").fillStyle = color_element_normal;
        }

        //solo para transiciones
        if (e.elements[index].availableTransition){
            canvas.getContext("2d").fillStyle = color_transition;
            if (e.elements[index].homeTransition != ( - 1)){
                canvas.getContext("2d").fillRect(e.elements[index].home, elementY, 3, elementHeight);
                //canvas.getContext('2d').strokeRect(e.elements[index].home, elementY, 10, elementHeight);
            }
            if (e.elements[index].endTransition != ( - 1)){
                canvas.getContext("2d").fillRect(e.elements[index].end - 3, elementY, 3, elementHeight);
                //canvas.getContext('2d').strokeRect(e.elements[index].end-10, elementY, 10, elementHeight);
            }
        }

    } else{
        //Is OVER
        switch (e.elements[index].type){
        case 1:
            {
                //Content + transition
                break;
            }
        case 2:
            {
                //color
                //dibujando cursores de resize
                canvas.getContext("2d").fillStyle = color_cursor;
                //cursor derecho
                canvas.getContext("2d").fillRect(e.elements[index].home, 0, tamCurSize, elementY);
                //canvas.getContext('2d').strokeRect(e.elements[index].home, 0, 4, elementY);
                //cursor izquierdo
                canvas.getContext("2d").fillRect(e.elements[index].end - tamCurSize, 0, tamCurSize, elementY);
                //canvas.getContext('2d').strokeRect(e.elements[index].end-4, 0, 4, elementY);
                break;
            }
        case 3:
            {
                //Text
                //dibujando cursores de resize
                canvas.getContext("2d").fillStyle = color_cursor;
                //cursor derecho
                canvas.getContext("2d").fillRect(e.elements[index].home, 0, tamCurSize, elementY);
                //canvas.getContext('2d').strokeRect(e.elements[index].home, 0, 4, elementY);
                //cursor izquierdo
                canvas.getContext("2d").fillRect(e.elements[index].end - tamCurSize, 0, tamCurSize, elementY);
                //canvas.getContext('2d').strokeRect(e.elements[index].end-4, 0, 4, elementY);
                break;
            }
        case 4:
            {
                //Services
                //dibujando cursores de resize
                canvas.getContext("2d").fillStyle = color_cursor;
                //cursor derecho
                canvas.getContext("2d").fillRect(e.elements[index].home, 0, tamCurSize, elementY);
                //canvas.getContext('2d').strokeRect(e.elements[index].home, 0, 4, elementY);
                //cursor izquierdo
                canvas.getContext("2d").fillRect(e.elements[index].end - tamCurSize, 0, tamCurSize, elementY);
                //canvas.getContext('2d').strokeRect(e.elements[index].end-4, 0, 4, elementY);
                break;
            }
        default:
            {
                //BUG!
                console.log("BUG!");
                break;
            }

        }

    }
}

function GraphicUpdateDropElementNow(canvas, e, isNormal){
    GraphicUpdateElement(canvas, findIndexElementOverNow(e), e, isNormal);
}

function findIndexElementOverNow(e){
    temp_pos = ((e.elementOverNow.end + e.elementOverNow.home) / 2);
    return is_over_line(temp_pos, e);
}

function logicDeleteElementById(index, e){
    width_temp = e.elements[index].end - e.elements[index].home;
    e.elements.splice(index, 1);

    if (e.type == 1){
        logicUpdateElementSinceIndex(index, e, width_temp, false);
    }
}

function get_cursor_canvas_positionX(canvas, x){
    posCanvas = findLeftObj(canvas);
    return (x - posCanvas) + document.body.scrollLeft + document.getElementById("container_line_td").scrollLeft;
}

function get_cursor_canvas_positionY(canvas, y){
    posCanvas = findTopObj(canvas);
    return (y - posCanvas) + document.body.scrollTop + document.getElementById("container_line_td").scrollTop;
}

function width_elementOverNow(e){
    return e.elementOverNow.end - e.elementOverNow.home;
}

function get_width_element(index, e){
    return (e.elements[index].end - e.elements[index].home);
}

function width_cleaning(index, e){
    return (e.elements[(e.elements.length - 1)].end - e.elements[index].home);
}

function is_between_line(pos, e){
    //para garantizar que haya un elemento despues
    if (e.elements[0].home > 1 && pos > 0 && pos < e.elements[0].home){
        console.log("retorno: 0");
        return 0;
    }
    if (e.elements.length > 1){

        for (var i = 1; i < e.elements.length; i++){
            if (pos > e.elements[i - 1].end && pos < e.elements[i].home){
                //el cursor esta sobre un elemento establecido
                //console.log("el cursor esta sobre el elemento No. " + i);
                return i;
            }
        };
        //console.log("El cursor no esta sobre ningun elemento de la linea de contenidos");
        return ( - 1);
    }

    return ( - 1);
}

function is_over_line(pos, e){
    for (var i = 0; i < e.elements.length; i++){
        if (pos > e.elements[i].home && pos < e.elements[i].end){
            //el cursor esta sobre un elemento establecido
            //console.log("el cursor esta sobre el elemento No. " + i);
            return i;
        }
    };
    //console.log("El cursor no esta sobre ningun elemento de la linea de contenidos");
    return ( - 1);
}

function do_seconds_to_pixels(duration, size_max){
    return Math.round(((duration * size_max) / 1800));
}

function do_pixels_to_seconds(width, size_max){
    return Math.round((width * 1800) / size_max);
}

function deactivate_bloq(){
    //desactivando la ventana emergente
    info = document.getElementById("info");
    info.style.zIndex = ( - 1);
    info.style.visibility = "hidden";
    //desactivando la capa de bloqueo
    document.getElementById("div_bloq").style.zIndex = ( - 1);
    document.getElementById("div_bloq").style.visibility = "hidden";
}

function div_edition_transition(e, index_element){
    /*editionField = document.getElementById("editionInfo");

    //limpiando los antiguos elementos graficos y logicos
    document.getElementById("editionInfo").innerHTML = "";*/
    deleteECByID("a");
    deleteECByID("b");
    deleteECByID("c");

    //analizando si hay transiciones para editar
    if (e.elements[index_element].availableTransition){

        if (e.elements[index_element].homeTransition != ( - 1)){
            //existe transicion inicial
            div = document.createElement("div");
            boton = createLink("Eliminar Transicion inicial", "left", "12px verdana", 200, 20, "a", e);
            boton.onclick = function(){
                //obteniendo la referncia del elemento a gestionar, elementCanvas pertence a ligaca
                temp = elementsCanvas[findECByID(this.id)];
                e = temp.parent;
                index_element = findIndexElementOverNow(e);
                var agree = confirm("¿Esta seguro que quiere eliminar esta transicion?");
                if (agree){
                    console.log("Eliminando la transicion");
                    e.elements[index_element].homeTransition = ( - 1);
                    if (e.elements[index_element].homeTansition == ( - 1) && e.elements[index_element].endTansition == ( - 1)){
                        e.elements[index_element].availableTransition = false;
                    }
                    GraphicUpdateElement(canvas, index_element, e, true);

                }
                else{
                    console.log("no");
                }
            }
            div.appendChild(boton);
            editionField.appendChild(div);
        }
        if (e.elements[index_element].endTransition != ( - 1)){
            div = document.createElement("div");
            boton = createLink("Eliminar Transicion final", "left", "12px verdana", 200, 20, "b", e);
            boton.onclick = function(){
                //obteniendo la referncia del elemento a gestionar, elementCanvas pertence a ligaca
                temp = elementsCanvas[findECByID(this.id)];
                e = temp.parent;
                index_element = findIndexElementOverNow(e);
                var agree = confirm("¿Esta seguro que quiere eliminar esta transicion?");
                if (agree){
                    console.log("Eliminando la transicion");
                    e.elements[index_element].endTransition = ( - 1);
                    if (e.elements[index_element].homeTansition == ( - 1) && e.elements[index_element].endTansition == ( - 1)){
                        e.elements[index_element].availableTransition = false;
                    }
                    GraphicUpdateElement(canvas, index_element, e, true);

                }
                else{
                    console.log("no");
                }
            }
            div.appendChild(boton);
            editionField.appendChild(div);
        }

    }

    div = document.createElement("div");
    boton = createLink("Eliminar Elemento", "left", "12px verdana", 200, 20, "c", e);
    boton.onclick = function(){
        //obteniendo la referncia del elemento a gestionar, elementCanvas pertence a ligaca
        temp = elementsCanvas[findECByID(this.id)];
        e = temp.parent;
        index_element = findIndexElementOverNow(e);
        var agree = confirm("¿Esta seguro que quiere eliminar el elemento?");
        if (agree){
            console.log("Eliminando el elemento");
            graphicCleanerBarSegment(canvas, 0, size_line);
            graphicCleanerElementsSegment(canvas, index_element, e, -1);
            logicDeleteElementById(index_element, e);
            if (e.elements.length > 0){
                graphicUpdateElementsSinceIndex(canvas, e, index_element);
            }
            deactivate_bloq();

        }
        else{
            console.log("no");
        }

    }
    div.appendChild(boton);
    editionField.appendChild(div);
}