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
      async (event) => {
        editLabel(form);
        event.preventDefault();
        validatePassword(doc.password, doc.password2);
        validateEmail(doc);
        validateName(doc);
        await checkIdenticalEmail(doc.email);
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
          form.reportValidity(); // show errors in form  now
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

// check before send if email is use before
const checkIdenticalEmail = async (emailElement) => {
  try {
    const response = await fetch("http://localhost:3000/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.find((user) => user.email === emailElement.value)) {
      emailElement.setCustomValidity("البريد الإلكتروني مستخدم من قبل.");
    } else {
      emailElement.setCustomValidity("");
    }
  } catch (error) {
    console.error("Error: get users", error);
  }
};

// logout
const logout = () => {
  if (
    !window.location.href.includes("login.html") &&
    !window.location.href.includes("signup.html")
  ) {
    {
      const buttonLogout = document.querySelector(".dropdown-menu").children[1];
      buttonLogout.addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "login.html";
      });
    }
  }
};

logout();

// check if user is logged in
const checkLoggedIn = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    const registerLogin = (document.querySelector(
      ".register-login"
    ).children[0].style.display = "none");
    const createAcount = (document.querySelector(
      ".register-login"
    ).children[1].style.display = "none");
  }
};
checkLoggedIn();

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
      console.log(buttonBacker);
      buttonBacker.addEventListener("click", () => {
        window.location.href = "campaigner.html";
      });
    }
  }
};

moveToProfile();

// create campaign in html

const getDataCampain = () => {
  fetch("http://localhost:3000/campaigns", {
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
      console.log("Success:", data);
      createCrud(data);
    })
    .catch((error) => {
      console.error("not response:", error);
    });
};

getDataCampain();

const createCrud = (data) => {
  const cardContainer = document.querySelector(".container-crud");
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(data.length && cardContainer.innerHTML);

  if (data.length) {
    //       "<p class='text-center fs-4 fw-bold text-danger '> لا يوجد بيانات ليتم عرضها    </p>")
    //   :
    const result = data.filter((e) => e.isApproved === true);
    console.log(result.length);

    result.length === 0
      ? (cardContainer.innerHTML = `<p class='text-center fs-4 fw-bold text-danger '> لا يوجد بيانات ليتم عرضها    </p>`)
      : result.forEach((element) => {
          console.log(element);
          cardContainer.innerHTML +=
            `
          <div class="col-12 col-md-5 col-lg-4 ">
            <div class="card border-0 rounded-2 shadow-lg rounded">
              <div class="img-card bg-secondary position-relative rounded-top" style="height: 200px;">
                <img
                  src="../assets/images/patenr-1.webp"
    
                  class="w-100 rounded-top h-100"
                />
                <span
                  class="campaign_card_overlay campaign-heart position-absolute"
                >
                  <i class="fa-regular fa-heart text-primary fs-4"></i>
                </span>
                <span
                  class="campaign_card_overlay position-absolute bottom-0 start-0 px-3 py-1 bg-primary text-white fs-4 rounded"
                >
                  التعليم والتدريب</span
                >
              </div>
              <div class="card-body text-center">
                <h4 class="product__title text-primary">
                      ` +
            user.campaigner +
            `
                </h4>
                <h3 class="text-secondary fw-bold">
                ` +
            element.title +
            `
                </h3>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="px-4 border-start mt-3">
                    <p class="m-0">200</p>
                    <h5>متبرعين</h5>
                  </div>
                  <div class="country-flag">
                    <span class="fs-5"> فلسطين </span>
                    <img src="./assets/images/ps.svg" width="80" alt="فلسطين" />
                  </div>
                </div>
                <div class="process-campaign my-4">
                  <div class="percent text-primary text-start">25%</div>
                  <div class="line-process">
                    <div class="process rounded-start-2"></div>
                  </div>
                </div>
                <div
                  class="d-flex justify-content-between align-items-center mt-3"
                >
                  <div class="px-2 border-start mt-3">
                    <h5>قيمة المشروع</h5>
                    <p class="m-0 fw-semibold">` +
            element.goal +
            `</p>
                    <span class="fs-6 fw-semibold">$</span>
                  </div>
                  <div class="px-2 border-start mt-3">
                    <h5>الدعم</h5>
                    <p class="m-0 fw-semibold">0</p>
                    <span class="fs-6 fw-semibold">$</span>
                  </div>
                  <div class="px-2 mt-3">
                    <h5>المتبقى</h5>
                    <p class="m-0 fw-semibold">36400</p>
                    <span class="fs-6 fw-semibold">$</span>
                  </div>
                </div>
                <a
                  href="#"
                  class="btn bg-primary btn-campaign my-4 px-4 rounded-pill text-light fs-4 fw-semibold"
                >
                  ادعم الآن
                </a>
              </div>
            </div>
          </div>
    `;
        });
  }
};
