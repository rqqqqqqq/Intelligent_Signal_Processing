// Exercise 1 template
// Feel freee to modify it or create your own template

var myAudio;
var microphone;
var recorder;
var newRecording;
var state = 0; // for recording, mousePress will increment state
var fft;

// playback controls
var pauseButton;
var playButton;
var stopButton;
var skipStartButton;
var skipEndButton;
var loopButton;
var recordButton;

// low-pass filter
var lp_cutOffSlider;
var lp_resonanceSlider;
var lp_dryWetSlider;
var lp_outputSlider;

var filter;
var filterFreq;
var filterRes;

// dynamic compressor
var dc_attackSlider;
var dc_kneeSlider;
var dc_releaseSlider;
var dc_ratioSlider;
var dc_thresholdSlider;
var dc_dryWetSlider;
var dc_outputSlider;

var compression_as;
var compression_ks;
var compression_rs;
var compression_rss;
var compression_ts;

// master volume
var mv_volumeSlider;

// reverb
var rv_durationSlider;
var rv_decaySlider;
var rv_dryWetSlider;
var rv_outputSlider;
var rv_reverseButton;

var duration_rv;
var decay_rv;
var reverse_rv;

// waveshaper distortion
var wd_amountSlider;
var wd_oversampleSlider;
var wd_dryWetSlider;
var wd_outputSlider;

var distortion;
var distortionAmt;
var distortionOs;

function preload() {

    soundFormats('wav');
    myAudio = loadSound('/sounds/ISP_Q1_Recording');
}

function setup() {
  createCanvas(800, 600);
//  background(180);
    
    //to allow audio in
    microphone = new p5.AudioIn();
    //for users to enable the mic in their browser manually
    microphone.start();
    //to record sound
    recorder = new p5.SoundRecorder();
    //microphone is connected to recorder
    recorder.setInput(microphone);
    //create empty sound file to play new recording
    newRecording = new p5.SoundFile();
    
    filter = new p5.LowPass();
    //Disconnect soundfile from master output
    myAudio.disconnect();
    
    distortion = new p5.Distortion();
    //Disconnect soundfile from master output
    myAudio.disconnect();

    compression = new p5.Compressor();
    //Disconnect soundfile from master output
    myAudio.disconnect();
    
    reverb = new p5.Reverb();
    //Disconnect soundfile from master output
    myAudio.disconnect();
    
    fft = new p5.FFT();
    fft.setInput(myAudio);

    new_fft = new p5.FFT();
    new_fft.setInput();

  gui_configuration();
}

function draw() { 
    background(180);
    textSize(14);
    text('low-pass filter', 10,80);
    textSize(10);
    text('cutoff frequency', 10,105);
    text('resonance', 10,150);
    text('dry/wet', 10,195);
    text('output level', 10,240);


    textSize(14);
    text('dynamic compressor', 210,80);
    textSize(10);
    text('attack', 210,105);
    text('knee', 210,150);
    text('release', 210,195);
    text('ratio', 210,240);
    text('threshold', 360,105);
    text('dry/wet', 360,150);
    text('output level', 360,195)


    textSize(14);
    text('reverb', 10,305);
    textSize(10);
    text('duration', 10,330);
    text('decay', 10,375);
    text('dry/wet', 10,420);
    text('output level', 10,465);

    textSize(14);
    text('waveshaper distortion', 210,305);
    textSize(10);
    text('distortion amount', 210,330);
    text('oversample', 210,375);
    text('dry/wet', 210,420);
    text('output level', 210,465);

    textSize(14);
    text('master volume', 560,80);
    textSize(10);
    text('level', 560,105)

    textSize(14);
    text('spectrum in', 560,200);
    text('spectrum out', 560,345);

    lowPassFilter();
    waveshaperDistortion();
    dynamicCompressor();
    reverb_audio();
    masterVolume();
    spectrumIn();
    spectrumOut();
}

