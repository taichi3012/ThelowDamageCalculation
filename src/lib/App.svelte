<script lang="ts">
  import "./app.css";
  import {Tween} from 'svelte/motion';
  import {quartOut} from "svelte/easing";
  import {OVER_STRENGTH_VALUES} from "$lib/data/parkData.js";
  import {SKILL_DATA, type SkillProp} from "$lib/data/skillData.js";
  import ThemeButton from "$lib/component/ThemeButton.svelte";
  import ShareButton from "$lib/component/ShareButton.svelte";
  import QuickResultView from "$lib/component/QuickResultView.svelte";

  export interface Parameter {
    weaponDamage: number;
    specialDamage: number;
    parkGain: number;
    jobGain: number;
    equipGain: number;
    numLegendStone: number;
    magicStones: Record<string, boolean>;
    skill: string;
    strLevel: number;
    dungeonDamageGain: number;
  }

  let {
    params = $bindable({
      weaponDamage: 0,
      specialDamage: 0,
      parkGain: 0,
      jobGain: 0,
      equipGain: 0,
      numLegendStone: 0,
      magicStones: {
        level_1: false,
        level_2: false,
        level_3: false,
        level_4: false,
        "level_4.5": false,
        level_5: false
      },
      skill: "general_attack",
      strLevel: 0,
      dungeonDamageGain: 0,
    })
  }: { params: Parameter } = $props();

  let selectedParkGain = $state(0);

  let normalResult = new Tween(
    0,
    {
      delay: 200,
      duration: 1000,
      easing: quartOut
    }
  );
  let criticalResult = new Tween(
    0,
    {
      delay: 200,
      duration: 1000,
      easing: quartOut
    }
  );

  const magicStoneScales: { [key: string]: number } = {
    level_1: 1.1,
    level_2: 1.15,
    level_3: 1.23,
    level_4: 1.35,
    "level_4.5": 1.4,
    level_5: 1.55
  };

  $effect(() => {
    let normal = params.weaponDamage;

    let skillProp: SkillProp = SKILL_DATA[params.skill];
    if (skillProp.specialAttackAvailable) {
      normal += params.specialDamage;
    }
    normal *= skillProp.multiply;

    for (const key of Object.keys(params.magicStones)) {
      if (params.magicStones[key]) {
        normal *= magicStoneScales[key];
      }
    }
    normal *= 1.06 ** Number(params.numLegendStone);

    normal *= 1 + params.dungeonDamageGain / 100;
    normal *= 1 + (params.parkGain + params.jobGain + params.equipGain) / 100;
    normal *= 1 + 0.2 * params.strLevel;
    normalResult.set(normal);
    criticalResult.set(normal * 1.15);
  });
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</svelte:head>

