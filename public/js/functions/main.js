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

const createCrud = async (data) => {
  const cardContainer = document.querySelector(".container-crud");
  if (data.length) {
    const campaignAprroved = data.filter((e) => e.isApproved === true);

    // جلب الـ pledges من الـ API
    const pledgesResponse = await fetch("http://localhost:3000/pledges", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const pledges = await pledgesResponse.json();

    // يجيب الداتا بتاعت الويزر كلهم عشان اقدر احط اسم الؤسسه اللي انشات حمله

    const usersResponse = await fetch("http://localhost:3000/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const users = await usersResponse.json();

    if (campaignAprroved.length === 0) {
      cardContainer.innerHTML = `<p class='text-center fs-4 fw-bold text-danger'> لا يوجد بيانات ليتم عرضها </p>`;
    } else {
      cardContainer.innerHTML = "";
      campaignAprroved.forEach((element) => {
        // كل حمله ليها عدد بليدج دي بتعمل فلتر لكل البليدج اللي عملو دعم للحمله
        const campaignPledges = pledges.filter(
          (p) => p.campaignId === element.id
        );
        console.log(campaignPledges);

        // دي عشان تجيب المبلغ المتبقي
        const totalPledge = campaignPledges.reduce(
          (sum, p) => sum + p.amount,
          0
        );
        const remaining = element.goal - totalPledge;

        console.log(totalPledge);

        // دي بتجيب المستخدمين اللي عملو دعم للحمله دي
        // نيو سيت عشان تمنع ان اليوزر يتكرر
        const uniqueDonors = [...new Set(campaignPledges.map((p) => p.userId))]
          .length;
        // فحص إذا كانت الحملة اكتملت
        const isCampaignComplete = totalPledge >= element.goal;

        // اسم المؤسسه اللي انشأت الكارد
        const campaignCreator = users.find((u) => u.id === element.creatorId);
        console.log(campaignCreator);

        const campaignCreatorName = campaignCreator
          ? campaignCreator.campaigner
          : "Unknown Creator";

        cardContainer.innerHTML += `
          <div class="cards col-12 col-md-5 col-lg-4">
            <div class="card border-0 rounded-2 shadow-lg rounded">
              <div class="img-card bg-secondary position-relative rounded-top" style="height: 200px;">
                <img src="${
                  element.campaignImage
                }" class="w-100 rounded-top h-100" />
                <span class="campaign_card_overlay campaign-heart position-absolute">
                  <i class="fa-regular fa-heart text-primary fs-4"></i>
                </span>
                <span class="campaign_card_overlay position-absolute bottom-0 start-0 px-3 py-1 bg-primary text-white fs-4 rounded">
                  ${element.category}
                </span>
              </div>
              <div class="card-body text-center">
                <h4 class="fw-bold fs-2 product__title text-primary"> ${campaignCreatorName}</h4>
                <h3 class="text-secondary fw-bold">${element.title}</h3>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="px-4 border-start mt-3">
                    <p class="m-0 donors-count">${uniqueDonors}</p>
                    <h5>متبرعين</h5>
                  </div>
                  <div class="country-flag">
                    <span class="fs-5">${element.country}</span>
                    <img src="${
                      element.country === "فلسطين"
                        ? "https://openclipart.org/image/800px/331171"
                        : element.country === "السعوديه"
                        ? "https://upload.wikimedia.org/wikipedia/commons/0/0d/Flag_of_Saudi_Arabia.svg"
                        : "https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Egypt.svg"
                    }" width="100" alt="${element.country}" />
                  </div>
                </div>
                <div class="process-campaign my-4">
                  <div class="percent text-primary text-start">${Math.round(
                    (totalPledge / element.goal) * 100
                  )}%</div>
                  <div class="line-process">
                    <div class="process rounded-start-2" style="width: ${
                      (totalPledge / element.goal) * 100
                    }%"></div>
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-3">
                  <div class="px-2 border-start mt-3">
                    <h5>قيمة المشروع</h5>
                    <p class="goal m-0 fw-semibold">${element.goal}</p>
                    <span class="fs-6 fw-semibold">$</span>
                  </div>
                  <div class="px-2 border-start mt-3">
                    <h5>الدعم</h5>
                    <p class="pledge m-0 fw-semibold">${totalPledge}</p>
                    <span class="fs-6 fw-semibold">$</span>
                  </div>
                  <div class="px-2 mt-3">
                    <h5>المتبقى</h5>
                    <p class="leftPledge m-0 fw-semibold">${
                      remaining > 0 ? remaining : 0
                    }</p>
                    <span class="fs-6 fw-semibold">$</span>
                  </div>
                </div>
                <button
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#supportModal"
                  data-id="${element.id}"
                  class="btn bg-primary btn-campaign my-4 px-4 rounded-pill text-light fs-4 fw-semibold support-btn"
                  ${isCampaignComplete ? "disabled" : ""}
                >
                   ${isCampaignComplete ? " الحمله مكتمله " : "ادعم الان"}
                </button>
              </div>
            </div>
          </div>`;
      });
    }
  } else {
    cardContainer.innerHTML = `<p class='text-center fs-4 fw-bold text-danger'> لا يوجد بيانات ليتم عرضها </p>`;
  }
};

let currentCampaignId = null;

// التقاط data-id عند الضغط على زر "ادعم الآن"
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("support-btn")) {
    currentCampaignId = e.target.getAttribute("data-id");
    console.log("Current Campaign ID:", currentCampaignId); // للتصحيح
  }
});

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("confirmSupport")
    .addEventListener("click", async function () {
      const amount = parseFloat(document.getElementById("supportAmount").value);
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user && user.role !== "backer") {
        alert(" الدعم خاص بالمستخدمين المسجلين كداعمين فقط!");
        return;
      }

      // if (!currentCampaignId) {
      //   alert("لم يتم تحديد حملة! حاول مرة أخرى.");
      //   console.error("currentCampaignId is null");
      //   return;
      // }

      if (isNaN(amount) || amount <= 0) {
        alert("من فضلك أدخل مبلغ صالح");
        return;
      }

      const pledgesResponse = await fetch("http://localhost:3000/pledges", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const pledges = await pledgesResponse.json();

      const campaignsResponse = await fetch("http://localhost:3000/campaigns", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const campaigns = await campaignsResponse.json();
      const currentCampaign = campaigns.find(
        (c) => String(c.id) === String(currentCampaignId)
      );

      // if (!currentCampaign) {
      //   alert("الحملة غير موجودة!");
      //   return;
      // }

      // حساب إجمالي الدعم الحالي والمتبقي
      const campaignPledges = pledges.filter(
        (p) => String(p.campaignId) === String(currentCampaignId)
      );
      const totalPledge = campaignPledges.reduce((sum, p) => sum + p.amount, 0);
      const remaining = currentCampaign.goal - totalPledge;

      // التحقق من أن المبلغ لا يتجاوز المتبقي
      if (amount > remaining) {
        alert(`لا يمكنك دعم أكثر من ${remaining} دولار المتبقية!`);
        return;
      }

      // بتاكد من وجود دعم من نفس المستخدم لهذه الحملة
      const existingPledge = pledges.find(
        (p) =>
          String(p.campaignId) === String(currentCampaignId) &&
          String(p.userId) === String(user.id)
      );
      // الفاريبول دا عشان اتحكم في عدد الداعمين

      let isNewDonor = false;

      if (existingPledge) {
        // تحديث الـ pledge القديم
        const updatedPledge = {
          ...existingPledge,
          amount: existingPledge.amount + amount, // إضافة المبلغ الجديد
        };

        await fetch(`http://localhost:3000/pledges/${existingPledge.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPledge),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("فشل في تحديث الدعم");
            }
            return response.json();
          })
          .then(() => {
            // تحديث الـ UI
            updateUI(amount, isNewDonor);
          })
          .catch((error) => {
            console.error("Error updating pledge:", error);
            alert("حدث خطأ أثناء تحديث الدعم.");
          });
      } else {
        // إنشاء بليدج جديد
        const newPledge = {
          campaignId: currentCampaignId,
          userId: user.id,
          amount: amount,
        };

        await fetch("http://localhost:3000/pledges", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPledge),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("فشل في تسجيل الدعم");
            }
            return response.json();
          })
          .then(() => {
            isNewDonor = true;
            // تحديث الـ UI
            updateUI(amount, isNewDonor);
          })
          .catch((error) => {
            console.error("Error saving pledge:", error);
            alert("حدث خطأ أثناء تسجيل الدعم.");
          });
      }

      // دالة لتحديث الـ UI
      function updateUI(amount, isNewDonor) {
        const allCards = document.querySelectorAll(".cards");
        allCards.forEach((card) => {
          const button = card.querySelector(".support-btn");
          if (
            String(button.getAttribute("data-id")) === String(currentCampaignId)
          ) {
            const supportEl = card.querySelector(".card-body .pledge");
            const donorsEl = card.querySelector(".card-body .donors-count");
            const goalEl = card.querySelector(".card-body .goal");
            const leftEl = card.querySelector(".card-body .leftPledge");
            const percentEl = card.querySelector(".card-body .percent");
            const processEl = card.querySelector(".card-body .process");

            const oldAmount = parseFloat(supportEl.textContent) || 0;
            const oldDonors = parseInt(donorsEl.textContent) || 0;
            const goal = parseFloat(goalEl.textContent);
            const newTotal = oldAmount + amount;
            const newRemaining = goal - newTotal;

            supportEl.textContent = newTotal;
            donorsEl.textContent = isNewDonor ? oldDonors + 1 : oldDonors; // زيادة عدد الداعمين فقط لو يوزر جديد
            leftEl.textContent = newRemaining > 0 ? newRemaining : 0;
            percentEl.textContent = `${Math.round((newTotal / goal) * 100)}%`;
            processEl.style.width = `${(newTotal / goal) * 100}%`;

            if (newTotal >= goal) {
              button.disabled = true;
              button.textContent = "الحملة مكتملة";
            }
          }
        });

        // إغلاق المودال
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("supportModal")
        );
        modal.hide();
      }
    });
});
