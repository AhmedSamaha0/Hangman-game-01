
//=========>Elements<=========
let descrpition = document.querySelector(".descrpition h4");
let wordElement = document.getElementsByClassName("word")[0];
let inputsElements = document.getElementsByClassName("inputs")[0];
let hintBtn = document.getElementsByClassName("hint")[0].children[0];
let scoreElement = document.querySelector(".score .points span");
let streakElement = document.querySelector(".score .streak span");
let hintElement = document.querySelector(".score .count-hints span");
let options = document.querySelector(".options");
let optionBtn = document.querySelector(".open-options");
let resumeBtn = document.querySelector(".resume");
let soundBtn = document.querySelector(".sound");
let leaveBtn = document.querySelector(".exit");
let addHintBtn = document.querySelector(".add-hint");


//============================

//=========>Options<=========
let word = "";
let success = 0;
let chances = 1;
let streak = 0;
let score = 0;
let stopHintBtn = false;
let stopKeyDown = false;
let mute = false;
let hintCount = 3;
let freq = [];
freq.length = 26;
freq.fill(false);
let freqKeyDown = [];
freqKeyDown.length = 26;
freqKeyDown.fill(true);
//===========================

//=======>Session Sotrage<=======

if(sessionStorage.score){
    score = +sessionStorage.score;
    scoreElement.innerHTML = sessionStorage.score;
}
if(sessionStorage.streak){
    streak = +sessionStorage.streak;
    streakElement.innerHTML = streak;
}
if(sessionStorage.hintCount){
    hintCount = +sessionStorage.hintCount;
    hintElement.innerHTML = hintCount;
}

if(sessionStorage.mute){

    if(sessionStorage.mute == "1"){
        mute = false;
    } else {
        mute = true;
    }
    
    controlSound();
}
//===============================

fetch("../json/words.json").then(response => response.json()).then(words => {
    
    let randomChoose = chooseRandomWord(words.length);
    word = words[randomChoose].word.toUpperCase(); 

    descrpition.innerHTML = words[randomChoose].hint;

    
    createWord();
    
    for(let i = 0 ; i < inputsElements.children.length; i++){
        
        inputsElements.children[i].addEventListener("click", (e) => {
            
            let letter = e.target.innerHTML;
            checkWord(letter);
        });
        
        
    }
    document.addEventListener("keydown", (e) => {

        if(!stopKeyDown){

            if( e.key.length === 1 && (e.key.charCodeAt(0) >= "a".charCodeAt(0) && e.key.charCodeAt(0) <= "z".charCodeAt(0)
                || e.key.charCodeAt(0) >= "A".charCodeAt(0) && e.key.charCodeAt(0) <= "Z".charCodeAt(0))){

                let letter = e.key.toUpperCase();
                
                if(freqKeyDown[letter.charCodeAt(0) - "A".charCodeAt(0)]){

                    checkWord(letter);
                    freqKeyDown[letter.charCodeAt(0) - "A".charCodeAt(0)] = false;

                }

                }
        }
    
    });

    checkScore();

    hintElement.innerHTML = hintCount;
    if(hintCount === 0)
        hintBtnDisabled();

});


//========>Manage Options</========

// Open Settings
optionBtn.onclick = () => {

    soundEffectOpenSetting();
    options.style.display = "flex";
    optionBtn.style.color = "#fdb44b";

}

// Back To Game
resumeBtn.onclick = () => {

    soundEffectSelect();
    options.style.display = "none";
    optionBtn.style.color = "#000";

}

//Sound Setting
soundBtn.onclick = () => {

    controlSound();
    soundEffectSelect();
    
};

// Leave To Menu Game
leaveBtn.onclick = () => {

    location.href = "../index.html";

}

//===============

//=========>Add Hint<========

addHintBtn.onclick = () => {

    if(score >= 10){ 
        soundBuyHint();
        hintCount++;
        sessionStorage.hintCount = hintCount;
        decreaseScore();
        hintBtnEnabled();
        createMsgForCostHint();
}

}

//===================

