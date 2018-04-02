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

    describe('when login, test invalid inputs', async ()=> {

        beforeEach(async ()=> {
            await page.click('form button');
        });
        
        test('the form shows an Error message', async ()=> {
          const titleError = await page.getContentsOf('.title .red-text');
          const contentError = await page.getContentsOf('.content .red-text');
          expect(titleError).toEqual('You must provide a value');
          expect(contentError).toEqual('You must provide a value');
        });
    });
})