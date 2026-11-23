const generateButton = document.getElementById("generateButton");
const resetButton = document.getElementById("resetButton");
const spellArea = document.getElementById("spellArea");
const ingredients = document.querySelectorAll("#ingredientsList li");

let countdownTimer = null;

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}


generateButton.addEventListener("click", function () {
  
  clearInterval(countdownTimer);

  let count = 3;
  spellArea.textContent = count;

  countdownTimer = setInterval(function () {
    count--;

    if (count > 0) {
      spellArea.textContent = count;
    } else {
      clearInterval(countdownTimer);

      const randomIndex = Math.floor(Math.random() * ingredients.length);
      const selectedIngredient = ingredients[randomIndex].textContent;

      spellArea.textContent = selectedIngredient;
      spellArea.style.backgroundColor = getRandomColor();
    }
  }, 1000);
});


resetButton.addEventListener("click", function () {
  clearInterval(countdownTimer);
  spellArea.textContent = "";
  spellArea.style.backgroundColor = "";
});
