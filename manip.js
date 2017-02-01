/*var width = screen.width,
    height = screen.height;
$("body").css({
    "height": height,
    "width": width
});
*/
$(document).ready(function() {
    $.ajax({
        url: 'json.json',
        type: 'POST',
        datatype: 'text',
        success: function(data) {
            var links = data;
            var nodes = {};
      
            jQuery('#nbrelations').keyup(function () { 
              this.value = this.value.replace(/[^0-9\.]/g,'');
            });

            // Compute the distinct nodes from the links.
            links.forEach(function(link) {
                
                link.source = nodes[link.source] || (nodes[link.source] = {
                    name: link.source,
                    value: link.valuesource
                });

                
                link.target = nodes[link.target] || (nodes[link.target] = {
                    name: link.target,
                    value: link.valuetarget
                });
                /*link.target.valuetarget = nodes[link.valuetarget] || (*/ //)





            });
            dist = $('#rangedefault').val();
            console.log($('#rangedefault').val())
            $('#rangedefault').change(function(){
              console.log("hey!")
              force.linkDistance(dist)
            });



            var width = screen.width,
                height = screen.height;

            var force = d3.layout.force()
                .nodes(d3.values(nodes))
                .links(links)
                .size([width, height])
                .linkDistance(dist)
                .charge(-10000)
                .on("tick", tick)
                .start();

            console.log(force.linkDistance())



            var svg = d3.select("#display").append("svg")
                .attr("width", width)
                .attr("height", height);

            // Per-type markers, as they don't inherit styles.
            svg.append("defs").selectAll("marker")
                .data(["suit", "licensing", "resolved", "drink"])
                .enter().append("marker")
                .attr("id", function(d) {
                    return d;
                })
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 30)
                .attr("refY", -1.5)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("path")
                .attr("d", "M0,-5L10,0L0,5");

            var path = svg.append("g").selectAll("path")
                .data(force.links())
                .enter().append("path")
                .attr("class", function(d) {
                    return "link " + d.type;
                })
                .attr('id', function(d) {
                    return d.source + " : " + d.target.name + " : " + d.type + " : " + d.value
                })



                .attr("marker-end", function(d) {
                    return "url(#" + d.type + ")";
                });


            var circle = svg.append("g").selectAll("circle")
                .data(force.nodes())
                .enter().append("circle")
                .attr("r", 20)
                .call(force.drag);


            if (!circle.attr('id')) {
                d3.selectAll("circle").each(function(d, i) {
                    $(this).attr("id", d.value);
                });
            }




            var text = svg.append("g").selectAll("text")
                .data(force.nodes())
                .enter().append("text")
                .attr("x", "2em")
                .attr("y", "-0.8em")
                .text(function(d) {
                    return d.name;
                });

            // Use elliptical arc path segments to doubly-encode directionality.
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

                //  return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + "  " + d.target.x + "," + d.target.y;
                //  return "M" + d.source.x + "," + d.source.y + "Q" + " "+width/2+ " "+ height/2+ " "+ d.target.x + "," + d.target.y;
                //  return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y ;
            }

            function transform(d) {
                return "translate(" + d.x + "," + d.y + ")";
            }

            $("circle").click(function() {
                $("circle").attr("class", 'normal');
                $(this).attr('class', 'selected');
                var selected = $(this).attr('id');
                var value = $("#nbrelations").val();
                //loadrelatedrelation(links, selected, value);
                var allSource = getTarget(links,selected,value);
            });
/*
            function loadrelatedrelation(links, selected, value) {
                var related = []

                links.forEach(function(link) {
                    var source = link.source
                    var target = link.target
                    if (source.value == selected /* && $.inArray(source,related) != 1 ) {
                        var targetselector = $("#" + target.value);
                        targetselector.attr('class', 'source');
                        related.push(source.value);

                    }
                    else if (target.value == selected /* && $.inArray(source,related) != 1 ) {
                        var sourceselector = $("#" + source.value);
                        sourceselector.attr('class', 'target');
                        related.push(target.value);
                    }
                });
            }*/

            function getSource(links, selected, value){
                if(typeof related == 'undefined')
                {
                  var related = [];
                }

                value --;
              links.forEach(function(link) {
                    var source = link.source
                    var target = link.target

                    if (source.value == selected /* && $.inArray(source,related) != 1*/ ) {
                        var sourceselector = $("#" + target.value);
                        sourceselector.attr('class', 'source');
                        related.push(source.value);
                        if (value>0)
                        {
                          var relate = getSource(links,link.target.value,value)
                          $.merge(related,relate)
                        }
                          

                    }
              });

            return related;
          }

            function getTarget(links, selected, value){
            if(typeof related == 'undefined')
                {
                  var related = [];
                }

                value --;
              links.forEach(function(link) {
                var source = link.source
                var target = link.target

                  if (target.value == selected /* && $.inArray(source,related) != 1*/ ) {
                    var targetselector = $("#" + source.value);
                    targetselector.attr('class', 'source');
                    related.push(target.value);
                    if (value>0)
                    {
                       var relate = getTarget(links,link.source.value,value)
                       $.merge(related,relate)
                    }
                  }
                 /* else if($.inArray(target.value,related)!=1){
                    var targetselector = $("#" + );
                    targetselector.attr('class', 'degage');

                  }*/

              });

            return related;
          }


            $("#nbrelations").change(function() {
                var selected = $(".selected").attr('id');
                var value = $(this).text();
                if (!(value == '' && value == null && value == '0')) {
                    //loadrelatedrelation(links, selected, value);
                  getTarget(links,selected,value);
                }
            });

      $(function(){
      $('#cash2').click(function(){
        $('#nav').slideToggle("slow");
        if($('.fleche').hasClass("flecheDown")){
          $(".fleche").removeClass("flecheDown");
        }else{
          $(".fleche").addClass("flecheDown");
        }
      });
    });

        }
    })



    // error : function(resultat, statut, erreur){
});