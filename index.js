var express = require('express'),
 app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
var _ = require('lodash');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'node_todo'
});

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine','jade');

var task = [];

app.get('/', function(req, res){
    connection.query('select * from newtask', function (error, results, fields) {
        if (error) throw error;
        var _results = _.groupBy(results, 'status');
        res.render('index', {tasks: _results[0], completed: _results[1]});
    });
    // res.render('index', {tasks: task});
});

app.post('/addTask', function(req, res){
    // console.log("req: ", req.body);
    var newTask = req.body.newtask;
    var updateTask = req.body.completed;
    if(newTask){
        connection.query('INSERT into `newtask` VALUES(DEFAULT, "'+newTask+'", "0")', function (error, results, fields) {
            if (error) throw error;
            // console.log('Task added: ', newTask);
            res.redirect('/');
            });
    }
    else{
        connection.query('UPDATE newtask SET status="0" WHERE id="'+updateTask+'"', function (error, results, fields) {
            if (error) throw error;
            // console.log('Task added: ', newTask);
            res.redirect('/');
            });
    }
    
});

app.post('/removeTask', function(req, res){
    // console.log("req: ", req.body.check);
    var completedTask = req.body.check;
    connection.query('UPDATE newtask SET status="1" WHERE id="'+completedTask+'"', function (error, results, fields) {
        if (error) throw error;
        // console.log('Task added: ', newTask);
        res.redirect('/');
        });
});

app.listen(8000, function(){
    console.log("up and Running on port 8000!");
});