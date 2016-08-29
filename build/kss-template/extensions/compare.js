module.exports = function (Handlebars) {
    'use strict';

    Handlebars.registerHelper('if_lte', function (var1, var2, options) {
        return var1 <= var2
            ? options.fn(this)
            : options.inverse(this);
    });
};
