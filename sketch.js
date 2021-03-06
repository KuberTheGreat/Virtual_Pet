// variable for the dog and its images
var dog, dog_image, dog_happy;

// variable for the database 
var database;

var readState;

// variable for the stock of the food
var foodStock;

// variable for the count or something of the food
var foodS = 20;

var foodObj;

// buttons section
var feedButton;
var addButton;

// section for the 3 spots
var bedroom, garden, washroom;

var currentTime;

var feedTime, lastFed;

var gameState = "Hungry";

// function to load images of the dog
function preload(){
	dog_image = loadImage("images/Dog.png");
	dog_happy = loadImage("images/happy dog.png");

	bedroom = loadImage("images/Bed Room.png");
	garden = loadImage("images/Garden.png");
	washroom = loadImage("images/Wash Room.png");
}

function setup() {
	createCanvas(500, 500);

	// creates the database
	// sets our database variable to the google's firebase (database)
	database = firebase.database();
	// setting the foodStock variable to the database's food which is initially 20
	foodStock = database.ref("Food");
	// looping the value till the user runs it
	foodStock.on("value", readStock);

	// creates the dog sprite
	dog = createSprite(250, 400, 50, 50);
	// adds the images to the dog
	dog.addImage("simple_dog", dog_image);
	dog.addImage("happy_dog", dog_happy)
	// scales the image down
	dog.scale = 0.2;

	foodObj = new Food();

	// creation of the buttons
	feedButton = createButton("Feed The Dog");
	feedButton.position(500, 100);
	feedButton.mousePressed(feedDog);

	addButton = createButton("Add Food");
	addButton.position(650, 100);
	addButton.mousePressed(addFood);

	// updates the database when the addButton or feedButton is pressed
	database.ref('/').update({
		Food:foodS
	}) 

	// reads the game state and sets the background accordingly
	readState = database.ref('gameState');
	readState.on("value", function(data){
		gameState = data.val();
	})

	// nothing worked so set a random number generator for the last feed
	// so changes the background accordingly
	lastFed = Math.round(random(1, 24));
}

function draw() {  
	background(46, 139, 87);		
	
	// if the stock of the milk bottles finishes
	// if the foodS decreases and becomes 0
	if(foodS === 0){
		// changes the image of the dog to simple or normal or sad whatever
		dog.changeAnimation("simple_dog", dog_image);
	}
	
	// sets the variable currentTime to realtime hour in 24 hour format
	currentTime = hour();

	// changing the background
	// according to your hints
	if(currentTime === (lastFed + 1)){
		update("Playing");
		foodObj.garden();
	}
	else if(currentTime === (lastFed + 2)){
		update("Sleeping");
		foodObj.bedroom();
	}
	else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
		update("Bathing");
		foodObj.washroom();
	}
	else{
		update("Hungry");
		foodObj.display();
	}

	// removes the button if the gamestate is anything b
	if(gameState !== "Hungry"){
		feedButton.hide();
		addButton.hide();
		dog.remove();
	}
	else{
		feedButton.show();
		addButton.show();
		dog.changeAnimation("simple_dog", dog_image);
		feedDog;
	}

	drawSprites();

	// text properties which i wont forget ever
	textSize(20);
	noStroke();
	fill(51);
	text("Feed Lala Milk!", 180, 30);

	text("Milk bottle remaining: " + foodS, 150, 100);

	if(lastFed <= 12){
		text("Last Fed: " + lastFed + "AM", 200, 130);
	}
	else{
		text("Last Fed: " + lastFed + "PM", 200, 130);
	}
}

// function to read the stocks at the database
// directly from the database which is initially 20
function readStock(data){
	// foodS is the initial value of the food from the database
	foodS = data.val();
}

// function to change or write the stocks at the database
// changes the stock as the user feeds the dog
function writeStock(x){
	// if the stock becomes 0 then x i.e. foodS becomes 0
	// NOTE: foodS becomes 0 because the parameter added to the function is foodS
	if(x <= 0){
		x = 0;
	}
	// else the foodS decreases gradually as the user feeds the dog
	else{
		x = x - 1;
	}

	// actual write code
	// these lines of code writes the changes in the database
	// decreases the food stock gradually
	database.ref("/").set({
		Food:x 
	})
}

// function to feed the dog when the feedButton is pressed
function feedDog(){
	// changes the dog animation to happy
	dog.changeAnimation("happy_dog", dog_happy);

	// writes the stock 
	// actually reduces it as the dog is fed
	writeStock(foodS);

	// updates the get food stock by reducing it by 1
	// in the foodObj update food stock method
	foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
	// updates the database to set the Food to the foodObj and get the stocks
	database.ref('/').update({
		Food:foodObj.getFoodStock()
	});
}

// function to add the food if the food/milk bottles are over
function addFood(){
	// increases the foodS as the addButton is pressed
	foodS++;

	// updates the database
	database.ref('/').update({
		Food:foodS
	})
}

function update(state){
	database.ref('/').update({
		gameState:state
	})
}