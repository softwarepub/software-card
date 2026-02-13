import { extract_info } from "./extract.js";

export function displayJSON(json_document){

  fetch(json_document)
  .then(response => response.json())
  .then(data => {
      const params = new URLSearchParams(location.search);
      if(params.has("id")){
        const id = params.get("id")
        data = get_data_snippet(data, "@id", id);

        const back = document.createElement("button");
        back.innerText = "Back to Overview";
        back.onclick = () => {window.location = window.location.href.split('?')[0];}
        document.body.appendChild(back);
      }
      


      //document.getElementById("test").innerHTML = 'Project <b>'+data.name[0]+'</b>';
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
    const checkbox = document.querySelector("#extended");
checkbox.addEventListener('change', (event)=>{
  if(checkbox.checked){
  document.getElementById("col2").style.visibility = "";
}else{
  document.getElementById("col2").style.visibility = "collapse";
}

})


}
function get_data_snippet(data, skey, svalue){
  const stack = [data];
  while (stack?.length > 0) {
    const obj = stack.pop();
    for(let i=0; i<Object.keys(obj).length; i++){
      let key = Object.keys(obj)[i];
      if(key==skey && obj[key][0]==svalue){
        return obj;
      }
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        stack.push(obj[key]);
      }
    }
  }
  return data;
}
