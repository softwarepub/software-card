export function extract_info(element, obj){
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
