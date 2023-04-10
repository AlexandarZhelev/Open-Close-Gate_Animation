var closedDoorLPosX = 95.435822;
var closedDoorRPosX = 174.13586;
var StopDoorLPosX = closedDoorLPosX - 70;
var StopDoorRPosX = closedDoorRPosX + 70;

var movingStep = 1.05;
var percentColorShade = 1.15;
var timerIntervalInMilliseconds = 50;

var doorL = document.querySelector("#rect5856");
var doorR = document.querySelector("#rect6326");;
var warningLight = document.querySelector("#WarningLight");
var timerId = -1;

var doorLPosX = closedDoorLPosX;
var doorRPosX = closedDoorRPosX;

var movementDirectionL = -1;
var movementDirectionR = 1;

var originalRectFill =  getColorFromStyle(doorL.getAttribute("style"));
var originalCircleFill =  getColorFromStyle(warningLight.getAttribute("style"));
var movingDoorSteps = 0;

function openDoor() { // the default status of the door is close, so the first run will be here: openDoor()
    if(timerId == -1){
        clearInterval(timerId);
        timerId = setInterval(moveGate, timerIntervalInMilliseconds);
    }
    
    movementDirectionL = -1;
    movementDirectionR = 1;
    moveGate();
}

function closeDoor(){
    if(timerId == -1){
        clearInterval(timerId);
        timerId = setInterval(moveGate, timerIntervalInMilliseconds);
    }
         
    movementDirectionL = 1;
    movementDirectionR = -1;
    moveGate();
}

function moveGate() {
    doorLFullyClosed = false;
    doorRFullyClosed = false;
    doorLFullyOpen = false;
    doorRFullyOpen = false;

    //open gate
    if (movementDirectionL < 0) {
        if (doorLPosX > StopDoorLPosX) {
            doorL.setAttribute("x", doorLPosX += movementDirectionL * movingStep);
            changeStyle(doorL);
        }
        else
            doorLFullyOpen = true;
        
        if (doorRPosX < StopDoorRPosX) {
            doorR.setAttribute("x", doorRPosX += movementDirectionR * movingStep);
            changeStyle(doorR);
        }
        else
            doorRFullyOpen = true;
    }
    
    //close gate
    if (movementDirectionL > 0) {
        if (doorLPosX < closedDoorLPosX) {
            doorL.setAttribute("x", doorLPosX += movementDirectionL * movingStep);
            changeStyle(doorL);
        }
        else
            doorLFullyClosed = true;

        if (doorRPosX > closedDoorRPosX ) {
            doorR.setAttribute("x", doorRPosX += movementDirectionR * movingStep);
            changeStyle(doorR);
        }
        else
            doorRFullyClosed = true;
    }

    if( timerId != -1){
        movingDoorSteps++;
        if((doorLFullyOpen && doorRFullyOpen)
            ||
            (doorLFullyClosed && doorRFullyClosed)){
            clearInterval(timerId);
            timerId = -1;
            movingDoorSteps = 0;
            changeStyle(doorL, originalRectFill);
            changeStyle(doorR, originalRectFill);
            changeStyle(warningLight, originalCircleFill);
        }
        else{
            changeStyle(warningLight, blinkColor());
        }
    }
}

function blinkColor(){
    let orangeColor = "ffae42";
    let egyptionRedColor = "983f4a";
    let warningColor = orangeColor;
    if(movingDoorSteps % 10 < 10 && movingDoorSteps % 10 > 4)
    {
        warningColor = egyptionRedColor;
        secondColorStay = true;
    }
    return warningColor;
}

function getColorFromStyle(style){
    let color = "000000";
    let position = style.search("fill:");
    let fillLength = "fill:#000000".length; // just as a sample

    if(position != -1 && style.length >= fillLength)
        color = style.substring(position, position + fillLength).substring(6, fillLength);

    return color;
}

function replaceColorInStyle(style, newColor){
    let tempStyle = style;
    let position = style.search("fill:");
    let fillLength = "fill:#ffffff".length;
    if(position != -1 && style.length >= fillLength){
        tempStyle = style.substring(0, position);
        tempStyle += "fill:#" + newColor;
        tempStyle += style.substring(position + fillLength, tempStyle.length);
    }
    return tempStyle;
}

function changeStyle(svgElement, color = ""){
    let style = svgElement.getAttribute("style");

    if(color === ""){
        let oldColor = getColorFromStyle(style);
        let newColor = changeColorShade(oldColor);
        style = replaceColorInStyle(style, newColor);
    }
    else
        style = replaceColorInStyle(style, color);

    svgElement.setAttribute("style", style);
    svgElement.setAttribute("hidden", undefined);
}

function changeColorShade(inputColor = ""){
    if(inputColor.length === 0 || inputColor.length > 6)
        return;

    let Rcomponent = inputColor.substring(0, 2);
    let Gcomponent = inputColor.substring(2, 4);
    let Bcomponent = inputColor.substring(4, 6);
    let hexR = parseInt(Rcomponent, "16");
    let hexG= parseInt(Gcomponent, "16");
    let hexB = parseInt(Bcomponent, "16");

    let RcomponentO = originalRectFill.substring(0, 2);
    let GcomponentO = originalRectFill.substring(2, 4);
    let BcomponentO = originalRectFill.substring(4, 6);
    let hexRO = parseInt(RcomponentO, "16");
    let hexGO= parseInt(GcomponentO, "16");
    let hexBO = parseInt(BcomponentO, "16");

    if(hexR != NaN)
        hexR =  shadeMe(hexR, hexRO);  
    if(hexG != NaN)
        hexG = shadeMe(hexG, hexGO);
    if(hexB != NaN)
       hexB = shadeMe(hexB, hexBO);

    return hexR.toString("16") + hexG.toString("16") + hexB.toString("16");
}

function shadeMe(inputColorIntense, originalColor){
    let changedColorIntense = inputColorIntense;
    let upper = Math.floor(originalColor * percentColorShade);
    let lower = Math.floor(originalColor -(originalColor * percentColorShade - originalColor));
    let colorDirection = 1;

    if(upper >= 255)
        upper = 255;

    if(lower <= 0)
        lower = 0;

    if(changedColorIntense >= upper)
         colorDirection = -1;
    
    if(changedColorIntense <= lower)
        colorDirection = 1;
    
    changedColorIntense += colorDirection * 1;

    return changedColorIntense;
}