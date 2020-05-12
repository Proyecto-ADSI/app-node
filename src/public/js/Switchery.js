jQuery(document).ready(function() {
    
    // Switchery
    var element = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
    $('.js-switch').each(function() {
       new Switchery($(this)[0], $(this).data());
    });
});


    