// Define margins
var margin = {
    top: 40,
    right: 20,
    bottom: 40,
    left: 60
};
var bar_margin = {
    top: 40,
    right: 20,
    bottom: 100,
    left: 160
};

//Width and height for svg of Bubble plot
var outer_width = 1300;
var outer_height = 700;
var svg_width = outer_width - margin.left - margin.right;
var svg_height = outer_height - margin.top - margin.bottom;

//width and height for svg of bar charts 
var outer_bar_width = 400;
var outer_bar_height = 300;
var svg_bar_width = outer_bar_width - margin.left - margin.right;
var svg_bar_height = outer_bar_height - margin.top - margin.bottom;

// The year to display and country to dispaly
display_year = 1900;
country_name = "";
var border = 0.5;
var bordercolor = 'black';
// define a function that filters data by year
function yearFilter(value) {
    return (value.Year == display_year)
}
//define a function that fileters data by country
function countryFilter(value) {
    return (value.Country == country_name)
}
//define a function that fileters data by region
function regionFilter(value) {
    if (value.Region == "Europe") {
        if (document.getElementById("europe").checked) {
            return true;
        } else {
            return false;
        }
    };
    if (value.Region == "Africa") {
        if (document.getElementById("africa").checked) {
            return true;
        } else {
            return false;
        }
    };
    if (value.Region == "South America") {
        if (document.getElementById("southamerica").checked) {
            return true;
        } else {
            return false;
        }
    };
    if (value.Region == "North America") {
        if (document.getElementById("northamerica").checked) {
            return true;
        } else {
            return false;
        }
    };
    if (value.Region == "Central America") {
        if (document.getElementById("centralamerica").checked) {
            return true;
        } else {
            return false;
        }
    };
    if (value.Region == "Asia") {
        if (document.getElementById("asia").checked) {
            return true;
        } else {
            return false;
        }
    };
    if (value.Region == "Oceania") {
        if (document.getElementById("oceania").checked) {
            return true;
        } else {
            return false;
        }
    };

};
//Sort function to sort the regions/gov datasets
function sortObject(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
}
//Create SVG element as a group with the margins transform applied to it
var svg = d3.select("#area3")
    .append("svg")
    .attr("width", svg_width + margin.left + margin.right)
    .attr("height", svg_height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//Create SVG element as a group with the margins transform applied to it
var svg_bar_region = d3.select("#area1")
    .append("svg")
    .attr("width", (svg_bar_width) + bar_margin.left + bar_margin.right)
    .attr("height", svg_bar_height + bar_margin.top + bar_margin.bottom)
    .attr("class", "graph-svg-component")
    .append("g")
    .attr("border", border)
    .attr("transform", "translate(" + bar_margin.left + "," + bar_margin.top + ")");

//Create SVG element as a group with the margins transform applied to it
var svg_bar_gov = d3.select("#area2")
    .append("svg")
    .attr("width", (svg_bar_width) + bar_margin.left + bar_margin.right)
    .attr("height", svg_bar_height + bar_margin.top + bar_margin.bottom)
    .attr("class", "graph-svg-component")
    .append("g")
    .attr("border", border)
    .attr("transform", "translate(" + bar_margin.left + "," + bar_margin.top + ")");

//draw border of bar gov bar chart
var borderPath = svg_bar_gov.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", svg_bar_height)
    .attr("width", svg_bar_width)
    .style("stroke", bordercolor)
    .style("fill", "none")
    .style("stroke-width", border);

//draw border of bar reg bar chart
var borderPath = svg_bar_region.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", svg_bar_height)
    .attr("width", svg_bar_width)
    .style("stroke", bordercolor)
    .style("fill", "none")
    .style("stroke-width", border);

//Create a colour scale using colour brewers palette              
var colourScale = d3.scaleOrdinal(d3.schemeAccent);

//Custom Color scale - Based on the google 10 pallete
var colourScale1 = d3.scaleOrdinal()
    .range(["#3366cc", "#dc3912", "#109618", "#990099", "#ff9900", "#7A5230", "#ffff00", "#66aa00"]);

// Create a vertical linearscale to posision the y axis
var yScale = d3.scaleLinear()
    .domain([10, 90])
    .range([svg_height, 0]);

// Create a log scale object to nicely take care of positioning points along the horizontal axis
// We don't set the domain yet as data isn't loaded
var xScale = d3.scaleLog()
    .domain([142, 182668])
    .range([0, svg_width]);

//Create scale object for the radius of the circles                     
var rScale = d3.scaleSqrt()
    .domain([0, 5e8])
    .range([0, 70]);

//Create scale object for the bar charts x axis                      
var y_bar_gov_Scale = d3.scaleBand()
    .domain(["islamic republic", "republic", "monarchy", "federal republic", "absolute monarchy", "people's republic", "parliamentary federal republic", "socialist republic", "external territory"])
    .rangeRound([svg_bar_height, 0])
    .padding(0.2);

//Create scale object for the bar charts y axis       
var x_bar_gov_Scale = d3.scaleLinear()
    .domain([0, 125])
    .rangeRound([0, svg_bar_width]);

//Create scale object for the bar charts x axis       
var y_bar_reg_Scale = d3.scaleBand()
    .domain(["Africa", "Asia", "Central America", "Europe", "North America", "Oceania", "South America"])
    .rangeRound([svg_bar_height, 0])
    .padding(0.1);

//Create scale object for the bar charts y axis     
var x_bar_reg_Scale = d3.scaleLinear()
    .domain([0, 55])
    .rangeRound([0, svg_bar_width]);

//Define Y axis
var yAxis = d3.axisLeft()
    .scale(yScale);

// Create an x-axis connected to the x scale that shows the acutall data rather then logs. 
var xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(10, d3.format(",d"));

//scale axes for both bar charts
var y_bar_reg_Axis = d3.axisLeft(y_bar_reg_Scale)
var x_bar_reg_Axis = d3.axisBottom(x_bar_reg_Scale)
    .ticks(5)
var y_bar_gov_Axis = d3.axisLeft(y_bar_gov_Scale)
var x_bar_gov_Axis = d3.axisBottom(x_bar_gov_Scale)
    .ticks(5)

// Call y axis label
svg.append("text")
    .attr("class", "label axis")
    .attr("transform", "rotate(-90)")
    .attr("y", 10 - margin.left)
    .attr("x", 0 - (svg_height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Life expectancy (years)");

//Call x axis label 
svg.append("text")
    .attr("class", "label axis")
    .attr("transform", "translate(" + (svg_width / 2) + " ," + (svg_height + margin.top - 5) + ")")
    .style("text-anchor", "middle")
    .text("Gross domestic product (dollars)");

// Call the y axis
svg.append("g")
    .attr("class", "axis")
    .attr("id", "y-axis")
    .call(yAxis);

//call the x axis
svg.append("g")
    .attr("class", "axis")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + svg_height + ")")
    .call(xAxis);

//Call the year label      
svg.append("text")
    .attr("id", "thisyear")
    .attr("text-anchor", "end")
    .attr("x", 1220)
    .attr("y", 617)
    .style("opacity", 0.5)
    .attr("font-size", "150px")
    .text(+display_year);

//Call the title label
svg.append("text")
    .attr("id", "title label")
    .attr("text-anchor", "front")
    .attr("x", 20)
    .attr("y", 30)
    .style("opacity", 0.9)
    .attr("font-size", "30px")
    .attr("font-family", "sans-serif")
    .attr("font-style", "italic")
    .text("World Metrics 1900-2016");


// Call the x axis for goverment type barchart
svg_bar_gov.append("g")
    .attr("class", "axis")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + svg_bar_height + ")")
    .call(x_bar_gov_Axis);
// Call the y axis for goverment type barchart    
svg_bar_gov.append("g")
    .attr("class", "axis")
    .attr("id", "y-axis")
    .call(y_bar_gov_Axis);

//Create government bar chart x axis label    
svg_bar_gov.append("text")
    .attr("class", "label axis")
    .attr("transform", "translate(" + (svg_bar_width / 2) + " ," + (svg_bar_height + bar_margin.top - 50) + ")")
    .style("text-anchor", "middle")
    .attr("y", 33)
    .attr("dy", "0.71em")
    .style("color", "black")
    .text("Frequency of countries")

// Call the x axis for region type barchart    
svg_bar_region.append("g")
    .attr("class", "axis")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + svg_bar_height + ")")
    .call(x_bar_reg_Axis);
