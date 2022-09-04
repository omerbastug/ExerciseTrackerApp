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





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
