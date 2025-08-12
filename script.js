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
    //return element;
  }
  else if(Object.keys(obj[0]).includes("familyName")){
    const names = [];
    obj.forEach(e =>{
      //const name = e.exec("familyName");
      names.push(JSON.stringify(e));//.toString());
      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      const tooltiptext = document.createElement("span");
      tooltiptext.classList.add("tooltiptext");
      const text = document.createTextNode(`${e.familyName}, ${e.givenName} `);
      tooltiptext.appendChild(document.createTextNode(`${JSON.stringify(e)}`));
      tooltip.appendChild(tooltiptext);
      //const text = document.createTextNode(` ${e.familyName}, ${e.givenName}`);
      tooltip.appendChild(text);
      element.appendChild(tooltip);
    })
    
    /*const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    const tooltiptext = document.createElement("span");
    tooltiptext.classList.add("tooltiptext");
    const text = document.createTextNode(` ${obj[0]} `);
    tooltiptext.appendChild(text);
    tooltip.appendChild(tooltiptext);*/
    return names;
  }
  else{
    const names = [];
    obj.forEach(e =>{
      //const name = e.exec("familyName");
      names.push(JSON.stringify(e));//.toString());
      
    })
    const text = document.createTextNode(` ${names}`);
    element.appendChild(text);
  }
}

fetch(".hermes/process/hermes.json")
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

function drawRadar(x, y, r=30, color="black") {
    ctx.strokeStyle = color;
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      ctx.lineTo(x+ r * Math.sin(a * i), y + r * Math.cos(a * i));
    }
    ctx.closePath();
    ctx.stroke();
  }
drawHexagon(canvas.offsetWidth/2,canvas.offsetHeight/2);
drawRadar(canvas.offsetWidth/2,canvas.offsetHeight/2, 25, "green");
drawRadar(canvas.offsetWidth/2,canvas.offsetHeight/2, 10, "red");
