$(document).ready(function() {
    //TextBox of number relation inspector

    var nav = $("nav");
    var arrow = $('.fleche');

    jQuery('#nbrelations').keyup(function() {
        this.value = this.value.replace(/[^0-9\.]/g, '');
    });


                // Hide/Show nav
    $('#cash2').click(function() {

        

        if(arrow.hasClass("flecheRotate")){
                nav.animate({width:'toggle'},350);
                arrow.animate({
                    left: "16em",
                });
                arrow.removeClass("flecheRotate");            
            setTimeout(function(){
                $("nav *").fadeIn(100);
            }, 300);     
        }else{
            $("nav *").fadeOut(100);
            setTimeout(function(){
                nav.animate({width:'toggle'},350);
    /*            if(arrow.hasClass("flecheRotate")){
                    arrow.animate({left: "16em",});
                    removeClass("flecheRotate");
                }else{*/
                    arrow.animate({
                        left: "1em",
                    });
                    arrow.addClass("flecheRotate");            
            }, 100);                
        }






/*        if ($('.fleche').hasClass("flecheRotate") && $('.fleche').hasClass("flecheLeft")) {
            $(".fleche").removeClass("flecheLeft");
            $(".fleche").removeClass("flecheRotate");                   
        }else {
            $(".fleche").addClass("flecheLeft").delay( 800 );
            $(".fleche").addClass("flecheRotate");
        }*/
    });

});