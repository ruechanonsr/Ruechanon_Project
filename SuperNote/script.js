let notes = [];
let currentNoteIndex = -1;
let isDrawing = false;
let drawingMode = false;
let eraseMode = false;
let canvas, ctx;

// Initialize the app
function initApp() {
    canvas = document.getElementById('drawingCanvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    
    // Load saved notes
    loadNotes();
    
    // If no notes exist, create a default one
    if (notes.length === 0) {
        createNewNote();
    }
    
    setupEventListeners();
}

function resizeCanvas() {
    const editorContent = document.getElementById('editorContent');
    canvas.width = editorContent.offsetWidth;
    canvas.height = editorContent.offsetHeight;
}

function setupEventListeners() {
    // Toolbar events
    document.getElementById('fontFamily').addEventListener('change', updateTextStyle);
    document.getElementById('fontSize').addEventListener('change', updateTextStyle);
    document.getElementById('boldBtn').addEventListener('click', toggleBold);
    document.getElementById('italicBtn').addEventListener('click', toggleItalic);
    document.getElementById('underlineBtn').addEventListener('click', toggleUnderline);
    document.getElementById('strikeBtn').addEventListener('click', toggleStrike);
    
    // Drawing events
    document.getElementById('drawBtn').addEventListener('click', toggleDrawingMode);
    document.getElementById('eraseBtn').addEventListener('click', toggleEraseMode);
    document.getElementById('clearDrawBtn').addEventListener('click', clearDrawing);
    document.getElementById('clearTextBtn').addEventListener('click', clearText);
    document.getElementById('deleteNoteBtn').addEventListener('click', deleteNote);
    
    // Canvas events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
    
    // Window resize
    window.addEventListener('resize', resizeCanvas);
}

function createNewNote() {
    const newNote = {
        id: Date.now(),
        title: 'โน๊ตใหม่',
        content: '',
        backgroundColor: '#ffffff',
        backgroundImage: null,
        fontFamily: 'Segoe UI',
        fontSize: '16',
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
        drawing: null,
        createdAt: new Date()
    };
    
    notes.unshift(newNote);
    currentNoteIndex = 0;
    updateNotesList();
    selectNote(0);
    saveNotes();
}

function updateNotesList() {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';
    
    notes.forEach((note, index) => {
        const noteItem = document.createElement('div');
        noteItem.className = `note-item ${index === currentNoteIndex ? 'active' : ''}`;
        noteItem.onclick = () => selectNote(index);
        
        noteItem.innerHTML = `
            <div class="note-title">${note.title || 'โน๊ตไม่มีหัวข้อ'}</div>
            <div class="note-preview">${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</div>
        `;
        
        notesList.appendChild(noteItem);
    });
}

function selectNote(index) {
    if (index < 0 || index >= notes.length) return;
    
    currentNoteIndex = index;
    const note = notes[index];
    
    // Update UI
    document.getElementById('noteTitle').value = note.title;
    document.getElementById('noteContent').value = note.content;
    document.getElementById('fontFamily').value = note.fontFamily;
    document.getElementById('fontSize').value = note.fontSize;
    
    // Set background
    const editorContent = document.getElementById('editorContent');
    editorContent.style.backgroundColor = note.backgroundColor;
    
    const backgroundOverlay = document.getElementById('backgroundOverlay');
    if (note.backgroundImage) {
        backgroundOverlay.style.backgroundImage = `url(${note.backgroundImage})`;
    } else {
        backgroundOverlay.style.backgroundImage = 'none';
    }
    
    // Update color palette
    updateColorPalette(note.backgroundColor);
    
    // Apply text styles
    updateTextStyle();
    updateFormattingButtons(note);
    
    // Load drawing
    if (note.drawing) {
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = note.drawing;
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // Show editor
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('noteTitle').style.display = 'block';
    document.getElementById('noteContent').style.display = 'block';
    
    updateNotesList();
}

function updateNoteTitle() {
    if (currentNoteIndex >= 0) {
        notes[currentNoteIndex].title = document.getElementById('noteTitle').value || 'โน๊ตไม่มีหัวข้อ';
        updateNotesList();
        saveNotes();
    }
}

function updateNoteContent() {
    if (currentNoteIndex >= 0) {
        notes[currentNoteIndex].content = document.getElementById('noteContent').value;
        updateNotesList();
        saveNotes();
    }
}

function setBackgroundColor(color) {
    if (currentNoteIndex >= 0) {
        notes[currentNoteIndex].backgroundColor = color;
        document.getElementById('editorContent').style.backgroundColor = color;
        updateColorPalette(color);
        saveNotes();
    }
}

function setBackgroundImage(event) {
    const file = event.target.files[0];
    if (file && currentNoteIndex >= 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
            notes[currentNoteIndex].backgroundImage = e.target.result;
            document.getElementById('backgroundOverlay').style.backgroundImage = `url(${e.target.result})`;
            saveNotes();
        };
        reader.readAsDataURL(file);
    }
}

function removeBackgroundImage() {
    if (currentNoteIndex >= 0) {
        notes[currentNoteIndex].backgroundImage = null;
        document.getElementById('backgroundOverlay').style.backgroundImage = 'none';
        saveNotes();
    }
}

function updateColorPalette(activeColor) {
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.color === activeColor) {
            option.classList.add('active');
        }
    });
}

