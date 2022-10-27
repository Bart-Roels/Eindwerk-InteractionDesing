let rawIngredinetsList;


checkAlcohol = (ingredientsCocktail) => {
  // Make list of alcohol ingredients

  let alcoholList = [];
  // For evry item in json list check if it is in ingredients list of drink
  for (var i = 0; i < rawIngredinetsList['ingredients'].length; i++) {
    // If item is in list
    if (ingredientsCocktail.includes(rawIngredinetsList['ingredients'][i]['strIngredient1'])) {
      // If alcohol is true of contain in title words as wodka or vodka
      if (rawIngredinetsList['ingredients'][i]['Alcoholic'] == 1) {
        // Add to alcohol list
        alcoholList.push(rawIngredinetsList['ingredients'][i]['strIngredient1']);
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
      ingredientsCocktail.push(drink[`strIngredient${a}`]);
    }
  }

  // Get list of alcohol ingredients
  let array = checkAlcohol(ingredientsCocktail);

  // Compare in %
  let percentage = (array.length / ingredientsCocktail.length) * 100;

  console.log(`Name => ${drink.strDrink}\nIngredienten => ${ingredientsCocktail}\nAlcohol => ${array}\nPercentage => ${percentage}`);

  return percentage;


}

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

  const modalTitle = document.querySelector('.js-modal-title');
  const modalImage = document.querySelector('.js-modal-image');
  const modalIngredients = document.querySelector('.js-modal-ingredients');
  const ingredientsList = document.querySelector('.js-modal-ingredients-list');
  const modalInfo = document.querySelector('.js-modal-info');
  const cocktailStrength = document.querySelector('.js-cocktail-strength');
  const radio = document.querySelectorAll('input[name="menue"]');


  // Get data from API
  const data = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
  const drink = await data.json();

  // Set title
  modalTitle.innerHTML = drink.drinks[0].strDrink;

  // Set image
  modalImage.src = drink.drinks[0].strDrinkThumb;
  modalImage.alt = drink.drinks[0].strDrink;

  // Clear checked radio and set on first & hide info
  modalInfo.classList.add('u-hidden');
  for (var i = 0; i < radio.length; i++) {
    radio[i].checked = false;
  }
  radio[0].checked = true;


  // Visualize alcohol
  let percentage = visualizeAlcohol(drink);

  // Set ingredients
  modalIngredients.classList.remove('u-hidden');
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
    case (percentage <= 0):
      cocktailStrength.innerHTML = 'Non-alcoholic';
      break;
    case (percentage > 0 && percentage <= 25):
      cocktailStrength.innerHTML = 'Low';
      break;
    case (percentage > 25 && percentage <= 50):
      cocktailStrength.innerHTML = 'Medium';
      break;
    case (percentage > 50 && percentage <= 75):
      cocktailStrength.innerHTML = 'High';
      break;
    case (percentage > 75):
      cocktailStrength.innerHTML = 'Very strong';
      break;
    default:
      cocktailStrength.innerHTML = 'Unknown';
  }



  // Event listener for radio button
  radio.forEach((item) => {
    item.addEventListener('change', (e) => {
      // Hide both 
      modalIngredients.classList.add('u-hidden');
      modalInfo.classList.add('u-hidden');
      // Get value of radio button
      const value = e.target.value;
      // If value is ingredients
      if (value == 'ingredients') {
        // Show ingredients
        let ingredients = '';
        for (var i = 1; i < 16; i++) {
          if (drink.drinks[0][`strIngredient${i}`]) {
            ingredients += `<li class="c-modelcontent__list-item">${drink.drinks[0][`strIngredient${i}`]}</li>`;
          }
        }
        modalIngredients.classList.remove('u-hidden');
        ingredientsList.innerHTML = ingredients;
      }
      if (value == 'info') {
        // Remove hidden class
        modalInfo.classList.remove('u-hidden');
        // Show info
        modalInfo.innerHTML = drink.drinks[0].strInstructions;
      }
    });
  })

  //


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

    // Get icon
    const icon = document.querySelectorAll(`.js-alcoholicon`);

    // Check if drink is alcoholic
    if (drink.strAlcoholic == 'Alcoholic' || drink.strAlcoholic == 'Optional alcohol') {
      // Set img sr
      icon[i].src = '/Assets/Alcoholic.svg';
    }
    else {
      // Set img src
      icon[i].src = '/Assets/Non-alcoholic.svg';
    }


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
