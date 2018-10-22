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
        // csvData.forEach( (d, i) => {
        //     d.id = d.Team + d.Opponent + i;
        // });

        // //Create Tree Object
        // let tree = new Tree();
        // tree.createTree(csvData);

        // //Create Table Object and pass in reference to tree object (for hover linking)

        // let table = new Table(data,tree);

        // table.createTable();
        // table.updateTable();
    });
});



// // ********************** HACKER VERSION ***************************
/**
 * Loads in fifa-matches-2018.csv file, aggregates the data into the correct format,
 * then calls the appropriate functions to create and populate the table.
 *
 */

d3.csv("data/fifa-matches-2018.csv").then( matchesCSV => {

    /**
     * Loads in the tree information from fifa-tree-2018.csv and calls createTree(csvData) to render the tree.
     *
     */
    let rankingVector = {
        "Group" : 0,
        "Round of Sixteen" : 1,
        "Quarter Finals" : 2,
        "Semi Finals" : 3,
        "Fourth Place" : 4,
        "Third Place" : 5,
        "Runner Up" : 6,
        "Winner" : 7
    };

    let goalsMadeHeader = "Goals Made", goalsConcededHeader = "Goals Conceded", deltaText = "Delta Goals";

    let teamData = d3.nest().key(d => d.Team)
                     .rollup(function(leaves){

                        let wins = d3.sum(leaves, d => d.Wins);
                        let losses = d3.sum(leaves, d => d.Losses);
                        let goalsMade = d3.sum(leaves, d => d[goalsMadeHeader]);
                        let goalsConceded = d3.sum(leaves, d => d[goalsConcededHeader]);
                        let deltaGoals = d3.sum(leaves, d => d[deltaText]);
                        let totalGames = d3.sum(leaves, d => 1);

                        let gamesVector = [];

                        for(let iter of leaves){
                            let oppObj = {};
                            oppObj.key = iter.Opponent;
                            // console.log(iter);

                            oppObj.value = {
                                "Goals Made": iter[goalsMadeHeader],
                                "Goals Conceded": iter[goalsConcededHeader],
                                "Delta Goals": iter[deltaText],
                                "Wins": [],
                                "Losses": [],
                                "Opponent": iter.Team,
                                "type": "game",
                                "Result": {"label": iter.Result, "ranking": rankingVector[iter.Result]}
                            }
                            // console.log(oppObj);
                            gamesVector.push(oppObj);
                        }

                        let highestRank = d3.max(leaves, d => (rankingVector[d.Result]));

                        gamesVector.sort(function(a, b){
                            valA = a.value.Result.ranking;
                            valB = b.value.Result.ranking;
                            // console.log(valA, valB);
                            // return valB < valA ? -1 : valB > valA ? 1 : valB >= valA ? 0 : NaN;
                            return d3.descending(valA, valB);
                        });

                        let dataObj = {
                            "Goals Made": goalsMade,
                            "Goals Conceded": goalsConceded,
                            "Delta Goals": deltaGoals,
                            "Wins": wins,
                            "Losses": losses,
                            "games": gamesVector,
                            "type": "aggregate",
                            "TotalGames": totalGames,
                            "Result": {"label": matchKey(highestRank), "ranking": highestRank}
                        };
                        // console.log(dataObj);
                        return dataObj;
                     })
                     .entries(matchesCSV);


    function matchKey(key){
        for(i in rankingVector){
            if(rankingVector[i] == key){
                return i;
            }
        }
    }
    
   d3.csv("data/fifa-tree-2018.csv").then( treeCSV => {

    // ******* TODO: PART I *******
        treeCSV.forEach(function (d, i) {
            d.id = d.Team + d.Opponent + i;
        });

        //Create Tree Object
        let tree = new Tree();
        tree.createTree(treeCSV);

        //Create Table Object and pass in reference to tree object (for hover linking)
        let table = new Table(teamData,tree);

        table.createTable();
        table.updateTable();

    });

});
// ********************** END HACKER VERSION ***************************
