// move to profile
const moveToProfile = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  if (user.role === "backer") {
    const buttonBacker = document.querySelector(".dropdown-menu").children[0];
    // console.log(buttonBacker);
    buttonBacker.addEventListener("click", () => {
      window.location.href = "backer.html";
    });
  } else {
    if (
      !window.location.href.includes("login.html") &&
      !window.location.href.includes("signup.html")
    ) {
      const buttonBacker = document.querySelector(".dropdown-menu").children[0]; 
      buttonBacker.addEventListener("click", () => {
        window.location.href = "campaigner.html";
      });
    }
  }
};

moveToProfile();

// logout
const logout = () => {
  const buttonLogout = document.querySelector(".dropdown-menu").children[1];
  console.log(buttonLogout);
  buttonLogout.addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });
};

// add user name
const addUserName = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    const userName = document.querySelector(".dropdown-center");
    const imageUser = document.querySelector(".register-login img");
    const containerUser = document.querySelector(".container-userName");
    containerUser.classList.remove("d-none");
    containerUser.style =
      "margin-right: 20px; display: flex; align-items: center;";
    userName.children[1].textContent = user.name;
  }
};
addUserName();

// send data to json

const sendDataTojson = (formData) => {
  fetch("http://localhost:3000/campaigns", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      window.location.href = "campaigner.html";
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("حدث خطاء اثناء تحديث البيانات.");
    });
};

const sendForm = document.querySelector(".form-send");
console.log(sendForm);
sendForm.addEventListener("submit", (e) => {
  console.log("done");
  e.preventDefault();
  const formData = {
    title: document.querySelector("#title").value,
    creatorId: JSON.parse(localStorage.getItem("user")).id,
    goal: document.querySelector("#goal").value,
    rewardTitle: document.querySelector("#rewardTitle").value,
    rewardAmount: document.querySelector("#rewardAmount").value,
    campaignImage: document.querySelector("#formFile").value,
    isApproved: false,
  };
  sendDataTojson(formData);
});
