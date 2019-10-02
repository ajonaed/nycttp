const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const lineReader = require('line-reader');


const account = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");


app.get('/', (req, res) =>{
	lineReader.eachLine('Output.txt', function(line) {
    var part = line.split(",");	
	var ac = {
		name : part[0],
		email: part[1],
		pass: part[2]
	}
	
	account.push(ac);
	var id  = ac.name+","+ac.email+","+ac.pass
	console.log(id)
});
	
	res.render('signin');
});
app.get('/protfolio', (req, res) =>{
	//res.render('portfolio.ejs');
	res.render('portfolio');
});
app.get('/transection', (req, res) =>{
	res.render('transection',); // { {email: email} variable name on other page : passsing value to that page}
});
app.get('/signup', (req, res) =>{
	res.render('signup');
});

app.post('/signup', (req, res) =>{
	var ac = {
		name : req.body.name,
		email: req.body.email,
		pass: req.body.pass
	}
	var id  = ac.name+","+ac.email+","+ac.pass
	fs.appendFile('Output.txt', "\n"+id, (err) => {   
    if (err) throw err; 
	})
	res.render('signin');
	
	
});


var port = 3000;
app.listen(port, () => {
	console.log('Stock app is started on port : '+ port)
});