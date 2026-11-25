import { strict as assert } from 'node:assert';
import { total } from './cart.mjs';

assert.equal(total([]), 0, 'empty cart');
assert.equal(total([{ price: 1200, quantity: 1 }]), 1200, 'one item');
assert.equal(total([{ price: 1200, quantity: 3 }, { price: 500, quantity: 2 }]), 4600, 'multiple quantities');
assert.equal(total([{ price: 500, quantity: 0 }]), 0, 'zero quantity');
console.log('PASS: cart totals preserve quantities (4 cases)');
