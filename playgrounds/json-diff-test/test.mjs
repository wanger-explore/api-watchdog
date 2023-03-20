import { diffString, diff } from 'json-diff';
// import fs from 'node:fs';

console.log(diffString({ a: '1', foo: 'bar' }, { foo: 'baz', a: '1' }));

// fs.writeFileSync('diff.json', diffString({ foo: 'bar' }, { foo: 'baz' }));

console.log(diff({ a: '1', foo: 'bar' }, { foo: 'baz', a: '1' }));