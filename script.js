fetch(".hermes/process/hermes.json")
    .then(response => response.json())
    .then(data => {
        document.getElementById("test").innerHTML = data.name;
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
            const cellText2 = document.createTextNode(` ${data[element]}`);
            cell.appendChild(cellText);
            cell2.appendChild(cellText2);
            row.appendChild(cell);
            row.appendChild(cell2);

      
          // add the row to the end of the table body
          tblBody.appendChild(row);
        })
        tbl.appendChild(tblBody);
        hermes.appendChild(tbl);

    })

const canvas = document.getElementById('radar');
const ctx = canvas.getContext('2d');

function init() {}
init();
const a = 2 * Math.PI / 6;
const r = 30;

function drawHexagon(x, y) {
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      ctx.lineTo(x+ r * Math.sin(a * i), y + r * Math.cos(a * i));
    }
    ctx.closePath();
    ctx.stroke();
  }
drawHexagon(canvas.offsetWidth/2,canvas.offsetHeight/2);
