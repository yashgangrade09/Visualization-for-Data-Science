/** Class implementing the trendChart. */
class TrendChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(electionWinners){
        this.electionWinners = electionWinners;

        this.divTrendChart = d3.select("#trendChart").classed("sideBar", true);
        this.margin = {top: 10, right: 20, bottom: 20, left: 50};
        
        this.divBrushChart = d3.select("#brushChart").attr("style", "width:100%");

        this.svgBounds = this.divBrushChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width;
        this.svgHeight = 250;

        this.chartSvgWidth = this.svgWidth - this.margin.left - this.margin.right;

        this.electionDataArray = [];
        // let that = this
        // console.log(electionWinners, this.electionDataArray);
        this.listContents = [{'party': 'D', 'brushed' : []},
                             {'party': 'R', 'brushed' : []},
                             {'party': 'I', 'brushed' : []},
                             {'partyArr': [], 'brushed' : []}];
    };

    /**
     * Creates a list of states that have been selected by brushing over the Electoral Vote Chart
     *
     * @param selectedStates data corresponding to the states selected on brush
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

    clear() {
        this.listContents = [{'party': 'D', 'brushed' : []},
                             {'party': 'R', 'brushed' : []},
                             {'party': 'I', 'brushed' : []},
                             {'partyArr': [], 'brushed' : []}];

        d3.select("#stateList ul").remove();

    }



    createGraph(that, selectedYears, selectedStates){
        try{
            let idx = 0;
            let self = this;
            // this.electionDataArray = [];
            for(let i of self.electionWinners){
                let csv = "data/Year_Timeline_" + i.YEAR + ".csv";
                 d3.csv(csv).then(electoralVoteChart => {
                        self.electionDataArray.push({"YEAR": i.YEAR, "data": electoralVoteChart});
                 });
            }
            console.log(this.electionDataArray);

            let dataSvgWidth = this.dataSvgWidth;
            let states = [], years = [], i=0;
            for(let iter of selectedStates)
            {
                if(iter)
                    states[i++] = iter;
            }
            i = 0;
            for(let iter of selectedYears)
            {
                if(iter)
                    years[i++] = parseInt(iter);
            }
            console.log(states, years);
            let minyr = d3.min(selectedYears, d=>d);
            let maxyr = d3.max(selectedYears, d=>d);

            let xScale = d3.scaleLinear()
                            .domain(years)
                            .range([7, dataSvgWidth]);

            let yScale = d3.scaleLinear()
                            .domain([-55, 55])
                            .range([that.svgHeight-that.margin.bottom, that.margin.top]);

            let xAxisScale = d3.scaleBand()
                                .domain(years)
                                .range([2,dataSvgWidth-10]);

            let yAxisScale = d3.scaleBand()
                .domain(["Democrat", "Independent", "Republican"])
                .range([that.svgHeight - that.margin.bottom, that.margin.top]);
            
            let axisx = d3.axisBottom().scale(xAxisScale);
        
            let axisy = d3.axisLeft().scale(yAxisScale);

            let aLineGenerator = d3.line()
                                .x((d) => xScale(d.YEAR))
                                .y((d) => {
                                    if(d.data.Direction == "Right")
                                        return yScale(parseFloat(d.data["Shift"]));
                                    else if(d.data.Direction == "Left")
                                        return yScale(-1 * parseFloat(d.data["Shift"]));
                                    else
                                        return yScale(0);
                                });



            let visData = [];
            let copyAllData = that.electionDataArray.slice(0, that.electionDataArray.length);
            console.log(copyAllData)
            i = 0;
            for(let iter of selectedStates){
                if(iter){
                    let array = [], j = 0;
                    for(let yriter of selectedYears)
                    {
                        let selectedyear = [];
                        for(let k of copyAllData)
                        {
                            if(parseInt(k.YEAR) == yriter)
                            {
                                selectedyear = k.data;
                                break;
                            }
                        }

                        for(let k of selectedyear)
                        {
                            if(k.State == iter){
                                array[j++] = {"YEAR": yriter, "data": k};
                                break;
                            }
                        } 
                    }
                    visData[i++] = {"State": iter, "data": array};
                }
            }
            console.log(visData);

            let svg = this.divBrushChart.selectAll("svg").data(visData);

            let newSvg = svg.enter().append("svg")
                            .attr("width", this.svgWidth)
                            .attr("height", this.svgHeight);
            
            svg.exit().remove();
            svg = newSvg.merge(svg);
            
            svg.attr("id", d=>d.State);

            let text = svg.selectAll("text.name").data(function(d){return d3.select(this).data();})
            let newText = text.enter().append("text").attr("class", "name");

            text.exit().remove();
            text = newText.merge(text);

            text.text(d=>"State: "+d.State)
                .attr("x", d=>this.svgWidth / 2 - this.margin.left)
                .attr("y", d=>this.margin.top + 40);

            let xAxis = svg.selectAll("g.xAxis").data([0]);
            let newxAxis = xAxis.enter().append("g").attr("transform", "translate(50, 230)")
                            .attr("class", "xAxis");

            xAxis.exit().remove();
            xAxis = newxAxis.merge(xAxis);

            console.log(that.margin.left +","+ (that.svgHeight - that.margin.bottom));
            
            console.log(xAxis, axisx);
            // xAxis.attr("transform", "translate("+ that.margin.left +","+ (that.svgHeight - that.margin.bottom) + ")")
            xAxis.call(axisx)
                .selectAll("text")  
                .style("text-anchor", "end")
                .attr("dx", "-.9em")
                .attr("dy", "-.5em")
                .attr("transform", "rotate(-90)");

            console.log("here");
            let yAxis = svg.selectAll("g.yAxis").data(function(d){return d3.select(this).data();});
            let newyAxis = yAxis.enter().append("g")
                        .attr("class", "yAxis");

            yAxis.exit().remove();
            yAxis = newyAxis.merge(yAxis);

            yAxis.attr("transform", "translate(20, 0)")
                    .call(axisy)
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "+.3em")
            this.electionDataArray = [];
        }
        catch(error){
            console.log(error);
        }
    }

    updateYears(selectedYears, partyArr){
        try{
            let that = this;
            d3.select("#stateList ul").remove();
            d3.select("#yearsList ul").remove();
            this.listContents[3].partyArr = partyArr;
            this.listContents[3].brushed = selectedYears;
            let stateSpan = d3.select('#stateList');
            let htmlList = stateSpan.append('ul');
            let yearsSpan = d3.select("#yearsList");
            let yearsList = yearsSpan.append("ul");
            this.listContents.forEach(function(d) {
                if(d.party == "D" || d.party == "R" || d.party == "I"){
                    let brushedStates = d.brushed;
                    brushedStates.forEach(s => htmlList.append('li').text(s).attr('class', that.chooseClass(d.party)));
                }
                else{
                    let brushedYears = d.brushed;
                    brushedYears.forEach((s, i) => yearsList.append('li').text(s).attr('class', that.chooseClass(d.partyArr[i])));
                }
            });
            // console.log(this.listContents[0].brushed);
            this.createGraph(that, selectedYears, this.listContents[0].brushed);
        }
        catch(error){
            console.log(error);
        }
    }


    update(selectedStates, party){
     
    try{// ******* TODO: PART V *******
        //Display the names of selected states in a list
            // console.log(selectedStates);

            this.listContents.find(d => d.party === party)['brushed'] = selectedStates;
            let that = this;
            d3.select("#stateList ul").remove();
            d3.select("#yearsList ul").remove();
            let stateSpan = d3.select('#stateList');
            let htmlList = stateSpan.append('ul');
            let yearsSpan = d3.select("#yearsList");
            let yearsList = yearsSpan.append("ul");
            this.listContents.forEach(function(d) {
                // let brushedStates = d.brushed;
                // brushedStates.forEach(s => htmlList.append('li').text(s).attr('class', that.chooseClass(d.party)));
                if(d.party == "D" || d.party == "R" || d.party == "I"){
                    let brushedStates = d.brushed;
                    brushedStates.forEach(s => htmlList.append('li').text(s).attr('class', that.chooseClass(d.party)));
                }
                else{
                    let brushedYears = d.brushed;
                    brushedYears.forEach((s, i) => yearsList.append('li').text(s).attr('class', that.chooseClass(d.partyArr[i])));
                }
            });
    
        //******** TODO: PART VI*******
        //Use the shift data corresponding to the selected years and sketch a visualization
        //that encodes the shift information
    
    
    
        //******** TODO: EXTRA CREDIT I*******
        //Handle brush selection on the year chart and sketch a visualization
        //that encodes the shift informatiomation for all the states on selected years
    
    
    
        //******** TODO: EXTRA CREDIT II*******
        //Create a visualization to visualize the shift data
        //Update the visualization on brush events over the Year chart and Electoral Vote Chart
    
        }
    catch(error){
        console.log(error);
    }
   };
}