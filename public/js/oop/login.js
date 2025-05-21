// login validation

// move to profile
const moveToProfile = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  if (
    user.role === "backer" &&
    !window.location.href.includes("login.html") &&
    !window.location.href.includes("signup.html")
  ) {
    const buttonBacker = document.querySelector(".dropdown-menu").children[0];
    console.log(buttonBacker);
    buttonBacker.addEventListener("click", () => {
      window.location.href = "backer.html";
    });
  } else {
    if (
      !window.location.href.includes("login.html") &&
      !window.location.href.includes("signup.html")
    ) {
      const buttonBacker = document.querySelector(".dropdown-menu").children[0];
      console.log(buttonBacker);
      buttonBacker.addEventListener("click", () => {
        window.location.href = "campaign.html";
      });
    }
  }
};

moveToProfile();

// move to admi if role admin
const moveToAdmin = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  if (user.role === "admin") {
    window.location.href = "admin.html";
  }
};

const form = document.querySelector("#login");
// console.log(form);

const massege = document.getElementById("massage");

form.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();
    validateLogin();
  },
  false
);

const validateLogin = () => {
  const email = document.getElementById("floatingEmail");
  const password = document.getElementById("floatingpassword");

  fetch("http://localhost:3000/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      let user = data.find(
        (user) => user.email === email.value && user.password === password.value
      );
      if (user) {
        massege.textContent = "تم تسجيل الدخول بنجاح";
        massege.style.color = "green";
        massege.style.display = "block";
        localStorage.setItem("user", JSON.stringify(user));
        setTimeout(() => {
          window.location.href = "index.html";
          moveToAdmin();
        }, 2000);
      } else {
        massege.textContent = "البريد الكتروني او كلمة المرور غير صحيحة";
        massege.style.color = "red";
        massege.style.display = "block";
      }
    })
    .catch((error) => {
      massege.textContent = "حدث خطاء في التسجيل يرجى المحاولة";
      massege.style.color = "red";
      massege.style.display = "block";
      console.error("Error:", error);
    });
};
