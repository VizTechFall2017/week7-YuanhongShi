var svg = d3.select('svg').append('g').attr('transform','translate(50,50)');

//add the Architecture Axonic Drawing as background
var height = 700;

var defs = svg.append('defs');
defs.append('pattern')
    .attr('id','bg')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', 1250)
    .attr('height', 700)
    .append('image')
    .attr('xlink:href', 'Background_Single.png')
    .attr('width', 1250)
    .attr('height', height)
    .attr('x', 0)
    .attr('y', 0);

svg.append('rect')
    .attr('width', 1250)
    .attr('height', height)
    .attr('fill', 'url(#bg)');

var xaixs = ['windows', 'size', 'floor', 'percentage'];

//var scaleX = d3.scaleBand().rangeRound([0, 300]).padding(0.1);
//var scaleY = d3.scaleLinear().range([200, 0]);

//import the data from the .csv file
d3.csv('./inPathData_Enclosure_2.csv', function(dataIn){

    //bind the data to the d3 selection, but don't draw it yet


    var path = svg.append('path')
        .data([dataIn])
        .attr("d", lineFunction);

    nestedData = d3.nest()
        .key(function(d){
            return d.r;
        })
        .entries(dataIn);

    var barData = nestedData.filter(function(d){
        return d.key = 13 ;
    })[1].values;



    svg.selectAll('circles')
        .data(dataIn)
        .enter()
        .append('circle')
        .attr('class','c_dataPoints')
        .on('click', function(d){
            if (d.r == 13){

                var currentId = 0;
                console.log(currentId);

                var scaleX = d3.scaleBand().rangeRound([0, 120]).padding(0.1);
                var scaleY = d3.scaleLinear().range([200,0]);
                scaleY.domain([0, d3.max(barData.map(function(d){return +d.size}))]);
                var i = 0;
                scaleX.domain(xaixs);

                //add a group of bars
                svg.append('g')
                    .attr('class','xaxis')
                    .attr('transform','translate('+d.x+', '+d.y+')')  //move the x axis from the top of the y axis to the bottom
                    .call(d3.axisBottom(scaleX))
                    .attr('opacity', .8);

                svg.append("g")
                    .attr('class', 'yaxis')
                    .attr('transform','translate('+d.x+', '+(d.y-200)+' )')
                    .call(d3.axisLeft(scaleY))
                    .attr('opacity', .8);

                var mouseoverData =[d.windows, d.size, d.floor, d.percentage];
                for (i =0; i<4; i++){

                    svg
                        .append('rect')
                        .attr('class', 'bars')
                        .attr('fill', 'pink')
                        .attr('x',(+d.x)+i*30 +10 )
                        .attr('y', d.y-scaleY(mouseoverData[i]))
                        .attr('width', 10)
                        .attr('height', scaleY(mouseoverData[i]))
                }

            }
            else
                return;
        })
        .on('mouseout', function(d){
            d3.selectAll('.bars')
                .attr('opacity', 0);
            d3.selectAll('.xaxis')
                .attr('opacity', 0);
            d3.selectAll('.yaxis')
                .attr('opacity', 0);
        });


    //call the drawPoints function below, and hand it the data2016 variable with the 2016 object array in it
    drawPoints(dataIn);

var startPoint = [dataIn[0].x,dataIn[0].y];

console.log(startPoint);

    var circle = svg.append("circle")
        .attr("r", 13)
        .attr('fill', 'pink')
        .attr("transform", "translate(" + startPoint + ")");

    transition();

    function transition() {
        circle.transition()
            .duration(20000)
            .attrTween("transform", translateAlong(path.node()))
            .on("end", transition);
    }

});




//this function draws the actual data points as circles. It's split from the enter() command because we want to run it many times
//without adding more circles each time.
function drawPoints(pointData){
    svg.selectAll('.c_dataPoints')  //select all of the circles with dataPoints class that we made using the enter() commmand above
        .data(pointData)          //re-attach them to data (necessary for when the data changes from 2016 to 2017)
        .attr('cx',function(d){   //look up values for all the attributes that might have changed, and draw the new circles
            return d.x;
        })
        .attr('cy',function(d){
            return d.y;
        })
        .attr('r', function(d){
            return d.r;
        })
        .attr('fill', function(d){
            return d.fill;
        })

}

/*function drawBars(barData){
    svg.selectAll('.bars')
        .data(barData)
        .enter()
        .attr('x', function(d){
            return d.x;
        })
        .attr('y', function(d){
            return d.y;
        })
        .attr('width', function(d){
            return d.size;
        })
        .attr('height', 10);
}
*/
var lineFunction = d3.line()
//.interpolate('cardinal')
    .x(function(d){
        return d.x;
    })
    .y(function(d){
        return d.y;
    })
    .curve(d3.curveCardinalClosed);



// Returns an attrTween for translating along the specified path element.
// Notice how the transition is slow for the first quarter of the animation
// is fast for the second and third quarters and is slow again in the final quarter
// This is normal behavior for d3.transition()
function translateAlong(path) {
    var l = path.getTotalLength();
    return function(d, i, a) {
        return function(t) {
            var p = path.getPointAtLength(t * l);
            return "translate(" + p.x + "," + p.y + ")";
        };
    };
}

function updateData(selectedYear){
    return nestedData.filter(function(d){return d.key == selectedYear})[0].values;
}
