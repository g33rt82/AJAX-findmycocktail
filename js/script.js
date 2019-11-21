(async function () {
    const findCocktailsButton = document.getElementById("findCocktails");
    const requestRandomCocktail = document.getElementById("randomCocktail");
    const apiPath = "https://thecocktaildb.com/api/json/";
    const credentials = "v2/9973533";
    let queryString = "";
    let url = `${apiPath}${credentials}${queryString}`;

    //-------------filter by category--------------------------

    const categoryFilterList = "/list.php?c=list";
    url = `${apiPath}${credentials}${categoryFilterList}`;
    const categoryListResponse = await fetch(url);
    if (categoryListResponse.ok) {
        const categoryListJsonResponse = await categoryListResponse.json();

        function fillDataList() {
            const categoryFilterDropdown = document.getElementById('categoryFilterDropdown');
            let i = 0;
            const len = categoryListJsonResponse.drinks.length;
            const dl = document.createElement("datalist");

            dl.id = "categoryList";
            for (; i < len; i += 1) {
                let option = document.createElement('option');
                option.value = categoryListJsonResponse.drinks[i].strCategory;
                dl.appendChild(option);
            }
            categoryFilterDropdown.appendChild(dl);
        }

        fillDataList();

    }
//--------------search by Category------------------------------------------------------------
    findCocktailsButton.addEventListener("click", async function (event) {
        event.preventDefault();


        queryString = "/filter.php";
        let url = `${apiPath}${credentials}${queryString}`;


        try {
            const response = await fetch(url)

            if (response.ok) {
                console.log(response);
                const jsonResponse = await response.json();
                console.log(jsonResponse);
            }
        }
        catch (error) {
            console.log(error);
        }

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
