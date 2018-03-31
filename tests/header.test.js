const puppeteer = require('puppeteer');

let browser, page;

beforeEach(async () => {
    browser = await puppeteer.launch({
    });
    page = await browser.newPage();
    await page.goto('localhost:3000');
}, 30000)

afterEach(async () => {
    await browser.close();
});

test('Header has the correct State', async () => {
   const text = await page.$eval('a.brand-logo', el => el.innerHTML)
   expect(text).toEqual('Blogster');
}, 30000);

test('Login works!', async () => {
    await page.click('.right a');
    const URL = await page.url();
    expects(URL).toMatch(/accounts\.google\.com/);
}, 30000)
