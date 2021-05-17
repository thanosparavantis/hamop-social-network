const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

exports.createUserProfile = functions.auth.user().onCreate((user) => {
  const username = user.displayName.toLowerCase().replace(/[^a-z0-9]/gi, "");

  admin.firestore()
      .collection("users")
      .doc(user.uid)
      .set({
        username: username,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      })
      .then(() => {
        console.log("User profile created successfully.");
      })
      .catch((error) => {
        console.error(`An error occurred: ${error.code} - ${error.message}`);
      });
});
