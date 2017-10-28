var svg = d3.select('svg').append('g').attr('transform','translate(50,50)');

//add the Architecture Axonic Drawing as background

var defs = svg.append('defs');
defs.append('pattern')
    .attr('id','bg')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', 1250)
    .attr('height', 700)
    .append('image')
    .attr('xlink:href', 'Background_Single.png')
    .attr('width', 1250)
    .attr('height', 700)
    .attr('x', 0)
    .attr('y', 0);

svg.append('rect')
    .attr('width', 1250)
    .attr('height', 700)
    .attr('fill', 'url(#bg)');


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


    //Version_01 tooltips to show information
    /*svg.selectAll('circles')
        .data(dataIn)
        .enter()
        .append('circle')
        .attr('class','c_dataPoints')
        .attr('data-toggle', 'tooltip')
        .attr('title', function(d){
            if (d.r == 13){
                return d.y;
            }
            else
                return;

        });

         $('[data-toggle="tooltip"]').tooltip();
         */


    //Version_02 mouseover, mouseout function to reaction
   /* svg.selectAll('circles')
        .data(dataIn)
        .enter()
        .append('circle')
        .attr('class','c_dataPoints')
        .on('mouseover', function(d){
            if (d.r == 13){

                d3.select(this)
                    .transition()
                    .style('fill', 'pink')
                    .attr('r', 45)
                    .delay(500)
                    .duration(2500)
                    .ease(d3.easeBounce);

            }
            else
                return;
        })
        .on('mouseout', function(d){
           d3.select(this)
                .transition()
                .style('fill', function(d){
                    return d.fill;
                })
                .attr('r', function(d){
                    return d.r;
                })
                .delay(500)
                .duration(2500)
                .ease(d3.easeBounce);

        });*/



    //Version_03 mouseover, mouseout function to draw bars
    svg.selectAll('circles')
        .data(dataIn)
        .enter()
        .append('circle')
        .attr('class','c_dataPoints')
        .on('mouseover', function(d){
            if (d.r == 13){

                console.log(barData);

                svg.selectAll('.bars')
                    .data(barData)
                    .enter()
                    .append('rect')
                    .attr('class', 'bars')
                    .attr('fill', 'slategray');
                drawBars(barData);
            }
            else
                return;
        })
        .on('mouseout', function(d){

        });



//console.log(dataIn[0]);
    //call the drawPoints function below, and hand it the data2016 variable with the 2016 object array in it
    drawPoints(dataIn);

//console.log(dataIn[0].x);
//console.log(dataIn[0].y);
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

console.log(barData);



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

function drawBars(barData){
    svg.selectAll('.bars')
        .data(barData)
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