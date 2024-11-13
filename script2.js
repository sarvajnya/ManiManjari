var padding = { top: 20, right: 40, bottom: 20, left: 40 },
  w = 700 - padding.left - padding.right,
  h = 700 - padding.top - padding.bottom,
  r = Math.min(w, h) / 2,
  rotation = 0,
  oldrotation = 0,
  picked = 100000,
  color = d3.scale.category20(); 
var data = [
  {
    label: "सर्गः  1",
    value: 1,
    question: "सर्गः 1 श्लोकः " + Math.floor(Math.random() * 31 + 1),
  }, 
  {
    label: "सर्गः  2",
    value: 2,
    question: "सर्गः 2 श्लोकः " + Math.floor(Math.random() * 32 + 1),
  }, 
  {
    label: "सर्गः  3",
    value: 3,
    question: "सर्गः 3 श्लोकः " + Math.floor(Math.random() * 31 + 1),
  },
  {
    label: "सर्गः  4",
    value: 4,
    question: "सर्गः 4 श्लोकः " + Math.floor(Math.random() * 39 + 1),
  }, 
  {
    label: "सर्गः  5",
    value: 5,
    question: "सर्गः 5 श्लोकः " + Math.floor(Math.random() * 51 + 1),
  }, 
  {
    label: "सर्गः  6",
    value: 6,
    question: "सर्गः 6 श्लोकः " + Math.floor(Math.random() * 52 + 1),
  }, 
  {
    label: "सर्गः  7",
    value: 7,
    question: "सर्गः 7 श्लोकः " + Math.floor(Math.random() * 29 + 1),
  }, 
  {
    label: "सर्गः  8",
    value: 8,
    question: "सर्गः 8 श्लोकः " + Math.floor(Math.random() * 41 + 1),
  }
  
];
var svg = d3
  .select("#chart")
  .append("svg")
  .data([data])
  .attr("width", w + padding.left + padding.right)
  .attr("height", h + padding.top + padding.bottom)
  .style("display", "block")
  .style({"font-size": "25px"})
  .style("margin", "0 auto");

var container = svg
  .append("g")
  .attr("class", "chartholder")
  .attr(
    "transform",
    "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")"
  )
  .style("font-size", "25px");
var vis = container.append("g");
container
  .append("circle")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", 60)
  .style({ fill: "white", cursor: "pointer" })
  .on("mouseover", function () {
    d3.select(this).style("fill", "#ddd");
  })
  .on("mouseout", function () {
    d3.select(this).style("fill", "white");
  });

  container
  .append("text")
  .attr("x", 0)
  .attr("y", 15)
  .attr("text-anchor", "middle")
  .text("मणिमञ्जरी")
  .style({ "font-weight": "bold", "font-size": "20px" });

var pie = d3.layout
  .pie()
  .sort(null)
  .value(function (d) {
    return 1;
  });
var arc = d3.svg.arc().outerRadius(r);
var arcs = vis
  .selectAll("g.slice")
  .data(pie)
  .enter()
  .append("g")
  .attr("class", "slice");

arcs
  .append("path")
  .attr("fill", function (d, i) {
    return color(i);
  })
  .attr("d", function (d) {
    return arc(d);
  })
  .style("cursor", "pointer")
  .on("mouseover", function () {
    d3.select(this).style("opacity", 0.8);
  })
  .on("mouseout", function () {
    d3.select(this).style("opacity", 1);
  });
arcs
  .append("text")
  .attr("transform", function (d) {
    d.innerRadius = 0;
    d.outerRadius = r;
    d.angle = (d.startAngle + d.endAngle) / 2;
    return (
      "rotate(" +
      ((d.angle * 180) / Math.PI - 90) +
      ")translate(" +
      (d.outerRadius - 10) +
      ")"
    );
  })
  .attr("text-anchor", "end")
  .text(function (d, i) {
    return data[i].label;
  })
  .style({"font-size": "20px","font-weight": "bold"});

container.on("click", spin);
function spin(d) {
  container.on("click", null);

  var ps = 360 / data.length,
    pieslice = Math.round(1440 / data.length),
    rng = Math.floor(Math.random() * 12009 + 360);

  rotation = Math.round(rng / ps) * ps;

  picked = Math.round(data.length - (rotation % 360) / ps);
  // picked = Math.floor(Math.random() * 15);
  picked = picked >= data.length ? picked % data.length : picked;

  rotation += 90 - Math.round(ps / 2);
  vis
    .transition()
    .duration(3000)
    .attrTween("transform", rotTween)
    .each("end", function () {
   
      d3.select("#question h1").text(data[picked].question);
      oldrotation = rotation;

      console.log(data[picked].value);

      container.on("click", spin);
      container.on("click",
        setTimeout(() => {
          location.reload();
      }, 5000)
      );
    });
}
svg
  .append("g")
  .attr(
    "transform",
    "translate(" +
      (w + padding.left + padding.right) +
      "," +
      (h / 2 + padding.top) +
      ")"
  )
  .append("path")
  .attr("d", "M-" + r * 0.15 + ",0L0," + r * 0.05 + "L0,-" + r * 0.05 + "Z")
  .style({ fill: "black" });

function rotTween(to) {
  var i = d3.interpolate(oldrotation % 360, rotation);
  return function (t) {
    return "rotate(" + i(t) + ")";
  };
}
