const STORAGE_KEY = "shoppingItems";
let items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

function vibrate() {
  if (navigator.vibrate) navigator.vibrate(30);
}

// ✅ Prepopulate defaults if first launch
if (!localStorage.getItem(STORAGE_KEY)) {
  items = [
    { id: Date.now(), name: "Bananas", category: "Fruits & Vegs", isSelected: false },
    { id: Date.now() + 1, name: "Fish", category: "Meat & Fish", isSelected: false },
    { id: Date.now() + 2, name: "Milk", category: "Milk & Cheese", isSelected: false }
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
    .sort((a, b) => a.category.localeCompare(b.category))
    .forEach(item => {
      const card = document.createElement("div");
      card.className = "card" + (item.isSelected ? " selected" : "");
      card.innerHTML = `
        <div><strong>${item.name}</strong></div>
        ${item.isSelected && item.details ? `<div class='details'>${item.details}</div>` : ""}
        <button class='delete-btn'>Delete</button>
      `;

      const deleteBtn = card.querySelector(".delete-btn");
      deleteBtn.onclick = e => {
        e.stopPropagation();
        if (confirm("Delete this item?")) {
          items = items.filter(i => i.id !== item.id);
          save();
          render();
        }
      };

      // Swipe handling
      let startX = 0;
      card.addEventListener("touchstart", e => (startX = e.touches[0].clientX));
      card.addEventListener("touchmove", e => {
        if (startX - e.touches[0].clientX > 60) card.classList.add("swipe-left");
      });
      card.addEventListener("touchend", e => {
        if (startX - e.changedTouches[0].clientX < 60) card.classList.remove("swipe-left");
      });

      card.onclick = () => {
        item.isSelected = !item.isSelected;
        if (!item.isSelected) item.details = "";
        vibrate();
        save();
        render();
      };

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

document.getElementById("addBtnTop").onclick = () => {
  document.getElementById("modalOverlay").classList.add("active");
};

document.getElementById("cancelBtn").onclick = () => {
  document.getElementById("modalOverlay").classList.remove("active");
};

document.getElementById("confirmAddBtn").onclick = () => {
  const name = document.getElementById("itemName").value.trim();
  const category = document.getElementById("itemCategory").value;
  if (!name) return alert("Please enter an item name.");

  items.push({ id: Date.now(), name, category, isSelected: false });
  save();
  render();

  document.getElementById("itemName").value = "";
  document.getElementById("modalOverlay").classList.remove("active");
};

document.getElementById("search").oninput = render;

render();
