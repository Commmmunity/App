const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();

const createProfile = async (userRecord, context) => {
  const { email, displayName, uid, profileURL } = userRecord;

  var domain = email.substring(email.lastIndexOf("@") + 1);

  var data = {
    email: email,
    domain: domain,
    profileURL: profileURL,
    notification: {
      transactional: true,
      digest: true,
      meet: true
    },
    displayName: displayName
  };

  await db
    .collection("users")
    .doc(uid)
    .set(data)
    .catch();

  return true;
};

exports = module.exports = functions
  .region("europe-west1")
  .auth.user()
  .onCreate(createProfile);
