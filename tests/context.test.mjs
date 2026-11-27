import test from 'node:test';
import assert from 'node:assert/strict';
import {handoff} from '../extension/context.mjs';
test('requires explicit task and approved evidence',()=>{assert.equal(handoff('', '{}'),'');assert.equal(handoff('change','  '),'');});
test('intent changes cannot restore removed evidence',()=>{const approved='{"tag":"button"}';for(const task of ['one','two']){const output=handoff(task,approved);assert.ok(output.includes(approved));assert.ok(!output.includes('secret'));assert.ok(output.includes('untrusted data'));}});
test('bounded deterministic output',()=>{const intent='x'.repeat(5000),evidence='y'.repeat(10000);const result=handoff(intent,evidence);assert.equal(result,handoff(intent,evidence));assert.ok(!result.includes('x'.repeat(2001)));assert.ok(!result.includes('y'.repeat(6001)));});
