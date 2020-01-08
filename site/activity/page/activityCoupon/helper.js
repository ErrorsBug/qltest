var Handlebars = require('handlebars');

Handlebars.registerHelper('calc', function (left, operation) {
    var expression = String(left) + operation;
    var f = new Function('', 'return ' + expression);

    return f();
});

