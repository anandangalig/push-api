# Push Pirates API

**Technologies used:**

- Node.js
- Express.js
- MongoDB Atlas
- GraphQL
- Ramda.js (functional programming alternative to lodash)

---

**Running it locally:**

1. Create a `.env` file in the root directory and add the Mongo Atlas cluster URI with as a MONGO_ATLAS_URI variable and a randomized string as JWT_SIGNATURE (Do not save it on any public repos or share it with anyone)
2. Run `npm install` to install all dependencies
3. Run `npm start` to start the server
4. http://localhost:4000/graphql will be up and running to receive requests from your locally running frontend app. You can also visit this page on your web browser to see the GraphQL Playground.

---

**Express Related:**

- `/signup` expexts a POST request. Include user info in JSON format in the request body
- `/login` expexts a GET request. Include user info in JSON format in the request body
- `/graphql` expects a POST request

---

**GraphQL Playground:**

When using the Playground, make sure to include a valid JWT in the `HTTP HEADERS` panel:

> { "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJkYXRhIjp7Il9pZCI6IjVlOWI4NGYzMjA2MWU5NDQxZjVlOGJjNyIsInVzZXJOYW1lIjoiQ3J1eiIsImVtYWlsIjoiY3J1ekBnbWFpbC5jb20ifSwiaWF0IjoxNTg3MzE0ODYzCJleHAiOjE1ODczMzY0NjN9.G_DUSeeY_34lWWCMGODIUUYsFKxKS0PAnJSBN-Rtzkc" }
