import {test, expect} from '@playwright/test';
import credentials from './credentials.json';
import { log } from 'console';


const student_email = credentials[0].lms_email_student;


const requiredFields = [
    "EmailRequired",
    "PasswordRequired"
];
const loginFields = [
    'Email',
    'Password'
];


test.describe('Student Login Page Tests', () => {
    test.beforeEach(async ({page}) => {
        await page.goto(credentials[0].lms_url_student);
        await page.waitForLoadState('load');
        await expect(page.locator('.md\\:grid')).toContainText('Login');
    });
    test ('PT: Student/Valid Login', {tag : ['@student', '@login', '@positive']}, async ({page}) => {
        const loginElement = page.getByRole('textbox', { name: 'Email' });
        const passwordElement = page.getByPlaceholder('Enter Password');

        while (await loginElement.inputValue() !== student_email) {
            await loginElement.click();
            await loginElement.fill(student_email);
        }
        await passwordElement.click();
        await passwordElement.fill(credentials[0].default_password);
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByText('Subject Schedule')).toBeVisible();
        console.log('\x1b[32m✔ Logged in as instructor\x1b[0m');
        await page.screenshot({ path: 'screenshots/login/student/PT/Valid_Login.png' });
    });
    test ('NT: Student/Empty Login',{tag : ['@student', '@login', '@negative']}, async ({page}) => {
        await page.getByRole('button', { name: 'Login' }).click();
        for (const field of requiredFields) {
            let locator = page.getByText(field)
            await expect(locator).toBeVisible();
            console.log(`\x1b[32m✔ required indicator for ${field} is visible\x1b[0m`);
        }
        await page.screenshot({ path: 'screenshots/login/student/NT/Empty_Login.png' });

    });
    test ('NT: Student/Empty Password',{tag : ['@student', '@login', '@negative']}, async ({page}) => {
        const loginElement = page.getByRole('textbox', { name: 'Email' });

        while (await loginElement.inputValue() !== student_email) {
            await loginElement.click();
            await loginElement.fill(student_email);
        }
        await page.getByRole('button', { name: 'Login' }).click();
        let locator = page.getByText(requiredFields[1]);
        await expect(locator).toBeVisible();
        console.log(`\x1b[32m✔ ${requiredFields[1]} is visible\x1b[0m`);
    });


    test ('NT: Student/Empty Email',{tag : ['@student', '@login', '@negative']}, async ({page}) => {
        const loginElement = page.getByRole('textbox', { name: 'Email' });
        const passwordElement = page.getByPlaceholder('Enter Password');
        await loginElement.click();
        await passwordElement.click();
        await passwordElement.fill(credentials[0].default_password);
        let locator = page.getByText(requiredFields[0]);
        await expect(locator).toBeVisible();
        await page.getByRole('button', { name: 'Login' }).click();
        console.log(`\x1b[32m✔ ${requiredFields[0]} is visible\x1b[0m`);
        await page.screenshot({ path: 'screenshots/login/student/NT/Empty_Email.png'});
    });
    

    test ('NT: Student/Invalid Credential', {tag : ['@student', '@login', '@negative']}, async ({page}) => {
        const loginElement = page.getByRole('textbox', { name: 'Email' });
        const passwordElement = page.getByPlaceholder('Enter Password');
        const elements = [
            loginElement,
            passwordElement
        ]
        for (const element of elements) {
            await element.click();
            await element.fill('invalidemail_password@gmail.com');
        }
        await page.getByRole('button').filter({ hasText: /^$/ }).click();
        await page.getByRole('button', { name: 'Login' }).click();
        const locator = page.getByRole('status').locator('div').filter({ hasText: 'FailedUnauthorized. No User' }).nth(1);
        await expect(locator).toBeVisible();
        console.log('\x1b[32m✔ Invalid credentials error is visible \x1b[0m');
        await page.screenshot({ path: 'screenshots/login/student/NT/Invalid_Credential.png' });
    });


    test ('NT: Student/Invalid Email', {tag : ['@student', '@login', '@negative']}, async ({page}) => {
        const loginElement = page.getByRole('textbox', { name: 'Email' });
        const passwordElement = page.getByPlaceholder('Enter Password');

        await loginElement.click();
        await loginElement.fill("Invalid_Email@gmail.com");
        await passwordElement.click();
        await passwordElement.fill(credentials[0].default_password);
        await page.getByRole('button').filter({ hasText: /^$/ }).click();
        await page.getByRole('button', { name: 'Login' }).click();
        const locator = page.getByRole('status').locator('div').filter({ hasText: 'FailedUnauthorized. No User' }).nth(1);
        await expect(locator).toBeVisible();
        console.log('\x1b[32m✔ Invalid email error is visible \x1b[0m');
        await page.screenshot({ path: 'screenshots/login/student/NT/Invalid_Email.png'});
        
    });


    test ('NT: Student/Invalid Password',{tag : ['@student', '@login', '@negative']},  async ({page}) => {
        const loginElement = page.getByRole('textbox', { name: 'Email' });
        const passwordElement = page.getByPlaceholder('Enter Password');

        while (await loginElement.inputValue() !== student_email) {
            await loginElement.click();
            await loginElement.fill(student_email);
        }
        await passwordElement.click();
        await passwordElement.fill('Invalid_Password');
        await page.getByRole('button').filter({ hasText: /^$/ }).click();
        await page.getByRole('button', { name: 'Login' }).click();
        const locator = page.getByRole('status').locator('div').filter({ hasText: 'FailedUnauthorized. Invalid' }).nth(1);
        await expect(locator).toBeVisible();
        console.log('\x1b[32m✔ Invalid password error is visible \x1b[0m');
        await page.screenshot({ path: 'screenshots/login/student/NT/Invalid_Password.png' });
    });

    test ('PT: Student/Remember Me',{tag : ['@student', '@login', '@positive']}, async ({page}) => {
        const loginElement = page.getByRole('textbox', { name: 'Email' });
        for (const field of loginFields) {
            let locator = page.getByRole('textbox', { name: field });
            await locator.click();
            if (field === 'Password') { 
                await locator.fill(credentials[0].default_password);
            }
            else{
                while (await loginElement.inputValue() !== student_email) {
                await loginElement.click();
                await loginElement.fill(student_email);
                }
            }
        }
        await page.getByRole('checkbox', { name: 'Remember Me' }).click();
        await page.getByRole('button', { name: 'Login' }).click();
        await page.getByRole('menuitem', { name: 'poweroff Logout' }).click();
        await expect(page.getByText('Do you want to logout?')).toBeVisible();
        await page.getByRole('button', { name: 'Continue' }).click();

        const container = page.locator('.md\\:grid');
        await expect(container).toHaveScreenshot('screenshots/login/student/PT/Student_Remember_Me.png');
        console.log('\x1b[32m✔ Remember Me functionality works as expected\x1b[0m');
    });
});