function gui_configuration() {
    // Playback controls
    pauseButton = createButton('pause');
    pauseButton.position(10, 20);
    pauseButton.mousePressed(pauseAudio);

    playButton = createButton('play');
    playButton.position(70, 20);
    playButton.mousePressed(playAudio);
    myAudio.playMode('restart');

    stopButton = createButton('stop');
    stopButton.position(120, 20);
    stopButton.mousePressed(stopAudio);

    skipStartButton = createButton('skip to start');
    skipStartButton.position(170, 20);
    skipStartButton.mousePressed(skipToStart);

    skipEndButton = createButton('skip to end');
    skipEndButton.position(263, 20);
    skipEndButton.mousePressed(skipToEnd);

    loopButton = createButton('loop');
    loopButton.position(352, 20);
    loopButton.mousePressed(loopAudio);

    recordButton = createButton('record');
    recordButton.position(402, 20);
    recordButton.mousePressed(recordAudio);
  
  // Important: you may have to change the slider parameters (min, max, value and step)
  
  // low-pass filter
    lp_cutOffSlider = createSlider(0, 1, 0.5, 0.01);
    lp_cutOffSlider.position(10,110);
    lp_resonanceSlider = createSlider(0, 1, 0.5, 0.01);
    lp_resonanceSlider.position(10,155);
    lp_dryWetSlider = createSlider(0, 1, 0.5, 0.01);
    lp_dryWetSlider.position(10,200);
    lp_outputSlider = createSlider(0, 1, 0.5, 0.01);
    lp_outputSlider.position(10,245);

    // dynamic compressor
    dc_attackSlider = createSlider(0, 1, 0.5, 0.01);
    dc_attackSlider.position(210,110);
    dc_kneeSlider = createSlider(0, 1, 0.5, 0.01);
    dc_kneeSlider.position(210,155);
    dc_releaseSlider = createSlider(0, 1, 0.5, 0.01);
    dc_releaseSlider.position(210,200);
    dc_ratioSlider = createSlider(0, 1, 0.5, 0.01);
    dc_ratioSlider.position(210,245);
    dc_thresholdSlider = createSlider(0, 1, 0.5, 0.01);
    dc_thresholdSlider.position(360,110);
    dc_dryWetSlider = createSlider(0, 1, 0.5, 0.01);
    dc_dryWetSlider.position(360,155);
    dc_outputSlider = createSlider(0, 1, 0.5, 0.01);
    dc_outputSlider.position(360,200);

    // master volume
    mv_volumeSlider = createSlider(0, 1, 0.5, 0.01);
    mv_volumeSlider.position(560,110);

    // reverb
    rv_durationSlider = createSlider(0, 1, 0.5, 0.01);
    rv_durationSlider.position(10,335);
    rv_decaySlider = createSlider(0, 1, 0.5, 0.01);
    rv_decaySlider.position(10,380);
    rv_dryWetSlider = createSlider(0, 1, 0.5, 0.01);
    rv_dryWetSlider.position(10,425);
    rv_outputSlider = createSlider(0, 1, 0.5, 0.01);
    rv_outputSlider.position(10,470);
    rv_reverseButton = createButton('reverb reverse');
    rv_reverseButton.position(10, 510);

    // waveshaper distortion
    wd_amountSlider = createSlider(0, 1, 0.5, 0.01);
    wd_amountSlider.position(210,335);
    wd_oversampleSlider = createSlider(0, 1, 0.5, 0.01);
    wd_oversampleSlider.position(210,380);
    wd_dryWetSlider = createSlider(0, 1, 0.5, 0.01);
    wd_dryWetSlider.position(210,425);
    wd_outputSlider = createSlider(0, 1, 0.5, 0.01);
    wd_outputSlider.position(210,470);
  
}

function pauseAudio(){
    myAudio.pause();
}

function playAudio(){
    myAudio.play();
}

function stopAudio(){
    myAudio.stop();
}

function loopAudio(){
    myAudio.loop();
}

function skipToStart(){
    myAudio.jump(0); 
}

function skipToEnd(){
    var length = myAudio.duration();
    myAudio.jump(length);  
}

function recordAudio(){        
    
    if (state === 0 && microphone.enabled){
        recorder.record(newRecording);
        state++;
    }else if (state === 1){
        recorder.stop();
        state++;
    }else if (state === 2){
        newRecording.play();
        saveSound(newRecording, 'newAudioFile.wav');
        state++
    }
}

function lowPassFilter(){
    //mapping slider value to a cutoff freq ranging from the lowest and highest frequency (10-22050Hz) that humans can hear
    var lp_cutOffSliderValue = lp_cutOffSlider.value();
    filterFreq = map(lp_cutOffSliderValue, 0, 1, 10, 22050);
    
    //mapping slider value to resonance at cutoff freq
    var lp_resonanceSliderValue = lp_resonanceSlider.value();
    filterRes = map(lp_resonanceSliderValue, 0, 1, 15, 5);
    
    //setting parameters for filter
    filter.set(filterFreq, filterRes);
    
    var lp_dryWetSliderValue = lp_dryWetSlider.value(); 
    filter.drywet(lp_dryWetSliderValue);
    
    var lp_amplitudeValue = lp_outputSlider.value();
    filter.amp(lp_amplitudeValue);
    
    //Connect soundfile to filter, to only hear filtered sound
    myAudio.connect(filter);
}

