
function generateRandomString() {
    var shorty = "";
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    do {
        for (var i = 0; i < 7; i++) {
            shorty += chars.charAt(Math.floor(Math.random() * chars.length));
        }

    } while (!urlDatabase[shorty])
    return shorty
}




var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080



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

app.get("/urls", (req, res) => {
  let shortLinks = {
    urls: urlDatabase
};

res.render("./pages/urls_index", shortLinks);
});

app.get("/urls/new", (req, res) => {
  res.render("./pages/urls_new");
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
   let shortURL = generateRandomString();
   let longURL = req.body.longURL
   urlDatabase[shortURL] = longURL

  console.log(urlDatabase);  // debug statement to see POST parameters
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:id/delete", (req, res) => {
    delete urlDatabase[req.params.id]
    res.redirect("/urls");
});

app.get("/urls/:id", (req, res) => {
  let idObj = {
      shortURL: req.params.id,
      longURL: urlDatabase[req.params.id] };
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