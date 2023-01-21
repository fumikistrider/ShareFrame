// Share Canvas
let socket = io.connect('http://35.78.87.163:3000');
let graphicBuffers = [];
let gb_width = 390;
let gb_height = 844;

// vars
let count = 0;
let hue = 0;
let penWeight = 1.5;

// UI
let button;
let btn_send;
let btn_erase;
let btn_pen1;
let btn_pen2;

// Images
let img_bg;
let img_title;
let img_send;
let img_erase;

// Sprites

/////////////////////////////////////////////////////
//
function preload(){
	img_bg = loadImage('sp_bg.png');
	img_title = loadImage('sp_title.png');
}

/////////////////////////////////////////////////////
//
function setup() {
	print(socket);
  createCanvas(windowWidth, windowHeight);
  background(img_bg);
	colorMode(HSB,100,100,100,100);

	// 参加
  socket.emit('hello', width, height);
	graphicBuffers[count] = createGraphics(gb_width, gb_height);

	// UI
	btn_send = createImg('sp_btn_send.png','送信する');
	btn_send.size(220,100);
	btn_send.position(width * 0.20, height * 0.80);
	btn_send.mouseReleased(buttonPressed);
	
	btn_erase = createImg('sp_btn_erase.png','消す');
	btn_erase.size(54,36);
	btn_erase.position(width * 0.05, height * 0.85);
	btn_erase.mouseReleased(erasePressed);
	
	btn_pen1 = createImg('pen1.png','ペン1');
	btn_pen1.size(40,80);
	btn_pen1.position(width * 0.70, height * 0.70);
	btn_pen1.mouseReleased(pen1Pressed);

	btn_pen2 = createImg('pen2.png','ペン2');
	btn_pen2.size(20,40);
	btn_pen2.position(width * 0.85, height * 0.75);
	btn_pen2.mouseReleased(pen2Pressed);
	
	
}

function pen1Pressed(){
	btn_pen1.size(40,80);
	btn_pen1.position(width * 0.70, height * 0.70);
	btn_pen2.size(20,40);
	btn_pen2.position(width * 0.85, height * 0.75);
	penWeight = 1.5;
}

function pen2Pressed(){
	btn_pen1.size(20,40);
	btn_pen1.position(width * 0.70, height * 0.75);
	btn_pen2.size(40,80);
	btn_pen2.position(width * 0.85, height * 0.70);
	penWeight = 5;
}

/////////////////////////////////////////////////////
//
function draw() {
	
	noStroke();
	fill(30,30,30,90);
	push();
	translate(width/2,height*0.07);
	scale(0.8);
	imageMode(CENTER);
	image(img_title,0,0);
	pop();
	
}

function touchMoved() {
	if( mouseX < (width * 0.1) || (width * 0.9) < mouseX ) return;
	if( mouseY < (height * 0.175) || (height * 0.725) < mouseY ) return;	
	var radius = Math.abs(mouseX-pmouseX) + Math.abs(mouseY-pmouseY);	
	//ellipse(mouseX, mouseY, radius, radius);
	stroke(30,30,30,90);
	strokeWeight(penWeight);
	line(pmouseX,pmouseY,mouseX,mouseY);
	socket.emit('drawing',mouseX, mouseY,radius);
}

/////////////////////////////////////////////////////
//
function buttonPressed(){
	socket.emit('buttonPressed');
  background(img_bg);
}

function erasePressed(){
	background(img_bg);
}

/////////////////////////////////////////////////////
//
function mousePressed(){
  socket.emit('hello', width, height);
}