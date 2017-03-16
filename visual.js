$(document).ready(function() {
    //TextBox of number relation inspector
            jQuery('#nbrelations').keyup(function() {
                this.value = this.value.replace(/[^0-9\.]/g, '');
            });


                        // Hide/Show nav
            $('#cash2').click(function() {
                $("nav").animate({width:'toggle'},350);
                if ($('.fleche').hasClass("flecheDown")) {
                    $(".fleche").removeClass("flecheDown");
                }else {
                    $(".fleche").addClass("flecheDown");
                }
            });

});