jQuery(document).ready(function($){
	//open popup
	$('.js-popup-trigger').on('click', function(event){
		$('.js-modal').addClass('is-visible');
	});
	
	//close popup
	$('.js-modal').on('click', function(event){
		if( $(event.target).is('.js-modal-close') || $(event.target).is('.js-modal') ) {
			$(this).removeClass('is-visible');
			console.log('close');
		}
	});
	//close popup when clicking the esc keyboard button
	$(document).keyup(function(event){
    	if(event.which=='27'){
    		$('.js-modal').removeClass('is-visible');
	    }
    });
});


