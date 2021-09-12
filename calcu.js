document.getElementById("atkdmg").oninput = () => {
    let calcuBottan = document.getElementById("calcubutton");
    if (document.getElementById("atkdmg").value) {
        calcuBottan.disabled = false;
        calcuBottan.value = "クリックでダメージ計算";
    } else {
        calcuBottan.disabled = true;
        calcuBottan.value = "攻撃力を入力してください";
    }
};



let skillIdFrom = new Map();
let skillData = skill_data.sort((a, b) => {
    if (Number(a.selectorIndex) < Number(b.selectorIndex)) return -1;
    if (Number(a.selectorIndex) > Number(b.selectorIndex)) return 1;
    return 0;
});
let skillSelector = document.getElementById("skill");

for (const data of skillData) {
    let option = document.createElement("option");
    option.text = data.name;
    option.value = data.id;
    skillSelector.appendChild(option);
    skillIdFrom.set(data.id, new Map([
        ["name", data.name], 
        ["selectorIndex", data.selectorIndex], 
        ["multiply", data.multiply], 
        ["availabilSpecial", data.availabilSpecial]
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
    console.log(overStrengthSelector.selectedIndex);
    let parkInput = document.getElementById("park");
    parkInput.value = parkValue; 
}

function calcuDmg() {
    let weaponDmg = document.getElementById("atkdmg");
    let specialDmg = document.getElementById("specialdmg");
    let park = document.getElementById("park");
    let job = document.getElementById("job");
    let armor = document.getElementById("armor")
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
            multiplyDmg *= k === "1" ? 1.10
                         : k === "2" ? 1.15
                         : k === "3" ? 1.23
                         : k === "4" ? 1.35
                         : k === "4.5" ? 1.4 
                         : k === "5" ? 1.55
                         : 1;
        }
    });
    multiplyDmg *= selectedSkillMap.get("multiply");
    multiplyDmg *= strEffct.value ? 1 + 0.2 * Number(strEffct.value) : 1;
    multiplyDmg *= 1.06 ** Number(legend.value);
    result *= multiplyDmg;
    document.getElementById("result_normal").textContent = Math.floor(result * 1000) /1000;
    document.getElementById("result_critical").textContent = Math.floor(result * 1.15 * 1000) /1000;
}