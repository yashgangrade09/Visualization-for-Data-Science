/** Class implementing the trendChart. */
class TrendChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(){
        this.divTrendChart = d3.select("#trendChart").classed("sideBar", true);
        this.margin = {top: 10, right: 20, bottom: 20, left: 50};

        this.listContents = [{'party': 'D', 'brushed' : []},
                             {'party': 'R', 'brushed' : []},
                             {'party': 'I', 'brushed' : []},
                             {'party': [], 'brushed' : []}];
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
                             {'party': [], 'brushed' : []}];

        d3.select("#stateList ul").remove();

    }

    updateYears(selectedYears, partyArr){
        try{
            let that = this;
            console.log(selectedYears, partyArr);
            d3.select("#stateList ul").remove();
            // this.listContents.find(d => d.party == party)['brushed'] = selectedYears;
            console.log(this.listContents);
            this.listContents[3].party = partyArr;
            this.listContents[3].brushed = selectedYears;
            let stateSpan = d3.select('#stateList');
            let htmlList = stateSpan.append('ul')
            this.listContents.forEach(function(d) {
                if(d.party == "D" || d.party == "R" || d.party == "I"){
                    let brushedStates = d.brushed;
                    brushedStates.forEach(s => htmlList.append('li').text(s).attr('class', that.chooseClass(d.party)));
                }
                else{
                    console.log("here");
                    let brushedYears = d.brushed;
                    console.log(brushedYears);
                    brushedYears.forEach((s, i) => htmlList.append('li').text(s).attr('class', that.chooseClass(d.party[i])));
                }
            });
        }
        catch(error){
            console.log(error);
        }
    }


    update(selectedStates, party){
     
    try{// ******* TODO: PART V *******
        //Display the names of selected states in a list
            console.log(selectedStates);

            this.listContents.find(d => d.party === party)['brushed'] = selectedStates;
            let that = this;
            d3.select("#stateList ul").remove();
            let stateSpan = d3.select('#stateList');
            let htmlList = stateSpan.append('ul')
            this.listContents.forEach(function(d) {
                let brushedStates = d.brushed;
                brushedStates.forEach(s => htmlList.append('li').text(s).attr('class', that.chooseClass(d.party)));
            });

            // let ulList = spanStates.select("ul");
            // console.log('trend ', selectedStates)

            // if(ulList.empty())
            //     ulList = spanStates.append("ul")

            // let listStates = ulList.selectAll("li").data(selectedStates);
            // // let listStates = d3.select("#stateList").selectAll("li").data(selectedStates);
            // listStates.exit().remove();
            // listStates = listStates.enter()
            //     .append("li")
            //     .merge(listStates)
            //     .text(d => d)
            //     .attr("class", that.chooseClass("D"));

            // listStates = ulList.selectAll("li").data(selectedStatesR);
            // // let listStates = d3.select("#stateList").selectAll("li").data(selectedStates);
            // listStates.exit().remove()
            // listStatesEnter = listStates.enter().append("li");
    
            // listStates.merge(listStatesEnter);

            // listStates.text(d => d["State"])
            //           .attr("class", that.chooseClass("R"));

            // listStates = ulList.selectAll("li").data(selectedStatesI);
            // // let listStates = d3.select("#stateList").selectAll("li").data(selectedStates);
            // listStates.exit().remove()
            // listStatesEnter = listStates.enter().append("li");
    
            // listStates.merge(listStatesEnter);

            // listStates.text(d => d["State"])
            //           .attr("class", that.chooseClass("I"));                      
    
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