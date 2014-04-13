//Atributos para el menu de elementos
Descriptor = function(){
    this.lc = new ElementsLine();
    this.lt = new ElementsLine();
    this.li = new ElementsLine();
}

//Funciones Para el Menu de elementos
function procesor_menu_elements(type_menu){

    idCommunity = get_idCommunnity();
    idCommunity.toString.length;
    console.log("id com:"+idCommunity+"***"+idCommunity.toString.length);
    switch (type_menu){
    case 1:
        {
            //peticion AJAX para obtener los valores del elemento asociado
            $.ajax({
                url:
                "/ContentProcessorServer/ContentProcessorServlet",
                data: "operation=1&idCommunity=" + idCommunity,
                type: "POST",
                cache: true,
                success: function(response){
                    //Obteniendo elemento de la BD
                    console.log("response: " + response);
                    var contents = jQuery.parseJSON(response);
                    creation_grid(contents, "div_element_menu");
                    load_content_panel(contents);
                }
            });

            break;
        }
    case 2:
        {
            //peticion AJAX para obtener los valores del elemento asociado
            $.ajax({
                url:
                "/PartenonServer/TransitionProcessorServlet",
                data: "operation=0",
                type: "POST",
                cache: true,
                success: function(response){
                    //Obteniendo elemento de la BD
                    console.log("response: " + response);
                    var transitions = jQuery.parseJSON(response);
                    creation_grid(transitions, "div_element_menu");
                    load_transition_panel(transitions);
                }
            });
            break;
        }
    case 3:
        {
            //peticion AJAX para obtener los valores del elemento asociado
            $.ajax({
                url:
                "/PartenonServer/ColorProcessorServlet",
                data: "operation=0",
                type: "POST",
                cache: true,
                success: function(response){
                    //Obteniendo elemento de la BD
                    console.log("response: " + response);
                    var colors = jQuery.parseJSON(response);
                    creation_grid(colors, "div_element_menu");
                    load_color_panel(colors);
                }
            });
            break;
        }
    case 4:
        {
            //peticion AJAX para obtener los valores del elemento asociado
            $.ajax({
                url:
                "/PartenonServer/TextProcessorServlet",
                data: "operation=0",
                type: "POST",
                cache: true,
                success: function(response){
                    //Obteniendo elemento de la BD
                    console.log("response: " + response);
                    var fonts = jQuery.parseJSON(response);
                    creation_grid(fonts, "div_element_menu");
                    load_text_panel(fonts);
                }
            });
            break;
        }
    case 5:
        {
            //peticion AJAX para obtener los valores del elemento asociado
            $.ajax({
                url:
                "/AssociateInteractiveServer/ServicesProcessorServlet",
                data: "operation=0",
                type: "POST",
                cache: true,
                success: function(response){
                    //Obteniendo elemento de la BD
                    console.log("response: " + response);
                    var services = jQuery.parseJSON(response);
                    creation_grid(services, "div_element_menu");
                    load_service_panel(services);
                }
            });
            break;
        }
    default:
        {
            break;
        }
    }

}

//Plantilla Grid para los elementos Thumb del panel
function creation_grid(obj, divID){
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
    for (var i = 0; i < num_fil; i++)
    {
        var nuevaFila = tabla.insertRow( - 1);
        nuevaFila.id = "g_fila_" + i;
        //nuevaFila.className = ".Celda_Thumbnail";
        for (var j = 0; j < 4; j++)
        {
            var nuevaCelda = nuevaFila.insertCell( - 1);
            nuevaCelda.className = ".Celda_Thumbnail";
            nuevaCelda.id = "g_celda_" + ((4 * i) + 1 + j);
            nuevaCelda.innerHTML = '&nbsp;';
        }
    }
    div_container.appendChild(tabla);
}

//Cargar el panel de contenidos multimedia
function load_content_panel(contents){
    //Cargamos todos los contenidos habilitados para el historial
    var idContenido;
    var rutafuente;
    for (i in contents){
        idContenido = contents[i].idContenido;
        rutafuente = "ContentRepository/" + contents[i].rutafuente;
        for (var j = 0; j < 2; j++){
            if (j == 0){
                //var imagen ='<img src="PosterRepository/'+contents[i].rutascreenshot+'" width="94" height="70" class="Thumbnail" id="'+idContenido+'" onmouseover="resaltar_PE(id,'+0+')" onmouseout="resaltar_PE(id,'+1+')" onclick="PlayContentbyID(id)" ondragstart="intercambiar(id,0)"/>';
                imagen = document.createElement("img");
                imagen.className = "Thumbnail";
                imagen.id = idContenido;
                imagen.src = "/PosterRepository/" + contents[i].rutascreenshot;
                imagen.onmouseover = function(){
                    resaltar_PE(this.id, 0);
                }
                imagen.onmouseout = function(){
                    resaltar_PE(this.id, 1);
                }
                imagen.onclick = function(){
                    $.ajax({
                        url: "/ContentProcessorServer/ContentProcessorServlet",
                        data: "operation=2&id=" + this.id,
                        type: "POST",
                        cache: true,
                        success: function(response){
                            //Obteniendo elemento de la BD
                            console.log("response: " + response);
                            var content = jQuery.parseJSON(response);
                            video = document.getElementById("video_element_im");
                            video.src = "/ContentRepository/" + content.rutafuente;
                            video.load();
                        }
                    });
                }
                imagen.ondragstart = function(){
                    exchange(this.id);
                }
                document.getElementById("g_celda_" + ((2 * i) + j + 1)).appendChild(imagen);

                //console.log(imagen);
                //document.getElementById("g_celda_"+((2*i)+j+1)).innerHTML=imagen;
            }
            else{
            	title_temp = contents[i].titulo;
				if(title_temp.length>10){
					title_temp=title_temp.substring(0,9)+"...";
				}
                document.getElementById("g_celda_" + ((2 * i) + j + 1)).innerHTML = "<br>" + title_temp + "<br>" + contents[i].duracion + " s";
            }

        }
    }
}

