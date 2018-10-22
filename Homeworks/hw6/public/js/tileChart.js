/** Class implementing the tileChart. */
class TileChart {

    /**
     * Initializes the svg elements required to lay the tiles
     * and to populate the legend.
     */
    constructor(){
        // Follow the constructor method in yearChart.js
        // assign class 'content' in style.css to tile chart







        // Legend
        let legendHeight = 150;
        //add the svg to the div
        let legend = d3.select("#legend").classed("tile_view",true);

        // creates svg elements within the div
        this.legendSvg = legend.append("svg")
                            .attr("width",this.svgWidth)
                            .attr("height",legendHeight)
                            .attr("transform", "translate(" + this.margin.left + ",0)");
        
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
            text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"\t("+row.percentage+"%)" + "</li>"
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

        //for reference:https://github.com/Caged/d3-tip
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
        
        let legendQuantile = d3.legendColor()
            .shapeWidth((this.svgWidth - 2*this.margin.left - this.margin.right)/12)
            .cells(10)
            .orient('horizontal')
            .labelFormat(d3.format('.1r'))
            .scale(colorScale);


            






















            
    };


}