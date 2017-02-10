'use strict';

angular.module('bcapp-pattern-lab', ['gettext', 'ngAnimate', 'ngclipboard', 'ngMessages', 'mm.foundation', 'bcapp-pattern-lab-templates', 'bcapp-pattern-lab.sticky-class', 'bcapp-pattern-lab.bc-datepicker', 'bcapp-pattern-lab.bc-dropdown', 'bcapp-pattern-lab.bc-modal', 'bcapp-pattern-lab.bc-pagination', 'bcapp-pattern-lab.bc-server-table', 'bcapp-pattern-lab.alert', 'bcapp-pattern-lab.checkbox-list', 'bcapp-pattern-lab.color-picker', 'bcapp-pattern-lab.copy-clipboard', 'bcapp-pattern-lab.credit-card', 'bcapp-pattern-lab.credit-card-types', 'bcapp-pattern-lab.global-message', 'bcapp-pattern-lab.form', 'bcapp-pattern-lab.form-field', 'bcapp-pattern-lab.form-input-color', 'bcapp-pattern-lab.html5Mode', 'bcapp-pattern-lab.icon', 'bcapp-pattern-lab.loading-notification', 'bcapp-pattern-lab.loading-overlay', 'bcapp-pattern-lab.services', 'bcapp-pattern-lab.sprite', 'bcapp-pattern-lab.switch', 'bcapp-pattern-lab.tabs', 'bcapp-pattern-lab.util']).config(['$tooltipProvider', function ($tooltipProvider) {
    $tooltipProvider.setTriggers({ 'tooltipTriggerOpen': 'tooltipTriggerClose' });
}]);
'use strict';

angular.module('bcapp-pattern-lab.alert', ['mm.foundation.alert']).config(function configureAlert($provide) {
    $provide.decorator('alertDirective', function alertDecorator($delegate) {
        var directive = $delegate[0];

        directive.replace = true;
        directive.scope = {
            close: '&',
            links: '=',
            target: '=',
            type: '='
        };

        return $delegate;
    });
});
/* globals moment */
'use strict';

angular.module('bcapp-pattern-lab.bc-datepicker.constants', []).constant('BC_DATEPICKER_DEFAULTS', {
    dayFormat: 'D',
    inputFormat: moment.localeData().longDateFormat('L'),
    styles: {
        back: 'datepicker-back',
        container: 'datepicker',
        date: 'datepicker-date',
        dayBody: 'datepicker-days-body',
        dayBodyElem: 'datepicker-day',
        dayConcealed: 'datepicker-day-concealed',
        dayDisabled: 'is-disabled',
        dayHead: 'datepicker-days-head',
        dayHeadElem: 'datepicker-day-name',
        dayPrevMonth: 'datepicker-day-prev-month',
        dayNextMonth: 'datepicker-day-next-month',
        dayRow: 'datepicker-days-row',
        dayTable: 'datepicker-days',
        month: 'datepicker-month',
        monthLabel: 'datepicker-month',
        next: 'datepicker-next',
        positioned: 'datepicker-attachment',
        selectedDay: 'is-selected',
        selectedTime: 'datepicker-time-selected',
        time: 'datepicker-time',
        timeList: 'datepicker-time-list',
        timeOption: 'datepicker-time-option'
    },
    time: false,
    weekdayFormat: 'short'
});
/* globals rome */
'use strict';

angular.module('bcapp-pattern-lab.bc-datepicker.directive', ['bcapp-pattern-lab.bc-datepicker.constants']).directive('bcDatepicker', function bcDatepickerDirective(BC_DATEPICKER_DEFAULTS) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            options: '=?'
        },

        link: function datepickerLinkFunction(scope, element, attrs, ngModel) {
            if (scope.options === undefined) {
                scope.options = {};
            }

            // Add defaults to the options object
            _.defaults(scope.options, BC_DATEPICKER_DEFAULTS);

            // Create a new rome (calendar) instance
            scope.calendar = rome(element[0], scope.options);

            // On 'data' event set ngModel to the passed value
            scope.calendar.on('data', function onData(value) {
                ngModel.$setViewValue(value);
                scope.$apply();
            });

            scope.calendar.on('ready', function onReady(options) {
                if (attrs.placeholder === undefined) {
                    attrs.$set('placeholder', options.inputFormat);
                }
            });

            // Removing calendar event listeners
            element.on('$destroy', function onDestroy() {
                scope.calendar.destroy();
            });
        }
    };
});
'use strict';

angular.module('bcapp-pattern-lab.bc-datepicker', ['bcapp-pattern-lab.bc-datepicker.directive']);
'use strict';

angular.module('bcapp-pattern-lab.bc-dropdown-menu.directive', []).directive('bcDropdownMenu', function () {
    return {
        restrict: 'A',
        require: '^bcDropdown',
        compile: function compile(tElement) {
            tElement.addClass('dropdown-menu');
            tElement.attr('role', 'listbox');

            return function (scope, element, attrs, bcDropdownCtrl) {
                element.attr('id', bcDropdownCtrl.getUniqueId());
                element.attr('aria-expanded', bcDropdownCtrl.getIsOpen());
                // listen for dropdowns being opened and toggle aria-expanded to reflect current state
                scope.$on('toggleThisDropdown', function () {
                    element.attr('aria-expanded', bcDropdownCtrl.getIsOpen());
                });
            };
        }
    };
});
'use strict';

angular.module('bcapp-pattern-lab.bc-dropdown-toggle.directive', []).directive('bcDropdownToggle', function ($compile) {
    return {
        restrict: 'A',
        terminal: true,
        priority: 1001, // set higher than ng-repeat to prevent double compilation
        require: '^bcDropdown',
        compile: function compile(tElement) {
            tElement.removeAttr('bc-dropdown-toggle');

            return function (scope, element, attrs, bcDropdownCtrl) {
                element.attr('dropdown-toggle', '#' + bcDropdownCtrl.getUniqueId());
                element.attr('aria-controls', bcDropdownCtrl.getUniqueId());
                element.on('click', bcDropdownCtrl.toggleIsOpen);
                $compile(element)(scope);
            };
        }
    };
});
'use strict';

angular.module('bcapp-pattern-lab.bc-dropdown.controller', []).controller('BcDropdownController', function bcDropdownController($scope, $rootScope) {
    var ctrl = this;
    var isOpen = false;
    var uniqueId = undefined;

    ctrl.closeDropdown = closeDropdown;
    ctrl.getIsOpen = getIsOpen;
    ctrl.getUniqueId = getUniqueId;
    ctrl.setIsOpen = setIsOpen;
    ctrl.toggleIsOpen = toggleIsOpen;

    // listen for other dropdowns being opened in the app.
    $scope.$on('bcDropdownToggle', function (event, triggeringID) {
        // if I'm open and not the dropdown being triggered, then I should close
        if (isOpen && triggeringID !== uniqueId) {
            ctrl.closeDropdown();
        }
    });

    function closeDropdown() {
        ctrl.setIsOpen(false);
        $scope.$broadcast('toggleThisDropdown');
    }

    function getIsOpen() {
        return isOpen;
    }

    function getUniqueId() {
        if (!uniqueId) {
            uniqueId = _.uniqueId('bc-dropdown-');
        }
        return uniqueId;
    }

    function setIsOpen(val) {
        isOpen = val;
    }

    function toggleIsOpen() {
        isOpen = !isOpen;
        // tell child directives a toggle in open status has occurred
        $scope.$broadcast('toggleThisDropdown');
        // tell application that a dropdown has been opened so others can close
        $rootScope.$broadcast('bcDropdownToggle', uniqueId);
    }
});
'use strict';

angular.module('bcapp-pattern-lab.bc-dropdown.directive', ['bcapp-pattern-lab.bc-dropdown.controller']).directive('bcDropdown', function ($document) {
    return {
        bindToController: true,
        controller: 'BcDropdownController',
        controllerAs: 'bcDropdownController',
        restrict: 'EA',
        compile: function compile(tElement) {
            tElement.attr('role', 'combobox');

            return function ($scope, $element, attrs, ctrl) {
                // This directive is a composite of 2 separate Foundation directives
                // which don't provide hooks to know when it's clicked or opened
                // they do however deal with propagation of events so this, somewhat blind
                // document event is safe. All it does is swap aria states at the moment
                // in a cheap way to keep this directive in sync with it's child directive
                $document.on('click', ctrl.closeDropdown);

                $element.on('$destroy', function () {
                    $document.off('click', ctrl.closeDropdown);
                });
            };
        }
    };
});
'use strict';

angular.module('bcapp-pattern-lab.bc-dropdown', ['bcapp-pattern-lab.bc-dropdown.directive', 'bcapp-pattern-lab.bc-dropdown-toggle.directive', 'bcapp-pattern-lab.bc-dropdown-menu.directive']);
'use strict';

angular.module('bcapp-pattern-lab.bc-pagination.directive', []).directive('bcPagination', function bcPaginationDirective($parse) {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'src/js/bigcommerce/bc-pagination/bc-pagination.tpl.html',

        compile: function bcPaginationCompile(tElement, tAttrs) {
            var attrObj = {};

            // Since this is a wrapper of angular-foundation's pagination directive we need to copy all
            // of the attributes passed to our directive and store them in the attrObj.
            _.each(tAttrs.$attr, function (key) {
                if (key !== 'class') {
                    attrObj[key] = tElement.attr(key);
                }
            });

            // Adding our custom callback to the attrObj, angular-foundation will call this function
            // when a page number is clicked in the pagination.
            attrObj['on-select-page'] = 'paginationCallback(page)';

            // Add all the attributes to angular-foundation's pagination directive
            tElement.find('pagination').attr(attrObj);

            return function bcPaginationLink($scope, element, attrs) {
                var onChangeParseGetter = $parse(attrs.onChange),
                    defaultLimits = [10, 20, 30, 50, 100];

                $scope.setLimit = function (limit, event) {
                    event.preventDefault();
                    limit = _.parseInt(limit);
                    $parse(attrs.itemsPerPage).assign($scope.$parent, limit);
                    $scope.paginationCallback(1, limit);
                };

                $scope.getCurrentPage = function () {
                    return $parse(attrs.page)($scope.$parent);
                };

                $scope.getCurrentLimit = function () {
                    return $parse(attrs.itemsPerPage)($scope.$parent);
                };

                $scope.getItemsPerPage = function () {
                    return $parse(attrs.itemsPerPage)($scope.$parent) || 0;
                };

                $scope.getTotalItems = function () {
                    return $parse(attrs.totalItems)($scope.$parent) || 0;
                };

                $scope.show = function () {
                    return $parse(attrs.alwaysShow)($scope.$parent) || $scope.getTotalItems() > $scope.getItemsPerPage();
                };

                $scope.showLimits = function () {
                    return $scope.show() && $parse(attrs.showLimits)($scope.$parent) !== false;
                };

                $scope.getLimits = function () {
                    var limits = $parse(attrs.limits)($scope.$parent);

                    if (!Array.isArray(limits)) {
                        return defaultLimits;
                    }

                    return limits;
                };

                $scope.paginationCallback = function (page, limit) {
                    var additionalScopeProperties = {
                        limit: limit || $scope.getCurrentLimit(),
                        page: page
                    },
                        onChangeParseResult;

                    $parse(attrs.page).assign($scope.$parent, page);

                    onChangeParseResult = onChangeParseGetter($scope, additionalScopeProperties);

                    // if the onChange string is a function and not an expression: call it with the additionalScopeProperties obj (for backwards compatability)
                    // else the expression has already been ran: do nothing
                    if (typeof onChangeParseResult === 'function') {
                        onChangeParseResult(additionalScopeProperties);
                    }
                };
            };
        }
    };
});
'use strict';

angular.module('bcapp-pattern-lab.bc-pagination', ['bcapp-pattern-lab.bc-pagination.directive']);
'use strict';

angular.module('bcapp-pattern-lab.color-picker-palette.controller', []).controller('ColorPickerPaletteCtrl', function () {
    var ctrl = this;

    ctrl.createNewColor = createNewColor;
    ctrl.removeExistingColor = removeExistingColor;
    ctrl.isActive = isActive;

    function createNewColor($event) {
        $event.preventDefault();

        ctrl.createNewPaletteColor();
    }

    function removeExistingColor($event) {
        $event.preventDefault();

        ctrl.removePaletteColor();
    }

    function isActive(color) {
        return color === ctrl.selectedColor;
    }
});
'use strict';

angular.module('bcapp-pattern-lab.color-picker-palette.directive', ['bcapp-pattern-lab.color-picker-palette.controller']).directive('colorPickerPalette', function colorPickerPaletteDirective() {
    return {
        bindToController: true,
        controller: 'ColorPickerPaletteCtrl',
        controllerAs: 'colorPickerPaletteCtrl',
        restrict: 'E',
        scope: {
            colors: '=',
            createNewPaletteColor: '=',
            removePaletteColor: '=',
            setNewColor: '=',
            selectedColor: '@'
        },
        templateUrl: 'src/js/bigcommerce/color-picker/color-picker-palette.tpl.html',
        compile: function colorPickerPaletteDirectiveCompile(tElement) {
            tElement.addClass('colorPicker-palette');
        }
    };
});
/* globals ColorPicker */
'use strict';

angular.module('bcapp-pattern-lab.color-picker.controller', []).controller('ColorPickerCtrl', function ColorPickerCtrl($element) {
    var ctrl = this;

    var colorSelection = undefined;
    var colorSelectionIndicator = undefined;
    var colorSlider = undefined;
    var colorSliderIndicator = undefined;

    ctrl.createColorPicker = createColorPicker;
    ctrl.createNewPaletteColor = createNewPaletteColor;
    ctrl.removePaletteColor = removePaletteColor;
    ctrl.setModelCtrl = setModelCtrl;
    ctrl.setNewColor = setNewColor;
    ctrl.getSelectedColor = getSelectedColor;

    function createColorPicker() {
        colorSelection = $element[0].querySelector('[data-bc-picker]');
        colorSelectionIndicator = $element[0].querySelector('[data-bc-picker-indicator]');
        colorSlider = $element[0].querySelector('[data-bc-slider]');
        colorSliderIndicator = $element[0].querySelector('[data-bc-slider-indicator]');

        ColorPicker.fixIndicators(colorSliderIndicator, colorSelectionIndicator);

        ctrl.cp = new ColorPicker(colorSlider, colorSelection, pickNewColor);
    }

    function createNewPaletteColor() {
        if (ctrl.palette.indexOf(getSelectedColor()) < 0) {
            ctrl.palette.push(getSelectedColor());
        }
    }

    function removePaletteColor() {
        if (ctrl.palette.indexOf(getSelectedColor()) > -1) {
            ctrl.palette.splice(ctrl.palette.indexOf(getSelectedColor()), 1);
        }
    }

    function getSelectedColor() {
        return ctrl.color;
    }

    function pickNewColor(hex, hsv, rgb, pickerCoordinate, sliderCoordinate) {
        ColorPicker.positionIndicators(colorSliderIndicator, colorSelectionIndicator, sliderCoordinate, pickerCoordinate);

        ctrl.ngModelCtrl.$setViewValue(hex);
        ctrl.ngModelCtrl.$render();
    }

    function render() {
        ctrl.color = ctrl.ngModelCtrl.$viewValue;
    }

    function setModelCtrl(ngModelCtrl) {
        ctrl.ngModelCtrl = ngModelCtrl;
        ctrl.ngModelCtrl.$render = render;
    }

    function setNewColor($event, newColor) {
        $event.preventDefault();

        ctrl.cp.setHex(newColor);
    }
});
'use strict';

angular.module('bcapp-pattern-lab.color-picker.directive', ['bcapp-pattern-lab.color-picker.controller', 'bcapp-pattern-lab.html5Mode']).directive('colorPicker', function colorPickerDirective($location, html5Mode) {
    return {
        bindToController: true,
        controller: 'ColorPickerCtrl',
        controllerAs: 'colorPickerCtrl',
        require: ['colorPicker', '^ngModel'],
        restrict: 'E',
        scope: {
            palette: '='
        },
        templateUrl: 'src/js/bigcommerce/color-picker/color-picker.tpl.html',

        compile: function colorPickerDirectiveCompile(tElement) {
            tElement.addClass('colorPicker');

            return function colorPickerDirectiveLink($scope, element, attrs, ctrls) {
                var ctrl = ctrls[0];
                var ngModelCtrl = ctrls[1];

                ctrl.setModelCtrl(ngModelCtrl);
                ctrl.createColorPicker();

                // Apps that have a <base> tag require to have absolute paths
                // when using svg url references
                if (html5Mode.enabled) {
                    _.each(element[0].querySelectorAll('[fill]'), function (el) {
                        var betweenParenthesis = /\(([^)]+)\)/;
                        var elem = angular.element(el);
                        var currentFill = elem.attr('fill');

                        if (_.contains(currentFill, 'url(#')) {
                            var newFill = betweenParenthesis.exec(currentFill)[1];

                            elem.attr('fill', 'url(' + $location.absUrl() + newFill + ')');
                        }
                    });
                }

                $scope.$watch(getModelValue, function modelWatch(newVal) {
                    if (newVal) {
                        ctrl.cp.setHex(newVal);
                    }
                });

                function getModelValue() {
                    return ctrl.ngModelCtrl.$modelValue;
                }
            };
        }
    };
});
'use strict';

angular.module('bcapp-pattern-lab.color-picker', ['bcapp-pattern-lab.color-picker.directive', 'bcapp-pattern-lab.color-picker-palette.directive']);
'use strict';

angular.module('bcapp-pattern-lab.copy-clipboard.constant', []).factory('CLIPBOARD_TOOLTIP', function (gettextCatalog) {
    return {
        success: {
            'default': gettextCatalog.getString('Copied!')
        },
        error: {
            mobile: gettextCatalog.getString('Tap down and hold to copy'),
            mac: gettextCatalog.getString('Press ⌘-C to copy'),
            'default': gettextCatalog.getString('Press Ctrl-C to copy')
        }
    };
});
'use strict';

angular.module('bcapp-pattern-lab.copy-clipboard.controller', []).controller('CopyClipboardCtrl', function CopyClipboardCtrl(CLIPBOARD_TOOLTIP, deviceService, $timeout) {
    var ctrl = this;

    ctrl.timeout = $timeout;
    ctrl.onError = onError;
    ctrl.onSuccess = onSuccess;

    init();

    function init() {
        ctrl.uniqueId = _.uniqueId('clipboard-');
    }

    function onSuccess() {
        ctrl.dynamicTooltip = CLIPBOARD_TOOLTIP.success['default'];
        showTooltip(ctrl.uniqueId);
    }

    function onError() {
        var tooltipMessage;

        if (deviceService.isIOSDevice() || deviceService.isMobileDevice()) {
            tooltipMessage = CLIPBOARD_TOOLTIP.error.mobile;
        } else if (deviceService.isMacOSDevice()) {
            tooltipMessage = CLIPBOARD_TOOLTIP.error.mac;
        } else {
            tooltipMessage = CLIPBOARD_TOOLTIP.error['default'];
        }

        ctrl.dynamicTooltip = tooltipMessage;
        showTooltip(ctrl.uniqueId);
    }

    function showTooltip(id) {
        var tooltipElement = angular.element(document.getElementById(id));

        ctrl.timeout(function () {
            tooltipElement.triggerHandler('tooltipTriggerOpen');
            ctrl.timeout(function () {
                tooltipElement.triggerHandler('tooltipTriggerClose');
            }, 1000);
        });
    }
});
'use strict';

angular.module('bcapp-pattern-lab.copy-clipboard.directive', []).directive('copyClipboard', function copyClipboardDirective() {
    return {
        bindToController: true,
        controller: 'CopyClipboardCtrl as copyClipboardCtrl',
        restrict: 'E',
        scope: {
            copyText: '@',
            readonly: '@'
        },
        templateUrl: 'src/js/bigcommerce/copy-clipboard/copy-clipboard.tpl.html'
    };
});
'use strict';

angular.module('bcapp-pattern-lab.copy-clipboard', ['bcapp-pattern-lab.copy-clipboard.constant', 'bcapp-pattern-lab.copy-clipboard.controller', 'bcapp-pattern-lab.copy-clipboard.directive']);
/**
 * @name credit-card directive
 * @description Component containing cc number, cvc, name, and expiry. Has an isolated scope with no controller.
 * @require form
 *
 * @param ccData {object} Contains ccNumber, ccType, ccExpiry, and ccName
 * @param ccConfig {object} The configuration object. Currently supporting:
 *  - cardCode {boolean} Indicates whether the cvv field should be shown. Default true.
 *  - cardCodeRequired {boolean} Indicates whether the cvv field is required. This only matters when cardCode is set to true. Default true.
 *  - fullName {boolean} Indicates whether the name field should be shown. Default true.
 * @param eagerType {boolean} If this attribute is set to false, then disable eager type detection. Defaults true.
 */
'use strict';

angular.module('bcapp-pattern-lab.credit-card.directive', ['bcapp-pattern-lab.icon']).directive('creditCard', function creditCardDirective($compile, $parse, $templateCache) {
    var cvvTooltipTemplate = $templateCache.get('src/js/bigcommerce/credit-card/credit-card-cvv/tooltip.tpl.html');

    return {
        compile: function creditCardCompile(tElem, tAttrs) {
            var isEagerType = true;

            if (tAttrs.eagerType && $parse(tAttrs.eagerType)() === false) {
                var ccNumber = tElem[0].querySelector('#ccNumber');

                ccNumber.removeAttribute('ccEagerType');
                isEagerType = false;
            }

            return function creditCardLink(scope, elem, attr, formCtrl) {
                var cvvTooltipElement = $compile(cvvTooltipTemplate)(scope);
                var defaultConfig = {
                    cardCode: true,
                    cardCodeRequired: true,
                    fullName: true
                };

                scope.getCvvTooltipHtml = getCvvTooltipHtml;

                init();

                function init() {
                    scope.formCtrl = formCtrl;
                    scope.ccConfig = _.defaults(scope.ccConfig, defaultConfig);

                    /**
                     * The credit card type is deduced by the `ccNumber` directive. This is in turn exposed
                     * as either `$ccEagerType` or `$ccType` on the input control element. Watch for changes and bind the type to the corresponding
                     * value on ccData.
                     */
                    scope.$watch(getDetectedCcType, setCcType);
                }

                /**
                 * Return the html for the tooltip. Using outerHTML to also include the root element
                 * @return {String} Html string for the cvv tooltip template
                 */
                function getCvvTooltipHtml() {
                    return cvvTooltipElement[0].outerHTML;
                }

                /**
                 * Get the detected credit card type exposed on the form control by the ccNumber child directive.
                 * This value will be exposed as $ccEagerType or $ccType depending on whether this feature is enabled.
                 * @return {string|null}
                 */
                function getDetectedCcType() {
                    return isEagerType ? formCtrl.ccNumber.$ccEagerType : formCtrl.ccNumber.$ccType;
                }

                /**
                 * Set ccData.ccType
                 * @param {string|null} type The credit card type, i.e. 'visa'
                 * @return {string|null} type
                 */
                function setCcType(type) {
                    scope.ccData.ccType = type;

                    return type;
                }
            };
        },
        require: '^form',
        restrict: 'EA',
        scope: {
            ccData: '=',
            ccConfig: '='
        },
        templateUrl: 'src/js/bigcommerce/credit-card/credit-card.tpl.html'
    };
});
'use strict';

angular.module('bcapp-pattern-lab.credit-card', ['credit-cards', 'bcapp-pattern-lab.credit-card.bc-cvc', 'bcapp-pattern-lab.credit-card.cc-expiry', 'bcapp-pattern-lab.credit-card.directive', 'gettext']);
'use strict';

angular.module('bcapp-pattern-lab.credit-card-types.constant', []).constant('CC_TYPES', {
    'American Express': 'amex',
    'Diners Club': 'dinersclub',
    'Discover': 'discover',
    'MasterCard': 'mastercard',
    'Visa': 'visa'
});
'use strict';

angular.module('bcapp-pattern-lab.credit-card-types.controller', ['bcapp-pattern-lab.credit-card-types.constant']).controller('CreditCardTypesCtrl', function CreditCardTypesCtrl($element, CC_TYPES) {
    var ctrl = this;

    ctrl.hasSelectedType = hasSelectedType;
    ctrl.isSelectedType = isSelectedType;
    ctrl.mapToSvg = mapToSvg;

    init();

    function init() {
        $element.addClass('creditCardTypes');
    }

    /**
     * Checks whether a type has been selected (or detected by the credit-card component)
     * @return {Boolean}
     */
    function hasSelectedType() {
        return !_.isEmpty(ctrl.getSelectedType());
    }

    /**
     * Checks if the passed in ccType is the same as the selected ccType
     * @param ccType {String}
     * @return {Boolean}
     */
    function isSelectedType(ccType) {
        return ccType === ctrl.getSelectedType();
    }

    /**
     * Map the ccType to a corresponding svg name
     * @param ccType {String}
     * @return {String}
     */
    function mapToSvg(ccType) {
        return CC_TYPES[ccType];
    }
});
/**
 * @name credit-card-types directive
 * @description Component displaying and greying out credit card type icons based on the selected credit card type.
 * `.is-active` is added to the corresponding selected credit card type. `.not-active` is added for the other
 * types. If no credit card types has been selected, then neither `.is-active` and `.not-active` will be added at all.
 *
 * @param selectedType {String} Credit card type. Valid types are 'Visa', 'MasterCard', 'Diners Club', 'Discover', and 'American Express'
 * @param supportedTypes {Array} Array of credit card types to display. The card types use the same strings: 'American Express', 'Discover', 'MasterCard', 'Visa'
 */
'use strict';

angular.module('bcapp-pattern-lab.credit-card-types.directive', ['bcapp-pattern-lab.credit-card-types.controller']).directive('creditCardTypes', function creditCardTypesDirective() {
    return {
        bindToController: true,
        controller: 'CreditCardTypesCtrl as creditCardTypesCtrl',
        restrict: 'E',
        scope: {
            getSelectedType: '&selectedType',
            getSupportedTypes: '&supportedTypes'
        },
        templateUrl: 'src/js/bigcommerce/credit-card-types/credit-card-types.tpl.html'
    };
});
'use strict';

angular.module('bcapp-pattern-lab.credit-card-types', ['bcapp-pattern-lab.credit-card-types.constant', 'bcapp-pattern-lab.credit-card-types.controller', 'bcapp-pattern-lab.credit-card-types.directive']);
'use strict';

angular.module('bcapp-pattern-lab.form.directive', []).directive('form', function formDirective() {
    return {
        restrict: 'E',
        link: function formLink(scope, element, attrs) {
            element.addClass('form');
            element.attr('novalidate', '');

            // Use disable-auto-focus="true" to turn off automatic error focusing
            if (!attrs.disableAutoFocus) {
                element.on('submit', function formAutoFocusSubmitHandler() {
                    var invalidField = element[0].querySelector('.ng-invalid');

                    if (invalidField) {
                        invalidField.focus();

                        // Auto-select existing text for fields that support it (text, email, password, etc.)
                        if (invalidField.select) {
                            invalidField.select();
                        }
                    }
                });
            }
        }
    };
});
'use strict';

angular.module('bcapp-pattern-lab.form', ['bcapp-pattern-lab.form.directive']);
'use strict';

angular.module('bcapp-pattern-lab.form-field-error.directive', []).directive('formFieldError', function formFieldErrorDirective($compile) {
    return {
        priority: 10,
        replace: true,
        restrict: 'EA',
        templateUrl: 'src/js/bigcommerce/form-field-error/form-field-error.tpl.html',
        terminal: true,
        transclude: true,
        compile: function formFieldErrorCompile(tElement, tAttrs) {
            // The translate property wipes out our ng-message logic in the post link function
            // The priority and terminal properties above ensure this check occurs
            if (tElement.attr('translate') !== undefined) {
                throw new SyntaxError('The translate attribute cannot be used with the form-field-error directive. ' + 'Use the translate filter instead (example: {{ "my error message" | translate }}). ' + 'Validator: ' + tAttrs.validate);
            }

            return {
                post: function formFieldErrorPostLink(scope, element, attrs, controllers, transclude) {
                    scope.property = scope.property || attrs.property;

                    transclude(function formFieldErrorTransclude(errorClone) {
                        var labelElement = angular.element('<label>');

                        // ngMessage doesn't play well with dynamic message insertion, translation, or
                        // message expressions, so we build its element up here and inject it into the DOM
                        labelElement.attr('for', scope.property);
                        labelElement.attr('ng-message', attrs.validate);
                        labelElement.attr('role', 'alert');
                        labelElement.addClass('form-inlineMessage');

                        // The error span should already have a translation watcher on it by now, using a filter
                        labelElement.append(errorClone);

                        element.append(labelElement);

                        $compile(element)(scope);
                    });
                }
            };
        }
    };
});
'use strict';

angular.module('bcapp-pattern-lab.form-field-error', ['bcapp-pattern-lab.form-field-error.directive']);
'use strict';

angular.module('bcapp-pattern-lab.form-field.directive', []).directive('formField', function formFieldDirective($log) {
    return {
        require: '^form',
        restrict: 'EA',
        scope: true,
        link: {
            pre: function formFieldLink(scope, element, attrs) {
                // Inherited by the form-field-errors directive to avoid redeclaration
                scope.property = attrs.property;
            },

            post: function formFieldLink(scope, element, attrs, formCtrl) {
                // Locates and watches the matching input/select/etc (based on its name attribute) in the parent form
                var property = attrs.property;

                init();

                function init() {
                    element.addClass('form-field');

                    // If a property wasn't provided, we can't do much else
                    if (!property) {
                        return;
                    }

                    // Update the interface if the form is submitted or the property's validity state changes
                    scope.$watch(isSubmitted, checkValidity);
                    scope.$watch(isInvalid, checkValidity);
                }

                function checkValidity() {
                    // If a property was provided, but no ng-model was defined for the field, validation won't work
                    if (!hasModel() && isSubmitted()) {
                        return $log.info('Form fields containing inputs without an ng-model property will not be validated');
                    }

                    // Only show an error if the user has already attempted to submit the form
                    element.toggleClass('form-field--error', isSubmitted() && isInvalid());
                }

                function hasModel() {
                    return !!formCtrl[property];
                }

                function isSubmitted() {
                    return formCtrl.$submitted;
                }

                function isInvalid() {
                    if (!hasModel()) {
                        return false;
                    }

                    return formCtrl[property].$invalid;
                }
            }
        }
    };
});
'use strict';

angular.module('bcapp-pattern-lab.form-field', ['bcapp-pattern-lab.form-field.directive', 'bcapp-pattern-lab.form-field-error', 'bcapp-pattern-lab.form-field-errors']);
'use strict';

angular.module('bcapp-pattern-lab.form-field-errors.directive', []).directive('formFieldErrors', function formFieldErrorsDirective() {
    return {
        replace: true,
        require: '^form',
        restrict: 'EA',
        templateUrl: 'src/js/bigcommerce/form-field-errors/form-field-errors.tpl.html',
        transclude: true,
        link: {
            // Pre-link is required, as we have to inject our scope properties before the child
            // form-field-error directive (and its internal ng-message directive's) post-link functions
            pre: function formFieldErrorsPreLink(scope, element, attrs, formCtrl) {
                // Property name can be inherited from parent scope, such as from the form-field directive
                var property = scope.property || attrs.property,
                    propertyField = formCtrl[property];

                // Inherited by form-field-error directive. Lives directly on scope because the require
                // property does not work well with directive controller instances
                scope.formCtrl = formCtrl;
                scope.property = property;
                scope.propertyField = propertyField;
            }
        }
    };
});
'use strict';

angular.module('bcapp-pattern-lab.form-field-errors', ['bcapp-pattern-lab.form-field-errors.directive']);
'use strict';

angular.module('bcapp-pattern-lab.form-input-color.controller', []).controller('FormInputColorCtrl', function ($element, $rootScope, $scope) {
    var ctrl = this;
    var hexColorRegex = /^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$/;

    var isVisible = false;

    ctrl.blurEventHandler = blurEventHandler;
    ctrl.focusEventHandler = focusEventHandler;
    ctrl.hidePicker = hidePicker;
    ctrl.isPickerVisible = isPickerVisible;
    ctrl.onChange = onChange;
    ctrl.setModelCtrl = setModelCtrl;
    ctrl.showPicker = showPicker;
    ctrl.uniqueId = getUniqueID('formInputColor-');

    $scope.$on('bcColorPickerOpened', function (event, triggeringElement) {
        if ($element === triggeringElement) {
            return;
        }

        ctrl.hidePicker();
    });

    function blurEventHandler($event) {
        if ($element[0].contains($event.relatedTarget)) {
            return;
        }

        ctrl.hidePicker();
    }

    function focusEventHandler($event) {
        $event.preventDefault();
        ctrl.showPicker();
    }

    function getUniqueID(idPrefix) {
        return _.uniqueId(idPrefix);
    }

    function hidePicker() {
        if (ctrl.isPickerVisible()) {
            ctrl.isPickerVisible(false);
        }
    }

    function isPickerVisible(isVisibleToSet) {
        if (isVisibleToSet !== undefined) {
            isVisible = isVisibleToSet;
        }

        return isVisible;
    }

    function onChange() {
        if (hexColorRegex.test(ctrl.color)) {
            ctrl.lastValidColor = ctrl.color;
            ctrl.ngModelCtrl.$setViewValue(ctrl.color);
        }
    }

    function render() {
        ctrl.color = ctrl.ngModelCtrl.$viewValue;
        ctrl.lastValidColor = ctrl.color;
    }

    function setModelCtrl(ngModelCtrl) {
        ctrl.ngModelCtrl = ngModelCtrl;
        ctrl.ngModelCtrl.$render = render;
    }

    function showPicker() {
        $rootScope.$broadcast('bcColorPickerOpened', $element);
        ctrl.isPickerVisible(true);
    }
});
'use strict';

