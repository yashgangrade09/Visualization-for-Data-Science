/** Class representing a Tree. */
class Tree {
    /**
     * Creates a Tree Object
     * Populates a single attribute that contains a list (array) of Node objects to be used by the other functions in this class
     * note: Node objects will have a name, parentNode, parentName, children, level, and position
     * @param {json[]} json - array of json objects with name and parent fields
     */
    constructor(json) {
        let i = 0;
        let nodeObject;
        this.listOfNodes = [];

        for(i = 0; i < json.length; i++){
            nodeObject = json[i];
            let tempNode = new Node(nodeObject.name, nodeObject.parent);
            this.listOfNodes.push(tempNode);
        }
    }

    /**
     * Function that builds a tree from a list of nodes with parent refs
     */
    buildTree() {
        // note: in this function you will assign positions and levels by making calls to assignPosition() and assignLevel()
        let rootNode;
        let current, tempNode;
        let i, j;
        this.static_pos = 0;
        this.mapPositions = {}
        let l = this.listOfNodes.length;

        for(i = 0; i < l; i++){
            current = this.listOfNodes[i];

            if(current.parentName === "root")
                rootNode = current;

            for(j = 0; j < l; j++){
                tempNode = this.listOfNodes[j];
                if(current.name === tempNode.parentName)
                    current.addChild(tempNode);

                if(current.parentName === tempNode.name)
                    current.parentNode = tempNode;
            }
        }

        this.assignLevel(rootNode, 0);
        this.mapPositions[rootNode.level] = 0;
        this.assignPosition(rootNode, 0);

        //console.log(this.listOfNodes);
    }

    /**
     * Recursive function that assign levels to each node
     */
    assignLevel(node, level) {
        
        let i;
        node.level = level;
        let l = node.children.length;
        for(i = 0; i < l; i++){
            this.assignLevel(node.children[i], level + 1);
        }
    }

    /**
     * Recursive function that assign positions to each node
     */
    assignPosition(node, position) {

        let i;

        this.static_pos = Math.max(this.static_pos, position);    

        node.position = position;
        let l = node.children.length;

        if(l > 0){
            this.assignPosition(node.children[0], position);
        }

        for(i = 1; i < l; i++){

            if(this.static_pos > position){
                this.assignPosition(node.children[i], this.static_pos + 1);
            }
            else{
                this.assignPosition(node.children[i], position+1);
            }
        }
    }

    /**
     * Function that renders the tree
     */
    renderTree() {

        let selection = d3.select("body"); //select the entire body of the page
        let new_selection = selection.append("svg").attr("height", 1200).attr("width", 1200);
        let svgBlock = d3.selectAll("svg");

        let x_mult = 225, y_mult = 125, x_shift = 100, y_shift = 100;

        svgBlock.selectAll("line").data(this.listOfNodes).enter()
                .append("line")
                .attr("x1", function(d, i){return x_mult*(d.level) + x_shift;})
                .attr("y1", function(d, i){return y_mult*(d.position) + y_shift;})
                .attr("x2", function(d, i)
                {
                    if(d.parentNode){
                        return x_mult*(d.parentNode.level) + x_shift;
                    }
                    return x_mult*(d.level) + x_shift;
                })
                .attr("y2", function(d, i)
                {
                    if(d.parentNode){
                        return y_mult*(d.parentNode.position) + y_shift;
                    }
                    return y_mult*(d.position) + y_shift;
                })


        let node_groups = svgBlock.selectAll('g').data(this.listOfNodes).enter().append('g')
                        .attr("class", "nodeGroup");

        node_groups.append("circle")
              .attr("r", 40)
              .attr("cx", function(d, i){return x_mult*(d.level) + x_shift;})
              .attr("cy", function(d, i){return y_mult*(d.position) + y_shift;})

        node_groups.append("text")
              .attr("class", "label")
              .attr("dx", function(d, i){return x_mult*(d.level) + x_shift;})
              .attr("dy", function(d, i){return y_mult*(d.position) + y_shift;})
              .text(function(d, i){return d.name;})
    }

}