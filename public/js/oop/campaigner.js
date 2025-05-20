// move to profile
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
      // window.location.href = "campaigner.html";
      console.log(data.category);
      console.log(data.country);
      console.log(data.campaignImage);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("حدث خطاء اثناء تحديث البيانات.");
    });
};
// create campaign

const send = document.querySelector("#send");

document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "send") {
    const fileInput = document.getElementById("formFile");
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
          // إنشاء كانفاس لتصغير الأبعاد
          const canvas = document.createElement("canvas");

          // حجم جديد (مثلاً: 50% من الحجم الأصلي)
          const maxWidth = 100; // أو قللها أكثر حسب الحاجة
          const scaleSize = maxWidth / img.width;
          canvas.width = maxWidth;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // ضغط الصورة بالجودة (0.6 = جودة متوسطة)
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);

          const formData = {
            title: document.querySelector("#title").value,
            creatorId: JSON.parse(localStorage.getItem("user")).id,
            goal: document.querySelector("#goal").value,
            campaignImage: compressedBase64,
            country: document.querySelector("#country").value,
            category: document.querySelector("#category").value,
            isApproved: false,
          };

          sendDataTojson(formData);
        };

        img.src = event.target.result;
      };

      reader.readAsDataURL(file);
    } else {
      alert("يرجى اختيار صورة قبل الإرسال");
    }
  }
});

// get data campaign from json server and render it
const getDataCampaign = () => {
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
      // console.log("Success:", data);
      displayCampaign(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

getDataCampaign();
// display data campaign

const displayCampaign = (data) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const campaignsUser = data.filter(
    (campaign) => campaign.creatorId === user.id
  );
  // console.log(campaignsUser);
  const bodyConatiner = document.querySelector(".body-container");
  console.log(bodyConatiner);
  campaignsUser.forEach((campaign) => {
    if (user) {
      bodyConatiner.innerHTML += `
      <form class="form-edit my-5 shadow p-4 bg-body rounded-4 mt-2 w-75 mx-auto needs-validation">
         <div class="mb-3">
       <label for="title-${
         campaign.id
       }" class="form-label fs-2">عنوان المشروع</label>
      <input type="text" class="form-control" id="title-${
        campaign.id
      }" value="${campaign.title}"/>
    </div>
    <div class="mb-3">
      <label for="goal-${campaign.id}" class="form-label fs-3">الهدف</label>
      <input type="number" class="form-control" id="goal-${
        campaign.id
      }" value="${campaign.goal}"/>
    </div>

    <div class="mb-3">
      <label for="formFile-${
        campaign.id
      }" class="form-label fs-3">صورة المشروع</label>
      <input class="form-control" type="file" id="formFile-${campaign.id}"/>
    </div>
    <div class="mb-3">
      <label for="country-${campaign.id}" class="form-label fs-3"
                        >الدولة</label
                      >
      <select class="form-select fs-3" id="country-${campaign.id}">

                <option value="1" ${
                  campaign.country === "مصر" ? "selected" : ""
                }>مصر</option>
                <option value="2" ${
                  campaign.country === "السعوديه" ? "selected" : ""
                }>السعوديه</option>
                <option value="3" ${
                  campaign.country === "فلسطين" ? "selected" : ""
                }>فلسطين</option>

      </select>
    </div>
    <div class="mb-3">
    <label for="category-${campaign.id}" class="form-label fs-3">التصنيف</label>
      <select class="form-select fs-3" id="category-${campaign.id}">

                <option value="الصحه" ${
                  campaign.category === "الصحه" ? "selected" : ""
                }>الصحة</option>
                <option value="الامن الغذائي" ${
                  campaign.category === "الامن الغذائي" ? "selected" : ""
                }>الامن الغذائي</option>
                <option value="التعليم والتدريب" ${
                  campaign.category === "التعليم والتدريب" ? "selected" : ""
                }>التعليم والتدريب</option>
                <option value="التنميه المستدامه" ${
                  campaign.category === "التنميه المستدامه" ? "selected" : ""
                }>التنميه المستدامه</option>
                
      </select>
    </div>
    <button data-id="${
      campaign.id
    }" type="button" class="btn btn-primary w-25 fs-3">تعديل</button>
  </form>
`;
    }
  });
  formEdit();
};

// form-edit

const formEdit = () => {
  const formEdit = document.querySelectorAll(".form-edit");
  // console.log(formEdit);
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log(formEdit);
  formEdit.forEach((form) => {
    form.addEventListener("click", (e) => {
      e.preventDefault();
      const campaignId = form.querySelector("button").dataset.id;
      const formData = {
        title: form.querySelector(`#title-${campaignId}`).value,
        creatorId: user.id,
        goal: form.querySelector(`#goal-${campaignId}`).value,
        campaignImage: form.querySelector(`#formFile-${campaignId}`).value,
        country: form.querySelector(`#country-${campaignId}`).value,
        category: form.querySelector(`#category-${campaignId}`).value,
        isApproved: false,
      };
      updateDataInJson(formData, campaignId);
    });
  });
};
// update data in json
const updateDataInJson = (formData, id) => {
  console.log(id);
  fetch(`http://localhost:3000/campaigns/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      console.log("تم تحديث البيانات في السيرفر بنجاح");
    })
    .catch((error) => {
      console.error("Error:", error);
      console.log("حدث خطاء اثناء تحديث البيانات.");
    });
};
