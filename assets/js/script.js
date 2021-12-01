// array prototype extension
Array.prototype.random = function() {
    return this[Math.floor((Math.random() * this.length))];
}

// is mobile
let mobile = 'ontouchstart' in document.documentElement;

// current page
let page = 'enter';

// finished typing all text
let done = false;

// audio spectrum thing
let wave;
let shouldRender = false;
let renderConfirmed = false;

// text index
let currentlyOn = 0;

// list of audio played (dont play again until loop)
let songsPlayed = [];

// define messages to display
let messages = [
    'привет, спасибо за переход!',
    'я milansky aka PbIBa.',
    'я активно продвигаюсь в Java, C++.',
    'мои проекты:',
    '<a target="_blank" href="https://wardix.net">wardix.net</a> - minecraft pvp server includes skywars, practice and more.',
    '<a target="_blank" href="https://appassionare.me">appassionare.me</a> - best optifine capes spoof.',
    'ты можешь найти мой гитхаб <a target="_blank" href="https://github.com/milanskyyy">здесь</a>.',
    'также можешь написать мне в дискорд @ PbIBa#0001.',
    'или же на mail: me@milansky.me.'
];

// define songs
let songs = [
    ['controlla.mp3', 'idealism - controlla']
]

// loaded audio callback
function loadedAudioCallback() {
    console.log('audio loaded callback executed');
    // play audio
    wave.play();
}

// ended audio callback
function endedAudioCallback() {
    // do some checks
    if (songsPlayed.length == songs.length) songsPlayed = [];

    // get a random song
    let song = songs.filter(s => !songsPlayed.includes(s[0])).random();

    // push to the songsPlayed array
    songsPlayed.push(song[0]);

    console.log(`selected song: ${song[0]}`);

    // play song
    wave = new CircularAudioWave(document.getElementById('canvas'));

    // load assets/song.mp3 then play
    wave.loadAudio(`assets/songs/${song[0]}`);

    // set the currently playing text
    $('#playingtext').text(song[1]);

    console.log('loading audio');
}

// on document load
$(document).ready(function() {
    if (mobile) {
        $('#entertext').text('press anywhere to enter');
    }

    // fade in the underscore once before the interval executes
    $('#underscore').fadeOut(500).fadeIn(500);
    setInterval(function() {
        // fade in and out the underscore
        $('#underscore').fadeOut(500).fadeIn(500);
    }, 1000);
});

// load the main page and execute required functions
function startIt() {
    // set the document title
    document.title = 'milansky.me | home';

    // get a random song
    let song = songs.random();

    // push to the songsPlayed array
    songsPlayed.push(song[0]);

    console.log(`selected song: ${song[0]}`);

    // play song
    wave = new CircularAudioWave(document.getElementById('canvas'));

    // load assets/song.mp3 then play
    wave.loadAudio(`assets/songs/${song[0]}`);

    // set the currently playing text
    $('#playingtext').text(song[1]);

    console.log('loading audio');

    // fade intro out
    $('#intro').fadeOut(500);
    // fade in info
    $('#info').fadeIn(500);
    // fade in bg-image
    $('#bg-image').fadeIn(500);
    // change page
    page = 'info';

    // start indexing the text
    newText();
}

// on key press
$(document).keypress(function(e) {
    if (page === 'enter' && !mobile) {
        startIt();
    }
});

// on tap
$(document).on('click', function(e) {
    if (page === 'enter' && mobile) {
        startIt();
    }
});

// type new text
function newText() {
    // insert a new element into the dom
    $('#contentinner').append(`<div class="instruction"> <span class="user">milansky@127.0.0.1</span>: <span class="path">~</span>$ <span id="command${currentlyOn}" class="command"></span> <span class="blinking-cursor" id="blinkingcursor">_</span> </div>`);
    // initialize a new instance of typeit
    new TypeIt(`#command${currentlyOn}`, {
        strings: messages[currentlyOn],
        speed: 55,
        cursor: false,
        afterComplete: async (instance) => {
            // increment the current text index
            currentlyOn++;
            // remove the blinking cursor
            document.getElementById('blinkingcursor').remove();
            // check if we have reached the last message
            if (currentlyOn == messages.length) {
                done = true;
                console.log('no more messages.');
            } else {
                console.log(`going to new text, index: ${currentlyOn}`);
                setTimeout(newText, 500);
            }
        }
    }).go();
}

// show the audio visualizer
function visualizeAudio() {
    // only allow opening the audio visualizer if all text has been displayed
    if (done) {
        // if on mobile display a warning
        if (mobile && !renderConfirmed) {
            alert('Hey! The audio visualizer is not optimized for mobile. Your device may become unresponsive if you enable this. Click again to confirm.');
            renderConfirmed = true;
        } else {
            // start rendering
            shouldRender = true;
            // show the element with the id "canvas"
            $('#canvas').show();
            // hide the element with the id "cv-code"
            $('#cv-code').hide();
        }
    }
}