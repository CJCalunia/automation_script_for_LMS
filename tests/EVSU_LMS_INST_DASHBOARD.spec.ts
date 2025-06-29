import {test, expect} from '@playwright/test';
import credentials from './credentials.json';
import { 
    modules, 
    submodules_requests, 
    submodules_templates
} from './modules.js'

 
test.describe('Templates: Check All Buttons if visible', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(credentials[0].lms_url_instructor);
        await page.waitForLoadState('load');
        await expect(page.locator('.md\\:grid')).toContainText('Login');
        const loginElement = page.getByRole('textbox', { name: 'Email' });
        const passwordElement = page.getByPlaceholder('Enter Password');
        while (await loginElement.inputValue() !== credentials[0].lms_email_instructor) {
            await loginElement.click();
            await loginElement.fill(credentials[0].lms_email_instructor);
        }
        await passwordElement.click();
        await passwordElement.fill(credentials[0].default_password);
        await page.getByRole('button', { name: 'Login' }).click();
        console.log(`Waiting for the page to load...`);
        const api_response = await page.waitForResponse(response => response.url().includes('/lms/v1.0/faculty-loads/get-schedules') && response.status() === 200);
        expect(api_response.status()).toBe(200);
        await expect(page.getByText('For Checking')).toBeVisible();
        console.log('\x1b[32m✔ Logged in as instructor\x1b[0m');
    });
    test("Dashboard: Notifications",
         {tag : ['@notification','@instructor','@dashboard','@navigations']},
          async ({page}) => {
        await page.getByRole('img', { name: 'bell' }).locator('svg').click();
        await page.getByText('See all').click();
        console.log(`Waiting for the page to load...`);
        await page.waitForURL(credentials[0].lmsI_notification_url, { timeout: 10000 });
        console.log('\x1b[32m✔ Notification page loaded\x1b[0m');
        await page.screenshot({
            path: 'screenshots/dashboard/Notification_available.png'
        })
    });
    test(("Dashboard: Create & Delete Post"),
     {tag : ['@instructor', '@dashboard', '@post', '@functionality']},
      async ({page}) => { 
        const message = 'This is a test post for the instructor dashboard.';
        const container = page.getByText('Create Post Select Section/s')
        await page.getByRole('button', { name: 'plus Create Post' }).click();
        await expect(container).toBeVisible();
        await page.locator('.ant-select-selection-overflow').click();
        await expect(container).toHaveScreenshot('screenshots/Dashboard/Select_Section.png');
        await page.getByText('Quality Assurance Fundementals', { exact: true }).click();
        await page.getByRole('dialog', { name: 'Create Post' }).getByRole('paragraph').first().fill(message);
        await page.getByRole('button', { name: 'Submit' }).click();
        await page.getByText('Success', { exact: true }).click();  
        console.log('\x1b[32m✔ Post created successfully\x1b[0m');
        await page.getByRole('menu').getByText('Classes').click();
        while (await page.getByLabel('home').locator('svg').isVisible() === false) {
            await page.getByRole('menu').getByText('Classes').click();
        }
        await page.getByLabel('home').locator('svg').click();
        await expect(page.getByText(message)).toBeVisible();
        await page.getByRole('img', { name: 'more' }).locator('svg').click();
        await page.getByRole('menuitem', { name: 'delete Remove' }).click();
        await page.getByText('Success', { exact: true }).click();   
        console.log('\x1b[32m✔ Post deleted successfully\x1b[0m');
    });
    test ("Dashboard: Check Profile",
        {tag : ['@instructor', '@dashboard', '@profile', '@navigations']},
        async ({page}) => { 
            const profile = page.getByText('My ProfileOrmistone, Gasparo');
            const informations = page.getByText('Personal InformationFirst');
            await page.locator('header img').click();
            await page.getByRole('menuitem', { name: 'user Profile' }).click();
            await expect(profile).toHaveScreenshot('screenshots/Dashboard/Profile.png');
            await expect(informations).toHaveScreenshot('screenshots/Dashboard/Informations.png');
            console.log('\x1b[32m✔ Profile page loaded\x1b[0m');
    });
    test("Dashboard: Check if All Modules are in NavBar",
        {tag : ['@instructor', '@dashboard', '@navbar', '@navigations']},
        async ({page}) => {
        await page.waitForLoadState('load');
        for (const module of modules){
            await expect(page.getByRole('menu').getByText(module, { exact: true })).toBeVisible();
            if (module === 'Templates') {
                await page.locator('text=' + module).click();    
                for (const submodule of submodules_templates) {
                    await expect(page.getByRole('menu').getByText(submodule, { exact: true })).toBeVisible();
                }
            }

            if (module === 'Requests') {
                await page.locator('text=' + module).click();    
                for (const submodule of submodules_requests) {
                    await expect(page.getByRole('menu').getByText(submodule, { exact: true })).toBeVisible();
                }
            }
        }
        const dashboard = page.getByText('DashboardClassesStudent');
        await expect(dashboard).toHaveScreenshot('screenshots/Dashboard/Complete_modules.png');
    });
    test("Dashboard: Course Content: Add, Archive, Unarchive, Duplicate, Delete and Save as Final",
        {tag : ['@instructor','@dashboard', '@coursecontent', '@functionality']},
        async ({page, request}) => {
            const content = "Playwright Testing: Adding Archiving and Unarchiving Functionality";
            const elements = [
                'Section',
                'Term',
                '* Description :',
                'Name'
            ];
            const term = [
                'Finals',
                'Midterm'
            ]
            const random = Math.floor(Math.random() * 101); 
            const container = page.locator('div').filter({ hasText: 'List of Contents/New Content/New ContentGeneral InfoNameSectionSelect' }).nth(2);
            await expect(page.locator('.anticon.anticon-select > svg').first()).toBeVisible();
            await page.locator('.anticon.anticon-select > svg').first().click();
            console.log(`Waiting for the page to load...`);
            await expect(page).toHaveURL(credentials[0].lmsI_syllabus_url, { timeout: 10000 });
            await page.getByRole('button', { name: 'New Contents' }).click();
            await expect(page).toHaveURL(credentials[0].lmsI_syllabus_url + '/create', { timeout: 10000 });
            await container.screenshot({ path: 'screenshots/Dashboard/New_Content.png' });
            // await expect(container).toHaveScreenshot('screenshots/Dashboard/New_Content.png');
            console.log('\x1b[32m✔ New Content page loaded\x1b[0m');
            for (const termElement of term) {
                if (termElement === term[1]) {
                    if (await page.getByText('Archived successfully').isVisible() === true) { 
                        await page.locator('a').nth(1).click();
                    }
                    await page.getByRole('button', { name: 'New Contents' }).click();
                }
                for (const element of elements) { 
                    if (element !== elements[3] && element !== elements[2]) {
                        if (element === elements[0]) {
                            await page.getByRole('combobox', { name: element }).click();
                            await page.getByText('Quality Assurance Fundementals').click();
                        }
                        else {
                            await page.getByRole('combobox', { name: element }).click();
                            const API_term = await request.get('https://api.evsu-beta.centralizedinc.com/management/v1.0/constants/terms');
                            expect(API_term.status()).toBe(200);
                            await page.locator('div').filter({ hasText: new RegExp(`^${termElement}$`) }).first().click();
                        }
                    }
                    else if (element === elements[2]) {
                        const action = [
                            'delete',
                            'plus Add Item'
                        ]
                        await page.getByRole('textbox', { name: '* Name :' }).fill(content);
                        await page.getByRole('textbox', { name: element }).fill(content)
                        for (const actionElement of action) {
                            await page.getByRole('button', { name: 'plus Add Item' }).click();
                            await page.locator('#form_item_items_0_taskTypeId').click();
                            await page.getByText('Lesson').nth(1).click();
                            await expect(page.locator('div:nth-child(8)').first()).toBeVisible();
                            console.log(`\x1b[32m✔ Add Item Successful \x1b[0m`, termElement);
                            if (actionElement === action[0]) {
                                await page.getByRole('button', { name: actionElement }).click();
                                await expect(page.locator('div:nth-child(8)').first()).not.toBeVisible();
                                console.log(`\x1b[32m✔ Delete Item Successful \x1b[0m`, termElement);
                            }
                            else {
                                page.getByRole('button', { name: 'save Save as Draft' }).click();
                                await expect(page.getByText('Success', { exact: true })).toBeVisible();
                                await page.locator('a').nth(1).click();
                                await expect(page).toHaveURL(credentials[0].lmsI_syllabus_url, { timeout: 10000 });
                                console.log(`\x1b[32m✔ Save as Draft Successful \x1b[0m`, termElement);
                                const hidden_elements = [
                                    'Edit',
                                    'Archive',
                                    'Delete',
                                    "Save as Final"                            
                                ]
                                const today = new Date();
                                const formatted = today.toISOString().split('T')[0];
                                const content = `Playwright Testing: Edit Function: ${random} : ${termElement} / ${formatted}`;
                                for (const hidden_element of hidden_elements) {
                                    await page.getByRole('img', { name: 'ellipsis' }).locator('svg').click();
                                    if (hidden_element === hidden_elements[0]) {
                                         while (await page.getByRole('menuitem', { name: hidden_element }).isVisible() === false) {
                                            await page.getByRole('img', { name: 'ellipsis' }).locator('svg').click();
                                         }
                                         await page.getByRole('menuitem', { name: hidden_element }).click();
                                         await page.getByRole('textbox', { name: '* Name :' }).clear();
                                         await page.getByRole('textbox', { name: '* Name :' }).fill(content);
                                         await page.getByRole('button', { name: 'save Update' }).click();
                                         await expect(page.getByText('Success', { exact: true })).toBeVisible();
                                         await page.locator('a').nth(1).click();
                                         console.log(`\x1b[32m✔ Edit Function Successful \x1b[0m` + termElement);
                                    }
                                    else if (hidden_element === hidden_elements[1]) { 
                                        while (await page.getByRole('menuitem', { name: hidden_element }).isVisible() === false) {
                                            await page.getByRole('img', { name: 'ellipsis' }).locator('svg').click();
                                         }
                                        await page.getByRole('menuitem', { name: hidden_element }).click();
                                        await expect(page.getByText('Success', { exact: true })).toBeVisible();
                                        await page.locator('a').nth(1).click();
                                        await page.getByRole('button', { name: 'View Archives' }).click();
                                        await expect(page.getByText(content)).toBeVisible();
                                        await page.locator('.anticon.anticon-folder > svg').first().click();
                                        await expect(page.getByText('Success', { exact: true })).toBeVisible();
                                        await page.locator('a').nth(1).click();
                                        await page.getByRole('button', { name: 'Go Back' }).click();
                                        await expect(page.getByText(content)).toBeVisible();
                                        console.log(`\x1b[32m✔ Archive Function Successful \x1b[0m`, termElement);
                                    }
                                    else if (hidden_element === hidden_elements[2]) { 
                                        await page.getByLabel('copy').locator('svg').click();
                                        await expect(page.getByText('Success', { exact: true })).toBeVisible();
                                        await page.locator('a').nth(1).click();
                                        await expect(page.getByText(`Draft${content} (1)`)).toBeVisible();
                                        console.log(`\x1b[32m✔ Duplicate Function Successful \x1b[0m`, termElement);
                                        while (await page.getByRole('menuitem', { name: hidden_element }).isVisible() === false) {
                                            await page.locator('.anticon.anticon-ellipsis > svg').first().click();
                                        }
                                        await page.getByRole('menuitem', { name: hidden_element }).click();
                                        await expect(page.getByText('Success', { exact: true })).toBeVisible();
                                        await page.locator('a').nth(1).click();
                                        await expect(page.getByText(`Draft${content} (1)`)).not.toBeVisible();
                                        console.log(`\x1b[32m✔ Delete Function Successful \x1b[0m`, termElement);
                                    }
                                    else if (hidden_element === hidden_elements[3]) {
                                        while (await page.getByRole('menuitem', { name: hidden_element }).isVisible() === false) {
                                            await page.getByRole('img', { name: 'ellipsis' }).locator('svg').click();
                                        }
                                        await page.getByRole('menuitem', { name: hidden_element }).click();
                                        await expect(page.getByText('Save As FinalReminder: This')).toBeVisible();
                                        await page.getByRole('button', { name: 'Save' }).click();
                                        await expect(page.getByText('Success', { exact: true })).toBeVisible();
                                        await page.locator('a').nth(1).click();
                                        while (await page.getByRole('menuitem', { name: hidden_elements[1] }).isVisible() === false) {
                                            await page.getByRole('img', { name: 'ellipsis' }).locator('svg').click();
                                        }
                                        await page.getByRole('menuitem', { name: hidden_elements[1] }).click();
                                        await expect(page.getByText('Success', { exact: true })).toBeVisible();
                                        await page.locator('a').nth(1).click();
                                        await expect(page.getByText(content)).not.toBeVisible();
                                        console.log(`\x1b[32m✔ Save as Final Function Successful \x1b[0m`, termElement);
                                    }
                                }
                                 

                                
                            }
                        }
    
                    }
                }
                console.log(`\x1b[32m✔ Add, Archive, Unarchive, Delete and Save as Final is WORKING SUCCESSFULLY for ${termElement}\x1b[0m`);
            }
    });
    test("Dashboard: Classes",
    {tag : ['@instructor', '@dashboard', '@classes', '@navigations']},
    async ({page}) => {     
         const icon = page.locator("(//*[name()='svg'][@focusable='false'])[21]");
         await expect(icon).toBeVisible();
         await icon.click();
         await expect(page.getByText('List of Classes')).toBeVisible();
         await page.screenshot({ path: 'screenshots/Dashboard/Classes/My_Class.png' });
         await expect(page).toHaveURL(credentials[0].lmsI_classes_url, { timeout: 10000 });
         console.log('\x1b[32m✔ Classes page loaded\x1b[0m');

    });
    test("Dashboard: Students",
    {tag : ['@instructor', '@dashboard', '@students', '@navigations']},
    async ({page}) => {
         const icon = page.locator("(//*[name()='svg'][@focusable='false'])[22]");
         await expect(icon).toBeVisible();
         await icon.click();
         await expect(page.getByText('List of Sections')).toBeVisible();
         await expect(page).toHaveURL(credentials[0].lmsI_student_records_url, { timeout: 10000 });
         const API_status = await page.waitForResponse(response => response.url().includes('/lms/v1.0/faculty-loads/get-classes') && response.status() === 200);
         expect(API_status.status()).toBe(200);
         const body = await API_status.json(); 
         expect(body.response.rows[0].section.name).toBe('Quality Assurance Fundementals');
         await expect(page).toHaveScreenshot('screenshots/Dashboard/Students/Students.png');

         console.log('\x1b[32m✔ Students page loaded\x1b[0m');
    });

});
