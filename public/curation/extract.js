function extract_info(cell, obj, tag, category){
      if(!Array.isArray(obj)){
        obj = [obj];
      }
      if(typeof obj[0] === "string" || typeof obj[0] == "number"){
        cell.appendChild(document.createTextNode(` ${obj[0]}`));
      }
      else if(!Array.isArray(obj[0]) && Object.keys(obj[0]).includes("familyName")){
          obj.forEach(e =>{
            const element = document.createElement("div");
            extract_person(e, element, tag);
            cell.appendChild(element);

          })}
      else if(Array.isArray(obj[0])){
          obj[0].forEach(e =>{
          const element = document.createElement("div");
          extract_info(element, e, tag);
          //element.appendChild(document.createTextNode(`hh ${e}`));
          cell.appendChild(element);

        })
          }
      else{
          const div = document.createElement("div");
          for (let key in obj[0]) {
            if(typeof obj[0][key]=== "string" || typeof obj[0][key] == "number"){
            div.appendChild(document.createTextNode(`${key}: ${(obj[0][key])}`));
            }else{
              div.appendChild(document.createTextNode(`${key}: `));
              extract_info(div, obj[0][key], tag, key); 
            }
            div.appendChild(document.createElement("br"));
          }
          cell.appendChild(div);
      }
      if(obj[1] && Object.keys(obj[1]).includes("local_path")){
        const divTag = document.createElement("div");
        divTag.classList.add("tag");
        divTag.appendChild(document.createTextNode(`${obj[1]["local_path"]}`));
        tag.appendChild(divTag);
      }
    }

  function extract_person(e, element, tag){
    const tooltip = document.createElement("div");
    const tooltiptag = document.createElement("div");
    tooltip.classList.add("tooltip");
    tooltip.onclick = function(){link_to_person(e)};
    const tooltiptext = document.createElement("div");
    tooltiptext.classList.add("tooltiptext");
    const text = document.createTextNode(`${e.familyName[0]}, ${e.givenName[0]} `);
    tooltiptag.appendChild(document.createTextNode("See Details"));
    tooltiptag.appendChild(document.createElement("br"));
    tooltiptag.onclick = function(){link_to_person(e)};
    tag.appendChild(tooltiptag);
    if(e.familyName[0] === "Sophie"){
      tooltip.className += " error"
    }
    //const data = JSON.stringify(e, null, 2);
    
    const names = [];
    Object.keys(e).forEach(k => {
      if(!Array.isArray(e[k])){
        for (let key in e[k]) {
        names.push(`${k}:${key}:  ${e[k][key][0]}`); 
        }
      }else{
      names.push(`${k}:  ${e[k][0]}`); 
      }
    })
    tooltiptext.appendChild(document.createTextNode(`${names.toString().replaceAll(",","\n")}`));
    tooltip.appendChild(tooltiptext);
    tooltip.appendChild(text);
    element.appendChild(tooltip);
  }

  function link_to_person(data){
    document.body.innerHTML = '<p id="test"></p><div id="content"><div id="hermes"></div><div id="tags"></div></div><button onClick="window.location.reload();">Go Back</button>';
        document.getElementById("test").innerHTML = 'Person <b>'+data.familyName[0]+'</b>';
        const keys = Object.keys(data);
        const hermes = document.getElementById("hermes");
        const tbl = document.createElement("table");
        const tblBody = document.createElement("tbody");
        
        const tags = document.getElementById("tags");
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

            const cellTag = document.createElement("td");
            const cellTextTag = document.createElement('div');

            extract_info(cell2, data[element], cellTextTag, element);
            cell.appendChild(cellText);
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

  }

  function getHeight(element)
{
    element.style.visibility = "hidden";
    document.body.appendChild(element);
    var height = element.offsetHeight + 0;
    document.body.removeChild(element);
    element.style.visibility = "visible";
    console.log(height);
    return height;
}

  export {extract_info};
