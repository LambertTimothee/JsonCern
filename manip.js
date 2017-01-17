var width = screen.width,
    height = screen.height;
$("body").css({"height": height, "width": width});

$( document ).ready(function() {
    $.ajax({
      url:'json.json',
      type:'POST',
      datatype:'text',
    success: function(data){
      var links = data;
      var nodes = {};
      $( "#typegraph" ).change(function() {
        switch ($( "#typegraph option:selected" ).val()) {
                    case ("movable"):
                        alert('10');
                        break;
                    case ("targeter"):
                       alert('21');
                        break;
                    case ("mercedes"):
               alert('31');
                        break;
                    default:
                        alert('>41');
                      }

      });

      // Compute the distinct nodes from the links.
      links.forEach(function(link) {
        link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
        link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
      });

      var width = screen.width,
          height = screen.height;

      var force = d3.layout.force()
          .nodes(d3.values(nodes))
          .links(links)
          .size([width, height])
          .linkDistance(400)
          .charge(-10000)
          .on("tick", tick)
          .start();



      var svg = d3.select("#display").append("svg")
          .attr("width", width)
          .attr("height", height);

      // Per-type markers, as they don't inherit styles.
      svg.append("defs").selectAll("marker")
          .data(["suit", "licensing", "resolved","drink"])
        .enter().append("marker")
          .attr("id", function(d) { return d; })
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
          .attr("class", function(d) { return "link " + d.type; })
          .attr('id', function(d) { return d.source.name+" : "+d.target.name+" : "+d.type })
          .attr("marker-end", function(d) { return "url(#" + d.type + ")"; }); 


      var circle = svg.append("g").selectAll("circle")
          .data(force.nodes())
        .enter().append("circle")
          .attr("r", 20)
          .call(force.drag);
        var thas = d3.select(this);


    if(!circle.attr('id')){
      d3.selectAll("circle").each( function(d, i){
        $(this).attr("id",d.name)
      });
    }



      var text = svg.append("g").selectAll("text")
        .data(force.nodes())
        .enter().append("text")
        .attr("x", "2em")
        .attr("y", "-0.8em")
        .text(function(d) { return d.name; });

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


          }
          })

  // error : function(resultat, statut, erreur){
});

