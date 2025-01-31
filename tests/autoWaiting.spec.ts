import {expect} from "@playwright/test";
import {test} from '../test-option'


test.beforeEach(async ({page}) => {
  await page.goto(process.env.URL);
  await page.getByText('Button Triggering AJAX Request').click();


})

test('auto waiting', async ({page}) => {
  const successMessage = page.locator('.bg-success')
  const text = await successMessage.textContent()         // textContent() metoda ima auto wait od 30s dok allTextContent metoda nema pa se mora dodati timeout
  expect(text).toEqual('Data loaded with AJAX get request.')
})

test('manual waiting', async ({page}) => {
  const successMessage = page.locator('.bg-success')
  await successMessage.waitFor({state:"attached"})
  const text = await successMessage.allTextContents()
  expect(text).toContain('Data loaded with AJAX get request.')
})

test.skip('alternative waits', async ({page}) => {
  const successMessage = page.locator('.bg-success')
  //wait for element
  // await page.waitForSelector('.bg-success')

  //wait for particular response
  await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

  const text = await successMessage.allTextContents()
  expect(text).toContain('Data loaded with AJAX get request.')
})

test.skip('timeouts', async ({page}) => {
  const successMessage = page.locator('.bg-success')
  await successMessage.click()
})
