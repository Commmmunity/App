const functions = require("firebase-functions");
const admin = require("firebase-admin");

const { WebClient } = require("@slack/web-api");

const token = "xoxb-989766152422-987860776325-bMT4FIhJRjNekMrLk82Yv4CS";
const web = new WebClient(token);
const teamId = "TV3NJ4GCE";
const channelId = "CURDP94SD";

exports = module.exports = functions.https.onRequest(async (req, res) => {
  if (req.query.email !== undefined) {
    // See: https://api.slack.com/methods/chat.postMessage
    const res = await web.admin.users.invite({
      channel_ids: channelId,
      email: req.query.email,
      team_id: teamId,
      custom_message: "Hello toi ca roule ?"
    });

    // `res` contains information about the posted message
    console.log(res.ts);

    res.status(200).send({
      success: true
    });
  } else {
    res.status(403).send({
      success: false,
      error: 403,
      message: "User email missing."
    });
  }
});
