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

listenToClose = (modal) => {
  // Listen to close button
  const closeButton = document.querySelector('.js-modal-close');
  closeButton.addEventListener('click', () => {
    modal.classList.remove('is-visible');
    // Remove overflow hidden to body
    document.body.classList.remove('u-model-overflow');
  });

  // Listen to close button or click outside modal
  const modalContainer = document.querySelector('.js-modal');
  modalContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('js-modal')) {
      modal.classList.remove('is-visible');
      // Remove overflow hidden to body
      document.body.classList.remove('u-model-overflow');
    }
  });

  // Listen to esc key
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
      modal.classList.remove('is-visible');
      // Remove overflow hidden to body
      document.body.classList.remove('u-model-overflow');
    }
  });
}

showDataInModal = async (id) => {
  const modal = document.querySelector('.js-modal');
  const modalContent = document.querySelector('.js-modal-content');
  const modalTitle = document.querySelector('.js-modal-title');
  const modalImage = document.querySelector('.js-modal-image');
  const modalIngredients = document.querySelector('.js-modal-ingredients');
  const modalInstructions = document.querySelector('.js-modal-instructions');
  const modalGlass = document.querySelector('.js-modal-glass');
  const modalAlcoholic = document.querySelector('.js-modal-alcoholic');
  const modalAlcoholicList = document.querySelector('.js-modal-alcoholic-list');

  // Get data from API
  const data = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
  const drink = await data.json();

  // Set title
  modalTitle.innerHTML = drink.drinks[0].strDrink;

  // Set image
  modalImage.src = drink.drinks[0].strDrinkThumb;
  modalImage.alt = drink.drinks[0].strDrink;

  // Set ingredients
  let ingredients = '';
  for (var i = 1; i < 16; i++) {
    if (drink.drinks[0][`strIngredient${i}`]) {
      ingredients += `<li class="c-modelcontent__list-item">${drink.drinks[0][`strIngredient${i}`]}</li>`;
    }
  }

  modalIngredients.innerHTML = ingredients;





}

listenToCard = () => {
  const buttons = document.querySelectorAll('.js-button');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', (e) => {
      // Get data-id from card
      const id = e.currentTarget.getAttribute('data-id');
      console.log(`OPEN ==> ${id}`);

      // Open modal
      const modal = document.querySelector('.js-modal');
      console.log(modal);
      modal.classList.add('is-visible');
      // Add overflow hidden to body
      document.body.classList.add('u-model-overflow');

      // Listen to close
      listenToClose(modal);

      // Show data in modal
      showDataInModal(id);

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
