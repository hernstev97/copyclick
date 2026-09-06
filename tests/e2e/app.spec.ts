import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const sample = {
    id: 'one',
    title: 'Snippet 1',
    text: 'Hello\nWelt',
    editState: false,
};
const rawMarkup =
    '<script>window.__injected = true</script>\n<img src=x onerror="window.__injected=true">\nA & B < C';

async function seed(page: Page, items = [sample]) {
    await page.goto('/');
    await page.evaluate(
        (items) =>
            localStorage.setItem(
                'copyClickItems',
                JSON.stringify({ version: '1.0.0', items })
            ),
        items
    );
    await page.reload();
}

test('edit, persist, keyboard reorder, clear and remove', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    await page.getByRole('button', { name: 'Add snippet' }).click();
    await page.getByRole('textbox').fill(rawMarkup);
    await page.getByRole('checkbox', { name: 'Edit', exact: true }).uncheck();
    await page.reload();
    await expect(page.getByRole('textbox')).toHaveValue(rawMarkup);
    await expect(page.getByRole('textbox')).toHaveAttribute('readonly', '');
    expect(await page.evaluate(() => '__injected' in window)).toBe(false);
    await page.getByRole('button', { name: 'Add snippet' }).click();
    await page.getByRole('textbox').nth(1).fill('second');
    await page.getByRole('button', { name: 'Snippet 2: Reorder' }).focus();
    await page.keyboard.press('ArrowUp');
    await expect(page.getByRole('textbox').first()).toHaveValue('second');
    await page.reload();
    await expect(page.getByRole('textbox').first()).toHaveValue('second');
    await page
        .getByRole('button', { name: 'Clear', exact: true })
        .first()
        .click();
    await expect(page.getByRole('textbox').first()).toHaveValue('');
    await page
        .getByRole('button', { name: 'Close: Snippet 2', exact: true })
        .click();
    await expect(page.getByRole('textbox')).toHaveCount(1);
    await page.getByRole('button', { name: 'CLEAR ALL', exact: true }).click();
    await expect(page.getByRole('textbox')).toHaveCount(0);
    expect(errors).toEqual([]);
});

test('real clipboard paste, click-copy and keyboard-copy preserve markup', async ({
    page,
    context,
    browserName,
}) => {
    test.skip(
        browserName !== 'chromium',
        'Clipboard permission automation is Chromium-specific.'
    );
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');
    await page.getByRole('button', { name: 'Add snippet' }).click();
    await page.evaluate(
        (text) => navigator.clipboard.writeText(text),
        rawMarkup
    );
    await page.getByRole('textbox').focus();
    await page.keyboard.press('Control+V');
    await expect(page.getByRole('textbox')).toHaveValue(rawMarkup);
    await expect(page.getByRole('checkbox')).not.toBeChecked();
    await page.evaluate(() => navigator.clipboard.writeText('overwrite'));
    await page.getByRole('textbox').click();
    await expect
        .poll(() => page.evaluate(() => navigator.clipboard.readText()))
        .toBe(rawMarkup);
    await page.evaluate(() => navigator.clipboard.writeText('overwrite'));
    await page.getByRole('textbox').press('Enter');
    await expect
        .poll(() => page.evaluate(() => navigator.clipboard.readText()))
        .toBe(rawMarkup);
    await page.evaluate(() => navigator.clipboard.writeText('overwrite'));
    await page.getByRole('textbox').press('Space');
    await expect
        .poll(() => page.evaluate(() => navigator.clipboard.readText()))
        .toBe(rawMarkup);
});

test('paste replaces the selection and switches to copy mode', async ({
    page,
}) => {
    await seed(page, [{ ...sample, text: 'before after', editState: true }]);
    await page.getByRole('textbox').evaluate((element: HTMLTextAreaElement) => {
        element.setSelectionRange(7, 12);
        // Firefox protects synthetic DataTransfer contents; inject only this test payload.
        const event = new Event('paste', { bubbles: true, cancelable: true });
        Object.defineProperty(event, 'clipboardData', {
            value: { getData: () => '<b>pasted</b>' },
        });
        element.dispatchEvent(event);
    });
    await expect(page.getByRole('textbox')).toHaveValue('before <b>pasted</b>');
    await expect(page.getByRole('checkbox')).not.toBeChecked();
});

test('denied clipboard operation has localized feedback and keeps the text', async ({
    page,
}) => {
    await seed(page);
    await page
        .getByRole('button', { name: 'Sprache auf Deutsch ändern' })
        .click();
    await page.evaluate(() =>
        Object.defineProperty(navigator, 'clipboard', {
            configurable: true,
            value: {
                writeText: () =>
                    Promise.reject(
                        new DOMException('denied', 'NotAllowedError')
                    ),
            },
        })
    );
    await page.getByRole('textbox').click();
    await expect(page.getByRole('alert')).toContainText(
        'Kopieren fehlgeschlagen'
    );
    await expect(page.getByRole('textbox')).toHaveValue(sample.text);
});

