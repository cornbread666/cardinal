const plantsJSON =
  '{ "Allotment" : [' +
    '{ "Name" : "Potato" , "Base_chance" : 281040 , "Hespori_chance" : 562 },' +
    '{ "Name" : "Onion" , "Base_chance" : 281040 , "Hespori_chance" : 562 },' +
    '{ "Name" : "Cabbage" , "Base_chance" : 281040 , "Hespori_chance" : 562 },' +
    '{ "Name" : "Tomato" , "Base_chance" : 281040 , "Hespori_chance" : 562 },' +
    '{ "Name" : "Sweetcorn" , "Base_chance" : 224832 , "Hespori_chance" : 449 },' +
    '{ "Name" : "Strawberry" , "Base_chance" : 187360 , "Hespori_chance" : 374 },' +
    '{ "Name" : "Watermelon" , "Base_chance" : 160594 , "Hespori_chance" : 321 },' +
    '{ "Name" : "Snape Grass" , "Base_chance" : 173977 , "Hespori_chance" : 347 }],' +
  '"Belladonna" : [' +
    '{ "Name" : "Nightshade" , "Base_chance" : 8000 , "Hespori_chance" : 16 }],' +
  '"Bush" : [' +
    '{ "Name" : "Redberries" , "Base_chance" : 44966 , "Hespori_chance" : 89 },' +
    '{ "Name" : "Cadava berries" , "Base_chance" : 37472 , "Hespori_chance" : 74 },' +
    '{ "Name" : "Dwellberries" , "Base_chance" : 32119 , "Hespori_chance" : 64 },' +
    '{ "Name" : "Jangerberries" , "Base_chance" : 28104 , "Hespori_chance" : 56 },' +
    '{ "Name" : "White berries" , "Base_chance" : 28104 , "Hespori_chance" : 56 },' +
    '{ "Name" : "Poison ivy" , "Base_chance" : 28104 , "Hespori_chance" : 56 }],' +
  '"Cacti" : [' +
    '{ "Name" : "Cactus" , "Base_chance" : 7000 , "Hespori_chance" : 14 },' +
    '{ "Name" : "Potato Cactus" , "Base_chance" : 160594 , "Hespori_chance" : 321 }],' +
  '"Calquat" : [' +
    '{ "Name" : "Calquat tree" , "Base_chance" : 6000 , "Hespori_chance" : 12 }],' +
  '"Celastrus" : [' +
    '{ "Name" : "Celastrus tree" , "Base_chance" : 9000 , "Hespori_chance" : 18 }],' +
  '"Crystal" : [' +
    '{ "Name" : "Crystal tree" , "Base_chance" : 9000 , "Hespori_chance" : 18 }],' +
  '"Flower" : [' +
    '{ "Name" : "Marigold" , "Base_chance" : 281040 , "Hespori_chance" : 562 },' +
    '{ "Name" : "Rosemary" , "Base_chance" : 281040 , "Hespori_chance" : 562 },' +
    '{ "Name" : "Nasturium" , "Base_chance" : 281040 , "Hespori_chance" : 562 },' +
    '{ "Name" : "Woad leaf" , "Base_chance" : 281040 , "Hespori_chance" : 562 },' +
    '{ "Name" : "Limpwurt root" , "Base_chance" : 224832 , "Hespori_chance" : 449 },' +
    '{ "Name" : "White lily" , "Base_chance" : 281040 , "Hespori_chance" : 562 }],' +
  '"Fruit" : [' +
    '{ "Name" : "Apple tree" , "Base_chance" : 9000 , "Hespori_chance" : 18 },' +
    '{ "Name" : "Banana tree" , "Base_chance" : 9000 , "Hespori_chance" : 18 },' +
    '{ "Name" : "Orange tree" , "Base_chance" : 9000 , "Hespori_chance" : 18 },' +
    '{ "Name" : "Curry tree" , "Base_chance" : 9000 , "Hespori_chance" : 18 },' +
    '{ "Name" : "Pineapple tree" , "Base_chance" : 9000 , "Hespori_chance" : 18 },' +
    '{ "Name" : "Papaya tree" , "Base_chance" : 9000 , "Hespori_chance" : 18 },' +
    '{ "Name" : "Palm tree" , "Base_chance" : 9000 , "Hespori_chance" : 18 },' +
    '{ "Name" : "Dragonfruit tree" , "Base_chance" : 9000 , "Hespori_chance" : 18 }],' +
  '"Hardwood" : [' +
    '{ "Name" : "Teak tree" , "Base_chance" : 5000 , "Hespori_chance" : 10 },' +
    '{ "Name" : "Mahogany tree" , "Base_chance" : 5000 , "Hespori_chance" : 10 }],' +
  '"Herb" : [' +
    '{ "Name" : "Guam" , "Base_chance" : 98364 , "Hespori_chance" : 196 },' +
    '{ "Name" : "Marrentill" , "Base_chance" : 98364 , "Hespori_chance" : 196 },' +
    '{ "Name" : "Tarromin" , "Base_chance" : 98364 , "Hespori_chance" : 196 },' +
    '{ "Name" : "Harralander" , "Base_chance" : 98364 , "Hespori_chance" : 196 },' +
    '{ "Name" : "Goutweed" , "Base_chance" : 98364 , "Hespori_chance" : 196 },' +
    '{ "Name" : "Ranarr" , "Base_chance" : 98364 , "Hespori_chance" : 196 },' +
    '{ "Name" : "Toadflax" , "Base_chance" : 98364 , "Hespori_chance" : 196 },' +
    '{ "Name" : "Irit" , "Base_chance" : 98364 , "Hespori_chance" : 196 },' +
    '{ "Name" : "Avantoe" , "Base_chance" : 98364 , "Hespori_chance" : 196 },' +
    '{ "Name" : "Kwuarm" , "Base_chance" : 98364 , "Hespori_chance" : 196 },' +
    '{ "Name" : "Snapdragon" , "Base_chance" : 98364 , "Hespori_chance" : 196 },' +
    '{ "Name" : "Cadantine" , "Base_chance" : 98364 , "Hespori_chance" : 196 },' +
    '{ "Name" : "Lantadyme" , "Base_chance" : 98364 , "Hespori_chance" : 196 },' +
    '{ "Name" : "Dwarf weed" , "Base_chance" : 98364 , "Hespori_chance" : 196 },' +
    '{ "Name" : "Torstol" , "Base_chance" : 98364 , "Hespori_chance" : 196 }],' +
  '"Hespori" : [' +
    '{ "Name" : "Hespori" , "Base_chance" : 7000 , "Hespori_chance" : 0 }],' +
  '"Hops" : [' +
    '{ "Name" : "Barley" , "Base_chance" : 112416 , "Hespori_chance" : 244 },' +
    '{ "Name" : "Hammerstone" , "Base_chance" : 112416 , "Hespori_chance" : 244 },' +
    '{ "Name" : "Asgarnian" , "Base_chance" : 89933 , "Hespori_chance" : 179 },' +
    '{ "Name" : "Jute" , "Base_chance" : 89933 , "Hespori_chance" : 179 },' +
    '{ "Name" : "Yanillian" , "Base_chance" : 74944 , "Hespori_chance" : 149 },' +
    '{ "Name" : "Krandorian" , "Base_chance" : 64238 , "Hespori_chance" : 128 },' +
    '{ "Name" : "Wildblood" , "Base_chance" : 56208 , "Hespori_chance" : 112 }],' +
  '"Mushroom" : [' +
    '{ "Name" : "Mushroom" , "Base_chance" : 7500 , "Hespori_chance" : 15 }],' +
  '"Redwood" : [' +
    '{ "Name" : "Redwood tree" , "Base_chance" : 5000 , "Hespori_chance" : 10 }],' +
  '"Seaweed" : [' +
    '{ "Name" : "Giant seaweed" , "Base_chance" : 7500 , "Hespori_chance" : 15 }],' +
  '"Spirit" : [' +
    '{ "Name" : "Spirit tree" , "Base_chance" : 5000 , "Hespori_chance" : 10 }],' +
  '"Tree" : [' +
    '{ "Name" : "Oak tree" , "Base_chance" : 22483 , "Hespori_chance" : 44 },' +
    '{ "Name" : "Willow tree" , "Base_chance" : 16059 , "Hespori_chance" : 32 },' +
    '{ "Name" : "Maple tree" , "Base_chance" : 14052 , "Hespori_chance" : 28 },' +
    '{ "Name" : "Yew tree" , "Base_chance" : 11242 , "Hespori_chance" : 22 },' +
    '{ "Name" : "Magic tree" , "Base_chance" : 9368 , "Hespori_chance" : 18 }],' +
  '"Vine" : [' +
    '{ "Name" : "Grapes" , "Base_chance" : 385426 , "Hespori_chance" : 770 }]}';

