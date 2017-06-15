var current;
var max;
var frame_width=400;
var frame_height=300;
var fileList;
var fileIndex;
var initFlag=true;
var fileName= new Array(6);
var reverseFlag=false;
var status=4;
var ansFlag=false;
var synth = window.speechSynthesis;
fileName[5]="";
speak();
window.document.onkeydown = keyDown;
window.document.onkeyup = keyUp;
var map = {16:false, 37:false, 39:false, 65:false, 70:false, 73:false, 77:false, 78:false, 79:false, 83:false};
var unlock = {16:true, 37:true, 39:true, 65:true, 70:true, 73:true, 77:true, 78:true, 79:true, 83:true};
var selectFocus =document.getElementById("language");
var fileOpen=document.getElementById("open");

selectFocus.onchange=function(){
	selectFocus.blur();
}

function openFile(){
	var file = document.getElementById('getfile');
	populateVoiceList();
	if(file.value){
		if(initFlag){
			document.getElementById('xxx').style.display = "inline";
			document.getElementById('yyy').style.display = "inline";
			document.getElementById('zzz').style.display = "inline";
			document.getElementById("openFile").style.fontSize="20px";
			document.getElementById("openFile").style.top="20px";
			initFlag=false;	
		}
		
		fileList = [];
		
		var count = 0;
		for(var i=0;i<file.files.length;i++){
			if(file.files[i].webkitRelativePath.split("/").length==2){
				count+=1;
				fileList.push(file.files[i]);
			}
		}
			
		max=fileList.length;
		fileIndex = [];
		for(var i=0;i<max;i++)
			fileIndex[i]=i;
		
		setName(fileList[fileIndex[0]].name);
	
		if(reverseFlag){
			document.getElementById("picName").innerHTML=fileName[0];
			document.getElementById("picture").src="./img/white.jpg";		
		}else{
			document.getElementById("picName").innerHTML=fileName[status];
	 		read(0);
		}
		ansFlag=false;
		current=0;
		document.getElementById("counter").innerHTML=(current+1)+"/"+max;
	}
}

function populateVoiceList() {
  voices = synth.getVoices();
  var voiceSelect = document.getElementById('language');
  for(i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    option.value=i;
 
    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);

    voiceSelect.appendChild(option);
  }
}

function read(n){
	var reader = new FileReader();
	reader.readAsDataURL(fileList[n]); 

	reader.onload = function  () {	
		document.getElementById("picture").src = reader.result;
		var img = document.getElementById("picture");
		img.src = reader.result;
				
		img.onload = function() {
		if((frame_width/frame_height)>(img.naturalWidth/img.naturalHeight)){
			document.getElementById("picture").height = frame_height;
			document.getElementById("picture").width = img.naturalWidth*(frame_height/img.naturalHeight);
		}else{
			document.getElementById("picture").width = frame_width;
			document.getElementById("picture").height = img.naturalHeight*(frame_width/img.naturalWidth);
		}
		}
    };
}


function keyDown(){
 	if (event.keyCode in map){
		map[event.keyCode] = true;
		if (map[37] && unlock[37]) {
			if(map[16])
            	changeImg(0);
            else
            	changeImg(1);
            	
            unlock[37] = false;
        }
        
		if (map[39] && unlock[39]) {
			if(map[16]) 
            	changeImg(3);
			 else
            	changeImg(2);
            
			unlock[39] = false;
        } 
        
		if(map[65] && unlock[65]){
			showAns();  	
        	unlock[65] = false;
        }

        if(map[70] && unlock[70]){
			shuffle();
			unlock[70] = false;
		}
        
		if(map[73] && unlock[73] && document.getElementById("image_mode").checked){
			if(document.getElementById("init").checked)
				document.getElementById("init").checked=false;
			else
				document.getElementById("init").checked = true;
			changeStatus();
			unlock[73] = false;
		}
		
		if(map[77] && unlock[77]){
			if(document.getElementById("image_mode").checked){
				document.getElementById("image_mode").checked = false;
				document.getElementById("word_mode").checked = true;
			}else{
				document.getElementById("image_mode").checked = true;
				document.getElementById("word_mode").checked = false;
			}
        	reverse();
       	
        	unlock[77] = false;
        }
        
        if(map[78] && unlock[78]&& document.getElementById("image_mode").checked){ //number of words
			if(document.getElementById("nm").checked)
				document.getElementById("nm").checked = false;
			else
				document.getElementById("nm").checked = true;
			changeStatus();
			
			unlock[78] = false;
		}
		
		if(map[77] && unlock[77]){	  
			fileOpen.selectFocus.focus();
			unlock[79] = false;
		}

		if(map[83] && unlock[83]){
			speak();
            
			unlock[83] = false;
		}	
	}
}

function keyUp(){
	if (event.keyCode in map){
		map[event.keyCode] = false;
		unlock[event.keyCode] = true; 
	}
}
 
function shuffle(){
	 for(var i=max-1;i>1;i--){
	 	var x=Math.floor( Math.random() * i );
	 	var tmp=fileIndex[i];
	 	fileIndex[i]=fileIndex[x];
	 	fileIndex[x]=tmp;
	 }

	 current=0;
	 ansFlag=false;
	 setName(fileList[fileIndex[0]].name);
	 
	 if(reverseFlag){
		document.getElementById("picName").innerHTML=fileName[0];
		document.getElementById("picture").src="./img/white.jpg";
	 }else{
		document.getElementById("picName").innerHTML=fileName[status];
		read(fileIndex[current]);	
	 }
	 document.getElementById("counter").innerHTML=(current+1)+"/"+max;
}

