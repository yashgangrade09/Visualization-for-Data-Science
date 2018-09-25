/**
 * Data structure for the data associated with an individual country.
 * the CountryData class will be used to keep the data for drawing your map.
 * You will use the region to assign a class to color the map!
 */
class CountryData {
    /**
     *
     * @param type refers to the geoJSON type- countries are considered features
     * @param properties contains the value mappings for the data
     * @param geometry contains array of coordinates to draw the country paths
     * @param region the country region
     */
    constructor(type, id, properties, geometry, region) {
        this.type = type;
        this.id = id;
        this.properties = properties;
        this.geometry = geometry;
        this.region = region;
    }
}

/** Class representing the map view. */
class Map {

    /**
     * Creates a Map Object
     *
     * @param data the full dataset
     * @param updateCountry a callback function used to notify other parts of the program when the selected
     * country was updated (clicked)
     */
    constructor(data, updateCountry) {
        // ******* TODO: PART I *******
        this.projection = d3.geoWinkel3().scale(140).translate([365, 225]);
        this.nameArray = data.population.map(d => d.geo.toUpperCase());
        this.populationData = data.population;
        this.updateCountry = updateCountry;
    }

    /**
     * Renders the map
     * @param world the topojson data with the shape of all countries and a string for the activeYear
     */
    drawMap(world) {
        //note that projection is global!

        // ******* TODO: PART I *******
        let geojson = topojson.feature(world, world.objects.countries);

        let countryData = geojson.features.map(country => {

            let index = this.nameArray.indexOf(country.id);
            let region = 'countries';

            if (index > -1) {
                region = this.populationData[index].region;
                return new CountryData(country.type, country.id, country.properties, country.geometry, region);
            } else {
                return new CountryData(country.type, country.id, country.properties, country.geometry, null);

            }
        });

        try{
            let path = d3.geoPath(this.projection);
            let mapSvg = d3.select('#map-chart').append('svg');
            mapSvg.selectAll('path')
                  .data(countryData)
                  .enter()
                  .append('path')
                  .attr('d', path)
                  .attr('class', function (d){ return d.region ? d.region : ""})
                  .classed('boundary', true)
                  .classed('countries', true)
                  .attr('id', d =>  d.id);

            // Make sure to add a graticule (gridlines) and an outline to the map
            let graticule = d3.geoGraticule();
            mapSvg.append('path').datum(graticule).attr('class', 'graticule').attr('d', path);
            mapSvg.append('path').datum(graticule.outline).attr('class', 'stroke').attr('d', path);
        }
        catch(error){
            console.log(error);
        }
    }

    /**
     * Highlights the selected country and region on mouse click
     * @param activeCountry the country ID of the country to be rendered as selected/highlighted
     */
    updateHighlightClick(activeCountry) {
        // ******* TODO: PART 3*******
        // Assign selected class to the target country and corresponding region
        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for countries/regions, you can use
        // d3 selection and .classed to set these classes on here.
        //

        try{
            this.clearHighlight();
            d3.select('#map-chart svg').select('#' + activeCountry.toUpperCase()).classed('selected-country', true);
        }
        catch(error) {
            console.log(error);
        }
    }

    /**
     * Clears all highlights
     */
    clearHighlight() {
        // ******* TODO: PART 3*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes off here.

        try{
            d3.select('#map-chart svg').selectAll('.countries').classed('selected-country', false);
        }
        catch(error){
            console.log(error);
        }


    }
}
