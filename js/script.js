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
    const searchResults1 = document.getElementById("searchResults1");

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
//----------------------------------------------------------------------
    const getIngredients = jsonResponse => {
        let ingredients = [];
        let i = 1;

        do {
            const ingredientName = jsonResponse.drinks[0][`strIngredient${i}`];
            const ingredientMeasure = jsonResponse.drinks[0][`strMeasure${i}`];
            ingredients.push(`${ingredientMeasure} ${ingredientName}`);
            console.log(ingredients);
            i += 1;
        } while (jsonResponse.drinks[0][`strIngredient${i}`] !== null)

        ingredients.forEach(ingredient => cocktailIngredients.insertAdjacentHTML('beforeend', wrapWithTag(ingredient, 'li')));
        ingredients = [];

    };
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
    }


//-------------------REQUEST A RANDOM COCKTAIL----------------------------------------------------------------------------
    requestRandomCocktail.addEventListener("click", async function () {
        const cocktailName = document.querySelector(".random .name");
        const cocktailImage = document.querySelector(".random img");
        const cocktailGlass = document.querySelector(".random .glass");
        const cocktailInstructions = document.querySelector(".random .instructions");
        const cocktailIngredients = document.querySelector(".random .ingredients ul");
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
                getIngredients(jsonResponse);
            }
        }
        catch (error) {
            console.log(error);

        }


    });
//-------------Request results by filtering----------------------------------------------------

    document.getElementById("search").addEventListener("click", function () {
        event.preventDefault();
        getDrinksContainingIngredients();
    });

//---------------------eventHandeler for "add ..."buttons--------------------------

    document.getElementById("addIngredient").addEventListener("click", function () {
        event.preventDefault();
        const addButton = document.getElementById("addIngredient");
        addCounter += 1;
        const latestIngredientBox = document.getElementById("ingredientDropdown");
        const newIngredientBox = `<input class="ingredient">`;
        console.log(newIngredientBox);
        addButton.insertAdjacentHTML('beforebegin', newIngredientBox);

    });
//----------------------------------------------------------
    const generateDrinks = jsonResponse => {
        const drinks= jsonResponse.drinks;
        const template = document.getElementById("tpl-search");
        for(let i=0; i< drinks.length; i++){
            const drink = drinks[i];
            const clone = template.content.cloneNode(true);
            const name = clone.querySelector("h2");
            const img = clone.querySelector("img");
            const button = clone.querySelector("button");
            name.innerText = drink.strDrink;
            img.src = drink.strDrinkThumb;
            button["drinkId"] = drink.idDrink;
            searchResults1.appendChild(clone);
        }

    } ;
    //--------------------------------------------------------
    const displayResults = jsonResponse => {
        generateDrinks(jsonResponse);
    };
//--------------------------------------------------------

    const generateIngredientsQueryString = () => {
        const ingredientboxes = document.getElementsByClassName("ingredient");
        results = [];
        for (const ingredientBox of ingredientboxes) {
            console.log(ingredientBox.value);
            results.push(ingredientBox.value);

        }
        const query = results.map(ingredient => formatIngredient(ingredient)).join();

        return query;
    };
    //------------------------------------------------------------
    const getDrinksContainingIngredients = async () => {
        const queryString = `/filter.php?i=${generateIngredientsQueryString()}`;

        let url = `${apiPath}${credentials}${queryString}`;
        console.log(queryString);
        try {
            const response = await fetch(url);
            if (response.ok) {
                const jsonResponse = await response.json();
                displayResults(jsonResponse);
            }

        }
        catch (error) {
            console.log(error);
        }

    }

})();