// Call the y axis for region type barchart    
svg_bar_region.append("g")
    .attr("class", "axis")
    .attr("id", "y-axis")
    .call(y_bar_reg_Axis)

//Create region bar chart x axis label    
svg_bar_region.append("text")
    .attr("class", "label axis")
    .attr("transform", "translate(" + (svg_bar_width / 2) + " ," + (svg_bar_height + bar_margin.top - 50) + ")")
    .style("text-anchor", "middle")
    .attr("y", 33)
    .attr("dy", "0.71em")
    .text("Frequency of countries")

//Call the title label
svg_bar_region.append("text")
    .attr("id", "title label")
    .attr("text-anchor", "front")
    .attr("x", 0)
    .attr("y", -8)
    .style("opacity", 0.9)
    .attr("font-size", "14px")
    .attr("font-family", "sans-serif")
    .attr("font-style", "italic")
    .attr("font-weight", "bold")
    .text("Number of Countries per Region");

//Call the title label
svg_bar_gov.append("text")
    .attr("id", "title label")
    .attr("text-anchor", "front")
    .attr("x", 0)
    .attr("y", -8)
    .style("opacity", 0.9)
    .attr("font-size", "14px")
    .attr("font-family", "sans-serif")
    .attr("font-style", "italic")
    .attr("font-weight", "bold")
    .text("Number of Countries with each Government type");

