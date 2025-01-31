import {expect} from "@playwright/test";
import {test} from '../test-option'

test.beforeEach(async ({page, globalsQaURL}) => {
  await page.goto(globalsQaURL);
})

test('drag and drop with Iframe', async ({page}) => {
  const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')

  await frame.locator('li', {hasText: "High Tatras 2"}).dragTo(frame.locator('#trash'))

  //more precise control
  await frame.locator('li', {hasText: "High Tatras 4"}).hover()
  await page.mouse.down()
  await frame.locator('#trash').hover()
  await page.mouse.up()
  await page.waitForTimeout(500)

  await expect(frame.locator('#trash li h5')).toHaveText(["High Tatras 2", "High Tatras 4"]);
})
