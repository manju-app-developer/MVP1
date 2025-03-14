// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBr0k-tSymwI_yqTRSNL3jxu30WbFzJ4ak",
  authDomain: "travelgram-260aa.firebaseapp.com",
  projectId: "travelgram-260aa",
  storageBucket: "travelgram-260aa.firebasestorage.app",
  messagingSenderId: "784349147253",
  appId: "1:784349147253:web:828d603cdb1d4318cec83c",
  measurementId: "G-C4NFTWY0VX"
};

// Initialize Firebase
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

// 👤 Show User Info & Load Gallery
const showUserInfo = (user) => {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("upload-section").style.display = "block";
    document.getElementById("user-name").innerText = user.displayName;

    // Load gallery after login
    loadGallery();
};

// 🖼️ Upload Image & Save to LocalStorage
const uploadImage = () => {
    let fileInput = document.getElementById("fileInput").files[0];

    if (!fileInput) {
        alert("Please select an image!");
        return;
    }

    let uploadStatus = document.getElementById("upload-status");
    uploadStatus.innerText = "Uploading...";

    let reader = new FileReader();
    reader.onload = function(event) {
        let imageUrl = event.target.result;

        // Save to LocalStorage
        let images = JSON.parse(localStorage.getItem("images")) || [];
        images.unshift(imageUrl); // Newest images first
        localStorage.setItem("images", JSON.stringify(images));

        uploadStatus.innerText = "Upload Successful! ✅";
        setTimeout(() => { uploadStatus.innerText = ""; }, 2000);

        addToGallery(imageUrl);
    };
    reader.readAsDataURL(fileInput);
};

// 📂 Load Gallery from LocalStorage
const loadGallery = () => {
    let images = JSON.parse(localStorage.getItem("images")) || [];
    let gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    if (images.length === 0) {
        gallery.innerHTML = "<p>No images uploaded yet.</p>";
    } else {
        images.forEach(imgUrl => addToGallery(imgUrl));
    }
};

// 📌 Display Uploaded Images in Gallery
const addToGallery = (url) => {
    let gallery = document.getElementById("gallery");
    let imgContainer = document.createElement("div");
    imgContainer.classList.add("gallery-item");

    let img = document.createElement("img");
    img.src = url;
    img.alt = "Uploaded Image";

    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "🗑️";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = () => removeImage(url);

    imgContainer.appendChild(img);
    imgContainer.appendChild(deleteBtn);
    gallery.appendChild(imgContainer);
};

// ❌ Remove Image from LocalStorage & Gallery
const removeImage = (url) => {
    let images = JSON.parse(localStorage.getItem("images")) || [];
    let filteredImages = images.filter(img => img !== url);
    localStorage.setItem("images", JSON.stringify(filteredImages));

    loadGallery(); // Refresh gallery
};

// 🔥 Check if user is logged in
auth.onAuthStateChanged(user => {
    if (user) {
        showUserInfo(user);
    }
});
