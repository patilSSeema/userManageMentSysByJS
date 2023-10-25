const screenWidth = window.innerWidth;

const col1 = document.getElementById("col1");
const col2 = document.getElementById("userDetail");

if (screenWidth <= 599) {
  col1.classList.add("order-last");
  col2.classList.add("order-first");
  col2.classList.add("position");
}
