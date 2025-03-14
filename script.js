// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBr0k-tSymwI_yqTRSNL3jxu30WbFzJ4ak",
  authDomain: "travelgram-260aa.firebaseapp.com",
  projectId: "travelgram-260aa",
  storageBucket: "travelgram-260aa.firebasestorage.app",
  messagingSenderId: "784349147253",
  appId: "1:784349147253:web:828d603cdb1d4318cec83c",
  measurementId: "G-C4NFTWY0VX"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// 🔑 Google Sign-In
document.getElementById("login-btn").addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(result => {
        showUserInfo(result.user);
    }).catch(error => {
        alert("Login Failed: " + error.message);
    });
});

// 🔒 Logout
document.getElementById("logout-btn").addEventListener("click", () => {
    auth.signOut().then(() => {
        document.getElementById("login-section").style.display = "block";
        document.getElementById("upload-section").style.display = "none";
    });
});

// 👤 Show User Info & Gallery
const showUserInfo = (user) => {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("upload-section").style.display = "block";
    document.getElementById("user-name").innerText = user.displayName;
    loadGallery();
};

// 🖼️ Upload & Save to LocalStorage
const uploadImage = () => {
    let fileInput = document.getElementById("fileInput").files[0];

    if (!fileInput) {
        alert("Please select an image!");
        return;
    }

    let reader = new FileReader();
    reader.onload = function(event) {
        let imageUrl = event.target.result;

        // Save to LocalStorage
        let images = JSON.parse(localStorage.getItem("images")) || [];
        images.push(imageUrl);
        localStorage.setItem("images", JSON.stringify(images));

        addToGallery(imageUrl);
    };
    reader.readAsDataURL(fileInput);
};

// 📂 Load Gallery from LocalStorage
const loadGallery = () => {
    let images = JSON.parse(localStorage.getItem("images")) || [];
    document.getElementById("gallery").innerHTML = "";
    images.forEach(imgUrl => addToGallery(imgUrl));
};

// 📌 Display Uploaded Images
const addToGallery = (url) => {
    let gallery = document.getElementById("gallery");
    let img = document.createElement("img");
    img.src = url;
    gallery.appendChild(img);
};

// 🔥 Check if user is logged in
auth.onAuthStateChanged(user => {
    if (user) {
        showUserInfo(user);
    }
});
