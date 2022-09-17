# Typie Talkie

This is the back end for my typie-talkie app. The front-end repo can be found [here](https://github.com/JonathanDPotter/typie-talkie-front).

---

## Technologies used

The back-end api for the typie-talkie app is written with express in typescript. The api accesses a MongoDB Atlas database with mongoose. I use bcrypt for password hashing, jsonwebtoken for authorization token management, and socket.io for real-time messaging.

---

## Api Routes

Api routes can be seen [here](https://typie-talkie-back.herokuapp.com/) and are as follows :

```json
{
  "message": "Welcome to Typie-Talkie-Back",
  "routes": {
    "/": { "get": "Returns this message" },
    "/api/user": {
      "get": {
        "/": "Returns all users",
        "/validate": "Checks Bearer token and returns success or failure on validation.",
        "/:_id": "Returns the user record for the user with the corresponding _id"
      },
      "post": {
        "/register": "Takes a username and password and saves them to the database with a hashed version of the password.",
        "/login": "Takes a username and password, verifies them and returns an authorization token."
      }
    }
  }
}
```

---

## Functionality

After registering a username and logging in, the app consists of an input for typing in messages that are instantly sent to all other signed in users. It is a chat app with only one room that I made to learn how to use socket.io. The front-end app can be found [here](https://typie-talkie-front-fcyl99l4c-jonathandpotter.vercel.app/).

![typie-talkie-home-page](https://user-images.githubusercontent.com/30156468/167945133-7badd9ca-7131-4d21-9472-ea4176410c43.png)