test('versioned export round-trips and original array exports still import', async ({
    page,
}) => {
    await seed(page, [{ ...sample, text: rawMarkup }]);
    const downloadEvent = page.waitForEvent('download');
    await page.getByRole('button', { name: 'EXPORT', exact: true }).click();
    const download = await downloadEvent;
    const path = await download.path();
    expect(path).toBeTruthy();
    await page.getByRole('button', { name: 'CLEAR ALL' }).click();
    await expect(page.getByRole('textbox')).toHaveCount(0);
    await page.locator('input[type=file]').setInputFiles(path!);
    await expect(page.getByRole('textbox')).toHaveValue(rawMarkup);
    const newId = await page.evaluate(
        () => JSON.parse(localStorage.getItem('copyClickItems')!).items[0].id
    );
    expect(newId).not.toBe(sample.id);
    await page.getByRole('button', { name: 'CLEAR ALL' }).click();
    await expect(page.getByRole('textbox')).toHaveCount(0);
    await page.locator('input[type=file]').setInputFiles({
        name: 'legacy.json',
        mimeType: 'application/json',
        buffer: Buffer.from(JSON.stringify([sample])),
    });
    await expect(page.getByRole('textbox')).toHaveValue(sample.text);
});

test('rejects broken JSON, invalid rows, duplicate IDs and oversized files atomically', async ({
    page,
}) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    for (const json of [
        'broken',
        JSON.stringify([sample, { ...sample, id: 'two', text: {} }]),
        JSON.stringify([sample, sample]),
        ' '.repeat(10 * 1024 * 1024 + 1),
    ]) {
        await page.locator('input[type=file]').setInputFiles({
            name: 'bad.json',
            mimeType: 'application/json',
            buffer: Buffer.from(json),
        });
        await expect(page.getByRole('alert')).toContainText('Import failed');
        await expect(page.getByRole('textbox')).toHaveCount(0);
    }
    expect(errors).toEqual([]);
});

test('invalid storage is preserved; explicit replacement requires confirmation', async ({
    page,
}) => {
    await page.goto('/');
    await page.evaluate(() => {
        localStorage.setItem(
            'copyClickItems',
            '{"version":"future","items":[]}'
        );
        localStorage.setItem('userLanguage', 'invalid');
    });
    await page.reload();
    await expect(page.getByRole('alert')).toContainText(
        'original remains untouched'
    );
    await page.getByRole('button', { name: 'Add snippet' }).click();
    await page.getByRole('textbox').fill('rescue');
    expect(
        await page.evaluate(() => localStorage.getItem('copyClickItems'))
    ).toBe('{"version":"future","items":[]}');
    page.once('dialog', (dialog) => dialog.dismiss());
    await page
        .getByRole('button', { name: 'Save current snippets instead' })
        .click();
    await expect(page.getByRole('alert')).toBeVisible();
    page.once('dialog', (dialog) => dialog.accept());
    await page
        .getByRole('button', { name: 'Save current snippets instead' })
        .click();
    await expect(page.getByRole('alert')).toHaveCount(0);
    await page.reload();
    await expect(page.getByRole('textbox')).toHaveValue('rescue');
});

test('blocked storage and quota errors leave the app usable', async ({
    page,
}) => {
    await page.addInitScript(() => {
        Storage.prototype.getItem = () => {
            throw new DOMException('blocked', 'SecurityError');
        };
        Storage.prototype.setItem = () => {
            throw new DOMException('quota', 'QuotaExceededError');
        };
    });
    await page.goto('/');
    await expect(page.getByRole('alert')).toContainText(
        'storage is unavailable'
    );
    await page.getByRole('button', { name: 'Add snippet' }).click();
    await page.getByRole('textbox').fill('session only');
    await expect(page.getByRole('textbox')).toHaveValue('session only');
    await page
        .getByRole('button', { name: 'Sprache auf Deutsch ändern' })
        .click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
    await page.getByRole('button', { name: /Switch to .* mode/ }).click();
    await expect(
        page.getByRole('button', { name: 'EXPORTIEREN', exact: true })
    ).toBeVisible();
});

test('stale tab cannot silently overwrite newer snippets', async ({
    page,
    context,
}) => {
    await seed(page);
    const other = await context.newPage();
    await other.goto('/');
    await other.getByRole('checkbox').check();
    await other.getByRole('textbox').fill('newer from other tab');
    await page.getByRole('checkbox').check();
    await page.getByRole('textbox').fill('my unsaved edit');
    await expect(page.getByRole('alert')).toContainText('Another tab changed');
    expect(
        await page.evaluate(
            () =>
                JSON.parse(localStorage.getItem('copyClickItems')!).items[0]
                    .text
        )
    ).toBe('newer from other tab');
    await other.close();
});

test('language, explicit theme and modal focus survive normal navigation', async ({
    page,
}) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await page.getByRole('button', { name: 'Switch to light mode' }).click();
    await page
        .getByRole('button', { name: 'Sprache auf Deutsch ändern' })
        .click();
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');
    await expect(page.locator('html')).not.toHaveClass(/darkmode/);
    await page
        .getByRole('button', { name: 'Information', exact: true })
        .click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(
        dialog.getByRole('button', { name: 'Schließen' })
    ).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(dialog.getByRole('link')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(
        page.getByRole('button', { name: 'Information', exact: true })
    ).toBeFocused();
});

