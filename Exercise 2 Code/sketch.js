var myAudio;
var analyzer;
var rectSize;
var rectColour;
var borderSize;
var borderColour;
var rectOpacity;
var borderOpacity;
var bgColour;

var pauseButton;
var playButton;

function preload() {

    soundFormats('mp3');
    myAudio = loadSound('/sounds/Kalte_Ohren_(_Remix_)');
}

function setup() {
  createCanvas(800, 600);
  background(180);
    myAudio.loop();
    
    if (typeof Meyda ==="undefined"){
        console.log("Meyda could not be found!")
    }else{
        analyzer = Meyda.createMeydaAnalyzer({
            "audioContext": getAudioContext(),
            "source": myAudio,
            "bufferSize": 512,
            "featureExtractors":[
                "rms", 
                "zcr",
                "spectralCentroid",
                "spectralSlope",
                "spectralRolloff",
                "energy",
                "perceptualSharpness", 
                "chroma"
            ],

            "callback": features => {
                console.log(features);
                rectSize = features.rms*1000;
                rectColour = features.zcr*10;
                borderSize = features.spectralCentroid/20;
                borderColour = features.spectralSlope*50;
                rectOpacity = features.spectralRolloff/100;
                borderOpacity = features.energy*50;
                bgColour = features.perceptualSharpness*300;
            }
        });
    }
}
    
function draw() { 
    background(bgColour, 200, 200);
    
    var rectLength = rectSize*1.2;
    
//  rect 1
    rect(50, 250, rectLength, rectSize); 
    fill(rectColour, rectColour, 255, rectOpacity); 
    strokeWeight(borderSize);
    stroke(borderColour, borderColour, 255, borderOpacity);
    
//  rect 2
    rect(150, 230, rectLength, rectSize*1.3); 
    fill(rectColour, 255, rectColour, rectOpacity*1.3); 
    strokeWeight(borderSize*2);
    stroke(borderColour, borderColour, 100, borderOpacity*1.3);    
    
//  rect 3
    rect(290, 270, rectLength, rectSize*0.6); 
    fill(rectColour, 255, rectColour, rectOpacity*0.6); 
    strokeWeight(borderSize*1.5);
    stroke(borderColour, 255, borderColour, borderOpacity*0.6); 
    
//  rect 4
    rect(360, 262, rectLength, rectSize*0.75); 
    fill(rectColour, 100, rectColour, rectOpacity*0.75); 
    strokeWeight(borderSize*1.5);
    stroke(borderColour, 100, borderColour, borderOpacity*0.75); 
    
//  rect 5
    rect(430, 240, rectLength, rectSize*1.15); 
    fill(0, rectColour, rectColour, rectOpacity*1.15); 
    strokeWeight(borderSize*1.5);
    stroke(255, borderColour, borderColour, borderOpacity*1.15); 
    
//  rect 6
    rect(550, 258, rectLength, rectSize*0.85); 
    fill(100, rectColour, rectColour, rectOpacity*0.85); 
    strokeWeight(borderSize*1.5);
    stroke(100, borderColour, borderColour, borderOpacity*0.85);    
    

    pauseButton = createButton('pause');
  pauseButton.position(10, 20);
    pauseButton.mousePressed(pauseAudio);
    
    playButton = createButton('play');
  playButton.position(70, 20);
    playButton.mousePressed(playAudio);
    myAudio.playMode('restart');
}

function pauseAudio(){
    myAudio.pause();
    analyzer.stop();
}

function playAudio(){
    myAudio.play();
    analyzer.start();
}
