// LIGACA LIbreria GraficA Para CAnvas by CANVAS By Johaned
//************************************************ ESTRUCTURA LOGICA DE LOS ELEMENTOS *****************************************************//
elementsCanvas = new Array();

function findECByID(id){
    if (elementsCanvas.length > 0){
        for (var i = 0; i < elementsCanvas.length; i++){
            if (elementsCanvas[i].id == id){
                return i;
            }
        }
    }
    return ( - 1);
}

function deleteECByID(id){
    temp_index = findECByID(id);
    if (temp_index == ( - 1)){
        console.log("el elemento no existe")
        return;
    }
    elementsCanvas.splice(temp_index, 1);
}

function deleteAllEC(){
    elementsCanvas.splice(0, elementsCanvas.length)
    console.log("eliminando todos los elementos length: " + elementsCanvas.length);
}

function get_ligaca_element_by_id(id){
	return elementsCanvas[findECByID(id)];
}
//************************************************** SOLO ESTRUCTURA DE ELEMENTOS ********************************************************//
LinkCanvas = function(){
    this.id = "";
    this.tag = "";
    this.align = "";
    this.font = "";
    this.width = 0;
    this.height = 0;
    //este atributo se utliza para enelazar el elemento cuando tiene una super dependencia 
    this.parent;

}

menuBarCanvas = function(){
    this.id = "";
    //dimensiones totales de la barra de menu
    this.width = 0;
    this.height = 0;
    //numero de elementos de la barra de menu
    this.noElements = 0;
    //elementos logicos de la barra de menu
    this.elements = new Array();
    this.font = "";
    //** Gradientes de relleno
    this.colorOverSelect;
    this.colorSelect;
    this.colorOverUnselect;
    this.colorUnselect;
    this.gradBar;
    //Refrencia del elemento seleccionado
    this.elementSelect = ( - 1);
    this.isOver = false;
    this.elementOver = ( - 1);

    //este atributo se utliza para enelazar el elemento cuando tiene una super dependencia 
    this.parent;
}

elementMenuBarCanvas = function(){
    this.id = 0;
    this.nombre = "";
    this.isSelect = false;
    //posiciones fisicas del elemento, en pixeles
    this.home = 0;
    this.end = 0;
}


//************************************************* SOLO GENERADORES DE ELEMENTOS ***************************************************************//

//---------------------------------------------------------------------- LINK
function createLink(tag, align, font, width, height, id, e){
    if (findECByID(id) != ( - 1)){
        console.log("El elemento no puede ser creado por que ya existe otro elemento con este ID");
        return;
    }
    //Formando el elemento logico
    var obj = new LinkCanvas();
    obj.id = id;
    obj.tag = tag;
    obj.align = align;
    obj.font = font;
    obj.width = width;
    obj.height = height;
    obj.parent = e;
    //generando el elemento grafico
    boton = document.createElement("canvas");
    boton.id = id;
    boton.width = width;
    boton.height = height;
    boton.getContext('2d').font = font;
    boton.getContext('2d').fillStyle = '#000000';
    boton.getContext('2d').textAlign = align;
    boton.getContext('2d').fillText(tag, 0, 15, width);

    //guardando elemento logico
    elementsCanvas.push(obj);

    //funcion basicas predefinidas
    boton.onmouseover = function(){
        temp = elementsCanvas[findECByID(this.id)];
        boton = document.getElementById(this.id);
        boton.getContext('2d').font = temp.font;
        boton.getContext('2d').fillStyle = '#0055FF';
        boton.getContext('2d').textAlign = temp.align;
        boton.getContext('2d').fillText(tag, 0, 15, width);

    }
    boton.onmouseout = function(){
        temp = elementsCanvas[findECByID(this.id)];
        boton = document.getElementById(this.id);
        boton.getContext('2d').font = temp.font;
        boton.getContext('2d').fillStyle = '#000000';
        boton.getContext('2d').textAlign = temp.align;
        boton.getContext('2d').fillText(tag, 0, 15, width);
    }

    return boton;
}


