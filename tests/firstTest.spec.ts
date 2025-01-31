import {expect, test} from "@playwright/test";


test.beforeEach(async ({page}) => {
  await page.goto('/');
  await page.getByText('Forms').click();
  await page.getByText('Form Layouts').click();
})

test('Locators syntax rules',async ({page}) => {
  //by tag names
  await page.locator('input').first().click()

  //by ID
  page.locator('#inputEmail1').click()

  //by class names
  page.locator('.shape-rectangle')

  //by attribute
  page.locator('[placeholder="Email"]')

  //by Class value (full)
  page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

  //by combined different selectors
  page.locator('input[placeholder="Email"]')

  //by Xpath (NOT RECOMENDED)
  page.locator('//input[@id=\'inputEmail1\']')

  //by partial text match
  page.locator(':text("Using")')
})

test.skip('User facing locators',async ({page}) => {
   await page.getByRole('textbox', {name: "Email"}).first().click()
   await page.getByRole('button', {name: 'Sign in'}).first().click()

   await page.getByLabel('Email').first().click()

   await page.getByPlaceholder('Jane Doe').click()

   await page.getByText('Using the Grid').click()

   await page.getByTitle('Iot Dashboard').click()

   await page.getByTestId('SignIn').click()
})

test('Locating child elements',async ({page}) => {
  await page.locator('nb-card nb-radio :text("Option 1")').click()
  await page.locator('nb-card').locator('nb-radio').locator(':text("Option 2")').click()   // same as above

  //combination regular locators and user facing locators
  await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()

  //index of the element (avoid this approach, index could be changed)
  await page.locator('nb-card').nth(3).getByRole('button').click()

})

test('Locating parent elements',async ({page}) => {
  await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name:"Email"}).click()
  await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name:"Email"}).click()

  await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('button').click()
  await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name:"Email"}).click()

  //             find all nb cards        filter them by "nb-checkbox"        and      filter by text "Sign in"
  await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('button').click()

  // xpath
  await page.locator(':text("Using the Grid")').locator('..').getByRole('textbox', {name:"Email"}).click()
})

test('Reusing the locators',async ({page}) => {
  const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})

  const emailField = basicForm.getByRole('textbox', {name:"Email"})
  const passwordField = basicForm.getByRole('textbox', {name:"Password"})
  const checkbox = basicForm.locator('nb-checkbox')
  const loginButton = basicForm.getByRole('button')


  await emailField.fill('test@test.com')
  await passwordField.fill('Password123')
  await checkbox.click()
  await loginButton.click()

  // assert

  await expect(emailField).toHaveValue('test@test.com')
  await expect(passwordField).toHaveValue('Password123')
})

test('extracting values',async ({page}) => {
  //single test value
  const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
  const buttonText = await basicForm.locator('button').textContent()
  //assert
  expect(buttonText).toEqual('Submit')

  //all test values
  const allRadioButtonsLabels =  await page.locator('nb-radio').allTextContents()
  expect(allRadioButtonsLabels).toContain('Option 1')

  //dohvatiti input value koji prikazan ali ga nema u konzoli
  const emailField = basicForm.getByRole('textbox', {name:"Email"})
  await emailField.fill('test@test.com')
  const emailValue= await emailField.inputValue()
  expect(emailValue).toEqual('test@test.com')
})

test('assertions',async ({page}) => {
  const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')

  //General assertions
  const value = 5
  expect(value).toEqual(5)

  const text = await basicFormButton.textContent()
  expect(text).toEqual('Submit')

  //Locator assertion
  expect(basicFormButton).toHaveText('Submit')

  //soft assertion -test continue even expect failed
  await expect.soft(basicFormButton).toHaveText('Submit')
  await basicFormButton.click()
})
