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

       test('submiting takes to User Screen', async ()=> {
          await page.waitFor('h5');
          const text = page.getContentsOf('h5');
          expect(text).toEqual('Please confirm your entries');
       });

    //    test('Final submit takes back to Index Screen', async ()=> {
    //        await page.click('button.green');
    //        await page.waitFor('.card');
    //        const title = page.getContentsOf('.card-title');
    //        console.log("title"+ JSON.stringify(title));
    //        expect(title).toEqual('My title');
    //    });

    })