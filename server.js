var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
var cookieParser = require('cookie-parser')
app.use(cookieParser())

app.set("view engine", "ejs");


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};


//generate a random id & random URL

function generateRandomString() {
    var shorty = "";
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    do {
        for (var i = 0; i < 6; i++) {
            shorty += chars.charAt(Math.floor(Math.random() * chars.length));
        }

    } while (urlDatabase[shorty])
    return shorty
}

function findUserEmail (email) {
  let found = "";

  for (var key in users) {
    if (users[key].email === email) {
      found = key
    }
  }
  return found
}

//store users
const users = {};



//homepage
app.get("/", (req, res) => {
    res.end("Hello!");
});

//login
app.post("/login", (req, res) => {
    res.cookie("username", req.body.username);
    res.redirect('/urls')
});

//registration pag
app.get("/register", (req, res) => {
 res.render("./pages/register")
});

//register for an acct
app.post("/register", (req, res) => {
 let email = req.body.email;
 let password = req.body.password;
 let id = generateRandomString();
 if (!(email && password)) {
  res.statusCode = 400
  res.end ('Enter a valid e-mail and password to register')
 };

 if (findUserEmail(email)) {
  res.statusCode = 400;
  res.end("The email you entered is already registered with an account.");
 } else {

 let newUser = {
        id: id,
        email : email,
        password: password
  }
  users[id] = newUser
  console.log(users);

  res.cookie("user_ID", id)
  res.redirect('/urls')
 }
});

//logout and clear cookies
app.post("/logout", (req, res) => {
  res.clearCookie("username", req.body.username)
  res.redirect("/urls");
  return;
});

//list the current shortlinks
app.get("/urls", (req, res) => {
    let shortLinks = {
        urls: urlDatabase,
        username: req.cookies["username"]
    };

    res.render("./pages/urls_index", shortLinks);
});


//create new short link
app.get("/urls/new", (req, res) => {
    let templateVars = {
        username: req.cookies["username"]
    }
    res.render("./pages/urls_new", templateVars);
});


app.get("/u/:shortURL", (req, res) => {
    let longURL = urlDatabase[req.params.shortURL]
    res.redirect(longURL);
});

//add new short URL pairing to database
app.post("/urls", (req, res) => {
    let shortURL = generateRandomString();
    let longURL = req.body.longURL
    urlDatabase[shortURL] = longURL
    res.send("Ok");
});

//delete from database
app.post("/urls/:id/delete", (req, res) => {
    delete urlDatabase[req.params.id]
    res.redirect("/urls");
});

//look at specific shortlink
app.get("/urls/:id", (req, res) => {
    let idObj = {
      shortURL: req.params.id,
      longURL: urlDatabase[req.params.id],
      username: req.cookies["username"] };

      res.render("./pages/urls_show", idObj);
  });




app.post("/urls/:id", (req, res) => {
    urlDatabase[req.params.id] = {longURL: req.body.updateURL};
    res.redirect('/urls')
});




app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});




app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});