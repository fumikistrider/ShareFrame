// Share Canvas Server
let socket = io.connect();

let graphicBuffers = [];
let gb_width = 390;
let gb_height = 844;

// vars
let count = 0;
let hue = 0;
let r = 255;
let g = 255;
let b = 255;

// 波の高さ
let waveHeight = 0.1;

let HIGH_WAVE_COUNT = 15;

// Images
let img_wave;
let img_wavefollow;
let img_crab;
let img_crabrare;
let img_beach;

// Sprites
let spr_wave;
let spr_wavefollow;
// カニ
let spr_crabs;
// イラスト
let spr_illust

// 吹き出し画像の変数
let img_dekigoto1;
let img_dekigoto2;

let penWeight = 3;

// Animations
let img_crabs = [];
let img_crab_manju = [];
let img_wavefollows = [];

// 描画色の変数
let col = 'black';

let px;
let py;

// BGM
let bgm;

/////////////////////////////////////////////////////
//
function preload(){
	img_wave = loadImage('wave.png');
	img_wavefollow = loadImage('wave_follow_0.png');
	img_crab = loadImage('crab.png');
	img_crabrare = loadImage('crab_QR.png');

	img_beach =loadImage('beach.png');
	
	img_crabs[0] = loadImage('crab_0.png');
	img_crabs[1] = loadImage('crab_1.png');
	
	img_crab_manju[0] = loadImage('crab_manju_0.png');
	img_crab_manju[1] = loadImage('crab_manju_1.png');
	
	img_wavefollows[0] = loadImage('wave_follow_0.png');
	img_wavefollows[1] = loadImage('wave_follow_1.png');
	img_wavefollows[2] = loadImage('wave_follow_2.png');
	img_wavefollows[3] = loadImage('wave_follow_3.png');
	img_wavefollows[4] = loadImage('wave_follow_4.png');
	img_wavefollows[5] = loadImage('wave_follow_5.png');
	img_wavefollows[6] = loadImage('wave_follow_6.png');
	
	img_dekigoto1 = loadImage('dekigoto1.png');
	img_dekigoto2 = loadImage('dekigoto2.png');

	bgm = loadSound('bgm.mp3', mp3loaded);
	

}

function mp3loaded(){
	//bgm.loop();
}

