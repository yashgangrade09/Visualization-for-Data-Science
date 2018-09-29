    /**
     * Loads in the table information from fifa-matches-2018.json
     */
d3.json('data/fifa-matches-2018.json').then( data => {

    /**
     * Loads in the tree information from fifa-tree-2018.csv and calls createTree(csvData) to render the tree.
     *
     */
    d3.csv("data/fifa-tree-2018.csv").then(csvData => {

        //Create a unique "id" field for each game
        csvData.forEach( (d, i) => {
            d.id = d.Team + d.Opponent + i;
        });

        //Create Tree Object
        let tree = new Tree();
        tree.createTree(csvData);

        //Create Table Object and pass in reference to tree object (for hover linking)

        let table = new Table(data,tree);

        table.createTable();
        table.updateTable();
    });
});



// // ********************** HACKER VERSION ***************************
/**
 * Loads in fifa-matches-2018.csv file, aggregates the data into the correct format,
 * then calls the appropriate functions to create and populate the table.
 *
 */

// d3.csv("data/fifa-matches-2018.csv").then( matchesCSV => {

//     /**
//      * Loads in the tree information from fifa-tree-2018.csv and calls createTree(csvData) to render the tree.
//      *
//      */
//    d3.csv("data/fifa-tree-2018.csv").then( treeCSV => {

//     // ******* TODO: PART I *******


//       });

// });
// ********************** END HACKER VERSION ***************************
