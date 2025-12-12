import { extract_info } from "./extract.js";

export function displayJSON(json_document){

fetch(json_document)//.hermes/process/hermes.json")
    .then(response => response.json())
    .then(data => {
        document.getElementById("test").innerHTML = 'Project <b>'+data.name[0]+'</b>';
        const keys = Object.keys(data);
        const hermes = document.getElementById("hermes");
        const tbl = document.createElement("table");
        const tblBody = document.createElement("tbody");

        const colgroup = document.createElement("colgroup");
        for(let i=0; i<3; i++){
          const col = document.createElement("col");
          col.id = `col${i}`;
          colgroup.appendChild(col);
        }
        tbl.appendChild(colgroup);
        //tbl.appendChild(colgroup);
        // creating all cells
        keys.forEach(element => {          
          // creates a table row
          const row = document.createElement("tr");
            const cell = document.createElement("td");
            const cell2 = document.createElement("td");
            const cellText = document.createTextNode(` ${element}`);

            const cellTag = document.createElement("td");
            const cellTextTag = document.createElement('div');
            extract_info(cell2, data[element], cellTextTag, element);

            cell.appendChild(cellText);
            row.appendChild(cell);
            row.appendChild(cell2);

            
            cellTag.appendChild(cellTextTag);
            row.appendChild(cellTag);

          // add the row to the end of the table body
          tblBody.appendChild(row);
        })
        tbl.appendChild(tblBody);
        hermes.appendChild(tbl);

    })
}

const checkbox = document.getElementById("extended");
checkbox.addEventListener('change', (event)=>{
  if(checkbox.checked){
    document.getElementById("col2").style.visibility = "";
  }else{
    document.getElementById("col2").style.visibility = "collapse";
  }
})
