const router = require("express").Router();
const pool = require("../db");

router.post("/users/register", async (req,res) => {
    try {
        const { name, email, password } = req.body();

        // check if user exists in db
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
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

        const bcryptPassword = bcrypt.hash(password, salt);

        // insert new user into db
        const newUser= await pool.query("INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3)", 
        [name, email, bcryptPassword]
        );

        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

module.exports = router;