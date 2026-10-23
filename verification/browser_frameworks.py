from playwright.sync_api import sync_playwright,expect
from pathlib import Path
import json,urllib.request,os
results=[]
def ok(s): print('PASS',s,flush=True);results.append(s)
base='http://127.0.0.1:8080'
api_base=os.environ.get('COURSE_API_URL','http://127.0.0.1:3001')
next_base=os.environ.get('COURSE_NEXT_URL','http://127.0.0.1:3000')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True);page=b.new_page(viewport={'width':1440,'height':1000});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 if os.environ.get('COURSE_API_PROXY'):
  def proxy_api(route):
   response=route.fetch(url=route.request.url.replace('http://localhost:3001',os.environ['COURSE_API_PROXY']))
   route.fulfill(response=response)
  page.route('http://localhost:3001/**',proxy_api)
 for n in [8,9]:
  page.goto(f'{base}/task{n}/');expect(page.locator('#connection')).to_contain_text('Подключено')
  count=page.locator('#transactions li').count();form=page.locator('#transaction-form')
  form.locator('[name="amount"]').fill('-10');form.locator('[name="date"]').fill('');page.locator('#save').click();expect(page.locator('#form-error')).to_contain_text('положительную сумму');assert page.locator('#transactions li').count()==count
  form.locator('[name="amount"]').fill('125.50');form.locator('[name="date"]').fill('2026-10-20');form.locator('[name="comment"]').fill(f'QA finance {n}');page.locator('#save').click();expect(page.locator('#message')).to_have_text('Операция сохранена.');expect(page.locator('#transactions li')).to_have_count(count+1)
  row=page.locator('#transactions li').filter(has_text=f'QA finance {n}');row.get_by_role('button',name='Изменить').click();form.locator('[name="amount"]').fill('225.75');page.locator('#save').click();expect(row).to_contain_text('225,75')
  page.reload();expect(page.locator('#connection')).to_contain_text('Подключено');row=page.locator('#transactions li').filter(has_text=f'QA finance {n}');expect(row).to_contain_text('225,75');row.get_by_role('button',name='Удалить').click();expect(page.locator('#transactions li')).to_have_count(count)
  ok(f'task{n}: реальный GET/POST/PATCH/DELETE, валидация и сохранение на сервере')
  if n==9:
   filters=page.locator('#filters');filters.locator('[name="type"]').select_option('income');expect(page.locator('#transactions li')).to_have_count(1)
   filters.locator('[name="from"]').fill('2026-10-03');expect(page.locator('#transactions li')).to_have_count(0)
   filters.locator('[name="theme"]').select_option('light');page.reload();expect(page.locator('html')).to_have_attribute('data-theme','light');expect(page.locator('#filters [name="type"]')).to_have_value('income')
   assert not any('transactions' in k for k in page.evaluate('Object.keys(localStorage)'))
   page.locator('#reset').click();expect(page.locator('#transactions li')).to_have_count(2)
   category=page.locator('#category-form');category.locator('[name="name"]').fill('QA категория');category.get_by_role('button').click();expect(page.locator('#message')).to_have_text('Категория создана.');expect(page.locator('#transaction-form [name="categoryId"] option').filter(has_text='QA категория')).to_have_count(1)
   # Созданная категория удаляется через тот же API после проверки.
   cats=json.load(urllib.request.urlopen(api_base+'/categories'))
   for c in cats:
    if c['name']=='QA категория':urllib.request.urlopen(urllib.request.Request(api_base+'/categories/'+str(c['id']),method='DELETE')).read()
   page.screenshot(path='/tmp/task9-desktop.png',full_page=True)
   ok('task9: фильтры, диапазон дат, тема после перезагрузки, новая категория')
 for n,path in [(10,'task10/published'),(11,'task11/published'),(15,'task15/published')]:
  page.goto(f'{base}/{path}/');expect(page.get_by_role('textbox',name='Новая задача')).to_be_visible()
  text=page.get_by_role('textbox',name='Новая задача');text.fill('   ');page.get_by_role('button',name='Добавить',exact=True).click();expect(page.locator('.error').filter(has_text='Введите текст')).to_have_count(1)
  text.fill('Яблоко');text.press('Enter');text.fill('Арбуз');page.get_by_role('button',name='Добавить',exact=True).click();expect(page.locator('.list li')).to_have_count(2)
  if n==11:
   page.get_by_label('Сортировка').select_option('alpha');expect(page.locator('.list .text').first).to_have_text('Арбуз');page.reload();expect(page.locator('.list li')).to_have_count(2)
  page.locator('.list input[type="checkbox"]').first.check();page.get_by_role('button',name='Активные',exact=True).click();expect(page.locator('.list li')).to_have_count(1);page.get_by_role('button',name='Завершённые',exact=True).click();expect(page.locator('.list li')).to_have_count(1)
  page.locator('.list button').click();expect(page.locator('.list li')).to_have_count(0);page.get_by_role('button',name='Все',exact=True).click();expect(page.locator('.list li')).to_have_count(1)
  page.screenshot(path=f'/tmp/task{n}-desktop.png',full_page=True)
  ok(f'task{n}: production-сборка, добавление, фильтры, отметка и удаление')
  if n in [10,11]:
   for width in [375,768,1440]:
    page.set_viewport_size({'width':width,'height':900});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(n,width)
 page.set_viewport_size({'width':1440,'height':1000});page.goto(next_base+'/');expect(page.locator('.list li')).to_have_count(2)
 page.get_by_role('link',name='Новая операция ↗').click();expect(page.locator('h1')).to_contain_text('Добавить')
 page.get_by_label('Сумма, ₽').fill('345.67');page.get_by_label('Категория').select_option('1');page.get_by_label('Дата',exact=True).fill('2026-10-20');page.get_by_label('Комментарий').fill('QA Next transaction');page.get_by_role('button',name='Добавить операцию').click();expect(page.locator('.list li')).to_have_count(3)
 row=page.locator('.list li').filter(has_text='QA Next transaction');row.get_by_role('link').first.click();expect(page.locator('h1')).to_contain_text('За каждой суммой');expect(page.locator('.panel')).to_contain_text('345,67');assert '/transaction/' in page.url
 page.reload();expect(page.locator('.panel')).to_contain_text('QA Next transaction')
 page.get_by_role('link',name='Редактировать операцию ↗').click();expect(page.get_by_label('Сумма, ₽')).to_have_value('345.67');page.get_by_label('Сумма, ₽').fill('456.78');page.get_by_role('button',name='Сохранить изменения').click();expect(page.locator('.list li').filter(has_text='QA Next transaction')).to_contain_text('456,78')
 page.get_by_role('link',name='Статистика',exact=True).click();expect(page.locator('.summary')).to_contain_text('Баланс');page.screenshot(path='/tmp/task12-stats.png',full_page=True)
 page.get_by_role('link',name='Операции',exact=True).click();page.locator('.list li').filter(has_text='QA Next transaction').get_by_role('button',name='Удалить').click();expect(page.locator('.list li')).to_have_count(2)
 page.goto(next_base+'/transaction/no-such-id');expect(page.locator('main [role="alert"]')).to_contain_text('Операция не найдена')
 ok('task12–13: маршруты, CRUD, динамические детали, reload и неизвестный id')
 page.route('http://localhost:3001/**',lambda route:route.abort());page.goto(next_base+'/');expect(page.locator('main [role="alert"]').filter(has_text='json-server')).to_be_visible();ok('Next.js: понятная ошибка недоступного API')
 assert not errors,errors;ok('task8–15: ошибок JavaScript нет')
 b.close()
Path('/tmp/course-framework-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
