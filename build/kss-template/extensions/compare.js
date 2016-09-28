module.exports = function (Handlebars) {
    'use strict';

    Handlebars.registerHelper('if_lte', function (var1, var2, options) {
        return var1 <= var2
            ? options.fn(this)
            : options.inverse(this);
    });
    Handlebars.registerHelper('if_gte', function (var1, var2, options) {
        return var1 >= var2
            ? options.fn(this)
            : options.inverse(this);
    });
    Handlebars.registerHelper('if_eq', function (var1, var2, options) {
        return var1 == var2
            ? options.fn(this)
            : options.inverse(this);
    });
};
