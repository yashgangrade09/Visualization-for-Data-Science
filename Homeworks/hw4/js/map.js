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

        //world is a topojson file. you will have to convert this to geojson (hint: you should have learned this in class!)

        // Draw the background (country outlines; hint: use #map-chart)
        // Make sure to add a graticule (gridlines) and an outline to the map

        // Hint: assign an id to each country path to make it easier to select afterwards
        // we suggest you use the variable in the data element's id field to set the id

        // Make sure and give your paths the appropriate class (see the .css selectors at
        // the top of the provided html file)

        // You need to match the country with the region. This can be done using .map()
        // We have provided a class structure for the data called CountryData that you should assign the paramters to in your mapping

        //TODO - Your code goes here - 
        try{
        let geojson = topojson.feature(world, world.objects.countries);
        // console.log(geojson.features);
        // console.log(this.populationData);
        //console.log(this.nameArray);

        let pathGeojson = d3.geoPath(this.projection);
        //console.log(geojson.features);
        let svgSelection = d3.select("#map-chart").append("svg");

        let countryData = geojson.features.map(country => {

            let index = this.nameArray.indexOf(country.id);
            let region = 'countries';

            if (index > -1) {
                //  console.log(this.populationData[index].geo, country.id);
                region = this.populationData[index].region;
                return new CountryData(country.type, country.id, country.properties, country.geometry, region);
            } else {
                //console.log('not found');
                return new CountryData(country.type, country.id, country.properties, country.geometry, null);
            }
        });
        // console.log(countryData);
        svgSelection.selectAll("path")
                    .data(countryData)
                    .enter()
                    .append("path")
                    .attr("d", pathGeojson)
                    .attr("class", d => d.region)
                    .classed("countries", true)
                    .classed("boundary", true)
                    .attr("id", d => d.id);


        //formation of outlines and boundaries using outline
        let mapGraticule = d3.geoGraticule();
        svgSelection.append("path").datum(mapGraticule).attr("class", "graticule").attr("d", pathGeojson);
        svgSelection.append("path").datum(mapGraticule.outline).classed("strokeGraticule", true).attr("d", pathGeojson);
        }
        catch(error){
            console.log(error);
        }

    }

    /**
     * Highlights the selected conutry and region on mouse click
     * @param activeCountry the country ID of the country to be rendered as selected/highlighted
     */
    updateHighlightClick(activeCountry) {
        // ******* TODO: PART 3*******
        // Assign selected class to the target country and corresponding region
        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for countries/regions, you can use
        // d3 selection and .classed to set these classes on here.
        //

        //TODO - Your code goes here - 

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

        //TODO - Your code goes here - 


    }
}