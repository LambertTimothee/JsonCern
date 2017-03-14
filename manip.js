$(document).ready(function() {
    //Collect all links from the jsonFile
    $.ajax({
        url: 'json.json',
        type: 'POST',
        datatype: 'text',
        success: function(data) {
            var links = data;
            var nodes = {};


            // Compute the distinct nodes from the links.
            links.forEach(function(link) {
                

                link.source = nodes[link.source.name] || (nodes[link.source.name] = 
                    jQuery.each(link.source, function(i, val) {
                    i+": "+val                    
                    })
                );

                link.target = nodes[link.target.name] || (nodes[link.target.name] = 
                    jQuery.each(link.target, function(i, val) {
                    i+": "+val                    
                    })
                );
            });


            // Select distance between nodes
            dist = $('#rangedefault').val();
            $('#rangedefault').change(function() {
                force.linkDistance(dist)
            });


            var x=$("#nav").height()
            var y= $("#nav").width()

            //Width of the window
            var width = $(window).width(),
                height = $(window).height();

            var force = d3.layout.force()
                .nodes(d3.values(nodes))
                .links(links)
                .size([width, height-x])
                .linkDistance(dist)
                .charge(-10000)
                .on("tick", tick)
                .start();



            var svg = d3.select("#display").append("svg")
                .attr("width", width)
                .attr("height", height)
                .call(d3.behavior.zoom().on("zoom", function () {
                svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
              }))
              .append("g");
                

            var path = svg.append("g").selectAll("path")
                .data(force.links())
                .enter().append("path")
                .attr("class", function(d) {
                    return "link " + d.type;
                })
                .attr('id', function(d) {
                    return d.source.id + "-" + d.target.id
                })



                .attr("marker-end", function(d) {
                    return "url(#" + d.type + ")";
                });


            var circle = svg.append("g").selectAll("circle")
                .data(force.nodes())
                .enter().append("circle")
                .attr("r", 20)
                .call(force.drag)
                .attr("id", function(d) {
                    return d.id;
                });




            var text = svg.append("g").selectAll("text")
                .data(force.nodes())
                .enter().append("text")
                .attr("x", "2em")
                .attr("y", "-0.8em")
                .text(function(d) {
                    return d.name;
                });

            function tick() {
                path.attr("d", linkArc);
                circle.attr("transform", transform);
                text.attr("transform", transform);
            }

            function linkArc(d) {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);

                return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
            }

            function transform(d) {
                return "translate(" + d.x + "," + d.y + ")";
            }

            //Click on nodes for relations
            $("circle").click(function() {

                $(this).attr('class', 'selected');
                startRelation(links, $(this))
            });

            $("circle").mouseover(function(){
                console.log("hello")

            });



            //Search function
            $("#btnNodeSearcher").click(function() {
                var str = $("#txtNodeSearcher").val().toLowerCase();
                $("circle").attr("class", 'normal');
                Object.values(nodes).forEach(function(node) {
                    if (node.name.toLowerCase().indexOf(str) >= 0) {
                        var cir = $("#" + node.value)
                        cir.attr("class", "detected")
                    }
                })

            });

            //Number of relations textBox
            $("#nbrelations").change(function() {
                var selected = $(".selected").attr('id');
                var value = $(this).text();
                if (!(value == '' && value == null && value == '0')) {
                    //loadrelatedrelation(links, selected, value);
                    startRelation(links, null)
                }
            });


            // Hide/Show nav
            $('#cash2').click(function() {
                $("#nav").animate({width:'toggle'},350);
                if ($('.fleche').hasClass("flecheDown")) {
                    $(".fleche").removeClass("flecheDown");
                }else {
                    $(".fleche").addClass("flecheDown");
                }
            });

            //Switch between Source and target selector
            $("#buttonSourceTarget").click(function() {
                if ($(this).hasClass("source")) {
                    $(this).attr("class", "target").html("Target");
                } else {
                    $(this).attr("class", "source").html("Source");
                }
                startRelation(links, null);
            });

            //TextBox of number relation inspector
            jQuery('#nbrelations').keyup(function() {
                this.value = this.value.replace(/[^0-9\.]/g, '');
            });



        }
    })

});



// Unselect all nodes
function resetNodes(links) {
    links.forEach(function(link) {
        link.target.selected = false;
        link.source.selected = false;
    });
}

//Select recursively all the source of a target.
function getSource(links, selected, value) {
    if (typeof related == 'undefined') {
        var related = [];
    }
    value--;
    links.forEach(function(link) {
        var source = link.source
        var target = link.target

        if (target.id == selected && !(source.selected)) {

            if (value > 0) {
                var relate = getSource(links, source.id, value)
                $.merge(related, relate)
            }

            var pathSelected = source.id + "-" + target.id;
            $("#" + pathSelected).attr('class', 'link linkselector');



            var sourceselector = $("#" + source.id);
            sourceselector.attr('class', 'source');
            related.push(source.id);
            source.selected = true;


        }
    });

    return related;

}

//Select recursively all the target of a source.
function getTarget(links, selected, value) {
    if (typeof related == 'undefined') {
        var related = [];
    }
    value--;

    links.forEach(function(link) {
        var source = link.source
        var target = link.target
        console.log(selected)
        console.log(source.id)
        console.log(target)

        if (source.id == selected && !(target.selected)) {

            if (value > 0) {
                var relate = getTarget(links, target.id, value);
                $.merge(related, relate);
            }
            var pathSelected = source.id + "-" + target.id;
            $("#" + pathSelected).attr('class', 'link linkselector');

            var targetselector = $("#" + target.id);
            targetselector.attr('class', 'target');
            related.push(target.id);
            target.selected = true;
        }
    });

    return related;
}

//Prepare to load selections (Source or target)
function startRelation(links, cercle) {
    if ((cercle == null)) {
        var selected = $(".selected").attr("id");
    } else {
        var selected = cercle.attr('id');
    }

    if ($(".linkselector").length) {


    }

    $('.linkselector').attr('class', 'link suit');

    var value = $("#nbrelations").val();
    $("circle").attr("class", 'normal');

    if ($("#buttonSourceTarget").hasClass("source")) {
        var allRelatedNode = getSource(links, selected, value);
    } else {
        var allRelatedNode = getTarget(links, selected, value);
    }

    resetNodes(links);
    $("#" + selected).attr('class', 'selected')
}