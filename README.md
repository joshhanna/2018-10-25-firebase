# { fayetteville.js } talk on Firebase

You can see the slides [here](https://docs.google.com/presentation/d/1ZvhButHYxTLNIdjJeGrtbZL6uT-5aB2iAa4yOPykkPk/edit?usp=sharing).

# Quickstart

You'll need to change the firebase credentials to your own things. By the time I share this, I'll have deleted my firebase project. :)

To do this, first you'll need to go to the Firebase Console and create a new project. You'll need to enable Authentication and a Firestore database in the console.

Next, you'll need to update `frontend/src/components/App.jsx` and change this bit:

```
var config = {
  apiKey: "yourkey",
  authDomain: "yourdomain",
  databaseURL: "yoururl",
  projectId: "yourid",
  storageBucket: "",
  messagingSenderId: "yourid"
};
```

You'll also need to change `.firebaserc` to use your `projectId` instead of the fake one that I've placed in there.

You'll be able to get all of this information from the Firebase Console in the Authentication section. There is a 'Web setup' button on the top right that will display your configuration.

Finally, you should be able to run the following commands to get it served locally.

    yarn && yarn login
    yarn start

And you can deploy with the following command.

    yarn deploy

# Notes

- There may be an issue installing the Google Cloud Functions emulator due to an engine mismatch. You can force it by using the `--ignore-engines` flag in yarn.
- It's possible I've missed other places you'll need to make config changes. If you find a spot, let me know and I'll update this README.
- Feel free to reach out to me if you have any questions or comments.
