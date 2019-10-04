const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const lineReader = require('line-reader');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://<userName>:<userPassword>@<mongodb link', {
	useNewUrlParser : true,
	useCreateIndex  : true
}).then (() => {
	console.log('Connected to DB');
}).catch ( err => {
	console.log('Error:',err.message);
});

var userSchema = new mongoose.Schema({
	name: String,
	email: String,
	password: String,
	transection: []
});

var dataSchema  = new mongoose.Schema({
	time: String
	
});
var User = mongoose.model("User", userSchema);
var Data = mongoose.model("Data", dataSchema);

var request = require('request');
request('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min&apikey=demo', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  var apiData = JSON.parse(body);
	var key = apiData['Last Refreshed'];
	console.log(body[5]);
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");


app.get('/', (req, res) =>{
	res.render('signin');
 });

app.post('/sign',(req, res)=> {
	 var check = {
		 email: req.body.email,
		pass: req.body.pass,
	 }
	 //email check code
	 console.log(check.email)
	 if ( !User.find(check.email) ) {
		 res.redirect('signup');
	 }
	else {
		if ( User.find(check.email) && User.find(check.pass) ) {
			res.render('portfolio', {UserInfo: User}  );
		}
	}
	
});
app.get('/sign',(req, res)=> {
	res.render('sign');
});

app.get('/portfolio', (req, res) =>{
	res.render('portfolio');
});

app.get('/transection', (req, res) =>{
	res.render('transection',); // { {email: email} variable name on other page : passsing value to that page}
});

// app.get('/signup', (req, res) =>{
// 	//res.render('signup');
// });

app.post('/signup', (req, res) =>{
	var ac = {
		name : req.body.name,
		email: req.body.email,
		pass: req.body.pass,
		balace: 5000.00
	}
	if (User.find(ac.email) ) {
		 res.redirect('sign');
	 }
	 //sign up making sure no duplicate email...
	var user = new User(ac);
	User.create(user, function(err) {
		if (err) {
			console.log(err);
		}
	});
	res.redirect('sign');
});

app.get("/newUser", (req, res) => {
	res.render('signup');
})



app.listen(3000, () => {
	console.log('Stock app is started on port : 3000');
});
