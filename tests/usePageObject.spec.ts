import {test} from "@playwright/test";
import {PageManager} from "../page-objects/pageManager";
import {faker} from "@faker-js/faker";

test.beforeEach(async ({page}) => {
  await page.goto('/');
})

test('navigate to form page', async ({page}) => {
  const pageManager = new PageManager(page);
  await pageManager.navigateTo().formLayoutPage()
  await pageManager.navigateTo().datepickerPage()
  await pageManager.navigateTo().smartTablePage()
  await pageManager.navigateTo().toastrPage()
  await pageManager.navigateTo().tooltipPage()
})

test('parametrized methods', async ({page}) => {
  const pageManager = new PageManager(page);
  //generate random name and email
  const randomFullName = faker.person.fullName()
  const randomEmail = `${randomFullName.replace(' ','')}${faker.number.int(1000)}@test.com`     //replace space in name with no space

  await pageManager.navigateTo().formLayoutPage()
  await pageManager.onFormLayoutPage().submitUsingGridFormWithCredentialAndSelectOptions(process.env.USERNAME, process.env.PASSWORD, 'Option 1')
  await pageManager.onFormLayoutPage().submitInLineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
})

test.skip('using datePicker', async ({page}) => {
  const pageManager = new PageManager(page);
  await pageManager.navigateTo().formLayoutPage()
  await pageManager.navigateTo().datepickerPage()
  await pageManager.onDatePickerPage().selectCommonDatePickerDateFromToday(7)
  await pageManager.onDatePickerPage().selectDatePickerWithRangeFromToday(1, 15)
})

