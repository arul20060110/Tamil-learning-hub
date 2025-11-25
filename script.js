const UYIR_ELUTHUKKAL = [
    { letter: 'அ', image: 'anil.png', sound: 'a.mp3' },
    { letter: 'ஆ', image: 'aamai.png', sound: 'aa.mp3' },
    // மற்ற எழுத்துக்களையும் இங்கே சேர்க்கவும் (இ, ஈ, உ, ஊ...)
];

let currentIndex = 0; // தற்போதைய எழுத்தின் குறியீடு

function playSound(soundFile) {
    const audio = new Audio(`assets/audio/${soundFile}.mp3`);
    audio.play();
}

function updateDisplay() {
    const currentItem = UYIR_ELUTHUKKAL[currentIndex];
    
    // HTML உள்ளடக்கத்தை புதுப்பிக்கவும்
    document.querySelector('.tamil-letter').textContent = currentItem.letter;
    document.querySelector('img').src = `assets/images/${currentItem.image}`;
    document.querySelector('img').alt = `${currentItem.letter} படம்`;
    
    // ஒலி கேட்கும் பட்டனை புதுப்பிக்கவும்
    const soundButton = document.querySelector('#letter-display button');
    soundButton.setAttribute('onclick', `playSound('${currentItem.sound.split('.')[0]}')`);

    playSound(currentItem.sound.split('.')[0]); // புதிய எழுத்து வந்தவுடன் ஒலிக்கச் செய்தல்
}

function nextLetter() {
    currentIndex = (currentIndex + 1) % UYIR_ELUTHUKKAL.length; // அடுத்த எழுத்துக்கு செல்லுதல் (சுழற்சி முறையில்)
    updateDisplay();
}

// பக்கம் லோட் ஆனவுடன் முதல் எழுத்தை காட்டவும்
window.onload = updateDisplay; 
// script.js கோப்பில், UYIR_ELUTHUKKAL வரிசைக்குக் கீழே இந்தச் செயல்பாடுகளைச் சேர்க்கவும்:

let targetLetter = ''; // குரங்கு கேட்கும் எழுத்து
const bananaContainer = document.getElementById('banana-container');
const feedbackMessage = document.getElementById('feedback-message');
const targetLetterDisplay = document.getElementById('target-letter');

// உதவியாளர் செயல்பாடு: ஒரு வரிசையைத் தோராயமாக கலக்க (Shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startMonkeyGame() {
    // 1. இலக்கு எழுத்தைத் தோராயமாக தேர்வு செய்தல்
    const randomItem = UYIR_ELUTHUKKAL[Math.floor(Math.random() * UYIR_ELUTHUKKAL.length)];
    targetLetter = randomItem.letter;
    targetLetterDisplay.textContent = targetLetter;
    
    // குரங்கு கேட்கும் எழுத்தை ஒலிக்கச் செய்யலாம்
    // playSound(randomItem.sound.split('.')[0]); 
    
    // 2. திரையில் காட்ட வேண்டிய எழுத்துக்களைத் தயார் செய்தல்
    // இலக்கு எழுத்துடன் (Target Letter) மேலும் 3 தவறான எழுத்துக்களைச் சேர்க்கவும்
    let incorrectLetters = UYIR_ELUTHUKKAL.filter(item => item.letter !== targetLetter)
        .sort(() => 0.5 - Math.random()) // தோராயமாக கலக்கவும்
        .slice(0, 3) // முதல் 3-ஐ மட்டும் எடுக்கவும்
        .map(item => item.letter);

    let lettersToDisplay = [targetLetter, ...incorrectLetters];
    shuffleArray(lettersToDisplay); // காண்பிக்கும் வரிசையை கலக்கவும்

    // 3. HTML-இல் வாழைப்பழங்களை உருவாக்குதல்
    bananaContainer.innerHTML = ''; // முந்தைய வாழைப்பழங்களை நீக்கவும்
    
    lettersToDisplay.forEach(letter => {
        const bananaDiv = document.createElement('div');
        bananaDiv.className = 'banana-item'; // CSS ஸ்டைலிங்கிற்கு
        bananaDiv.textContent = letter;
        bananaDiv.setAttribute('data-letter', letter);
        bananaDiv.onclick = checkAnswer; // கிளிக் செய்தால் விடை சரிபார்க்கும்
        bananaContainer.appendChild(bananaDiv);
    });

    feedbackMessage.textContent = ''; // பின்னூட்ட செய்தியைத் துடைக்கவும்
}

function checkAnswer(event) {
    const clickedLetter = event.target.getAttribute('data-letter');
    
    if (clickedLetter === targetLetter) {
        feedbackMessage.textContent = `சரியான விடை! 🎉 ${targetLetter} எழுத்துக்கான ${targetLetter} கிடைத்துவிட்டது. (+5 புள்ளிகள்)`;
        feedbackMessage.style.color = 'green';
        event.target.style.backgroundColor = '#ffc107'; // மஞ்சள் வண்ணம்
        
        // 1 வினாடிக்குப் பிறகு அடுத்த சுற்று
        setTimeout(startMonkeyGame, 1500);
    } else {
        feedbackMessage.textContent = `தவறு! 😞 மீண்டும் முயற்சி செய்யுங்கள்.`;
        feedbackMessage.style.color = 'red';
        // தவறு என்றால் குறியீட்டைக் காண்பிக்கலாம்
        event.target.style.opacity = '0.5';
    }
}

