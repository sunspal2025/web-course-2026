from playwright.sync_api import sync_playwright, expect
from pathlib import Path
import json,time
base='http://127.0.0.1:8080'
results=[]
def ok(name): print('PASS',name,flush=True);results.append(name)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True)
 page=b.new_page(viewport={'width':1440,'height':1000}); errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 for n in range(1,8):
  page.goto(f'{base}/task{n}/');expect(page.locator('h1')).to_be_visible();expect(page.locator('link[rel="stylesheet"]')).to_have_attribute('href','style.css')
  assert page.locator('h1').count()==1
  if n in [1,2]:assert page.locator('script').count()==0
  ok(f'task{n}: загрузка HTML/CSS')
 page.goto(f'{base}/task1/');assert page.locator('img').evaluate('(img)=>img.complete && img.naturalWidth>0');assert page.locator('a[href^="mailto:"]').count()==1;assert page.locator('a[href^="tel:"]').count()==1
 css=page.locator('body').evaluate('()=>fetch("style.css").then(r=>r.text())');assert 'display: grid' not in css and 'position: absolute' not in css and '@media' not in css
 ok('task1: аватар, контакты, только Flexbox')
 page.screenshot(path='/tmp/task1-desktop.png',full_page=True)
 for width in [320,375,767,768,1199,1200,1440]:
  page.set_viewport_size({'width':width,'height':900});page.goto(f'{base}/task2/')
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),width
  if width<768:expect(page.locator('.mobile-menu')).to_be_visible();expect(page.locator('.hero nav')).not_to_be_visible()
  else:expect(page.locator('.hero nav')).to_be_visible();expect(page.locator('.mobile-menu')).not_to_be_visible()
  assert page.locator('input,textarea,button').evaluate_all('(els)=>els.every(el=>el.getBoundingClientRect().height>=44 && el.getBoundingClientRect().width>=44)')
 ok('task2: 7 ширин, меню, поля >=44px, без горизонтального скролла')
 page.set_viewport_size({'width':375,'height':900});page.screenshot(path='/tmp/task2-mobile.png',full_page=True)
 page.set_viewport_size({'width':1440,'height':1000});page.goto(f'{base}/task3/')
 page.locator('#task-input').fill('   ');page.get_by_role('button',name='Добавить',exact=True).click();expect(page.locator('#error')).to_have_text('Введите текст задачи.');assert page.locator('#tasks li').count()==0
 page.locator('#task-input').fill('Первая');page.get_by_role('button',name='Добавить',exact=True).click()
 page.locator('#task-input').fill('<img src=x onerror=alert(1)>');page.locator('#task-input').press('Enter');assert page.locator('#tasks li').count()==2;assert page.locator('#tasks img').count()==0
 page.locator('#tasks input').first.check();expect(page.locator('#stats')).to_have_text('Осталось: 1, Выполнено: 1')
 page.get_by_role('button',name='Активные',exact=True).click();assert page.locator('#tasks li').count()==1
 page.get_by_role('button',name='Завершённые',exact=True).click();expect(page.locator('#tasks .text')).to_have_text('Первая')
 page.get_by_role('button',name='Все',exact=True).click();page.locator('#tasks button').first.click();assert page.locator('#tasks li').count()==1
 page.reload();assert page.locator('#tasks li').count()==0;ok('task3: пустой ввод, кнопка/Enter, безопасный текст, фильтры, удаление, сброс')
 page.goto(f'{base}/task4/');
 for value in ['123','1123','abcd','12345',' 1234']:
  page.locator('#guess').fill(value);page.locator('#check').click();expect(page.locator('#count')).to_have_text('Попыток: 0')
 secret=page.evaluate('secret');page.locator('#guess').fill(secret);page.locator('#check').click();expect(page.locator('#guess')).to_be_disabled();expect(page.locator('#status')).to_contain_text('Победа! Угадано за 1 попыток')
 page.locator('#new-game').click();expect(page.locator('#guess')).to_be_enabled();expect(page.locator('#count')).to_have_text('Попыток: 0');ok('task4: валидация, победа, блокировка и новая игра')
 page.add_init_script('Math.random = () => 0.01;')
 page.goto(f'{base}/task5/');page.locator('#start').click();expect(page.locator('[data-pad="0"]')).to_be_disabled();page.wait_for_timeout(1350);expect(page.locator('[data-pad="0"]')).to_be_enabled();page.locator('[data-pad="0"]').click();page.wait_for_timeout(100);expect(page.locator('[data-pad="0"]')).to_be_disabled();page.wait_for_timeout(2800);expect(page.locator('#level')).to_have_text('Уровень: 2');expect(page.locator('[data-pad="1"]')).to_be_enabled();page.locator('[data-pad="1"]').click();expect(page.locator('#status')).to_contain_text('Ошибка');assert page.evaluate('timers.size')==0
 for i in range(3):page.locator('#start').click();page.wait_for_timeout(80)
 page.wait_for_timeout(1500);expect(page.locator('#level')).to_have_text('Уровень: 1');assert page.evaluate('sequence.length')==1;ok('task5: показ, ввод, рост раунда, ошибка и отмена таймеров при быстрых рестартах')
 page.goto(f'{base}/task6/');page.locator('#pause').click();assert page.evaluate('snake.length')==3
 page.evaluate('paused=false; apple={x:6,y:10}; update(); paused=true;');assert page.evaluate('snake.length')==4;assert page.evaluate('score')==1
 assert page.evaluate('!snake.some(s=>s.x===apple.x&&s.y===apple.y)')
 page.evaluate('paused=false; turnQueued=false; changeDirection("left");');assert page.evaluate('pendingDirection.x')==1
 page.evaluate('snake=[{x:19,y:5},{x:18,y:5},{x:17,y:5}]; direction=directions.right; pendingDirection=direction; update();');assert page.evaluate('gameOver');expect(page.locator('#status')).to_contain_text('Игра окончена')
 page.locator('#restart').click();assert page.evaluate('!gameOver && score===0 && snake.length===3');ok('task6: рост, свободное яблоко, запрет разворота, стена, рестарт')
 page.screenshot(path='/tmp/task6-desktop.png',full_page=True)
 # Детерминированный API для проверки пагинации и ошибок без зависимости от внешнего сервиса.
 requests=[]
 def posts_route(route):
  from urllib.parse import urlparse,parse_qs
  url=route.request.url;requests.append(url);q=parse_qs(urlparse(url).query);n=int(q['_page'][0]);items=[{'id':i,'userId':1,'title':f'Post {i}','body':'Test body ' * 30} for i in range((n-1)*10+1,min(n*10,100)+1)];route.fulfill(json=items)
 page.route('https://jsonplaceholder.typicode.com/posts?*',posts_route);page.goto(f'{base}/task7/');expect(page.locator('#posts article')).to_have_count(10)
 before=len(requests);page.locator('#search').fill('POST 1');page.wait_for_timeout(400);assert all('post 1' in t.lower() for t in page.locator('#posts h2').all_text_contents());assert len(requests)==before
 page.locator('#search').fill('');page.wait_for_timeout(350)
 for i in range(20):
  page.evaluate('window.scrollTo(0,document.body.scrollHeight)');page.wait_for_timeout(200)
  if page.locator('#posts article').count()==100:break
 expect(page.locator('#posts article')).to_have_count(100);expect(page.locator('#status')).to_have_text('Больше постов нет');assert len(requests)==10
 page.unroute('https://jsonplaceholder.typicode.com/posts?*',posts_route);page.route('https://jsonplaceholder.typicode.com/posts?*',lambda route:route.fulfill(status=500,json={'error':'test'}));page.goto(f'{base}/task7/');expect(page.locator('#retry')).to_be_visible();expect(page.locator('#status')).to_contain_text('Не удалось')
 page.unroute('https://jsonplaceholder.typicode.com/posts?*');page.route('https://jsonplaceholder.typicode.com/posts?*',posts_route);page.locator('#retry').click();expect(page.locator('#posts article')).to_have_count(10)
 ok('task7: пагинация до 100, debounce, локальный поиск, остановка, HTTP-ошибка и повтор')
 assert not errors,errors
 ok('task1–7: ошибок JavaScript нет')
 b.close()
Path('/tmp/course-static-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
