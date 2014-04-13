// JavaScript Document
// Modulo de transiciones CANVAS

//var canvasvideo_tElementID = "";

var alpha=255;

function fade_out(idCanvasvideo_t,idvideo_t){
	
	ctx_t = document.getElementById(idCanvasvideo_t).getContext("2d");
	video_t = document.getElementById(idvideo_t);
	
	ctx_t.drawImage(video_t, 0, 0,300, 144);
	var frame = ctx_t.getImageData(0, 0, 380, 320);
	var l = frame.data.length / 4;
	for (var i = 0; i < l; i++) {
	frame.data[i * 4 + 3] = alpha;
	}
	
	ctx_t.putImageData(frame, 0, 0);
	//alert(alpha);
	alpha=alpha-2;
	if(alpha<1){
	  //video_t.pause();
	  for (var i = 0; i < l; i++) {
		frame.data[i * 4 + 0] = 0;
		frame.data[i * 4 + 1] = 0;
		frame.data[i * 4 + 2] = 0; 
		frame.data[i * 4 + 3] = alpha;
	  }
	  ctx_t.putImageData(frame, 0, 0);
	  alpha = 255;
	  //trans_on=false;	
	  //trans_off=true;
	  //this.timerCallback();
	  //indice_play++;
	  return true;
	}
	return false;
}

function fade_in(){
	
}

function  cutaway(){
	
}

function scanning(){
	
}


