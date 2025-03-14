// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBr0k-tSymwI_yqTRSNL3jxu30WbFzJ4ak",
  authDomain: "travelgram-260aa.firebaseapp.com",
  projectId: "travelgram-260aa",
  storageBucket: "travelgram-260aa.appspot.com",
  messagingSenderId: "784349147253",
  appId: "1:784349147253:web:828d603cdb1d4318cec83c",
  measurementId: "G-C4NFTWY0VX"
};

// 🔥 Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const storage = firebase.storage();
const storageRef = storage.ref();

// 🔑 Google Sign-In
document.getElementById("login-btn").addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(result => showUserInfo(result.user))
        .catch(error => alert("Login Failed: " + error.message));
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
    loadGallery(user.uid);
};

// 🖼️ Upload Image to Firebase Storage
document.getElementById("upload-btn").addEventListener("click", () => {
    let fileInput = document.getElementById("fileInput").files[0];

    if (!fileInput) {
        alert("Please select an image!");
        return;
    }

    let uploadStatus = document.getElementById("upload-status");
    uploadStatus.innerText = "Uploading...";

    let user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to upload images!");
        return;
    }

    let fileRef = storageRef.child(`users/${user.uid}/${fileInput.name}`);
    let uploadTask = fileRef.put(fileInput);

    uploadTask.on("state_changed", 
        (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploadStatus.innerText = `Uploading: ${Math.round(progress)}%`;
        },
        (error) => {
            alert("Upload Failed: " + error.message);
            uploadStatus.innerText = "";
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                saveImageToLocalStorage(downloadURL, user.uid);
                uploadStatus.innerText = "Upload Successful! ✅";
                setTimeout(() => { uploadStatus.innerText = ""; }, 2000);
            });
        }
    );
});

// 📂 Save Image to LocalStorage
const saveImageToLocalStorage = (imageUrl, userId) => {
    let images = JSON.parse(localStorage.getItem(`images_${userId}`)) || [];
    images.unshift(imageUrl);
    localStorage.setItem(`images_${userId}`, JSON.stringify(images));
    addToGallery(imageUrl);
};

// 📂 Load Gallery from LocalStorage
const loadGallery = (userId) => {
    let images = JSON.parse(localStorage.getItem(`images_${userId}`)) || [];
    let gallery = document.getElementById("gallery");
    gallery.innerHTML = images.length === 0 ? "<p>No images uploaded yet.</p>" : "";
    
    images.forEach(imgUrl => addToGallery(imgUrl));
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

// ❌ Remove Image from Firebase & LocalStorage
const removeImage = (url) => {
    let user = auth.currentUser;
    if (!user) return;

    let images = JSON.parse(localStorage.getItem(`images_${user.uid}`)) || [];
    let filteredImages = images.filter(img => img !== url);
    localStorage.setItem(`images_${user.uid}`, JSON.stringify(filteredImages));

    let imageName = url.split("%2F").pop().split("?")[0];
    let fileRef = storageRef.child(`users/${user.uid}/${imageName}`);

    fileRef.delete().then(() => {
        loadGallery(user.uid);
    }).catch(error => {
        alert("Error deleting image: " + error.message);
    });
};

// 🔥 Check if user is logged in
auth.onAuthStateChanged(user => {
    if (user) {
        showUserInfo(user);
    }
});
