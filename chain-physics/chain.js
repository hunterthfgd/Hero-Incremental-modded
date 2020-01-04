var then = Date.now(),
	start
var chain = [],
	CHAINS = 7,
	G = 9.81;

var bgImage = new Image(),
chainImage = new Image(),
flail = new Image();

//bgImage.src = "images/background.gif"
chainImage.src = "images/chain.gif"
flail.src = "images/flail.gif"


for(i=0;i<CHAINS;i++){
		
	chain[i] = {
		x: 200,
		y: 200,
		velY: 0,
		velX: 0,
		angVel: 0,
		
		angle: Math.PI/2,
		A: 1,
		
		move_x: 0,
		move_y: 0
	};
}

var main = function() {
	function createCanvas() {
		function moveImage(image, obj, ctx) {
			ctx.save();
				
			ctx.translate(obj.x, obj.y)
			ctx.rotate(obj.angle)
			
			
			var offset = 0
			if(image.height == 42){ offset = -image.height/2 }
			
			
			ctx.drawImage(image,-image.width/2, offset);
			
			ctx.restore();
		}
		
		var ctx = this.canvas.getContext("2d");
		ctx.clearRect(0, 0, 1000, 1500);
		//ctx.drawImage(bgImage, 0, 0)
		
		for(i=0; i<CHAINS; i++){
			moveImage(chainImage, chain[i], ctx)
			if(i == CHAINS - 1){
				moveImage(flail, chain[i], ctx)
			}
		}
	}

	function update(time) {
		chain[0].velY = -5
		for(i=0; i<CHAINS; i++){
			var posx = chain[0].x, 
				posy = chain[0].y;
			var torque, 
				extTorqueBelow = extTorqueAbove = 0
			
			chain[i].A -= .005*chain[i].A
			
			if(i != 0){
				extTorqueAbove = 2*Math.sin(chain[i].angle - chain[i-1].angle)	// Torque due to "upper" pull of chain
			}
			if(i != CHAINS - 1){
				extTorqueBelow = (CHAINS-i)*Math.sin(chain[i].angle - chain[i+1].angle)/2 // Torque due to "lower" pull of chain links at a right angle
			}

			torque = Math.sin(chain[i].angle) + extTorqueAbove + extTorqueBelow	// Individual torque due to grav: t = mg X r = mg*r*sin() = C*sin()
			chain[i].angVel += torque*time - chain[i].velY*Math.sin(chain[i].angle)/1000 - chain[i].velX*Math.cos(chain[i].angle)/1000
			chain[i].angle -= chain[i].angVel*time
			
			
			for(j=0; j<i; j++){
				posy += chainImage.height*Math.cos(chain[j].angle);
				posx -= chainImage.height*Math.sin(chain[j].angle);
			}
			chain[i].y = posy + chain[i].velY*time
			chain[i].x = posx + chain[i].velX*time
		}
	}
	
	var now = Date.now(),
		delta = (now - then)/1000;
		
	createCanvas();
	update(delta);
	
	then = now;
	
	window.requestAnimationFrame(main);
}

window.onload = function() {
	canvas = document.getElementById("cv");
	
	canvas.addEventListener('keyDown',(event) => {
		const keyName = event.key
		console.log(keyName)
		
		if(keyName == 'UP'){
			console.log(keyName)
			chain[0].y -= 10*time
		} else if(keyName == 'LEFT') {
			chain[0].x -= 10*time
		}
	});
	
	main();
}