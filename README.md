# Push Pirates API

**Technologies used:**

- Node.js
- Express.js
- MongoDB Atlas
- GraphQL
- Ramda.js (functional programming alternative to lodash)
- Nodemailer (sends password reset emails)
- jsonwebtoken

---

**Running it locally:**

1. Create a `.env` file in the root directory (see list below for needed variables)
2. Run `npm install` to install all dependencies
3. Run `npm start` to start the server
4. http://localhost:4000/graphql will be up and running to receive requests from your locally running frontend app. You can also visit this page on your web browser to see the GraphQL Playground.

```
JWT_SIGNATURE = ""
GMAIL_USERNAME = ""
GMAIL_PASSWORD = ""
GOOGLE_OATH_CLIENT_ID = "" (can be found in https://console.developers.google.com/apis/credentials using team@rumble.capital account)
API_URL = "http://localhost:4000"
MONGO_ATLAS_URI = "mongodb+srv://username:password@push-cluster-abswp.mongodb.net/test?retryWrites=true&w=majority"
```

When running the Expo app at the same time from your local, send your requests to the LAN IP address of your machine, and not the public IP address or http://localhost or http://127.0.0.1

To find your LAN IP address on a Mac, run `ipconfig getifaddr en1` from the command line.

**Express Related:**

- `/graphql` endpoint requires a valid token to interact with, and it is the only endpoint that has GraphQL running the business logic
- All others, such as `/reset-password` and `/login`, were broken out and are handled separately

This approach was implemented to account for requests that does not require authorization (e.g. signup process will never have a valid token to provide). Undoubtedly, there must be better and more cohesive solution for this out there. Please bring it up to the group if anyone comes across one.

---

**GraphQL Playground:**

When using the Playground, make sure to include a valid JWT in the `HTTP HEADERS` panel:

> { "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJkYXRhIjp7Il9pZCI6IjVlOWI4NGYzMjA2MWU5NDQxZjVlOGJjNyIsInVzZXJOYW1lIjoiQ3J1eiIsImVtYWlsIjoiY3J1ekBnbWFpbC5jb20ifSwiaWF0IjoxNTg3MzE0ODYzCJleHAiOjE1ODczMzY0NjN9.G_DUSeeY_34lWWCMGODIUUYsFKxKS0PAnJSBN-Rtzkc" }
