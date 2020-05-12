$(window).on('scroll', function(){
	if ($(window).scrollTop()) {
		$('nav').addClass('black');
	}
	else {
		$('nav').removeClass('black');
	}
});

 /*
$(document).ready(function(){
	$(".overview").click(function(){
    $("#After").show().animate({opacity : '1'}, 4000);
});
});

$(document).ready(function(){
	$(".about").click(function(){
    $("#After1").show().animate({opacity : '1'}, 4000);
});
});
$(document).ready(function(){
	$(".features").click(function(){
    $("#After2").show().animate({opacity : '1'}, 2000);
});
});

$(document).ready(function(){
	$(".features").click(function(){
    $("#After3").show().animate({opacity : '1'}, 3000);
});
});

$(document).ready(function(){
	$(".features").click(function(){
    $("#After4").show().animate({opacity : '1'}, 5000);
});
});

$(document).ready(function(){
	$(".features").click(function(){
    $("#After5").show().animate({opacity : '1'}, 7000);
});
});

$(document).ready(function(){
	$(".features").click(function(){
    $("#After6").show().animate({opacity : '1'}, 9000);
});
});

$(document).ready(function(){
	$(".features").click(function(){
    $("#After7").show().animate({opacity : '1'}, 11000);
});
});

$(document).ready(function(){
	$(".download").click(function(){
    $("#After8").show().animate({opacity : '1'}, 4500);
});
});



	$(function () {
	$("").mgGlitch({
     destroy : false,
	 glitch: true,
	 scale : true,
	 blend : true,
	 blendModeType:'hue',
	 glitch1TimeMin:200,
	 glitch1TimeMax:400,
	 glitch2TimeMin:10,
	 glitch2TimeMax:100,

 });

});
*/


$(function() {
	menu = $('nav ul');

	$('#toggle-btn').on('click', function(e){
		e.preventDefault();
		menu.slideToggle();
		nav.removeClass('black');

	});

	$(window).resize(function(){
		var w = $(this).width();
		if(w > 580 && menu.is(':hidden')){
			menu.removeAttr('style');
		}
	});

	$('nav li').on('click', function(e){
		var w = $(window).width();
		if (w < 580) {
			menu.slideToggle();

		}
	});

	

	$('.open-menu').height($(window).height());
});


$('a[href*="#"]')
.not('[href="#"]')
.not('[href="#0"]')
.click(function(event){
	if ( 
	location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
	&&
	location.hostname == this.hostname
){
	var target = $(this.hash);
	target = target.length ? target : $('[name=' + this.hash.slice(1)+ ']');
	if (target.length) {
		event.preventDefault();
		$('html, body').animate({
			scrollTop: target.offset().top
		}, 1000, function(){
			var $target = $(target);
			$target.focus();
			if ($target.is(":focus")) {
				return false;
			}else{
				$target.attr('tabindex', '-1');
				$target.focus();
			};
		});
	}
}
});
