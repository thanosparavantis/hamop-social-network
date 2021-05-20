const functions = require("firebase-functions")

const admin = require("firebase-admin")
admin.initializeApp()

exports.createUserProfile = functions.auth.user().onCreate(async (user) => {
  let username = user.displayName
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, "")

  if (username.length === 0) {
    username = user.uid
  } else {
    const docsRef = await admin.firestore()
      .collection("users")
      .where("username", "==", username)
      .get()

    if (docsRef.size > 0) {
      username = username + docsRef.size.toString()
    }
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
    .catch(error => {
      functions.logger.error(`Error: ${error.code} - ${error.message}`)
    })
})

exports.createPost = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Πρέπει να είστε συνδεδεμένος."
    )
  }

  const contentField = data.content

  if (!(typeof contentField === 'string') || contentField.length === 0 || contentField.length > 300) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Η δημοσίευση περιλαμβάνει μη έγκυρο περιεχόμενο."
    )
  }

  return admin.firestore()
    .collection("posts")
    .add({
      author: context.auth.uid,
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

exports.createComment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Πρέπει να είστε συνδεδεμένος."
    )
  }

  const contentField = data.content

  if (!(typeof contentField === 'string') || contentField.length === 0 || contentField.length > 300) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Το σχόλιο περιλαμβάνει μη έγκυρο περιεχόμενο."
    )
  }

  const postField = data.post

  const docRef = await admin.firestore()
    .collection("posts")
    .doc(postField)
    .get()

  if (!docRef.exists) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Η αρχική δημοσίευση δεν υπάρχει."
    )
  }

  return admin.firestore()
    .collection("comments")
    .add({
      author: context.auth.uid,
      post: postField,
      content: contentField,
      creationDate: admin.firestore.Timestamp.now(),
    })
    .then(() => {
      functions.logger.info("New comment created.")

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