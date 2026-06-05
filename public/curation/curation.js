import { extract_info } from "./extract.js";
import { addToBatch } from "./safe_comments.js";

/**
* Fetches json_document and displays their contents in a table.
* @param {Path} json_document - document do fetch data from.
*/
export function displayJSON(data){
      const colorPalette = ["rgb(34, 198, 227)", "purple", "rgb(23, 124, 207)", "rgb(116, 75, 196)", "pink"];
      let colorPolicies = {"Curation": "red"};
      if(data["policies"]){
      for(let i=0; i<data["policies"].length;i++){
        colorPolicies[Object.keys(data["policies"][i])] = colorPalette[i];
      }}
      console.log(colorPolicies);
      //Get data snippet from url
      const params = new URLSearchParams(location.search);
      if(params.size > 0){
        for (const [key, value] of params) {
          console.log("search for",key, value);
          data = get_data_snippet(data, key, value);
          }
        
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
      const policyTemp = document.querySelector("#policy");
      const policyDiv = document.querySelector("#sw-policies");
      const filterTemp = document.querySelector("#filter");
      const filterDropdown = document.querySelector("#filterDropdown");
      const header = document.querySelector("#header-policies");
      header.style.display = "none";

      
      keys.forEach(element => { 
        
        // Get a something with Name as p Header
        if(element.toLowerCase().includes("name")){
          if(!Array.isArray(data[element])){
          document.getElementById("project-name").innerHTML = element.charAt(0).toUpperCase() + element.slice(1) +' <b> '+data[element]+'</b>';
      }else{
          document.getElementById("project-name").innerHTML = element.charAt(0).toUpperCase() + element.slice(1) +' <b> '+data[element][0]+'</b>';
      }
    }
        // Apply and fill in the template for Policies 
        if(element=="policies"){
          header.style.display = "block";
          data[element].forEach(pol =>{
            const policy = document.importNode(policyTemp.content, true);
            const tbodyPol = policy.querySelector("tbody"),
              polname = policy.querySelector("#policy-name"),
              polcolor = policy.querySelector("#color"),
              pconforms = policy.querySelector("#policy-conforms"); 
            const policyId = Object.keys(pol)[0];
            // console.log(policyId);
            polname.textContent = `${pol[policyId]["name"]}`;
            //const randColor = '#'+(0x1000000+Math.random()*0xffffff).toString(16).slice(1,7);
            const filter = document.importNode(filterTemp.content, true);
            const filterName = filter.querySelector("#filter-name"),
                filterId = filter.querySelector("#filter-id");
            filterName.textContent = `\u{2714} ${pol[policyId]["name"]}`; //&#10004; 
            filterId.style.background = colorPolicies[policyId];
            filterDropdown.appendChild(filter);
            polcolor.id += '_'+policyId;
            polcolor.style.background = colorPolicies[policyId];
            // console.log(colorPolicies);
            policyDiv.appendChild(policy);

            const policyReportTemp = document.querySelector("#policy-report");
            const polKeys = Object.keys(pol[policyId]);
            polKeys.forEach(report =>{
              const prow = document.importNode(policyReportTemp.content, true);
              
              const pkey = prow.querySelector("#pkey"),
                pvalue = prow.querySelector("#pvalue");
                
                if(report=="conforms"){
                  pconforms.innerText = `${pol[policyId]["name"]} ${(pol[policyId][report]) ? 'is' : 'is not'} conform.`;
                  pconforms.style.color = (pol[policyId][report]) ? 'green' : 'red';
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
          extract_info(mvalue, data[element], mtag, colorPolicies);

          tbody.appendChild(row);

        const slcomment = mvalue.querySelector("#single-line-comment"),
              slcommentPopup = mvalue.querySelector("#single-line-comment-popup");
        const input = mvalue.querySelector("#comment");
                slcomment.addEventListener('click', (event)=>{
          event.stopPropagation();
          if (event.target !== slcomment) {
              return;
          }
          slcommentPopup.style.visibility = "visible";
        })
        mvalue.querySelector('input[type="submit"]').addEventListener("click", () => {
            addToBatch(element, data[element], input.value);
            slcommentPopup.style.visibility = "hidden";
          });

        document.addEventListener('click', function(e) {
          if ( slcommentPopup.style.visibility === "visible"  && !slcommentPopup.contains(e.target) ) {
              slcommentPopup.style.visibility = "hidden";
          }
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
      if(!Array.isArray(obj[key])){
      if(key==skey && obj[key]==svalue){
        return obj;
      }
      }else{
        if(key==skey && obj[key][0]==svalue){
        return obj;
      }
      }
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        stack.push(obj[key]);
      }
    }
  }
  return data;
}
