(function(){
    "use strict";
    var path = require("path"),
        comb = require("comb"),
        patio = require("patio");
    var CONNECT_URI = "mysql://test:testpass@localhost:3306/db?minConnections=1&maxConnections=5";
    patio.connect(CONNECT_URI);

    //add patio as an export so I dont have any
    //module issues where I have the wrong instance of patio.
    exports.patio = patio;

    exports.load = (function(){
        //create a shared promise so we only load the models once, and a loaded var to store if
        //we have called load before
        var loadPromise = new comb.Promise(), loaded = false;
        return function(cb){
            if(!loaded){
                //we havent loaded yet so load the models directory at once then call the loadPromise
                patio.import(path.resolve(__dirname, "./models")).then(loadPromise);
                loaded = true;
            }
            if(cb){
                //classic accepts a callback like a normal node callback i.e. function(err, result){};
                loadPromise.classic(cb);
            }
            //return the promise incase you want to use the promise api
            return loadPromise;
        };
    })();

})();