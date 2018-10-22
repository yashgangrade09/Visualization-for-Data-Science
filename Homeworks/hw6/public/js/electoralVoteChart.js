class ElectoralVoteChart {
    /**
     * Constructor for the ElectoralVoteChart
     *
     * @param trendChart an instance of the ShiftChart class
     */
    constructor (trendChart){

        // Follow the constructor method in yearChart.js
        // assign class 'content' in style.css to electoral-vote chart








       
    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (party) {
        if (party == "R"){
            return "republican";
        }
        else if (party == "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    }

    /**
     * Creates the stacked bar chart, text content and tool tips for electoral vote chart
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */

   update (electionResult, colorScale){
       
       // ******* TODO: PART II *******
       // Group the states based on the winning party for the state;
       // then sort them based on the margin of victory
       
       // Create the stacked bar chart.
       // Use the global color scale to color code the rectangles for Democrates and Republican.
       // Use #089c43 to color Independent party.
       // HINT: Use .electoralVotes class to style your bars.

       // Display total count of electoral votes won by the Democrat, Republican and Independent party(if there's candidate).
       // on top of the corresponding groups of bars.
       // HINT: Use the .electoralVoteText class to style your text elements; Use this in combination with
       // Use chooseClass method to get a color based on the party wherever necessary
       
       // Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
       // HINT: Use .middlePoint class to style this bar.
       
       // Just above this, display the text mentioning the total number of electoral votes required
       // to win the elections throughout the country
       // HINT: Use .electoralVotesNote class to style this text element
       // HINT: Use the chooseClass method to style your elements based on party wherever necessary.










       //******* TODO: PART V *******
       
       //Implement brush on the bar chart created above.
       //Implement a call back method to handle the brush end event.
       //Call the update method of shiftChart and pass the data corresponding to brush selection.
       //HINT: Use the .brush class to style the brush.










    };

    
}