//Cargar el panel de transiciones
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
                    exchange(this.id);
                }
                document.getElementById("g_celda_" + ((2 * i) + j + 1)).appendChild(imagen);
            }
            else{
                document.getElementById("g_celda_" + ((2 * i) + j + 1)).innerHTML = transitions[i].nombre;
            }

        }
    }
}

//Cargar el panel de colores
function load_color_panel(colors){
    var idColor;
    for (i in colors){
        idColor = colors[i].idColor;
        for (var j = 0; j < 2; j++){
            if (j == 0){

                //crenado la imagen a partir de canvas
                canvas_temp = document.createElement("canvas");
                canvas_temp.width = 100;
                canvas_temp.height = 100;
                canvas_temp.getContext('2d').fillStyle = colors[i].codigoRGB;
                canvas_temp.getContext('2d').fillRect(0, 0, 100, 100);

                imagen = document.createElement("img");
                imagen.className = "Thumbnail";
                imagen.id = idColor;
                imagen.src = canvas_temp.toDataURL("image/jpeg");;
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
                    exchange(this.id);
                }
                document.getElementById("g_celda_" + ((2 * i) + j + 1)).appendChild(imagen);
            }
            else{
                document.getElementById("g_celda_" + ((2 * i) + j + 1)).innerHTML = colors[i].nombre;
            }

        }
    }
}

//Cargar el panel de fonts
function load_text_panel(fonts){
    var idFont;
    for (i in fonts){
        idFont = fonts[i].idTexto;
        for (var j = 0; j < 2; j++){
            if (j == 0){

                //crenado la imagen a partir de canvas
                canvas_temp = document.createElement("canvas");
                canvas_temp.width = 100;
                canvas_temp.height = 100;
                canvas_temp.getContext('2d').fillStyle = "rgb(0,0,0)";
                canvas_temp.getContext('2d').fillRect(0, 0, 100, 100);
                canvas_temp.getContext('2d').font = "20px " + fonts[i].font;;
                canvas_temp.getContext('2d').fillStyle = '#FFFFFF';
                canvas_temp.getContext('2d').textAlign = 'center';
                canvas_temp.getContext('2d').textBaseline = "middle";
                canvas_temp.getContext('2d').fillText('AaBbCc', 50, 50, 100);

                imagen = document.createElement("img");
                imagen.className = "Thumbnail";
                imagen.id = idFont;
                imagen.src = canvas_temp.toDataURL("image/jpeg");;
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
                    exchange(this.id);
                }
                document.getElementById("g_celda_" + ((2 * i) + j + 1)).appendChild(imagen);
            }
            else{
                document.getElementById("g_celda_" + ((2 * i) + j + 1)).innerHTML = fonts[i].font;
            }

        }
    }
}

//Cargar el panel de services
function load_service_panel(services){
    var idService;
    for (i in services){
        idService = services[i].id;
        for (var j = 0; j < 2; j++){
            if (j == 0){
                imagen = document.createElement("img");
                imagen.className = "Thumbnail";
                imagen.id = idService;
                imagen.src = "/ServicePosterRepository/" + services[i].rutascreenshot;
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
                    exchange(this.id);
                }
                document.getElementById("g_celda_" + ((2 * i) + j + 1)).appendChild(imagen);
            }
            else{
                document.getElementById("g_celda_" + ((2 * i) + j + 1)).innerHTML = services[i].nombre;
            }

        }
    }
}

//Funcion de diseño para resaltar los thumbs cdon el mouse
function resaltar_PE(id, estado){
    if (estado == 0){
        //entra
        document.getElementById(id).border = "2px";
    }
    else{
        //sale
        document.getElementById(id).border = "0px";
    }
}

function do_save(){
    d = new Descriptor();
    d.lc = elements_lc;
    d.lt = elements_lt;
    d.li = elements_li;
    
    max_dur = 0;
    max_dur = d.lc.elements[d.lc.elements.length-1].end;
	max_dur = 0 + max_dur;
	
	dur_lt = 0;
	if(d.lt.elements.length>0){
		dur_lt = d.lt.elements[d.lt.elements.length-1].end;
	}
	dur_li = 0;
	if(d.li.elements.length>0){
		dur_li = d.li.elements[d.li.elements.length-1].end;
	}

	if(max_dur<dur_lt || max_dur<dur_li){
		alert("Los elementos de la linea de texto y de interactividad no pueden sobrepasar en tiempo a la linea de contenidos...")
		return
	}
	
    //codifico en JSON el descriptor
    jsonStr = JSON.stringify(d);
    console.log(jsonStr);
    //peticion AJAX para obtener los valores del elemento asociado
    $.ajax({
        url: "/ProgrammeProcessorServer/EventProcessorServlet",
        data: "operation=4&descriptor=" + jsonStr,
        type: "POST",
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

function get_idCommunnity(){
	return $.ajax({
                        url: "/ProgrammeProcessorServer/CommunityProcessorServlet",
                        data: "operation=5",
                        type: "POST",
                        cache: true,
                        async: false
                    }).responseText;
}

function do_back(){
	window.location ="/nD3.html";
}

function exchange(id){
    swap = id;
}
