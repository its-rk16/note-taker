document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("saveNote");
    const notesList = document.getElementById("notesList");
    const darkModeToggle = document.getElementById("toggleDarkMode");
    const body = document.body;

    // Load saved notes and dark mode preference
    loadNotes();
    loadDarkMode();

    saveButton.addEventListener("click", saveNote);
    darkModeToggle.addEventListener("click", toggleDarkMode);

    function saveNote() {
        const title = document.getElementById("noteTitle").value.trim();
        const description = document.getElementById("noteDescription").value.trim();

        if (!title || !description) {
            alert("Both title and description are required!");
            return;
        }

        const newNote = { title, description };

        chrome.storage.local.get(["notes"], function (data) {
            const notes = data.notes || [];
            notes.push(newNote);

            chrome.storage.local.set({ notes: notes }, function () {
                console.log("Note saved successfully!");
                displayNotes(notes);
            });
        });

        document.getElementById("noteTitle").value = "";
        document.getElementById("noteDescription").value = "";
    }

    function loadNotes() {
        chrome.storage.local.get(["notes"], function (data) {
            const notes = data.notes || [];
            displayNotes(notes);
        });
    }

    function displayNotes(notes) {
        notesList.innerHTML = "";

        notes.forEach((note, index) => {
            const noteItem = document.createElement("div");
            noteItem.classList.add("note-item");

            noteItem.innerHTML = `
                <div>
                    <strong>${note.title}</strong>
                    <p>${note.description}</p>
                </div>
                <div>
                    <button class="edit-btn" data-index="${index}">Edit</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </div>
            `;

            notesList.appendChild(noteItem);
        });

        document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", function () {
                const index = parseInt(this.getAttribute("data-index"));
                deleteNote(index);
            });
        });

        document.querySelectorAll(".edit-btn").forEach((btn) => {
            btn.addEventListener("click", function () {
                const index = parseInt(this.getAttribute("data-index"));
                editNote(index);
            });
        });
    }

    function deleteNote(index) {
        chrome.storage.local.get(["notes"], function (data) {
            let notes = data.notes || [];
            notes.splice(index, 1);

            chrome.storage.local.set({ notes: notes }, function () {
                console.log("Note deleted.");
                displayNotes(notes);
            });
        });
    }

    function editNote(index) {
        chrome.storage.local.get(["notes"], function (data) {
            let notes = data.notes || [];
            const note = notes[index];

            document.getElementById("noteTitle").value = note.title;
            document.getElementById("noteDescription").value = note.description;

            notes.splice(index, 1);
            chrome.storage.local.set({ notes: notes }, function () {
                displayNotes(notes);
            });
        });
    }

    function toggleDarkMode() {
        body.classList.toggle("dark-mode");

        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
            darkModeToggle.textContent = "LightMode";
        } else {
            localStorage.setItem("darkMode", "disabled");
            darkModeToggle.textContent = "DarkMode";
        }
    }

    function loadDarkMode() {
        if (localStorage.getItem("darkMode") === "enabled") {
            body.classList.add("dark-mode");
            darkModeToggle.textContent = "LightMode";
        }
    }
});
