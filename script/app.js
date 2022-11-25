let rawIngredinetsList;

checkAlcohol = (ingredientsCocktail) => {
  // Set to lowercase
  var res = JSON.parse(
    JSON.stringify(rawIngredinetsList, function (a, b) {
      return typeof b === 'string' ? b.toLowerCase() : b;
    })
  );

  let alcoholList = [];
  // For evry item in json list check if it is in ingredients list of drink
  for (var i = 0; i < res['ingredients'].length; i++) {
    // If item is in list
    if (ingredientsCocktail.includes(res['ingredients'][i]['strIngredient1'])) {
      // If alcohol is true of contain in title words as wodka or vodka
      if (res['ingredients'][i]['Alcoholic'] == 1) {
        // Add to alcohol list
        alcoholList.push(res['ingredients'][i]['strIngredient1']);
      }
    }
  }
  return alcoholList;
};

visualizeAlcohol = (drinks) => {
  // Visualize alcohol

  let drink = drinks.drinks[0];

  // Get all ingredients
  // Make list of all ingredients in drink
  let ingredientsCocktail = [];
  for (var a = 1; a < 16; a++) {
    if (drink[`strIngredient${a}`] != null) {
      // Set to lowercase
      let ingredient = drink[`strIngredient${a}`].toLowerCase();
      // Add to list
      ingredientsCocktail.push(ingredient);
    }
  }

  // Get list of alcohol ingredients
  let array = checkAlcohol(ingredientsCocktail);

  // Compare in %
  let percentage = (array.length / ingredientsCocktail.length) * 100;

  // console.log(`Name => ${drink.strDrink}\nIngredienten => ${ingredientsCocktail}\nAlcohol => ${array}\nPercentage => ${percentage}`);

  return percentage;
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
};

showDataInModal = async (id) => {
  const modalTitle = document.querySelector('.js-modal-title');
  const modalImage = document.querySelector('.js-modal-image');
  const modalIngredients = document.querySelector('.js-modal-ingredients');
  const ingredientsList = document.querySelector('.js-modal-ingredients-list');
  const modalInfo = document.querySelector('.js-modal-info');
  const cocktailStrength = document.querySelector('.js-cocktail-strength');

  const ingredientButton = document.querySelector('.js-ingredient-button');
  const stepButton = document.querySelector('.js-step-button');

  // Get data from API
  const data = getCocktailDate(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
  const drink = await data.json();

  // Set title
  modalTitle.innerHTML = drink.drinks[0].strDrink;

  // Set image
  modalImage.src = drink.drinks[0].strDrinkThumb;
  modalImage.alt = drink.drinks[0].strDrink;

  // Visualize alcohol
  let percentage = visualizeAlcohol(drink);

  // Set ingredients
  modalIngredients.classList.remove('u-hidden');
  // Hide steps
  modalInfo.classList.add('u-hidden');
  let ingredients = '';
  let ingredientsCocktail = [];
  for (var i = 1; i < 16; i++) {
    if (drink.drinks[0][`strIngredient${i}`] != null) {
      ingredients += `<li>${drink.drinks[0][`strIngredient${i}`]} - ${drink.drinks[0][`strMeasure${i}`]}</li>`;
      ingredientsCocktail.push(drink.drinks[0][`strIngredient${i}`]);
    }
  }
  ingredientsList.innerHTML = ingredients;

  // Set percentage in percentage bara
  const percentageBar = document.querySelector('.js-modal-percentage-bar');
  percentageBar.style.width = `${percentage}%`;
  // Set percentage in percentage text
  // Round percentage
  percentageBar.innerHTML = `${Math.round(percentage)}%`;

  // Swich case based on percentage and set cocktail strength
  switch (true) {
    case percentage <= 0:
      cocktailStrength.innerHTML = 'Non-alcoholic';
      break;
    case percentage > 0 && percentage <= 25:
      cocktailStrength.innerHTML = 'Low';
      break;
    case percentage > 25 && percentage <= 50:
      cocktailStrength.innerHTML = 'Medium';
      break;
    case percentage > 50 && percentage <= 75:
      cocktailStrength.innerHTML = 'High';
      break;
    case percentage > 75:
      cocktailStrength.innerHTML = 'Very strong';
      break;
    default:
      cocktailStrength.innerHTML = 'Unknown';
  }

  // Set opacity to 1
  ingredientButton.style.opacity = 1;

  // Listen for click on step button
  stepButton.addEventListener('click', () => {
    // Set info
    modalInfo.classList.remove('u-hidden');
    // Set opacity to 1
    stepButton.style.opacity = 1;
    ingredientButton.style.opacity = '0.5';
    // Set info
    modalInfo.innerHTML = drink.drinks[0].strInstructions;
    // Hide ingredients
    modalIngredients.classList.add('u-hidden');
  });

  // Listen for click on ingredient button
  ingredientButton.addEventListener('click', () => {
    // Set ingredients
    modalIngredients.classList.remove('u-hidden');
    // Hide info
    modalInfo.classList.add('u-hidden');
    // Set opacity from child to 1
    ingredientButton.style.opacity = 1;
    stepButton.style.opacity = 0.5;
    // Show ingredients
    // Show ingredients
    let ingredients = '';
    for (var i = 1; i < 16; i++) {
      if (drink.drinks[0][`strIngredient${i}`]) {
        ingredients += `<li class="c-modelcontent__list-item">${drink.drinks[0][`strIngredient${i}`]}</li>`;
      }
    }
    modalIngredients.classList.remove('u-hidden');
    ingredientsList.innerHTML = ingredients;
  });


};

listenToCard = () => {
  const buttons = document.querySelectorAll('.js-button');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', (e) => {
      // Get data-id from card
      const id = e.currentTarget.getAttribute('data-id');
      // console.log(`OPEN ==> ${id}`);

      // Open modal
      const modal = document.querySelector('.js-modal');
      // console.log(modal);
      modal.classList.add('is-visible');
      // Add overflow hidden to body
      document.body.classList.add('u-model-overflow');

      // Listen to close
      listenToClose(modal);

      // Show data in modal
      showDataInModal(id);
    });
  }
};

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

    // Get icon
    const icon = document.querySelectorAll(`.js-alcoholicon`);

    // Check if drink is alcoholic
    if (drink.strAlcoholic == 'Alcoholic' || drink.strAlcoholic == 'Optional alcohol') {
      // Set img sr
      icon[i].src = '/Assets/Alcoholic.svg';
    } else {
      // Set img src
      icon[i].src = '/Assets/Non-alcoholic.svg';
    }
  }
};

getCocktailDate = async (id) => {
  return fetch(url)
  .then((r) => r.json())
  .catch((e) => console.error(e));
}

getIngredientData = async (url) => {
  return fetch(url)
    .then((r) => r.json())
    .catch((e) => console.error(e));
};

getData = async (url) => {
  return fetch(url)
    .then((r) => r.json())
    .catch((e) => console.error(e));
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
