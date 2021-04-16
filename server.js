const express = require('express');
const app = express();
const cors = require("cors");
const { pool } = require('./dbConfig');
const PORT = process.env.PORT || 4000;

app.use(express.json())
app.use(cors()) 

app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.render("index");
})

app.get('/users/register', (req, res) => {
    res.render("register");
});

app.get('/users/login', (req, res) => {
    res.render("login");
});

app.get('/users/dashboard', (req, res) => {
    res.render("dashboard");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})