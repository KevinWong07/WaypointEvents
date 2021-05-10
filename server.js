const express = require("express");
const app = express();
// const cors = require("cors");
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");

const initializePassport = require("./passportConfig");
// PORT
const PORT = process.env.PORT || 4000;

// middleware
app.engine('html', require('ejs').renderFile);
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'xIqkJS96kNdHgp8Wi0mvIGtQ4Oa2e1nn', 
    resave: false,
    saveUninitialized: false,

}));
app.use(flash());
app.use(express.static('public'));
app.use(express.static(__dirname + '/css'));
// app.use(express.json()); // req.body
// app.use(cors()); 

// routes
// app.use("/auth", require("./routes/jwtAUTH"));

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/users/register", (req, res) => {
    res.render("register");
});

app.get("/users/login", (req, res) => {
    res.render("login");
});

app.get("/users/dashboard", (req, res) => {
    res.render("dashboard");
});

app.get("/tournament", (req, res) => {
    res.render("tournament");
})

app.post("/users/register", async (req, res) => {
    let { email, username, password, cpassword } = req.body;

    let errors = [];

    console.log({
        email, 
        username,
        password,
        cpassword
    });
    // check validation
    if (!email || !username || !password || !cpassword) {
        errors.push({ message: "PLEASE COMPLETE ALL FIELDS"});
    }
    if (password.length < 8 || password.length > 16) {
        errors.push({ message: "Password must be 8-16 characters long."});
    }
    if (password != cpassword) {
        errors.push({ message: "Passwords do not match."});
    }
    if (errors.length > 0) {
        res.render("register", { errors })
    }else {
        // validation is correct
        let hashedPassword = await bcrypt.hash(password, 10);

        console.log(hashedPassword);

        pool.query(
            `SELECT * FROM users
            WHERE email = $1`, [email], (err, results) => {
                if (err) {
                    throw err;
                }
                if (results.rows.length != 0) {
                    // REMEMBER 401 is Unauthenticated, 403 is Unauthorized
                    errors.push({message: "Error: User already exists!"}); 
                    res.render("register", { errors }); 
                } else {
                    pool.query(
                        `INSERT INTO users(username, email, password)
                        VALUES ($1, $2, $3) 
                        RETURNING * `, [username, email, hashedPassword], (err, results) => {
                            if (err) {
                                throw err;
                            }
                            console.log(results.rows);
                            req.flash('success_message', "You have successfully registered for the site. Please log in.");
                            res.redirect("/users/login");
                        }
                    );
                }
            }
        );
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})