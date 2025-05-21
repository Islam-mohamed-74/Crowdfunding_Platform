const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

const btnSidebar = document.getElementById("btnSidebar");
const sidebar = document.getElementById("sidebar");
const contentPage = document.querySelector(".content-page");
const brandLogo = document.querySelector("#brand-header");
const brandLogo2 = document.querySelector("#brand-sidebar");

tabButtons.forEach((button) => {
  button.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    tabButtons.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
    tabContents.forEach((content) => content.classList.remove("active"));
    const targetId = this.id.replace("-tab", "-section");
    document.getElementById(targetId).classList.add("active");
  });
});

// التحكم في الـ Sidebar
(function () {
  btnSidebar.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    sidebar.classList.toggle("show");
    console.log("btn clicked");

    if (sidebar.classList.contains("show")) {
      brandLogo.classList.add("d-none");
    } else {
      brandLogo.style.display = "flex";
    }
  });
  brandLogo2.addEventListener("click", function () {
    sidebar.classList.toggle("show");
    brandLogo.classList.remove("d-none");
    brandLogo.classList.add("d-flex");
  });
})();
