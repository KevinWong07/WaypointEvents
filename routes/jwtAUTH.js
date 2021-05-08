const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");

router.post("/users/register", async (req,res) => {
    try {
        const { name, email, password } = req.body();

        // check if user exists in db
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [
            email
        ]); 
        // res.json(user.rows)
        if (user.rows.length != 0) {
            // REMEMBER 401 is Unauthenticated, 403 is Unauthorized
            return res.status(401).send("User already exists!") 
        }
        // bcrypt password with saltgen
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(password, salt);

        // insert new user into db
        const newUser = await pool.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *", [name, email, bcryptPassword]);

        // res.json(newUser.rows[0]);
        const token = jwtGenerator(newUser.rows[0].user_id);
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;