//---------------------------------------------------------------------- MENUBAR
function createMenuBar(id, elements, width, height, font,e){
    //consulto si ya existe un elemento con este nombre
    if (findECByID(id) != ( - 1)){
        console.log("El elemento no puede ser creado por que ya existe otro elemento con este ID");
        return;
    }

    //*** Interfaz Logica
    //creo el objeto logico menuBar
    bar = document.createElement("canvas");
    bar.id = id;
    bar.width = width;
    bar.height = height;

    var obj = new menuBarCanvas();
    obj.id = id;
    obj.noElements = elements.length;
    obj.width = width;
    obj.height = height;
    obj.font = font;
    //Obtengo el ancho de cada pestaña y lo almaceno en una variable temporal
    width_element = Math.round(obj.width / obj.noElements);

    for (var i = 0; i < elements.length; i++){
        //creo un elemento temporal que guarde todos los detalles del mismo
        var element_temp = new elementMenuBarCanvas();
        element_temp.id = i;
        element_temp.nombre = elements[i];
        element_temp.home = width_element * i;
        element_temp.end = width_element * (i + 1);
        element_temp.isSelect = false;
        //console.log("elemento "+i +" home: "+element_temp.home+" end: "+element_temp.end);
        //añado el elemento a la barra de menu
        obj.elements.push(element_temp);
    }
    //*** Estableciendo los gradientes y colores de relleno para los cuatro casos
    gradient = bar.getContext('2d').createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#000000");
    gradient.addColorStop(0.5, "#888888");
    gradient.addColorStop(1, "#000000");
    obj.gradBar = gradient;
    obj.colorOverSelect = "#FF8800";
    obj.colorSelect = "#FF8800";
    obj.colorOverUnselect = "#00FF88";
    obj.colorUnselect = "#FFFFFF";

    //guardando elemento logico en el vector global
    elementsCanvas.push(obj);

    //*** Interfaz Grafica
    bar.getContext('2d').font = font;
    bar.getContext('2d').textAlign = 'center';
    bar.getContext('2d').textBaseline = "middle";

    //dibujando el barMenu
    bar.getContext('2d').fillStyle = gradient;
    bar.getContext('2d').fillRect(0, 0, width, height);

    //dibujando los elementos
    bar.getContext('2d').fillStyle = obj.colorUnselect;
    for (var i = 0; i < obj.elements.length; i++){
        console.log("dibujando elemento " + i + " home: " + obj.elements[i].home + " end: " + obj.elements[i].end);
        bar.getContext('2d').strokeRect(obj.elements[i].home, 0, width_element, height);
        bar.getContext('2d').fillText(obj.elements[i].nombre, (obj.elements[i].end + obj.elements[i].home) / 2, height / 2, width_element);
    }

    //estableciendo los metodos implicitos
    bar.onmousemove = function(){
        id = findECByID(this.id);
        if (id == ( - 1)){
            return;
        }
        obj = elementsCanvas[id];
        if (!obj.isOver){
            obj.isOver = true;
        }
        //obteniendo el objeto bar y su posicion absoluta
        posX = get_cursor_ligaca_positionX(this.id, event.clientX);
        //obteniendo el elemento over bar
        index_temp_element = get_id_over_element_menuBar(obj, posX);
        if (obj.elementOver == index_temp_element){
            return;
        } else{
            //console.log(index_temp_element + " pos " + posX);
            if (obj.elementOver != ( - 1)){
                if (obj.elements[obj.elementOver].isSelect){
                    bar.getContext('2d').fillStyle = obj.colorSelect;
                } else{
                    bar.getContext('2d').fillStyle = obj.colorUnselect
                }
                bar.getContext('2d').fillText(obj.elements[obj.elementOver].nombre, (obj.elements[obj.elementOver].end + obj.elements[obj.elementOver].home) / 2, obj.height / 2, obj.width_element);
            }
            obj.elementOver = index_temp_element;
            if (obj.elements[index_temp_element].isSelect){
                bar.getContext('2d').fillStyle = obj.colorOverSelect;
                bar.getContext('2d').fillText(obj.elements[index_temp_element].nombre, (obj.elements[index_temp_element].end + obj.elements[index_temp_element].home) / 2, obj.height / 2, obj.width_element);
            }
            else{
                bar.getContext('2d').fillStyle = obj.colorOverUnselect;
                bar.getContext('2d').fillText(obj.elements[index_temp_element].nombre, (obj.elements[index_temp_element].end + obj.elements[index_temp_element].home) / 2, obj.height / 2, obj.width_element);
            }
        }
    }

    bar.onmouseout = function(){
        id = findECByID(this.id);
        if (id == ( - 1)){
            return;
        }
        obj = elementsCanvas[id];
        if (obj.isOver){
            obj.isOver = false;
        }
        if (obj.elements[obj.elementOver].isSelect){
            bar.getContext('2d').fillStyle = obj.colorSelect;
            bar.getContext('2d').fillText(obj.elements[obj.elementOver].nombre, (obj.elements[obj.elementOver].end + obj.elements[obj.elementOver].home) / 2, obj.height / 2, obj.width_element);
        }
        else{
            bar.getContext('2d').fillStyle = obj.colorUnselect;
            bar.getContext('2d').fillText(obj.elements[obj.elementOver].nombre, (obj.elements[obj.elementOver].end + obj.elements[obj.elementOver].home) / 2, obj.height / 2, obj.width_element);
        }
        obj.elementOver = ( - 1);
    }

    bar.onmousedown = function(){
        id = findECByID(this.id);
        if (id == ( - 1)){
            return;
        }
        obj = elementsCanvas[id];
        if (obj.isOver){
            obj.isOver = false;
        }
        if (obj.elementSelect != ( - 1)){
            bar.getContext('2d').fillStyle = obj.colorUnselect;
            bar.getContext('2d').fillText(obj.elements[obj.elementSelect].nombre, (obj.elements[obj.elementSelect].end + obj.elements[obj.elementSelect].home) / 2, obj.height / 2, obj.width_element);
            obj.elements[obj.elementSelect].isSelect = false;
        }
        obj.elementSelect = get_id_over_element_menuBar(obj, get_cursor_ligaca_positionX(this.id, event.clientX));
        obj.elements[obj.elementSelect].isSelect = true;
        bar.getContext('2d').fillStyle = obj.colorSelect;
        bar.getContext('2d').fillText(obj.elements[obj.elementSelect].nombre, (obj.elements[obj.elementSelect].end + obj.elements[obj.elementSelect].home) / 2, obj.height / 2, obj.width_element);
    }
    return bar;
}

//metodo
function get_id_over_element_menuBar(obj, pos){
    for (i = 0; i < obj.elements.length; i++){
        if (pos >= obj.elements[i].home && pos <= obj.elements[i].end){
            return i;
        }
    }
    return ( - 1);
}

//metodo publico para conocer el indice del click sobre el elemento
function get_id_click_element_menuBar(id_canvas,pos){
	id = findECByID(id_canvas);
    if (id == ( - 1)){
       return;
    }
    obj = elementsCanvas[id];
	id = get_id_over_element_menuBar(obj,get_cursor_ligaca_positionX(id_canvas,pos));
	return id;
}

//************************************************* Funciones Varias Canvas *************************************************************//

function get_cursor_ligaca_positionX(id_canvas, x){
    posCanvas = findLeftObj(document.getElementById(id_canvas));
    return (x - posCanvas) + document.body.scrollLeft;
}
