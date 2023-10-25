const searchInput = document.getElementById("searchInput");
const displayData = document.getElementById("showData");
const userDataDiv = document.getElementById("userDetail");
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");
const currentPageElement = document.getElementById("currentPage");
const paginationElement = document.getElementById("pagination");

let usersData = [];
let currentPage = 1;
const usersPerPage = 10;

function filterUsers(searchValue) {
  const filteredUsers = usersData.filter((user) => {
    const fullName = `${user.name.title} ${user.name.first} ${user.name.last}`;
    const email = user.email;
    const phone = user.phone;
    return (
      fullName.toLowerCase().includes(searchValue) ||
      email.includes(searchValue) ||
      phone.includes(searchValue)
    );
  });
  currentPage = 1;

  displayUsers(filteredUsers, currentPage);
}
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return date.toLocaleDateString("en-US", options);
}

function displayUserDetails(user) {
  userDataDiv.innerHTML = "";
  const userDataInfo = document.createElement("div");
  userDataInfo.className = "user-data-info";

  userDataInfo.innerHTML = `
  <div class="user-profile">
    <img src=${user.picture.large}>
    <p>${user.name.first} ${user.name.last}</p>
   
  </div>

  <div class="user-details">
    <p><i class="fa-regular fa-envelope"></i>  ${user.email}</p>
     <p>Gender: ${user.gender}</p>
    <p><i class="fa-solid fa-phone"></i> ${user.phone}</p>
     <p><i class="fas fa-birthday-cake"></i>  ${formatDate(user.dob.date)}</p>
    <p><i class="fa-solid fa-calendar"></i> ${formatDate(
      user.registered.date
    )}</p>
    <p><i class="fa-solid fa-house"></i> <span>${
      user.location.city
    }</span>,<span>${user.location.country}</span></p>
  </div>
`;

  userDataDiv.appendChild(userDataInfo);
}

function fetchUsers() {
  const numUsers = 100;
  const apiUrl = `https://randomuser.me/api/?results=${numUsers}&nat=US`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.results.length === 0) {
        throw new Error("No users found");
      }
      usersData = data.results;
      console.log(usersData);
      displayUsers(usersData, currentPage);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function displayUsers(users, page) {
  displayData.innerHTML = "";
  const startIndex = (page - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const usersToDisplay = users.slice(startIndex, endIndex);

  usersToDisplay.forEach((user) => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    const emailCell = document.createElement("td");
    const phoneCell = document.createElement("td");
    const thumbnailCell = document.createElement("td");
    const thumbnailImg = document.createElement("img");

    nameCell.textContent = `${user.name.title} ${user.name.first} ${user.name.last}`;
    emailCell.textContent = user.email;
    phoneCell.textContent = `${user.id.name}-${user.id.value}`;
    thumbnailImg.src = user.picture.thumbnail;

    nameCell.className = "user-name";
    emailCell.className = "user-email";
    phoneCell.className = "user-phone";
    thumbnailImg.className = "user-thumbnail";

    thumbnailCell.appendChild(thumbnailImg);
    row.appendChild(thumbnailCell);
    row.appendChild(nameCell);
    row.appendChild(emailCell);
    row.appendChild(phoneCell);

    nameCell.addEventListener("click", () => {
      const selectedUser = user;
      displayUserDetails(selectedUser);
    });

    displayData.appendChild(row);
    // currentPageElement.textContent = `Page ${page}`;
  });

  generatePaginationLinks(page, Math.ceil(usersData.length / usersPerPage));
}

searchInput.addEventListener("input", () => {
  const searchValue = searchInput.value.trim().toLowerCase();
  filterUsers(searchValue);
});

function changePage(direction) {
  if (direction === "prev" && currentPage > 1) {
    currentPage--;
  } else if (
    direction === "next" &&
    currentPage < Math.ceil(usersData.length / usersPerPage)
  ) {
    currentPage++;
  }
  displayUsers(usersData, currentPage);
}

prevPageButton.addEventListener("click", () => {
  changePage("prev");
});

nextPageButton.addEventListener("click", () => {
  changePage("next");
});

function generatePaginationLinks(currentPage, totalPages) {
  currentPageElement.innerHTML = "";

  const maxVisiblePages = 4;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = startPage + maxVisiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (startPage > 1) {
    const firstPageLink = createPageLink(1);
    currentPageElement.appendChild(firstPageLink);
    if (startPage > 2) {
      // Add "..." if there are more pages before the start page
      currentPageElement.appendChild(createEllipsis());
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageLink = createPageLink(i);
    currentPageElement.appendChild(pageLink);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      // Add "..." if there are more pages after the end page
      currentPageElement.appendChild(createEllipsis());
    }
    const lastPageLink = createPageLink(totalPages);
    currentPageElement.appendChild(lastPageLink);
  }
}

function createPageLink(page) {
  const pageLink = document.createElement("span");
  pageLink.innerHTML = `<button class="btn btn-light">
              ${page}
          </button>
  
          `;
  pageLink.addEventListener("click", () => displayUsers(usersData, page));
  if (page === currentPage) {
    pageLink.classList.add("current-page");
  }
  return pageLink;
}

function createEllipsis() {
  const ellipsis = document.createElement("span");
  ellipsis.textContent = "...";
  return ellipsis;
}

const sortSelect = document.getElementById("sortSelect");

sortSelect.addEventListener("change", () => {
  const selectedOption = sortSelect.value;
  sortUsersByName(selectedOption);
  displayUsers(usersData, currentPage);
});

function sortUsersByName(direction) {
  usersData.sort((a, b) => {
    const nameA = `${a.name.title} ${a.name.first} ${a.name.last}`;
    const nameB = `${b.name.title} ${b.name.first} ${b.name.last}`;

    if (direction === "asc") {
      return nameA.localeCompare(nameB);
    } else if (direction === "desc") {
      return nameB.localeCompare(nameA);
    }
  });
}

fetchUsers();
