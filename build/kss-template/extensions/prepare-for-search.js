module.exports = function (Handlebars) {
    'use strict';

    Handlebars.registerHelper('prepareForSearch', function (doc) {
        return doc.replace(/(?:\r\n|\r|\n|<|>|&[a-zA-Z0-9#]{1,4};|=|"|\/)/g, ' ');
    });
};
