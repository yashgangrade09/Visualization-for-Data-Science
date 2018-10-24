/** Class implementing the tileChart. */
class TileChart {

    /**
     * Initializes the svg elements required to lay the tiles
     * and to populate the legend.
     */
    constructor(){
        // Follow the constructor method in yearChart.js
        // assign class 'content' in style.css to tile chart
        let divTileChart = d3.select("#tiles").classed("content", true);
        this.margin = {top: 20, right: 20, bottom: 20, left: 20};

        // Legend
        let legendHeight = 150;
        //add the svg to the div
        let svgBounds = divTileChart.node().getBoundingClientRect();
        this.svgWidth = svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgWidth/2;

        let legend = d3.select("#legend").classed("tile_view",true);
        // creates svg elements within the div
        this.legendSvg = legend.append("svg")
                            .attr("width",this.svgWidth)
                            .attr("height",legendHeight)
                            .attr("transform", "translate(" + this.margin.left + ",0)");
        
        this.svg = divTileChart.append("svg")
                                .attr("width",this.svgWidth)
                                .attr("height",this.svgHeight)
                                .attr("transform", "translate(" + this.margin.left + ",0)")

        // Intialize tool-tip
        this.tip = d3.tip().attr('class', 'd3-tip')
            .direction('se')
            .offset(function() {
                return [0,0];
            })
    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (party) {
        if (party == "R"){
            return "republican";
        }
        else if (party== "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    }

    /**
     * Renders the HTML content for tool tip.
     *
     * @param tooltip_data information that needs to be populated in the tool tip
     * @return text HTML content for tool tip
     */
    tooltip_render(tooltip_data) {
        let text = "<h2 class ="  + this.chooseClass(tooltip_data.winner) + " >" + tooltip_data.state + "</h2>";
        text +=  "Electoral Votes: " + tooltip_data.electoralVotes;
        text += "<ul>"
        tooltip_data.result.forEach((row)=>{
            if(row.percentage !== "")
                text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"\t("+row.percentage+"%)" + "</li>";
        });
        text += "</ul>";

        return text;
    }

    /**
     * Creates tiles and tool tip for each state, legend for encoding the color scale information.
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */
    update (electionResult, colorScale){

        try{//for reference:https://github.com/Caged/d3-tip
                //Use this tool tip element to handle any hover over the chart
                    this.tip.html((d)=>{
                            /* populate data in the following format
                             * tooltip_data = {
                             * "state": State,
                             * "winner":d.State_Winner
                             * "electoralVotes" : Total_EV
                             * "result":[
                             * {"nominee": D_Nominee_prop,"votecount": D_Votes,"percentage": D_Percentage,"party":"D"} ,
                             * {"nominee": R_Nominee_prop,"votecount": R_Votes,"percentage": R_Percentage,"party":"R"} ,
                             * {"nominee": I_Nominee_prop,"votecount": I_Votes,"percentage": I_Percentage,"party":"I"}
                             * ]
                             * }
                             * pass this as an argument to the tooltip_render function then,
                             * return the HTML content returned from that method.
                             * */
                       let tooltip_data = {
                           "state": d.State,
                           "winner":d.State_Winner,
                           "electoralVotes" : d.Total_EV,
                           "result":[
                               {"nominee": d.D_Nominee_prop,"votecount": d.D_Votes,"percentage": d.D_Percentage,"party":"D"} ,
                               {"nominee": d.R_Nominee_prop,"votecount": d.R_Votes,"percentage": d.R_Percentage,"party":"R"} ,
                               {"nominee": d.I_Nominee_prop,"votecount": d.I_Votes,"percentage": d.I_Percentage,"party":"I"}
                           ]
                    };
                       
                    return that.tooltip_render(tooltip_data);  
                });
        
                // ******* TODO: PART IV *******
                // Transform the legend element to appear in the center 
                // make a call to this element for it to display.
        
                // Lay rectangles corresponding to each state according to the 'row' and 'column' information in the data.
                // column is coded as 'Space' in the data.
        
                // Display the state abbreviation and number of electoral votes on each of these rectangles
        
                // Use global color scale to color code the tiles.
        
                // HINT: Use .tile class to style your tiles;
                // .tilestext to style the text corresponding to tiles
        
                //Call the tool tip on hover over the tiles to display stateName, count of electoral votes
                //then, vote percentage and number of votes won by each party.
                //HINT: Use the .republican, .democrat and .independent classes to style your elements.
                //Creates a legend element and assigns a scale that needs to be visualized
                let that = this;
                let legendQuantile = d3.legendColor()
                    .shapeWidth((this.svgWidth - 2*this.margin.left - this.margin.right)/12)
                    .cells(10)
                    .orient('horizontal')
                    .labelFormat(d3.format('.1r'))
                    .scale(colorScale);
        
        
                let legendChart = this.legendSvg.append("g")
                                                .attr("class", "legendQuantile")
                                                .style("font-size", "12px")
                                                .attr("transform", "translate(60, 40)");
        
                this.legendSvg.select(".legendQuantile").call(legendQuantile);
                console.log(electionResult);
                
                let maxCols = d3.max(electionResult, d => parseInt(d.Space));    
                let minCols = d3.min(electionResult, d => parseInt(d.Row))
        
                let tileWidth = this.svgWidth/12;
                let tileHeight = this.svgHeight/8;
        
                let tilesMap = this.svg.selectAll(".tile").data(electionResult);
                let tilesMapEnter = tilesMap.enter().append("rect");
        
                tilesMap.exit().remove();
                tilesMap = tilesMap.merge(tilesMapEnter);
        
                tilesMap.attr("x", d => (tileWidth * d.Space))
                        .attr("y", d => (tileHeight * d.Row))
                        .attr("width", tileWidth)
                        .attr("height", tileHeight)
                        .attr("fill", d => colorScale(d.RD_Difference))
                        // .attr("class", d => that.chooseClass(d.State_Winner))
                        .classed("tile", true);
        
        
                let tilesTextMap = this.svg.selectAll(".tilestext.name").data(electionResult);
                let tilesTextMapEnter = tilesTextMap.enter().append("text");

                tilesTextMap.exit().remove()
                tilesTextMap = tilesTextMap.merge(tilesTextMapEnter);

                tilesTextMap.attr("x", d => (0.5 * tileWidth + (tileWidth*d.Space)))
                            .attr("y", d => (0.5 * tileHeight + (tileHeight*d.Row)))
                            .text(d => d.Abbreviation)
                            .attr("class", "name")
                            .classed("tilestext", true);
        
                let tilesTextMapValue = this.svg.selectAll(".tilestext.ev").data(electionResult);
                let tilesTextMapValueEnter = tilesTextMapValue.enter().append("text");
                
                tilesTextMapValue.exit().remove();
                tilesTextMapValue = tilesTextMapValue.merge(tilesTextMapValueEnter);

                tilesTextMapValue.attr("x", d => (0.5 * tileWidth + (tileWidth*d.Space)))
                                 .attr("y", d => (0.5 * tileHeight + (tileHeight*d.Row) + 25))
                                 .text(d => d.Total_EV)
                                 .attr("class", "ev")
                                 .classed("tilestext", true);
                
                this.svg.call(this.tip);
                tilesMap.on("mouseover", this.tip.show);
                tilesMap.on("mouseout", this.tip.hide);
        }
         catch(error){
            console.log(error);
         }   
    };


}