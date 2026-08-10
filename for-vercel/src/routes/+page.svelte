<script lang="ts">
  import type {PageProps} from "./$types";
  import App, {type Parameter} from "thelow-damage-calculation/App.svelte";
  import MathUtil from "$lib/utils/mathUtil";
  import StringUtil from "$lib/utils/stringUtil";
  import {browser} from "$app/environment";
  import {replaceState} from "$app/navigation";
  import {onMount, tick} from "svelte";

  let {data}: PageProps = $props();
  let params: Parameter | undefined = $state();

  onMount(async () => {
    await tick();
    params = data.params;
  })

  $effect(() => {
    if (!params || !browser)
      return;
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams();
    const formatFractionalValues = function (val: number) {
      if (Number.isInteger(val)) {
        return MathUtil.toBaseIntString(val, 62);
      }

      const intPart = MathUtil.toBaseIntString(Math.trunc(val), 62);
      const fractionalPart = MathUtil.toBaseIntString(
        parseInt(
          StringUtil.reverse(val.toString().split(".")[1])
        ),
        62
      );

      return intPart + "." + fractionalPart;
    };

    if (params.weaponDamage) urlParams.set("wd", formatFractionalValues(params.weaponDamage));
    if (params.specialDamage) urlParams.set("sd", formatFractionalValues(params.specialDamage));
    if (params.parkGain) urlParams.set("pg", formatFractionalValues(params.parkGain));
    if (params.jobGain) urlParams.set("jg", formatFractionalValues(params.jobGain));
    if (params.equipGain) urlParams.set("eg", formatFractionalValues(params.equipGain));
    if (params.numLegendStone !== 0)
      urlParams.set("ns", params.numLegendStone.toString());

    if (params.skill !== "general_attack") urlParams.set("sk", params.skill);

    const ms = Object.keys(params.magicStones)
      .map<number>((val, ind) => params!.magicStones[val] ? 2 ** ind : 0)
      .reduce((pVal, cVal) => pVal + cVal);

    if (ms) {
      urlParams.set("ms", MathUtil.toBaseIntString(ms, 62));
    }

    if (params.strLevel) {
      urlParams.set("str", MathUtil.toBaseIntString(Math.trunc(params.strLevel), 62));
    }

    if (params.dungeonDamageGain) {
      urlParams.set("dd", MathUtil.toBaseIntString(Math.trunc(params.dungeonDamageGain), 62));
    }

    url.search = urlParams.toString();
    replaceState(url, {});
  })
</script>

<svelte:head>
  <title>TheLowダメージ計算機 for Vercel</title>
  <meta
      content="Thelow 非公式のダメージ計算器。機能: スキル使用時の計算、攻撃力上昇エフェクト使用時の計算、レジェンド魔法石使用時の計算"
      name="description"
  />

  <meta content="summary_large_image" name="twitter:card"/>
  <meta content="@taichi3012" name="twitter:site"/>
  <meta content="https://thelow-damage-calculation-taichi3012.vercel.app" property="og:url"/>
  <meta content="TheLowダメージ計算機 for Vercel" property="og:title"/>
  <meta content="Thelow 非公式のダメージ計算器。機能: スキル使用時の計算、攻撃力上昇エフェクト使用時の計算、レジェンド魔法石使用時の計算" property="og:description"/>
  <meta content="image/png" property="og:image:type"/>
  <meta content="1200" property="og:image:width"/>
  <meta content="630" property="og:image:height"/>
  <meta content={data.ogImage} property="og:image"/>
</svelte:head>

{#if params}
  <App bind:params={params}/>
{/if}