function updateTextStyle() {
    if (currentNoteIndex < 0) return;
    
    const note = notes[currentNoteIndex];
    const noteContent = document.getElementById('noteContent');
    const fontFamily = document.getElementById('fontFamily').value;
    const fontSize = document.getElementById('fontSize').value;
    
    note.fontFamily = fontFamily;
    note.fontSize = fontSize;
    
    let style = `font-family: ${fontFamily}; font-size: ${fontSize}px;`;
    
    if (note.bold) style += ' font-weight: bold;';
    if (note.italic) style += ' font-style: italic;';
    if (note.underline && note.strikethrough) {
        style += ' text-decoration: underline line-through;';
    } else if (note.underline) {
        style += ' text-decoration: underline;';
    } else if (note.strikethrough) {
        style += ' text-decoration: line-through;';
    }
    
    noteContent.style.cssText += style;
    saveNotes();
}

function toggleBold() {
    if (currentNoteIndex >= 0) {
        notes[currentNoteIndex].bold = !notes[currentNoteIndex].bold;
        updateTextStyle();
        updateFormattingButtons(notes[currentNoteIndex]);
    }
}

function toggleItalic() {
    if (currentNoteIndex >= 0) {
        notes[currentNoteIndex].italic = !notes[currentNoteIndex].italic;
        updateTextStyle();
        updateFormattingButtons(notes[currentNoteIndex]);
    }
}

function toggleUnderline() {
    if (currentNoteIndex >= 0) {
        notes[currentNoteIndex].underline = !notes[currentNoteIndex].underline;
        updateTextStyle();
        updateFormattingButtons(notes[currentNoteIndex]);
    }
}

function toggleStrike() {
    if (currentNoteIndex >= 0) {
        notes[currentNoteIndex].strikethrough = !notes[currentNoteIndex].strikethrough;
        updateTextStyle();
        updateFormattingButtons(notes[currentNoteIndex]);
    }
}

function updateFormattingButtons(note) {
    document.getElementById('boldBtn').classList.toggle('active', note.bold);
    document.getElementById('italicBtn').classList.toggle('active', note.italic);
    document.getElementById('underlineBtn').classList.toggle('active', note.underline);
    document.getElementById('strikeBtn').classList.toggle('active', note.strikethrough);
}

