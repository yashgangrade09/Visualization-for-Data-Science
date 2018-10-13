/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        // Maintain reference to the tree object
        this.tree = treeObject;

        /**List of all elements that will populate the table.*/
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = teamData;

        ///** Store all match data for the 2018 Fifa cup */
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
        this.goalScale = d3.scaleLinear().domain([0, 100]).range([this.cell.buffer, this.cell.width*2]).nice();


        /** Used for games/wins/losses*/
        this.gameScale = d3.scaleLinear().domain([0, 100]).range([this.cell.buffer, this.cell.width]);

        /**Color scales*/
        /**For aggregate columns*/
        /** Use colors '#feebe2' and '#690000' for the range*/
        this.aggregateColorScale = d3.scaleLinear()
                                     .domain([0, 15])
                                     .range([d3.rgb('#FEEBE2'), d3.rgb('#690000')]);


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
        let that = this;

        // ******* TODO: PART II *******
        //Update Scale Domains
        let maxGoals = d3.max(this.teamData.map(d => Math.max(d.value[this.goalsMadeHeader], d.value[this.goalsConcededHeader])));
        let minGoals = 0;
        this.goalScale.domain([minGoals, maxGoals]);

        let maxColors = d3.max(this.teamData.map(d => Math.max(d.value.Wins, d.value.Losses, d.value.TotalGames)));
        let minColors = 0;
        this.aggregateColorScale.domain([minColors, maxColors]);

        let maxGames = d3.max(this.teamData, d => d.value.TotalGames);
        let minGames = 0;
        this.gameScale.domain([minGames, maxGames]);

        // Create the axes
        // add GoalAxis to header of col 1.
        let goalScaleAxis = d3.axisTop().scale(this.goalScale);
        let goalScaleSvg  = d3.select('#goalHeader')
                              .append('svg')
                              .attr('width', this.cell.width * 2 + this.cell.buffer )
                              .attr('height', this.cell.height);

        goalScaleSvg.append('g').call(goalScaleAxis).attr('transform', 'translate(0, ' + this.cell.height + ')');


        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers

        //Set sorting callback for clicking on Team header
        //Clicking on headers should also trigger collapseList() and updateTable().
        d3.select('thead')
          .selectAll('td, th')
          .on('click', function() {
              let descending = d3.select(this).classed('descending');
              that.collapseList();
              let sortingColumn = d3.select(this).text();
              let headerToAttr = {'Wins' : 'Wins',
                                  'Losses': 'Losses',
                                  'Round/Result': 'Result',
                                  'Goals': 'Delta Goals',
                                  'Total Games': 'TotalGames',
                                  'Team': 'Team'};
              sortingColumn = headerToAttr[sortingColumn];
              that.tableElements.sort(function(x, y) {
                if (sortingColumn == 'Team') {
                    if (y.key <= x.key) return -1;
                    if (y.key >  x.key) return  1;
                }
                else if (sortingColumn == 'Delta Goals') {
                    if (y.value[sortingColumn] <= x.value[sortingColumn]) return -1;
                    if (y.value[sortingColumn] >  x.value[sortingColumn]) return  1;
                }
                else if (sortingColumn == 'Result') {
                    return y.value[sortingColumn].ranking - x.value[sortingColumn].ranking;
                }
                else {
                    return y.value[sortingColumn] - x.value[sortingColumn];
                }
              });
              d3.select(this).classed('descending', !descending);
              if (! descending) {
                that.tableElements.reverse();
              }
              that.updateTable();
        });
    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        //Create table rows
        let that = this;

        // ---------------------------------------------------------
        // Add the table rows
        // ---------------------------------------------------------
        let  tableBody = d3.select('#matchTable')
                           .select('tbody')
                           .selectAll('tr')
                           .data(this.tableElements);

        let tableBodyEnter = tableBody.enter()
                                      .append('tr')

        tableBody.exit().remove();
        tableBody = tableBody.merge(tableBodyEnter);
        // ---------------------------------------------------------

        // ---------------------------------------------------------
        // Link to the tree
        // ---------------------------------------------------------
        d3.select('#matchTable').select('tbody').selectAll('tr')
          .on('mouseenter', function(d){
            that.tree.updateTree(d3.select(this).data()[0]);
          })
          .on('mouseleave', function(d){
            that.tree.clearTree();
          });

        // ---------------------------------------------------------
        // Append th elements for the Team Names
        // ---------------------------------------------------------
        let teamNameColumn = tableBody.selectAll('th')
                                  .data(d => d.value.type == 'game' ?
                                                [{type: "game",vis: "text", value: d.key}]:
                                                [{type: "aggregate",vis: "text", value: d.key}]
                                        );
        teamNameColumn.exit().remove();
        teamNameColumn = teamNameColumn.enter().append('th').merge(teamNameColumn);

        teamNameColumn.text(d => d.type == 'game' ? 'x' + d.value : d.value)
                      .attr('class', d => d.type)
                      .attr('id', d => d.value)
                      .on('click', function(d) {that.updateList(this.parentNode.rowIndex - 2)})


        // ---------------------------------------------------------
        // Modify the data inherited by the children (td) elements
        // ---------------------------------------------------------

        let td = tableBody.selectAll('td')
                  .data(d => [{type: d.value.type, vis: 'goals',
                               value: {goalsMade: d.value[this.goalsMadeHeader],
                                       goalsConceded: d.value[this.goalsConcededHeader],
                                       goalsDelta: d.value['Delta Goals']}},
                              {type: d.value.type, vis: 'text', value: d.value.Result.label},
                              {type: d.value.type, vis: 'bar', value: d.value.Wins},
                              {type: d.value.type, vis: 'bar', value: d.value.Losses},
                              {type: d.value.type, vis: 'bar', value: d.value.TotalGames}]);

        let tdEnter = td.enter().append('td');
        td.exit().remove();
        td = tdEnter.merge(td);

        // Set the text for Round/Result column
        td.filter(d => d.vis == 'text').text(d => d.value);

        // Select the columns with bar charts
        let barColumns = td.filter(d => d.vis === 'bar');

        let bar = barColumns.selectAll('svg')
                                 .data(function(d) {return d3.select(this).data();});
        bar.exit().remove();
        bar = bar.enter().append('svg')
                 .attr('width', this.cell.width)
                 .attr('height', this.cell.height)
                 .attr('id', d=> d.vis)
                 .merge(bar);

        let barRect = bar.selectAll('rect')
                         .data(d => [d]);
        barRect.exit().remove();
        barRect = barRect.enter()
                         .append('rect')
                         .merge(barRect);
        barRect.attr('x', 0)
               .attr('y', 0)
               .attr('width', d => d.value ? that.gameScale(d.value) : 0)
               .attr('height', this.cell.height)
               .attr('fill', d => d.value ? that.aggregateColorScale(d.value) : 0)

        let barText = bar.selectAll('text').data(d => [d]);
        barText.exit().remove();
        barText = barText.enter()
                         .append('text')
                         .merge(barText);

        barText.attr('x', d => d.value ? that.gameScale(d.value) - 5 : 0)
               .attr('style', 'text-anchor: end')
               .attr('y', this.cell.height / 2 + 3)
               .attr('fill', 'white')
               .classed('node', true)
               .text(d => d.value);

        // ---------------------------------------------------------
        // Create a goals illustration
        // ---------------------------------------------------------
        let goalColumns = td.filter(function(d){return d.vis === "goals";});
        let goalSvg = goalColumns.selectAll("svg").data(function(d) {return d3.select(this).data();});
        goalSvg.exit().remove();
        goalSvg = goalSvg.enter().append('svg')
                         .attr("height", this.cell.height)
                         .attr("width", this.cell.width*2 + 20)
                         .attr('id', d => d.vis)
                         .merge(goalSvg);

        let goalSvgRect = goalSvg.selectAll('rect').data(d => [d]);
        goalSvgRect.exit().remove();
        goalSvgRect.enter()
                   .append('rect')
                   .merge(goalSvgRect)
                   .attr('x', d => this.goalScale(Math.min(d.value.goalsMade, d.value.goalsConceded)))
                   .attr('y', d => d.type == 'aggregate' ? this.cell.height / 2 - 5 : this.cell.height / 2 - 2)
                   .attr('width', d => this.goalScale(Math.max(d.value.goalsMade, d.value.goalsConceded)) - this.goalScale(Math.min(d.value.goalsMade, d.value.goalsConceded)))
                   .attr('height', d => d.type == 'aggregate' ? 10 : 4)
                   .attr('class', d => d.value.goalsMade - d.value.goalsConceded > 0 ? 'deltapos' : (d.value.goalsMade - d.value.goalsConceded < 0 ? 'deltaneg' : 'deltazero'))
                   .classed('goalBar', true);

        let goalSvgTitle = goalSvg.selectAll('title').data(d => [d]);
        goalSvgTitle.exit().remove();
        goalSvgTitle.enter()
                    .append('title')
                    .merge(goalSvgTitle)
                    .html(d => 'Goal Made: ' + d.value.goalsMade + ', Goals Conceded: ' + d.value.goalsConceded);

        let goalSvgCircleWin = goalSvg.selectAll('#wincircle').data(d => [d]);
        goalSvgCircleWin.exit().remove();
        goalSvgCircleWin.enter()
                        .append('circle')
                        .merge(goalSvgCircleWin)
                        .attr('cx', d => this.goalScale(d.value.goalsMade))
                        .attr('cy', this.cell.height / 2)
                        .attr('r', 5)
                        .attr('class', function(d) {
                          if (d.type == 'aggregate') {
                            if (d.value.goalsMade - d.value.goalsConceded == 0) return 'deltazero';
                            else return 'deltapos';
                          }
                          else {
                            if (d.value.goalsMade - d.value.goalsConceded == 0) return 'gameCircleTied';
                            else return 'gameCircleWin';
                          }
                        })
                        .classed('goalCircle', true)
                        .attr('id', 'wincircle');

          let goalSvgCircleCon = goalSvg.selectAll('#concircle').data(d => [d]);
          goalSvgCircleCon.exit().remove();
          goalSvgCircleCon.enter()
                          .append('circle')
                          .merge(goalSvgCircleCon)
                          .attr('cx', d => this.goalScale(d.value.goalsConceded))
                          .attr('cy', this.cell.height / 2)
                          .attr('r', 5)
                          .attr('class', function(d) {
                            if (d.type == 'aggregate') {
                              if (d.value.goalsMade - d.value.goalsConceded == 0) return 'deltazero';
                              else return 'deltaneg';
                            }
                            else {
                              if (d.value.goalsMade - d.value.goalsConceded == 0) return 'gameCircleTied';
                              else return 'gameCircleLoss';
                            }
                          })
                          .classed('goalCircle', true)
                          .attr('id', 'concircle');

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
        if (this.tableElements[i].value.type == 'game') {
          return;
        }
        // if next item is another team, we expand current one
        let childGames = this.tableElements[i].value.games;
        if (this.tableElements[i + 1].value.type == 'aggregate') {
          this.tableElements.splice(i + 1, 0, ...childGames);
        }
        // if next item is game, collapse the current one
        else {
          this.tableElements.splice(i + 1, childGames.length);
        }
        this.updateTable();
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {

        // ******* TODO: PART IV *******
        this.tableElements = this.tableElements.filter(function(d){
            return d.value.type != "game";
        })
    }


}
