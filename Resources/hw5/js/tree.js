/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {

    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */

    createTree(treeData) {
        // ******* TODO: PART VI *******

        let that = this;
        //Create a tree and give it a size() of 800 by 300.
        let treeLayout = d3.tree().size([800, 300]);

        //Create a root for the tree using d3.stratify();
        let root = d3.stratify().id(a => a.id).parentId(a => a.ParentGame)(treeData)

        treeLayout(root);

        //Add nodes and links to the tree.
        let treeGroup = d3.select('#tree');

        treeGroup.selectAll('path')
                 .data(root.links())
                 .enter()
                 .append('path')
                 .classed('link', true)
                 .attr("d", d3.linkHorizontal()
                 .x(function(d) { return d.y + 100 ; })
                 .y(function(d) { return d.x; }));


        let node = treeGroup.selectAll('g')
                            .data(root.descendants())
                            .enter()
                            .append('g')
                            .attr("transform", function(d) { return "translate(" + (d.y + 100) + "," + d.x + ")"; });

        node.append('circle')
            .attr('class', d => d.data.Wins == "1" ? 'deltapos' : 'deltaneg')
            .classed('node', true)
            .attr('r', 5);

        node.append('text')
            .attr("dy", 3)
            .attr("x", d => d.children ? -13 : 13)
            .attr("text-anchor", d => d.children || d._children ? "end" : "start")
            .text(d => d.data.Team);
    }

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {
        // ******* TODO: PART VII *******
        let treePaths = d3.select('#tree').selectAll('path');
        let treeTexts = d3.select('#tree').selectAll('text');

        if (row.value.type == 'aggregate') {
          treePaths.each(function (d) {
            // console.log(d);
            if (d.source.data.Team == row.key && d.target.data.Team == row.key) {
              d3.select(this).classed('selected', true);
            }
          })
          treeTexts.each(function (d) {
            if (d.data.Team == row.key) {
              d3.select(this).classed('selectedLabel', true);
            }
          })
        }
        else {
          treePaths.each(function (d) {
            if (d.target.data.Team == row.value.Opponent && d.target.data.Opponent == row.key) {
              d3.select(this).classed('selected', true);
            }
            if (d.target.data.Team == row.key && d.target.data.Opponent == row.value.Opponent)
              d3.select(this).classed('selected', true);
          })
        }
    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******
        // You only need two lines of code for this! No loops!
        d3.select('#tree')
          .selectAll('.selected, .selectedLabel')
          .classed('selected', false)
          .classed('selectedLabel', false);
    }
}
