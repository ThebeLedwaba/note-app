const noteForm = document.getElementById("noteForm");
const noteInput = document.getElementById("noteInput");
const noteList = document.getElementById("noteList");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const totalNotes = document.getElementById("totalNotes");
const lastUpdated = document.getElementById("lastUpdated");

let notes = [];
let lastFetchTime = null;

// Format date for display
function formatDate(dateString) {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Fetch notes from server
async function fetchNotes() {
  try {
    const res = await fetch("/api/notes");
    if (!res.ok) throw new Error('Failed to fetch notes');
    
    notes = await res.json();
    lastFetchTime = new Date();
    updateStats();
    renderNotes();
  } catch (error) {
    console.error('Error fetching notes:', error);
    showError('Failed to load notes. Please try again.');
  }
}

// Render notes to the DOM
function renderNotes() {
  if (notes.length === 0) {
    noteList.innerHTML = '<div class="empty-state">No notes yet. Add your first note above!</div>';
    return;
  }

  // Filter and sort notes
  const filteredNotes = filterNotes(notes);
  const sortedNotes = sortNotes(filteredNotes);

  noteList.innerHTML = '';
  sortedNotes.forEach(note => {
    const li = document.createElement('li');
    li.className = 'note-item';
    
    li.innerHTML = `
      <div class="note-content">
        ${note.content}
        <div class="note-date">Created: ${formatDate(note.createdAt)}</div>
      </div>
      <div class="note-actions">
        <button class="btn-danger delete-btn" data-id="${note._id}">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    
    noteList.appendChild(li);
  });

  // Add event listeners to delete buttons
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const noteId = btn.dataset.id;
      await deleteNote(noteId);
    });
  });
}

// Filter notes based on search input
function filterNotes(notes) {
  const searchTerm = searchInput.value.toLowerCase();
  if (!searchTerm) return notes;
  
  return notes.filter(note => 
    note.content.toLowerCase().includes(searchTerm)
  );
}

// Sort notes based on selected option
function sortNotes(notes) {
  const sortBy = sortSelect.value;
  
  return [...notes].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  });
}

// Delete a note
async function deleteNote(noteId) {
  try {
    const res = await fetch(`/api/notes/${noteId}`, { 
      method: 'DELETE' 
    });
    
    if (!res.ok) throw new Error('Failed to delete note');
    
    notes = notes.filter(note => note._id !== noteId);
    updateStats();
    renderNotes();
  } catch (error) {
    console.error('Error deleting note:', error);
    showError('Failed to delete note. Please try again.');
  }
}

// Add a new note
async function addNote(content) {
  try {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    
    if (!res.ok) throw new Error('Failed to add note');
    
    const newNote = await res.json();
    notes.unshift(newNote);
    updateStats();
    renderNotes();
  } catch (error) {
    console.error('Error adding note:', error);
    showError('Failed to add note. Please try again.');
  }
}

// Update stats display
function updateStats() {
  totalNotes.textContent = `${notes.length} ${notes.length === 1 ? 'note' : 'notes'}`;
  
  if (lastFetchTime) {
    lastUpdated.textContent = `Last updated: ${formatDate(lastFetchTime)}`;
  }
}

// Show error message
function showError(message) {
  const errorEl = document.createElement('div');
  errorEl.className = 'error-message';
  errorEl.textContent = message;
  
  document.body.appendChild(errorEl);
  setTimeout(() => errorEl.remove(), 3000);
}

// Event listeners
noteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const content = noteInput.value.trim();
  
  if (content) {
    await addNote(content);
    noteInput.value = '';
    noteInput.focus();
  }
});

searchInput.addEventListener('input', renderNotes);
sortSelect.addEventListener('change', renderNotes);

// Initialize app
fetchNotes();
