"""Visual regression checks: portfolio, portrait, shared controls, themes and widths."""
import re
import os
from playwright.sync_api import sync_playwright, expect


def contrast(foreground, background):
    def luminance(color):
        rgb = [int(channel) / 255 for channel in re.findall(r'\d+', color)[:3]]
        linear = [c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4 for c in rgb]
        return sum(c * weight for c, weight in zip(linear, [.2126, .7152, .0722]))
    values = sorted([luminance(foreground), luminance(background)])
    return (values[1] + .05) / (values[0] + .05)


with sync_playwright() as playwright:
    browser = playwright.chromium.launch()
    page = browser.new_page()
    paths = ['', 'task1/', 'task2/', 'task3/', 'task5/', 'task6/',
             'task10/published/', 'task11/published/', 'task15/published/']
    for width in [320, 375, 768, 1024, 1440]:
        page.set_viewport_size({'width': width, 'height': 960})
        for path in paths:
            page.goto('http://127.0.0.1:8080/' + path)
            expect(page.locator('h1')).to_be_visible()
            page.evaluate('document.fonts.ready')
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (width, path)
    print('PASS: 9 pages at 5 widths, no horizontal scrolling')
    for appearance in ['light', 'dark']:
        page.emulate_media(color_scheme=appearance)
        page.goto('http://127.0.0.1:8080/task3/')
        colors = page.locator('#todo-form button').evaluate('''el => ({
            foreground: getComputedStyle(el).color,
            background: getComputedStyle(el).backgroundColor
        })''')
        ratio = contrast(colors['foreground'], colors['background'])
        assert ratio >= 4.5, (appearance, colors, ratio)
        print('PASS:', appearance, 'primary button contrast', round(ratio, 2))
        page.screenshot(path=f'/tmp/redesign-todo-{appearance}.png', full_page=True)
    page.emulate_media(color_scheme='light', reduced_motion='reduce')
    page.goto('http://127.0.0.1:8080/')
    duration = page.locator('.work').first.evaluate('el => getComputedStyle(el).transitionDuration')
    assert float(duration.split(',')[0].strip().removesuffix('s')) < .01
    assert page.locator('.work').count() == 17
    assert page.locator('.work .work-preview').count() == 3
    for preview in page.locator('.work-preview').all():
        preview.scroll_into_view_if_needed()
        page.wait_for_function('el => el.complete && el.naturalWidth > 0', arg=preview.element_handle())
        assert preview.evaluate('el => ["task3/", "task6/", "task12/"].includes(el.closest("a").getAttribute("href"))')
    tile = page.locator('.work').nth(1)
    tile.hover()
    assert tile.evaluate('el => getComputedStyle(el).color') == 'rgb(255, 255, 255)' 
    expect(page.locator('.role')).to_contain_text('GP Solutions')
    assert page.locator('.hero-portrait img').evaluate('el => el.complete && el.naturalWidth === 593')
    page.goto('http://127.0.0.1:8080/task1/')
    expect(page.locator('#about')).to_contain_text('Java-разработчик')
    expect(page.locator('#experience')).to_contain_text('GP Solutions')
    assert page.locator('img').get_attribute('src') == '../assets/vyacheslav-paltsev.png'
    print('PASS: portrait, professional profile, project links and reduced motion')
    page.route('http://localhost:3001/**', lambda route: route.abort())
    page.goto(os.environ.get('COURSE_NEXT_URL', 'http://127.0.0.1:3000') + '/')
    expect(page.locator('.connection-state')).to_be_visible()
    page.screenshot(path='/tmp/redesign-next-offline.png', full_page=True)
    print('PASS: Next.js explains its local API requirement')
    browser.close()
