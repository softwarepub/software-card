import { extract_info } from "./extract.js";

export function displayJSON(json_document){

  fetch(json_document)
  .then(response => response.json())
  .then(data => {
      document.getElementById("test").innerHTML = 'Project <b>'+data.name[0]+'</b>';
      const keys = Object.keys(data);
      const metadateTemp = document.querySelector("#metadate");
      const tbody = document.querySelector("#metadata");

      keys.forEach(element => {          
        const row = document.importNode(metadateTemp.content, true);
        const mkey = row.querySelector("#key"),
          mvalue = row.querySelector("#value"),
          mtag = row.querySelector("#tag");

          mkey.textContent = `${element}`;
          extract_info(mvalue, data[element], mtag);
          /*
          mvalue.textContent = `${data[element][0]}`;
          mtag.textContent = `${data[element][1]["local_path"]}`;*/
          tbody.appendChild(row);
      })
  })



const checkbox = document.getElementById("extended");
checkbox.addEventListener('change', (event)=>{
if(checkbox.checked){
  document.getElementById("col2").style.visibility = "";
}else{
  document.getElementById("col2").style.visibility = "collapse";
}
})
}