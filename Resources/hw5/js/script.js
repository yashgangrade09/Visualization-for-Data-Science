/**
 * Loads in the table information from fifa-matches-2018.json
 */

// d3.json('data/fifa-matches-2018.json').then( data => {
//
//     /**
//      * Loads in the tree information from fifa-tree-2018.csv and calls createTree(csvData) to render the tree.
//      *
//      */
//     d3.csv("data/fifa-tree-2018.csv").then(csvData => {
//
//         //Create a unique "id" field for each game
//         csvData.forEach( (d, i) => {
//             d.id = i;
//         });
//
//         //Create Tree Object
//         try {
//           let tree = new Tree();
//           tree.createTree(csvData);
//           console.log(data);
//           //Create Table Object and pass in reference to tree object (for hover linking)
//           let table = new Table(data, tree);
//           table.createTable();
//           table.updateTable();
//         } catch (e) {
//           console.log(e);
//         }
//     });
// });


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
   d3.csv("data/fifa-tree-2018.csv").then( treeCSV => {

     // ******* TODO: PART I *******
     let ranking = {'Group'             : 0,
                    'Round of Sixteen'  : 1,
                    'Quarter Finals'    : 2,
                    'Semi Finals'       : 3,
                    'Fourth Place'      : 4,
                    'Third Place'       : 5,
                    'Runner-Up'         : 6,
                    'Winner'            : 7
                  }

      let teamData = d3.nest()
          .key(d => d.Team)
          .rollup(leaves => {
              let wins          = d3.sum(leaves, leaf => leaf['Wins']);
              let losses        = d3.sum(leaves, leaf => leaf['Losses']);
              let goalsMade     = d3.sum(leaves, leaf => leaf['Goals Made']);
              let goalsConceded = d3.sum(leaves, leaf => leaf['Goals Conceded']);
              let deltaGoals    = d3.sum(leaves, leaf => leaf['Delta Goals']);
              let totalGames    = d3.sum(leaves, leaf => 1);

              let games = [];
              for (let leaf of leaves) {
                  let opponent = {};
                  opponent['key']    = leaf.Opponent;
                  opponent['value']  = {'Delta Goals'    : leaf['Delta Goals'],
                                        'Goals Conceded' : leaf['Goals Conceded'],
                                        'Goals Made'     : leaf['Goals Made'],
                                        'Losses'         : '',
                                        'Opponent'       : leaf['Team'],
                                        'Wins'           : '',
                                        'Result'         : {'label': leaf['Result'], 'ranking': ranking[leaf['Result']]},
                                        'type'           : 'game'
                                        }
                  games.push(opponent);
              }

              let bestRank = d3.max(leaves, leaf => ranking[leaf['Result']]);

              let teamData = {'Delta Goals'     : deltaGoals,
                              'Goals Made'      : goalsMade,
                              'Goals Conceded'  : goalsConceded,
                              'Losses'          : losses,
                              'Result'          : {'label': Object.keys(ranking).find(key => ranking[key] === bestRank),
                                                   'ranking': bestRank},
                              'TotalGames'      : totalGames,
                              'Wins'            : wins,
                              'games'           : games,
                              'type'            : 'aggregate'
                              }
              console.log(teamData);
              return teamData;
          }).entries(matchesCSV)

      treeCSV.forEach(function(d,i){
          d.id = i;
      });

      let tree = new Tree(teamData);
      tree.createTree(treeCSV);
      let table =  new Table(teamData,tree);

      table.createTable();
      table.updateTable();
   });

});
// ********************** END HACKER VERSION ***************************