angular.module('bcapp-pattern-lab.form-input-color.directive', ['bcapp-pattern-lab.form-input-color.controller']).directive('formInputColor', function formInputColorDirective($document) {
    return {
        bindToController: true,
        controller: 'FormInputColorCtrl',
        controllerAs: 'formInputColorCtrl',
        require: ['formInputColor', '^ngModel'],
        restrict: 'E',
        scope: {
            labelText: '=',
            palette: '=',
            placeholderText: '='
        },
        templateUrl: 'src/js/bigcommerce/form-input-color/form-input-color.tpl.html',

        compile: function formInputColorDirectiveCompile(tElement) {
            tElement.addClass('form-inputColor');

            return function formInputColorDirectiveLink($scope, element, attrs, ctrls) {
                var ctrl = ctrls[0];
                var ngModelCtrl = ctrls[1];

                ctrl.setModelCtrl(ngModelCtrl);

                $document.on('keydown', keydownEventHandler);
                $document.on('mousedown', mouseDownEventHandler);

                $scope.$on('$destroy', function () {
                    $document.off('mousedown', mouseDownEventHandler);
                    $document.off('keydown', keydownEventHandler);
                });

                function keydownEventHandler($event) {
                    if ($event.which === 27) {
                        $scope.$apply(function () {
                            ctrl.hidePicker();
                        });
                    }
                }

                function mouseDownEventHandler($event) {
                    if (element[0].contains($event.target)) {
                        return;
                    }
                    $scope.$apply(function () {
                        ctrl.hidePicker();
                    });
                }
            };
        }
    };
});
'use strict';

angular.module('bcapp-pattern-lab.form-input-color', ['bcapp-pattern-lab.form-input-color.directive']);
'use strict';

angular.module('bcapp-pattern-lab.global-message.directive', []).directive('globalMessage', function globalMessageDirective($timeout) {
    var TIMEOUT = 8000;

    return {
        restrict: 'E',
        templateUrl: 'src/js/bigcommerce/global-message/global-message.tpl.html',
        scope: {
            action: '@',
            actionCallback: '&?',
            dismissCallback: '&?'
        },
        transclude: true,
        link: link
    };

    function link(scope, element, attrs) {
        var promise = startTimer();

        // No longer needed with 1.5. See angular/angular.js#6404
        scope.actionCallback = attrs.actionCallback ? scope.actionCallback : false;
        scope.dismissCallback = attrs.dismissCallback ? scope.dismissCallback : false;

        init();

        function init() {
            element.on('mouseenter $destroy', function () {
                $timeout.cancel(promise);
            });

            element.on('mouseleave', function () {
                promise = startTimer();
            });
        }

        function startTimer() {
            return $timeout(dismiss, TIMEOUT);
        }

        function dismiss() {
            if (scope.dismissCallback) {
                scope.dismissCallback();
            }
            element.remove();
        }
    }
});
'use strict';

angular.module('bcapp-pattern-lab.global-message', ['bcapp-pattern-lab.global-message.directive']);
'use strict';

angular.module('bcapp-pattern-lab.html5Mode', ['bcapp-pattern-lab.html5Mode.service']);
'use strict';

angular.module('bcapp-pattern-lab.html5Mode.service', []).provider('html5Mode', function html5ModeProvider($locationProvider) {
    this.$get = function html5ModeService() {
        return $locationProvider.html5Mode();
    };
});
'use strict';

angular.module('bcapp-pattern-lab.checkbox-list.controller', []).controller('CheckboxListCtrl', function CheckboxListCtrl($attrs, $element, $log, $parse, $scope) {
    var ctrl = this,
        falseValue = $parse($attrs.ngFalseValue)(ctrl) || false,
        trueValue = $parse($attrs.ngTrueValue)(ctrl) || true,
        ngModel = $element.controller('ngModel');

    init();

    // Getters
    function getModelValue() {
        return ngModel.$modelValue;
    }

    function getValue() {
        return ctrl.value || ctrl.ngValue;
    }

    function getSelectedValues() {
        return ctrl.selectedValues;
    }

    // Setters
    function updateModelValue(modelValue) {
        ngModel.$setViewValue(modelValue);
        ngModel.$commitViewValue();
        ngModel.$render();
    }

    function updateSelectedValues(modelValue) {
        if (modelValue === trueValue) {
            addToSelectedValues();
        } else if (modelValue === falseValue) {
            removeFromSelectedValues();
        }
    }

    function addToSelectedValues() {
        var isIncluded = _.include(ctrl.selectedValues, getValue());

        if (!isIncluded) {
            ctrl.selectedValues.push(getValue());
        }
    }

    function removeFromSelectedValues() {
        var index = _.indexOf(ctrl.selectedValues, getValue());

        if (index !== -1) {
            ctrl.selectedValues.splice(index, 1);
        }
    }

    // Watchers
    function modelValueWatch(modelValue, oldModelValue) {
        var oldSelectedValues, selectedValuesChanged;

        // When ngModel value changes
        if (_.isUndefined(modelValue) || modelValue === oldModelValue) {
            return;
        }

        // Retain a shallow copy of selectedValues before update
        oldSelectedValues = ctrl.selectedValues.slice();

        // Update selectedValues
        updateSelectedValues(modelValue);

        // Determine if selectedValues array has changed
        selectedValuesChanged = !!_.xor(ctrl.selectedValues, oldSelectedValues).length;

        // If changed, evoke delegate method (if defined)
        if (ctrl.onChange && selectedValuesChanged) {
            ctrl.onChange({
                selectedValues: ctrl.selectedValues,
                oldSelectedValues: oldSelectedValues
            });
        }
    }

    function selectedValuesWatch(selectedValues) {
        // When selectedValues collection changes
        var isIncluded = _.include(selectedValues, getValue()),
            modelValue = getModelValue();

        if (isIncluded && modelValue !== trueValue) {
            updateModelValue(trueValue);
        } else if (!isIncluded && modelValue !== falseValue) {
            updateModelValue(falseValue);
        }
    }

    // Initializer
    function init() {
        if ($attrs.type !== 'checkbox') {
            $log.error('checkbox-list directive: element must be <input type="checkbox">');

            return;
        }

        $scope.$watch(getModelValue, modelValueWatch);
        $scope.$watchCollection(getSelectedValues, selectedValuesWatch);
    }
});
'use strict';

angular.module('bcapp-pattern-lab.checkbox-list.directive', ['bcapp-pattern-lab.checkbox-list.controller'])

/**
 * A directive for collating values from an array of checkboxes.
 *
 * @require ngModel
 * @param {Array.<string|number|Object>} checkboxList - Array to hold selected values
 * @param {*} value - Value to add to checkboxList
 * @param {function(selectedValues, oldSelectedValues} [checkboxListChange] - Optional onChange callback
 *
 * @example:
 * ```html
 * <div ng-repeat="option in options">
 *     <input type="checkbox" 
 *         name="option{{ option.id }}"
 *         value="option.id" 
 *         checkbox-list="selectedValues" 
 *         checkbox-list-change="onChange(selectedValues)" 
 *         ng-model="option.checked"
 *     />
 * </div>
 * ```
 * 
 * ```js
 * scope.selectedValues = [];
 * scope.options = [
 *     {
 *         id: 1,
 *         label: 'Option 1'
 *     },
 *     {
 *         id: 2,
 *         label: 'Option 2'
 *     },
 *     {
 *         id: 3,
 *         label: 'Option 3'
 *     }
 * ];
 * 
 * scope.onChange = function onChange(selectedValues) {
 *     console.log(selectedValues);
 * };
 * ```
 * 
 * When options[0] and options[1] are checked, selectedValues should be [1, 2]
 * and onChange will be evoked. This directive also works with an array of primitive values.
 * i.e.: scope.options = ["a", "b", "c"].
 */

.directive('checkboxList', function checkboxListDirective() {
    return {
        restrict: 'A',
        require: 'ngModel',
        controller: 'CheckboxListCtrl',
        controllerAs: 'checkboxListCtrl',
        bindToController: true,
        scope: {
            onChange: '&checkboxListChange',
            selectedValues: '=checkboxList',
            value: '=',
            ngValue: '='
        }
    };
});
'use strict';

angular.module('bcapp-pattern-lab.checkbox-list', ['bcapp-pattern-lab.checkbox-list.directive']);
'use strict';

