module.exports = function (Handlebars) {
    'use strict';

    Handlebars.registerHelper('idable_markup', function (doc) {
        var id = Math.random().toString(36).substr(2, 9);
        return doc.replace(/\[UNIQID]/g, id);
    });
};
