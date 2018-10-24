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
        // this.svgBounds = divyearChart.node().getBoundingClientRect();
        this.svgBounds = {'width': 1800};
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
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
        let that = this;

        //Domain definition for global color scale
        let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

        //Color range for global color scale
        let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];

        //ColorScale be used consistently by all the charts
        this.colorScale = d3.scaleQuantile()
            .domain(domain)
            .range(range);

        this.position = d3.scaleLinear()
            .domain([0, this.electionWinners.length])
            .range([this.margin.left, this.svgWidth])

        // ******* TODO: PART I *******
        // Style the chart by adding a dashed line that connects all these years.
        // HINT: Use .lineChart to style this dashed line
        this.svg.append('line')
        .attr('x1', 0)
        .attr('y1', this.margin.top + 20)
        .attr('x2', this.svgWidth)
        .attr('y2', this.margin.top + 20).attr('class', 'lineChart')

        // Create the chart by adding circle elements representing each election year
        // The circles should be colored based on the winning party for that year
        // HINT: Use the .yearChart class to style your circle elements
        // HINT: Use the chooseClass method to choose the color corresponding to the winning party.
        let radius = 15;
        let circles = this.svg.selectAll('circle').data(this.electionWinners);
        circles.exit().remove();
        circles = circles.enter()
            .append('circle')
            .merge(circles)
            .attr('cx', (d, i) => this.position(i))
            .attr('cy', this.margin.top + 20)
            .attr('r', radius)
            .attr('class', d => this.chooseClass(d['PARTY']))
            .classed('yearChart', true)

        // Append text information of each year right below the corresponding circle
        // HINT: Use .yeartext class to style your text elements
        let yearText = this.svg.selectAll('text').data(this.electionWinners);
        yearText.exit().remove();
        yearText = yearText.enter()
            .append('text')
            .merge(yearText)
            .attr('x', (d, i) => this.position(i))
            .attr('y', this.margin.top + 20 + 2 * radius + 10)
            .html(d => d['YEAR'])
            .classed('yeartext', true);


        // Clicking on any specific year should highlight that circle and  update the rest of the visualizations
        // HINT: Use .highlighted class to style the highlighted circle
        circles.on("mouseover", function() {d3.select(this).classed('highlighted', true)})
            .on("mouseout", function() {d3.select(this).classed('highlighted', false)})
            // Election information corresponding to that year should be loaded and passed to
            // the update methods of other visualizations
            .on("click", function(d) {
                    that.clearSelection();
                    d3.select(this).classed('selected', true);
                    that.loadYearData(d['YEAR']).then(yearData => {that.electoralVoteChart.update(yearData, that.colorScale)});
                });

        // Note: you may want to initialize other visulaizations using some election from the get go, rather than waiting for a click (the reference solution uses 2012)

       //******* TODO: EXTRA CREDIT *******
       //Implement brush on the year chart created above.
       //Implement a call back method to handle the brush end event.
       //Call the update method of shiftChart and pass the data corresponding to brush selection.
       //HINT: Use the .brush class to style the brush.
    };

    clearSelection() {
        this.svg.selectAll('circle').classed('selected', false);
    }

    loadYearData(year) {
        return d3.csv("data/Year_Timeline_" + year + '.csv')
    }
};
