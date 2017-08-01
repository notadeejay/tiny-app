
function generateRandomString() {
    var shorty = "";
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    do {
        for (var i = 0; i < 6; i++) {
            shorty += chars.charAt(Math.floor(Math.random() * chars.length));
        }

    } while (!urlDatabase[shorty])
    return shorty
}



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

app.get("/", (req, res) => {
    res.end("Hello!");
});

app.post("/login", (req, res) => {
    res.cookie("username", req.body.username);
    res.redirect('/urls')
});

app.post("/logout", (request, response) => {
  request.session = null;
  response.redirect("/");
  return;
});

app.get("/urls", (req, res) => {
    let shortLinks = {
        urls: urlDatabase,
        username: req.cookies["username"]
    };

    res.render("./pages/urls_index", shortLinks);
});

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

app.post("/urls", (req, res) => {
    let shortURL = generateRandomString();
    let longURL = req.body.longURL
    urlDatabase[shortURL] = longURL
    res.send("Ok");
});

app.post("/urls/:id/delete", (req, res) => {
    delete urlDatabase[req.params.id]
    res.redirect("/urls");
});

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