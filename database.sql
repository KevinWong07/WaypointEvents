//To be entered into psql console//
//TESTING PURPOSES ONLY//
CREATE DATABASE waypointevents;

CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

//INSERT FAKE USER//
INSERT INTO users (username, email, password) VALUES ('kevinwong','kw.kevin_wong@hotmail.com','password');