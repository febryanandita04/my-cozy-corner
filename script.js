// ==================================
// MY COZY CORNER ♡
// Interactive features
// ==================================


// 1. PILIH MOOD HARI INI

const moodCards = document.querySelectorAll(".mood-card");
const moodMessage = document.getElementById("mood-message");

const moodMessages = {
    Happy: "Yay! Keep that beautiful smile shining! 🌷",
    Sad: "It's okay to feel sad. Be gentle with yourself. 🩷",
    Tired: "You deserve some rest. Take it slow today. 🧸",
    Excited: "Someone has lots of happy energy today! ✨",
    Calm: "Take a deep breath and enjoy this little moment. ☁️"
};

moodCards.forEach(function(card) {
    card.addEventListener("click", function() {

        moodCards.forEach(function(item) {
            item.classList.remove("active");
        });

        card.classList.add("active");

        const selectedMood = card.dataset.mood;

        moodMessage.textContent = moodMessages[selectedMood];

        localStorage.setItem("cozyMood", selectedMood);
    });
});


// Tampilkan mood terakhir yang dipilih

const savedMood = localStorage.getItem("cozyMood");

if (savedMood && moodMessages[savedMood]) {
    moodCards.forEach(function(card) {
        if (card.dataset.mood === savedMood) {
            card.classList.add("active");
        }
    });

    moodMessage.textContent = moodMessages[savedMood];
}


// 2. DIARY DIGITAL

const titleInput = document.getElementById("diary-title");
const contentInput = document.getElementById("diary-content");
const saveButton = document.getElementById("save-diary");
const diaryMessage = document.getElementById("diary-message");
const diaryList = document.getElementById("diary-list");


// Ambil catatan yang tersimpan di browser

function getDiaryEntries() {
    try {
        const savedEntries = localStorage.getItem("cozyDiary");
        const entries = savedEntries ? JSON.parse(savedEntries) : [];

        return Array.isArray(entries) ? entries : [];
    } catch (error) {
        return [];
    }
}


// Simpan catatan ke browser

function storeDiaryEntries(entries) {
    try {
        localStorage.setItem("cozyDiary", JSON.stringify(entries));
        return true;
    } catch (error) {
        diaryMessage.textContent =
            "Oops! Your story couldn't be saved. 🥺";

        return false;
    }
}


// Format tanggal agar mudah dibaca

function formatDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


// Tampilkan semua catatan

function renderDiary() {
    const entries = getDiaryEntries();

    diaryList.replaceChildren();

    if (entries.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.className = "empty-message";
        emptyMessage.textContent =
            "Your little memories will appear here ♡";

        diaryList.appendChild(emptyMessage);
        return;
    }

    entries.forEach(function(entry) {
        const article = document.createElement("article");
        article.className = "diary-entry";

        const heading = document.createElement("h4");
        heading.textContent = entry.title;

        const date = document.createElement("time");
        date.textContent = formatDate(entry.date);

        const paragraph = document.createElement("p");
        paragraph.textContent = entry.content;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete ♡";

        deleteButton.addEventListener("click", function() {
            deleteDiaryEntry(entry.id);
        });

        article.appendChild(heading);
        article.appendChild(date);
        article.appendChild(paragraph);
        article.appendChild(deleteButton);

        diaryList.appendChild(article);
    });
}


// Tambahkan catatan baru

saveButton.addEventListener("click", function() {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        diaryMessage.textContent =
            "Please fill in your title and story first! 🎀";
        return;
    }

    const entries = getDiaryEntries();

    const newEntry = {
        id: Date.now().toString(),
        title: title,
        content: content,
        date: new Date().toISOString()
    };

    entries.unshift(newEntry);

    if (storeDiaryEntries(entries)) {
        titleInput.value = "";
        contentInput.value = "";

        diaryMessage.textContent =
            "Your little story has been saved! 💌";

        renderDiary();
    }
});


// Hapus catatan

function deleteDiaryEntry(id) {
    const entries = getDiaryEntries();

    const updatedEntries = entries.filter(function(entry) {
        return entry.id !== id;
    });

    if (storeDiaryEntries(updatedEntries)) {
        diaryMessage.textContent = "Memory deleted ♡";
        renderDiary();
    }
}


// Tampilkan catatan ketika halaman dibuka

renderDiary();
