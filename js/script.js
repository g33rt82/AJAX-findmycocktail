(function () {
    const findCocktailsButton = document.getElementById("findCocktails");
    const requestRandomCocktail = document.getElementById("randomCocktail");
    const apiPath = "https://thecocktaildb.com/api/json/";
    const credentials = "v2/9973533";
    let queryString = "";
    let url = `${apiPath}${credentials}${queryString}`;
    const cocktailIngredients = document.querySelector(".random .ingredients ul");
    const categoryFilter = document.getElementById("categoryDropdown");
    const ingredientFilter = document.getElementById("ingredientDropdown");
    const alcoholicFilter = document.getElementById("alcoholDropdown");
    const searchResults = document.getElementsByClassName("searchResults");
    const searchResults1 = document.querySelector("#searchResults1 .row");
    const detailsButton = document.getElementsByClassName("rotate-btn");


    let addCounter = 1;


    //---definition of function to retrieve all option values for all datalists------

    const listBy = async someListFilter => {
        const queryString = `/list.php?${someListFilter}=list`;
        const url = `${apiPath}${credentials}${queryString}`;
        const response = await fetch(url);
        if (response.ok) {
            const jsonResponse = await response.json();
            console.log(jsonResponse);
            fillList(jsonResponse);
        }
    };

//----definition of function that fills the datalist with the data in the response from the fetch ----

    const fillList = jsonResponse => {
        const filterDropdown = document.getElementById(getHtmlElementForFilter(getFilterType(jsonResponse)));
        let i = 0;
        const len = jsonResponse.drinks.length;
        const dl = document.createElement("datalist");

        dl.id = getDatalistNameForFilter(getFilterType(jsonResponse));
        for (; i < len; i += 1) {
            let option = document.createElement('option');
            option.value = jsonResponse.drinks[i][`str${getString(jsonResponse)}`];
            dl.appendChild(option);
        }
        filterDropdown.appendChild(dl);
    };
//-----------------------------------------------------------------------------
    const getFilterType = jsonResponse => {
        const keys = Object.keys(jsonResponse.drinks[0]);
        const letter = keys[0].charAt(3).toLowerCase();
        switch (letter) {
            case "a" :
                return `alcohol`;
            case "c" :
                return "category";
            case "i":
                return "ingredient";
            default:
                return "glass"
        }
    };
    //----------------------------------------------------------------------
    const getString = jsonResponse => {
        const keys = Object.keys(jsonResponse.drinks[0]);
        const letter = keys[0].charAt(3).toLowerCase();
        switch (letter) {
            case "a" :
                return 'Alcoholic';
            case "c" :
                return 'Category';
            case "i" :
                return 'Ingredient1';
            default :
                return 'Glass';
        }
    };


    //--------------------------------------------------
    const getHtmlElementForFilter = filterString => {
        return `${filterString}Dropdown`
    };
    //------------------------------------------------------------------------------
    const getDatalistNameForFilter = filterString => {
        return `${filterString}List`
    };
//------------------------------------------------------------------------------------
    listBy("a");
    listBy("c");
    listBy("i");

//--------------------------------------------------------------------
    const wrapWithTag = (content, tag) => {
        return `<${tag}>${content}</${tag}>`
    };

    //------------------------------------------------------------
    const searchDrinksContainingIngredients = async () => {
        const queryString = `/filter.php?i=${generateIngredientsQueryString()}`;
        let url = `${apiPath}${credentials}${queryString}`;
        console.log(queryString);
        try {
            const response = await fetch(url);
            if (response.ok) {
                const jsonResponse = await response.json();
                if (Array.isArray(jsonResponse.drinks)) {
                    generateDrinks(jsonResponse,);
                }
                else {
                    searchResults1.innerHTML = "<strong>Sorry, no results with that combination</strong>";
                }
            }

        }
        catch (error) {
            console.log(error);
        }

    };
//----------------------------------------------------------------------
    const getIngredients = (jsonResponse, source) => {
        console.log("*************");
        console.log(source);
        const ingredientLocation = document.querySelector(`#${source}`);
        console.log(ingredientLocation);
        console.log("*************");

        let ingredients = [];
        let i = 1;
        console.log(`The source is ${source}`);
        do {
            const ingredientName = jsonResponse.drinks[0][`strIngredient${i}`];
            const ingredientMeasure = jsonResponse.drinks[0][`strMeasure${i}`];
            ingredients.push(`${ingredientMeasure} ${ingredientName}`);
            console.log(ingredients);
            i += 1;
        } while (jsonResponse.drinks[0][`strIngredient${i}`] !== null)

        if (source.includes("textBox")) {
            ingredients.forEach(ingredient => ingredientLocation.insertAdjacentHTML('beforeend', wrapWithTag(ingredient, 'li')));
        }
        else {
            ingredients.forEach(ingredient => cocktailIngredients.insertAdjacentHTML('beforeend', wrapWithTag(ingredient, 'li')));

        }


        ingredients = [];

    };
    //-------------------------------------------------------

//--------------------------------------------------------------------------
    const getIngredientId = async ingredient => {
        const formattedIngredient = await formatIngredient(ingredient);
        const queryString = `/filter.php?i=${formattedIngredient}`;
        const url = `${apiPath}${credentials}${queryString}`;
        const response = await fetch(url);
        if (response.ok) {
            const jsonResponse = await response.json();
            console.log(jsonResponse);
            return jsonResponse;
        }
    };
//-----------------------------------------------------------------------
    const formatIngredient = ingredient => {
        const formattedIngredient = ingredient.replace(/ /g, "_");
        return formattedIngredient;
    };

    //-----------EventHandler for detailsbutton in searchresults-------------------


//-------------------REQUEST A RANDOM COCKTAIL----------------------------------------------------------------------------
    requestRandomCocktail.addEventListener("click", async function (event) {
        const cocktailName = document.querySelector(".random .name");
        const cocktailImage = document.querySelector(".random img");
        const cocktailGlass = document.querySelector(".random .glass");
        const cocktailInstructions = document.querySelector(".random .instructions");
        const cocktailIngredients = document.querySelector(".random .ingredients ul");
        const source = event.target.id;
        cocktailIngredients.innerHTML = "";


        queryString = "/random.php";
        let url = `${apiPath}${credentials}${queryString}`;
        console.log(url);


        try {
            const response = await fetch(url);
            if (response.ok) {

                const jsonResponse = await response.json();
                const randomCocktailName = jsonResponse.drinks[0].strDrink;
                const randomCocktailImage = jsonResponse.drinks[0].strDrinkThumb;
                const randomCocktailInstructions = jsonResponse.drinks[0].strInstructions;
                const randomCocktailGlass = jsonResponse.drinks[0].strGlass;

                cocktailInstructions.innerText = randomCocktailInstructions;
                cocktailName.innerText = randomCocktailName;
                cocktailImage.src = randomCocktailImage;
                cocktailGlass.innerText = `for this cocktail you need a ${randomCocktailGlass}`;
                cocktailInstructions.innerText = `instructions: ${randomCocktailInstructions}`;
                getIngredients(jsonResponse, source);
            }
        }
        catch (error) {
            console.log(error);

        }


    });
//-------------Request results by filtering on ingredients-----------------------------------------------

    document.getElementById("search").addEventListener("click", function () {
        event.preventDefault();
        searchResults1.innerHTML = "";
        searchDrinksContainingIngredients();
    });


//---------------------eventHandeler for "add ..."buttons--------------------------

    document.getElementById("addIngredient").addEventListener("click", function () {
        event.preventDefault();
        const addButton = document.getElementById("addIngredient");
        addCounter += 1;
        const latestIngredientBox = document.getElementById("ingredientDropdown");
        const newIngredientBox = `<input class="ingredient" list="ingredientList">`;
        console.log(newIngredientBox);
        addButton.insertAdjacentHTML('beforebegin', newIngredientBox);

    });

//----------------------------------------------------------
    const generateDrinks = (jsonResponse) => {
        const drinks = jsonResponse.drinks;
        const template = document.getElementById("tpl-search");
        for (let i = 0; i < drinks.length; i++) {
            const drink = drinks[i];
            const clone = template.content.cloneNode(true);
            const name = clone.querySelector(".card-title");
            const cardTextBox = clone.querySelector(".card-text ul");
            cardTextBox.setAttribute("id", `textBox-${i + 1}`);
            console.log(name);
            const img = clone.querySelector("img");
            const button = clone.querySelector(".rotate-btn");
            name.innerText = drink.strDrink;
            img.src = drink.strDrinkThumb;
            button["drinkId"] = drink.idDrink;
            button["buttonId"] = `${i + 1}`;
            button["card"] = `card-${i + 1}`;
            searchResults1.appendChild(clone);
            const cardButtons = document.querySelectorAll(".rotate-btn");
            cardButtons.forEach(cardButton => cardButton.addEventListener("click", getDetailsFromId));

        }
    };
//--------------------------------------------------------------------------------------
    const getDetailsFromId = async e => {
        console.log(event.target.buttonId);
        console.log(event);
        const BoxToFill = `textBox-${event.target.buttonId}`;
        queryString = `/lookup.php?i=${e.target.drinkId}`;
        url = `${apiPath}${credentials}${queryString}`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                const jsonResponse = await response.json();
                console.log(jsonResponse);
                getIngredients(jsonResponse, BoxToFill);
            }
        }
        catch (error) {
            console.log(error);
        }

    };
    //--------------------------------------------------------


    const generateIngredientsQueryString = () => {
        const ingredientboxes = document.getElementsByClassName("ingredient");
        let results = [];
        for (const ingredientBox of ingredientboxes) {
            console.log(ingredientBox.value);
            results.push(ingredientBox.value);

        }
        const query = results.map(ingredient => formatIngredient(ingredient)).join();

        return query;
    };


})();
