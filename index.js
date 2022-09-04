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



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
