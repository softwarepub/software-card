import {drawHexagon, drawRadar } from "./radar.js";
import { displayJSON } from "./src/curation.js";


//Draw radar plot
const canvas = document.getElementById('radar');
const ctx = canvas.getContext('2d');

function init() {}
init();

drawHexagon(ctx, canvas.offsetWidth/2,canvas.offsetHeight/2);

drawRadar(ctx, canvas.offsetWidth/2,canvas.offsetHeight/2, [21,25,20,27,25,25], "green");
drawRadar(ctx, canvas.offsetWidth/2,canvas.offsetHeight/2, [15,15,10,15,15,12], "red");
drawRadar(ctx, canvas.offsetWidth/2,canvas.offsetHeight/2, [20,20,9,10,20,15], "blue", "rgba(94, 148, 215, 0.34)");

//View for Curation
displayJSON("https://raw.githubusercontent.com/SKernchen/SoftwareCaRD-test/refs/heads/main/.hermes/process/hermes.json");