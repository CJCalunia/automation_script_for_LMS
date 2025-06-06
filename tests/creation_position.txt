// import { test, expect, request } from '@playwright/test';
// import credentials from './credentials.json';

// test('use hris data', async ({ page }) => {
//   const hrisData = credentials[0]; // First object in the array

//   // Access specific fields
//   const hrisUrl = hrisData.hris_url;
//   const hrisEmail = hrisData.hris_email;
//   const hrisPassword = hrisData.default_password;
//   const Position = "LMS Instructor"; // Example position name
//   const rng = Math.floor(100 + Math.random() * 999);
//   const Plantilla = "LMSI-052025-" + rng;

//   // Example usage:
//   await page.goto(hrisUrl);

//   await page.locator("(//input[@id='nK7dDJpdOWE-1'])[1]").click();
//   await page.locator("(//input[@id='nK7dDJpdOWE-1'])[1]").type(hrisEmail, { delay: 30 });
//   await page.screenshot({ path: 'email.png' });

//   await page.locator("(//input[@id='nK7dDJpdOWE-2'])[1]").click();
//   await page.locator("(//input[@id='nK7dDJpdOWE-2'])[1]").type(hrisPassword, { delay: 20 });
//   await page.screenshot({ path: 'password.png' });

//   await page.locator("//button[normalize-space()='Login']").click();
//   await page.waitForLoadState('load');
//   await page.waitForURL("https://hris.evsu-beta.centralizedinc.com/app/home");
//   await page.waitForLoadState('load');
//   await page.screenshot({ path: 'home.png' });

//   await page.getByText('Recruitment').click();
//   await page.waitForLoadState('load');
//   await page.waitForURL("https://hris.evsu-beta.centralizedinc.com/app/recruitment");
//   await page.screenshot({ path: 'recruitment.png' });

//   await page.locator("(//*[name()='svg'])[3]").click();
//   await page.waitForLoadState('load');

//   await page.getByText('Add New Position').click()
//   await page.waitForLoadState('load');

//   await page.waitForSelector("//body//div//button[2]")

//   await page.locator("(//input[@type='text'])[2]").click();
//   await page.locator("(//input[@type='text'])[2]").type(Position, { delay: 20 });
//   await page.screenshot({ path: 'add_position.png' });

//   await page.locator("//textarea[@class='ant-input']").click();
//   await page.locator("//textarea[@class='ant-input']").type(Position, { delay: 20 });
//   await page.screenshot({ path: 'description.png' });

//   await page.locator("//label[@class='ant-radio-button-wrapper']//span[contains(text(),'Faculty')]").click();
//   await page.screenshot({ path: 'category.png' });

//   await page.locator("//label[@class='ant-radio-button-wrapper']//span[contains(text(),'Regular')]").click();
  
//   await page.locator("(//input[@type='text'])[3]").click();
//   await page.locator("(//input[@type='text'])[3]").type(Plantilla, { delay: 10 });
//   await page.screenshot({ path: 'filled_123.png' });

//   // Click the dropdown to open it
//   await page.locator("(//div[@class='ant-select-selection__rendered'])[5]").click();
//   // Click the option by its visible text
//   await page.getByText('Salary Grade 20', { exact: true }).click();
//   await page.screenshot({ path: 'salary_grade.png' });

//   // Click the dropdown to open it
//   await page.locator("(//div[@class='ant-select-selection__rendered'])[6]").click();
//   // Click the option by its visible text
//   await page.getByText('Step - 1', { exact: true }).click();
//   await page.screenshot({ path: 'step_grade.png' });

//   // Click the dropdown to open it
//   await page.locator("(//div[@class='ant-select-selection__rendered'])[7]").click();
//   await page.screenshot({ path: 'campus_click.png' });
//   // Click the option by its visible text
//   await page.locator('li[role="option"]', { hasText: 'Main Campus' }).first().click();
//   await page.screenshot({ path: 'campus.png' });

//   // Click the dropdown to open it
//   await page.locator("(//div[@class='ant-select-selection__rendered'])[8]").click();
//   // Click the option by its visible text
//   await page.locator('li[role="option"]', { hasText: 'QA Tester department' }).click();
//   await page.screenshot({ path: 'department.png' });

//   await page.locator("//body//div//button[2]").click();
//   await page.locator("(//button[@class='ant-btn ant-btn-primary ant-btn-sm'])[1]").click();
//   await page.waitForLoadState('load');

//   const response = await page.waitForResponse(resp =>
//     resp.url().includes('https://api.evsu-beta.centralizedinc.com/employee/v1.0/designations') && resp.status() === 200
//   );
//   expect(response.status()).toBe(200);

//   await page.waitForSelector('text=Success');
//   await page.screenshot({ path: 'job_success_added.png' });




















  // ...continue your test

});   
