/** Class representing a Tree. */
class Tree 
{
    /**
     * Creates a Tree Object
     * Populates a single attribute that contains a list (array) of Node objects to be used by the other functions in this class
     * note: Node objects will have a name, parentNode, parentName, children, level, and position
     * @param {json[]} json - array of json objects with name and parent fields
     */
    constructor(json) 
    {
        //var list = JSON.parse(json);

        this.nodes = [];
        this.tree = [];
        for (let n of json)
        {
            let node = new Node(n.name, n.parent);
            if (node.parentName !== "root")
            {
                node.parentNode = this.nodes.filter(function(d){
                    return d.name === node.parentName;
                })[0];
            }
            this.nodes.push(node);
        }

    }

    /**
     * Function that builds a tree from a list of nodes with parent refs
     */
    buildTree() 
    {
        // note: in this function you will assign positions and levels by making calls to assignPosition() and assignLevel()
        for (let node of this.nodes.reverse())
        {
            node.children = this.nodes.filter(function(d){
                return node.name === d.parentName;
            }).reverse();            
        }
        this.nodes = this.nodes.reverse();
        
        this.nodes[0] = this.assignLevel(this.nodes[0], 0);
        this.nodes[0] = this.assignPosition(this.nodes[0], 0)[0];               
        /*
        for (let i of this.nodes)
        {
            console.log(i.name);
            console.log(i.parentName);
            console.log("\n");
            
            document.writeln("Name: " + i.name + "<br/>");
            document.writeln("Parent Name: " + i.parentName + "<br/>");
            if(i.parentNode !== null)
            {
                document.writeln("Parent Name: " + i.parentNode.name + "<br/>");
                document.writeln("Parent's Level: " + i.parentNode.level + "<br/>");
            }
            document.writeln("#of Children: " + i.children.length + "<br/>");
            document.writeln("level: " + i.level + "<br/>");
            document.writeln("position: " + i.position + "<br/>");
            document.writeln("<br/>");
        }
        document.writeln("name: " + this.nodes[0].children[0].children[2].children[0].name + "<br/>");
        document.writeln("level: " + this.nodes[0].children[0].children[2].children[0].level + "<br/>");
        document.writeln("<br/>");

        
        document.writeln("name: " + this.nodes[0].children[0].name + "<br/>");
        document.writeln("level: " + this.nodes[0].children[0].level + "<br/>");
        document.writeln("<br/>");
        
        document.writeln("name: " + this.nodes[0].children[0].children[0].name + "<br/>");
        document.writeln("level: " + this.nodes[0].children[0].children[0].level + "<br/>");
        document.writeln("<br/>");

        document.writeln("name: " + this.nodes[2].name + "<br/>");
        document.writeln("level: " + this.nodes[2].level + "<br/>");
        document.writeln("<br/>");
        */
    }

    /**
     * Recursive function that assign levels to each node
     */
    assignLevel(node, level) 
    {
        node.level = level;
        if(node.children.length === 0)
        {
            return node;
        }
        else
        {
            level = level + 1;
            let newchildren = []
            for(let n of node.children)
            {
                newchildren.push(this.assignLevel(n, level));
            }
            node.children = newchildren;
            return node;
        }
    }

    /**
     * Recursive function that assign positions to each node
     */
    assignPosition(node, position) 
    {
        node.position = position;
        if(node.children.length === 0)
        {
            position = position + 1;
            return [node, position];
        }
        else
        {
            let newchildren = [];
            for(let n of node.children)
            {
                let new_arr = this.assignPosition(n, position);
                let node_to_push = new_arr[0];
                position = new_arr[1];                
                newchildren.push(node_to_push);
            }
            node.children = newchildren;
            return [node, position];
        }
    }

    /**
     * Function that renders the tree
     */
    renderTree() 
    {
        //let colors =  ["#336699", "#669933", "#339999", "#666666"]
        let root = this.nodes[0];
        let div = d3.select('#container');
        let svgs = div.selectAll('svg');
        let new_svgs = svgs.enter().append('svg');
        svgs.exit().remove();
        svgs = new_svgs.merge(svgs);
        svgs.attr('width', 1200)
            .attr('height', 1200)
            .attr('viewBox', "0,0,1200,1200");       
        
        this.recurTree(svgs, root, "lines");
        this.recurTree(svgs, root, "circles");        
    }
    recurTree(svgs, node, mode)
    {          
        if(node.children.length === 0)
        {
            if(mode === "circles") { return this.setCircles(svgs, node); }
            else { return this.setLines(svgs, node); }
        }
        else
        { 
            if(mode === "circles") { this.setCircles(svgs, node); }
            else { this.setLines(svgs, node); }
            for(let n of node.children)
            { 
                this.recurTree(svgs, n, mode);     
            }
            return;
        }
    }
    setLines(svgs, node)
    {   
        if(node.parentNode !== null)
        {     
            svgs.append('line')
                .style('stroke', "grey") 
                //.style('stroke-width', "10") 
                .attr("x1", () => 160 * node.parentNode.level + 50)
                .attr("y1", () => 100 * node.parentNode.position + 50)
                .attr("x2", () => 160 * node.level + 50)
                .attr("y2", () => 100 * node.position + 50);
        }
    }
    setCircles(svgs, node)
    {  
        let svgsGroup = svgs.append('g');

        svgsGroup.append('circle')
                 .style("fill", "#3770cc")
                 .style("stroke","#3770cc")
                 .attr('cx',  () => 160 * node.level + 50)
                 .attr('cy',  () => 100 * node.position + 50)
                 .attr('r', 40);
        svgsGroup.append('text')
                 .attr('dx', () => 160 * node.level + 50)
                 .attr('dy', () => 100 * node.position + 50)
                 .style('font-size', "18px")
                 .attr('text-anchor', "middle")
                 .attr('alignment-baseline', "central")
                 .attr('font-weight', "bold")
                 .attr('font-family', "helvetica")
                 .style("fill", "white")
                 .text(node.name);
    }

}