import {test} from "../test-option";
import {faker} from "@faker-js/faker";


test('parametrized methods', async ({pageManager}) => {
  //generate random name and email
  const randomFullName = faker.person.fullName()
  const randomEmail = `${randomFullName.replace(' ','')}${faker.number.int(1000)}@test.com`     //replace space in name with no space

  await pageManager.onFormLayoutPage().submitUsingGridFormWithCredentialAndSelectOptions(process.env.USERNAME, process.env.PASSWORD, 'Option 1')
  await pageManager.onFormLayoutPage().submitInLineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
})


// test.afterEach(async ({page}) => {
//   await new Promise(resolve => setTimeout(resolve, 5000));   //keep browser open for 10second
// })
