import { extract_info } from "./extract.js";

/**
* Fetches json_document and displays their contents in a table.
* @param {Path} json_document - document do fetch data from.
*/
export function displayJSON(json_document){
  fetch(json_document)
  .then(response => response.json())
  .then(data => {
      //Get data snippet from url
      const params = new URLSearchParams(location.search);
      if(params.has("id")){
        const id = params.get("id")
        data = get_data_snippet(data, "@id", id);

        //If your seeing a data snippet, create button to go back
        const back = document.createElement("button");
        back.innerText = "Back to Overview";
        back.onclick = () => {window.location = window.location.href.split('?')[0];}
        document.body.appendChild(back);
      }
      
      // Apply and fill in the template for Metadata
      const keys = Object.keys(data);

      const metadateTemp = document.querySelector("#metadate");
      const tbody = document.querySelector("#metadata");
      const policyTemp = document.querySelector("#policy"),
          policyDiv =  document.querySelector("#sw-policies");
      

      const header = document.querySelector("#header-policies");
      header.style.display = "none";

      
      keys.forEach(element => { 
        // Get a something with Name as p Header
        if(element.toLowerCase().includes("name")){
          document.getElementById("project-name").innerHTML = element.charAt(0).toUpperCase() + element.slice(1) +' <b> '+data[element][0]+'</b>';
        }
        // Apply and fill in the template for Policies 
        if(element=="policies"){
          header.style.display = "block";
          data[element].forEach(pol =>{
            const policy = document.importNode(policyTemp.content, true);
            const tbodyPol = policy.querySelector("tbody"),
              polname = policy.querySelector("#policy-name"),
              pconforms = policy.querySelector("#policy-conforms"); 
            const policyId = Object.keys(pol)[0];
            polname.textContent = `${policyId}`;
            policyDiv.appendChild(policy);
            const policyReportTemp = document.querySelector("#policy-report");
            const polKeys = Object.keys(pol[policyId]);
            polKeys.forEach(report =>{
              const prow = document.importNode(policyReportTemp.content, true);
              
              const pkey = prow.querySelector("#pkey"),
                pvalue = prow.querySelector("#pvalue");
                
                if(report=="conforms"){
                  pconforms.innerText = `${policyId} ${(pol[policyId][report]) ? 'is' : 'is not'} conform.`;
                  pconforms.style.color = (pol[policyId][report]) ? 'black' : 'red';
                }
                pkey.textContent = `${report}`;
                extract_info(pvalue, pol[policyId][report]);

                tbodyPol.appendChild(prow);
            })
          })

          return;
        }  
        
        // Apply and fill in the template for Metadata 
        const row = document.importNode(metadateTemp.content, true);
        const mkey = row.querySelector("#key"),
          mvalue = row.querySelector("#value"),
          mtag = row.querySelector("#tag");

          mkey.textContent = `${element}`;
          extract_info(mvalue, data[element], mtag);

          tbody.appendChild(row);
      })
  })
  //Extend Checkbox for metadata source
    const checkbox = document.querySelector("#extended");
checkbox.addEventListener('change', (event)=>{
  if(checkbox.checked){
  document.getElementById("col2").style.visibility = "";
}else{
  document.getElementById("col2").style.visibility = "collapse";
}

})


}

/**
* Function to get a smaller object from the orginal object.
* searches through data till skey and svalue match and return the data from this point.
* @param {Dictonary} data - Object(dict) to search from
* @param {string} skey - search key for key-value pair to get data from
* @param {} svalue - search value for key-value pair to get data from
*/ 
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
