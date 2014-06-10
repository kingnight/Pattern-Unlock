var lock = function(){
	// =================================================
	// = Private variables (example: var _foo = bar; ) =
	// =================================================

	var _setPatternSuccCb;
    var _setPatternFailCb;
    var _checkPatternCb;
	
	// =================================================
	// = public functions                              =
	// =================================================

	var patternlock = {

		isdrawing: false,
		from: "",
		to: "",
		inputbox: "",//first time set lock code saved
		repeatInputbox:"",//second time set lock code saved
		startbutton: 0,
		unlockPattern: '',//saved pattern lock code
		isSetLock:false,  //set lock or unlock
        time:0,//need 2 times same check
			
		/*init: function(setPassword, parentElement, callback){
			patternlock.unlockPattern = setPassword;
			_setPatternCallback = callback;
			patternlock.generate(parentElement);
		},*/
		
	    init: function(parentElement,callback){
			//patternlock.unlockPattern = setPassword;
			//_setPatternCallback = callback;
			patternlock.generate(parentElement);

            $(parentElement).on('mouseup', function() {
                patternlock.buttontouchend();
            });

            if(typeof callback==='function')
                callback();
		},
	
		generate: function(parentElement){
			var $form = '<form method="post" id="lock_container"><input type="text" id="patternlockpwd" name="password" class="patternlock" /><input type="text" id="repeatpwd" name="password" class="patternlock" /></form>';
			$(parentElement).append($form);
			var el = document.getElementById('patternlockpwd');
			this.inputbox = el;
            el.style.display = 'none';

            var repeatel = document.getElementById('repeatpwd');
			this.repeatInputbox = repeatel;
            repeatel.style.display = 'none';

			var pel = el.parentNode;
			
			// main container
			var patternTag = document.createElement("div");
		    patternTag.className = "patternlockcontainer";
			
			
			// horizontal lines
			var linesTag = document.createElement("div");
			linesTag.className = "patternlocklineshorizontalcontainer";
			var elid=["12","23","45","56","78","89"];
			for (var i=0;i<6;i++){
				var lineTag = document.createElement("div");
				lineTag.className = "patternlocklinehorizontal";
				lineTag.id = "line" + elid[i];
				linesTag.appendChild(lineTag);
			}
			patternTag.appendChild(linesTag);
			
			// vertical lines
			var linesTag = document.createElement("div");
			linesTag.className = "patternlocklinesverticalcontainer";
			var elid=["14","25","36","47","58","69"];
			for (var i=0;i<6;i++){
				var lineTag = document.createElement("div");
				lineTag.className = "patternlocklinevertical";
				lineTag.id = "line" + elid[i];
				linesTag.appendChild(lineTag);
			}
			patternTag.appendChild(linesTag);
			
			// diagonal lines
			var linesTag = document.createElement("div");
			linesTag.className = "patternlocklinesdiagonalcontainer";
			var elid=["24","35","57","68"];
			for (var i=0;i<4;i++){
				var lineTag = document.createElement("div");
				lineTag.className = "patternlocklinediagonalforward";
				lineTag.id = "line" + elid[i];
				linesTag.appendChild(lineTag);
			}
			patternTag.appendChild(linesTag);
			var linesTag = document.createElement("div");
			var elid=["15","26","48","59"];
			linesTag.className = "patternlocklinesdiagonalcontainer";
			for (var i=0;i<4;i++){
				var lineTag = document.createElement("div");
				lineTag.className = "patternlocklinediagonalbackwards";
				lineTag.id = "line" + elid[i];
				linesTag.appendChild(lineTag);
			}
			patternTag.appendChild(linesTag);
			
			
			// the 9 buttons
			var buttonsTag = document.createElement("div");
			buttonsTag.className = "patternlockbuttoncontainer";
			for (var i=1;i<10;i++){
				var buttonTag = document.createElement("div");
				buttonTag.className = "patternlockbutton";
				buttonTag.id = "patternlockbutton" + i;
				buttonTag.onmousedown = function(e){
					if (!e){
						var e = window.event;
					}else{
						e.preventDefault();
					}
					patternlock.buttontouchstart(this)
				};
				buttonTag.ontouchstart = function(e){
					if (!e) var e = window.event;
					e.preventDefault();
					patternlock.buttontouchstart(this)
				}; 
				buttonTag.onmouseover = function(){patternlock.buttontouchover(this)};
				buttonTag.ontouchmove = patternlock.buttontouchmove;
				buttonTag.onmouseup = function(){patternlock.buttontouchend(this)}; 
				buttonTag.ontouchend = function(){patternlock.buttontouchend(this)}; 
				buttonsTag.appendChild(buttonTag);
			}
			patternTag.appendChild(buttonsTag);
			
			// stupid preloader for the hover images
			var imgTag = document.createElement("div");
			imgTag.style.display = 'none';
			imgTag.className = "patternlockbutton touched";
			patternTag.appendChild(imgTag);
			var imgTag = document.createElement("div");
			imgTag.style.display = 'none';
			imgTag.className = "patternlockbutton touched multiple";
			patternTag.appendChild(imgTag);
			
			
		    pel.appendChild(patternTag);
		},

        setInputBoxValue:function(val){
            if(patternlock.isSetLock && patternlock.time==0)
                patternlock.inputbox.value += val;
            else if(patternlock.isSetLock && patternlock.time==1)
                patternlock.repeatInputbox.value += val;
            else
                patternlock.inputbox.value += val;
        },

        clearInputBox:function(){
            patternlock.inputbox.value="";
            patternlock.repeatInputbox.value="";
        },

		buttontouchstart:function(b){
			patternlock.isdrawing = true;
			b.className = "patternlockbutton touched";
			patternlock.from = "";
			patternlock.to = b.id.split("patternlockbutton").join("");

            patternlock.setInputBoxValue(patternlock.to);

			this.startbutton = patternlock.to;
			return false;
		},

		buttontouchover:function(b){
			if (patternlock.isdrawing){
				var thisbutton = b.id.split("patternlockbutton").join("");
				
				if(thisbutton != patternlock.to){ // touching the same button twice in a row is not allowed (should it ?)
				
					var cn = b.className;
					if(cn.indexOf('touched')<0){
						b.className = "patternlockbutton touched"
					}else{
						b.className = "patternlockbutton touched multiple"
					}
				
					patternlock.from = patternlock.to;
					patternlock.to = thisbutton;
					
					//update input value
					//this.inputbox.value += patternlock.to;
                    patternlock.setInputBoxValue(patternlock.to);

					// display line between 2 buttons 
					var thisline = document.getElementById("line" + patternlock.from + patternlock.to);
					if (patternlock.to <  patternlock.from){
						thisline = document.getElementById("line" + patternlock.to + patternlock.from);
					}
					if (thisline){
						thisline.style.visibility = 'visible';
					}	
				}				
			}
			return(false)
		},

		buttontouchmove:function(e){
			if(e.touches.length == 1){
				var touch = e.touches[0];
							
				// find position relative to first button
				var b1 = document.getElementById("patternlockbutton1");
				var b2 = document.getElementById("patternlockbutton2");
				var p = _findPos(b1);
				var p2 = _findPos(b2);
				var cox = parseInt(touch.pageX) - parseInt(p[0])
				var coy = parseInt(touch.pageY) - parseInt(p[1])
				var gridsize =  p2[0] - p[0] // bit stupid no ?
				
			
				// on what button are we over now?
				// grid 3x3 to sequential nummber
				var buttonnr = Math.min(2,Math.max(0,Math.floor(cox/gridsize))) + (Math.min(2,Math.max(0,Math.floor(coy/gridsize)))*3) + 1;
								
				if (buttonnr != patternlock.to){
					// only trigger if the touch is near the middle of the button
					// otherwise diagonal moves are impossible
					var distancex = (cox % gridsize);
					var distancey = (coy % gridsize);
					if ((distancex< (gridsize/2)) && (distancey < (gridsize/2))){
						// we're over a new button
						var newbutton = document.getElementById("patternlockbutton" + buttonnr)
						patternlock.buttontouchover(newbutton);
					}			
				}
			}
		},

		buttontouchend: function(b) {
			if (patternlock.isdrawing){
				patternlock.isdrawing = false;
				if (!patternlock.isSetLock) {//unlock pattern
                    _resetButtons();
                    if(_checkPattern()){
                        console.log("lock success");
                        patternlock.clearInputBox();
                        _checkPatternCb();
                    }

				}
				else if(patternlock.isSetLock){ //set pattern
                    if(patternlock.time<1){ //first time set
                        patternlock.time++;
                        console.log("first");
                        _resetButtons();
                    }
                    else{
                        patternlock.isSetLock=false;
                        //compare twice times pattern lock is same?
                        var ele1=document.getElementById("patternlockpwd");
                        var ele2=document.getElementById("repeatpwd");
                        if(ele1.value===ele2.value){ //same
                            console.log("same");
                            patternlock.unlockPattern=ele1.value;
                            _resetButtons();
                            patternlock.clearInputBox();
                            _setPatternSuccCb(); //call success callback
                        }
                        else{ //reset pattern lock, counter clear
                            patternlock.isSetLock=true;
                            patternlock.time=0;
                            _resetButtons();
                            patternlock.clearInputBox();
                            _setPatternFailCb();
                        }
                    }


				}
			}
			return(false)		
		},
			
		attach: function(target, functionref, tasktype) { 
			var tasktype=(window.addEventListener)? tasktype : "on"+tasktype
			if (target.addEventListener)
				target.addEventListener(tasktype, functionref, false)
			else if (target.attachEvent)
				target.attachEvent(tasktype, functionref)
		},

        setPattern:function(succCallback,failCallback){
            patternlock.isSetLock=true;
            //console.log(typeof(callback));
            typeof(succCallback)==="function"? _setPatternSuccCb=succCallback : _setPatternSuccCb=function(){console.log("error");};
            typeof(failCallback)==="function"? _setPatternFailCb=failCallback : _setPatternFailCb=function(){console.log("error");};
        },

        lockPattern:function(callback){
            patternlock.isSetLock=false;
            //console.log(typeof(callback));
            if(typeof(callback)==="function")
                _checkPatternCb=callback;
        }

	};
	
	return patternlock;
	
	// ================================================
	// = Private functionse (function _private() {} ) =
	// ================================================

    // one helper function to find the absolute position of an element
    function _findPos(obj) {
        var curleft = curtop = 0;
        if (obj.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            return [curleft,curtop];
        }
    }

    function _checkPattern(){
        var patternAttempt = $("#patternlockpwd").val();
        console.log("patternAttempt"+patternAttempt);
        console.log("unlockPattern"+patternlock.unlockPattern);
        if (patternAttempt === patternlock.unlockPattern) {
            return true;
        } else {
            _resetButtons();
            patternAttempt = '';
            $("#patternlockpwd").val = '';
            return false;
        }
    }

    function _resetButtons() {
        $(".patternlocklinehorizontal").css('visibility', 'hidden');
        $(".patternlocklinevertical").css('visibility', 'hidden');
        $(".patternlocklinediagonalforward").css('visibility', 'hidden');
        $(".patternlocklinediagonalbackwards").css('visibility', 'hidden');
        $('.patternlockbutton').attr('class', 'patternlockbutton');
    }
}();


			


