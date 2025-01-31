import {Page} from "@playwright/test";
import {HelperBase} from "./helperBase";

export class NavigationPage extends HelperBase {

  constructor(page: Page) {
    super(page);
  }

  async formLayoutPage() {
    await this.selectGroupMenuItems('Forms')
    await this.page.getByText('Form Layouts').click()
    await this.waitForNumberOfSeconds(2)
  }

  async datepickerPage() {
    await this.selectGroupMenuItems('Forms')          //prevent another click because item is already opened
    await this.page.getByText('Datepicker').click()
  }

  async smartTablePage() {
    await this.selectGroupMenuItems('Tables & Data')
    await this.page.getByText('Smart Table').click()
  }

  async toastrPage() {
    await this.selectGroupMenuItems('Modal & Overlays')
    await this.page.getByText('Toastr').click()
  }

  async tooltipPage() {
    await this.selectGroupMenuItems('Modal & Overlays')
    await this.page.getByText('Tooltip').click()
  }

  //check if menu is expanded or not
  private async selectGroupMenuItems(groupItemTitle: string) {
    const groupMenuItem = this.page.getByTitle(groupItemTitle)
    const expandedState = await groupMenuItem.getAttribute('aria-expanded')

    if (expandedState == "false") {
      await groupMenuItem.click();
    }
  }

}
