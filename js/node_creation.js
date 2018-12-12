
var vis_data = {};
var nodes_ = [];
var node_id_changes = [];
var links_ = [];
var node_s;

var selected_node = -1;
var previous_node = null;

var nodes_list_div = d3.select(".nodes_list")
      .append("div")
      .classed("node_entries", true)
      .attr("id", "node_entries");

var node_entries;
function start_program(){

  // this.tooltip = d3.select(this.svgWrapperRef).append("div")
  //     .attr("class", "tooltip_bubble")
  //     .style("opacity", 0);

  var q = queue();
  q.defer(d3.json,'data/del.json');
  // load_current_node_system();
  q.awaitAll(function(error,data_list) {
    if (error) throw error;
    vis_data = data_list[0];
    nodes_ = data_list[0].nodes;
    links_ = data_list[0].links;

    // console.log(nodes_);
    show_nodes_list();
    make_sankey();
  });
}



//Centrala områden.

function submit_node(){
  // console.log(nodes_);
  var name = $('#create_node_name').val();
  var content = $('#create_node_content').val();

  create_new_node(name,content,nodes_.length);
}

function submit_link(){
  var node_1 = $('#node_link_1').val();
  var node_2 = $('#node_link_2').val();
  console.log(node_1);
  console.log(node_2);
  create_link(node_1,node_2);
}

function create_link(a,b){
  var obj = {};
  obj.target = parseInt(a);
  obj.value = 1;
  obj.source = parseInt(b);
  links_.push(obj);

  update_sankey(nodes_,links_);
}
function remove_link(){
  var a = $('#node_link_1_remove').val();
  var b = $('#node_link_2_remove').val();
  var target = parseInt(a);
  var source = parseInt(b);

  for(var i = 0; i < links_.length; i++){
    // console.log(links_[i]);
    if(links_[i].source == source && links_[i].target == target){
      // console.log("wat");
      links_.splice(i,1);
    }
  }
  update_sankey(nodes_,links_);
}

function edit_node(){
  // selecteD_node;
  // Selected node is collected in a variable.
  console.log(nodes_[selecteD_node]);
}



// Create a new node
// A node is a piece of information under a section
function create_new_node(name,content,id){
  var obj = {};
  obj.name = name;
  obj.content = content;
  obj.id = "test_"+id;
  obj.target_source = nodes_.length;

  nodes_.push(obj);
  update_nodes_list();
}

function remove_node(){
  if(selected_node != -1){
    remove_node_id(selected_node);
  }
}

//removes a node that you have created.
function remove_node_id(id){
  // Recalculate all the IDs for nodes.
  // Recalculate all the new IDs for this ID i nlinks.
  // if(id <= 12){
  //   alert('You cannot delete this node. It is part of the core structure');
  //   return;
  // }
  var txt;
  var r = confirm("Är du säker på att du vill ta bort denna nod?!");
  if (r == true) {
    nodes_.splice(id,1);
    destroy_all_connections(id);
    recalculate_node_ids();
    // destroy_all_connections(id);
    recalculate_node_links();
    update_nodes_list();
  }

}

function recalculate_node_ids(){
  for(var i = 0; i < nodes_.length; i++){
    var obj = {};
    obj.old = nodes_[i].target_source;
    obj.new = i;
    nodes_[i].target_source = i;
    node_id_changes.push(obj);
  }
}

function recalculate_node_links(){
  for(var i = 0; i < links_.length; i++){
    var link = links_[i];
    for(var j= 0; j < node_id_changes.length; j++){
      var old = node_id_changes[j].old;
      if(old == link.source){
        links_[i].source = node_id_changes[j].new;
      }
      if(old == link.target){
        links_[i].target = node_id_changes[j].new;
      }
    }
  }
}



function destroy_all_connections(id){
  for(var i = 0; i < links_.length; i++){
    var link = links_[i];
    console.log(link);
    if(link.source == id || link.target == id){
      console.log(1);
      links_.splice(i,1);
    }
  }
}


function show_nodes_list(){
  node_s = nodes_list_div.selectAll('.node_entries')
    .data(nodes_, function(d){return d.target_source})
    .enter()
    .append('a')
    .classed('node_entry',true)
    .html(function(d){return d.target_source + " | " + d.name + "<br>"})
    .on('click',function(d){
      d3.select(previous_node).style('color','black');
      previous_node = this;
      // selected_node = d.id;
      selected_node = d.target_source;
      d3.select(this).style('color','red');
    });
}

function update_nodes_list(){
  $(".node_entries").empty();
  show_nodes_list();
  var fin = {
    "nodes" : nodes_,
    "links" : links_
  };
  update_sankey(nodes_,links_);
}



//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// These show and open the input box.

var options = ["create_node","create_link","remove_link"];
var opened_box = -1;

function show_input(i){
  opened_box = i;
  for(var i = 0; i < options.length; i++){
    if(opened_box != i){
      $("#"+options[i]).css('display','none');
    }
  }
  $('#'+options[opened_box]).css('display','initial');
}
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Prints the new JSON file on screen.
function print_new_json(){
  var fin = {
    "nodes" : nodes_,
    "links" : links_
  };
  $(".texta").text(JSON.stringify(fin));
  $(".print_text").css("display","initial");
}
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!





//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Cookies
// This is for storage on your PC.
function save_plan(){
  var fin = {
    "nodes" : nodes_,
    "links" : links_
  };
  setCookie("my_plan",fin,365);
  alert("Din handlingsplan är nu sparad i en 'Cookie' på din dator och kommer användas vid nästa tillfälle.\n\nFör att vara säker på att du sparar den eller om du vill dela den med andra, klicka på 'Exportera' och spara texten i en separat fil på din dator.")
  console.log(read_cookie('my_plan'));
}


//https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
//https://stackoverflow.com/questions/11344531/pure-javascript-store-object-in-cookie
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (JSON.stringify(value) || "")  + expires + "; path=/";
}

function read_cookie(name) {
 var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
 result && (result = JSON.parse(result[1]));
 return result;
}
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

start_program();
