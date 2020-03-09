const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();
const algoliasearch = require("algoliasearch");
const client = algoliasearch(
  functions.config().algolia.app,
  functions.config().algolia.adminkey
);
const index = client.initIndex("users");

exports = module.exports = functions.firestore
  .document("users/{userId}")
  .onUpdate(async (change, context) => {
    const newUserData = change.after.data();

    if (!newUserData.extended || newUserData.extended === undefined)
      return false;

    let cachedUsers = admin
      .firestore()
      .collection("cached")
      .doc("users");

    var protectedEntries = ["phone"];
    protectedEntries.forEach(element => delete newUserData.extended[element]);

    var data = {};
    data[context.params.userId] = newUserData.extended;

    await cachedUsers
      .set(data, { merge: true })
      .then(doc => {
        console.log(
          "Cached user (" +
            context.params.userId +
            ") extented data successfuly"
        );
        return true;
      })
      .catch(err => {
        if (err) console.log(err);
      });

    await index
      .saveObject({
        objectID: context.params.userId,
        ...newUserData.extended,
        _geoloc: newUserData.extended.location._geoloc
      })
      .then(obke => {
        return obke;
      })
      .catch(err => {
        console.log(err);
      });

    return true;
  });
