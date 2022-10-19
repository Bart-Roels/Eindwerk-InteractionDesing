let htmlBody, model, closebtn, htmlModalContentn, btn;

// Using of onclick method bcs when tabel show x of x enteries not all elments are loaded into DOM, so event listener is not working
// Thats why evry eddit has onclick method
const myFunction = function (el) {

    // Open model
    model.style.display = "block";
    // Hide body scroll
    htmlBody.classList.add("c-model-overflow");
    // Animate model
    htmlModalContent.classList.remove('c-modal-close');
    htmlModalContent.classList.add("c-modal-open");

    // When close button is clicked
    closebtn.addEventListener('click', function () {
        // Close model
        model.style.display = 'none'
        // Show body scroll
        htmlBody.classList.remove('c-model-overflow');
        // Animate model
        htmlModalContent.classList.remove('c-modal-open');
        htmlModalContent.classList.add('c-modal-close');
    })

    window.addEventListener('click', function (e) {
        if (e.target == model) {
            // Animate model
            htmlModalContent.classList.remove('c-modal-open');
            htmlModalContent.classList.add('c-modal-close');
            // Close model
            // Show body scroll
            htmlBody.classList.remove('c-model-overflow');
            

        }
    })
}

// Listen to button click
const listenTobutton = function () {
    btn.addEventListener('click', function () {
        myFunction();
    })
}


const init = function () {
    console.log('DOM loaded');
    // Get model elements
    model = document.querySelector('.js-modal');
    closebtn = document.querySelector('.js-modal-close');
    htmlBody = document.querySelector('.js-body');
    htmlModalContent = document.querySelector('.js-modal-content');
    btn = document.querySelector('.js-btn');
    listenTobutton();
};

document.addEventListener('DOMContentLoaded', init);