function reverse(){
	if(document.getElementById("word_mode").checked){
		reverseFlag=true;
		document.getElementById("picName").innerHTML=fileName[0];
		document.getElementById("picture").src="./img/white.jpg";
		if(document.getElementById("init").checked)
			document.getElementById("initial").style.backgroundColor = "#A5E1FF"
		else
			document.getElementById("initial").style.backgroundColor ="#E5E5E5";
		
		if(document.getElementById("nm").checked)
			document.getElementById("number").style.backgroundColor = "#A5E1FF";
		else
			document.getElementById("number").style.backgroundColor = "#E5E5E5";		 
		document.getElementById("init").disabled=true;
		document.getElementById("nm").disabled=true;				
	}else{
		reverseFlag=false;
		if(document.getElementById("init").checked)
			document.getElementById("initial").style.backgroundColor = "#66CCFF";
		else
			document.getElementById("initial").style.backgroundColor = "#c0c0c0";
		if(document.getElementById("nm").checked)
			document.getElementById("number").style.backgroundColor = "#66CCFF";
		else
			document.getElementById("number").style.backgroundColor = "#c0c0c0";
		document.getElementById("init").disabled=false;
		document.getElementById("nm").disabled=false;
		document.getElementById("picName").innerHTML=fileName[status];
		read(fileIndex[current]);
	}
	ansFlag=false;
}

function changeStatus(){
	if(document.getElementById("init").checked && document.getElementById("nm").checked)
		status=1;
	else if(document.getElementById("init").checked)
		status=2;
	else if(document.getElementById("nm").checked)
		status=3;
	else
		status=4;
	document.getElementById("picName").innerHTML=fileName[status];
	ansFlag=false;
	if(document.getElementById("init").checked)
		document.getElementById("initial").style.backgroundColor = "#66CCFF";
	else
		document.getElementById("initial").style.backgroundColor = "#c0c0c0";
	if(document.getElementById("nm").checked)
		document.getElementById("number").style.backgroundColor = "#66CCFF";
	else
		document.getElementById("number").style.backgroundColor = "#c0c0c0";
}

function showAns(){
	if(!reverseFlag){
		if(ansFlag){
			document.getElementById("picName").innerHTML=fileName[status];
		}else{
			document.getElementById("picName").innerHTML=fileName[0];
		}
	}else{
		if(ansFlag){
			document.getElementById("picture").src="./img/white.jpg";
		}else{
			read(fileIndex[current]);
		}
	}
	ansFlag=ansFlag?false:true;
}

function setName(n){
	var line="____"
	var tmp = n.split(/\./);
	var tmp2 = tmp[0].split(/\s|" "|_/);
	
	for(var i=0;i<6;i++)
		fileName[i]="";
  	
  	for(var i=0;i<tmp2.length;i++){
		if(tmp2[i].match(/[^\x01-\x7E]|[ -~]+/)){
			if(tmp2[i].charAt(0).match("#")){
				for(var j=0;j<5;j++){
					fileName[j]+=tmp2[i].substr(1);
					fileName[j]+=" ";
				}
			}else{
				fileName[0]+=tmp2[i]+" ";
			
				fileName[1]+=tmp2[i].charAt(0);
				fileName[1]+="<span style='letter-spacing:4px;'>";
				for(var j=0;j<tmp2[i].length-1;j++)
					fileName[1]+="_";		
				fileName[1]+="</span> ";
			
				fileName[2]+=tmp2[i].charAt(0);
				if(tmp2[i].length!=1)
					fileName[2]+=line;
				fileName[2]+=" ";
			
				fileName[3]+="<span style='letter-spacing:4px;'>_";
				for(var j=0;j<tmp2[i].length-1;j++)
					fileName[3]+="_";
				fileName[3]+="</span> ";
			
				fileName[4]+=line+" ";
			}
		}
	}	
	fileName[5] += fileName[0];
	if(fileName[0].length>25 && fileName[0].length<=30){
		for(var i=0;i<5;i++)
			fileName[i]="<span style='font-size: 35px;'>"+fileName[i]+"</span>";
	}else if(fileName[0].length>30 && fileName[0].length<=35){
		for(var i=0;i<5;i++)
			fileName[i]="<span style='font-size: 30px;'>"+fileName[i]+"</span>";
	}else if(fileName[0].length>35 && fileName[0].length<=40){
		for(var i=0;i<5;i++)
			fileName[i]="<span style='font-size: 25px;'>"+fileName[i]+"</span>";
	}else if(fileName[0].length>40){
		for(var i=0;i<5;i++)
			fileName[i]="<span style='font-size: 20px;'>"+fileName[i]+"</span>";
	}
}

function changeImg(n){
	document.getElementById("init").checked=false;
	document.getElementById("nm").checked = false;
	changeStatus();

	var x;
	switch(n){
		case 0:
			x=0;
			break;
		case 1:
			x = (current==0? 0 : current-1);
			break;
		case 2:
			x = (current==max-1? max-1:current+1);
			break;
		case 3:
			x=max-1;
			break;
	}

	if(current!=x){
		current=x;
		document.getElementById("counter").innerHTML=(current+1)+"/"+max;
		setName(fileList[fileIndex[current]].name);
		if(!reverseFlag){
			document.getElementById("picName").innerHTML=fileName[status];
			nameFlag=false;
			read(fileIndex[x]);
		}else{
			imgFlag=false;
			document.getElementById("picture").src="./img/white.jpg";
			document.getElementById("picName").innerHTML=fileName[0];
		}
		ansFlag=false;
	}
} 
 
function speak(){
	var voices = speechSynthesis.getVoices();
	var msg = new SpeechSynthesisUtterance();
	msg.voice = voices[document.getElementById("language").selectedIndex];
	msg.text = fileName[5];
	window.speechSynthesis.speak(msg);
}

