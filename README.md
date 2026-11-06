# bupa_assessment

### Tech Stack
- Client: Angular App
- Server: Express JS

### Running the app locally

- This app requires node and npm to be present to run this locally.
- The underlying API/server uses expressjs and the client uses angular.
- To spin up the app locally, we are using concurrently package to run both the client and server together using a single command.

Start the app using the following
```bash
npm i
npm run dev
```

### Assumptions made

- The books are only loaded when clicking on the Get books button and not on the inital load.
- HardCover only does not fetch the books from the API, instead only filters the list in the browser.
- Since the downstream API is rate-limited, we need a cache on the server. Caching the responses for 5 minutes.
- This does not include the Operational part of it to deploy/host the code to a server.