const style = getComputedStyle(document.documentElement);
const allPlants = JSON.parse(plantsJSON);
const myBlack = (style.getPropertyValue('--my-black')).toString();
const myYellow = (style.getPropertyValue('--my-yellow')).toString();
var flvl = 1;
var chances = [];
var numplants = 1;

intro();

function intro() {
  document.getElementById("plantAdder").addEventListener("click", addPlant);
  document.getElementById("flvl_input").addEventListener("input", flvlUpdate);
  document.getElementById("hamburger_button").addEventListener("click", navbar);
  document.getElementById("info_button").addEventListener("click", showInfo);
  document.getElementById("overlay").addEventListener("click", closeModal);
  document.getElementById("info_close").addEventListener("click", closeModal);
}

function addPlant() {

  let plantContainer = document.getElementById("plant_container");
  let plantNumber = numplants.toString();
  numplants += 1;

  let plant = document.createElement("div");
  plant.classList.add("plant");
  plant.id = "plant" + plantNumber;

  let closer = document.createElement("div");
  closer.classList.add("close_button");
  closer.id = "close_button" + plantNumber;
  closer.innerText = "×";
  closer.addEventListener("click", closePlant);

  let dropdown1 = plantDropdown(plantNumber);
  let dropdown2 = subplantDropdown(plantNumber);
  let actions = actionsWindow(plantNumber);
  let chance = chanceWindow(plantNumber);

  let first_container = document.createElement("div");
  first_container.classList.add("infodrop_container");
  first_container.id = "first_container" + plantNumber;
  first_container.appendChild(closer);
  first_container.appendChild(dropdown1);

  plant.appendChild(first_container);
  plant.appendChild(dropdown2);
  plant.appendChild(actions);
  plant.appendChild(chance);
  plantContainer.appendChild(plant);
  plant.classList.add("animatePlant");
}

