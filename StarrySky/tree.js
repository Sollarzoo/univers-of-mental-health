//准备数据   
var root = {
  'name': 'Self-employed',
  'children': [
    {
      'name': 'Y Pre-employers 1',
      'children': [
        {'name': 'Y star6'},
        {'name': 'N star5'}
      ]
    },
    {
      'name': 'N Tech-company',
      'children': [
        {
          'name': 'Y Pre-employers 2',
          'children': [
            {'name': 'Y star2'},
            {'name': 'N star1'}
          ]
        },
        {
          'name': 'N Tech-role',
          'children': [
            {
              'name': 'Y Pre-employers 3',
              'children': [
                {'name': 'Y star4'},
                {'name': 'N star3'}
              ]
            },
            {'name': 'N'}
          ]
        }
      ]
    }
  ]
}
  
//1. 根据root整理出数结构的数据
const hierarchyData = d3.hierarchy(root)
                        .sum(function(d){
                          return d.name
                        })
// console.log(hierarchyData, 'hierarchyData')
//2. 生成树状布局(数据获取器)
var tree = d3.tree()
.size([200, 280])
.separation(function (a, b) {
  return (a.parent === b.parent ? 1 : 2) / a.depth
})
//3. 初始化树状图数据（绘制树的基本数据）
var treeData = tree(hierarchyData);
//4. 获取节点
var nodes = treeData.descendants();
//5. 获取边，连线
var links = treeData.links();

//6. 开始绘制树！
var treeSvg = d3.select("#tree-nav")
      .append("svg")			//在<body>中添加<svg>
      .attr("width", 360)	//设定<svg>的宽度属性
      .attr("height", 200)
      .append("g")
      .attr('transform','translate(50, 0)')

var horizontal = d3.linkHorizontal() //linkHorizontal生成的曲线在曲线的终点和起点处的切线是水平方向
  .x(d => d.y)
  .y(d => d.x);

var link = treeSvg.selectAll(".link")
.data(links)
.enter()
.append("path")
.style("fill", "none")
.style("stroke", function(d) {
  if (d.source.data.name == 'N Tech-role' && d.target.data.name == 'N') {
    return "#aaa";
  } else  return "white";
})
.style("stroke-width", 2.5)
.attr('d', horizontal)
.on("click", function(d) {
    // console.log(d.source.data.name, d.target.data.name);
});

var node = treeSvg.selectAll(".node")
.data(nodes)
.enter()
.append("g")
.attr("class", "node")
.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
  
