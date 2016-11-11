'use strict';

angular.module('bcapp-pattern-lab', ['gettext', 'ngAnimate', 'ngMessages', 'mm.foundation', 'bcapp-pattern-lab-templates', 'bcapp-pattern-lab.bc-datepicker', 'bcapp-pattern-lab.bc-dropdown', 'bcapp-pattern-lab.bc-modal', 'bcapp-pattern-lab.bc-pagination', 'bcapp-pattern-lab.bc-server-table', 'bcapp-pattern-lab.checkbox-list', 'bcapp-pattern-lab.color-picker', 'bcapp-pattern-lab.credit-card', 'bcapp-pattern-lab.credit-card-types', 'bcapp-pattern-lab.form', 'bcapp-pattern-lab.form-field', 'bcapp-pattern-lab.form-input-color', 'bcapp-pattern-lab.html5Mode', 'bcapp-pattern-lab.icon', 'bcapp-pattern-lab.loading-notification', 'bcapp-pattern-lab.loading-overlay', 'bcapp-pattern-lab.sprite', 'bcapp-pattern-lab.switch', 'bcapp-pattern-lab.util']);
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

angular.module('bcapp-pattern-lab.color-picker-palette.controller', []).controller('ColorPickerPaletteCtrl', function () {
    var ctrl = this;

    ctrl.createNewColor = createNewColor;

    function createNewColor($event) {
        $event.preventDefault();

        ctrl.createNewPaletteColor();
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
            setNewColor: '='
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
    ctrl.setModelCtrl = setModelCtrl;
    ctrl.setNewColor = setNewColor;

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

angular.module('bcapp-pattern-lab.html5Mode', ['bcapp-pattern-lab.html5Mode.service']);
'use strict';

angular.module('bcapp-pattern-lab.html5Mode.service', []).provider('html5Mode', function html5ModeProvider($locationProvider) {
    this.$get = function html5ModeService() {
        return $locationProvider.html5Mode();
    };
});
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
                $scope.$watch('iconCtrl.glyph', function iconDirectiveLinkWatch(newValue) {
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
/*
 * Override angular foundation's $modalStack service to remove the `top` css property.
 * cannot use a decorator because the `open` relies on closures and does not return the compiled element.
 * Changes are between `// Changes` comments
*/
'use strict';

angular.module('bcapp-pattern-lab.bc-modal.modalStack.service', []).factory('$modalStack', ['$window', '$transition', '$timeout', '$document', '$compile', '$rootScope', '$$stackedMap', function ($window, $transition, $timeout, $document, $compile, $rootScope, $$stackedMap) {
  // Changes: change from `modal-open` to `has-activeModal`
  var OPENED_MODAL_CLASS = 'has-activeModal';
  // Changes

  var backdropDomEl, backdropScope;
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

    // Changes: deletion of css top property calculation
    var angularDomEl = angular.element('<div modal-window style="visibility: visible; display: block"></div>');
    angularDomEl.attr('window-class', modal.windowClass);
    angularDomEl.attr('index', openedWindows.length() - 1);
    angularDomEl.attr('animate', 'animate');
    angularDomEl.html(modal.content);

    var modalDomEl = $compile(angularDomEl)(modal.scope);
    openedWindows.top().value.modalDomEl = modalDomEl;
    body.append(modalDomEl);
    body.addClass(OPENED_MODAL_CLASS);
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

angular.module('bcapp-pattern-lab.util', ['bcapp-pattern-lab.util.trustAsHtml']);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJpZ2NvbW1lcmNlL2JjYXBwLXBhdHRlcm4tbGFiLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2JjLWRhdGVwaWNrZXIvYmMtZGF0ZXBpY2tlci5jb25zdGFudHMuanMiLCJiaWdjb21tZXJjZS9iYy1kYXRlcGlja2VyL2JjLWRhdGVwaWNrZXIuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvYmMtZGF0ZXBpY2tlci9iYy1kYXRlcGlja2VyLmpzIiwiYmlnY29tbWVyY2UvYmMtZHJvcGRvd24vYmMtZHJvcGRvd24tbWVudS5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9iYy1kcm9wZG93bi9iYy1kcm9wZG93bi10b2dnbGUuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvYmMtZHJvcGRvd24vYmMtZHJvcGRvd24uY29udHJvbGxlci5qcyIsImJpZ2NvbW1lcmNlL2JjLWRyb3Bkb3duL2JjLWRyb3Bkb3duLmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2JjLWRyb3Bkb3duL2JjLWRyb3Bkb3duLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2JjLXBhZ2luYXRpb24vYmMtcGFnaW5hdGlvbi5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9iYy1wYWdpbmF0aW9uL2JjLXBhZ2luYXRpb24ubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvYmMtc2VydmVyLXRhYmxlL2JjLXNlcnZlci10YWJsZS5jb250cm9sbGVyLmpzIiwiYmlnY29tbWVyY2UvYmMtc2VydmVyLXRhYmxlL2JjLXNlcnZlci10YWJsZS5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9iYy1zZXJ2ZXItdGFibGUvYmMtc2VydmVyLXRhYmxlLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2JjLXNlcnZlci10YWJsZS9iYy1zb3J0LWJ5LmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2NoZWNrYm94LWxpc3QvY2hlY2tib3gtbGlzdC5jb250cm9sbGVyLmpzIiwiYmlnY29tbWVyY2UvY2hlY2tib3gtbGlzdC9jaGVja2JveC1saXN0LmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2NoZWNrYm94LWxpc3QvY2hlY2tib3gtbGlzdC5tb2R1bGUuanMiLCJiaWdjb21tZXJjZS9jb2xvci1waWNrZXIvY29sb3ItcGlja2VyLXBhbGV0dGUuY29udHJvbGxlci5qcyIsImJpZ2NvbW1lcmNlL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXItcGFsZXR0ZS5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9jb2xvci1waWNrZXIvY29sb3ItcGlja2VyLmNvbnRyb2xsZXIuanMiLCJiaWdjb21tZXJjZS9jb2xvci1waWNrZXIvY29sb3ItcGlja2VyLmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXIubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQvY3JlZGl0LWNhcmQuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQvY3JlZGl0LWNhcmQubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQtdHlwZXMvY3JlZGl0LWNhcmQtdHlwZXMuY29uc3RhbnQuanMiLCJiaWdjb21tZXJjZS9jcmVkaXQtY2FyZC10eXBlcy9jcmVkaXQtY2FyZC10eXBlcy5jb250cm9sbGVyLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQtdHlwZXMvY3JlZGl0LWNhcmQtdHlwZXMuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQtdHlwZXMvY3JlZGl0LWNhcmQtdHlwZXMubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS9mb3JtLmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2Zvcm0vZm9ybS5tb2R1bGUuanMiLCJiaWdjb21tZXJjZS9mb3JtLWZpZWxkLWVycm9yL2Zvcm0tZmllbGQtZXJyb3IuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS1maWVsZC1lcnJvci9mb3JtLWZpZWxkLWVycm9yLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2Zvcm0tZmllbGQvZm9ybS1maWVsZC5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9mb3JtLWZpZWxkL2Zvcm0tZmllbGQubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS1maWVsZC1lcnJvcnMvZm9ybS1maWVsZC1lcnJvcnMuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS1maWVsZC1lcnJvcnMvZm9ybS1maWVsZC1lcnJvcnMubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS1pbnB1dC1jb2xvci9mb3JtLWlucHV0LWNvbG9yLmNvbnRyb2xsZXIuanMiLCJiaWdjb21tZXJjZS9mb3JtLWlucHV0LWNvbG9yL2Zvcm0taW5wdXQtY29sb3IuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS1pbnB1dC1jb2xvci9mb3JtLWlucHV0LWNvbG9yLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2h0bWw1TW9kZS9odG1sNU1vZGUubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvaHRtbDVNb2RlL2h0bWw1TW9kZS5zZXJ2aWNlLmpzIiwiYmlnY29tbWVyY2UvaWNvbi9pY29uLmNvbnRyb2xsZXIuanMiLCJiaWdjb21tZXJjZS9pY29uL2ljb24uZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvaWNvbi9pY29uLmpzIiwiYmlnY29tbWVyY2UvaWNvbi9pY29uLnN2Z1Jvb3RQYXRoLmpzIiwiYmlnY29tbWVyY2UvbG9hZGluZy1ub3RpZmljYXRpb24vbG9hZGluZy1ub3RpZmljYXRpb24uZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvbG9hZGluZy1ub3RpZmljYXRpb24vbG9hZGluZy1ub3RpZmljYXRpb24uanMiLCJiaWdjb21tZXJjZS9tb2RhbC9iYy1tb2RhbC5tb2RhbFN0YWNrLnNlcnZpY2UuanMiLCJiaWdjb21tZXJjZS9tb2RhbC9iYy1tb2RhbC5tb2R1bGUuanMiLCJiaWdjb21tZXJjZS9sb2FkaW5nLW92ZXJsYXkvbG9hZGluZy1vdmVybGF5LmNvbnRyb2xsZXIuanMiLCJiaWdjb21tZXJjZS9sb2FkaW5nLW92ZXJsYXkvbG9hZGluZy1vdmVybGF5LmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2xvYWRpbmctb3ZlcmxheS9sb2FkaW5nLW92ZXJsYXkuanMiLCJiaWdjb21tZXJjZS9zcHJpdGUvc3ByaXRlLmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL3Nwcml0ZS9zcHJpdGUuanMiLCJiaWdjb21tZXJjZS9zd2l0Y2gvc3dpdGNoLmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL3N3aXRjaC9zd2l0Y2gubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvdXRpbC91dGlsLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2JjLXNlcnZlci10YWJsZS9iYy1zZXJ2ZXItdGFibGUvYmMtc2VydmVyLXRhYmxlLnNlcnZpY2UuanMiLCJiaWdjb21tZXJjZS9iYy1zZXJ2ZXItdGFibGUvYmMtc2VydmVyLXRhYmxlLWZhY3RvcnkvYmMtc2VydmVyLXRhYmxlLWZhY3Rvcnkuc2VydmljZS5qcyIsImJpZ2NvbW1lcmNlL2NyZWRpdC1jYXJkL2NjLWV4cGlyeS9jYy1leHBpcnkuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQvY2MtZXhwaXJ5L2NjLWV4cGlyeS5tb2R1bGUuanMiLCJiaWdjb21tZXJjZS9jcmVkaXQtY2FyZC9jcmVkaXQtY2FyZC1jdnYvYmMtY3ZjLmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL3V0aWwvdHJ1c3RBc0h0bWwvdHJ1c3RBc0h0bWwuZmlsdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxDQUNoQyxTQUFTLEVBQ1QsV0FBVyxFQUNYLFlBQVksRUFDWixlQUFlLEVBQ2YsNkJBQTZCLEVBQzdCLGlDQUFpQyxFQUNqQywrQkFBK0IsRUFDL0IsNEJBQTRCLEVBQzVCLGlDQUFpQyxFQUNqQyxtQ0FBbUMsRUFDbkMsaUNBQWlDLEVBQ2pDLGdDQUFn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STtpQkFBQSxDQUFDO2FBQzFDO1NBQ0o7QUFDRCxnQkFBUSxFQUFFLENBQUM7QUFDWCxlQUFPLEVBQUUsU0FBUztBQUNsQixnQkFBUSxFQUFFLEdBQUc7S0FDaEIsQ0FBQztDQUNMLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7O0FDYlAsT0FBTyxDQUFDLE1BQU0sQ0FBQyxvQ0FBb0MsRUFBRSxFQUFFLENBQUMsQ0FDbkQsTUFBTSxDQUFDLGFBQWEsRUFBRSxTQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUM7QUFDN0MsV0FBTyxVQUFTLElBQUksRUFBRTtBQUNsQixlQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDakMsQ0FBQztDQUNMLENBQUMsQ0FBQyIsImZpbGUiOiJiY2FwcC1wYXR0ZXJuLWxhYi1jb21wb25lbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiJywgW1xuICAgICdnZXR0ZXh0JyxcbiAgICAnbmdBbmltYXRlJyxcbiAgICAnbmdNZXNzYWdlcycsXG4gICAgJ21tLmZvdW5kYXRpb24nLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi10ZW1wbGF0ZXMnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1kYXRlcGlja2VyJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtZHJvcGRvd24nLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1tb2RhbCcsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXBhZ2luYXRpb24nLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jaGVja2JveC1saXN0JyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY29sb3ItcGlja2VyJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC10eXBlcycsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0nLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWZpZWxkJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1pbnB1dC1jb2xvcicsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmh0bWw1TW9kZScsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmljb24nLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5sb2FkaW5nLW5vdGlmaWNhdGlvbicsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmxvYWRpbmctb3ZlcmxheScsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLnNwcml0ZScsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLnN3aXRjaCcsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLnV0aWwnXG5dKTtcbiIsIi8qIGdsb2JhbHMgbW9tZW50ICovXG5hbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtZGF0ZXBpY2tlci5jb25zdGFudHMnLCBbXSlcbiAgICAuY29uc3RhbnQoJ0JDX0RBVEVQSUNLRVJfREVGQVVMVFMnLCB7XG4gICAgICAgIGRheUZvcm1hdDogJ0QnLFxuICAgICAgICBpbnB1dEZvcm1hdDogbW9tZW50LmxvY2FsZURhdGEoKS5sb25nRGF0ZUZvcm1hdCgnTCcpLFxuICAgICAgICBzdHlsZXM6IHtcbiAgICAgICAgICAgIGJhY2s6ICdkYXRlcGlja2VyLWJhY2snLFxuICAgICAgICAgICAgY29udGFpbmVyOiAnZGF0ZXBpY2tlcicsXG4gICAgICAgICAgICBkYXRlOiAnZGF0ZXBpY2tlci1kYXRlJyxcbiAgICAgICAgICAgIGRheUJvZHk6ICdkYXRlcGlja2VyLWRheXMtYm9keScsXG4gICAgICAgICAgICBkYXlCb2R5RWxlbTogJ2RhdGVwaWNrZXItZGF5JyxcbiAgICAgICAgICAgIGRheUNvbmNlYWxlZDogJ2RhdGVwaWNrZXItZGF5LWNvbmNlYWxlZCcsXG4gICAgICAgICAgICBkYXlEaXNhYmxlZDogJ2lzLWRpc2FibGVkJyxcbiAgICAgICAgICAgIGRheUhlYWQ6ICdkYXRlcGlja2VyLWRheXMtaGVhZCcsXG4gICAgICAgICAgICBkYXlIZWFkRWxlbTogJ2RhdGVwaWNrZXItZGF5LW5hbWUnLFxuICAgICAgICAgICAgZGF5UHJldk1vbnRoOiAnZGF0ZXBpY2tlci1kYXktcHJldi1tb250aCcsXG4gICAgICAgICAgICBkYXlOZXh0TW9udGg6ICdkYXRlcGlja2VyLWRheS1uZXh0LW1vbnRoJyxcbiAgICAgICAgICAgIGRheVJvdzogJ2RhdGVwaWNrZXItZGF5cy1yb3cnLFxuICAgICAgICAgICAgZGF5VGFibGU6ICdkYXRlcGlja2VyLWRheXMnLFxuICAgICAgICAgICAgbW9udGg6ICdkYXRlcGlja2VyLW1vbnRoJyxcbiAgICAgICAgICAgIG1vbnRoTGFiZWw6ICdkYXRlcGlja2VyLW1vbnRoJyxcbiAgICAgICAgICAgIG5leHQ6ICdkYXRlcGlja2VyLW5leHQnLFxuICAgICAgICAgICAgcG9zaXRpb25lZDogJ2RhdGVwaWNrZXItYXR0YWNobWVudCcsXG4gICAgICAgICAgICBzZWxlY3RlZERheTogJ2lzLXNlbGVjdGVkJyxcbiAgICAgICAgICAgIHNlbGVjdGVkVGltZTogJ2RhdGVwaWNrZXItdGltZS1zZWxlY3RlZCcsXG4gICAgICAgICAgICB0aW1lOiAnZGF0ZXBpY2tlci10aW1lJyxcbiAgICAgICAgICAgIHRpbWVMaXN0OiAnZGF0ZXBpY2tlci10aW1lLWxpc3QnLFxuICAgICAgICAgICAgdGltZU9wdGlvbjogJ2RhdGVwaWNrZXItdGltZS1vcHRpb24nXG4gICAgICAgIH0sXG4gICAgICAgIHRpbWU6IGZhbHNlLFxuICAgICAgICB3ZWVrZGF5Rm9ybWF0OiAnc2hvcnQnXG4gICAgfSk7XG4iLCIvKiBnbG9iYWxzIHJvbWUgKi9cbmFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1kYXRlcGlja2VyLmRpcmVjdGl2ZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtZGF0ZXBpY2tlci5jb25zdGFudHMnXG5dKVxuICAgIC5kaXJlY3RpdmUoJ2JjRGF0ZXBpY2tlcicsIGZ1bmN0aW9uIGJjRGF0ZXBpY2tlckRpcmVjdGl2ZShCQ19EQVRFUElDS0VSX0RFRkFVTFRTKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBvcHRpb25zOiAnPT8nXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiBkYXRlcGlja2VyTGlua0Z1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgbmdNb2RlbCkge1xuICAgICAgICAgICAgICAgIGlmIChzY29wZS5vcHRpb25zID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUub3B0aW9ucyA9IHt9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEFkZCBkZWZhdWx0cyB0byB0aGUgb3B0aW9ucyBvYmplY3RcbiAgICAgICAgICAgICAgICBfLmRlZmF1bHRzKHNjb3BlLm9wdGlvbnMsIEJDX0RBVEVQSUNLRVJfREVGQVVMVFMpO1xuXG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IHJvbWUgKGNhbGVuZGFyKSBpbnN0YW5jZVxuICAgICAgICAgICAgICAgIHNjb3BlLmNhbGVuZGFyID0gcm9tZShlbGVtZW50WzBdLCBzY29wZS5vcHRpb25zKTtcblxuICAgICAgICAgICAgICAgIC8vIE9uICdkYXRhJyBldmVudCBzZXQgbmdNb2RlbCB0byB0aGUgcGFzc2VkIHZhbHVlXG4gICAgICAgICAgICAgICAgc2NvcGUuY2FsZW5kYXIub24oJ2RhdGEnLCBmdW5jdGlvbiBvbkRhdGEodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbmdNb2RlbC4kc2V0Vmlld1ZhbHVlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBzY29wZS5jYWxlbmRhci5vbigncmVhZHknLCBmdW5jdGlvbiBvblJlYWR5KG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJzLnBsYWNlaG9sZGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLiRzZXQoJ3BsYWNlaG9sZGVyJywgb3B0aW9ucy5pbnB1dEZvcm1hdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIFJlbW92aW5nIGNhbGVuZGFyIGV2ZW50IGxpc3RlbmVyc1xuICAgICAgICAgICAgICAgIGVsZW1lbnQub24oJyRkZXN0cm95JywgZnVuY3Rpb24gb25EZXN0cm95KCkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5jYWxlbmRhci5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtZGF0ZXBpY2tlcicsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtZGF0ZXBpY2tlci5kaXJlY3RpdmUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1kcm9wZG93bi1tZW51LmRpcmVjdGl2ZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ2JjRHJvcGRvd25NZW51JywgKCkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIHJlcXVpcmU6ICdeYmNEcm9wZG93bicsXG4gICAgICAgICAgICBjb21waWxlOiAodEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICB0RWxlbWVudC5hZGRDbGFzcygnZHJvcGRvd24tbWVudScpO1xuICAgICAgICAgICAgICAgIHRFbGVtZW50LmF0dHIoJ3JvbGUnLCAnbGlzdGJveCcpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGJjRHJvcGRvd25DdHJsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cignaWQnLCBiY0Ryb3Bkb3duQ3RybC5nZXRVbmlxdWVJZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgYmNEcm9wZG93bkN0cmwuZ2V0SXNPcGVuKCkpO1xuICAgICAgICAgICAgICAgICAgICAvLyBsaXN0ZW4gZm9yIGRyb3Bkb3ducyBiZWluZyBvcGVuZWQgYW5kIHRvZ2dsZSBhcmlhLWV4cGFuZGVkIHRvIHJlZmxlY3QgY3VycmVudCBzdGF0ZVxuICAgICAgICAgICAgICAgICAgICBzY29wZS4kb24oJ3RvZ2dsZVRoaXNEcm9wZG93bicsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cignYXJpYS1leHBhbmRlZCcsIGJjRHJvcGRvd25DdHJsLmdldElzT3BlbigpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1kcm9wZG93bi10b2dnbGUuZGlyZWN0aXZlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnYmNEcm9wZG93blRvZ2dsZScsICgkY29tcGlsZSkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIHRlcm1pbmFsOiB0cnVlLFxuICAgICAgICAgICAgcHJpb3JpdHk6IDEwMDEsIC8vIHNldCBoaWdoZXIgdGhhbiBuZy1yZXBlYXQgdG8gcHJldmVudCBkb3VibGUgY29tcGlsYXRpb25cbiAgICAgICAgICAgIHJlcXVpcmU6ICdeYmNEcm9wZG93bicsXG4gICAgICAgICAgICBjb21waWxlOiAodEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICB0RWxlbWVudC5yZW1vdmVBdHRyKCdiYy1kcm9wZG93bi10b2dnbGUnKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBiY0Ryb3Bkb3duQ3RybCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmF0dHIoJ2Ryb3Bkb3duLXRvZ2dsZScsICcjJyArIGJjRHJvcGRvd25DdHJsLmdldFVuaXF1ZUlkKCkpO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmF0dHIoJ2FyaWEtY29udHJvbHMnLCBiY0Ryb3Bkb3duQ3RybC5nZXRVbmlxdWVJZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5vbignY2xpY2snLCBiY0Ryb3Bkb3duQ3RybC50b2dnbGVJc09wZW4pO1xuICAgICAgICAgICAgICAgICAgICAkY29tcGlsZShlbGVtZW50KShzY29wZSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1kcm9wZG93bi5jb250cm9sbGVyJywgW10pXG4gICAgLmNvbnRyb2xsZXIoJ0JjRHJvcGRvd25Db250cm9sbGVyJywgZnVuY3Rpb24gYmNEcm9wZG93bkNvbnRyb2xsZXIoJHNjb3BlLCAkcm9vdFNjb3BlKSB7XG4gICAgICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xuICAgICAgICBsZXQgaXNPcGVuID0gZmFsc2U7XG4gICAgICAgIGxldCB1bmlxdWVJZDtcblxuICAgICAgICBjdHJsLmNsb3NlRHJvcGRvd24gPSBjbG9zZURyb3Bkb3duO1xuICAgICAgICBjdHJsLmdldElzT3BlbiA9IGdldElzT3BlbjtcbiAgICAgICAgY3RybC5nZXRVbmlxdWVJZCA9IGdldFVuaXF1ZUlkO1xuICAgICAgICBjdHJsLnNldElzT3BlbiA9IHNldElzT3BlbjtcbiAgICAgICAgY3RybC50b2dnbGVJc09wZW4gPSB0b2dnbGVJc09wZW47XG5cbiAgICAgICAgLy8gbGlzdGVuIGZvciBvdGhlciBkcm9wZG93bnMgYmVpbmcgb3BlbmVkIGluIHRoZSBhcHAuXG4gICAgICAgICRzY29wZS4kb24oJ2JjRHJvcGRvd25Ub2dnbGUnLCAoZXZlbnQsIHRyaWdnZXJpbmdJRCkgPT4ge1xuICAgICAgICAgICAgLy8gaWYgSSdtIG9wZW4gYW5kIG5vdCB0aGUgZHJvcGRvd24gYmVpbmcgdHJpZ2dlcmVkLCB0aGVuIEkgc2hvdWxkIGNsb3NlXG4gICAgICAgICAgICBpZiAoaXNPcGVuICYmIHRyaWdnZXJpbmdJRCAhPT0gdW5pcXVlSWQpIHtcbiAgICAgICAgICAgICAgICBjdHJsLmNsb3NlRHJvcGRvd24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZnVuY3Rpb24gY2xvc2VEcm9wZG93bigpIHtcbiAgICAgICAgICAgIGN0cmwuc2V0SXNPcGVuKGZhbHNlKTtcbiAgICAgICAgICAgICRzY29wZS4kYnJvYWRjYXN0KCd0b2dnbGVUaGlzRHJvcGRvd24nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldElzT3BlbigpIHtcbiAgICAgICAgICAgIHJldHVybiBpc09wZW47XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRVbmlxdWVJZCgpIHtcbiAgICAgICAgICAgIGlmICghdW5pcXVlSWQpIHtcbiAgICAgICAgICAgICAgICB1bmlxdWVJZCA9IF8udW5pcXVlSWQoJ2JjLWRyb3Bkb3duLScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHVuaXF1ZUlkO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0SXNPcGVuKHZhbCkge1xuICAgICAgICAgICAgaXNPcGVuID0gdmFsO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlSXNPcGVuKCkge1xuICAgICAgICAgICAgaXNPcGVuID0gIWlzT3BlbjtcbiAgICAgICAgICAgIC8vIHRlbGwgY2hpbGQgZGlyZWN0aXZlcyBhIHRvZ2dsZSBpbiBvcGVuIHN0YXR1cyBoYXMgb2NjdXJyZWRcbiAgICAgICAgICAgICRzY29wZS4kYnJvYWRjYXN0KCd0b2dnbGVUaGlzRHJvcGRvd24nKTtcbiAgICAgICAgICAgIC8vIHRlbGwgYXBwbGljYXRpb24gdGhhdCBhIGRyb3Bkb3duIGhhcyBiZWVuIG9wZW5lZCBzbyBvdGhlcnMgY2FuIGNsb3NlXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2JjRHJvcGRvd25Ub2dnbGUnLCB1bmlxdWVJZCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1kcm9wZG93bi5kaXJlY3RpdmUnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRyb3Bkb3duLmNvbnRyb2xsZXInXG5dKVxuICAgIC5kaXJlY3RpdmUoJ2JjRHJvcGRvd24nLCAoJGRvY3VtZW50KSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0JjRHJvcGRvd25Db250cm9sbGVyJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2JjRHJvcGRvd25Db250cm9sbGVyJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgY29tcGlsZTogKHRFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdEVsZW1lbnQuYXR0cigncm9sZScsICdjb21ib2JveCcpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuICgkc2NvcGUsICRlbGVtZW50LCBhdHRycywgY3RybCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIGRpcmVjdGl2ZSBpcyBhIGNvbXBvc2l0ZSBvZiAyIHNlcGFyYXRlIEZvdW5kYXRpb24gZGlyZWN0aXZlc1xuICAgICAgICAgICAgICAgICAgICAvLyB3aGljaCBkb24ndCBwcm92aWRlIGhvb2tzIHRvIGtub3cgd2hlbiBpdCdzIGNsaWNrZWQgb3Igb3BlbmVkXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZXkgZG8gaG93ZXZlciBkZWFsIHdpdGggcHJvcGFnYXRpb24gb2YgZXZlbnRzIHNvIHRoaXMsIHNvbWV3aGF0IGJsaW5kXG4gICAgICAgICAgICAgICAgICAgIC8vIGRvY3VtZW50IGV2ZW50IGlzIHNhZmUuIEFsbCBpdCBkb2VzIGlzIHN3YXAgYXJpYSBzdGF0ZXMgYXQgdGhlIG1vbWVudFxuICAgICAgICAgICAgICAgICAgICAvLyBpbiBhIGNoZWFwIHdheSB0byBrZWVwIHRoaXMgZGlyZWN0aXZlIGluIHN5bmMgd2l0aCBpdCdzIGNoaWxkIGRpcmVjdGl2ZVxuICAgICAgICAgICAgICAgICAgICAkZG9jdW1lbnQub24oJ2NsaWNrJywgY3RybC5jbG9zZURyb3Bkb3duKTtcblxuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5vbignJGRlc3Ryb3knLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZG9jdW1lbnQub2ZmKCdjbGljaycsIGN0cmwuY2xvc2VEcm9wZG93bik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtZHJvcGRvd24nLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRyb3Bkb3duLmRpcmVjdGl2ZScsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRyb3Bkb3duLXRvZ2dsZS5kaXJlY3RpdmUnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1kcm9wZG93bi1tZW51LmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXBhZ2luYXRpb24uZGlyZWN0aXZlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnYmNQYWdpbmF0aW9uJywgZnVuY3Rpb24gYmNQYWdpbmF0aW9uRGlyZWN0aXZlKCRwYXJzZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHNjb3BlOiB0cnVlLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvanMvYmlnY29tbWVyY2UvYmMtcGFnaW5hdGlvbi9iYy1wYWdpbmF0aW9uLnRwbC5odG1sJyxcblxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gYmNQYWdpbmF0aW9uQ29tcGlsZSh0RWxlbWVudCwgdEF0dHJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJPYmogPSB7fTtcblxuICAgICAgICAgICAgICAgIC8vIFNpbmNlIHRoaXMgaXMgYSB3cmFwcGVyIG9mIGFuZ3VsYXItZm91bmRhdGlvbidzIHBhZ2luYXRpb24gZGlyZWN0aXZlIHdlIG5lZWQgdG8gY29weSBhbGxcbiAgICAgICAgICAgICAgICAvLyBvZiB0aGUgYXR0cmlidXRlcyBwYXNzZWQgdG8gb3VyIGRpcmVjdGl2ZSBhbmQgc3RvcmUgdGhlbSBpbiB0aGUgYXR0ck9iai5cbiAgICAgICAgICAgICAgICBfLmVhY2godEF0dHJzLiRhdHRyLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleSAhPT0gJ2NsYXNzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ck9ialtrZXldID0gdEVsZW1lbnQuYXR0cihrZXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBBZGRpbmcgb3VyIGN1c3RvbSBjYWxsYmFjayB0byB0aGUgYXR0ck9iaiwgYW5ndWxhci1mb3VuZGF0aW9uIHdpbGwgY2FsbCB0aGlzIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgLy8gd2hlbiBhIHBhZ2UgbnVtYmVyIGlzIGNsaWNrZWQgaW4gdGhlIHBhZ2luYXRpb24uXG4gICAgICAgICAgICAgICAgYXR0ck9ialsnb24tc2VsZWN0LXBhZ2UnXSA9ICdwYWdpbmF0aW9uQ2FsbGJhY2socGFnZSknO1xuXG4gICAgICAgICAgICAgICAgLy8gQWRkIGFsbCB0aGUgYXR0cmlidXRlcyB0byBhbmd1bGFyLWZvdW5kYXRpb24ncyBwYWdpbmF0aW9uIGRpcmVjdGl2ZVxuICAgICAgICAgICAgICAgIHRFbGVtZW50LmZpbmQoJ3BhZ2luYXRpb24nKS5hdHRyKGF0dHJPYmopO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGJjUGFnaW5hdGlvbkxpbmsoJHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb25DaGFuZ2VQYXJzZUdldHRlciA9ICRwYXJzZShhdHRycy5vbkNoYW5nZSksXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0TGltaXRzID0gWzEwLCAyMCwgMzAsIDUwLCAxMDBdO1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zZXRMaW1pdCA9IGZ1bmN0aW9uKGxpbWl0LCBldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0ID0gXy5wYXJzZUludChsaW1pdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcGFyc2UoYXR0cnMuaXRlbXNQZXJQYWdlKS5hc3NpZ24oJHNjb3BlLiRwYXJlbnQsIGxpbWl0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5wYWdpbmF0aW9uQ2FsbGJhY2soMSwgbGltaXQpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5nZXRDdXJyZW50UGFnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRwYXJzZShhdHRycy5wYWdlKSgkc2NvcGUuJHBhcmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmdldEN1cnJlbnRMaW1pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRwYXJzZShhdHRycy5pdGVtc1BlclBhZ2UpKCRzY29wZS4kcGFyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZ2V0SXRlbXNQZXJQYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHBhcnNlKGF0dHJzLml0ZW1zUGVyUGFnZSkoJHNjb3BlLiRwYXJlbnQpIHx8IDA7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmdldFRvdGFsSXRlbXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcGFyc2UoYXR0cnMudG90YWxJdGVtcykoJHNjb3BlLiRwYXJlbnQpIHx8IDA7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNob3cgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcGFyc2UoYXR0cnMuYWx3YXlzU2hvdykoJHNjb3BlLiRwYXJlbnQpIHx8ICRzY29wZS5nZXRUb3RhbEl0ZW1zKCkgPiAkc2NvcGUuZ2V0SXRlbXNQZXJQYWdlKCk7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNob3dMaW1pdHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkc2NvcGUuc2hvdygpICYmICRwYXJzZShhdHRycy5zaG93TGltaXRzKSgkc2NvcGUuJHBhcmVudCkgIT09IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5nZXRMaW1pdHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaW1pdHMgPSAkcGFyc2UoYXR0cnMubGltaXRzKSgkc2NvcGUuJHBhcmVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShsaW1pdHMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRMaW1pdHM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsaW1pdHM7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnBhZ2luYXRpb25DYWxsYmFjayA9IGZ1bmN0aW9uKHBhZ2UsIGxpbWl0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWRkaXRpb25hbFNjb3BlUHJvcGVydGllcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGltaXQ6IGxpbWl0IHx8ICRzY29wZS5nZXRDdXJyZW50TGltaXQoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogcGFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2VQYXJzZVJlc3VsdDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJHBhcnNlKGF0dHJzLnBhZ2UpLmFzc2lnbigkc2NvcGUuJHBhcmVudCwgcGFnZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlUGFyc2VSZXN1bHQgPSBvbkNoYW5nZVBhcnNlR2V0dGVyKCRzY29wZSwgYWRkaXRpb25hbFNjb3BlUHJvcGVydGllcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBvbkNoYW5nZSBzdHJpbmcgaXMgYSBmdW5jdGlvbiBhbmQgbm90IGFuIGV4cHJlc3Npb246IGNhbGwgaXQgd2l0aCB0aGUgYWRkaXRpb25hbFNjb3BlUHJvcGVydGllcyBvYmogKGZvciBiYWNrd2FyZHMgY29tcGF0YWJpbGl0eSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVsc2UgdGhlIGV4cHJlc3Npb24gaGFzIGFscmVhZHkgYmVlbiByYW46IGRvIG5vdGhpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb25DaGFuZ2VQYXJzZVJlc3VsdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlUGFyc2VSZXN1bHQoYWRkaXRpb25hbFNjb3BlUHJvcGVydGllcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1wYWdpbmF0aW9uJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1wYWdpbmF0aW9uLmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXNlcnZlci10YWJsZS5jb250cm9sbGVyJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUuc2VydmljZSdcbl0pXG5cbiAgICAuY29udHJvbGxlcignQmNTZXJ2ZXJUYWJsZUN0cmwnLCBmdW5jdGlvbiBCY1NlcnZlclRhYmxlQ3RybCgkYXR0cnMsICRsb2csICRwYXJzZSwgJHNjb3BlLCBCY1NlcnZlclRhYmxlKSB7XG4gICAgICAgIHZhciBjdHJsID0gdGhpcyxcbiAgICAgICAgICAgIGJjU2VydmVyVGFibGVQcm90b3R5cGUgPSBCY1NlcnZlclRhYmxlLnByb3RvdHlwZTtcblxuICAgICAgICAvLyBDYWxsIHRoZSBCY1NlcnZlclRhYmxlIGNvbnN0cnVjdG9yIG9uIHRoZSBjb250cm9sbGVyXG4gICAgICAgIC8vIGluIG9yZGVyIHRvIHNldCBhbGwgdGhlIGNvbnRyb2xsZXIgcHJvcGVydGllcyBkaXJlY3RseS5cbiAgICAgICAgLy8gVGhpcyBpcyBoZXJlIGZvciBiYWNrd2FyZHMgY29tcGF0YWJpbGl0eSBwdXJwb3Nlcy5cbiAgICAgICAgQmNTZXJ2ZXJUYWJsZS5jYWxsKGN0cmwsIG51bGwsICgkcGFyc2UoJGF0dHJzLnRhYmxlQ29uZmlnKSgkc2NvcGUpKSk7XG5cbiAgICAgICAgLy8gY29udHJvbGxlciBmdW5jdGlvbnNcbiAgICAgICAgY3RybC5jcmVhdGVQYXJhbXNPYmplY3QgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLmNyZWF0ZVBhcmFtc09iamVjdDtcbiAgICAgICAgY3RybC5kZXNlbGVjdEFsbFJvd3MgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLmRlc2VsZWN0QWxsUm93cztcbiAgICAgICAgY3RybC5mZXRjaFJlc291cmNlID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS5mZXRjaFJlc291cmNlO1xuICAgICAgICBjdHJsLmdldFNlbGVjdGVkUm93cyA9IGJjU2VydmVyVGFibGVQcm90b3R5cGUuZ2V0U2VsZWN0ZWRSb3dzO1xuICAgICAgICBjdHJsLmluaXQgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLmluaXQ7XG4gICAgICAgIGN0cmwuaXNSb3dTZWxlY3RlZCA9IGJjU2VydmVyVGFibGVQcm90b3R5cGUuaXNSb3dTZWxlY3RlZDtcbiAgICAgICAgY3RybC5sb2FkU3RhdGVQYXJhbXMgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLmxvYWRTdGF0ZVBhcmFtcztcbiAgICAgICAgY3RybC5zZWxlY3RBbGxSb3dzID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS5zZWxlY3RBbGxSb3dzO1xuICAgICAgICBjdHJsLnNldFBhZ2luYXRpb25WYWx1ZXMgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLnNldFBhZ2luYXRpb25WYWx1ZXM7XG4gICAgICAgIGN0cmwuc2V0Um93cyA9IGJjU2VydmVyVGFibGVQcm90b3R5cGUuc2V0Um93cztcbiAgICAgICAgY3RybC5zZXRTZWxlY3Rpb25Gb3JBbGxSb3dzID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS5zZXRTZWxlY3Rpb25Gb3JBbGxSb3dzO1xuICAgICAgICBjdHJsLnNldFNvcnRpbmdWYWx1ZXMgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLnNldFNvcnRpbmdWYWx1ZXM7XG4gICAgICAgIGN0cmwudXBkYXRlUGFnZSA9IF8uYmluZChiY1NlcnZlclRhYmxlUHJvdG90eXBlLnVwZGF0ZVBhZ2UsIGN0cmwpO1xuICAgICAgICBjdHJsLnVwZGF0ZVNvcnQgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLnVwZGF0ZVNvcnQ7XG4gICAgICAgIGN0cmwudXBkYXRlVGFibGUgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLnVwZGF0ZVRhYmxlO1xuICAgICAgICBjdHJsLnZhbGlkYXRlUmVzb3VyY2UgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLnZhbGlkYXRlUmVzb3VyY2U7XG5cbiAgICAgICAgaW5pdCgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICB2YXIgcmVzb3VyY2VDYWxsYmFjaztcblxuICAgICAgICAgICAgcmVzb3VyY2VDYWxsYmFjayA9ICRwYXJzZSgkYXR0cnMucmVzb3VyY2VDYWxsYmFjaykoJHNjb3BlKTtcbiAgICAgICAgICAgIGlmICghXy5pc0Z1bmN0aW9uKHJlc291cmNlQ2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgJGxvZy5lcnJvcignYmMtc2VydmVyLXRhYmxlIGRpcmVjdGl2ZTogcmVzb3VyY2UtY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN0cmwucmVzb3VyY2VDYWxsYmFjayA9IHJlc291cmNlQ2FsbGJhY2s7XG5cbiAgICAgICAgICAgIGN0cmwuaW5pdCgpO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtc2VydmVyLXRhYmxlLmRpcmVjdGl2ZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtc2VydmVyLXRhYmxlLmNvbnRyb2xsZXInLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUuc29ydC1ieS5kaXJlY3RpdmUnLFxuICAgICd1aS5yb3V0ZXInXG5dKVxuICAgIC8qKlxuICAgICAqIFRoZSBiYy1zZXJ2ZXItdGFibGUgZGlyZWN0aXZlIGNyZWF0ZXMgYSBkYXRhIHRhYmxlIHRoYXQgaGFuZGxlc1xuICAgICAqIHNlcnZlciBzaWRlIHBhZ2luYXRpb24sIHNvcnRpbmcsIGFuZCBmaWx0ZXJpbmcuIEl0IGV4cG9zZXMgYSBmZXcgc2NvcGUgdmFyaWFibGVzLFxuICAgICAqIHRoYXQgY2FuIGJlIHVzZWQgdG8gZGlzcGxheSB0aGUgdGFibGUgY29udGVudCB3aXRoIGN1c3RvbSBtYXJrdXAgKHNlZSBleGFtcGxlXG4gICAgICogaW4gdGhlIHBhdHRlcm4gbGFiIGZvciBhbiBhY3R1YWwgaW1wbGVtZW50YXRpb24gb2YgdGhlIGJjLXNlcnZlci10YWJsZSkuXG4gICAgICpcbiAgICAgKiBUaGUgZm9sbG93aW5nIGF0dHJpYnV0ZXMgY2FuIGJlIHBhc3NlZCBpbiBvcmRlciB0byBjb25maWd1cmUgdGhlIGJjLXNlcnZlci10YWJsZTpcbiAgICAgKiAtIHJlc291cmNlLWNhbGxiYWNrIChyZXF1aXJlZClcbiAgICAgKiAtIHRhYmxlQ29uZmlnIChvcHRpb25hbClcbiAgICAgKlxuICAgICAqIC0gcmVzb3VyY2UtY2FsbGJhY2sgLSBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2Ugd2hpY2ggaXMgcmVzb3ZsZWRcbiAgICAgKiB3aXRoIGFuIG9iamVjdCBvZiB0aGUgZm9sbG93aW5nIGZvcm1hdDpcbiAgICAgKiAgICAgIHtcbiAgICAgKiAgICAgICAgICByb3dzOiBBcnJheSxcbiAgICAgKiAgICAgICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICogICAgICAgICAgICAgIHBhZ2U6IE51bWJlcixcbiAgICAgKiAgICAgICAgICAgICAgbGltaXQ6IE51bWJlcixcbiAgICAgKiAgICAgICAgICAgICAgdG90YWw6IE51bWJlclxuICAgICAqICAgICAgICAgIH1cbiAgICAgKiAgICAgIH1cbiAgICAgKlxuICAgICAqIFRoaXMgZGlyZWN0aXZlIGV4cG9zZXMgYSBzY29wZSB2YXJpYWJsZSBjYWxsZWQgYmNTZXJ2ZXJUYWJsZSB0aGF0XG4gICAgICogY2FuIGJlIHVzZWQgdG8gZGlzcGxheSBjb250ZW50LCBhbmQgaW1wbGVtZW50IGFkZGl0aW9uYWwgZnVuY3Rpb25hbGl0eVxuICAgICAqIHRvIHRoZSB0YWJsZSAoc3VjaCBhcyBwYWdpbmF0aW9uLCBzb3J0aW5nLCBhbmQgc2VsZWN0aW9uIGxvZ2ljKS5cbiAgICAgKlxuICAgICAqIC0gYmNTZXJ2ZXJUYWJsZS5yb3dzXG4gICAgICogICAgICAtIENhbiBiZSB1c2VkIHdpdGggbmctcmVwZWF0IHRvIGRpc3BsYXkgdGhlIGRhdGFcbiAgICAgKiAtIGJjU2VydmVyVGFibGUuZmlsdGVyc1xuICAgICAqICAgICAgLSBDYW4gYmUgdXNlZCB0byBjaGFuZ2UvdXBkYXRlIGZpbHRlcnMuIFRoZXNlIGZpbHRlcnMgbXVzdCBhcHBlYXJcbiAgICAgKiAgICAgICAgaW4gdGhlIHN0YXRlIGRlZmluaXRpb24gaW4gb3JkZXIgdG8gd29yayBjb3JyZWN0bHkuXG4gICAgICogLSBiY1NlcnZlclRhYmxlLnVwZGF0ZVRhYmxlKClcbiAgICAgKiAgICAgIC0gUGVyZm9ybSBhIHN0YXRlIHRyYW5zaXN0aW9uIHdpdGggdGhlIGN1cnJlbnQgdGFibGUgaW5mb1xuICAgICAqIC0gYmNTZXJ2ZXJUYWJsZS5wYWdpbmF0aW9uXG4gICAgICogICAgICAtIGV4cG9zZXMgcGFnZSwgbGltaXQsIGFuZCB0b3RhbFxuICAgICAqIC0gYmNTZXJ2ZXJUYWJsZS5zZXRQYWdpbmF0aW9uVmFsdWVzKHBhZ2luYXRpb24pXG4gICAgICogICAgICAtIGNvbnZlbmllbmNlIG1ldGhvZCBmb3Igc2V0dGluZyBwYWdpbmF0aW9uIHZhbHVlcyBhdCBvbmNlLlxuICAgICAqXG4gICAgICogLSBiY1NlcnZlclRhYmxlLnNlbGVjdGVkUm93c1xuICAgICAqICAgICAgLSBhbiBtYXAgb2JqZWN0IHdpdGggdW5pcXVlIGlkJ3MgYXMga2V5cyBhbmQgYm9vbGVhbiB2YWx1ZXMgYXMgdGhlIHNlbGVjdGVkIHN0YXRlXG4gICAgICogLSBiY1NlcnZlclRhYmxlLmFsbFNlbGVjdGVkXG4gICAgICogICAgICAtIGEgYm9vbGVhbiB2YWx1ZSB1c2VkIHRvIGRldGVybWluZSBpZiBhbGwgcm93cyB3ZXJlIHNlbGVjdGVkIG9yIGNsZWFyZWRcbiAgICAgKiAtIGJjU2VydmVyVGFibGUuc2VsZWN0QWxsUm93cygpXG4gICAgICogICAgICAtIHRvZ2dsZSBhbGwgcm93cyBzZWxlY3Rpb24gc3RhdGVcbiAgICAgKiAtIGJjU2VydmVyVGFibGUuaXNSb3dTZWxlY3RlZChyb3cpXG4gICAgICogICAgICAtIGhlbHBlciBmdW5jdGlvbiB0byBkZXRlcm1pbmUgaWYgYSByb3cgaXMgc2VsZWN0ZWRcbiAgICAgKiAtIGJjU2VydmVyVGFibGUuZ2V0U2VsZWN0ZWRSb3dzKClcbiAgICAgKiAgICAgIC0gZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGFycmF5IG9mIHJvdyBvYmplY3RzIHRoYXQgYXJlIGN1cnJlbnRseSBzZWxlY3RlZFxuICAgICAqXG4gICAgICovXG4gICAgLmRpcmVjdGl2ZSgnYmNTZXJ2ZXJUYWJsZScsIGZ1bmN0aW9uIGJjU2VydmVyVGFibGVEaXJlY3RpdmUoJHBhcnNlKSB7XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCY1NlcnZlclRhYmxlQ3RybCBhcyBiY1NlcnZlclRhYmxlJyxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIGJjU2VydmVyVGFibGVMaW5rKCRzY29wZSwgZWxlbWVudCwgYXR0cnMsIGJjU2VydmVyVGFibGVDdHJsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGF0dHJzLnRhYmxlQ29udHJvbGxlcikge1xuICAgICAgICAgICAgICAgICAgICAvLyBleHBvc2UgYmNTZXJ2ZXJUYWJsZUN0cmwgdG8gdGFibGVDb250cm9sbGVyIGlmIGl0IGV4aXN0c1xuICAgICAgICAgICAgICAgICAgICAkcGFyc2UoYXR0cnMudGFibGVDb250cm9sbGVyKS5hc3NpZ24oJHNjb3BlLCBiY1NlcnZlclRhYmxlQ3RybCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtc2VydmVyLXRhYmxlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUuZGlyZWN0aXZlJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtc2VydmVyLXRhYmxlLnNvcnQtYnkuZGlyZWN0aXZlJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtc2VydmVyLXRhYmxlLWZhY3Rvcnkuc2VydmljZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXNlcnZlci10YWJsZS5zb3J0LWJ5LmRpcmVjdGl2ZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtc2VydmVyLXRhYmxlLWZhY3Rvcnkuc2VydmljZSdcbl0pXG4gICAgLmRpcmVjdGl2ZSgnYmNTb3J0QnknLCBmdW5jdGlvbiBiY1NvcnRCeURpcmVjdGl2ZSgkbG9nLCBiY1NlcnZlclRhYmxlRmFjdG9yeSkge1xuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvanMvYmlnY29tbWVyY2UvYmMtc2VydmVyLXRhYmxlL2JjLXNvcnQtYnkudHBsLmh0bWwnLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIHNvcnRWYWx1ZTogJ0AnLFxuICAgICAgICAgICAgICAgIGNvbHVtbk5hbWU6ICdAJyxcbiAgICAgICAgICAgICAgICB0YWJsZUlkOiAnQCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXF1aXJlOiAnP15eYmNTZXJ2ZXJUYWJsZScsXG4gICAgICAgICAgICBsaW5rOiBiY1NvcnRCeURpcmVjdGl2ZUxpbmtcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBiY1NvcnRCeURpcmVjdGl2ZUxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBiY1NlcnZlclRhYmxlQ3RybCkge1xuICAgICAgICAgICAgdmFyIGJjU2VydmVyVGFibGUsXG4gICAgICAgICAgICAgICAgc29ydERpclZhbHVlcztcblxuICAgICAgICAgICAgaWYgKHNjb3BlLnRhYmxlSWQpIHtcbiAgICAgICAgICAgICAgICBiY1NlcnZlclRhYmxlID0gYmNTZXJ2ZXJUYWJsZUZhY3RvcnkuZ2V0KHNjb3BlLnRhYmxlSWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChiY1NlcnZlclRhYmxlQ3RybCkge1xuICAgICAgICAgICAgICAgIGJjU2VydmVyVGFibGUgPSBiY1NlcnZlclRhYmxlQ3RybDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGxvZy5lcnJvcignYmMtc29ydC1ieSBkaXJlY3RpdmUgcmVxdWlyZXMgYSB0YWJsZS1pZCwgb3IgYSBwYXJlbnQgYmNTZXJ2ZXJUYWJsZUN0cmwgZGlyZWN0aXZlLicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzb3J0RGlyVmFsdWVzID0gYmNTZXJ2ZXJUYWJsZS50YWJsZUNvbmZpZy5zb3J0RGlyVmFsdWVzO1xuXG4gICAgICAgICAgICBzY29wZS5hc2MgPSBzb3J0RGlyVmFsdWVzLmFzYztcbiAgICAgICAgICAgIHNjb3BlLmRlc2MgPSBzb3J0RGlyVmFsdWVzLmRlc2M7XG4gICAgICAgICAgICBzY29wZS5zb3J0QnkgPSBiY1NlcnZlclRhYmxlLnNvcnRCeTtcbiAgICAgICAgICAgIHNjb3BlLnNvcnREaXIgPSBiY1NlcnZlclRhYmxlLnNvcnREaXI7XG4gICAgICAgICAgICBzY29wZS5zb3J0ID0gc29ydDtcblxuICAgICAgICAgICAgZnVuY3Rpb24gc29ydCgkZXZlbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgc29ydEJ5LFxuICAgICAgICAgICAgICAgICAgICBzb3J0RGlyO1xuXG4gICAgICAgICAgICAgICAgaWYgKCRldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoYmNTZXJ2ZXJUYWJsZS5zb3J0QnkgPT09IHNjb3BlLnNvcnRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBzb3J0QnkgPSBiY1NlcnZlclRhYmxlLnNvcnRCeTtcbiAgICAgICAgICAgICAgICAgICAgc29ydERpciA9IGJjU2VydmVyVGFibGUuc29ydERpciA9PT0gc2NvcGUuYXNjID8gc2NvcGUuZGVzYyA6IHNjb3BlLmFzYztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzb3J0QnkgPSBzY29wZS5zb3J0VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHNvcnREaXIgPSBzY29wZS5hc2M7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYmNTZXJ2ZXJUYWJsZS51cGRhdGVTb3J0KHNvcnRCeSwgc29ydERpcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNoZWNrYm94LWxpc3QuY29udHJvbGxlcicsIFtdKVxuICAgIC5jb250cm9sbGVyKCdDaGVja2JveExpc3RDdHJsJywgZnVuY3Rpb24gQ2hlY2tib3hMaXN0Q3RybCgkYXR0cnMsICRlbGVtZW50LCAkbG9nLCAkcGFyc2UsICRzY29wZSkge1xuICAgICAgICB2YXIgY3RybCA9IHRoaXMsXG4gICAgICAgICAgICBmYWxzZVZhbHVlID0gJHBhcnNlKCRhdHRycy5uZ0ZhbHNlVmFsdWUpKGN0cmwpIHx8IGZhbHNlLFxuICAgICAgICAgICAgdHJ1ZVZhbHVlID0gJHBhcnNlKCRhdHRycy5uZ1RydWVWYWx1ZSkoY3RybCkgfHwgdHJ1ZSxcbiAgICAgICAgICAgIG5nTW9kZWwgPSAkZWxlbWVudC5jb250cm9sbGVyKCduZ01vZGVsJyk7XG5cbiAgICAgICAgaW5pdCgpO1xuXG4gICAgICAgIC8vIEdldHRlcnNcbiAgICAgICAgZnVuY3Rpb24gZ2V0TW9kZWxWYWx1ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiBuZ01vZGVsLiRtb2RlbFZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0VmFsdWUoKSB7XG4gICAgICAgICAgICByZXR1cm4gY3RybC52YWx1ZSB8fCBjdHJsLm5nVmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRTZWxlY3RlZFZhbHVlcygpIHtcbiAgICAgICAgICAgIHJldHVybiBjdHJsLnNlbGVjdGVkVmFsdWVzO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0dGVyc1xuICAgICAgICBmdW5jdGlvbiB1cGRhdGVNb2RlbFZhbHVlKG1vZGVsVmFsdWUpIHtcbiAgICAgICAgICAgIG5nTW9kZWwuJHNldFZpZXdWYWx1ZShtb2RlbFZhbHVlKTtcbiAgICAgICAgICAgIG5nTW9kZWwuJGNvbW1pdFZpZXdWYWx1ZSgpO1xuICAgICAgICAgICAgbmdNb2RlbC4kcmVuZGVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVTZWxlY3RlZFZhbHVlcyhtb2RlbFZhbHVlKSB7XG4gICAgICAgICAgICBpZiAobW9kZWxWYWx1ZSA9PT0gdHJ1ZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgYWRkVG9TZWxlY3RlZFZhbHVlcygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtb2RlbFZhbHVlID09PSBmYWxzZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlRnJvbVNlbGVjdGVkVmFsdWVzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhZGRUb1NlbGVjdGVkVmFsdWVzKCkge1xuICAgICAgICAgICAgdmFyIGlzSW5jbHVkZWQgPSBfLmluY2x1ZGUoY3RybC5zZWxlY3RlZFZhbHVlcywgZ2V0VmFsdWUoKSk7XG5cbiAgICAgICAgICAgIGlmICghaXNJbmNsdWRlZCkge1xuICAgICAgICAgICAgICAgIGN0cmwuc2VsZWN0ZWRWYWx1ZXMucHVzaChnZXRWYWx1ZSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZUZyb21TZWxlY3RlZFZhbHVlcygpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IF8uaW5kZXhPZihjdHJsLnNlbGVjdGVkVmFsdWVzLCBnZXRWYWx1ZSgpKTtcblxuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIGN0cmwuc2VsZWN0ZWRWYWx1ZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdhdGNoZXJzXG4gICAgICAgIGZ1bmN0aW9uIG1vZGVsVmFsdWVXYXRjaChtb2RlbFZhbHVlLCBvbGRNb2RlbFZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgb2xkU2VsZWN0ZWRWYWx1ZXMsXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRWYWx1ZXNDaGFuZ2VkO1xuXG4gICAgICAgICAgICAvLyBXaGVuIG5nTW9kZWwgdmFsdWUgY2hhbmdlc1xuICAgICAgICAgICAgaWYgKF8uaXNVbmRlZmluZWQobW9kZWxWYWx1ZSkgfHwgbW9kZWxWYWx1ZSA9PT0gb2xkTW9kZWxWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUmV0YWluIGEgc2hhbGxvdyBjb3B5IG9mIHNlbGVjdGVkVmFsdWVzIGJlZm9yZSB1cGRhdGVcbiAgICAgICAgICAgIG9sZFNlbGVjdGVkVmFsdWVzID0gY3RybC5zZWxlY3RlZFZhbHVlcy5zbGljZSgpO1xuXG4gICAgICAgICAgICAvLyBVcGRhdGUgc2VsZWN0ZWRWYWx1ZXNcbiAgICAgICAgICAgIHVwZGF0ZVNlbGVjdGVkVmFsdWVzKG1vZGVsVmFsdWUpO1xuXG4gICAgICAgICAgICAvLyBEZXRlcm1pbmUgaWYgc2VsZWN0ZWRWYWx1ZXMgYXJyYXkgaGFzIGNoYW5nZWRcbiAgICAgICAgICAgIHNlbGVjdGVkVmFsdWVzQ2hhbmdlZCA9ICEhXy54b3IoY3RybC5zZWxlY3RlZFZhbHVlcywgb2xkU2VsZWN0ZWRWYWx1ZXMpLmxlbmd0aDtcblxuICAgICAgICAgICAgLy8gSWYgY2hhbmdlZCwgZXZva2UgZGVsZWdhdGUgbWV0aG9kIChpZiBkZWZpbmVkKVxuICAgICAgICAgICAgaWYgKGN0cmwub25DaGFuZ2UgJiYgc2VsZWN0ZWRWYWx1ZXNDaGFuZ2VkKSB7XG4gICAgICAgICAgICAgICAgY3RybC5vbkNoYW5nZSh7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkVmFsdWVzOiBjdHJsLnNlbGVjdGVkVmFsdWVzLFxuICAgICAgICAgICAgICAgICAgICBvbGRTZWxlY3RlZFZhbHVlczogb2xkU2VsZWN0ZWRWYWx1ZXNcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNlbGVjdGVkVmFsdWVzV2F0Y2goc2VsZWN0ZWRWYWx1ZXMpIHtcbiAgICAgICAgICAgIC8vIFdoZW4gc2VsZWN0ZWRWYWx1ZXMgY29sbGVjdGlvbiBjaGFuZ2VzXG4gICAgICAgICAgICB2YXIgaXNJbmNsdWRlZCA9IF8uaW5jbHVkZShzZWxlY3RlZFZhbHVlcywgZ2V0VmFsdWUoKSksXG4gICAgICAgICAgICAgICAgbW9kZWxWYWx1ZSA9IGdldE1vZGVsVmFsdWUoKTtcblxuICAgICAgICAgICAgaWYgKGlzSW5jbHVkZWQgJiYgbW9kZWxWYWx1ZSAhPT0gdHJ1ZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlTW9kZWxWYWx1ZSh0cnVlVmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghaXNJbmNsdWRlZCAmJiBtb2RlbFZhbHVlICE9PSBmYWxzZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlTW9kZWxWYWx1ZShmYWxzZVZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEluaXRpYWxpemVyXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICBpZiAoJGF0dHJzLnR5cGUgIT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICAgICAgICAkbG9nLmVycm9yKCdjaGVja2JveC1saXN0IGRpcmVjdGl2ZTogZWxlbWVudCBtdXN0IGJlIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIj4nKTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHNjb3BlLiR3YXRjaChnZXRNb2RlbFZhbHVlLCBtb2RlbFZhbHVlV2F0Y2gpO1xuICAgICAgICAgICAgJHNjb3BlLiR3YXRjaENvbGxlY3Rpb24oZ2V0U2VsZWN0ZWRWYWx1ZXMsIHNlbGVjdGVkVmFsdWVzV2F0Y2gpO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY2hlY2tib3gtbGlzdC5kaXJlY3RpdmUnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNoZWNrYm94LWxpc3QuY29udHJvbGxlcidcbl0pXG5cbiAgICAvKipcbiAgICAgKiBBIGRpcmVjdGl2ZSBmb3IgY29sbGF0aW5nIHZhbHVlcyBmcm9tIGFuIGFycmF5IG9mIGNoZWNrYm94ZXMuXG4gICAgICpcbiAgICAgKiBAcmVxdWlyZSBuZ01vZGVsXG4gICAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nfG51bWJlcnxPYmplY3Q+fSBjaGVja2JveExpc3QgLSBBcnJheSB0byBob2xkIHNlbGVjdGVkIHZhbHVlc1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgLSBWYWx1ZSB0byBhZGQgdG8gY2hlY2tib3hMaXN0XG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihzZWxlY3RlZFZhbHVlcywgb2xkU2VsZWN0ZWRWYWx1ZXN9IFtjaGVja2JveExpc3RDaGFuZ2VdIC0gT3B0aW9uYWwgb25DaGFuZ2UgY2FsbGJhY2tcbiAgICAgKlxuICAgICAqIEBleGFtcGxlOlxuICAgICAqIGBgYGh0bWxcbiAgICAgKiA8ZGl2IG5nLXJlcGVhdD1cIm9wdGlvbiBpbiBvcHRpb25zXCI+XG4gICAgICogICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBcbiAgICAgKiAgICAgICAgIG5hbWU9XCJvcHRpb257eyBvcHRpb24uaWQgfX1cIlxuICAgICAqICAgICAgICAgdmFsdWU9XCJvcHRpb24uaWRcIiBcbiAgICAgKiAgICAgICAgIGNoZWNrYm94LWxpc3Q9XCJzZWxlY3RlZFZhbHVlc1wiIFxuICAgICAqICAgICAgICAgY2hlY2tib3gtbGlzdC1jaGFuZ2U9XCJvbkNoYW5nZShzZWxlY3RlZFZhbHVlcylcIiBcbiAgICAgKiAgICAgICAgIG5nLW1vZGVsPVwib3B0aW9uLmNoZWNrZWRcIlxuICAgICAqICAgICAvPlxuICAgICAqIDwvZGl2PlxuICAgICAqIGBgYFxuICAgICAqIFxuICAgICAqIGBgYGpzXG4gICAgICogc2NvcGUuc2VsZWN0ZWRWYWx1ZXMgPSBbXTtcbiAgICAgKiBzY29wZS5vcHRpb25zID0gW1xuICAgICAqICAgICB7XG4gICAgICogICAgICAgICBpZDogMSxcbiAgICAgKiAgICAgICAgIGxhYmVsOiAnT3B0aW9uIDEnXG4gICAgICogICAgIH0sXG4gICAgICogICAgIHtcbiAgICAgKiAgICAgICAgIGlkOiAyLFxuICAgICAqICAgICAgICAgbGFiZWw6ICdPcHRpb24gMidcbiAgICAgKiAgICAgfSxcbiAgICAgKiAgICAge1xuICAgICAqICAgICAgICAgaWQ6IDMsXG4gICAgICogICAgICAgICBsYWJlbDogJ09wdGlvbiAzJ1xuICAgICAqICAgICB9XG4gICAgICogXTtcbiAgICAgKiBcbiAgICAgKiBzY29wZS5vbkNoYW5nZSA9IGZ1bmN0aW9uIG9uQ2hhbmdlKHNlbGVjdGVkVmFsdWVzKSB7XG4gICAgICogICAgIGNvbnNvbGUubG9nKHNlbGVjdGVkVmFsdWVzKTtcbiAgICAgKiB9O1xuICAgICAqIGBgYFxuICAgICAqIFxuICAgICAqIFdoZW4gb3B0aW9uc1swXSBhbmQgb3B0aW9uc1sxXSBhcmUgY2hlY2tlZCwgc2VsZWN0ZWRWYWx1ZXMgc2hvdWxkIGJlIFsxLCAyXVxuICAgICAqIGFuZCBvbkNoYW5nZSB3aWxsIGJlIGV2b2tlZC4gVGhpcyBkaXJlY3RpdmUgYWxzbyB3b3JrcyB3aXRoIGFuIGFycmF5IG9mIHByaW1pdGl2ZSB2YWx1ZXMuXG4gICAgICogaS5lLjogc2NvcGUub3B0aW9ucyA9IFtcImFcIiwgXCJiXCIsIFwiY1wiXS5cbiAgICAgKi9cblxuICAgIC5kaXJlY3RpdmUoJ2NoZWNrYm94TGlzdCcsIGZ1bmN0aW9uIGNoZWNrYm94TGlzdERpcmVjdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICByZXF1aXJlOiAnbmdNb2RlbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQ2hlY2tib3hMaXN0Q3RybCcsXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjaGVja2JveExpc3RDdHJsJyxcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiAnJmNoZWNrYm94TGlzdENoYW5nZScsXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRWYWx1ZXM6ICc9Y2hlY2tib3hMaXN0JyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogJz0nLFxuICAgICAgICAgICAgICAgIG5nVmFsdWU6ICc9J1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNoZWNrYm94LWxpc3QnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNoZWNrYm94LWxpc3QuZGlyZWN0aXZlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY29sb3ItcGlja2VyLXBhbGV0dGUuY29udHJvbGxlcicsIFtdKVxuXG4gICAgLmNvbnRyb2xsZXIoJ0NvbG9yUGlja2VyUGFsZXR0ZUN0cmwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGN0cmwgPSB0aGlzO1xuXG4gICAgICAgIGN0cmwuY3JlYXRlTmV3Q29sb3IgPSBjcmVhdGVOZXdDb2xvcjtcblxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVOZXdDb2xvcigkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBjdHJsLmNyZWF0ZU5ld1BhbGV0dGVDb2xvcigpO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY29sb3ItcGlja2VyLXBhbGV0dGUuZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jb2xvci1waWNrZXItcGFsZXR0ZS5jb250cm9sbGVyJ1xuXSlcblxuICAgIC5kaXJlY3RpdmUoJ2NvbG9yUGlja2VyUGFsZXR0ZScsIGZ1bmN0aW9uIGNvbG9yUGlja2VyUGFsZXR0ZURpcmVjdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQ29sb3JQaWNrZXJQYWxldHRlQ3RybCcsXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjb2xvclBpY2tlclBhbGV0dGVDdHJsJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIGNvbG9yczogJz0nLFxuICAgICAgICAgICAgICAgIGNyZWF0ZU5ld1BhbGV0dGVDb2xvcjogJz0nLFxuICAgICAgICAgICAgICAgIHNldE5ld0NvbG9yOiAnPScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvanMvYmlnY29tbWVyY2UvY29sb3ItcGlja2VyL2NvbG9yLXBpY2tlci1wYWxldHRlLnRwbC5odG1sJyxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGNvbG9yUGlja2VyUGFsZXR0ZURpcmVjdGl2ZUNvbXBpbGUodEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0RWxlbWVudC5hZGRDbGFzcygnY29sb3JQaWNrZXItcGFsZXR0ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiLyogZ2xvYmFscyBDb2xvclBpY2tlciAqL1xuYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNvbG9yLXBpY2tlci5jb250cm9sbGVyJywgW10pXG4gICAgLmNvbnRyb2xsZXIoJ0NvbG9yUGlja2VyQ3RybCcsIGZ1bmN0aW9uIENvbG9yUGlja2VyQ3RybCgkZWxlbWVudCkge1xuICAgICAgICBjb25zdCBjdHJsID0gdGhpcztcblxuICAgICAgICBsZXQgY29sb3JTZWxlY3Rpb247XG4gICAgICAgIGxldCBjb2xvclNlbGVjdGlvbkluZGljYXRvcjtcbiAgICAgICAgbGV0IGNvbG9yU2xpZGVyO1xuICAgICAgICBsZXQgY29sb3JTbGlkZXJJbmRpY2F0b3I7XG5cbiAgICAgICAgY3RybC5jcmVhdGVDb2xvclBpY2tlciA9IGNyZWF0ZUNvbG9yUGlja2VyO1xuICAgICAgICBjdHJsLmNyZWF0ZU5ld1BhbGV0dGVDb2xvciA9IGNyZWF0ZU5ld1BhbGV0dGVDb2xvcjtcbiAgICAgICAgY3RybC5zZXRNb2RlbEN0cmwgPSBzZXRNb2RlbEN0cmw7XG4gICAgICAgIGN0cmwuc2V0TmV3Q29sb3IgPSBzZXROZXdDb2xvcjtcblxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVDb2xvclBpY2tlcigpIHtcbiAgICAgICAgICAgIGNvbG9yU2VsZWN0aW9uID0gJGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignW2RhdGEtYmMtcGlja2VyXScpO1xuICAgICAgICAgICAgY29sb3JTZWxlY3Rpb25JbmRpY2F0b3IgPSAkZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yKCdbZGF0YS1iYy1waWNrZXItaW5kaWNhdG9yXScpO1xuICAgICAgICAgICAgY29sb3JTbGlkZXIgPSAkZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yKCdbZGF0YS1iYy1zbGlkZXJdJyk7XG4gICAgICAgICAgICBjb2xvclNsaWRlckluZGljYXRvciA9ICRlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWJjLXNsaWRlci1pbmRpY2F0b3JdJyk7XG5cbiAgICAgICAgICAgIENvbG9yUGlja2VyLmZpeEluZGljYXRvcnMoXG4gICAgICAgICAgICAgICAgY29sb3JTbGlkZXJJbmRpY2F0b3IsXG4gICAgICAgICAgICAgICAgY29sb3JTZWxlY3Rpb25JbmRpY2F0b3IpO1xuXG4gICAgICAgICAgICBjdHJsLmNwID0gbmV3IENvbG9yUGlja2VyKFxuICAgICAgICAgICAgICAgIGNvbG9yU2xpZGVyLFxuICAgICAgICAgICAgICAgIGNvbG9yU2VsZWN0aW9uLFxuICAgICAgICAgICAgICAgIHBpY2tOZXdDb2xvclxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZU5ld1BhbGV0dGVDb2xvcigpIHtcbiAgICAgICAgICAgIGlmIChjdHJsLnBhbGV0dGUuaW5kZXhPZihnZXRTZWxlY3RlZENvbG9yKCkpIDwgMCkge1xuICAgICAgICAgICAgICAgIGN0cmwucGFsZXR0ZS5wdXNoKGdldFNlbGVjdGVkQ29sb3IoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRTZWxlY3RlZENvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIGN0cmwuY29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBwaWNrTmV3Q29sb3IoaGV4LCBoc3YsIHJnYiwgcGlja2VyQ29vcmRpbmF0ZSwgc2xpZGVyQ29vcmRpbmF0ZSkge1xuICAgICAgICAgICAgQ29sb3JQaWNrZXIucG9zaXRpb25JbmRpY2F0b3JzKFxuICAgICAgICAgICAgICAgIGNvbG9yU2xpZGVySW5kaWNhdG9yLFxuICAgICAgICAgICAgICAgIGNvbG9yU2VsZWN0aW9uSW5kaWNhdG9yLFxuICAgICAgICAgICAgICAgIHNsaWRlckNvb3JkaW5hdGUsIHBpY2tlckNvb3JkaW5hdGVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGN0cmwubmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShoZXgpO1xuICAgICAgICAgICAgY3RybC5uZ01vZGVsQ3RybC4kcmVuZGVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgICAgICBjdHJsLmNvbG9yID0gY3RybC5uZ01vZGVsQ3RybC4kdmlld1ZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0TW9kZWxDdHJsKG5nTW9kZWxDdHJsKSB7XG4gICAgICAgICAgICBjdHJsLm5nTW9kZWxDdHJsID0gbmdNb2RlbEN0cmw7XG4gICAgICAgICAgICBjdHJsLm5nTW9kZWxDdHJsLiRyZW5kZXIgPSByZW5kZXI7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXROZXdDb2xvcigkZXZlbnQsIG5ld0NvbG9yKSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgY3RybC5jcC5zZXRIZXgobmV3Q29sb3IpO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY29sb3ItcGlja2VyLmRpcmVjdGl2ZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY29sb3ItcGlja2VyLmNvbnRyb2xsZXInLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5odG1sNU1vZGUnLFxuXSlcblxuICAgIC5kaXJlY3RpdmUoJ2NvbG9yUGlja2VyJywgZnVuY3Rpb24gY29sb3JQaWNrZXJEaXJlY3RpdmUoJGxvY2F0aW9uLCBodG1sNU1vZGUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQ29sb3JQaWNrZXJDdHJsJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2NvbG9yUGlja2VyQ3RybCcsXG4gICAgICAgICAgICByZXF1aXJlOiBbJ2NvbG9yUGlja2VyJywgJ15uZ01vZGVsJ10sXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBwYWxldHRlOiAnPScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvanMvYmlnY29tbWVyY2UvY29sb3ItcGlja2VyL2NvbG9yLXBpY2tlci50cGwuaHRtbCcsXG5cbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGNvbG9yUGlja2VyRGlyZWN0aXZlQ29tcGlsZSh0RWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRFbGVtZW50LmFkZENsYXNzKCdjb2xvclBpY2tlcicpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGNvbG9yUGlja2VyRGlyZWN0aXZlTGluaygkc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJscykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdHJsID0gY3RybHNbMF07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5nTW9kZWxDdHJsID0gY3RybHNbMV07XG5cbiAgICAgICAgICAgICAgICAgICAgY3RybC5zZXRNb2RlbEN0cmwobmdNb2RlbEN0cmwpO1xuICAgICAgICAgICAgICAgICAgICBjdHJsLmNyZWF0ZUNvbG9yUGlja2VyKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQXBwcyB0aGF0IGhhdmUgYSA8YmFzZT4gdGFnIHJlcXVpcmUgdG8gaGF2ZSBhYnNvbHV0ZSBwYXRoc1xuICAgICAgICAgICAgICAgICAgICAvLyB3aGVuIHVzaW5nIHN2ZyB1cmwgcmVmZXJlbmNlc1xuICAgICAgICAgICAgICAgICAgICBpZiAoaHRtbDVNb2RlLmVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tmaWxsXScpLCBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJldHdlZW5QYXJlbnRoZXNpcyA9IC9cXCgoW14pXSspXFwpLztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlbGVtID0gYW5ndWxhci5lbGVtZW50KGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50RmlsbCA9IGVsZW0uYXR0cignZmlsbCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF8uY29udGFpbnMoY3VycmVudEZpbGwsICd1cmwoIycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0ZpbGwgPSBiZXR3ZWVuUGFyZW50aGVzaXMuZXhlYyhjdXJyZW50RmlsbClbMV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbS5hdHRyKCdmaWxsJywgJ3VybCgnICsgJGxvY2F0aW9uLmFic1VybCgpICsgbmV3RmlsbCArICcpJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJHdhdGNoKGdldE1vZGVsVmFsdWUsIGZ1bmN0aW9uIG1vZGVsV2F0Y2gobmV3VmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3VmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RybC5jcC5zZXRIZXgobmV3VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZ2V0TW9kZWxWYWx1ZSgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjdHJsLm5nTW9kZWxDdHJsLiRtb2RlbFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jb2xvci1waWNrZXInLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNvbG9yLXBpY2tlci5kaXJlY3RpdmUnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jb2xvci1waWNrZXItcGFsZXR0ZS5kaXJlY3RpdmUnXG5dKTtcbiIsIi8qKlxuICogQG5hbWUgY3JlZGl0LWNhcmQgZGlyZWN0aXZlXG4gKiBAZGVzY3JpcHRpb24gQ29tcG9uZW50IGNvbnRhaW5pbmcgY2MgbnVtYmVyLCBjdmMsIG5hbWUsIGFuZCBleHBpcnkuIEhhcyBhbiBpc29sYXRlZCBzY29wZSB3aXRoIG5vIGNvbnRyb2xsZXIuXG4gKiBAcmVxdWlyZSBmb3JtXG4gKlxuICogQHBhcmFtIGNjRGF0YSB7b2JqZWN0fSBDb250YWlucyBjY051bWJlciwgY2NUeXBlLCBjY0V4cGlyeSwgYW5kIGNjTmFtZVxuICogQHBhcmFtIGNjQ29uZmlnIHtvYmplY3R9IFRoZSBjb25maWd1cmF0aW9uIG9iamVjdC4gQ3VycmVudGx5IHN1cHBvcnRpbmc6XG4gKiAgLSBjYXJkQ29kZSB7Ym9vbGVhbn0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGN2diBmaWVsZCBzaG91bGQgYmUgc2hvd24uIERlZmF1bHQgdHJ1ZS5cbiAqICAtIGNhcmRDb2RlUmVxdWlyZWQge2Jvb2xlYW59IEluZGljYXRlcyB3aGV0aGVyIHRoZSBjdnYgZmllbGQgaXMgcmVxdWlyZWQuIFRoaXMgb25seSBtYXR0ZXJzIHdoZW4gY2FyZENvZGUgaXMgc2V0IHRvIHRydWUuIERlZmF1bHQgdHJ1ZS5cbiAqICAtIGZ1bGxOYW1lIHtib29sZWFufSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgbmFtZSBmaWVsZCBzaG91bGQgYmUgc2hvd24uIERlZmF1bHQgdHJ1ZS5cbiAqIEBwYXJhbSBlYWdlclR5cGUge2Jvb2xlYW59IElmIHRoaXMgYXR0cmlidXRlIGlzIHNldCB0byBmYWxzZSwgdGhlbiBkaXNhYmxlIGVhZ2VyIHR5cGUgZGV0ZWN0aW9uLiBEZWZhdWx0cyB0cnVlLlxuICovXG5hbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQuZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5pY29uJ1xuXSlcbiAgICAuZGlyZWN0aXZlKCdjcmVkaXRDYXJkJywgZnVuY3Rpb24gY3JlZGl0Q2FyZERpcmVjdGl2ZSgkY29tcGlsZSwgJHBhcnNlLCAkdGVtcGxhdGVDYWNoZSkge1xuICAgICAgICBjb25zdCBjdnZUb29sdGlwVGVtcGxhdGUgPSAkdGVtcGxhdGVDYWNoZS5nZXQoJ3NyYy9qcy9iaWdjb21tZXJjZS9jcmVkaXQtY2FyZC9jcmVkaXQtY2FyZC1jdnYvdG9vbHRpcC50cGwuaHRtbCcpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiBjcmVkaXRDYXJkQ29tcGlsZSh0RWxlbSwgdEF0dHJzKXtcbiAgICAgICAgICAgICAgICBsZXQgaXNFYWdlclR5cGUgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRBdHRycy5lYWdlclR5cGUgJiYgJHBhcnNlKHRBdHRycy5lYWdlclR5cGUpKCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNjTnVtYmVyID0gdEVsZW1bMF0ucXVlcnlTZWxlY3RvcignI2NjTnVtYmVyJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgY2NOdW1iZXIucmVtb3ZlQXR0cmlidXRlKCdjY0VhZ2VyVHlwZScpO1xuICAgICAgICAgICAgICAgICAgICBpc0VhZ2VyVHlwZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBjcmVkaXRDYXJkTGluayhzY29wZSwgZWxlbSwgYXR0ciwgZm9ybUN0cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3Z2VG9vbHRpcEVsZW1lbnQgPSAkY29tcGlsZShjdnZUb29sdGlwVGVtcGxhdGUpKHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcmRDb2RlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FyZENvZGVSZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGxOYW1lOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmdldEN2dlRvb2x0aXBIdG1sID0gZ2V0Q3Z2VG9vbHRpcEh0bWw7XG5cbiAgICAgICAgICAgICAgICAgICAgaW5pdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5mb3JtQ3RybCA9IGZvcm1DdHJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2NDb25maWcgPSBfLmRlZmF1bHRzKHNjb3BlLmNjQ29uZmlnLCBkZWZhdWx0Q29uZmlnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBUaGUgY3JlZGl0IGNhcmQgdHlwZSBpcyBkZWR1Y2VkIGJ5IHRoZSBgY2NOdW1iZXJgIGRpcmVjdGl2ZS4gVGhpcyBpcyBpbiB0dXJuIGV4cG9zZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIGFzIGVpdGhlciBgJGNjRWFnZXJUeXBlYCBvciBgJGNjVHlwZWAgb24gdGhlIGlucHV0IGNvbnRyb2wgZWxlbWVudC4gV2F0Y2ggZm9yIGNoYW5nZXMgYW5kIGJpbmQgdGhlIHR5cGUgdG8gdGhlIGNvcnJlc3BvbmRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIHZhbHVlIG9uIGNjRGF0YS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGdldERldGVjdGVkQ2NUeXBlLCBzZXRDY1R5cGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFJldHVybiB0aGUgaHRtbCBmb3IgdGhlIHRvb2x0aXAuIFVzaW5nIG91dGVySFRNTCB0byBhbHNvIGluY2x1ZGUgdGhlIHJvb3QgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IEh0bWwgc3RyaW5nIGZvciB0aGUgY3Z2IHRvb2x0aXAgdGVtcGxhdGVcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdldEN2dlRvb2x0aXBIdG1sKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN2dlRvb2x0aXBFbGVtZW50WzBdLm91dGVySFRNTDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBHZXQgdGhlIGRldGVjdGVkIGNyZWRpdCBjYXJkIHR5cGUgZXhwb3NlZCBvbiB0aGUgZm9ybSBjb250cm9sIGJ5IHRoZSBjY051bWJlciBjaGlsZCBkaXJlY3RpdmUuXG4gICAgICAgICAgICAgICAgICAgICAqIFRoaXMgdmFsdWUgd2lsbCBiZSBleHBvc2VkIGFzICRjY0VhZ2VyVHlwZSBvciAkY2NUeXBlIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRoaXMgZmVhdHVyZSBpcyBlbmFibGVkLlxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd8bnVsbH1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdldERldGVjdGVkQ2NUeXBlKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzRWFnZXJUeXBlID8gZm9ybUN0cmwuY2NOdW1iZXIuJGNjRWFnZXJUeXBlIDogZm9ybUN0cmwuY2NOdW1iZXIuJGNjVHlwZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBTZXQgY2NEYXRhLmNjVHlwZVxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ3xudWxsfSB0eXBlIFRoZSBjcmVkaXQgY2FyZCB0eXBlLCBpLmUuICd2aXNhJ1xuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd8bnVsbH0gdHlwZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gc2V0Q2NUeXBlKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmNjRGF0YS5jY1R5cGUgPSB0eXBlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHlwZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVxdWlyZTogJ15mb3JtJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBjY0RhdGE6ICc9JyxcbiAgICAgICAgICAgICAgICBjY0NvbmZpZzogJz0nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL2JpZ2NvbW1lcmNlL2NyZWRpdC1jYXJkL2NyZWRpdC1jYXJkLnRwbC5odG1sJ1xuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkJywgW1xuICAgICdjcmVkaXQtY2FyZHMnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC5iYy1jdmMnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC5jYy1leHBpcnknLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC5kaXJlY3RpdmUnLFxuICAgICdnZXR0ZXh0Jyxcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLXR5cGVzLmNvbnN0YW50JywgW10pXG4gICAgLmNvbnN0YW50KCdDQ19UWVBFUycsIHtcbiAgICAgICAgJ0FtZXJpY2FuIEV4cHJlc3MnOiAnYW1leCcsXG4gICAgICAgICdEaW5lcnMgQ2x1Yic6ICdkaW5lcnNjbHViJyxcbiAgICAgICAgJ0Rpc2NvdmVyJzogJ2Rpc2NvdmVyJyxcbiAgICAgICAgJ01hc3RlckNhcmQnOiAnbWFzdGVyY2FyZCcsXG4gICAgICAgICdWaXNhJzogJ3Zpc2EnLFxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLXR5cGVzLmNvbnRyb2xsZXInLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLXR5cGVzLmNvbnN0YW50Jyxcbl0pXG4gICAgLmNvbnRyb2xsZXIoJ0NyZWRpdENhcmRUeXBlc0N0cmwnLCBmdW5jdGlvbiBDcmVkaXRDYXJkVHlwZXNDdHJsKCRlbGVtZW50LCBDQ19UWVBFUykge1xuICAgICAgICBjb25zdCBjdHJsID0gdGhpcztcblxuICAgICAgICBjdHJsLmhhc1NlbGVjdGVkVHlwZSA9IGhhc1NlbGVjdGVkVHlwZTtcbiAgICAgICAgY3RybC5pc1NlbGVjdGVkVHlwZSA9IGlzU2VsZWN0ZWRUeXBlO1xuICAgICAgICBjdHJsLm1hcFRvU3ZnID0gbWFwVG9Tdmc7XG5cbiAgICAgICAgaW5pdCgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygnY3JlZGl0Q2FyZFR5cGVzJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2hlY2tzIHdoZXRoZXIgYSB0eXBlIGhhcyBiZWVuIHNlbGVjdGVkIChvciBkZXRlY3RlZCBieSB0aGUgY3JlZGl0LWNhcmQgY29tcG9uZW50KVxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gaGFzU2VsZWN0ZWRUeXBlKCkge1xuICAgICAgICAgICAgcmV0dXJuICFfLmlzRW1wdHkoY3RybC5nZXRTZWxlY3RlZFR5cGUoKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2hlY2tzIGlmIHRoZSBwYXNzZWQgaW4gY2NUeXBlIGlzIHRoZSBzYW1lIGFzIHRoZSBzZWxlY3RlZCBjY1R5cGVcbiAgICAgICAgICogQHBhcmFtIGNjVHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gaXNTZWxlY3RlZFR5cGUoY2NUeXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gY2NUeXBlID09PSBjdHJsLmdldFNlbGVjdGVkVHlwZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1hcCB0aGUgY2NUeXBlIHRvIGEgY29ycmVzcG9uZGluZyBzdmcgbmFtZVxuICAgICAgICAgKiBAcGFyYW0gY2NUeXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG1hcFRvU3ZnKGNjVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIENDX1RZUEVTW2NjVHlwZV07XG4gICAgICAgIH1cbiAgICB9KTtcbiIsIi8qKlxuICogQG5hbWUgY3JlZGl0LWNhcmQtdHlwZXMgZGlyZWN0aXZlXG4gKiBAZGVzY3JpcHRpb24gQ29tcG9uZW50IGRpc3BsYXlpbmcgYW5kIGdyZXlpbmcgb3V0IGNyZWRpdCBjYXJkIHR5cGUgaWNvbnMgYmFzZWQgb24gdGhlIHNlbGVjdGVkIGNyZWRpdCBjYXJkIHR5cGUuXG4gKiBgLmlzLWFjdGl2ZWAgaXMgYWRkZWQgdG8gdGhlIGNvcnJlc3BvbmRpbmcgc2VsZWN0ZWQgY3JlZGl0IGNhcmQgdHlwZS4gYC5ub3QtYWN0aXZlYCBpcyBhZGRlZCBmb3IgdGhlIG90aGVyXG4gKiB0eXBlcy4gSWYgbm8gY3JlZGl0IGNhcmQgdHlwZXMgaGFzIGJlZW4gc2VsZWN0ZWQsIHRoZW4gbmVpdGhlciBgLmlzLWFjdGl2ZWAgYW5kIGAubm90LWFjdGl2ZWAgd2lsbCBiZSBhZGRlZCBhdCBhbGwuXG4gKlxuICogQHBhcmFtIHNlbGVjdGVkVHlwZSB7U3RyaW5nfSBDcmVkaXQgY2FyZCB0eXBlLiBWYWxpZCB0eXBlcyBhcmUgJ1Zpc2EnLCAnTWFzdGVyQ2FyZCcsICdEaW5lcnMgQ2x1YicsICdEaXNjb3ZlcicsIGFuZCAnQW1lcmljYW4gRXhwcmVzcydcbiAqIEBwYXJhbSBzdXBwb3J0ZWRUeXBlcyB7QXJyYXl9IEFycmF5IG9mIGNyZWRpdCBjYXJkIHR5cGVzIHRvIGRpc3BsYXkuIFRoZSBjYXJkIHR5cGVzIHVzZSB0aGUgc2FtZSBzdHJpbmdzOiAnQW1lcmljYW4gRXhwcmVzcycsICdEaXNjb3ZlcicsICdNYXN0ZXJDYXJkJywgJ1Zpc2EnXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC10eXBlcy5kaXJlY3RpdmUnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLXR5cGVzLmNvbnRyb2xsZXInLFxuXSlcbiAgICAuZGlyZWN0aXZlKCdjcmVkaXRDYXJkVHlwZXMnLCBmdW5jdGlvbiBjcmVkaXRDYXJkVHlwZXNEaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0NyZWRpdENhcmRUeXBlc0N0cmwgYXMgY3JlZGl0Q2FyZFR5cGVzQ3RybCcsXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBnZXRTZWxlY3RlZFR5cGU6ICcmc2VsZWN0ZWRUeXBlJyxcbiAgICAgICAgICAgICAgICBnZXRTdXBwb3J0ZWRUeXBlczogJyZzdXBwb3J0ZWRUeXBlcydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9qcy9iaWdjb21tZXJjZS9jcmVkaXQtY2FyZC10eXBlcy9jcmVkaXQtY2FyZC10eXBlcy50cGwuaHRtbCdcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC10eXBlcycsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQtdHlwZXMuY29uc3RhbnQnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC10eXBlcy5jb250cm9sbGVyJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQtdHlwZXMuZGlyZWN0aXZlJyxcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0uZGlyZWN0aXZlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnZm9ybScsIGZ1bmN0aW9uIGZvcm1EaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gZm9ybUxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnZm9ybScpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cignbm92YWxpZGF0ZScsICcnKTtcblxuICAgICAgICAgICAgICAgIC8vIFVzZSBkaXNhYmxlLWF1dG8tZm9jdXM9XCJ0cnVlXCIgdG8gdHVybiBvZmYgYXV0b21hdGljIGVycm9yIGZvY3VzaW5nXG4gICAgICAgICAgICAgICAgaWYgKCFhdHRycy5kaXNhYmxlQXV0b0ZvY3VzKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uIGZvcm1BdXRvRm9jdXNTdWJtaXRIYW5kbGVyKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGludmFsaWRGaWVsZCA9IGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignLm5nLWludmFsaWQnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGludmFsaWRGaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmFsaWRGaWVsZC5mb2N1cygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXV0by1zZWxlY3QgZXhpc3RpbmcgdGV4dCBmb3IgZmllbGRzIHRoYXQgc3VwcG9ydCBpdCAodGV4dCwgZW1haWwsIHBhc3N3b3JkLCBldGMuKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnZhbGlkRmllbGQuc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmFsaWRGaWVsZC5zZWxlY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0tZmllbGQtZXJyb3IuZGlyZWN0aXZlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnZm9ybUZpZWxkRXJyb3InLCBmdW5jdGlvbiBmb3JtRmllbGRFcnJvckRpcmVjdGl2ZSgkY29tcGlsZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcHJpb3JpdHk6IDEwLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvanMvYmlnY29tbWVyY2UvZm9ybS1maWVsZC1lcnJvci9mb3JtLWZpZWxkLWVycm9yLnRwbC5odG1sJyxcbiAgICAgICAgICAgIHRlcm1pbmFsOiB0cnVlLFxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGZvcm1GaWVsZEVycm9yQ29tcGlsZSh0RWxlbWVudCwgdEF0dHJzKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlIHRyYW5zbGF0ZSBwcm9wZXJ0eSB3aXBlcyBvdXQgb3VyIG5nLW1lc3NhZ2UgbG9naWMgaW4gdGhlIHBvc3QgbGluayBmdW5jdGlvblxuICAgICAgICAgICAgICAgIC8vIFRoZSBwcmlvcml0eSBhbmQgdGVybWluYWwgcHJvcGVydGllcyBhYm92ZSBlbnN1cmUgdGhpcyBjaGVjayBvY2N1cnNcbiAgICAgICAgICAgICAgICBpZiAodEVsZW1lbnQuYXR0cigndHJhbnNsYXRlJykgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAnVGhlIHRyYW5zbGF0ZSBhdHRyaWJ1dGUgY2Fubm90IGJlIHVzZWQgd2l0aCB0aGUgZm9ybS1maWVsZC1lcnJvciBkaXJlY3RpdmUuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1VzZSB0aGUgdHJhbnNsYXRlIGZpbHRlciBpbnN0ZWFkIChleGFtcGxlOiB7eyBcIm15IGVycm9yIG1lc3NhZ2VcIiB8IHRyYW5zbGF0ZSB9fSkuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1ZhbGlkYXRvcjogJyArIHRBdHRycy52YWxpZGF0ZVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHBvc3Q6IGZ1bmN0aW9uIGZvcm1GaWVsZEVycm9yUG9zdExpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycywgdHJhbnNjbHVkZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvcGVydHkgPSBzY29wZS5wcm9wZXJ0eSB8fCBhdHRycy5wcm9wZXJ0eTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNjbHVkZShmdW5jdGlvbiBmb3JtRmllbGRFcnJvclRyYW5zY2x1ZGUoZXJyb3JDbG9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYWJlbEVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQoJzxsYWJlbD4nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5nTWVzc2FnZSBkb2Vzbid0IHBsYXkgd2VsbCB3aXRoIGR5bmFtaWMgbWVzc2FnZSBpbnNlcnRpb24sIHRyYW5zbGF0aW9uLCBvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1lc3NhZ2UgZXhwcmVzc2lvbnMsIHNvIHdlIGJ1aWxkIGl0cyBlbGVtZW50IHVwIGhlcmUgYW5kIGluamVjdCBpdCBpbnRvIHRoZSBET01cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbEVsZW1lbnQuYXR0cignZm9yJywgc2NvcGUucHJvcGVydHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsRWxlbWVudC5hdHRyKCduZy1tZXNzYWdlJywgYXR0cnMudmFsaWRhdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsRWxlbWVudC5hdHRyKCdyb2xlJywgJ2FsZXJ0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxFbGVtZW50LmFkZENsYXNzKCdmb3JtLWlubGluZU1lc3NhZ2UnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBlcnJvciBzcGFuIHNob3VsZCBhbHJlYWR5IGhhdmUgYSB0cmFuc2xhdGlvbiB3YXRjaGVyIG9uIGl0IGJ5IG5vdywgdXNpbmcgYSBmaWx0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbEVsZW1lbnQuYXBwZW5kKGVycm9yQ2xvbmUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hcHBlbmQobGFiZWxFbGVtZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjb21waWxlKGVsZW1lbnQpKHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWZpZWxkLWVycm9yJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWZpZWxkLWVycm9yLmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0tZmllbGQuZGlyZWN0aXZlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnZm9ybUZpZWxkJywgZnVuY3Rpb24gZm9ybUZpZWxkRGlyZWN0aXZlKCRsb2cpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlcXVpcmU6ICdeZm9ybScsXG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgIHNjb3BlOiB0cnVlLFxuICAgICAgICAgICAgbGluazoge1xuICAgICAgICAgICAgICAgIHByZTogZnVuY3Rpb24gZm9ybUZpZWxkTGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSW5oZXJpdGVkIGJ5IHRoZSBmb3JtLWZpZWxkLWVycm9ycyBkaXJlY3RpdmUgdG8gYXZvaWQgcmVkZWNsYXJhdGlvblxuICAgICAgICAgICAgICAgICAgICBzY29wZS5wcm9wZXJ0eSA9IGF0dHJzLnByb3BlcnR5O1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBwb3N0OiBmdW5jdGlvbiBmb3JtRmllbGRMaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycywgZm9ybUN0cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTG9jYXRlcyBhbmQgd2F0Y2hlcyB0aGUgbWF0Y2hpbmcgaW5wdXQvc2VsZWN0L2V0YyAoYmFzZWQgb24gaXRzIG5hbWUgYXR0cmlidXRlKSBpbiB0aGUgcGFyZW50IGZvcm1cbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gYXR0cnMucHJvcGVydHk7XG5cbiAgICAgICAgICAgICAgICAgICAgaW5pdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdmb3JtLWZpZWxkJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIGEgcHJvcGVydHkgd2Fzbid0IHByb3ZpZGVkLCB3ZSBjYW4ndCBkbyBtdWNoIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgaW50ZXJmYWNlIGlmIHRoZSBmb3JtIGlzIHN1Ym1pdHRlZCBvciB0aGUgcHJvcGVydHkncyB2YWxpZGl0eSBzdGF0ZSBjaGFuZ2VzXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goaXNTdWJtaXR0ZWQsIGNoZWNrVmFsaWRpdHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGlzSW52YWxpZCwgY2hlY2tWYWxpZGl0eSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBjaGVja1ZhbGlkaXR5KCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgYSBwcm9wZXJ0eSB3YXMgcHJvdmlkZWQsIGJ1dCBubyBuZy1tb2RlbCB3YXMgZGVmaW5lZCBmb3IgdGhlIGZpZWxkLCB2YWxpZGF0aW9uIHdvbid0IHdvcmtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaGFzTW9kZWwoKSAmJiBpc1N1Ym1pdHRlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRsb2cuaW5mbygnRm9ybSBmaWVsZHMgY29udGFpbmluZyBpbnB1dHMgd2l0aG91dCBhbiBuZy1tb2RlbCBwcm9wZXJ0eSB3aWxsIG5vdCBiZSB2YWxpZGF0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gT25seSBzaG93IGFuIGVycm9yIGlmIHRoZSB1c2VyIGhhcyBhbHJlYWR5IGF0dGVtcHRlZCB0byBzdWJtaXQgdGhlIGZvcm1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudG9nZ2xlQ2xhc3MoJ2Zvcm0tZmllbGQtLWVycm9yJywgaXNTdWJtaXR0ZWQoKSAmJiBpc0ludmFsaWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBoYXNNb2RlbCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAhIWZvcm1DdHJsW3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGlzU3VibWl0dGVkKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1DdHJsLiRzdWJtaXR0ZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBpc0ludmFsaWQoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWhhc01vZGVsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmb3JtQ3RybFtwcm9wZXJ0eV0uJGludmFsaWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1maWVsZCcsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1maWVsZC5kaXJlY3RpdmUnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWZpZWxkLWVycm9yJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1maWVsZC1lcnJvcnMnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWZpZWxkLWVycm9ycy5kaXJlY3RpdmUnLCBbXSlcbiAgICAuZGlyZWN0aXZlKCdmb3JtRmllbGRFcnJvcnMnLCBmdW5jdGlvbiBmb3JtRmllbGRFcnJvcnNEaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgcmVxdWlyZTogJ15mb3JtJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvanMvYmlnY29tbWVyY2UvZm9ybS1maWVsZC1lcnJvcnMvZm9ybS1maWVsZC1lcnJvcnMudHBsLmh0bWwnLFxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgICAgIGxpbms6IHtcbiAgICAgICAgICAgICAgICAvLyBQcmUtbGluayBpcyByZXF1aXJlZCwgYXMgd2UgaGF2ZSB0byBpbmplY3Qgb3VyIHNjb3BlIHByb3BlcnRpZXMgYmVmb3JlIHRoZSBjaGlsZFxuICAgICAgICAgICAgICAgIC8vIGZvcm0tZmllbGQtZXJyb3IgZGlyZWN0aXZlIChhbmQgaXRzIGludGVybmFsIG5nLW1lc3NhZ2UgZGlyZWN0aXZlJ3MpIHBvc3QtbGluayBmdW5jdGlvbnNcbiAgICAgICAgICAgICAgICBwcmU6IGZ1bmN0aW9uIGZvcm1GaWVsZEVycm9yc1ByZUxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBmb3JtQ3RybCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBQcm9wZXJ0eSBuYW1lIGNhbiBiZSBpbmhlcml0ZWQgZnJvbSBwYXJlbnQgc2NvcGUsIHN1Y2ggYXMgZnJvbSB0aGUgZm9ybS1maWVsZCBkaXJlY3RpdmVcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gc2NvcGUucHJvcGVydHkgfHwgYXR0cnMucHJvcGVydHksXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eUZpZWxkID0gZm9ybUN0cmxbcHJvcGVydHldO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEluaGVyaXRlZCBieSBmb3JtLWZpZWxkLWVycm9yIGRpcmVjdGl2ZS4gTGl2ZXMgZGlyZWN0bHkgb24gc2NvcGUgYmVjYXVzZSB0aGUgcmVxdWlyZVxuICAgICAgICAgICAgICAgICAgICAvLyBwcm9wZXJ0eSBkb2VzIG5vdCB3b3JrIHdlbGwgd2l0aCBkaXJlY3RpdmUgY29udHJvbGxlciBpbnN0YW5jZXNcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuZm9ybUN0cmwgPSBmb3JtQ3RybDtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvcGVydHkgPSBwcm9wZXJ0eTtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvcGVydHlGaWVsZCA9IHByb3BlcnR5RmllbGQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0tZmllbGQtZXJyb3JzJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWZpZWxkLWVycm9ycy5kaXJlY3RpdmUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWlucHV0LWNvbG9yLmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdGb3JtSW5wdXRDb2xvckN0cmwnLCBmdW5jdGlvbigkZWxlbWVudCwgJHJvb3RTY29wZSwgJHNjb3BlKSB7XG4gICAgICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xuICAgICAgICBjb25zdCBoZXhDb2xvclJlZ2V4ID0gL14jKChbMC05YS1mQS1GXXsyfSl7M318KFswLTlhLWZBLUZdKXszfSkkLztcblxuICAgICAgICBsZXQgaXNWaXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgY3RybC5ibHVyRXZlbnRIYW5kbGVyID0gYmx1ckV2ZW50SGFuZGxlcjtcbiAgICAgICAgY3RybC5mb2N1c0V2ZW50SGFuZGxlciA9IGZvY3VzRXZlbnRIYW5kbGVyO1xuICAgICAgICBjdHJsLmhpZGVQaWNrZXIgPSBoaWRlUGlja2VyO1xuICAgICAgICBjdHJsLmlzUGlja2VyVmlzaWJsZSA9IGlzUGlja2VyVmlzaWJsZTtcbiAgICAgICAgY3RybC5vbkNoYW5nZSA9IG9uQ2hhbmdlO1xuICAgICAgICBjdHJsLnNldE1vZGVsQ3RybCA9IHNldE1vZGVsQ3RybDtcbiAgICAgICAgY3RybC5zaG93UGlja2VyID0gc2hvd1BpY2tlcjtcbiAgICAgICAgY3RybC51bmlxdWVJZCA9IGdldFVuaXF1ZUlEKCdmb3JtSW5wdXRDb2xvci0nKTtcblxuICAgICAgICAkc2NvcGUuJG9uKCdiY0NvbG9yUGlja2VyT3BlbmVkJywgKGV2ZW50LCB0cmlnZ2VyaW5nRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKCRlbGVtZW50ID09PSB0cmlnZ2VyaW5nRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3RybC5oaWRlUGlja2VyKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIGJsdXJFdmVudEhhbmRsZXIoJGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoJGVsZW1lbnRbMF0uY29udGFpbnMoJGV2ZW50LnJlbGF0ZWRUYXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdHJsLmhpZGVQaWNrZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZvY3VzRXZlbnRIYW5kbGVyKCRldmVudCkge1xuICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjdHJsLnNob3dQaWNrZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFVuaXF1ZUlEKGlkUHJlZml4KSB7XG4gICAgICAgICAgICByZXR1cm4gXy51bmlxdWVJZChpZFByZWZpeCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoaWRlUGlja2VyKCkge1xuICAgICAgICAgICAgaWYgKGN0cmwuaXNQaWNrZXJWaXNpYmxlKCkpIHtcbiAgICAgICAgICAgICAgICBjdHJsLmlzUGlja2VyVmlzaWJsZShmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc1BpY2tlclZpc2libGUoaXNWaXNpYmxlVG9TZXQpIHtcbiAgICAgICAgICAgIGlmIChpc1Zpc2libGVUb1NldCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaXNWaXNpYmxlID0gaXNWaXNpYmxlVG9TZXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBpc1Zpc2libGU7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBvbkNoYW5nZSgpIHtcbiAgICAgICAgICAgIGlmIChoZXhDb2xvclJlZ2V4LnRlc3QoY3RybC5jb2xvcikpIHtcbiAgICAgICAgICAgICAgICBjdHJsLmxhc3RWYWxpZENvbG9yID0gY3RybC5jb2xvcjtcbiAgICAgICAgICAgICAgICBjdHJsLm5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUoY3RybC5jb2xvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgICAgICBjdHJsLmNvbG9yID0gY3RybC5uZ01vZGVsQ3RybC4kdmlld1ZhbHVlO1xuICAgICAgICAgICAgY3RybC5sYXN0VmFsaWRDb2xvciA9IGN0cmwuY29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRNb2RlbEN0cmwobmdNb2RlbEN0cmwpIHtcbiAgICAgICAgICAgIGN0cmwubmdNb2RlbEN0cmwgPSBuZ01vZGVsQ3RybDtcbiAgICAgICAgICAgIGN0cmwubmdNb2RlbEN0cmwuJHJlbmRlciA9IHJlbmRlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNob3dQaWNrZXIoKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2JjQ29sb3JQaWNrZXJPcGVuZWQnLCAkZWxlbWVudCk7XG4gICAgICAgICAgICBjdHJsLmlzUGlja2VyVmlzaWJsZSh0cnVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0taW5wdXQtY29sb3IuZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWlucHV0LWNvbG9yLmNvbnRyb2xsZXInLFxuXSlcblxuICAgIC5kaXJlY3RpdmUoJ2Zvcm1JbnB1dENvbG9yJywgZnVuY3Rpb24gZm9ybUlucHV0Q29sb3JEaXJlY3RpdmUoJGRvY3VtZW50KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0Zvcm1JbnB1dENvbG9yQ3RybCcsXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdmb3JtSW5wdXRDb2xvckN0cmwnLFxuICAgICAgICAgICAgcmVxdWlyZTogWydmb3JtSW5wdXRDb2xvcicsICdebmdNb2RlbCddLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgbGFiZWxUZXh0OiAnPScsXG4gICAgICAgICAgICAgICAgcGFsZXR0ZTogJz0nLFxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyVGV4dDogJz0nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL2JpZ2NvbW1lcmNlL2Zvcm0taW5wdXQtY29sb3IvZm9ybS1pbnB1dC1jb2xvci50cGwuaHRtbCcsXG5cbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGZvcm1JbnB1dENvbG9yRGlyZWN0aXZlQ29tcGlsZSh0RWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRFbGVtZW50LmFkZENsYXNzKCdmb3JtLWlucHV0Q29sb3InKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBmb3JtSW5wdXRDb2xvckRpcmVjdGl2ZUxpbmsoJHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3RybCA9IGN0cmxzWzBdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZ01vZGVsQ3RybCA9IGN0cmxzWzFdO1xuXG4gICAgICAgICAgICAgICAgICAgIGN0cmwuc2V0TW9kZWxDdHJsKG5nTW9kZWxDdHJsKTtcblxuICAgICAgICAgICAgICAgICAgICAkZG9jdW1lbnQub24oJ2tleWRvd24nLCBrZXlkb3duRXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICAgICAgJGRvY3VtZW50Lm9uKCdtb3VzZWRvd24nLCBtb3VzZURvd25FdmVudEhhbmRsZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kb24oJyRkZXN0cm95JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGRvY3VtZW50Lm9mZignbW91c2Vkb3duJywgbW91c2VEb3duRXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRkb2N1bWVudC5vZmYoJ2tleWRvd24nLCBrZXlkb3duRXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24ga2V5ZG93bkV2ZW50SGFuZGxlciAoJGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJGV2ZW50LndoaWNoID09PSAyNykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHJsLmhpZGVQaWNrZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIG1vdXNlRG93bkV2ZW50SGFuZGxlcigkZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50WzBdLmNvbnRhaW5zKCRldmVudC50YXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RybC5oaWRlUGlja2VyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0taW5wdXQtY29sb3InLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0taW5wdXQtY29sb3IuZGlyZWN0aXZlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuaHRtbDVNb2RlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5odG1sNU1vZGUuc2VydmljZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmh0bWw1TW9kZS5zZXJ2aWNlJywgW10pXG4gICAgLnByb3ZpZGVyKCdodG1sNU1vZGUnLCBmdW5jdGlvbiBodG1sNU1vZGVQcm92aWRlcigkbG9jYXRpb25Qcm92aWRlcikge1xuICAgICAgICB0aGlzLiRnZXQgPSBmdW5jdGlvbiBodG1sNU1vZGVTZXJ2aWNlKCkge1xuICAgICAgICAgICAgcmV0dXJuICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSgpO1xuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmljb24uY29udHJvbGxlcicsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuaHRtbDVNb2RlJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuaWNvbi5zdmdSb290UGF0aCdcbl0pXG4gICAgLmNvbnRyb2xsZXIoJ0ljb25DdHJsJywgZnVuY3Rpb24gaWNvbkRpcmVjdGl2ZUNvbnRyb2xsZXIoJGh0dHAsICRsb2NhdGlvbiwgJHRlbXBsYXRlQ2FjaGUsIGh0bWw1TW9kZSwgc3ZnUm9vdFBhdGgpIHtcbiAgICAgICAgY29uc3QgYWJzVXJsID0gJGxvY2F0aW9uLmFic1VybCgpO1xuICAgICAgICBjb25zdCBjdHJsID0gdGhpcztcblxuICAgICAgICBjdHJsLmNoYW5nZVVybHNUb0Fic29sdXRlID0gY2hhbmdlVXJsc1RvQWJzb2x1dGU7XG4gICAgICAgIGN0cmwuY2hhbmdlWGxpbmtzVG9BYnNvbHV0ZSA9IGNoYW5nZVhsaW5rc1RvQWJzb2x1dGU7XG4gICAgICAgIGN0cmwudXBkYXRlR2x5cGggPSB1cGRhdGVHbHlwaDtcblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVHbHlwaChnbHlwaCkge1xuICAgICAgICAgICAgY29uc3QgZnVsbFN2Z1BhdGggPSBzdmdSb290UGF0aCArIGdseXBoICsgJy5zdmcnO1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGZ1bGxTdmdQYXRoLCB7IGNhY2hlOiAkdGVtcGxhdGVDYWNoZSB9KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIGljb25EaXJlY3RpdmVIdHRwU3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc3RyaW5naWZpZWRFbGVtZW50ID0gcmVzcG9uc2UuZGF0YTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaHRtbDVNb2RlLmVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZ2lmaWVkRWxlbWVudCA9IGNoYW5nZVVybHNUb0Fic29sdXRlKHN0cmluZ2lmaWVkRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmdpZmllZEVsZW1lbnQgPSBjaGFuZ2VYbGlua3NUb0Fic29sdXRlKHN0cmluZ2lmaWVkRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyaW5naWZpZWRFbGVtZW50O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2hhbmdlVXJsc1RvQWJzb2x1dGUoc3RyaW5naWZpZWRFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyaW5naWZpZWRFbGVtZW50LnJlcGxhY2UoL3VybFxcKChbJ1wiXT8pIy9naSwgJ3VybCgkMScgKyBhYnNVcmwgKyAnIycpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2hhbmdlWGxpbmtzVG9BYnNvbHV0ZShzdHJpbmdpZmllZEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmdpZmllZEVsZW1lbnQucmVwbGFjZSgveGxpbms6aHJlZj0oWydcIl0/KSMvZ2ksICd4bGluazpocmVmPSQxJyArIGFic1VybCArICcjJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiIsIi8qKlxuICogQGRlc2NyaXB0aW9uIEljb24gZGlyZWN0aXZlIHVzZWQgdG8gbG9hZCBhbiBpbmxpbmUgc3ZnIGljb24sIHNpbWxpYXIgdG8gaWNvblxuICogICAgICAgICAgICAgIGZvbnQgbWV0aG9kcyBvZiBwYXN0IDxpIGNsYXNzPVwiaWNvbi1mb28tYmFyXCI+PC9pPlxuICogQGV4YW1wbGVcbiAqIDxpY29uIGdseXBoPVwiaWMtYWRkLWNpcmNsZVwiPjwvaWNvbj5cbiAqL1xuYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmljb24uZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5pY29uLmNvbnRyb2xsZXInXG5dKVxuICAgIC5kaXJlY3RpdmUoJ2ljb24nLCBmdW5jdGlvbiBpY29uRGlyZWN0aXZlKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdJY29uQ3RybCBhcyBpY29uQ3RybCcsXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBnbHlwaDogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gaWNvbkRpcmVjdGl2ZUNvbXBpbGUodEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0RWxlbWVudC5hZGRDbGFzcygnaWNvbicpO1xuICAgICAgICAgICAgICAgIHRFbGVtZW50LmF0dHIoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gaWNvbkRpcmVjdGl2ZUxpbmsoJHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybCkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdpY29uQ3RybC5nbHlwaCcsIGZ1bmN0aW9uIGljb25EaXJlY3RpdmVMaW5rV2F0Y2gobmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0cmwudXBkYXRlR2x5cGgobmV3VmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gaWNvblVwZGF0ZUdseXBoVGhlbihzdmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5odG1sKHN2Zyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuaWNvbicsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuaWNvbi5kaXJlY3RpdmUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5pY29uLnN2Z1Jvb3RQYXRoJywgW10pXG4gICAgLnByb3ZpZGVyKCdzdmdSb290UGF0aCcsIGZ1bmN0aW9uIHN2Z1Jvb3RQYXRoUHJvdmlkZXJDb25maWcoKSB7XG4gICAgICAgIHRoaXMuc2V0Um9vdFBhdGggPSBzZXRSb290UGF0aDtcbiAgICAgICAgdGhpcy4kZ2V0ID0gZnVuY3Rpb24gc3ZnUm9vdFBhdGhQcm92aWRlckdldCgkbG9nKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdmdSb290UGF0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgJGxvZy5lcnJvcignTm8gc3ZnUm9vdFBhdGggcHJvdmlkZWQuIFBsZWFzZSBjb25maWd1cmUgdGhpcyB1c2luZyB0aGUgc3ZnUm9vdFBhdGhQcm92aWRlcicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdmdSb290UGF0aDtcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBzZXRSb290UGF0aChuZXdSb290UGF0aCkge1xuICAgICAgICAgICAgdGhpcy5zdmdSb290UGF0aCA9IG5ld1Jvb3RQYXRoO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIubG9hZGluZy1ub3RpZmljYXRpb24uZGlyZWN0aXZlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnbG9hZGluZ05vdGlmaWNhdGlvbicsIGZ1bmN0aW9uIGxvYWRpbmdOb3RpZmljYXRpb25EaXJlY3RpdmUoJHJvb3RTY29wZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL2JpZ2NvbW1lcmNlL2xvYWRpbmctbm90aWZpY2F0aW9uL2xvYWRpbmctbm90aWZpY2F0aW9uLnRwbC5odG1sJyxcblxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignYWpheFJlcXVlc3RSdW5uaW5nJywgZnVuY3Rpb24oZXZlbnQsIHZhbCkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5yZXF1ZXN0SW5Qcm9ncmVzcyA9IHZhbDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5sb2FkaW5nLW5vdGlmaWNhdGlvbicsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIubG9hZGluZy1ub3RpZmljYXRpb24uZGlyZWN0aXZlJ1xuXSk7XG4iLCIvKlxuICogT3ZlcnJpZGUgYW5ndWxhciBmb3VuZGF0aW9uJ3MgJG1vZGFsU3RhY2sgc2VydmljZSB0byByZW1vdmUgdGhlIGB0b3BgIGNzcyBwcm9wZXJ0eS5cbiAqIGNhbm5vdCB1c2UgYSBkZWNvcmF0b3IgYmVjYXVzZSB0aGUgYG9wZW5gIHJlbGllcyBvbiBjbG9zdXJlcyBhbmQgZG9lcyBub3QgcmV0dXJuIHRoZSBjb21waWxlZCBlbGVtZW50LlxuICogQ2hhbmdlcyBhcmUgYmV0d2VlbiBgLy8gQ2hhbmdlc2AgY29tbWVudHNcbiovXG5hbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtbW9kYWwubW9kYWxTdGFjay5zZXJ2aWNlJywgW1xuXG5dKVxuICAuZmFjdG9yeSgnJG1vZGFsU3RhY2snLCBbJyR3aW5kb3cnLCAnJHRyYW5zaXRpb24nLCAnJHRpbWVvdXQnLCAnJGRvY3VtZW50JywgJyRjb21waWxlJywgJyRyb290U2NvcGUnLCAnJCRzdGFja2VkTWFwJyxcbiAgICBmdW5jdGlvbiAoJHdpbmRvdywgJHRyYW5zaXRpb24sICR0aW1lb3V0LCAkZG9jdW1lbnQsICRjb21waWxlLCAkcm9vdFNjb3BlLCAkJHN0YWNrZWRNYXApIHtcbiAgICAgIC8vIENoYW5nZXM6IGNoYW5nZSBmcm9tIGBtb2RhbC1vcGVuYCB0byBgaGFzLWFjdGl2ZU1vZGFsYFxuICAgICAgdmFyIE9QRU5FRF9NT0RBTF9DTEFTUyA9ICdoYXMtYWN0aXZlTW9kYWwnO1xuICAgICAgLy8gQ2hhbmdlc1xuXG4gICAgICB2YXIgYmFja2Ryb3BEb21FbCwgYmFja2Ryb3BTY29wZTtcbiAgICAgIHZhciBvcGVuZWRXaW5kb3dzID0gJCRzdGFja2VkTWFwLmNyZWF0ZU5ldygpO1xuICAgICAgdmFyICRtb2RhbFN0YWNrID0ge307XG5cbiAgICAgIGZ1bmN0aW9uIGJhY2tkcm9wSW5kZXgoKSB7XG4gICAgICAgIHZhciB0b3BCYWNrZHJvcEluZGV4ID0gLTE7XG4gICAgICAgIHZhciBvcGVuZWQgPSBvcGVuZWRXaW5kb3dzLmtleXMoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcGVuZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAob3BlbmVkV2luZG93cy5nZXQob3BlbmVkW2ldKS52YWx1ZS5iYWNrZHJvcCkge1xuICAgICAgICAgICAgdG9wQmFja2Ryb3BJbmRleCA9IGk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0b3BCYWNrZHJvcEluZGV4O1xuICAgICAgfVxuXG4gICAgICAkcm9vdFNjb3BlLiR3YXRjaChiYWNrZHJvcEluZGV4LCBmdW5jdGlvbihuZXdCYWNrZHJvcEluZGV4KXtcbiAgICAgICAgaWYgKGJhY2tkcm9wU2NvcGUpIHtcbiAgICAgICAgICBiYWNrZHJvcFNjb3BlLmluZGV4ID0gbmV3QmFja2Ryb3BJbmRleDtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGZ1bmN0aW9uIHJlbW92ZU1vZGFsV2luZG93KG1vZGFsSW5zdGFuY2UpIHtcbiAgICAgICAgdmFyIGJvZHkgPSAkZG9jdW1lbnQuZmluZCgnYm9keScpLmVxKDApO1xuICAgICAgICB2YXIgbW9kYWxXaW5kb3cgPSBvcGVuZWRXaW5kb3dzLmdldChtb2RhbEluc3RhbmNlKS52YWx1ZTtcblxuICAgICAgICAvL2NsZWFuIHVwIHRoZSBzdGFja1xuICAgICAgICBvcGVuZWRXaW5kb3dzLnJlbW92ZShtb2RhbEluc3RhbmNlKTtcblxuICAgICAgICAvL3JlbW92ZSB3aW5kb3cgRE9NIGVsZW1lbnRcbiAgICAgICAgcmVtb3ZlQWZ0ZXJBbmltYXRlKG1vZGFsV2luZG93Lm1vZGFsRG9tRWwsIG1vZGFsV2luZG93Lm1vZGFsU2NvcGUsIDMwMCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbW9kYWxXaW5kb3cubW9kYWxTY29wZS4kZGVzdHJveSgpO1xuICAgICAgICAgIGJvZHkudG9nZ2xlQ2xhc3MoT1BFTkVEX01PREFMX0NMQVNTLCBvcGVuZWRXaW5kb3dzLmxlbmd0aCgpID4gMCk7XG4gICAgICAgICAgY2hlY2tSZW1vdmVCYWNrZHJvcCgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gY2hlY2tSZW1vdmVCYWNrZHJvcCgpIHtcbiAgICAgICAgLy9yZW1vdmUgYmFja2Ryb3AgaWYgbm8gbG9uZ2VyIG5lZWRlZFxuICAgICAgICBpZiAoYmFja2Ryb3BEb21FbCAmJiBiYWNrZHJvcEluZGV4KCkgPT0gLTEpIHtcbiAgICAgICAgICB2YXIgYmFja2Ryb3BTY29wZVJlZiA9IGJhY2tkcm9wU2NvcGU7XG4gICAgICAgICAgcmVtb3ZlQWZ0ZXJBbmltYXRlKGJhY2tkcm9wRG9tRWwsIGJhY2tkcm9wU2NvcGUsIDE1MCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYmFja2Ryb3BTY29wZVJlZi4kZGVzdHJveSgpO1xuICAgICAgICAgICAgYmFja2Ryb3BTY29wZVJlZiA9IG51bGw7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYmFja2Ryb3BEb21FbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBiYWNrZHJvcFNjb3BlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHJlbW92ZUFmdGVyQW5pbWF0ZShkb21FbCwgc2NvcGUsIGVtdWxhdGVUaW1lLCBkb25lKSB7XG4gICAgICAgIC8vIENsb3NpbmcgYW5pbWF0aW9uXG4gICAgICAgIHNjb3BlLmFuaW1hdGUgPSBmYWxzZTtcblxuICAgICAgICB2YXIgdHJhbnNpdGlvbkVuZEV2ZW50TmFtZSA9ICR0cmFuc2l0aW9uLnRyYW5zaXRpb25FbmRFdmVudE5hbWU7XG4gICAgICAgIGlmICh0cmFuc2l0aW9uRW5kRXZlbnROYW1lKSB7XG4gICAgICAgICAgLy8gdHJhbnNpdGlvbiBvdXRcbiAgICAgICAgICB2YXIgdGltZW91dCA9ICR0aW1lb3V0KGFmdGVyQW5pbWF0aW5nLCBlbXVsYXRlVGltZSk7XG5cbiAgICAgICAgICBkb21FbC5iaW5kKHRyYW5zaXRpb25FbmRFdmVudE5hbWUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICR0aW1lb3V0LmNhbmNlbCh0aW1lb3V0KTtcbiAgICAgICAgICAgIGFmdGVyQW5pbWF0aW5nKCk7XG4gICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBFbnN1cmUgdGhpcyBjYWxsIGlzIGFzeW5jXG4gICAgICAgICAgJHRpbWVvdXQoYWZ0ZXJBbmltYXRpbmcsIDApO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYWZ0ZXJBbmltYXRpbmcoKSB7XG4gICAgICAgICAgaWYgKGFmdGVyQW5pbWF0aW5nLmRvbmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgYWZ0ZXJBbmltYXRpbmcuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICBkb21FbC5yZW1vdmUoKTtcbiAgICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAkZG9jdW1lbnQuYmluZCgna2V5ZG93bicsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgdmFyIG1vZGFsO1xuXG4gICAgICAgIGlmIChldnQud2hpY2ggPT09IDI3KSB7XG4gICAgICAgICAgbW9kYWwgPSBvcGVuZWRXaW5kb3dzLnRvcCgpO1xuICAgICAgICAgIGlmIChtb2RhbCAmJiBtb2RhbC52YWx1ZS5rZXlib2FyZCkge1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAkbW9kYWxTdGFjay5kaXNtaXNzKG1vZGFsLmtleSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAkbW9kYWxTdGFjay5vcGVuID0gZnVuY3Rpb24gKG1vZGFsSW5zdGFuY2UsIG1vZGFsKSB7XG5cbiAgICAgICAgb3BlbmVkV2luZG93cy5hZGQobW9kYWxJbnN0YW5jZSwge1xuICAgICAgICAgIGRlZmVycmVkOiBtb2RhbC5kZWZlcnJlZCxcbiAgICAgICAgICBtb2RhbFNjb3BlOiBtb2RhbC5zY29wZSxcbiAgICAgICAgICBiYWNrZHJvcDogbW9kYWwuYmFja2Ryb3AsXG4gICAgICAgICAga2V5Ym9hcmQ6IG1vZGFsLmtleWJvYXJkXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBib2R5ID0gJGRvY3VtZW50LmZpbmQoJ2JvZHknKS5lcSgwKSxcbiAgICAgICAgICAgIGN1cnJCYWNrZHJvcEluZGV4ID0gYmFja2Ryb3BJbmRleCgpO1xuXG4gICAgICAgIGlmIChjdXJyQmFja2Ryb3BJbmRleCA+PSAwICYmICFiYWNrZHJvcERvbUVsKSB7XG4gICAgICAgICAgYmFja2Ryb3BTY29wZSA9ICRyb290U2NvcGUuJG5ldyh0cnVlKTtcbiAgICAgICAgICBiYWNrZHJvcFNjb3BlLmluZGV4ID0gY3VyckJhY2tkcm9wSW5kZXg7XG4gICAgICAgICAgYmFja2Ryb3BEb21FbCA9ICRjb21waWxlKCc8ZGl2IG1vZGFsLWJhY2tkcm9wPjwvZGl2PicpKGJhY2tkcm9wU2NvcGUpO1xuICAgICAgICAgIGJvZHkuYXBwZW5kKGJhY2tkcm9wRG9tRWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hhbmdlczogZGVsZXRpb24gb2YgY3NzIHRvcCBwcm9wZXJ0eSBjYWxjdWxhdGlvblxuICAgICAgICB2YXIgYW5ndWxhckRvbUVsID0gYW5ndWxhci5lbGVtZW50KCc8ZGl2IG1vZGFsLXdpbmRvdyBzdHlsZT1cInZpc2liaWxpdHk6IHZpc2libGU7IGRpc3BsYXk6IGJsb2NrXCI+PC9kaXY+Jyk7XG4gICAgICAgIGFuZ3VsYXJEb21FbC5hdHRyKCd3aW5kb3ctY2xhc3MnLCBtb2RhbC53aW5kb3dDbGFzcyk7XG4gICAgICAgIGFuZ3VsYXJEb21FbC5hdHRyKCdpbmRleCcsIG9wZW5lZFdpbmRvd3MubGVuZ3RoKCkgLSAxKTtcbiAgICAgICAgYW5ndWxhckRvbUVsLmF0dHIoJ2FuaW1hdGUnLCAnYW5pbWF0ZScpO1xuICAgICAgICBhbmd1bGFyRG9tRWwuaHRtbChtb2RhbC5jb250ZW50KTtcblxuICAgICAgICB2YXIgbW9kYWxEb21FbCA9ICRjb21waWxlKGFuZ3VsYXJEb21FbCkobW9kYWwuc2NvcGUpO1xuICAgICAgICBvcGVuZWRXaW5kb3dzLnRvcCgpLnZhbHVlLm1vZGFsRG9tRWwgPSBtb2RhbERvbUVsO1xuICAgICAgICBib2R5LmFwcGVuZChtb2RhbERvbUVsKTtcbiAgICAgICAgYm9keS5hZGRDbGFzcyhPUEVORURfTU9EQUxfQ0xBU1MpO1xuICAgICAgfTtcblxuICAgICAgJG1vZGFsU3RhY2suY2xvc2UgPSBmdW5jdGlvbiAobW9kYWxJbnN0YW5jZSwgcmVzdWx0KSB7XG4gICAgICAgIHZhciBtb2RhbFdpbmRvdyA9IG9wZW5lZFdpbmRvd3MuZ2V0KG1vZGFsSW5zdGFuY2UpLnZhbHVlO1xuICAgICAgICBpZiAobW9kYWxXaW5kb3cpIHtcbiAgICAgICAgICBtb2RhbFdpbmRvdy5kZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgcmVtb3ZlTW9kYWxXaW5kb3cobW9kYWxJbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgICRtb2RhbFN0YWNrLmRpc21pc3MgPSBmdW5jdGlvbiAobW9kYWxJbnN0YW5jZSwgcmVhc29uKSB7XG4gICAgICAgIHZhciBtb2RhbFdpbmRvdyA9IG9wZW5lZFdpbmRvd3MuZ2V0KG1vZGFsSW5zdGFuY2UpLnZhbHVlO1xuICAgICAgICBpZiAobW9kYWxXaW5kb3cpIHtcbiAgICAgICAgICBtb2RhbFdpbmRvdy5kZWZlcnJlZC5yZWplY3QocmVhc29uKTtcbiAgICAgICAgICByZW1vdmVNb2RhbFdpbmRvdyhtb2RhbEluc3RhbmNlKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgJG1vZGFsU3RhY2suZGlzbWlzc0FsbCA9IGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgdmFyIHRvcE1vZGFsID0gdGhpcy5nZXRUb3AoKTtcbiAgICAgICAgd2hpbGUgKHRvcE1vZGFsKSB7XG4gICAgICAgICAgdGhpcy5kaXNtaXNzKHRvcE1vZGFsLmtleSwgcmVhc29uKTtcbiAgICAgICAgICB0b3BNb2RhbCA9IHRoaXMuZ2V0VG9wKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgICRtb2RhbFN0YWNrLmdldFRvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG9wZW5lZFdpbmRvd3MudG9wKCk7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gJG1vZGFsU3RhY2s7XG4gICAgfV0pO1xuXG4iLCIvKlxuICogVGhpcyBtb2R1bGUgbW9kaWZpZXMgYW5ndWxhciBmb3VuZGF0aW9uJ3MgbW9kYWwgaW1wbGVtZW50YXRpb24uIFRoaXMgZG9lcyBub3QgY3JlYXRlIGEgbmV3IG1vZGFsIHNlcnZpY2UvZGlyZWN0aXZlLlxuICpcbiovXG5hbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtbW9kYWwnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLW1vZGFsLm1vZGFsU3RhY2suc2VydmljZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmxvYWRpbmctb3ZlcmxheS5jb250cm9sbGVyJywgW10pXG4gICAgLmNvbnRyb2xsZXIoJ0xvYWRpbmdPdmVybGF5Q3RybCcsIGZ1bmN0aW9uIExvYWRpbmdPdmVybGF5Q3RybCgkcm9vdFNjb3BlLCAkdGltZW91dCkge1xuICAgICAgICB2YXIgY3RybCA9IHRoaXMsXG4gICAgICAgICAgICBkZWZhdWx0RGVib3VuY2UgPSAxMDAsXG4gICAgICAgICAgICB0aW1lb3V0O1xuXG4gICAgICAgIGlmIChjdHJsLmRlYm91bmNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGN0cmwuZGVib3VuY2UgPSBkZWZhdWx0RGVib3VuY2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3RybC51c2VVaVJvdXRlcikge1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0Jywgc3RhcnRMb2FkaW5nKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgc3RvcExvYWRpbmcpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZUVycm9yJywgc3RvcExvYWRpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc3RhcnRMb2FkaW5nKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGltZW91dCA9ICR0aW1lb3V0KGZ1bmN0aW9uIHN0YXJ0TG9hZGluZ1RpbWVyKCkge1xuICAgICAgICAgICAgICAgIGN0cmwubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICB9LCBjdHJsLmRlYm91bmNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHN0b3BMb2FkaW5nKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVvdXQpO1xuICAgICAgICAgICAgY3RybC5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5sb2FkaW5nLW92ZXJsYXkuZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5sb2FkaW5nLW92ZXJsYXkuY29udHJvbGxlcidcbl0pXG4gICAgLmRpcmVjdGl2ZSgnbG9hZGluZ092ZXJsYXknLCBmdW5jdGlvbiBsb2FkaW5nT3ZlcmxheSgkY29tcGlsZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2FkaW5nT3ZlcmxheUN0cmwgYXMgbG9hZGluZ092ZXJsYXlDdHJsJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIGRlYm91bmNlOiAnPT8nLFxuICAgICAgICAgICAgICAgIGxvYWRpbmc6ICc9P2xvYWRpbmdPdmVybGF5JyxcbiAgICAgICAgICAgICAgICB1c2VVaVJvdXRlcjogJz0/J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGxvYWRpbmdPdmVybGF5Q29tcGlsZShlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnbG9hZGluZ092ZXJsYXktY29udGFpbmVyJyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gbG9hZGluZ092ZXJsYXlMaW5rKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG92ZXJsYXkgPSAkY29tcGlsZSgnPGRpdiBjbGFzcz1cImxvYWRpbmdPdmVybGF5XCIgbmctaWY9XCJsb2FkaW5nT3ZlcmxheUN0cmwubG9hZGluZ1wiPjwvZGl2PicpKHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hcHBlbmQob3ZlcmxheSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5sb2FkaW5nLW92ZXJsYXknLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmxvYWRpbmctb3ZlcmxheS5kaXJlY3RpdmUnXG5dKTtcbiIsIi8qKlxuICogQGRlc2NyaXB0aW9uIFNwcml0ZSBkaXJlY3RpdmUgdXNlZCB0byBsb2FkIGFuIGljb24gZnJvbSBhbiBpbWFnZSBzcHJpdGUsXG4gKiAgICAgICAgICAgICAgc2ltbGlhciB0byB0aGUgaWNvbiBkaXJlY3RpdmUgYnV0IGxlc3MgU1ZHXG4gKiBAZXhhbXBsZVxuICogPHNwcml0ZSBnbHlwaD1cImljLWFtZXhcIj48L3Nwcml0ZT5cbiAqL1xuXG5hbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuc3ByaXRlLmRpcmVjdGl2ZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ3Nwcml0ZScsIGZ1bmN0aW9uIHNwcml0ZURpcmVjdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIGdseXBoOiAnQCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb21waWxlOiBzcHJpdGVEaXJlY3RpdmVDb21waWxlXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gc3ByaXRlRGlyZWN0aXZlQ29tcGlsZSh0RWxlbWVudCkge1xuICAgICAgICAgICAgdEVsZW1lbnQuYWRkQ2xhc3MoJ3Nwcml0ZScpO1xuICAgICAgICAgICAgdEVsZW1lbnQuYXR0cignYXJpYS1oaWRkZW4nLCB0cnVlKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIHNwcml0ZURpcmVjdGl2ZUxpbmsoJHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgIGF0dHJzLiRvYnNlcnZlKCdnbHlwaCcsIChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmF0dHIoJ2NsYXNzJywgJ3Nwcml0ZSBzcHJpdGUtLScgKyBuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuc3ByaXRlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5zcHJpdGUuZGlyZWN0aXZlJ1xuXSk7XG4iLCIvKipcbiAqIEBkZXNjcmlwdGlvbiBVc2VkIHRvIGNyZWF0ZSBhIHRvZ2dsZSBzd2l0Y2ggZm9yIGZvcm1zXG4gKiBAZXhhbXBsZVxuICAgIDxzd2l0Y2ggbmctbW9kZWw9XCJjdHJsLnN3aXRjaE1vZGVsMVwiPjwvc3dpdGNoPlxuXG4gICAgPHN3aXRjaFxuICAgICAgICB0b2dnbGUtb2ZmLXRleHQ9XCJPZmZcIlxuICAgICAgICB0b2dnbGUtb24tdGV4dD1cIk9uXCJcbiAgICAgICAgbmctbW9kZWw9XCJjdHJsLnN3aXRjaE1vZGVsMlwiPlxuICAgIDwvc3dpdGNoPlxuXG4gICAgPHN3aXRjaFxuICAgICAgICBoYXMtaWNvblxuICAgICAgICBuZy1tb2RlbD1cImN0cmwuc3dpdGNoTW9kZWwzXCI+XG4gICAgPC9zd2l0Y2g+XG5cbiAgICA8c3dpdGNoXG4gICAgICAgIGlzLWltcG9ydGFudFxuICAgICAgICBsZWZ0LWxhYmVsPVwiRG93biBmb3IgTWFpbnRlbmFuY2VcIlxuICAgICAgICByaWdodC1sYWJlbD1cIk9wZW5cIlxuICAgICAgICBuZy1tb2RlbD1cImN0cmwuc3dpdGNoTW9kZWw0XCI+XG4gICAgPC9zd2l0Y2g+XG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5zd2l0Y2guZGlyZWN0aXZlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnc3dpdGNoJywgZnVuY3Rpb24gc3dpdGNoRGlyZWN0aXZlKCkge1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldFVuaXF1ZUlEKGlkUHJlZml4KSB7XG4gICAgICAgICAgICByZXR1cm4gXy51bmlxdWVJZChpZFByZWZpeCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL2JpZ2NvbW1lcmNlL3N3aXRjaC9zd2l0Y2gudHBsLmh0bWwnLFxuICAgICAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBhcmlhRGVzY3JpcHRpb246ICdAJyxcbiAgICAgICAgICAgICAgICBpc0Rpc2FibGVkOiAnPW5nRGlzYWJsZWQnLFxuICAgICAgICAgICAgICAgIGxhYmVsVGV4dDogJ0AnLFxuICAgICAgICAgICAgICAgIGxlZnREZXNjcmlwdGlvbjogJ0AnLFxuICAgICAgICAgICAgICAgIG5nRmFsc2VWYWx1ZTogJ0AnLFxuICAgICAgICAgICAgICAgIG5nVHJ1ZVZhbHVlOiAnQCcsXG4gICAgICAgICAgICAgICAgcmlnaHREZXNjcmlwdGlvbjogJ0AnLFxuICAgICAgICAgICAgICAgIHRvZ2dsZU9mZkxhYmVsOiAnQCcsXG4gICAgICAgICAgICAgICAgdG9nZ2xlT25MYWJlbDogJ0AnLFxuICAgICAgICAgICAgICAgIHVuaXF1ZUlkOiAnQCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnc3dpdGNoQ3RybCcsXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiBzd2l0Y2hEaXJlY3RpdmVDb21waWxlKHRFbGVtLCB0QXR0cnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hlY2tib3hFbGVtID0gdEVsZW0uZmluZCgnaW5wdXQnKTtcblxuICAgICAgICAgICAgICAgIGlmICh0QXR0cnMubmdGYWxzZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrYm94RWxlbS5hdHRyKCduZy1mYWxzZS12YWx1ZScsIHRBdHRycy5uZ0ZhbHNlVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0QXR0cnMubmdUcnVlVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tib3hFbGVtLmF0dHIoJ25nLXRydWUtdmFsdWUnLCB0QXR0cnMubmdUcnVlVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBzd2l0Y2hEaXJlY3RpdmVQb3N0TGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMsIG5nTW9kZWxDdHJsKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnN3aXRjaEN0cmwuaW5pdChuZ01vZGVsQ3RybCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiBzd2l0Y2hEaXJlY3RpdmVDdHJsKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycykge1xuICAgICAgICAgICAgICAgIHZhciBjdHJsID0gdGhpcztcblxuICAgICAgICAgICAgICAgIC8vIHN0YXRlXG4gICAgICAgICAgICAgICAgY3RybC5pc0ltcG9ydGFudCA9IGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRycy5pc0ltcG9ydGFudCkgJiYgJGF0dHJzLmlzSW1wb3J0YW50ICE9PSAnZmFsc2UnO1xuICAgICAgICAgICAgICAgIGN0cmwuaGFzSWNvbiA9IGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRycy5oYXNJY29uKSAmJiAkYXR0cnMuaGFzSWNvbiAhPT0gJ2ZhbHNlJztcblxuICAgICAgICAgICAgICAgIC8vIGxhYmVsc1xuICAgICAgICAgICAgICAgIGN0cmwubGFiZWxUZXh0ID0gJGF0dHJzLnRvZ2dsZU9mZkxhYmVsO1xuXG4gICAgICAgICAgICAgICAgLy8gaWRzXG4gICAgICAgICAgICAgICAgY3RybC51bmlxdWVJZCA9IGdldFVuaXF1ZUlEKCdzd2l0Y2gtJyk7XG4gICAgICAgICAgICAgICAgY3RybC5hcmlhRGVzY3JpcHRpb25JRCA9IGdldFVuaXF1ZUlEKCdzd2l0Y2gtYXJpYURlc2NyaXB0aW9uLScpO1xuXG4gICAgICAgICAgICAgICAgY3RybC5pbml0ID0gaW5pdDtcbiAgICAgICAgICAgICAgICBjdHJsLnVwZGF0ZU1vZGVsID0gdXBkYXRlTW9kZWw7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBpbml0KG5nTW9kZWxDdHJsKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0cmwubmdNb2RlbEN0cmwgPSBuZ01vZGVsQ3RybDtcbiAgICAgICAgICAgICAgICAgICAgY3RybC52YWx1ZSA9IGN0cmwubmdNb2RlbEN0cmwuJG1vZGVsVmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgnc3dpdGNoQ3RybC5uZ01vZGVsQ3RybC4kbW9kZWxWYWx1ZScsIGZ1bmN0aW9uIHN3aXRjaFZhbHVlQ2hhbmdlZChuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3RybC52YWx1ZSA9IG5ld1ZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjdHJsLmlzQ2hlY2tlZCA9IF8uaXNTdHJpbmcobmV3VmFsdWUpID8gXCInXCIgKyBuZXdWYWx1ZSArIFwiJ1wiID09PSBjdHJsLm5nVHJ1ZVZhbHVlIDogbmV3VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHJsLmxhYmVsVGV4dCA9ICEhY3RybC5pc0NoZWNrZWQgPyBjdHJsLnRvZ2dsZU9uTGFiZWw6IGN0cmwudG9nZ2xlT2ZmTGFiZWw7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZU1vZGVsKCkge1xuICAgICAgICAgICAgICAgICAgICBjdHJsLm5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUoY3RybC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuc3dpdGNoJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5zd2l0Y2guZGlyZWN0aXZlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIudXRpbCcsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIudXRpbC50cnVzdEFzSHRtbCdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXNlcnZlci10YWJsZS5zZXJ2aWNlJywgW1xuICAgICd1aS5yb3V0ZXInXG5dKVxuICAgIC5mYWN0b3J5KCdCY1NlcnZlclRhYmxlJywgZnVuY3Rpb24gYmNTZXJ2ZXJUYWJsZSgkbG9nLCAkcSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgdmFyIGRlZmF1bHRUYWJsZUNvbmZpZyA9IHtcbiAgICAgICAgICAgIGZpbHRlcnM6IFtdLFxuICAgICAgICAgICAgcXVlcnlLZXlzOiB7XG4gICAgICAgICAgICAgICAgcGFnZTogJ3BhZ2UnLFxuICAgICAgICAgICAgICAgIGxpbWl0OiAnbGltaXQnLFxuICAgICAgICAgICAgICAgIHNvcnRCeTogJ3NvcnQtYnknLFxuICAgICAgICAgICAgICAgIHNvcnREaXI6ICdzb3J0LW9yZGVyJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJvd0lkS2V5OiAnaWQnLFxuICAgICAgICAgICAgc29ydERpclZhbHVlczoge1xuICAgICAgICAgICAgICAgIGFzYzogJ2FzYycsXG4gICAgICAgICAgICAgICAgZGVzYzogJ2Rlc2MnXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gU2VydmVyVGFibGUodGFibGVJZCwgdGFibGVDb25maWcpIHtcbiAgICAgICAgICAgIHRoaXMuYWxsU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVycyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5pZCA9IHRhYmxlSWQ7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgcGFnZTogbnVsbCxcbiAgICAgICAgICAgICAgICBsaW1pdDogbnVsbCxcbiAgICAgICAgICAgICAgICB0b3RhbDogbnVsbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMucGVuZGluZ1JlcXVlc3QgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMucmVzb3VyY2VDYWxsYmFjayA9IGFuZ3VsYXIubm9vcDtcbiAgICAgICAgICAgIHRoaXMucm93cyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFJvd3MgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuc29ydEJ5ID0gJyc7XG4gICAgICAgICAgICB0aGlzLnNvcnREaXIgPSAnJztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy50YWJsZUNvbmZpZyA9IF8uaXNPYmplY3QodGFibGVDb25maWcpID8gdGFibGVDb25maWcgOiB7fTtcbiAgICAgICAgICAgIHRoaXMudGFibGVDb25maWcgPSBfLmRlZmF1bHRzKHRoaXMudGFibGVDb25maWcsIGRlZmF1bHRUYWJsZUNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICBTZXJ2ZXJUYWJsZS5wcm90b3R5cGUgPSB7XG4gICAgICAgICAgICBjcmVhdGVQYXJhbXNPYmplY3Q6IGNyZWF0ZVBhcmFtc09iamVjdCxcbiAgICAgICAgICAgIGRlc2VsZWN0QWxsUm93czogZGVzZWxlY3RBbGxSb3dzLFxuICAgICAgICAgICAgZmV0Y2hSZXNvdXJjZTogZmV0Y2hSZXNvdXJjZSxcbiAgICAgICAgICAgIGdldFNlbGVjdGVkUm93czogZ2V0U2VsZWN0ZWRSb3dzLFxuICAgICAgICAgICAgaW5pdDogaW5pdCxcbiAgICAgICAgICAgIGlzUm93U2VsZWN0ZWQ6IGlzUm93U2VsZWN0ZWQsXG4gICAgICAgICAgICBsb2FkU3RhdGVQYXJhbXM6IGxvYWRTdGF0ZVBhcmFtcyxcbiAgICAgICAgICAgIHNlbGVjdEFsbFJvd3M6IHNlbGVjdEFsbFJvd3MsXG4gICAgICAgICAgICBzZXRQYWdpbmF0aW9uVmFsdWVzOiBzZXRQYWdpbmF0aW9uVmFsdWVzLFxuICAgICAgICAgICAgc2V0Um93czogc2V0Um93cyxcbiAgICAgICAgICAgIHNldFNlbGVjdGlvbkZvckFsbFJvd3M6IHNldFNlbGVjdGlvbkZvckFsbFJvd3MsXG4gICAgICAgICAgICBzZXRTb3J0aW5nVmFsdWVzOiBzZXRTb3J0aW5nVmFsdWVzLFxuICAgICAgICAgICAgdXBkYXRlUGFnZTogdXBkYXRlUGFnZSxcbiAgICAgICAgICAgIHVwZGF0ZVNvcnQ6IHVwZGF0ZVNvcnQsXG4gICAgICAgICAgICB1cGRhdGVUYWJsZTogdXBkYXRlVGFibGUsXG4gICAgICAgICAgICB2YWxpZGF0ZVJlc291cmNlOiB2YWxpZGF0ZVJlc291cmNlXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlUGFyYW1zT2JqZWN0KCkge1xuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHt9LFxuICAgICAgICAgICAgICAgIHF1ZXJ5S2V5cyA9IHRoaXMudGFibGVDb25maWcucXVlcnlLZXlzLFxuICAgICAgICAgICAgICAgIHF1ZXJ5UGFyYW1NYXAgPSBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlLZXk6IHF1ZXJ5S2V5cy5wYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMucGFnaW5hdGlvbi5wYWdlXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5S2V5OiBxdWVyeUtleXMubGltaXQsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5wYWdpbmF0aW9uLmxpbWl0XG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5S2V5OiBxdWVyeUtleXMuc29ydEJ5LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuc29ydEJ5XG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5S2V5OiBxdWVyeUtleXMuc29ydERpcixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLnNvcnREaXJcbiAgICAgICAgICAgICAgICAgICAgfV07XG5cbiAgICAgICAgICAgIF8uZWFjaChxdWVyeVBhcmFtTWFwLCBmdW5jdGlvbiBxdWVyeVBhcmFtTWFwRWFjaChwYXJhbSkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJhbS5xdWVyeUtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmFtc1twYXJhbS5xdWVyeUtleV0gPSBwYXJhbS52YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgXy5leHRlbmQocGFyYW1zLCB0aGlzLmZpbHRlcnMpO1xuXG4gICAgICAgICAgICByZXR1cm4gcGFyYW1zO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZGVzZWxlY3RBbGxSb3dzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0U2VsZWN0aW9uRm9yQWxsUm93cyhmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmZXRjaFJlc291cmNlKCkge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy5wZW5kaW5nUmVxdWVzdCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZUNhbGxiYWNrKHRoaXMuY3JlYXRlUGFyYW1zT2JqZWN0KCkpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gcmVzb3VyY2VDYWxsYmFja1RoZW4ocmVzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF90aGlzLnZhbGlkYXRlUmVzb3VyY2UocmVzb3VyY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5zZXRSb3dzKHJlc291cmNlLnJvd3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuc2V0UGFnaW5hdGlvblZhbHVlcyhyZXNvdXJjZS5wYWdpbmF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcztcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiByZXNvdXJjZUNhbGxiYWNrQ2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgJGxvZy5lcnJvcignYmMtc2VydmVyLXRhYmxlIGRpcmVjdGl2ZTogZmFpbGVkIHRvIGZldGNoIHJlc291cmNlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZmluYWxseShmdW5jdGlvbiByZXNvdXJjZUNhbGxiYWNrRmluYWxseSgpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMucGVuZGluZ1JlcXVlc3QgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFNlbGVjdGVkUm93cygpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHJldHVybiBfLmZpbHRlcih0aGlzLnJvd3MsIGZ1bmN0aW9uIGdldFNlbGVjdGVkUm93c0ZpbHRlcihyb3cpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuaXNSb3dTZWxlY3RlZChyb3cpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpbml0KGNvbmZpZykge1xuICAgICAgICAgICAgaWYgKCFfLmlzT2JqZWN0KGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICBjb25maWcgPSB7fTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihjb25maWcucmVzb3VyY2VDYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc291cmNlQ2FsbGJhY2sgPSBjb25maWcucmVzb3VyY2VDYWxsYmFjaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgICAgICAgICAubG9hZFN0YXRlUGFyYW1zKGNvbmZpZy5zdGF0ZVBhcmFtcylcbiAgICAgICAgICAgICAgICAuZmV0Y2hSZXNvdXJjZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNSb3dTZWxlY3RlZChyb3cpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkUm93c1tyb3dbdGhpcy50YWJsZUNvbmZpZy5yb3dJZEtleV1dO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbG9hZFN0YXRlUGFyYW1zKHN0YXRlUGFyYW1zKSB7XG4gICAgICAgICAgICB2YXIgcXVlcnlLZXlzID0gdGhpcy50YWJsZUNvbmZpZy5xdWVyeUtleXMsXG4gICAgICAgICAgICAgICAgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICBzdGF0ZVBhcmFtcyA9IHN0YXRlUGFyYW1zIHx8ICRzdGF0ZVBhcmFtcztcblxuICAgICAgICAgICAgdGhpcy5zZXRQYWdpbmF0aW9uVmFsdWVzKHtcbiAgICAgICAgICAgICAgICBwYWdlOiBzdGF0ZVBhcmFtc1txdWVyeUtleXMucGFnZV0sXG4gICAgICAgICAgICAgICAgbGltaXQ6IHN0YXRlUGFyYW1zW3F1ZXJ5S2V5cy5saW1pdF1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnNldFNvcnRpbmdWYWx1ZXMoc3RhdGVQYXJhbXNbcXVlcnlLZXlzLnNvcnRCeV0sIHN0YXRlUGFyYW1zW3F1ZXJ5S2V5cy5zb3J0RGlyXSk7XG5cbiAgICAgICAgICAgIC8vIHNldCBmaWx0ZXJzIGZyb20gcXVlcnkgcGFyYW1zXG4gICAgICAgICAgICBfLmVhY2godGhpcy50YWJsZUNvbmZpZy5maWx0ZXJzLCBmdW5jdGlvbiBzZXRGaWx0ZXJzRWFjaCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIF90aGlzLmZpbHRlcnNbdmFsdWVdID0gc3RhdGVQYXJhbXNbdmFsdWVdO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhpcyBpcyBhY3R1YWxseSBhIHRvZ2dsZSBub3QganVzdCBhIHNlbGVjdFxuICAgICAgICBmdW5jdGlvbiBzZWxlY3RBbGxSb3dzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0U2VsZWN0aW9uRm9yQWxsUm93cyghdGhpcy5hbGxTZWxlY3RlZCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRQYWdpbmF0aW9uVmFsdWVzKHBhZ2luYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbiA9IHRoaXMucGFnaW5hdGlvbiB8fCB7fTtcbiAgICAgICAgICAgIF8uZXh0ZW5kKHRoaXMucGFnaW5hdGlvbiwgcGFnaW5hdGlvbik7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0Um93cyhyb3dzKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLnJvd3MgPSByb3dzO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFJvd3MgPSBfLnJlZHVjZShyb3dzLCBmdW5jdGlvbiBpbml0aWFsaXplU2VsZWN0ZWRSb3dzT2JqZWN0KGFjY3VtLCByb3cpIHtcbiAgICAgICAgICAgICAgICBhY2N1bVtyb3dbX3RoaXMudGFibGVDb25maWcucm93SWRLZXldXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2N1bTtcbiAgICAgICAgICAgIH0sIHt9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRTZWxlY3Rpb25Gb3JBbGxSb3dzKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICB2YWx1ZSA9ICEhdmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuYWxsU2VsZWN0ZWQgPSB2YWx1ZTtcblxuICAgICAgICAgICAgXy5lYWNoKHRoaXMuc2VsZWN0ZWRSb3dzLCBmdW5jdGlvbiBhbGxSb3dzSXRlcmF0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5zZWxlY3RlZFJvd3Nba2V5XSA9IF90aGlzLmFsbFNlbGVjdGVkO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0U29ydGluZ1ZhbHVlcyhzb3J0QnksIHNvcnREaXIpIHtcbiAgICAgICAgICAgIHRoaXMuc29ydEJ5ID0gc29ydEJ5IHx8IHRoaXMuc29ydEJ5O1xuICAgICAgICAgICAgdGhpcy5zb3J0RGlyID0gc29ydERpciB8fCB0aGlzLnNvcnREaXI7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlUGFnZShwYWdlLCBsaW1pdCwgdG90YWwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgICAgICAgICAgLnNldFBhZ2luYXRpb25WYWx1ZXMocGFnZSwgbGltaXQsIHRvdGFsKVxuICAgICAgICAgICAgICAgIC51cGRhdGVUYWJsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlU29ydChzb3J0QnksIHNvcnREaXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgICAgICAgICAgLnNldFNvcnRpbmdWYWx1ZXMoc29ydEJ5LCBzb3J0RGlyKVxuICAgICAgICAgICAgICAgIC5zZXRQYWdpbmF0aW9uVmFsdWVzKHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZTogMVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnVwZGF0ZVRhYmxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVUYWJsZSgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5wZW5kaW5nUmVxdWVzdCkge1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygkc3RhdGUuY3VycmVudC5uYW1lLCB0aGlzLmNyZWF0ZVBhcmFtc09iamVjdCgpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB2YWxpZGF0ZVJlc291cmNlKHJlc291cmNlKSB7XG4gICAgICAgICAgICBpZiAoIV8uaXNPYmplY3QocmVzb3VyY2UpKSB7XG4gICAgICAgICAgICAgICAgJGxvZy5lcnJvcignYmMtc2VydmVyLXRhYmxlIGRpcmVjdGl2ZTogUmVzb3VyY2UgY2FsbGJhY2sgbXVzdCByZXR1cm4gYW4gb2JqZWN0Jyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIV8uaXNBcnJheShyZXNvdXJjZS5yb3dzKSkge1xuICAgICAgICAgICAgICAgICRsb2cuZXJyb3IoJ2JjLXNlcnZlci10YWJsZSBkaXJlY3RpdmU6IHJldHVybmVkIG9iamVjdCBtdXN0IGNvbnRhaW4gYSByb3dzIHByb3BlcnR5IHRoYXQgaXMgYW4gYXJyYXkuJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIV8uaXNPYmplY3QocmVzb3VyY2UucGFnaW5hdGlvbikpIHtcbiAgICAgICAgICAgICAgICAkbG9nLmVycm9yKCdiYy1zZXJ2ZXItdGFibGUgZGlyZWN0aXZlOiByZXR1cm5lZCBvYmplY3QgbXVzdCBjb250YWluIGEgcGFnaW5hdGlvbiBwcm9wZXJ0eSB0aGF0IGlzIGFuIG9iamVjdC4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFNlcnZlclRhYmxlO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXNlcnZlci10YWJsZS1mYWN0b3J5LnNlcnZpY2UnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXNlcnZlci10YWJsZS5zZXJ2aWNlJ1xuXSlcbiAgICAuZmFjdG9yeSgnYmNTZXJ2ZXJUYWJsZUZhY3RvcnknLCBmdW5jdGlvbiBiY1NlcnZlclRhYmxlRmFjdG9yeSgkbG9nLCBCY1NlcnZlclRhYmxlKSB7XG4gICAgICAgIHZhciB0YWJsZXMgPSB7fSxcbiAgICAgICAgICAgIHNlcnZpY2UgPSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlOiBjcmVhdGUsXG4gICAgICAgICAgICAgICAgZ2V0OiBnZXQsXG4gICAgICAgICAgICAgICAgcmVtb3ZlOiByZW1vdmVcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlKHRhYmxlSWQsIHRhYmxlQ29uZmlnKSB7XG4gICAgICAgICAgICBpZiAodGFibGVJZCBpbiB0YWJsZXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VydmljZS5nZXQodGFibGVJZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdGFibGVJZCkge1xuICAgICAgICAgICAgICAgIHRhYmxlSWQgPSBfLnVuaXF1ZUlkKCdiYy1zZXJ2ZXItdGFibGUtaW5zdGFuY2UtJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhYmxlc1t0YWJsZUlkXSA9IG5ldyBCY1NlcnZlclRhYmxlKHRhYmxlSWQsIHRhYmxlQ29uZmlnKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRhYmxlc1t0YWJsZUlkXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldCh0YWJsZUlkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGFibGVzW3RhYmxlSWRdO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlKHRhYmxlSWQpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0YWJsZXNbdGFibGVJZF07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VydmljZTtcbiAgICB9KTtcbiIsIi8qKlxuICogQG5hbWUgY2MtZXhwaXJ5IGRpcmVjdGl2ZVxuICogQGRlc2NyaXB0aW9uIEEgZGlyZWN0aXZlIGZvbGxvd2luZyBhbmd1bGFyLWNyZWRpdC1jYXJkJ3MgYXBwcm9hY2ggdG8gdmFsaWRhdGluZy9mb3JtYXR0aW5nIGNyZWRpdCBjYXJkIGV4cGlyYXRpb24gZGF0ZS5cbiAqIEV4cGVjdCB0aGUgY2MtZXhwaXJ5IG5nTW9kZWwgdG8gYmUgaW4gdGhlIGZvcm1hdCBvZiBgeyBtb250aDogJzA1JywgeWVhcjogJzIwMTcnfWAuXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC5jYy1leHBpcnkuZGlyZWN0aXZlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnY2NFeHBpcnknLCBmdW5jdGlvbiBjY0V4cERpcmVjdGl2ZSgkZmlsdGVyKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiAodEVsZW0sIHRBdHRyKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgRVhQSVJBVElPTl9NQVhfTEVOR1RIID0gNzsgLy8gbGVuZ3RoIG9mIGBNTSAvIHl5YFxuXG4gICAgICAgICAgICAgICAgdEF0dHIuJHNldCgnYXV0b2NvbXBsZXRlJywgJ2NjLWV4cCcpO1xuICAgICAgICAgICAgICAgIHRBdHRyLiRzZXQoJ21heGxlbmd0aCcsIEVYUElSQVRJT05fTUFYX0xFTkdUSCk7XG4gICAgICAgICAgICAgICAgdEF0dHIuJHNldCgncGF0dGVybicsICdbMC05XSonKTsgLy8gZm9yIG1vYmlsZSBrZXlib2FyZCBkaXNwbGF5XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gY2NFeHBpcnlMaW5rKHNjb3BlLCB0RWxlbSwgdEF0dHIsIG5nTW9kZWxDdHJsKSB7XG4gICAgICAgICAgICAgICAgICAgIGluaXQoKTtcblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHBhcnNlcnMudW5zaGlmdChwYXJzZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJGZvcm1hdHRlcnMucHVzaChmb3JtYXR0ZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHZhbGlkYXRvcnMudmFsaWRGdXR1cmVEYXRlID0gdmFsaWRGdXR1cmVEYXRlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goZ2V0Vmlld1ZhbHVlLCByZW5kZXJGb3JtYXR0ZWRWaWV3KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBnZXQgdGhlIGlucHV0J3MgdmlldyB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZ2V0Vmlld1ZhbHVlKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5nTW9kZWxDdHJsLiR2aWV3VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogZm9ybWF0cyB0aGUgaW5wdXQgdmlldyB2YWx1ZSB0byBiZSB0aGUgZm9ybWF0IGBNTSAvIHl5YCBhbmQgcmUtcmVuZGVycyB2aWV3XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiByZW5kZXJGb3JtYXR0ZWRWaWV3KHZpZXdWYWx1ZSwgcHJldlZpZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF2aWV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGEgbmV3IHZhbHVlIGlzIGFkZGVkIChhcyBvcHBvc2VkIHRvIHByZXNzaW5nIGJhY2tzcGFjZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzQWRkaXRpb24gPSB2aWV3VmFsdWUubGVuZ3RoID4gcHJldlZpZXdWYWx1ZS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUoZm9ybWF0KHZpZXdWYWx1ZSwgaXNBZGRpdGlvbikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmdNb2RlbEN0cmwuJHJlbmRlcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFZhbGlkYXRlcyB3aGV0aGVyIHRoZSBlbnRlcmVkIGV4cGlyYXRpb24gZGF0ZSBpcyB2YWxpZFxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gdmFsaWRGdXR1cmVEYXRlKG1vZGVsVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHttb250aCwgeWVhcn0gPSBtb2RlbFZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNWYWxpZERhdGUobW9udGgsIHllYXIpICYmICFpc1Bhc3QobW9udGgsIHllYXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFZhbGlkYXRlcyB3aGV0aGVyIHRoZSBnaXZlbiBtb250aCBhbmQgeWVhciBhcmUgbnVtYmVyIHN0cmluZ3Mgd2l0aCBsZW5ndGggb2YgMiBhbmQgNCByZXNwZWN0aXZlbHlcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGlzVmFsaWREYXRlKG1vbnRoLCB5ZWFyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtb250aFJlZ2V4ID0gL15bMC05XXsyfSQvO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeWVhclJlZ2V4ID0gL15bMC05XXs0fSQvO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy5pc1N0cmluZyhtb250aCkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmlzU3RyaW5nKHllYXIpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9udGhSZWdleC50ZXN0KG1vbnRoKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHllYXJSZWdleC50ZXN0KHllYXIpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNWYWxpZE1vbnRoKG1vbnRoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBDaGVja3Mgd2hldGhlciB0aGUgbW9udGggaXMgdmFsaWRcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGlzVmFsaWRNb250aChtb250aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGggPSBfLnBhcnNlSW50KG1vbnRoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1vbnRoID4gMCAmJiBtb250aCA8IDEzO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIENoZWNrcyB3aGV0aGVyIHRoZSBnaXZlbiBtb250aCBhbmQgZGF0ZSBpcyBpbiB0aGUgcGFzdFxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gaXNQYXN0KG1vbnRoLCB5ZWFyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0Q3Vyck1vbnRoRGF0ZSgpID4gbmV3IERhdGUoeWVhciwgbW9udGggLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBHZXQgdGhlIGRhdGUgb2JqZWN0IGJhc2VkIG9uIGN1cnJlbnQgbW9udGggYW5kIHllYXJcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdldEN1cnJNb250aERhdGUoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGRhdGUuZ2V0RnVsbFllYXIoKSwgZGF0ZS5nZXRNb250aCgpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBVc2VzIGFuZ3VsYXIgZGF0ZSBmaWx0ZXIgdG8gZm9ybWF0IGRhdGUgbW9kZWwgdG8gY29ycmVzcG9uZGluZyB2aWV3IGZvcm1hdFxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZm9ybWF0dGVyKGV4cCA9IHt9KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtb250aCA9IGV4cC5tb250aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHllYXIgPSBleHAueWVhcjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF8uaXNFbXB0eShtb250aCkgJiYgXy5pc0VtcHR5KHllYXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGZpbHRlcignZGF0ZScpKG5ldyBEYXRlKHllYXIsIG1vbnRoIC0gMSksICdNTSAvIHl5Jyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogUGFyc2VzIHRoZSBmb3JtYXR0ZWQgdmlldyB2YWx1ZXMgdG8gbW9kZWwuIENvbnZlcnRzIDIgZGlnaXQgeWVhciB0byBmdWxsIDQgZGlnaXQgeWVhclxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0gZXhwaXJhdGlvbiB7b2JqZWN0fSBUaGUgZXhwaXJhdGlvbiBvYmplY3Qge21vbnRoLCB5ZWFyfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcGFyc2VyKGV4cGlyYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJhc2VZZWFyID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkuc2xpY2UoMCwgMik7IC8vIGAnMjAnYFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWVzID0gZXhwaXJhdGlvbi5zcGxpdCgnLycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9udGggPSB2YWx1ZXNbMF0gPyB2YWx1ZXNbMF0udHJpbSgpIDogJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB5ZWFyID0gdmFsdWVzWzFdID8gYmFzZVllYXIgKyB2YWx1ZXNbMV0udHJpbSgpIDogJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IG1vbnRoLCB5ZWFyIH07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogZm9ybWF0cyB0aGUgdmlldyB2YWx1ZSB0byB0aGUgZm9ybSAnTU0gLyB5eSdcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGZvcm1hdChleHBTdHIsIGlzQWRkaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IGV4cFN0ci5zcGxpdCgnLycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9udGggPSB2YWx1ZXNbMF0gPyB2YWx1ZXNbMF0udHJpbSgpIDogJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB5ZWFyID0gdmFsdWVzWzFdID8gdmFsdWVzWzFdLnRyaW0oKS5zbGljZSgtMikgOiAnJztcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG9uJ3QgYWRkIHNsYXNoXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKCFpc0FkZGl0aW9uICYmICF5ZWFyKSB8fCBtb250aC5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1vbnRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGQgc2xhc2ggaW4gdGhlIHJpZ2h0IHNwb3RcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0FkZGl0aW9uICYmICF5ZWFyICYmIG1vbnRoLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7bW9udGguc2xpY2UoMCwgMil9IC8gJHttb250aC5zbGljZSgyKX1gO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7bW9udGh9IC8gJHt5ZWFyfWA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQuY2MtZXhwaXJ5JywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC5jYy1leHBpcnkuZGlyZWN0aXZlJyxcbl0pO1xuIiwiLyoqXG4gKiBAbmFtZSBiYy1jdmMgZGlyZWN0aXZlXG4gKiBAZGVzY3JpcHRpb24gQSBjdXN0b20gY29tcGxlbWVudGFyeSBkaXJlY3RpdmUgdG8gYW5ndWxhci1jcmVkaXQtY2FyZCdzIGBjY0N2Y2AgZGlyZWN0aXZlLlxuICogVG8gc3VwcG9ydCBhbGxvd2luZyBhbiBvcHRpb25hbCBjdmMgZmllbGQgKGkuZS4gU2VjdXJlbmV0KSwgdGhpcyBkaXJlY3RpdmUgbXVzdCBvdmVycmlkZVxuICogdGhlIHZhbGlkYXRpb24gcHJvdmlkZWQgYnkgY2NDdmMgZGlyZWN0aXZlLlxuICovXG5hbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQuYmMtY3ZjJywgW1xuICAgICdjcmVkaXQtY2FyZHMnLFxuXSlcbiAgICAuZGlyZWN0aXZlKCdiY0N2YycsIGZ1bmN0aW9uIGJjQ3ZjRGlyZWN0aXZlKCRwYXJzZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gYmNDdmNMaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGVzLCBuZ01vZGVsKSB7XG4gICAgICAgICAgICAgICAgLy8gb3ZlcnJpZGUgdGhlIHZhbGlkYXRpb24gdG8gYWx3YXlzIHJldHVybiB2YWxpZFxuICAgICAgICAgICAgICAgIC8vIGlmIGN2YyBpcyBub3QgcmVxdWlyZWRcbiAgICAgICAgICAgICAgICBpZiAoISRwYXJzZShhdHRyaWJ1dGVzLm5nUmVxdWlyZWQpKHNjb3BlKSkge1xuICAgICAgICAgICAgICAgICAgICBuZ01vZGVsLiR2YWxpZGF0b3JzLmNjQ3ZjID0gKCkgPT4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHJpb3JpdHk6IDUsIC8vIGhpZ2hlciBwcmlvcml0eSB0byBlbnN1cmUgY2NDdmMncyBsaW5rIGlzIHJhbiBmaXJzdFxuICAgICAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsIi8qKlxuICogQG5hbWUgdHJ1c3RBc0h0bWxcbiAqIEBkZXNjcmlwdGlvbiBTaW1wbGUgdXRpbGl0eSBmaWx0ZXIgdG8gcnVuIHRoZSBnaXZlbiBodG1sIHN0cmluZyB0aHJvdWdoIGFuZ3VsYXIncyAkc2NlLnRydXN0QXNIdG1sIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0IFRoZSBodG1sIHN0cmluZyB0byB0cnVzdFxuICogQHJldHVybiB7U3RyaW5nfSBBbiBhbmd1bGFyLXRydXN0ZWQgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGh0bWxcbiAqXG4gKiBAZXhhbXBsZSBgPHAgbmctYmluZC1odG1sPVwicmF3SHRtbCB8IHRydXN0QXNIdG1sXCI+PC9wPmBcbiAqL1xuYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLnV0aWwudHJ1c3RBc0h0bWwnLCBbXSlcbiAgICAuZmlsdGVyKCd0cnVzdEFzSHRtbCcsIGZ1bmN0aW9uIHRydXN0QXNIdG1sKCRzY2Upe1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuICRzY2UudHJ1c3RBc0h0bWwodGV4dCk7XG4gICAgICAgIH07XG4gICAgfSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=