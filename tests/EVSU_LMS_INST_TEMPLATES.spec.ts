import {test, expect} from '@playwright/test';
import credentials from './credentials.json';

 
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
    test ('Templates: Tasktype/Buttons',
        {tag : ['@tasktype','@instructor','@templates','@buttons']},
        async ({ page }) => {

        const Textname = [
            'Templates',
            'Task Type',
            'List of Task Types'
        ]
        const buttonsElements = [
            "New Task Types",
            "View Archives",
            'Go Back'
        ]

        for (const text of Textname) {
            const locator = page.getByText(text);
            await expect(locator).toBeVisible();
            await locator.click();
            console.log(`\x1b[32m✔ Text "${text}" is visible!\x1b[0m`);
        }

        await expect(page.getByRole('textbox', { name: 'Search by Title' })).toBeVisible();
        console.log(`\x1b[32m✔ Search by title is visible!\x1b[0m`);

        for (const buttonText of buttonsElements) {
            if ( buttonText !== buttonsElements[2]) {
                const buttonLocator = page.getByRole('button', { name: buttonText });
                await expect(buttonLocator).toBeVisible();
                console.log(`\x1b[32m✔ Button "${buttonText}" is visible!\x1b[0m`);
                await buttonLocator.screenshot({ path: `screenshots/Tasktype/Buttons/${buttonText.replace(/\s+/g, '_')}.png`,});
            }
            else {
                await page.getByRole('button', { name: buttonsElements[1] }).click();
                const buttonLocator = page.getByRole('button', { name: buttonText });
                while (await buttonLocator.isVisible() === false) {
                    await page.getByRole('button', { name: buttonsElements[1] }).click();
                }
                console.log(`\x1b[32m✔ Button "${buttonText}" is visible!\x1b[0m`);
                await buttonLocator.screenshot({ path: `screenshots/Tasktype/Buttons/${buttonText.replace(/\s+/g, '_')}.png`});
                }
                }
            }
    );
    test ('Templates: CourseContent/Buttons', 
        {tag : ['@coursecontent','@instructor','@templates','@buttons']},
        async ({ page }) => {

            const Textname = [
            'Templates',
            'Course Content',
            'List of Contents'
            ]
            const filterText = [
                'Filter by Section',
                'Search by Title'
            ]
            const buttonsElements = [
                "New Contents",
                "Retain",
                "View Archives",
                'Go Back'
            ]
            const retainbuttons = [
                "Save",
                "cancel"
             ]
            for (const text of Textname) {
                if (text !== Textname[1]) {
                    const locator = page.getByText(text);
                    await expect(locator).toBeVisible();
                    await locator.click();
                    console.log(`\x1b[32m✔ Text "${text}" is visible!\x1b[0m`);
                }
                else {
                    const locator = page.getByRole('menuitem', { name: `hdd ${text}` });
                    await expect(locator).toBeVisible();
                    await locator.click();
                    console.log(`\x1b[32m✔ Text "${text}" is visible!\x1b[0m`);
                }
            }
            for (const text of filterText) {
                if (text !== filterText[0]) {
                    const locator = page.getByRole('textbox', { name: text });
                    await expect(locator).toBeVisible();
                    console.log(`\x1b[32m✔ Textbox "${text}" is visible!\x1b[0m`);
                    await locator.screenshot({ path: `screenshots/CourseContent/Filter/${text.replace(/\s+/g, '_')}.png` });
                
                }else {
                    const locator = page.locator('div').filter({ hasText: text }).nth(4);
                    await expect(locator).toBeVisible();
                    console.log(`\x1b[32m✔ Textbox "${text}" is visible!\x1b[0m`);
                }
                
            }
            
            for (const buttonText of buttonsElements) { 
                if (buttonText === buttonsElements[0]) {
                    const buttonLocator = page.getByRole('button', { name: buttonText });
                    await expect(buttonLocator).toBeVisible();
                    console.log(`\x1b[32m✔ Button "${buttonText}" is visible!\x1b[0m`);
                    await buttonLocator.screenshot({ path: `screenshots/CourseContent/Buttons/${buttonText.replace(/\s+/g, '_')}.png` });
                }
                else if (buttonText === buttonsElements[5]) {
                    const view_archives = page.getByRole('button', { name: buttonsElements[2] });
                    await expect(view_archives).toBeVisible();
                    console.log(`\x1b[32m✔ Button "${buttonsElements[2]}" is visible!\x1b[0m`);
                    await view_archives.click();
                    const buttonLocator = page.getByRole('button', { name: buttonText });
                    await expect(buttonLocator).toBeVisible();
                    console.log(`\x1b[32m✔ Button "${buttonText}" is visible!\x1b[0m`);
                    await buttonLocator.screenshot({ path: `screenshots/CourseContent/Buttons/${buttonText.replace(/\s+/g, '_')}.png` });
                    await page.getByRole('button', { name: buttonsElements[2] }).screenshot({ path: `screenshots/CourseContent/Buttons/${buttonsElements[2].replace(/\s+/g, '_')}.png` });
                }
                else if (buttonText === buttonsElements[1]) {
                    const retain = page.getByRole('button', { name: buttonText });
                    await expect(retain).toBeVisible();
                    await retain.screenshot({ path: `screenshots/CourseContent/Buttons/${buttonsElements[1].replace(/\s+/g, '_')}.png` });
                    await retain.click();
                    for (const retainbutton of retainbuttons) {
                        const container = page.getByText('ContentsSection:Select');
                        while (await container.isVisible() === false) {
                            await retain.click();
                        }
                        const retainbuttonLocator = container.getByRole('button', { name: retainbutton });
                        await expect(retainbuttonLocator).toBeVisible();
                        console.log(`\x1b[32m✔ Button "${retainbutton}" is visible!\x1b[0m`);
                        await retainbuttonLocator.screenshot({ path: `screenshots/CourseContent/Buttons/${retainbutton.replace(/\s+/g, '_')}.png` });
                    }
                    

                }

                }
            }
    );
    test ('Templates: Lessons/Buttons', 
        {tag : ['@lessons','@instructor','@templates','@buttons']},
        async ({ page }) => {

            const Textname = [
                'Templates',
                'Lesson',
                'List of Lessons'
            ]
            const filterText = [
                'Filter by Subject',
                'Search by Title'
            ]
            const buttonsElements = [
                "New Lessons",
                "Retain",
                "View Archives",
                'Go Back'
            ]
            const retainbuttons = [
                "Save",
                "cancel"
             ]
            for (const text of Textname) {
                if (text !== Textname[1]) {
                    const locator = page.getByText(text);
                    await expect(locator).toBeVisible();
                    await locator.click();
                    console.log(`\x1b[32m✔ Text "${text}" is visible!\x1b[0m`);
                }
                else {
                    const locator = page.getByRole('menuitem', { name: `book ${text}` });
                    await expect(locator).toBeVisible();
                    await locator.click();
                    console.log(`\x1b[32m✔ Text "${text}" is visible!\x1b[0m`);
                }
            }
            for (const text of filterText) {
                if (text !== filterText[0]) {
                    const locator = page.getByRole('textbox', { name: text });
                    await expect(locator).toBeVisible();
                    console.log(`\x1b[32m✔ Textbox "${text}" is visible!\x1b[0m`);
                    await locator.screenshot({ path: `screenshots/Lesson/Filter/${text.replace(/\s+/g, '_')}.png` });
                
                }else {
                    const locator = page.locator('div').filter({ hasText: text }).nth(4);
                    await expect(locator).toBeVisible();
                    console.log(`\x1b[32m✔ Textbox "${text}" is visible!\x1b[0m`);
                }
                
            }
            
            for (const buttonText of buttonsElements) { 
                if (buttonText === buttonsElements[0]) {
                    const buttonLocator = page.getByRole('button', { name: buttonText });
                    await expect(buttonLocator).toBeVisible();
                    console.log(`\x1b[32m✔ Button "${buttonText}" is visible!\x1b[0m`);
                    await buttonLocator.screenshot({ path: `screenshots/Lesson/Buttons/${buttonText.replace(/\s+/g, '_')}.png` });
                }
                else if (buttonText === buttonsElements[5]) {
                    const view_archives = page.getByRole('button', { name: buttonsElements[2] });
                    await expect(view_archives).toBeVisible();
                    console.log(`\x1b[32m✔ Button "${buttonsElements[2]}" is visible!\x1b[0m`);
                    await view_archives.click();
                    const buttonLocator = page.getByRole('button', { name: buttonText });
                    await expect(buttonLocator).toBeVisible();
                    console.log(`\x1b[32m✔ Button "${buttonText}" is visible!\x1b[0m`);
                    await buttonLocator.screenshot({ path: `screenshots/Lesson/Buttons/${buttonText.replace(/\s+/g, '_')}.png` });
                    await page.getByRole('button', { name: buttonsElements[2] }).screenshot({ path: `screenshots/CourseContent/Buttons/${buttonsElements[2].replace(/\s+/g, '_')}.png` });
                }
                else if (buttonText === buttonsElements[1]) {
                    const retain = page.getByRole('button', { name: buttonText });
                    await expect(retain).toBeVisible();
                    await retain.screenshot({ path: `screenshots/Lesson/Buttons/${buttonsElements[1].replace(/\s+/g, '_')}.png` });
                    await retain.click();
                    for (const retainbutton of retainbuttons) {
                        const container = page.getByText('LessonsSubject:Select')
                        while (await container.isVisible() === false) {
                            await retain.click();
                        }
                        await expect(container).toBeVisible();
                        const retainbuttonLocator = container.getByRole('button', { name: retainbutton });
                        await expect(retainbuttonLocator).toBeVisible();
                        console.log(`\x1b[32m✔ Button "${retainbutton}" is visible!\x1b[0m`);
                        await retainbuttonLocator.screenshot({ path: `screenshots/Lesson/Buttons/${retainbutton.replace(/\s+/g, '_')}.png` });
                    }
                    

                }

            }


    });
    test ('Templates: Rubrics/Buttons', 
        {tag : ['@rubrics','@instructor','@templates','@buttons']},
        async ({ page }) => {

            const Textname = [
                'Templates',
                'Rubric',
                'List of Rubrics'
            ]
            const filterText = [
                'Filter by Type',
                'Search by Title'
            ]
            const rubics_hidden_buttons = [
                "Percentage",
                "Scaling"
            ]
            const buttonsActions = [ 
                'save Save',
                'Cancel'
            ]

            for (const text of Textname) {
                if (text !== Textname[1]) {
                    const locator = page.getByText(text);
                    await expect(locator).toBeVisible();
                    await locator.click();
                    console.log(`\x1b[32m✔ Text "${text}" is visible!\x1b[0m`);
                }
                else {
                    const locator = page.getByRole('menuitem', { name: `table ${text}` });
                    await expect(locator).toBeVisible();
                    await locator.click();

                    // Added since upon click of rubric, the templates dropdown closed so need to click again to redirect to rubrics
                    await page.getByText(Textname[0]).click();
                    console.log(`\x1b[32m✔ Text "${text}" is visible!\x1b[0m`);
                }
            }
            for (const text of filterText) {
                if (text !== filterText[0]) {
                    const locator = page.getByRole('textbox', { name: text });
                    await expect(locator).toBeVisible();
                    console.log(`\x1b[32m✔ Textbox "${text}" is visible!\x1b[0m`);
                    await locator.screenshot({ path: `screenshots/Rubrics/Filter/${text.replace(/\s+/g, '_')}.png` });
                
                }else {
                    const locator = page.locator('div').filter({ hasText: text }).nth(3);
                    await expect(locator).toBeVisible();
                    console.log(`\x1b[32m✔ Textbox "${text}" is visible!\x1b[0m`);
                }
                
            }
            for (const buttonText of rubics_hidden_buttons) {
                const newRubics = page.getByRole('button', { name: 'New Rubrics down' });
                await expect(newRubics).toBeVisible();
                await newRubics.hover();
                await newRubics.screenshot({ path: `screenshots/Rubrics/Button/New_Rubrics.png` });
                const buttonLocator = page.getByText(buttonText, { exact: true });
                await expect(buttonLocator).toBeVisible();
                await buttonLocator.click();
                for ( const actionButton of buttonsActions) {
                    if (actionButton != buttonsActions[1]) {
                        const actions = page.getByRole('button', { name: actionButton });
                        await expect(actions).toBeVisible();
                        console.log(`\x1b[32m✔ Button "${actionButton}" is visible!\x1b[0m`);
                        await actions.screenshot({ path: `screenshots/Rubrics/Button/${actionButton.replace(/\s+/g, '_')}.png` });
                    } else {
                        const container = page.locator('.container-common');
                        const actions = container.getByRole('button', { name: actionButton });
                        await expect(actions).toBeVisible();
                        console.log(`\x1b[32m✔ Button "${actionButton}" is visible!\x1b[0m`);
                        await actions.screenshot({ path: `screenshots/Rubrics/Button/${actionButton.replace(/\s+/g, '_')}.png` });
                        await actions.click();
                    }
                }
                console.log(`\x1b[32m✔ Button "${buttonText}" is visible!\x1b[0m`);
            }
    });
    test ('Templates: Questionnaires/Buttons',
        {tag : ['@questionnaires','@instructor','@templates','@buttons']},
        async ({ page }) => {
            const Textname = [
                'Templates',
                'Questionnaire',
                'List of Questionnaires',
                'My Questionnaires',
                'New Questionnaires',
                'Public Questionnaires'

            ]
            const filterText = [
                'Filter by Type',
                'Filter by Subject',
                'Filter by Lesson',
                'Search by Question',
                'Search by Title'
            ]
            const hidden_buttons = [
                "Essay",
                "Multiple Choice",
                "Enumeration",
                "Identification",
                "True or False",
                "Problem Solving",
                "Matching Type",
                "Fill In The Blank"
            ]
            const buttonsActions = [ 
                'save Save',
                'Cancel',
                'save Save as Draft',
                'save Save as Final'
            ]

            for (const text of Textname) {
                if (text === Textname[3] || text === Textname[5] ) {
                    const locator = page.getByRole('tab', { name: text });
                    await expect(locator).toBeVisible();
                    await locator.click();
                    console.log(`\x1b[32m✔ Text "${text}" is visible!\x1b[0m`);
                    if (text === Textname[3]) {
                        console.log(`\x1b[32m✔ "${text}"\x1b[0m`);
                        for (const filter of filterText) {
                            if (filter === filterText[3]) {
                                const locator = page.getByRole('textbox', { name: filter });
                                await expect(locator).toBeVisible();
                                console.log(`\x1b[32m✔ Textbox "${filter}" is visible!\x1b[0m`);
                            }
                            else if (filter !== filterText[4]){
                                const locator = page.locator('div').filter({ hasText: filter }).nth(3);
                                await expect(locator).toBeVisible();
                                console.log(`\x1b[32m✔ Textbox "${filter}" is visible!\x1b[0m`);
                            }
                        }
                        const locator = page.locator('div').filter({ hasText: 'My QuestionnairesPublic QuestionnairesFilter by TypeFilter by SubjectFilter by' }).nth(2);
                        await locator.screenshot({path: `screenshots/Questionnaire/Filter/${text.replace(/\s+/g, '_')}.png`});
                    }
                    else if (text === Textname[5]) {
                        console.log(`\x1b[32m✔ "${text}"\x1b[0m`);
                        const locator = page.getByRole('tab', { name: text });
                        await expect(locator).toBeVisible();
                        await locator.click();
                        console.log(`\x1b[32m✔ Text "${text}" is visible!\x1b[0m`);
                        for (const filter of filterText) {
                            if (filter === filterText[4]) {
                                const locator = page.getByRole('textbox', { name: filter });
                                await expect(locator).toBeVisible();
                                console.log(`\x1b[32m✔ Textbox "${filter}" is visible!\x1b[0m`);
                                await locator.screenshot({ path: `screenshots/Questionnaire/Filter/${filter.replace(/\s+/g, '_')}.png` });
                            }
                            else if (filter !== filterText[3]){
                                const locator = page.locator('div').filter({ hasText: filter }).nth(3);
                                await expect(locator).toBeVisible();
                                console.log(`\x1b[32m✔ Textbox "${filter}" is visible!\x1b[0m`);   
                            }
                        }
                        const PQuestionnaire = page.getByText('My QuestionnairesPublic QuestionnairesFilter by TypeFilter by SubjectFilter by');
                        await PQuestionnaire.screenshot({path: `screenshots/Questionnaire/Filter/${text.replace(/\s+/g, '_')}.png`});
                    }
                }
                else {
                    if (text !== Textname[1]) {
                        const locator = page.getByText(text);
                        await expect(locator).toBeVisible();
                        await locator.click();
                        console.log(`\x1b[32m✔ Text "${text}" is visible!\x1b[0m`);
                    }
                    else {
                        const locator = page.getByRole('menuitem', { name: `question-circle ${text}` });
                        await expect(locator).toBeVisible();    
                        await locator.click();

                        // Added since upon click of rubric, the templates dropdown closed so need to click again to redirect to rubrics
                        await page.getByText(Textname[0]).click();
                        console.log(`\x1b[32m✔ Text "${text}" is visible!\x1b[0m`);
                    }
                }
            }
    });
    test ('Templates: Game/Buttons', 
        {tag : ['@game','@instructor','@templates','@buttons']},
        async ({ page }) => {

            const Textname = [
                'Templates',
                'Game',
                'List of Games'
            ]
            const filterText = [
                'Filter by Type',
                'Filter by Subject',
                'Filter by Difficulty',
                'Search by Title'
            ]
            const buttonsElements = [
                "New Games down",
                "Retain",
                "View Archives",
                'Go Back'
            ]
            const hidden_buttons = [
                "Crossword",
                "Word find",
                "Flash Card"
            ]
            const actionButton = [
                'Save',
                'Cancel'
            ]

            for (const text of Textname) {
                if (text !== Textname[1]) {
                    const locator = page.getByText(text);
                    await expect(locator).toBeVisible();
                    await locator.click();
                    console.log(`\x1b[32m✔ Text "${text}" is visible!\x1b[0m`);
                }
                else {
                    const locator = page.getByRole('menuitem', { name: `trophy ${text}` });
                    await expect(locator).toBeVisible();
                    await locator.click();
                    console.log(`\x1b[32m✔ Text "${text}" is visible!\x1b[0m`);
                }
            }

            for (const buttons of buttonsElements) {
                const locator = page.getByRole('button', { name: buttons });
                if (buttons === buttonsElements[0]) { 
                    await locator.click();
                    await expect(page.getByText('CrosswordWord FindFlash Card')).toBeVisible();
                    for (const hidden_button of hidden_buttons) { 
                        await expect(page.getByRole('menuitem', { name: hidden_button }).locator('span').first()).toBeVisible();
                        console.log(`\x1b[32m✔ Button "${hidden_button}" is visible!\x1b[0m`);
                    }
                }
                else if (buttons === buttonsElements[2]) {
                    await locator.click();
                    await expect(page.getByRole('button', { name: buttonsElements[3] })).toBeVisible();
                    await page.getByRole('button', { name: buttonsElements[3] }).click();
                    console.log(`\x1b[32m✔ Button "${buttonsElements[3]}" is visible!\x1b[0m`);
                }
                else if (buttons === buttonsElements[1]){
                    await locator.click();
                    console.log(`\x1b[32m✔ Button "${buttons}" is visible!\x1b[0m`);
                    while (await page.getByText('GamesSubject:Select').isVisible() === false) {
                        await locator.click();
                    }
                    for (const action of actionButton) {
                        const actionLocator = page.getByRole('button', { name: action });
                        await expect(actionLocator).toBeVisible();
                        console.log(`\x1b[32m✔ Button "${action}" is visible!\x1b[0m`);
                        await actionLocator.screenshot({ path: `screenshots/Game/Buttons/${action.replace(/\s+/g, '_')}.png` });
                        if (action === actionButton[1]) {
                            await actionLocator.click();
                        }
                    }
                }
            }
    });
    test ('Templates: Task/Buttons', 
        {tag : ['@task','@instructor','@templates','@buttons']},
        async ({ page }) => {

            const Textname = [
                'Templates',
                'Task',
                'List of Tasks'
            ]
            const filterText = [
                'Filter by Type',
                'Search by Title'
            ]
            const buttonsElements = [
                "New Task",
                "Retain",
                "View Archives",
                'Go Back'
            ]
            const retainbuttons = [
                "Save",
                "cancel"
            ]
            for (const text of Textname) {
                if (text !== Textname[1]) {
                    const locator = page.getByText(text);
                    await expect(locator).toBeVisible();
                    await locator.click();
                    console.log(`\x1b[32m✔ Text "${text}" is visible!\x1b[0m`);
                }
                else {
                    const locator = page.getByRole('menuitem', { name: `file-protect ${text}` });
                    await expect(locator).toBeVisible();
                    await locator.click();
                    console.log(`\x1b[32m✔ Text "${text}" is visible!\x1b[0m`);
                }
            }
            for (const text of filterText) {
                if (text !== filterText[0]) {
                    const locator = page.getByRole('textbox', { name: text });
                    await expect(locator).toBeVisible();
                    console.log(`\x1b[32m✔ Textbox "${text}" is visible!\x1b[0m`);
                    await locator.screenshot({ path: `screenshots/Task/Filter/${text.replace(/\s+/g, '_')}.png` });
                
                }else {
                    const locator = page.locator('div').filter({ hasText: text }).nth(4);
                    await expect(locator).toBeVisible();
                    console.log(`\x1b[32m✔ Textbox "${text}" is visible!\x1b[0m`);
                }
                
            }
            
            for (const buttonText of buttonsElements) { 
                if (buttonText === buttonsElements[0]) {
                    const buttonLocator = page.getByRole('button', { name: buttonText });
                    await expect(buttonLocator).toBeVisible();
                    console.log(`\x1b[32m✔ Button "${buttonText}" is visible!\x1b[0m`);
                    await buttonLocator.screenshot({ path: `screenshots/Task/Buttons/${buttonText.replace(/\s+/g, '_')}.png` });
                }
                else if (buttonText === buttonsElements[5]) {
                    const view_archives = page.getByRole('button', { name: buttonsElements[2] });
                    await expect(view_archives).toBeVisible();
                    console.log(`\x1b[32m✔ Button "${buttonsElements[2]}" is visible!\x1b[0m`);
                    await view_archives.click();
                    const buttonLocator = page.getByRole('button', { name: buttonText });
                    await expect(buttonLocator).toBeVisible();
                    console.log(`\x1b[32m✔ Button "${buttonText}" is visible!\x1b[0m`);
                    await buttonLocator.screenshot({ path: `screenshots/Task/Buttons/${buttonText.replace(/\s+/g, '_')}.png` });
                    await page.getByRole('button', { name: buttonsElements[2] }).screenshot({ path: `screenshots/CourseContent/Buttons/${buttonsElements[2].replace(/\s+/g, '_')}.png` });
                }
                else if (buttonText === buttonsElements[1]) {
                    const retain = page.getByRole('button', { name: buttonText });
                    await expect(retain).toBeVisible();
                    await retain.screenshot({ path: `screenshots/Task/Buttons/${buttonsElements[1].replace(/\s+/g, '_')}.png` });
                    await retain.click();
                    for (const retainbutton of retainbuttons) {
                        const container = page.getByText('TasksSubject:Select');
                        while (await container.isVisible() === false) {
                            await retain.click();
                        }
                        await expect(container).toBeVisible();
                        const retainbuttonLocator = container.getByRole('button', { name: retainbutton });
                        await expect(retainbuttonLocator).toBeVisible();
                        console.log(`\x1b[32m✔ Button "${retainbutton}" is visible!\x1b[0m`);
                        await retainbuttonLocator.screenshot({ path: `screenshots/Task/Buttons/${retainbutton.replace(/\s+/g, '_')}.png` });
                    }
                    

                }

            }
    });
});

