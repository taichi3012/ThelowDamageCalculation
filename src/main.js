import App from "./App.svelte";
import { skill_data } from "./data/skilldata";
import { over_strength_values } from "./data/parkdata";

const app = new App({
	target: document.body,
	props: {
		skill_data,
		over_strength_values,
	},
});

export default app;