function plantDropdown(n) {

  let parent = document.createElement("div");
  parent.classList.add("dropdown_parent");
  parent.id = "dropdown_parent1" + n;

  let dd = document.createElement("div");
  dd.classList.add("dropdown");
  dd.id = "dropdown1" + n;
  dd.innerText = "Select crop";
  dd.addEventListener("click", toggleDropdown);

  let optionsDiv = document.createElement("div");
  optionsDiv.classList.add("options_container");
  optionsDiv.id = "options_container1" + n;

  for (var p in allPlants) {
    let o = document.createElement("div");
    o.classList.add("option");
    o.id = dd.id + "_" + p;
    o.innerText = p;
    o.addEventListener("click", plantChosen);
    optionsDiv.appendChild(o);
  }

  parent.appendChild(dd);
  parent.appendChild(optionsDiv);

  return parent;
}

function subplantDropdown(n) {

  let parent = document.createElement("div");
  parent.classList.add("dropdown_parent");
  parent.id = "dropdown_parent2" + n;

  let dd = document.createElement("div");
  dd.classList.add("dropdown");
  dd.id = "dropdown2" + n;
  dd.innerText = "Select type";
  dd.style.visibility = "hidden";

  parent.appendChild(dd);

  return parent;

}

function actionsWindow(n) {
  let parent = document.createElement("div");
  parent.classList.add("dropdown_parent");
  parent.id = "actions_parent" + n;

  let label = document.createElement("label");
  label.classList.add("action_label");
  label.id = "action_label2" + n;
  label.setAttribute("for", "action_input2" + n);
  label.innerText = "Actions per day:";
  label.style.visibility = "hidden";

  let actions = document.createElement("input");
  actions.classList.add("action_input", "flvl_listener");
  actions.id = "action_input2" + n;
  actions.setAttribute("type", "number");
  actions.setAttribute("name", actions.id);
  actions.autocomplete = "off";
  actions.style.visibility = "hidden";
  actions.setAttribute("min", "0");
  actions.setAttribute("max", "2147483647");
  actions.addEventListener("input", plantChance);

  parent.appendChild(label);
  parent.appendChild(actions);

  return parent;
}

