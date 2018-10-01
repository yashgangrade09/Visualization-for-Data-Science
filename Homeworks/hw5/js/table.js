/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        // Maintain reference to the tree object
        // this.tree = null;
        this.tree = treeObject;

        /**List of all elements that will populate the table.*/
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = null;

        ///** Store all match data for the 2018 Fifa cup */
        // this.teamData = null;
        this.teamData = teamData;

        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** letiables to be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        this.goalScale = null;


        /** Used for games/wins/losses*/
        this.gameScale = null;

        /**Color scales*/
        /**For aggregate columns*/
        /** Use colors '#feebe2' and '#690000' for the range*/
        this.aggregateColorScale = null;


        /**For goal Column*/
        /** Use colors '#cb181d' and '#034e7b' for the range */
        this.goalColorScale = null;
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******
    try{
        //Update Scale Domains
        let that = this;
        let dataRangeMax = d3.max(that.teamData, function(d) {
            return (Math.max(d.value[that.goalsMadeHeader], d.value[that.goalsConcededHeader]));
        });

        // no need to calculate the dataMin because it's gonna be zero as there are games where goals conceded or made are zero.
        // but calculating mean is also straight-forward
        
        // let dataRangeMin = d3.min(that.teamData, function(d) {
        //     return (Math.min(d.value[that.goalsMadeHeader], d.value[that.goalsConcededHeader]));
        // });

        this.goalScale = d3.scaleLinear()
                           .domain([0, dataRangeMax])
                           .range([this.cell.buffer, 2*this.cell.width])
                           .nice();

        this.goalColorScale = d3.scaleLinear()
                                .domain([0, dataRangeMax])
                                .range(['#cb181d', '#034e7b']);
        // Create the axes
        
        let goalXAxis = d3.axisTop().scale(this.goalScale);

        //add GoalAxis to header of col 1.
        let goalXAxisTable = d3.select("#goalHeader")
                               .append("svg")
                               .attr("width", 2*this.cell.width + 20)
                               .attr("height", this.cell.height);

        let newGoalXAxisTable = goalXAxisTable.append("g")
                                              .call(goalXAxis)
                                              .attr("transform", "translate(0 , "+ this.cell.height + ")");

        // this.tableElements = this.teamData;
        // NEVER do a direct assignment, JavaScript works like Pointers in C++ creating a pointer to an original data.
        // found on https://stackoverflow.com/questions/9885821/copying-of-an-array-of-objects-to-another-array-without-object-reference-in-java
        // this.tableElements = this.teamData.slice(); 
        this.tableElements = JSON.parse(JSON.stringify(this.teamData));
        console.log(this.tableElements);


    }
    catch(error){
        console.log(error);
    }
        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers
        

        //Set sorting callback for clicking on Team header
        //Clicking on headers should also trigger collapseList() and updateTable().

    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******

        // defining basic variables
    try{

        let that = this;
        let deltaText = "Delta Goals";
        let goalScale = this.goalScale;
        let cellCenterPoint = this.cell.height/2;
        console.log(this.tableElements);
        let maxGames = d3.max(that.tableElements, d => d.value.TotalGames)
        console.log(maxGames);

        this.gameScale = d3.scaleLinear()
                           .domain([0, maxGames])
                           .range([0, this.cell.width - this.cell.buffer]);

        this.aggregateColorScale = d3.scaleLinear()
                                     .domain([0, maxGames])
                                     .range(['#feebe2', '#690000']);
        

        // Starting with the creation of table rows and updating the table and it's elements
        let tableDisplay = d3.select("#matchTable").select("tbody").selectAll("tr").data(this.tableElements);

        let tableRows = tableDisplay.enter().append("tr");
        tableDisplay.exit().remove();
        tableDisplay = tableDisplay.merge(tableRows);

        tableDisplay.attr("id", d => d.key).attr("class", d => d.value.type);
        console.log(tableDisplay);
        // mouseout, mouseover, and on click event to be added

        // we have to append the "th" elements for team name now
        let tableHeadersDisplay = tableDisplay.selectAll("th").data(d =>[d.key]);
        
        let tableHeadersDisplayEnter = tableHeadersDisplay.enter()
                                                          .append("th")
                                                          .attr("width", this.cell.width)
                                                          .attr("height", this.cell.height);

        tableHeadersDisplay = tableHeadersDisplay.merge(tableHeadersDisplayEnter);
        tableHeadersDisplay = tableHeadersDisplay.text(d => d);

        // Append the remaining "td" elements i.e. Goals, Results, Mins, Losses, Total Games

        let tableDataItemsDisplay = tableDisplay.selectAll("td").data(function(d){

                                        let result = [
                                                        {type: d.value.type, vis: "goals", value:[{type: d.value.type, delta: d.value[deltaText], goals: d.value[that.goalsMadeHeader]}, {type: d.value.type, delta: d.value[deltaText], goals: d.value[that.goalsConcededHeader]}]},
                                                        {type: d.value.type, vis: "text", value:[d.value.Result.label]},
                                                        {type: d.value.type, vis: "bar", value:[d.value.Wins]},
                                                        {type: d.value.type, vis: "bar", value:[d.value.Losses]},
                                                        {type: d.value.type, vis: "bar", value:[d.value.TotalGames]}
                                                    ];
                                        return result;
                                    });

        let tableDataItemsDisplayEnter = tableDataItemsDisplay.enter().append("td");
        tableDataItemsDisplay.exit().remove();

        tableDataItemsDisplay = tableDataItemsDisplayEnter.merge(tableDataItemsDisplay);

        // fill out each column now one by one
        // Starting with the goals column

        let svgGroupGoalID = tableDataItemsDisplay.filter(function(d){return d.vis == "goals";});
        // console.log(svgGroupGoalID);
        // let svgGroupGoal = svgGroupGoalID.selectAll("svg").data(d => (d3.select(this).data()));
        let svgGroupGoal = svgGroupGoalID.selectAll("svg").data(function(d){
                                        return d3.select(this).data();
                                      });
        let svgGroupGoalEnter = svgGroupGoal.enter().append("svg");

        svgGroupGoal = svgGroupGoalEnter.merge(svgGroupGoal);
        svgGroupGoal.attr("height", this.cell.height).attr("width", this.cell.width*2 + 20);

        // create the rectangles
        // let svgGoalRect = svgGroupGoal.selectAll("rect").data(d => (d3.select(this).data()));
        let svgGoalRect = svgGroupGoal.selectAll("rect").data(function(d){ 
                                        console.log(d3.select(this).data());
                                        return d3.select(this).data();
                                      });
        let svgGoalRectEnter = svgGoalRect.enter().append("rect");
        svgGoalRect.exit().remove();

        svgGoalRect = svgGoalRectEnter.merge(svgGoalRect);
        svgGoalRect.classed("goalBar", true);

        svgGoalRect.attr("x", function(d){
                            let min = null;
                            if(d.value[0].goals > d.value[1].goals){
                                min = d.value[1].goals;
                            }
                            else{
                                min = d.value[0].goals;
                            }
                            return that.goalScale(min);
                        })
                   .attr("y", function(d){
                        let diff = 5;
                        if(d.type == "game"){
                            diff = 3
                        } 
                        return (cellCenterPoint - diff);
                   })
                   .attr("height", function(d){
                        if(d.type == "game"){
                            return that.cell.height*0.25;
                        }
                        return that.cell.height*0.5;
                   })
                   .attr("width", d => (Math.abs(goalScale(d.value[0].delta))))
                   .attr("style", function(d){
                        if(d.value[0].delta > 0){
                            return "fill: #364e74";
                        }
                        else{
                            return "fill: #be2714"
                        }
                   });


    }
    catch(error){
        console.log(error);    
    }


        //Create table rows

        //Append th elements for the Team Names

        //Append td elements for the remaining columns. 
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'vis' :<'bar', 'goals', or 'text'>, 'value':<[array of 1 or two elements]>}
        
        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )

        //Create diagrams in the goals column

        //Set the color of all games that tied to light gray

    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******
       
        //Only update list for aggregate clicks, not game clicks
        
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        
        // ******* TODO: PART IV *******

    }


}
