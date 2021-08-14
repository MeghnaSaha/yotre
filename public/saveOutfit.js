const saveButton = document.getElementById("saveButton");

saveButton.addEventListener("click", saveOutfit);

function saveOutfit(username, userToHelp){
  html2canvas(document.querySelector("#dressUpArea"), { letterRendering: 1, allowTaint : true, scrollY: -window.scrollY }).then(canvas => {
    /*var formData = new FormData();
    formData.append('outfit', canvas);
    formData.append('designer', username);
    formData.append('userToHelp', userToHelp);
    console.log(formData);
    fetch('/save-outfit', {
      method: 'POST',
      body: formData
    });*/
    fetch('/save-outfit', {
      method: 'POST'
    }).then(function(res){
        if(res.status === 200){
            location.reload();
        }
        else{
            alert("Saving Failed!")
        }   
    });
    console.log('saved!')
  });
}