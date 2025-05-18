const doc = {
  name: document.getElementById("floatingName"),
  campaigner: document.getElementById("floatingCampaign"),
  email: document.getElementById("floatingEmail"),
  password: document.getElementById("floatingpassword"),
  password2: document.getElementById("floatingpassword2"),
  formCheck: document.getElementById("checkDefault"),
  radioDefault1: document.getElementById("radioDefault1"),
  radioDefault2: document.getElementById("radioDefault2"),
};

(() => {
  "use strict";
  const forms = document.querySelectorAll(".needs-validation");
  Array.from(forms).forEach((form) => {
    console.log(form);
    form.addEventListener(
      "submit",
      (event) => {
        editLabel(form);

        validatePassword(doc.password, doc.password2);
        validateEmail(doc);
        validateName(doc);

        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          // catch form data
          const formData = {
            name: doc.name.value,
            campaigner: doc.campaigner.value,
            email: doc.email.value,
            password: doc.password.value,
            isActive: false,
            role: doc.radioDefault1.checked ? "campaigner" : "backer",
          };
          // send data
          sendDataToJson(formData);
        }

        event.preventDefault();
        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// email validation
const validateEmail = ({ email }) => {
  // start with a-z or A-Z and include @ and .com

  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  email.addEventListener("input", () => {
    if (!re.test(String(email.value).toLowerCase())) {
      email.setCustomValidity("بريد الكتروني غير صحيح");
    } else {
      email.setCustomValidity("");
    }
  });
};

// validate name
const validateName = ({ name }) => {
  name.addEventListener("input", () => {
    const re = /^[a-zA-Z]{2,}$/;
    if (name.value.length < 3 && !re.test(name.value)) {
      name.setCustomValidity("الاسم يجب ان يكون على الاقل 2 حروف");
    } else {
      name.setCustomValidity("");
    }
  });
};

// password validation

const validatePassword = (password, password2) => {
  password2.addEventListener("input", () => {
    if (password.value !== password2.value) {
      password2.setCustomValidity("كلمتا المرور غير متطابقتين.");
    } else {
      password2.setCustomValidity("");
    }
  });
};

// edit label css

const editLabel = (form) => {
  form.querySelectorAll("label").forEach((label) => {
    label.style.right = "24px";
    label.style.fontSize = "26px";
  });
};

// send data to json
const sendDataToJson = (formData) => {
  fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("حدث خطأ أثناء إنشاء الحساب.");
    });
};
// check before send if email is identical
const checkIdenticalEmail = () => {};

// login validation

const form = document.querySelector(".login-form");
console.log(form);

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
