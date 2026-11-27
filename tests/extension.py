"""Actual Chromium extension tests. The interaction run grants only loopback in a disposable manifest; native toolbar grant still needs a manual smoke test."""
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from tempfile import TemporaryDirectory
import json, shutil
from playwright.sync_api import sync_playwright, expect
root=Path(__file__).resolve().parents[1]
server=ThreadingHTTPServer(('127.0.0.1',0),partial(SimpleHTTPRequestHandler,directory=str(root)))
Thread(target=server.serve_forever,daemon=True).start()
url=f'http://127.0.0.1:{server.server_port}/docs/demo.html'
def launch(p,profile,path):
    return p.chromium.launch_persistent_context(str(profile),channel='chromium',headless=True,args=[f'--disable-extensions-except={path}',f'--load-extension={path}'])
def worker(context):
    return context.service_workers[0] if context.service_workers else context.wait_for_event('serviceworker',timeout=15000)
try:
    with sync_playwright() as p, TemporaryDirectory() as temp:
        tmp=Path(temp); original=root/'extension'; c=launch(p,tmp/'base',original)
        sw=worker(c); assert sw.evaluate('chrome.runtime.getManifest().permissions.sort()')==['activeTab','scripting','sidePanel']; assert not sw.evaluate('chrome.runtime.getManifest().host_permissions || []'); assert sorted(sw.evaluate('chrome.runtime.getManifest().optional_host_permissions'))==['http://*/*','https://*/*']; c.close()
        copy=tmp/'extension'; shutil.copytree(original,copy); manifest=json.loads((copy/'manifest.json').read_text()); manifest['host_permissions']=['http://127.0.0.1/*']; (copy/'manifest.json').write_text(json.dumps(manifest))
        c=launch(p,tmp/'test',copy); sw=worker(c); extension_id=sw.url.split('/')[2]
        panel=c.new_page(); panel.goto(f'chrome-extension://{extension_id}/panel.html'); page=c.pages[0]; page.goto(url); page.bring_to_front()
        panel.locator('#change').fill('Widen CTA on mobile')
        page.bring_to_front()
        def start():
            panel.locator('#pick').evaluate('(el)=>el.click()'); expect(page.locator('[data-webd-picker]')).to_have_count(1)
        def cleanup(): expect(page.locator('[data-webd-picker]')).to_have_count(0)
        start(); page.locator('#get-started').click(); cleanup(); expect(panel.locator('#evidence')).to_have_value(__import__('re').compile('"tag": "button"')); expect(page.locator('#get-started')).to_have_text('Get started')
        panel.locator('#evidence').fill('{"tag":"button"}'); panel.locator('#change').fill('Make CTA full width'); assert '"selector"' not in panel.locator('#context').input_value(); assert 'Make CTA full width' in panel.locator('#context').input_value()
        page.bring_to_front(); start(); panel.locator('#cancel').evaluate('(el)=>el.click()'); cleanup()
        start(); page.keyboard.press('Escape'); cleanup(); expect(panel.locator('#pick')).to_be_enabled()
        start(); page.reload(); cleanup(); expect(panel.locator('#pick')).to_be_enabled()
        start(); other=c.new_page(); other.goto('about:blank'); other.bring_to_front(); cleanup(); expect(panel.locator('#pick')).to_be_enabled()
        panel.locator('#pick').evaluate('(el)=>el.click()'); expect(panel.locator('#status')).to_contain_text('Cannot access')
        c.close()
    print('PASS: installed extension and loopback interaction tests; native toolbar gesture still manual')
finally: server.shutdown(); server.server_close()
