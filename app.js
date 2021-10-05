//Require Modules
const express = require("express");
const app = express();
const ejs = require("ejs");
const axios = require("axios");

//Parse the body
app.use(express.urlencoded({ extended: true }));

//Set the views folder
app.set('view engine', 'ejs');
//Set static files folder
app.use(express.static("public"));


//Render index
app.get("/", function(req, res) {
    res.render("index");
})


app.post("/views/renderdex.ejs", function(req, res) {

    //Make the URL for the Api Call
    const id = req.body.pokemonID;


    //Lower case the name
    const str = id.toString();
    const str1 = str.toLowerCase();

    //Make the Api call

    axios.all([
        axios.get('https://pokeapi.co/api/v2/pokemon/' + str1 + "/"),
        axios.get('https://pokeapi.co/api/v2/pokemon-species/' + str1 + "/")
    ]).then(axios.spread((response1, response2) => {

        //Save the data from the call

        const pkDataOne = response1.data;
        const pkDataTwo = response2.data;


        //Get the data that we want 

        const pkName = pkDataOne.name;
        const pkType = pkDataOne.types[0].type.name;
        const pkDescription = pkDataTwo.flavor_text_entries[0].flavor_text;
        const pkSprite = pkDataOne.sprites.other.dream_world.front_default;
        const pkHeight = pkDataOne.height;
        const pkWeight = pkDataOne.weight;
        const pkGenus = pkDataTwo.genera[7].genus;

        //Render the info
        res.render("renderdex", {
            pk_name: pkName,
            pk_type: pkType,
            pk_description: pkDescription,
            pk_sprite: pkSprite,
            pk_height: pkHeight,
            pk_weight: pkWeight,
            pk_genus: pkGenus

        });


    })).catch(error => {
        //Render error page
        res.render("error");

    });

});




//Server Up
app.listen(3000, function() {
    console.log("Port 3000");
})