const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { WebClient } = require("@slack/web-api");
// const token = "xoxb-989766152422-987860776325-bMT4FIhJRjNekMrLk82Yv4CS";

exports = module.exports = functions.https.onRequest(async (req, res) => {
  res.status(200).send(req.body.challenge);
});
