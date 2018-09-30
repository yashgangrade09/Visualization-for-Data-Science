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
        // console.log(this.teamData);
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
        // found on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice to use the slice function to copy the array
        this.tableElements = this.teamData.slice(); 
        // console.log(this.tableElements);


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

        // defining basics 
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