test('existing layout stays within the viewport and controls have accessible names', async ({
    page,
}) => {
    await seed(page);
    expect(
        await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth
        )
    ).toBe(true);
    await expect(
        page.locator('.cc-area:not(.cc-area--skeleton)').first()
    ).toHaveCSS('transform', 'none');
    // Audit the existing palette as well; an automated scan is not a full accessibility certification.
    const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])

        .analyze();
    expect(results.violations).toEqual([]);
});

test('production policy is served, scripts execute and markup never executes', async ({
    page,
}) => {
    const violations: string[] = [];
    await page.exposeFunction('reportCsp', (directive: string) =>
        violations.push(directive)
    );
    await page.addInitScript(() =>
        document.addEventListener('securitypolicyviolation', (event) => {
            void (
                window as unknown as {
                    reportCsp: (value: string) => Promise<void>;
                }
            ).reportCsp(event.violatedDirective);
        })
    );
    const response = await page.goto('/');
    expect(response?.headers()['content-security-policy']).toContain(
        "script-src 'self'"
    );
    expect(response?.headers()['x-content-type-options']).toBe('nosniff');
    expect(response?.headers()['x-frame-options']).toBe('DENY');
    await page.getByRole('button', { name: 'Add snippet' }).click();
    await page.getByRole('textbox').fill(rawMarkup);
    await expect(page.getByRole('textbox')).toHaveValue(rawMarkup);
    expect(await page.locator('script[src*="insights"]').count()).toBe(0);
    expect(await page.evaluate(() => '__injected' in window)).toBe(false);
    expect(violations).toEqual([]);
});

test('drag handle reorders with mouse or touch and persists the order', async ({
    page,
    context,
    browserName,
    isMobile,
}) => {
    await seed(page, [
        sample,
        { ...sample, id: 'two', title: 'Snippet 2', text: 'second' },
    ]);
    const handle = page.getByRole('button', { name: 'Snippet 1: Reorder' });
    await handle.scrollIntoViewIfNeeded();
    // Motion's mount transition must settle before measuring pointer coordinates.
    await expect(
        page.locator('.cc-area:not(.cc-area--skeleton)').first()
    ).toHaveCSS('transform', 'none');
    // Keep both endpoints inside the viewport: Firefox cannot release a pointer outside it.
    await page
        .getByRole('button', { name: 'Snippet 2: Reorder' })
        .scrollIntoViewIfNeeded();
    const box = await handle.boundingBox();
    const target = await page
        .getByRole('button', { name: 'Snippet 2: Reorder' })
        .boundingBox();
    expect(box).toBeTruthy();
    expect(target).toBeTruthy();
    const x = box!.x + box!.width / 2;
    const y = box!.y + box!.height / 2;
    const end = target!.y + target!.height / 2 + 15;
    expect(end).toBeLessThan(page.viewportSize()!.height);
    expect(y).toBeGreaterThan(0);
    if (isMobile && browserName === 'chromium') {
        const cdp = await context.newCDPSession(page);
        await cdp.send('Input.dispatchTouchEvent', {
            type: 'touchStart',
            touchPoints: [{ x, y }],
        });
        for (let step = 1; step <= 15; step++) {
            await cdp.send('Input.dispatchTouchEvent', {
                type: 'touchMove',
                touchPoints: [{ x, y: y + ((end - y) * step) / 15 }],
            });
        }
        await cdp.send('Input.dispatchTouchEvent', {
            type: 'touchEnd',
            touchPoints: [],
        });
        await cdp.detach();
    } else {
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x, end, { steps: 15 });
        await page.mouse.up();
    }
    await expect(page.locator('.cc-area--dragging')).toHaveCount(0);
    await expect(page.getByRole('textbox').first()).toHaveValue('second');
    await expect(
        page.locator('.cc-area:not(.cc-area--skeleton)').first()
    ).toHaveCSS('transform', 'none');
    await expect
        .poll(() =>
            page.evaluate(() =>
                JSON.parse(localStorage.getItem('copyClickItems')!).items.map(
                    (item: { id: string }) => item.id
                )
            )
        )
        .toEqual(['two', 'one']);
    await page.reload();
    await expect(page.getByRole('textbox').first()).toHaveValue('second');
});

test('pasting non-text does not delete a selection', async ({ page }) => {
    await seed(page, [{ ...sample, editState: true }]);
    await page.getByRole('textbox').evaluate((element: HTMLTextAreaElement) => {
        element.select();
        const event = new Event('paste', { bubbles: true, cancelable: true });
        Object.defineProperty(event, 'clipboardData', {
            value: { getData: () => '' },
        });
        element.dispatchEvent(event);
    });
    await expect(page.getByRole('textbox')).toHaveValue(sample.text);
    await expect(page.getByRole('checkbox')).toBeChecked();
});
