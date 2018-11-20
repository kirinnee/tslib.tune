import {Selector} from 'testcafe';


fixture`Index Page`.page`./targets/index.html`;

test('All Sound should be ok', async t => {
	await t
		.click('#test-start');
	let value = await Selector("#realtestresult").textContent;
	await t.wait(120000);
	await t.expect(value).eql("OKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOK");
});