let xhr;
let active_users;
let members;
if (window.ActiveXObject) xhr = new ActiveXObject("Microsoft.XMLHTTP");
else if (window.XMLHttpRequest) xhr = new XMLHttpRequest();
else throw new Error("Ajax not supported");

xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
        let json = JSON.parse(this.responseText);
        active_users.innerHTML = json.active_users;
        members.innerHTML = json.members;
    }
}

function addActiveUsers() {
    active_users = document.getElementById("active_users");
    members = document.getElementById("members");
    if (active_users && members) {
        xhr.open("POST", "/~pengtian/cgi-bin/tp3.cgi/active_users");
        xhr.send(null);
        setTimeout("addActiveUsers()", 2000);
    }
}

window.addEventListener("load", addActiveUsers, false);