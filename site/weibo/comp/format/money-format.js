var Handlebars = require('handlebars');

Handlebars.registerHelper('moneyFormat', function(value) {
    return value / 100;
});

