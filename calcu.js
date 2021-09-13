window.addEventListener("load", () => {
	const registerListener = (node) => {
		switch (node.tagName) {
			case "INPUT":
				node.addEventListener("input", calcuDmg);
				break;
			case "SELECT":
				if (node.id !== "os_selector") {
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
let skillSelector = document.getElementById("skill");

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

let overStrengthSelector = document.getElementById("os_selector");

for (let value = 1; value <= over_strength_values.length; value++) {
	let option = document.createElement("option");
	option.text = value.toString();
	option.value = value.toString();
	overStrengthSelector.appendChild(option);
}

function applyOverStrength() {
	let parkValue = over_strength_values[overStrengthSelector.selectedIndex];
	let parkInput = document.getElementById("park");
	parkInput.value = parkValue;

	calcuDmg();
}

function calcuDmg() {
	let weaponDmg = document.getElementById("atkdmg");
	if (weaponDmg.value === "") {
		return;
	}

	let specialDmg = document.getElementById("specialdmg");
	let park = document.getElementById("park");
	let job = document.getElementById("job");
	let armor = document.getElementById("armor");
	let magicStone = new Map()
		.set("1", document.getElementById("ms_1"))
		.set("2", document.getElementById("ms_2"))
		.set("3", document.getElementById("ms_3"))
		.set("4", document.getElementById("ms_4"))
		.set("4.5", document.getElementById("ms_4-5"))
		.set("5", document.getElementById("ms_5"));
	let skill = document.getElementById("skill");
	let skillSelectedValue = skill.options[skill.selectedIndex].value;
	let selectedSkillMap = skillIdFrom.get(skillSelectedValue);
	let strEffct = document.getElementById("streffect");
	let legend = document.getElementById("legend_value");

	let result = Number(weaponDmg.value);
	if (selectedSkillMap.get("availabilSpecial")) {
		result += Number(specialDmg.value);
	}

	let multiplyDmg = (100 + Number(park.value) + Number(job.value) + Number(armor.value)) / 100;
	magicStone.forEach((v, k) => {
		if (v.checked) {
			multiplyDmg *=
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
	multiplyDmg *= selectedSkillMap.get("multiply");
	multiplyDmg *= strEffct.value ? 1 + 0.2 * Number(strEffct.value) : 1;
	multiplyDmg *= 1.06 ** Number(legend.value);
	result *= multiplyDmg;

	clearInterval(animationTask.normal);
	clearInterval(animationTask.critical);

	const resultNormal = document.getElementById("result_normal");
	const resultCritical = document.getElementById("result_critical");

	let currentNormal = Number(document.getElementById("result_normal").textContent);
	let currentCritical = Number(document.getElementById("result_critical").textContent);

	const nextNormal = Math.floor(result * 1000) / 1000;
	const nextCritical = Math.floor(result * 1.15 * 1000) / 1000;

	animationTask.normal = setInterval(() => {
		currentNormal += (nextNormal - currentNormal) / 2;
		resultNormal.textContent = currentNormal.toFixed(3);

		if (nextNormal - currentNormal < 0.0005) {
			clearInterval(animationTask.normal);
		}
	}, 50);

	animationTask.critical = setInterval(() => {
		currentCritical += (nextCritical - currentCritical) / 2;
		resultCritical.textContent = currentCritical.toFixed(3);

		if (nextCritical - currentCritical < 0.0005) {
			clearInterval(animationTask.critical);
		}
	}, 50);
}