// gridlines in y axis function
function make_y_gridlines() {
    return d3.axisLeft(yScale)
        .ticks(10)
}
// gridlines in x axis function
function make_x_gridlines() {
    return d3.axisBottom(xScale)
        .ticks(10)
}
// gridlines in x axis function for the bar charts
function make_x_bar_reg_gridlines() {
    return d3.axisBottom(x_bar_reg_Scale)
        .ticks(5)
}
function make_x_bar_gov_gridlines() {
    return d3.axisBottom(x_bar_gov_Scale)
        .ticks(5)
}

// add the X gridlines
svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + svg_height + ")")
    .call(make_x_gridlines()
        .tickSize(-svg_height)
        .tickFormat("")
    )

// add the Y gridlines
svg.append("g")
    .attr("class", "grid")
    .call(make_y_gridlines()
        .tickSize(-svg_width)
        .tickFormat("")
    )

// add the X gridlines to the region chart
svg_bar_region.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + svg_bar_height + ")")
    .call(make_x_bar_reg_gridlines()
        .tickSize(-svg_bar_height)
        .tickFormat("")
    )
// add the X gridlines to the government chart
svg_bar_gov.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + svg_bar_height + ")")
    .call(make_x_bar_gov_gridlines()
        .tickSize(-svg_bar_height)
        .tickFormat("")
    )


//fucntion to toggle if the animiation has been pasued
function stop() {
    if (isclicked === false) {
        isclicked = true;
    }
}

var duration = 1000;
var interval;
var isclicked = false;
var selected_country = false;
//starts the animation, only selects every 10 years upto 1950 and then selects ever year upto 2016. 
//If the animation is paused then clear interval is called.  
function start() {
    var interval = setInterval(function () {
        if (display_year >= 1900 && display_year < 1980) {
            display_year = Math.floor(display_year / 10);
            display_year += 1;
            display_year *= 10;
        } else {
            display_year++;
            if (display_year > 2016) {
                display_year = 1900;
            }
        }

        d3.select("#year").property("value", display_year);


        if (isclicked === true) {
            clearInterval(interval);
            isclicked = false;
        }
        generateVis()
    }, duration);
}

