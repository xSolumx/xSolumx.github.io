$(document).ready(function () {
  // Retrieve dark mode preference from local storage
  var darkMode = localStorage.getItem("darkMode");

  // Apply dark mode classes to elements if preference exists
  if (darkMode === "true") {
    $("body").addClass("dark-mode");
    $(".card").addClass("dark-mode");
    $(".btn").addClass("btn-dark-mode btn-dark");
    $(".navbar").addClass("navbar-dark bg-dark");
    $(".m").addClass("m-dark");
    $("#dark-mode-toggle").text("Light Mode");
  }

  // Toggle classes and save the preference to local storage
  $("#dark-mode-toggle").click(function () {
    var $btn = $(this);
    var isDarkMode = $("body").hasClass("dark-mode");
    $("body").toggleClass("dark-mode");
    $(".card").toggleClass("dark-mode");
    $(".btn").toggleClass("btn-dark-mode btn-dark");
    $(".navbar").toggleClass("navbar-dark bg-dark");
    $(".m").toggleClass("m-dark");
    $btn.text(isDarkMode ? "Dark Mode" : "Light Mode");
    localStorage.setItem("darkMode", $("body").hasClass("dark-mode"));
  });

  const mA = document.querySelectorAll('.m');

  mA.forEach(mEl => {
    mEl.addEventListener('mousemove', e => {
      const { left, top, width, height } = mEl.getBoundingClientRect();
      const x = e.clientX - left - width / 2;
      const y = e.clientY - top - height / 2;
      mEl.style.transform = `translate(${x}px, ${y}px)`;
    });
  
    mEl.addEventListener('mouseleave', () => {
      mEl.style.transform = 'smooth';
      mEl.style.transform = 'translate(0, 0)';
    });
  });
});
