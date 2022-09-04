const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

let users = new Array();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// create user
app.post("/api/users", (req,res) => {
  let username = req.body.username;
  let id = users.findIndex((element) => element === username)
  if(id === -1){
    users.push(username);
    id = users.length -1;
  }
  res.json({"username" : username, "_id" : id+""})
})

// get all users
app.get("/api/users", (req,res) => {

  let responseArray = new Array();
  for(let i = 0; i<users.length; i++){
    responseArray.push({"username": users.at(i), "_id": i+""})
  }
  res.send(responseArray)
})

let exercises = new Array();

// log exercise by user id
app.post("/api/users/:_id/exercises",(req,res) => {
  let id = req.params._id;
  let date = req.body.date ? new Date(req.body.date) : new Date();
  if(id >= users.length) return res.json({"error": "User does not exist"})
  
  exercises.push({
    "date" : date.toDateString(),
    "duration" : parseInt(req.body.duration),
    "description" : req.body.description,
    "usersID" : id+""
  })
  
  res.json({
    "_id" : id+"",
    "username" : users.at(id),
    "date" : date.toDateString(),
    "duration" : parseInt(req.body.duration),
    "description" : req.body.description
  })
})

// get all exercise logs of user
app.get("/api/users/:_id/logs", (req,res) => {

  let userlogs = exercises.filter((element) => {
    return element.usersID === req.params._id;
  })
  
  if(req.query.from && req.query.to){
    let from = new Date(req.query.from);
    let to = new Date(req.query.to);

    userlogs = userlogs.filter((element) => {
      let logdate = new Date(element.date)
      return logdate <= to && logdate >= from;
    });
  }

  if(req.query.limit) {
    let limit = parseInt(req.query.limit);
    userlogs.splice(limit);
  }

  let response = {
    "_id" : req.params._id,
    "username" : users.at(req.params._id),
    "count" : userlogs.length,
    "log" : userlogs
  }
  res.json(response)
})


const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
