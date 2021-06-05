const functions = require("firebase-functions")

const admin = require("firebase-admin")
admin.initializeApp()

exports.createUser = functions
  .region("europe-west1")
  .auth
  .user()
  .onCreate(async (user) => {
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
        photoURL: user.photoURL,
        postCount: 0,
        commentCount: 0,
        likeCount: 0,
        starCount: 0,
        creationDate: admin.firestore.Timestamp.now(),
      })
      .then(() => {
        functions.logger.info(`Created user profile: ${username}`)
      })
  })

exports.incrementUserPostCount = functions
  .region("europe-west1")
  .firestore
  .document("posts/{postId}")
  .onCreate((snapshot, context) => {
    const postObj = snapshot.data()

    return admin
      .firestore()
      .collection("users")
      .doc(postObj.author)
      .update({
        postCount: admin.firestore.FieldValue.increment(1)
      })
  })

exports.decrementUserPostCount = functions
  .region("europe-west1")
  .firestore
  .document("posts/{postId}")
  .onDelete((snapshot, context) => {
    const postObj = snapshot.data()

    return admin
      .firestore()
      .collection("users")
      .doc(postObj.author)
      .update({
        postCount: admin.firestore.FieldValue.increment(-1)
      })
  })

exports.incrementUserCommentCount = functions
  .region("europe-west1")
  .firestore
  .document("comments/{commentId}")
  .onCreate((snapshot, context) => {
    const commentObj = snapshot.data()

    return admin
      .firestore()
      .collection("users")
      .doc(commentObj.author)
      .update({
        commentCount: admin.firestore.FieldValue.increment(1)
      })
  })

exports.decrementUserCommentCount = functions
  .region("europe-west1")
  .firestore
  .document("comments/{commentId}")
  .onDelete((snapshot, context) => {
    const commentObj = snapshot.data()

    return admin
      .firestore()
      .collection("users")
      .doc(commentObj.author)
      .update({
        commentCount: admin.firestore.FieldValue.increment(-1)
      })
  })

exports.incrementUserLikeCount = functions
  .region("europe-west1")
  .firestore
  .document("likes/{likeId}")
  .onCreate((snapshot, context) => {
    const likeObj = snapshot.data()

    return admin
      .firestore()
      .collection("users")
      .doc(likeObj.user)
      .update({
        likeCount: admin.firestore.FieldValue.increment(1)
      })
  })

exports.decrementUserLikeCount = functions
  .region("europe-west1")
  .firestore
  .document("likes/{likeId}")
  .onDelete((snapshot, context) => {
    const likeObj = snapshot.data()

    return admin
      .firestore()
      .collection("users")
      .doc(likeObj.user)
      .update({
        likeCount: admin.firestore.FieldValue.increment(-1)
      })
  })

exports.createPost = functions
  .region("europe-west1")
  .https
  .onCall((data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Πρέπει να είστε συνδεδεμένος."
      )
    }

    let contentField = data.content

    if (typeof contentField !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Η δημοσίευση περιλαμβάνει μη έγκυρο περιεχόμενο."
      )
    }

    contentField = contentField.trim()

    if (contentField.length === 0 || contentField.length > 1000) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Η δημοσίευση περιλαμβάνει μη έγκυρο περιεχόμενο."
      )
    }

    let topicField = data.topic ? data.topic : null

    return admin.firestore()
      .collection("posts")
      .add({
        author: context.auth.uid,
        content: contentField,
        topic: topicField,
        commentCount: 0,
        likeCount: 0,
        creationDate: admin.firestore.Timestamp.now(),
      })
      .then(() => {
        functions.logger.info("New post created.")

        return {
          success: true,
        }
      })
  })

exports.incrementPostCommentCount = functions
  .region("europe-west1")
  .firestore
  .document("comments/{commentId}")
  .onCreate((snapshot, context) => {
    const commentObj = snapshot.data()

    return admin
      .firestore()
      .collection("posts")
      .doc(commentObj.post)
      .update({
        commentCount: admin.firestore.FieldValue.increment(1)
      })
  })

exports.decrementPostCommentCount = functions
  .region("europe-west1")
  .firestore
  .document("comments/{commentId}")
  .onDelete((snapshot, context) => {
    const commentObj = snapshot.data()

    return admin
      .firestore()
      .collection("posts")
      .doc(commentObj.post)
      .update({
        commentCount: admin.firestore.FieldValue.increment(-1)
      })
  })

exports.incrementPostLikeCount = functions
  .region("europe-west1")
  .firestore
  .document("likes/{likeId}")
  .onCreate((snapshot, context) => {
    const likeObj = snapshot.data()

    return admin
      .firestore()
      .collection("posts")
      .doc(likeObj.post)
      .update({
        likeCount: admin.firestore.FieldValue.increment(1)
      })
  })

exports.decrementPostLikeCount = functions
  .region("europe-west1")
  .firestore
  .document("likes/{likeId}")
  .onDelete((snapshot, context) => {
    const likeObj = snapshot.data()

    return admin
      .firestore()
      .collection("posts")
      .doc(likeObj.post)
      .update({
        likeCount: admin.firestore.FieldValue.increment(-1)
      })
  })

exports.createComment = functions
  .region("europe-west1")
  .https
  .onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Πρέπει να είστε συνδεδεμένος."
      )
    }

    let contentField = data.content

    if (typeof contentField !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Το σχόλιο περιλαμβάνει μη έγκυρο περιεχόμενο."
      )
    }

    contentField = contentField.trim()

    if (contentField.length === 0 || contentField.length > 1000) {
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
  })

exports.deletePostComments = functions
  .region("europe-west1")
  .firestore
  .document("/posts/{postId}")
  .onDelete((snap, context) => {
    return admin.firestore()
      .collection("comments")
      .where("post", "==", snap.id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(doc => doc.ref.delete())
      })
  })

exports.deletePostLikes = functions
  .region("europe-west1")
  .firestore
  .document("/posts/{postId}")
  .onDelete((snap, context) => {
    return admin.firestore()
      .collection("likes")
      .where("post", "==", snap.id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(doc => doc.ref.delete())
      })
  })

exports.incrementUserStarsFromPostLike = functions
  .region("europe-west1")
  .firestore
  .document("likes/{likeId}")
  .onCreate(async (snapshot, context) => {
    const likeObj = snapshot.data()

    const postRef = await admin.firestore()
      .collection("posts")
      .doc(likeObj.post)
      .get()

    const postObj = postRef.data()

    if (postObj.author === likeObj.user) {
      return
    }

    return admin
      .firestore()
      .collection("users")
      .doc(likeObj.user)
      .update({
        starCount: admin.firestore.FieldValue.increment(1)
      })
  })

exports.decrementUserStarsFromPostLike = functions
  .region("europe-west1")
  .firestore
  .document("likes/{likeId}")
  .onDelete(async (snapshot, context) => {
    const likeObj = snapshot.data()

    const postRef = await admin.firestore()
      .collection("posts")
      .doc(likeObj.post)
      .get()

    const postObj = postRef.data()

    if (postObj.author === likeObj.user) {
      return
    }

    return admin
      .firestore()
      .collection("users")
      .doc(likeObj.user)
      .update({
        starCount: admin.firestore.FieldValue.increment(-1)
      })
  })
