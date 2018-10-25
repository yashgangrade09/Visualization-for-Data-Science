class YearChart {

    /**
     * Constructor for the Year Chart
     *
     * @param electoralVoteChart instance of ElectoralVoteChart
     * @param tileChart instance of TileChart
     * @param votePercentageChart instance of Vote Percentage Chart
     * @param electionInfo instance of ElectionInfo
     * @param electionWinners data corresponding to the winning parties over mutiple election years
     */
    constructor (electoralVoteChart, tileChart, votePercentageChart, electionWinners) {

        //Creating YearChart instance
        this.electoralVoteChart = electoralVoteChart;
        this.tileChart = tileChart;
        this.votePercentageChart = votePercentageChart;
        // the data
        this.electionWinners = electionWinners;
        
        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 20, bottom: 20, left: 50};
        
        let divyearChart = d3.select("#year-chart").classed("fullview", true);

        //fetch the svg bounds
        this.svgBounds = divyearChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        // this.svgWidth = 1500;
        this.svgHeight = 150;

        //add the svg to the div
        this.svg = divyearChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (party) {
        if (party == "R") {
            return "yearChart republican";
        }
        else if (party == "D") {
            return "yearChart democrat";
        }
        else if (party == "I") {
            return "yearChart independent";
        }
    }

    /**
     * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
     */
    update () {
        try{
                //Domain definition for global color scale
                let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];
        
                //Color range for global color scale
                let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];
        
                //ColorScale be used consistently by all the charts
                this.colorScale = d3.scaleQuantile()
                    .domain(domain)
                    .range(range);
                
                // ******* TODO: PART I *******
                // Create the chart by adding circle elements representing each election year
                // The circles should be colored based on the winning party for that year
                // HINT: Use the .yearChart class to style your circle elements
                // HINT: Use the chooseClass method to choose the color corresponding to the winning party.
        
                // Append text information of each year right below the corresponding circle
                // HINT: Use .yeartext class to style your text elements
               
                // Style the chart by adding a dashed line that connects all these years.
                // HINT: Use .lineChart to style this dashed line
               
                // Clicking on any specific year should highlight that circle and  update the rest of the visualizations
                // HINT: Use .highlighted class to style the highlighted circle
               
                // Election information corresponding to that year should be loaded and passed to
                // the update methods of other visualizations
        
                // Note: you may want to initialize other visulaizations using some election from the get go, rather than waiting for a click (the reference solution uses 2012)
        
                let that = this;
        
                let lineChartSvg = this.svg.append("line")
                                       .attr("x1", 0)
                                       .attr("y1", this.svgHeight - 80)
                                       .attr("x2", this.svgWidth)
                                       .attr("y2", this.svgHeight - 80)
                                       .classed("lineChart", true);
                
                let circlesLineChart = this.svg.selectAll("circle").data(this.electionWinners);
                let circlesEnter = circlesLineChart.enter().append("circle");
                // console.log(this.electionWinners);
                circlesLineChart.exit().remove();
                circlesLineChart = circlesLineChart.merge(circlesEnter);

                circlesLineChart.attr("cx", (d, i) => 70*i + 20)
                                .attr("cy", this.svgHeight - 80)
                                .attr("r", 12)
                                .attr("class", d => (that.chooseClass(d.PARTY)))
                                .on("mouseover", function() {d3.select(this).classed('highlighted', true)})
                                .on("mouseout", function() {d3.select(this).classed('highlighted', false)})
                                .on("click", function(d){
                                    d3.selectAll(".highlighted").classed("highlighted", false);
                                    d3.selectAll(".selected").classed("selected", false)
                                    d3.selectAll(".yearChart").attr("r", 12);
                                    d3.select(this).classed("selected", true).attr("r", 18);
                                    // d3.select(this).classed("highlighted", true).attr("r", 18);
                                    // console.log("on click");
                                    let yearArgs = "data/Year_Timeline_" + d.YEAR + ".csv";
                                    // d3.csv(yearArgs).then(
                                    //     electoralVoteData => {that.electoralVoteChart.update(electoralVoteData, that.colorScale)}
                                    //     );
                                    d3.csv(yearArgs).then(function(electionData){
                                        that.electoralVoteChart.update(electionData, that.colorScale);
                                        that.votePercentageChart.update(electionData);
                                        that.tileChart.update(electionData, that.colorScale);
                                    });
                                });

        
                let textCircles = this.svg.selectAll("text").data(this.electionWinners);
                let textCirclesEnter = textCircles.enter().append("text");

                textCircles.exit().remove();
                textCircles = textCircles.merge(textCirclesEnter);

                textCircles.attr("x", (d, i) => 70*i )
                           .attr("y", (d, i) => this.svgHeight - 45)
                           .text(d => d.YEAR)
                           .classed("yearText", true);

               //******* TODO: EXTRA CREDIT *******
               //Implement brush on the year chart created above.
               //Implement a call back method to handle the brush end event.
               //Call the update method of shiftChart and pass the data corresponding to brush selection.
               //HINT: Use the .brush class to style the brush.
        }
        catch(error){
            console.log(error);
        }
    };

};