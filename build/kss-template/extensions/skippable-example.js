module.exports = function (Handlebars) {
    'use strict';

    Handlebars.registerHelper('if_skip_example_of', function (modifier, options) {
        return /\[SKIP EXAMPLE .*]/.test(modifier.description)
            ? options.fn(this)
            : options.inverse(this);
    });
    Handlebars.registerHelper('skippable_description_of', function (modifier) {
        return modifier.description.replace(/\[SKIP EXAMPLE .*]/, '');
    });
    Handlebars.registerHelper('reason_to_skip', function (modifier) {
        var result = /\[SKIP EXAMPLE (.*)]/.exec(modifier.description);
        return 'Example could not be shown ' + result[1];
    });
};
