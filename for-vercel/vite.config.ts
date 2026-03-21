import fs from 'fs';
import { sveltekit } from '@sveltejs/kit/vite';

import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit(), base64()]
};

async function base64() {
	return {
		name: 'vite-plugin-transform-base64',
		async transform(code: string, id: string) {
			if (id.endsWith('?base64')) {
				const base64 = fs.readFileSync(id.replace('?base64', ''), 'base64');

				return {
					code: `export default ${JSON.stringify(base64)}`,
					map: null
				}
			}
		}
	}
}

export default config;
