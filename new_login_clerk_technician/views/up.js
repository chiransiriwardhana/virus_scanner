/*var table="";
var rows=2;
var cols=2;

for(var r=0; r<rows;r++)
{
  table+='<tr>';
  for var(c=1;c<=cols;c++)
  {
    table+='<td>'+c+'</td>';
  }

  table+='</tr>';
}
document.write('<table>'+table+'</table>');
*/

let sortDirection = false;

let personData = [
  { report: "ecg  report" },
  { report: "X-ray report" }

];

window.onload = () => {
  loadTableData(personData);
};

function loadTableData(personData) {
  const tableBody = document.getElementById("tableData");
  let dataHtml = '';
  for (let person of personData) {
    dataHtml += `<tr><td width="10%">
    <img src="upload.png" style="  width:16px;
          height:16px;
          float:left;margin-left:40px  "></td><td width="90%"><font color="white">${person.report}</font></td></tr>`
  }
  //console.log(dataHtml)
  tableBody.innerHTML = dataHtml;
}


var dropFileForm = document.getElementById("dropFileForm");
var fileLabelText = document.getElementById("fileLabelText");
var uploadStatus = document.getElementById("uploadStatus");
var fileInput = document.getElementById("fileInput");
var droppedFiles;

function overrideDefault(event) {
  event.preventDefault();
  event.stopPropagation();
}

function fileHover() {
  dropFileForm.classList.add("fileHover");
}

function fileHoverEnd() {
  dropFileForm.classList.remove("fileHover");
}

function addFiles(event) {
  uploadedFile = event.target.files || event.dataTransfer.files;
  showFiles(uploadedFile);
}

function showFiles(files) {
  if (files.length > 1) {
    fileLabelText.innerText = files.length + " files selected";
  } else {
    fileLabelText.innerText = files[0].name;
  }
}




$('#submitForm').submit(function (e) {
  e.preventDefault();
  $.ajax({
    url: '/data',
    type: 'post',
    data: $('#submitForm').serialize(),
    success: function (res) {
      alert(res.tech_name)

    }

  })

})