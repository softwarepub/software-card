function extract_info(cell, obj, tag, colorPolicies){
      if(!Array.isArray(obj)){
        obj = [obj];
      }
      if(typeof obj[0] === "string" || typeof obj[0] == "number" || typeof obj[0] == "boolean"){
        if(obj[2] && obj[2]["conflict"]){
          const element = document.createElement("div");
          element.style.color = colorPolicies[obj[2]["conflict"]];
          element.appendChild(document.createTextNode(` ${obj[0]}`));
          cell.appendChild(element);
          console.log("parent: "+cell.parentNode)
          //cell.parentNode.style.background = colorPolicies[obj[2]["conflict"]];
        }else{
        cell.appendChild(document.createTextNode(` ${obj[0]}`));
        }
        
      }
      else if(!Array.isArray(obj[0]) && Object.keys(obj[0]).includes("familyName")){
          obj.forEach(e =>{
            const element = document.createElement("div");
            extract_person(e, element, tag, colorPolicies);
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
              extract_info(div, obj[0][key], tag, colorPolicies); 
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

  function extract_person(e, element, tag, colorPolicies){
    let hasConfict = false;
    const tooltip = document.createElement("div");
    const tooltiptag = document.createElement("div");
    tooltip.classList.add("swc-tooltip");
    tooltip.onclick = function(){link_to_person(e)};
    const tooltiptext = document.createElement("div");
    tooltiptext.classList.add("swc-tooltiptext");
    const text = document.createTextNode(`${e.familyName[0]}, ${e.givenName[0]} `);
    tooltiptag.appendChild(document.createTextNode("See Details"));
    tooltiptag.appendChild(document.createElement("br"));
    tooltiptag.onclick = function(){link_to_person(e)};
    tag.appendChild(tooltiptag);
    //const data = JSON.stringify(e, null, 2);

    const names = [];
    Object.keys(e).forEach(k => {
      const pair = document.createElement("p");
      if(!Array.isArray(e[k])){
        for (let key in e[k]) {
        const pair_in_list = document.createElement("p");
        names.push(`${k}:${key}:  ${e[k][key][0]}`); 
        pair_in_list.appendChild(document.createTextNode(`${k}:${key}:  ${e[k][key][0]}`));
        if(e[k][key][2] && e[k][key][2]["conflict"]){
          pair_in_list.style.color = colorPolicies[e[k][key][2]["conflict"]];
          tooltiptag.style.color = colorPolicies[e[k][key][2]["conflict"]];
          hasConfict = true;
          
        }
        pair.appendChild(pair_in_list);
      }
      }else{
      names.push(`${k}:  ${e[k][0]}`); 
      pair.appendChild(document.createTextNode(`${k}:  ${e[k][0]}`));
      
      if(e[k][2] && e[k][2]["conflict"]){
        pair.style.color = colorPolicies[e[k][2]["conflict"]];
        tooltiptag.style.color = colorPolicies[e[k][2]["conflict"]];
        hasConfict = true;
      }
    }
    tooltiptext.appendChild(pair);
    })
    //tooltiptext.appendChild(document.createTextNode(`${names.toString().replaceAll(",","\n")}`));
    tooltip.appendChild(tooltiptext);
    tooltip.appendChild(text);
    element.appendChild(tooltip);
    return hasConfict;
  }

  function link_to_person(data){
    window.location.href += `?id=${data["@id"][0]}`;
  }

  export {extract_info};
