const clothes = document.querySelectorAll(".cloth");

console.log("hi", clothes);

function chooseApparel(username){
  clothes.forEach(function(cloth){
    cloth.style.border = "solid 2px red";    
    cloth.addEventListener("click", callDeleteApparel(username));
  });
}

function callDeleteApparel(username){  
  return function (){
    deleteApparel(username, this);
  }
}

function deleteApparel(username, cloth){
  clothes.forEach(function(cloth) {
    cloth.style.border = "solid 2px #fff6f8";
    cloth.removeEventListener("click", callDeleteApparel(username));
  });
  const clothToDelete = cloth;
  var clothPath = clothToDelete.getAttribute("data-path");
  var prom = fetch("/wardrobe/delete"+'/'+username+'/'+clothPath, {method:"POST"});
  
  prom.then(function(res){
        if(res.status === 200){
            location.reload();
        }
        else{
            alert("Delete Failed!")
        }   
    }); 
}