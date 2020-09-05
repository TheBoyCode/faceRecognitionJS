let outPutWidth = 800;
let outPutHeight = 600;

let faceTracker;
let videoInput;

let imgMasck; 

let selected = -1;

function preload() {
    imgMasck = loadImage("https://httpbin.org/image/png");
}

function setup() {
    const maxWidth = Math.min(windowWidth,windowHeight);
    pixelDensity(1);

    createCanvas(outerWidth, outPutHeight);

    videoInput = createCapture(VIDEO);
    videoInput.size(outPutWidth,outerHeight);
    videoInput.hide();

    const sel= createSelect();
    const selectList = ['Mask'];
    sel.option('Select filter', 0);
    selectList.forEach((filter, index) => {
        sel.option(filter, index);
    });
    sel.changed(applyFilter);

    faceTracker = new clm.tracker();
    faceTracker.init();
    faceTracker.start(videoInput.elt);
}
function applyFilter(){
    selected = this.selected();
}

function draw() {
    image(videoInput, 0, 0, outPutWidth, outPutHeight);
    /**
     * Selecting of mask
     */
    switch(selected) {
        case '-1': break;
        case '0': drawMask(); break;
    }
}

function drawMask() {
    const postions = faceTracker.getCurrentPosition();
    if (postions){
        push();
        /**
         * There are dots on face 
         * 13 and 1 it means right and left side of fase
         * 16,20 - up of face 
         * 7 it`s down of face
         * 62 - center of nose
         */
        const wx = Math.abs(postions[13][0] - postions[1][0]) * 1.2;
        const wy = Math.abs(postions[7][1] - Math.min(postions[16][1], postions[20][1]))*1.2;
        translate(-wx/2, -wy/2);
        image(imgMasck, postions[62][0], postions[20][1], wx, wy);
        pop();
    }
}

function windowResized() {
    const maxWidth = Math.min(windowWidth, windowHeight);
    pixelDensity(1);
    resizeCanvas(outPutWidth,outPutHeight);
}