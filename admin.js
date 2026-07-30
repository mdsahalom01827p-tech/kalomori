import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
getFirestore,
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "kalomori-a637b.firebaseapp.com",
projectId: "kalomori-a637b",
storageBucket: "kalomori-a637b.firebasestorage.app",
messagingSenderId: "177260666749",
appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const PASSWORD = "123456";

document.getElementById("loginBtn").onclick = async () => {

const pass = document.getElementById("adminPassword").value;

if(pass !== PASSWORD){

alert("❌ ভুল Password");

return;

}

document.querySelector(".card").style.display="none";
document.getElementById("adminArea").style.display="block";

loadUsers();

};

async function loadUsers(){

const userList=document.getElementById("userList");

userList.innerHTML="";

const snap=await getDocs(collection(db,"users"));

snap.forEach(doc=>{

const u=doc.data();

userList.innerHTML+=`

<div style="background:#0f172a;padding:10px;border-radius:10px;margin-top:10px;">

<b>${u.firstName || u.name}</b><br>

ID : ${u.telegramId}<br>

Balance : ৳${u.balance}

</div>

`;

});

}