//Function To Create Word Place
function createWord(){

    for(let i = 0; i < word.length; i++){

        freq[word[i].charCodeAt(0) - 65] = true;
        let span = document.createElement("span");
        wordElement.appendChild(span);
    }
}

//Function To Choose Random Word
function chooseRandomWord(arrSize){

    return parseInt(Math.random()*arrSize);

}

//Function To Create All letters in Alapha English
function createLettersEnglishs(){

    for(let i = 0; i < 26; i++){
        
        let p = document.createElement("p");
        p.id = `ch-${i}`;
        let letter = document.createTextNode(String.fromCharCode(65 + i).toUpperCase());
        p.appendChild(letter);
        inputsElements.appendChild(p);

    }

}
createLettersEnglishs();


//Fucntion To Check Letter Is Exsit Or Not
function checkWord(ch){

    freqKeyDown[ch.charCodeAt(0) - "A".charCodeAt(0)] = false;
    if(freq[ch.charCodeAt(0) - 65]){

        
        rightChar(ch);
        
        freq[ch.charCodeAt(0) - 65] = false;
        
        success++;
        
        if(success === word.length){
            
            soundEffectWin()

            increaseScore();
            
            increaseStreak();
            
            makeAllDisabled();
            
            makeComplete();
            
            newWord();
        } else {
            
            soundEffectSuccess();

        }

    } else {


        
        makeWrong(ch);
        document.querySelector(`.pace-${chances}`).style.display = "block";
        chances++;
        if(chances === 7){
            
            soundEffectDeath();
            brokeStreak();
            makeAllDisabled();
            makeUncomplete();
            tryAgin();
            
        } else {

            soundEffectWrong();

        }
    }

}


//Function Make All Inputs Disabled
function makeAllDisabled(){

    for(let i = 0; i < inputsElements.children.length; i++){
        inputsElements.children[i].classList.add("finish");
    }

}

//Function Make Word Inputs Complete
function makeComplete(){

    let secs = 0;
    for(let i = 0; i < wordElement.children.length; i++){
        setTimeout(() => {
            wordElement.children[i].classList.add("complete");
        }, secs);
        secs += 100;
    }

}

//Function Make Word Inputs Complete
function makeUncomplete(){

    for(let i = 0; i < wordElement.children.length; i++){
            
        wordElement.children[i].classList.add("uncomplete");

    }

}

//Function To Make Hint 
function showChar(){

    let emptyFelid = [];
    for(let i = 0; i < wordElement.children.length; i++){
        if(wordElement.children[i].innerHTML === ""){
            emptyFelid.push(i);
        }
    }
    if(emptyFelid.length > 0){

        let randomNumber = parseInt(Math.random()*emptyFelid.length);
        wordElement.children[emptyFelid[randomNumber]].innerHTML = word[emptyFelid[randomNumber]];

        checkWord(word[emptyFelid[randomNumber]]);

    }
}


hintBtn.onclick = () => {

    if(!stopHintBtn){
        if(hintCount > 0){

        hintCount--;
        sessionStorage.hintCount = hintCount;
        hintElement.innerHTML = hintCount;
        showChar();

        } 
        if(hintCount === 0 && success < word.length)
        hintBtnDisabled();
    }

}


//Function To Make Input Success
function makeSuccess(ch){

        document.getElementById(`ch-${ch.charCodeAt(0) - 65}`).classList.add("success");

}

//Function To Make Input Wrong
function makeWrong(ch){

        document.getElementById(`ch-${ch.charCodeAt(0) - 65}`).classList.add("wrong");

}

//Function To Increase Score

function increaseScore(){

    score += 10;
    sessionStorage.score = score;
    scoreElement.innerHTML = score;
    checkScore();

}

//Function To Descrease Score

function decreaseScore(){

    score -= 10;
    sessionStorage.score = score;
    scoreElement.innerHTML = score;
    checkScore();
}


//Function To Increase Streak

function increaseStreak(){

    streak += 1;
    sessionStorage.streak = streak;
    streakElement.innerHTML = streak;

}

// Function To broke Streak
function brokeStreak(){

    streak = 0;
    sessionStorage.streak = streak;
    streakElement.innerHTML = streak;

}

// Function To Select New Word