// பக்கம் லோட் ஆனவுடன் விளையாட்டைத் தொடங்குதல் (இதனை window.onload செயல்பாட்டில் சேர்க்கவும்)
// window.onload = () => {
//     updateDisplay(); // Phase 1 தொடக்கம்
//     startMonkeyGame(); // Phase 2 தொடக்கம்
// };

// குறிப்பு: நீங்கள் Phase 1 ஐ முடித்த பின்னரே Phase 2 ஐத் தொடங்க விரும்பினால், 
// Phase 1 இன் 'அடுத்த எழுத்து' பொத்தானின் செயல்பாட்டில் startMonkeyGame() ஐ அழைக்கலாம்.

// இப்போதைக்கு, நேரடியாக Phase 2 ஐத் தொடங்க:
window.onload = startMonkeyGame;
// script.js கோப்பில், மற்ற செயல்பாடுகளுக்குக் கீழே சேர்க்கவும்:

const lettersColumn = document.getElementById('letters-column');
const soundsColumn = document.getElementById('sounds-column');
const treasureFeedback = document.getElementById('treasure-feedback');
let matchedCount = 0; // எத்தனை சரியாகப் பொருத்தப்பட்டன எனக் கணக்கிட

function startTreasureGame() {
    // 1. எழுத்துக்கள் மற்றும் ஒலிகளைத் தோராயமாக கலக்கவும்
    shuffleArray(UYIR_ELUTHUKKAL); 
    
    // முந்தைய உள்ளடக்கத்தை நீக்கவும்
    lettersColumn.innerHTML = '<h3>தமிழ் எழுத்துக்கள்</h3>';
    soundsColumn.innerHTML = '<h3>ஒலிகள்</h3>';
    matchedCount = 0;

    UYIR_ELUTHUKKAL.forEach((item, index) => {
        // A) இழுக்கும் எழுத்து (Draggable Letter)
        const letterDiv = document.createElement('div');
        letterDiv.className = 'match-item draggable';
        letterDiv.textContent = item.letter;
        letterDiv.setAttribute('draggable', true); // இதை இழுக்கலாம்
        letterDiv.setAttribute('id', `letter-${index}`); 
        letterDiv.setAttribute('data-sound', item.sound.split('.')[0]); // சரியான ஒலி என்னவென்று குறிப்பு
        
        // Drag events
        letterDiv.addEventListener('dragstart', dragStart);
        lettersColumn.appendChild(letterDiv);

        // B) விழும் இலக்கு (Drop Target - Sound Button)
        const soundDiv = document.createElement('div');
        soundDiv.className = 'match-item droppable';
        soundDiv.setAttribute('data-target-sound', item.sound.split('.')[0]); // இலக்கு ஒலி என்னவென்று குறிப்பு
        
        // பட்டன்: ஒலியைக் கேட்க
        const soundButton = document.createElement('button');
        soundButton.textContent = '🔊 ஒலி கேட்க';
        soundButton.onclick = () => playSound(item.sound.split('.')[0]);
        
        soundDiv.appendChild(soundButton);
        
        // Drop events
        soundDiv.addEventListener('dragover', dragOver);
        soundDiv.addEventListener('drop', drop);
        soundsColumn.appendChild(soundDiv);
    });
}

let draggedElementId = null; 

function dragStart(e) {
    draggedElementId = e.target.id;
    e.dataTransfer.setData('text/plain', draggedElementId); // இழுக்கும் ID-ஐ சேமிக்கவும்
}

function dragOver(e) {
    e.preventDefault(); // Drop செய்ய அனுமதி
}

function drop(e) {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    const draggedElement = document.getElementById(draggedId);
    const dropTarget = e.currentTarget;
    
    const draggedSound = draggedElement.getAttribute('data-sound');
    const targetSound = dropTarget.getAttribute('data-target-sound');

    if (draggedSound === targetSound && !dropTarget.classList.contains('matched')) {
        // சரியான பொருத்துதல்
        dropTarget.classList.add('matched');
        dropTarget.style.backgroundColor = '#d4edda'; // பச்சை வண்ணம்
        
        // எழுத்தைத் திரையில் இருந்து நீக்கி, பொருத்திய இலக்கில் சேர்க்கவும்
        dropTarget.prepend(draggedElement); 
        draggedElement.classList.remove('draggable');
        draggedElement.draggable = false;
        
        // ஒலி பட்டனை மறைக்க
        dropTarget.querySelector('button').style.display = 'none';

        matchedCount++;
        if (matchedCount === UYIR_ELUTHUKKAL.length) {
            treasureFeedback.textContent = 'அற்புதம்! அனைத்து எழுத்துக்களையும் சரியாகப் பொருத்திவிட்டீர்கள்! 🎉 பொக்கிஷப் பெட்டி திறந்தது!';
            treasureFeedback.style.color = 'green';
        }
    } else {
        // தவறான பொருத்துதல்
        treasureFeedback.textContent = 'தவறான பொருத்தம். மீண்டும் முயற்சி செய்க!';
        treasureFeedback.style.color = 'red';
    }
}

// பக்கம் லோட் ஆனவுடன் விளையாட்டுகளைத் தொடங்குதல்
window.onload = () => {
    updateDisplay(); // Phase 1 தொடக்கம்
    startMonkeyGame(); // Phase 2 தொடக்கம்
    startTreasureGame(); // Phase 3 தொடக்கம்
};