function waveshaperDistortion(){
    
    var wd_amountSliderValue = wd_amountSlider.value();
    distortionAmt = map(wd_amountSliderValue, 0, 1, 0, 1);
    
    var wd_oversampleSliderValue = wd_oversampleSlider.value();
    distortionOS = map(wd_oversampleSliderValue, 0, 1, 0, 10);
    
    distortion.set(distortionAmt, distortionOs);
    
    var wd_dryWetSliderValue = wd_dryWetSlider.value(); 
    distortion.drywet(wd_dryWetSliderValue);
    
    var wd_outputSliderValue = wd_outputSlider.value();
    distortion.amp(wd_outputSliderValue);
    
    //Connect soundfile to distortion, to only hear distorted sound
    myAudio.connect(distortion);
}

function dynamicCompressor(){

    var dc_attackSliderValue = dc_attackSlider.value();
    compression_as = map(dc_attackSliderValue, 0, 1, 0, 1);
    
    var dc_kneeSliderValue = dc_kneeSlider.value();
    compression_ks = map(dc_kneeSliderValue, 0, 1, 0, 40);
    
    var dc_releaseSliderValue = dc_releaseSlider.value();
    compression_rs = map(dc_releaseSliderValue, 0, 1, 0, 1);
    
    var dc_ratioSliderValue = dc_ratioSlider.value();
    compression_rss = map(dc_ratioSliderValue, 0, 1, 0, 20);
    
    var dc_thresholdSliderValue = dc_thresholdSlider.value();
    compression_ts = map(dc_thresholdSliderValue, 0, 1, -100, 0);
    
    compression.set(compression_as, compression_ks, compression_rss, compression_ts, compression_rs);
    
    var dc_dryWetSliderValue = dc_dryWetSlider.value(); 
    compression.drywet(dc_dryWetSliderValue);
    
    var dc_outputSliderValue = dc_outputSlider.value();
    compression.amp(dc_outputSliderValue);

    //Connect soundfile to distortion, to only hear distorted sound
    myAudio.connect(compression);
}

function reverb_audio(){
    
//UNABLE TO UNCOMMENT AS IT CRASHES BRACKETS, BUT CODE IS STILL USABLE
    
//    var rv_durationSliderValue = rv_durationSlider.value();
//    duration_rv = map(rv_durationSliderValue, 0, 1, 0, 10);
//    
//    var rv_decaySliderValue = rv_decaySlider.value();
//    decay_rv = map(rv_decaySliderValue, 0, 1, 0, 100);
//    
//    var rv_dryWetSliderValue = rv_dryWetSlider.value(); 
//    reverb.drywet(rv_dryWetSliderValue);
//    
//    var rv_outputSliderValue = rv_outputSlider.value();
//    reverb.amp(rv_outputSliderValue);
    rv_reverseButton.mousePressed(reverb_audio);
    reverse_rv = reverseReverb();
    
    reverb.set(duration_rv, decay_rv, reverse_rv);
    
    //Connect soundfile to distortion, to only hear distorted sound
    myAudio.connect(reverb);
    
}

function reverseReverb(){
    var toggle;
    toggle = !toggle;
    console.log(toggle);
    return toggle;        
}

function masterVolume(){

    var mv_volumeSliderValue = mv_volumeSlider.value();
    volume_mv = map(mv_volumeSliderValue, 0, 1, 0, 1);
    
    myAudio.setVolume(volume_mv);
}

function spectrumIn(){
    var spectrum = fft.analyze();

    var width = 200;
    var height = 120;
    
    for (var i = 0; i<spectrum.length; i++){
        var x = map(i, 0, spectrum.length, 560, 560+width);
        var y = -height + map(spectrum[i], 0, 255, height, 0);
        rect(x, 210+height, width/spectrum.length, y); 
    }
}

function spectrumOut(){
    var new_spectrum = new_fft.analyze();

    var width = 200;
    var height = 120;
    
    for (var i = 0; i<new_spectrum.length; i++){
        var x = map(i, 0, new_spectrum.length, 560, 560+width);
        var y = -height + map(new_spectrum[i], 0, 255, height, 0);
        rect(x, 355+height, width/new_spectrum.length, y); 
    }
    
    line(560, 185, 560+width, 185);
    line(560, 185, 560, 475);
    line(560+width, 185, 560+width, 475);
    strokeWeight(0.5);    

}