const addUserNameToBacker = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    const userName = document.querySelector(".dropdown-center");
    const containerUser = document.querySelector(".container-userName");
    containerUser.classList.remove("d-none");
    containerUser.style =
      "margin-right: 20px; display: flex; align-items: center;";
    userName.children[1].textContent = user.name;
  }
};
addUserNameToBacker();
// logout
const logoutBacker = () => {
  const buttonLogout = document.querySelector(".dropdown-menu").children[1];
  buttonLogout.addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });
};
logoutBacker();