var nodes = node.append("circle")
.attr("r", 5)
.style("fill", function(d) {
    if (d.data.name == 'N') {
      return "#aaa";
    } else  return "white";
})
.style("cursor", "pointer")
.attr('class', function(d) {
  return d.data.name
})
.on("mouseover", function(d,i) {
  d3.select(this).style("stroke", "#00ffd4").style("stroke-width", 2);
})
.on("mouseout", function(d,i) {
  d3.select(this).style("stroke", "none");
})
.on("click", function(d) {
  var current_node = d;
  // console.log(current_node.data.name);
  var parent_nodes = [current_node.data.name];
    var parent_links = [];
  for (var depth = 0; depth < d.depth; depth++) {
        var current_link = current_node.data.name;
    current_node = current_node.parent;
        current_link = current_node.data.name + " To " + current_link;
    parent_nodes.push(current_node.data.name);
        parent_links.push(current_link);
  }
  // console.log(parent_nodes, parent_links);
/* 筛选 */
  let selectedNode = d3.select(this).node() //获取当前节点
  selectedNodeName = selectedNode.getAttribute('class') //获取当前节点的className
  console.log(selectedNodeName, 'selectedNodeName')
  switch(selectedNodeName) {
    case "Self-employed":
      posData = []
      for (let i in data) {
        //if (i < 100) {
            posData.push({
                // 画面中心坐标 +- 比例尺
                'id': i,
                'self-employed': data[i]['Are you self-employed?'],
                'IT-company': data[i]['Is your employer primarily a tech company/organization?'],
                'pre-employers': data[i]['Do you have previous employers?'],
                'Tech-role': data[i]['Is your primary role within your company related to tech/IT?'],
                'x': tempWindowWidth/2 + xPosScale*data[i].x,
                'y': tempWindowHeight/2 + yPosScale*data[i].y,
                'ox': 0,
                'oy': 0,
                'condition': split(data[i]['If so, what condition(s) were you diagnosed with?'], '|'),
                'view': data[i]['Do you think that team members/co-workers would view you more negatively if they knew you suffered from a mental health issue?']
            })
        } 
      console.log(posData, 'posData????')
    break;
    case "N star1":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '0' && d['IT-company'] == '1' && d['pre-employers'] == '0'}) //根据className筛选posData里边的人群，从而更新posData
      // posData.forEach((pos, i) => {
      //   pos.x = pos.x - tempWindowWidth/2
      //   pos.y = pos.y - tempWindowHeight/2
      //   console.log(pos.x, 'pos.x-1')
      // })
      // console.log(posData, 'posData')
    break;
    case "Y star2":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '0' && d['IT-company'] == '1' && d['pre-employers'] == '1'}) 
      posData.forEach((pos, i) => {
        console.log(pos.x, 'pos.x-2')
      })
    break;
    case "N star3":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '0' && d['IT-company'] == '0' && d['pre-employers'] == '0' && d['Tech-role'] == '1'}) 
    break;
    case "Y star4":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '0' && d['IT-company'] == '0' && d['pre-employers'] == '1' && d['Tech-role'] == '1'}) 
    break;
    case "N star5":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '1' && d['pre-employers'] == '0' }) 
    break;
    case "Y star6":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '1' && d['pre-employers'] == '1' }) 
    break;
    case "N":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '0' && d['IT-company'] == '0' && d['Tech-role'] == '0' })
      // console.log(posData, 'posData')
    break;
    case "Y Pre-employers 1":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '1' })
      // console.log(posData, 'posData')
    break;
    case "N Tech-company":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '0' })
      // console.log(posData, 'posData')
    break;
    case "Y Pre-employers 2":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '0' && d['IT-company'] == '1'})
      // console.log(posData, 'posData')
    break;
    case "Y Pre-employers 2":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '0' && d['IT-company'] == '1'})
      // console.log(posData, 'posData')
    break;
    case "N Tech-role":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '0' && d['IT-company'] == '0'})
      // console.log(posData, 'posData')
    break;
    case "Y Pre-employers 3":
      posData = posDataTotal.filter(d=> {return d['self-employed'] == '0' && d['IT-company'] == '0' && d['Tech-role'] == '1'})
      // console.log(posData, 'posData')
    break;
    default:
      // console.log('default!!!')
      // console.log(selectedNodeName, 'selectedNodeName')
    break;
  }
  console.log(posData, 'posData')
  
  // console.log(posData, 'success')

  nodes.each(function(d) {
    if (parent_nodes.indexOf(d.data.name) > -1) {
      d3.select(this).style("fill", "#00ffd4");
    } else {
      d3.select(this). style("fill", "white");
    }
    if (d.data.name == 'N') {
      d3.select(this).style("fill", "#aaa")
    }
  });

  link.each(function(d) {
      if (parent_links.indexOf(d.source.data.name + " To " + d.target.data.name) > -1) {
          d3.select(this).style("stroke", "#00ffd4");
      } else {
          d3.select(this). style("stroke", "white");
      }
      if (d.source.data.name == 'N Tech-role' && d.target.data.name == 'N') {
      d3.select(this).style("stroke", "#aaa")
    }
  });
});
  
var texts = node.append("text")
.attr("dx", function(d) { return d.children ? -8 : 8; })
.attr("dy", 15)
.style("text-anchor", "middle"/*function(d) { return d.children ? "end" : "start"; }*/)
.style("fill", "#aaa")
.style("stroke", "#aaa")
.style("stroke-width", 0.1)
.style("font-size", 10)
.text(function(d) { return d.data.name; });