// Drawing functions
function toggleDrawingMode() {
    drawingMode = !drawingMode;
    canvas.classList.toggle('active', drawingMode);
    
    const drawBtn = document.getElementById('drawBtn');
    const eraseBtn = document.getElementById('eraseBtn');
    const colorInput = document.getElementById('drawColor');
    const brushSize = document.getElementById('brushSize');
    const lineStyle = document.getElementById('lineStyle');
    
    if (drawingMode) {
        drawBtn.classList.add('active');
        eraseBtn.style.display = 'inline-block';
        colorInput.style.display = 'inline-block';
        brushSize.style.display = 'inline-block';
        lineStyle.style.display = 'inline-block';
        document.getElementById('noteContent').style.pointerEvents = 'none';
    } else {
        drawBtn.classList.remove('active');
        eraseBtn.style.display = 'none';
        colorInput.style.display = 'none';
        brushSize.style.display = 'none';
        lineStyle.style.display = 'none';
        document.getElementById('noteContent').style.pointerEvents = 'auto';
        eraseMode = false;
        document.getElementById('eraseBtn').classList.remove('active');
    }
}

function toggleEraseMode() {
    eraseMode = !eraseMode;
    document.getElementById('eraseBtn').classList.toggle('active', eraseMode);
}

function startDrawing(e) {
    if (!drawingMode) return;
    isDrawing = true;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function draw(e) {
    if (!drawingMode || !isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineWidth = document.getElementById('brushSize').value;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Set line style
    const lineStyle = document.getElementById('lineStyle').value;
    switch(lineStyle) {
        case 'dashed':
            ctx.setLineDash([10, 5]);
            break;
        case 'dotted':
            ctx.setLineDash([2, 3]);
            break;
        case 'dash-dot':
            ctx.setLineDash([10, 5, 2, 5]);
            break;
        default:
            ctx.setLineDash([]);
    }
    
    if (eraseMode) {
        ctx.globalCompositeOperation = 'destination-out';
    } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = document.getElementById('drawColor').value;
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function stopDrawing() {
    if (!drawingMode || !isDrawing) return;
    isDrawing = false;
    ctx.beginPath();
    
    // Save drawing to current note
    if (currentNoteIndex >= 0) {
        notes[currentNoteIndex].drawing = canvas.toDataURL();
        saveNotes();
    }
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                    e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function clearDrawing() {
    if (confirm('คุณต้องการล้างภาพวาดทั้งหมดหรือไม่?')) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (currentNoteIndex >= 0) {
            notes[currentNoteIndex].drawing = null;
            saveNotes();
        }
    }
}

function clearText() {
    if (confirm('คุณต้องการล้างข้อความทั้งหมดหรือไม่?')) {
        document.getElementById('noteContent').value = '';
        updateNoteContent();
    }
}

function deleteNote() {
    if (notes.length <= 1) {
        alert('ต้องมีโน๊ตอย่างน้อย 1 โน๊ต');
        return;
    }
    
    if (confirm('คุณต้องการลบโน๊ตนี้หรือไม่?')) {
        notes.splice(currentNoteIndex, 1);
        
        // Adjust current note index
        if (currentNoteIndex >= notes.length) {
            currentNoteIndex = notes.length - 1;
        }
        
        updateNotesList();
        selectNote(currentNoteIndex);
        saveNotes();
        
        // Exit drawing mode
        if (drawingMode) {
            toggleDrawingMode();
        }
    }
}

// Storage functions
function saveNotes() {
    const notesData = {
        notes: notes,
        currentNoteIndex: currentNoteIndex
    };
    // Store in memory (since localStorage is not available)
    window.appData = notesData;
}

function loadNotes() {
    // Load from memory
    if (window.appData) {
        notes = window.appData.notes || [];
        currentNoteIndex = window.appData.currentNoteIndex || -1;
    }
    updateNotesList();
    if (currentNoteIndex >= 0) {
        selectNote(currentNoteIndex);
    }
}

// Initialize app when page loads
window.onload = initApp;