const express = require('express');
const hbs = require('hbs');
const fs = require('fs'); //for file manipulations

var app = express();

//Register the partial folder
hbs.registerPartials(__dirname + '/views/partials');

//Set some things for the express
//Tell express what templating engine you want to use
app.set('view engine','hbs');

//********MIDDLEWARE ARE EXECUTED IN ORDER
// ORDER OF GET, POST, AND PARTIAL DOESN'T MATTER BUT ORDER OF MIDDLEWARES MATTER

//we are rendering the static page below, page is in the public directory
//Below is the middleware, we have to pass absolute path to our page
//using __dirname for absolute address
app.use(express.static(__dirname + '/public'));
//Above is actually a middleware
//we use app.use for middlewares
// IMPORTANT THING to remember is that middleware are executes in order
//LIKE BELOW WE HAVE A REDIRECT MIDDLEWARE, means every page would be redirected to the page
// that is mentioned in that middleware
// NOW IF WE ACCESS THE HELP PAGE, REDIRECTION WONT TAKE PLACE, BECAUSE REDIRECTION MIDDLEWARE IS DEFINED BELOW THIS MIDDLEWARE


// We call also register the FUNCTIONS to be called dynamically in the page
// remember the functions as 'Helpers' and we have to register them first
// Takes 2 arguments, first is the name and the second is the function to RUN

// There is no need of special syntax to call the function
// just call the function as {{getCurrentYear}}
hbs.registerHelper('getCurrentYear', ()=>{
        return new Date().getFullYear();
});

// If you have arguments to pass, just put them after a space and
hbs.registerHelper('screamIt', (argument)=>{
    return argument.toUpperCase();
});


//Express MiddleWare
//A Middleware is used if we want to do some stuff before executing the
// request by the user
//For example let say we want to log the request and time before executing the request
//We can just put a middleware for that
// Lets say you want to log some data in database BEFORE directing user to a specific requested page
// Or you just want to process some info before directing user to a page
// For everything above you can use middleware
// app.use(...) is how we register a middleware
app.use((request, response, next)=>{

    let now = new Date().toDateString();
    let logdata = (`${now} ${request.originalUrl} ${request.method}`);
    console.log(logdata);

    fs.appendFile('server.log', logdata+'\n' , (error)=>{
        if(error) {
            console.log(`An error occurred ! ${error}`);
        }
    });
    //This important next(in the parameters) is telling that we are done, now you can go next
    // If we don't call next, APPLICATION WOULD GET STUCK, it will not go forward
    // So if user has typed some url, this middleware os going to run first
    // After we do our stuff next() MUST be called to allow whatever is due next
    next();
});


// Middleware for maintenance
app.use((request, response, next)=>{
    // There's NO DIFFERENCE in the response,request objects what you get in middleware and what you get in get/post request
    response.render('maintenance.hbs', {
        pageTitle : 'Maintenance',
        pageName: 'Maintenance',
        message: `Website is under construction`
    });
});





//setting up all http route handlers

//setup route handler for http get-request
//argument are:  url, whatToSendBack
app.get('/example',(request, response)=>{
   response.send({
       name: 'Adeel',
       Objection:{
           lazy:true
       }
   });
});

app.get('/about', (request, response)=>{
   response.render('about.hbs',{
       pageTitle: 'About Page'
   });
});

app.get('/', (request, response)=>{
   response.render('home.hbs',{
       pageTitle: 'Home Page',
       title: 'Home Page',
       name: 'home'
   } );
});

app.get('/bad',(request, response)=>{
    response.send({
        error: 'Unable to send data'
    });
});

// .listen takes 2 arguments and the second argument is optional
app.listen(3000, ()=>{
    console.log(`Server Up bro !`);
});