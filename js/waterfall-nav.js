(function($) {
    $.waterfallNav = function (selector, options) {
        "use strict";
        var defaults = {
                scrollOffset: 50 // offset - 200 allows elements near bottom of page to scroll
            };
        options = $.extend(defaults, options);
        selector = $(selector);

        window.addEventListener("scroll", function() {
            if (window.pageYOffset > options.scrollOffset) {
                selector.addClass('navbar--waterfall-shrunk');
            } else {
                selector.removeClass('navbar--waterfall-shrunk');
            }
        });
    };
    $.fn.waterfallNav = function (offset) {
        "use strict";
        return $.waterfallNav($(this), offset);
    };
})(jQuery);
