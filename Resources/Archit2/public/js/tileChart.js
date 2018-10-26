/** Class implementing the tileChart. */
class TileChart {

    /**
     * Initializes the svg elements required to lay the tiles
     * and to populate the legend.
     */
    constructor(){
        // Follow the constructor method in yearChart.js
        // assign class 'content' in style.css to tile chart
        this.divTile = d3.select('#tiles').classed('.content', true);
        this.margin = {top: 10, right: 20, bottom: 20, left: 50};
        this.svgBounds = {'width': 1200};
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 800;

        this.tileSvg = this.divTile.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)

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

        this.tileGroup = this.tileSvg.append('g').attr('id', 'tileGroup');
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
            if(row.percentage != "") {
            text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"\t("+row.percentage+"%)" + "</li>"
            }
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
    update(electionResult, colorScale){
        //for reference:https://github.com/Caged/d3-tip
        //Use this tool tip element to handle any hover over the chart
        let dPopularPercentage = parseFloat(electionResult[0].D_PopularPercentage);
        let rPopularPercentage = parseFloat(electionResult[0].R_PopularPercentage);
        let iPopularPercentage = parseFloat(electionResult[0].I_PopularPercentage != "" ? electionResult[0].I_PopularPercentage : 0);

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

                    "result": [
                        {"nominee": electionResult[0].D_Nominee_prop,"votecount": electionResult[0].D_Votes_Total,"percentage": dPopularPercentage,"party":"D"},
                        {"nominee": electionResult[0].R_Nominee_prop,"votecount": electionResult[0].R_Votes_Total,"percentage": rPopularPercentage,"party":"R"},
                        {"nominee": electionResult[0].I_Nominee_prop,"votecount": electionResult[0].I_Votes_Total,"percentage": iPopularPercentage,"party":"I"}
                    ]
                 };
                 return that.tooltip_render(tooltip_data);
        });

        // ******* TODO: PART IV *******
        // Transform the legend element to appear in the center
        // make a call to this element for it to display.

        // Lay rectangles corresponding to each state according to the 'row' and 'column' information in the data.
        // column is coded as 'Space' in the data.
        this.tileSvg.call(this.tip);
        let that = this;

        let tileWidth = this.svgWidth / 12;
        let tileHeight = this.svgHeight / 8;
        console.log(electionResult);

        d3.selectAll('#splitState').remove();
        let tileRects = this.tileGroup.selectAll('rect').data(electionResult);
        tileRects.exit().remove();
        tileRects = tileRects.enter()
            .append('rect')
            .merge(tileRects)
            // .transition()
            .attr('x', d => d.Space * tileWidth)
            .attr('y', d => d.Row * tileHeight)
            .attr('width', this.svgWidth / 12)
            .attr('height', this.svgHeight / 8)
            .attr('class', 'tile')
            .attr('fill', d => colorScale(d.RD_Difference))
            .attr('id', d => d.State)
            .on("mouseover", that.tip.show)
            .on("mouseout", that.tip.hide);

        // Display the state abbreviation and number of electoral votes on each of these rectangles
        let tileText = this.tileGroup.selectAll('text').data(electionResult);
        tileText.exit().remove();
        tileText = tileText.enter()
            .append('text')
            .merge(tileText)
            .text(d => d.Abbreviation)
            .attr('text-anchor', 'middle')
            .attr('x', d => d.Space * tileWidth + tileWidth / 2)
            .attr('y', d => d.Row * tileHeight + tileHeight / 2)
            .attr('class', 'tileText')
            .append('tspan')
            .attr('x', d => d.Space * tileWidth + tileWidth / 2)
            .attr('dy', 20)
            .attr('text-anchor', 'middle')
            .attr('class', 'tileText')
            .text(d => d.Total_EV);

        //  Handle split electoral votes
        let splitState = electionResult.find(d => ((d.D_EV != '' && d.R_EV != '') || (d.D_EV != '' && d.I_EV != '') || (d.R_EV != '' && d.I_EV != '')));
        if(splitState) {
            let data = [['D', splitState, splitState.D_EV], ['R', splitState, splitState.R_EV], ['I', splitState, splitState.I_EV]];
            console.log(data);
            // let splitRect = d3.select('#'+splitEVState.State).selectAll('rect').data(data);
            // splitRect.exit().remove();
            data.forEach(d => {
                console.log(d[1].RD_Difference * d[2] / d[1].Total_EV);
                d3.select('#tileGroup')
                    .append('rect')
                    .attr('x', d[0] == 'R' ?( d[1].Space * tileWidth) : (d[1].Space * tileWidth + (1 - d[2]/d[1].Total_EV) * tileWidth))
                    .attr('y', d[1].Row * tileHeight)
                    .attr('width', d[2] / d[1].Total_EV * (this.svgWidth / 12))
                    .attr('height', this.svgHeight / 8)
                    .attr('class', 'tile')
                    .attr('fill', colorScale(d[1].RD_Difference * d[2] / d[1].Total_EV * (d[0] == 'R' ? -1 : 1)))
                    .attr('id', 'splitState');
            });
            d3.select('#tileGroup')
                .append('text')
                .text(splitState.Abbreviation)
                .attr('text-anchor', 'middle')
                .attr('x', splitState.Space * tileWidth + tileWidth / 2)
                .attr('y', splitState.Row * tileHeight + tileHeight / 2)
                .attr('class', 'tileText')
                .append('tspan')
                .attr('x', splitState.Space * tileWidth + tileWidth / 2)
                .attr('dy', 20)
                .attr('text-anchor', 'middle')
                .attr('class', 'tileText')
                .text(splitState.Total_EV);
        }

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
