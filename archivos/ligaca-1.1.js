// LIGACA LIbreria GraficA Para CAnvas by CANVAS By Johaned
// Version 1.1
// Fecha: 9 nov 2011
//************************************************ ESTRUCTURA LOGICA DE LOS ELEMENTOS *****************************************************//
elementsCanvas = new Array();

function findECByID(id) {
	if(elementsCanvas.length > 0) {
		for(var i = 0; i < elementsCanvas.length; i++) {
			if(elementsCanvas[i].id == id) {
				return i;
			}
		}
	}
	return (-1);
}

function deleteECByID(id) {
	temp_index = findECByID(id);
	if(temp_index == (-1)) {
		console.log("el elemento no existe")
		return;
	}
	elementsCanvas.splice(temp_index, 1);
}

function deleteAllEC() {
	elementsCanvas.splice(0, elementsCanvas.length)
	console.log("eliminando todos los elementos length: " + elementsCanvas.length);
}

function get_ligaca_element_by_id(id) {
	return elementsCanvas[findECByID(id)];
}

//************************************************** SOLO ESTRUCTURA DE ELEMENTOS ********************************************************//
FontCanvas = function() {
	font = "";
	size = 0;
	color = "";
}
LinkCanvas = function() {
	this.id = "";
	this.tag = "";
	this.align = "";
	this.font = "";
	this.width = 0;
	this.height = 0;
	//este atributo se utliza para enelazar el elemento cuando tiene una super dependencia
	this.parent
}
menuBarCanvas = function() {
	this.id = "";
	this.isHorizontal = true;
	//dimensiones totales de la barra de menu
	this.width = 0;
	this.height = 0;
	//numero de elementos de la barra de menu
	this.noElements = 0;
	//elementos logicos de la barra de menu
	this.elements = new Array();
	//this.font="";
	this.font = new FontCanvas();
	this.fontColor = "";
	//** Gradientes de relleno
	this.colorOverSelect
	this.colorSelect
	this.colorOverUnselect
	this.colorUnselect
	this.gradBar
	this.elementSelect = (-1);
	this.isOver = false;
	this.elementOver = (-1);

	//este atributo se utliza para enelazar el elemento cuando tiene una super dependencia
	this.parent
}
elementMenuBarCanvas = function() {
	this.id = 0;
	this.nombre = "";
	this.isSelect = false;
	//posiciones fisicas del elemento, en pixeles
	this.home = 0;
	this.end = 0;
}
ProgressBarCanvas = function() {
	this.id = "";
	this.width = 0;
	this.height = 0;
	this.value = 0;
	this.borderColor = "";
	this.color = "";
	this.backgroundColor = "";
}
//************************************************* SOLO GENERADORES DE ELEMENTOS ***************************************************************//

