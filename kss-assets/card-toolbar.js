(function($) {
    var cssPx = function ($element, property) {
            "use strict";
            return parseInt($element.css(property));
        },
        applyCss = function ($element, css) {
            "use strict";
            for (var prop in css) {
                if (css.hasOwnProperty(prop)) {
                    $element.css(prop, css[prop]);
                }
            }
        },
        animateCss = function ($element, css, duration, completion) {
            "use strict";
            $element.velocity(css, duration, 'swing', function () {
                applyCss(css);
                if (completion) {
                    completion();
                }
            });
        },
        detectMinimalScrolledToolbarDimension = function ($card, $toolbar) {
            "use strict";
            var result = $card.offset();
            result['width'] = $toolbar.innerWidth();
            return result;
        },
        detectFurtherScrolledToolbarDimension = function () {
            "use strict";
            var leftBorder = $('.js-card-toolbar__left-border:visible:last'),
                nav = $('nav'),
                result;

            if (leftBorder.parent().prop('tagName') && leftBorder.parent().prop('tagName').toLowerCase() == 'li') {
                leftBorder = leftBorder.parent();
            }

            if (leftBorder.length > 0) {
                result = leftBorder.offset();
                result.top = 0;
                result['left'] += leftBorder.width();
                result['width'] = nav.innerWidth()
                    - cssPx(nav, 'padding-left')
                    - cssPx(nav, 'padding-right')
                    - leftBorder.width()
                    - 16;
                return result;
            }

            result = nav.position();
            result['left'] += cssPx(nav, 'margin-left') + cssPx(nav, 'padding-left');
            result['top'] += cssPx(nav, 'margin-top') + cssPx(nav, 'padding-top');
            result['width'] = nav.innerWidth() - cssPx(nav, 'padding-left') - cssPx(nav, 'padding-right');
            return result;
        },
        detectNonScrolledToolbarDimension = function () {
            "use strict";
            return {top: '', left: '', width: ''};
        },
        transform = (function () {
            var transformations = {
                notScrolled: {
                    notScrolled: function () { /* nothing to do */ },
                    scrolledUp: function (state) {
                        state.$card.removeClass('card--into-app-bar-scrolled-up');
                        applyCss(state.$toolbar, state.nonScrolledToolbarDimension);
                    },
                    scrolledMinimal: function (state) {
                        state.$card.removeClass('card--into-app-bar-scrolled');
                        applyCss(state.$toolbar, state.nonScrolledToolbarDimension);
                    },
                    scrolledFurther: function (state) {
                        state.$card.removeClass('card--into-app-bar-scrolled');
                        applyCss(state.$toolbar, state.nonScrolledToolbarDimension);
                    }
                },
                scrolledUp: {
                    notScrolled: function (state) {
                        state.$card.addClass('card--into-app-bar-scrolled-up');
                        applyCss(state.$toolbar, state.minimalScrolledToolbarDimension);
                    },
                    scrolledUp: function () { /* nothing to do */ },
                    scrolledMinimal: function (state) {
                        state.$card
                            .removeClass('card--into-app-bar-scrolled')
                            .addClass('card--into-app-bar-scrolled-up');
                    },
                    scrolledFurther: function (state, options) {
                        animateCss(
                            state.$toolbar,
                            state.minimalScrolledToolbarDimension,
                            options.animationDuration,
                            function () {
                                state.$card
                                    .removeClass('card--into-app-bar-scrolled')
                                    .addClass('card--into-app-bar-scrolled-up');
                            }
                        );
                    }
                },
                scrolledMinimal: {
                    notScrolled: function (state) {
                        state.$card.addClass('card--into-app-bar-scrolled');
                        applyCss(state.$toolbar, state.minimalScrolledToolbarDimension);
                    },
                    scrolledUp: function (state) {
                        state.$card
                            .removeClass('card--into-app-bar-scrolled-up')
                            .addClass('card--into-app-bar-scrolled');
                    },
                    scrolledMinimal: function () { /* nothing to do */ },
                    scrolledFurther: function (state, options) {
                        animateCss(state.$toolbar, state.minimalScrolledToolbarDimension, options.animationDuration);
                    }
                },
                scrolledFurther: {
                    notScrolled: function (state, options) {
                        state.$card.addClass('card--into-app-bar-scrolled');
                        animateCss(state.$toolbar, state.furtherScrolledToolbarDimension, options.animationDuration);
                    },
                    scrolledUp: function (state, options) {
                        state.$card
                            .removeClass('card--into-app-bar-scrolled-up')
                            .addClass('card--into-app-bar-scrolled');
                        animateCss(state.$toolbar, state.furtherScrolledToolbarDimension, options.animationDuration);
                    },
                    scrolledMinimal: function (state, options) {
                        animateCss(state.$toolbar, state.furtherScrolledToolbarDimension, options.animationDuration);
                    },
                    scrolledFurther: function () { /* nothing to do */ }
                }
            };
            return function (fromState, toState, state, options) {
                "use strict";
                if (fromState !== toState) {
                    state.$card = $(state.card);
                    state.$toolbar = state.$card.find('.card__toolbar').first();
                    state.minimalScrolledToolbarDimension = detectMinimalScrolledToolbarDimension(state.$card, state.$toolbar);
                    state.furtherScrolledToolbarDimension = detectFurtherScrolledToolbarDimension();
                    state.nonScrolledToolbarDimension = detectNonScrolledToolbarDimension();
                    transformations[toState][fromState](state, options);
                }
            };
        })();

    $.cardToolbar = function (selector, options) {
        "use strict";
        var $selector = $(selector),
            defaults = {scrollOffset: 50, animationDuration: 0.3, enlargeOnScrollUp: false},
            toolbar = $selector.find('.card__toolbar').first(),
            state = {
                minimalScrolledToolbarDimension: detectMinimalScrolledToolbarDimension($selector, toolbar),
                furtherScrolledToolbarDimension: detectFurtherScrolledToolbarDimension(),
                nonScrolledToolbarDimension: detectNonScrolledToolbarDimension(),
                card: selector,
                $card: $selector,
                $toolbar: toolbar
            },
            lastPosition = window.pageYOffset,
            currentStatus = 'notScrolled',
            detectStatus;
        options = $.extend(defaults, options);

        detectStatus = function (isScrollUp, isScrollDown) {
            if (window.pageYOffset === 0) {
                return 'notScrolled';
            }
            if (window.pageYOffset < options.scrollOffset) {
                return 'scrolledMinimal';
            }
            return 'scrolledFurther';
        };

        if (options.enlargeOnScrollUp) {
            detectStatus = (function (wrappedFunction) {
                return function (isScrollUp, isScrollDown) {
                    if (isScrollUp) {
                        if (window.pageYOffset > options.scrollOffset) {
                            return 'scrolledUp';
                        } else {
                            return window.pageYOffset === 0 ? 'notScrolled' : 'scrolledUp';
                        }
                    } else if (isScrollDown) {
                        return window.pageYOffset > options.scrollOffset ? 'scrolledFurther' : 'scrolledMinimal';
                    }
                    return wrappedFunction(isScrollUp, isScrollDown);
                }
            })(detectStatus);
        }

        $(window).scroll(function () {
            var isScrollUp = lastPosition - 5 > window.pageYOffset
                    || (lastPosition > window.pageYOffset && window.pageYOffset < options.scrollOffset),
                isScrollDown = lastPosition + 5 < window.pageYOffset
                    || (lastPosition < window.pageYOffset && window.pageYOffset < options.scrollOffset),
                nextStatus;
            lastPosition = window.pageYOffset;

            if (! isScrollUp && ! isScrollDown) {
                return;
            }
            nextStatus = detectStatus(isScrollUp, isScrollDown);

            if (currentStatus !== nextStatus) {
                state.$toolbar.stop();
                transform(currentStatus, nextStatus, state, options);
            }
            currentStatus = nextStatus;
        });
        (function (lastStatus) {
            currentStatus = detectStatus(false, false);
            transform(lastStatus, currentStatus, state, options);
        })(currentStatus);
    };
    $.fn.cardToolbar = function (offset) {
        "use strict";
        return $.cardToolbar($(this), offset);
    };
})(jQuery);
