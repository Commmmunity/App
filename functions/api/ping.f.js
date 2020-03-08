const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports = module.exports = functions.https.onRequest(async (req, res) => {
  res.status(200).send({
    success: true
  });
});