angular.module('bcapp-pattern-lab.icon.controller', ['bcapp-pattern-lab.html5Mode', 'bcapp-pattern-lab.icon.svgRootPath']).controller('IconCtrl', function iconDirectiveController($http, $location, $templateCache, html5Mode, svgRootPath) {
    var absUrl = $location.absUrl();
    var ctrl = this;

    ctrl.changeUrlsToAbsolute = changeUrlsToAbsolute;
    ctrl.changeXlinksToAbsolute = changeXlinksToAbsolute;
    ctrl.updateGlyph = updateGlyph;

    function updateGlyph(glyph) {
        var fullSvgPath = svgRootPath + glyph + '.svg';

        return $http.get(fullSvgPath, { cache: $templateCache }).then(function iconDirectiveHttpSuccess(response) {
            var stringifiedElement = response.data;

            if (html5Mode.enabled) {
                stringifiedElement = changeUrlsToAbsolute(stringifiedElement);
                stringifiedElement = changeXlinksToAbsolute(stringifiedElement);
            }

            return stringifiedElement;
        });
    }

    function changeUrlsToAbsolute(stringifiedElement) {
        return stringifiedElement.replace(/url\((['"]?)#/gi, 'url($1' + absUrl + '#');
    }

    function changeXlinksToAbsolute(stringifiedElement) {
        return stringifiedElement.replace(/xlink:href=(['"]?)#/gi, 'xlink:href=$1' + absUrl + '#');
    }
});
/**
 * @description Icon directive used to load an inline svg icon, simliar to icon
 *              font methods of past <i class="icon-foo-bar"></i>
 * @example
 * <icon glyph="ic-add-circle"></icon>
 */
'use strict';

angular.module('bcapp-pattern-lab.icon.directive', ['bcapp-pattern-lab.icon.controller']).directive('icon', function iconDirective() {
    return {
        bindToController: true,
        controller: 'IconCtrl as iconCtrl',
        restrict: 'E',
        scope: {
            glyph: '@'
        },
        compile: function iconDirectiveCompile(tElement) {
            tElement.addClass('icon');
            tElement.attr('aria-hidden', true);

            return function iconDirectiveLink($scope, element, attrs, ctrl) {
                attrs.$observe('glyph', function iconDirectiveLinkWatch(newValue) {
                    ctrl.updateGlyph(newValue).then(function iconUpdateGlyphThen(svg) {
                        element.html(svg);
                    });
                });
            };
        }
    };
});
'use strict';

angular.module('bcapp-pattern-lab.icon', ['bcapp-pattern-lab.icon.directive']);
'use strict';

angular.module('bcapp-pattern-lab.icon.svgRootPath', []).provider('svgRootPath', function svgRootPathProviderConfig() {
    this.setRootPath = setRootPath;
    this.$get = function svgRootPathProviderGet($log) {
        if (this.svgRootPath === undefined) {
            $log.error('No svgRootPath provided. Please configure this using the svgRootPathProvider');
        }

        return this.svgRootPath;
    };

    function setRootPath(newRootPath) {
        this.svgRootPath = newRootPath;
    }
});
'use strict';

angular.module('bcapp-pattern-lab.bc-server-table.controller', ['bcapp-pattern-lab.bc-server-table.service']).controller('BcServerTableCtrl', function BcServerTableCtrl($attrs, $log, $parse, $scope, BcServerTable) {
    var ctrl = this,
        bcServerTablePrototype = BcServerTable.prototype;

    // Call the BcServerTable constructor on the controller
    // in order to set all the controller properties directly.
    // This is here for backwards compatability purposes.
    BcServerTable.call(ctrl, null, $parse($attrs.tableConfig)($scope));

    // controller functions
    ctrl.createParamsObject = bcServerTablePrototype.createParamsObject;
    ctrl.deselectAllRows = bcServerTablePrototype.deselectAllRows;
    ctrl.fetchResource = bcServerTablePrototype.fetchResource;
    ctrl.getSelectedRows = bcServerTablePrototype.getSelectedRows;
    ctrl.init = bcServerTablePrototype.init;
    ctrl.isRowSelected = bcServerTablePrototype.isRowSelected;
    ctrl.loadStateParams = bcServerTablePrototype.loadStateParams;
    ctrl.selectAllRows = bcServerTablePrototype.selectAllRows;
    ctrl.setPaginationValues = bcServerTablePrototype.setPaginationValues;
    ctrl.setRows = bcServerTablePrototype.setRows;
    ctrl.setSelectionForAllRows = bcServerTablePrototype.setSelectionForAllRows;
    ctrl.setSortingValues = bcServerTablePrototype.setSortingValues;
    ctrl.updatePage = _.bind(bcServerTablePrototype.updatePage, ctrl);
    ctrl.updateSort = bcServerTablePrototype.updateSort;
    ctrl.updateTable = bcServerTablePrototype.updateTable;
    ctrl.validateResource = bcServerTablePrototype.validateResource;

    init();

    function init() {
        var resourceCallback;

        resourceCallback = $parse($attrs.resourceCallback)($scope);
        if (!_.isFunction(resourceCallback)) {
            $log.error('bc-server-table directive: resource-callback must be a function.');
            return;
        }
        ctrl.resourceCallback = resourceCallback;

        ctrl.init();
    }
});
'use strict';

angular.module('bcapp-pattern-lab.bc-server-table.directive', ['bcapp-pattern-lab.bc-server-table.controller', 'bcapp-pattern-lab.bc-server-table.sort-by.directive', 'ui.router'])
/**
 * The bc-server-table directive creates a data table that handles
 * server side pagination, sorting, and filtering. It exposes a few scope variables,
 * that can be used to display the table content with custom markup (see example
 * in the pattern lab for an actual implementation of the bc-server-table).
 *
 * The following attributes can be passed in order to configure the bc-server-table:
 * - resource-callback (required)
 * - tableConfig (optional)
 *
 * - resource-callback - a function that returns a promise which is resovled
 * with an object of the following format:
 *      {
 *          rows: Array,
 *          pagination: {
 *              page: Number,
 *              limit: Number,
 *              total: Number
 *          }
 *      }
 *
 * This directive exposes a scope variable called bcServerTable that
 * can be used to display content, and implement additional functionality
 * to the table (such as pagination, sorting, and selection logic).
 *
 * - bcServerTable.rows
 *      - Can be used with ng-repeat to display the data
 * - bcServerTable.filters
 *      - Can be used to change/update filters. These filters must appear
 *        in the state definition in order to work correctly.
 * - bcServerTable.updateTable()
 *      - Perform a state transistion with the current table info
 * - bcServerTable.pagination
 *      - exposes page, limit, and total
 * - bcServerTable.setPaginationValues(pagination)
 *      - convenience method for setting pagination values at once.
 *
 * - bcServerTable.selectedRows
 *      - an map object with unique id's as keys and boolean values as the selected state
 * - bcServerTable.allSelected
 *      - a boolean value used to determine if all rows were selected or cleared
 * - bcServerTable.selectAllRows()
 *      - toggle all rows selection state
 * - bcServerTable.isRowSelected(row)
 *      - helper function to determine if a row is selected
 * - bcServerTable.getSelectedRows()
 *      - function that returns an array of row objects that are currently selected
 *
 */
.directive('bcServerTable', function bcServerTableDirective($parse) {
    var directive = {
        restrict: 'EA',
        controller: 'BcServerTableCtrl as bcServerTable',
        link: function bcServerTableLink($scope, element, attrs, bcServerTableCtrl) {
            if (attrs.tableController) {
                // expose bcServerTableCtrl to tableController if it exists
                $parse(attrs.tableController).assign($scope, bcServerTableCtrl);
            }
        }
    };

    return directive;
});
'use strict';

angular.module('bcapp-pattern-lab.bc-server-table', ['bcapp-pattern-lab.bc-server-table.directive', 'bcapp-pattern-lab.bc-server-table.sort-by.directive', 'bcapp-pattern-lab.bc-server-table-factory.service']);
'use strict';

angular.module('bcapp-pattern-lab.bc-server-table.sort-by.directive', ['bcapp-pattern-lab.bc-server-table-factory.service']).directive('bcSortBy', function bcSortByDirective($log, bcServerTableFactory) {
    var directive = {
        templateUrl: 'src/js/bigcommerce/bc-server-table/bc-sort-by.tpl.html',
        restrict: 'E',
        transclude: true,
        scope: {
            sortValue: '@',
            columnName: '@',
            tableId: '@'
        },
        require: '?^^bcServerTable',
        link: bcSortByDirectiveLink
    };

    function bcSortByDirectiveLink(scope, element, attrs, bcServerTableCtrl) {
        var bcServerTable, sortDirValues;

        if (scope.tableId) {
            bcServerTable = bcServerTableFactory.get(scope.tableId);
        } else if (bcServerTableCtrl) {
            bcServerTable = bcServerTableCtrl;
        } else {
            $log.error('bc-sort-by directive requires a table-id, or a parent bcServerTableCtrl directive.');
        }

        sortDirValues = bcServerTable.tableConfig.sortDirValues;

        scope.asc = sortDirValues.asc;
        scope.desc = sortDirValues.desc;
        scope.sortBy = bcServerTable.sortBy;
        scope.sortDir = bcServerTable.sortDir;
        scope.sort = sort;

        function sort($event) {
            var sortBy, sortDir;

            if ($event) {
                $event.preventDefault();
            }

            if (bcServerTable.sortBy === scope.sortValue) {
                sortBy = bcServerTable.sortBy;
                sortDir = bcServerTable.sortDir === scope.asc ? scope.desc : scope.asc;
            } else {
                sortBy = scope.sortValue;
                sortDir = scope.asc;
            }

            bcServerTable.updateSort(sortBy, sortDir);
        }
    }

    return directive;
});
'use strict';

angular.module('bcapp-pattern-lab.loading-notification.directive', []).directive('loadingNotification', function loadingNotificationDirective($rootScope) {
    return {
        restrict: 'E',
        templateUrl: 'src/js/bigcommerce/loading-notification/loading-notification.tpl.html',

        link: function link(scope) {
            $rootScope.$on('ajaxRequestRunning', function (event, val) {
                scope.requestInProgress = val;
            });
        }
    };
});
'use strict';

angular.module('bcapp-pattern-lab.loading-notification', ['bcapp-pattern-lab.loading-notification.directive']);
'use strict';

angular.module('bcapp-pattern-lab.loading-overlay.controller', []).controller('LoadingOverlayCtrl', function LoadingOverlayCtrl($rootScope, $timeout) {
    var ctrl = this,
        defaultDebounce = 100,
        timeout;

    if (ctrl.debounce === undefined) {
        ctrl.debounce = defaultDebounce;
    }

    if (ctrl.useUiRouter) {
        $rootScope.$on('$stateChangeStart', startLoading);
        $rootScope.$on('$stateChangeSuccess', stopLoading);
        $rootScope.$on('$stateChangeError', stopLoading);
    }

    function startLoading(event) {
        if (event.defaultPrevented) {
            return;
        }

        timeout = $timeout(function startLoadingTimer() {
            ctrl.loading = true;
        }, ctrl.debounce);
    }

    function stopLoading(event) {
        if (event.defaultPrevented) {
            return;
        }

        $timeout.cancel(timeout);
        ctrl.loading = false;
    }
});
'use strict';

angular.module('bcapp-pattern-lab.loading-overlay.directive', ['bcapp-pattern-lab.loading-overlay.controller']).directive('loadingOverlay', function loadingOverlay($compile) {
    return {
        bindToController: true,
        controller: 'LoadingOverlayCtrl as loadingOverlayCtrl',
        restrict: 'A',
        scope: {
            debounce: '=?',
            loading: '=?loadingOverlay',
            useUiRouter: '=?'
        },
        compile: function loadingOverlayCompile(element) {
            element.addClass('loadingOverlay-container');

            return function loadingOverlayLink(scope, element) {
                var overlay = $compile('<div class="loadingOverlay" ng-if="loadingOverlayCtrl.loading"></div>')(scope);
                element.append(overlay);
            };
        }
    };
});
'use strict';

angular.module('bcapp-pattern-lab.loading-overlay', ['bcapp-pattern-lab.loading-overlay.directive']);
/**
 * @description
 *
 * @example
 *
 */

'use strict';

angular.module('bcapp-pattern-lab.sticky-class.directive', []).directive('stickyClass', function stickyClass($document, $timeout, $window) {
    'ngInject';

    return {
        restrict: 'A',
        link: function link(scope, element, attr) {
            var $windowElem = angular.element($window);
            var throttledOnScroll = _.throttle(onScroll, 10);

            var offsetTop = undefined;

            function cleanUp() {
                $windowElem.off('scroll', throttledOnScroll);
            }

            function onScroll() {
                if ($window.pageYOffset >= offsetTop) {
                    element.addClass(attr.stickyClass);
                } else {
                    element.removeClass(attr.stickyClass);
                }
            }

            $timeout(function () {
                var documentTop = $document[0].body.getBoundingClientRect().top;
                var elementTop = element[0].getBoundingClientRect().top;

                offsetTop = elementTop - documentTop;

                throttledOnScroll();

                $windowElem.on('scroll', throttledOnScroll);
                scope.$on('$destroy', cleanUp);
            });
        }
    };
});
'use strict';

angular.module('bcapp-pattern-lab.sticky-class', ['bcapp-pattern-lab.sticky-class.directive']);
/**
 * @description Used to create a toggle switch for forms
 * @example
    <switch ng-model="ctrl.switchModel1"></switch>

    <switch
        toggle-off-text="Off"
        toggle-on-text="On"
        ng-model="ctrl.switchModel2">
    </switch>

    <switch
        has-icon
        ng-model="ctrl.switchModel3">
    </switch>

    <switch
        is-important
        left-label="Down for Maintenance"
        right-label="Open"
        ng-model="ctrl.switchModel4">
    </switch>
 */
'use strict';

angular.module('bcapp-pattern-lab.switch.directive', []).directive('switch', function switchDirective() {

    function getUniqueID(idPrefix) {
        return _.uniqueId(idPrefix);
    }

    return {
        restrict: 'E',
        templateUrl: 'src/js/bigcommerce/switch/switch.tpl.html',
        require: 'ngModel',
        scope: {
            ariaDescription: '@',
            isDisabled: '=ngDisabled',
            labelText: '@',
            leftDescription: '@',
            ngFalseValue: '@',
            ngTrueValue: '@',
            rightDescription: '@',
            toggleOffLabel: '@',
            toggleOnLabel: '@',
            uniqueId: '@'
        },
        bindToController: true,
        controllerAs: 'switchCtrl',
        compile: function switchDirectiveCompile(tElem, tAttrs) {
            var checkboxElem = tElem.find('input');

            if (tAttrs.ngFalseValue) {
                checkboxElem.attr('ng-false-value', tAttrs.ngFalseValue);
            }

            if (tAttrs.ngTrueValue) {
                checkboxElem.attr('ng-true-value', tAttrs.ngTrueValue);
            }

            return function switchDirectivePostLink(scope, element, attrs, ngModelCtrl) {
                scope.switchCtrl.init(ngModelCtrl);
            };
        },
        controller: function switchDirectiveCtrl($scope, $element, $attrs) {
            var ctrl = this;

            // state
            ctrl.isImportant = angular.isDefined($attrs.isImportant) && $attrs.isImportant !== 'false';
            ctrl.hasIcon = angular.isDefined($attrs.hasIcon) && $attrs.hasIcon !== 'false';

            // labels
            ctrl.labelText = $attrs.toggleOffLabel;

            // ids
            ctrl.uniqueId = getUniqueID('switch-');
            ctrl.ariaDescriptionID = getUniqueID('switch-ariaDescription-');

            ctrl.init = init;
            ctrl.updateModel = updateModel;

            function init(ngModelCtrl) {
                ctrl.ngModelCtrl = ngModelCtrl;
                ctrl.value = ctrl.ngModelCtrl.$modelValue;

                $scope.$watch('switchCtrl.ngModelCtrl.$modelValue', function switchValueChanged(newValue) {
                    ctrl.value = newValue;

                    ctrl.isChecked = _.isString(newValue) ? "'" + newValue + "'" === ctrl.ngTrueValue : newValue;
                    ctrl.labelText = !!ctrl.isChecked ? ctrl.toggleOnLabel : ctrl.toggleOffLabel;
                });
            }

            function updateModel() {
                ctrl.ngModelCtrl.$setViewValue(ctrl.value);
            }
        }
    };
});
'use strict';

angular.module('bcapp-pattern-lab.switch', ['bcapp-pattern-lab.switch.directive']);
'use strict';

angular.module('bcapp-pattern-lab.tabs', ['mm.foundation.tabs']).config(function configureTabset($provide) {
    $provide.decorator('tabsetDirective', function tabsetDecorator($delegate) {
        var directive = $delegate[0];

        directive.compile = function () {
            return function (scope, element, attrs) {
                scope.buttons = angular.isDefined(attrs.buttons) ? scope.$parent.$eval(attrs.buttons) : false;
            };
        };

        return $delegate;
    });
});
'use strict';

angular.module('bcapp-pattern-lab.util', ['bcapp-pattern-lab.util.trustAsHtml']);
/**
 * @description Sprite directive used to load an icon from an image sprite,
 *              simliar to the icon directive but less SVG
 * @example
 * <sprite glyph="ic-amex"></sprite>
 */

'use strict';

angular.module('bcapp-pattern-lab.sprite.directive', []).directive('sprite', function spriteDirective() {
    return {
        restrict: 'E',
        scope: {
            glyph: '@'
        },
        compile: spriteDirectiveCompile
    };

    function spriteDirectiveCompile(tElement) {
        tElement.addClass('sprite');
        tElement.attr('aria-hidden', true);

        return function spriteDirectiveLink($scope, element, attrs) {
            attrs.$observe('glyph', function (newValue) {
                element.attr('class', 'sprite sprite--' + newValue);
            });
        };
    }
});
'use strict';

angular.module('bcapp-pattern-lab.sprite', ['bcapp-pattern-lab.sprite.directive']);
'use strict';

angular.module('bcapp-pattern-lab.bc-modal.modalStack.service', []).factory('$modalStack', ['$window', '$transition', '$timeout', '$document', '$compile', '$rootScope', '$$stackedMap', function ($window, $transition, $timeout, $document, $compile, $rootScope, $$stackedMap) {
  // Changes: change from `modal-open` to `has-activeModal`
  var OPENED_MODAL_CLASS = 'has-activeModal';

  var backdropDomEl, backdropScope, cssTop;
  var openedWindows = $$stackedMap.createNew();
  var $modalStack = {};

  function backdropIndex() {
    var topBackdropIndex = -1;
    var opened = openedWindows.keys();
    for (var i = 0; i < opened.length; i++) {
      if (openedWindows.get(opened[i]).value.backdrop) {
        topBackdropIndex = i;
      }
    }
    return topBackdropIndex;
  }

  $rootScope.$watch(backdropIndex, function (newBackdropIndex) {
    if (backdropScope) {
      backdropScope.index = newBackdropIndex;
    }
  });

  function removeModalWindow(modalInstance) {
    var body = $document.find('body').eq(0);
    var modalWindow = openedWindows.get(modalInstance).value;

    //clean up the stack
    openedWindows.remove(modalInstance);

    //remove window DOM element
    removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, 300, function () {
      modalWindow.modalScope.$destroy();
      body.toggleClass(OPENED_MODAL_CLASS, openedWindows.length() > 0);
      checkRemoveBackdrop();
    });
  }

  function checkRemoveBackdrop() {
    //remove backdrop if no longer needed
    if (backdropDomEl && backdropIndex() == -1) {
      var backdropScopeRef = backdropScope;
      removeAfterAnimate(backdropDomEl, backdropScope, 150, function () {
        backdropScopeRef.$destroy();
        backdropScopeRef = null;
      });
      backdropDomEl = undefined;
      backdropScope = undefined;
    }
  }

  function removeAfterAnimate(domEl, scope, emulateTime, done) {
    // Closing animation
    scope.animate = false;

    var transitionEndEventName = $transition.transitionEndEventName;
    if (transitionEndEventName) {
      // transition out
      var timeout = $timeout(afterAnimating, emulateTime);

      domEl.bind(transitionEndEventName, function () {
        $timeout.cancel(timeout);
        afterAnimating();
        scope.$apply();
      });
    } else {
      // Ensure this call is async
      $timeout(afterAnimating, 0);
    }

    function afterAnimating() {
      if (afterAnimating.done) {
        return;
      }
      afterAnimating.done = true;

      domEl.remove();
      if (done) {
        done();
      }
    }
  }

  function calculateModalTop(modalElement, offset) {
    var scrollY = 0;

    if (angular.isUndefined(offset)) {
      offset = 0;
    }

    // If the window is within an iframe, calculate the parent
    // frame's offset as the top position for the modal
    if ($window.self !== $window.top) {
      scrollY = $window.parent.scrollY;
    }

    return offset + scrollY;
  }

  $document.bind('keydown', function (evt) {
    var modal;

    if (evt.which === 27) {
      modal = openedWindows.top();
      if (modal && modal.value.keyboard) {
        $rootScope.$apply(function () {
          $modalStack.dismiss(modal.key);
        });
      }
    }
  });

  $modalStack.open = function (modalInstance, modal) {

    openedWindows.add(modalInstance, {
      deferred: modal.deferred,
      modalScope: modal.scope,
      backdrop: modal.backdrop,
      keyboard: modal.keyboard
    });

    var body = $document.find('body').eq(0),
        currBackdropIndex = backdropIndex();

    if (currBackdropIndex >= 0 && !backdropDomEl) {
      backdropScope = $rootScope.$new(true);
      backdropScope.index = currBackdropIndex;
      backdropDomEl = $compile('<div modal-backdrop></div>')(backdropScope);
      body.append(backdropDomEl);
    }

    // Create a faux modal div just to measure its
    // distance to top
    var faux = angular.element('<div class="reveal-modal" style="z-index:-1""></div>');
    body.append(faux[0]);
    cssTop = parseInt($window.getComputedStyle(faux[0]).top) || 0;
    var openAt = calculateModalTop(faux, cssTop);
    faux.remove();

    var angularDomEl = angular.element('<div modal-window style="visibility: visible; display: block; top:' + openAt + 'px;"></div>');
    angularDomEl.attr('window-class', modal.windowClass);
    angularDomEl.attr('index', openedWindows.length() - 1);
    angularDomEl.attr('animate', 'animate');
    angularDomEl.html(modal.content);

    var modalDomEl = $compile(angularDomEl)(modal.scope);
    openedWindows.top().value.modalDomEl = modalDomEl;
    body.append(modalDomEl);
    body.addClass(OPENED_MODAL_CLASS);
  };

  $modalStack.reposition = function (modalInstance) {
    var modalWindow = openedWindows.get(modalInstance).value;
    if (modalWindow) {
      var modalDomEl = modalWindow.modalDomEl;
      var top = calculateModalTop(modalDomEl, cssTop);
      modalDomEl.css('top', top + "px");
    }
  };

  $modalStack.close = function (modalInstance, result) {
    var modalWindow = openedWindows.get(modalInstance).value;
    if (modalWindow) {
      modalWindow.deferred.resolve(result);
      removeModalWindow(modalInstance);
    }
  };

  $modalStack.dismiss = function (modalInstance, reason) {
    var modalWindow = openedWindows.get(modalInstance).value;
    if (modalWindow) {
      modalWindow.deferred.reject(reason);
      removeModalWindow(modalInstance);
    }
  };

  $modalStack.dismissAll = function (reason) {
    var topModal = this.getTop();
    while (topModal) {
      this.dismiss(topModal.key, reason);
      topModal = this.getTop();
    }
  };

  $modalStack.getTop = function () {
    return openedWindows.top();
  };

  return $modalStack;
}]);
/*
 * This module modifies angular foundation's modal implementation. This does not create a new modal service/directive.
 *
*/
'use strict';

angular.module('bcapp-pattern-lab.bc-modal', ['bcapp-pattern-lab.bc-modal.modalStack.service']);
'use strict';

angular.module('bcapp-pattern-lab.services.device.service', []).factory('deviceService', function deviceService($window) {
    var service = {
        isIOSDevice: isIOSDevice,
        isMacOSDevice: isMacOSDevice,
        isMobileDevice: isMobileDevice
    };

    function isIOSDevice() {
        var deviceList = ['ipad', 'iphone'];
        var ua = $window.navigator.userAgent.toLowerCase();

        return _.some(deviceList, function (device) {
            return _.contains(ua, device);
        });
    }

    function isMobileDevice() {
        return (/Mobi/i.test($window.navigator.userAgent)
        );
    }

    function isMacOSDevice() {
        return (/Mac/i.test($window.navigator.userAgent)
        );
    }

    return service;
});
'use strict';

angular.module('bcapp-pattern-lab.services', ['bcapp-pattern-lab.services.device.service']);
/**
 * @name cc-expiry directive
 * @description A directive following angular-credit-card's approach to validating/formatting credit card expiration date.
 * Expect the cc-expiry ngModel to be in the format of `{ month: '05', year: '2017'}`.
 */
'use strict';

angular.module('bcapp-pattern-lab.credit-card.cc-expiry.directive', []).directive('ccExpiry', function ccExpDirective($filter) {
    return {
        compile: function compile(tElem, tAttr) {
            var EXPIRATION_MAX_LENGTH = 7; // length of `MM / yy`

            tAttr.$set('autocomplete', 'cc-exp');
            tAttr.$set('maxlength', EXPIRATION_MAX_LENGTH);
            tAttr.$set('pattern', '[0-9]*'); // for mobile keyboard display

            return function ccExpiryLink(scope, tElem, tAttr, ngModelCtrl) {
                init();

                function init() {
                    ngModelCtrl.$parsers.unshift(parser);
                    ngModelCtrl.$formatters.push(formatter);
                    ngModelCtrl.$validators.validFutureDate = validFutureDate;

                    scope.$watch(getViewValue, renderFormattedView);
                }

                /**
                 * get the input's view value
                 */
                function getViewValue() {
                    return ngModelCtrl.$viewValue;
                }

                /**
                 * formats the input view value to be the format `MM / yy` and re-renders view
                 */
                function renderFormattedView(viewValue, prevViewValue) {
                    if (!viewValue) {
                        return;
                    }

                    // a new value is added (as opposed to pressing backspace)
                    var isAddition = viewValue.length > prevViewValue.length;

                    ngModelCtrl.$setViewValue(format(viewValue, isAddition));
                    ngModelCtrl.$render();
                }

                /**
                 * Validates whether the entered expiration date is valid
                 */
                function validFutureDate(modelValue) {
                    var month = modelValue.month;
                    var year = modelValue.year;

                    return isValidDate(month, year) && !isPast(month, year);
                }

                /**
                 * Validates whether the given month and year are number strings with length of 2 and 4 respectively
                 */
                function isValidDate(month, year) {
                    var monthRegex = /^[0-9]{2}$/;
                    var yearRegex = /^[0-9]{4}$/;

                    return _.isString(month) && _.isString(year) && monthRegex.test(month) && yearRegex.test(year) && isValidMonth(month);
                }

                /**
                 * Checks whether the month is valid
                 */
                function isValidMonth(month) {
                    month = _.parseInt(month);

                    return month > 0 && month < 13;
                }

                /**
                 * Checks whether the given month and date is in the past
                 */
                function isPast(month, year) {
                    return getCurrMonthDate() > new Date(year, month - 1);
                }

                /**
                 * Get the date object based on current month and year
                 */
                function getCurrMonthDate() {
                    var date = new Date();

                    return new Date(date.getFullYear(), date.getMonth());
                }

                /**
                 * Uses angular date filter to format date model to corresponding view format
                 */
                function formatter() {
                    var exp = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                    var month = exp.month;
                    var year = exp.year;

                    if (_.isEmpty(month) && _.isEmpty(year)) {
                        return '';
                    }

                    return $filter('date')(new Date(year, month - 1), 'MM / yy');
                }

                /**
                 * Parses the formatted view values to model. Converts 2 digit year to full 4 digit year
                 * @param expiration {object} The expiration object {month, year}
                 */
                function parser(expiration) {
                    var baseYear = new Date().getFullYear().toString().slice(0, 2); // `'20'`
                    var values = expiration.split('/');
                    var month = values[0] ? values[0].trim() : '';
                    var year = values[1] ? baseYear + values[1].trim() : '';

                    return { month: month, year: year };
                }

                /**
                 * formats the view value to the form 'MM / yy'
                 */
                function format(expStr, isAddition) {
                    var values = expStr.split('/');
                    var month = values[0] ? values[0].trim() : '';
                    var year = values[1] ? values[1].trim().slice(-2) : '';

                    // don't add slash
                    if (!isAddition && !year || month.length < 2) {
                        return month;
                    }

                    // add slash in the right spot
                    if (isAddition && !year && month.length > 2) {
                        return month.slice(0, 2) + ' / ' + month.slice(2);
                    }

                    return month + ' / ' + year;
                }
            };
        },
        require: 'ngModel',
        restrict: 'A'
    };
});
'use strict';

angular.module('bcapp-pattern-lab.credit-card.cc-expiry', ['bcapp-pattern-lab.credit-card.cc-expiry.directive']);
/**
 * @name bc-cvc directive
 * @description A custom complementary directive to angular-credit-card's `ccCvc` directive.
 * To support allowing an optional cvc field (i.e. Securenet), this directive must override
 * the validation provided by ccCvc directive.
 */
'use strict';

angular.module('bcapp-pattern-lab.credit-card.bc-cvc', ['credit-cards']).directive('bcCvc', function bcCvcDirective($parse) {
    return {
        link: function bcCvcLink(scope, element, attributes, ngModel) {
            // override the validation to always return valid
            // if cvc is not required
            if (!$parse(attributes.ngRequired)(scope)) {
                ngModel.$validators.ccCvc = function () {
                    return true;
                };
            }
        },
        priority: 5, // higher priority to ensure ccCvc's link is ran first
        require: 'ngModel',
        restrict: 'A'
    };
});
'use strict';

angular.module('bcapp-pattern-lab.bc-server-table.service', ['ui.router']).factory('BcServerTable', function bcServerTable($log, $q, $state, $stateParams) {
    var defaultTableConfig = {
        filters: [],
        queryKeys: {
            page: 'page',
            limit: 'limit',
            sortBy: 'sort-by',
            sortDir: 'sort-order'
        },
        rowIdKey: 'id',
        sortDirValues: {
            asc: 'asc',
            desc: 'desc'
        }
    };

    function ServerTable(tableId, tableConfig) {
        this.allSelected = false;
        this.filters = {};
        this.id = tableId;
        this.pagination = {
            page: null,
            limit: null,
            total: null
        };
        this.pendingRequest = false;
        this.resourceCallback = angular.noop;
        this.rows = [];
        this.selectedRows = {};
        this.sortBy = '';
        this.sortDir = '';

        this.tableConfig = _.isObject(tableConfig) ? tableConfig : {};
        this.tableConfig = _.defaults(this.tableConfig, defaultTableConfig);
    }

    ServerTable.prototype = {
        createParamsObject: createParamsObject,
        deselectAllRows: deselectAllRows,
        fetchResource: fetchResource,
        getSelectedRows: getSelectedRows,
        init: init,
        isRowSelected: isRowSelected,
        loadStateParams: loadStateParams,
        selectAllRows: selectAllRows,
        setPaginationValues: setPaginationValues,
        setRows: setRows,
        setSelectionForAllRows: setSelectionForAllRows,
        setSortingValues: setSortingValues,
        updatePage: updatePage,
        updateSort: updateSort,
        updateTable: updateTable,
        validateResource: validateResource
    };

    function createParamsObject() {
        var params = {},
            queryKeys = this.tableConfig.queryKeys,
            queryParamMap = [{
            queryKey: queryKeys.page,
            value: this.pagination.page
        }, {
            queryKey: queryKeys.limit,
            value: this.pagination.limit
        }, {
            queryKey: queryKeys.sortBy,
            value: this.sortBy
        }, {
            queryKey: queryKeys.sortDir,
            value: this.sortDir
        }];

        _.each(queryParamMap, function queryParamMapEach(param) {
            if (param.queryKey !== undefined) {
                params[param.queryKey] = param.value;
            }
        });

        _.extend(params, this.filters);

        return params;
    }

    function deselectAllRows() {
        return this.setSelectionForAllRows(false);
    }

    function fetchResource() {
        var _this = this;

        this.pendingRequest = true;
        return this.resourceCallback(this.createParamsObject()).then(function resourceCallbackThen(resource) {
            if (_this.validateResource(resource)) {
                _this.setRows(resource.rows);
                _this.setPaginationValues(resource.pagination);
            }

            return _this;
        })['catch'](function resourceCallbackCatch(error) {
            $log.error('bc-server-table directive: failed to fetch resource');

            return $q.reject(error);
        })['finally'](function resourceCallbackFinally() {
            _this.pendingRequest = false;
        });
    }

    function getSelectedRows() {
        var _this = this;

        return _.filter(this.rows, function getSelectedRowsFilter(row) {
            return _this.isRowSelected(row);
        });
    }

    function init(config) {
        if (!_.isObject(config)) {
            config = {};
        }

        if (_.isFunction(config.resourceCallback)) {
            this.resourceCallback = config.resourceCallback;
        }

        return this.loadStateParams(config.stateParams).fetchResource();
    }

    function isRowSelected(row) {
        return this.selectedRows[row[this.tableConfig.rowIdKey]];
    }

    function loadStateParams(stateParams) {
        var queryKeys = this.tableConfig.queryKeys,
            _this = this;

        stateParams = stateParams || $stateParams;

        this.setPaginationValues({
            page: stateParams[queryKeys.page],
            limit: stateParams[queryKeys.limit]
        });

        this.setSortingValues(stateParams[queryKeys.sortBy], stateParams[queryKeys.sortDir]);

        // set filters from query params
        _.each(this.tableConfig.filters, function setFiltersEach(value) {
            _this.filters[value] = stateParams[value];
        });

        return this;
    }

    // This is actually a toggle not just a select
    function selectAllRows() {
        return this.setSelectionForAllRows(!this.allSelected);
    }

    function setPaginationValues(pagination) {
        this.pagination = this.pagination || {};
        _.extend(this.pagination, pagination);

        return this;
    }

    function setRows(rows) {
        var _this = this;

        this.rows = rows;
        this.selectedRows = _.reduce(rows, function initializeSelectedRowsObject(accum, row) {
            accum[row[_this.tableConfig.rowIdKey]] = false;
            return accum;
        }, {});

        return this;
    }

    function setSelectionForAllRows(value) {
        var _this = this;

        value = !!value;

        this.allSelected = value;

        _.each(this.selectedRows, function allRowsIteration(value, key) {
            _this.selectedRows[key] = _this.allSelected;
        });

        return this;
    }

    function setSortingValues(sortBy, sortDir) {
        this.sortBy = sortBy || this.sortBy;
        this.sortDir = sortDir || this.sortDir;

        return this;
    }

    function updatePage(page, limit, total) {
        return this.setPaginationValues(page, limit, total).updateTable();
    }

    function updateSort(sortBy, sortDir) {
        return this.setSortingValues(sortBy, sortDir).setPaginationValues({
            page: 1
        }).updateTable();
    }

    function updateTable() {
        if (!this.pendingRequest) {
            $state.go($state.current.name, this.createParamsObject());
        }

        return this;
    }

    function validateResource(resource) {
        if (!_.isObject(resource)) {
            $log.error('bc-server-table directive: Resource callback must return an object');
            return false;
        }

        if (!_.isArray(resource.rows)) {
            $log.error('bc-server-table directive: returned object must contain a rows property that is an array.');
            return false;
        }

        if (!_.isObject(resource.pagination)) {
            $log.error('bc-server-table directive: returned object must contain a pagination property that is an object.');
            return false;
        }

        return true;
    }

    return ServerTable;
});
'use strict';

angular.module('bcapp-pattern-lab.bc-server-table-factory.service', ['bcapp-pattern-lab.bc-server-table.service']).factory('bcServerTableFactory', function bcServerTableFactory($log, BcServerTable) {
    var tables = {},
        service = {
        create: create,
        get: get,
        remove: remove
    };

    function create(tableId, tableConfig) {
        if (tableId in tables) {
            return service.get(tableId);
        }

        if (!tableId) {
            tableId = _.uniqueId('bc-server-table-instance-');
        }

        tables[tableId] = new BcServerTable(tableId, tableConfig);

        return tables[tableId];
    }

    function get(tableId) {
        return tables[tableId];
    }

    function remove(tableId) {
        delete tables[tableId];
    }

    return service;
});
/**
 * @name trustAsHtml
 * @description Simple utility filter to run the given html string through angular's $sce.trustAsHtml function.
 *
 * @param {String} text The html string to trust
 * @return {String} An angular-trusted object containing the html
 *
 * @example `<p ng-bind-html="rawHtml | trustAsHtml"></p>`
 */
'use strict';

angular.module('bcapp-pattern-lab.util.trustAsHtml', []).filter('trustAsHtml', function trustAsHtml($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJpZ2NvbW1lcmNlL2JjYXBwLXBhdHRlcm4tbGFiLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2FsZXJ0L2FsZXJ0LmpzIiwiYmlnY29tbWVyY2UvYmMtZGF0ZXBpY2tlci9iYy1kYXRlcGlja2VyLmNvbnN0YW50cy5qcyIsImJpZ2NvbW1lcmNlL2JjLWRhdGVwaWNrZXIvYmMtZGF0ZXBpY2tlci5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9iYy1kYXRlcGlja2VyL2JjLWRhdGVwaWNrZXIuanMiLCJiaWdjb21tZXJjZS9iYy1kcm9wZG93bi9iYy1kcm9wZG93bi1tZW51LmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2JjLWRyb3Bkb3duL2JjLWRyb3Bkb3duLXRvZ2dsZS5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9iYy1kcm9wZG93bi9iYy1kcm9wZG93bi5jb250cm9sbGVyLmpzIiwiYmlnY29tbWVyY2UvYmMtZHJvcGRvd24vYmMtZHJvcGRvd24uZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvYmMtZHJvcGRvd24vYmMtZHJvcGRvd24ubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvYmMtcGFnaW5hdGlvbi9iYy1wYWdpbmF0aW9uLmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2JjLXBhZ2luYXRpb24vYmMtcGFnaW5hdGlvbi5tb2R1bGUuanMiLCJiaWdjb21tZXJjZS9jb2xvci1waWNrZXIvY29sb3ItcGlja2VyLXBhbGV0dGUuY29udHJvbGxlci5qcyIsImJpZ2NvbW1lcmNlL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXItcGFsZXR0ZS5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9jb2xvci1waWNrZXIvY29sb3ItcGlja2VyLmNvbnRyb2xsZXIuanMiLCJiaWdjb21tZXJjZS9jb2xvci1waWNrZXIvY29sb3ItcGlja2VyLmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXIubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvY29weS1jbGlwYm9hcmQvY29weS1jbGlwYm9hcmQuY29uc3RhbnQuanMiLCJiaWdjb21tZXJjZS9jb3B5LWNsaXBib2FyZC9jb3B5LWNsaXBib2FyZC5jb250cm9sbGVyLmpzIiwiYmlnY29tbWVyY2UvY29weS1jbGlwYm9hcmQvY29weS1jbGlwYm9hcmQuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvY29weS1jbGlwYm9hcmQvY29weS1jbGlwYm9hcmQubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQvY3JlZGl0LWNhcmQuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQvY3JlZGl0LWNhcmQubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQtdHlwZXMvY3JlZGl0LWNhcmQtdHlwZXMuY29uc3RhbnQuanMiLCJiaWdjb21tZXJjZS9jcmVkaXQtY2FyZC10eXBlcy9jcmVkaXQtY2FyZC10eXBlcy5jb250cm9sbGVyLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQtdHlwZXMvY3JlZGl0LWNhcmQtdHlwZXMuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQtdHlwZXMvY3JlZGl0LWNhcmQtdHlwZXMubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS9mb3JtLmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2Zvcm0vZm9ybS5tb2R1bGUuanMiLCJiaWdjb21tZXJjZS9mb3JtLWZpZWxkLWVycm9yL2Zvcm0tZmllbGQtZXJyb3IuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS1maWVsZC1lcnJvci9mb3JtLWZpZWxkLWVycm9yLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2Zvcm0tZmllbGQvZm9ybS1maWVsZC5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9mb3JtLWZpZWxkL2Zvcm0tZmllbGQubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS1maWVsZC1lcnJvcnMvZm9ybS1maWVsZC1lcnJvcnMuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS1maWVsZC1lcnJvcnMvZm9ybS1maWVsZC1lcnJvcnMubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS1pbnB1dC1jb2xvci9mb3JtLWlucHV0LWNvbG9yLmNvbnRyb2xsZXIuanMiLCJiaWdjb21tZXJjZS9mb3JtLWlucHV0LWNvbG9yL2Zvcm0taW5wdXQtY29sb3IuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS1pbnB1dC1jb2xvci9mb3JtLWlucHV0LWNvbG9yLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2dsb2JhbC1tZXNzYWdlL2dsb2JhbC1tZXNzYWdlLmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2dsb2JhbC1tZXNzYWdlL2dsb2JhbC1tZXNzYWdlLmpzIiwiYmlnY29tbWVyY2UvaHRtbDVNb2RlL2h0bWw1TW9kZS5tb2R1bGUuanMiLCJiaWdjb21tZXJjZS9odG1sNU1vZGUvaHRtbDVNb2RlLnNlcnZpY2UuanMiLCJiaWdjb21tZXJjZS9jaGVja2JveC1saXN0L2NoZWNrYm94LWxpc3QuY29udHJvbGxlci5qcyIsImJpZ2NvbW1lcmNlL2NoZWNrYm94LWxpc3QvY2hlY2tib3gtbGlzdC5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9jaGVja2JveC1saXN0L2NoZWNrYm94LWxpc3QubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvaWNvbi9pY29uLmNvbnRyb2xsZXIuanMiLCJiaWdjb21tZXJjZS9pY29uL2ljb24uZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvaWNvbi9pY29uLmpzIiwiYmlnY29tbWVyY2UvaWNvbi9pY29uLnN2Z1Jvb3RQYXRoLmpzIiwiYmlnY29tbWVyY2UvYmMtc2VydmVyLXRhYmxlL2JjLXNlcnZlci10YWJsZS5jb250cm9sbGVyLmpzIiwiYmlnY29tbWVyY2UvYmMtc2VydmVyLXRhYmxlL2JjLXNlcnZlci10YWJsZS5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9iYy1zZXJ2ZXItdGFibGUvYmMtc2VydmVyLXRhYmxlLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2JjLXNlcnZlci10YWJsZS9iYy1zb3J0LWJ5LmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2xvYWRpbmctbm90aWZpY2F0aW9uL2xvYWRpbmctbm90aWZpY2F0aW9uLmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2xvYWRpbmctbm90aWZpY2F0aW9uL2xvYWRpbmctbm90aWZpY2F0aW9uLmpzIiwiYmlnY29tbWVyY2UvbG9hZGluZy1vdmVybGF5L2xvYWRpbmctb3ZlcmxheS5jb250cm9sbGVyLmpzIiwiYmlnY29tbWVyY2UvbG9hZGluZy1vdmVybGF5L2xvYWRpbmctb3ZlcmxheS5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9sb2FkaW5nLW92ZXJsYXkvbG9hZGluZy1vdmVybGF5LmpzIiwiYmlnY29tbWVyY2Uvc3RpY2t5LWNsYXNzL3N0aWNreS1jbGFzcy5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9zdGlja3ktY2xhc3Mvc3RpY2t5LWNsYXNzLmpzIiwiYmlnY29tbWVyY2Uvc3dpdGNoL3N3aXRjaC5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9zd2l0Y2gvc3dpdGNoLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL3RhYnMvdGFic2V0LmpzIiwiYmlnY29tbWVyY2UvdXRpbC91dGlsLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL3Nwcml0ZS9zcHJpdGUuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2Uvc3ByaXRlL3Nwcml0ZS5qcyIsImJpZ2NvbW1lcmNlL21vZGFsL2JjLW1vZGFsLm1vZGFsU3RhY2suc2VydmljZS5qcyIsImJpZ2NvbW1lcmNlL21vZGFsL2JjLW1vZGFsLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL3NlcnZpY2VzL2RldmljZS5zZXJ2aWNlLmpzIiwiYmlnY29tbWVyY2Uvc2VydmljZXMvc2VydmljZXMubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQvY2MtZXhwaXJ5L2NjLWV4cGlyeS5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9jcmVkaXQtY2FyZC9jYy1leHBpcnkvY2MtZXhwaXJ5Lm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2NyZWRpdC1jYXJkL2NyZWRpdC1jYXJkLWN2di9iYy1jdmMuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvYmMtc2VydmVyLXRhYmxlL2JjLXNlcnZlci10YWJsZS9iYy1zZXJ2ZXItdGFibGUuc2VydmljZS5qcyIsImJpZ2NvbW1lcmNlL2JjLXNlcnZlci10YWJsZS9iYy1zZXJ2ZXItdGFibGUtZmFjdG9yeS9iYy1zZXJ2ZXItdGFibGUtZmFjdG9yeS5zZXJ2aWNlLmpzIiwiYmlnY29tbWVyY2UvdXRpbC90cnVzdEFzSHRtbC90cnVzdEFzSHRtbC5maWx0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLENBQ2hDLFNBQVMsRUFDVCxXQUFXLEVBQ1gsYUFBYSxFQUNiLFlBQVksRUFDWixlQUFlLEVBQ2YsNkJBQTZCLEVBQzdCLGdDQUFnQyxFQUNoQyxpQ0FBaUMsRUFDakMsK0JBQStCLEVBQy9CLDRCQUE0QixFQUM1QixpQ0FBaUMsRUFDakMsbUNBQW1DLEVBQ25DLHlCQUF5QixFQUN6QixpQ0FBaUMsRUFDakMsZ0NBQWdDLEVBQ2hDLGtDQUFrQyxFQUNsQywrQkFBK0IsRUFDL0IscUNBQXFDLEVBQ3JDLGtDQUFrQyxFQUNsQyx3QkFBd0IsRUFDeEIsOEJBQThCLEVBQzlCLG9DQUFvQyxFQUNwQyw2QkFBNkIsRUFDN0Isd0JBQXdCLEVBQ3hCLHdDQUF3QyxFQUN4QyxtQ0FBbUMsRUFDbkMsNEJBQTRCLEVBQzVCLDBCQUEwQixFQUMxQiwwQkFBMEIsRUFDMUIsd0JBQXdCLEVBQ3hCLHdCQUF3QixDQUMzQixDQUFDLENBQ0QsTUFBTSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsVUFBUyxnQkFBZ0IsRUFBRTtBQUNwRCxvQkFBZ0IsQ0FBQyxXQUFXLENBQUMs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LEVBQUU7QUFDbEIsZUFBTyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDMUI7O0FBRUQsYUFBUyxNQUFNLENBQUMsT0FBTyxFQUFFO0FBQ3JCLGVBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzFCOztBQUVELFdBQU8sT0FBTyxDQUFDO0NBQ2xCLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7O0FDekJQLE9BQU8sQ0FBQyxNQUFNLENBQUMsb0NBQW9DLEVBQUUsRUFBRSxDQUFDLENBQ25ELE1BQU0sQ0FBQyxhQUFhLEVBQUUsU0FBUyxXQUFXLENBQUMsSUFBSSxFQUFDO0FBQzdDLFdBQU8sVUFBUyxJQUFJLEVBQUU7QUFDbEIsZUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2pDLENBQUM7Q0FDTCxDQUFDLENBQUMiLCJmaWxlIjoiYmNhcHAtcGF0dGVybi1sYWItY29tcG9uZW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYicsIFtcbiAgICAnZ2V0dGV4dCcsXG4gICAgJ25nQW5pbWF0ZScsXG4gICAgJ25nY2xpcGJvYXJkJyxcbiAgICAnbmdNZXNzYWdlcycsXG4gICAgJ21tLmZvdW5kYXRpb24nLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi10ZW1wbGF0ZXMnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5zdGlja3ktY2xhc3MnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1kYXRlcGlja2VyJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtZHJvcGRvd24nLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1tb2RhbCcsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXBhZ2luYXRpb24nLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5hbGVydCcsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNoZWNrYm94LWxpc3QnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jb2xvci1waWNrZXInLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jb3B5LWNsaXBib2FyZCcsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQtdHlwZXMnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5nbG9iYWwtbWVzc2FnZScsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0nLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWZpZWxkJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1pbnB1dC1jb2xvcicsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmh0bWw1TW9kZScsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmljb24nLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5sb2FkaW5nLW5vdGlmaWNhdGlvbicsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmxvYWRpbmctb3ZlcmxheScsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLnNlcnZpY2VzJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuc3ByaXRlJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuc3dpdGNoJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIudGFicycsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLnV0aWwnXG5dKVxuLmNvbmZpZyhbJyR0b29sdGlwUHJvdmlkZXInLCBmdW5jdGlvbigkdG9vbHRpcFByb3ZpZGVyKSB7XG4gICAgJHRvb2x0aXBQcm92aWRlci5zZXRUcmlnZ2Vycyh7J3Rvb2x0aXBUcmlnZ2VyT3Blbic6ICd0b29sdGlwVHJpZ2dlckNsb3NlJ30pO1xufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmFsZXJ0JywgWydtbS5mb3VuZGF0aW9uLmFsZXJ0J10pXG4gICAgLmNvbmZpZyhmdW5jdGlvbiBjb25maWd1cmVBbGVydCgkcHJvdmlkZSkge1xuICAgICAgICAkcHJvdmlkZS5kZWNvcmF0b3IoJ2FsZXJ0RGlyZWN0aXZlJywgZnVuY3Rpb24gYWxlcnREZWNvcmF0b3IoJGRlbGVnYXRlKSB7XG4gICAgICAgICAgICB2YXIgZGlyZWN0aXZlID0gJGRlbGVnYXRlWzBdO1xuXG4gICAgICAgICAgICBkaXJlY3RpdmUucmVwbGFjZSA9IHRydWU7XG4gICAgICAgICAgICBkaXJlY3RpdmUuc2NvcGUgPSB7XG4gICAgICAgICAgICAgICAgY2xvc2U6ICcmJyxcbiAgICAgICAgICAgICAgICBsaW5rczogJz0nLFxuICAgICAgICAgICAgICAgIHRhcmdldDogJz0nLFxuICAgICAgICAgICAgICAgIHR5cGU6ICc9JyxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiAkZGVsZWdhdGU7XG4gICAgICAgIH0pO1xufSk7XG4iLCIvKiBnbG9iYWxzIG1vbWVudCAqL1xuYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRhdGVwaWNrZXIuY29uc3RhbnRzJywgW10pXG4gICAgLmNvbnN0YW50KCdCQ19EQVRFUElDS0VSX0RFRkFVTFRTJywge1xuICAgICAgICBkYXlGb3JtYXQ6ICdEJyxcbiAgICAgICAgaW5wdXRGb3JtYXQ6IG1vbWVudC5sb2NhbGVEYXRhKCkubG9uZ0RhdGVGb3JtYXQoJ0wnKSxcbiAgICAgICAgc3R5bGVzOiB7XG4gICAgICAgICAgICBiYWNrOiAnZGF0ZXBpY2tlci1iYWNrJyxcbiAgICAgICAgICAgIGNvbnRhaW5lcjogJ2RhdGVwaWNrZXInLFxuICAgICAgICAgICAgZGF0ZTogJ2RhdGVwaWNrZXItZGF0ZScsXG4gICAgICAgICAgICBkYXlCb2R5OiAnZGF0ZXBpY2tlci1kYXlzLWJvZHknLFxuICAgICAgICAgICAgZGF5Qm9keUVsZW06ICdkYXRlcGlja2VyLWRheScsXG4gICAgICAgICAgICBkYXlDb25jZWFsZWQ6ICdkYXRlcGlja2VyLWRheS1jb25jZWFsZWQnLFxuICAgICAgICAgICAgZGF5RGlzYWJsZWQ6ICdpcy1kaXNhYmxlZCcsXG4gICAgICAgICAgICBkYXlIZWFkOiAnZGF0ZXBpY2tlci1kYXlzLWhlYWQnLFxuICAgICAgICAgICAgZGF5SGVhZEVsZW06ICdkYXRlcGlja2VyLWRheS1uYW1lJyxcbiAgICAgICAgICAgIGRheVByZXZNb250aDogJ2RhdGVwaWNrZXItZGF5LXByZXYtbW9udGgnLFxuICAgICAgICAgICAgZGF5TmV4dE1vbnRoOiAnZGF0ZXBpY2tlci1kYXktbmV4dC1tb250aCcsXG4gICAgICAgICAgICBkYXlSb3c6ICdkYXRlcGlja2VyLWRheXMtcm93JyxcbiAgICAgICAgICAgIGRheVRhYmxlOiAnZGF0ZXBpY2tlci1kYXlzJyxcbiAgICAgICAgICAgIG1vbnRoOiAnZGF0ZXBpY2tlci1tb250aCcsXG4gICAgICAgICAgICBtb250aExhYmVsOiAnZGF0ZXBpY2tlci1tb250aCcsXG4gICAgICAgICAgICBuZXh0OiAnZGF0ZXBpY2tlci1uZXh0JyxcbiAgICAgICAgICAgIHBvc2l0aW9uZWQ6ICdkYXRlcGlja2VyLWF0dGFjaG1lbnQnLFxuICAgICAgICAgICAgc2VsZWN0ZWREYXk6ICdpcy1zZWxlY3RlZCcsXG4gICAgICAgICAgICBzZWxlY3RlZFRpbWU6ICdkYXRlcGlja2VyLXRpbWUtc2VsZWN0ZWQnLFxuICAgICAgICAgICAgdGltZTogJ2RhdGVwaWNrZXItdGltZScsXG4gICAgICAgICAgICB0aW1lTGlzdDogJ2RhdGVwaWNrZXItdGltZS1saXN0JyxcbiAgICAgICAgICAgIHRpbWVPcHRpb246ICdkYXRlcGlja2VyLXRpbWUtb3B0aW9uJ1xuICAgICAgICB9LFxuICAgICAgICB0aW1lOiBmYWxzZSxcbiAgICAgICAgd2Vla2RheUZvcm1hdDogJ3Nob3J0J1xuICAgIH0pO1xuIiwiLyogZ2xvYmFscyByb21lICovXG5hbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtZGF0ZXBpY2tlci5kaXJlY3RpdmUnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRhdGVwaWNrZXIuY29uc3RhbnRzJ1xuXSlcbiAgICAuZGlyZWN0aXZlKCdiY0RhdGVwaWNrZXInLCBmdW5jdGlvbiBiY0RhdGVwaWNrZXJEaXJlY3RpdmUoQkNfREFURVBJQ0tFUl9ERUZBVUxUUykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgb3B0aW9uczogJz0/J1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gZGF0ZXBpY2tlckxpbmtGdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIG5nTW9kZWwpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUub3B0aW9ucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLm9wdGlvbnMgPSB7fTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgZGVmYXVsdHMgdG8gdGhlIG9wdGlvbnMgb2JqZWN0XG4gICAgICAgICAgICAgICAgXy5kZWZhdWx0cyhzY29wZS5vcHRpb25zLCBCQ19EQVRFUElDS0VSX0RFRkFVTFRTKTtcblxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhIG5ldyByb21lIChjYWxlbmRhcikgaW5zdGFuY2VcbiAgICAgICAgICAgICAgICBzY29wZS5jYWxlbmRhciA9IHJvbWUoZWxlbWVudFswXSwgc2NvcGUub3B0aW9ucyk7XG5cbiAgICAgICAgICAgICAgICAvLyBPbiAnZGF0YScgZXZlbnQgc2V0IG5nTW9kZWwgdG8gdGhlIHBhc3NlZCB2YWx1ZVxuICAgICAgICAgICAgICAgIHNjb3BlLmNhbGVuZGFyLm9uKCdkYXRhJywgZnVuY3Rpb24gb25EYXRhKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIG5nTW9kZWwuJHNldFZpZXdWYWx1ZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgc2NvcGUuY2FsZW5kYXIub24oJ3JlYWR5JywgZnVuY3Rpb24gb25SZWFkeShvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRycy5wbGFjZWhvbGRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy4kc2V0KCdwbGFjZWhvbGRlcicsIG9wdGlvbnMuaW5wdXRGb3JtYXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBSZW1vdmluZyBjYWxlbmRhciBldmVudCBsaXN0ZW5lcnNcbiAgICAgICAgICAgICAgICBlbGVtZW50Lm9uKCckZGVzdHJveScsIGZ1bmN0aW9uIG9uRGVzdHJveSgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2FsZW5kYXIuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRhdGVwaWNrZXInLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRhdGVwaWNrZXIuZGlyZWN0aXZlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtZHJvcGRvd24tbWVudS5kaXJlY3RpdmUnLCBbXSlcbiAgICAuZGlyZWN0aXZlKCdiY0Ryb3Bkb3duTWVudScsICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICByZXF1aXJlOiAnXmJjRHJvcGRvd24nLFxuICAgICAgICAgICAgY29tcGlsZTogKHRFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdEVsZW1lbnQuYWRkQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUnKTtcbiAgICAgICAgICAgICAgICB0RWxlbWVudC5hdHRyKCdyb2xlJywgJ2xpc3Rib3gnKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBiY0Ryb3Bkb3duQ3RybCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmF0dHIoJ2lkJywgYmNEcm9wZG93bkN0cmwuZ2V0VW5pcXVlSWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cignYXJpYS1leHBhbmRlZCcsIGJjRHJvcGRvd25DdHJsLmdldElzT3BlbigpKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gbGlzdGVuIGZvciBkcm9wZG93bnMgYmVpbmcgb3BlbmVkIGFuZCB0b2dnbGUgYXJpYS1leHBhbmRlZCB0byByZWZsZWN0IGN1cnJlbnQgc3RhdGVcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuJG9uKCd0b2dnbGVUaGlzRHJvcGRvd24nLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBiY0Ryb3Bkb3duQ3RybC5nZXRJc09wZW4oKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtZHJvcGRvd24tdG9nZ2xlLmRpcmVjdGl2ZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ2JjRHJvcGRvd25Ub2dnbGUnLCAoJGNvbXBpbGUpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICB0ZXJtaW5hbDogdHJ1ZSxcbiAgICAgICAgICAgIHByaW9yaXR5OiAxMDAxLCAvLyBzZXQgaGlnaGVyIHRoYW4gbmctcmVwZWF0IHRvIHByZXZlbnQgZG91YmxlIGNvbXBpbGF0aW9uXG4gICAgICAgICAgICByZXF1aXJlOiAnXmJjRHJvcGRvd24nLFxuICAgICAgICAgICAgY29tcGlsZTogKHRFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdEVsZW1lbnQucmVtb3ZlQXR0cignYmMtZHJvcGRvd24tdG9nZ2xlJyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgYmNEcm9wZG93bkN0cmwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyKCdkcm9wZG93bi10b2dnbGUnLCAnIycgKyBiY0Ryb3Bkb3duQ3RybC5nZXRVbmlxdWVJZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyKCdhcmlhLWNvbnRyb2xzJywgYmNEcm9wZG93bkN0cmwuZ2V0VW5pcXVlSWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgYmNEcm9wZG93bkN0cmwudG9nZ2xlSXNPcGVuKTtcbiAgICAgICAgICAgICAgICAgICAgJGNvbXBpbGUoZWxlbWVudCkoc2NvcGUpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtZHJvcGRvd24uY29udHJvbGxlcicsIFtdKVxuICAgIC5jb250cm9sbGVyKCdCY0Ryb3Bkb3duQ29udHJvbGxlcicsIGZ1bmN0aW9uIGJjRHJvcGRvd25Db250cm9sbGVyKCRzY29wZSwgJHJvb3RTY29wZSkge1xuICAgICAgICBjb25zdCBjdHJsID0gdGhpcztcbiAgICAgICAgbGV0IGlzT3BlbiA9IGZhbHNlO1xuICAgICAgICBsZXQgdW5pcXVlSWQ7XG5cbiAgICAgICAgY3RybC5jbG9zZURyb3Bkb3duID0gY2xvc2VEcm9wZG93bjtcbiAgICAgICAgY3RybC5nZXRJc09wZW4gPSBnZXRJc09wZW47XG4gICAgICAgIGN0cmwuZ2V0VW5pcXVlSWQgPSBnZXRVbmlxdWVJZDtcbiAgICAgICAgY3RybC5zZXRJc09wZW4gPSBzZXRJc09wZW47XG4gICAgICAgIGN0cmwudG9nZ2xlSXNPcGVuID0gdG9nZ2xlSXNPcGVuO1xuXG4gICAgICAgIC8vIGxpc3RlbiBmb3Igb3RoZXIgZHJvcGRvd25zIGJlaW5nIG9wZW5lZCBpbiB0aGUgYXBwLlxuICAgICAgICAkc2NvcGUuJG9uKCdiY0Ryb3Bkb3duVG9nZ2xlJywgKGV2ZW50LCB0cmlnZ2VyaW5nSUQpID0+IHtcbiAgICAgICAgICAgIC8vIGlmIEknbSBvcGVuIGFuZCBub3QgdGhlIGRyb3Bkb3duIGJlaW5nIHRyaWdnZXJlZCwgdGhlbiBJIHNob3VsZCBjbG9zZVxuICAgICAgICAgICAgaWYgKGlzT3BlbiAmJiB0cmlnZ2VyaW5nSUQgIT09IHVuaXF1ZUlkKSB7XG4gICAgICAgICAgICAgICAgY3RybC5jbG9zZURyb3Bkb3duKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNsb3NlRHJvcGRvd24oKSB7XG4gICAgICAgICAgICBjdHJsLnNldElzT3BlbihmYWxzZSk7XG4gICAgICAgICAgICAkc2NvcGUuJGJyb2FkY2FzdCgndG9nZ2xlVGhpc0Ryb3Bkb3duJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRJc09wZW4oKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNPcGVuO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0VW5pcXVlSWQoKSB7XG4gICAgICAgICAgICBpZiAoIXVuaXF1ZUlkKSB7XG4gICAgICAgICAgICAgICAgdW5pcXVlSWQgPSBfLnVuaXF1ZUlkKCdiYy1kcm9wZG93bi0nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB1bmlxdWVJZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldElzT3Blbih2YWwpIHtcbiAgICAgICAgICAgIGlzT3BlbiA9IHZhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZUlzT3BlbigpIHtcbiAgICAgICAgICAgIGlzT3BlbiA9ICFpc09wZW47XG4gICAgICAgICAgICAvLyB0ZWxsIGNoaWxkIGRpcmVjdGl2ZXMgYSB0b2dnbGUgaW4gb3BlbiBzdGF0dXMgaGFzIG9jY3VycmVkXG4gICAgICAgICAgICAkc2NvcGUuJGJyb2FkY2FzdCgndG9nZ2xlVGhpc0Ryb3Bkb3duJyk7XG4gICAgICAgICAgICAvLyB0ZWxsIGFwcGxpY2F0aW9uIHRoYXQgYSBkcm9wZG93biBoYXMgYmVlbiBvcGVuZWQgc28gb3RoZXJzIGNhbiBjbG9zZVxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdiY0Ryb3Bkb3duVG9nZ2xlJywgdW5pcXVlSWQpO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtZHJvcGRvd24uZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1kcm9wZG93bi5jb250cm9sbGVyJ1xuXSlcbiAgICAuZGlyZWN0aXZlKCdiY0Ryb3Bkb3duJywgKCRkb2N1bWVudCkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCY0Ryb3Bkb3duQ29udHJvbGxlcicsXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdiY0Ryb3Bkb3duQ29udHJvbGxlcicsXG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgIGNvbXBpbGU6ICh0RWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRFbGVtZW50LmF0dHIoJ3JvbGUnLCAnY29tYm9ib3gnKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAoJHNjb3BlLCAkZWxlbWVudCwgYXR0cnMsIGN0cmwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBkaXJlY3RpdmUgaXMgYSBjb21wb3NpdGUgb2YgMiBzZXBhcmF0ZSBGb3VuZGF0aW9uIGRpcmVjdGl2ZXNcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hpY2ggZG9uJ3QgcHJvdmlkZSBob29rcyB0byBrbm93IHdoZW4gaXQncyBjbGlja2VkIG9yIG9wZW5lZFxuICAgICAgICAgICAgICAgICAgICAvLyB0aGV5IGRvIGhvd2V2ZXIgZGVhbCB3aXRoIHByb3BhZ2F0aW9uIG9mIGV2ZW50cyBzbyB0aGlzLCBzb21ld2hhdCBibGluZFxuICAgICAgICAgICAgICAgICAgICAvLyBkb2N1bWVudCBldmVudCBpcyBzYWZlLiBBbGwgaXQgZG9lcyBpcyBzd2FwIGFyaWEgc3RhdGVzIGF0IHRoZSBtb21lbnRcbiAgICAgICAgICAgICAgICAgICAgLy8gaW4gYSBjaGVhcCB3YXkgdG8ga2VlcCB0aGlzIGRpcmVjdGl2ZSBpbiBzeW5jIHdpdGggaXQncyBjaGlsZCBkaXJlY3RpdmVcbiAgICAgICAgICAgICAgICAgICAgJGRvY3VtZW50Lm9uKCdjbGljaycsIGN0cmwuY2xvc2VEcm9wZG93bik7XG5cbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQub24oJyRkZXN0cm95JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGRvY3VtZW50Lm9mZignY2xpY2snLCBjdHJsLmNsb3NlRHJvcGRvd24pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRyb3Bkb3duJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1kcm9wZG93bi5kaXJlY3RpdmUnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1kcm9wZG93bi10b2dnbGUuZGlyZWN0aXZlJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtZHJvcGRvd24tbWVudS5kaXJlY3RpdmUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1wYWdpbmF0aW9uLmRpcmVjdGl2ZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ2JjUGFnaW5hdGlvbicsIGZ1bmN0aW9uIGJjUGFnaW5hdGlvbkRpcmVjdGl2ZSgkcGFyc2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICBzY29wZTogdHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL2JpZ2NvbW1lcmNlL2JjLXBhZ2luYXRpb24vYmMtcGFnaW5hdGlvbi50cGwuaHRtbCcsXG5cbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGJjUGFnaW5hdGlvbkNvbXBpbGUodEVsZW1lbnQsIHRBdHRycykge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyT2JqID0ge307XG5cbiAgICAgICAgICAgICAgICAvLyBTaW5jZSB0aGlzIGlzIGEgd3JhcHBlciBvZiBhbmd1bGFyLWZvdW5kYXRpb24ncyBwYWdpbmF0aW9uIGRpcmVjdGl2ZSB3ZSBuZWVkIHRvIGNvcHkgYWxsXG4gICAgICAgICAgICAgICAgLy8gb2YgdGhlIGF0dHJpYnV0ZXMgcGFzc2VkIHRvIG91ciBkaXJlY3RpdmUgYW5kIHN0b3JlIHRoZW0gaW4gdGhlIGF0dHJPYmouXG4gICAgICAgICAgICAgICAgXy5lYWNoKHRBdHRycy4kYXR0ciwgZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkgIT09ICdjbGFzcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJPYmpba2V5XSA9IHRFbGVtZW50LmF0dHIoa2V5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gQWRkaW5nIG91ciBjdXN0b20gY2FsbGJhY2sgdG8gdGhlIGF0dHJPYmosIGFuZ3VsYXItZm91bmRhdGlvbiB3aWxsIGNhbGwgdGhpcyBmdW5jdGlvblxuICAgICAgICAgICAgICAgIC8vIHdoZW4gYSBwYWdlIG51bWJlciBpcyBjbGlja2VkIGluIHRoZSBwYWdpbmF0aW9uLlxuICAgICAgICAgICAgICAgIGF0dHJPYmpbJ29uLXNlbGVjdC1wYWdlJ10gPSAncGFnaW5hdGlvbkNhbGxiYWNrKHBhZ2UpJztcblxuICAgICAgICAgICAgICAgIC8vIEFkZCBhbGwgdGhlIGF0dHJpYnV0ZXMgdG8gYW5ndWxhci1mb3VuZGF0aW9uJ3MgcGFnaW5hdGlvbiBkaXJlY3RpdmVcbiAgICAgICAgICAgICAgICB0RWxlbWVudC5maW5kKCdwYWdpbmF0aW9uJykuYXR0cihhdHRyT2JqKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBiY1BhZ2luYXRpb25MaW5rKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9uQ2hhbmdlUGFyc2VHZXR0ZXIgPSAkcGFyc2UoYXR0cnMub25DaGFuZ2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdExpbWl0cyA9IFsxMCwgMjAsIDMwLCA1MCwgMTAwXTtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc2V0TGltaXQgPSBmdW5jdGlvbihsaW1pdCwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW1pdCA9IF8ucGFyc2VJbnQobGltaXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHBhcnNlKGF0dHJzLml0ZW1zUGVyUGFnZSkuYXNzaWduKCRzY29wZS4kcGFyZW50LCBsaW1pdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucGFnaW5hdGlvbkNhbGxiYWNrKDEsIGxpbWl0KTtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZ2V0Q3VycmVudFBhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcGFyc2UoYXR0cnMucGFnZSkoJHNjb3BlLiRwYXJlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5nZXRDdXJyZW50TGltaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcGFyc2UoYXR0cnMuaXRlbXNQZXJQYWdlKSgkc2NvcGUuJHBhcmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmdldEl0ZW1zUGVyUGFnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRwYXJzZShhdHRycy5pdGVtc1BlclBhZ2UpKCRzY29wZS4kcGFyZW50KSB8fCAwO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5nZXRUb3RhbEl0ZW1zID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHBhcnNlKGF0dHJzLnRvdGFsSXRlbXMpKCRzY29wZS4kcGFyZW50KSB8fCAwO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zaG93ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHBhcnNlKGF0dHJzLmFsd2F5c1Nob3cpKCRzY29wZS4kcGFyZW50KSB8fCAkc2NvcGUuZ2V0VG90YWxJdGVtcygpID4gJHNjb3BlLmdldEl0ZW1zUGVyUGFnZSgpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zaG93TGltaXRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHNjb3BlLnNob3coKSAmJiAkcGFyc2UoYXR0cnMuc2hvd0xpbWl0cykoJHNjb3BlLiRwYXJlbnQpICE9PSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZ2V0TGltaXRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGltaXRzID0gJHBhcnNlKGF0dHJzLmxpbWl0cykoJHNjb3BlLiRwYXJlbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkobGltaXRzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWZhdWx0TGltaXRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGltaXRzO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wYWdpbmF0aW9uQ2FsbGJhY2sgPSBmdW5jdGlvbihwYWdlLCBsaW1pdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFkZGl0aW9uYWxTY29wZVByb3BlcnRpZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0OiBsaW1pdCB8fCAkc2NvcGUuZ2V0Q3VycmVudExpbWl0KCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IHBhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlUGFyc2VSZXN1bHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICRwYXJzZShhdHRycy5wYWdlKS5hc3NpZ24oJHNjb3BlLiRwYXJlbnQsIHBhZ2UpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZVBhcnNlUmVzdWx0ID0gb25DaGFuZ2VQYXJzZUdldHRlcigkc2NvcGUsIGFkZGl0aW9uYWxTY29wZVByb3BlcnRpZXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgb25DaGFuZ2Ugc3RyaW5nIGlzIGEgZnVuY3Rpb24gYW5kIG5vdCBhbiBleHByZXNzaW9uOiBjYWxsIGl0IHdpdGggdGhlIGFkZGl0aW9uYWxTY29wZVByb3BlcnRpZXMgb2JqIChmb3IgYmFja3dhcmRzIGNvbXBhdGFiaWxpdHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlbHNlIHRoZSBleHByZXNzaW9uIGhhcyBhbHJlYWR5IGJlZW4gcmFuOiBkbyBub3RoaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9uQ2hhbmdlUGFyc2VSZXN1bHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZVBhcnNlUmVzdWx0KGFkZGl0aW9uYWxTY29wZVByb3BlcnRpZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtcGFnaW5hdGlvbicsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtcGFnaW5hdGlvbi5kaXJlY3RpdmUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jb2xvci1waWNrZXItcGFsZXR0ZS5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignQ29sb3JQaWNrZXJQYWxldHRlQ3RybCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgY3RybCA9IHRoaXM7XG5cbiAgICAgICAgY3RybC5jcmVhdGVOZXdDb2xvciA9IGNyZWF0ZU5ld0NvbG9yO1xuICAgICAgICBjdHJsLnJlbW92ZUV4aXN0aW5nQ29sb3IgPSByZW1vdmVFeGlzdGluZ0NvbG9yO1xuICAgICAgICBjdHJsLmlzQWN0aXZlID0gaXNBY3RpdmU7XG5cbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlTmV3Q29sb3IoJGV2ZW50KSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgY3RybC5jcmVhdGVOZXdQYWxldHRlQ29sb3IoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZUV4aXN0aW5nQ29sb3IoJGV2ZW50KSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgY3RybC5yZW1vdmVQYWxldHRlQ29sb3IoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzQWN0aXZlKGNvbG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gY29sb3IgPT09IGN0cmwuc2VsZWN0ZWRDb2xvcjtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNvbG9yLXBpY2tlci1wYWxldHRlLmRpcmVjdGl2ZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY29sb3ItcGlja2VyLXBhbGV0dGUuY29udHJvbGxlcidcbl0pXG5cbiAgICAuZGlyZWN0aXZlKCdjb2xvclBpY2tlclBhbGV0dGUnLCBmdW5jdGlvbiBjb2xvclBpY2tlclBhbGV0dGVEaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0NvbG9yUGlja2VyUGFsZXR0ZUN0cmwnLFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY29sb3JQaWNrZXJQYWxldHRlQ3RybCcsXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBjb2xvcnM6ICc9JyxcbiAgICAgICAgICAgICAgICBjcmVhdGVOZXdQYWxldHRlQ29sb3I6ICc9JyxcbiAgICAgICAgICAgICAgICByZW1vdmVQYWxldHRlQ29sb3I6ICc9JyxcbiAgICAgICAgICAgICAgICBzZXROZXdDb2xvcjogJz0nLFxuICAgICAgICAgICAgICAgIHNlbGVjdGVkQ29sb3I6ICdAJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL2JpZ2NvbW1lcmNlL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXItcGFsZXR0ZS50cGwuaHRtbCcsXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiBjb2xvclBpY2tlclBhbGV0dGVEaXJlY3RpdmVDb21waWxlKHRFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdEVsZW1lbnQuYWRkQ2xhc3MoJ2NvbG9yUGlja2VyLXBhbGV0dGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsIi8qIGdsb2JhbHMgQ29sb3JQaWNrZXIgKi9cbmFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jb2xvci1waWNrZXIuY29udHJvbGxlcicsIFtdKVxuICAgIC5jb250cm9sbGVyKCdDb2xvclBpY2tlckN0cmwnLCBmdW5jdGlvbiBDb2xvclBpY2tlckN0cmwoJGVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgY3RybCA9IHRoaXM7XG5cbiAgICAgICAgbGV0IGNvbG9yU2VsZWN0aW9uO1xuICAgICAgICBsZXQgY29sb3JTZWxlY3Rpb25JbmRpY2F0b3I7XG4gICAgICAgIGxldCBjb2xvclNsaWRlcjtcbiAgICAgICAgbGV0IGNvbG9yU2xpZGVySW5kaWNhdG9yO1xuXG4gICAgICAgIGN0cmwuY3JlYXRlQ29sb3JQaWNrZXIgPSBjcmVhdGVDb2xvclBpY2tlcjtcbiAgICAgICAgY3RybC5jcmVhdGVOZXdQYWxldHRlQ29sb3IgPSBjcmVhdGVOZXdQYWxldHRlQ29sb3I7XG4gICAgICAgIGN0cmwucmVtb3ZlUGFsZXR0ZUNvbG9yID0gcmVtb3ZlUGFsZXR0ZUNvbG9yO1xuICAgICAgICBjdHJsLnNldE1vZGVsQ3RybCA9IHNldE1vZGVsQ3RybDtcbiAgICAgICAgY3RybC5zZXROZXdDb2xvciA9IHNldE5ld0NvbG9yO1xuICAgICAgICBjdHJsLmdldFNlbGVjdGVkQ29sb3IgPSBnZXRTZWxlY3RlZENvbG9yO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbG9yUGlja2VyKCkge1xuICAgICAgICAgICAgY29sb3JTZWxlY3Rpb24gPSAkZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yKCdbZGF0YS1iYy1waWNrZXJdJyk7XG4gICAgICAgICAgICBjb2xvclNlbGVjdGlvbkluZGljYXRvciA9ICRlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWJjLXBpY2tlci1pbmRpY2F0b3JdJyk7XG4gICAgICAgICAgICBjb2xvclNsaWRlciA9ICRlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWJjLXNsaWRlcl0nKTtcbiAgICAgICAgICAgIGNvbG9yU2xpZGVySW5kaWNhdG9yID0gJGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignW2RhdGEtYmMtc2xpZGVyLWluZGljYXRvcl0nKTtcblxuICAgICAgICAgICAgQ29sb3JQaWNrZXIuZml4SW5kaWNhdG9ycyhcbiAgICAgICAgICAgICAgICBjb2xvclNsaWRlckluZGljYXRvcixcbiAgICAgICAgICAgICAgICBjb2xvclNlbGVjdGlvbkluZGljYXRvcik7XG5cbiAgICAgICAgICAgIGN0cmwuY3AgPSBuZXcgQ29sb3JQaWNrZXIoXG4gICAgICAgICAgICAgICAgY29sb3JTbGlkZXIsXG4gICAgICAgICAgICAgICAgY29sb3JTZWxlY3Rpb24sXG4gICAgICAgICAgICAgICAgcGlja05ld0NvbG9yXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlTmV3UGFsZXR0ZUNvbG9yKCkge1xuICAgICAgICAgICAgaWYgKGN0cmwucGFsZXR0ZS5pbmRleE9mKGdldFNlbGVjdGVkQ29sb3IoKSkgPCAwKSB7XG4gICAgICAgICAgICAgICAgY3RybC5wYWxldHRlLnB1c2goZ2V0U2VsZWN0ZWRDb2xvcigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZVBhbGV0dGVDb2xvcigpIHtcbiAgICAgICAgICAgIGlmIChjdHJsLnBhbGV0dGUuaW5kZXhPZihnZXRTZWxlY3RlZENvbG9yKCkpID4gLTEpIHtcbiAgICAgICAgICAgICAgICBjdHJsLnBhbGV0dGUuc3BsaWNlKGN0cmwucGFsZXR0ZS5pbmRleE9mKGdldFNlbGVjdGVkQ29sb3IoKSksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0U2VsZWN0ZWRDb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiBjdHJsLmNvbG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcGlja05ld0NvbG9yKGhleCwgaHN2LCByZ2IsIHBpY2tlckNvb3JkaW5hdGUsIHNsaWRlckNvb3JkaW5hdGUpIHtcbiAgICAgICAgICAgIENvbG9yUGlja2VyLnBvc2l0aW9uSW5kaWNhdG9ycyhcbiAgICAgICAgICAgICAgICBjb2xvclNsaWRlckluZGljYXRvcixcbiAgICAgICAgICAgICAgICBjb2xvclNlbGVjdGlvbkluZGljYXRvcixcbiAgICAgICAgICAgICAgICBzbGlkZXJDb29yZGluYXRlLCBwaWNrZXJDb29yZGluYXRlXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjdHJsLm5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUoaGV4KTtcbiAgICAgICAgICAgIGN0cmwubmdNb2RlbEN0cmwuJHJlbmRlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICAgICAgY3RybC5jb2xvciA9IGN0cmwubmdNb2RlbEN0cmwuJHZpZXdWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldE1vZGVsQ3RybChuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgY3RybC5uZ01vZGVsQ3RybCA9IG5nTW9kZWxDdHJsO1xuICAgICAgICAgICAgY3RybC5uZ01vZGVsQ3RybC4kcmVuZGVyID0gcmVuZGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0TmV3Q29sb3IoJGV2ZW50LCBuZXdDb2xvcikge1xuICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGN0cmwuY3Auc2V0SGV4KG5ld0NvbG9yKTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNvbG9yLXBpY2tlci5kaXJlY3RpdmUnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNvbG9yLXBpY2tlci5jb250cm9sbGVyJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuaHRtbDVNb2RlJyxcbl0pXG5cbiAgICAuZGlyZWN0aXZlKCdjb2xvclBpY2tlcicsIGZ1bmN0aW9uIGNvbG9yUGlja2VyRGlyZWN0aXZlKCRsb2NhdGlvbiwgaHRtbDVNb2RlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0NvbG9yUGlja2VyQ3RybCcsXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjb2xvclBpY2tlckN0cmwnLFxuICAgICAgICAgICAgcmVxdWlyZTogWydjb2xvclBpY2tlcicsICdebmdNb2RlbCddLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgcGFsZXR0ZTogJz0nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL2JpZ2NvbW1lcmNlL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXIudHBsLmh0bWwnLFxuXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiBjb2xvclBpY2tlckRpcmVjdGl2ZUNvbXBpbGUodEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0RWxlbWVudC5hZGRDbGFzcygnY29sb3JQaWNrZXInKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBjb2xvclBpY2tlckRpcmVjdGl2ZUxpbmsoJHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3RybCA9IGN0cmxzWzBdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZ01vZGVsQ3RybCA9IGN0cmxzWzFdO1xuXG4gICAgICAgICAgICAgICAgICAgIGN0cmwuc2V0TW9kZWxDdHJsKG5nTW9kZWxDdHJsKTtcbiAgICAgICAgICAgICAgICAgICAgY3RybC5jcmVhdGVDb2xvclBpY2tlcigpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEFwcHMgdGhhdCBoYXZlIGEgPGJhc2U+IHRhZyByZXF1aXJlIHRvIGhhdmUgYWJzb2x1dGUgcGF0aHNcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hlbiB1c2luZyBzdmcgdXJsIHJlZmVyZW5jZXNcbiAgICAgICAgICAgICAgICAgICAgaWYgKGh0bWw1TW9kZS5lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfLmVhY2goZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yQWxsKCdbZmlsbF0nKSwgZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBiZXR3ZWVuUGFyZW50aGVzaXMgPSAvXFwoKFteKV0rKVxcKS87XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZWxlbSA9IGFuZ3VsYXIuZWxlbWVudChlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudEZpbGwgPSBlbGVtLmF0dHIoJ2ZpbGwnKTtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF8uY29udGFpbnMoY3VycmVudEZpbGwsICd1cmwoIycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0ZpbGwgPSBiZXR3ZWVuUGFyZW50aGVzaXMuZXhlYyhjdXJyZW50RmlsbClbMV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbS5hdHRyKCdmaWxsJywgJ3VybCgnICsgJGxvY2F0aW9uLmFic1VybCgpICsgbmV3RmlsbCArICcpJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJHdhdGNoKGdldE1vZGVsVmFsdWUsIGZ1bmN0aW9uIG1vZGVsV2F0Y2gobmV3VmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3VmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RybC5jcC5zZXRIZXgobmV3VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZ2V0TW9kZWxWYWx1ZSgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjdHJsLm5nTW9kZWxDdHJsLiRtb2RlbFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jb2xvci1waWNrZXInLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNvbG9yLXBpY2tlci5kaXJlY3RpdmUnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jb2xvci1waWNrZXItcGFsZXR0ZS5kaXJlY3RpdmUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jb3B5LWNsaXBib2FyZC5jb25zdGFudCcsIFtdKVxuICAgIC5mYWN0b3J5KCdDTElQQk9BUkRfVE9PTFRJUCcsIGZ1bmN0aW9uIChnZXR0ZXh0Q2F0YWxvZykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3VjY2Vzczoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGdldHRleHRDYXRhbG9nLmdldFN0cmluZygnQ29waWVkIScpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgICAgICBtb2JpbGU6IGdldHRleHRDYXRhbG9nLmdldFN0cmluZygnVGFwIGRvd24gYW5kIGhvbGQgdG8gY29weScpLFxuICAgICAgICAgICAgICAgIG1hYzogZ2V0dGV4dENhdGFsb2cuZ2V0U3RyaW5nKCdQcmVzcyDijJgtQyB0byBjb3B5JyksXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogZ2V0dGV4dENhdGFsb2cuZ2V0U3RyaW5nKCdQcmVzcyBDdHJsLUMgdG8gY29weScpXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY29weS1jbGlwYm9hcmQuY29udHJvbGxlcicsIFtdKVxuICAgIC5jb250cm9sbGVyKCdDb3B5Q2xpcGJvYXJkQ3RybCcsIGZ1bmN0aW9uIENvcHlDbGlwYm9hcmRDdHJsKENMSVBCT0FSRF9UT09MVElQLCBkZXZpY2VTZXJ2aWNlLCAkdGltZW91dCl7XG4gICAgICAgIHZhciBjdHJsID0gdGhpcztcblxuICAgICAgICBjdHJsLnRpbWVvdXQgPSAkdGltZW91dDtcbiAgICAgICAgY3RybC5vbkVycm9yID0gb25FcnJvcjtcbiAgICAgICAgY3RybC5vblN1Y2Nlc3MgPSBvblN1Y2Nlc3M7XG5cbiAgICAgICAgaW5pdCgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICBjdHJsLnVuaXF1ZUlkID0gXy51bmlxdWVJZCgnY2xpcGJvYXJkLScpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb25TdWNjZXNzKCkge1xuICAgICAgICAgICAgY3RybC5keW5hbWljVG9vbHRpcCA9IENMSVBCT0FSRF9UT09MVElQLnN1Y2Nlc3MuZGVmYXVsdDtcbiAgICAgICAgICAgIHNob3dUb29sdGlwKGN0cmwudW5pcXVlSWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb25FcnJvcigpe1xuICAgICAgICAgICAgdmFyIHRvb2x0aXBNZXNzYWdlO1xuXG4gICAgICAgICAgICBpZiAoZGV2aWNlU2VydmljZS5pc0lPU0RldmljZSgpIHx8IGRldmljZVNlcnZpY2UuaXNNb2JpbGVEZXZpY2UoKSkge1xuICAgICAgICAgICAgICAgIHRvb2x0aXBNZXNzYWdlID0gQ0xJUEJPQVJEX1RPT0xUSVAuZXJyb3IubW9iaWxlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkZXZpY2VTZXJ2aWNlLmlzTWFjT1NEZXZpY2UoKSkge1xuICAgICAgICAgICAgICAgIHRvb2x0aXBNZXNzYWdlID0gQ0xJUEJPQVJEX1RPT0xUSVAuZXJyb3IubWFjO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0b29sdGlwTWVzc2FnZSA9IENMSVBCT0FSRF9UT09MVElQLmVycm9yLmRlZmF1bHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGN0cmwuZHluYW1pY1Rvb2x0aXAgPSB0b29sdGlwTWVzc2FnZTtcbiAgICAgICAgICAgIHNob3dUb29sdGlwKGN0cmwudW5pcXVlSWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2hvd1Rvb2x0aXAoaWQpIHtcbiAgICAgICAgICAgIHZhciB0b29sdGlwRWxlbWVudCA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkpO1xuXG4gICAgICAgICAgICBjdHJsLnRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRvb2x0aXBFbGVtZW50LnRyaWdnZXJIYW5kbGVyKCd0b29sdGlwVHJpZ2dlck9wZW4nKTtcbiAgICAgICAgICAgICAgICBjdHJsLnRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0b29sdGlwRWxlbWVudC50cmlnZ2VySGFuZGxlcigndG9vbHRpcFRyaWdnZXJDbG9zZScpO1xuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jb3B5LWNsaXBib2FyZC5kaXJlY3RpdmUnLCBbXSlcbiAgICAuZGlyZWN0aXZlKCdjb3B5Q2xpcGJvYXJkJywgZnVuY3Rpb24gY29weUNsaXBib2FyZERpcmVjdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQ29weUNsaXBib2FyZEN0cmwgYXMgY29weUNsaXBib2FyZEN0cmwnLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgY29weVRleHQ6ICdAJyxcbiAgICAgICAgICAgICAgICByZWFkb25seTogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvanMvYmlnY29tbWVyY2UvY29weS1jbGlwYm9hcmQvY29weS1jbGlwYm9hcmQudHBsLmh0bWwnLFxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNvcHktY2xpcGJvYXJkJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jb3B5LWNsaXBib2FyZC5jb25zdGFudCcsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNvcHktY2xpcGJvYXJkLmNvbnRyb2xsZXInLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jb3B5LWNsaXBib2FyZC5kaXJlY3RpdmUnXG5dKTtcbiIsIi8qKlxuICogQG5hbWUgY3JlZGl0LWNhcmQgZGlyZWN0aXZlXG4gKiBAZGVzY3JpcHRpb24gQ29tcG9uZW50IGNvbnRhaW5pbmcgY2MgbnVtYmVyLCBjdmMsIG5hbWUsIGFuZCBleHBpcnkuIEhhcyBhbiBpc29sYXRlZCBzY29wZSB3aXRoIG5vIGNvbnRyb2xsZXIuXG4gKiBAcmVxdWlyZSBmb3JtXG4gKlxuICogQHBhcmFtIGNjRGF0YSB7b2JqZWN0fSBDb250YWlucyBjY051bWJlciwgY2NUeXBlLCBjY0V4cGlyeSwgYW5kIGNjTmFtZVxuICogQHBhcmFtIGNjQ29uZmlnIHtvYmplY3R9IFRoZSBjb25maWd1cmF0aW9uIG9iamVjdC4gQ3VycmVudGx5IHN1cHBvcnRpbmc6XG4gKiAgLSBjYXJkQ29kZSB7Ym9vbGVhbn0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGN2diBmaWVsZCBzaG91bGQgYmUgc2hvd24uIERlZmF1bHQgdHJ1ZS5cbiAqICAtIGNhcmRDb2RlUmVxdWlyZWQge2Jvb2xlYW59IEluZGljYXRlcyB3aGV0aGVyIHRoZSBjdnYgZmllbGQgaXMgcmVxdWlyZWQuIFRoaXMgb25seSBtYXR0ZXJzIHdoZW4gY2FyZENvZGUgaXMgc2V0IHRvIHRydWUuIERlZmF1bHQgdHJ1ZS5cbiAqICAtIGZ1bGxOYW1lIHtib29sZWFufSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgbmFtZSBmaWVsZCBzaG91bGQgYmUgc2hvd24uIERlZmF1bHQgdHJ1ZS5cbiAqIEBwYXJhbSBlYWdlclR5cGUge2Jvb2xlYW59IElmIHRoaXMgYXR0cmlidXRlIGlzIHNldCB0byBmYWxzZSwgdGhlbiBkaXNhYmxlIGVhZ2VyIHR5cGUgZGV0ZWN0aW9uLiBEZWZhdWx0cyB0cnVlLlxuICovXG5hbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQuZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5pY29uJ1xuXSlcbiAgICAuZGlyZWN0aXZlKCdjcmVkaXRDYXJkJywgZnVuY3Rpb24gY3JlZGl0Q2FyZERpcmVjdGl2ZSgkY29tcGlsZSwgJHBhcnNlLCAkdGVtcGxhdGVDYWNoZSkge1xuICAgICAgICBjb25zdCBjdnZUb29sdGlwVGVtcGxhdGUgPSAkdGVtcGxhdGVDYWNoZS5nZXQoJ3NyYy9qcy9iaWdjb21tZXJjZS9jcmVkaXQtY2FyZC9jcmVkaXQtY2FyZC1jdnYvdG9vbHRpcC50cGwuaHRtbCcpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiBjcmVkaXRDYXJkQ29tcGlsZSh0RWxlbSwgdEF0dHJzKXtcbiAgICAgICAgICAgICAgICBsZXQgaXNFYWdlclR5cGUgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRBdHRycy5lYWdlclR5cGUgJiYgJHBhcnNlKHRBdHRycy5lYWdlclR5cGUpKCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNjTnVtYmVyID0gdEVsZW1bMF0ucXVlcnlTZWxlY3RvcignI2NjTnVtYmVyJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgY2NOdW1iZXIucmVtb3ZlQXR0cmlidXRlKCdjY0VhZ2VyVHlwZScpO1xuICAgICAgICAgICAgICAgICAgICBpc0VhZ2VyVHlwZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBjcmVkaXRDYXJkTGluayhzY29wZSwgZWxlbSwgYXR0ciwgZm9ybUN0cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3Z2VG9vbHRpcEVsZW1lbnQgPSAkY29tcGlsZShjdnZUb29sdGlwVGVtcGxhdGUpKHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcmRDb2RlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FyZENvZGVSZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGxOYW1lOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmdldEN2dlRvb2x0aXBIdG1sID0gZ2V0Q3Z2VG9vbHRpcEh0bWw7XG5cbiAgICAgICAgICAgICAgICAgICAgaW5pdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5mb3JtQ3RybCA9IGZvcm1DdHJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2NDb25maWcgPSBfLmRlZmF1bHRzKHNjb3BlLmNjQ29uZmlnLCBkZWZhdWx0Q29uZmlnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBUaGUgY3JlZGl0IGNhcmQgdHlwZSBpcyBkZWR1Y2VkIGJ5IHRoZSBgY2NOdW1iZXJgIGRpcmVjdGl2ZS4gVGhpcyBpcyBpbiB0dXJuIGV4cG9zZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIGFzIGVpdGhlciBgJGNjRWFnZXJUeXBlYCBvciBgJGNjVHlwZWAgb24gdGhlIGlucHV0IGNvbnRyb2wgZWxlbWVudC4gV2F0Y2ggZm9yIGNoYW5nZXMgYW5kIGJpbmQgdGhlIHR5cGUgdG8gdGhlIGNvcnJlc3BvbmRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIHZhbHVlIG9uIGNjRGF0YS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGdldERldGVjdGVkQ2NUeXBlLCBzZXRDY1R5cGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFJldHVybiB0aGUgaHRtbCBmb3IgdGhlIHRvb2x0aXAuIFVzaW5nIG91dGVySFRNTCB0byBhbHNvIGluY2x1ZGUgdGhlIHJvb3QgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IEh0bWwgc3RyaW5nIGZvciB0aGUgY3Z2IHRvb2x0aXAgdGVtcGxhdGVcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdldEN2dlRvb2x0aXBIdG1sKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN2dlRvb2x0aXBFbGVtZW50WzBdLm91dGVySFRNTDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBHZXQgdGhlIGRldGVjdGVkIGNyZWRpdCBjYXJkIHR5cGUgZXhwb3NlZCBvbiB0aGUgZm9ybSBjb250cm9sIGJ5IHRoZSBjY051bWJlciBjaGlsZCBkaXJlY3RpdmUuXG4gICAgICAgICAgICAgICAgICAgICAqIFRoaXMgdmFsdWUgd2lsbCBiZSBleHBvc2VkIGFzICRjY0VhZ2VyVHlwZSBvciAkY2NUeXBlIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRoaXMgZmVhdHVyZSBpcyBlbmFibGVkLlxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd8bnVsbH1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdldERldGVjdGVkQ2NUeXBlKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzRWFnZXJUeXBlID8gZm9ybUN0cmwuY2NOdW1iZXIuJGNjRWFnZXJUeXBlIDogZm9ybUN0cmwuY2NOdW1iZXIuJGNjVHlwZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBTZXQgY2NEYXRhLmNjVHlwZVxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ3xudWxsfSB0eXBlIFRoZSBjcmVkaXQgY2FyZCB0eXBlLCBpLmUuICd2aXNhJ1xuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd8bnVsbH0gdHlwZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gc2V0Q2NUeXBlKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmNjRGF0YS5jY1R5cGUgPSB0eXBlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHlwZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVxdWlyZTogJ15mb3JtJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBjY0RhdGE6ICc9JyxcbiAgICAgICAgICAgICAgICBjY0NvbmZpZzogJz0nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL2JpZ2NvbW1lcmNlL2NyZWRpdC1jYXJkL2NyZWRpdC1jYXJkLnRwbC5odG1sJ1xuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkJywgW1xuICAgICdjcmVkaXQtY2FyZHMnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC5iYy1jdmMnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC5jYy1leHBpcnknLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC5kaXJlY3RpdmUnLFxuICAgICdnZXR0ZXh0Jyxcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLXR5cGVzLmNvbnN0YW50JywgW10pXG4gICAgLmNvbnN0YW50KCdDQ19UWVBFUycsIHtcbiAgICAgICAgJ0FtZXJpY2FuIEV4cHJlc3MnOiAnYW1leCcsXG4gICAgICAgICdEaW5lcnMgQ2x1Yic6ICdkaW5lcnNjbHViJyxcbiAgICAgICAgJ0Rpc2NvdmVyJzogJ2Rpc2NvdmVyJyxcbiAgICAgICAgJ01hc3RlckNhcmQnOiAnbWFzdGVyY2FyZCcsXG4gICAgICAgICdWaXNhJzogJ3Zpc2EnLFxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLXR5cGVzLmNvbnRyb2xsZXInLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLXR5cGVzLmNvbnN0YW50Jyxcbl0pXG4gICAgLmNvbnRyb2xsZXIoJ0NyZWRpdENhcmRUeXBlc0N0cmwnLCBmdW5jdGlvbiBDcmVkaXRDYXJkVHlwZXNDdHJsKCRlbGVtZW50LCBDQ19UWVBFUykge1xuICAgICAgICBjb25zdCBjdHJsID0gdGhpcztcblxuICAgICAgICBjdHJsLmhhc1NlbGVjdGVkVHlwZSA9IGhhc1NlbGVjdGVkVHlwZTtcbiAgICAgICAgY3RybC5pc1NlbGVjdGVkVHlwZSA9IGlzU2VsZWN0ZWRUeXBlO1xuICAgICAgICBjdHJsLm1hcFRvU3ZnID0gbWFwVG9Tdmc7XG5cbiAgICAgICAgaW5pdCgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygnY3JlZGl0Q2FyZFR5cGVzJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2hlY2tzIHdoZXRoZXIgYSB0eXBlIGhhcyBiZWVuIHNlbGVjdGVkIChvciBkZXRlY3RlZCBieSB0aGUgY3JlZGl0LWNhcmQgY29tcG9uZW50KVxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gaGFzU2VsZWN0ZWRUeXBlKCkge1xuICAgICAgICAgICAgcmV0dXJuICFfLmlzRW1wdHkoY3RybC5nZXRTZWxlY3RlZFR5cGUoKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2hlY2tzIGlmIHRoZSBwYXNzZWQgaW4gY2NUeXBlIGlzIHRoZSBzYW1lIGFzIHRoZSBzZWxlY3RlZCBjY1R5cGVcbiAgICAgICAgICogQHBhcmFtIGNjVHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gaXNTZWxlY3RlZFR5cGUoY2NUeXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gY2NUeXBlID09PSBjdHJsLmdldFNlbGVjdGVkVHlwZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1hcCB0aGUgY2NUeXBlIHRvIGEgY29ycmVzcG9uZGluZyBzdmcgbmFtZVxuICAgICAgICAgKiBAcGFyYW0gY2NUeXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG1hcFRvU3ZnKGNjVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIENDX1RZUEVTW2NjVHlwZV07XG4gICAgICAgIH1cbiAgICB9KTtcbiIsIi8qKlxuICogQG5hbWUgY3JlZGl0LWNhcmQtdHlwZXMgZGlyZWN0aXZlXG4gKiBAZGVzY3JpcHRpb24gQ29tcG9uZW50IGRpc3BsYXlpbmcgYW5kIGdyZXlpbmcgb3V0IGNyZWRpdCBjYXJkIHR5cGUgaWNvbnMgYmFzZWQgb24gdGhlIHNlbGVjdGVkIGNyZWRpdCBjYXJkIHR5cGUuXG4gKiBgLmlzLWFjdGl2ZWAgaXMgYWRkZWQgdG8gdGhlIGNvcnJlc3BvbmRpbmcgc2VsZWN0ZWQgY3JlZGl0IGNhcmQgdHlwZS4gYC5ub3QtYWN0aXZlYCBpcyBhZGRlZCBmb3IgdGhlIG90aGVyXG4gKiB0eXBlcy4gSWYgbm8gY3JlZGl0IGNhcmQgdHlwZXMgaGFzIGJlZW4gc2VsZWN0ZWQsIHRoZW4gbmVpdGhlciBgLmlzLWFjdGl2ZWAgYW5kIGAubm90LWFjdGl2ZWAgd2lsbCBiZSBhZGRlZCBhdCBhbGwuXG4gKlxuICogQHBhcmFtIHNlbGVjdGVkVHlwZSB7U3RyaW5nfSBDcmVkaXQgY2FyZCB0eXBlLiBWYWxpZCB0eXBlcyBhcmUgJ1Zpc2EnLCAnTWFzdGVyQ2FyZCcsICdEaW5lcnMgQ2x1YicsICdEaXNjb3ZlcicsIGFuZCAnQW1lcmljYW4gRXhwcmVzcydcbiAqIEBwYXJhbSBzdXBwb3J0ZWRUeXBlcyB7QXJyYXl9IEFycmF5IG9mIGNyZWRpdCBjYXJkIHR5cGVzIHRvIGRpc3BsYXkuIFRoZSBjYXJkIHR5cGVzIHVzZSB0aGUgc2FtZSBzdHJpbmdzOiAnQW1lcmljYW4gRXhwcmVzcycsICdEaXNjb3ZlcicsICdNYXN0ZXJDYXJkJywgJ1Zpc2EnXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC10eXBlcy5kaXJlY3RpdmUnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLXR5cGVzLmNvbnRyb2xsZXInLFxuXSlcbiAgICAuZGlyZWN0aXZlKCdjcmVkaXRDYXJkVHlwZXMnLCBmdW5jdGlvbiBjcmVkaXRDYXJkVHlwZXNEaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0NyZWRpdENhcmRUeXBlc0N0cmwgYXMgY3JlZGl0Q2FyZFR5cGVzQ3RybCcsXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBnZXRTZWxlY3RlZFR5cGU6ICcmc2VsZWN0ZWRUeXBlJyxcbiAgICAgICAgICAgICAgICBnZXRTdXBwb3J0ZWRUeXBlczogJyZzdXBwb3J0ZWRUeXBlcydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9qcy9iaWdjb21tZXJjZS9jcmVkaXQtY2FyZC10eXBlcy9jcmVkaXQtY2FyZC10eXBlcy50cGwuaHRtbCdcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC10eXBlcycsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQtdHlwZXMuY29uc3RhbnQnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC10eXBlcy5jb250cm9sbGVyJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQtdHlwZXMuZGlyZWN0aXZlJyxcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0uZGlyZWN0aXZlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnZm9ybScsIGZ1bmN0aW9uIGZvcm1EaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gZm9ybUxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnZm9ybScpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cignbm92YWxpZGF0ZScsICcnKTtcblxuICAgICAgICAgICAgICAgIC8vIFVzZSBkaXNhYmxlLWF1dG8tZm9jdXM9XCJ0cnVlXCIgdG8gdHVybiBvZmYgYXV0b21hdGljIGVycm9yIGZvY3VzaW5nXG4gICAgICAgICAgICAgICAgaWYgKCFhdHRycy5kaXNhYmxlQXV0b0ZvY3VzKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uIGZvcm1BdXRvRm9jdXNTdWJtaXRIYW5kbGVyKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGludmFsaWRGaWVsZCA9IGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignLm5nLWludmFsaWQnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGludmFsaWRGaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmFsaWRGaWVsZC5mb2N1cygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXV0by1zZWxlY3QgZXhpc3RpbmcgdGV4dCBmb3IgZmllbGRzIHRoYXQgc3VwcG9ydCBpdCAodGV4dCwgZW1haWwsIHBhc3N3b3JkLCBldGMuKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnZhbGlkRmllbGQuc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmFsaWRGaWVsZC5zZWxlY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0tZmllbGQtZXJyb3IuZGlyZWN0aXZlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnZm9ybUZpZWxkRXJyb3InLCBmdW5jdGlvbiBmb3JtRmllbGRFcnJvckRpcmVjdGl2ZSgkY29tcGlsZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcHJpb3JpdHk6IDEwLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvanMvYmlnY29tbWVyY2UvZm9ybS1maWVsZC1lcnJvci9mb3JtLWZpZWxkLWVycm9yLnRwbC5odG1sJyxcbiAgICAgICAgICAgIHRlcm1pbmFsOiB0cnVlLFxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGZvcm1GaWVsZEVycm9yQ29tcGlsZSh0RWxlbWVudCwgdEF0dHJzKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlIHRyYW5zbGF0ZSBwcm9wZXJ0eSB3aXBlcyBvdXQgb3VyIG5nLW1lc3NhZ2UgbG9naWMgaW4gdGhlIHBvc3QgbGluayBmdW5jdGlvblxuICAgICAgICAgICAgICAgIC8vIFRoZSBwcmlvcml0eSBhbmQgdGVybWluYWwgcHJvcGVydGllcyBhYm92ZSBlbnN1cmUgdGhpcyBjaGVjayBvY2N1cnNcbiAgICAgICAgICAgICAgICBpZiAodEVsZW1lbnQuYXR0cigndHJhbnNsYXRlJykgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAnVGhlIHRyYW5zbGF0ZSBhdHRyaWJ1dGUgY2Fubm90IGJlIHVzZWQgd2l0aCB0aGUgZm9ybS1maWVsZC1lcnJvciBkaXJlY3RpdmUuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1VzZSB0aGUgdHJhbnNsYXRlIGZpbHRlciBpbnN0ZWFkIChleGFtcGxlOiB7eyBcIm15IGVycm9yIG1lc3NhZ2VcIiB8IHRyYW5zbGF0ZSB9fSkuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1ZhbGlkYXRvcjogJyArIHRBdHRycy52YWxpZGF0ZVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHBvc3Q6IGZ1bmN0aW9uIGZvcm1GaWVsZEVycm9yUG9zdExpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycywgdHJhbnNjbHVkZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvcGVydHkgPSBzY29wZS5wcm9wZXJ0eSB8fCBhdHRycy5wcm9wZXJ0eTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNjbHVkZShmdW5jdGlvbiBmb3JtRmllbGRFcnJvclRyYW5zY2x1ZGUoZXJyb3JDbG9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYWJlbEVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQoJzxsYWJlbD4nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5nTWVzc2FnZSBkb2Vzbid0IHBsYXkgd2VsbCB3aXRoIGR5bmFtaWMgbWVzc2FnZSBpbnNlcnRpb24sIHRyYW5zbGF0aW9uLCBvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1lc3NhZ2UgZXhwcmVzc2lvbnMsIHNvIHdlIGJ1aWxkIGl0cyBlbGVtZW50IHVwIGhlcmUgYW5kIGluamVjdCBpdCBpbnRvIHRoZSBET01cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbEVsZW1lbnQuYXR0cignZm9yJywgc2NvcGUucHJvcGVydHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsRWxlbWVudC5hdHRyKCduZy1tZXNzYWdlJywgYXR0cnMudmFsaWRhdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsRWxlbWVudC5hdHRyKCdyb2xlJywgJ2FsZXJ0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxFbGVtZW50LmFkZENsYXNzKCdmb3JtLWlubGluZU1lc3NhZ2UnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBlcnJvciBzcGFuIHNob3VsZCBhbHJlYWR5IGhhdmUgYSB0cmFuc2xhdGlvbiB3YXRjaGVyIG9uIGl0IGJ5IG5vdywgdXNpbmcgYSBmaWx0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbEVsZW1lbnQuYXBwZW5kKGVycm9yQ2xvbmUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hcHBlbmQobGFiZWxFbGVtZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjb21waWxlKGVsZW1lbnQpKHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWZpZWxkLWVycm9yJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWZpZWxkLWVycm9yLmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0tZmllbGQuZGlyZWN0aXZlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnZm9ybUZpZWxkJywgZnVuY3Rpb24gZm9ybUZpZWxkRGlyZWN0aXZlKCRsb2cpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlcXVpcmU6ICdeZm9ybScsXG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgIHNjb3BlOiB0cnVlLFxuICAgICAgICAgICAgbGluazoge1xuICAgICAgICAgICAgICAgIHByZTogZnVuY3Rpb24gZm9ybUZpZWxkTGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSW5oZXJpdGVkIGJ5IHRoZSBmb3JtLWZpZWxkLWVycm9ycyBkaXJlY3RpdmUgdG8gYXZvaWQgcmVkZWNsYXJhdGlvblxuICAgICAgICAgICAgICAgICAgICBzY29wZS5wcm9wZXJ0eSA9IGF0dHJzLnByb3BlcnR5O1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBwb3N0OiBmdW5jdGlvbiBmb3JtRmllbGRMaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycywgZm9ybUN0cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTG9jYXRlcyBhbmQgd2F0Y2hlcyB0aGUgbWF0Y2hpbmcgaW5wdXQvc2VsZWN0L2V0YyAoYmFzZWQgb24gaXRzIG5hbWUgYXR0cmlidXRlKSBpbiB0aGUgcGFyZW50IGZvcm1cbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gYXR0cnMucHJvcGVydHk7XG5cbiAgICAgICAgICAgICAgICAgICAgaW5pdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdmb3JtLWZpZWxkJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIGEgcHJvcGVydHkgd2Fzbid0IHByb3ZpZGVkLCB3ZSBjYW4ndCBkbyBtdWNoIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgaW50ZXJmYWNlIGlmIHRoZSBmb3JtIGlzIHN1Ym1pdHRlZCBvciB0aGUgcHJvcGVydHkncyB2YWxpZGl0eSBzdGF0ZSBjaGFuZ2VzXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goaXNTdWJtaXR0ZWQsIGNoZWNrVmFsaWRpdHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGlzSW52YWxpZCwgY2hlY2tWYWxpZGl0eSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBjaGVja1ZhbGlkaXR5KCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgYSBwcm9wZXJ0eSB3YXMgcHJvdmlkZWQsIGJ1dCBubyBuZy1tb2RlbCB3YXMgZGVmaW5lZCBmb3IgdGhlIGZpZWxkLCB2YWxpZGF0aW9uIHdvbid0IHdvcmtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaGFzTW9kZWwoKSAmJiBpc1N1Ym1pdHRlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRsb2cuaW5mbygnRm9ybSBmaWVsZHMgY29udGFpbmluZyBpbnB1dHMgd2l0aG91dCBhbiBuZy1tb2RlbCBwcm9wZXJ0eSB3aWxsIG5vdCBiZSB2YWxpZGF0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gT25seSBzaG93IGFuIGVycm9yIGlmIHRoZSB1c2VyIGhhcyBhbHJlYWR5IGF0dGVtcHRlZCB0byBzdWJtaXQgdGhlIGZvcm1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudG9nZ2xlQ2xhc3MoJ2Zvcm0tZmllbGQtLWVycm9yJywgaXNTdWJtaXR0ZWQoKSAmJiBpc0ludmFsaWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBoYXNNb2RlbCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAhIWZvcm1DdHJsW3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGlzU3VibWl0dGVkKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1DdHJsLiRzdWJtaXR0ZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBpc0ludmFsaWQoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWhhc01vZGVsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmb3JtQ3RybFtwcm9wZXJ0eV0uJGludmFsaWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1maWVsZCcsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1maWVsZC5kaXJlY3RpdmUnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWZpZWxkLWVycm9yJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1maWVsZC1lcnJvcnMnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWZpZWxkLWVycm9ycy5kaXJlY3RpdmUnLCBbXSlcbiAgICAuZGlyZWN0aXZlKCdmb3JtRmllbGRFcnJvcnMnLCBmdW5jdGlvbiBmb3JtRmllbGRFcnJvcnNEaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgcmVxdWlyZTogJ15mb3JtJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvanMvYmlnY29tbWVyY2UvZm9ybS1maWVsZC1lcnJvcnMvZm9ybS1maWVsZC1lcnJvcnMudHBsLmh0bWwnLFxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgICAgIGxpbms6IHtcbiAgICAgICAgICAgICAgICAvLyBQcmUtbGluayBpcyByZXF1aXJlZCwgYXMgd2UgaGF2ZSB0byBpbmplY3Qgb3VyIHNjb3BlIHByb3BlcnRpZXMgYmVmb3JlIHRoZSBjaGlsZFxuICAgICAgICAgICAgICAgIC8vIGZvcm0tZmllbGQtZXJyb3IgZGlyZWN0aXZlIChhbmQgaXRzIGludGVybmFsIG5nLW1lc3NhZ2UgZGlyZWN0aXZlJ3MpIHBvc3QtbGluayBmdW5jdGlvbnNcbiAgICAgICAgICAgICAgICBwcmU6IGZ1bmN0aW9uIGZvcm1GaWVsZEVycm9yc1ByZUxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBmb3JtQ3RybCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBQcm9wZXJ0eSBuYW1lIGNhbiBiZSBpbmhlcml0ZWQgZnJvbSBwYXJlbnQgc2NvcGUsIHN1Y2ggYXMgZnJvbSB0aGUgZm9ybS1maWVsZCBkaXJlY3RpdmVcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gc2NvcGUucHJvcGVydHkgfHwgYXR0cnMucHJvcGVydHksXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eUZpZWxkID0gZm9ybUN0cmxbcHJvcGVydHldO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEluaGVyaXRlZCBieSBmb3JtLWZpZWxkLWVycm9yIGRpcmVjdGl2ZS4gTGl2ZXMgZGlyZWN0bHkgb24gc2NvcGUgYmVjYXVzZSB0aGUgcmVxdWlyZVxuICAgICAgICAgICAgICAgICAgICAvLyBwcm9wZXJ0eSBkb2VzIG5vdCB3b3JrIHdlbGwgd2l0aCBkaXJlY3RpdmUgY29udHJvbGxlciBpbnN0YW5jZXNcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuZm9ybUN0cmwgPSBmb3JtQ3RybDtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvcGVydHkgPSBwcm9wZXJ0eTtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvcGVydHlGaWVsZCA9IHByb3BlcnR5RmllbGQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0tZmllbGQtZXJyb3JzJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWZpZWxkLWVycm9ycy5kaXJlY3RpdmUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWlucHV0LWNvbG9yLmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdGb3JtSW5wdXRDb2xvckN0cmwnLCBmdW5jdGlvbigkZWxlbWVudCwgJHJvb3RTY29wZSwgJHNjb3BlKSB7XG4gICAgICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xuICAgICAgICBjb25zdCBoZXhDb2xvclJlZ2V4ID0gL14jKChbMC05YS1mQS1GXXsyfSl7M318KFswLTlhLWZBLUZdKXszfSkkLztcblxuICAgICAgICBsZXQgaXNWaXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgY3RybC5ibHVyRXZlbnRIYW5kbGVyID0gYmx1ckV2ZW50SGFuZGxlcjtcbiAgICAgICAgY3RybC5mb2N1c0V2ZW50SGFuZGxlciA9IGZvY3VzRXZlbnRIYW5kbGVyO1xuICAgICAgICBjdHJsLmhpZGVQaWNrZXIgPSBoaWRlUGlja2VyO1xuICAgICAgICBjdHJsLmlzUGlja2VyVmlzaWJsZSA9IGlzUGlja2VyVmlzaWJsZTtcbiAgICAgICAgY3RybC5vbkNoYW5nZSA9IG9uQ2hhbmdlO1xuICAgICAgICBjdHJsLnNldE1vZGVsQ3RybCA9IHNldE1vZGVsQ3RybDtcbiAgICAgICAgY3RybC5zaG93UGlja2VyID0gc2hvd1BpY2tlcjtcbiAgICAgICAgY3RybC51bmlxdWVJZCA9IGdldFVuaXF1ZUlEKCdmb3JtSW5wdXRDb2xvci0nKTtcblxuICAgICAgICAkc2NvcGUuJG9uKCdiY0NvbG9yUGlja2VyT3BlbmVkJywgKGV2ZW50LCB0cmlnZ2VyaW5nRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKCRlbGVtZW50ID09PSB0cmlnZ2VyaW5nRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3RybC5oaWRlUGlja2VyKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIGJsdXJFdmVudEhhbmRsZXIoJGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoJGVsZW1lbnRbMF0uY29udGFpbnMoJGV2ZW50LnJlbGF0ZWRUYXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdHJsLmhpZGVQaWNrZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZvY3VzRXZlbnRIYW5kbGVyKCRldmVudCkge1xuICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjdHJsLnNob3dQaWNrZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFVuaXF1ZUlEKGlkUHJlZml4KSB7XG4gICAgICAgICAgICByZXR1cm4gXy51bmlxdWVJZChpZFByZWZpeCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoaWRlUGlja2VyKCkge1xuICAgICAgICAgICAgaWYgKGN0cmwuaXNQaWNrZXJWaXNpYmxlKCkpIHtcbiAgICAgICAgICAgICAgICBjdHJsLmlzUGlja2VyVmlzaWJsZShmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc1BpY2tlclZpc2libGUoaXNWaXNpYmxlVG9TZXQpIHtcbiAgICAgICAgICAgIGlmIChpc1Zpc2libGVUb1NldCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaXNWaXNpYmxlID0gaXNWaXNpYmxlVG9TZXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBpc1Zpc2libGU7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBvbkNoYW5nZSgpIHtcbiAgICAgICAgICAgIGlmIChoZXhDb2xvclJlZ2V4LnRlc3QoY3RybC5jb2xvcikpIHtcbiAgICAgICAgICAgICAgICBjdHJsLmxhc3RWYWxpZENvbG9yID0gY3RybC5jb2xvcjtcbiAgICAgICAgICAgICAgICBjdHJsLm5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUoY3RybC5jb2xvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgICAgICBjdHJsLmNvbG9yID0gY3RybC5uZ01vZGVsQ3RybC4kdmlld1ZhbHVlO1xuICAgICAgICAgICAgY3RybC5sYXN0VmFsaWRDb2xvciA9IGN0cmwuY29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRNb2RlbEN0cmwobmdNb2RlbEN0cmwpIHtcbiAgICAgICAgICAgIGN0cmwubmdNb2RlbEN0cmwgPSBuZ01vZGVsQ3RybDtcbiAgICAgICAgICAgIGN0cmwubmdNb2RlbEN0cmwuJHJlbmRlciA9IHJlbmRlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNob3dQaWNrZXIoKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2JjQ29sb3JQaWNrZXJPcGVuZWQnLCAkZWxlbWVudCk7XG4gICAgICAgICAgICBjdHJsLmlzUGlja2VyVmlzaWJsZSh0cnVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0taW5wdXQtY29sb3IuZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWlucHV0LWNvbG9yLmNvbnRyb2xsZXInLFxuXSlcblxuICAgIC5kaXJlY3RpdmUoJ2Zvcm1JbnB1dENvbG9yJywgZnVuY3Rpb24gZm9ybUlucHV0Q29sb3JEaXJlY3RpdmUoJGRvY3VtZW50KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0Zvcm1JbnB1dENvbG9yQ3RybCcsXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdmb3JtSW5wdXRDb2xvckN0cmwnLFxuICAgICAgICAgICAgcmVxdWlyZTogWydmb3JtSW5wdXRDb2xvcicsICdebmdNb2RlbCddLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgbGFiZWxUZXh0OiAnPScsXG4gICAgICAgICAgICAgICAgcGFsZXR0ZTogJz0nLFxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyVGV4dDogJz0nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL2JpZ2NvbW1lcmNlL2Zvcm0taW5wdXQtY29sb3IvZm9ybS1pbnB1dC1jb2xvci50cGwuaHRtbCcsXG5cbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGZvcm1JbnB1dENvbG9yRGlyZWN0aXZlQ29tcGlsZSh0RWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRFbGVtZW50LmFkZENsYXNzKCdmb3JtLWlucHV0Q29sb3InKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBmb3JtSW5wdXRDb2xvckRpcmVjdGl2ZUxpbmsoJHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3RybCA9IGN0cmxzWzBdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZ01vZGVsQ3RybCA9IGN0cmxzWzFdO1xuXG4gICAgICAgICAgICAgICAgICAgIGN0cmwuc2V0TW9kZWxDdHJsKG5nTW9kZWxDdHJsKTtcblxuICAgICAgICAgICAgICAgICAgICAkZG9jdW1lbnQub24oJ2tleWRvd24nLCBrZXlkb3duRXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICAgICAgJGRvY3VtZW50Lm9uKCdtb3VzZWRvd24nLCBtb3VzZURvd25FdmVudEhhbmRsZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kb24oJyRkZXN0cm95JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGRvY3VtZW50Lm9mZignbW91c2Vkb3duJywgbW91c2VEb3duRXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRkb2N1bWVudC5vZmYoJ2tleWRvd24nLCBrZXlkb3duRXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24ga2V5ZG93bkV2ZW50SGFuZGxlciAoJGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJGV2ZW50LndoaWNoID09PSAyNykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHJsLmhpZGVQaWNrZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIG1vdXNlRG93bkV2ZW50SGFuZGxlcigkZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50WzBdLmNvbnRhaW5zKCRldmVudC50YXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RybC5oaWRlUGlja2VyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0taW5wdXQtY29sb3InLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0taW5wdXQtY29sb3IuZGlyZWN0aXZlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuZ2xvYmFsLW1lc3NhZ2UuZGlyZWN0aXZlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnZ2xvYmFsTWVzc2FnZScsIGZ1bmN0aW9uIGdsb2JhbE1lc3NhZ2VEaXJlY3RpdmUoJHRpbWVvdXQpIHtcbiAgICAgICAgdmFyIFRJTUVPVVQgPSA4MDAwO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvanMvYmlnY29tbWVyY2UvZ2xvYmFsLW1lc3NhZ2UvZ2xvYmFsLW1lc3NhZ2UudHBsLmh0bWwnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdAJyxcbiAgICAgICAgICAgICAgICBhY3Rpb25DYWxsYmFjazogJyY/JyxcbiAgICAgICAgICAgICAgICBkaXNtaXNzQ2FsbGJhY2s6ICcmPydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgICAgICAgICAgbGluazogbGlua1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICB2YXIgcHJvbWlzZSA9IHN0YXJ0VGltZXIoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gTm8gbG9uZ2VyIG5lZWRlZCB3aXRoIDEuNS4gU2VlIGFuZ3VsYXIvYW5ndWxhci5qcyM2NDA0XG4gICAgICAgICAgICBzY29wZS5hY3Rpb25DYWxsYmFjayA9IGF0dHJzLmFjdGlvbkNhbGxiYWNrID8gc2NvcGUuYWN0aW9uQ2FsbGJhY2sgOiBmYWxzZTtcbiAgICAgICAgICAgIHNjb3BlLmRpc21pc3NDYWxsYmFjayA9IGF0dHJzLmRpc21pc3NDYWxsYmFjayA/IHNjb3BlLmRpc21pc3NDYWxsYmFjayA6IGZhbHNlO1xuXG4gICAgICAgICAgICBpbml0KCk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5vbignbW91c2VlbnRlciAkZGVzdHJveScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkdGltZW91dC5jYW5jZWwocHJvbWlzZSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBlbGVtZW50Lm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UgPSBzdGFydFRpbWVyKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHN0YXJ0VGltZXIoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICR0aW1lb3V0KGRpc21pc3MsIFRJTUVPVVQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBkaXNtaXNzKCkge1xuICAgICAgICAgICAgICAgIGlmIChzY29wZS5kaXNtaXNzQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuZGlzbWlzc0NhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTsiLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuZ2xvYmFsLW1lc3NhZ2UnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmdsb2JhbC1tZXNzYWdlLmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmh0bWw1TW9kZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuaHRtbDVNb2RlLnNlcnZpY2UnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5odG1sNU1vZGUuc2VydmljZScsIFtdKVxuICAgIC5wcm92aWRlcignaHRtbDVNb2RlJywgZnVuY3Rpb24gaHRtbDVNb2RlUHJvdmlkZXIoJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgICAgICAgdGhpcy4kZ2V0ID0gZnVuY3Rpb24gaHRtbDVNb2RlU2VydmljZSgpIHtcbiAgICAgICAgICAgIHJldHVybiAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoKTtcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jaGVja2JveC1saXN0LmNvbnRyb2xsZXInLCBbXSlcbiAgICAuY29udHJvbGxlcignQ2hlY2tib3hMaXN0Q3RybCcsIGZ1bmN0aW9uIENoZWNrYm94TGlzdEN0cmwoJGF0dHJzLCAkZWxlbWVudCwgJGxvZywgJHBhcnNlLCAkc2NvcGUpIHtcbiAgICAgICAgdmFyIGN0cmwgPSB0aGlzLFxuICAgICAgICAgICAgZmFsc2VWYWx1ZSA9ICRwYXJzZSgkYXR0cnMubmdGYWxzZVZhbHVlKShjdHJsKSB8fCBmYWxzZSxcbiAgICAgICAgICAgIHRydWVWYWx1ZSA9ICRwYXJzZSgkYXR0cnMubmdUcnVlVmFsdWUpKGN0cmwpIHx8IHRydWUsXG4gICAgICAgICAgICBuZ01vZGVsID0gJGVsZW1lbnQuY29udHJvbGxlcignbmdNb2RlbCcpO1xuXG4gICAgICAgIGluaXQoKTtcblxuICAgICAgICAvLyBHZXR0ZXJzXG4gICAgICAgIGZ1bmN0aW9uIGdldE1vZGVsVmFsdWUoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmdNb2RlbC4kbW9kZWxWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFZhbHVlKCkge1xuICAgICAgICAgICAgcmV0dXJuIGN0cmwudmFsdWUgfHwgY3RybC5uZ1ZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0U2VsZWN0ZWRWYWx1ZXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gY3RybC5zZWxlY3RlZFZhbHVlcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldHRlcnNcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlTW9kZWxWYWx1ZShtb2RlbFZhbHVlKSB7XG4gICAgICAgICAgICBuZ01vZGVsLiRzZXRWaWV3VmFsdWUobW9kZWxWYWx1ZSk7XG4gICAgICAgICAgICBuZ01vZGVsLiRjb21taXRWaWV3VmFsdWUoKTtcbiAgICAgICAgICAgIG5nTW9kZWwuJHJlbmRlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlU2VsZWN0ZWRWYWx1ZXMobW9kZWxWYWx1ZSkge1xuICAgICAgICAgICAgaWYgKG1vZGVsVmFsdWUgPT09IHRydWVWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGFkZFRvU2VsZWN0ZWRWYWx1ZXMoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobW9kZWxWYWx1ZSA9PT0gZmFsc2VWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHJlbW92ZUZyb21TZWxlY3RlZFZhbHVlcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYWRkVG9TZWxlY3RlZFZhbHVlcygpIHtcbiAgICAgICAgICAgIHZhciBpc0luY2x1ZGVkID0gXy5pbmNsdWRlKGN0cmwuc2VsZWN0ZWRWYWx1ZXMsIGdldFZhbHVlKCkpO1xuXG4gICAgICAgICAgICBpZiAoIWlzSW5jbHVkZWQpIHtcbiAgICAgICAgICAgICAgICBjdHJsLnNlbGVjdGVkVmFsdWVzLnB1c2goZ2V0VmFsdWUoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZW1vdmVGcm9tU2VsZWN0ZWRWYWx1ZXMoKSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBfLmluZGV4T2YoY3RybC5zZWxlY3RlZFZhbHVlcywgZ2V0VmFsdWUoKSk7XG5cbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBjdHJsLnNlbGVjdGVkVmFsdWVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXYXRjaGVyc1xuICAgICAgICBmdW5jdGlvbiBtb2RlbFZhbHVlV2F0Y2gobW9kZWxWYWx1ZSwgb2xkTW9kZWxWYWx1ZSkge1xuICAgICAgICAgICAgdmFyIG9sZFNlbGVjdGVkVmFsdWVzLFxuICAgICAgICAgICAgICAgIHNlbGVjdGVkVmFsdWVzQ2hhbmdlZDtcblxuICAgICAgICAgICAgLy8gV2hlbiBuZ01vZGVsIHZhbHVlIGNoYW5nZXNcbiAgICAgICAgICAgIGlmIChfLmlzVW5kZWZpbmVkKG1vZGVsVmFsdWUpIHx8IG1vZGVsVmFsdWUgPT09IG9sZE1vZGVsVmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFJldGFpbiBhIHNoYWxsb3cgY29weSBvZiBzZWxlY3RlZFZhbHVlcyBiZWZvcmUgdXBkYXRlXG4gICAgICAgICAgICBvbGRTZWxlY3RlZFZhbHVlcyA9IGN0cmwuc2VsZWN0ZWRWYWx1ZXMuc2xpY2UoKTtcblxuICAgICAgICAgICAgLy8gVXBkYXRlIHNlbGVjdGVkVmFsdWVzXG4gICAgICAgICAgICB1cGRhdGVTZWxlY3RlZFZhbHVlcyhtb2RlbFZhbHVlKTtcblxuICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIGlmIHNlbGVjdGVkVmFsdWVzIGFycmF5IGhhcyBjaGFuZ2VkXG4gICAgICAgICAgICBzZWxlY3RlZFZhbHVlc0NoYW5nZWQgPSAhIV8ueG9yKGN0cmwuc2VsZWN0ZWRWYWx1ZXMsIG9sZFNlbGVjdGVkVmFsdWVzKS5sZW5ndGg7XG5cbiAgICAgICAgICAgIC8vIElmIGNoYW5nZWQsIGV2b2tlIGRlbGVnYXRlIG1ldGhvZCAoaWYgZGVmaW5lZClcbiAgICAgICAgICAgIGlmIChjdHJsLm9uQ2hhbmdlICYmIHNlbGVjdGVkVmFsdWVzQ2hhbmdlZCkge1xuICAgICAgICAgICAgICAgIGN0cmwub25DaGFuZ2Uoe1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZFZhbHVlczogY3RybC5zZWxlY3RlZFZhbHVlcyxcbiAgICAgICAgICAgICAgICAgICAgb2xkU2VsZWN0ZWRWYWx1ZXM6IG9sZFNlbGVjdGVkVmFsdWVzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZWxlY3RlZFZhbHVlc1dhdGNoKHNlbGVjdGVkVmFsdWVzKSB7XG4gICAgICAgICAgICAvLyBXaGVuIHNlbGVjdGVkVmFsdWVzIGNvbGxlY3Rpb24gY2hhbmdlc1xuICAgICAgICAgICAgdmFyIGlzSW5jbHVkZWQgPSBfLmluY2x1ZGUoc2VsZWN0ZWRWYWx1ZXMsIGdldFZhbHVlKCkpLFxuICAgICAgICAgICAgICAgIG1vZGVsVmFsdWUgPSBnZXRNb2RlbFZhbHVlKCk7XG5cbiAgICAgICAgICAgIGlmIChpc0luY2x1ZGVkICYmIG1vZGVsVmFsdWUgIT09IHRydWVWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHVwZGF0ZU1vZGVsVmFsdWUodHJ1ZVZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWlzSW5jbHVkZWQgJiYgbW9kZWxWYWx1ZSAhPT0gZmFsc2VWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHVwZGF0ZU1vZGVsVmFsdWUoZmFsc2VWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbml0aWFsaXplclxuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICAgaWYgKCRhdHRycy50eXBlICE9PSAnY2hlY2tib3gnKSB7XG4gICAgICAgICAgICAgICAgJGxvZy5lcnJvcignY2hlY2tib3gtbGlzdCBkaXJlY3RpdmU6IGVsZW1lbnQgbXVzdCBiZSA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCI+Jyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goZ2V0TW9kZWxWYWx1ZSwgbW9kZWxWYWx1ZVdhdGNoKTtcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2hDb2xsZWN0aW9uKGdldFNlbGVjdGVkVmFsdWVzLCBzZWxlY3RlZFZhbHVlc1dhdGNoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNoZWNrYm94LWxpc3QuZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jaGVja2JveC1saXN0LmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLyoqXG4gICAgICogQSBkaXJlY3RpdmUgZm9yIGNvbGxhdGluZyB2YWx1ZXMgZnJvbSBhbiBhcnJheSBvZiBjaGVja2JveGVzLlxuICAgICAqXG4gICAgICogQHJlcXVpcmUgbmdNb2RlbFxuICAgICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZ3xudW1iZXJ8T2JqZWN0Pn0gY2hlY2tib3hMaXN0IC0gQXJyYXkgdG8gaG9sZCBzZWxlY3RlZCB2YWx1ZXNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIC0gVmFsdWUgdG8gYWRkIHRvIGNoZWNrYm94TGlzdFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oc2VsZWN0ZWRWYWx1ZXMsIG9sZFNlbGVjdGVkVmFsdWVzfSBbY2hlY2tib3hMaXN0Q2hhbmdlXSAtIE9wdGlvbmFsIG9uQ2hhbmdlIGNhbGxiYWNrXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZTpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGRpdiBuZy1yZXBlYXQ9XCJvcHRpb24gaW4gb3B0aW9uc1wiPlxuICAgICAqICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgXG4gICAgICogICAgICAgICBuYW1lPVwib3B0aW9ue3sgb3B0aW9uLmlkIH19XCJcbiAgICAgKiAgICAgICAgIHZhbHVlPVwib3B0aW9uLmlkXCIgXG4gICAgICogICAgICAgICBjaGVja2JveC1saXN0PVwic2VsZWN0ZWRWYWx1ZXNcIiBcbiAgICAgKiAgICAgICAgIGNoZWNrYm94LWxpc3QtY2hhbmdlPVwib25DaGFuZ2Uoc2VsZWN0ZWRWYWx1ZXMpXCIgXG4gICAgICogICAgICAgICBuZy1tb2RlbD1cIm9wdGlvbi5jaGVja2VkXCJcbiAgICAgKiAgICAgLz5cbiAgICAgKiA8L2Rpdj5cbiAgICAgKiBgYGBcbiAgICAgKiBcbiAgICAgKiBgYGBqc1xuICAgICAqIHNjb3BlLnNlbGVjdGVkVmFsdWVzID0gW107XG4gICAgICogc2NvcGUub3B0aW9ucyA9IFtcbiAgICAgKiAgICAge1xuICAgICAqICAgICAgICAgaWQ6IDEsXG4gICAgICogICAgICAgICBsYWJlbDogJ09wdGlvbiAxJ1xuICAgICAqICAgICB9LFxuICAgICAqICAgICB7XG4gICAgICogICAgICAgICBpZDogMixcbiAgICAgKiAgICAgICAgIGxhYmVsOiAnT3B0aW9uIDInXG4gICAgICogICAgIH0sXG4gICAgICogICAgIHtcbiAgICAgKiAgICAgICAgIGlkOiAzLFxuICAgICAqICAgICAgICAgbGFiZWw6ICdPcHRpb24gMydcbiAgICAgKiAgICAgfVxuICAgICAqIF07XG4gICAgICogXG4gICAgICogc2NvcGUub25DaGFuZ2UgPSBmdW5jdGlvbiBvbkNoYW5nZShzZWxlY3RlZFZhbHVlcykge1xuICAgICAqICAgICBjb25zb2xlLmxvZyhzZWxlY3RlZFZhbHVlcyk7XG4gICAgICogfTtcbiAgICAgKiBgYGBcbiAgICAgKiBcbiAgICAgKiBXaGVuIG9wdGlvbnNbMF0gYW5kIG9wdGlvbnNbMV0gYXJlIGNoZWNrZWQsIHNlbGVjdGVkVmFsdWVzIHNob3VsZCBiZSBbMSwgMl1cbiAgICAgKiBhbmQgb25DaGFuZ2Ugd2lsbCBiZSBldm9rZWQuIFRoaXMgZGlyZWN0aXZlIGFsc28gd29ya3Mgd2l0aCBhbiBhcnJheSBvZiBwcmltaXRpdmUgdmFsdWVzLlxuICAgICAqIGkuZS46IHNjb3BlLm9wdGlvbnMgPSBbXCJhXCIsIFwiYlwiLCBcImNcIl0uXG4gICAgICovXG5cbiAgICAuZGlyZWN0aXZlKCdjaGVja2JveExpc3QnLCBmdW5jdGlvbiBjaGVja2JveExpc3REaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0NoZWNrYm94TGlzdEN0cmwnLFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY2hlY2tib3hMaXN0Q3RybCcsXG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBvbkNoYW5nZTogJyZjaGVja2JveExpc3RDaGFuZ2UnLFxuICAgICAgICAgICAgICAgIHNlbGVjdGVkVmFsdWVzOiAnPWNoZWNrYm94TGlzdCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6ICc9JyxcbiAgICAgICAgICAgICAgICBuZ1ZhbHVlOiAnPSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jaGVja2JveC1saXN0JywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jaGVja2JveC1saXN0LmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmljb24uY29udHJvbGxlcicsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuaHRtbDVNb2RlJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuaWNvbi5zdmdSb290UGF0aCdcbl0pXG4gICAgLmNvbnRyb2xsZXIoJ0ljb25DdHJsJywgZnVuY3Rpb24gaWNvbkRpcmVjdGl2ZUNvbnRyb2xsZXIoJGh0dHAsICRsb2NhdGlvbiwgJHRlbXBsYXRlQ2FjaGUsIGh0bWw1TW9kZSwgc3ZnUm9vdFBhdGgpIHtcbiAgICAgICAgY29uc3QgYWJzVXJsID0gJGxvY2F0aW9uLmFic1VybCgpO1xuICAgICAgICBjb25zdCBjdHJsID0gdGhpcztcblxuICAgICAgICBjdHJsLmNoYW5nZVVybHNUb0Fic29sdXRlID0gY2hhbmdlVXJsc1RvQWJzb2x1dGU7XG4gICAgICAgIGN0cmwuY2hhbmdlWGxpbmtzVG9BYnNvbHV0ZSA9IGNoYW5nZVhsaW5rc1RvQWJzb2x1dGU7XG4gICAgICAgIGN0cmwudXBkYXRlR2x5cGggPSB1cGRhdGVHbHlwaDtcblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVHbHlwaChnbHlwaCkge1xuICAgICAgICAgICAgY29uc3QgZnVsbFN2Z1BhdGggPSBzdmdSb290UGF0aCArIGdseXBoICsgJy5zdmcnO1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGZ1bGxTdmdQYXRoLCB7IGNhY2hlOiAkdGVtcGxhdGVDYWNoZSB9KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIGljb25EaXJlY3RpdmVIdHRwU3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc3RyaW5naWZpZWRFbGVtZW50ID0gcmVzcG9uc2UuZGF0YTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaHRtbDVNb2RlLmVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZ2lmaWVkRWxlbWVudCA9IGNoYW5nZVVybHNUb0Fic29sdXRlKHN0cmluZ2lmaWVkRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmdpZmllZEVsZW1lbnQgPSBjaGFuZ2VYbGlua3NUb0Fic29sdXRlKHN0cmluZ2lmaWVkRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyaW5naWZpZWRFbGVtZW50O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2hhbmdlVXJsc1RvQWJzb2x1dGUoc3RyaW5naWZpZWRFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyaW5naWZpZWRFbGVtZW50LnJlcGxhY2UoL3VybFxcKChbJ1wiXT8pIy9naSwgJ3VybCgkMScgKyBhYnNVcmwgKyAnIycpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2hhbmdlWGxpbmtzVG9BYnNvbHV0ZShzdHJpbmdpZmllZEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmdpZmllZEVsZW1lbnQucmVwbGFjZSgveGxpbms6aHJlZj0oWydcIl0/KSMvZ2ksICd4bGluazpocmVmPSQxJyArIGFic1VybCArICcjJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiIsIi8qKlxuICogQGRlc2NyaXB0aW9uIEljb24gZGlyZWN0aXZlIHVzZWQgdG8gbG9hZCBhbiBpbmxpbmUgc3ZnIGljb24sIHNpbWxpYXIgdG8gaWNvblxuICogICAgICAgICAgICAgIGZvbnQgbWV0aG9kcyBvZiBwYXN0IDxpIGNsYXNzPVwiaWNvbi1mb28tYmFyXCI+PC9pPlxuICogQGV4YW1wbGVcbiAqIDxpY29uIGdseXBoPVwiaWMtYWRkLWNpcmNsZVwiPjwvaWNvbj5cbiAqL1xuYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmljb24uZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5pY29uLmNvbnRyb2xsZXInXG5dKVxuICAgIC5kaXJlY3RpdmUoJ2ljb24nLCBmdW5jdGlvbiBpY29uRGlyZWN0aXZlKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdJY29uQ3RybCBhcyBpY29uQ3RybCcsXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBnbHlwaDogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gaWNvbkRpcmVjdGl2ZUNvbXBpbGUodEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0RWxlbWVudC5hZGRDbGFzcygnaWNvbicpO1xuICAgICAgICAgICAgICAgIHRFbGVtZW50LmF0dHIoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gaWNvbkRpcmVjdGl2ZUxpbmsoJHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybCkge1xuICAgICAgICAgICAgICAgICAgICBhdHRycy4kb2JzZXJ2ZSgnZ2x5cGgnLCBmdW5jdGlvbiBpY29uRGlyZWN0aXZlTGlua1dhdGNoKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHJsLnVwZGF0ZUdseXBoKG5ld1ZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIGljb25VcGRhdGVHbHlwaFRoZW4oc3ZnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuaHRtbChzdmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmljb24nLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmljb24uZGlyZWN0aXZlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuaWNvbi5zdmdSb290UGF0aCcsIFtdKVxuICAgIC5wcm92aWRlcignc3ZnUm9vdFBhdGgnLCBmdW5jdGlvbiBzdmdSb290UGF0aFByb3ZpZGVyQ29uZmlnKCkge1xuICAgICAgICB0aGlzLnNldFJvb3RQYXRoID0gc2V0Um9vdFBhdGg7XG4gICAgICAgIHRoaXMuJGdldCA9IGZ1bmN0aW9uIHN2Z1Jvb3RQYXRoUHJvdmlkZXJHZXQoJGxvZykge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3ZnUm9vdFBhdGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICRsb2cuZXJyb3IoJ05vIHN2Z1Jvb3RQYXRoIHByb3ZpZGVkLiBQbGVhc2UgY29uZmlndXJlIHRoaXMgdXNpbmcgdGhlIHN2Z1Jvb3RQYXRoUHJvdmlkZXInKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ZnUm9vdFBhdGg7XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0Um9vdFBhdGgobmV3Um9vdFBhdGgpIHtcbiAgICAgICAgICAgIHRoaXMuc3ZnUm9vdFBhdGggPSBuZXdSb290UGF0aDtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXNlcnZlci10YWJsZS5jb250cm9sbGVyJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUuc2VydmljZSdcbl0pXG5cbiAgICAuY29udHJvbGxlcignQmNTZXJ2ZXJUYWJsZUN0cmwnLCBmdW5jdGlvbiBCY1NlcnZlclRhYmxlQ3RybCgkYXR0cnMsICRsb2csICRwYXJzZSwgJHNjb3BlLCBCY1NlcnZlclRhYmxlKSB7XG4gICAgICAgIHZhciBjdHJsID0gdGhpcyxcbiAgICAgICAgICAgIGJjU2VydmVyVGFibGVQcm90b3R5cGUgPSBCY1NlcnZlclRhYmxlLnByb3RvdHlwZTtcblxuICAgICAgICAvLyBDYWxsIHRoZSBCY1NlcnZlclRhYmxlIGNvbnN0cnVjdG9yIG9uIHRoZSBjb250cm9sbGVyXG4gICAgICAgIC8vIGluIG9yZGVyIHRvIHNldCBhbGwgdGhlIGNvbnRyb2xsZXIgcHJvcGVydGllcyBkaXJlY3RseS5cbiAgICAgICAgLy8gVGhpcyBpcyBoZXJlIGZvciBiYWNrd2FyZHMgY29tcGF0YWJpbGl0eSBwdXJwb3Nlcy5cbiAgICAgICAgQmNTZXJ2ZXJUYWJsZS5jYWxsKGN0cmwsIG51bGwsICgkcGFyc2UoJGF0dHJzLnRhYmxlQ29uZmlnKSgkc2NvcGUpKSk7XG5cbiAgICAgICAgLy8gY29udHJvbGxlciBmdW5jdGlvbnNcbiAgICAgICAgY3RybC5jcmVhdGVQYXJhbXNPYmplY3QgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLmNyZWF0ZVBhcmFtc09iamVjdDtcbiAgICAgICAgY3RybC5kZXNlbGVjdEFsbFJvd3MgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLmRlc2VsZWN0QWxsUm93cztcbiAgICAgICAgY3RybC5mZXRjaFJlc291cmNlID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS5mZXRjaFJlc291cmNlO1xuICAgICAgICBjdHJsLmdldFNlbGVjdGVkUm93cyA9IGJjU2VydmVyVGFibGVQcm90b3R5cGUuZ2V0U2VsZWN0ZWRSb3dzO1xuICAgICAgICBjdHJsLmluaXQgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLmluaXQ7XG4gICAgICAgIGN0cmwuaXNSb3dTZWxlY3RlZCA9IGJjU2VydmVyVGFibGVQcm90b3R5cGUuaXNSb3dTZWxlY3RlZDtcbiAgICAgICAgY3RybC5sb2FkU3RhdGVQYXJhbXMgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLmxvYWRTdGF0ZVBhcmFtcztcbiAgICAgICAgY3RybC5zZWxlY3RBbGxSb3dzID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS5zZWxlY3RBbGxSb3dzO1xuICAgICAgICBjdHJsLnNldFBhZ2luYXRpb25WYWx1ZXMgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLnNldFBhZ2luYXRpb25WYWx1ZXM7XG4gICAgICAgIGN0cmwuc2V0Um93cyA9IGJjU2VydmVyVGFibGVQcm90b3R5cGUuc2V0Um93cztcbiAgICAgICAgY3RybC5zZXRTZWxlY3Rpb25Gb3JBbGxSb3dzID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS5zZXRTZWxlY3Rpb25Gb3JBbGxSb3dzO1xuICAgICAgICBjdHJsLnNldFNvcnRpbmdWYWx1ZXMgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLnNldFNvcnRpbmdWYWx1ZXM7XG4gICAgICAgIGN0cmwudXBkYXRlUGFnZSA9IF8uYmluZChiY1NlcnZlclRhYmxlUHJvdG90eXBlLnVwZGF0ZVBhZ2UsIGN0cmwpO1xuICAgICAgICBjdHJsLnVwZGF0ZVNvcnQgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLnVwZGF0ZVNvcnQ7XG4gICAgICAgIGN0cmwudXBkYXRlVGFibGUgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLnVwZGF0ZVRhYmxlO1xuICAgICAgICBjdHJsLnZhbGlkYXRlUmVzb3VyY2UgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLnZhbGlkYXRlUmVzb3VyY2U7XG5cbiAgICAgICAgaW5pdCgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICB2YXIgcmVzb3VyY2VDYWxsYmFjaztcblxuICAgICAgICAgICAgcmVzb3VyY2VDYWxsYmFjayA9ICRwYXJzZSgkYXR0cnMucmVzb3VyY2VDYWxsYmFjaykoJHNjb3BlKTtcbiAgICAgICAgICAgIGlmICghXy5pc0Z1bmN0aW9uKHJlc291cmNlQ2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgJGxvZy5lcnJvcignYmMtc2VydmVyLXRhYmxlIGRpcmVjdGl2ZTogcmVzb3VyY2UtY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN0cmwucmVzb3VyY2VDYWxsYmFjayA9IHJlc291cmNlQ2FsbGJhY2s7XG5cbiAgICAgICAgICAgIGN0cmwuaW5pdCgpO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtc2VydmVyLXRhYmxlLmRpcmVjdGl2ZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtc2VydmVyLXRhYmxlLmNvbnRyb2xsZXInLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUuc29ydC1ieS5kaXJlY3RpdmUnLFxuICAgICd1aS5yb3V0ZXInXG5dKVxuICAgIC8qKlxuICAgICAqIFRoZSBiYy1zZXJ2ZXItdGFibGUgZGlyZWN0aXZlIGNyZWF0ZXMgYSBkYXRhIHRhYmxlIHRoYXQgaGFuZGxlc1xuICAgICAqIHNlcnZlciBzaWRlIHBhZ2luYXRpb24sIHNvcnRpbmcsIGFuZCBmaWx0ZXJpbmcuIEl0IGV4cG9zZXMgYSBmZXcgc2NvcGUgdmFyaWFibGVzLFxuICAgICAqIHRoYXQgY2FuIGJlIHVzZWQgdG8gZGlzcGxheSB0aGUgdGFibGUgY29udGVudCB3aXRoIGN1c3RvbSBtYXJrdXAgKHNlZSBleGFtcGxlXG4gICAgICogaW4gdGhlIHBhdHRlcm4gbGFiIGZvciBhbiBhY3R1YWwgaW1wbGVtZW50YXRpb24gb2YgdGhlIGJjLXNlcnZlci10YWJsZSkuXG4gICAgICpcbiAgICAgKiBUaGUgZm9sbG93aW5nIGF0dHJpYnV0ZXMgY2FuIGJlIHBhc3NlZCBpbiBvcmRlciB0byBjb25maWd1cmUgdGhlIGJjLXNlcnZlci10YWJsZTpcbiAgICAgKiAtIHJlc291cmNlLWNhbGxiYWNrIChyZXF1aXJlZClcbiAgICAgKiAtIHRhYmxlQ29uZmlnIChvcHRpb25hbClcbiAgICAgKlxuICAgICAqIC0gcmVzb3VyY2UtY2FsbGJhY2sgLSBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2Ugd2hpY2ggaXMgcmVzb3ZsZWRcbiAgICAgKiB3aXRoIGFuIG9iamVjdCBvZiB0aGUgZm9sbG93aW5nIGZvcm1hdDpcbiAgICAgKiAgICAgIHtcbiAgICAgKiAgICAgICAgICByb3dzOiBBcnJheSxcbiAgICAgKiAgICAgICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICogICAgICAgICAgICAgIHBhZ2U6IE51bWJlcixcbiAgICAgKiAgICAgICAgICAgICAgbGltaXQ6IE51bWJlcixcbiAgICAgKiAgICAgICAgICAgICAgdG90YWw6IE51bWJlclxuICAgICAqICAgICAgICAgIH1cbiAgICAgKiAgICAgIH1cbiAgICAgKlxuICAgICAqIFRoaXMgZGlyZWN0aXZlIGV4cG9zZXMgYSBzY29wZSB2YXJpYWJsZSBjYWxsZWQgYmNTZXJ2ZXJUYWJsZSB0aGF0XG4gICAgICogY2FuIGJlIHVzZWQgdG8gZGlzcGxheSBjb250ZW50LCBhbmQgaW1wbGVtZW50IGFkZGl0aW9uYWwgZnVuY3Rpb25hbGl0eVxuICAgICAqIHRvIHRoZSB0YWJsZSAoc3VjaCBhcyBwYWdpbmF0aW9uLCBzb3J0aW5nLCBhbmQgc2VsZWN0aW9uIGxvZ2ljKS5cbiAgICAgKlxuICAgICAqIC0gYmNTZXJ2ZXJUYWJsZS5yb3dzXG4gICAgICogICAgICAtIENhbiBiZSB1c2VkIHdpdGggbmctcmVwZWF0IHRvIGRpc3BsYXkgdGhlIGRhdGFcbiAgICAgKiAtIGJjU2VydmVyVGFibGUuZmlsdGVyc1xuICAgICAqICAgICAgLSBDYW4gYmUgdXNlZCB0byBjaGFuZ2UvdXBkYXRlIGZpbHRlcnMuIFRoZXNlIGZpbHRlcnMgbXVzdCBhcHBlYXJcbiAgICAgKiAgICAgICAgaW4gdGhlIHN0YXRlIGRlZmluaXRpb24gaW4gb3JkZXIgdG8gd29yayBjb3JyZWN0bHkuXG4gICAgICogLSBiY1NlcnZlclRhYmxlLnVwZGF0ZVRhYmxlKClcbiAgICAgKiAgICAgIC0gUGVyZm9ybSBhIHN0YXRlIHRyYW5zaXN0aW9uIHdpdGggdGhlIGN1cnJlbnQgdGFibGUgaW5mb1xuICAgICAqIC0gYmNTZXJ2ZXJUYWJsZS5wYWdpbmF0aW9uXG4gICAgICogICAgICAtIGV4cG9zZXMgcGFnZSwgbGltaXQsIGFuZCB0b3RhbFxuICAgICAqIC0gYmNTZXJ2ZXJUYWJsZS5zZXRQYWdpbmF0aW9uVmFsdWVzKHBhZ2luYXRpb24pXG4gICAgICogICAgICAtIGNvbnZlbmllbmNlIG1ldGhvZCBmb3Igc2V0dGluZyBwYWdpbmF0aW9uIHZhbHVlcyBhdCBvbmNlLlxuICAgICAqXG4gICAgICogLSBiY1NlcnZlclRhYmxlLnNlbGVjdGVkUm93c1xuICAgICAqICAgICAgLSBhbiBtYXAgb2JqZWN0IHdpdGggdW5pcXVlIGlkJ3MgYXMga2V5cyBhbmQgYm9vbGVhbiB2YWx1ZXMgYXMgdGhlIHNlbGVjdGVkIHN0YXRlXG4gICAgICogLSBiY1NlcnZlclRhYmxlLmFsbFNlbGVjdGVkXG4gICAgICogICAgICAtIGEgYm9vbGVhbiB2YWx1ZSB1c2VkIHRvIGRldGVybWluZSBpZiBhbGwgcm93cyB3ZXJlIHNlbGVjdGVkIG9yIGNsZWFyZWRcbiAgICAgKiAtIGJjU2VydmVyVGFibGUuc2VsZWN0QWxsUm93cygpXG4gICAgICogICAgICAtIHRvZ2dsZSBhbGwgcm93cyBzZWxlY3Rpb24gc3RhdGVcbiAgICAgKiAtIGJjU2VydmVyVGFibGUuaXNSb3dTZWxlY3RlZChyb3cpXG4gICAgICogICAgICAtIGhlbHBlciBmdW5jdGlvbiB0byBkZXRlcm1pbmUgaWYgYSByb3cgaXMgc2VsZWN0ZWRcbiAgICAgKiAtIGJjU2VydmVyVGFibGUuZ2V0U2VsZWN0ZWRSb3dzKClcbiAgICAgKiAgICAgIC0gZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGFycmF5IG9mIHJvdyBvYmplY3RzIHRoYXQgYXJlIGN1cnJlbnRseSBzZWxlY3RlZFxuICAgICAqXG4gICAgICovXG4gICAgLmRpcmVjdGl2ZSgnYmNTZXJ2ZXJUYWJsZScsIGZ1bmN0aW9uIGJjU2VydmVyVGFibGVEaXJlY3RpdmUoJHBhcnNlKSB7XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCY1NlcnZlclRhYmxlQ3RybCBhcyBiY1NlcnZlclRhYmxlJyxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIGJjU2VydmVyVGFibGVMaW5rKCRzY29wZSwgZWxlbWVudCwgYXR0cnMsIGJjU2VydmVyVGFibGVDdHJsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGF0dHJzLnRhYmxlQ29udHJvbGxlcikge1xuICAgICAgICAgICAgICAgICAgICAvLyBleHBvc2UgYmNTZXJ2ZXJUYWJsZUN0cmwgdG8gdGFibGVDb250cm9sbGVyIGlmIGl0IGV4aXN0c1xuICAgICAgICAgICAgICAgICAgICAkcGFyc2UoYXR0cnMudGFibGVDb250cm9sbGVyKS5hc3NpZ24oJHNjb3BlLCBiY1NlcnZlclRhYmxlQ3RybCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtc2VydmVyLXRhYmxlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUuZGlyZWN0aXZlJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtc2VydmVyLXRhYmxlLnNvcnQtYnkuZGlyZWN0aXZlJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtc2VydmVyLXRhYmxlLWZhY3Rvcnkuc2VydmljZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXNlcnZlci10YWJsZS5zb3J0LWJ5LmRpcmVjdGl2ZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtc2VydmVyLXRhYmxlLWZhY3Rvcnkuc2VydmljZSdcbl0pXG4gICAgLmRpcmVjdGl2ZSgnYmNTb3J0QnknLCBmdW5jdGlvbiBiY1NvcnRCeURpcmVjdGl2ZSgkbG9nLCBiY1NlcnZlclRhYmxlRmFjdG9yeSkge1xuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvanMvYmlnY29tbWVyY2UvYmMtc2VydmVyLXRhYmxlL2JjLXNvcnQtYnkudHBsLmh0bWwnLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIHNvcnRWYWx1ZTogJ0AnLFxuICAgICAgICAgICAgICAgIGNvbHVtbk5hbWU6ICdAJyxcbiAgICAgICAgICAgICAgICB0YWJsZUlkOiAnQCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXF1aXJlOiAnP15eYmNTZXJ2ZXJUYWJsZScsXG4gICAgICAgICAgICBsaW5rOiBiY1NvcnRCeURpcmVjdGl2ZUxpbmtcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBiY1NvcnRCeURpcmVjdGl2ZUxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBiY1NlcnZlclRhYmxlQ3RybCkge1xuICAgICAgICAgICAgdmFyIGJjU2VydmVyVGFibGUsXG4gICAgICAgICAgICAgICAgc29ydERpclZhbHVlcztcblxuICAgICAgICAgICAgaWYgKHNjb3BlLnRhYmxlSWQpIHtcbiAgICAgICAgICAgICAgICBiY1NlcnZlclRhYmxlID0gYmNTZXJ2ZXJUYWJsZUZhY3RvcnkuZ2V0KHNjb3BlLnRhYmxlSWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChiY1NlcnZlclRhYmxlQ3RybCkge1xuICAgICAgICAgICAgICAgIGJjU2VydmVyVGFibGUgPSBiY1NlcnZlclRhYmxlQ3RybDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGxvZy5lcnJvcignYmMtc29ydC1ieSBkaXJlY3RpdmUgcmVxdWlyZXMgYSB0YWJsZS1pZCwgb3IgYSBwYXJlbnQgYmNTZXJ2ZXJUYWJsZUN0cmwgZGlyZWN0aXZlLicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzb3J0RGlyVmFsdWVzID0gYmNTZXJ2ZXJUYWJsZS50YWJsZUNvbmZpZy5zb3J0RGlyVmFsdWVzO1xuXG4gICAgICAgICAgICBzY29wZS5hc2MgPSBzb3J0RGlyVmFsdWVzLmFzYztcbiAgICAgICAgICAgIHNjb3BlLmRlc2MgPSBzb3J0RGlyVmFsdWVzLmRlc2M7XG4gICAgICAgICAgICBzY29wZS5zb3J0QnkgPSBiY1NlcnZlclRhYmxlLnNvcnRCeTtcbiAgICAgICAgICAgIHNjb3BlLnNvcnREaXIgPSBiY1NlcnZlclRhYmxlLnNvcnREaXI7XG4gICAgICAgICAgICBzY29wZS5zb3J0ID0gc29ydDtcblxuICAgICAgICAgICAgZnVuY3Rpb24gc29ydCgkZXZlbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgc29ydEJ5LFxuICAgICAgICAgICAgICAgICAgICBzb3J0RGlyO1xuXG4gICAgICAgICAgICAgICAgaWYgKCRldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoYmNTZXJ2ZXJUYWJsZS5zb3J0QnkgPT09IHNjb3BlLnNvcnRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBzb3J0QnkgPSBiY1NlcnZlclRhYmxlLnNvcnRCeTtcbiAgICAgICAgICAgICAgICAgICAgc29ydERpciA9IGJjU2VydmVyVGFibGUuc29ydERpciA9PT0gc2NvcGUuYXNjID8gc2NvcGUuZGVzYyA6IHNjb3BlLmFzYztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzb3J0QnkgPSBzY29wZS5zb3J0VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHNvcnREaXIgPSBzY29wZS5hc2M7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYmNTZXJ2ZXJUYWJsZS51cGRhdGVTb3J0KHNvcnRCeSwgc29ydERpcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmxvYWRpbmctbm90aWZpY2F0aW9uLmRpcmVjdGl2ZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ2xvYWRpbmdOb3RpZmljYXRpb24nLCBmdW5jdGlvbiBsb2FkaW5nTm90aWZpY2F0aW9uRGlyZWN0aXZlKCRyb290U2NvcGUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9qcy9iaWdjb21tZXJjZS9sb2FkaW5nLW5vdGlmaWNhdGlvbi9sb2FkaW5nLW5vdGlmaWNhdGlvbi50cGwuaHRtbCcsXG5cbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJ2FqYXhSZXF1ZXN0UnVubmluZycsIGZ1bmN0aW9uKGV2ZW50LCB2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucmVxdWVzdEluUHJvZ3Jlc3MgPSB2YWw7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIubG9hZGluZy1ub3RpZmljYXRpb24nLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmxvYWRpbmctbm90aWZpY2F0aW9uLmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmxvYWRpbmctb3ZlcmxheS5jb250cm9sbGVyJywgW10pXG4gICAgLmNvbnRyb2xsZXIoJ0xvYWRpbmdPdmVybGF5Q3RybCcsIGZ1bmN0aW9uIExvYWRpbmdPdmVybGF5Q3RybCgkcm9vdFNjb3BlLCAkdGltZW91dCkge1xuICAgICAgICB2YXIgY3RybCA9IHRoaXMsXG4gICAgICAgICAgICBkZWZhdWx0RGVib3VuY2UgPSAxMDAsXG4gICAgICAgICAgICB0aW1lb3V0O1xuXG4gICAgICAgIGlmIChjdHJsLmRlYm91bmNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGN0cmwuZGVib3VuY2UgPSBkZWZhdWx0RGVib3VuY2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3RybC51c2VVaVJvdXRlcikge1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0Jywgc3RhcnRMb2FkaW5nKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgc3RvcExvYWRpbmcpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZUVycm9yJywgc3RvcExvYWRpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc3RhcnRMb2FkaW5nKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGltZW91dCA9ICR0aW1lb3V0KGZ1bmN0aW9uIHN0YXJ0TG9hZGluZ1RpbWVyKCkge1xuICAgICAgICAgICAgICAgIGN0cmwubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICB9LCBjdHJsLmRlYm91bmNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHN0b3BMb2FkaW5nKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVvdXQpO1xuICAgICAgICAgICAgY3RybC5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5sb2FkaW5nLW92ZXJsYXkuZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5sb2FkaW5nLW92ZXJsYXkuY29udHJvbGxlcidcbl0pXG4gICAgLmRpcmVjdGl2ZSgnbG9hZGluZ092ZXJsYXknLCBmdW5jdGlvbiBsb2FkaW5nT3ZlcmxheSgkY29tcGlsZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2FkaW5nT3ZlcmxheUN0cmwgYXMgbG9hZGluZ092ZXJsYXlDdHJsJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIGRlYm91bmNlOiAnPT8nLFxuICAgICAgICAgICAgICAgIGxvYWRpbmc6ICc9P2xvYWRpbmdPdmVybGF5JyxcbiAgICAgICAgICAgICAgICB1c2VVaVJvdXRlcjogJz0/J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGxvYWRpbmdPdmVybGF5Q29tcGlsZShlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnbG9hZGluZ092ZXJsYXktY29udGFpbmVyJyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gbG9hZGluZ092ZXJsYXlMaW5rKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG92ZXJsYXkgPSAkY29tcGlsZSgnPGRpdiBjbGFzcz1cImxvYWRpbmdPdmVybGF5XCIgbmctaWY9XCJsb2FkaW5nT3ZlcmxheUN0cmwubG9hZGluZ1wiPjwvZGl2PicpKHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hcHBlbmQob3ZlcmxheSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5sb2FkaW5nLW92ZXJsYXknLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmxvYWRpbmctb3ZlcmxheS5kaXJlY3RpdmUnXG5dKTtcbiIsIi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogQGV4YW1wbGVcbiAqXG4gKi9cblxuYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLnN0aWNreS1jbGFzcy5kaXJlY3RpdmUnLCBbXSlcbiAgICAuZGlyZWN0aXZlKCdzdGlja3lDbGFzcycsIGZ1bmN0aW9uIHN0aWNreUNsYXNzKCRkb2N1bWVudCwgJHRpbWVvdXQsICR3aW5kb3cpIHtcbiAgICAgICAgJ25nSW5qZWN0JztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0ICR3aW5kb3dFbGVtID0gYW5ndWxhci5lbGVtZW50KCR3aW5kb3cpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRocm90dGxlZE9uU2Nyb2xsID0gXy50aHJvdHRsZShvblNjcm9sbCwgMTApO1xuXG4gICAgICAgICAgICAgICAgbGV0IG9mZnNldFRvcDtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNsZWFuVXAoKSB7XG4gICAgICAgICAgICAgICAgICAgICR3aW5kb3dFbGVtLm9mZignc2Nyb2xsJywgdGhyb3R0bGVkT25TY3JvbGwpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIG9uU2Nyb2xsKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJHdpbmRvdy5wYWdlWU9mZnNldCA+PSBvZmZzZXRUb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoYXR0ci5zdGlja3lDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKGF0dHIuc3RpY2t5Q2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkb2N1bWVudFRvcCA9ICRkb2N1bWVudFswXS5ib2R5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZWxlbWVudFRvcCA9IGVsZW1lbnRbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xuXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldFRvcCA9IGVsZW1lbnRUb3AgLSBkb2N1bWVudFRvcDtcblxuICAgICAgICAgICAgICAgICAgICB0aHJvdHRsZWRPblNjcm9sbCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICR3aW5kb3dFbGVtLm9uKCdzY3JvbGwnLCB0aHJvdHRsZWRPblNjcm9sbCk7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLiRvbignJGRlc3Ryb3knLCBjbGVhblVwKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuc3RpY2t5LWNsYXNzJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5zdGlja3ktY2xhc3MuZGlyZWN0aXZlJ1xuXSk7XG4iLCIvKipcbiAqIEBkZXNjcmlwdGlvbiBVc2VkIHRvIGNyZWF0ZSBhIHRvZ2dsZSBzd2l0Y2ggZm9yIGZvcm1zXG4gKiBAZXhhbXBsZVxuICAgIDxzd2l0Y2ggbmctbW9kZWw9XCJjdHJsLnN3aXRjaE1vZGVsMVwiPjwvc3dpdGNoPlxuXG4gICAgPHN3aXRjaFxuICAgICAgICB0b2dnbGUtb2ZmLXRleHQ9XCJPZmZcIlxuICAgICAgICB0b2dnbGUtb24tdGV4dD1cIk9uXCJcbiAgICAgICAgbmctbW9kZWw9XCJjdHJsLnN3aXRjaE1vZGVsMlwiPlxuICAgIDwvc3dpdGNoPlxuXG4gICAgPHN3aXRjaFxuICAgICAgICBoYXMtaWNvblxuICAgICAgICBuZy1tb2RlbD1cImN0cmwuc3dpdGNoTW9kZWwzXCI+XG4gICAgPC9zd2l0Y2g+XG5cbiAgICA8c3dpdGNoXG4gICAgICAgIGlzLWltcG9ydGFudFxuICAgICAgICBsZWZ0LWxhYmVsPVwiRG93biBmb3IgTWFpbnRlbmFuY2VcIlxuICAgICAgICByaWdodC1sYWJlbD1cIk9wZW5cIlxuICAgICAgICBuZy1tb2RlbD1cImN0cmwuc3dpdGNoTW9kZWw0XCI+XG4gICAgPC9zd2l0Y2g+XG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5zd2l0Y2guZGlyZWN0aXZlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnc3dpdGNoJywgZnVuY3Rpb24gc3dpdGNoRGlyZWN0aXZlKCkge1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldFVuaXF1ZUlEKGlkUHJlZml4KSB7XG4gICAgICAgICAgICByZXR1cm4gXy51bmlxdWVJZChpZFByZWZpeCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL2JpZ2NvbW1lcmNlL3N3aXRjaC9zd2l0Y2gudHBsLmh0bWwnLFxuICAgICAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBhcmlhRGVzY3JpcHRpb246ICdAJyxcbiAgICAgICAgICAgICAgICBpc0Rpc2FibGVkOiAnPW5nRGlzYWJsZWQnLFxuICAgICAgICAgICAgICAgIGxhYmVsVGV4dDogJ0AnLFxuICAgICAgICAgICAgICAgIGxlZnREZXNjcmlwdGlvbjogJ0AnLFxuICAgICAgICAgICAgICAgIG5nRmFsc2VWYWx1ZTogJ0AnLFxuICAgICAgICAgICAgICAgIG5nVHJ1ZVZhbHVlOiAnQCcsXG4gICAgICAgICAgICAgICAgcmlnaHREZXNjcmlwdGlvbjogJ0AnLFxuICAgICAgICAgICAgICAgIHRvZ2dsZU9mZkxhYmVsOiAnQCcsXG4gICAgICAgICAgICAgICAgdG9nZ2xlT25MYWJlbDogJ0AnLFxuICAgICAgICAgICAgICAgIHVuaXF1ZUlkOiAnQCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnc3dpdGNoQ3RybCcsXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiBzd2l0Y2hEaXJlY3RpdmVDb21waWxlKHRFbGVtLCB0QXR0cnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hlY2tib3hFbGVtID0gdEVsZW0uZmluZCgnaW5wdXQnKTtcblxuICAgICAgICAgICAgICAgIGlmICh0QXR0cnMubmdGYWxzZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrYm94RWxlbS5hdHRyKCduZy1mYWxzZS12YWx1ZScsIHRBdHRycy5uZ0ZhbHNlVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0QXR0cnMubmdUcnVlVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tib3hFbGVtLmF0dHIoJ25nLXRydWUtdmFsdWUnLCB0QXR0cnMubmdUcnVlVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBzd2l0Y2hEaXJlY3RpdmVQb3N0TGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMsIG5nTW9kZWxDdHJsKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnN3aXRjaEN0cmwuaW5pdChuZ01vZGVsQ3RybCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiBzd2l0Y2hEaXJlY3RpdmVDdHJsKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycykge1xuICAgICAgICAgICAgICAgIHZhciBjdHJsID0gdGhpcztcblxuICAgICAgICAgICAgICAgIC8vIHN0YXRlXG4gICAgICAgICAgICAgICAgY3RybC5pc0ltcG9ydGFudCA9IGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRycy5pc0ltcG9ydGFudCkgJiYgJGF0dHJzLmlzSW1wb3J0YW50ICE9PSAnZmFsc2UnO1xuICAgICAgICAgICAgICAgIGN0cmwuaGFzSWNvbiA9IGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRycy5oYXNJY29uKSAmJiAkYXR0cnMuaGFzSWNvbiAhPT0gJ2ZhbHNlJztcblxuICAgICAgICAgICAgICAgIC8vIGxhYmVsc1xuICAgICAgICAgICAgICAgIGN0cmwubGFiZWxUZXh0ID0gJGF0dHJzLnRvZ2dsZU9mZkxhYmVsO1xuXG4gICAgICAgICAgICAgICAgLy8gaWRzXG4gICAgICAgICAgICAgICAgY3RybC51bmlxdWVJZCA9IGdldFVuaXF1ZUlEKCdzd2l0Y2gtJyk7XG4gICAgICAgICAgICAgICAgY3RybC5hcmlhRGVzY3JpcHRpb25JRCA9IGdldFVuaXF1ZUlEKCdzd2l0Y2gtYXJpYURlc2NyaXB0aW9uLScpO1xuXG4gICAgICAgICAgICAgICAgY3RybC5pbml0ID0gaW5pdDtcbiAgICAgICAgICAgICAgICBjdHJsLnVwZGF0ZU1vZGVsID0gdXBkYXRlTW9kZWw7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBpbml0KG5nTW9kZWxDdHJsKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0cmwubmdNb2RlbEN0cmwgPSBuZ01vZGVsQ3RybDtcbiAgICAgICAgICAgICAgICAgICAgY3RybC52YWx1ZSA9IGN0cmwubmdNb2RlbEN0cmwuJG1vZGVsVmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgnc3dpdGNoQ3RybC5uZ01vZGVsQ3RybC4kbW9kZWxWYWx1ZScsIGZ1bmN0aW9uIHN3aXRjaFZhbHVlQ2hhbmdlZChuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3RybC52YWx1ZSA9IG5ld1ZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHJsLmlzQ2hlY2tlZCA9IF8uaXNTdHJpbmcobmV3VmFsdWUpID8gXCInXCIgKyBuZXdWYWx1ZSArIFwiJ1wiID09PSBjdHJsLm5nVHJ1ZVZhbHVlIDogbmV3VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHJsLmxhYmVsVGV4dCA9ICEhY3RybC5pc0NoZWNrZWQgPyBjdHJsLnRvZ2dsZU9uTGFiZWw6IGN0cmwudG9nZ2xlT2ZmTGFiZWw7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZU1vZGVsKCkge1xuICAgICAgICAgICAgICAgICAgICBjdHJsLm5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUoY3RybC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuc3dpdGNoJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5zd2l0Y2guZGlyZWN0aXZlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIudGFicycsIFsnbW0uZm91bmRhdGlvbi50YWJzJ10pXG4gICAgLmNvbmZpZyhmdW5jdGlvbiBjb25maWd1cmVUYWJzZXQoJHByb3ZpZGUpIHtcbiAgICAgICAgJHByb3ZpZGUuZGVjb3JhdG9yKCd0YWJzZXREaXJlY3RpdmUnLCBmdW5jdGlvbiB0YWJzZXREZWNvcmF0b3IoJGRlbGVnYXRlKSB7XG4gICAgICAgICAgICB2YXIgZGlyZWN0aXZlID0gJGRlbGVnYXRlWzBdO1xuXG4gICAgICAgICAgICBkaXJlY3RpdmUuY29tcGlsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuYnV0dG9ucyA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHJzLmJ1dHRvbnMpID8gc2NvcGUuJHBhcmVudC4kZXZhbChhdHRycy5idXR0b25zKSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gJGRlbGVnYXRlO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi51dGlsJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi51dGlsLnRydXN0QXNIdG1sJ1xuXSk7XG4iLCIvKipcbiAqIEBkZXNjcmlwdGlvbiBTcHJpdGUgZGlyZWN0aXZlIHVzZWQgdG8gbG9hZCBhbiBpY29uIGZyb20gYW4gaW1hZ2Ugc3ByaXRlLFxuICogICAgICAgICAgICAgIHNpbWxpYXIgdG8gdGhlIGljb24gZGlyZWN0aXZlIGJ1dCBsZXNzIFNWR1xuICogQGV4YW1wbGVcbiAqIDxzcHJpdGUgZ2x5cGg9XCJpYy1hbWV4XCI+PC9zcHJpdGU+XG4gKi9cblxuYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLnNwcml0ZS5kaXJlY3RpdmUnLCBbXSlcbiAgICAuZGlyZWN0aXZlKCdzcHJpdGUnLCBmdW5jdGlvbiBzcHJpdGVEaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBnbHlwaDogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29tcGlsZTogc3ByaXRlRGlyZWN0aXZlQ29tcGlsZVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIHNwcml0ZURpcmVjdGl2ZUNvbXBpbGUodEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRFbGVtZW50LmFkZENsYXNzKCdzcHJpdGUnKTtcbiAgICAgICAgICAgIHRFbGVtZW50LmF0dHIoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBzcHJpdGVEaXJlY3RpdmVMaW5rKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICBhdHRycy4kb2JzZXJ2ZSgnZ2x5cGgnLCAobmV3VmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyKCdjbGFzcycsICdzcHJpdGUgc3ByaXRlLS0nICsgbmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLnNwcml0ZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuc3ByaXRlLmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLW1vZGFsLm1vZGFsU3RhY2suc2VydmljZScsIFtcblxuXSlcblxuICAuZmFjdG9yeSgnJG1vZGFsU3RhY2snLCBbJyR3aW5kb3cnLCAnJHRyYW5zaXRpb24nLCAnJHRpbWVvdXQnLCAnJGRvY3VtZW50JywgJyRjb21waWxlJywgJyRyb290U2NvcGUnLCAnJCRzdGFja2VkTWFwJyxcbiAgICBmdW5jdGlvbiAoJHdpbmRvdywgJHRyYW5zaXRpb24sICR0aW1lb3V0LCAkZG9jdW1lbnQsICRjb21waWxlLCAkcm9vdFNjb3BlLCAkJHN0YWNrZWRNYXApIHtcbiAgICAgIC8vIENoYW5nZXM6IGNoYW5nZSBmcm9tIGBtb2RhbC1vcGVuYCB0byBgaGFzLWFjdGl2ZU1vZGFsYFxuICAgICAgdmFyIE9QRU5FRF9NT0RBTF9DTEFTUyA9ICdoYXMtYWN0aXZlTW9kYWwnO1xuXG4gICAgICB2YXIgYmFja2Ryb3BEb21FbCwgYmFja2Ryb3BTY29wZSwgY3NzVG9wO1xuICAgICAgdmFyIG9wZW5lZFdpbmRvd3MgPSAkJHN0YWNrZWRNYXAuY3JlYXRlTmV3KCk7XG4gICAgICB2YXIgJG1vZGFsU3RhY2sgPSB7fTtcblxuICAgICAgZnVuY3Rpb24gYmFja2Ryb3BJbmRleCgpIHtcbiAgICAgICAgdmFyIHRvcEJhY2tkcm9wSW5kZXggPSAtMTtcbiAgICAgICAgdmFyIG9wZW5lZCA9IG9wZW5lZFdpbmRvd3Mua2V5cygpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9wZW5lZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChvcGVuZWRXaW5kb3dzLmdldChvcGVuZWRbaV0pLnZhbHVlLmJhY2tkcm9wKSB7XG4gICAgICAgICAgICB0b3BCYWNrZHJvcEluZGV4ID0gaTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRvcEJhY2tkcm9wSW5kZXg7XG4gICAgICB9XG5cbiAgICAgICRyb290U2NvcGUuJHdhdGNoKGJhY2tkcm9wSW5kZXgsIGZ1bmN0aW9uKG5ld0JhY2tkcm9wSW5kZXgpe1xuICAgICAgICBpZiAoYmFja2Ryb3BTY29wZSkge1xuICAgICAgICAgIGJhY2tkcm9wU2NvcGUuaW5kZXggPSBuZXdCYWNrZHJvcEluZGV4O1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgZnVuY3Rpb24gcmVtb3ZlTW9kYWxXaW5kb3cobW9kYWxJbnN0YW5jZSkge1xuICAgICAgICB2YXIgYm9keSA9ICRkb2N1bWVudC5maW5kKCdib2R5JykuZXEoMCk7XG4gICAgICAgIHZhciBtb2RhbFdpbmRvdyA9IG9wZW5lZFdpbmRvd3MuZ2V0KG1vZGFsSW5zdGFuY2UpLnZhbHVlO1xuXG4gICAgICAgIC8vY2xlYW4gdXAgdGhlIHN0YWNrXG4gICAgICAgIG9wZW5lZFdpbmRvd3MucmVtb3ZlKG1vZGFsSW5zdGFuY2UpO1xuXG4gICAgICAgIC8vcmVtb3ZlIHdpbmRvdyBET00gZWxlbWVudFxuICAgICAgICByZW1vdmVBZnRlckFuaW1hdGUobW9kYWxXaW5kb3cubW9kYWxEb21FbCwgbW9kYWxXaW5kb3cubW9kYWxTY29wZSwgMzAwLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBtb2RhbFdpbmRvdy5tb2RhbFNjb3BlLiRkZXN0cm95KCk7XG4gICAgICAgICAgYm9keS50b2dnbGVDbGFzcyhPUEVORURfTU9EQUxfQ0xBU1MsIG9wZW5lZFdpbmRvd3MubGVuZ3RoKCkgPiAwKTtcbiAgICAgICAgICBjaGVja1JlbW92ZUJhY2tkcm9wKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBjaGVja1JlbW92ZUJhY2tkcm9wKCkge1xuICAgICAgICAvL3JlbW92ZSBiYWNrZHJvcCBpZiBubyBsb25nZXIgbmVlZGVkXG4gICAgICAgIGlmIChiYWNrZHJvcERvbUVsICYmIGJhY2tkcm9wSW5kZXgoKSA9PSAtMSkge1xuICAgICAgICAgIHZhciBiYWNrZHJvcFNjb3BlUmVmID0gYmFja2Ryb3BTY29wZTtcbiAgICAgICAgICByZW1vdmVBZnRlckFuaW1hdGUoYmFja2Ryb3BEb21FbCwgYmFja2Ryb3BTY29wZSwgMTUwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBiYWNrZHJvcFNjb3BlUmVmLiRkZXN0cm95KCk7XG4gICAgICAgICAgICBiYWNrZHJvcFNjb3BlUmVmID0gbnVsbDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBiYWNrZHJvcERvbUVsID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGJhY2tkcm9wU2NvcGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcmVtb3ZlQWZ0ZXJBbmltYXRlKGRvbUVsLCBzY29wZSwgZW11bGF0ZVRpbWUsIGRvbmUpIHtcbiAgICAgICAgLy8gQ2xvc2luZyBhbmltYXRpb25cbiAgICAgICAgc2NvcGUuYW5pbWF0ZSA9IGZhbHNlO1xuXG4gICAgICAgIHZhciB0cmFuc2l0aW9uRW5kRXZlbnROYW1lID0gJHRyYW5zaXRpb24udHJhbnNpdGlvbkVuZEV2ZW50TmFtZTtcbiAgICAgICAgaWYgKHRyYW5zaXRpb25FbmRFdmVudE5hbWUpIHtcbiAgICAgICAgICAvLyB0cmFuc2l0aW9uIG91dFxuICAgICAgICAgIHZhciB0aW1lb3V0ID0gJHRpbWVvdXQoYWZ0ZXJBbmltYXRpbmcsIGVtdWxhdGVUaW1lKTtcblxuICAgICAgICAgIGRvbUVsLmJpbmQodHJhbnNpdGlvbkVuZEV2ZW50TmFtZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVvdXQpO1xuICAgICAgICAgICAgYWZ0ZXJBbmltYXRpbmcoKTtcbiAgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEVuc3VyZSB0aGlzIGNhbGwgaXMgYXN5bmNcbiAgICAgICAgICAkdGltZW91dChhZnRlckFuaW1hdGluZywgMCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhZnRlckFuaW1hdGluZygpIHtcbiAgICAgICAgICBpZiAoYWZ0ZXJBbmltYXRpbmcuZG9uZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBhZnRlckFuaW1hdGluZy5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIGRvbUVsLnJlbW92ZSgpO1xuICAgICAgICAgIGlmIChkb25lKSB7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZU1vZGFsVG9wKG1vZGFsRWxlbWVudCwgb2Zmc2V0KSB7XG4gICAgICAgIHZhciBzY3JvbGxZID0gMDtcblxuICAgICAgICBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZChvZmZzZXQpKSB7XG4gICAgICAgICAgb2Zmc2V0ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZSB3aW5kb3cgaXMgd2l0aGluIGFuIGlmcmFtZSwgY2FsY3VsYXRlIHRoZSBwYXJlbnRcbiAgICAgICAgLy8gZnJhbWUncyBvZmZzZXQgYXMgdGhlIHRvcCBwb3NpdGlvbiBmb3IgdGhlIG1vZGFsXG4gICAgICAgIGlmICgkd2luZG93LnNlbGYgIT09ICR3aW5kb3cudG9wKSB7XG4gICAgICAgICAgc2Nyb2xsWSA9ICR3aW5kb3cucGFyZW50LnNjcm9sbFk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb2Zmc2V0ICsgc2Nyb2xsWTtcbiAgICAgIH1cblxuICAgICAgJGRvY3VtZW50LmJpbmQoJ2tleWRvd24nLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIHZhciBtb2RhbDtcblxuICAgICAgICBpZiAoZXZ0LndoaWNoID09PSAyNykge1xuICAgICAgICAgIG1vZGFsID0gb3BlbmVkV2luZG93cy50b3AoKTtcbiAgICAgICAgICBpZiAobW9kYWwgJiYgbW9kYWwudmFsdWUua2V5Ym9hcmQpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgJG1vZGFsU3RhY2suZGlzbWlzcyhtb2RhbC5rZXkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgJG1vZGFsU3RhY2sub3BlbiA9IGZ1bmN0aW9uIChtb2RhbEluc3RhbmNlLCBtb2RhbCkge1xuXG4gICAgICAgIG9wZW5lZFdpbmRvd3MuYWRkKG1vZGFsSW5zdGFuY2UsIHtcbiAgICAgICAgICBkZWZlcnJlZDogbW9kYWwuZGVmZXJyZWQsXG4gICAgICAgICAgbW9kYWxTY29wZTogbW9kYWwuc2NvcGUsXG4gICAgICAgICAgYmFja2Ryb3A6IG1vZGFsLmJhY2tkcm9wLFxuICAgICAgICAgIGtleWJvYXJkOiBtb2RhbC5rZXlib2FyZFxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYm9keSA9ICRkb2N1bWVudC5maW5kKCdib2R5JykuZXEoMCksXG4gICAgICAgICAgICBjdXJyQmFja2Ryb3BJbmRleCA9IGJhY2tkcm9wSW5kZXgoKTtcblxuICAgICAgICBpZiAoY3VyckJhY2tkcm9wSW5kZXggPj0gMCAmJiAhYmFja2Ryb3BEb21FbCkge1xuICAgICAgICAgIGJhY2tkcm9wU2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcodHJ1ZSk7XG4gICAgICAgICAgYmFja2Ryb3BTY29wZS5pbmRleCA9IGN1cnJCYWNrZHJvcEluZGV4O1xuICAgICAgICAgIGJhY2tkcm9wRG9tRWwgPSAkY29tcGlsZSgnPGRpdiBtb2RhbC1iYWNrZHJvcD48L2Rpdj4nKShiYWNrZHJvcFNjb3BlKTtcbiAgICAgICAgICBib2R5LmFwcGVuZChiYWNrZHJvcERvbUVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENyZWF0ZSBhIGZhdXggbW9kYWwgZGl2IGp1c3QgdG8gbWVhc3VyZSBpdHNcbiAgICAgICAgLy8gZGlzdGFuY2UgdG8gdG9wXG4gICAgICAgIHZhciBmYXV4ID0gYW5ndWxhci5lbGVtZW50KCc8ZGl2IGNsYXNzPVwicmV2ZWFsLW1vZGFsXCIgc3R5bGU9XCJ6LWluZGV4Oi0xXCJcIj48L2Rpdj4nKTtcbiAgICAgICAgYm9keS5hcHBlbmQoZmF1eFswXSk7XG4gICAgICAgIGNzc1RvcCA9IHBhcnNlSW50KCR3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShmYXV4WzBdKS50b3ApIHx8IDA7XG4gICAgICAgIHZhciBvcGVuQXQgPSBjYWxjdWxhdGVNb2RhbFRvcChmYXV4LCBjc3NUb3ApO1xuICAgICAgICBmYXV4LnJlbW92ZSgpO1xuXG4gICAgICAgIHZhciBhbmd1bGFyRG9tRWwgPSBhbmd1bGFyLmVsZW1lbnQoJzxkaXYgbW9kYWwtd2luZG93IHN0eWxlPVwidmlzaWJpbGl0eTogdmlzaWJsZTsgZGlzcGxheTogYmxvY2s7IHRvcDonICsgb3BlbkF0ICsncHg7XCI+PC9kaXY+Jyk7XG4gICAgICAgIGFuZ3VsYXJEb21FbC5hdHRyKCd3aW5kb3ctY2xhc3MnLCBtb2RhbC53aW5kb3dDbGFzcyk7XG4gICAgICAgIGFuZ3VsYXJEb21FbC5hdHRyKCdpbmRleCcsIG9wZW5lZFdpbmRvd3MubGVuZ3RoKCkgLSAxKTtcbiAgICAgICAgYW5ndWxhckRvbUVsLmF0dHIoJ2FuaW1hdGUnLCAnYW5pbWF0ZScpO1xuICAgICAgICBhbmd1bGFyRG9tRWwuaHRtbChtb2RhbC5jb250ZW50KTtcblxuICAgICAgICB2YXIgbW9kYWxEb21FbCA9ICRjb21waWxlKGFuZ3VsYXJEb21FbCkobW9kYWwuc2NvcGUpO1xuICAgICAgICBvcGVuZWRXaW5kb3dzLnRvcCgpLnZhbHVlLm1vZGFsRG9tRWwgPSBtb2RhbERvbUVsO1xuICAgICAgICBib2R5LmFwcGVuZChtb2RhbERvbUVsKTtcbiAgICAgICAgYm9keS5hZGRDbGFzcyhPUEVORURfTU9EQUxfQ0xBU1MpO1xuICAgICAgfTtcblxuICAgICAgJG1vZGFsU3RhY2sucmVwb3NpdGlvbiA9IGZ1bmN0aW9uIChtb2RhbEluc3RhbmNlKSB7XG4gICAgICAgIHZhciBtb2RhbFdpbmRvdyA9IG9wZW5lZFdpbmRvd3MuZ2V0KG1vZGFsSW5zdGFuY2UpLnZhbHVlO1xuICAgICAgICBpZiAobW9kYWxXaW5kb3cpIHtcbiAgICAgICAgICB2YXIgbW9kYWxEb21FbCA9IG1vZGFsV2luZG93Lm1vZGFsRG9tRWw7XG4gICAgICAgICAgdmFyIHRvcCA9IGNhbGN1bGF0ZU1vZGFsVG9wKG1vZGFsRG9tRWwsIGNzc1RvcCk7XG4gICAgICAgICAgbW9kYWxEb21FbC5jc3MoJ3RvcCcsIHRvcCArIFwicHhcIik7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgICRtb2RhbFN0YWNrLmNsb3NlID0gZnVuY3Rpb24gKG1vZGFsSW5zdGFuY2UsIHJlc3VsdCkge1xuICAgICAgICB2YXIgbW9kYWxXaW5kb3cgPSBvcGVuZWRXaW5kb3dzLmdldChtb2RhbEluc3RhbmNlKS52YWx1ZTtcbiAgICAgICAgaWYgKG1vZGFsV2luZG93KSB7XG4gICAgICAgICAgbW9kYWxXaW5kb3cuZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgIHJlbW92ZU1vZGFsV2luZG93KG1vZGFsSW5zdGFuY2UpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAkbW9kYWxTdGFjay5kaXNtaXNzID0gZnVuY3Rpb24gKG1vZGFsSW5zdGFuY2UsIHJlYXNvbikge1xuICAgICAgICB2YXIgbW9kYWxXaW5kb3cgPSBvcGVuZWRXaW5kb3dzLmdldChtb2RhbEluc3RhbmNlKS52YWx1ZTtcbiAgICAgICAgaWYgKG1vZGFsV2luZG93KSB7XG4gICAgICAgICAgbW9kYWxXaW5kb3cuZGVmZXJyZWQucmVqZWN0KHJlYXNvbik7XG4gICAgICAgICAgcmVtb3ZlTW9kYWxXaW5kb3cobW9kYWxJbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgICRtb2RhbFN0YWNrLmRpc21pc3NBbGwgPSBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIHZhciB0b3BNb2RhbCA9IHRoaXMuZ2V0VG9wKCk7XG4gICAgICAgIHdoaWxlICh0b3BNb2RhbCkge1xuICAgICAgICAgIHRoaXMuZGlzbWlzcyh0b3BNb2RhbC5rZXksIHJlYXNvbik7XG4gICAgICAgICAgdG9wTW9kYWwgPSB0aGlzLmdldFRvcCgpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAkbW9kYWxTdGFjay5nZXRUb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBvcGVuZWRXaW5kb3dzLnRvcCgpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuICRtb2RhbFN0YWNrO1xuICAgIH1dKTtcblxuIiwiLypcbiAqIFRoaXMgbW9kdWxlIG1vZGlmaWVzIGFuZ3VsYXIgZm91bmRhdGlvbidzIG1vZGFsIGltcGxlbWVudGF0aW9uLiBUaGlzIGRvZXMgbm90IGNyZWF0ZSBhIG5ldyBtb2RhbCBzZXJ2aWNlL2RpcmVjdGl2ZS5cbiAqXG4qL1xuYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLW1vZGFsJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1tb2RhbC5tb2RhbFN0YWNrLnNlcnZpY2UnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5zZXJ2aWNlcy5kZXZpY2Uuc2VydmljZScsIFtdKVxuICAgIC5mYWN0b3J5KCdkZXZpY2VTZXJ2aWNlJywgZnVuY3Rpb24gZGV2aWNlU2VydmljZSgkd2luZG93KSB7XG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSB7XG4gICAgICAgICAgICBpc0lPU0RldmljZSxcbiAgICAgICAgICAgIGlzTWFjT1NEZXZpY2UsXG4gICAgICAgICAgICBpc01vYmlsZURldmljZVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGlzSU9TRGV2aWNlKCkge1xuICAgICAgICAgICAgY29uc3QgZGV2aWNlTGlzdCA9IFsnaXBhZCcsICdpcGhvbmUnXTtcbiAgICAgICAgICAgIGNvbnN0IHVhID0gJHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIHJldHVybiBfLnNvbWUoZGV2aWNlTGlzdCwgKGRldmljZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBfLmNvbnRhaW5zKHVhLCBkZXZpY2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc01vYmlsZURldmljZSgpIHtcbiAgICAgICAgICAgIHJldHVybiAvTW9iaS9pLnRlc3QoJHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzTWFjT1NEZXZpY2UoKSB7XG4gICAgICAgICAgICByZXR1cm4gL01hYy9pLnRlc3QoJHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xuICAgIH0pOyIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5zZXJ2aWNlcycsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuc2VydmljZXMuZGV2aWNlLnNlcnZpY2UnXG5dKTtcbiIsIi8qKlxuICogQG5hbWUgY2MtZXhwaXJ5IGRpcmVjdGl2ZVxuICogQGRlc2NyaXB0aW9uIEEgZGlyZWN0aXZlIGZvbGxvd2luZyBhbmd1bGFyLWNyZWRpdC1jYXJkJ3MgYXBwcm9hY2ggdG8gdmFsaWRhdGluZy9mb3JtYXR0aW5nIGNyZWRpdCBjYXJkIGV4cGlyYXRpb24gZGF0ZS5cbiAqIEV4cGVjdCB0aGUgY2MtZXhwaXJ5IG5nTW9kZWwgdG8gYmUgaW4gdGhlIGZvcm1hdCBvZiBgeyBtb250aDogJzA1JywgeWVhcjogJzIwMTcnfWAuXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC5jYy1leHBpcnkuZGlyZWN0aXZlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnY2NFeHBpcnknLCBmdW5jdGlvbiBjY0V4cERpcmVjdGl2ZSgkZmlsdGVyKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiAodEVsZW0sIHRBdHRyKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgRVhQSVJBVElPTl9NQVhfTEVOR1RIID0gNzsgLy8gbGVuZ3RoIG9mIGBNTSAvIHl5YFxuXG4gICAgICAgICAgICAgICAgdEF0dHIuJHNldCgnYXV0b2NvbXBsZXRlJywgJ2NjLWV4cCcpO1xuICAgICAgICAgICAgICAgIHRBdHRyLiRzZXQoJ21heGxlbmd0aCcsIEVYUElSQVRJT05fTUFYX0xFTkdUSCk7XG4gICAgICAgICAgICAgICAgdEF0dHIuJHNldCgncGF0dGVybicsICdbMC05XSonKTsgLy8gZm9yIG1vYmlsZSBrZXlib2FyZCBkaXNwbGF5XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gY2NFeHBpcnlMaW5rKHNjb3BlLCB0RWxlbSwgdEF0dHIsIG5nTW9kZWxDdHJsKSB7XG4gICAgICAgICAgICAgICAgICAgIGluaXQoKTtcblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHBhcnNlcnMudW5zaGlmdChwYXJzZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJGZvcm1hdHRlcnMucHVzaChmb3JtYXR0ZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHZhbGlkYXRvcnMudmFsaWRGdXR1cmVEYXRlID0gdmFsaWRGdXR1cmVEYXRlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goZ2V0Vmlld1ZhbHVlLCByZW5kZXJGb3JtYXR0ZWRWaWV3KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBnZXQgdGhlIGlucHV0J3MgdmlldyB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZ2V0Vmlld1ZhbHVlKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5nTW9kZWxDdHJsLiR2aWV3VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogZm9ybWF0cyB0aGUgaW5wdXQgdmlldyB2YWx1ZSB0byBiZSB0aGUgZm9ybWF0IGBNTSAvIHl5YCBhbmQgcmUtcmVuZGVycyB2aWV3XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiByZW5kZXJGb3JtYXR0ZWRWaWV3KHZpZXdWYWx1ZSwgcHJldlZpZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF2aWV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGEgbmV3IHZhbHVlIGlzIGFkZGVkIChhcyBvcHBvc2VkIHRvIHByZXNzaW5nIGJhY2tzcGFjZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzQWRkaXRpb24gPSB2aWV3VmFsdWUubGVuZ3RoID4gcHJldlZpZXdWYWx1ZS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUoZm9ybWF0KHZpZXdWYWx1ZSwgaXNBZGRpdGlvbikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHJlbmRlcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFZhbGlkYXRlcyB3aGV0aGVyIHRoZSBlbnRlcmVkIGV4cGlyYXRpb24gZGF0ZSBpcyB2YWxpZFxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gdmFsaWRGdXR1cmVEYXRlKG1vZGVsVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHttb250aCwgeWVhcn0gPSBtb2RlbFZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNWYWxpZERhdGUobW9udGgsIHllYXIpICYmICFpc1Bhc3QobW9udGgsIHllYXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFZhbGlkYXRlcyB3aGV0aGVyIHRoZSBnaXZlbiBtb250aCBhbmQgeWVhciBhcmUgbnVtYmVyIHN0cmluZ3Mgd2l0aCBsZW5ndGggb2YgMiBhbmQgNCByZXNwZWN0aXZlbHlcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGlzVmFsaWREYXRlKG1vbnRoLCB5ZWFyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtb250aFJlZ2V4ID0gL15bMC05XXsyfSQvO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeWVhclJlZ2V4ID0gL15bMC05XXs0fSQvO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy5pc1N0cmluZyhtb250aCkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmlzU3RyaW5nKHllYXIpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9udGhSZWdleC50ZXN0KG1vbnRoKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHllYXJSZWdleC50ZXN0KHllYXIpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNWYWxpZE1vbnRoKG1vbnRoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBDaGVja3Mgd2hldGhlciB0aGUgbW9udGggaXMgdmFsaWRcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGlzVmFsaWRNb250aChtb250aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGggPSBfLnBhcnNlSW50KG1vbnRoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1vbnRoID4gMCAmJiBtb250aCA8IDEzO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIENoZWNrcyB3aGV0aGVyIHRoZSBnaXZlbiBtb250aCBhbmQgZGF0ZSBpcyBpbiB0aGUgcGFzdFxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gaXNQYXN0KG1vbnRoLCB5ZWFyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0Q3Vyck1vbnRoRGF0ZSgpID4gbmV3IERhdGUoeWVhciwgbW9udGggLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBHZXQgdGhlIGRhdGUgb2JqZWN0IGJhc2VkIG9uIGN1cnJlbnQgbW9udGggYW5kIHllYXJcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdldEN1cnJNb250aERhdGUoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGRhdGUuZ2V0RnVsbFllYXIoKSwgZGF0ZS5nZXRNb250aCgpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBVc2VzIGFuZ3VsYXIgZGF0ZSBmaWx0ZXIgdG8gZm9ybWF0IGRhdGUgbW9kZWwgdG8gY29ycmVzcG9uZGluZyB2aWV3IGZvcm1hdFxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZm9ybWF0dGVyKGV4cCA9IHt9KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtb250aCA9IGV4cC5tb250aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHllYXIgPSBleHAueWVhcjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF8uaXNFbXB0eShtb250aCkgJiYgXy5pc0VtcHR5KHllYXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGZpbHRlcignZGF0ZScpKG5ldyBEYXRlKHllYXIsIG1vbnRoIC0gMSksICdNTSAvIHl5Jyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogUGFyc2VzIHRoZSBmb3JtYXR0ZWQgdmlldyB2YWx1ZXMgdG8gbW9kZWwuIENvbnZlcnRzIDIgZGlnaXQgeWVhciB0byBmdWxsIDQgZGlnaXQgeWVhclxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gZXhwaXJhdGlvbiB7b2JqZWN0fSBUaGUgZXhwaXJhdGlvbiBvYmplY3Qge21vbnRoLCB5ZWFyfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcGFyc2VyKGV4cGlyYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJhc2VZZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkuc2xpY2UoMCwgMik7IC8vIGAnMjAnYFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWVzID0gZXhwaXJhdGlvbi5zcGxpdCgnLycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9udGggPSB2YWx1ZXNbMF0gPyB2YWx1ZXNbMF0udHJpbSgpIDogJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB5ZWFyID0gdmFsdWVzWzFdID8gYmFzZVllYXIgKyB2YWx1ZXNbMV0udHJpbSgpIDogJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IG1vbnRoLCB5ZWFyIH07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogZm9ybWF0cyB0aGUgdmlldyB2YWx1ZSB0byB0aGUgZm9ybSAnTU0gLyB5eSdcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGZvcm1hdChleHBTdHIsIGlzQWRkaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IGV4cFN0ci5zcGxpdCgnLycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9udGggPSB2YWx1ZXNbMF0gPyB2YWx1ZXNbMF0udHJpbSgpIDogJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB5ZWFyID0gdmFsdWVzWzFdID8gdmFsdWVzWzFdLnRyaW0oKS5zbGljZSgtMikgOiAnJztcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG9uJ3QgYWRkIHNsYXNoXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKCFpc0FkZGl0aW9uICYmICF5ZWFyKSB8fCBtb250aC5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1vbnRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGQgc2xhc2ggaW4gdGhlIHJpZ2h0IHNwb3RcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0FkZGl0aW9uICYmICF5ZWFyICYmIG1vbnRoLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7bW9udGguc2xpY2UoMCwgMil9IC8gJHttb250aC5zbGljZSgyKX1gO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7bW9udGh9IC8gJHt5ZWFyfWA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQuY2MtZXhwaXJ5JywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC5jYy1leHBpcnkuZGlyZWN0aXZlJyxcbl0pO1xuIiwiLyoqXG4gKiBAbmFtZSBiYy1jdmMgZGlyZWN0aXZlXG4gKiBAZGVzY3JpcHRpb24gQSBjdXN0b20gY29tcGxlbWVudGFyeSBkaXJlY3RpdmUgdG8gYW5ndWxhci1jcmVkaXQtY2FyZCdzIGBjY0N2Y2AgZGlyZWN0aXZlLlxuICogVG8gc3VwcG9ydCBhbGxvd2luZyBhbiBvcHRpb25hbCBjdmMgZmllbGQgKGkuZS4gU2VjdXJlbmV0KSwgdGhpcyBkaXJlY3RpdmUgbXVzdCBvdmVycmlkZVxuICogdGhlIHZhbGlkYXRpb24gcHJvdmlkZWQgYnkgY2NDdmMgZGlyZWN0aXZlLlxuICovXG5hbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQuYmMtY3ZjJywgW1xuICAgICdjcmVkaXQtY2FyZHMnLFxuXSlcbiAgICAuZGlyZWN0aXZlKCdiY0N2YycsIGZ1bmN0aW9uIGJjQ3ZjRGlyZWN0aXZlKCRwYXJzZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gYmNDdmNMaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGVzLCBuZ01vZGVsKSB7XG4gICAgICAgICAgICAgICAgLy8gb3ZlcnJpZGUgdGhlIHZhbGlkYXRpb24gdG8gYWx3YXlzIHJldHVybiB2YWxpZFxuICAgICAgICAgICAgICAgIC8vIGlmIGN2YyBpcyBub3QgcmVxdWlyZWRcbiAgICAgICAgICAgICAgICBpZiAoISRwYXJzZShhdHRyaWJ1dGVzLm5nUmVxdWlyZWQpKHNjb3BlKSkge1xuICAgICAgICAgICAgICAgICAgICBuZ01vZGVsLiR2YWxpZGF0b3JzLmNjQ3ZjID0gKCkgPT4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHJpb3JpdHk6IDUsIC8vIGhpZ2hlciBwcmlvcml0eSB0byBlbnN1cmUgY2NDdmMncyBsaW5rIGlzIHJhbiBmaXJzdFxuICAgICAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUuc2VydmljZScsIFtcbiAgICAndWkucm91dGVyJ1xuXSlcbiAgICAuZmFjdG9yeSgnQmNTZXJ2ZXJUYWJsZScsIGZ1bmN0aW9uIGJjU2VydmVyVGFibGUoJGxvZywgJHEsICRzdGF0ZSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBkZWZhdWx0VGFibGVDb25maWcgPSB7XG4gICAgICAgICAgICBmaWx0ZXJzOiBbXSxcbiAgICAgICAgICAgIHF1ZXJ5S2V5czoge1xuICAgICAgICAgICAgICAgIHBhZ2U6ICdwYWdlJyxcbiAgICAgICAgICAgICAgICBsaW1pdDogJ2xpbWl0JyxcbiAgICAgICAgICAgICAgICBzb3J0Qnk6ICdzb3J0LWJ5JyxcbiAgICAgICAgICAgICAgICBzb3J0RGlyOiAnc29ydC1vcmRlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByb3dJZEtleTogJ2lkJyxcbiAgICAgICAgICAgIHNvcnREaXJWYWx1ZXM6IHtcbiAgICAgICAgICAgICAgICBhc2M6ICdhc2MnLFxuICAgICAgICAgICAgICAgIGRlc2M6ICdkZXNjJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIFNlcnZlclRhYmxlKHRhYmxlSWQsIHRhYmxlQ29uZmlnKSB7XG4gICAgICAgICAgICB0aGlzLmFsbFNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmZpbHRlcnMgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuaWQgPSB0YWJsZUlkO1xuICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIHBhZ2U6IG51bGwsXG4gICAgICAgICAgICAgICAgbGltaXQ6IG51bGwsXG4gICAgICAgICAgICAgICAgdG90YWw6IG51bGxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLnBlbmRpbmdSZXF1ZXN0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnJlc291cmNlQ2FsbGJhY2sgPSBhbmd1bGFyLm5vb3A7XG4gICAgICAgICAgICB0aGlzLnJvd3MgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRSb3dzID0ge307XG4gICAgICAgICAgICB0aGlzLnNvcnRCeSA9ICcnO1xuICAgICAgICAgICAgdGhpcy5zb3J0RGlyID0gJyc7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMudGFibGVDb25maWcgPSBfLmlzT2JqZWN0KHRhYmxlQ29uZmlnKSA/IHRhYmxlQ29uZmlnIDoge307XG4gICAgICAgICAgICB0aGlzLnRhYmxlQ29uZmlnID0gXy5kZWZhdWx0cyh0aGlzLnRhYmxlQ29uZmlnLCBkZWZhdWx0VGFibGVDb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgU2VydmVyVGFibGUucHJvdG90eXBlID0ge1xuICAgICAgICAgICAgY3JlYXRlUGFyYW1zT2JqZWN0OiBjcmVhdGVQYXJhbXNPYmplY3QsXG4gICAgICAgICAgICBkZXNlbGVjdEFsbFJvd3M6IGRlc2VsZWN0QWxsUm93cyxcbiAgICAgICAgICAgIGZldGNoUmVzb3VyY2U6IGZldGNoUmVzb3VyY2UsXG4gICAgICAgICAgICBnZXRTZWxlY3RlZFJvd3M6IGdldFNlbGVjdGVkUm93cyxcbiAgICAgICAgICAgIGluaXQ6IGluaXQsXG4gICAgICAgICAgICBpc1Jvd1NlbGVjdGVkOiBpc1Jvd1NlbGVjdGVkLFxuICAgICAgICAgICAgbG9hZFN0YXRlUGFyYW1zOiBsb2FkU3RhdGVQYXJhbXMsXG4gICAgICAgICAgICBzZWxlY3RBbGxSb3dzOiBzZWxlY3RBbGxSb3dzLFxuICAgICAgICAgICAgc2V0UGFnaW5hdGlvblZhbHVlczogc2V0UGFnaW5hdGlvblZhbHVlcyxcbiAgICAgICAgICAgIHNldFJvd3M6IHNldFJvd3MsXG4gICAgICAgICAgICBzZXRTZWxlY3Rpb25Gb3JBbGxSb3dzOiBzZXRTZWxlY3Rpb25Gb3JBbGxSb3dzLFxuICAgICAgICAgICAgc2V0U29ydGluZ1ZhbHVlczogc2V0U29ydGluZ1ZhbHVlcyxcbiAgICAgICAgICAgIHVwZGF0ZVBhZ2U6IHVwZGF0ZVBhZ2UsXG4gICAgICAgICAgICB1cGRhdGVTb3J0OiB1cGRhdGVTb3J0LFxuICAgICAgICAgICAgdXBkYXRlVGFibGU6IHVwZGF0ZVRhYmxlLFxuICAgICAgICAgICAgdmFsaWRhdGVSZXNvdXJjZTogdmFsaWRhdGVSZXNvdXJjZVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZVBhcmFtc09iamVjdCgpIHtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB7fSxcbiAgICAgICAgICAgICAgICBxdWVyeUtleXMgPSB0aGlzLnRhYmxlQ29uZmlnLnF1ZXJ5S2V5cyxcbiAgICAgICAgICAgICAgICBxdWVyeVBhcmFtTWFwID0gW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5S2V5OiBxdWVyeUtleXMucGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLnBhZ2luYXRpb24ucGFnZVxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeUtleTogcXVlcnlLZXlzLmxpbWl0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMucGFnaW5hdGlvbi5saW1pdFxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeUtleTogcXVlcnlLZXlzLnNvcnRCeSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLnNvcnRCeVxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeUtleTogcXVlcnlLZXlzLnNvcnREaXIsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5zb3J0RGlyXG4gICAgICAgICAgICAgICAgICAgIH1dO1xuXG4gICAgICAgICAgICBfLmVhY2gocXVlcnlQYXJhbU1hcCwgZnVuY3Rpb24gcXVlcnlQYXJhbU1hcEVhY2gocGFyYW0pIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyYW0ucXVlcnlLZXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXNbcGFyYW0ucXVlcnlLZXldID0gcGFyYW0udmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIF8uZXh0ZW5kKHBhcmFtcywgdGhpcy5maWx0ZXJzKTtcblxuICAgICAgICAgICAgcmV0dXJuIHBhcmFtcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRlc2VsZWN0QWxsUm93cygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldFNlbGVjdGlvbkZvckFsbFJvd3MoZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmV0Y2hSZXNvdXJjZSgpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMucGVuZGluZ1JlcXVlc3QgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VDYWxsYmFjayh0aGlzLmNyZWF0ZVBhcmFtc09iamVjdCgpKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIHJlc291cmNlQ2FsbGJhY2tUaGVuKHJlc291cmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfdGhpcy52YWxpZGF0ZVJlc291cmNlKHJlc291cmNlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuc2V0Um93cyhyZXNvdXJjZS5yb3dzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnNldFBhZ2luYXRpb25WYWx1ZXMocmVzb3VyY2UucGFnaW5hdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gcmVzb3VyY2VDYWxsYmFja0NhdGNoKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICRsb2cuZXJyb3IoJ2JjLXNlcnZlci10YWJsZSBkaXJlY3RpdmU6IGZhaWxlZCB0byBmZXRjaCByZXNvdXJjZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZpbmFsbHkoZnVuY3Rpb24gcmVzb3VyY2VDYWxsYmFja0ZpbmFsbHkoKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnBlbmRpbmdSZXF1ZXN0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRTZWxlY3RlZFJvd3MoKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICByZXR1cm4gXy5maWx0ZXIodGhpcy5yb3dzLCBmdW5jdGlvbiBnZXRTZWxlY3RlZFJvd3NGaWx0ZXIocm93KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLmlzUm93U2VsZWN0ZWQocm93KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaW5pdChjb25maWcpIHtcbiAgICAgICAgICAgIGlmICghXy5pc09iamVjdChjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24oY29uZmlnLnJlc291cmNlQ2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUNhbGxiYWNrID0gY29uZmlnLnJlc291cmNlQ2FsbGJhY2s7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgICAgICAgICAgLmxvYWRTdGF0ZVBhcmFtcyhjb25maWcuc3RhdGVQYXJhbXMpXG4gICAgICAgICAgICAgICAgLmZldGNoUmVzb3VyY2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzUm93U2VsZWN0ZWQocm93KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZFJvd3Nbcm93W3RoaXMudGFibGVDb25maWcucm93SWRLZXldXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGxvYWRTdGF0ZVBhcmFtcyhzdGF0ZVBhcmFtcykge1xuICAgICAgICAgICAgdmFyIHF1ZXJ5S2V5cyA9IHRoaXMudGFibGVDb25maWcucXVlcnlLZXlzLFxuICAgICAgICAgICAgICAgIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgc3RhdGVQYXJhbXMgPSBzdGF0ZVBhcmFtcyB8fCAkc3RhdGVQYXJhbXM7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0UGFnaW5hdGlvblZhbHVlcyh7XG4gICAgICAgICAgICAgICAgcGFnZTogc3RhdGVQYXJhbXNbcXVlcnlLZXlzLnBhZ2VdLFxuICAgICAgICAgICAgICAgIGxpbWl0OiBzdGF0ZVBhcmFtc1txdWVyeUtleXMubGltaXRdXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5zZXRTb3J0aW5nVmFsdWVzKHN0YXRlUGFyYW1zW3F1ZXJ5S2V5cy5zb3J0QnldLCBzdGF0ZVBhcmFtc1txdWVyeUtleXMuc29ydERpcl0pO1xuXG4gICAgICAgICAgICAvLyBzZXQgZmlsdGVycyBmcm9tIHF1ZXJ5IHBhcmFtc1xuICAgICAgICAgICAgXy5lYWNoKHRoaXMudGFibGVDb25maWcuZmlsdGVycywgZnVuY3Rpb24gc2V0RmlsdGVyc0VhY2godmFsdWUpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5maWx0ZXJzW3ZhbHVlXSA9IHN0YXRlUGFyYW1zW3ZhbHVlXTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoaXMgaXMgYWN0dWFsbHkgYSB0b2dnbGUgbm90IGp1c3QgYSBzZWxlY3RcbiAgICAgICAgZnVuY3Rpb24gc2VsZWN0QWxsUm93cygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldFNlbGVjdGlvbkZvckFsbFJvd3MoIXRoaXMuYWxsU2VsZWN0ZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0UGFnaW5hdGlvblZhbHVlcyhwYWdpbmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRpb24gPSB0aGlzLnBhZ2luYXRpb24gfHwge307XG4gICAgICAgICAgICBfLmV4dGVuZCh0aGlzLnBhZ2luYXRpb24sIHBhZ2luYXRpb24pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldFJvd3Mocm93cykge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy5yb3dzID0gcm93cztcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRSb3dzID0gXy5yZWR1Y2Uocm93cywgZnVuY3Rpb24gaW5pdGlhbGl6ZVNlbGVjdGVkUm93c09iamVjdChhY2N1bSwgcm93KSB7XG4gICAgICAgICAgICAgICAgYWNjdW1bcm93W190aGlzLnRhYmxlQ29uZmlnLnJvd0lkS2V5XV0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjdW07XG4gICAgICAgICAgICB9LCB7fSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0U2VsZWN0aW9uRm9yQWxsUm93cyh2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgdmFsdWUgPSAhIXZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLmFsbFNlbGVjdGVkID0gdmFsdWU7XG5cbiAgICAgICAgICAgIF8uZWFjaCh0aGlzLnNlbGVjdGVkUm93cywgZnVuY3Rpb24gYWxsUm93c0l0ZXJhdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2VsZWN0ZWRSb3dzW2tleV0gPSBfdGhpcy5hbGxTZWxlY3RlZDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldFNvcnRpbmdWYWx1ZXMoc29ydEJ5LCBzb3J0RGlyKSB7XG4gICAgICAgICAgICB0aGlzLnNvcnRCeSA9IHNvcnRCeSB8fCB0aGlzLnNvcnRCeTtcbiAgICAgICAgICAgIHRoaXMuc29ydERpciA9IHNvcnREaXIgfHwgdGhpcy5zb3J0RGlyO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVBhZ2UocGFnZSwgbGltaXQsIHRvdGFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICAgICAgICAgIC5zZXRQYWdpbmF0aW9uVmFsdWVzKHBhZ2UsIGxpbWl0LCB0b3RhbClcbiAgICAgICAgICAgICAgICAudXBkYXRlVGFibGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVNvcnQoc29ydEJ5LCBzb3J0RGlyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICAgICAgICAgIC5zZXRTb3J0aW5nVmFsdWVzKHNvcnRCeSwgc29ydERpcilcbiAgICAgICAgICAgICAgICAuc2V0UGFnaW5hdGlvblZhbHVlcyh7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2U6IDFcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC51cGRhdGVUYWJsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlVGFibGUoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMucGVuZGluZ1JlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJHN0YXRlLmN1cnJlbnQubmFtZSwgdGhpcy5jcmVhdGVQYXJhbXNPYmplY3QoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdmFsaWRhdGVSZXNvdXJjZShyZXNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKCFfLmlzT2JqZWN0KHJlc291cmNlKSkge1xuICAgICAgICAgICAgICAgICRsb2cuZXJyb3IoJ2JjLXNlcnZlci10YWJsZSBkaXJlY3RpdmU6IFJlc291cmNlIGNhbGxiYWNrIG11c3QgcmV0dXJuIGFuIG9iamVjdCcpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFfLmlzQXJyYXkocmVzb3VyY2Uucm93cykpIHtcbiAgICAgICAgICAgICAgICAkbG9nLmVycm9yKCdiYy1zZXJ2ZXItdGFibGUgZGlyZWN0aXZlOiByZXR1cm5lZCBvYmplY3QgbXVzdCBjb250YWluIGEgcm93cyBwcm9wZXJ0eSB0aGF0IGlzIGFuIGFycmF5LicpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFfLmlzT2JqZWN0KHJlc291cmNlLnBhZ2luYXRpb24pKSB7XG4gICAgICAgICAgICAgICAgJGxvZy5lcnJvcignYmMtc2VydmVyLXRhYmxlIGRpcmVjdGl2ZTogcmV0dXJuZWQgb2JqZWN0IG11c3QgY29udGFpbiBhIHBhZ2luYXRpb24gcHJvcGVydHkgdGhhdCBpcyBhbiBvYmplY3QuJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBTZXJ2ZXJUYWJsZTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUtZmFjdG9yeS5zZXJ2aWNlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUuc2VydmljZSdcbl0pXG4gICAgLmZhY3RvcnkoJ2JjU2VydmVyVGFibGVGYWN0b3J5JywgZnVuY3Rpb24gYmNTZXJ2ZXJUYWJsZUZhY3RvcnkoJGxvZywgQmNTZXJ2ZXJUYWJsZSkge1xuICAgICAgICB2YXIgdGFibGVzID0ge30sXG4gICAgICAgICAgICBzZXJ2aWNlID0ge1xuICAgICAgICAgICAgICAgIGNyZWF0ZTogY3JlYXRlLFxuICAgICAgICAgICAgICAgIGdldDogZ2V0LFxuICAgICAgICAgICAgICAgIHJlbW92ZTogcmVtb3ZlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZSh0YWJsZUlkLCB0YWJsZUNvbmZpZykge1xuICAgICAgICAgICAgaWYgKHRhYmxlSWQgaW4gdGFibGVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2UuZ2V0KHRhYmxlSWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRhYmxlSWQpIHtcbiAgICAgICAgICAgICAgICB0YWJsZUlkID0gXy51bmlxdWVJZCgnYmMtc2VydmVyLXRhYmxlLWluc3RhbmNlLScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YWJsZXNbdGFibGVJZF0gPSBuZXcgQmNTZXJ2ZXJUYWJsZSh0YWJsZUlkLCB0YWJsZUNvbmZpZyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0YWJsZXNbdGFibGVJZF07XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXQodGFibGVJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRhYmxlc1t0YWJsZUlkXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZSh0YWJsZUlkKSB7XG4gICAgICAgICAgICBkZWxldGUgdGFibGVzW3RhYmxlSWRdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XG4gICAgfSk7XG4iLCIvKipcbiAqIEBuYW1lIHRydXN0QXNIdG1sXG4gKiBAZGVzY3JpcHRpb24gU2ltcGxlIHV0aWxpdHkgZmlsdGVyIHRvIHJ1biB0aGUgZ2l2ZW4gaHRtbCBzdHJpbmcgdGhyb3VnaCBhbmd1bGFyJ3MgJHNjZS50cnVzdEFzSHRtbCBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dCBUaGUgaHRtbCBzdHJpbmcgdG8gdHJ1c3RcbiAqIEByZXR1cm4ge1N0cmluZ30gQW4gYW5ndWxhci10cnVzdGVkIG9iamVjdCBjb250YWluaW5nIHRoZSBodG1sXG4gKlxuICogQGV4YW1wbGUgYDxwIG5nLWJpbmQtaHRtbD1cInJhd0h0bWwgfCB0cnVzdEFzSHRtbFwiPjwvcD5gXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi51dGlsLnRydXN0QXNIdG1sJywgW10pXG4gICAgLmZpbHRlcigndHJ1c3RBc0h0bWwnLCBmdW5jdGlvbiB0cnVzdEFzSHRtbCgkc2NlKXtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiAkc2NlLnRydXN0QXNIdG1sKHRleHQpO1xuICAgICAgICB9O1xuICAgIH0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9