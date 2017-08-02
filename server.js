const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const cookieParser = require('cookie-parser')
app.use(cookieParser())

app.set("view engine", "ejs");


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": {
      "longURL": "http://www.lighthouselabs.ca",
       "userID": "w18nf2"
  },

  "9sm5xK": {
      "longURL": "http://www.google.com",
       "userID" : "8732ew"
   }
};


//generate a random id & random URL

function generateRandomString() {
    let shorty = "";
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    do {
        for (let i = 0; i < 6; i++) {
            shorty += chars.charAt(Math.floor(Math.random() * chars.length));
        }

    } while (urlDatabase[shorty])
    return shorty
}

function findUserEmail (email) {
  let found = "";

  for (let key in users) {
    if (users[key].email === email) {
      found = key
    }
  }
  return found
}

function currentUser(req) {
  for (let user in users) {
    if (req.cookies["user_ID"] === user) {
      return user;
  }
}
 return "";
 }


//store users
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};


//homepage
app.get("/", (req, res) => {
    res.end("Hello!");
});



app.get("/login", (req, res) => {
 res.render("./pages/login")
});

//login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let foundID = findUserEmail(email);

    if (!foundID) {
        res.statusCode = 403;
        res.end("The email you entered cannot be found.");
   } else if (password !== users[foundID].password) {
       res.statusCode = 403;
       res.end("The password you entered does not match");
   } else {
      res.cookie('user_ID', foundID)
      res.redirect('/urls')
  }
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

// if e-mail and password are empty strings
 if (!(email && password)) {
  res.statusCode = 400
  res.end ('Enter a valid e-mail and password to register')
 };

//if email already exists
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

  res.cookie("user_ID", id)
  res.redirect('/urls')
 }
});

//logout and clear cookies
app.post("/logout", (req, res) => {
  res.clearCookie("user_ID")
  res.redirect("/login");
  return;
});

//list the current shortlinks
app.get("/urls", (req, res) => {

    let templateVars = {
        urls: urlDatabase,
        user: users[req.cookies["user_ID"]]
    };

   res.render("./pages/urls_index", templateVars)
});




//create new short link
app.get("/urls/new", (req, res) => {
let templateVars = {
        user: users[req.cookies["user_ID"]]
    }

  if (currentUser(req)) {
     res.render("./pages/urls_new", templateVars);
   } else {
    res.redirect('/login');
  }
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
    let templateVars = {
      shortURL: req.params.id,
      longURL: urlDatabase[req.params.id],
      user: users[req.cookies["user_ID"]]
    };

      res.render("./pages/urls_show", templateVars);
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