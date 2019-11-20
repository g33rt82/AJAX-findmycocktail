(function () {

    const findCocktailsButton = document.getElementById("findCocktails");
    findCocktailsButton.addEventListener("click", async function (event) {
        event.preventDefault();

    try{
        console.log(event);
        const searchInput =  document.getElementById("ingredient_input");
        console.log(searchInput.value);
      //  const api_path = 'https://the-cocktail-db.p.rapidapi.com';
        const rapidApiHost = "the-cocktail-db.p.rapidapi.com";
        const rapidApiKey = "e1dea69240mshe0e612e627629aap126f2bjsn22af8b49f154";
        const queryString = `i=${searchInput.value}`;
       // const url = `https://${rapidApiHost}/filter.php?${queryString}`;
        const url = `https://${rapidApiHost}/random.php`;
        console.log(url);
        const response = await fetch(url, {
            method: "GET",
            headers: {"x-rapidapi-host": rapidApiHost, "x-rapidapi-key": rapidApiKey}
        });

        if (response.ok){
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
    })


})();
