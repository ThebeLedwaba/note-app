const noteForm = document.getElementById("noteForm");
const noteInput = document.getElementById("noteInput");
const noteList = document.getElementById("noteList");

async function fetchNotes() {
  const res = await fetch("/api/notes");
  const notes = await res.json();

  noteList.innerHTML = "";
  notes.forEach(note => {
    const li = document.createElement("li");
    li.textContent = note.content;

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "delete-btn";
    delBtn.onclick = async () => {
      await fetch(`/api/notes/${note._id}`, { method: "DELETE" });
      fetchNotes();
    };

    li.appendChild(delBtn);
    noteList.appendChild(li);
  });
}

noteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: noteInput.value })
  });
  noteInput.value = "";
  fetchNotes();
});

fetchNotes();
