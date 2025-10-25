const STORAGE_KEY = "shoppingItems";
let items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// ✅ Define save() early so it’s available everywhere
const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

// Optional vibration feedback
function vibrate() {
  if (navigator.vibrate) navigator.vibrate(30);
}

// ✅ Default items for first-time users
if (items.length === 0) {
  items = [
    { id: Date.now() + 1, name: "Bananas", category: "Fruits & Vegs", isSelected: false },
    { id: Date.now() + 2, name: "Fish", category: "Meat & Fish", isSelected: false },
    { id: Date.now() + 3, name: "Milk", category: "Milk & Cheese", isSelected: false }
  ];
  save();
}

function render() {
  const toBuyList = document.getElementById("toBuyList");
  const laterList = document.getElementById("laterList");
  const search = document.getElementById("search").value.toLowerCase();
  toBuyList.innerHTML = "";
  laterList.innerHTML = "";

  items
    .filter(i => i.name.toLowerCase().includes(search))
    // ✅ Sort by category, then alphabetically by name
    .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
    .forEach(item => {
      const card = document.createElement("div");
      card.className = "card" + (item.isSelected ? " selected" : "");
      card.innerHTML =
        `<div><strong>${item.name}</strong></div>` +
        (item.isSelected && item.details ? `<div class='details'>${item.details}</div>` : "") +
        "<button class='delete-btn' aria-label='Delete item'>Delete</button>";

      const deleteBtn = card.querySelector(".delete-btn");
      deleteBtn.onclick = e => {
        e.stopPropagation();
        if (confirm("Delete this item?")) {
          items = items.filter(i => i.id !== item.id);
          save();
          render();
        }
      };

      // Swipe gesture for delete
      let startX = 0;
      card.addEventListener("touchstart", e => (startX = e.touches[0].clientX));
      card.addEventListener("touchmove", e => {
        if (startX - e.touches[0].clientX > 60) card.classList.add("swipe-left");
      });
      card.addEventListener("touchend", e => {
        if (startX - e.changedTouches[0].clientX < 60) card.classList.remove("swipe-left");
      });

      // Toggle between "to buy" and "later"
      card.onclick = () => {
        item.isSelected = !item.isSelected;
        if (!item.isSelected) item.details = "";
        vibrate();
        save();
        render();
      };

      // Double click (or double tap) to add details
      card.ondblclick = () => {
        const details = prompt("Add details for " + item.name, item.details || "");
        if (details !== null) {
          item.details = details.trim();
          save();
          render();
        }
      };

      (item.isSelected ? toBuyList : laterList).appendChild(card);
    });
}

// ✅ Add item modal logic (with event stopPropagation fix)
document.getElementById("addBtnTop").onclick = (e) => {
  e.stopPropagation(); // prevent bubbling to card layer
  document.getElementById("modalOverlay").classList.add("active");
};

document.getElementById("cancelBtn").onclick = (e) => {
  e.stopPropagation();
  document.getElementById("modalOverlay").classList.remove("active");
};

document.getElementById("confirmAddBtn").onclick = (e) => {
  e.stopPropagation();
  const name = document.getElementById("itemName").value.trim();
  const category = document.getElementById("itemCategory").value;
  if (!name) return alert("Please enter an item name.");

  items.push({ id: Date.now(), name, category, isSelected: false });
  save();
  render();
  document.getElementById("itemName").value = "";
  // ✅ Reset dropdown to first option
  document.getElementById("itemCategory").selectedIndex = 0;
  document.getElementById("modalOverlay").classList.remove("active");
};

// Search filter
document.getElementById("search").oninput = render;

// Initial render
render();