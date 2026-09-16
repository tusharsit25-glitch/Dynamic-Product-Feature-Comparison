/* ==========================================================
   compare.js
   All JavaScript functionality for the Dynamic Product
   Feature Comparison project.
   ========================================================== */

/* ----------------------------------------------------------
   1. PRODUCT DATA
   All laptop information is stored in a single array of
   objects. This is sample/demo data for a college practical,
   not live product data.
   ---------------------------------------------------------- */
const products = [
  {
    name: "HP 15s",
    price: "₹42,990",
    processor: "Intel Core i5-1235U (12th Gen)",
    ram: "8 GB DDR4",
    storage: "512 GB SSD",
    display: "15.6\" FHD (1920x1080)",
    graphics: "Intel Iris Xe (Integrated)",
    battery: "Up to 8 hours",
    os: "Windows 11 Home",
    weight: "1.69 kg",
    warranty: "1 Year Onsite"
  },
  {
    name: "Dell Inspiron 15",
    price: "₹48,490",
    processor: "Intel Core i5-1334U (13th Gen)",
    ram: "16 GB DDR4",
    storage: "512 GB SSD",
    display: "15.6\" FHD (1920x1080)",
    graphics: "Intel Iris Xe (Integrated)",
    battery: "Up to 7 hours",
    os: "Windows 11 Home",
    weight: "1.65 kg",
    warranty: "1 Year Onsite"
  },
  {
    name: "Lenovo IdeaPad Slim 3",
    price: "₹39,990",
    processor: "AMD Ryzen 5 7520U",
    ram: "8 GB DDR5",
    storage: "512 GB SSD",
    display: "15.6\" FHD (1920x1080)",
    graphics: "AMD Radeon Graphics (Integrated)",
    battery: "Up to 9 hours",
    os: "Windows 11 Home",
    weight: "1.63 kg",
    warranty: "1 Year Carry-In"
  }
];

/* List of features to compare, in display order.
   "key" matches the property name in each product object,
   "label" is what gets shown in the table. */
const featureList = [
  { key: "price",     label: "Price" },
  { key: "processor", label: "Processor" },
  { key: "ram",        label: "RAM" },
  { key: "storage",    label: "Storage" },
  { key: "display",    label: "Display" },
  { key: "graphics",   label: "Graphics" },
  { key: "battery",    label: "Battery" },
  { key: "os",          label: "Operating System" },
  { key: "weight",      label: "Weight" },
  { key: "warranty",    label: "Warranty" }
];

/* ----------------------------------------------------------
   2. CACHE DOM ELEMENTS
   Grabbing elements once and reusing them is cleaner than
   querying the DOM repeatedly.
   ---------------------------------------------------------- */
const product1Select = document.getElementById("product1Select");
const product2Select = document.getElementById("product2Select");
const tableHeadProduct1 = document.getElementById("tableHeadProduct1");
const tableHeadProduct2 = document.getElementById("tableHeadProduct2");
const comparisonTableBody = document.getElementById("comparisonTableBody");
const productCardsContainer = document.getElementById("productCardsContainer");
const comparisonStatus = document.getElementById("comparisonStatus");
const resetBtn = document.getElementById("resetBtn");

/* ----------------------------------------------------------
   3. POPULATE DROPDOWNS
   Both dropdowns are filled from the same "products" array,
   so we never have to hardcode <option> tags in HTML.
   ---------------------------------------------------------- */
function populateDropdowns() {
  products.forEach((product, index) => {
    const option1 = document.createElement("option");
    option1.value = index;
    option1.textContent = product.name;
    product1Select.appendChild(option1);

    // cloneNode is a quick way to reuse the same option for the 2nd dropdown
    const option2 = option1.cloneNode(true);
    product2Select.appendChild(option2);
  });
}

/* ----------------------------------------------------------
   4. HELPER: get the currently selected product objects
   ---------------------------------------------------------- */
function getSelectedProducts() {
  const product1 = products[product1Select.value];
  const product2 = products[product2Select.value];
  return { product1, product2 };
}

