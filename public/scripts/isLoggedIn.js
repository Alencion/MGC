var isLoggedIn = document.getElementById("write-btn");
function btn(){
    if(document.getElementById("isNotSignedIn")) {
        alert('Need Sign In');
    }
    else{
        window.location.href = 'http://localhost:3000/article/write';
    }
}