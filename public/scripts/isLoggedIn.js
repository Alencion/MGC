var isLoggedIn = document.getElementById("write-btn");
function btn(){
    if(document.getElementById("loggedin")) {
        window.location.href = '../article/write';
    }
    else
        alert('Need Sign In');
};