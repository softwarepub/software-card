import { registerAvatarComponent } from './components/avatar.js';
import { registerDashComponent } from './components/dash.js';
const app = () => {
    registerAvatarComponent();
    registerDashComponent();
}
document.addEventListener('DOMContentLoaded', app);
function extract_info(element, obj){
  if(typeof obj === "string" || typeof obj == "number"){
    element.appendChild(document.createTextNode(` ${obj}`));
  }
  else if(Object.keys(obj[0]).includes("familyName")){
    obj.forEach(e =>{
      //const name = e.exec("familyName");
      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      const tooltiptext = document.createElement("div");
      tooltiptext.classList.add("tooltiptext");
      const text = document.createTextNode(`${e.familyName}, ${e.givenName} `);
      if(e.familyName === "Sophie"){
        tooltip.className += " error"
      }
      const data = JSON.stringify(e, null, 2);
      tooltiptext.appendChild(document.createTextNode(`${data.replaceAll("{","\t").replaceAll("}","\t")}`)); //{.*\n*\t*.*\n*}
      tooltip.appendChild(tooltiptext);
      tooltip.appendChild(text);
      element.appendChild(tooltip);
    })

  }
  else{
    const names = [];
    obj.forEach(e =>{
      //const name = e.exec("familyName");
      names.push(JSON.stringify(e).replaceAll("{","\t").replaceAll("}","\t"));
      
    })
    const text = document.createTextNode(` ${names}`);
    element.appendChild(text);
  }
}

fetch("https://raw.githubusercontent.com/SKernchen/SoftwareCaRD-test/refs/heads/main/.hermes/process/hermes.json")//.hermes/process/hermes.json")
    .then(response => response.json())
    .then(data => {
        document.getElementById("test").innerHTML = 'Project <b>'+data.name+'</b>';
        const keys = Object.keys(data);
        const hermes = document.getElementById("hermes");
        const tbl = document.createElement("table");
        const tblBody = document.createElement("tbody");
      
        // creating all cells
        keys.forEach(element => {
          // creates a table row
          const row = document.createElement("tr");
      
            const cell = document.createElement("td");
            const cell2 = document.createElement("td");
            const cellText = document.createTextNode(` ${element}`);
            const cellText2 = document.createElement('div');
            extract_info(cellText2, data[element]);
            cell.appendChild(cellText);
            cell2.appendChild(cellText2);
            row.appendChild(cell);
            row.appendChild(cell2);

      
          // add the row to the end of the table body
          tblBody.appendChild(row);
        })
        tbl.appendChild(tblBody);
        hermes.appendChild(tbl);
        const a = registerDashComponent();
        document.getElementById("s").appendChild(a);

    })

const canvas = document.getElementById('radar');
const ctx = canvas.getContext('2d');

function init() {}
init();
const a = 2 * Math.PI / 6;
const r = 30;

function drawHexagon(x, y, r=30) {
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      ctx.lineTo(x+ r * Math.sin(a * i), y + r * Math.cos(a * i));
    }
    ctx.closePath();
    ctx.stroke();
  }

function drawRadar(x, y, r=[30,40,20,30,30,30], color="black", fillcolor="rgba(255, 255, 255, 1)") {
    ctx.strokeStyle = color;
    ctx.fillStyle = fillcolor;
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      ctx.lineTo(x+ r[i] * Math.sin(a * i), y + r[i] * Math.cos(a * i));
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }
drawHexagon(canvas.offsetWidth/2,canvas.offsetHeight/2);
drawRadar(canvas.offsetWidth/2,canvas.offsetHeight/2, [21,25,20,27,25,25], "green");
drawRadar(canvas.offsetWidth/2,canvas.offsetHeight/2, [15,15,10,15,15,12], "red");
drawRadar(canvas.offsetWidth/2,canvas.offsetHeight/2, [20,20,9,10,20,15], "blue", "rgba(94, 148, 215, 0.34)");

