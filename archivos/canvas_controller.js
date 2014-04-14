// JavaScript Document

//atributos cursores 
var lim_x=501-10;
var pos_cur1=0;
var pos_cur2=lim_x-10;
var esArrastrable=false;
var cur_sel;
var d;
var temp_pos;

//atributos volumen
var vol=50;//max 50 min 0



var i_pp= new Image();
var i_vol= new Image();
var cortar_contenido=false;//Bandera para habilitar la edcion de cortado de contenido
var esPlayCortarContenido= false;
var esControlVolumen=false;//****
var e_vol=50;


// Solo principal************************ 

function dibujar() {
	// Capa Background translucida*******************************
	/*var bg = document.getElementById("bg");
	var ctxbg = bg.getContext("2d");
	ctxbg.fillStyle = "rgba(0,0,0,0.5)";
	ctxbg.fillRect (0, 0, 1440, 900);*/
	
	// Barra de control total************************************
	// Boton play/pause de la barra de control
	/*i_pp.src="play.jpg";
	document.getElementById("e_play").style.position='absolute';
	document.getElementById("e_play").style.left=0+"px";
	i_pp.onload = function(){document.getElementById("e_play").getContext("2d").drawImage(i_pp,2,0,20,20);}*/
	 
	//Boton volume de la barra de control
	/*i_vol.src="volume.jpg";
	document.getElementById("e_volume").style.position='absolute';
	document.getElementById("e_volume").style.left=350+"px";
	
	i_vol.onload = function(){document.getElementById("e_volume").getContext("2d").drawImage(i_vol,2,0,20,20);}*/
	/*temp_ctx = document.getElementById("e_volume").getContext("2d");
	temp_ctx.beginPath(); 
    temp_ctx.moveTo(0,20); 
    temp_ctx.lineTo(50,7.5); 
    temp_ctx.lineTo(50,20);
	temp_ctx.closePath();
	temp_ctx.fillStyle = '#6633FF'; 
	temp_ctx.fill();*/
	
	// Texto Indicador de tiempo
	var tiempo_text = document.getElementById("e_tiempo");
	tiempo_text.style.position='absolute';
	tiempo_text.style.left=670+"px";
	var ctx_tt = tiempo_text.getContext("2d");
	ctx_tt.font = "15px verdana"; 
	ctx_tt.fillStyle = '#FFFFFF'; 
	ctx_tt.textAlign = 'center'; 
		
	// configuracion linea de control de tiempo del video********
	document.getElementById("e_barra_tiempo").style.width=(lim_x+10)+"px";
	document.getElementById("cursor1").style.left=pos_cur1+"px";
	document.getElementById("cursor2").style.left=pos_cur2+"px";
	
	var gradient = document.getElementById("cursor1").getContext("2d").createLinearGradient(0,0,10,20);
	gradient.addColorStop(0, '#000000');
	gradient.addColorStop(1, '#505050');
	
	var c1 = document.getElementById("cursor1");
	var ctx = c1.getContext("2d");    
	ctx.fillStyle = gradient;
	ctx.fillRect (0, 0, 10, 20);
	
	var c2 = document.getElementById("cursor2");
	var ctx2 = c2.getContext("2d");
	ctx2.fillStyle = gradient;
	ctx2.fillRect (0, 0, 10, 20);
}


// solo barra de cortado cursor 1 y 2***************

function drag_on_c(event,id){
	cur_sel=id;
	if(id=='cursor1'){
		d=event.clientX-pos_cur1;
	}
	else{
		d=event.clientX-pos_cur2;
	}
	//ps=event.clientX;
	esArrastrable=true;
}

function drag_off_c(){
	esArrastrable=false;
	if(cur_sel=='cursor1'){
		pos_cur1=temp_pos;
		cortar_contenido=true;
		//var p = document.getElementById('consola');
		//p.value="\n********************************** la posicion en la que quedo 1 es : "+pos_cur1;
		//console.log("\n********************************** la posicion en la que quedo 1 es : "+pos_cur1);
	}
	else{
		pos_cur2=temp_pos;
		cortar_contenido=true;
		//var p = document.getElementById('consola');
		//p.value="\n********************************** la posicion en la que quedo 2 es : "+pos_cur2;
		//console.log("\n********************************** la posicion en la que quedo 2 es : "+pos_cur2);
	}
	
}

function identificar_cursor(e){
 	//var p = document.getElementById('consola');
	//console.log(value="Posici�n del rat�n x: " + e.clientX + " y: " + e.clientY);
}

