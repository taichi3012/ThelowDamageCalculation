window.addEventListener("load", () => {
	const registerListener = (node) => {
		switch (node.tagName) {
			case "INPUT":
				node.addEventListener("input", calcuDmg);
				break;
			case "SELECT":
				if (node.id !== "OSParkSelector") {
					node.addEventListener("change", calcuDmg);
				}
				break;
			default:
				for (const child of Array.from(node.children)) {
					registerListener(child);
				}
				break;
		}
	};
	registerListener(document.body);
});

let skillIdFrom = new Map();
let skillData = skill_data.sort((a, b) => {
	if (Number(a.selectorIndex) < Number(b.selectorIndex)) return -1;
	if (Number(a.selectorIndex) > Number(b.selectorIndex)) return 1;
	return 0;
});
const skillSelector = document.getElementById("skillSelector");

const animationTask = {
	normal: 0,
	critical: 0,
};

for (const data of skillData) {
	let option = document.createElement("option");
	option.text = data.name;
	option.value = data.id;
	skillSelector.appendChild(option);
	skillIdFrom.set(
		data.id,
		new Map([
			["name", data.name],
			["selectorIndex", data.selectorIndex],
			["multiply", data.multiply],
			["availabilSpecial", data.availabilSpecial],
		])
	);
	console.log("\n[SkillResister]  ID:" + data.id + "  Name:" + data.name + " Registered!");
}

const overStrengthSelector = document.getElementById("OSParkSelector");

for (let value = 1; value <= over_strength_values.length; value++) {
	let option = document.createElement("option");
	option.text = value.toString();
	option.value = value.toString();
	overStrengthSelector.appendChild(option);
}

function applyOverStrength() {
	let parkValue = over_strength_values[overStrengthSelector.selectedIndex];
	let parkInput = document.getElementById("parkGainInput");
	parkInput.value = parkValue;

	calcuDmg();
}

function calcuDmg() {
	let weaponDamageInput = document.getElementById("weaponDamageInput");
	if (weaponDamageInput.value === "") {
		return;
	}

	const specialDamageInput = document.getElementById("specialDamageInput");
	const parkGainInput = document.getElementById("parkGainInput");
	const jobGainInput = document.getElementById("jobGainInput");
	const equipGainInput = document.getElementById("equipGainInput");
	const magicStoneInputMap = new Map()
		.set("1", document.getElementById("magicStone1CheckBox"))
		.set("2", document.getElementById("magicStone2CheckBox"))
		.set("3", document.getElementById("magicStone3CheckBox"))
		.set("4", document.getElementById("magicStone4CheckBox"))
		.set("4.5", document.getElementById("magicStone4_5CheckBox"))
		.set("5", document.getElementById("magicStone5CheckBox"));
	const skillInput = document.getElementById("skillSelector");
	const selectedSkillMap = skillIdFrom.get(skillInput.options[skillInput.selectedIndex].value);
	const strengthEffectInput = document.getElementById("strengthEffectInput");
	const legendValueInput = document.getElementById("legendValueSelector");

	let result = Number(weaponDamageInput.value);
	if (selectedSkillMap.get("availabilSpecial")) {
		result += Number(specialDamageInput.value);
	}

	let damageMultioly = (100 + Number(parkGainInput.value) + Number(jobGainInput.value) + Number(equipGainInput.value)) / 100;
	magicStoneInputMap.forEach((v, k) => {
		if (v.checked) {
			damageMultioly *=
				k === "1"
					? 1.1
					: k === "2"
					? 1.15
					: k === "3"
					? 1.23
					: k === "4"
					? 1.35
					: k === "4.5"
					? 1.4
					: k === "5"
					? 1.55
					: 1;
		}
	});
	damageMultioly *= selectedSkillMap.get("multiply");
	damageMultioly *= strengthEffectInput.value ? 1 + 0.2 * Number(strengthEffectInput.value) : 1;
	damageMultioly *= 1.06 ** Number(legendValueInput.value);
	result *= damageMultioly;

	clearInterval(animationTask.normal);
	clearInterval(animationTask.critical);

	const resultNormal = document.getElementById("resultDisplayNormal");
	const resultCritical = document.getElementById("resultDisplayCritical");

	let currentNormal = Number(document.getElementById("resultDisplayNormal").textContent);
	let currentCritical = Number(document.getElementById("resultDisplayCritical").textContent);

	const nextNormal = Math.floor(result * 1000) / 1000;
	const nextCritical = Math.floor(result * 1.15 * 1000) / 1000;

	animationTask.normal = setInterval(() => {
		currentNormal += (nextNormal - currentNormal) / 2;
		resultNormal.textContent = currentNormal.toFixed(3);

		if (Math.abs(nextNormal - currentNormal) < 0.0005) {
			clearInterval(animationTask.normal);
		}
	}, 50);

	animationTask.critical = setInterval(() => {
		currentCritical += (nextCritical - currentCritical) / 2;
		resultCritical.textContent = currentCritical.toFixed(3);

		if (Math.abs(nextCritical - currentCritical) < 0.0005) {
			clearInterval(animationTask.critical);
		}
	}, 50);
}
