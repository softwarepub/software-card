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
      
      const keys = Object.keys(data);

      const metadateTemp = document.querySelector("#metadate");
      const tbody = document.querySelector("#metadata");
      const policyTemp = document.querySelector("#policy"),
          policyDiv =  document.querySelector("#sw-policies");
      

      const header = document.querySelector("#header-policies");
      header.style.display = "none";

      keys.forEach(element => { 
        if(element.toLowerCase().includes("name")){
          console.log(element);
          document.getElementById("project-name").innerHTML = element.charAt(0).toUpperCase() + element.slice(1) +' <b> '+data[element][0]+'</b>';
        }
        if(element=="policies"){
          header.style.display = "block";
          console.log("policies");
          data[element].forEach(pol =>{
            console.log(pol);
            const policy = document.importNode(policyTemp.content, true);
            console.log(policy);
            const tbodyPol = policy.querySelector("tbody"),
              polname = policy.querySelector("#policy-name");
            const policyId = Object.keys(pol)[0];
            polname.textContent = `${policyId}`;
            policyDiv.appendChild(policy);
            const policyReportTemp = document.querySelector("#policy-report");
            const polKeys = Object.keys(pol[policyId]);
            console.log(polKeys);
            polKeys.forEach(report =>{
              console.log(report);
              const prow = document.importNode(policyReportTemp.content, true);
              
              const pkey = prow.querySelector("#pkey"),
                pvalue = prow.querySelector("#pvalue");
                //pconforms = prow.querySelector("#policy-conforms"); 
                if(report=="conforms"){
                  console.log("conforms");
                }
                console.log(report,pol[policyId][report]);
                pkey.textContent = `${report}`;
                extract_info(pvalue, pol[policyId][report]);
                //pvalue.textContent = `${pol[policyId][report]}`;
                tbodyPol.appendChild(prow);
            })
          })

          return;
        }   
        const row = document.importNode(metadateTemp.content, true);
        console.log(row);
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
