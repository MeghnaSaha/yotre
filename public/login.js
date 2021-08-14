function showRegister(){
  document.getElementById('login').style.display='none';
  console.log(document.getElementById('login'));
  document.getElementById('register').style.display='flex';
}

function showLogin(){
  document.getElementById('login').style.display='flex';
  document.getElementById('register').style.display='none';
}
