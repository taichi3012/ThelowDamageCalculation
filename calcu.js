window.addEventListener("load", () => {
	const registerListener = (node) => {
		switch (node.tagName) {
			case "INPUT":
				node.addEventListener("input", calcuDmg);
				node.addEventListener("input", updateURL);
				break;
			case "SELECT":
				if (node.id !== "OSParkSelector") {
					node.addEventListener("change", calcuDmg);
				}
				node.addEventListener("change", updateURL);
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

const overStrengthSelector = document.getElementById("parkStageSelector");

for (let value = 1; value <= over_strength_values.length; value++) {
	let option = document.createElement("option");
	option.text = value.toString();
	option.value = value.toString();
	overStrengthSelector.appendChild(option);
}

const elementIdByParamId = new Map()
.set("defaultDamage", "weaponDamageInput")
.set("specialDamage", "specialDamageInput")
.set("parkGain", "parkGainInput")
.set("jobGain", "jobGainInput")
.set("equipGain", "equipGainInput")
.set("strengthEffectLevel", "strengthEffectInput")
.set("legendValue", "legendValueSelector")
.set("MSLv1", "magicStone1CheckBox")
.set("MSLv2", "magicStone2CheckBox")
.set("MSLv3", "magicStone3CheckBox")
.set("MSLv4", "magicStone4CheckBox")
.set("MSLv4_5", "magicStone4_5CheckBox")
.set("MSLv5", "magicStone5CheckBox")
.set("skillId", "skillSelector");

function getElementId(paramId) {
	return elementIdByParamId.get(paramId);
}

function getParamId(elementId) {
	for (let key of elementIdByParamId.keys()) {
		if (elementIdByParamId.get(key) == elementId) {
			return key;
		}
	}
	return null;
}

//パラメーターの適用
if(location.search.substring(1)) {
	var paramMap = new Map();

	const param = location.search.substring(1).split("&");

	for (i = 0; i < param.length; i++) {
		var array = param[i].split("=");
		var elementId = getElementId(array[0]);
		if (!elementId) {
			continue;
		}

		switch(elementId) {
			case "weaponDamageInput":
			case "specialDamageInput":
			case "parkGainInput":
			case "jobGainInput":
			case "equipGainInput":
			case "strengthEffectInput":
				document.getElementById(elementId).value = Number(array[1]);
				console.log("Value of " + elementId + " is apply!");
				break;
			case "legendValueSelector":
				var val = Math.floor(Number(array[1]));
				if (0 <= val && val <= 3) {
					document.getElementById(elementId).selectedIndex = val;
					console.log("Value of " + elementId + " is apply!");
				}
				break;
			case "magicStone1CheckBox":
			case "magicStone2CheckBox":
			case "magicStone3CheckBox":
			case "magicStone4CheckBox":
			case "magicStone4_5CheckBox":
			case "magicStone5CheckBox":
				var str = array[1];
				if (str == "0") {
					document.getElementById(elementId).checked = false;
					console.log("Value of " + elementId + " is apply!");
				}
				if (str == "1") {
					document.getElementById(elementId).checked = true;
					console.log("Value of " + elementId + " is apply!");
				}
				break;
			case "skillSelector":
				var skillId = array[1];
				if (skillIdFrom.get(skillId)) {
					document.getElementById(elementId).selectedIndex = skillIdFrom.get(skillId).get("selectorIndex");
					console.log("Value of " + elementId + " is apply!");
				}
				break;
			default:
		}
	}

	calcuDmg();
}

function applyOverStrength() {
	let parkValue = over_strength_values[overStrengthSelector.selectedIndex];
	let parkInput = document.getElementById("parkGainInput");
	parkInput.value = parkValue;

	calcuDmg();
}

function calcuDmg() {
	const weaponDamageInput = document.getElementById("weaponDamageInput");
	if (weaponDamageInput.value === "") {
		clearInterval(animationTask.normal);
		clearInterval(animationTask.critical);
		document.getElementById("resultDisplayNormal").textContent = 0;
		document.getElementById("resultDisplayCritical").textContent = 0;
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

function updateURL() {
	const url = new URL(window.location);
	for (let elementId of elementIdByParamId.values()) {
		switch(elementId) {
			case "weaponDamageInput":
			case "specialDamageInput":
			case "parkGainInput":
			case "jobGainInput":
			case "equipGainInput":
			case "strengthEffectInput":
				let value = document.getElementById(elementId).value;
				if (value) {
					url.searchParams.set(getParamId(elementId), value);
				}
				break;
			case "legendValueSelector":
				let legendIndex = document.getElementById(elementId).selectedIndex;
				if (legendIndex) {
					url.searchParams.set(getParamId(elementId), legendIndex);
				}
				break;
			case "magicStone1CheckBox":
			case "magicStone2CheckBox":
			case "magicStone3CheckBox":
			case "magicStone4CheckBox":
			case "magicStone4_5CheckBox":
			case "magicStone5CheckBox":
				let checked = document.getElementById(elementId).checked;
				if (checked == true) {
					url.searchParams.set(getParamId(elementId), checked);
				}
				break;
			case "skillSelector":
				let skillIndex = document.getElementById(elementId).selectedIndex;
				url.searchParams.set(getParamId(elementId), skillData[Number(skillIndex)].id);
				break;
			default:
		}
	}
	console.log(url.href);
	history.pushState({}, "", url);
}