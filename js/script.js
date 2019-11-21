(function () {
    const findCocktailsButton = document.getElementById("findCocktails");
    const requestRandomCocktail = document.getElementById("randomCocktail");
    const apiPath = "https://thecocktaildb.com/api/json/";
    const credentials = "v2/9973533";
    let queryString = "";
    let url = `${apiPath}${credentials}${queryString}`;

//--------------search cocktails ingredients------------------------------------------------------------
    findCocktailsButton.addEventListener("click", async function (event) {
        event.preventDefault();

        try {
            console.log(event);
            const searchInput = document.getElementById("ingredient_input");
            console.log(searchInput.value);
            //  const api_path = 'https://the-cocktail-db.p.rapidapi.com';

            const queryString = `i=${searchInput.value}`;
            // const url = `https://${rapidApiHost}/filter.php?${queryString}`;
            const url = `https://${rapidApiHost}/filter.php?c=cocktail`;
            console.log(url);
            const response = await fetch(url, {
                method: "GET",
                headers: {"x-rapidapi-host": rapidApiHost, "x-rapidapi-key": rapidApiKey}
            });

            if (response.ok) {
                console.log(response);
                const jsonResponse = await response.json();
                console.log(jsonResponse);
            }
        }
        catch (error) {
            console.log(error);
        }

        //  fetch("https://the-cocktail-db.p.rapidapi.com/list.php?a=list", {
        //    "method": "GET",
        //  "headers": {
        //    "x-rapidapi-host": "the-cocktail-db.p.rapidapi.com",
        //  "x-rapidapi-key": "e1dea69240mshe0e612e627629aap126f2bjsn22af8b49f154"
        //   }
    });
//-------------------REQUEST A RANDOM COCKTAIL----------------------------------------------------------------------------
    requestRandomCocktail.addEventListener("click", async function () {
        const cocktailName = document.querySelector(".random .name");
        const cocktailImage = document.querySelector(".random img");
        const cocktailGlass = document.querySelector(".random .glass");
        const cocktailInstructions = document.querySelector(".random .instructions");
        const cocktailIngredients = document.querySelector(".random .ingredients ul");
        cocktailIngredients.innerHTML = "";
        let ingredients = [];

        console.log("---------------");
        console.log(cocktailIngredients);
        console.log("---------------");
        queryString = "/random.php";
        let url = `${apiPath}${credentials}${queryString}`;
        console.log(url);

        const getIngredients = jsonResponse => {

            let i = 1;
            do {
                ingredients.push(jsonResponse.drinks[0][`strIngredient${i}`]);
                i += 1;
            } while (jsonResponse.drinks[0][`strIngredient${i}`] !== null)

            console.log(ingredients);
            const wrapWithTag = (content, tag) => {
                return `<${tag}>${content}</${tag}>`
            };
            ingredients.forEach(ingredient => cocktailIngredients.insertAdjacentHTML('beforeend', wrapWithTag(ingredient, 'li')));
            ingredients = [];
            console.log(ingredients);

        };

        try {
            const response = await fetch(url);
            if (response.ok) {
                console.log(response);
                const jsonResponse = await response.json();
                console.log(jsonResponse);
                const randomCocktailName = jsonResponse.drinks[0].strDrink;
                console.log(randomCocktailName);
                const randomCocktailImage = jsonResponse.drinks[0].strDrinkThumb;
                console.log(randomCocktailImage);
                const randomCocktailInstructions = jsonResponse.drinks[0].strInstructions;
                console.log(randomCocktailInstructions);
                const randomCocktailGlass = jsonResponse.drinks[0].strGlass;
                console.log(randomCocktailGlass);
                getIngredients(jsonResponse);
                cocktailInstructions.innerText = randomCocktailInstructions;
                cocktailName.innerText = randomCocktailName;
                cocktailImage.src = randomCocktailImage;
                cocktailGlass.innerText = `for this cocktail you need a ${randomCocktailGlass}`;
                cocktailInstructions.innerText = `instructions: ${randomCocktailInstructions}`;

            }
        }
        catch (error) {
            console.log(error);

        }


    });
//-------------Request a cocktail by ingredient(s)----------------------------------------------------


})();
