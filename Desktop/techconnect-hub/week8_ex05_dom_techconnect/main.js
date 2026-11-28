// =========================================
// TechConnect Hub - Main JavaScript
// =========================================

// State Management
let developers = [];
let filteredDevelopers = [];
let isTableView = false;

// DOM Element References
const devCountEl = document.getElementById("devCount");
const searchInput = document.getElementById("searchInput");
const viewToggleBtn = document.getElementById("viewToggleBtn");
const cardViewContainer = document.getElementById("cardViewContainer");
const tableViewContainer = document.getElementById("tableViewContainer");
const tableBody = document.getElementById("tableBody");
const addDevForm = document.getElementById("addDevForm");

// 1. Load Developers from JSON via Fetch API
async function loadDevelopers() {
  try {
    const response = await fetch("./developers.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    developers = await response.json();
    filteredDevelopers = [...developers];
    renderDirectory(filteredDevelopers);
  } catch (error) {
    console.error("Failed to load developers.json:", error);
    cardViewContainer.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger" role="alert">
          Unable to load developers. Make sure you are running the project using a local server (e.g. VS Code Live Server).
        </div>
      </div>
    `;
  }
}

// 2. Master Render Function (Updates Cards, Table, and Live Counter)
function renderDirectory(devList) {
  // Update live developer counter
  devCountEl.textContent = devList.length;

  // Clear existing DOM nodes
  cardViewContainer.innerHTML = "";
  tableBody.innerHTML = "";

  // Handle empty search results
  if (devList.length === 0) {
    cardViewContainer.innerHTML = `
      <div class="col-12">
        <div class="alert alert-secondary text-center mb-0">
          No developers match your search criteria.
        </div>
      </div>
    `;
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted py-4">
          No developers match your search criteria.
        </td>
      </tr>
    `;
    return;
  }

  // Create and append elements for each developer
  devList.forEach((dev) => {
    const cardCol = createDeveloperCard(dev);
    cardViewContainer.appendChild(cardCol);

    const tableRow = createDeveloperRow(dev);
    tableBody.appendChild(tableRow);
  });
}

// 3. Dynamic DOM Element Creation: Card View
function createDeveloperCard(dev) {
  const col = document.createElement("div");
  col.className = "col-md-6";

  const skillsHtml = dev.skills
    .map((skill) => `<span class="skill-badge">${skill}</span>`)
    .join(" ");

  // Note: .hire-badge is toggled via classList when the button is clicked
  const badgeClasses = dev.availableForHire ? "hire-badge" : "hire-badge d-none";

  col.innerHTML = `
    <article class="dev-card h-100 p-3 d-flex flex-column justify-content-between">
      <div>
        <div class="d-flex align-items-center gap-3 mb-3">
          <img src="${dev.avatar}" alt="${dev.name}" class="dev-avatar" />
          <div>
            <h3 class="h6 fw-bold mb-0">${dev.name}</h3>
            <p class="text-primary small fw-medium mb-0">${dev.role}</p>
            <small class="text-muted">${dev.location}</small>
          </div>
        </div>

        <div class="mb-3 d-flex flex-wrap gap-1">
          ${skillsHtml}
        </div>
      </div>

      <div class="pt-2 border-top d-flex justify-content-between align-items-center">
        <span class="${badgeClasses}" data-badge-id="${dev.id}">Available for Hire</span>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary ms-auto toggle-hire-btn"
          data-id="${dev.id}"
        >
          ${dev.availableForHire ? "Mark Unavailable" : "Mark Available"}
        </button>
      </div>
    </article>
  `;

  // Attach Hire Badge Toggle listener directly to this card's button
  const toggleBtn = col.querySelector(".toggle-hire-btn");
  toggleBtn.addEventListener("click", () => toggleHireStatus(dev.id));

  return col;
}

// 4. Dynamic DOM Element Creation: Table View Row
function createDeveloperRow(dev) {
  const tr = document.createElement("tr");

  const skillsHtml = dev.skills
    .map((skill) => `<span class="skill-badge">${skill}</span>`)
    .join(" ");

  const badgeClasses = dev.availableForHire ? "hire-badge" : "hire-badge d-none";

  tr.innerHTML = `
    <td>
      <div class="d-flex align-items-center gap-2">
        <img src="${dev.avatar}" alt="${dev.name}" class="dev-avatar-sm" />
        <div>
          <div class="fw-bold">${dev.name}</div>
          <small class="text-muted">${dev.location}</small>
        </div>
      </div>
    </td>
    <td class="small fw-medium">${dev.role}</td>
    <td>
      <div class="d-flex flex-wrap gap-1">${skillsHtml}</div>
    </td>
    <td>
      <span class="${badgeClasses}" data-badge-id="${dev.id}">Available for Hire</span>
    </td>
    <td>
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary toggle-hire-btn"
        data-id="${dev.id}"
      >
        ${dev.availableForHire ? "Mark Unavailable" : "Mark Available"}
      </button>
    </td>
  `;

  const toggleBtn = tr.querySelector(".toggle-hire-btn");
  toggleBtn.addEventListener("click", () => toggleHireStatus(dev.id));

  return tr;
}

// 5. Available for Hire Badge Toggle (DOM Class Manipulation + State Sync)
function toggleHireStatus(devId) {
  const developer = developers.find((d) => d.id === devId);
  if (!developer) return;

  // Flip boolean state
  developer.availableForHire = !developer.availableForHire;

  // Manipulate DOM classes directly on all matching badges (card + table)
  const badges = document.querySelectorAll(`[data-badge-id="${devId}"]`);
  badges.forEach((badge) => {
    badge.classList.toggle("d-none", !developer.availableForHire);
  });

  // Update button text in both views
  const buttons = document.querySelectorAll(`.toggle-hire-btn[data-id="${devId}"]`);
  buttons.forEach((btn) => {
    btn.textContent = developer.availableForHire ? "Mark Unavailable" : "Mark Available";
  });
}

// 6. Live Search Filtering (By Name, Role, or Skill)
function handleSearch() {
  const query = searchInput.value.trim().toLowerCase();

  filteredDevelopers = developers.filter((dev) => {
    const matchesName = dev.name.toLowerCase().includes(query);
    const matchesRole = dev.role.toLowerCase().includes(query);
    const matchesSkill = dev.skills.some((skill) =>
      skill.toLowerCase().includes(query)
    );
    return matchesName || matchesRole || matchesSkill;
  });

  renderDirectory(filteredDevelopers);
}

// 7. Card & Table View Toggle
function handleViewToggle() {
  isTableView = !isTableView;

  if (isTableView) {
    cardViewContainer.classList.add("d-none");
    tableViewContainer.classList.remove("d-none");
    viewToggleBtn.textContent = "Switch to Card View";
  } else {
    tableViewContainer.classList.add("d-none");
    cardViewContainer.classList.remove("d-none");
    viewToggleBtn.textContent = "Switch to Table View";
  }
}

// 8. Add Developer Form with Client-Side Validation
function handleAddDeveloper(event) {
  event.preventDefault();

  const nameInput = document.getElementById("devName");
  const roleInput = document.getElementById("devRole");
  const locationInput = document.getElementById("devLocation");
  const skillsInput = document.getElementById("devSkills");
  const availableInput = document.getElementById("devAvailable");

  const name = nameInput.value.trim();
  const role = roleInput.value.trim();
  const location = locationInput.value.trim();
  const skillsArray = skillsInput.value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  let isValid = true;

  // Validate Name
  if (name.length < 2) {
    nameInput.classList.add("is-invalid");
    isValid = false;
  } else {
    nameInput.classList.remove("is-invalid");
  }

  // Validate Role
  if (role.length < 2) {
    roleInput.classList.add("is-invalid");
    isValid = false;
  } else {
    roleInput.classList.remove("is-invalid");
  }

  // Validate Location
  if (location.length < 2) {
    locationInput.classList.add("is-invalid");
    isValid = false;
  } else {
    locationInput.classList.remove("is-invalid");
  }

  // Validate Skills
  if (skillsArray.length === 0) {
    skillsInput.classList.add("is-invalid");
    isValid = false;
  } else {
    skillsInput.classList.remove("is-invalid");
  }

  if (!isValid) return;

  // Generate initials for placeholder avatar matching developers.json style
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const newDeveloper = {
    id: Date.now(),
    name,
    role,
    skills: skillsArray,
    avatar: `https://placehold.co/100x100/2563EB/FFFFFF?text=${initials}`,
    availableForHire: availableInput.checked,
    location,
  };

  // Add to master list and re-apply current search filter
  developers.unshift(newDeveloper);
  handleSearch();

  // Reset form fields and validation states
  addDevForm.reset();
  availableInput.checked = true;
}

// Event Listeners
searchInput.addEventListener("input", handleSearch);
viewToggleBtn.addEventListener("click", handleViewToggle);
addDevForm.addEventListener("submit", handleAddDeveloper);

// Initialize App
loadDevelopers();