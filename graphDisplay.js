
//Global value for the selected circle
var selected;


$(document).ready(function() {
        //Collect all links from json.js
            var links = data;
            var nodes = {};


            // Compute automatically the distinct nodes with all their informations from the links.
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


            //Width of the window
            var width = $(window).width();
            var height = $(window).height();

            var y = $("#nav").height()
            var x = $("#nav").width()


            //Call to the function resize() on resize of the window
            d3.select(window).on("resize", resize);

            //
            var force = d3.layout.force()
                .nodes(d3.values(nodes))
                .links(links)
                .size([width, height])
                .linkDistance(50)
                .charge(-10000)
                .on("tick", tick)
                .start();



            var svg = d3.select("#display").append("svg")
                .attr("width", width-x)
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

            svg.append("defs").selectAll("marker")
                .data(["suit", "licensing", "resolved"])
                .enter().append("marker")
                .attr("id", function(d) { return d; })
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 23)
                .attr("refY", -1,4)
                .attr("markerWidth",  7)
                .attr("markerHeight", 7)
                .attr("orient", "auto")
                .append("path")
                .attr("d", "M0,-5L10,0L0,5"); 

                  


            var circle = svg.append("g").selectAll("circle")
                .data(force.nodes())
                .enter().append("circle")
                .attr("r", 20)
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

              function resize() {
                width = window.innerWidth, height = window.innerHeight;
                var x = $("nav").width()
                console.log("width: ",width); console.log("x: ",x);
                $('#display').attr("width",$(window).width()-x).attr("height",$(window).height());
                $('svg').attr("width", width-x).attr("height", height);
                force.size([width, height]).resume();
              }


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
                selected = $(this);

                $(this).attr('class', 'selected');
                startRelation(links)
            });



            //Search function
            $("#btnNodeSearcher").click(function() {
                var string = $("#txtNodeSearcher").val()
                if (string != null && string != "")
                {
                    var str = string.toLowerCase();
                    Object.values(nodes).forEach(function(node) {
                        if (node.name.toLowerCase().indexOf(str) >= 0) {
                            var cir = $("#" + node.id);
                            var aClass = cir.attr('class');
                            cir.attr('class', aClass+' searched');
                        }
                    })
                }

            });

            //Number of relations textBox
            $("#nbrelations").change(function() {
                var value = $(this).text();
                if (!(value == '' && value == null && value == '0')) {
                    startRelation(links, null)
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

            
      

});


// Unselect all nodes
function resetNodes(links) {
    links.forEach(function(link) {
        link.selected = false;
    });
}

//Select recursively all the source of a target.
function getSource(links,theCircle, value) {
    if (typeof related == 'undefined') {
        var related = [];
    }
    links.forEach(function(link) {
        setTimeout(function(){ 
        var source = link.source;
        var target = link.target;
        var pathSelected = source.id + "-" + target.id;
        var sourceselector = $("#" + source.id);

        if (!((link.selected) == true) && target.id == theCircle){

                link.selected = true;

                if (value > 1) {
                    var relate = getSource(links, source.id, value-1)
                    $.merge(related, relate)
                }

                $("#" + pathSelected).attr('class', 'link linkselector');

                if (sourceselector.attr('class') != 'selected')
                    sourceselector.attr('class', 'source');

                related.push(link);
        }
        else if($("#" + pathSelected).attr('class') != ('link linkselector' || 'link notSelected'))
            $("#" + pathSelected).attr('class', 'link notSelected');

        }, 0);
    });

    return related;

}

//Select recursively all the target of a source.
function getTarget(links,theCircle, value) {
    if (typeof related == 'undefined') {
        var related = [];
    }

    links.forEach(function(link) {
        setTimeout(function(){
        var source = link.source;
        var target = link.target;
        var pathSelected = source.id + "-" + target.id;
        var targetselector = $("#" + target.id);
        if (!(link.selected == true) && source.id == theCircle) {

            link.selected = true;

            if (value > 1) {
                var relate = getTarget(links, target.id, value-1);
                $.merge(related, relate);
            }
            $("#" + pathSelected).attr('class', 'link linkselector');
            if (targetselector.attr('class') != 'selected')
                targetselector.attr('class', 'target');

            related.push(link);

               

        }
        else if($("#" + pathSelected).attr('class') != ('link linkselector' || 'link notSelected'))
            $("#" + pathSelected).attr('class', 'link notSelected');

        }, 0);
    });

    return related;
}

//Prepare to load selections (Source or target)
function startRelation(links) {

    var value = $("#nbrelations").val();
    var theCircle = selected.attr("id");

    $('.linkselector').attr('class', 'link suit');



    $("circle").attr("class", 'normal');
    $("#"+theCircle).attr('class', 'selected');

    if ($("#buttonSourceTarget").hasClass("source")) {
       var allRelatedNode = getSource(links, theCircle, value);
    } else {
        var allRelatedNode = getTarget(links, theCircle, value);
    }
    resetNodes(links);
}