/* ----------------------------------------------------------
   5. RENDER TABLE
   Builds the comparison table rows dynamically from
   featureList + the two selected products. Cells whose
   values differ get a highlight + "Different" badge, and
   matching cells get a "Same" badge.
   ---------------------------------------------------------- */
function renderTable(product1, product2) {
  // Update table header with product names
  tableHeadProduct1.textContent = product1.name;
  tableHeadProduct2.textContent = product2.name;

  // Build all rows using map + template literals, then join into one string
  const rowsHtml = featureList.map((feature) => {
    const value1 = product1[feature.key];
    const value2 = product2[feature.key];
    const isDifferent = value1 !== value2;

    // Choose cell classes + badge based on whether values differ
    const cellClass = isDifferent
      ? "bg-amber-50 border border-amber-200"
      : "bg-slate-50 border border-slate-200";

    const badgeHtml = isDifferent
      ? '<span class="badge badge-diff">Different</span>'
      : '<span class="badge badge-same">Same</span>';

    return `
      <tr>
        <td class="py-3 pr-4 align-top font-medium text-slate-600">${feature.label}</td>
        <td class="py-3 px-4 align-top rounded-lg ${cellClass}">
          ${value1}
          ${badgeHtml}
        </td>
        <td class="py-3 px-4 align-top rounded-lg ${cellClass}">
          ${value2}
          ${badgeHtml}
        </td>
      </tr>
    `;
  }).join("");

  comparisonTableBody.innerHTML = rowsHtml;
}

/* ----------------------------------------------------------
   6. RENDER PRODUCT SUMMARY CARDS
   Shows a short summary (name, price, processor, RAM,
   storage) for each of the two selected products.
   ---------------------------------------------------------- */
function renderProductCards(product1, product2) {
  // Small reusable function to build one card's HTML
  function buildCard(product) {
    return `
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h3 class="text-base font-semibold text-slate-900 mb-3">${product.name}</h3>
        <ul class="space-y-1.5 text-sm text-slate-600">
          <li><span class="font-medium text-slate-800">Price:</span> ${product.price}</li>
          <li><span class="font-medium text-slate-800">Processor:</span> ${product.processor}</li>
          <li><span class="font-medium text-slate-800">RAM:</span> ${product.ram}</li>
          <li><span class="font-medium text-slate-800">Storage:</span> ${product.storage}</li>
        </ul>
      </div>
    `;
  }

  productCardsContainer.innerHTML = buildCard(product1) + buildCard(product2);
}

/* ----------------------------------------------------------
   7. UPDATE COMPARISON STATUS MESSAGE
   ---------------------------------------------------------- */
function updateStatusMessage(product1, product2) {
  comparisonStatus.textContent = `Comparing ${product1.name} vs ${product2.name}`;
}

/* ----------------------------------------------------------
   8. MASTER UPDATE FUNCTION
   Called whenever a dropdown changes (or on page load).
   Ties together all the render functions above.
   ---------------------------------------------------------- */
function updateComparison() {
  const { product1, product2 } = getSelectedProducts();

  renderTable(product1, product2);
  renderProductCards(product1, product2);
  updateStatusMessage(product1, product2);
}

/* ----------------------------------------------------------
   9. RESET COMPARISON
   Resets dropdowns back to the default selection
   (Product 1 = HP 15s, Product 2 = Dell Inspiron 15)
   and re-runs the update so everything refreshes.
   ---------------------------------------------------------- */
function resetComparison() {
  product1Select.value = 0; // index of HP 15s
  product2Select.value = 1; // index of Dell Inspiron 15
  updateComparison();
}

/* ----------------------------------------------------------
   10. EVENT LISTENERS
   ---------------------------------------------------------- */
product1Select.addEventListener("change", updateComparison);
product2Select.addEventListener("change", updateComparison);
resetBtn.addEventListener("click", resetComparison);

/* ----------------------------------------------------------
   11. INITIAL PAGE LOAD
   Populate dropdowns, set default selection, and render
   everything once as soon as the page loads.
   ---------------------------------------------------------- */
populateDropdowns();
resetComparison(); // sets defaults (HP 15s vs Dell Inspiron 15) and renders
