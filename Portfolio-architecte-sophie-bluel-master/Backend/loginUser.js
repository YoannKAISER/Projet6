window.addEventListener("load", () => {
    let submit = document.getElementById("submit");
submit.addEventListener("click", function(event) { 
    let identifiants = { 
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    };
    fetch("http://localhost:5678/api/users/login", {
    method: 'POST',
    body: JSON.stringify(identifiants),
    headers: {"accept": "application/json", "Content-Type": "application/json" }
    })
    .then(function(response) { 
        if(response.ok) {
            return response.json();
        }
        else {
            throw new Error(response.statusCode);
        }
    })    
    .then(data => {
            sessionStorage.setItem("token", data.token);
            window.location.href = "index.html";
    })
    .catch(error => {
        document.getElementsByClassName("erreur")[0].style.display = "block";
        document.getElementsByTagName("input")[0].style.border = "2px solid rgb(255, 0, 0)";
        document.getElementsByTagName("input")[1].style.border = "2px solid rgb(255, 0, 0)";
    })
});
});