const Page = require('./helpers/page');

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
}, 30000)

afterEach(async () => {
    await page.close();
});

test('when logged in, can see create blog button', async () => {
    await page.login();
    await page.click('a.btn-floating');
    const label = await page.getContentsOf('form label');
    expect(label).toEqual('Blog Title');
}, 30000)