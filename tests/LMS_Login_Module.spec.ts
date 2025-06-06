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
import { text } from 'stream/consumers';



test.describe('Login Page Tests', () => {
    test.beforeEach(async ({page}) => {
        await page.goto(credentials[0].lms_url_instructor);
        await page.waitForLoadState('load');
    });
    test ('PT: Valid Login', async ({page}) => {
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
            await page.screenshot({ path: 'screenshots/login/PT/Valid_Login.png' });
        }
        catch (error) {
            console.error('Login failed:', error);
            throw error; // Re-throw to fail the test
        }
    });
    test ('NT: Empty Login', async ({page}) => {
        try {
            await expect(page.getByText("Welcome")).toBeVisible();
            await page.waitForLoadState("load");
        }
        catch (error) {
            console.error('Welcome not found on the login page');
            throw error; // Re-throw to fail the test
        }
        try {
            const placeholders = [
                "Enter Email",
                "Enter Password"
            ]
            await page.getByPlaceholder(placeholders[0]).click();
            await page.getByPlaceholder(placeholders[1]).click();
            await page.locator("text=Login").click();
            await expect(page.locator("form.space-y-4", { hasText: "required" })).toBeVisible();
            await page.screenshot({ path: 'screenshots/login/NT/Empty_Login.png' });
        }
        catch (error) {
            console.error('Login failed:', error);
            throw error; // Re-throw to fail the test
        }
    });
    test ('NT: Empty Password', async ({page}) => {
        try {
            await expect(page.getByText("Welcome")).toBeVisible();
            await page.waitForLoadState("load");
        }
        catch (error) {
            console.error('Welcome not found on the login page');
            throw error; // Re-throw to fail the test
        }
        try {
            const placeholders = [
                "Enter Email",
                "Enter Password"
            ]
            await page.getByPlaceholder(placeholders[0]).type(credentials[0].lms_email_instructor, { delay: 50 });
            await page.getByPlaceholder(placeholders[1]).click();
            await page.locator("text=Login").click();
            await expect(page.locator("form.space-y-4", { hasText: "required" })).toBeVisible();
            await page.screenshot({ path: 'screenshots/login/NT/Empty_password.png' });
        }
        catch (error) {
            console.error('Login failed:', error);
            throw error; // Re-throw to fail the test
        }
    });
    test ('NT: Empty Email', async ({page}) => {
        try {
            await expect(page.getByText("Welcome")).toBeVisible();
            await page.waitForLoadState("load");
        }
        catch (error) {
            console.error('Welcome not found on the login page');
            throw error; // Re-throw to fail the test
        }
        try {
            const placeholders = [
                "Enter Email",
                "Enter Password"
            ]
            await page.getByPlaceholder(placeholders[0]).click();
            await page.getByPlaceholder(placeholders[1]).type(credentials[0].default_password, { delay: 50 });
            await page.locator("text=Login").click();
            await expect(page.locator("form.space-y-4", { hasText: "required" })).toBeVisible();
            await page.screenshot({ path: 'screenshots/login/NT/Empty_email.png' });
        }
        catch (error) {
            console.error('Login failed:', error);
            throw error; // Re-throw to fail the test
        }
    });
    test ('NT: Invalid Credential', async ({page}) => {
        try {
            await expect(page.getByText("Welcome")).toBeVisible();
            await page.waitForLoadState("load");
        }
        catch (error) {
            console.error('Welcome not found on the login page');
            throw error; // Re-throw to fail the test
        }
        try {
            const placeholders = [
                "Enter Email",
                "Enter Password"
            ]
            await page.getByPlaceholder(placeholders[0]).type('asdadasd@gmail.com', { delay: 50 });
            await page.getByPlaceholder(placeholders[1]).type("invalids", { delay: 50 });
            await page.locator("text=Login").click();
            await expect(page.locator("text=Failed")).toBeVisible();
            await page.screenshot({ path: 'screenshots/login/NT/Invalid_Cred.png' });
        }
        catch (error) {
            console.error('Login failed:', error);
            throw error; // Re-throw to fail the test
        }
    });
    test ('NT: Invalid Email', async ({page}) => {
        try {
            await expect(page.getByText("Welcome")).toBeVisible();
            await page.waitForLoadState("load");
        }
        catch (error) {
            console.error('Welcome not found on the login page');
            throw error; // Re-throw to fail the test
        }
        try {
            const placeholders = [
                "Enter Email",
                "Enter Password"
            ]
            await page.getByPlaceholder(placeholders[0]).type('asdadasd@gmail.com', { delay: 50 });
            await page.getByPlaceholder(placeholders[1]).click();
            await page.getByPlaceholder(placeholders[1]).fill(credentials[0].default_password);
            await page.locator("text=Login").click();
            await expect(page.locator("text=Failed")).toBeVisible();
            await page.screenshot({ path: 'screenshots/login/NT/Invalid_Email.png' });
        }
        catch (error) {
            console.error('Login failed:', error);
            throw error; // Re-throw to fail the test
        }
    });
    test ('NT: Invalid Password', async ({page}) => {
        try {
            await expect(page.getByText("Welcome")).toBeVisible();
            await page.waitForLoadState("load");
        }
        catch (error) {
            console.error('Welcome not found on the login page');
            throw error; // Re-throw to fail the test
        }
        try {
            const placeholders = [
                "Enter Email",
                "Enter Password"
            ]
            await page.getByPlaceholder(placeholders[0]).click();
            await page.getByPlaceholder(placeholders[0]).fill(credentials[0].lms_email_instructor);
            await page.getByPlaceholder(placeholders[1]).type('Invalid_Password', { delay: 50 });
            await page.locator('span[class="iconify i-iconamoon:eye-light text-gray-500"]').click();
            await page.locator("text=Login").click();
            await expect(page.locator("text=Failed")).toBeVisible();
            await page.screenshot({ path: 'screenshots/login/NT/Invalid_Password.png' });
        }
        catch (error) {
            console.error('Login failed:', error);
            throw error; // Re-throw to fail the test
        }
    });
    test ('PT: Remember Me', async ({page}) => {
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
            await page.locator("#nYWrWuPJ69t-3").click();
            await page.locator("text=Login").click();
            await page.waitForLoadState('load');
            await expect(page).toHaveURL("https://lms.evsu-beta.centralizedinc.com/app/faculty");
            await page.waitForSelector('text=Logout');
            await page.locator("text=Logout").click();
            await page.locator('//span[normalize-space()="Continue"]').click();
            await page.waitForLoadState("load");
            await expect(page).toHaveTitle("DS | Smart Campus")
            await expect(page.getByAltText(credentials[0].lmsI_full_name)).toBeVisible();
            await page.screenshot({ path: 'screenshots/login/PT/Remember_me.png' });
        }
        catch (error) {
            console.error('Login failed:', error);
            throw error; // Re-throw to fail the test
        }
    });
});