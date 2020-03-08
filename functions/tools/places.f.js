const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Places = require("google-places-web").default;
Places.apiKey = functions.config().google.key;

exports = module.exports = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    let partialAddress = data.search;
    const radius = 2000;
    const language = "fr";

    // Search with default opts
    return await Places.autocomplete({
      input: partialAddress,
      radius,
      language
    })
      .then(results => {
        return results;
      })
      .catch(e => console.log(e));
  });
