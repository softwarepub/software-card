import { retrieveComment, retrievePipeline } from "../modules/storage.js";
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
<td>${comment.value}</td><td>${json.stringify(comment.data[0])}</td>
</tr></table>

`;

        comment = await retrieveComment();
    }
  
  console.log(message);


  const token = localStorage.getItem("gitlab-api-token");
  const username = localStorage.getItem("gitlab-username");
  var [projectId, pipelineId, jobId] = await retrievePipeline();
  if(token.startsWith("glpat")){
    issueGitlab(token, projectId, message);
  }else{
    issueGithub(token, username, message);
  }
}

async function issueGitlab(token, projectId, message){
const response = await fetch(
        `https://codebase.helmholtz.cloud/api/v4/projects/${projectId}/issues`,
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

}
async function issueGithub(token, username, message){
    //TODO Test for Github
const octokit = new Octokit({
    auth: token
  })

try{
        await octokit.request('POST /repos/SKernchen/SoftwareCaRD-Test/issues', {
        owner: `${username}`,
        repo: 'SoftwareCaRD-test',
        title: `Curation Report`,
        labels: ['curation'],
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