function openWardrobe() {
  document.getElementById("wardrobe").style.marginLeft = "0";
  document.getElementById("activityArea").style.marginLeft = "500px";
  document.getElementById("activityArea").style.paddingLeft = "50px";
  document.body.style.backgroundColor = "rgba(0,0,0,0.05)";
}

function closeWardrobe() {
  document.getElementById("wardrobe").style.marginLeft = "-500px";
  document.getElementById("activityArea").style.marginLeft = "0";
  document.getElementById("activityArea").style.paddingLeft = "250px";
  document.body.style.backgroundColor = "#fff";
}
