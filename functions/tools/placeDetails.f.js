const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Places = require("google-places-web").default;
Places.apiKey = functions.config().google.key;

exports = module.exports = functions
  .region("europe-west1")
  .https.onCall(async (data, context) => {
    let placeId = data.placeId;

    try {
      const response = await Places.details({ placeid: placeId });
      const { status, result } = response;
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
