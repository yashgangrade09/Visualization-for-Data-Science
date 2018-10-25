/** Class implementing the trendChart. */
class TrendChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(){
        this.divTrendChart = d3.select("#trendChart").classed("sideBar", true);
        this.margin = {top: 10, right: 20, bottom: 20, left: 50};

        this.selectedStatesSelection = {"D": [], "R": [], "I":[]};
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

   //  update(selectedStates){
     
   //  try{// ******* TODO: PART V *******
   //      //Display the names of selected states in a list
   //          // console.log(selectedStates);

   //          let spanStates = d3.select("#stateList");
   //          let ulList = spanStates.select("ul");

   //          if(ulList.empty())
   //              ulList = spanStates.append("ul")

   //          let listStates = ulList.selectAll("li").data(selectedStates);
   //          // let listStates = d3.select("#stateList").selectAll("li").data(selectedStates);
   //          listStates.exit().remove()
   //          let listStatesEnter = listStates.enter().append("li");
    
   //          listStates.merge(listStatesEnter);

   //          listStates.text(d => d["State"]);
    
   //      //******** TODO: PART VI*******
   //      //Use the shift data corresponding to the selected years and sketch a visualization
   //      //that encodes the shift information
    
    
    
   //      //******** TODO: EXTRA CREDIT I*******
   //      //Handle brush selection on the year chart and sketch a visualization
   //      //that encodes the shift informatiomation for all the states on selected years
    
    
    
   //      //******** TODO: EXTRA CREDIT II*******
   //      //Create a visualization to visualize the shift data
   //      //Update the visualization on brush events over the Year chart and Electoral Vote Chart
    
   //      }
   //  catch(error){
   //      console.log(error);
   //  }
   // };
    update(selectedStatesD, selectedStatesR, selectedStatesI){
     
    try{// ******* TODO: PART V *******
        //Display the names of selected states in a list
            // console.log(selectedStates);
            let that = this;

            let spanStates = d3.select("#stateList");
            let ulList = spanStates.select("ul");

            if(ulList.empty())
                ulList = spanStates.append("ul")

            let listStates = ulList.selectAll("li").data(selectedStatesD);
            // let listStates = d3.select("#stateList").selectAll("li").data(selectedStates);
            listStates.exit().remove()
            let listStatesEnter = listStates.enter().append("li");
    
            listStates.merge(listStatesEnter);

            listStates.text(d => d["State"])
                      .attr("class", that.chooseClass("D"));

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