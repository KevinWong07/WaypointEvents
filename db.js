const Pool = require("pg").Pool

const pool = new Pool({
    user: "waypointadmin",
    password: "SQUARE8admin1",
    host: "localhost",
    port: 5432,
    database: "waypointevents"
})

module.exports = pool;