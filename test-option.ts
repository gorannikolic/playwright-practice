import {test as base} from '@playwright/test'
import {PageManager} from "./page-objects/pageManager";

export type TestOption = {
  globalsQaURL: string,
  formLayoutPage: string,
  pageManager: PageManager,

}

export const test = base.extend<TestOption>({
  globalsQaURL: ['', {option: true}],

  formLayoutPage: [async ({page}, use) => {
    await page.goto('/');
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
    await use('')
  }, {auto: true}], // this means this will be executed before everything

  pageManager: async ({page, formLayoutPage}, use) => {
    const projectManager = new PageManager(page)
    await use(projectManager)
  }
})