// Define a fucntion to draw a bubble plot
function generateVis() {

    // Filter the data to only include the current year
    var filtered_dataset = dataset.filter(yearFilter);
    // gets unique regions and number of occurences
    var regionCount = d3.nest()
        .key(function (d) {
            return d.Region;
        })
        .rollup(function (v) {
            return v.length;
        })
        .entries(filtered_dataset);

    console.log(regionCount)

    // gets unique regions and number of occurences    
    var governmentCount = d3.nest()
        .key(function (d) {
            return d.Government;
        })
        .rollup(function (v) {
            return v.length;
        })
        .entries(filtered_dataset);

    // sort filtered_dataset decending by population so the smaller circles will draw over the larger ones
    filtered_dataset.sort(function (a, b) {
        return b.Population - a.Population
    })
    governmentCount.sort(function (x, y) {
        return d3.ascending(x.key, y.key);
    })
    //governmentCount = sortObject(governmentCount);
    //console.log(governmentCount);
    //filter the data depending on which region has been selected
    var filtered_dataset = filtered_dataset.filter(regionFilter);

    // Filter the dataset for a specfic country and draw a path of the country from 1900 to 2016 
    if (selected_country === true) {
        var country_dataset = dataset.filter(countryFilter);
        var vline = svg.selectAll("line")
            .data(country_dataset, function key(d) {
                return d.Country;
            });
        var vline = d3.line()
            .x(function (d) {
                return xScale(d.GDP)
            })
            .y(function (d) {
                return yScale(d.LifeExp)
            })
            .curve(d3.curveCatmullRom.alpha(1));

        svg.append("path")
            .data([country_dataset])
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 2)
            .transition()
            .attr("d", vline);
    }



    /******** PERFORM DATA JOIN ************/
    // Join new data with old elements, if any.
    var points = svg.selectAll("circle")
        .data(filtered_dataset, function key(d) {
            return d.Country;
        });

    var bars_gov = svg_bar_gov.selectAll(".bar")
        .data(governmentCount);

    var bars_reg = svg_bar_region.selectAll(".bar")
        .data(regionCount);

    var labels = svg.selectAll(".labels")
        .data(filtered_dataset, function key(d) {
            return d.Country;
        });



    /******** HANDLE UPDATE SELECTION ************/
    // Update the display of existing elelemnts to mathc new data
    //Bubble plots update
    points
        .transition()
        .duration(1200)
        .attr("cx", function (d) {
            return xScale(+d.GDP);
        })
        .attr("cy", function (d) {
            return yScale(+d.LifeExp);
        })
        .attr("r", function (d) {
            return rScale(+d.Population);
        })
        .attr("fill", function (d) {
            return (d.Region);
        })
        .attr("stroke", "black")

    //Region bar chart update
    bars_reg
        .transition()
        .duration(1200)
        .ease(d3.easeBounce)
        .attr("y", function (d) {
            return y_bar_reg_Scale(d.key);
        })
        .attr("x", 0)
        .attr("height", y_bar_reg_Scale.bandwidth())
        .attr("width", function (d) {
            return x_bar_reg_Scale(+d.value);
        })

    //Government bar chart update    
    bars_gov
        //.transition()
        //.duration(120)
        //.ease(d3.easeBounce)
        .attr("y", function (d) {
            return y_bar_gov_Scale(d.key);
        })
        .attr("x", 0)
        .attr("height", y_bar_gov_Scale.bandwidth())
        .attr("width", function (d) {
            return x_bar_gov_Scale(+d.value);
        })

    //Bubble plot country labels update    
    labels
        .transition()
        .duration(1200)
        .attr("class", "labels")
        .attr("x", function (d) {
            return xScale(+d.GDP);
        })
        .attr("y", function (d) {
            return yScale(+d.LifeExp);
        })

    /******** HANDLE ENTER SELECTION ************/
    // Create new elements in the dataset
    // Bubble plot enter. If mouse is hovered over a bubble then the country name will be dispalyed 
    points
        .enter()
        .append("circle")
        .attr("cx", function (d,) {
            return xScale(+d.GDP);
        })
        .attr("cy", function (d) {
            return yScale(+d.LifeExp);
        })
        .attr("r", function (d) {
            return rScale(+d.Population);
        })
        .style("fill", function (d, i) {
            return colourScale(d.Region);
        })
        .style("stroke", "black")
        .attr("opacity", 1)
        .on("mouseover", function (d) {
            d3.select(this)
                .style("stroke-width", 2)
                .transition()
                .duration(500)
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("stroke-width", 1)
                .transition()
                .duration(500);
        })
        .append("title")
        .text(function (d) {
            return d.Country;
        });

    // Region bar chart enter. If mouse is hovered over a bar then the country name will be dispalyed 
    bars_reg.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", function (d, i) {
            return y_bar_reg_Scale(d.key);
        })
        .attr("x", 0)
        .attr("height", y_bar_reg_Scale.bandwidth())
        .attr("width", function (d) {
            return x_bar_reg_Scale(+d.value);
        })
        .attr("fill", function (d) {
            return colourScale(d.key)
        })
        .style("stroke", "black")
        .style("stroke-width", 0.5)
        .on("mouseover", function (d) {
            d3.select(this)
                .style("stroke-width", 2)
                .transition()
                .duration(500);
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("stroke-width", 0.5)
                .transition()
                .duration(500);
        })
        .append("title")
        .text(function (d) {
            return d.key;
        });

    // Government bar chart enter. If mouse is hovered over a bar then the country name will be dispalyed 
    bars_gov.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", function (d, i) {
            return y_bar_gov_Scale(d.key);
        })
        .attr("x", 0)
        .attr("height", y_bar_gov_Scale.bandwidth())
        .attr("width", function (d) {
            return x_bar_gov_Scale(+d.value);
        })
        .attr("fill", "steelblue")
        .style("stroke", "black")
        .style("stroke-width", 0.5)
        .on("mouseover", function (d) {
            d3.select(this)
                .style("stroke-width", 2)
                .transition()
                .duration(500);
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("stroke-width", 0.5)
                .transition()
                .duration(500);
        })
        .append("title")
        .text(function (d) {
            return d.key;
        });

    //Enter for country labels. Initialised as invisible
    labels.enter()
        .append("text")
        .attr("class", "labels")
        .text(function (d) {
            return d.Country;
        })
        .attr("text-anchor", "left")
        .attr("x", function (d) {
            return xScale(+d.GDP);
        })
        .attr("y", function (d) {
            return yScale(+d.LifeExp);
        })
        .attr("fill", "black")
        .style("font-size", function (d) {
            return rScale(+d.Population) + "px";
        })
        .attr("visibility", "hidden");


    /******** HANDLE EXIT SELECTION ************/
    // Remove points that not longer have a matching data eleement
    points.exit()
        .transition()
        .duration(400)
        .style("opacity", 0.2)
        .remove();

    bars_gov.exit()
        .transition()
        .duration(100)
        .ease(d3.easeBounce)
        .attr("y", function (d) {
            return svg_bar_height;
        })
        .attr("height", 0)
        .remove();

    bars_reg.exit()
        .transition()
        .duration(100)
        .ease(d3.easeBounce)
        .attr("y", function (d) {
            return svg_bar_height;
        })
        .attr("height", 0)
        .remove();

    labels.exit()
        .remove()

    //Update the current year
    d3.select("#year_header").text("Year: " + display_year)
    d3.select("#thisyear").text(display_year)

    //toggle for checkbox which controls if the country lables are visable or invisable
    if (document.getElementById("labeldisplay").checked) {
        labels.attr("visibility", "visible")
    } else {
        labels.attr("visibility", "hidden")
    };
    //If a country is selected then bubbles will be made opaque and when resumed the path will be removed
    if (selected_country === true) {
        points.attr("opacity", 0.2)
        console.log("started")
        selected_country = false;
    } else {
        points.attr("opacity", 1);
        d3.selectAll("path.line").remove();
    }
}

