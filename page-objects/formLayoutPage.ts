import {Locator, Page} from "@playwright/test";
import {HelperBase} from "./helperBase";

export class FormLayoutPage extends HelperBase{

  constructor(page: Page) {
    super(page);
  }


  async submitUsingGridFormWithCredentialAndSelectOptions(email: string, password: string, optionText: string) {
    const usingTheGridForm = this.page.locator('nb-card', {hasText:"Using The Grid"})

    await usingTheGridForm.getByRole('textbox', {name:"Email"}).fill(email)
    await usingTheGridForm.getByRole('textbox', {name:"Password"}).fill(password)
    await usingTheGridForm.getByRole('radio', {name: optionText}).check({force: true})
    await usingTheGridForm.getByRole('button').click()

  }
  async submitInLineFormWithNameEmailAndCheckbox(name: string, email: string, rememberMe: boolean) {
    const usingTheInLineForm = this.page.locator('nb-card', {hasText:"Inline form"})
    await usingTheInLineForm.getByRole('textbox', {name:"Jane Doe"}).fill(name)
    await usingTheInLineForm.getByRole('textbox', {name:"Email"}).fill(email)
    if (rememberMe) {
      await usingTheInLineForm.getByRole('checkbox').check({force: true})
    }
    await usingTheInLineForm.getByRole('button').click()
  }

}
