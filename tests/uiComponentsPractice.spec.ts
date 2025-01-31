import {expect, test} from "@playwright/test";

test.describe.configure({mode: 'parallel'})  // run test in this spec file in parallel mode

test.beforeEach(async ({page}) => {
  await page.goto('/');
})

//test layout
test.describe('Form Layout page', () => {
  test.beforeEach(async ({page}) => {
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
  })

  test('input fields', async ({page}) => {
    const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using The Grid"}).getByRole('textbox', {name: "Email"})

    await usingTheGridEmailInput.fill("Test@test.com");  // pass some value to input field
    await usingTheGridEmailInput.clear()    // clear value from inout field
    await usingTheGridEmailInput.pressSequentially("Test@test2.com");  //pass value to the field simulating keyboard typing

    //generic assertion
    const inputValue = await usingTheGridEmailInput.inputValue();
    expect(inputValue).toEqual("Test@test2.com");

    //locator assertion
    await expect(usingTheGridEmailInput).toHaveValue("Test@test2.com");
  })

  test.only('radio buttons', async ({page}) => {
    const usingTheGridForm = page.locator('nb-card', {hasText: "Using The Grid"})

    await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true}) // located element and checked with check() method
    const radioButtonStatus = await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()

    await expect(usingTheGridForm).toHaveScreenshot()
    //generic assertion
    // expect(radioButtonStatus).toBeTruthy()
    // //locator assertion
    // await expect(usingTheGridForm.getByRole('radio', {name: "Option 1"})).toBeChecked()

    //select option two and validate that first option is unchecked
    // await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true})
    // expect(await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
    // expect(await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()
  })
})

//test layout
test.describe('Toastr Layout page', () => {
  test.beforeEach(async ({page}) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Toastr').click();
  })

  test('checkbox', async ({page}) => {
    await page.getByRole('checkbox', {name: 'Hide on click'}).uncheck({force: true})
    await page.getByRole('checkbox', {name: 'Prevent arising of duplicate toast'}).check({force: true})
  })

  test('select or unselect all checkboxes', async ({page}) => {
    const allCheckboxes = page.getByRole('checkbox')
    for (const box of await allCheckboxes.all()) {
      await box.check({force: true})
      expect(await box.isChecked()).toBeTruthy()    //for uncheck scenario change method to uncheck() and method toBeFalsy()
    }
  })
})

test('lists and dropdowns', async ({page}) => {
  const dropdownMenuButton = page.locator('ngx-header nb-select')
  await dropdownMenuButton.click()

  page.getByRole('list')  //when list has UL tag
  page.getByRole('listitem')  //when list has LI tag

  const optionList = page.locator('nb-option-list nb-option')
  //assertion checking if all items are in list

  await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
  await optionList.filter({hasText: "Cosmic"}).click()
  //validate if color is changed
  const header = page.locator('nb-layout-header')
  await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

  //validate every color change
  // const colors = {
  //   "Light": "rgb(255,255,255)",
  //   "Dark": "rgb(34,43,69)",
  //   "Cosmic": "rgb(50, 50, 89)",
  //   "Corporate": "rgb(255,255,255)"
  // }
  // for(const color in colors) {
  //   await optionList.filter({hasText: color}).click()
  //   await expect(dropdownMenuButton).toHaveCSS('background-color', colors[color])
  //   await dropdownMenuButton.click()
  // }
})

test('tooltips', async ({page}) => {
  await page.getByText('Modal & Overlays').click();
  await page.getByText('Tooltip').click();

  const tooltipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
  await tooltipCard.getByRole('button', {name: "TOP"}).hover()

  page.getByRole('tooltip')  //if you have role tooltip added to element

  //general assertion
  const tooltip = await page.locator('nb-tooltip').textContent()
  expect(tooltip).toEqual("This is a tooltip")
})

// browser dialog box and performing accept action
test('dialog box', async ({page}) => {
  await page.getByText('Tables & Data').click();
  await page.getByText('Smart Table').click();

  //creating listener to listen dialog event
  page.on('dialog', dialog => {
    expect(dialog.message()).toEqual("Are you sure you want to delete?")
    dialog.accept()
  })
  await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()
  await expect(page.locator('table tr').first()).not.toHaveText("mdo@gmail.com")
})