function chanceWindow(n) {
  let parent = document.createElement("div");
  parent.classList.add("dropdown_parent");
  parent.id = "chance_parent" + n;

  let chanceText = document.createElement("div");
  chanceText.classList.add("action_label");
  chanceText.id = "chance_text2" + n;
  chanceText.innerText = "Chance per day:"
  chanceText.style.visibility = "hidden";

  let chanceNum = document.createElement("div");
  chanceNum.classList.add("action_label");
  chanceNum.id = "chance_num2" + n;
  chanceNum.innerText = "0.0000%";
  chanceNum.style.visibility = "hidden";

  let seedNum = document.createElement("input");
  seedNum.classList.add("seed_input");
  seedNum.id = "seed_num2" + n;
  seedNum.setAttribute("type", "hidden");
  seedNum.setAttribute("value", "0.0");

  parent.appendChild(seedNum);
  parent.appendChild(chanceText);
  parent.appendChild(chanceNum);

  return parent;
}

function toggleDropdown(event) {

  document.getElementById("hamburger_dropdown").classList.remove("show");

  let num = event.target.id.match(/\d+/)[0];
  let optionsID = "options_container" + num.toString();

  let els = document.getElementsByClassName("show");
  for (let i = 0; i < els.length; i++) {
    let n = els[i].id.match(/\d+/)[0];
    if (num != n) {
      els[i].classList.remove("show");
    }
  }

  let dd = document.getElementById("dropdown" + num);
  let oc = document.getElementById(optionsID);

  let h = window.innerHeight;
  let bottom = dd.getBoundingClientRect().bottom;

  if (bottom > (h * 0.75)) {
    oc.style.bottom = "0%";
  } else {
    oc.style.bottom = "auto";
  }

  oc.classList.toggle("show");
}

function plantChosen(event) {

  let tmpID = event.target.id.split("_");
  let d1 = tmpID[0];
  let d2 = d1.replace("1", "2");
  let n = d2.match(/\d+/)[0];
  let p = tmpID[1];
  document.getElementById(d1).innerText = p;

  let plant = allPlants[p];

  let optionsDiv = document.createElement("div");
  optionsDiv.classList.add("options_container");
  optionsDiv.id = "options_container" + n;

  let dropdown2 = document.getElementById(d2);
  dropdown2.style.visibility = "visible";
  dropdown2.addEventListener("click", toggleDropdown);

  let dd_parent2 = document.getElementById("dropdown_parent" + n);
  dd_parent2.replaceChildren();
  dd_parent2.appendChild(dropdown2);

  if (plant.length == 1) {

    let name = plant[0]["Name"];

    dropdown2.innerText = name;

    let o = document.createElement("div");
    o.classList.add("option");
    o.id = d2 + "_" + name;
    o.innerText = name;
    o.addEventListener("click", cropChosen);
    optionsDiv.appendChild(o);
    let c = new Event("click");
    o.dispatchEvent(c);
  } else {

    dropdown2.innerText = "Select type";

    for (var s in plant) {

      let name = plant[s]["Name"];

      let o = document.createElement("div");
      o.classList.add("option");
      o.id = d2 + "_" + name;
      o.innerText = name;
      o.addEventListener("click", cropChosen);
      optionsDiv.appendChild(o);
    }
  }

  dd_parent2.appendChild(optionsDiv);

}

function cropChosen(event) {
  let tmpID = event.target.id.split("_");
  let d2 = tmpID[0];
  let p = tmpID[1];
  let n = d2.match(/\d+/)[0];
  document.getElementById(d2).innerText = p;

  let alabel = document.getElementById("action_label" + n);
  let ainput = document.getElementById("action_input" + n);
  let ctext = document.getElementById("chance_text" + n);
  let cnum = document.getElementById("chance_num" + n);

  alabel.style.visibility = "visible";
  ainput.style.visibility = "visible";
  ctext.style.visibility = "visible";
  cnum.style.visibility = "visible";
  cnum.classList.add("chance_number");
  ainput.focus();

  let e = new Event("input");
  ainput.dispatchEvent(e);
}

