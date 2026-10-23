"""Real browser checks for motion, accessibility, progressive fallback and route state."""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

BASE = os.environ.get('COURSE_BASE_URL', 'http://127.0.0.1:8080')
NEXT = os.environ.get('COURSE_NEXT_URL', 'http://127.0.0.1:3300')
API = os.environ.get('COURSE_API_PROXY', 'http://127.0.0.1:3301')
results = []


def passed(message):
    results.append('PASS ' + message)
    print(results[-1], flush=True)


instrument = '''
window.__motionEvents = [];
const originalAnimate = Element.prototype.animate;
Element.prototype.animate = function(frames, options) {
  window.__motionEvents.push({href: this.getAttribute('href'), duration: options.duration});
  return originalAnimate.call(this, frames, options);
};
'''
with sync_playwright() as playwright:
    browser = playwright.chromium.launch()
    page = browser.new_page(viewport={'width': 1280, 'height': 850}, reduced_motion='no-preference')
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.add_init_script(instrument)
    page.goto(BASE + '/')
    page.evaluate('document.fonts.ready')
    assert page.locator('html').evaluate('el => getComputedStyle(el).scrollBehavior') == 'smooth'
    card = page.locator('.work').first
    card.evaluate('el => el.scrollIntoView({behavior:"instant", block:"center"})')
    page.wait_for_function('window.__motionEvents.some(event => event.href === "task0/")')
    card.evaluate('async el => { await Promise.all(el.getAnimations().map(a => a.finished.catch(() => {}))); }')
    assert card.evaluate('el => getComputedStyle(el).opacity') == '1'
    page.evaluate('window.scrollTo({top:0, behavior:"instant"})')
    card.evaluate('el => el.scrollIntoView({behavior:"instant", block:"center"})')
    page.wait_for_timeout(100)
    assert page.evaluate('window.__motionEvents.filter(event => event.href === "task0/").length') == 1
    passed('scroll reveal plays once and leaves content fully visible')

    page.locator('.work').last.focus()
    page.wait_for_function('document.activeElement.getAttribute("href") === "task16/"')
    page.wait_for_timeout(800)
    assert page.locator('.work').last.evaluate('el => getComputedStyle(el).opacity') == '1'
    passed('keyboard focus is not hidden by scroll reveal')

    page.goto(BASE + '/')
    card = page.locator('.work').first
    card.evaluate('el => el.scrollIntoView({behavior:"instant", block:"center"})')
    page.wait_for_function('window.__motionEvents.length > 0')
    page.emulate_media(reduced_motion='reduce')
    page.wait_for_function('document.getAnimations().every(a => a.playState !== "running")')
    assert page.locator('html').evaluate('el => getComputedStyle(el).scrollBehavior') == 'auto'
    assert card.evaluate('el => getComputedStyle(el).opacity') == '1'
    passed('changing Reduce Motion cancels running effects and smooth scrolling')

    page.emulate_media(reduced_motion='no-preference')
    page.goto(BASE + '/')
    page.locator('.primary-link[href="#projects"]').click()
    page.wait_for_function('location.hash === "#projects" && scrollY > 200')
    page.wait_for_timeout(900)
    assert abs(page.locator('#projects').evaluate('el => el.getBoundingClientRect().top')) < 90
    page.locator('.work[href="task1/"]').click()
    page.wait_for_url('**/task1/')
    expect(page.locator('h1')).to_contain_text('Пальцев')
    page.go_back()
    expect(page.locator('.work')).to_have_count(17)
    page.wait_for_timeout(650)
    assert page.locator('main').evaluate('el => getComputedStyle(el).opacity') == '1'
    passed('anchor navigation, ordinary document links and browser Back work')

    reduced = browser.new_page(reduced_motion='reduce', viewport={'width': 375, 'height': 850})
    reduced.add_init_script(instrument)
    reduced.goto(BASE + '/')
    assert reduced.evaluate('window.__motionEvents.length') == 0
    assert reduced.evaluate('document.getAnimations().length') == 0
    assert reduced.locator('html').evaluate('el => getComputedStyle(el).scrollBehavior') == 'auto'
    for path in ['task1/', 'task2/']:
        reduced.goto(BASE + '/' + path)
        assert reduced.locator('script').count() == 0
        assert reduced.evaluate('document.getAnimations().length') == 0
    reduced.locator('.mobile-menu summary').focus()
    reduced.keyboard.press('Space')
    expect(reduced.locator('.mobile-menu')).to_have_attribute('open', '')
    expect(reduced.locator('.mobile-menu a').first).to_be_visible()
    passed('CSS-only labs keep keyboard menu support and respect Reduce Motion')

    fallback = browser.new_page(java_script_enabled=False, reduced_motion='reduce')
    fallback.goto(BASE + '/')
    expect(fallback.locator('.work')).to_have_count(17)
    assert fallback.locator('.work').first.evaluate('el => getComputedStyle(el).opacity') == '1'
    fallback.locator('.work[href="task2/"]').click()
    expect(fallback.locator('h1')).to_contain_text('Java-разработка')
    passed('content and links remain usable with JavaScript disabled')

    page.goto(BASE + '/')
    with page.context.expect_page() as opened:
        page.locator('.work[href="task2/"]').click(modifiers=['Control'])
    new_tab = opened.value
    new_tab.wait_for_url('**/task2/')
    expect(new_tab.locator('h1')).to_contain_text('Java-разработка')
    assert '/task2/' not in page.url
    new_tab.close()
    hints = page.locator('head link[rel="prefetch"]').evaluate_all('els => els.map(el => el.href)')
    assert len(hints) <= 6
    assert all(url.startswith(BASE + '/') for url in hints)
    saving = browser.new_page(reduced_motion='reduce')
    saving.add_init_script("Object.defineProperty(navigator, 'connection', {value:{saveData:true}, configurable:true})")
    saving.goto(BASE + '/')
    saving.locator('.work').first.hover()
    assert saving.locator('head link[rel="prefetch"]').count() == 0
    passed('Ctrl-click opens a new tab; prefetch stays same-origin and respects Save-Data')


    app = browser.new_page(reduced_motion='no-preference')
    app.on('pageerror', lambda error: errors.append(str(error)))
    requests = []
    def proxy(route):
        requests.append(route.request.url)
        response = route.fetch(url=route.request.url.replace('http://localhost:3001', API))
        route.fulfill(response=response)
    app.route('http://localhost:3001/**', proxy)
    app.goto(NEXT + '/')
    expect(app.locator('.list li').first).to_be_visible()
    initial_requests = len(requests)
    app.evaluate('window.__oldRoute = document.querySelector(".route-content")')
    app.get_by_role('link', name='Добавить', exact=True).click()
    expect(app.get_by_label('Сумма, ₽')).to_be_visible()
    assert app.evaluate('window.__oldRoute !== document.querySelector(".route-content")')
    assert app.locator('.route-content').evaluate('el => getComputedStyle(el).animationName') == 'page-arrive'
    app.get_by_role('link', name='Статистика', exact=True).click()
    expect(app.locator('.summary')).to_be_visible()
    assert len(requests) == initial_requests
    app.emulate_media(reduced_motion='reduce')
    app.get_by_role('link', name='Операции', exact=True).click()
    expect(app.locator('.list li').first).to_be_visible()
    assert app.locator('.route-content').evaluate('el => getComputedStyle(el).animationName') == 'none'
    passed('Next routes animate without reloading shared data; reduced motion works')
    assert not errors, errors
    passed('no uncaught JavaScript errors')
    browser.close()

Path('/tmp/course-motion-results.txt').write_text('\n'.join(results) + '\n')
