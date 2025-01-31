import {test} from "@playwright/test";


test('input fields on mobile device', async ({page}, testInfo) => {
  await page.goto('/')

// u zavisnsti koji je projekat definisan u config.ts file pokreni ili u mobile emulatoru ili desktop modu
  if(testInfo.project.name == 'mobile') {
    await page.locator('ngx-header').getByRole('link').first().click()
  }

  await page.getByText('Forms').click()
  await page.getByText('Form Layouts').click()

  if(testInfo.project.name == 'mobile') {
    await page.locator('ngx-header').getByRole('link').first().click()
  }
  const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using The Grid"}).getByRole('textbox', {name: "Email"})
  await usingTheGridEmailInput.fill("Test@test.com");  // pass some value to input field
  await usingTheGridEmailInput.clear()    // clear value from inout field
  await usingTheGridEmailInput.pressSequentially("Test@test2.com");  //pass value to the field simulating keyboard typing

})
