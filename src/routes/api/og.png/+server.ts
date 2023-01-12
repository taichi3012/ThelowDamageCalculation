import { dev } from "$app/environment";
import NotoSansBold from "$lib/fonts/NotoSansJP/NotoSansJP-Bold.otf?base64";
import NotoSansMedium from "$lib/fonts/NotoSansJP/NotoSansJP-Medium.otf?base64";
import ImageTemplate from "$lib/og/ImageTemplate.svelte";
import MathUtil from "$lib/utils/mathUtil";
import StringUtil from "$lib/utils/stringUtil";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { html as toReactNode } from "satori-html";

import type { RequestHandler } from "./$types";

export const GET = (async ({ url }) => {
	const searchParams = url.searchParams;
	let reactNode;

	if (!searchParams.toString()) {
		reactNode = toReactNode`
			<div
				style="
					display: flex;
					flex-direction: column;
					width: 100%;
					height: 100%;
					justify-content: space-around;
					align-items: center;
					background-color: white;
					font-family: 'Noto Sans JP';
					font-size: 100px;
					font-weight: bold;
				"
			>
				TheLowダメージ計算
			</div>
		`;
	} else {
		const parseFractionalValues = (string: string) => {
			const arr = string.split(".");
			let val = MathUtil.parseBaseInt(arr[0], 62).toString();

			if (arr[1]) {
				val += ".";
				val += parseInt(
					StringUtil.reverse(
						MathUtil.parseBaseInt(arr[1], 62).toString()
					)
				);
			}

			let result = parseFloat(val);

			return result ? result : 0;
		};

		const msFlg: number = searchParams.has("ms") ? MathUtil.parseBaseInt(searchParams.get("ms")!, 62) : 0;
		const componentProps = {
			weaponDamage: searchParams.has("wd") ? parseFractionalValues(searchParams.get("wd")!) : 0,
			specialDamage: searchParams.has("sd") ? parseFractionalValues(searchParams.get("sd")!) : 0,
			parkGain: searchParams.has("pg") ? parseFractionalValues(searchParams.get("pg")!) : 0,
			jobGain: searchParams.has("jg") ? parseFractionalValues(searchParams.get("jg")!) : 0,
			equipGain: searchParams.has("eg") ? parseFractionalValues(searchParams.get("eg")!) : 0,
			numLegendStone: searchParams.has("ns") ? parseInt(searchParams.get("ns")!) || 0 : 0,
			skill: searchParams.has("sk") ? searchParams.get("sk") : "general_attack",
			strLevel: searchParams.has("str") ? MathUtil.parseBaseInt(searchParams.get("str")!, 62) : 0,
			magicStone: {
				level_1: ((msFlg >> 0) & 1) == 1,
				level_2: ((msFlg >> 1) & 1) == 1,
				level_3: ((msFlg >> 2) & 1) == 1,
				level_4: ((msFlg >> 3) & 1) == 1,
				"level_4.5": ((msFlg >> 4) & 1) == 1,
				level_5: ((msFlg >> 5) & 1) == 1,
			},
		}

		const markup = (ImageTemplate as any).render(componentProps);
		reactNode = toReactNode(`${markup.html}<style>${markup.css.code}</style>`);
	}

	const svg = await satori(
		reactNode,
		{
			width: 1200,
			height: 630,
			debug: false,
			fonts: [
				{
					name: "Noto Sans JP",
					data: Buffer.from(NotoSansMedium, "base64"),
					weight: 500,
					style: "normal"
				},
				{
					name: "Noto Sans JP",
					data: Buffer.from(NotoSansBold, "base64"),
					weight: 700,
					style: "normal"
				},
			],
		}
	);

	const img = new Resvg(svg).render().asPng();

	const init: ResponseInit = {
		status: 200,
		headers: { "Content-Type": "image/png", "Cache-Control": dev ? "max-age=0" : "max-age=604800" },
	};

	return (new Response(img, init));
}) satisfies RequestHandler;