/////////////////////////////////////////////////////
//
function setup() {
	print(socket);
	//bgm.loop();

	createCanvas(windowWidth, windowHeight);
	background(255);
	colorMode(RGB);

	print(windowWidth, windowHeight);
	// 参加を受信した
	socket.on('hello', someoneJoined);
	// 参加
    //socket.emit('hello', width, height);
	graphicBuffers[count] = createGraphics(gb_width, gb_height);

	// 描画を受信した
	socket.on('drawing', someoneIsDrawing);

	// 送信を受信した
	socket.on('buttonPressed', recvButtonPressed )

	// スプライト
	// 波
	spr_wave = new Sprite(img_wave, width / 2, -height * 0.75, img_wave.width, img_wave.height, 'none');
	//spr_wave.visible = false;
	//spr_wave.depth = 200;
	spr_wave.layer = 200;
	spr_wave.counter = 0;
	spr_wave.power = 0;
	spr_wave.crabcount = 0;
	spr_wave.magnification = 3.0;
	spr_wave.update = function(){
		let mov = sin(this.counter) * this.magnification;
		this.y += mov;
		this.counter++;

		if( this.counter === 180 && this.magnification == 9.0 ){

			print('remove illust');
			spr_illust.removeAll(); // イラスト消去
			// if( this.crabcount % 2 === 1 ){  // マンジュウガニ登場条件
			// 	let c = new Sprite(img_crabrare, random(width * 0.3, width * 0.7), random(height * 0.4, height * 0.6),'none');
			// 	c.addAnimation(img_crab_manju[0],img_crab_manju[1]);
			// 	c.moveTo( random(width * 0.3, width * 0.7), -100, random(0.40,1) );
			// 	c.frameDelay = 12;
			// 	c.scale = 0.05;
			// 	c.life = 1000;
			// 	//c.depth = 101;
			// 	c.layer = 101;
			// 	spr_crabs.add(c);
			// }
			// if( this.crabcount % 6 === 0){
			// 	let c = new Sprite(img_crabrare, random(width * 0.3, width * 0.7), random(height * 0.5, height * 0.8),'none');
			// 	c.scale = 0.15;
			// 	c.life = 3000;
			// 	//c.depth = 101;
			// 	c.layer = 101;
			// 	spr_crabs.add(c);
			// }
		}
		if( this.counter > 360 ){
			this.counter = 0;
			this.power++;
			this.crabcount++;
			if( this.power == HIGH_WAVE_COUNT ){
				this.magnification = 9.0;
				this.power = 0;
			}else{
				this.magnification = 3.0;
			}
			let rnd = random( width * 0.35, width * 0.65); // 次の波の横位置
			this.x = rnd;
			spr_wavefollow.x = rnd;
		}

	}
	// 波跡
	spr_wavefollow = new Sprite(img_wavefollow, width / 2, -height * 0.75, img_wavefollow.width, img_wavefollow.height, 'none');
	spr_wavefollow.addAnimation(img_wavefollows[0],img_wavefollows[1],img_wavefollows[2],img_wavefollows[3],img_wavefollows[4],img_wavefollows[5],img_wavefollows[6]);
	spr_wavefollow.animation.looping = false;
	spr_wavefollow.animation.frameDelay = 12;
	spr_wavefollow.animation.stop();
	//spr_wavefollow.depth = 100;
	spr_wavefollow.layer = 100;
	spr_wavefollow.counter = 0;
	spr_wavefollow.power = 0;
	spr_wavefollow.magnification = 2.0;
	spr_wavefollow.update = function(){

		if( this.counter === 180){
			if(this.magnification === 2.0){
					spr_wavefollow.animation.frameDelay = 24;
			}else{
					spr_wavefollow.animation.frameDelay = 24;
			}
			this.animation.play();
		}

		if( this.counter < 180 ){
			let mov = sin(this.counter) * this.magnification;
			this.y += mov;
		}else{

		}
		this.counter++;
		if( this.counter > 360 ){
			this.counter = 0;
			this.power++;
			this.animation.stop();
			this.animation.goToFrame(0);
			if( this.power == HIGH_WAVE_COUNT ){
				this.magnification = 9.0;
				this.power = 0;
			}else{
				this.magnification = 2.0;
			}
			//this.x = random( width * 0.2, width * 0.8);
			this.y = -height * 0.75;
		}
	}
	// spr_waveを非表示にする
	spr_wave.visible = false;
	// spr_wavefollowを非表示にする
	spr_wavefollow.visible = false;
	// カニ
	spr_crabs = new Group();
	spr_illust = new Group();

}

/////////////////////////////////////////////////////
//
function draw() {
	//background('white');
	// image(img_beach,0,0,width,height);
	// fill(255);

	// // カニ
	// if( frameCount % 500 == 0 ){
	// 	let c;
	// 	c = new Sprite(img_crab, -50, random(height * 0.4, height *0.9),'none');
	// 	c.addAnimation(img_crabs[0],img_crabs[1]);
	// 	c.frameDelay = 6;
	// 	c.moveTo( width + 100, random(height * 0.4, height *0.9), random(1,3) );
	// 	c.scale = 0.05;
	// 	c.life = 10000;
	// 	//c.depth = 101;
	// 	c.layer = 101;
	// 	//c.rotationSpeed = random(0.1, 0.8);
	// 	c.update = function(){
	// 		if( this.life % 60 == 0 ) this.rotationSpeed *= -1;
	// 	};
	// 	spr_crabs.add(c);
	// }
}


