const Page = require('./helpers/page');

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
}, 30000)

afterEach(async () => {
    await page.close();
});


describe('when logged in', async () => {
    beforeEach(async () => {
       await page.login();
       await page.click('a.btn-floating');
    })

    test('can see create blog button', async () => {
        const label = await page.getContentsOf('form label');
        expect(label).toEqual('Blog Title');
    }, 30000)


    describe('And using valid inputs', async ()=> {

       beforeEach(async ()=> {
          await page.type('.title input', 'My Title');
          await page.type('.content input', 'My Content');
          await page.click('form button');
       }) 
    })
})