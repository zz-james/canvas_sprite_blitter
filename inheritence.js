/**
 * User: james
 * Date: 08/05/13
 * Time: 21:47
 */
"use strict";

var Person = function() {
    this.bar = 'bar';
};

Person.prototype.foo = 'foo';

var Chef = function() {
    this.goo = 'goo';
};

Chef.prototype = new Person();

var cody = new Chef();

console.log(cody.foo);  // logs foo
console.log(cody.goo);  // logs goo
console.log(cody.bar);  // logs bar