test('web tables', async ({page}) => {
  await page.getByText('Tables & Data').click();
  await page.getByText('Smart Table').click();

  //get row by any text in that row
  const targetRow = page.getByRole('row', {name: 'twitter@outlook.com'})  //this locator do not work after is edit button clicked because field becomes input field
  await targetRow.locator('.nb-edit').click()
  await page.locator('input-editor').getByPlaceholder('Age').clear()
  await page.locator('input-editor').getByPlaceholder('Age').fill('35')
  await page.locator('.nb-checkmark').click()

  //get row based on specific column
  await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
  const targetRowById = page.getByRole('row', {name: '11'}).filter({has: page.locator('td').nth(1).getByText('11')})  //founded first column
  await targetRowById.locator('.nb-edit').click()
  await page.locator('input-editor').getByPlaceholder('E-mail').clear()
  await page.locator('input-editor').getByPlaceholder('E-mail').fill('Test@test.com')
  await page.locator('.nb-checkmark').click()
  await expect(targetRowById.locator('td').nth(5)).toHaveText("Test@test.com")  //column isnt in the edit mode anymore so targetRowById locator can be used again

  //test filter of the table
  const ages = ["20", "30", "40", "200"]

  for (let age of ages) {
    await page.locator('input-filter').getByPlaceholder('Age').clear()
    await page.locator('input-filter').getByPlaceholder('Age').fill(age)            // search field filled with value
    await page.waitForTimeout(500)

//now, if there is a multiple rows, it should be validated all rows are filtered well
    const ageRows = page.locator('tbody tr')  //locator for all rows

    for (let row of await ageRows.all()) {
      const cellValue = await row.locator('td').last().textContent()
      if (age == "200") {
        expect(await page.getByRole('table').textContent()).toContain('No data found')   //if there is no fould result, validation for that case
      } else {

        expect(cellValue).toEqual(age)
      }
    }
  }
})

//not recomnded way.Dates are hardcoded in code
test('datepicker hardcoded', async ({page}) => {
  await page.getByText('Forms').click();
  await page.getByText('Datepicker').click();

  const datePickerField = page.getByPlaceholder('Form Picker')
  await datePickerField.click()

  await page.locator('[class="day-cell ng-star-inserted"]').getByText('1', {exact: true}).click()     //{exact:true} je dodano jer getByText metoda razi parcijalno poklapanje pa ce pronaci sve brojeve koji sadrze "1"
  await expect(datePickerField).toHaveValue('Jan 1, 2025')
})

//passing dynamic data to datepicker
test('datepicker dynamic', async ({page}) => {
  await page.getByText('Forms').click();
  await page.getByText('Datepicker').click();

  const datePickerField = page.getByPlaceholder('Form Picker')
  await datePickerField.click()

  let date = new Date();
  date.setDate(date.getDate() + 55);                           //55 dana od danas
  const expectedDate = date.getDate().toString()
  const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})//taking short version of Month string
  const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
  const expectedYear = date.getFullYear()
  const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

  //za slucaj kada datum nije u ovom mjesecu
  let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()    //uzmi trenutni datum
  const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`                      //uzmi ocekivani datum
  while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {                                   //ako datum ne pripada tom mesecu
    await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()    //klikni na dugme ya prebacivanje na sledeci mjesec
    calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
  }

  await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()     //{exact:true} je dodano jer getByText metoda razi parcijalno poklapanje pa ce pronaci sve brojeve koji sadrze "1"
  await expect(datePickerField).toHaveValue(dateToAssert)
})

test('sliders', async ({page}) => {
  //mouse movement
  const temperatureBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
  await temperatureBox.scrollIntoViewIfNeeded()

  const box = await temperatureBox.boundingBox()
  const x = box.x + box.width / 2
  const y = box.y + box.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + 100, y)
  await page.mouse.move(x - 100, y + 100)
  await page.mouse.up()


})
