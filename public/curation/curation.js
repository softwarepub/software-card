import { extract_info } from "./extract.js";

export function displayJSON(json_document){

fetch(json_document)//.hermes/process/hermes.json")
    .then(response => response.json())
    .then(data => {
        document.getElementById("test").innerHTML = 'Project <b>'+data.name+'</b>';
        const keys = Object.keys(data);
        const hermes = document.getElementById("hermes");
        const tags = document.getElementById("tags");
        const tbl = document.createElement("table");
        const tblBody = document.createElement("tbody");

        const tblTags = document.createElement("table");
        const tblBodyTags = document.createElement("tbody");

        
      
        // creating all cells
        keys.forEach(element => {
          // creates a table row
          const row = document.createElement("tr");
          const rowTags = document.createElement("tr");

            const cell = document.createElement("td");
            const cell2 = document.createElement("td");
            const cellText = document.createTextNode(` ${element}`);
            const cellText2 = document.createElement('div');

            const cellTag = document.createElement("td");
            const cellTextTag = document.createElement('div');

            extract_info(cellText2, data[element], cellTextTag, element);
            cell.appendChild(cellText);
            cell2.appendChild(cellText2);
            row.appendChild(cell);
            row.appendChild(cell2);

            
            cellTag.appendChild(cellTextTag);
            rowTags.appendChild(cellTag);

      
          // add the row to the end of the table body
          tblBody.appendChild(row);
          tblBodyTags.appendChild(rowTags);
        })
        tbl.appendChild(tblBody);
        hermes.appendChild(tbl);

        tblTags.appendChild(tblBodyTags);
        tags.appendChild(tblTags);

    })
}

const checkbox = document.getElementById("extended");
checkbox.addEventListener('change', (event)=>{
  if(checkbox.checked){
    document.getElementById("tags").style.display = "block";
  }else{
    document.getElementById("tags").style.display = "none";
  }
})
