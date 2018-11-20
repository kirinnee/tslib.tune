import {IPage} from "./Helper";

let pages :IPage = {
	chunks: [
		["index", "./test/e2e/SoundTest.ts"]
	],
	pages: [
		{
			template: "index.html",
			output: "index.html",
			chunks: ['index'],
			title: 'Index'
		}
	],
};

export {pages};