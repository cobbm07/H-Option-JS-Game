var level = {
    lvl_num: 0,
    num_switches: 0,
    num_lights: 0,
    on_signals: [],
    off_signals: []
};
var max_levels = 10;
const background_music = new Audio('../assets/sounds/soundtrack.mp3');

document.addEventListener("DOMContentLoaded", mainMenu);

//DONE
function mainMenu() {
    // Remove game attributes
    let switches = document.getElementById('switches');
    switches.innerHTML = '';
    let lights = document.getElementById('lights');
    lights.innerHTML = '';

    // Reset menu and UI
    if (document.getElementById('win-screen')) {
        document.getElementById('win-screen').remove();
    }
    if (document.getElementById('backdrop')) {
        document.getElementById('backdrop').remove();
    }
    if (document.getElementById('back-btn')) {
        document.getElementById('back-btn').remove();
    }
    if (document.getElementById('door')) {
        document.getElementById('door').remove();
    }
    if (document.getElementById('next-lvl')) {
        document.getElementById('next-lvl').remove();
    }
    let backdrop = document.createElement('span');
    backdrop.setAttribute('id', 'backdrop');
    document.getElementById('game-frame').appendChild(backdrop);

    //play button
    let playBtn = document.createElement('button');
    playBtn.setAttribute('id', 'play-btn');
    playBtn.textContent = "Play Game!";
    playBtn.addEventListener('click', function() {loadLevel(1)});
    document.getElementById('backdrop').appendChild(playBtn);

    //level select
    let levelSelect = document.createElement('button');
    levelSelect.setAttribute('id', 'level-select');
    levelSelect.textContent = "Select a Level";
    levelSelect.addEventListener('click', levelMenu);
    document.getElementById('backdrop').appendChild(levelSelect);

    //Audio/Music Buttons
    if (!document.getElementById('sound-btn')) {
        let soundBtn = document.createElement('button');
        soundBtn.setAttribute('id', 'sound-btn');
        if (localStorage.getItem('sound-btn') != null) {
            soundBtn.classList = localStorage.getItem('sound-btn');
        }
        else {
            soundBtn.classList.add('on');
            localStorage.setItem('sound-btn', 'on');
        }
        soundBtn.addEventListener('click', function() { 
            soundBtn.classList.toggle('on');
            localStorage.setItem('sound-btn', soundBtn.classList);
        });
        document.getElementById('game-frame').appendChild(soundBtn);    
    }
    if (!document.getElementById('music-btn')) {
        let musicBtn = document.createElement('button');
        musicBtn.setAttribute('id', 'music-btn');
        if (localStorage.getItem('music-btn') != null) {
            musicBtn.classList = localStorage.getItem('music-btn');
            if (musicBtn.classList.contains('on'))
                background_music.muted = false;
            else 
                background_music.muted = true;
        }
        else {
            musicBtn.classList.add('on');
            localStorage.setItem('music-btn', 'on');
        }
        musicBtn.addEventListener('click', function() { 
            musicBtn.classList.toggle('on')
            localStorage.setItem('music-btn', musicBtn.classList);
            if (musicBtn.classList.contains('on'))
                background_music.muted = false;
            else 
                background_music.muted = true;
            });
        document.getElementById('game-frame').appendChild(musicBtn);
    }
}

//DONE
async function getLevelInfo(l) {
    let response = await fetch('../assets/levels/level_' + l + '.txt');
    let info = await response.text();
    info = info.split(',');
    level.num_switches = parseInt(info[0]);
    level.num_lights = parseInt(info[1]);
    level.lvl_num = l;

    let newSignals = new Array(level.num_switches);
    for (let i = 0; i < level.num_switches; i++) { //Set on_signals
        let signals = info[2 + i].split(' ');
        newSignals[i] = new Array(level.num_lights);
        for (let j = 0; j < signals.length; j++) {
            newSignals[i][j] = parseInt(signals[j]);
        }
    }
    level.on_signals = newSignals;

    newSignals = new Array(level.num_switches);
    for (let i = 0; i < level.num_switches; i++) { //Set off_signals
        let signals = info[2 + level.num_switches + i].split(' ');
        newSignals[i] = new Array(level.num_lights);
        for (let j = 0; j < signals.length; j++) {
            newSignals[i][j] = parseInt(signals[j]);
        }
    }
    level.off_signals = newSignals;
}

