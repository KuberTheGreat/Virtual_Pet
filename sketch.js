// variable for the dog and its images
var dog, dog_image, dog_happy;

// variable for the database 
var database;

// variable for the stock of the food
var foodStock;

// variable for the count or something of the food
var foodS = 20;

// function to load images of the dog
function preload(){
	dog_image = loadImage("images/Dog.png");
	dog_happy = loadImage("images/happydog.png");
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
}

function draw() {  
	background(46, 139, 87);

	// if the user wants to feed the dog
	// if the user presses the up arrow key
	if(keyWentDown(UP_ARROW)){
		// write stocks function is called and foodS parameter is added
		writeStock(foodS);
		// and also changes the image of the simple dog to happy dog
		dog.changeAnimation("happy_dog", dog_happy);
	}

	// if the stock of the milk bottles finishes
	// if the foodS decreases and becomes 0
	if(foodS === 0){
		// changes the image of the dog to simple or normal or sad whatever
		dog.changeAnimation("simple_dog", dog_image);
	}

	drawSprites();

	// text properties which i wont forget ever
	textSize(20);
	noStroke();
	fill(51);
	text("Note: Press Up Arrow key to feed Lala Milk!", 50, 30);

	text("Milk bottle remaining: " + foodS, 150, 100);
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