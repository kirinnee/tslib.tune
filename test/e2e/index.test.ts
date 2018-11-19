import { Selector } from 'testcafe';


fixture `Index Page`.page `./targets/index.html`;

test('Check if reversing input works', async t => {
    await t
        .typeText('input', 'kirinnee')
        .click('button');

    let value =  await Selector("#target").textContent;

    await t.expect(value).eql("eennirik"); 
});