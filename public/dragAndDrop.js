const clothes = document.querySelectorAll(".cloth");
const bodyparts = document.querySelectorAll(".bodypart");
const resetButton = document.getElementById("resetButton");
const tuckButton = document.getElementById("tuckButton");
const wardrobe = document.getElementById("wardrobe");
const shirt = document.querySelector(".shirt");

var clothType = "";
var draggedCloth;
var outfit = [];

clothes.forEach(function(cloth) {
  cloth.addEventListener("dragstart", dragStart);
  cloth.addEventListener("dragend", dragEnd);
});

bodyparts.forEach(function(bodypart) {
  bodypart.addEventListener("dragover", dragOver);
  bodypart.addEventListener("dragenter", dragEnter);
  bodypart.addEventListener("dragleave", dragLeave);
  bodypart.addEventListener("drop", drop);
});

resetButton.addEventListener("click", reset);
tuckButton.addEventListener("click", tuck);

function dragStart() {
  clothType = this.getAttribute("data-type");
  draggedCloth = this;
}

function dragEnd() {}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  var bodypartType = this.getAttribute("data-type");
  if (clothType == bodypartType) {
    this.classList.add("hovered");
  }
}

function dragLeave() {
  this.classList.remove("hovered");
}

function drop() {
  var bodypartType = this.getAttribute("data-type");
  if (clothType == bodypartType) {
    this.classList.remove("hovered");
    this.append(draggedCloth);
    outfit.push(draggedCloth);
  }
}

function reset() {
  outfit.forEach(function(cloth) {
    wardrobe.append(cloth);
  });
  outfit = [];
  shirt.style.overflow="visible";
}

function tuck(){
  shirt.style.overflow="hidden";
}