<main>
  <div class="container">
    <h1>Thelowダメージ計算</h1>
    <div class="result padding">
      <div class="vbox nd">
        <small>通常</small>
        <span class="text-big">{normalResult.current.toFixed(2)}</span>
      </div>
      <div class="vbox cd">
        <small>クリティカル</small>
        <span class="text-big">{criticalResult.current.toFixed(2)}</span>
      </div>
    </div>
    <div class="params">
      <div class="panel">
        <div class="category">
          <h2>基本ダメージ</h2>
          <label>
            武器の素ダメージ
            <input
                bind:value={params.weaponDamage}
                placeholder="例:300"
                type="number"
            />
          </label>
          <label>
            特攻値
            <input
                bind:value={params.specialDamage}
                placeholder="例:50"
                type="number"
            />
          </label>
        </div>
        <div class="category">
          <h2>補正</h2>
          <label>
            職業補正(%)
            <input
                bind:value={params.jobGain}
                placeholder="例:10"
                type="number"
            />
          </label>
          <label>
            装備補正(%)
            <input
                bind:value={params.equipGain}
                placeholder="例:10"
                type="number"
            />
          </label>
          <label>
            パーク(%)
            <input
                bind:value={params.parkGain}
                placeholder="例:140"
                type="number"
            />
          </label>
          <label>
            オーバーストレンジ
            <span class="hbox">
              <select bind:value={selectedParkGain} class="flex-grow-3">
                {#each OVER_STRENGTH_VALUES as v, i}
                  <option value={v}>{i}</option>
                {/each}
              </select>
              <button
                  class="flex-grow-1 pointer"
                  onclick={() => params.parkGain = selectedParkGain}
              >
                OS値適用
              </button>
            </span>
          </label>
        </div>
      </div>
      <div class="panel">
        <div class="category">
          <h2>魔法石</h2>
          <label>
            特攻魔法石Level1
            <input
                bind:checked={params.magicStones.level_1}
                id="ms1"
                type="checkbox"
            />
          </label>
          <label>
            特攻魔法石Level2
            <input
                bind:checked={params.magicStones.level_2}
                id="ms2"
                type="checkbox"
            />
          </label>
          <label>
            特攻魔法石Level3
            <input
                bind:checked={params.magicStones.level_3}
                id="ms3"
                type="checkbox"
            />
          </label>
          <label>
            特攻魔法石Level4
            <input
                bind:checked={params.magicStones.level_4}
                id="ms4"
                type="checkbox"
            />
          </label>
          <label>
            特攻魔法石Level4.5
            <input
                bind:checked={params.magicStones["level_4.5"]}
                id="ms4.5"
                type="checkbox"
            />
          </label>
          <label>
            特攻魔法石Level5 or Legend
            <input
                bind:checked={params.magicStones.level_5}
                type="checkbox"
            />
          </label>
          <label class="vbox margin-1/2em">
            レジェンド魔法石個数
            <select bind:value={() => params.numLegendStone.toString(), (v) => params.numLegendStone = Number(v)}>
              <option value="0">0個</option>
              <option value="1">1個</option>
              <option value="2">2個</option>
              <option value="3">3個</option>
            </select>
          </label>
        </div>
        <div class="category">
          <h2>その他</h2>
          <label>
            スキル
            <select bind:value={params.skill}>
              {#each Object.keys(SKILL_DATA) as id}
                <option value={id}>{SKILL_DATA[id].name}</option>
              {/each}
            </select>
          </label>
          <label>
            攻撃力上昇エフェクトLv
            <input
                bind:value={params.strLevel}
                placeholder="例:5"
                type="number"
            />
          </label>
          <label>
            特定の敵に対してダメージ増加(合計%)
            <input
                bind:value={params.dungeonDamageGain}
                placeholder="例:5"
                type="number"
            />
          </label>
        </div>
      </div>
    </div>
    <p class="text-center">
      ※特攻値の乗らないスキル(ショックストーンなど)は、特攻値を除いて計算しています。
    </p>
  </div>
  <QuickResultView criticalResult={criticalResult.current} normalResult={normalResult.current}/>
  <div class="top-button">
    <ThemeButton/>
    <ShareButton/>
  </div>
</main>

<style>
  .container {
    display: flex;
    flex-direction: column;
    margin: auto;
    align-content: center;
    max-width: 1000px;
    min-height: 100vh;
  }

  .top-button {
    display: flex;
    flex-direction: row;
    position: fixed;
    top: 0;
    right: 0;
    margin: 1em;
  }

  .params {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .result {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    text-align: center;
  }

  @media screen and (max-width: 640px) {
    .container {
      margin: 0 0.4em;
      overflow-x: clip;
    }

    .top-button {
      margin: 0.5em;
      top: anchor(--result-view bottom, 0);
      transition: top 500ms;
    }

    .params {
      display: flex;
      flex-direction: column;
      anchor-name: --params;
    }

    .result {
      flex-direction: column;
    }
  }

  .panel {
    display: flex;
    flex-direction: column;
    min-width: 40%;
    padding: 1em;
    justify-content: space-between;
  }

  .category {
    display: flex;
    flex-direction: column;
  }

  .category label:not(:has(input[type=checkbox])) {
    display: flex;
    flex-direction: column;
    margin: 0.5em;
  }

  input[type=number] {
    color: var(--text-main);
    background: var(--bg-sub);
    border: 1px solid var(--text-sub);
    font: inherit;
    padding: 0.3em 0.6em;
    margin: 0.2em;
    border-radius: 0.4em;
    outline: none;
  }

  button {
    color: var(--text-main);
    background: var(--bg-sub);
    border: 1px solid var(--text-sub);
    font: inherit;
    padding: 0.3em 0.6em;
    margin: 0.2em;
    border-radius: 0.4em;
    outline: none;
    line-height: 0;
  }

  input[type=checkbox] {
    display: none;
  }

  label:has(input[type=checkbox]) {
    align-self: start;
    user-select: none;
    margin-left: 1em;
  }

  label:has(input[type=checkbox])::before {
    font-family: 'Material Icons';
    content: "\e835";
    display: inline-block;
    cursor: pointer;
    font-size: 1.4em;
    position: relative;
    top: 0.3em;
    left: -0.2em;
  }

  label:has(input[type=checkbox]:checked)::before {
    content: "\e876";
  }

  select {
    color: var(--text-main);
    background: var(--bg-sub);
    border: 1px solid var(--text-sub);
    font: inherit;
    padding: 0.3em 0.6em;
    margin: 0.2em;
    border-radius: 0.4em;
    outline: none;
  }

  select::-webkit-scrollbar {
    width: 12px;
    background: transparent;
  }

  select::-webkit-scrollbar-thumb {
    background: #999;
    border-radius: 6px;
    border: 3px solid transparent;
    -webkit-background-clip: content-box;
    background-clip: content-box;
  }
</style>
