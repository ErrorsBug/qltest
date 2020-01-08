var Handlebars = require('handlebars');

Handlebars.registerHelper('format', function(value, type) {
    if (type == 'number') {
        return value > 9999 ? ((value * 1e-4).toFixed(1) + '万') : value;
    } else if (type == 'money') {
        return value / 100;
    } else if (type === 'datetime') {
        var value = Number(value);

        if (value) {
            var date = new Date(value);

            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
        }

        return value;
    }
});