//---------------------------------------------------------------------- LINK
function createLink(tag, align, font, width, height, id, e) {
	if(findECByID(id) != (-1)) {
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
	boton.getContext('2d').font = font.size + "px " + font.font;
	boton.getContext('2d').fillStyle = '#000000';
	boton.getContext('2d').textAlign = align;
	boton.getContext('2d').fillText(tag, 0, 15, 14);

	//guardando elemento logico
	elementsCanvas.push(obj);

	//funcion basicas predefinidas
	boton.onmouseover = function() {
		temp = elementsCanvas[findECByID(this.id)];
		boton = document.getElementById(this.id);
		boton.getContext('2d').font = temp.font.size + "px " + temp.font.font;
		boton.getContext('2d').fillStyle = '#0055FF';
		boton.getContext('2d').textAlign = temp.align;
		boton.getContext('2d').fillText(tag, 0, 15, 14);

	}
	boton.onmouseout = function() {
		temp = elementsCanvas[findECByID(this.id)];
		boton = document.getElementById(this.id);
		boton.getContext('2d').font = temp.font.size + "px " + temp.font.font;
		boton.getContext('2d').fillStyle = '#000000';
		boton.getContext('2d').textAlign = temp.align;
		boton.getContext('2d').fillText(tag, 0, 15, 14);
	}
	return boton;
}

//---------------------------------------------------------------------- MENUBAR
function createMenuBar(id, elements, width, height, font, isHorizontal, e) {
	//consulto si ya existe un elemento con este nombre
	if(findECByID(id) != (-1)) {
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

	for(var i = 0; i < elements.length; i++) {
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
	bar.getContext('2d').font = font.size + "px " + font.font;
	bar.getContext('2d').textAlign = 'center';
	bar.getContext('2d').textBaseline = "middle";

	//dibujando el barMenu
	bar.getContext('2d').fillStyle = gradient;
	bar.getContext('2d').fillRect(0, 0, width, height);

	//dibujando los elementos
	bar.getContext('2d').fillStyle = obj.colorUnselect;

	for(var i = 0; i < obj.elements.length; i++) {
		console.log("dibujando elemento " + i + " home: " + obj.elements[i].home + " end: " + obj.elements[i].end);
		bar.getContext('2d').strokeRect(obj.elements[i].home, 0, width_element, height);
		bar.getContext('2d').fillText(obj.elements[i].nombre, (obj.elements[i].end + obj.elements[i].home) / 2, height / 2, width_element);
	}

	//estableciendo los metodos implicitos
	bar.onmousemove = function() {
		id = findECByID(this.id);
		if(id == (-1)) {
			return;
		}
		obj = elementsCanvas[id];
		if(!obj.isOver) {
			obj.isOver = true;
		}
		//obteniendo el objeto bar y su posicion absoluta
		posX = get_cursor_ligaca_positionX(this.id, event.clientX);
		//obteniendo el elemento over bar
		index_temp_element = get_id_over_element_menuBar(obj, posX);
		if(index_temp_element == (-1)) {
			return;
		}
		if(obj.elementOver == index_temp_element) {
			return;
		} else {
			//console.log(index_temp_element + " pos " + posX);
			if(obj.elementOver != (-1)) {
				if(obj.elements[obj.elementOver].isSelect) {
					this.getContext('2d').fillStyle = obj.colorSelect;
				} else {
					this.getContext('2d').fillStyle = obj.colorUnselect
				}
				this.getContext('2d').fillText(obj.elements[obj.elementOver].nombre, (obj.elements[obj.elementOver].end + obj.elements[obj.elementOver].home) / 2, obj.height / 2, obj.width_element);
			}
			obj.elementOver = index_temp_element;
			if(obj.elements[index_temp_element].isSelect) {
				this.getContext('2d').fillStyle = obj.colorOverSelect;
				this.getContext('2d').fillText(obj.elements[index_temp_element].nombre, (obj.elements[index_temp_element].end + obj.elements[index_temp_element].home) / 2, obj.height / 2, obj.width_element);
			} else {
				this.getContext('2d').fillStyle = obj.colorOverUnselect;
				this.getContext('2d').fillText(obj.elements[index_temp_element].nombre, (obj.elements[index_temp_element].end + obj.elements[index_temp_element].home) / 2, obj.height / 2, obj.width_element);
			}
		}
	}

	bar.onmouseout = function() {
		id = findECByID(this.id);
		if(id == (-1)) {
			return;
		}
		obj = elementsCanvas[id];
		if(obj.isOver) {
			obj.isOver = false;
		}
		if(obj.elements[obj.elementOver].isSelect) {
			this.getContext('2d').fillStyle = obj.colorSelect;
			this.getContext('2d').fillText(obj.elements[obj.elementOver].nombre, (obj.elements[obj.elementOver].end + obj.elements[obj.elementOver].home) / 2, obj.height / 2, obj.width_element);
		} else {
			this.getContext('2d').fillStyle = obj.colorUnselect;
			this.getContext('2d').fillText(obj.elements[obj.elementOver].nombre, (obj.elements[obj.elementOver].end + obj.elements[obj.elementOver].home) / 2, obj.height / 2, obj.width_element);
		}
		obj.elementOver = (-1);
	}

	bar.onmousedown = function() {
		id = findECByID(this.id);
		if(id == (-1)) {
			return;
		}
		obj = elementsCanvas[id];
		if(obj.isOver) {
			obj.isOver = false;
		}
		if(obj.elementSelect != (-1)) {
			this.getContext('2d').fillStyle = obj.colorUnselect;
			this.getContext('2d').fillText(obj.elements[obj.elementSelect].nombre, (obj.elements[obj.elementSelect].end + obj.elements[obj.elementSelect].home) / 2, obj.height / 2, obj.width_element);
			obj.elements[obj.elementSelect].isSelect = false;
		}
		obj.elementSelect = get_id_over_element_menuBar(obj, get_cursor_ligaca_positionX(this.id, event.clientX));
		obj.elements[obj.elementSelect].isSelect = true;
		this.getContext('2d').fillStyle = obj.colorSelect;
		this.getContext('2d').fillText(obj.elements[obj.elementSelect].nombre, (obj.elements[obj.elementSelect].end + obj.elements[obj.elementSelect].home) / 2, obj.height / 2, obj.width_element);
	}
	return bar;
}

function create_menu_bar(id, elements, width, height, font, backgroundColor, overColor, isHorizontal, e) {
	//consulto si ya existe un elemento con este nombre
	if(findECByID(id) != (-1)) {
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
	obj.isHorizontal = isHorizontal;
	//*** Estableciendo los colores de relleno para los botones

	obj.colorSelect = overColor;
	obj.colorUnselect = backgroundColor;

	if(isHorizontal) {
		//Obtengo el ancho de cada pestaña y lo almaceno en una variable temporal
		width_element = Math.round(obj.width / obj.noElements);

		for(var i = 0; i < elements.length; i++) {
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
		//*** Interfaz Grafica
		bar.getContext('2d').font = font.size + "px " + font.font;
		bar.getContext('2d').textAlign = 'center';
		bar.getContext('2d').textBaseline = "middle";

		//dibujando el barMenu
		bar.getContext('2d').fillStyle = backgroundColor;
		bar.getContext('2d').fillRect(0, 0, width, height);

		for(var i = 0; i < obj.elements.length; i++) {
			console.log("dibujando elemento " + i + " home: " + obj.elements[i].home + " end: " + obj.elements[i].end);
			bar.getContext('2d').fillStyle = font.color;
			bar.getContext('2d').fillText(obj.elements[i].nombre, (obj.elements[i].end + obj.elements[i].home) / 2, height / 2, width_element);
		}
	} else {
		//Obtengo el ancho de cada pestaña y lo almaceno en una variable temporal
		height_element = Math.round(obj.height / obj.noElements);

		for(var i = 0; i < elements.length; i++) {
			//creo un elemento temporal que guarde todos los detalles del mismo
			var element_temp = new elementMenuBarCanvas();
			element_temp.id = i;
			element_temp.nombre = elements[i];
			element_temp.home = height_element * i;
			element_temp.end = height_element * (i + 1);
			element_temp.isSelect = false;
			//console.log("elemento "+i +" home: "+element_temp.home+" end: "+element_temp.end);
			//añado el elemento a la barra de menu
			obj.elements.push(element_temp);
		}
		//*** Interfaz Grafica
		bar.getContext('2d').font = font.size + "px " + font.font;
		bar.getContext('2d').textAlign = 'center';
		bar.getContext('2d').textBaseline = "middle";

		//dibujando el barMenu
		bar.getContext('2d').fillStyle = backgroundColor;
		bar.getContext('2d').fillRect(0, 0, width, height);

		for(var i = 0; i < obj.elements.length; i++) {
			console.log("dibujando elemento " + i + " home: " + obj.elements[i].home + " end: " + obj.elements[i].end);
			bar.getContext('2d').fillStyle = font.color;
			bar.getContext('2d').fillText(obj.elements[i].nombre, width / 2, (obj.elements[i].end + obj.elements[i].home) / 2, width);
		}

	}

	//**** guardando elemento logico en el vector global ****//
	elementsCanvas.push(obj);

	//estableciendo los metodos implicitos
	bar.onmousemove = function() {
		id = findECByID(this.id);
		if(id == (-1)) {
			return;
		}
		obj = elementsCanvas[id];
		if(!obj.isOver) {
			obj.isOver = true;
		}
		if(obj.isHorizontal) {
			//obteniendo el objeto bar y su posicion absoluta
			posX = get_cursor_ligaca_positionX(this.id, event.clientX);
			//obteniendo el elemento over bar
			index_temp_element = get_id_over_element_menuBar(obj, posX);
			if(index_temp_element == (-1)) {
				return;
			}
			if(obj.elementOver == index_temp_element) {
				return;
			} else {
				//console.log(index_temp_element + " pos " + posX);
				if(obj.elementOver != (-1)) {
					this.getContext('2d').fillStyle = obj.colorUnselect;
					this.getContext('2d').fillRect(obj.elements[obj.elementOver].home, 0, obj.elements[obj.elementOver].end - obj.elements[obj.elementOver].home, 20);
					if(obj.elements[obj.elementOver].isSelect) {
						this.getContext('2d').fillStyle = obj.font.color;
						this.getContext('2d').font = "Bold " + (obj.font.size + 1) + "px " + obj.font.font;
					} else {
						this.getContext('2d').fillStyle = obj.font.color;
						this.getContext('2d').font = obj.font.size + "px " + obj.font.font;
					}
					this.getContext('2d').fillText(obj.elements[obj.elementOver].nombre, (obj.elements[obj.elementOver].end + obj.elements[obj.elementOver].home) / 2, obj.height / 2, obj.width_element);
				}
				obj.elementOver = index_temp_element;
				this.getContext('2d').fillStyle = obj.colorSelect;
				this.getContext('2d').fillRect(obj.elements[index_temp_element].home, 0, obj.elements[index_temp_element].end - obj.elements[index_temp_element].home, 20);
				if(obj.elements[index_temp_element].isSelect) {
					this.getContext('2d').fillStyle = obj.font.color;
					this.getContext('2d').font = "Bold " + (obj.font.size + 1) + "px " + obj.font.font;
				} else {
					this.getContext('2d').fillStyle = obj.font.color;
					this.getContext('2d').font = obj.font.size + "px " + obj.font.font;

				}
				this.getContext('2d').fillText(obj.elements[index_temp_element].nombre, (obj.elements[index_temp_element].end + obj.elements[index_temp_element].home) / 2, obj.height / 2, obj.width_element);
			}
		} else {
			//obteniendo el objeto bar y su posicion absoluta
			posY = get_cursor_ligaca_positionY(this.id, event.clientY);
			//obteniendo el elemento over bar
			index_temp_element = get_id_over_element_menuBar(obj, posY);
			if(index_temp_element == (-1)) {
				return;
			}
			if(obj.elementOver == index_temp_element) {
				return;
			} else {
				//console.log(index_temp_element + " pos " + posX);
				if(obj.elementOver != (-1)) {
					this.getContext('2d').fillStyle = obj.colorUnselect;
					this.getContext('2d').fillRect(0, obj.elements[obj.elementOver].home, obj.width, obj.elements[obj.elementOver].end - obj.elements[obj.elementOver].home);
					if(obj.elements[obj.elementOver].isSelect) {
						this.getContext('2d').fillStyle = obj.font.color;
						this.getContext('2d').font = "Bold " + (obj.font.size + 1) + "px " + obj.font.font;
					} else {
						this.getContext('2d').fillStyle = obj.font.color;
						this.getContext('2d').font = obj.font.size + "px " + obj.font.font;
					}
					this.getContext('2d').fillText(obj.elements[obj.elementOver].nombre, obj.width / 2, (obj.elements[obj.elementOver].end + obj.elements[obj.elementOver].home) / 2, obj.width);
				}
				obj.elementOver = index_temp_element;
				this.getContext('2d').fillStyle = obj.colorSelect;
				this.getContext('2d').fillRect(0, obj.elements[obj.elementOver].home, obj.width, obj.elements[obj.elementOver].end - obj.elements[obj.elementOver].home);
				if(obj.elements[index_temp_element].isSelect) {
					this.getContext('2d').fillStyle = obj.font.color;
					this.getContext('2d').font = "Bold " + (obj.font.size + 1) + "px " + obj.font.font;
				} else {
					this.getContext('2d').fillStyle = obj.font.color;
					this.getContext('2d').font = obj.font.size + "px " + obj.font.font;

				}
				this.getContext('2d').fillText(obj.elements[obj.elementOver].nombre, obj.width / 2, (obj.elements[obj.elementOver].end + obj.elements[obj.elementOver].home) / 2, obj.width);
			}
		}
	}

	bar.onmouseout = function() {
		id = findECByID(this.id);
		if(id == (-1)) {
			return;
		}
		obj = elementsCanvas[id];
		if(obj.isOver) {
			obj.isOver = false;
		}
		if(obj.isHorizontal) {
			this.getContext('2d').fillStyle = obj.colorUnselect;
			this.getContext('2d').fillRect(obj.elements[obj.elementOver].home, 0, obj.elements[obj.elementOver].end - obj.elements[obj.elementOver].home, 20);
			if(obj.elements[obj.elementOver].isSelect) {
				this.getContext('2d').fillStyle = obj.font.color;
				this.getContext('2d').font = "Bold " + (obj.font.size + 1) + "px " + obj.font.font;
			} else {
				this.getContext('2d').fillStyle = obj.font.color;
				this.getContext('2d').font = obj.font.size + "px " + obj.font.font;
			}
			this.getContext('2d').fillText(obj.elements[obj.elementOver].nombre, (obj.elements[obj.elementOver].end + obj.elements[obj.elementOver].home) / 2, obj.height / 2, obj.width_element);
		} else {
			this.getContext('2d').fillStyle = obj.colorUnselect;
			this.getContext('2d').fillRect(0, obj.elements[obj.elementOver].home, obj.width, obj.elements[obj.elementOver].end - obj.elements[obj.elementOver].home);
			if(obj.elements[obj.elementOver].isSelect) {
				this.getContext('2d').fillStyle = obj.font.color;
				this.getContext('2d').font = "Bold " + (obj.font.size + 1) + "px " + obj.font.font;
			} else {
				this.getContext('2d').fillStyle = obj.font.color;
				this.getContext('2d').font = obj.font.size + "px " + obj.font.font;
			}
			this.getContext('2d').fillText(obj.elements[obj.elementOver].nombre, obj.width / 2, (obj.elements[obj.elementOver].end + obj.elements[obj.elementOver].home) / 2, obj.width);
		}
		obj.elementOver = (-1);
	}

	bar.onmousedown = function() {
		id = findECByID(this.id);
		if(id == (-1)) {
			return;
		}
		obj = elementsCanvas[id];
		if(obj.isOver) {
			obj.isOver = false;
		}
		if(obj.isHorizontal) {
			if(obj.elementSelect != (-1)) {
				this.getContext('2d').fillStyle = obj.colorUnselect;
				this.getContext('2d').fillRect(obj.elements[obj.elementSelect].home, 0, obj.elements[obj.elementSelect].end - obj.elements[obj.elementSelect].home, 20);
				this.getContext('2d').font = obj.font.size + "px " + obj.font.font;
				this.getContext('2d').fillStyle = obj.font.color;
				this.getContext('2d').fillText(obj.elements[obj.elementSelect].nombre, (obj.elements[obj.elementSelect].end + obj.elements[obj.elementSelect].home) / 2, obj.height / 2, obj.width_element);
				obj.elements[obj.elementSelect].isSelect = false;
			}

			obj.elementSelect = get_id_over_element_menuBar(obj, get_cursor_ligaca_positionX(this.id, event.clientX));
			obj.elements[obj.elementSelect].isSelect = true;
			this.getContext('2d').fillStyle = obj.colorSelect;
			this.getContext('2d').fillRect(obj.elements[obj.elementSelect].home, 0, obj.elements[obj.elementSelect].end - obj.elements[obj.elementSelect].home, 20);
			this.getContext('2d').font = "Bold " + (obj.font.size + 1) + "px " + obj.font.font;
			this.getContext('2d').fillStyle = obj.font.color;
			this.getContext('2d').fillText(obj.elements[obj.elementSelect].nombre, (obj.elements[obj.elementSelect].end + obj.elements[obj.elementSelect].home) / 2, obj.height / 2, obj.width_element);
		} else {
			if(obj.elementSelect != (-1)) {
				this.getContext('2d').fillStyle = obj.colorUnselect;
				this.getContext('2d').fillRect(0, obj.elements[obj.elementSelect].home, obj.width, obj.elements[obj.elementSelect].end - obj.elements[obj.elementSelect].home);
				this.getContext('2d').font = obj.font.size + "px " + obj.font.font;
				this.getContext('2d').fillStyle = obj.font.color;
				this.getContext('2d').fillText(obj.elements[obj.elementSelect].nombre, obj.width / 2, (obj.elements[obj.elementSelect].end + obj.elements[obj.elementSelect].home) / 2, obj.width);
				obj.elements[obj.elementSelect].isSelect = false;
			}

			obj.elementSelect = get_id_over_element_menuBar(obj, get_cursor_ligaca_positionY(this.id, event.clientY));
			obj.elements[obj.elementSelect].isSelect = true;
			this.getContext('2d').fillStyle = obj.colorSelect;
			this.getContext('2d').fillRect(0, obj.elements[obj.elementSelect].home, obj.width, obj.elements[obj.elementSelect].end - obj.elements[obj.elementSelect].home);
			this.getContext('2d').font = "Bold " + (obj.font.size + 1) + "px " + obj.font.font;
			this.getContext('2d').fillStyle = obj.font.color;
			this.getContext('2d').fillText(obj.elements[obj.elementSelect].nombre, obj.width / 2, (obj.elements[obj.elementSelect].end + obj.elements[obj.elementSelect].home) / 2, obj.width);
		}
	}
	return bar;
}

//metodo para obtener el id del elemento OVER del menu bar
function get_id_over_element_menuBar(obj, pos) {
	for( i = 0; i < obj.elements.length; i++) {
		if(pos >= obj.elements[i].home && pos <= obj.elements[i].end) {
			return i;
		}
	}
	return (-1);
}

//metodo publico para conocer el indice del click sobre el elemento
function get_id_click_element_menuBar(id_canvas, pos) {
	id = findECByID(id_canvas);
	if(id == (-1)) {
		return;
	}
	obj = elementsCanvas[id];
	if(obj.isHorizontal) {
		id = get_id_over_element_menuBar(obj, get_cursor_ligaca_positionX(id_canvas, pos));
		return id;
	} else {
		id = get_id_over_element_menuBar(obj, get_cursor_ligaca_positionY(id_canvas, pos));
		return id;
	}

}

//---------------------------------------------------------------------- PROGRESSBAR

function create_progres_bar(id, width, height, borderColor, color, backgroundColor) {
	if(findECByID(id) != (-1)) {
		console.log("El elemento no puede ser creado por que ya existe otro elemento con este ID");
		return;
	}
	obj = new ProgressBarCanvas();
	obj.id = id;
	obj.width = width;
	obj.height = height;
	obj.borderColor = borderColor;
	obj.color = color;
	obj.backgroundColor = backgroundColor;

	//guardando elemento logico
	elementsCanvas.push(obj);
	progressBar = document.createElement("canvas");
	progressBar.id = id;
	progressBar.width = width;
	progressBar.height = height;
	progressBar.getContext('2d').fillStyle = backgroundColor;
	progressBar.getContext('2d').fillRect(0, 0, width, height);
	progressBar.getContext('2d').fillStyle = borderColor;
	progressBar.getContext('2d').strokeRect(0, 0, width, height);

	return progressBar;
}

function set_value_progres_bar(id, value) {
	progressBarLogic = get_ligaca_element_by_id(id);
	progressBar = document.getElementById(id);
	width_temp = (value * progressBarLogic.width) / 100;
	if(progressBar != undefined && progressBarLogic != undefined) {
		progressBar.getContext('2d').fillStyle = progressBarLogic.backgroundColor;
		progressBar.getContext('2d').fillRect(0, 0, progressBarLogic.width, progressBarLogic.height);
		progressBar.getContext('2d').fillStyle = progressBarLogic.color;
		progressBar.getContext('2d').fillRect(0, 0, width_temp, progressBarLogic.height);
		progressBar.getContext('2d').fillStyle = progressBarLogic.borderColor;
		progressBar.getContext('2d').strokeRect(0, 0, progressBarLogic.width, progressBarLogic.height);
	}
}

function get_value_progres_bar(id) {
	progressBarLogic = get_ligaca_element_by_id(id);
	return progressBarLogic.value;
}

//************************************************** Meta-elementos LIGACA **************************************************************//

function create_listening_menu(id_div, elements_t, font, backgroundColor, selectColor) {
	if(document.getElementById(id_div) == undefined) {
		div_menu_temp = document.createElement("div");
		div_menu_temp.id = id_div;
	} else {
		div_menu_temp = document.getElementById(id_div);
	}
	div_menu_temp.className = "menu_vertical_temp";
	console.log(event.clientX + " " + event.clientY);
	div_menu_temp.style.left = (event.clientX - 5) + "px";
	div_menu_temp.style.top = (event.clientY - 5) + "px";
	div_menu_temp.style.zIndex = 3;
	div_menu_temp.style.visibility = "visible";
	bar = create_menu_bar(id_div + "_menuBar", elements_t, 100, 40, font, backgroundColor, selectColor, false);
	bar.onclick = function() {	
		div=document.getElementById(this.id.replace("_menuBar",""));
		div.innerHTML = "";
		div.style.zIndex = (-1);
		div.style.visibility = "hidden";
		deleteECByID(this.id);
	}
	bar.onmousedown = function() {
		type_element = get_id_click_element_menuBar(this.id, event.clientY) + 1;
		console.log(type_element + " ...para utlizar este evento debe sobrecargar el evento onmousedown del elemento retornado!!");
		//procesor_menu_elements(type_element);
	}
	div_menu_temp.appendChild(bar);
	div_menu_temp.onmouseout = function() {
		console.log(this.id + "_menuBar");
		deleteECByID(this.id + "_menuBar");
		this.innerHTML = "";
		this.style.zIndex = (-1);
		this.style.visibility = "hidden";
	}
	document.body.appendChild(div_menu_temp);
	return bar;
}

//************************************************* Funciones Varias Canvas *************************************************************//

function get_cursor_ligaca_positionX(id_canvas, x) {
	posCanvas = findLeftObj(document.getElementById(id_canvas));
	return (x - posCanvas) + document.body.scrollLeft;
}

function get_cursor_ligaca_positionY(id_canvas, y) {
	posCanvas = findTopObj(document.getElementById(id_canvas));
	return (y - posCanvas) + document.body.scrollTop;
}