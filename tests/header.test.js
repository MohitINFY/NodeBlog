const Page = require('./helpers/page');

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
}, 30000)

afterEach(async () => {
    await page.close();
});

test('Header has the correct State', async () => {
   const text = await page.getContentsOf('a.brand-logo');
   console.log(text);
   expect(text).toEqual('Blogster');
}, 30000);

test('Login works!', async () => {
    await page.click('.right a');
    const URL = await page.url();
    expect(URL).toMatch(/accounts\.google\.com/);
}, 30000)

test('when Signs in, shows logout button', async() => {
    await page.login();
    const text = await page.getContentsOf('a[href="/auth/logout"]');
    expect(text).toEqual('Logout');
}, 30000)