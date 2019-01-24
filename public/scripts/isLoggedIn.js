var isLoggedIn = document.getElementById("write-btn");
function btn(){
    if(document.getElementById("loggedin")) {
        window.location.href = 'http://localhost:3000/article/write';
    }
    else
        alert('Need Sign In');
};