const STORAGE_KEY = "shoppingItems";
let items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
  { id: Date.now(), name: "Milk", category: "Milk & Cheese", isSelected: false },
  { id: Date.now()+1, name: "Bread", category: "Bread & Pastries", isSelected: false },
  { id: Date.now()+2, name: "Bananas", category: "Fruits & Vegs", isSelected: false }
];

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function render() {
  const toBuyList = document.getElementById("toBuyList");
  const laterList = document.getElementById("laterList");
  const search = document.getElementById("search").value.toLowerCase();

  toBuyList.innerHTML = "";
  laterList.innerHTML = "";

  items
    .filter(i => i.name.toLowerCase().includes(search))
    .sort((a,b) => a.category.localeCompare(b.category))
    .forEach(item => {
      const card = document.createElement("div");
      card.className = "card" + (item.isSelected ? " selected" : "");
      card.innerHTML = `
        <div><strong>${item.name}</strong></div>
        ${item.isSelected && item.details ? `<div class="details">${item.details}</div>` : ""}
      `;
      card.onclick = () => {
        item.isSelected = !item.isSelected;
        if (!item.isSelected) item.details = "";
        save(); render();
      };
      card.ondblclick = () => {
        const details = prompt("Add details for " + item.name, item.details || "");
        if (details !== null) {
          item.details = details.trim();
          save(); render();
        }
      };
      (item.isSelected ? toBuyList : laterList).appendChild(card);
    });
}

document.getElementById("addBtnTop").onclick = () => {
  const name = prompt("Enter item name:");
  if (!name) return;
  const category = prompt("Enter category (e.g. Milk & Cheese):") || "Other Items";
  items.push({ id: Date.now(), name, category, isSelected: false });
  save(); render();
};

document.getElementById("search").oninput = render;
render();