function plantChance(event) {
  let tmpID = event.target.id.split("_");
  let a = tmpID[0];
  let d = tmpID[1];
  let n = d.match(/\d+/)[0];
  let n1 = n.replace("2", "1");
  let d1 = document.getElementById("dropdown" + n1);
  let d2 = document.getElementById("dropdown" + n);
  let chance = document.getElementById("chance_num" + n);
  let seed = document.getElementById("seed_num" + n);

  let actions = event.target.value;
  let crop = d1.innerText;
  let type = d2.innerText;
  var baseChance = 0;
  var seedChance = 0;

  for (var p in allPlants) {
    for (var t in allPlants[p]) {
      if (allPlants[p][t]["Name"] === type) {
        baseChance = parseInt(allPlants[p][t]["Base_chance"]);
        seedChance = parseInt(allPlants[p][t]["Hespori_chance"]);
      }
    }
  }

  let adjustedChance = baseChance - (flvl * 25);
  let c = 1 - Math.pow((1 - (1 / adjustedChance)), actions);
  let cFormatted = c.toLocaleString(undefined,{style: "percent", minimumFractionDigits: 4});
  chance.innerText = cFormatted;

  var s = 0.0;
  if (seedChance != 0) {
    s = ((1 / seedChance) * actions);
  } else {
    s = 0.0;
  }
  seed.setAttribute("value", s.toString());

  updateTotalChance();
}

function flvlUpdate(event) {

  if (event.target.value > 99) {
    flvl = 99;
    event.target.value = 99;
  } else if (event.target.value < 0) {
    flvl = 0;
    event.target.value = 0;
  } else {
    flvl = event.target.value;
  }

  let e = new Event("input");
  let toUpdate = document.getElementsByClassName("flvl_listener");
  for (var i = 0; i <toUpdate.length; i++) {
    toUpdate[i].dispatchEvent(e);
  }

  updateTotalChance()
}

function updateTotalChance() {
  let allChances = document.getElementsByClassName("chance_number");
  var tc = 0.0;

  for (var i = 0; i < allChances.length; i++) {
    tc += parseFloat(allChances[i].innerText);
  }

  let chanceText = document.getElementById("total_chance_num");
  chanceText.innerText = (tc / 100).toLocaleString(undefined,{style: "percent", minimumFractionDigits: 4});

  let daysto = Math.ceil(100 / tc).toString();
  if (daysto === "Infinity") {
    daysto = "∞";
  }
  let daysToText = document.getElementById("daysto_num");
  daysToText.innerText = daysto;

  let allSeeds = document.getElementsByClassName("seed_input");
  var seeds = 0.0;

  for (var j = 0; j < allSeeds.length; j++) {
    seeds += parseFloat(allSeeds[j].getAttribute("value"));
  }
  if (daysto === "∞") {
    seeds = 0;
  } else {
    seeds = Math.ceil(seeds * daysto);
  }

  let hesporiText = document.getElementById("hespori_num");
  hesporiText.innerText = seeds.toString();
}

function closePlant(event) {
  let num = event.target.id.match(/\d+/)[0];
  let p = document.getElementById("plant" + num);
  p.remove();
  updateTotalChance();
}

function navbar(event) {
  document.getElementById("hamburger_dropdown").classList.toggle("show");
}

function showInfo() {
  document.getElementById("info_modal").classList.add("active");
  document.getElementById("overlay").classList.add("active");
}

function closeModal() {
  if (document.getElementById("info_modal").classList.contains("active")) {
    document.getElementById("info_modal").classList.remove("active");
    document.getElementById("overlay").classList.remove("active");
  }
}

window.onclick = function(event) {
  if (!event.target.matches(".dropdown")) {
    let dropdowns = document.getElementsByClassName("options_container");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
  if (!event.target.matches("#hamburger_button")) {
    let hd = document.getElementById("hamburger_dropdown");
    if (hd.classList.contains("show")) {
      hd.classList.remove("show");
    }
  }
}
