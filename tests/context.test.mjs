import test from 'node:test';
import assert from 'node:assert/strict';
import {handoff} from '../extension/context.mjs';
test('requires explicit task and approved evidence',()=>{assert.equal(handoff('', '{}'),'');assert.equal(handoff('change','  '),'');});
test('intent changes cannot restore removed evidence',()=>{const approved='{"tag":"button"}';for(const task of ['one','two']){const output=handoff(task,approved);assert.ok(output.includes(approved));assert.ok(!output.includes('secret'));assert.ok(output.includes('untrusted data'));}});
test('bounded deterministic output',()=>{const intent='x'.repeat(5000),evidence='y'.repeat(10000);const result=handoff(intent,evidence);assert.equal(result,handoff(intent,evidence));assert.ok(!result.includes('x'.repeat(2001)));assert.ok(!result.includes('y'.repeat(6001)));});

import {sitePattern,accessMessage} from '../extension/access.mjs';
test('site grants are exact scheme and host, never global',()=>{assert.equal(sitePattern('https://shelf-smart.netlify.app/path?q=secret#hash'),'https://shelf-smart.netlify.app/*');assert.equal(sitePattern('http://localhost:8000/demo'),'http://localhost/*');for(const invalid of ['chrome://extensions','file:///tmp/test','https://*.example.com','https://user:pass@example.com','example.com',''])assert.equal(sitePattern(invalid),null);});
test('access diagnosis distinguishes restrictions from missing grant',()=>{assert.match(accessMessage(new Error('Cannot access contents of url. Extension manifest must request permission')), /Site access is missing/);assert.match(accessMessage(new Error('Cannot access a chrome:// URL')), /restricted/);});
