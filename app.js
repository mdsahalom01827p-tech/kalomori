// ===============================
// কালো মরিচ - app.js (Part 1/3)
// Firebase + Telegram Login
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
getFirestore,
doc,
getDoc,
setDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyBJu9oZvK4K3q7tjFuHicz-522lXVnRhDU",
authDomain: "kalomori-a637b.firebaseapp.com",
projectId: "kalomori-a637b",
storageBucket: "kalomori-a637b.firebasestorage.app",
messagingSenderId: "177260666749",
appId: "1:177260666749:web:09c93a73bfcd37eab23614"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Telegram Web App
const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const user = tg.initDataUnsafe?.user;

if (!user) {

document.getElementById("userInfo").innerHTML = `
<h3>⚠️ Telegram Mini App থেকে খুলুন</h3>
`;

throw new Error("Telegram User Not Found");

}

document.getElementById("userInfo").innerHTML = `
<h3>👋 ${user.first_name}</h3>
<p>🆔 ${user.id}</p>
<p>👤 @${user.username || "নেই"}</p>
`;

console.log("Firebase Connected");
console.log(user);// ===============================
// কালো মরিচ - app.js (Part 2/3)
// Firestore User Save + Balance Load
// ===============================

async function saveUser() {

    const userRef = doc(db, "users", String(user.id));
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {

        await setDoc(userRef, {
            telegramId: user.id,
            firstName: user.first_name,
            lastName: user.last_name || "",
            username: user.username || "",
            balance: 0,
            referral: 0,
            totalIncome: 0,
            totalWithdraw: 0,
            joinedAt: serverTimestamp()
        });

        console.log("✅ New User Saved");

    } else {

        console.log("✅ User Already Exists");

    }

}

async function loadBalance() {

    const userRef = doc(db, "users", String(user.id));
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {

        const data = userSnap.data();

        document.getElementById("balance").innerText =
            "৳" + (data.balance || 0);

        console.log("Balance Loaded:", data.balance);

    }

}

// Save user then load balance
await saveUser();
await loadBalance();// ===============================
// কালো মরিচ - app.js (Part 3/3)
// Dashboard Navigation
// ===============================

const homePage = document.getElementById("homePage");
const dashboardPage = document.getElementById("dashboardPage");

const startBtn = document.getElementById("startBtn");
const taskBtn = document.getElementById("taskBtn");
const referBtn = document.getElementById("referBtn");
const withdrawBtn = document.getElementById("withdrawBtn");
const profileBtn = document.getElementById("profileBtn");

// Home → Dashboard
startBtn.addEventListener("click", async () => {

    homePage.style.display = "none";
    dashboardPage.style.display = "block";

    await loadBalance();

});

// Task
taskBtn.addEventListener("click", () => {

    alert("🚧 Task System Part 4 এ যোগ করা হবে");

});

// Referral
referBtn.addEventListener("click", () => {

    const link =
`https://t.me/KaloMorich_Bot?start=${user.id}`;

    navigator.clipboard.writeText(link);

    alert("✅ Referral Link Copy হয়েছে");

});

// Withdraw
withdrawBtn.addEventListener("click", () => {

    alert("💵 Withdraw System Part 5 এ যোগ করা হবে");

});

// Profile
profileBtn.addEventListener("click", () => {

    alert(
`👤 ${user.first_name}

🆔 ${user.id}

💰 Balance: ${document.getElementById("balance").innerText}`
    );

});

console.log("✅ Kalo Morich Mini App Ready");// ===============================
// কালো মরিচ - Part 4
// Task + Income System
// ===============================

// Daily Income
const DAILY_REWARD = 10;

// Task Button
taskBtn.addEventListener("click", async () => {

    const ok = confirm(
        "আজকের টাস্ক সম্পন্ন করবেন?\n\nরিওয়ার্ড: ৳10"
    );

    if (!ok) return;

    const userRef = doc(db, "users", String(user.id));

    const snap = await getDoc(userRef);

    if (!snap.exists()) return;

    const data = snap.data();

    const newBalance = (data.balance || 0) + DAILY_REWARD;

    await setDoc(userRef, {

        ...data,

        balance: newBalance,
        totalIncome: (data.totalIncome || 0) + DAILY_REWARD,
        lastTask: Date.now()

    });

    document.getElementById("balance").innerText =
        "৳" + newBalance;

    alert("🎉 অভিনন্দন!\n\n৳10 যোগ হয়েছে।");

});// ===============================
// কালো মরিচ - Part 5
// Withdraw System
// ===============================

withdrawBtn.addEventListener("click", async () => {

    const amount = prompt("কত টাকা Withdraw করবেন?");

    if (!amount) return;

    const withdrawAmount = Number(amount);

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        alert("সঠিক Amount লিখুন");
        return;
    }

    const userRef = doc(db, "users", String(user.id));

    const snap = await getDoc(userRef);

    if (!snap.exists()) return;

    const data = snap.data();

    if ((data.balance || 0) < withdrawAmount) {

        alert("❌ পর্যাপ্ত Balance নেই");

        return;

    }

    const withdrawRef = doc(
        db,
        "withdraws",
        Date.now().toString()
    );

    await setDoc(withdrawRef, {

        userId: user.id,
        name: user.first_name,
        username: user.username || "",
        amount: withdrawAmount,
        status: "Pending",
        createdAt: serverTimestamp()

    });

    await setDoc(userRef, {

        ...data,

        balance: data.balance - withdrawAmount

    });

    document.getElementById("balance").innerText =
        "৳" + (data.balance - withdrawAmount);

    alert("✅ Withdraw Request পাঠানো হয়েছে");

});