function mover_cursor(event){
	//var p = document.getElementById('consola');
	//p.value="\nentro" +esArrastrable;
	//console.log("\nentro" +esArrastrable);
	if(esArrastrable){
		if(cur_sel=='cursor1'){
			temp_pos=event.clientX-(d);
			//p.value="\neventX en:"+event.clientX+" cursor en:"+temp_pos;
			//console.log("\neventX en:"+event.clientX+" cursor en:"+temp_pos);
			
			if(temp_pos<0 ){
				temp_pos=0;
			}
			else if (temp_pos>(pos_cur2-0)){
				temp_pos=pos_cur2-0;
			}
			//if(temp_pos<0 || temp_pos>(pos_cur2-10)){return;}
			document.getElementById(cur_sel).style.left=temp_pos+"px";	
			//console.log("moviendo");
			
			//document.getElementById("tiempo_e").getContext("2d").fillStyle = "rgb(0,0,0)";
	        //document.getElementById("tiempo_e").getContext("2d").fillRect (0, 0, 60, 20); 
			//document.getElementById("e_tiempo").getContext("2d").clearRect (0, 0, 60, 20);**********************************
			//document.getElementById("tiempo_e").getContext("2d").fillStyle = '#FFFFFF';
			//document.getElementById("e_tiempo").getContext("2d").fillText(temp_pos, 30, 15, 60);****************************
		}else{
			temp_pos=event.clientX-(d);
			//p.value="\neventX en:"+event.clientX+" cursor en:"+temp_pos;
			//console.log("\neventX en:"+event.clientX+" cursor en:"+temp_pos);
			if(temp_pos<(pos_cur1+0) ){
				temp_pos=pos_cur1+0;
			}
			else if (temp_pos>lim_x-10){
				temp_pos=lim_x-10;
			}
			//if(temp_pos<(pos_cur1+10) || temp_pos>390){	return;	}
			document.getElementById(cur_sel).style.left=temp_pos+"px";	
			
			/*document.getElementById("tiempo_e").getContext("2d").fillStyle = "rgb(0,0,0)";
	        document.getElementById("tiempo_e").getContext("2d").fillRect (0, 0, 60, 20); */
			//document.getElementById("e_tiempo").getContext("2d").clearRect (0, 0, 60, 20);***************************
			//document.getElementById("tiempo_e").getContext("2d").fillStyle = '#FFFFFF';
			//document.getElementById("e_tiempo").getContext("2d").fillText(temp_pos, 30, 15, 60);*********************
		}
	}
}

//Solo metodo play contexto edicion/cortado

function e_play_method(){
	if(!esPlayCortarContenido){//play
		i_pp.src="pause.jpg";
		i_pp.onload = function(){document.getElementById("e_play").getContext("2d").drawImage(i_pp,2,0,20,20);}
		
		esPlayCortarContenido=true;
	}
	else{//pause
		i_pp.src="play.jpg";
		i_pp.onload = function(){document.getElementById("e_play").getContext("2d").drawImage(i_pp,2,0,20,20);}
		
		esPlayCortarContenido=false;
	}
}

//Solo control de volumen contexto edicion/cortado
function e_vol_change(event){
	vol=event.clientX-716;
	document.getElementById("e_volume").getContext("2d").clearRect (0, 0, 50, 20);
	document.getElementById("e_volume").getContext("2d").drawImage(i_vol,2,0,20,20);
	temp_ctx = document.getElementById("e_volume").getContext("2d");
	temp_ctx.beginPath(); 
    temp_ctx.moveTo(0,20); 
    temp_ctx.lineTo(vol,20-(Math.tan(14*2*Math.PI/360)*vol)); 
    temp_ctx.lineTo(vol,20);
	temp_ctx.closePath();
	temp_ctx.fillStyle = '#6633FF'; 
	temp_ctx.fill();
	var p = document.getElementById('posicion');
		p.value=vol;
}

function e_vol_method(temp){
	if(temp){
		document.getElementById("e_volume").getContext("2d").clearRect (0, 0, 50, 20);
		document.getElementById("e_volume").getContext("2d").drawImage(i_vol,2,0,20,20);
		temp_ctx = document.getElementById("e_volume").getContext("2d");
		temp_ctx.beginPath(); 
		temp_ctx.moveTo(0,20); 
		temp_ctx.lineTo(vol,20-(Math.tan(14*2*Math.PI/360)*vol)); 
		temp_ctx.lineTo(vol,20);
		temp_ctx.closePath();
		temp_ctx.fillStyle = '#6633FF'; 
		temp_ctx.fill();	
	}else{
		document.getElementById("e_volume").getContext("2d").clearRect (0, 0, 50, 20);
		document.getElementById("e_volume").getContext("2d").drawImage(i_vol,2,0,20,20);
	}
}
