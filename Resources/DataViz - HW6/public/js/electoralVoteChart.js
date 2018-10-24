class ElectoralVoteChart {
    /**
     * Constructor for the ElectoralVoteChart
     *
     * @param trendChart an instance of the ShiftChart class
     */
    constructor (trendChart){

        // Follow the constructor method in yearChart.js
        // assign class 'content' in style.css to electoral-vote chart
        this.trendChart = trendChart;

        //fetch the svg bounds
        // this.svgBounds = divyearChart.node().getBoundingClientRect();
        this.margin = {top: 10, right: 20, bottom: 20, left: 50};
        this.svgBounds = {'width': 900};
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 100;

        //add the svg to the div
        let divElectVoteChart = d3.select("#electoral-vote");
        this.svg = divElectVoteChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)

        this.d_svg = this.svg.append('g').attr('id', 'd_votes');
        this.r_svg = this.svg.append('g').attr('id', 'r_votes').attr('transform', 'translate(0, 40)');

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
        else if (party == "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    }

    createStacked(series, key) {
        let total = 0;
        let result = [];
        for (var i = 0; i < series.length; i++) {
            let x = total;
            total = total + parseInt(series[i][key]);
            result.push({'start': x, 'end': total, 'data': series[i]});
        }
        return result;
    }

    /**
     * Creates the stacked bar chart, text content and tool tips for electoral vote chart
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */

    update (electionResult, colorScale){

        // ******* TODO: PART II *******
        // Group the states based on the winning party for the state;
        // then sort them based on the margin of victory

        let position = d3.scaleLinear()
            .domain([0, 450])
            .range([this.margin.left, this.svgWidth])

        let that = this;

        try{
            let voteData = d3.nest()
                .key(d => d.State_Winner)
                .entries(electionResult);

            // console.log(voteData);    
            let democrat_data = voteData.find(d => d.key === 'D');
            democrat_data.values.sort(function(x, y) {return x.RD_Difference - y.RD_Difference})
            // console.log(democrat_data);
            let d_stacked = that.createStacked(democrat_data.values, 'D_EV');
            // console.log(d_stacked);

            let republican_data = voteData.find(d => d.key === 'R');
            republican_data.values.sort(function(x, y) {return y.RD_Difference - x.RD_Difference})
            let r_stacked = that.createStacked(republican_data.values, 'R_EV');

            let democrat_bars = that.d_svg.selectAll('rect').data(d_stacked);
            democrat_bars.exit().transition().remove();
            democrat_bars = democrat_bars.enter()
                .append('rect')
                .merge(democrat_bars)
                .transition()
                .attr('x', d => position(d['start']))
                .attr('y', 0)
                .attr('width', d => position(d['end']) - position(d['start']))
                .attr('height', 20)
                .attr('fill', d => colorScale(d.data.RD_Difference))
                .attr('stroke', 'white')
                .attr('stroke-width', '1px');


            console.log(d_stacked);
            console.log(r_stacked);

            let republican_bars = that.r_svg.selectAll('rect').data(r_stacked);
            republican_bars.exit().transition().remove();
            republican_bars = republican_bars.enter()
                .append('rect')
                .merge(republican_bars)
                .transition()
                .attr('x', d => position(d['start']))
                .attr('y', 0)
                .attr('width', d => position(d['end']) - position(d['start']))
                .attr('height', 20)
                .attr('fill', d => colorScale(d.data.RD_Difference))
                .attr('stroke', 'white')
                .attr('stroke-width', '1px');

        }
        catch(error) {
            console.log(error);
        }

        // console.log(voteData[0].value.map(d => d.D_EV));
        // Create the stacked bar chart.
        // Use the global color scale to color code the rectangles for Democrates and Republican.
        // Use #089c43 to color Independent party.
        // HINT: Use .electoralVotes class to style your bars.

        // Display total count of electoral votes won by the Democrat, Republican and Independent party(if there's candidate).
        // on top of the corresponding groups of bars.
        // HINT: Use the .electoralVoteText class to style your text elements; Use this in combination with
        // Use chooseClass method to get a color based on the party wherever necessary

        // Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
        // HINT: Use .middlePoint class to style this bar.

        // Just above this, display the text mentioning the total number of electoral votes required
        // to win the elections throughout the country
        // HINT: Use .electoralVotesNote class to style this text element
        // HINT: Use the chooseClass method to style your elements based on party wherever necessary.










       //******* TODO: PART V *******

       //Implement brush on the bar chart created above.
       //Implement a call back method to handle the brush end event.
       //Call the update method of shiftChart and pass the data corresponding to brush selection.
       //HINT: Use the .brush class to style the brush.










    };


}
