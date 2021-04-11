const express = require("express");
const bodyParser = require("body-parser");
const expressGraphQL = require("express-graphql").graphqlHTTP;
const serverless = require("serverless-http");

const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require("graphql");

const app = express();

// const schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: "HelloWorld",
//     fields: () => ({
//       message: {
//         type: GraphQLString,
//         resolve: () => "Hello World",
//       },
//     }),
//   }),
// });

app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Welcome!!!");
});

app.get("/signup", (req, res) => {
  // const { username } = req.body;
  //... do some validations / verifications
  // e.g. uniqueness check etc
  //   console.log("In signup");
  res.redirect(`https://bro.${req.hostname}`);
});

// Handling requests from the subdomains: 2 steps
// Step 1: forward the request to other internal routes e.g. with patterns like `/subdomain/:subdomain_name/whatever-path`

app.use((req, res, next) => {
  // if subdomains
  if (req.subdomains.length) {
    // this is trivial, you should filtering out things like `www`, `app` or anything that your app already uses.

    const subdomain = req.subdomains.join(".");

    // forward to internal url by reconstructing req.url

    req.url = `/subdomains/${subdomain}${req.url}`;
  }
  return next();
});

// Handling requests from the subdomains: 2 steps
// Step 2: Have router setup for handling such routes
// you must have created the subdomainRoutes somewhere else

app.get("/subdomains/:subdomain", (req, res) => {
  console.log("ping");
  res.send("done!");
});

module.exports.handler = serverless(app);
