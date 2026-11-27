from pathlib import Path
import os
from playwright.sync_api import sync_playwright
source=(Path(__file__).resolve().parents[1]/'extension/picker.mjs').read_text().replace('export function','function')
with sync_playwright() as p:
    options={'headless':True}
    if os.environ.get('CHROMIUM_PATH'): options['executable_path']=os.environ['CHROMIUM_PATH']
    browser=p.chromium.launch(**options)
    page=browser.new_page()
    page.set_content('<button id="secret" class="private"><span>Pick me</span></button><input value="password-123">')
    page.evaluate(source)
    def start(options=None):
        page.evaluate('(options)=>{window.result=undefined;selectOnPage("test",options).then(x=>window.result=x)}',options or {})
    def result():
        page.wait_for_function('window.result !== undefined')
        assert page.evaluate('!globalThis.__webdPicker')
        return page.evaluate('window.result')
    start();page.locator('span').click();e=result()['evidence'];assert e['tag']=='span' and 'secret' not in str(e) and 'classes' not in e
    start({'identifiers':True,'diagnostics':True});page.locator('span').click();assert '#secret' in result()['evidence']['selector']
    start();page.keyboard.press('Escape');assert result()['reason']=='cancelled'
    start();page.evaluate('cancelOnPage("test")');assert result()['reason']=='cancelled'
    start();page.locator('input').click();assert 'password-123' not in str(result())
    browser.close()
print('PASS: 5 real Chromium DOM picker scenarios (not installed extension)')
