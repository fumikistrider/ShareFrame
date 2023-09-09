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

	allSprites.autoDraw = false;
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
			scale(this.scale * 0.25);
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

	for(let i = 0 ; i < rad ; i++){

		r = constrain(random(r - 2, r + 2), 160, 180);
		g = constrain(random(g - 2, g + 2), 131, 151);
		b = constrain(random(b - 2, b + 2), 72, 92);

		graphicBuffers[count].push();
		graphicBuffers[count].noStroke();
		graphicBuffers[count].strokeWeight(1);
		//graphicBuffers[count].fill(r, g, b, 100);
		graphicBuffers[count].fill(0);
		//graphicBuffers[count].translate(x, y);
		graphicBuffers[count].translate(random(x - 3, x + 3), random(y - 3, y + 3));
		//graphicBuffers[count].rotate(random(0, TWO_PI));
		//graphicBuffers[count].triangle(3,0,-3,0,0,3);
		graphicBuffers[count].ellipse(x, y, penWeight*2, penWeight*2);
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
	fill(0);
	// マウスの座標に円を描く
	ellipse(mouseX, mouseY, penWeight, penWeight);
	// マウスの直前の座標に円を描く
	ellipse(pmouseX, pmouseY, penWeight, penWeight);
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
	
}
/////////////////////////////////////////////////////
//
function buttonPressed(){
	socket.emit('buttonPressed');
	background(255);
}
