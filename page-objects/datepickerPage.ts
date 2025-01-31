import {expect, Page} from "@playwright/test";
import {HelperBase} from "./helperBase";

export class DatepickerPage extends HelperBase{

  constructor(page: Page) {
    super(page);
  }

  async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
    const calendarInputField = this.page.getByPlaceholder('Form Picker')
    await calendarInputField.click()
    const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday)
    await expect(calendarInputField).toHaveValue(dateToAssert)
  }

  async selectDatePickerWithRangeFromToday(startDayFromToday: number, endDayFromToday: number) {
    const calendarInputField = this.page.getByPlaceholder('Range Picker')
    await calendarInputField.click()
    const dateToAssertStart = await this.selectDateInTheCalendar(startDayFromToday)
    const dateToAssertEnd = await this.selectDateInTheCalendar(endDayFromToday)
    const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
    await expect(calendarInputField).toHaveValue(dateToAssert)

  }

  //private metoda u kojoj je logika za select datuma u kalendaru
  private async selectDateInTheCalendar(numberOfDaysFromToday: number) {
    let date = new Date();
    date.setDate(date.getDate() + numberOfDaysFromToday);                           //55 dana od danas
    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})//taking short version of Month string
    const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    //za slucaj kada datum nije u ovom mjesecu
    let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()    //uzmi trenutni datum
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`                      //uzmi ocekivani datum
    while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {                                   //ako datum ne pripada tom mesecu
      await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()    //klikni na dugme za prebacivanje na sledeci mjesec
      calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
    }

    await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, {exact: true}).click()     //{exact:true} je dodano jer getByText metoda razi parcijalno poklapanje pa ce pronaci sve brojeve koji sadrze "1"
    return dateToAssert
  }
}
