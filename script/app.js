

showResult = (data) => {
    console.log(data);
    // Get dom elements
    const foto = document.querySelector(".js-foto1");
    const name = document.querySelector(".js-naam1");
    // Set photo url from API as src
    foto.src = data.drinks[0].strDrinkThumb;
    // Set name from API as text
    name.innerHTML = data.drinks[0].strDrink;
}

getData = async (url) => {
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
};

let getAPI = async (lat, lon) => {
  // build the url
  url = `https://www.thecocktaildb.com/api/json/v1/1/random.php`;
  // Get data from API
  const data = await getData(url);
  // If data is not empty
  if (data.drinks) {
    // Call show function
    showResult(data);
  }

};

document.addEventListener('DOMContentLoaded', function () {
  // Get date from api
  getAPI();
});
