import {ImageResponse} from '@vercel/og';
import {SKILL_DATA} from "thelow-damage-calculation";
import checkBox from "$lib/icons/check_box_black_36dp.svg";
import checkBoxOutline from "$lib/icons/check_box_outline_blank_black_36dp.svg";
import type {Parameter} from "thelow-damage-calculation/App.svelte";
import type {ReactElement} from "react";

async function getImageResponse(element: ReactElement) {
  return new ImageResponse(
    element,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Noto Sans JP",
          data: await loadGoogleFont("Noto+Sans+JP", 500),
          weight: 500,
          style: "normal"
        },
        {
          name: "Noto Sans JP",
          data: await loadGoogleFont("Noto+Sans+JP", 700),
          weight: 700,
          style: "normal"
        }
      ],
    },
  );
}

async function loadGoogleFont(font: string, weight: number) {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);
  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error('failed to load font data');
}

export function getTitleImage() {
  return getImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "white",
        fontFamily: "Noto Sans JP",
        fontSize: "100px",
        fontWeight: "bold"
      }}
    >
      TheLowダメージ計算
    </div>
  )
}

export function getParametersImage(params: Parameter) {
  const magicStoneScales: { [key: string]: number } = {
    level_1: 1.1,
    level_2: 1.15,
    level_3: 1.23,
    level_4: 1.35,
    "level_4.5": 1.4,
    level_5: 1.55,
  };
  const magicStoneDisplayNames: { [key: string]: string } = {
    level_1: "魔法石Level1",
    level_2: "魔法石Level2",
    level_3: "魔法石Level3",
    level_4: "魔法石Level4",
    "level_4.5": "魔法石Level4.5",
    level_5: "魔法石Level5 or Leg",
  };
  let magicStoneMul = Object.entries(params.magicStones)
    .filter(v => v[1])
    .reduce((pv, cv) => pv * magicStoneScales[cv[0]], 1);
  let skillData = SKILL_DATA[params.skill] || SKILL_DATA["general_attack"];

  let resultDamage = findValue();
  let normalResult = resultDamage.toFixed(2);
  let criticalResult = (resultDamage * 1.15).toFixed(2);

  function findValue() {
    let value = 0;
    value += params.weaponDamage + (skillData.specialAttackAvailable ? params.specialDamage : 0);
    value *= magicStoneMul;
    value *= (100 + params.parkGain + params.jobGain + params.equipGain) / 100;
    value *= skillData.multiply;
    value *= 1 + 0.2 * params.strLevel;
    value *= 1.06 ** params.numLegendStone;

    return value
  }

  function getSigned(num: number) {
    return num > 0 ? "+" + num : num;
  }

  const boldNumsCharRatio = 0.589;
  const boldPeriodsCharRatio = 0.325;

  function clacFontSize(text: string, width: number, defaultSize: number, minSize: number) {
    let sum = 0;
    for (const char of text) {
      sum += char.match(/^[0-9]$/) ? boldNumsCharRatio
        : char == "." ? boldPeriodsCharRatio
          : 0;
    }

    return Math.max(minSize, Math.min(defaultSize, (width - 30) / sum));
  }

  return getImageResponse(
    <div style={{
      display: "flex",
      flexDirection: "row",
      width: "100%",
      height: "100%",
      alignItems: "stretch",
      backgroundColor: "white",
      fontFamily: "Noto Sans JP",
      fontWeight: 500,
      fontSize: "28px",
      gap: "0.5em"
    }} lang="ja-JP">
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        width: "35%"
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          通常
          <span
            style={{fontWeight: "bold", fontSize: `${clacFontSize(normalResult, 420, 80, 20)}px`}}>{normalResult}</span>
        </div>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          クリティカル
          <span style={{
            fontWeight: "bold",
            fontSize: `${clacFontSize(criticalResult, 420, 80, 20)}px`
          }}>{criticalResult}</span>
        </div>
      </div>
      <div style={{
        display: "flex",
        flexDirection: "row",
        margin: "1em 1em 1em auto",
        gap: "1em",
        flexGrow: 1
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5em",
          flexGrow: 1,
          alignItems: "stretch"
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch"
          }}>
            <span style={{
              alignSelf: "stretch",
              marginBottom: "0.2em",
              borderBottom: "2px solid",
              fontSize: "32px",
              fontWeight: "bold"
            }}>基礎ダメージ</span>
            <div style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between"
            }}>
              武器ダメージ
              <span>{getSigned(params.weaponDamage)}</span>
            </div>
            <div style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between"
            }}>
              特攻値
              <span>{getSigned(params.specialDamage)}</span>
            </div>
          </div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch"
          }}>
            <span style={{
              alignSelf: "stretch",
              marginBottom: "0.2em",
              borderBottom: "2px solid",
              fontSize: "32px",
              fontWeight: "bold"
            }}>魔法石</span>
            <div style={{
              display: "flex",
              flexDirection: "column"
            }}>
              {Object.entries(params.magicStones).map((e) => (
                <div style={{
                  display: "flex",
                  flexDirection: "row",
                }}>
                  <span style={{alignSelf: "center"}}>
                    <img
                      src={e[1] ? checkBox : checkBoxOutline}
                      width={32}
                      height={32}
                      alt={""}/>
                  </span>
                  <span>{magicStoneDisplayNames[e[0]]}</span>
                </div>
              ))}
            </div>
            <div style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between"
            }}>
              レジェンド魔法石
              <span>{`${params.numLegendStone}個`}</span>
            </div>
            <div style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: "0.2em",
              borderTop: "2px solid"
            }}>
              倍率(四捨五入)
              <span>{`×${(magicStoneMul * (1.06 ** params.numLegendStone)).toFixed(3)}`}</span>
            </div>
          </div>
        </div>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5em",
          flexGrow: 1,
          alignItems: "stretch"
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch"
          }}>
            <span style={{
              alignSelf: "stretch",
              marginBottom: "0.2em",
              borderBottom: "2px solid",
              fontSize: "32px",
              fontWeight: "bold"
            }}>加算値</span>
            <div style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between"
            }}>
              パーク
              <span>{`${params.parkGain}%`}</span>
            </div>
            <div style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between"
            }}>
              職業補正
              <span>{`${params.jobGain}%`}</span>
            </div>
            <div style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between"
            }}>
              装備補正
              <span>{`${params.equipGain}%`}</span>
            </div>
            <div style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: "0.2em",
              borderTop: "2px solid"
            }}>
              合計
              <span>{`${params.parkGain + params.jobGain + params.equipGain}%`}</span>
            </div>
          </div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch"
          }}>
            <span style={{
              alignSelf: "stretch",
              marginBottom: "0.2em",
              borderBottom: "2px solid",
              fontSize: "32px",
              fontWeight: "bold"
            }}>その他</span>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5em"
            }}>
              <div style={{
                display: "flex",
                flexDirection: "column"
              }}>
                スキル
                <span>{skillData.name}</span>
              </div>
              <div style={{
                display: "flex",
                flexDirection: "column"
              }}>
                攻撃力上昇エフェクト
                <span>{`Level${params.strLevel}`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
