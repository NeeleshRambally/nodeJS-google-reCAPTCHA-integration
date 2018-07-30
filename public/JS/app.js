console.log("JS Scripts READY")
function sendSomeDataToServer(){
  var email=document.getElementById('inputEmail').value;
  var password=document.getElementById('inputPassword').value;
  var reCAPTCHA_KEY=document.getElementById("g-recaptcha-response").value;
  if(reCAPTCHA_KEY==='' || reCAPTCHA_KEY===null){
    document.getElementById('msg').innerHTML='<div style="color: red">Please click on captcha to continue</div>'
  }else{
    //Sending Request to server
      var loginform = new FormData();
      loginform.append('email', email);
      loginform.append('password', password);//Not hashed for simplicity
      loginform.append('key', reCAPTCHA_KEY);
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/reCAPTCHA-Check',
          true);
      xhr.onload = function (oEvent) {
        var myArr = JSON.parse(this.responseText);
        if (xhr.status == 200) {
          document.getElementById('msg').innerHTML='<div style="color: darkgreen">Successfull</divs>'
        } else {
          document.getElementById('msg').innerHTML='<div style="color: red">User Not Verified</div>'
        }
      };
      xhr.send(loginform);
  }
}