// Load the file data.csv and generate a visualisation based on it
d3.csv("data/Gapminder_All_Time.csv", function (error, data) {

    // handle any data loading errors
    if (error) {
        console.log("Something went wrong");
        console.log(error);
    } else {
        console.log("Data Loaded");

        // Assign  the data object loaded to the global dataset variable
        dataset = data;

        /* 
           //update the domain of the bar charts
           y_bar_gov_Scale.domain(dataset.map(function(d) {
               return d.Government;
           }));

           //y_bar_Scale.domain([0,d3.max(governmentCount, function(d) { return d.value;})])

           y_bar_reg_Scale.domain(dataset.map(function(d) {
               return d.Region;
           }));

           // Due to issues with the axes labels I had to staticly set the domains. 
                  
                // Update the domain of the x scale
                xScale.domain(d3.extent(dataset, (function(d) {
                    return +d.GDP;
                })));
                yScale.domain(d3.extent(dataset, (function(d) {
                    return +d.LifeExp
                })));
               // rScale.domain(d3.extent(dataset, (function(d) {
                    return +d.Population
                })));
            */

        // Get a dataset with countries as the key
        countries_dataset = d3.nest()
            .key(function (d) {
                return d.Country;
            })
            .entries(dataset);
        //get array of unique_countries 
        var country_dropdown = document.getElementById("countrypicker");
        var unique_countries = [];
        for (var i = 0; i < countries_dataset.length; i++) {
            unique_countries.push(countries_dataset[i].key);
        }
        //Populate the country dropdown with all countries 
        // Select the select element
        var select = d3.select('#countrypicker');

        // Bind the data to the options in the select element
        var options = select.selectAll('option')
            .data(unique_countries)
            .enter()
            .append('option');

        // Set the text and value for each option
        options.text(function (d) { return d; })
            .attr('value', function (d) { return d; });
            
            
        generateVis();
        start();
    }
});

