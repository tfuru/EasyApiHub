// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import firebaseConfig from '/firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const authStateChanged = (callback, error) => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("user", user);
      if (callback) {
        callback(user);
      }
    } else {
      // User is signed out
      // ...
      console.log("user is signed out");
      if (error) {
        error();
      }
    }
  });
}

export const clickLogin = (callback, error) => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    "hd": "cluster.mu",
  });
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      console.log("user", user);

      const loginContainer = document.getElementById('login_container');
      if (loginContainer) {
        loginContainer.style.display = 'none';
      }

      const menuContainer = document.getElementById('menu_container');
      if (menuContainer) {
        menuContainer.style.display = 'block';
      }

      if (callback){ 
        callback();
      }
    }).catch((e) => {
      console.log("error", e);
      if (error) {
        error();
      }
    });
};

export const clickLogout = (e) => {
  auth.signOut().then(() => {
    // Sign-out successful.
    const loginContainer = document.getElementById('login_container');
    if (loginContainer) {
      loginContainer.style.display = 'block';
    }
    const menuContainer = document.getElementById('menu_container');
    if (menuContainer) {
      menuContainer.style.display = 'none';
    }
  }).catch((error) => {
    // An error happened.
  });
};

export const clickVerify = (e) => {
  window.location.href = '/verify';
};

export const clickResetranking = (e) => {
  window.location.href = '/resetranking';
};