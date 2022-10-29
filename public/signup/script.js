const button = document.getElementById('submit');
const msg = document.getElementById('msg');
button.addEventListener('click',()=>{
    const username  =  document.getElementById('username').value;
    const pwd = document.getElementById('password').value;
    const pwd2 = document.getElementById('repeated_password').value; 
    
    if(!(pwd === pwd2))
    msg.textContent = "Password mismatch"
    else{
      const data = {
        username : username,
        password : pwd
      };
      console.log(data);
    }
});