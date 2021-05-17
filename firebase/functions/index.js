const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

exports.createUserProfile = functions.auth.user().onCreate((user) => {
  const username = user.displayName.toLowerCase().replace(/[^a-z0-9]/gi, "");

  return admin.firestore()
      .collection("users")
      .doc(user.uid)
      .set({
        username: username,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      })
      .then(() => {
        functions.logger.info(`Created user profile: ${username}`);
      })
      .catch((error) => {
        functions.logger.error(`Error: ${error.code} - ${error.message}`);
      });
});
