function extract_info(element, obj, tag, category){
      const div = document.createElement("div");
      const divTag = document.createElement("div");
      if(obj[category]){
        if(typeof obj[category] === "string" || typeof obj[category] == "number"){
          div.appendChild(document.createTextNode(` ${obj[category]}`));
        }else if(Array.isArray(obj[category])){
          if(Array.isArray(obj[category][0]) && Object.keys(obj[category][0]).includes("familyName")){
            obj[category].forEach(e =>{
              const element = document.createElement("div");
              extract_person(e, element);
              div.appendChild(element);

            })
          }
          obj[category].forEach(e =>{
            //const name = e.exec("familyName");
            const element = document.createElement("div");
            element.appendChild(document.createTextNode(` ${JSON.stringify(e).replaceAll("{","").replaceAll("}","").replaceAll('"',"")}`));
            div.appendChild(element);
      
          })

        }else{
            const element = document.createElement("div");
            element.appendChild(document.createTextNode(` ${JSON.stringify(obj[category])}`));
            div.appendChild(element);
        }
      }else{
        if(Array.isArray(obj) && Object.keys(obj[0]).includes("familyName")){
          obj.forEach(e =>{
            const element = document.createElement("div");
            console.log(e, element);
            extract_person(e, element);
            div.appendChild(element);

          })
        }else{
          const element = document.createElement("div");
          element.appendChild(document.createTextNode(` ${JSON.stringify(obj)}`));
          div.appendChild(element);
        }
      }

      if(Object.keys(obj).includes("meta")){

        divTag.appendChild(document.createTextNode(`${obj.meta["local_path"]}`));
      }else{
        divTag.appendChild(document.createTextNode(`See Details`));
      }
      element.appendChild(div);
      tag.appendChild(divTag);
    }

  function extract_person(e, element){
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    //tooltip.onclick = function(){link_to_person(e)};
    const tooltiptext = document.createElement("div");
    tooltiptext.classList.add("tooltiptext");
    const text = document.createTextNode(`${e.familyName.familyName}, ${e.givenName.givenName} `);
    if(e.familyName.familyName === "Sophie"){
      tooltip.className += " error"
    }
    //const data = JSON.stringify(e, null, 2);
    
    const names = [];
    Object.keys(e).forEach(k => {
      if (Object.keys(e[k]).includes(k)){
        names.push(`${k}:  ${e[k][k]}`); 
      }
    })
    console.log(names);
    tooltiptext.appendChild(document.createTextNode(`${names.toString().replaceAll(",","\n")}`)); //{.*\n*\t*.*\n*}
    tooltip.appendChild(tooltiptext);
    tooltip.appendChild(text);
    element.appendChild(tooltip);
  }

  function link_to_person(data){
    document.body.innerHTML = '<p id="test"></p><div id="content"><div id="hermes"></div><div id="tags"></div></div><button onClick="window.location.reload();">Go Back</button>';
        document.getElementById("test").innerHTML = 'Person <b>'+data.familyName+'</b>';
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
            const cellText2 = document.createElement('div');

            const cellTag = document.createElement("td");
            const cellTextTag = document.createElement('div');

            extract_info(cellText2, data[element], cellTextTag, "author[0]."+element);
            //cellText2.appendChild(document.createTextNode(` ${data.affiliation[element]}`));
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

  }
  export {extract_info};