// hide the pause button when inisiated
d3.select('#pause_button').style("display","block");
d3.select('#play_button').style("display","none");
//.on to handel the play and pause button 
d3.select("#pause_button")
    .on("click", function() {
        d3.select('#pause_button').style("display","none");
        d3.select('#play_button').style("display","block");
        stop();
    });
d3.select("#play_button")
    .on("click", function() {
        d3.selectAll(".pointer").remove();
        d3.select('#pause_button').style("display","block");
        d3.select('#play_button').style("display","none");
        start();
    });
//update the year that is selected on the slider    
function updateSlider(year) {
    display_year = year;
    generateVis();
}
//Update the year that is slected on the dropdown
function selectYear(year) {
    display_year = this.options[this.selectedIndex].text;

    generateVis();
}
var country_dataset
//Update the selected country
function selectCountry(country) {
    country_name = this.options[this.selectedIndex].text;
    selected_country = true;
    display_year = 2015;
    stop();
    d3.select('#pause_button').style("display","none");
    d3.select('#play_button').style("display","block"); 
}
//Populate the year dropdown with all years 
var yearsArr = [];
var ctr = 0;
for (i = new Date("Jan 01, 2016 00:00:00").getFullYear(); i >= 1900; i--) {
    yearsArr[ctr] = i;
    ctr++;
    
}

// Select the select element
var select = d3.select('#yearpicker');

// Bind the data to the options in the select element
var options = select.selectAll('option')
    .data(yearsArr)
    .enter()
    .append('option');

// Set the text and value for each option
options.text(function (d) { return d; })
    .attr('value', function (d) { return d; });