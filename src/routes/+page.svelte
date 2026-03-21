<script lang="ts">
  import type {PageProps} from "./$types";
  import App, {type Parameter} from "$lib/App.svelte";
  import {onMount, tick} from "svelte";
  import {replaceState} from "$app/navigation";

  let {data}: PageProps = $props();
  let params: Parameter | undefined = $state();

  onMount(async () => {
    await tick();
    params = data.params;
  })

  $effect(() => {
    if (!params)
      return;
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams();
    const formatToAlignedNum = function (val: number) {
      if (val !== Math.round(val)) {
        const decDigit = val.toString().split(".")[1].length;

        return (
          Math.round(val * 10 ** decDigit).toString(36) +
          "E" +
          -decDigit.toString(36)
        );
      }

      return val.toString(36);
    };

    if (params.weaponDamage) urlParams.set("wd", formatToAlignedNum(params!.weaponDamage));
    if (params.specialDamage) urlParams.set("sd", formatToAlignedNum(params.specialDamage));
    if (params.parkGain) urlParams.set("pg", formatToAlignedNum(params.parkGain));
    if (params.jobGain) urlParams.set("jg", formatToAlignedNum(params.jobGain));
    if (params.equipGain) urlParams.set("eg", formatToAlignedNum(params.equipGain));
    if (params.numLegendStone !== 0)
      urlParams.set("ns", Number(params.numLegendStone).toString(36));

    if (params.skill !== "general_attack") urlParams.set("sk", params.skill);

    const ms = Object.keys(params.magicStones).reduce((acc, cur) => {
      return acc + (params!.magicStones[cur] ? 1 : 0);
    }, "");

    if (ms !== "000000") {
      urlParams.set("ms", ms);
    }

    if (params.strLevel) {
      urlParams.set("str", params.strLevel.toString(36));
    }

    url.search = urlParams.toString();
    replaceState(url, {});
  })
</script>

<svelte:head>
  <title>TheLowダメージ計算機</title>
  <meta
      name="description"
      content="Thelow 非公式のダメージ計算器。機能: スキル使用時の計算、攻撃力上昇エフェクト使用時の計算、レジェンド魔法石使用時の計算"
  />
</svelte:head>

{#if params}
  <App bind:params={params}/>
{/if}
