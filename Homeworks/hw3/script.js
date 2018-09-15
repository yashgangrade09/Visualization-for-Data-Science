/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */


function sort2Number(a, b){
    return (+a - +b);
}

function mouseHover(){

}

function staircase() {
    // ****** TODO: PART II ******
    let bar_chart = document.getElementById("aBarChart");
    let bar_chart_child = bar_chart.children;
    let bar_chart_updated = [];

    //bar_chart_child = new Array()

    let i = 0;

    for (let iterator of bar_chart_child) {
        bar_chart_updated[i] = iterator.attributes.width.nodeValue; 
        i+=1;
    }
    
    bar_chart_updated.sort(sort2Number);
    i = 0;
    for(let iterator of bar_chart_child){
        iterator.attributes.width.nodeValue = bar_chart_updated[i];
        i+=1;
    }
}

/**
 * Render the visualizations
 * @param data
 */
function update(data) {
    /** 
     * D3 loads all CSV data as strings. While Javascript is pretty smart
     * about interpreting strings as numbers when you do things like
     * multiplication, it will still treat them as strings where it makes
     * sense (e.g. adding strings will concatenate them, not add the values
     * together, or comparing strings will do string comparison, not numeric 
     * comparison).
     *
     * We need to explicitly convert values to numbers so that comparisons work
     * when we call d3.max()
     **/
    for (let d of data) {
        d.a = +d.a; //unary operator converts string to number
        d.b = +d.b; //unary operator converts string to number
    }

    // Set up the scales
    let aScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.a)])
        .range([0, 140]);
    let bScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.b)])
        .range([0, 140]);
    let iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([10, 120]);


    // ****** TODO: PART III (you will also edit in PART V) ******

    // ********************************************************** BAR CHARTS ************************************************************** //

    // TODO: Select and update the 'a' bar chart bars

    // Selecting the first bar chart using the given ID
    let bar_chart_a = d3.select("#aBarChart");

    //Selecting all the rectangles from the bar chart and binding the data
    let bar_chart_a_rect_selection = bar_chart_a.selectAll("rect").data(data);
    
    // creating new rectangles in the enter 
    let new_bar_chart_a_rect_selection = bar_chart_a_rect_selection.enter()
                                                                   .append("rect")
                                                                   .attr("x", 0)
                                                                   .attr("y", (d, i) => iScale(i))
                                                                   .attr("width", 0)
                                                                   .attr("height", 10);


    // removing any left rectangles in the bar chart                                                                
    bar_chart_a_rect_selection.exit()
                              .remove();

    // merge process to get the updated bar charts                              
    bar_chart_a_rect_selection = new_bar_chart_a_rect_selection.merge(bar_chart_a_rect_selection);

    // final transition of the updated bar charts
    bar_chart_a_rect_selection.transition()
                              .duration(1500)
                              .attr("y", (d, i) => iScale(i))
                              .attr("x", 0)
                              .attr("width", (d, i) => aScale(d.a))
                              .attr("height", 10)
                              .style("opacity", 1); 

    // TODO: Select and update the 'b' bar chart bars

    // same comments as the previous part

    let bar_chart_b = d3.select("#bBarChart");
    let bar_chart_b_rect_selection = bar_chart_b.selectAll("rect").data(data);
    
    let new_bar_chart_b_rect_selection = bar_chart_b_rect_selection.enter()
                                                                   .append("rect")
                                                                   .attr("x", 0)
                                                                   .attr("y", (d, i) => iScale(i))
                                                                   .attr("width", 0)
                                                                   .attr("height", 10);

    bar_chart_b_rect_selection.exit()
                              .remove();
                              
    bar_chart_b_rect_selection = new_bar_chart_b_rect_selection.merge(bar_chart_b_rect_selection);

    bar_chart_b_rect_selection.transition()
                              .duration(1500)
                              .attr("y", (d, i) => iScale(i))
                              .attr("x", 0)
                              .attr("width", (d, i) => bScale(d.b))
                              .attr("height", 10)
                              .attr("opacity", 1); 


    // ********************************************************** LINE CHARTS ************************************************************** //

    // TODO: Select and update the 'a' line chart path using this line generator

    let aLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => aScale(d.a));

    // select the line chart using the line chart ID
    let line_chart_a = d3.select("#aLineChart")

    // updated line chart created using the data from line generator
    let new_line_chart_a = line_chart_a.transition()
                                       .duration(1000)
                                       .attr("d", aLineGenerator(data))
                                       .attr("opacity", 1);

    // TODO: Select and update the 'b' line chart path (create your own generator)

    let bLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => bScale(d.b));

    let line_chart_b = d3.select("#bLineChart")

     let new_line_chart_b = line_chart_b.transition()
                                         .duration(1000)
                                         .attr("d", bLineGenerator(data))
                                         .attr("opacity", 1);

    // ********************************************************** AREA CHARTS ************************************************************** //

    // TODO: Select and update the 'a' area chart path using this area generator
    let aAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => aScale(d.a));

    // select the area chart using the area chart ID
    let area_chart_a = d3.select("#aAreaChart");

    // updated area chart created using the data from area generator
    let new_area_chart_a = area_chart_a.transition()
                                       .duration(1000)
                                       .attr("d", aAreaGenerator(data))
                                       .attr("opacity", 1);


    // TODO: Select and update the 'b' area chart path (create your own generator)

    let bAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => bScale(d.b));

    let area_chart_b = d3.select("#bAreaChart");

    let new_area_chart_b = area_chart_b.transition()
                                         .duration(1000)
                                         .attr("d", bAreaGenerator(data))
                                         .attr("opacity", 1);


    // ********************************************************** SCATTER CHARTS ************************************************************** //
    // TODO: Select and update the scatterplot points

    // select the scatter chart svg using chart id
    let scatter_chart = d3.select("#scatterplot");

    let scatter_chart_circle_selection = scatter_chart.selectAll("circle").data(data);
    
    let new_scatter_chart_circle_selection = scatter_chart_circle_selection.enter()
                                                                   .append("circle")
                                                                   .attr("cx", d => aScale(d.a))
                                                                   .attr("cy", d => bScale(d.b))
                                                                   .attr("r", 5);

    scatter_chart_circle_selection.exit()
                                  .remove();

    scatter_chart_circle_selection = new_scatter_chart_circle_selection.merge(scatter_chart_circle_selection);

    scatter_chart_circle_selection.transition()
                                  .duration(1500)
                                  .attr("cx", d => aScale(d.a))
                                  .attr("cy", d => bScale(d.b))
                                  .attr("r", 5);

    // // ****** TODO: PART IV ******

    // ******** Using D3 to implement mousehover and mouseout functions *************** //
    // bar_chart_a_rect_selection.on("mouseover", function(d, i){d3.select(this).style("fill", "red")});
    // bar_chart_a_rect_selection.on("mouseout", function(d, i){d3.select(this).style("fill", "#694882")});
    // bar_chart_b_rect_selection.on("mouseover", function(d, i){d3.select(this).style("fill", "red")});
    // bar_chart_b_rect_selection.on("mouseout", function(d, i){d3.select(this).style("fill", "#694882")});

    aRects = document.getElementById("aBarChart").children;

    for (var i = 0; i < aRects.length; i++) {
        aRects[i].onmouseover = function() {this.style.fill = "red";};
        aRects[i].onmouseout = function() {this.style.fill = "#694882";};
    }

    bRects = document.getElementById("bBarChart").children;

    for (var i = 0; i < bRects.length; i++) {
        bRects[i].onmouseover = function() {this.style.fill = "red";};
        bRects[i].onmouseout = function() {this.style.fill = "#694882";};
    }

    scatter_chart_circle_selection.on("click", function(d, i){console.log("x: " + d.a + ", y: " + d.b);});
    
    scatter_chart_circle_selection.on("mouseover", function(d, i){
        let coordinates = d3.mouse(this);
        let temp = d3.select(this)
                     .append("title")
                     .text("Actual Mouse Coordinates ->\n x: " + coordinates[0] + ", y: " + coordinates[1] + "\n Data Point Coordinates ->\n x: " + d.a + ", y: " + d.b);
    });

    scatter_chart_circle_selection.on("mouseout", function(d, i){scatter_chart_circle_selection.selectAll("title").remove();});
}

/**
 * Update the data according to document settings 
 */
async function changeData() {
    //  Load the file indicated by the select menu
    let dataFile = document.getElementById('dataset').value;
    try{
        const data = await d3.csv('data/' + dataFile + '.csv'); 
        if (document.getElementById('random').checked) { // if random
            update(randomSubset(data));                  // update w/ random subset of data
        } else {                                         // else
            update(data);                                // update w/ full data
        }
    } catch (error) {
        
        alert('Could not load the dataset!');
    }
}

/**
 *  Slice out a random chunk of the provided in data
 *  @param data
 */
function randomSubset(data) {
    return data.filter( d => (Math.random() > 0.5));
}