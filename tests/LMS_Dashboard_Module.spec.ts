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


test.describe('Header Page Test', () => {
    test.beforeEach(async ({page}) => {
        await page.goto(credentials[0].lms_url_instructor)
        try {
            await expect(page.getByText("Welcome")).toBeVisible();
        }
        catch (error) {
            console.error('Logo not found on the login page');
            throw error; // Re-throw to fail the test
        }
        try {
            const placeholders = [
                "Enter Email",
                "Enter Password"
            ]
            await page.getByPlaceholder(placeholders[0]).click();
            await page.getByPlaceholder(placeholders[0]).fill(credentials[0].lms_email_instructor);
            await page.getByPlaceholder(placeholders[1]).click();
            await page.getByPlaceholder(placeholders[1]).fill(credentials[0].default_password);
            await page.locator("text=Login").click();
            await page.waitForLoadState('load');
            await expect(page).toHaveURL("https://lms.evsu-beta.centralizedinc.com/app/faculty");
            await page.waitForSelector('text=Logout');
        }
        catch (error) {
            console.error('Login failed:', error);
            throw error; // Re-throw to fail the test
        }
    });
    
    test("PT: Header", async ({page}) => {
        const Elements = [
            "(//img)[1]",
            '//span[normalize-space()="Learning Management System"]',
            "//span[4]",
            "(//div[@class='ant-select-selector'])[1]",
            '//span[@aria-label="bell"]//*[name()="svg"]',
            "(//img[@draggable='false'])[1]"
        ]
        const subElements = [
            '//span[normalize-space()="Profile"]',
            '//span[@class="ant-dropdown-menu-title-content"][normalize-space()="Logout"]'
        ]
 
        await page.waitForLoadState("load")
        for (const element of Elements) {
            try {
                await expect(page.locator(element)).toBeVisible();
                if ( element === Elements[5]) {
                    for (const subElement of subElements) {
                        try {
                            await page.locator(element).click();
                            await expect(page.locator(subElement)).toBeVisible();

                        }
                        catch (error) {
                            console.log(`Cannot Find the Sub Element: ${subElement}`)
                        }
                    }
                }
 
            }
            catch (error) {
                console.log(`Cannot Find the Element: ${element}`)
            }
 
        }
        await page.locator(Elements[5]).click();
        await page.screenshot({
            path: "screenshots/login/PT/Header/Complete_Header_Elements.png",
            // mask: [
            //     page.locator('.ant-row.ant-row-center.ant-row-middle.welcome-banner.css-9espgn'),
            //     page.locator("ul[role='menu']"),
            //     page.locator("(//div[@class='ant-row ant-row-space-between ant-row-middle banner-container css-9espgn'])[1]")
            // ],
            // maskColor: 'white'
        });
    });
    test("PT: Notification", async ({page}) => {
        try {
            await page.waitForLoadState('load')
            await page.locator(`'//span[@aria-label="bell"]//*[name()="svg"]'`).click();
            await page.locator('//a[normalize-space()="See all"]').click();
            await page.waitForLoadState('load');
            await expect(page).toHaveURL("https://lms.evsu-beta.centralizedinc.com/app/faculty/notifications")
            await page.screenshot({
                path: 'screenshot/login/PT/Header/Notification/Notification_available.png'
            })
        }
        catch (error) {
            console.log('Cannot detect Notification', error)
        }
         

    })
    test("PT: Profile", async({page}) => {
        try {
            await page.waitForLoadState('load')
            await page.locator("(//img[@draggable='false'])[1]").click();
            await page.locator('//span[normalize-space()="Profile"]').click();
            await page.waitForLoadState('load');
            await expect(page).toHaveURL("https://lms.evsu-beta.centralizedinc.com/app/faculty/profile");
            await page.screenshot({
                path: 'screenshots/login/PT/Header/Profile/Profile_available.png'
            });
        }
        catch (error) {
            console.log('Cannot detect Notification', error);
        }
    });
    test("PT: Modules", async ({page}) => {
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
                            // Optionally, log which submodule was missing
                            console.warn(`Template submodule missing: ${submodule}`);
                            // Do not throw, so the test continues
                        }
                    }
                    await page.screenshot({
                        path: 'screenshots/login/PT/Dashboards/Complete_modules_templates.png',
                    })
                    await page.locator('text=' + module).click(); 
                }
 
                if (module === 'Requests') {
                    await page.locator('text=' + module).click();    
                    for (const submodule of submodules_requests) {
                        try {
                            await expect(page.getByRole('menu').getByText(submodule, { exact: true })).toBeVisible();
                        }
                        catch (error) {
                            // Optionally, log which submodule was missing
                            console.warn(`Template submodule missing: ${submodule}`);
                            // Do not throw, so the test continues
                        }
                    }
                    await page.screenshot({
                        path: 'screenshots/login/PT/Dashboards/Complete_modules_request.png',
                    })
                    await page.locator('text=' + module).click();
   
                }
                 
            } 
            catch (error) {
                console.warn(`Module missing: ${module}`);
                // Do not throw, so the test continues
            }
        }
        await page.screenshot({
            path: 'screenshots/login/PT/Dashboards/Complete_modules.png',
        })
    });

});