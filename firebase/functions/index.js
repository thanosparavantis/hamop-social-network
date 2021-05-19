const functions = require("firebase-functions")

const admin = require("firebase-admin")
admin.initializeApp()

exports.createUserProfile = functions.auth.user().onCreate((user) => {
  let username = user.displayName.toLowerCase().replace(/[^a-z0-9]/gi, "")

  if (username.length === 0) {
    username = user.uid
  }

  return admin.firestore()
    .collection("users")
    .doc(user.uid)
    .set({
      username: username,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      creationDate: admin.firestore.Timestamp.now(),
    })
    .then(() => {
      functions.logger.info(`Created user profile: ${username}`)
    })
    .catch((error) => {
      functions.logger.error(`Error: ${error.code} - ${error.message}`)
    })
})

exports.createPost = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Πρέπει να είστε συνδεδεμένος για να εξυπηρετηθεί το αίτημά σας."
    )
  }

  const contentField = data.content

  if (!(typeof contentField === 'string') || contentField.length === 0 || contentField.length > 300) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Η δημοσίευση δεν περιλαμβάνει ορθό περιεχόμενο."
    )
  }

  const userId = context.auth.uid

  return admin.firestore()
    .collection("posts")
    .add({
      author: userId,
      content: contentField,
      creationDate: admin.firestore.Timestamp.now(),
    })
    .then(() => {
      functions.logger.info("New post created.")

      return {
        success: true,
      }
    })
    .catch((error) => {
      functions.logger.error(`Error: ${error.code} - ${error.message}`)

      return {
        success: false,
      }
    })
})