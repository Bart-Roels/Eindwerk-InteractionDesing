let rawIngredinetsList;

checkAlcohol = (drink, ingredientsCocktail) => {
  // Make list of alcohol ingredients
  let alcoholList = [];
  // For evry item in json list check if it is in ingredients list of drink
  for (var i = 0; i < rawIngredinetsList['ingredients'].length; i++) {
    // If item is in list
    if (ingredientsCocktail.includes(rawIngredinetsList['ingredients'][i]['strIngredient'])) {
      // If alcohol is true of contain in title words as wodka or vodka
      if (rawIngredinetsList['ingredients'][i]['Alcoholic'] == 1) {
        // Add to alcohol list
        alcoholList.push(rawIngredinetsList['ingredients'][i]['strIngredient']);
      }
    }
  }
  return alcoholList;
};

listenToCard = () => {
  const buttons = document.querySelectorAll('.js-button');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', (e) => {
      // Get data-id from card
      const id = e.currentTarget.getAttribute('data-id');
      console.log(e.target);
      console.log(id);

      
    });
  }

}

showResult = async (data) => {
  for (var i = 0; i < 9; i++) {
    // Define drink
    let drink = data.drinks[i];

    // Get dom elements
    const foto = document.querySelector(`.js-foto${i}`);
    // Set photo url from API as src
    foto.src = drink.strDrinkThumb;
    // Set alt
    foto.alt = drink.strDrink;

    // Get name element
    const name = document.querySelector(`.js-naam${i}`);
    // Set name from API as text
    name.innerHTML = drink.strDrink;

    // Get card and set data attribute
    const card = document.querySelector(`.js-card${i}`);
    card.setAttribute('data-id', drink.idDrink);


    // Visualize alcohol

    // Get all ingredients
    // Make list of all ingredients in drink
    let ingredientsCocktail = [];
    for (var a = 1; a < 16; a++) {
      if (drink[`strIngredient${a}`] != null) {
        ingredientsCocktail.push(drink[`strIngredient${a}`]);
      }
    }

    // Get list of alcohol ingredients
    let array = checkAlcohol(drink, ingredientsCocktail);

    // Compare in %
    let percentage = (array.length / ingredientsCocktail.length) * 100;

    console.log(`Name => ${drink.strDrink}\nIngredienten => ${ingredientsCocktail}\nAlcohol => ${array}\nPercentage => ${percentage}`);
  }
};

getIngredientData = async (url) => {
  return fetch('script/ingredients.json')
    .then((response) => response.json())
    .catch((error) => console.error(error));
};

getData = async (url) => {
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
};

let getAPI = async (lat, lon) => {
  // build the url
  url = `https://www.thecocktaildb.com/api/json/v2/9973533/randomselection.php`;
  // Get data from API
  const data = await getData(url);
  // Get ingredients
  rawIngredinetsList = await getIngredientData();

  // If data is not empty
  if (data.drinks) {
    // Call show function
    showResult(data);
  }
};

document.addEventListener('DOMContentLoaded', function () {
  // Get date from api
  getAPI();
  listenToCard();
});