async function loadLevel(l) {
    // Remove menu, create UI
    if (document.getElementById('backdrop')) {
        document.getElementById('backdrop').remove();
    }
    if (!document.getElementById('back-btn')) {
        let backBtn = document.createElement('button');
        backBtn.setAttribute('id', 'back-btn');
        backBtn.addEventListener('click', mainMenu);
        document.getElementById('game-frame').appendChild(backBtn);
    }
    if (!document.getElementById('door')) {
        let door = document.createElement('span');
        door.setAttribute('id', 'door');
        document.getElementById('game-frame').appendChild(door);
    }

    //Lights and Switches
    await getLevelInfo(l);
    let switches = document.getElementById('switches');
    switches.innerHTML = '';
    let lights = document.getElementById('lights');
    lights.innerHTML = '';
    for (let i = 0; i < level.num_switches; i++) {
        let sw = document.createElement('label');
        sw.classList += "switch";
        sw.id = "sw" + i;
        sw.innerHTML = '<input type="checkbox"><span class="switch-bg"></span><span class="switch-sw"></span>';
        
        switches.appendChild(sw);
    }
    for (let i = 0; i < level.num_lights; i++) {
        let span = document.createElement('span');
        span.classList += 'light';
        span.id = 'l' + i;

        lights.appendChild(span);
    }

    checkCompletion();
}

//DONE
function levelMenu() {
    let backdrop = document.getElementById('backdrop');
    backdrop.removeChild(document.getElementById('play-btn'));
    backdrop.removeChild(document.getElementById('level-select'));

    let container = document.createElement('span');
    container.setAttribute('id', 'container');
    backdrop.appendChild(container);
    for (let i = 0; i < max_levels; i++) {
        let lvlBtn = document.createElement('button');
        lvlBtn.setAttribute('id', 'lvl' + (i + 1));
        lvlBtn.textContent = "Level " + (i + 1);
        lvlBtn.addEventListener('click', function() {loadLevel(i + 1)});
        container.appendChild(lvlBtn);
    }

    let backBtn = document.createElement('button');
    backBtn.setAttribute('id', 'back-btn');
    backBtn.addEventListener('click', mainMenu);
    backdrop.appendChild(backBtn);
}

function nextLevel() {
    if (level.lvl_num != max_levels) {
        loadLevel(level.lvl_num + 1);
    }
    else {
        let winScreen = document.createElement('span');
        winScreen.setAttribute('id', 'win-screen');
        document.getElementById('switches').innerHTML = "";
        document.getElementById('lights').innerHTML = "";
        document.getElementById('door').remove();
        document.getElementById('next-lvl').remove();
        winScreen.innerHTML += "<h2>You Win! Congradulations!</h2>";
        winScreen.innerHTML += "<p>Good job completing all of these tricky puzzles,\nand thank you for playing my game!</p>";

        document.getElementById('game-frame').appendChild(winScreen);
    }
}

//DONE
function switchHandler(e) {
    if (e.target.classList.contains('switch-sw')) {
        e.target.parentNode.classList.toggle('active');
        let id = parseInt(e.target.parentNode.id.charAt(2));
        if (e.target.parentNode.classList.contains('active'))
            signalHandler(level.on_signals[id]);
        else 
            signalHandler(level.off_signals[id]);
    }
}
document.getElementById('switches').addEventListener('click', switchHandler);

//DONE
function signalHandler(signals) {
    for (let i = 0; i < signals.length; i++) {
        let light = document.getElementById('l' + i);
        switch (signals[i]) {
            case 1:
                if (!light.classList.contains('on')) light.classList.add('on');
                break;
            case 2: 
                if (light.classList.contains('on')) light.classList.remove('on');
                break;
            case 3:
                light.classList.toggle('on');
                break;
            default:
        }
    }
    checkCompletion();
}

//DONE
function checkCompletion() {
    let lightCount = 0;
    for (let i = 0; i < level.num_lights; i++) {
        let light = document.getElementById('l' + i);
        if (light.classList.contains('on'))
            lightCount++;
    }
    if (lightCount == level.num_lights) {
        // Next Level Button
        let nextLvl = document.createElement('button');
        nextLvl.setAttribute('id', 'next-lvl');
        nextLvl.textContent = "Next Level >>";
        nextLvl.addEventListener('click', nextLevel);
        document.getElementById('game-frame').appendChild(nextLvl);

        document.getElementById('door').classList.add('open');

        if (document.getElementById('sound-btn').classList.contains('on')) {
            playSound();
        }
    }
    else if (document.getElementById('next-lvl') != null){
        document.getElementById('game-frame').removeChild(document.getElementById('next-lvl'));
        if (document.getElementById('door').classList.contains('open'))
            document.getElementById('door').classList.remove('open');
    }
}

function playSound() {
    let complete_sound = new Audio('../assets/sounds/all_lit.wav');
    complete_sound.play();
}

document.getElementById('game-frame').addEventListener('click', startMusic)
function startMusic() {
    background_music.loop = true;
    background_music.play();
    document.getElementById('game-frame').removeEventListener('click', startMusic)
}