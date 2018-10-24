/** Class implementing the votePercentageChart. */
class VotePercentageChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(){
		// Follow the constructor method in yearChart.js
		// assign class 'content' in style.css to vote percentage chart
		
		// this.trendChart = trendChart;
        this.margin = {top: 20, right: 20, bottom: 20, left: 50};

        let divVotesPercentage = d3.select("#votes-percentage").classed("content", true);
        this.svgBounds = divVotesPercentage.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        // this.svgWidth = 300;
        this.svgHeight = 250;

        this.svg = divVotesPercentage.append("svg")
                                        .attr("width", this.svgWidth)
                                        .attr("height", this.svgHeight)


		//for reference: https://github.com/Caged/d3-tip
		//Use this tool tip element to handle any hover over the chart
		this.tip = d3.tip().attr('class', 'd3-tip')
			.direction('s')
			.offset(function() {
				return [0,0];
			});

		this.democratsGroup = this.svg.append("g").attr("id", "dGroup");
        this.republicansGroup = this.svg.append("g").attr("id", "rGroup").attr('transform', 'translate(0, 60)');
        this.independentGroup = this.svg.append("g").attr("id", "iGroup").attr('transform', 'translate(0, 120)');
        this.democratsTextGroup = this.svg.append("g").attr("id", "dText");
        this.republicansTextGroup = this.svg.append("g").attr("id", "rText").attr('transform', 'translate(0, 60)');
        this.independentTextGroup = this.svg.append("g").attr("id", "iText").attr('transform', 'translate(0, 120)');
    }


	/**
	 * Returns the class that needs to be assigned to an element.
	 *
	 * @param party an ID for the party that is being referred to.
	 */
	chooseClass(data) {
	    if (data == "R"){
	        return "republican";
	    }
	    else if (data == "D"){
	        return "democrat";
	    }
	    else if (data == "I"){
	        return "independent";
	    }
	}

	/**
	 * Renders the HTML content for tool tip
	 *
	 * @param tooltip_data information that needs to be populated in the tool tip
	 * @return text HTML content for toop tip
	 */
	tooltip_render (tooltip_data) {
	    let text = "<ul>";
	    tooltip_data.result.forEach((row)=>{

			if(row.percentage !== 0)(
				text += "<li class = " + this.chooseClass(row.party)+ ">" 
							 + row.nominee+":\t\t"+row.votecount+"\t("+row.percentage+ "%" + ")" + 
							 "</li>"
			)
	    });
	    return text;
	}

	/**
	 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
	 *
	 * @param electionResult election data for the year selected
	 */
	update (electionResult){

		try{
			// console.log(electionResult);
			let dPopularPercentage = parseFloat(electionResult[0].D_PopularPercentage);
			let rPopularPercentage = parseFloat(electionResult[0].R_PopularPercentage);
			let iPopularPercentage = parseFloat(electionResult[0].I_PopularPercentage != "" ? electionResult[0].I_PopularPercentage : 0);

			let electionPercentageData = [];
			electionPercentageData.push({party: "D", percent: dPopularPercentage, nominee: electionResult[0].D_Nominee_prop});
			electionPercentageData.push({party: "R", percent: rPopularPercentage, nominee: electionResult[0].R_Nominee_prop});
			electionPercentageData.push({party: "I", percent: iPopularPercentage, nominee: electionResult[0].I_Nominee_prop});

			this.tip.html((d)=> {
	                /* populate data in the following format
	                 * tooltip_data = {
	                 * "result":[
	                 * {"nominee": D_Nominee_prop,"votecount": D_Votes_Total,"percentage": D_PopularPercentage,"party":"D"} ,
	                 * {"nominee": R_Nominee_prop,"votecount": R_Votes_Total,"percentage": R_PopularPercentage,"party":"R"} ,
	                 * {"nominee": I_Nominee_prop,"votecount": I_Votes_Total,"percentage": I_PopularPercentage,"party":"I"}
	                 * ]
	                 * }
	                 * pass this as an argument to the tooltip_render function then,
	                 * return the HTML content returned from that method.
	                 * */
	                 let tooltip_data = {
	                  	"result": [
	                  		{"nominee": electionResult[0].D_Nominee_prop,"votecount": electionResult[0].D_Votes_Total,"percentage": dPopularPercentage,"party":"D"},
	                  		{"nominee": electionResult[0].R_Nominee_prop,"votecount": electionResult[0].R_Votes_Total,"percentage": rPopularPercentage,"party":"R"},
	                  		{"nominee": electionResult[0].I_Nominee_prop,"votecount": electionResult[0].I_Votes_Total,"percentage": iPopularPercentage,"party":"I"}
	                  	]
	                 };
	                 return that.tooltip_render(tooltip_data);

	            });

   			  // ******* TODO: PART III *******

		    //Create the bar chart.
		    //Use the global color scale to color code the rectangles.
		    //HINT: Use .votesPercentage class to style your bars.

		    //Display the total percentage of votes won by each party
		    //on top of the corresponding groups of bars.
		    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
		    // chooseClass to get a color based on the party wherever necessary

		    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
		    //HINT: Use .middlePoint class to style this bar.

		    //Just above this, display the text mentioning details about this mark on top of this bar
		    //HINT: Use .votesPercentageNote class to style this text element

		    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
		    //then, vote percentage and number of votes won by each party.

			//HINT: Use the chooseClass method to style your elements based on party wherever necessary.

		   	let that = this;
       		// console.log(electionPercentageData, electionPercentageData[0]);	
	       	let sum_ev = d3.sum(electionResult, d => d.Total_EV);
	       	let positionScale = d3.scaleLinear()
            	                 .domain([0, 100])
                	             // .range([this.margin.left, this.svgWidth - this.margin.right]);
                	             .range([0, this.svgWidth]);

			let positionScale2 = d3.scaleLinear()
            	                 .domain([0, sum_ev])
                	             .range([0, this.svgWidth]);
                	             
            let democratData = electionPercentageData.find(d => d.party == "D");
			let democratRect = this.democratsGroup.selectAll(".votesPercentage").data([democratData]);
			let democratRectEnter = democratRect.enter().append("rect");
			democratRect.exit().remove();
			democratRect = democratRect.merge(democratRectEnter);

			democratRect.attr("x", 0)
						.attr("y", 30)
						.attr("width", d => positionScale(d.percent))
						.attr("height", 20)
						// .attr("fill", "#3182bd")
						.attr("class", d => that.chooseClass(d.party))
						.classed("votesPercentage", true);

			let republicanData = electionPercentageData.find(d => d.party == "R");
			let republicanRect = this.republicansGroup.selectAll(".votesPercentage").data([republicanData]);
			let republicanRectEnter = republicanRect.enter().append("rect");
			republicanRect.exit().remove();
			republicanRect = republicanRect.merge(republicanRectEnter);

			republicanRect.attr("x", 0)
						.attr("y", 30)
						.attr("width", d => positionScale(d.percent))
						.attr("height", 20)
						// .attr("fill", "#3182bd")
						.attr("class", d => that.chooseClass(d.party))
						.classed("votesPercentage", true);

			let independentData = electionPercentageData.find(d => d.party == "I");
			let independentRect = this.independentGroup.selectAll(".votesPercentage").data([independentData]);
			let independentRectEnter = independentRect.enter().append("rect");
			independentRect.exit().remove();
			independentRect = independentRect.merge(independentRectEnter);

			independentRect.attr("x", 0)
						.attr("y", 30)
						.attr("width", d => positionScale(d.percent))
						.attr("height", 20)
						// .attr("fill", "#3182bd")
						.attr("class", d => that.chooseClass(d.party))
						.classed("votesPercentage", true);


			let textDemocrats = this.democratsTextGroup.selectAll(".votesPercentageText").data([democratData])
			let textDemocratsEnter = textDemocrats.enter().append("text");
			textDemocrats.exit().remove();
			textDemocrats = textDemocrats.merge(textDemocratsEnter);

			textDemocrats.attr("x", 0)
								.attr("y", 20)
								.attr("class", d => that.chooseClass(d.party))
								.text(function(d){
										// d.percent == 0 ? "" : d.percent + "%";
										if(d.percent)
											d.percent = d.percent + "%";
										else
											return;
									return (d.percent + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" 
											+ d.nominee);
								})
								.classed("votesPercentageText", true);


			let republicanText =  this.republicansTextGroup.selectAll(".votesPercentageText").data([republicanData]);
			let republicanTextEnter = republicanText.enter().append("text");
			 republicanText.exit().remove();
			 republicanText = republicanText.merge(republicanTextEnter);

			 republicanText.attr("x", 0)
									.attr("y", 20)
									.attr("class", d => that.chooseClass(d.party))
									.text(function(d){
										// d.percent == 0 ? "" : d.percent + "%";
										if(d.percent)
											d.percent = d.percent + "%";
										else
											return;
										return (d.percent + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" 
												+ d.nominee);
									})
									.classed("votesPercentageText", true);

			let textIndependent = this.independentTextGroup.selectAll(".votesPercentageText").data([independentData])
			let textIndependentEnter = textIndependent.enter().append("text");
			textIndependent.exit().remove();
			textIndependent = textIndependent.merge(textIndependentEnter);

			textIndependent.attr("x", 0)
								.attr("y", 20)
								.attr("class", d => that.chooseClass(d.party))
								.text(function(d){
									if(d.percent)
										d.percent = d.percent + "%";
									else
										return;
									// console.log(d.percent + "%");
									return (d.percent + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" 
												+ d.nominee);
								})
								.classed("votesPercentageText", true);
			
			let textEnterBar = "50%";
	          this.svg.selectAll(".votesPercentageNote").remove();

	          this.svg.append("text")
	                  .attr("x", d => positionScale(50))
	                  .attr("y", 15)
	                  .text(textEnterBar)
	                  .style("fill", "black")
	                  .classed("votesPercentageNote", true);


	          this.svg.selectAll(".middlePoint").remove();
	          // console.log(sum_ev);
	          this.svg.append("rect")
	                  .attr("x", d => positionScale(50))
	                  .attr("y", 20)
	                  .attr("height", 180)
	                  .attr("width", 3)
	                  .style("fill", "black")
	                  .classed("middlePoint", true);								
		
	         	this.svg.call(this.tip);
	         	democratRect.on("mouseover", that.tip.show);
	         	democratRect.on("mouseout", that.tip.hide);

	         	republicanRect.on("mouseover", that.tip.show);
	         	republicanRect.on("mouseout", that.tip.hide);

	         	if(independentData.percent){
	         	independentRect.on("mouseover", that.tip.show);
	         	independentRect.on("mouseout", that.tip.hide);
	         	}
		}
		catch(error){
			console.log(error);
		}
	};

}