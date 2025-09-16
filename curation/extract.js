function extract_info(element, obj){

    if(typeof obj === "string" || typeof obj == "number"){
      element.appendChild(document.createTextNode(` ${obj}`));
    }
    else if(typeof obj === "object" && Array.isArray(obj) === false){
      element.appendChild(document.createTextNode(` ${JSON.stringify(obj)}`));
    }
    else if(Array.isArray(obj) && Object.keys(obj[0]).includes("familyName")){
      obj.forEach(e =>{
        //const name = e.exec("familyName");
        extract_person(e, element);
      })
  
    }
    else{
      const names = [];
      const div = document.createElement("div");
      div.classList.add("elements");
      obj.forEach(e =>{
  
        names.push(JSON.stringify(e).replaceAll("{","").replaceAll("}",""));
        const element = document.createElement("div");
        element.appendChild(document.createTextNode(` ${JSON.stringify(e).replaceAll("{","").replaceAll("}","").replaceAll('"',"")}`));
        div.appendChild(element);
      })
      //const text = document.createTextNode(` ${names}`);
      element.appendChild(div);
    }
  }

  function extract_person(e, element){
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    tooltip.onclick = function(){link_to_person(e)};
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
  }

  function link_to_person(data){
    document.body.innerHTML = '<p id="test"></p><div id="hermes"></div><button onClick="window.location.reload();">Go Back</button>';
        document.getElementById("test").innerHTML = 'Person <b>'+data.familyName+'</b>';
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
            //cellText2.appendChild(document.createTextNode(` ${data.affiliation[element]}`));
            cell.appendChild(cellText);
            cell2.appendChild(cellText2);
            row.appendChild(cell);
            row.appendChild(cell2);

      
          // add the row to the end of the table body
          tblBody.appendChild(row);
        })
        tbl.appendChild(tblBody);
        hermes.appendChild(tbl);

  }
  export {extract_info};

