

var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
var fs = require('fs');


var app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/css', express.static('css'));
app.use('/js', express.static('js'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/pages/index.html'));
});


app.post('/', function (req, res) {
  
  var user = req.body.username;
  var pass = req.body.password;

  fs.readFile('resources/login_data.json','utf8',function (err, data) {

	  if (err) throw err;

	  var content = JSON.parse(data);
	  var users=content.users;
	  var exist = false;
	  // provjeravamo da li uneseni user vec postoji, ako postoji obavijesti korisnika da unese novi
	  for(var i = 0; i < users.length; i++){
	  	if(users[i].user == user){
	  		exist = true;
	  		break;
	  	}
	  }

	  if(exist){
	  	res.redirect("/register_error");
	  }else{

	  	content.users.push(
	  	{
	  		user: user,
	  		pass: pass
	  	});
	  	fs.writeFile('resources/login_data.json', JSON.stringify(content), 'utf-8', function(err) {
			if (err) throw err
			res.redirect("/login");
		})


	  }


	});
});

app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname+'/pages/login.html'));
});

app.post('/login', function (req, res) {
	var user = req.body.username;
  	var pass = req.body.password;

  	fs.readFile('resources/login_data.json', 'utf-8', function(err, data) {
		if (err) throw err;

		var content = JSON.parse(data);
		var users=content.users;
		var exist = false;
		  // provjeravamo da li uneseni user postoji
		for(var i = 0; i < users.length; i++){
		  if(users[i].user == user && users[i].pass == pass){
		  	exist = true;
		  	break;
		  }
		}

		if(exist){
		  res.redirect("/memory_game");
		}else{
		  res.redirect("/login_error");	
		}
			
		});
  
});


app.get('/memory_game', function (req, res) {
  res.sendFile(path.join(__dirname+'/pages/memory_game.html'));
});


app.get('/register_error', function (req, res) {
  res.sendFile(path.join(__dirname+'/pages/register_error.html'));
});

app.get('/login_error', function (req, res) {
  res.sendFile(path.join(__dirname+'/pages/login_error.html'));
});


app.get('/statistics', function (req, res) {

	fs.readFile('resources/statistics.json','utf8',function (err, data) {

	  if (err) throw err;

	  var content = JSON.parse(data);
	  res.json(content);

	});
  
});


app.post('/statistics', function (req, res) {

	var users = [];
	var keys = Object.keys(req.body);
    var len = keys.length;
    var i = 0;
	while (i < len) {
	    var key = req.body[keys[i]];
	    i += 1;
	    var value = req.body[keys[i]];
	    users.push({user:key,score:value});
	    i +=1;
	}

	
	fs.writeFile('resources/statistics.json', JSON.stringify({users:users}), 'utf-8', function(err) {
			if (err) throw err
			res.json({success:true});
	});
	
  
});




app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});