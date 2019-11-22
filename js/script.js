( function () {
    const findCocktailsButton = document.getElementById("findCocktails");
    const requestRandomCocktail = document.getElementById("randomCocktail");
    const apiPath = "https://thecocktaildb.com/api/json/";
    const credentials = "v2/9973533";
    let queryString = "";
    let url = `${apiPath}${credentials}${queryString}`;


 //---definition of function to retrieve all option values for all datalists------

    const listBy = async someListFilter => {
        const queryString = `/list.php?${someListFilter}=list`;
        const url = `${apiPath}${credentials}${queryString}`;
        const response = await fetch(url);
        if (response.ok) {
            const jsonResponse = await response.json();
            fillList(jsonResponse)
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
       switch(letter) {
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
 const getHtmlElementForFilter = filterString => {return `${filterString}Dropdown`};
 //------------------------------------------------------------------------------
const getDatalistNameForFilter = filterString => {return `${filterString}List`};
//------------------------------------------------------------------------------------
  listBy("a");
  listBy("c");
  listBy("i");
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