/////////////////////////////////////////////////////
//
function recvButtonPressed(){

	print('Button Pressed');
	let amount = 1;
	let dice = random(0,7);
	//if( dice < 1.0) amount = 3;

	// イラストスプライトを生成する
	for(let i = 0; i < amount; i++){
		let img = graphicBuffers[count];
		let col = count % 3;
		let s = new Sprite((width / 4) * random(0.8, 1.2) * (col + 1 + i) , height / 6 * random(2,5), img.width, img.height, 'none');
		let rot = random(-5, 5);
		s.rotation = rot;
		s.scale = 1.0;
		//if(dice > 6.0) s.scale *= 3;
		s.draw = function(){ // スプライトの描画をオーバーライド
			push();
			//scale(0.5);
			scale(this.scale);
			//  カードを描画する
			image(img_dekigoto1, 0, 0);
			scale(this.scale * 0.2);
			image(img, 0, 0);
			pop();
		}
		s.depth = count;

		spr_illust.add(s);
	}
	// 次のバッファを生成する
	count++;
	graphicBuffers[count] = createGraphics(gb_width, gb_height);
	graphicBuffers[count].colorMode(RGB,255);

}

/////////////////////////////////////////////////////
//
function someoneIsDrawing(x,y,rad){

	print('x:' + x + ' y:' + y + ' rad:' + rad);

	if(px === 0) px = x;
	if(py === 0) py = y;

	for(let i = 0 ; i < rad ; i++){

		r = constrain(random(r - 2, r + 2), 160, 180);
		g = constrain(random(g - 2, g + 2), 131, 151);
		b = constrain(random(b - 2, b + 2), 72, 92);

		graphicBuffers[count].push();
		graphicBuffers[count].noStroke();
		graphicBuffers[count].strokeWeight(penWeight * 3);
		//graphicBuffers[count].fill(r, g, b, 100);
		graphicBuffers[count].fill(0);
		//graphicBuffers[count].translate(x, y);
		//graphicBuffers[count].translate(random(x - 5, x + 5), random(y - 5, y + 5));
		//graphicBuffers[count].rotate(random(0, TWO_PI));
		//graphicBuffers[count].triangle(3,0,-3,0,0,3);
		graphicBuffers[count].ellipse(x, y, penWeight * 4, penWeight * 4);
		graphicBuffers[count].line(px, py, x, y);
		px = x;
		py = y;
		graphicBuffers[count].pop();
	}


}

/////////////////////////////////////////////////////
//
function someoneJoined(w, h){
print('New user joined' + ' - width:' + w + ' - height:' + h + ' - count:' + count);
	gb_width = w;
	gb_height = h;
	r = 170;
	g = 141;
	b = 82;
}

/////////////////////////////////////////////////////
//
function mouseDragged(){
	//　描画色を黒にする
	stroke(col);
	fill(col);
	strokeWeight(penWeight * 3);
	// マウスの座標に円を描く
	ellipse(mouseX, mouseY, penWeight, penWeight);
	// マウスの直前の座標に円を描く
	ellipse(pmouseX, pmouseY, penWeight, penWeight);

	line(pmouseX, pmouseY, mouseX, mouseY);
}

function mousePressed(){
}

function keyPressed(){
	if(keyCode === 80){
		bgm.loop();
	}
	else if(keyCode === 77){
		bgm.stop();
	}
	else if(keyCode === 32){
		recvButtonPressed();
	}
	else if(keyCode === 67){
		spr_illust.removeAll();
	}
	else if(keyCode === 49){
		col = 'black';
	}
	else if(keyCode === 50){
		col = 'red';
	}
	else if(keyCode === 51){
		col = 'yellow';
	}
	else if(keyCode === 52){
		col = 'blue';
	}
	else if(keyCode === 53){
		col = 'green';
	}


}
/////////////////////////////////////////////////////
//
function buttonPressed(){
	socket.emit('buttonPressed');
	background(255);
}
