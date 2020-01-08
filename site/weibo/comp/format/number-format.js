var Handlebars = require('handlebars');

Handlebars.registerHelper('numberFormat', function(value) {
    return value > 9999 ? ((value * 1e-4).toFixed(1) + '万') : value;
});
