import {drawHexagon, drawRadar } from "../radar.js";


//Draw radar plot
const canvas = document.getElementById('radar');
const ctx = canvas.getContext('2d');

function init() {}
init();

drawHexagon(ctx, canvas.offsetWidth/2,canvas.offsetHeight/2, 120, ["Finadable","Accessible","Interoperable", "Reusable", "Scientific embedding", "Technical grounded"]);

drawRadar(ctx, canvas.offsetWidth/2,canvas.offsetHeight/2, [21,25,20,27,25,25].map(function(x) { return x * 4; }), "green");
drawRadar(ctx, canvas.offsetWidth/2,canvas.offsetHeight/2, [15,15,10,15,15,12].map(function(x) { return x * 4; }), "red");
drawRadar(ctx, canvas.offsetWidth/2,canvas.offsetHeight/2, [20,20,9,10,20,15].map(function(x) { return x * 4; }), "blue", "rgba(94, 148, 215, 0.34)");
