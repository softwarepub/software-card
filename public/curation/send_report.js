import { retrieveComment, retrievePipeline } from "../modules/storage.js";
import * as User from "/modules/user.js"
import { Octokit } from "https://esm.sh/@octokit/rest";


const report = document.getElementById("sendReport");
report.addEventListener("click", sendReport);
async function sendReport(){
  var message = "In [Software-CaRD](https://software-metadata.pub/software-card/) the following notes were added.\n";
  var comment = await retrieveComment();
  while (comment !== null) {

        message += `
### ${comment.value}

${comment.comment}
<table><tr>
<td>${comment.value}</td><td>${JSON.stringify(comment.data)}</td>
</tr></table>

`;

        comment = await retrieveComment();
    }
  
  console.log(message);


  const token = localStorage.getItem("gitlab-api-token");
  const username = User.getUsername();
  const platform = User.getGitPlatform(); 
  console.log(platform);
  const projectId = localStorage.getItem("repo");
  if(platform.host == "github"){
    issueGithub(token, username, message);
  }else{
    issueGitlab(platform, token, projectId, message);
  }
}

async function issueGitlab(platform, token, projectId, message){
    console.log(platform.apiUrl); 
const response = await fetch(
        `${platform.apiUrl}/projects/${projectId}/issues`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "PRIVATE-TOKEN": token
            },
            body: JSON.stringify({
                title: "Software CaRD Report",
                description: message
            })
        }
    );

    const data = await response.json();
    alert("Send to GitLab");

}
async function issueGithub(token, username, message){
    const owner = localStorage.getItem("owner");
    const repo = localStorage.getItem("repo");
    //TODO Test for Github
const octokit = new Octokit({
    auth: token
  })

try{
        await octokit.request(`POST /repos/${owner}/${repo}/issues`, {
        owner: `${owner}`,
        repo: `${repo}`,
        title: `Curation Report`,
        body: message,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
      alert("Send to GitHub");
    }catch(error){
        if (error.response) {
            console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`)
          }
          console.error(error)
          document.body.innerHTML = `<h1>Oooopsie</h1><div class="main"><p>Your Report could not get sended to GitHub! Consider sending this: </p><p style="color:blue">${message}<p> another way.</p>
          <p>Error message: ${error}</p>
          <a id="for" href="../"><i class="arrow left"></i>Back to Dashboard</a>
          </div>`;
    }
}