function newWord(){

    stopHintBtn = true;
    stopKeyDown = true;
    hintBtn.disabled = false;
    descrpition.innerHTML = "Awesome!";
    hintBtn.style.transition = "0s";
    hintBtn.style.backgroundColor = "var(--success-color)";
    hintBtn.innerHTML = "New Word!";
    
    setTimeout(() =>{
        
        hintBtn.onclick = () => {
            
            freqKeyDown.fill(true);
            location.reload();

        }

    }, 1000);

}

//Function To Make Char In Word True

function rightChar(ch){

    let idxLetter = word.indexOf(ch);
    wordElement.children[idxLetter].innerHTML = word[idxLetter];
    wordElement.children[idxLetter].classList.add("not-empty");
    makeSuccess(ch);

}

// Function To Try Agin
function tryAgin(){

    stopHintBtn = true;
    stopKeyDown = true;
    hintBtn.disabled = false;
    descrpition.innerHTML = "Dead!";
    hintBtn.style.transition = "0s";
    hintBtn.style.backgroundColor = "var(--wrong-color)";
    hintBtn.innerHTML = "Try Agin";
    hintBtn.onclick = () => {
        location.reload();
        freqKeyDown.fill(true);
    };

}

// Function To Make Hint Button Disabled
function hintBtnDisabled(){

    hintBtn.disabled = true;
    hintBtn.style.backgroundColor = "#777";
    hintElement.parentNode.style.color = "#777";

}

// Function To Make Hint Button Disabled
function hintBtnEnabled(){

    if(!stopHintBtn){ 

        hintBtn.disabled = false;
        hintBtn.style.backgroundColor = "#00bbf0";
        
    }
    hintElement.parentNode.style.color = "#00bbf0";
    hintElement.innerHTML = hintCount;

}

// Function To Check If Have Score More Than Zero
function checkScore(){

    if(score === 0){
        addHintBtn.style.display = "none";
    } else {
        addHintBtn.style.display = "inline";
    }

}

//Functuion To Control Sound
function controlSound(){
    let stateSound = soundBtn.children[0].children[0].classList;
    if(mute){

        stateSound.remove("fa-volume-xmark");
        stateSound.add("fa-volume-high");
        sessionStorage.mute = "0";
        mute = false;

    } else {

        stateSound.remove("fa-volume-high");
        stateSound.add("fa-volume-xmark");
        sessionStorage.mute = "1";
        mute = true;

    }
}

//Function To Create Massega For -10
function createMsgForCostHint(){

    let span = document.createElement("span");
    let txt = document.createTextNode("-10");

    span.appendChild(txt);

    span.classList.add("decrease-score");

    document.querySelector(".points").appendChild(span);

    span.classList.add("on");


    setTimeout(() => {

        span.remove();

    }, 1500);
}

//============> Sound Effects <============

const sounds = {
    success: new Audio("../sound effects/success.mp3"),
    wrong: new Audio("../sound effects/wrong.mp3"),
    death: new Audio("../sound effects/death.mp3"),
    win: new Audio("../sound effects/win.mp3"),
    openSettings: new Audio("../sound effects/Open Settings.mp3"),
    select: new Audio("../sound effects/select.mp3"),
    buyHint: new Audio("../sound effects/buy hint.wav")
};

for (let key in sounds) {
    const s = sounds[key];
    s.preload = "auto";
    s.volume = 0.7;
    s.load();
}

function playSound(key) {
    if (mute) return;

    const original = sounds[key];
    if (!original) return;

    const clone = original.cloneNode();
    clone.volume = original.volume;
    clone.play().catch(() => {});
}

function soundEffectSuccess() { playSound("success"); }
function soundEffectWrong() { playSound("wrong"); }
function soundEffectDeath() { playSound("death"); }
function soundEffectWin() { playSound("win"); }
function soundEffectOpenSetting() { playSound("openSettings"); }
function soundEffectSelect() { playSound("select"); }
function soundBuyHint() { playSound("buyHint"); }


// Check About Sound Start
if(!mute)
    document.getElementById("new-level").autoplay = true 
else 
    document.getElementById("new-level").autoplay = false;
//=====================================