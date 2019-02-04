$(document).ready(function () {
   $(".menu").click(function () {
       $(".menu-content").toggleClass("toggle");
   })
});
/* javascript, jquery */
$(window).scroll(function() {
    var $el = $('.wrapper-header');

    if($(this).scrollTop() > 100){
        $el.addClass('scroll');
    }
    else{
        $el.removeClass('scroll');
    }
});