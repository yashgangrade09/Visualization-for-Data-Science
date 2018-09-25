/** Data structure for the data associated with an individual country. */
class InfoBoxData {
    /**
     *
     * @param country name of the active country
     * @param region region of the active country
     * @param indicator_name the label name from the data category
     * @param value the number value from the active year
     */
    constructor(country, region, indicator_name, value) {
        this.country = country;
        this.region = region;
        this.indicator_name = indicator_name;
        this.value = value;
    }
}

/** Class representing the highlighting and selection interactivity. */
class InfoBox {
    /**
     * Creates a InfoBox Object
     * @param data the full data array
     */
    constructor(data) {
        this.data = data;
    }

    /**
     * Renders the country description
     * @param activeCountry the IDs for the active country
     * @param activeYear the year to render the data for
     */
    updateTextDescription(activeCountry, activeYear) {
        // ******* TODO: PART 4 *******
        // Update the text elements in the infoBox to reflect:
        // Selected country, region, population and stats associated with the country.
        /*
         * You will need to get an array of the values for each category in your data object
         * hint: you can do this by using Object.values(this.data)
         * you will then need to filter just the activeCountry data from each array
         * you will then pass the data as paramters to make an InfoBoxData object for each category
         *
         */

        //TODO - Your code goes here - 
        this.clearHighlight();
        let that = this;

        if (! this.data['population'].find(d => d.geo === activeCountry.toLowerCase())) {
            return null;
        }
        let infoBoxDataObjectList = Object.keys(this.data).map(
            function (key){
                let dTemp = that.data;
                let country = dTemp[key].find(d => (d.geo === activeCountry.toLowerCase()));
                let region = dTemp['population'].find(d => (d.geo == activeCountry.toLowerCase())).region;
                let indicator_name = country.indicator_name;
                let value = country[activeYear];
                

                let temp = new InfoBoxData(country.country, region, indicator_name, value);
                return temp;
        });

        let mainTitle = d3.select("#country-detail")
                          .selectAll("span#mainTitle")
                          .data([{"country" : infoBoxDataObjectList[0].country, "region" : infoBoxDataObjectList[0].region}]);

        mainTitle.exit().remove();

        let mainTitleEnterSelection = mainTitle.enter().append("div").classed("label", true);

        mainTitle = mainTitleEnterSelection.merge(mainTitle);

        mainTitle.append("i")
                 .attr("class", d => d.region)
                 .classed("fas fa-globe-asia", true);

        mainTitle.append("span")
                 .text(d => (" " + d.country))
                 .attr("id", 'mainTitle')
                 .attr("style", "color:black");

        let dataText = d3.select("#country-detail")
                         .selectAll("div#divText")
                         .data(infoBoxDataObjectList);

        dataText.exit().remove();        

        let dataTextEnterSelection = dataText.enter()
                                             .append("div")
                                             .classed("stat", true)
                                             .attr('id', 'divText');

        dataText = dataTextEnterSelection.merge(dataText);
        dataText.append("text")
                .text(d => (d.indicator_name + ' : ' + d.value));

    }


    /**
     * Removes or makes invisible the info box
     */
    clearHighlight() {
        d3.select('#country-detail').html('');
        //TODO - Your code goes here - 
    }

}