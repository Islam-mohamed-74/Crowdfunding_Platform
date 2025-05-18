// user name

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

// get data from local storage
const getDataFromLocalStorage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const name = document.querySelector("#floatingInput");
  const email = document.querySelector("#floatingEmail");
  const password = document.querySelector("#floatingpassword");
  if (user) {
    name.value = user.name;
    email.value = user.email;
    password.value = user.password;
  }
};

getDataFromLocalStorage();

// update data in local storage

const userInfo = document.querySelector(".user-info");

userInfo.addEventListener("submit", (event) => {
  event.preventDefault();
  const isValid = validateForm();
  if (isValid) {
    updateDataInLocalStorage();
    updateDataToJson();
  }
});

const updateDataInLocalStorage = () => {
  const name = document.querySelector("#floatingInput").value;
  const password = document.querySelector("#floatingpassword").value;
  let user = JSON.parse(localStorage.getItem("user")) || {
    name: "",
    password: "",
  }; // تعامل مع null
  user.name = name;
  user.password = password;
  localStorage.setItem("user", JSON.stringify(user));
  console.log("تم تحديث البيانات بنجاح");
};

// password validation
const validateForm = () => {
  const name = document.querySelector("#floatingInput");
  const password = document.querySelector("#floatingpassword");
  const message = document.getElementById("massage"); // تصحيح الـ id
  const passwordValue = password.value;
  const nameMessage = document.getElementById("massageName");
  let isValid = true;

  // التحقق من الـ name
  if (name.value.length < 3) {
    nameMessage.textContent = "يجب أن يكون الاسم 3 حروف على الأقل";
    nameMessage.style.color = "red";
    nameMessage.style.display = "block";
    isValid = false;
  } else {
    nameMessage.textContent = "تم التحقق";
    nameMessage.style.color = "green";
    nameMessage.style.display = "block";
    setTimeout(() => (nameMessage.style.display = "none"), 2000);
  }
  if (passwordValue.length < 6) {
    message.textContent = "يجب أن تكون كلمة المرور أكثر من 6 حروف";
    message.style.color = "red";
    message.style.display = "block";
  } else {
    message.textContent = "تم التغيير بنجاح"; // تصحيح textContent
    message.style.color = "green";
    message.style.display = "block";
    // إخفاء الرسالة بعد 2 ثانية
    setTimeout(() => {
      message.style.display = "none";
    }, 2000);
  }

  return isValid;
};

// password validation onchange

document.querySelector("#floatingpassword").addEventListener("input", () => {
  const password = document.querySelector("#floatingpassword");
  const message = document.getElementById("massage");
  const passwordValue = password.value;
  if (passwordValue.length < 6) {
    message.textContent = "يجب أن تكون كلمة المرور أكثر من 6 حروف";
    message.style.color = "red";
    message.style.display = "block";
  } else {
    message.textContent = " تم التحقق "; //
    message.style.color = "green";
    message.style.display = "block";
  }
});
// name validation onchange
document.querySelector("#floatingInput").addEventListener("input", () => {
  const name = document.querySelector("#floatingInput");
  const nameMessage = document.getElementById("massageName");
  if (name.value.length < 3) {
    nameMessage.textContent = "يجب أن يكون الاسم 3 حروف على الأقل";
    nameMessage.style.color = "red";
    nameMessage.style.display = "block";
  } else {
    nameMessage.textContent = "تم التحقق";
    nameMessage.style.color = "green";
    nameMessage.style.display = "block";
  }
});

// update data on json server
const updateDataToJson = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;
  fetch(`http://localhost:3000/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      console.log("تم تحديث البيانات في السيرفر بنجاح");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("حدث خطاء اثناء تحديث البيانات.");
    });
};

// logout function
const logout = () => {
  const buttonLogout = document.querySelector(".dropdown-menu").children[1];
  console.log(buttonLogout);
  buttonLogout.addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });
};

logout();

// move to profile

const moveToProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user.role === "backer") {
    const buttonBacker = document.querySelector(".dropdown-menu").children[0];
    // console.log(buttonBacker);
    buttonBacker.addEventListener("click", () => {
      window.location.href = "backer.html";
    });
  } else {
    const buttonBacker = document.querySelector(".dropdown-menu").children[0];
    console.log(buttonBacker);
    buttonBacker.addEventListener("click", () => {
      window.location.href = "campaigner.html";
    });
  }
};

moveToProfile();
