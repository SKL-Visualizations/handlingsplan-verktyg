var colors = {
      'environment':         '#edbd00',
      'social':              '#367d85',
      'animals':             '#97ba4c',
      'health':              '#f5662b',
      'final_score':         '#5c5b97',
      'goal_1':              '#97ba4c',
      'goal_2':              '#367d85',
      'goal_3':              '#edbd00',
      'goal_1_1':            'orange',
      'pillar_4': 'pink',
      // 'research_ingredient': '#3f3e47',
      // 'research_ingredient': '#3f3e47',
      'fallback':            '#5c5b97'
    };
function make_sankey(){

  d3.json("data/del.json", function(error, json) {
    $('#chart').empty();
    var chart = d3.select("#chart").append("svg").chart("Sankey.Path");
    chart
      .name(label)
      .colorNodes(function(name, node) {
        return color(node, 1) || colors.fallback;
      })
      .colorLinks(function(link) {
        return color(link.source, 4) || color(link.target, 1) || colors.fallback;
      })
      .nodeWidth(15)
      .nodePadding(10)
      .spread(true)
      .iterations(0)
      .draw(json);
    function label(node) {
      return node.name.replace(/\s*\(.*?\)$/, '');
    }
    function color(node, depth) {
      var id = node.id.replace(/(_score)?(_\d+)?$/, '');
      if (colors[id]) {
        return colors[id];
      } else if (depth > 0 && node.targetLinks && node.targetLinks.length == 1) {
        return color(node.targetLinks[0].source, depth-1);
      } else {
        return null;
      }
    }
  });
}

function update_sankey(nodes_,links_){
  // console.log(nodes_);
    var nodes = [];
    var links = [];
    for(var i = 0; i < nodes_.length; i++){
      var obj = {};
      obj.name = nodes_[i].name;
      obj.id = nodes_[i].id;
      obj.target_source = nodes_[i].target_source;
      nodes.push(obj);
    }
    for(var i = 0; i < links_.length; i++){
      var obj = {};
      obj.source = links_[i].source;
      obj.value = links_[i].value;
      obj.target = links_[i].target;
      links.push(obj);
    }
    var json = {
      "nodes" : nodes,
      "links" : links
    };
    $('#chart').empty();
    var chart = d3.select("#chart").append("svg").chart("Sankey.Path");
    chart
      .name(label)
      .colorNodes(function(name, node) {
        return color(node, 1) || colors.fallback;
      })
      .colorLinks(function(link) {
        return color(link.source, 4) || color(link.target, 1) || colors.fallback;
      })
      .nodeWidth(15)
      .nodePadding(10)
      .spread(true)
      .iterations(5)
      // .layout(32)
      .draw(json);

    function label(node) {
      return node.name.replace(/\s*\(.*?\)$/, '');
    }
    function color(node, depth) {
      var id = node.id.replace(/(_score)?(_\d+)?$/, '');
      if (colors[id]) {
        return colors[id];
      } else if (depth > 0 && node.targetLinks && node.targetLinks.length == 1) {
        return color(node.targetLinks[0].source, depth-1);
      } else {
        return null;
      }
    }
}
