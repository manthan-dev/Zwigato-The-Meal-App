/**
 * This will ensures that a user always has a list of their favourite meals stored
 *  in the browser's local storage.
 */
if (localStorage.getItem("favouriteMealsList") == null) {
    localStorage.setItem("favouriteMealsList", JSON.stringify([]));
}


/**
 * we are defining an asynchronous function fetchMeals() that fetches meal data from
 * an external API and handles the asynchrnous nature of the network.
 */
async function fetchMeals(url, value) {
    const response = await fetch(`${url + value}`);
    const meals = await response.json();
    return meals;
}


/**
 * now, displayMeals() functions is also responsible for fetching and displaying the data
 * based on user search input.
 */
function displayMeals() {
    // searchInput will retrives the value entered by the user in search bar
    let searchInput = document.getElementById("search-input").value;

    // retrieving an array of mealIDs stored in the user's browser's local storage
    let arr = JSON.parse(localStorage.getItem("favouriteMealsList"));
    let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    let card = "";

    // here we are fetching data based on user Input using fetchMeals function
    let meals = fetchMeals(url, searchInput);
    meals.then(data => {
        if (data.meals) {
            data.meals.forEach((element) => {
                let flagFavourite = false;
                for (let index = 0; index < arr.length; index++) {
                    if (arr[index] == element.idMeal) {
                        flagFavourite = true;
                    }
                }

                /**
                 * this will generate HTML meal card based on user favourite meals show in main container and cart.
                 * if user click add button it will add meal card in cart items if not then this will use second card. 
                 */
                if (flagFavourite) {
                    card += `<div class="meal-card">
            <img src="${element.strMealThumb}" alt="meal-image">
            <button class="add-to-cart disliked-meal" id="main${element.idMeal}"
                onclick="addItemsToCart(${element.idMeal})">REMOVE</button>
            <div class="meal-card-body">
                <h5 class="meal-card-title">${element.strMeal}</h5>
                <div class="card-button">
                    <button type="button" class="more-details" onclick="showMealDetails(${element.idMeal})">More
                        Details</button>
                    <i class="fa-solid fa-chevron-right"></i>
                </div>
            </div>
        </div>`;
                } else {
                    // if user remove meal from cart this meal card will show up
                    card += `<div class="meal-card">
            <img src="${element.strMealThumb}" alt="meal-image">
            <button class="add-to-cart liked-meal" id="main${element.idMeal}"
                onclick="addItemsToCart(${element.idMeal})">ADD</button>
            <div class="meal-card-body">
                <h5 class="meal-card-title">${element.strMeal}</h5>
                <div class="card-button">
                    <button type="button" class="more-details" onclick="showMealDetails(${element.idMeal})">More Details</button>
                    <i class=" fa-solid fa-chevron-right"></i>
                </div>
            </div>
        </div>`;
                }
            });
        } else {

            // if no meal found in the list
            card += `<div class="no-meal-found">
            <p>No results for this Food</p>
        </div>`;
        }
        document.getElementById("main").innerHTML = card;
    });
}



/**
 * showMealDetails() function will display detailed information about that specifig meal which 
 * user want to see. here we will also use meal card to display meals .
 */
async function showMealDetails(id) {
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let card = "";
    await fetchMeals(url, id).then(data => {
        card += `<div class="meal-details-container">
            <div class="meal-title-and-category">
                <img src="${data.meals[0].strMealThumb}" alt="">
                <div class="card-title-and-category-name">
                    <h3>${data.meals[0].strMeal}</h3>
                    <h4>Category : ${data.meals[0].strCategory}</h4>
                    <h4>Area : ${data.meals[0].strArea}</h4>
                </div>
            </div>
            <div class="meal-preparation">
                <div class="youtube-guide">
                    <h5>Step-by-Step Guide</h5>
                    <button class="youtube-button"><a href="${data.meals[0].strYoutube}" target="_blank">
                            <i class="fa-brands fa-youtube fa-2xl"></i> YouTube
                            <sup>IN</sup>
                        </a></button>
                </div>
                <div class="instructions">
                    <h3>How to Make ${data.meals[0].strMeal}</h3>
                </div>
                <p class="recipe-steps">${data.meals[0].strInstructions}</p>
            </div>

        </div>`;
    });
    document.getElementById("main").innerHTML = card;
}


/**
 * displayFavouriteMeals() function is responsible for displaying a list of meals saved in 
 * cart. it will use fetchMeals() function to retreive meal data from external API.
 */
async function displayFavouriteMeals() {
    let arr = JSON.parse(localStorage.getItem("favouriteMealsList"));
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let card = "";

    /**
     * here we are handling empty cart if cart is empty it will show no items or card.
     */
    if (arr.length == 0) {
        card += `<div class="no-meal-found">
            <p>No Items in Cart</p>
        </div>`;
    } else {
        /**
         * Building Meal Card HTML if cart is not empty.
         */
        for (let index = 0; index < arr.length; index++) {
            await fetchMeals(url, arr[index]).then(data => {
                card += `<div class="favourite-item-in-card">
            <img src="${data.meals[0].strMealThumb}" alt="meal-image">
            <button class="add-to-cart disliked-meal" id="main${data.meals[0].idMeal}"
                onclick="addItemsToCart(${data.meals[0].idMeal})">REMOVE</button>
            <div class="meal-card-body">
                <h6 class="meal-card-title">${data.meals[0].strMeal}</h6>
                <div class="card-button">
                    <button type="button" class="more-details"
                        onclick="showMealDetails(${data.meals[0].idMeal})">More
                        Details</button>
                    <i class=" fa-solid fa-chevron-right"></i>
                </div>
            </div>
        </div>`;
            });
        }
    }

    /**
     * favourite-cart-container is a part of cart which display all the meals which are
     * added by user.
     */
    document.getElementById("favourite-cart-container").innerHTML = card;
}


/**
 * addItemsToCart() function is responsible for both addition and removal of meal from
 * Cart section as well as localStorage
 */
function addItemsToCart(id) {
    let arr = JSON.parse(localStorage.getItem("favouriteMealsList"));
    let contain = false;
    for (let index = 0; index < arr.length; index++) {
        if (id == arr[index]) {
            contain = true;
        }
    }

    /**
     * based on meal container true or false it will adding or removing the meal.
     */
    if (contain) {
        let number = arr.indexOf(id);
        arr.splice(number, 1);
        alert("Item Removed from Cart.");
    } else {
        arr.push(id);
        alert("Item Added to Cart. Click on Cart.");
    }
    localStorage.setItem("favouriteMealsList", JSON.stringify(arr));
    displayMeals();
    displayFavouriteMeals();
}