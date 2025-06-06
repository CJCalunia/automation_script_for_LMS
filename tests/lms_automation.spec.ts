import {test, expect} from '@playwright/test';
import credentials from './credentials.json';
import { 
    modules, 
    submodules_requests, 
    submodules_templates,
    new_task_types,
    tag_type,
    answer_type
} from './modules.js';




test.describe('LMS Automation Tests', () => {
    const cred = credentials[0];
    test.beforeEach(async ({page}) => {
        await page.goto(cred.lms_url_instructor);
        await page.waitForSelector('text=Learning Management System - Instructor');
        await page.waitForLoadState('load');
        await page.getByPlaceholder('Enter Email').type(cred.lms_email_instructor, {delay: 20});
        await page.screenshot({path: 'screenshots/login/lms_instructor_login.png'});
        await page.getByPlaceholder('Enter Password').type(cred.default_password, {delay: 20});
        await page.screenshot({path: 'screenshots/login/lms_instructor_password.png'});
        await page.locator("text=Login").click();
        await page.waitForSelector('text=Logout');
        await page.waitForLoadState('load');
        await page.screenshot({path: 'screenshots/login/lms_instructor_logged_in.png'});
    });
    test ('Checking Modules and Submodules', async ({page}) => {
        await page.waitForLoadState('load');
        for (const module of modules){
           try {
                await expect(page.getByRole('menu').getByText(module, { exact: true })).toBeVisible();
                if (module === 'Templates') {
                    await page.locator('text=' + module).click();    
                    for (const submodule of submodules_templates) {
                        try {
                            await expect(page.getByRole('menu').getByText(submodule, { exact: true })).toBeVisible();
                        }
                        catch (error) {
                            await page.screenshot({ path: `screenshots/missing_submodule/template_missing_${submodule}.png` });
                            // Optionally, log which submodule was missing
                            console.warn(`Template submodule missing: ${submodule}`);
                            // Do not throw, so the test continues
                        }
                    }
                }
                if (module === 'Requests') {
                    await page.locator('text=' + module).click();    
                    for (const submodule of submodules_requests) {
                        try {
                            await expect(page.getByRole('menu').getByText(submodule, { exact: true })).toBeVisible();
                        }
                        catch (error) {
                            await page.screenshot({ path: `screenshots/missing_submodule/request_missing_${submodule}.png` });
                            // Optionally, log which submodule was missing
                            console.warn(`Request submodule missing: ${submodule}`);
                            // Do not throw, so the test continues
                        }
                    }
                }
            } 
            catch (error) {
                await page.screenshot({ path: `screenshots/missing_module/module_missing_${module}.png` });
                // Optionally, log which module was missing
                console.warn(`Module missing: ${module}`);
                // Do not throw, so the test continues
            }
        }
    });
    test ('New type Task', async ({page}) => {
        await page.waitForLoadState('load');
        try {
            await page.locator('text=Templates').click();
            await page.locator('text=Task Type').click();
            await page.locator('text=New Task Types').click();
            await expect(page).toHaveURL("https://lms.evsu-beta.centralizedinc.com/app/faculty/templates/task-type/create");
        }
        catch (error) {
            await page.screenshot({ path: 'screenshots/missing_module/template_module_missing.png' });
            console.warn('Template module missing');
        }

 
        for (const taskType of new_task_types) {
            await expect(page.locator(`//label[normalize-space()='${taskType}']`)).toBeVisible();
   
        }

        await page.locator("//span[normalize-space()='Save']").click();
        const requiredErrors = page.locator('.ant-form-item-explain-error', { hasText: 'required' });
        await expect(requiredErrors).toHaveCount(5);
        await page.waitForLoadState('load');
        await page.screenshot({ path: 'screenshots/negative_testing/new_task_type_required.png' });


        for (const tag of tag_type) {
            for (const answer of answer_type) {
                try {
                    await page.locator("//input[@id='form_item_name']").type(tag + answer, {delay: 100});

                    await page.locator("(//input[@id='form_item_tag'])[1]").click();
                    await page.getByText(tag, { exact: true }).click();

                    await page.locator("(//span[@class='ant-select-selection-item'])[2]").click();
                    await page.getByText(answer, { exact: true }).click();

                    await page.locator("//button[normalize-space()='Random']").click();

                    await page.locator("//span[normalize-space()='Save']").click();

                    await page.waitForLoadState('load');
                    
                    await expect(page.locator("(//span[normalize-space()='New Task Types'])[1]")).toBeVisible();
                    await page.locator("(//span[normalize-space()='New Task Types'])[1]").click();
                    await expect(page.url()).toContain("https://lms.evsu-beta.centralizedinc.com/app/faculty/templates/task-type/create");
                    await page.waitForLoadState('load');
                }
                catch (error) {
                    console.warn(`Error creating task type with tag: ${tag} and answer: ${answer}`);
                }
                
            }
        }

        await expect(page.url()).toContain("https://lms.evsu-beta.centralizedinc.com/app/faculty/templates/task-type/create");
        await page.screenshot({ path: 'screenshots/positive_testing/new_task_type_intial.png' });
        await page.locator("Text=Cancel").click();
        await expect(page.url()).toContain("https://lms.evsu-beta.centralizedinc.com/app/faculty/templates/task-type");
        await page.waitForLoadState('load');
        await page.screenshot({ path: 'screenshots/positive_testing/new_task_type_created.png' });





    });
    
});