class Food{
    constructor(){
        // loads the milk bottle image
        this.image = loadImage("images/Milk.png");
    }

    display(){
        // variable for the x and y position of the bottle
        var x = 80, y = 100;

        imageMode(CENTER);
        image(this.image, 520, 220, 70, 70);

        // if the food stocks are not over
        // that is if the food is not finished and still remaining
        if(foodStock != 0){
            // loop to create the bottle every 10 pixel gap
            for(var i = 0; i < foodStock; i++){
                // actual 10 pixel gap code
                if(i % 10 === 0){
                    // then changes the x and y position of the bottle
                    x = 80;
                    y = y + 50;
                }

                image(this.image, x, y, 50, 50);
                x = x + 30;
            }
        }
    }

    // method to get the food stock from the database
    getFoodStock(){
        // a typical database reference code
        var FoodStockRef = database.ref('Food');
        FoodStockRef.on("value", function(data){
            foodStock = data.val();
        });
    }

    // method to update the food stock from the database
    updateFoodStock(stock){
        // again a typical database reference code
        database.ref('/').update({
            foodStock:stock
        })
    }

    // methods to add the background
    bedroom(){
        background(bedroom, 500, 500);
    }

    garden(){
        background(garden, 500, 500);
    }

    washroom(){
        background(washroom, 500, 500);
    }
}