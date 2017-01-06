'use strict';

angular.module('bcapp-pattern-lab', ['gettext', 'ngAnimate', 'ngclipboard', 'ngMessages', 'mm.foundation', 'bcapp-pattern-lab-templates', 'bcapp-pattern-lab.sticky-class', 'bcapp-pattern-lab.bc-datepicker', 'bcapp-pattern-lab.bc-dropdown', 'bcapp-pattern-lab.bc-modal', 'bcapp-pattern-lab.bc-pagination', 'bcapp-pattern-lab.bc-server-table', 'bcapp-pattern-lab.alert', 'bcapp-pattern-lab.checkbox-list', 'bcapp-pattern-lab.color-picker', 'bcapp-pattern-lab.copy-clipboard', 'bcapp-pattern-lab.credit-card', 'bcapp-pattern-lab.credit-card-types', 'bcapp-pattern-lab.form', 'bcapp-pattern-lab.form-field', 'bcapp-pattern-lab.form-input-color', 'bcapp-pattern-lab.html5Mode', 'bcapp-pattern-lab.icon', 'bcapp-pattern-lab.loading-notification', 'bcapp-pattern-lab.loading-overlay', 'bcapp-pattern-lab.services', 'bcapp-pattern-lab.sprite', 'bcapp-pattern-lab.switch', 'bcapp-pattern-lab.util']).config(['$tooltipProvider', function ($tooltipProvider) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJpZ2NvbW1lcmNlL2JjYXBwLXBhdHRlcm4tbGFiLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2FsZXJ0L2FsZXJ0LmpzIiwiYmlnY29tbWVyY2UvYmMtZGF0ZXBpY2tlci9iYy1kYXRlcGlja2VyLmNvbnN0YW50cy5qcyIsImJpZ2NvbW1lcmNlL2JjLWRhdGVwaWNrZXIvYmMtZGF0ZXBpY2tlci5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9iYy1kYXRlcGlja2VyL2JjLWRhdGVwaWNrZXIuanMiLCJiaWdjb21tZXJjZS9iYy1kcm9wZG93bi9iYy1kcm9wZG93bi1tZW51LmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2JjLWRyb3Bkb3duL2JjLWRyb3Bkb3duLXRvZ2dsZS5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9iYy1kcm9wZG93bi9iYy1kcm9wZG93bi5jb250cm9sbGVyLmpzIiwiYmlnY29tbWVyY2UvYmMtZHJvcGRvd24vYmMtZHJvcGRvd24uZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvYmMtZHJvcGRvd24vYmMtZHJvcGRvd24ubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvYmMtcGFnaW5hdGlvbi9iYy1wYWdpbmF0aW9uLmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2JjLXBhZ2luYXRpb24vYmMtcGFnaW5hdGlvbi5tb2R1bGUuanMiLCJiaWdjb21tZXJjZS9iYy1zZXJ2ZXItdGFibGUvYmMtc2VydmVyLXRhYmxlLmNvbnRyb2xsZXIuanMiLCJiaWdjb21tZXJjZS9iYy1zZXJ2ZXItdGFibGUvYmMtc2VydmVyLXRhYmxlLmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2JjLXNlcnZlci10YWJsZS9iYy1zZXJ2ZXItdGFibGUubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvYmMtc2VydmVyLXRhYmxlL2JjLXNvcnQtYnkuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvY2hlY2tib3gtbGlzdC9jaGVja2JveC1saXN0LmNvbnRyb2xsZXIuanMiLCJiaWdjb21tZXJjZS9jaGVja2JveC1saXN0L2NoZWNrYm94LWxpc3QuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvY2hlY2tib3gtbGlzdC9jaGVja2JveC1saXN0Lm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXItcGFsZXR0ZS5jb250cm9sbGVyLmpzIiwiYmlnY29tbWVyY2UvY29sb3ItcGlja2VyL2NvbG9yLXBpY2tlci1wYWxldHRlLmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXIuY29udHJvbGxlci5qcyIsImJpZ2NvbW1lcmNlL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXIuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvY29sb3ItcGlja2VyL2NvbG9yLXBpY2tlci5tb2R1bGUuanMiLCJiaWdjb21tZXJjZS9jb3B5LWNsaXBib2FyZC9jb3B5LWNsaXBib2FyZC5jb25zdGFudC5qcyIsImJpZ2NvbW1lcmNlL2NvcHktY2xpcGJvYXJkL2NvcHktY2xpcGJvYXJkLmNvbnRyb2xsZXIuanMiLCJiaWdjb21tZXJjZS9jb3B5LWNsaXBib2FyZC9jb3B5LWNsaXBib2FyZC5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9jb3B5LWNsaXBib2FyZC9jb3B5LWNsaXBib2FyZC5tb2R1bGUuanMiLCJiaWdjb21tZXJjZS9jcmVkaXQtY2FyZC9jcmVkaXQtY2FyZC5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9jcmVkaXQtY2FyZC9jcmVkaXQtY2FyZC5tb2R1bGUuanMiLCJiaWdjb21tZXJjZS9jcmVkaXQtY2FyZC10eXBlcy9jcmVkaXQtY2FyZC10eXBlcy5jb25zdGFudC5qcyIsImJpZ2NvbW1lcmNlL2NyZWRpdC1jYXJkLXR5cGVzL2NyZWRpdC1jYXJkLXR5cGVzLmNvbnRyb2xsZXIuanMiLCJiaWdjb21tZXJjZS9jcmVkaXQtY2FyZC10eXBlcy9jcmVkaXQtY2FyZC10eXBlcy5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9jcmVkaXQtY2FyZC10eXBlcy9jcmVkaXQtY2FyZC10eXBlcy5tb2R1bGUuanMiLCJiaWdjb21tZXJjZS9mb3JtL2Zvcm0uZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS9mb3JtLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2Zvcm0tZmllbGQvZm9ybS1maWVsZC5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9mb3JtLWZpZWxkL2Zvcm0tZmllbGQubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS1maWVsZC1lcnJvci9mb3JtLWZpZWxkLWVycm9yLmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2Zvcm0tZmllbGQtZXJyb3IvZm9ybS1maWVsZC1lcnJvci5tb2R1bGUuanMiLCJiaWdjb21tZXJjZS9mb3JtLWZpZWxkLWVycm9ycy9mb3JtLWZpZWxkLWVycm9ycy5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9mb3JtLWZpZWxkLWVycm9ycy9mb3JtLWZpZWxkLWVycm9ycy5tb2R1bGUuanMiLCJiaWdjb21tZXJjZS9mb3JtLWlucHV0LWNvbG9yL2Zvcm0taW5wdXQtY29sb3IuY29udHJvbGxlci5qcyIsImJpZ2NvbW1lcmNlL2Zvcm0taW5wdXQtY29sb3IvZm9ybS1pbnB1dC1jb2xvci5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9mb3JtLWlucHV0LWNvbG9yL2Zvcm0taW5wdXQtY29sb3IubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvaHRtbDVNb2RlL2h0bWw1TW9kZS5tb2R1bGUuanMiLCJiaWdjb21tZXJjZS9odG1sNU1vZGUvaHRtbDVNb2RlLnNlcnZpY2UuanMiLCJiaWdjb21tZXJjZS9pY29uL2ljb24uY29udHJvbGxlci5qcyIsImJpZ2NvbW1lcmNlL2ljb24vaWNvbi5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9pY29uL2ljb24uanMiLCJiaWdjb21tZXJjZS9pY29uL2ljb24uc3ZnUm9vdFBhdGguanMiLCJiaWdjb21tZXJjZS9sb2FkaW5nLW5vdGlmaWNhdGlvbi9sb2FkaW5nLW5vdGlmaWNhdGlvbi5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9sb2FkaW5nLW5vdGlmaWNhdGlvbi9sb2FkaW5nLW5vdGlmaWNhdGlvbi5qcyIsImJpZ2NvbW1lcmNlL2xvYWRpbmctb3ZlcmxheS9sb2FkaW5nLW92ZXJsYXkuY29udHJvbGxlci5qcyIsImJpZ2NvbW1lcmNlL2xvYWRpbmctb3ZlcmxheS9sb2FkaW5nLW92ZXJsYXkuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvbG9hZGluZy1vdmVybGF5L2xvYWRpbmctb3ZlcmxheS5qcyIsImJpZ2NvbW1lcmNlL21vZGFsL2JjLW1vZGFsLm1vZGFsU3RhY2suc2VydmljZS5qcyIsImJpZ2NvbW1lcmNlL21vZGFsL2JjLW1vZGFsLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL3NlcnZpY2VzL2RldmljZS5zZXJ2aWNlLmpzIiwiYmlnY29tbWVyY2Uvc2VydmljZXMvc2VydmljZXMubW9kdWxlLmpzIiwiYmlnY29tbWVyY2Uvc3ByaXRlL3Nwcml0ZS5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9zcHJpdGUvc3ByaXRlLmpzIiwiYmlnY29tbWVyY2Uvc3RpY2t5LWNsYXNzL3N0aWNreS1jbGFzcy5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9zdGlja3ktY2xhc3Mvc3RpY2t5LWNsYXNzLmpzIiwiYmlnY29tbWVyY2Uvc3dpdGNoL3N3aXRjaC5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9zd2l0Y2gvc3dpdGNoLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL3V0aWwvdXRpbC5tb2R1bGUuanMiLCJiaWdjb21tZXJjZS9iYy1zZXJ2ZXItdGFibGUvYmMtc2VydmVyLXRhYmxlL2JjLXNlcnZlci10YWJsZS5zZXJ2aWNlLmpzIiwiYmlnY29tbWVyY2UvYmMtc2VydmVyLXRhYmxlL2JjLXNlcnZlci10YWJsZS1mYWN0b3J5L2JjLXNlcnZlci10YWJsZS1mYWN0b3J5LnNlcnZpY2UuanMiLCJiaWdjb21tZXJjZS9jcmVkaXQtY2FyZC9jYy1leHBpcnkvY2MtZXhwaXJ5LmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2NyZWRpdC1jYXJkL2NjLWV4cGlyeS9jYy1leHBpcnkubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQvY3JlZGl0LWNhcmQtY3Z2L2JjLWN2Yy5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS91dGlsL3RydXN0QXNIdG1sL3RydXN0QXNIdG1sLmZpbHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsQ0FDaEMsU0FBUyxFQUNULFdBQVcsRUFDWCxhQUFhLEVBQ2IsWUFBWSxFQUNaLGVBQWUsRUFDZiw2QkFBNkIsRUFDN0IsZ0NBQWdDLEVBQ2hDLGlDQUFpQyxFQUNqQywrQkFBK0IsRUFDL0IsNEJBQTRCLEVBQzVCLGlDQUFpQyxFQUNqQyxtQ0FBbUMsRUFDbkMseUJBQXlCLEVBQ3pCLGlDQUFpQyxFQUNqQyxnQ0FBZ0MsRUFDaEMsa0NBQWtDLEVBQ2xDLCtCQUErQixFQUMvQixxQ0FBcUMsRUFDckMsd0JBQXdCLEVBQ3hCLDhCQUE4QixFQUM5QixvQ0FBb0MsRUFDcEMsNkJBQTZCLEVBQzdCLHdCQUF3QixFQUN4Qix3Q0FBd0MsRUFDeEMsbUNBQW1DLEVBQ25DLDRCQUE0QixFQUM1QiwwQkFBMEIsRUFDMUIsMEJBQTBCLEVBQzFCLHdCQUF3QixDQUMzQixDQUFDLENBQ0QsTUFBTSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsVUFBUyxnQkFBZ0IsRUFBRTtBQUNwRCxvQkFBZ0IsQ0FBQyxXQUFXLENBQUMsRUFBQyxvQkFBb0IsRUFBRSxxQkFBcUIsRUFBQyxDQUFDLENBQUM7Q0FDL0UsQ0FBQyxDQUFDLENBQUM7OztBQ2pDSixPQUFPLENBQUMsTUFBTSxDQUFDLHlCQUF5QixFQUFFLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUM3RCxNQUFNLENBQUMsU0FBUyxjQUFjLENBQUMsUUFBUSxF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QUFVLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDdkMsdUJBQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHOzJCQUFNLElBQUk7aUJBQUEsQ0FBQzthQUMxQztTQUNKO0FBQ0QsZ0JBQVEsRUFBRSxDQUFDO0FBQ1gsZUFBTyxFQUFFLFNBQVM7QUFDbEIsZ0JBQVEsRUFBRSxHQUFHO0tBQ2hCLENBQUM7Q0FDTCxDQUFDLENBQUM7Ozs7Ozs7Ozs7OztBQ2JQLE9BQU8sQ0FBQyxNQUFNLENBQUMsb0NBQW9DLEVBQUUsRUFBRSxDQUFDLENBQ25ELE1BQU0sQ0FBQyxhQUFhLEVBQUUsU0FBUyxXQUFXLENBQUMsSUFBSSxFQUFDO0FBQzdDLFdBQU8sVUFBUyxJQUFJLEVBQUU7QUFDbEIsZUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2pDLENBQUM7Q0FDTCxDQUFDLENBQUMiLCJmaWxlIjoiYmNhcHAtcGF0dGVybi1sYWItY29tcG9uZW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYicsIFtcbiAgICAnZ2V0dGV4dCcsXG4gICAgJ25nQW5pbWF0ZScsXG4gICAgJ25nY2xpcGJvYXJkJyxcbiAgICAnbmdNZXNzYWdlcycsXG4gICAgJ21tLmZvdW5kYXRpb24nLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi10ZW1wbGF0ZXMnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5zdGlja3ktY2xhc3MnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1kYXRlcGlja2VyJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtZHJvcGRvd24nLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1tb2RhbCcsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXBhZ2luYXRpb24nLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5hbGVydCcsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNoZWNrYm94LWxpc3QnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jb2xvci1waWNrZXInLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jb3B5LWNsaXBib2FyZCcsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQtdHlwZXMnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1maWVsZCcsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0taW5wdXQtY29sb3InLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5odG1sNU1vZGUnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5pY29uJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIubG9hZGluZy1ub3RpZmljYXRpb24nLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5sb2FkaW5nLW92ZXJsYXknLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5zZXJ2aWNlcycsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLnNwcml0ZScsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLnN3aXRjaCcsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLnV0aWwnXG5dKVxuLmNvbmZpZyhbJyR0b29sdGlwUHJvdmlkZXInLCBmdW5jdGlvbigkdG9vbHRpcFByb3ZpZGVyKSB7XG4gICAgJHRvb2x0aXBQcm92aWRlci5zZXRUcmlnZ2Vycyh7J3Rvb2x0aXBUcmlnZ2VyT3Blbic6ICd0b29sdGlwVHJpZ2dlckNsb3NlJ30pO1xufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmFsZXJ0JywgWydtbS5mb3VuZGF0aW9uLmFsZXJ0J10pXG4gICAgLmNvbmZpZyhmdW5jdGlvbiBjb25maWd1cmVBbGVydCgkcHJvdmlkZSkge1xuICAgICAgICAkcHJvdmlkZS5kZWNvcmF0b3IoJ2FsZXJ0RGlyZWN0aXZlJywgZnVuY3Rpb24gYWxlcnREZWNvcmF0b3IoJGRlbGVnYXRlKSB7XG4gICAgICAgICAgICB2YXIgZGlyZWN0aXZlID0gJGRlbGVnYXRlWzBdO1xuXG4gICAgICAgICAgICBkaXJlY3RpdmUucmVwbGFjZSA9IHRydWU7XG4gICAgICAgICAgICBkaXJlY3RpdmUuc2NvcGUgPSB7XG4gICAgICAgICAgICAgICAgY2xvc2U6ICcmJyxcbiAgICAgICAgICAgICAgICBsaW5rczogJz0nLFxuICAgICAgICAgICAgICAgIHRhcmdldDogJz0nLFxuICAgICAgICAgICAgICAgIHR5cGU6ICc9JyxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiAkZGVsZWdhdGU7XG4gICAgICAgIH0pO1xufSk7XG4iLCIvKiBnbG9iYWxzIG1vbWVudCAqL1xuYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRhdGVwaWNrZXIuY29uc3RhbnRzJywgW10pXG4gICAgLmNvbnN0YW50KCdCQ19EQVRFUElDS0VSX0RFRkFVTFRTJywge1xuICAgICAgICBkYXlGb3JtYXQ6ICdEJyxcbiAgICAgICAgaW5wdXRGb3JtYXQ6IG1vbWVudC5sb2NhbGVEYXRhKCkubG9uZ0RhdGVGb3JtYXQoJ0wnKSxcbiAgICAgICAgc3R5bGVzOiB7XG4gICAgICAgICAgICBiYWNrOiAnZGF0ZXBpY2tlci1iYWNrJyxcbiAgICAgICAgICAgIGNvbnRhaW5lcjogJ2RhdGVwaWNrZXInLFxuICAgICAgICAgICAgZGF0ZTogJ2RhdGVwaWNrZXItZGF0ZScsXG4gICAgICAgICAgICBkYXlCb2R5OiAnZGF0ZXBpY2tlci1kYXlzLWJvZHknLFxuICAgICAgICAgICAgZGF5Qm9keUVsZW06ICdkYXRlcGlja2VyLWRheScsXG4gICAgICAgICAgICBkYXlDb25jZWFsZWQ6ICdkYXRlcGlja2VyLWRheS1jb25jZWFsZWQnLFxuICAgICAgICAgICAgZGF5RGlzYWJsZWQ6ICdpcy1kaXNhYmxlZCcsXG4gICAgICAgICAgICBkYXlIZWFkOiAnZGF0ZXBpY2tlci1kYXlzLWhlYWQnLFxuICAgICAgICAgICAgZGF5SGVhZEVsZW06ICdkYXRlcGlja2VyLWRheS1uYW1lJyxcbiAgICAgICAgICAgIGRheVByZXZNb250aDogJ2RhdGVwaWNrZXItZGF5LXByZXYtbW9udGgnLFxuICAgICAgICAgICAgZGF5TmV4dE1vbnRoOiAnZGF0ZXBpY2tlci1kYXktbmV4dC1tb250aCcsXG4gICAgICAgICAgICBkYXlSb3c6ICdkYXRlcGlja2VyLWRheXMtcm93JyxcbiAgICAgICAgICAgIGRheVRhYmxlOiAnZGF0ZXBpY2tlci1kYXlzJyxcbiAgICAgICAgICAgIG1vbnRoOiAnZGF0ZXBpY2tlci1tb250aCcsXG4gICAgICAgICAgICBtb250aExhYmVsOiAnZGF0ZXBpY2tlci1tb250aCcsXG4gICAgICAgICAgICBuZXh0OiAnZGF0ZXBpY2tlci1uZXh0JyxcbiAgICAgICAgICAgIHBvc2l0aW9uZWQ6ICdkYXRlcGlja2VyLWF0dGFjaG1lbnQnLFxuICAgICAgICAgICAgc2VsZWN0ZWREYXk6ICdpcy1zZWxlY3RlZCcsXG4gICAgICAgICAgICBzZWxlY3RlZFRpbWU6ICdkYXRlcGlja2VyLXRpbWUtc2VsZWN0ZWQnLFxuICAgICAgICAgICAgdGltZTogJ2RhdGVwaWNrZXItdGltZScsXG4gICAgICAgICAgICB0aW1lTGlzdDogJ2RhdGVwaWNrZXItdGltZS1saXN0JyxcbiAgICAgICAgICAgIHRpbWVPcHRpb246ICdkYXRlcGlja2VyLXRpbWUtb3B0aW9uJ1xuICAgICAgICB9LFxuICAgICAgICB0aW1lOiBmYWxzZSxcbiAgICAgICAgd2Vla2RheUZvcm1hdDogJ3Nob3J0J1xuICAgIH0pO1xuIiwiLyogZ2xvYmFscyByb21lICovXG5hbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtZGF0ZXBpY2tlci5kaXJlY3RpdmUnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRhdGVwaWNrZXIuY29uc3RhbnRzJ1xuXSlcbiAgICAuZGlyZWN0aXZlKCdiY0RhdGVwaWNrZXInLCBmdW5jdGlvbiBiY0RhdGVwaWNrZXJEaXJlY3RpdmUoQkNfREFURVBJQ0tFUl9ERUZBVUxUUykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgb3B0aW9uczogJz0/J1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gZGF0ZXBpY2tlckxpbmtGdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIG5nTW9kZWwpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUub3B0aW9ucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLm9wdGlvbnMgPSB7fTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgZGVmYXVsdHMgdG8gdGhlIG9wdGlvbnMgb2JqZWN0XG4gICAgICAgICAgICAgICAgXy5kZWZhdWx0cyhzY29wZS5vcHRpb25zLCBCQ19EQVRFUElDS0VSX0RFRkFVTFRTKTtcblxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhIG5ldyByb21lIChjYWxlbmRhcikgaW5zdGFuY2VcbiAgICAgICAgICAgICAgICBzY29wZS5jYWxlbmRhciA9IHJvbWUoZWxlbWVudFswXSwgc2NvcGUub3B0aW9ucyk7XG5cbiAgICAgICAgICAgICAgICAvLyBPbiAnZGF0YScgZXZlbnQgc2V0IG5nTW9kZWwgdG8gdGhlIHBhc3NlZCB2YWx1ZVxuICAgICAgICAgICAgICAgIHNjb3BlLmNhbGVuZGFyLm9uKCdkYXRhJywgZnVuY3Rpb24gb25EYXRhKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIG5nTW9kZWwuJHNldFZpZXdWYWx1ZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgc2NvcGUuY2FsZW5kYXIub24oJ3JlYWR5JywgZnVuY3Rpb24gb25SZWFkeShvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRycy5wbGFjZWhvbGRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy4kc2V0KCdwbGFjZWhvbGRlcicsIG9wdGlvbnMuaW5wdXRGb3JtYXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBSZW1vdmluZyBjYWxlbmRhciBldmVudCBsaXN0ZW5lcnNcbiAgICAgICAgICAgICAgICBlbGVtZW50Lm9uKCckZGVzdHJveScsIGZ1bmN0aW9uIG9uRGVzdHJveSgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2FsZW5kYXIuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRhdGVwaWNrZXInLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRhdGVwaWNrZXIuZGlyZWN0aXZlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtZHJvcGRvd24tbWVudS5kaXJlY3RpdmUnLCBbXSlcbiAgICAuZGlyZWN0aXZlKCdiY0Ryb3Bkb3duTWVudScsICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICByZXF1aXJlOiAnXmJjRHJvcGRvd24nLFxuICAgICAgICAgICAgY29tcGlsZTogKHRFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdEVsZW1lbnQuYWRkQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUnKTtcbiAgICAgICAgICAgICAgICB0RWxlbWVudC5hdHRyKCdyb2xlJywgJ2xpc3Rib3gnKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBiY0Ryb3Bkb3duQ3RybCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmF0dHIoJ2lkJywgYmNEcm9wZG93bkN0cmwuZ2V0VW5pcXVlSWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cignYXJpYS1leHBhbmRlZCcsIGJjRHJvcGRvd25DdHJsLmdldElzT3BlbigpKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gbGlzdGVuIGZvciBkcm9wZG93bnMgYmVpbmcgb3BlbmVkIGFuZCB0b2dnbGUgYXJpYS1leHBhbmRlZCB0byByZWZsZWN0IGN1cnJlbnQgc3RhdGVcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuJG9uKCd0b2dnbGVUaGlzRHJvcGRvd24nLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBiY0Ryb3Bkb3duQ3RybC5nZXRJc09wZW4oKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtZHJvcGRvd24tdG9nZ2xlLmRpcmVjdGl2ZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ2JjRHJvcGRvd25Ub2dnbGUnLCAoJGNvbXBpbGUpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICB0ZXJtaW5hbDogdHJ1ZSxcbiAgICAgICAgICAgIHByaW9yaXR5OiAxMDAxLCAvLyBzZXQgaGlnaGVyIHRoYW4gbmctcmVwZWF0IHRvIHByZXZlbnQgZG91YmxlIGNvbXBpbGF0aW9uXG4gICAgICAgICAgICByZXF1aXJlOiAnXmJjRHJvcGRvd24nLFxuICAgICAgICAgICAgY29tcGlsZTogKHRFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdEVsZW1lbnQucmVtb3ZlQXR0cignYmMtZHJvcGRvd24tdG9nZ2xlJyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgYmNEcm9wZG93bkN0cmwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyKCdkcm9wZG93bi10b2dnbGUnLCAnIycgKyBiY0Ryb3Bkb3duQ3RybC5nZXRVbmlxdWVJZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyKCdhcmlhLWNvbnRyb2xzJywgYmNEcm9wZG93bkN0cmwuZ2V0VW5pcXVlSWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgYmNEcm9wZG93bkN0cmwudG9nZ2xlSXNPcGVuKTtcbiAgICAgICAgICAgICAgICAgICAgJGNvbXBpbGUoZWxlbWVudCkoc2NvcGUpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtZHJvcGRvd24uY29udHJvbGxlcicsIFtdKVxuICAgIC5jb250cm9sbGVyKCdCY0Ryb3Bkb3duQ29udHJvbGxlcicsIGZ1bmN0aW9uIGJjRHJvcGRvd25Db250cm9sbGVyKCRzY29wZSwgJHJvb3RTY29wZSkge1xuICAgICAgICBjb25zdCBjdHJsID0gdGhpcztcbiAgICAgICAgbGV0IGlzT3BlbiA9IGZhbHNlO1xuICAgICAgICBsZXQgdW5pcXVlSWQ7XG5cbiAgICAgICAgY3RybC5jbG9zZURyb3Bkb3duID0gY2xvc2VEcm9wZG93bjtcbiAgICAgICAgY3RybC5nZXRJc09wZW4gPSBnZXRJc09wZW47XG4gICAgICAgIGN0cmwuZ2V0VW5pcXVlSWQgPSBnZXRVbmlxdWVJZDtcbiAgICAgICAgY3RybC5zZXRJc09wZW4gPSBzZXRJc09wZW47XG4gICAgICAgIGN0cmwudG9nZ2xlSXNPcGVuID0gdG9nZ2xlSXNPcGVuO1xuXG4gICAgICAgIC8vIGxpc3RlbiBmb3Igb3RoZXIgZHJvcGRvd25zIGJlaW5nIG9wZW5lZCBpbiB0aGUgYXBwLlxuICAgICAgICAkc2NvcGUuJG9uKCdiY0Ryb3Bkb3duVG9nZ2xlJywgKGV2ZW50LCB0cmlnZ2VyaW5nSUQpID0+IHtcbiAgICAgICAgICAgIC8vIGlmIEknbSBvcGVuIGFuZCBub3QgdGhlIGRyb3Bkb3duIGJlaW5nIHRyaWdnZXJlZCwgdGhlbiBJIHNob3VsZCBjbG9zZVxuICAgICAgICAgICAgaWYgKGlzT3BlbiAmJiB0cmlnZ2VyaW5nSUQgIT09IHVuaXF1ZUlkKSB7XG4gICAgICAgICAgICAgICAgY3RybC5jbG9zZURyb3Bkb3duKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNsb3NlRHJvcGRvd24oKSB7XG4gICAgICAgICAgICBjdHJsLnNldElzT3BlbihmYWxzZSk7XG4gICAgICAgICAgICAkc2NvcGUuJGJyb2FkY2FzdCgndG9nZ2xlVGhpc0Ryb3Bkb3duJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRJc09wZW4oKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNPcGVuO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0VW5pcXVlSWQoKSB7XG4gICAgICAgICAgICBpZiAoIXVuaXF1ZUlkKSB7XG4gICAgICAgICAgICAgICAgdW5pcXVlSWQgPSBfLnVuaXF1ZUlkKCdiYy1kcm9wZG93bi0nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB1bmlxdWVJZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldElzT3Blbih2YWwpIHtcbiAgICAgICAgICAgIGlzT3BlbiA9IHZhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZUlzT3BlbigpIHtcbiAgICAgICAgICAgIGlzT3BlbiA9ICFpc09wZW47XG4gICAgICAgICAgICAvLyB0ZWxsIGNoaWxkIGRpcmVjdGl2ZXMgYSB0b2dnbGUgaW4gb3BlbiBzdGF0dXMgaGFzIG9jY3VycmVkXG4gICAgICAgICAgICAkc2NvcGUuJGJyb2FkY2FzdCgndG9nZ2xlVGhpc0Ryb3Bkb3duJyk7XG4gICAgICAgICAgICAvLyB0ZWxsIGFwcGxpY2F0aW9uIHRoYXQgYSBkcm9wZG93biBoYXMgYmVlbiBvcGVuZWQgc28gb3RoZXJzIGNhbiBjbG9zZVxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdiY0Ryb3Bkb3duVG9nZ2xlJywgdW5pcXVlSWQpO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtZHJvcGRvd24uZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1kcm9wZG93bi5jb250cm9sbGVyJ1xuXSlcbiAgICAuZGlyZWN0aXZlKCdiY0Ryb3Bkb3duJywgKCRkb2N1bWVudCkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCY0Ryb3Bkb3duQ29udHJvbGxlcicsXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdiY0Ryb3Bkb3duQ29udHJvbGxlcicsXG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgIGNvbXBpbGU6ICh0RWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRFbGVtZW50LmF0dHIoJ3JvbGUnLCAnY29tYm9ib3gnKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAoJHNjb3BlLCAkZWxlbWVudCwgYXR0cnMsIGN0cmwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBkaXJlY3RpdmUgaXMgYSBjb21wb3NpdGUgb2YgMiBzZXBhcmF0ZSBGb3VuZGF0aW9uIGRpcmVjdGl2ZXNcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hpY2ggZG9uJ3QgcHJvdmlkZSBob29rcyB0byBrbm93IHdoZW4gaXQncyBjbGlja2VkIG9yIG9wZW5lZFxuICAgICAgICAgICAgICAgICAgICAvLyB0aGV5IGRvIGhvd2V2ZXIgZGVhbCB3aXRoIHByb3BhZ2F0aW9uIG9mIGV2ZW50cyBzbyB0aGlzLCBzb21ld2hhdCBibGluZFxuICAgICAgICAgICAgICAgICAgICAvLyBkb2N1bWVudCBldmVudCBpcyBzYWZlLiBBbGwgaXQgZG9lcyBpcyBzd2FwIGFyaWEgc3RhdGVzIGF0IHRoZSBtb21lbnRcbiAgICAgICAgICAgICAgICAgICAgLy8gaW4gYSBjaGVhcCB3YXkgdG8ga2VlcCB0aGlzIGRpcmVjdGl2ZSBpbiBzeW5jIHdpdGggaXQncyBjaGlsZCBkaXJlY3RpdmVcbiAgICAgICAgICAgICAgICAgICAgJGRvY3VtZW50Lm9uKCdjbGljaycsIGN0cmwuY2xvc2VEcm9wZG93bik7XG5cbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQub24oJyRkZXN0cm95JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGRvY3VtZW50Lm9mZignY2xpY2snLCBjdHJsLmNsb3NlRHJvcGRvd24pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRyb3Bkb3duJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1kcm9wZG93bi5kaXJlY3RpdmUnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1kcm9wZG93bi10b2dnbGUuZGlyZWN0aXZlJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtZHJvcGRvd24tbWVudS5kaXJlY3RpdmUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1wYWdpbmF0aW9uLmRpcmVjdGl2ZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ2JjUGFnaW5hdGlvbicsIGZ1bmN0aW9uIGJjUGFnaW5hdGlvbkRpcmVjdGl2ZSgkcGFyc2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICBzY29wZTogdHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL2JpZ2NvbW1lcmNlL2JjLXBhZ2luYXRpb24vYmMtcGFnaW5hdGlvbi50cGwuaHRtbCcsXG5cbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGJjUGFnaW5hdGlvbkNvbXBpbGUodEVsZW1lbnQsIHRBdHRycykge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyT2JqID0ge307XG5cbiAgICAgICAgICAgICAgICAvLyBTaW5jZSB0aGlzIGlzIGEgd3JhcHBlciBvZiBhbmd1bGFyLWZvdW5kYXRpb24ncyBwYWdpbmF0aW9uIGRpcmVjdGl2ZSB3ZSBuZWVkIHRvIGNvcHkgYWxsXG4gICAgICAgICAgICAgICAgLy8gb2YgdGhlIGF0dHJpYnV0ZXMgcGFzc2VkIHRvIG91ciBkaXJlY3RpdmUgYW5kIHN0b3JlIHRoZW0gaW4gdGhlIGF0dHJPYmouXG4gICAgICAgICAgICAgICAgXy5lYWNoKHRBdHRycy4kYXR0ciwgZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkgIT09ICdjbGFzcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJPYmpba2V5XSA9IHRFbGVtZW50LmF0dHIoa2V5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gQWRkaW5nIG91ciBjdXN0b20gY2FsbGJhY2sgdG8gdGhlIGF0dHJPYmosIGFuZ3VsYXItZm91bmRhdGlvbiB3aWxsIGNhbGwgdGhpcyBmdW5jdGlvblxuICAgICAgICAgICAgICAgIC8vIHdoZW4gYSBwYWdlIG51bWJlciBpcyBjbGlja2VkIGluIHRoZSBwYWdpbmF0aW9uLlxuICAgICAgICAgICAgICAgIGF0dHJPYmpbJ29uLXNlbGVjdC1wYWdlJ10gPSAncGFnaW5hdGlvbkNhbGxiYWNrKHBhZ2UpJztcblxuICAgICAgICAgICAgICAgIC8vIEFkZCBhbGwgdGhlIGF0dHJpYnV0ZXMgdG8gYW5ndWxhci1mb3VuZGF0aW9uJ3MgcGFnaW5hdGlvbiBkaXJlY3RpdmVcbiAgICAgICAgICAgICAgICB0RWxlbWVudC5maW5kKCdwYWdpbmF0aW9uJykuYXR0cihhdHRyT2JqKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBiY1BhZ2luYXRpb25MaW5rKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9uQ2hhbmdlUGFyc2VHZXR0ZXIgPSAkcGFyc2UoYXR0cnMub25DaGFuZ2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdExpbWl0cyA9IFsxMCwgMjAsIDMwLCA1MCwgMTAwXTtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc2V0TGltaXQgPSBmdW5jdGlvbihsaW1pdCwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW1pdCA9IF8ucGFyc2VJbnQobGltaXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHBhcnNlKGF0dHJzLml0ZW1zUGVyUGFnZSkuYXNzaWduKCRzY29wZS4kcGFyZW50LCBsaW1pdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucGFnaW5hdGlvbkNhbGxiYWNrKDEsIGxpbWl0KTtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZ2V0Q3VycmVudFBhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcGFyc2UoYXR0cnMucGFnZSkoJHNjb3BlLiRwYXJlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5nZXRDdXJyZW50TGltaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcGFyc2UoYXR0cnMuaXRlbXNQZXJQYWdlKSgkc2NvcGUuJHBhcmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmdldEl0ZW1zUGVyUGFnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRwYXJzZShhdHRycy5pdGVtc1BlclBhZ2UpKCRzY29wZS4kcGFyZW50KSB8fCAwO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5nZXRUb3RhbEl0ZW1zID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHBhcnNlKGF0dHJzLnRvdGFsSXRlbXMpKCRzY29wZS4kcGFyZW50KSB8fCAwO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zaG93ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHBhcnNlKGF0dHJzLmFsd2F5c1Nob3cpKCRzY29wZS4kcGFyZW50KSB8fCAkc2NvcGUuZ2V0VG90YWxJdGVtcygpID4gJHNjb3BlLmdldEl0ZW1zUGVyUGFnZSgpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zaG93TGltaXRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHNjb3BlLnNob3coKSAmJiAkcGFyc2UoYXR0cnMuc2hvd0xpbWl0cykoJHNjb3BlLiRwYXJlbnQpICE9PSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZ2V0TGltaXRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGltaXRzID0gJHBhcnNlKGF0dHJzLmxpbWl0cykoJHNjb3BlLiRwYXJlbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkobGltaXRzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWZhdWx0TGltaXRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGltaXRzO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wYWdpbmF0aW9uQ2FsbGJhY2sgPSBmdW5jdGlvbihwYWdlLCBsaW1pdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFkZGl0aW9uYWxTY29wZVByb3BlcnRpZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0OiBsaW1pdCB8fCAkc2NvcGUuZ2V0Q3VycmVudExpbWl0KCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IHBhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlUGFyc2VSZXN1bHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICRwYXJzZShhdHRycy5wYWdlKS5hc3NpZ24oJHNjb3BlLiRwYXJlbnQsIHBhZ2UpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZVBhcnNlUmVzdWx0ID0gb25DaGFuZ2VQYXJzZUdldHRlcigkc2NvcGUsIGFkZGl0aW9uYWxTY29wZVByb3BlcnRpZXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgb25DaGFuZ2Ugc3RyaW5nIGlzIGEgZnVuY3Rpb24gYW5kIG5vdCBhbiBleHByZXNzaW9uOiBjYWxsIGl0IHdpdGggdGhlIGFkZGl0aW9uYWxTY29wZVByb3BlcnRpZXMgb2JqIChmb3IgYmFja3dhcmRzIGNvbXBhdGFiaWxpdHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlbHNlIHRoZSBleHByZXNzaW9uIGhhcyBhbHJlYWR5IGJlZW4gcmFuOiBkbyBub3RoaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9uQ2hhbmdlUGFyc2VSZXN1bHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZVBhcnNlUmVzdWx0KGFkZGl0aW9uYWxTY29wZVByb3BlcnRpZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtcGFnaW5hdGlvbicsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtcGFnaW5hdGlvbi5kaXJlY3RpdmUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUuY29udHJvbGxlcicsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtc2VydmVyLXRhYmxlLnNlcnZpY2UnXG5dKVxuXG4gICAgLmNvbnRyb2xsZXIoJ0JjU2VydmVyVGFibGVDdHJsJywgZnVuY3Rpb24gQmNTZXJ2ZXJUYWJsZUN0cmwoJGF0dHJzLCAkbG9nLCAkcGFyc2UsICRzY29wZSwgQmNTZXJ2ZXJUYWJsZSkge1xuICAgICAgICB2YXIgY3RybCA9IHRoaXMsXG4gICAgICAgICAgICBiY1NlcnZlclRhYmxlUHJvdG90eXBlID0gQmNTZXJ2ZXJUYWJsZS5wcm90b3R5cGU7XG5cbiAgICAgICAgLy8gQ2FsbCB0aGUgQmNTZXJ2ZXJUYWJsZSBjb25zdHJ1Y3RvciBvbiB0aGUgY29udHJvbGxlclxuICAgICAgICAvLyBpbiBvcmRlciB0byBzZXQgYWxsIHRoZSBjb250cm9sbGVyIHByb3BlcnRpZXMgZGlyZWN0bHkuXG4gICAgICAgIC8vIFRoaXMgaXMgaGVyZSBmb3IgYmFja3dhcmRzIGNvbXBhdGFiaWxpdHkgcHVycG9zZXMuXG4gICAgICAgIEJjU2VydmVyVGFibGUuY2FsbChjdHJsLCBudWxsLCAoJHBhcnNlKCRhdHRycy50YWJsZUNvbmZpZykoJHNjb3BlKSkpO1xuXG4gICAgICAgIC8vIGNvbnRyb2xsZXIgZnVuY3Rpb25zXG4gICAgICAgIGN0cmwuY3JlYXRlUGFyYW1zT2JqZWN0ID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS5jcmVhdGVQYXJhbXNPYmplY3Q7XG4gICAgICAgIGN0cmwuZGVzZWxlY3RBbGxSb3dzID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS5kZXNlbGVjdEFsbFJvd3M7XG4gICAgICAgIGN0cmwuZmV0Y2hSZXNvdXJjZSA9IGJjU2VydmVyVGFibGVQcm90b3R5cGUuZmV0Y2hSZXNvdXJjZTtcbiAgICAgICAgY3RybC5nZXRTZWxlY3RlZFJvd3MgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLmdldFNlbGVjdGVkUm93cztcbiAgICAgICAgY3RybC5pbml0ID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS5pbml0O1xuICAgICAgICBjdHJsLmlzUm93U2VsZWN0ZWQgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLmlzUm93U2VsZWN0ZWQ7XG4gICAgICAgIGN0cmwubG9hZFN0YXRlUGFyYW1zID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS5sb2FkU3RhdGVQYXJhbXM7XG4gICAgICAgIGN0cmwuc2VsZWN0QWxsUm93cyA9IGJjU2VydmVyVGFibGVQcm90b3R5cGUuc2VsZWN0QWxsUm93cztcbiAgICAgICAgY3RybC5zZXRQYWdpbmF0aW9uVmFsdWVzID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS5zZXRQYWdpbmF0aW9uVmFsdWVzO1xuICAgICAgICBjdHJsLnNldFJvd3MgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLnNldFJvd3M7XG4gICAgICAgIGN0cmwuc2V0U2VsZWN0aW9uRm9yQWxsUm93cyA9IGJjU2VydmVyVGFibGVQcm90b3R5cGUuc2V0U2VsZWN0aW9uRm9yQWxsUm93cztcbiAgICAgICAgY3RybC5zZXRTb3J0aW5nVmFsdWVzID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS5zZXRTb3J0aW5nVmFsdWVzO1xuICAgICAgICBjdHJsLnVwZGF0ZVBhZ2UgPSBfLmJpbmQoYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS51cGRhdGVQYWdlLCBjdHJsKTtcbiAgICAgICAgY3RybC51cGRhdGVTb3J0ID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS51cGRhdGVTb3J0O1xuICAgICAgICBjdHJsLnVwZGF0ZVRhYmxlID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS51cGRhdGVUYWJsZTtcbiAgICAgICAgY3RybC52YWxpZGF0ZVJlc291cmNlID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS52YWxpZGF0ZVJlc291cmNlO1xuXG4gICAgICAgIGluaXQoKTtcblxuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICAgdmFyIHJlc291cmNlQ2FsbGJhY2s7XG5cbiAgICAgICAgICAgIHJlc291cmNlQ2FsbGJhY2sgPSAkcGFyc2UoJGF0dHJzLnJlc291cmNlQ2FsbGJhY2spKCRzY29wZSk7XG4gICAgICAgICAgICBpZiAoIV8uaXNGdW5jdGlvbihyZXNvdXJjZUNhbGxiYWNrKSkge1xuICAgICAgICAgICAgICAgICRsb2cuZXJyb3IoJ2JjLXNlcnZlci10YWJsZSBkaXJlY3RpdmU6IHJlc291cmNlLWNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdHJsLnJlc291cmNlQ2FsbGJhY2sgPSByZXNvdXJjZUNhbGxiYWNrO1xuXG4gICAgICAgICAgICBjdHJsLmluaXQoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXNlcnZlci10YWJsZS5kaXJlY3RpdmUnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXNlcnZlci10YWJsZS5jb250cm9sbGVyJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtc2VydmVyLXRhYmxlLnNvcnQtYnkuZGlyZWN0aXZlJyxcbiAgICAndWkucm91dGVyJ1xuXSlcbiAgICAvKipcbiAgICAgKiBUaGUgYmMtc2VydmVyLXRhYmxlIGRpcmVjdGl2ZSBjcmVhdGVzIGEgZGF0YSB0YWJsZSB0aGF0IGhhbmRsZXNcbiAgICAgKiBzZXJ2ZXIgc2lkZSBwYWdpbmF0aW9uLCBzb3J0aW5nLCBhbmQgZmlsdGVyaW5nLiBJdCBleHBvc2VzIGEgZmV3IHNjb3BlIHZhcmlhYmxlcyxcbiAgICAgKiB0aGF0IGNhbiBiZSB1c2VkIHRvIGRpc3BsYXkgdGhlIHRhYmxlIGNvbnRlbnQgd2l0aCBjdXN0b20gbWFya3VwIChzZWUgZXhhbXBsZVxuICAgICAqIGluIHRoZSBwYXR0ZXJuIGxhYiBmb3IgYW4gYWN0dWFsIGltcGxlbWVudGF0aW9uIG9mIHRoZSBiYy1zZXJ2ZXItdGFibGUpLlxuICAgICAqXG4gICAgICogVGhlIGZvbGxvd2luZyBhdHRyaWJ1dGVzIGNhbiBiZSBwYXNzZWQgaW4gb3JkZXIgdG8gY29uZmlndXJlIHRoZSBiYy1zZXJ2ZXItdGFibGU6XG4gICAgICogLSByZXNvdXJjZS1jYWxsYmFjayAocmVxdWlyZWQpXG4gICAgICogLSB0YWJsZUNvbmZpZyAob3B0aW9uYWwpXG4gICAgICpcbiAgICAgKiAtIHJlc291cmNlLWNhbGxiYWNrIC0gYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlIHdoaWNoIGlzIHJlc292bGVkXG4gICAgICogd2l0aCBhbiBvYmplY3Qgb2YgdGhlIGZvbGxvd2luZyBmb3JtYXQ6XG4gICAgICogICAgICB7XG4gICAgICogICAgICAgICAgcm93czogQXJyYXksXG4gICAgICogICAgICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAqICAgICAgICAgICAgICBwYWdlOiBOdW1iZXIsXG4gICAgICogICAgICAgICAgICAgIGxpbWl0OiBOdW1iZXIsXG4gICAgICogICAgICAgICAgICAgIHRvdGFsOiBOdW1iZXJcbiAgICAgKiAgICAgICAgICB9XG4gICAgICogICAgICB9XG4gICAgICpcbiAgICAgKiBUaGlzIGRpcmVjdGl2ZSBleHBvc2VzIGEgc2NvcGUgdmFyaWFibGUgY2FsbGVkIGJjU2VydmVyVGFibGUgdGhhdFxuICAgICAqIGNhbiBiZSB1c2VkIHRvIGRpc3BsYXkgY29udGVudCwgYW5kIGltcGxlbWVudCBhZGRpdGlvbmFsIGZ1bmN0aW9uYWxpdHlcbiAgICAgKiB0byB0aGUgdGFibGUgKHN1Y2ggYXMgcGFnaW5hdGlvbiwgc29ydGluZywgYW5kIHNlbGVjdGlvbiBsb2dpYykuXG4gICAgICpcbiAgICAgKiAtIGJjU2VydmVyVGFibGUucm93c1xuICAgICAqICAgICAgLSBDYW4gYmUgdXNlZCB3aXRoIG5nLXJlcGVhdCB0byBkaXNwbGF5IHRoZSBkYXRhXG4gICAgICogLSBiY1NlcnZlclRhYmxlLmZpbHRlcnNcbiAgICAgKiAgICAgIC0gQ2FuIGJlIHVzZWQgdG8gY2hhbmdlL3VwZGF0ZSBmaWx0ZXJzLiBUaGVzZSBmaWx0ZXJzIG11c3QgYXBwZWFyXG4gICAgICogICAgICAgIGluIHRoZSBzdGF0ZSBkZWZpbml0aW9uIGluIG9yZGVyIHRvIHdvcmsgY29ycmVjdGx5LlxuICAgICAqIC0gYmNTZXJ2ZXJUYWJsZS51cGRhdGVUYWJsZSgpXG4gICAgICogICAgICAtIFBlcmZvcm0gYSBzdGF0ZSB0cmFuc2lzdGlvbiB3aXRoIHRoZSBjdXJyZW50IHRhYmxlIGluZm9cbiAgICAgKiAtIGJjU2VydmVyVGFibGUucGFnaW5hdGlvblxuICAgICAqICAgICAgLSBleHBvc2VzIHBhZ2UsIGxpbWl0LCBhbmQgdG90YWxcbiAgICAgKiAtIGJjU2VydmVyVGFibGUuc2V0UGFnaW5hdGlvblZhbHVlcyhwYWdpbmF0aW9uKVxuICAgICAqICAgICAgLSBjb252ZW5pZW5jZSBtZXRob2QgZm9yIHNldHRpbmcgcGFnaW5hdGlvbiB2YWx1ZXMgYXQgb25jZS5cbiAgICAgKlxuICAgICAqIC0gYmNTZXJ2ZXJUYWJsZS5zZWxlY3RlZFJvd3NcbiAgICAgKiAgICAgIC0gYW4gbWFwIG9iamVjdCB3aXRoIHVuaXF1ZSBpZCdzIGFzIGtleXMgYW5kIGJvb2xlYW4gdmFsdWVzIGFzIHRoZSBzZWxlY3RlZCBzdGF0ZVxuICAgICAqIC0gYmNTZXJ2ZXJUYWJsZS5hbGxTZWxlY3RlZFxuICAgICAqICAgICAgLSBhIGJvb2xlYW4gdmFsdWUgdXNlZCB0byBkZXRlcm1pbmUgaWYgYWxsIHJvd3Mgd2VyZSBzZWxlY3RlZCBvciBjbGVhcmVkXG4gICAgICogLSBiY1NlcnZlclRhYmxlLnNlbGVjdEFsbFJvd3MoKVxuICAgICAqICAgICAgLSB0b2dnbGUgYWxsIHJvd3Mgc2VsZWN0aW9uIHN0YXRlXG4gICAgICogLSBiY1NlcnZlclRhYmxlLmlzUm93U2VsZWN0ZWQocm93KVxuICAgICAqICAgICAgLSBoZWxwZXIgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGlmIGEgcm93IGlzIHNlbGVjdGVkXG4gICAgICogLSBiY1NlcnZlclRhYmxlLmdldFNlbGVjdGVkUm93cygpXG4gICAgICogICAgICAtIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBhcnJheSBvZiByb3cgb2JqZWN0cyB0aGF0IGFyZSBjdXJyZW50bHkgc2VsZWN0ZWRcbiAgICAgKlxuICAgICAqL1xuICAgIC5kaXJlY3RpdmUoJ2JjU2VydmVyVGFibGUnLCBmdW5jdGlvbiBiY1NlcnZlclRhYmxlRGlyZWN0aXZlKCRwYXJzZSkge1xuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQmNTZXJ2ZXJUYWJsZUN0cmwgYXMgYmNTZXJ2ZXJUYWJsZScsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiBiY1NlcnZlclRhYmxlTGluaygkc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBiY1NlcnZlclRhYmxlQ3RybCkge1xuICAgICAgICAgICAgICAgIGlmIChhdHRycy50YWJsZUNvbnRyb2xsZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZXhwb3NlIGJjU2VydmVyVGFibGVDdHJsIHRvIHRhYmxlQ29udHJvbGxlciBpZiBpdCBleGlzdHNcbiAgICAgICAgICAgICAgICAgICAgJHBhcnNlKGF0dHJzLnRhYmxlQ29udHJvbGxlcikuYXNzaWduKCRzY29wZSwgYmNTZXJ2ZXJUYWJsZUN0cmwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXNlcnZlci10YWJsZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtc2VydmVyLXRhYmxlLmRpcmVjdGl2ZScsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXNlcnZlci10YWJsZS5zb3J0LWJ5LmRpcmVjdGl2ZScsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXNlcnZlci10YWJsZS1mYWN0b3J5LnNlcnZpY2UnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUuc29ydC1ieS5kaXJlY3RpdmUnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXNlcnZlci10YWJsZS1mYWN0b3J5LnNlcnZpY2UnXG5dKVxuICAgIC5kaXJlY3RpdmUoJ2JjU29ydEJ5JywgZnVuY3Rpb24gYmNTb3J0QnlEaXJlY3RpdmUoJGxvZywgYmNTZXJ2ZXJUYWJsZUZhY3RvcnkpIHtcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL2JpZ2NvbW1lcmNlL2JjLXNlcnZlci10YWJsZS9iYy1zb3J0LWJ5LnRwbC5odG1sJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBzb3J0VmFsdWU6ICdAJyxcbiAgICAgICAgICAgICAgICBjb2x1bW5OYW1lOiAnQCcsXG4gICAgICAgICAgICAgICAgdGFibGVJZDogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVxdWlyZTogJz9eXmJjU2VydmVyVGFibGUnLFxuICAgICAgICAgICAgbGluazogYmNTb3J0QnlEaXJlY3RpdmVMaW5rXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gYmNTb3J0QnlEaXJlY3RpdmVMaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycywgYmNTZXJ2ZXJUYWJsZUN0cmwpIHtcbiAgICAgICAgICAgIHZhciBiY1NlcnZlclRhYmxlLFxuICAgICAgICAgICAgICAgIHNvcnREaXJWYWx1ZXM7XG5cbiAgICAgICAgICAgIGlmIChzY29wZS50YWJsZUlkKSB7XG4gICAgICAgICAgICAgICAgYmNTZXJ2ZXJUYWJsZSA9IGJjU2VydmVyVGFibGVGYWN0b3J5LmdldChzY29wZS50YWJsZUlkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYmNTZXJ2ZXJUYWJsZUN0cmwpIHtcbiAgICAgICAgICAgICAgICBiY1NlcnZlclRhYmxlID0gYmNTZXJ2ZXJUYWJsZUN0cmw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRsb2cuZXJyb3IoJ2JjLXNvcnQtYnkgZGlyZWN0aXZlIHJlcXVpcmVzIGEgdGFibGUtaWQsIG9yIGEgcGFyZW50IGJjU2VydmVyVGFibGVDdHJsIGRpcmVjdGl2ZS4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc29ydERpclZhbHVlcyA9IGJjU2VydmVyVGFibGUudGFibGVDb25maWcuc29ydERpclZhbHVlcztcblxuICAgICAgICAgICAgc2NvcGUuYXNjID0gc29ydERpclZhbHVlcy5hc2M7XG4gICAgICAgICAgICBzY29wZS5kZXNjID0gc29ydERpclZhbHVlcy5kZXNjO1xuICAgICAgICAgICAgc2NvcGUuc29ydEJ5ID0gYmNTZXJ2ZXJUYWJsZS5zb3J0Qnk7XG4gICAgICAgICAgICBzY29wZS5zb3J0RGlyID0gYmNTZXJ2ZXJUYWJsZS5zb3J0RGlyO1xuICAgICAgICAgICAgc2NvcGUuc29ydCA9IHNvcnQ7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHNvcnQoJGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNvcnRCeSxcbiAgICAgICAgICAgICAgICAgICAgc29ydERpcjtcblxuICAgICAgICAgICAgICAgIGlmICgkZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGJjU2VydmVyVGFibGUuc29ydEJ5ID09PSBzY29wZS5zb3J0VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgc29ydEJ5ID0gYmNTZXJ2ZXJUYWJsZS5zb3J0Qnk7XG4gICAgICAgICAgICAgICAgICAgIHNvcnREaXIgPSBiY1NlcnZlclRhYmxlLnNvcnREaXIgPT09IHNjb3BlLmFzYyA/IHNjb3BlLmRlc2MgOiBzY29wZS5hc2M7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc29ydEJ5ID0gc2NvcGUuc29ydFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBzb3J0RGlyID0gc2NvcGUuYXNjO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJjU2VydmVyVGFibGUudXBkYXRlU29ydChzb3J0QnksIHNvcnREaXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jaGVja2JveC1saXN0LmNvbnRyb2xsZXInLCBbXSlcbiAgICAuY29udHJvbGxlcignQ2hlY2tib3hMaXN0Q3RybCcsIGZ1bmN0aW9uIENoZWNrYm94TGlzdEN0cmwoJGF0dHJzLCAkZWxlbWVudCwgJGxvZywgJHBhcnNlLCAkc2NvcGUpIHtcbiAgICAgICAgdmFyIGN0cmwgPSB0aGlzLFxuICAgICAgICAgICAgZmFsc2VWYWx1ZSA9ICRwYXJzZSgkYXR0cnMubmdGYWxzZVZhbHVlKShjdHJsKSB8fCBmYWxzZSxcbiAgICAgICAgICAgIHRydWVWYWx1ZSA9ICRwYXJzZSgkYXR0cnMubmdUcnVlVmFsdWUpKGN0cmwpIHx8IHRydWUsXG4gICAgICAgICAgICBuZ01vZGVsID0gJGVsZW1lbnQuY29udHJvbGxlcignbmdNb2RlbCcpO1xuXG4gICAgICAgIGluaXQoKTtcblxuICAgICAgICAvLyBHZXR0ZXJzXG4gICAgICAgIGZ1bmN0aW9uIGdldE1vZGVsVmFsdWUoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmdNb2RlbC4kbW9kZWxWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFZhbHVlKCkge1xuICAgICAgICAgICAgcmV0dXJuIGN0cmwudmFsdWUgfHwgY3RybC5uZ1ZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0U2VsZWN0ZWRWYWx1ZXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gY3RybC5zZWxlY3RlZFZhbHVlcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldHRlcnNcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlTW9kZWxWYWx1ZShtb2RlbFZhbHVlKSB7XG4gICAgICAgICAgICBuZ01vZGVsLiRzZXRWaWV3VmFsdWUobW9kZWxWYWx1ZSk7XG4gICAgICAgICAgICBuZ01vZGVsLiRjb21taXRWaWV3VmFsdWUoKTtcbiAgICAgICAgICAgIG5nTW9kZWwuJHJlbmRlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlU2VsZWN0ZWRWYWx1ZXMobW9kZWxWYWx1ZSkge1xuICAgICAgICAgICAgaWYgKG1vZGVsVmFsdWUgPT09IHRydWVWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGFkZFRvU2VsZWN0ZWRWYWx1ZXMoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobW9kZWxWYWx1ZSA9PT0gZmFsc2VWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHJlbW92ZUZyb21TZWxlY3RlZFZhbHVlcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYWRkVG9TZWxlY3RlZFZhbHVlcygpIHtcbiAgICAgICAgICAgIHZhciBpc0luY2x1ZGVkID0gXy5pbmNsdWRlKGN0cmwuc2VsZWN0ZWRWYWx1ZXMsIGdldFZhbHVlKCkpO1xuXG4gICAgICAgICAgICBpZiAoIWlzSW5jbHVkZWQpIHtcbiAgICAgICAgICAgICAgICBjdHJsLnNlbGVjdGVkVmFsdWVzLnB1c2goZ2V0VmFsdWUoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZW1vdmVGcm9tU2VsZWN0ZWRWYWx1ZXMoKSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBfLmluZGV4T2YoY3RybC5zZWxlY3RlZFZhbHVlcywgZ2V0VmFsdWUoKSk7XG5cbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBjdHJsLnNlbGVjdGVkVmFsdWVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXYXRjaGVyc1xuICAgICAgICBmdW5jdGlvbiBtb2RlbFZhbHVlV2F0Y2gobW9kZWxWYWx1ZSwgb2xkTW9kZWxWYWx1ZSkge1xuICAgICAgICAgICAgdmFyIG9sZFNlbGVjdGVkVmFsdWVzLFxuICAgICAgICAgICAgICAgIHNlbGVjdGVkVmFsdWVzQ2hhbmdlZDtcblxuICAgICAgICAgICAgLy8gV2hlbiBuZ01vZGVsIHZhbHVlIGNoYW5nZXNcbiAgICAgICAgICAgIGlmIChfLmlzVW5kZWZpbmVkKG1vZGVsVmFsdWUpIHx8IG1vZGVsVmFsdWUgPT09IG9sZE1vZGVsVmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFJldGFpbiBhIHNoYWxsb3cgY29weSBvZiBzZWxlY3RlZFZhbHVlcyBiZWZvcmUgdXBkYXRlXG4gICAgICAgICAgICBvbGRTZWxlY3RlZFZhbHVlcyA9IGN0cmwuc2VsZWN0ZWRWYWx1ZXMuc2xpY2UoKTtcblxuICAgICAgICAgICAgLy8gVXBkYXRlIHNlbGVjdGVkVmFsdWVzXG4gICAgICAgICAgICB1cGRhdGVTZWxlY3RlZFZhbHVlcyhtb2RlbFZhbHVlKTtcblxuICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIGlmIHNlbGVjdGVkVmFsdWVzIGFycmF5IGhhcyBjaGFuZ2VkXG4gICAgICAgICAgICBzZWxlY3RlZFZhbHVlc0NoYW5nZWQgPSAhIV8ueG9yKGN0cmwuc2VsZWN0ZWRWYWx1ZXMsIG9sZFNlbGVjdGVkVmFsdWVzKS5sZW5ndGg7XG5cbiAgICAgICAgICAgIC8vIElmIGNoYW5nZWQsIGV2b2tlIGRlbGVnYXRlIG1ldGhvZCAoaWYgZGVmaW5lZClcbiAgICAgICAgICAgIGlmIChjdHJsLm9uQ2hhbmdlICYmIHNlbGVjdGVkVmFsdWVzQ2hhbmdlZCkge1xuICAgICAgICAgICAgICAgIGN0cmwub25DaGFuZ2Uoe1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZFZhbHVlczogY3RybC5zZWxlY3RlZFZhbHVlcyxcbiAgICAgICAgICAgICAgICAgICAgb2xkU2VsZWN0ZWRWYWx1ZXM6IG9sZFNlbGVjdGVkVmFsdWVzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZWxlY3RlZFZhbHVlc1dhdGNoKHNlbGVjdGVkVmFsdWVzKSB7XG4gICAgICAgICAgICAvLyBXaGVuIHNlbGVjdGVkVmFsdWVzIGNvbGxlY3Rpb24gY2hhbmdlc1xuICAgICAgICAgICAgdmFyIGlzSW5jbHVkZWQgPSBfLmluY2x1ZGUoc2VsZWN0ZWRWYWx1ZXMsIGdldFZhbHVlKCkpLFxuICAgICAgICAgICAgICAgIG1vZGVsVmFsdWUgPSBnZXRNb2RlbFZhbHVlKCk7XG5cbiAgICAgICAgICAgIGlmIChpc0luY2x1ZGVkICYmIG1vZGVsVmFsdWUgIT09IHRydWVWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHVwZGF0ZU1vZGVsVmFsdWUodHJ1ZVZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWlzSW5jbHVkZWQgJiYgbW9kZWxWYWx1ZSAhPT0gZmFsc2VWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHVwZGF0ZU1vZGVsVmFsdWUoZmFsc2VWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbml0aWFsaXplclxuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICAgaWYgKCRhdHRycy50eXBlICE9PSAnY2hlY2tib3gnKSB7XG4gICAgICAgICAgICAgICAgJGxvZy5lcnJvcignY2hlY2tib3gtbGlzdCBkaXJlY3RpdmU6IGVsZW1lbnQgbXVzdCBiZSA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCI+Jyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goZ2V0TW9kZWxWYWx1ZSwgbW9kZWxWYWx1ZVdhdGNoKTtcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2hDb2xsZWN0aW9uKGdldFNlbGVjdGVkVmFsdWVzLCBzZWxlY3RlZFZhbHVlc1dhdGNoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNoZWNrYm94LWxpc3QuZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jaGVja2JveC1saXN0LmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLyoqXG4gICAgICogQSBkaXJlY3RpdmUgZm9yIGNvbGxhdGluZyB2YWx1ZXMgZnJvbSBhbiBhcnJheSBvZiBjaGVja2JveGVzLlxuICAgICAqXG4gICAgICogQHJlcXVpcmUgbmdNb2RlbFxuICAgICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZ3xudW1iZXJ8T2JqZWN0Pn0gY2hlY2tib3hMaXN0IC0gQXJyYXkgdG8gaG9sZCBzZWxlY3RlZCB2YWx1ZXNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIC0gVmFsdWUgdG8gYWRkIHRvIGNoZWNrYm94TGlzdFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oc2VsZWN0ZWRWYWx1ZXMsIG9sZFNlbGVjdGVkVmFsdWVzfSBbY2hlY2tib3hMaXN0Q2hhbmdlXSAtIE9wdGlvbmFsIG9uQ2hhbmdlIGNhbGxiYWNrXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZTpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGRpdiBuZy1yZXBlYXQ9XCJvcHRpb24gaW4gb3B0aW9uc1wiPlxuICAgICAqICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgXG4gICAgICogICAgICAgICBuYW1lPVwib3B0aW9ue3sgb3B0aW9uLmlkIH19XCJcbiAgICAgKiAgICAgICAgIHZhbHVlPVwib3B0aW9uLmlkXCIgXG4gICAgICogICAgICAgICBjaGVja2JveC1saXN0PVwic2VsZWN0ZWRWYWx1ZXNcIiBcbiAgICAgKiAgICAgICAgIGNoZWNrYm94LWxpc3QtY2hhbmdlPVwib25DaGFuZ2Uoc2VsZWN0ZWRWYWx1ZXMpXCIgXG4gICAgICogICAgICAgICBuZy1tb2RlbD1cIm9wdGlvbi5jaGVja2VkXCJcbiAgICAgKiAgICAgLz5cbiAgICAgKiA8L2Rpdj5cbiAgICAgKiBgYGBcbiAgICAgKiBcbiAgICAgKiBgYGBqc1xuICAgICAqIHNjb3BlLnNlbGVjdGVkVmFsdWVzID0gW107XG4gICAgICogc2NvcGUub3B0aW9ucyA9IFtcbiAgICAgKiAgICAge1xuICAgICAqICAgICAgICAgaWQ6IDEsXG4gICAgICogICAgICAgICBsYWJlbDogJ09wdGlvbiAxJ1xuICAgICAqICAgICB9LFxuICAgICAqICAgICB7XG4gICAgICogICAgICAgICBpZDogMixcbiAgICAgKiAgICAgICAgIGxhYmVsOiAnT3B0aW9uIDInXG4gICAgICogICAgIH0sXG4gICAgICogICAgIHtcbiAgICAgKiAgICAgICAgIGlkOiAzLFxuICAgICAqICAgICAgICAgbGFiZWw6ICdPcHRpb24gMydcbiAgICAgKiAgICAgfVxuICAgICAqIF07XG4gICAgICogXG4gICAgICogc2NvcGUub25DaGFuZ2UgPSBmdW5jdGlvbiBvbkNoYW5nZShzZWxlY3RlZFZhbHVlcykge1xuICAgICAqICAgICBjb25zb2xlLmxvZyhzZWxlY3RlZFZhbHVlcyk7XG4gICAgICogfTtcbiAgICAgKiBgYGBcbiAgICAgKiBcbiAgICAgKiBXaGVuIG9wdGlvbnNbMF0gYW5kIG9wdGlvbnNbMV0gYXJlIGNoZWNrZWQsIHNlbGVjdGVkVmFsdWVzIHNob3VsZCBiZSBbMSwgMl1cbiAgICAgKiBhbmQgb25DaGFuZ2Ugd2lsbCBiZSBldm9rZWQuIFRoaXMgZGlyZWN0aXZlIGFsc28gd29ya3Mgd2l0aCBhbiBhcnJheSBvZiBwcmltaXRpdmUgdmFsdWVzLlxuICAgICAqIGkuZS46IHNjb3BlLm9wdGlvbnMgPSBbXCJhXCIsIFwiYlwiLCBcImNcIl0uXG4gICAgICovXG5cbiAgICAuZGlyZWN0aXZlKCdjaGVja2JveExpc3QnLCBmdW5jdGlvbiBjaGVja2JveExpc3REaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0NoZWNrYm94TGlzdEN0cmwnLFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY2hlY2tib3hMaXN0Q3RybCcsXG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBvbkNoYW5nZTogJyZjaGVja2JveExpc3RDaGFuZ2UnLFxuICAgICAgICAgICAgICAgIHNlbGVjdGVkVmFsdWVzOiAnPWNoZWNrYm94TGlzdCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6ICc9JyxcbiAgICAgICAgICAgICAgICBuZ1ZhbHVlOiAnPSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jaGVja2JveC1saXN0JywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jaGVja2JveC1saXN0LmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNvbG9yLXBpY2tlci1wYWxldHRlLmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdDb2xvclBpY2tlclBhbGV0dGVDdHJsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBjdHJsID0gdGhpcztcblxuICAgICAgICBjdHJsLmNyZWF0ZU5ld0NvbG9yID0gY3JlYXRlTmV3Q29sb3I7XG4gICAgICAgIGN0cmwucmVtb3ZlRXhpc3RpbmdDb2xvciA9IHJlbW92ZUV4aXN0aW5nQ29sb3I7XG4gICAgICAgIGN0cmwuaXNBY3RpdmUgPSBpc0FjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVOZXdDb2xvcigkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBjdHJsLmNyZWF0ZU5ld1BhbGV0dGVDb2xvcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlRXhpc3RpbmdDb2xvcigkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBjdHJsLnJlbW92ZVBhbGV0dGVDb2xvcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNBY3RpdmUoY29sb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBjb2xvciA9PT0gY3RybC5zZWxlY3RlZENvbG9yO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY29sb3ItcGlja2VyLXBhbGV0dGUuZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jb2xvci1waWNrZXItcGFsZXR0ZS5jb250cm9sbGVyJ1xuXSlcblxuICAgIC5kaXJlY3RpdmUoJ2NvbG9yUGlja2VyUGFsZXR0ZScsIGZ1bmN0aW9uIGNvbG9yUGlja2VyUGFsZXR0ZURpcmVjdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQ29sb3JQaWNrZXJQYWxldHRlQ3RybCcsXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjb2xvclBpY2tlclBhbGV0dGVDdHJsJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIGNvbG9yczogJz0nLFxuICAgICAgICAgICAgICAgIGNyZWF0ZU5ld1BhbGV0dGVDb2xvcjogJz0nLFxuICAgICAgICAgICAgICAgIHJlbW92ZVBhbGV0dGVDb2xvcjogJz0nLFxuICAgICAgICAgICAgICAgIHNldE5ld0NvbG9yOiAnPScsXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRDb2xvcjogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvanMvYmlnY29tbWVyY2UvY29sb3ItcGlja2VyL2NvbG9yLXBpY2tlci1wYWxldHRlLnRwbC5odG1sJyxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGNvbG9yUGlja2VyUGFsZXR0ZURpcmVjdGl2ZUNvbXBpbGUodEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0RWxlbWVudC5hZGRDbGFzcygnY29sb3JQaWNrZXItcGFsZXR0ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiLyogZ2xvYmFscyBDb2xvclBpY2tlciAqL1xuYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNvbG9yLXBpY2tlci5jb250cm9sbGVyJywgW10pXG4gICAgLmNvbnRyb2xsZXIoJ0NvbG9yUGlja2VyQ3RybCcsIGZ1bmN0aW9uIENvbG9yUGlja2VyQ3RybCgkZWxlbWVudCkge1xuICAgICAgICBjb25zdCBjdHJsID0gdGhpcztcblxuICAgICAgICBsZXQgY29sb3JTZWxlY3Rpb247XG4gICAgICAgIGxldCBjb2xvclNlbGVjdGlvbkluZGljYXRvcjtcbiAgICAgICAgbGV0IGNvbG9yU2xpZGVyO1xuICAgICAgICBsZXQgY29sb3JTbGlkZXJJbmRpY2F0b3I7XG5cbiAgICAgICAgY3RybC5jcmVhdGVDb2xvclBpY2tlciA9IGNyZWF0ZUNvbG9yUGlja2VyO1xuICAgICAgICBjdHJsLmNyZWF0ZU5ld1BhbGV0dGVDb2xvciA9IGNyZWF0ZU5ld1BhbGV0dGVDb2xvcjtcbiAgICAgICAgY3RybC5yZW1vdmVQYWxldHRlQ29sb3IgPSByZW1vdmVQYWxldHRlQ29sb3I7XG4gICAgICAgIGN0cmwuc2V0TW9kZWxDdHJsID0gc2V0TW9kZWxDdHJsO1xuICAgICAgICBjdHJsLnNldE5ld0NvbG9yID0gc2V0TmV3Q29sb3I7XG4gICAgICAgIGN0cmwuZ2V0U2VsZWN0ZWRDb2xvciA9IGdldFNlbGVjdGVkQ29sb3I7XG5cbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlQ29sb3JQaWNrZXIoKSB7XG4gICAgICAgICAgICBjb2xvclNlbGVjdGlvbiA9ICRlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWJjLXBpY2tlcl0nKTtcbiAgICAgICAgICAgIGNvbG9yU2VsZWN0aW9uSW5kaWNhdG9yID0gJGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignW2RhdGEtYmMtcGlja2VyLWluZGljYXRvcl0nKTtcbiAgICAgICAgICAgIGNvbG9yU2xpZGVyID0gJGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignW2RhdGEtYmMtc2xpZGVyXScpO1xuICAgICAgICAgICAgY29sb3JTbGlkZXJJbmRpY2F0b3IgPSAkZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yKCdbZGF0YS1iYy1zbGlkZXItaW5kaWNhdG9yXScpO1xuXG4gICAgICAgICAgICBDb2xvclBpY2tlci5maXhJbmRpY2F0b3JzKFxuICAgICAgICAgICAgICAgIGNvbG9yU2xpZGVySW5kaWNhdG9yLFxuICAgICAgICAgICAgICAgIGNvbG9yU2VsZWN0aW9uSW5kaWNhdG9yKTtcblxuICAgICAgICAgICAgY3RybC5jcCA9IG5ldyBDb2xvclBpY2tlcihcbiAgICAgICAgICAgICAgICBjb2xvclNsaWRlcixcbiAgICAgICAgICAgICAgICBjb2xvclNlbGVjdGlvbixcbiAgICAgICAgICAgICAgICBwaWNrTmV3Q29sb3JcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVOZXdQYWxldHRlQ29sb3IoKSB7XG4gICAgICAgICAgICBpZiAoY3RybC5wYWxldHRlLmluZGV4T2YoZ2V0U2VsZWN0ZWRDb2xvcigpKSA8IDApIHtcbiAgICAgICAgICAgICAgICBjdHJsLnBhbGV0dGUucHVzaChnZXRTZWxlY3RlZENvbG9yKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlUGFsZXR0ZUNvbG9yKCkge1xuICAgICAgICAgICAgaWYgKGN0cmwucGFsZXR0ZS5pbmRleE9mKGdldFNlbGVjdGVkQ29sb3IoKSkgPiAtMSkge1xuICAgICAgICAgICAgICAgIGN0cmwucGFsZXR0ZS5zcGxpY2UoY3RybC5wYWxldHRlLmluZGV4T2YoZ2V0U2VsZWN0ZWRDb2xvcigpKSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRTZWxlY3RlZENvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIGN0cmwuY29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBwaWNrTmV3Q29sb3IoaGV4LCBoc3YsIHJnYiwgcGlja2VyQ29vcmRpbmF0ZSwgc2xpZGVyQ29vcmRpbmF0ZSkge1xuICAgICAgICAgICAgQ29sb3JQaWNrZXIucG9zaXRpb25JbmRpY2F0b3JzKFxuICAgICAgICAgICAgICAgIGNvbG9yU2xpZGVySW5kaWNhdG9yLFxuICAgICAgICAgICAgICAgIGNvbG9yU2VsZWN0aW9uSW5kaWNhdG9yLFxuICAgICAgICAgICAgICAgIHNsaWRlckNvb3JkaW5hdGUsIHBpY2tlckNvb3JkaW5hdGVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGN0cmwubmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShoZXgpO1xuICAgICAgICAgICAgY3RybC5uZ01vZGVsQ3RybC4kcmVuZGVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgICAgICBjdHJsLmNvbG9yID0gY3RybC5uZ01vZGVsQ3RybC4kdmlld1ZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0TW9kZWxDdHJsKG5nTW9kZWxDdHJsKSB7XG4gICAgICAgICAgICBjdHJsLm5nTW9kZWxDdHJsID0gbmdNb2RlbEN0cmw7XG4gICAgICAgICAgICBjdHJsLm5nTW9kZWxDdHJsLiRyZW5kZXIgPSByZW5kZXI7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXROZXdDb2xvcigkZXZlbnQsIG5ld0NvbG9yKSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgY3RybC5jcC5zZXRIZXgobmV3Q29sb3IpO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY29sb3ItcGlja2VyLmRpcmVjdGl2ZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY29sb3ItcGlja2VyLmNvbnRyb2xsZXInLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5odG1sNU1vZGUnLFxuXSlcblxuICAgIC5kaXJlY3RpdmUoJ2NvbG9yUGlja2VyJywgZnVuY3Rpb24gY29sb3JQaWNrZXJEaXJlY3RpdmUoJGxvY2F0aW9uLCBodG1sNU1vZGUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQ29sb3JQaWNrZXJDdHJsJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2NvbG9yUGlja2VyQ3RybCcsXG4gICAgICAgICAgICByZXF1aXJlOiBbJ2NvbG9yUGlja2VyJywgJ15uZ01vZGVsJ10sXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBwYWxldHRlOiAnPScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvanMvYmlnY29tbWVyY2UvY29sb3ItcGlja2VyL2NvbG9yLXBpY2tlci50cGwuaHRtbCcsXG5cbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGNvbG9yUGlja2VyRGlyZWN0aXZlQ29tcGlsZSh0RWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRFbGVtZW50LmFkZENsYXNzKCdjb2xvclBpY2tlcicpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGNvbG9yUGlja2VyRGlyZWN0aXZlTGluaygkc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJscykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdHJsID0gY3RybHNbMF07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5nTW9kZWxDdHJsID0gY3RybHNbMV07XG5cbiAgICAgICAgICAgICAgICAgICAgY3RybC5zZXRNb2RlbEN0cmwobmdNb2RlbEN0cmwpO1xuICAgICAgICAgICAgICAgICAgICBjdHJsLmNyZWF0ZUNvbG9yUGlja2VyKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQXBwcyB0aGF0IGhhdmUgYSA8YmFzZT4gdGFnIHJlcXVpcmUgdG8gaGF2ZSBhYnNvbHV0ZSBwYXRoc1xuICAgICAgICAgICAgICAgICAgICAvLyB3aGVuIHVzaW5nIHN2ZyB1cmwgcmVmZXJlbmNlc1xuICAgICAgICAgICAgICAgICAgICBpZiAoaHRtbDVNb2RlLmVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tmaWxsXScpLCBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJldHdlZW5QYXJlbnRoZXNpcyA9IC9cXCgoW14pXSspXFwpLztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlbGVtID0gYW5ndWxhci5lbGVtZW50KGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50RmlsbCA9IGVsZW0uYXR0cignZmlsbCcpO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXy5jb250YWlucyhjdXJyZW50RmlsbCwgJ3VybCgjJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3RmlsbCA9IGJldHdlZW5QYXJlbnRoZXNpcy5leGVjKGN1cnJlbnRGaWxsKVsxXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtLmF0dHIoJ2ZpbGwnLCAndXJsKCcgKyAkbG9jYXRpb24uYWJzVXJsKCkgKyBuZXdGaWxsICsgJyknKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kd2F0Y2goZ2V0TW9kZWxWYWx1ZSwgZnVuY3Rpb24gbW9kZWxXYXRjaChuZXdWYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXdWYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHJsLmNwLnNldEhleChuZXdWYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBnZXRNb2RlbFZhbHVlKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN0cmwubmdNb2RlbEN0cmwuJG1vZGVsVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNvbG9yLXBpY2tlcicsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY29sb3ItcGlja2VyLmRpcmVjdGl2ZScsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNvbG9yLXBpY2tlci1wYWxldHRlLmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNvcHktY2xpcGJvYXJkLmNvbnN0YW50JywgW10pXG4gICAgLmZhY3RvcnkoJ0NMSVBCT0FSRF9UT09MVElQJywgZnVuY3Rpb24gKGdldHRleHRDYXRhbG9nKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdWNjZXNzOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogZ2V0dGV4dENhdGFsb2cuZ2V0U3RyaW5nKCdDb3BpZWQhJylcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgICAgIG1vYmlsZTogZ2V0dGV4dENhdGFsb2cuZ2V0U3RyaW5nKCdUYXAgZG93biBhbmQgaG9sZCB0byBjb3B5JyksXG4gICAgICAgICAgICAgICAgbWFjOiBnZXR0ZXh0Q2F0YWxvZy5nZXRTdHJpbmcoJ1ByZXNzIOKMmC1DIHRvIGNvcHknKSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiBnZXR0ZXh0Q2F0YWxvZy5nZXRTdHJpbmcoJ1ByZXNzIEN0cmwtQyB0byBjb3B5JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jb3B5LWNsaXBib2FyZC5jb250cm9sbGVyJywgW10pXG4gICAgLmNvbnRyb2xsZXIoJ0NvcHlDbGlwYm9hcmRDdHJsJywgZnVuY3Rpb24gQ29weUNsaXBib2FyZEN0cmwoQ0xJUEJPQVJEX1RPT0xUSVAsIGRldmljZVNlcnZpY2UsICR0aW1lb3V0KXtcbiAgICAgICAgdmFyIGN0cmwgPSB0aGlzO1xuXG4gICAgICAgIGN0cmwudGltZW91dCA9ICR0aW1lb3V0O1xuICAgICAgICBjdHJsLm9uRXJyb3IgPSBvbkVycm9yO1xuICAgICAgICBjdHJsLm9uU3VjY2VzcyA9IG9uU3VjY2VzcztcblxuICAgICAgICBpbml0KCk7XG5cbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICAgIGN0cmwudW5pcXVlSWQgPSBfLnVuaXF1ZUlkKCdjbGlwYm9hcmQtJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBvblN1Y2Nlc3MoKSB7XG4gICAgICAgICAgICBjdHJsLmR5bmFtaWNUb29sdGlwID0gQ0xJUEJPQVJEX1RPT0xUSVAuc3VjY2Vzcy5kZWZhdWx0O1xuICAgICAgICAgICAgc2hvd1Rvb2x0aXAoY3RybC51bmlxdWVJZCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBvbkVycm9yKCl7XG4gICAgICAgICAgICB2YXIgdG9vbHRpcE1lc3NhZ2U7XG5cbiAgICAgICAgICAgIGlmIChkZXZpY2VTZXJ2aWNlLmlzSU9TRGV2aWNlKCkgfHwgZGV2aWNlU2VydmljZS5pc01vYmlsZURldmljZSgpKSB7XG4gICAgICAgICAgICAgICAgdG9vbHRpcE1lc3NhZ2UgPSBDTElQQk9BUkRfVE9PTFRJUC5lcnJvci5tb2JpbGU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRldmljZVNlcnZpY2UuaXNNYWNPU0RldmljZSgpKSB7XG4gICAgICAgICAgICAgICAgdG9vbHRpcE1lc3NhZ2UgPSBDTElQQk9BUkRfVE9PTFRJUC5lcnJvci5tYWM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRvb2x0aXBNZXNzYWdlID0gQ0xJUEJPQVJEX1RPT0xUSVAuZXJyb3IuZGVmYXVsdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3RybC5keW5hbWljVG9vbHRpcCA9IHRvb2x0aXBNZXNzYWdlO1xuICAgICAgICAgICAgc2hvd1Rvb2x0aXAoY3RybC51bmlxdWVJZCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzaG93VG9vbHRpcChpZCkge1xuICAgICAgICAgICAgdmFyIHRvb2x0aXBFbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSk7XG5cbiAgICAgICAgICAgIGN0cmwudGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdG9vbHRpcEVsZW1lbnQudHJpZ2dlckhhbmRsZXIoJ3Rvb2x0aXBUcmlnZ2VyT3BlbicpO1xuICAgICAgICAgICAgICAgIGN0cmwudGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRvb2x0aXBFbGVtZW50LnRyaWdnZXJIYW5kbGVyKCd0b29sdGlwVHJpZ2dlckNsb3NlJyk7XG4gICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNvcHktY2xpcGJvYXJkLmRpcmVjdGl2ZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ2NvcHlDbGlwYm9hcmQnLCBmdW5jdGlvbiBjb3B5Q2xpcGJvYXJkRGlyZWN0aXZlKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDb3B5Q2xpcGJvYXJkQ3RybCBhcyBjb3B5Q2xpcGJvYXJkQ3RybCcsXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBjb3B5VGV4dDogJ0AnLFxuICAgICAgICAgICAgICAgIHJlYWRvbmx5OiAnQCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9qcy9iaWdjb21tZXJjZS9jb3B5LWNsaXBib2FyZC9jb3B5LWNsaXBib2FyZC50cGwuaHRtbCcsXG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY29weS1jbGlwYm9hcmQnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNvcHktY2xpcGJvYXJkLmNvbnN0YW50JyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY29weS1jbGlwYm9hcmQuY29udHJvbGxlcicsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNvcHktY2xpcGJvYXJkLmRpcmVjdGl2ZSdcbl0pO1xuIiwiLyoqXG4gKiBAbmFtZSBjcmVkaXQtY2FyZCBkaXJlY3RpdmVcbiAqIEBkZXNjcmlwdGlvbiBDb21wb25lbnQgY29udGFpbmluZyBjYyBudW1iZXIsIGN2YywgbmFtZSwgYW5kIGV4cGlyeS4gSGFzIGFuIGlzb2xhdGVkIHNjb3BlIHdpdGggbm8gY29udHJvbGxlci5cbiAqIEByZXF1aXJlIGZvcm1cbiAqXG4gKiBAcGFyYW0gY2NEYXRhIHtvYmplY3R9IENvbnRhaW5zIGNjTnVtYmVyLCBjY1R5cGUsIGNjRXhwaXJ5LCBhbmQgY2NOYW1lXG4gKiBAcGFyYW0gY2NDb25maWcge29iamVjdH0gVGhlIGNvbmZpZ3VyYXRpb24gb2JqZWN0LiBDdXJyZW50bHkgc3VwcG9ydGluZzpcbiAqICAtIGNhcmRDb2RlIHtib29sZWFufSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgY3Z2IGZpZWxkIHNob3VsZCBiZSBzaG93bi4gRGVmYXVsdCB0cnVlLlxuICogIC0gY2FyZENvZGVSZXF1aXJlZCB7Ym9vbGVhbn0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGN2diBmaWVsZCBpcyByZXF1aXJlZC4gVGhpcyBvbmx5IG1hdHRlcnMgd2hlbiBjYXJkQ29kZSBpcyBzZXQgdG8gdHJ1ZS4gRGVmYXVsdCB0cnVlLlxuICogIC0gZnVsbE5hbWUge2Jvb2xlYW59IEluZGljYXRlcyB3aGV0aGVyIHRoZSBuYW1lIGZpZWxkIHNob3VsZCBiZSBzaG93bi4gRGVmYXVsdCB0cnVlLlxuICogQHBhcmFtIGVhZ2VyVHlwZSB7Ym9vbGVhbn0gSWYgdGhpcyBhdHRyaWJ1dGUgaXMgc2V0IHRvIGZhbHNlLCB0aGVuIGRpc2FibGUgZWFnZXIgdHlwZSBkZXRlY3Rpb24uIERlZmF1bHRzIHRydWUuXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC5kaXJlY3RpdmUnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmljb24nXG5dKVxuICAgIC5kaXJlY3RpdmUoJ2NyZWRpdENhcmQnLCBmdW5jdGlvbiBjcmVkaXRDYXJkRGlyZWN0aXZlKCRjb21waWxlLCAkcGFyc2UsICR0ZW1wbGF0ZUNhY2hlKSB7XG4gICAgICAgIGNvbnN0IGN2dlRvb2x0aXBUZW1wbGF0ZSA9ICR0ZW1wbGF0ZUNhY2hlLmdldCgnc3JjL2pzL2JpZ2NvbW1lcmNlL2NyZWRpdC1jYXJkL2NyZWRpdC1jYXJkLWN2di90b29sdGlwLnRwbC5odG1sJyk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGNyZWRpdENhcmRDb21waWxlKHRFbGVtLCB0QXR0cnMpe1xuICAgICAgICAgICAgICAgIGxldCBpc0VhZ2VyVHlwZSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBpZiAodEF0dHJzLmVhZ2VyVHlwZSAmJiAkcGFyc2UodEF0dHJzLmVhZ2VyVHlwZSkoKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2NOdW1iZXIgPSB0RWxlbVswXS5xdWVyeVNlbGVjdG9yKCcjY2NOdW1iZXInKTtcblxuICAgICAgICAgICAgICAgICAgICBjY051bWJlci5yZW1vdmVBdHRyaWJ1dGUoJ2NjRWFnZXJUeXBlJyk7XG4gICAgICAgICAgICAgICAgICAgIGlzRWFnZXJUeXBlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGNyZWRpdENhcmRMaW5rKHNjb3BlLCBlbGVtLCBhdHRyLCBmb3JtQ3RybCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdnZUb29sdGlwRWxlbWVudCA9ICRjb21waWxlKGN2dlRvb2x0aXBUZW1wbGF0ZSkoc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FyZENvZGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJkQ29kZVJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVsbE5hbWU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuZ2V0Q3Z2VG9vbHRpcEh0bWwgPSBnZXRDdnZUb29sdGlwSHRtbDtcblxuICAgICAgICAgICAgICAgICAgICBpbml0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmZvcm1DdHJsID0gZm9ybUN0cmw7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5jY0NvbmZpZyA9IF8uZGVmYXVsdHMoc2NvcGUuY2NDb25maWcsIGRlZmF1bHRDb25maWcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIFRoZSBjcmVkaXQgY2FyZCB0eXBlIGlzIGRlZHVjZWQgYnkgdGhlIGBjY051bWJlcmAgZGlyZWN0aXZlLiBUaGlzIGlzIGluIHR1cm4gZXhwb3NlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICogYXMgZWl0aGVyIGAkY2NFYWdlclR5cGVgIG9yIGAkY2NUeXBlYCBvbiB0aGUgaW5wdXQgY29udHJvbCBlbGVtZW50LiBXYXRjaCBmb3IgY2hhbmdlcyBhbmQgYmluZCB0aGUgdHlwZSB0byB0aGUgY29ycmVzcG9uZGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICogdmFsdWUgb24gY2NEYXRhLlxuICAgICAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goZ2V0RGV0ZWN0ZWRDY1R5cGUsIHNldENjVHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogUmV0dXJuIHRoZSBodG1sIGZvciB0aGUgdG9vbHRpcC4gVXNpbmcgb3V0ZXJIVE1MIHRvIGFsc28gaW5jbHVkZSB0aGUgcm9vdCBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge1N0cmluZ30gSHRtbCBzdHJpbmcgZm9yIHRoZSBjdnYgdG9vbHRpcCB0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZ2V0Q3Z2VG9vbHRpcEh0bWwoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3Z2VG9vbHRpcEVsZW1lbnRbMF0ub3V0ZXJIVE1MO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEdldCB0aGUgZGV0ZWN0ZWQgY3JlZGl0IGNhcmQgdHlwZSBleHBvc2VkIG9uIHRoZSBmb3JtIGNvbnRyb2wgYnkgdGhlIGNjTnVtYmVyIGNoaWxkIGRpcmVjdGl2ZS5cbiAgICAgICAgICAgICAgICAgICAgICogVGhpcyB2YWx1ZSB3aWxsIGJlIGV4cG9zZWQgYXMgJGNjRWFnZXJUeXBlIG9yICRjY1R5cGUgZGVwZW5kaW5nIG9uIHdoZXRoZXIgdGhpcyBmZWF0dXJlIGlzIGVuYWJsZWQuXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3N0cmluZ3xudWxsfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZ2V0RGV0ZWN0ZWRDY1R5cGUoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNFYWdlclR5cGUgPyBmb3JtQ3RybC5jY051bWJlci4kY2NFYWdlclR5cGUgOiBmb3JtQ3RybC5jY051bWJlci4kY2NUeXBlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFNldCBjY0RhdGEuY2NUeXBlXG4gICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfG51bGx9IHR5cGUgVGhlIGNyZWRpdCBjYXJkIHR5cGUsIGkuZS4gJ3Zpc2EnXG4gICAgICAgICAgICAgICAgICAgICAqIEByZXR1cm4ge3N0cmluZ3xudWxsfSB0eXBlXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBzZXRDY1R5cGUodHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2NEYXRhLmNjVHlwZSA9IHR5cGU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0eXBlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXF1aXJlOiAnXmZvcm0nLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIGNjRGF0YTogJz0nLFxuICAgICAgICAgICAgICAgIGNjQ29uZmlnOiAnPScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvanMvYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQvY3JlZGl0LWNhcmQudHBsLmh0bWwnXG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQnLCBbXG4gICAgJ2NyZWRpdC1jYXJkcycsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLmJjLWN2YycsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLmNjLWV4cGlyeScsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLmRpcmVjdGl2ZScsXG4gICAgJ2dldHRleHQnLFxuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQtdHlwZXMuY29uc3RhbnQnLCBbXSlcbiAgICAuY29uc3RhbnQoJ0NDX1RZUEVTJywge1xuICAgICAgICAnQW1lcmljYW4gRXhwcmVzcyc6ICdhbWV4JyxcbiAgICAgICAgJ0RpbmVycyBDbHViJzogJ2RpbmVyc2NsdWInLFxuICAgICAgICAnRGlzY292ZXInOiAnZGlzY292ZXInLFxuICAgICAgICAnTWFzdGVyQ2FyZCc6ICdtYXN0ZXJjYXJkJyxcbiAgICAgICAgJ1Zpc2EnOiAndmlzYScsXG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQtdHlwZXMuY29udHJvbGxlcicsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQtdHlwZXMuY29uc3RhbnQnLFxuXSlcbiAgICAuY29udHJvbGxlcignQ3JlZGl0Q2FyZFR5cGVzQ3RybCcsIGZ1bmN0aW9uIENyZWRpdENhcmRUeXBlc0N0cmwoJGVsZW1lbnQsIENDX1RZUEVTKSB7XG4gICAgICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xuXG4gICAgICAgIGN0cmwuaGFzU2VsZWN0ZWRUeXBlID0gaGFzU2VsZWN0ZWRUeXBlO1xuICAgICAgICBjdHJsLmlzU2VsZWN0ZWRUeXBlID0gaXNTZWxlY3RlZFR5cGU7XG4gICAgICAgIGN0cmwubWFwVG9TdmcgPSBtYXBUb1N2ZztcblxuICAgICAgICBpbml0KCk7XG5cbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdjcmVkaXRDYXJkVHlwZXMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGVja3Mgd2hldGhlciBhIHR5cGUgaGFzIGJlZW4gc2VsZWN0ZWQgKG9yIGRldGVjdGVkIGJ5IHRoZSBjcmVkaXQtY2FyZCBjb21wb25lbnQpXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBoYXNTZWxlY3RlZFR5cGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gIV8uaXNFbXB0eShjdHJsLmdldFNlbGVjdGVkVHlwZSgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGVja3MgaWYgdGhlIHBhc3NlZCBpbiBjY1R5cGUgaXMgdGhlIHNhbWUgYXMgdGhlIHNlbGVjdGVkIGNjVHlwZVxuICAgICAgICAgKiBAcGFyYW0gY2NUeXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBpc1NlbGVjdGVkVHlwZShjY1R5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjY1R5cGUgPT09IGN0cmwuZ2V0U2VsZWN0ZWRUeXBlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTWFwIHRoZSBjY1R5cGUgdG8gYSBjb3JyZXNwb25kaW5nIHN2ZyBuYW1lXG4gICAgICAgICAqIEBwYXJhbSBjY1R5cGUge1N0cmluZ31cbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbWFwVG9TdmcoY2NUeXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gQ0NfVFlQRVNbY2NUeXBlXTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiLyoqXG4gKiBAbmFtZSBjcmVkaXQtY2FyZC10eXBlcyBkaXJlY3RpdmVcbiAqIEBkZXNjcmlwdGlvbiBDb21wb25lbnQgZGlzcGxheWluZyBhbmQgZ3JleWluZyBvdXQgY3JlZGl0IGNhcmQgdHlwZSBpY29ucyBiYXNlZCBvbiB0aGUgc2VsZWN0ZWQgY3JlZGl0IGNhcmQgdHlwZS5cbiAqIGAuaXMtYWN0aXZlYCBpcyBhZGRlZCB0byB0aGUgY29ycmVzcG9uZGluZyBzZWxlY3RlZCBjcmVkaXQgY2FyZCB0eXBlLiBgLm5vdC1hY3RpdmVgIGlzIGFkZGVkIGZvciB0aGUgb3RoZXJcbiAqIHR5cGVzLiBJZiBubyBjcmVkaXQgY2FyZCB0eXBlcyBoYXMgYmVlbiBzZWxlY3RlZCwgdGhlbiBuZWl0aGVyIGAuaXMtYWN0aXZlYCBhbmQgYC5ub3QtYWN0aXZlYCB3aWxsIGJlIGFkZGVkIGF0IGFsbC5cbiAqXG4gKiBAcGFyYW0gc2VsZWN0ZWRUeXBlIHtTdHJpbmd9IENyZWRpdCBjYXJkIHR5cGUuIFZhbGlkIHR5cGVzIGFyZSAnVmlzYScsICdNYXN0ZXJDYXJkJywgJ0RpbmVycyBDbHViJywgJ0Rpc2NvdmVyJywgYW5kICdBbWVyaWNhbiBFeHByZXNzJ1xuICogQHBhcmFtIHN1cHBvcnRlZFR5cGVzIHtBcnJheX0gQXJyYXkgb2YgY3JlZGl0IGNhcmQgdHlwZXMgdG8gZGlzcGxheS4gVGhlIGNhcmQgdHlwZXMgdXNlIHRoZSBzYW1lIHN0cmluZ3M6ICdBbWVyaWNhbiBFeHByZXNzJywgJ0Rpc2NvdmVyJywgJ01hc3RlckNhcmQnLCAnVmlzYSdcbiAqL1xuYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLXR5cGVzLmRpcmVjdGl2ZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQtdHlwZXMuY29udHJvbGxlcicsXG5dKVxuICAgIC5kaXJlY3RpdmUoJ2NyZWRpdENhcmRUeXBlcycsIGZ1bmN0aW9uIGNyZWRpdENhcmRUeXBlc0RpcmVjdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQ3JlZGl0Q2FyZFR5cGVzQ3RybCBhcyBjcmVkaXRDYXJkVHlwZXNDdHJsJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIGdldFNlbGVjdGVkVHlwZTogJyZzZWxlY3RlZFR5cGUnLFxuICAgICAgICAgICAgICAgIGdldFN1cHBvcnRlZFR5cGVzOiAnJnN1cHBvcnRlZFR5cGVzJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL2JpZ2NvbW1lcmNlL2NyZWRpdC1jYXJkLXR5cGVzL2NyZWRpdC1jYXJkLXR5cGVzLnRwbC5odG1sJ1xuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLXR5cGVzJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC10eXBlcy5jb25zdGFudCcsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLXR5cGVzLmNvbnRyb2xsZXInLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC10eXBlcy5kaXJlY3RpdmUnLFxuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS5kaXJlY3RpdmUnLCBbXSlcbiAgICAuZGlyZWN0aXZlKCdmb3JtJywgZnVuY3Rpb24gZm9ybURpcmVjdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiBmb3JtTGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdmb3JtJyk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyKCdub3ZhbGlkYXRlJywgJycpO1xuXG4gICAgICAgICAgICAgICAgLy8gVXNlIGRpc2FibGUtYXV0by1mb2N1cz1cInRydWVcIiB0byB0dXJuIG9mZiBhdXRvbWF0aWMgZXJyb3IgZm9jdXNpbmdcbiAgICAgICAgICAgICAgICBpZiAoIWF0dHJzLmRpc2FibGVBdXRvRm9jdXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5vbignc3VibWl0JywgZnVuY3Rpb24gZm9ybUF1dG9Gb2N1c1N1Ym1pdEhhbmRsZXIoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW52YWxpZEZpZWxkID0gZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yKCcubmctaW52YWxpZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW52YWxpZEZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52YWxpZEZpZWxkLmZvY3VzKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBdXRvLXNlbGVjdCBleGlzdGluZyB0ZXh0IGZvciBmaWVsZHMgdGhhdCBzdXBwb3J0IGl0ICh0ZXh0LCBlbWFpbCwgcGFzc3dvcmQsIGV0Yy4pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGludmFsaWRGaWVsZC5zZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52YWxpZEZpZWxkLnNlbGVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0nLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0uZGlyZWN0aXZlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1maWVsZC5kaXJlY3RpdmUnLCBbXSlcbiAgICAuZGlyZWN0aXZlKCdmb3JtRmllbGQnLCBmdW5jdGlvbiBmb3JtRmllbGREaXJlY3RpdmUoJGxvZykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVxdWlyZTogJ15mb3JtJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgc2NvcGU6IHRydWUsXG4gICAgICAgICAgICBsaW5rOiB7XG4gICAgICAgICAgICAgICAgcHJlOiBmdW5jdGlvbiBmb3JtRmllbGRMaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgICAgICAvLyBJbmhlcml0ZWQgYnkgdGhlIGZvcm0tZmllbGQtZXJyb3JzIGRpcmVjdGl2ZSB0byBhdm9pZCByZWRlY2xhcmF0aW9uXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnByb3BlcnR5ID0gYXR0cnMucHJvcGVydHk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIHBvc3Q6IGZ1bmN0aW9uIGZvcm1GaWVsZExpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBmb3JtQ3RybCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBMb2NhdGVzIGFuZCB3YXRjaGVzIHRoZSBtYXRjaGluZyBpbnB1dC9zZWxlY3QvZXRjIChiYXNlZCBvbiBpdHMgbmFtZSBhdHRyaWJ1dGUpIGluIHRoZSBwYXJlbnQgZm9ybVxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHkgPSBhdHRycy5wcm9wZXJ0eTtcblxuICAgICAgICAgICAgICAgICAgICBpbml0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2Zvcm0tZmllbGQnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgYSBwcm9wZXJ0eSB3YXNuJ3QgcHJvdmlkZWQsIHdlIGNhbid0IGRvIG11Y2ggZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBpbnRlcmZhY2UgaWYgdGhlIGZvcm0gaXMgc3VibWl0dGVkIG9yIHRoZSBwcm9wZXJ0eSdzIHZhbGlkaXR5IHN0YXRlIGNoYW5nZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaChpc1N1Ym1pdHRlZCwgY2hlY2tWYWxpZGl0eSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goaXNJbnZhbGlkLCBjaGVja1ZhbGlkaXR5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNoZWNrVmFsaWRpdHkoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBhIHByb3BlcnR5IHdhcyBwcm92aWRlZCwgYnV0IG5vIG5nLW1vZGVsIHdhcyBkZWZpbmVkIGZvciB0aGUgZmllbGQsIHZhbGlkYXRpb24gd29uJ3Qgd29ya1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFoYXNNb2RlbCgpICYmIGlzU3VibWl0dGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGxvZy5pbmZvKCdGb3JtIGZpZWxkcyBjb250YWluaW5nIGlucHV0cyB3aXRob3V0IGFuIG5nLW1vZGVsIHByb3BlcnR5IHdpbGwgbm90IGJlIHZhbGlkYXRlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBPbmx5IHNob3cgYW4gZXJyb3IgaWYgdGhlIHVzZXIgaGFzIGFscmVhZHkgYXR0ZW1wdGVkIHRvIHN1Ym1pdCB0aGUgZm9ybVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC50b2dnbGVDbGFzcygnZm9ybS1maWVsZC0tZXJyb3InLCBpc1N1Ym1pdHRlZCgpICYmIGlzSW52YWxpZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGhhc01vZGVsKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEhZm9ybUN0cmxbcHJvcGVydHldO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gaXNTdWJtaXR0ZWQoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm9ybUN0cmwuJHN1Ym1pdHRlZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGlzSW52YWxpZCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaGFzTW9kZWwoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1DdHJsW3Byb3BlcnR5XS4kaW52YWxpZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWZpZWxkJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWZpZWxkLmRpcmVjdGl2ZScsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0tZmllbGQtZXJyb3InLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWZpZWxkLWVycm9ycydcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0tZmllbGQtZXJyb3IuZGlyZWN0aXZlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnZm9ybUZpZWxkRXJyb3InLCBmdW5jdGlvbiBmb3JtRmllbGRFcnJvckRpcmVjdGl2ZSgkY29tcGlsZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcHJpb3JpdHk6IDEwLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvanMvYmlnY29tbWVyY2UvZm9ybS1maWVsZC1lcnJvci9mb3JtLWZpZWxkLWVycm9yLnRwbC5odG1sJyxcbiAgICAgICAgICAgIHRlcm1pbmFsOiB0cnVlLFxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGZvcm1GaWVsZEVycm9yQ29tcGlsZSh0RWxlbWVudCwgdEF0dHJzKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlIHRyYW5zbGF0ZSBwcm9wZXJ0eSB3aXBlcyBvdXQgb3VyIG5nLW1lc3NhZ2UgbG9naWMgaW4gdGhlIHBvc3QgbGluayBmdW5jdGlvblxuICAgICAgICAgICAgICAgIC8vIFRoZSBwcmlvcml0eSBhbmQgdGVybWluYWwgcHJvcGVydGllcyBhYm92ZSBlbnN1cmUgdGhpcyBjaGVjayBvY2N1cnNcbiAgICAgICAgICAgICAgICBpZiAodEVsZW1lbnQuYXR0cigndHJhbnNsYXRlJykgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAnVGhlIHRyYW5zbGF0ZSBhdHRyaWJ1dGUgY2Fubm90IGJlIHVzZWQgd2l0aCB0aGUgZm9ybS1maWVsZC1lcnJvciBkaXJlY3RpdmUuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1VzZSB0aGUgdHJhbnNsYXRlIGZpbHRlciBpbnN0ZWFkIChleGFtcGxlOiB7eyBcIm15IGVycm9yIG1lc3NhZ2VcIiB8IHRyYW5zbGF0ZSB9fSkuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1ZhbGlkYXRvcjogJyArIHRBdHRycy52YWxpZGF0ZVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHBvc3Q6IGZ1bmN0aW9uIGZvcm1GaWVsZEVycm9yUG9zdExpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVycywgdHJhbnNjbHVkZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvcGVydHkgPSBzY29wZS5wcm9wZXJ0eSB8fCBhdHRycy5wcm9wZXJ0eTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNjbHVkZShmdW5jdGlvbiBmb3JtRmllbGRFcnJvclRyYW5zY2x1ZGUoZXJyb3JDbG9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYWJlbEVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQoJzxsYWJlbD4nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5nTWVzc2FnZSBkb2Vzbid0IHBsYXkgd2VsbCB3aXRoIGR5bmFtaWMgbWVzc2FnZSBpbnNlcnRpb24sIHRyYW5zbGF0aW9uLCBvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1lc3NhZ2UgZXhwcmVzc2lvbnMsIHNvIHdlIGJ1aWxkIGl0cyBlbGVtZW50IHVwIGhlcmUgYW5kIGluamVjdCBpdCBpbnRvIHRoZSBET01cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbEVsZW1lbnQuYXR0cignZm9yJywgc2NvcGUucHJvcGVydHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsRWxlbWVudC5hdHRyKCduZy1tZXNzYWdlJywgYXR0cnMudmFsaWRhdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsRWxlbWVudC5hdHRyKCdyb2xlJywgJ2FsZXJ0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxFbGVtZW50LmFkZENsYXNzKCdmb3JtLWlubGluZU1lc3NhZ2UnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBlcnJvciBzcGFuIHNob3VsZCBhbHJlYWR5IGhhdmUgYSB0cmFuc2xhdGlvbiB3YXRjaGVyIG9uIGl0IGJ5IG5vdywgdXNpbmcgYSBmaWx0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbEVsZW1lbnQuYXBwZW5kKGVycm9yQ2xvbmUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hcHBlbmQobGFiZWxFbGVtZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjb21waWxlKGVsZW1lbnQpKHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWZpZWxkLWVycm9yJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWZpZWxkLWVycm9yLmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0tZmllbGQtZXJyb3JzLmRpcmVjdGl2ZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ2Zvcm1GaWVsZEVycm9ycycsIGZ1bmN0aW9uIGZvcm1GaWVsZEVycm9yc0RpcmVjdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICByZXF1aXJlOiAnXmZvcm0nLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9qcy9iaWdjb21tZXJjZS9mb3JtLWZpZWxkLWVycm9ycy9mb3JtLWZpZWxkLWVycm9ycy50cGwuaHRtbCcsXG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgICAgICAgICAgbGluazoge1xuICAgICAgICAgICAgICAgIC8vIFByZS1saW5rIGlzIHJlcXVpcmVkLCBhcyB3ZSBoYXZlIHRvIGluamVjdCBvdXIgc2NvcGUgcHJvcGVydGllcyBiZWZvcmUgdGhlIGNoaWxkXG4gICAgICAgICAgICAgICAgLy8gZm9ybS1maWVsZC1lcnJvciBkaXJlY3RpdmUgKGFuZCBpdHMgaW50ZXJuYWwgbmctbWVzc2FnZSBkaXJlY3RpdmUncykgcG9zdC1saW5rIGZ1bmN0aW9uc1xuICAgICAgICAgICAgICAgIHByZTogZnVuY3Rpb24gZm9ybUZpZWxkRXJyb3JzUHJlTGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMsIGZvcm1DdHJsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFByb3BlcnR5IG5hbWUgY2FuIGJlIGluaGVyaXRlZCBmcm9tIHBhcmVudCBzY29wZSwgc3VjaCBhcyBmcm9tIHRoZSBmb3JtLWZpZWxkIGRpcmVjdGl2ZVxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHkgPSBzY29wZS5wcm9wZXJ0eSB8fCBhdHRycy5wcm9wZXJ0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5RmllbGQgPSBmb3JtQ3RybFtwcm9wZXJ0eV07XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gSW5oZXJpdGVkIGJ5IGZvcm0tZmllbGQtZXJyb3IgZGlyZWN0aXZlLiBMaXZlcyBkaXJlY3RseSBvbiBzY29wZSBiZWNhdXNlIHRoZSByZXF1aXJlXG4gICAgICAgICAgICAgICAgICAgIC8vIHByb3BlcnR5IGRvZXMgbm90IHdvcmsgd2VsbCB3aXRoIGRpcmVjdGl2ZSBjb250cm9sbGVyIGluc3RhbmNlc1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5mb3JtQ3RybCA9IGZvcm1DdHJsO1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5wcm9wZXJ0eSA9IHByb3BlcnR5O1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5wcm9wZXJ0eUZpZWxkID0gcHJvcGVydHlGaWVsZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1maWVsZC1lcnJvcnMnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0tZmllbGQtZXJyb3JzLmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0taW5wdXQtY29sb3IuY29udHJvbGxlcicsIFtdKVxuXG4gICAgLmNvbnRyb2xsZXIoJ0Zvcm1JbnB1dENvbG9yQ3RybCcsIGZ1bmN0aW9uKCRlbGVtZW50LCAkcm9vdFNjb3BlLCAkc2NvcGUpIHtcbiAgICAgICAgY29uc3QgY3RybCA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGhleENvbG9yUmVnZXggPSAvXiMoKFswLTlhLWZBLUZdezJ9KXszfXwoWzAtOWEtZkEtRl0pezN9KSQvO1xuXG4gICAgICAgIGxldCBpc1Zpc2libGUgPSBmYWxzZTtcblxuICAgICAgICBjdHJsLmJsdXJFdmVudEhhbmRsZXIgPSBibHVyRXZlbnRIYW5kbGVyO1xuICAgICAgICBjdHJsLmZvY3VzRXZlbnRIYW5kbGVyID0gZm9jdXNFdmVudEhhbmRsZXI7XG4gICAgICAgIGN0cmwuaGlkZVBpY2tlciA9IGhpZGVQaWNrZXI7XG4gICAgICAgIGN0cmwuaXNQaWNrZXJWaXNpYmxlID0gaXNQaWNrZXJWaXNpYmxlO1xuICAgICAgICBjdHJsLm9uQ2hhbmdlID0gb25DaGFuZ2U7XG4gICAgICAgIGN0cmwuc2V0TW9kZWxDdHJsID0gc2V0TW9kZWxDdHJsO1xuICAgICAgICBjdHJsLnNob3dQaWNrZXIgPSBzaG93UGlja2VyO1xuICAgICAgICBjdHJsLnVuaXF1ZUlkID0gZ2V0VW5pcXVlSUQoJ2Zvcm1JbnB1dENvbG9yLScpO1xuXG4gICAgICAgICRzY29wZS4kb24oJ2JjQ29sb3JQaWNrZXJPcGVuZWQnLCAoZXZlbnQsIHRyaWdnZXJpbmdFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoJGVsZW1lbnQgPT09IHRyaWdnZXJpbmdFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdHJsLmhpZGVQaWNrZXIoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZnVuY3Rpb24gYmx1ckV2ZW50SGFuZGxlcigkZXZlbnQpIHtcbiAgICAgICAgICAgIGlmICgkZWxlbWVudFswXS5jb250YWlucygkZXZlbnQucmVsYXRlZFRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGN0cmwuaGlkZVBpY2tlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZm9jdXNFdmVudEhhbmRsZXIoJGV2ZW50KSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGN0cmwuc2hvd1BpY2tlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0VW5pcXVlSUQoaWRQcmVmaXgpIHtcbiAgICAgICAgICAgIHJldHVybiBfLnVuaXF1ZUlkKGlkUHJlZml4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGhpZGVQaWNrZXIoKSB7XG4gICAgICAgICAgICBpZiAoY3RybC5pc1BpY2tlclZpc2libGUoKSkge1xuICAgICAgICAgICAgICAgIGN0cmwuaXNQaWNrZXJWaXNpYmxlKGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzUGlja2VyVmlzaWJsZShpc1Zpc2libGVUb1NldCkge1xuICAgICAgICAgICAgaWYgKGlzVmlzaWJsZVRvU2V0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpc1Zpc2libGUgPSBpc1Zpc2libGVUb1NldDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGlzVmlzaWJsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG9uQ2hhbmdlKCkge1xuICAgICAgICAgICAgaWYgKGhleENvbG9yUmVnZXgudGVzdChjdHJsLmNvbG9yKSkge1xuICAgICAgICAgICAgICAgIGN0cmwubGFzdFZhbGlkQ29sb3IgPSBjdHJsLmNvbG9yO1xuICAgICAgICAgICAgICAgIGN0cmwubmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShjdHJsLmNvbG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgICAgIGN0cmwuY29sb3IgPSBjdHJsLm5nTW9kZWxDdHJsLiR2aWV3VmFsdWU7XG4gICAgICAgICAgICBjdHJsLmxhc3RWYWxpZENvbG9yID0gY3RybC5jb2xvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldE1vZGVsQ3RybChuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgY3RybC5uZ01vZGVsQ3RybCA9IG5nTW9kZWxDdHJsO1xuICAgICAgICAgICAgY3RybC5uZ01vZGVsQ3RybC4kcmVuZGVyID0gcmVuZGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2hvd1BpY2tlcigpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnYmNDb2xvclBpY2tlck9wZW5lZCcsICRlbGVtZW50KTtcbiAgICAgICAgICAgIGN0cmwuaXNQaWNrZXJWaXNpYmxlKHRydWUpO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1pbnB1dC1jb2xvci5kaXJlY3RpdmUnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0taW5wdXQtY29sb3IuY29udHJvbGxlcicsXG5dKVxuXG4gICAgLmRpcmVjdGl2ZSgnZm9ybUlucHV0Q29sb3InLCBmdW5jdGlvbiBmb3JtSW5wdXRDb2xvckRpcmVjdGl2ZSgkZG9jdW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnRm9ybUlucHV0Q29sb3JDdHJsJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2Zvcm1JbnB1dENvbG9yQ3RybCcsXG4gICAgICAgICAgICByZXF1aXJlOiBbJ2Zvcm1JbnB1dENvbG9yJywgJ15uZ01vZGVsJ10sXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBsYWJlbFRleHQ6ICc9JyxcbiAgICAgICAgICAgICAgICBwYWxldHRlOiAnPScsXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJUZXh0OiAnPScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvanMvYmlnY29tbWVyY2UvZm9ybS1pbnB1dC1jb2xvci9mb3JtLWlucHV0LWNvbG9yLnRwbC5odG1sJyxcblxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gZm9ybUlucHV0Q29sb3JEaXJlY3RpdmVDb21waWxlKHRFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdEVsZW1lbnQuYWRkQ2xhc3MoJ2Zvcm0taW5wdXRDb2xvcicpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGZvcm1JbnB1dENvbG9yRGlyZWN0aXZlTGluaygkc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJscykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdHJsID0gY3RybHNbMF07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5nTW9kZWxDdHJsID0gY3RybHNbMV07XG5cbiAgICAgICAgICAgICAgICAgICAgY3RybC5zZXRNb2RlbEN0cmwobmdNb2RlbEN0cmwpO1xuXG4gICAgICAgICAgICAgICAgICAgICRkb2N1bWVudC5vbigna2V5ZG93bicsIGtleWRvd25FdmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgICAgICAgICAkZG9jdW1lbnQub24oJ21vdXNlZG93bicsIG1vdXNlRG93bkV2ZW50SGFuZGxlcik7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRvbignJGRlc3Ryb3knLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZG9jdW1lbnQub2ZmKCdtb3VzZWRvd24nLCBtb3VzZURvd25FdmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJGRvY3VtZW50Lm9mZigna2V5ZG93bicsIGtleWRvd25FdmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBrZXlkb3duRXZlbnRIYW5kbGVyICgkZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkZXZlbnQud2hpY2ggPT09IDI3KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0cmwuaGlkZVBpY2tlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gbW91c2VEb3duRXZlbnRIYW5kbGVyKCRldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnRbMF0uY29udGFpbnMoJGV2ZW50LnRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHJsLmhpZGVQaWNrZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1pbnB1dC1jb2xvcicsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1pbnB1dC1jb2xvci5kaXJlY3RpdmUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5odG1sNU1vZGUnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmh0bWw1TW9kZS5zZXJ2aWNlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuaHRtbDVNb2RlLnNlcnZpY2UnLCBbXSlcbiAgICAucHJvdmlkZXIoJ2h0bWw1TW9kZScsIGZ1bmN0aW9uIGh0bWw1TW9kZVByb3ZpZGVyKCRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICAgICAgIHRoaXMuJGdldCA9IGZ1bmN0aW9uIGh0bWw1TW9kZVNlcnZpY2UoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKCk7XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuaWNvbi5jb250cm9sbGVyJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5odG1sNU1vZGUnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5pY29uLnN2Z1Jvb3RQYXRoJ1xuXSlcbiAgICAuY29udHJvbGxlcignSWNvbkN0cmwnLCBmdW5jdGlvbiBpY29uRGlyZWN0aXZlQ29udHJvbGxlcigkaHR0cCwgJGxvY2F0aW9uLCAkdGVtcGxhdGVDYWNoZSwgaHRtbDVNb2RlLCBzdmdSb290UGF0aCkge1xuICAgICAgICBjb25zdCBhYnNVcmwgPSAkbG9jYXRpb24uYWJzVXJsKCk7XG4gICAgICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xuXG4gICAgICAgIGN0cmwuY2hhbmdlVXJsc1RvQWJzb2x1dGUgPSBjaGFuZ2VVcmxzVG9BYnNvbHV0ZTtcbiAgICAgICAgY3RybC5jaGFuZ2VYbGlua3NUb0Fic29sdXRlID0gY2hhbmdlWGxpbmtzVG9BYnNvbHV0ZTtcbiAgICAgICAgY3RybC51cGRhdGVHbHlwaCA9IHVwZGF0ZUdseXBoO1xuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZUdseXBoKGdseXBoKSB7XG4gICAgICAgICAgICBjb25zdCBmdWxsU3ZnUGF0aCA9IHN2Z1Jvb3RQYXRoICsgZ2x5cGggKyAnLnN2Zyc7XG5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoZnVsbFN2Z1BhdGgsIHsgY2FjaGU6ICR0ZW1wbGF0ZUNhY2hlIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gaWNvbkRpcmVjdGl2ZUh0dHBTdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzdHJpbmdpZmllZEVsZW1lbnQgPSByZXNwb25zZS5kYXRhO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChodG1sNU1vZGUuZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5naWZpZWRFbGVtZW50ID0gY2hhbmdlVXJsc1RvQWJzb2x1dGUoc3RyaW5naWZpZWRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZ2lmaWVkRWxlbWVudCA9IGNoYW5nZVhsaW5rc1RvQWJzb2x1dGUoc3RyaW5naWZpZWRFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHJpbmdpZmllZEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjaGFuZ2VVcmxzVG9BYnNvbHV0ZShzdHJpbmdpZmllZEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmdpZmllZEVsZW1lbnQucmVwbGFjZSgvdXJsXFwoKFsnXCJdPykjL2dpLCAndXJsKCQxJyArIGFic1VybCArICcjJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjaGFuZ2VYbGlua3NUb0Fic29sdXRlKHN0cmluZ2lmaWVkRWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0cmluZ2lmaWVkRWxlbWVudC5yZXBsYWNlKC94bGluazpocmVmPShbJ1wiXT8pIy9naSwgJ3hsaW5rOmhyZWY9JDEnICsgYWJzVXJsICsgJyMnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiLyoqXG4gKiBAZGVzY3JpcHRpb24gSWNvbiBkaXJlY3RpdmUgdXNlZCB0byBsb2FkIGFuIGlubGluZSBzdmcgaWNvbiwgc2ltbGlhciB0byBpY29uXG4gKiAgICAgICAgICAgICAgZm9udCBtZXRob2RzIG9mIHBhc3QgPGkgY2xhc3M9XCJpY29uLWZvby1iYXJcIj48L2k+XG4gKiBAZXhhbXBsZVxuICogPGljb24gZ2x5cGg9XCJpYy1hZGQtY2lyY2xlXCI+PC9pY29uPlxuICovXG5hbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuaWNvbi5kaXJlY3RpdmUnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmljb24uY29udHJvbGxlcidcbl0pXG4gICAgLmRpcmVjdGl2ZSgnaWNvbicsIGZ1bmN0aW9uIGljb25EaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0ljb25DdHJsIGFzIGljb25DdHJsJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIGdseXBoOiAnQCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiBpY29uRGlyZWN0aXZlQ29tcGlsZSh0RWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRFbGVtZW50LmFkZENsYXNzKCdpY29uJyk7XG4gICAgICAgICAgICAgICAgdEVsZW1lbnQuYXR0cignYXJpYS1oaWRkZW4nLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBpY29uRGlyZWN0aXZlTGluaygkc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJsKSB7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzLiRvYnNlcnZlKCdnbHlwaCcsIGZ1bmN0aW9uIGljb25EaXJlY3RpdmVMaW5rV2F0Y2gobmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0cmwudXBkYXRlR2x5cGgobmV3VmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gaWNvblVwZGF0ZUdseXBoVGhlbihzdmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5odG1sKHN2Zyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuaWNvbicsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuaWNvbi5kaXJlY3RpdmUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5pY29uLnN2Z1Jvb3RQYXRoJywgW10pXG4gICAgLnByb3ZpZGVyKCdzdmdSb290UGF0aCcsIGZ1bmN0aW9uIHN2Z1Jvb3RQYXRoUHJvdmlkZXJDb25maWcoKSB7XG4gICAgICAgIHRoaXMuc2V0Um9vdFBhdGggPSBzZXRSb290UGF0aDtcbiAgICAgICAgdGhpcy4kZ2V0ID0gZnVuY3Rpb24gc3ZnUm9vdFBhdGhQcm92aWRlckdldCgkbG9nKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdmdSb290UGF0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgJGxvZy5lcnJvcignTm8gc3ZnUm9vdFBhdGggcHJvdmlkZWQuIFBsZWFzZSBjb25maWd1cmUgdGhpcyB1c2luZyB0aGUgc3ZnUm9vdFBhdGhQcm92aWRlcicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdmdSb290UGF0aDtcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBzZXRSb290UGF0aChuZXdSb290UGF0aCkge1xuICAgICAgICAgICAgdGhpcy5zdmdSb290UGF0aCA9IG5ld1Jvb3RQYXRoO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIubG9hZGluZy1ub3RpZmljYXRpb24uZGlyZWN0aXZlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnbG9hZGluZ05vdGlmaWNhdGlvbicsIGZ1bmN0aW9uIGxvYWRpbmdOb3RpZmljYXRpb25EaXJlY3RpdmUoJHJvb3RTY29wZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL2JpZ2NvbW1lcmNlL2xvYWRpbmctbm90aWZpY2F0aW9uL2xvYWRpbmctbm90aWZpY2F0aW9uLnRwbC5odG1sJyxcblxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignYWpheFJlcXVlc3RSdW5uaW5nJywgZnVuY3Rpb24oZXZlbnQsIHZhbCkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5yZXF1ZXN0SW5Qcm9ncmVzcyA9IHZhbDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5sb2FkaW5nLW5vdGlmaWNhdGlvbicsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIubG9hZGluZy1ub3RpZmljYXRpb24uZGlyZWN0aXZlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIubG9hZGluZy1vdmVybGF5LmNvbnRyb2xsZXInLCBbXSlcbiAgICAuY29udHJvbGxlcignTG9hZGluZ092ZXJsYXlDdHJsJywgZnVuY3Rpb24gTG9hZGluZ092ZXJsYXlDdHJsKCRyb290U2NvcGUsICR0aW1lb3V0KSB7XG4gICAgICAgIHZhciBjdHJsID0gdGhpcyxcbiAgICAgICAgICAgIGRlZmF1bHREZWJvdW5jZSA9IDEwMCxcbiAgICAgICAgICAgIHRpbWVvdXQ7XG5cbiAgICAgICAgaWYgKGN0cmwuZGVib3VuY2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY3RybC5kZWJvdW5jZSA9IGRlZmF1bHREZWJvdW5jZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjdHJsLnVzZVVpUm91dGVyKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBzdGFydExvYWRpbmcpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBzdG9wTG9hZGluZyk7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlRXJyb3InLCBzdG9wTG9hZGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzdGFydExvYWRpbmcoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aW1lb3V0ID0gJHRpbWVvdXQoZnVuY3Rpb24gc3RhcnRMb2FkaW5nVGltZXIoKSB7XG4gICAgICAgICAgICAgICAgY3RybC5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIH0sIGN0cmwuZGVib3VuY2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc3RvcExvYWRpbmcoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkdGltZW91dC5jYW5jZWwodGltZW91dCk7XG4gICAgICAgICAgICBjdHJsLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmxvYWRpbmctb3ZlcmxheS5kaXJlY3RpdmUnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmxvYWRpbmctb3ZlcmxheS5jb250cm9sbGVyJ1xuXSlcbiAgICAuZGlyZWN0aXZlKCdsb2FkaW5nT3ZlcmxheScsIGZ1bmN0aW9uIGxvYWRpbmdPdmVybGF5KCRjb21waWxlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvYWRpbmdPdmVybGF5Q3RybCBhcyBsb2FkaW5nT3ZlcmxheUN0cmwnLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgZGVib3VuY2U6ICc9PycsXG4gICAgICAgICAgICAgICAgbG9hZGluZzogJz0/bG9hZGluZ092ZXJsYXknLFxuICAgICAgICAgICAgICAgIHVzZVVpUm91dGVyOiAnPT8nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gbG9hZGluZ092ZXJsYXlDb21waWxlKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdsb2FkaW5nT3ZlcmxheS1jb250YWluZXInKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBsb2FkaW5nT3ZlcmxheUxpbmsoc2NvcGUsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3ZlcmxheSA9ICRjb21waWxlKCc8ZGl2IGNsYXNzPVwibG9hZGluZ092ZXJsYXlcIiBuZy1pZj1cImxvYWRpbmdPdmVybGF5Q3RybC5sb2FkaW5nXCI+PC9kaXY+Jykoc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFwcGVuZChvdmVybGF5KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmxvYWRpbmctb3ZlcmxheScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIubG9hZGluZy1vdmVybGF5LmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLW1vZGFsLm1vZGFsU3RhY2suc2VydmljZScsIFtcblxuXSlcblxuICAuZmFjdG9yeSgnJG1vZGFsU3RhY2snLCBbJyR3aW5kb3cnLCAnJHRyYW5zaXRpb24nLCAnJHRpbWVvdXQnLCAnJGRvY3VtZW50JywgJyRjb21waWxlJywgJyRyb290U2NvcGUnLCAnJCRzdGFja2VkTWFwJyxcbiAgICBmdW5jdGlvbiAoJHdpbmRvdywgJHRyYW5zaXRpb24sICR0aW1lb3V0LCAkZG9jdW1lbnQsICRjb21waWxlLCAkcm9vdFNjb3BlLCAkJHN0YWNrZWRNYXApIHtcbiAgICAgIC8vIENoYW5nZXM6IGNoYW5nZSBmcm9tIGBtb2RhbC1vcGVuYCB0byBgaGFzLWFjdGl2ZU1vZGFsYFxuICAgICAgdmFyIE9QRU5FRF9NT0RBTF9DTEFTUyA9ICdoYXMtYWN0aXZlTW9kYWwnO1xuXG4gICAgICB2YXIgYmFja2Ryb3BEb21FbCwgYmFja2Ryb3BTY29wZSwgY3NzVG9wO1xuICAgICAgdmFyIG9wZW5lZFdpbmRvd3MgPSAkJHN0YWNrZWRNYXAuY3JlYXRlTmV3KCk7XG4gICAgICB2YXIgJG1vZGFsU3RhY2sgPSB7fTtcblxuICAgICAgZnVuY3Rpb24gYmFja2Ryb3BJbmRleCgpIHtcbiAgICAgICAgdmFyIHRvcEJhY2tkcm9wSW5kZXggPSAtMTtcbiAgICAgICAgdmFyIG9wZW5lZCA9IG9wZW5lZFdpbmRvd3Mua2V5cygpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9wZW5lZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChvcGVuZWRXaW5kb3dzLmdldChvcGVuZWRbaV0pLnZhbHVlLmJhY2tkcm9wKSB7XG4gICAgICAgICAgICB0b3BCYWNrZHJvcEluZGV4ID0gaTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRvcEJhY2tkcm9wSW5kZXg7XG4gICAgICB9XG5cbiAgICAgICRyb290U2NvcGUuJHdhdGNoKGJhY2tkcm9wSW5kZXgsIGZ1bmN0aW9uKG5ld0JhY2tkcm9wSW5kZXgpe1xuICAgICAgICBpZiAoYmFja2Ryb3BTY29wZSkge1xuICAgICAgICAgIGJhY2tkcm9wU2NvcGUuaW5kZXggPSBuZXdCYWNrZHJvcEluZGV4O1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgZnVuY3Rpb24gcmVtb3ZlTW9kYWxXaW5kb3cobW9kYWxJbnN0YW5jZSkge1xuICAgICAgICB2YXIgYm9keSA9ICRkb2N1bWVudC5maW5kKCdib2R5JykuZXEoMCk7XG4gICAgICAgIHZhciBtb2RhbFdpbmRvdyA9IG9wZW5lZFdpbmRvd3MuZ2V0KG1vZGFsSW5zdGFuY2UpLnZhbHVlO1xuXG4gICAgICAgIC8vY2xlYW4gdXAgdGhlIHN0YWNrXG4gICAgICAgIG9wZW5lZFdpbmRvd3MucmVtb3ZlKG1vZGFsSW5zdGFuY2UpO1xuXG4gICAgICAgIC8vcmVtb3ZlIHdpbmRvdyBET00gZWxlbWVudFxuICAgICAgICByZW1vdmVBZnRlckFuaW1hdGUobW9kYWxXaW5kb3cubW9kYWxEb21FbCwgbW9kYWxXaW5kb3cubW9kYWxTY29wZSwgMzAwLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBtb2RhbFdpbmRvdy5tb2RhbFNjb3BlLiRkZXN0cm95KCk7XG4gICAgICAgICAgYm9keS50b2dnbGVDbGFzcyhPUEVORURfTU9EQUxfQ0xBU1MsIG9wZW5lZFdpbmRvd3MubGVuZ3RoKCkgPiAwKTtcbiAgICAgICAgICBjaGVja1JlbW92ZUJhY2tkcm9wKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBjaGVja1JlbW92ZUJhY2tkcm9wKCkge1xuICAgICAgICAvL3JlbW92ZSBiYWNrZHJvcCBpZiBubyBsb25nZXIgbmVlZGVkXG4gICAgICAgIGlmIChiYWNrZHJvcERvbUVsICYmIGJhY2tkcm9wSW5kZXgoKSA9PSAtMSkge1xuICAgICAgICAgIHZhciBiYWNrZHJvcFNjb3BlUmVmID0gYmFja2Ryb3BTY29wZTtcbiAgICAgICAgICByZW1vdmVBZnRlckFuaW1hdGUoYmFja2Ryb3BEb21FbCwgYmFja2Ryb3BTY29wZSwgMTUwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBiYWNrZHJvcFNjb3BlUmVmLiRkZXN0cm95KCk7XG4gICAgICAgICAgICBiYWNrZHJvcFNjb3BlUmVmID0gbnVsbDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBiYWNrZHJvcERvbUVsID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGJhY2tkcm9wU2NvcGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcmVtb3ZlQWZ0ZXJBbmltYXRlKGRvbUVsLCBzY29wZSwgZW11bGF0ZVRpbWUsIGRvbmUpIHtcbiAgICAgICAgLy8gQ2xvc2luZyBhbmltYXRpb25cbiAgICAgICAgc2NvcGUuYW5pbWF0ZSA9IGZhbHNlO1xuXG4gICAgICAgIHZhciB0cmFuc2l0aW9uRW5kRXZlbnROYW1lID0gJHRyYW5zaXRpb24udHJhbnNpdGlvbkVuZEV2ZW50TmFtZTtcbiAgICAgICAgaWYgKHRyYW5zaXRpb25FbmRFdmVudE5hbWUpIHtcbiAgICAgICAgICAvLyB0cmFuc2l0aW9uIG91dFxuICAgICAgICAgIHZhciB0aW1lb3V0ID0gJHRpbWVvdXQoYWZ0ZXJBbmltYXRpbmcsIGVtdWxhdGVUaW1lKTtcblxuICAgICAgICAgIGRvbUVsLmJpbmQodHJhbnNpdGlvbkVuZEV2ZW50TmFtZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVvdXQpO1xuICAgICAgICAgICAgYWZ0ZXJBbmltYXRpbmcoKTtcbiAgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEVuc3VyZSB0aGlzIGNhbGwgaXMgYXN5bmNcbiAgICAgICAgICAkdGltZW91dChhZnRlckFuaW1hdGluZywgMCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhZnRlckFuaW1hdGluZygpIHtcbiAgICAgICAgICBpZiAoYWZ0ZXJBbmltYXRpbmcuZG9uZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBhZnRlckFuaW1hdGluZy5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIGRvbUVsLnJlbW92ZSgpO1xuICAgICAgICAgIGlmIChkb25lKSB7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZU1vZGFsVG9wKG1vZGFsRWxlbWVudCwgb2Zmc2V0KSB7XG4gICAgICAgIHZhciBzY3JvbGxZID0gMDtcblxuICAgICAgICBpZiAoYW5ndWxhci5pc1VuZGVmaW5lZChvZmZzZXQpKSB7XG4gICAgICAgICAgb2Zmc2V0ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZSB3aW5kb3cgaXMgd2l0aGluIGFuIGlmcmFtZSwgY2FsY3VsYXRlIHRoZSBwYXJlbnRcbiAgICAgICAgLy8gZnJhbWUncyBvZmZzZXQgYXMgdGhlIHRvcCBwb3NpdGlvbiBmb3IgdGhlIG1vZGFsXG4gICAgICAgIGlmICgkd2luZG93LnNlbGYgIT09ICR3aW5kb3cudG9wKSB7XG4gICAgICAgICAgc2Nyb2xsWSA9ICR3aW5kb3cucGFyZW50LnNjcm9sbFk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb2Zmc2V0ICsgc2Nyb2xsWTtcbiAgICAgIH1cblxuICAgICAgJGRvY3VtZW50LmJpbmQoJ2tleWRvd24nLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIHZhciBtb2RhbDtcblxuICAgICAgICBpZiAoZXZ0LndoaWNoID09PSAyNykge1xuICAgICAgICAgIG1vZGFsID0gb3BlbmVkV2luZG93cy50b3AoKTtcbiAgICAgICAgICBpZiAobW9kYWwgJiYgbW9kYWwudmFsdWUua2V5Ym9hcmQpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgJG1vZGFsU3RhY2suZGlzbWlzcyhtb2RhbC5rZXkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgJG1vZGFsU3RhY2sub3BlbiA9IGZ1bmN0aW9uIChtb2RhbEluc3RhbmNlLCBtb2RhbCkge1xuXG4gICAgICAgIG9wZW5lZFdpbmRvd3MuYWRkKG1vZGFsSW5zdGFuY2UsIHtcbiAgICAgICAgICBkZWZlcnJlZDogbW9kYWwuZGVmZXJyZWQsXG4gICAgICAgICAgbW9kYWxTY29wZTogbW9kYWwuc2NvcGUsXG4gICAgICAgICAgYmFja2Ryb3A6IG1vZGFsLmJhY2tkcm9wLFxuICAgICAgICAgIGtleWJvYXJkOiBtb2RhbC5rZXlib2FyZFxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYm9keSA9ICRkb2N1bWVudC5maW5kKCdib2R5JykuZXEoMCksXG4gICAgICAgICAgICBjdXJyQmFja2Ryb3BJbmRleCA9IGJhY2tkcm9wSW5kZXgoKTtcblxuICAgICAgICBpZiAoY3VyckJhY2tkcm9wSW5kZXggPj0gMCAmJiAhYmFja2Ryb3BEb21FbCkge1xuICAgICAgICAgIGJhY2tkcm9wU2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcodHJ1ZSk7XG4gICAgICAgICAgYmFja2Ryb3BTY29wZS5pbmRleCA9IGN1cnJCYWNrZHJvcEluZGV4O1xuICAgICAgICAgIGJhY2tkcm9wRG9tRWwgPSAkY29tcGlsZSgnPGRpdiBtb2RhbC1iYWNrZHJvcD48L2Rpdj4nKShiYWNrZHJvcFNjb3BlKTtcbiAgICAgICAgICBib2R5LmFwcGVuZChiYWNrZHJvcERvbUVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENyZWF0ZSBhIGZhdXggbW9kYWwgZGl2IGp1c3QgdG8gbWVhc3VyZSBpdHNcbiAgICAgICAgLy8gZGlzdGFuY2UgdG8gdG9wXG4gICAgICAgIHZhciBmYXV4ID0gYW5ndWxhci5lbGVtZW50KCc8ZGl2IGNsYXNzPVwicmV2ZWFsLW1vZGFsXCIgc3R5bGU9XCJ6LWluZGV4Oi0xXCJcIj48L2Rpdj4nKTtcbiAgICAgICAgYm9keS5hcHBlbmQoZmF1eFswXSk7XG4gICAgICAgIGNzc1RvcCA9IHBhcnNlSW50KCR3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShmYXV4WzBdKS50b3ApIHx8IDA7XG4gICAgICAgIHZhciBvcGVuQXQgPSBjYWxjdWxhdGVNb2RhbFRvcChmYXV4LCBjc3NUb3ApO1xuICAgICAgICBmYXV4LnJlbW92ZSgpO1xuXG4gICAgICAgIHZhciBhbmd1bGFyRG9tRWwgPSBhbmd1bGFyLmVsZW1lbnQoJzxkaXYgbW9kYWwtd2luZG93IHN0eWxlPVwidmlzaWJpbGl0eTogdmlzaWJsZTsgZGlzcGxheTogYmxvY2s7IHRvcDonICsgb3BlbkF0ICsncHg7XCI+PC9kaXY+Jyk7XG4gICAgICAgIGFuZ3VsYXJEb21FbC5hdHRyKCd3aW5kb3ctY2xhc3MnLCBtb2RhbC53aW5kb3dDbGFzcyk7XG4gICAgICAgIGFuZ3VsYXJEb21FbC5hdHRyKCdpbmRleCcsIG9wZW5lZFdpbmRvd3MubGVuZ3RoKCkgLSAxKTtcbiAgICAgICAgYW5ndWxhckRvbUVsLmF0dHIoJ2FuaW1hdGUnLCAnYW5pbWF0ZScpO1xuICAgICAgICBhbmd1bGFyRG9tRWwuaHRtbChtb2RhbC5jb250ZW50KTtcblxuICAgICAgICB2YXIgbW9kYWxEb21FbCA9ICRjb21waWxlKGFuZ3VsYXJEb21FbCkobW9kYWwuc2NvcGUpO1xuICAgICAgICBvcGVuZWRXaW5kb3dzLnRvcCgpLnZhbHVlLm1vZGFsRG9tRWwgPSBtb2RhbERvbUVsO1xuICAgICAgICBib2R5LmFwcGVuZChtb2RhbERvbUVsKTtcbiAgICAgICAgYm9keS5hZGRDbGFzcyhPUEVORURfTU9EQUxfQ0xBU1MpO1xuICAgICAgfTtcblxuICAgICAgJG1vZGFsU3RhY2sucmVwb3NpdGlvbiA9IGZ1bmN0aW9uIChtb2RhbEluc3RhbmNlKSB7XG4gICAgICAgIHZhciBtb2RhbFdpbmRvdyA9IG9wZW5lZFdpbmRvd3MuZ2V0KG1vZGFsSW5zdGFuY2UpLnZhbHVlO1xuICAgICAgICBpZiAobW9kYWxXaW5kb3cpIHtcbiAgICAgICAgICB2YXIgbW9kYWxEb21FbCA9IG1vZGFsV2luZG93Lm1vZGFsRG9tRWw7XG4gICAgICAgICAgdmFyIHRvcCA9IGNhbGN1bGF0ZU1vZGFsVG9wKG1vZGFsRG9tRWwsIGNzc1RvcCk7XG4gICAgICAgICAgbW9kYWxEb21FbC5jc3MoJ3RvcCcsIHRvcCArIFwicHhcIik7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgICRtb2RhbFN0YWNrLmNsb3NlID0gZnVuY3Rpb24gKG1vZGFsSW5zdGFuY2UsIHJlc3VsdCkge1xuICAgICAgICB2YXIgbW9kYWxXaW5kb3cgPSBvcGVuZWRXaW5kb3dzLmdldChtb2RhbEluc3RhbmNlKS52YWx1ZTtcbiAgICAgICAgaWYgKG1vZGFsV2luZG93KSB7XG4gICAgICAgICAgbW9kYWxXaW5kb3cuZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgIHJlbW92ZU1vZGFsV2luZG93KG1vZGFsSW5zdGFuY2UpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAkbW9kYWxTdGFjay5kaXNtaXNzID0gZnVuY3Rpb24gKG1vZGFsSW5zdGFuY2UsIHJlYXNvbikge1xuICAgICAgICB2YXIgbW9kYWxXaW5kb3cgPSBvcGVuZWRXaW5kb3dzLmdldChtb2RhbEluc3RhbmNlKS52YWx1ZTtcbiAgICAgICAgaWYgKG1vZGFsV2luZG93KSB7XG4gICAgICAgICAgbW9kYWxXaW5kb3cuZGVmZXJyZWQucmVqZWN0KHJlYXNvbik7XG4gICAgICAgICAgcmVtb3ZlTW9kYWxXaW5kb3cobW9kYWxJbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgICRtb2RhbFN0YWNrLmRpc21pc3NBbGwgPSBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIHZhciB0b3BNb2RhbCA9IHRoaXMuZ2V0VG9wKCk7XG4gICAgICAgIHdoaWxlICh0b3BNb2RhbCkge1xuICAgICAgICAgIHRoaXMuZGlzbWlzcyh0b3BNb2RhbC5rZXksIHJlYXNvbik7XG4gICAgICAgICAgdG9wTW9kYWwgPSB0aGlzLmdldFRvcCgpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAkbW9kYWxTdGFjay5nZXRUb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBvcGVuZWRXaW5kb3dzLnRvcCgpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuICRtb2RhbFN0YWNrO1xuICAgIH1dKTtcblxuIiwiLypcbiAqIFRoaXMgbW9kdWxlIG1vZGlmaWVzIGFuZ3VsYXIgZm91bmRhdGlvbidzIG1vZGFsIGltcGxlbWVudGF0aW9uLiBUaGlzIGRvZXMgbm90IGNyZWF0ZSBhIG5ldyBtb2RhbCBzZXJ2aWNlL2RpcmVjdGl2ZS5cbiAqXG4qL1xuYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLW1vZGFsJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1tb2RhbC5tb2RhbFN0YWNrLnNlcnZpY2UnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5zZXJ2aWNlcy5kZXZpY2Uuc2VydmljZScsIFtdKVxuICAgIC5mYWN0b3J5KCdkZXZpY2VTZXJ2aWNlJywgZnVuY3Rpb24gZGV2aWNlU2VydmljZSgkd2luZG93KSB7XG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSB7XG4gICAgICAgICAgICBpc0lPU0RldmljZSxcbiAgICAgICAgICAgIGlzTWFjT1NEZXZpY2UsXG4gICAgICAgICAgICBpc01vYmlsZURldmljZVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGlzSU9TRGV2aWNlKCkge1xuICAgICAgICAgICAgY29uc3QgZGV2aWNlTGlzdCA9IFsnaXBhZCcsICdpcGhvbmUnXTtcbiAgICAgICAgICAgIGNvbnN0IHVhID0gJHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIHJldHVybiBfLnNvbWUoZGV2aWNlTGlzdCwgKGRldmljZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBfLmNvbnRhaW5zKHVhLCBkZXZpY2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc01vYmlsZURldmljZSgpIHtcbiAgICAgICAgICAgIHJldHVybiAvTW9iaS9pLnRlc3QoJHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzTWFjT1NEZXZpY2UoKSB7XG4gICAgICAgICAgICByZXR1cm4gL01hYy9pLnRlc3QoJHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xuICAgIH0pOyIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5zZXJ2aWNlcycsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuc2VydmljZXMuZGV2aWNlLnNlcnZpY2UnXG5dKTtcbiIsIi8qKlxuICogQGRlc2NyaXB0aW9uIFNwcml0ZSBkaXJlY3RpdmUgdXNlZCB0byBsb2FkIGFuIGljb24gZnJvbSBhbiBpbWFnZSBzcHJpdGUsXG4gKiAgICAgICAgICAgICAgc2ltbGlhciB0byB0aGUgaWNvbiBkaXJlY3RpdmUgYnV0IGxlc3MgU1ZHXG4gKiBAZXhhbXBsZVxuICogPHNwcml0ZSBnbHlwaD1cImljLWFtZXhcIj48L3Nwcml0ZT5cbiAqL1xuXG5hbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuc3ByaXRlLmRpcmVjdGl2ZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ3Nwcml0ZScsIGZ1bmN0aW9uIHNwcml0ZURpcmVjdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIGdseXBoOiAnQCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb21waWxlOiBzcHJpdGVEaXJlY3RpdmVDb21waWxlXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gc3ByaXRlRGlyZWN0aXZlQ29tcGlsZSh0RWxlbWVudCkge1xuICAgICAgICAgICAgdEVsZW1lbnQuYWRkQ2xhc3MoJ3Nwcml0ZScpO1xuICAgICAgICAgICAgdEVsZW1lbnQuYXR0cignYXJpYS1oaWRkZW4nLCB0cnVlKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIHNwcml0ZURpcmVjdGl2ZUxpbmsoJHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgIGF0dHJzLiRvYnNlcnZlKCdnbHlwaCcsIChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmF0dHIoJ2NsYXNzJywgJ3Nwcml0ZSBzcHJpdGUtLScgKyBuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuc3ByaXRlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5zcHJpdGUuZGlyZWN0aXZlJ1xuXSk7XG4iLCIvKipcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIEBleGFtcGxlXG4gKlxuICovXG5cbmFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5zdGlja3ktY2xhc3MuZGlyZWN0aXZlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnc3RpY2t5Q2xhc3MnLCBmdW5jdGlvbiBzdGlja3lDbGFzcygkZG9jdW1lbnQsICR0aW1lb3V0LCAkd2luZG93KSB7XG4gICAgICAgICduZ0luamVjdCc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCAkd2luZG93RWxlbSA9IGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KTtcbiAgICAgICAgICAgICAgICBjb25zdCB0aHJvdHRsZWRPblNjcm9sbCA9IF8udGhyb3R0bGUob25TY3JvbGwsIDEwKTtcblxuICAgICAgICAgICAgICAgIGxldCBvZmZzZXRUb3A7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBjbGVhblVwKCkge1xuICAgICAgICAgICAgICAgICAgICAkd2luZG93RWxlbS5vZmYoJ3Njcm9sbCcsIHRocm90dGxlZE9uU2Nyb2xsKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBvblNjcm9sbCgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCR3aW5kb3cucGFnZVlPZmZzZXQgPj0gb2Zmc2V0VG9wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKGF0dHIuc3RpY2t5Q2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcyhhdHRyLnN0aWNreUNsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZG9jdW1lbnRUb3AgPSAkZG9jdW1lbnRbMF0uYm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRUb3AgPSBlbGVtZW50WzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcblxuICAgICAgICAgICAgICAgICAgICBvZmZzZXRUb3AgPSBlbGVtZW50VG9wIC0gZG9jdW1lbnRUb3A7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhyb3R0bGVkT25TY3JvbGwoKTtcblxuICAgICAgICAgICAgICAgICAgICAkd2luZG93RWxlbS5vbignc2Nyb2xsJywgdGhyb3R0bGVkT25TY3JvbGwpO1xuICAgICAgICAgICAgICAgICAgICBzY29wZS4kb24oJyRkZXN0cm95JywgY2xlYW5VcCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLnN0aWNreS1jbGFzcycsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuc3RpY2t5LWNsYXNzLmRpcmVjdGl2ZSdcbl0pO1xuIiwiLyoqXG4gKiBAZGVzY3JpcHRpb24gVXNlZCB0byBjcmVhdGUgYSB0b2dnbGUgc3dpdGNoIGZvciBmb3Jtc1xuICogQGV4YW1wbGVcbiAgICA8c3dpdGNoIG5nLW1vZGVsPVwiY3RybC5zd2l0Y2hNb2RlbDFcIj48L3N3aXRjaD5cblxuICAgIDxzd2l0Y2hcbiAgICAgICAgdG9nZ2xlLW9mZi10ZXh0PVwiT2ZmXCJcbiAgICAgICAgdG9nZ2xlLW9uLXRleHQ9XCJPblwiXG4gICAgICAgIG5nLW1vZGVsPVwiY3RybC5zd2l0Y2hNb2RlbDJcIj5cbiAgICA8L3N3aXRjaD5cblxuICAgIDxzd2l0Y2hcbiAgICAgICAgaGFzLWljb25cbiAgICAgICAgbmctbW9kZWw9XCJjdHJsLnN3aXRjaE1vZGVsM1wiPlxuICAgIDwvc3dpdGNoPlxuXG4gICAgPHN3aXRjaFxuICAgICAgICBpcy1pbXBvcnRhbnRcbiAgICAgICAgbGVmdC1sYWJlbD1cIkRvd24gZm9yIE1haW50ZW5hbmNlXCJcbiAgICAgICAgcmlnaHQtbGFiZWw9XCJPcGVuXCJcbiAgICAgICAgbmctbW9kZWw9XCJjdHJsLnN3aXRjaE1vZGVsNFwiPlxuICAgIDwvc3dpdGNoPlxuICovXG5hbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuc3dpdGNoLmRpcmVjdGl2ZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ3N3aXRjaCcsIGZ1bmN0aW9uIHN3aXRjaERpcmVjdGl2ZSgpIHtcblxuICAgICAgICBmdW5jdGlvbiBnZXRVbmlxdWVJRChpZFByZWZpeCkge1xuICAgICAgICAgICAgcmV0dXJuIF8udW5pcXVlSWQoaWRQcmVmaXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9qcy9iaWdjb21tZXJjZS9zd2l0Y2gvc3dpdGNoLnRwbC5odG1sJyxcbiAgICAgICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgYXJpYURlc2NyaXB0aW9uOiAnQCcsXG4gICAgICAgICAgICAgICAgaXNEaXNhYmxlZDogJz1uZ0Rpc2FibGVkJyxcbiAgICAgICAgICAgICAgICBsYWJlbFRleHQ6ICdAJyxcbiAgICAgICAgICAgICAgICBsZWZ0RGVzY3JpcHRpb246ICdAJyxcbiAgICAgICAgICAgICAgICBuZ0ZhbHNlVmFsdWU6ICdAJyxcbiAgICAgICAgICAgICAgICBuZ1RydWVWYWx1ZTogJ0AnLFxuICAgICAgICAgICAgICAgIHJpZ2h0RGVzY3JpcHRpb246ICdAJyxcbiAgICAgICAgICAgICAgICB0b2dnbGVPZmZMYWJlbDogJ0AnLFxuICAgICAgICAgICAgICAgIHRvZ2dsZU9uTGFiZWw6ICdAJyxcbiAgICAgICAgICAgICAgICB1bmlxdWVJZDogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3N3aXRjaEN0cmwnLFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gc3dpdGNoRGlyZWN0aXZlQ29tcGlsZSh0RWxlbSwgdEF0dHJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNoZWNrYm94RWxlbSA9IHRFbGVtLmZpbmQoJ2lucHV0Jyk7XG5cbiAgICAgICAgICAgICAgICBpZiAodEF0dHJzLm5nRmFsc2VWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjaGVja2JveEVsZW0uYXR0cignbmctZmFsc2UtdmFsdWUnLCB0QXR0cnMubmdGYWxzZVZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodEF0dHJzLm5nVHJ1ZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrYm94RWxlbS5hdHRyKCduZy10cnVlLXZhbHVlJywgdEF0dHJzLm5nVHJ1ZVZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gc3dpdGNoRGlyZWN0aXZlUG9zdExpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5zd2l0Y2hDdHJsLmluaXQobmdNb2RlbEN0cmwpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gc3dpdGNoRGlyZWN0aXZlQ3RybCgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3RybCA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICAvLyBzdGF0ZVxuICAgICAgICAgICAgICAgIGN0cmwuaXNJbXBvcnRhbnQgPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMuaXNJbXBvcnRhbnQpICYmICRhdHRycy5pc0ltcG9ydGFudCAhPT0gJ2ZhbHNlJztcbiAgICAgICAgICAgICAgICBjdHJsLmhhc0ljb24gPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMuaGFzSWNvbikgJiYgJGF0dHJzLmhhc0ljb24gIT09ICdmYWxzZSc7XG5cbiAgICAgICAgICAgICAgICAvLyBsYWJlbHNcbiAgICAgICAgICAgICAgICBjdHJsLmxhYmVsVGV4dCA9ICRhdHRycy50b2dnbGVPZmZMYWJlbDtcblxuICAgICAgICAgICAgICAgIC8vIGlkc1xuICAgICAgICAgICAgICAgIGN0cmwudW5pcXVlSWQgPSBnZXRVbmlxdWVJRCgnc3dpdGNoLScpO1xuICAgICAgICAgICAgICAgIGN0cmwuYXJpYURlc2NyaXB0aW9uSUQgPSBnZXRVbmlxdWVJRCgnc3dpdGNoLWFyaWFEZXNjcmlwdGlvbi0nKTtcblxuICAgICAgICAgICAgICAgIGN0cmwuaW5pdCA9IGluaXQ7XG4gICAgICAgICAgICAgICAgY3RybC51cGRhdGVNb2RlbCA9IHVwZGF0ZU1vZGVsO1xuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdChuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgICAgICAgICBjdHJsLm5nTW9kZWxDdHJsID0gbmdNb2RlbEN0cmw7XG4gICAgICAgICAgICAgICAgICAgIGN0cmwudmFsdWUgPSBjdHJsLm5nTW9kZWxDdHJsLiRtb2RlbFZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ3N3aXRjaEN0cmwubmdNb2RlbEN0cmwuJG1vZGVsVmFsdWUnLCBmdW5jdGlvbiBzd2l0Y2hWYWx1ZUNoYW5nZWQobmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0cmwudmFsdWUgPSBuZXdWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY3RybC5pc0NoZWNrZWQgPSBfLmlzU3RyaW5nKG5ld1ZhbHVlKSA/IFwiJ1wiICsgbmV3VmFsdWUgKyBcIidcIiA9PT0gY3RybC5uZ1RydWVWYWx1ZSA6IG5ld1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3RybC5sYWJlbFRleHQgPSAhIWN0cmwuaXNDaGVja2VkID8gY3RybC50b2dnbGVPbkxhYmVsOiBjdHJsLnRvZ2dsZU9mZkxhYmVsO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGVNb2RlbCgpIHtcbiAgICAgICAgICAgICAgICAgICAgY3RybC5uZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKGN0cmwudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLnN3aXRjaCcsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuc3dpdGNoLmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLnV0aWwnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLnV0aWwudHJ1c3RBc0h0bWwnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUuc2VydmljZScsIFtcbiAgICAndWkucm91dGVyJ1xuXSlcbiAgICAuZmFjdG9yeSgnQmNTZXJ2ZXJUYWJsZScsIGZ1bmN0aW9uIGJjU2VydmVyVGFibGUoJGxvZywgJHEsICRzdGF0ZSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBkZWZhdWx0VGFibGVDb25maWcgPSB7XG4gICAgICAgICAgICBmaWx0ZXJzOiBbXSxcbiAgICAgICAgICAgIHF1ZXJ5S2V5czoge1xuICAgICAgICAgICAgICAgIHBhZ2U6ICdwYWdlJyxcbiAgICAgICAgICAgICAgICBsaW1pdDogJ2xpbWl0JyxcbiAgICAgICAgICAgICAgICBzb3J0Qnk6ICdzb3J0LWJ5JyxcbiAgICAgICAgICAgICAgICBzb3J0RGlyOiAnc29ydC1vcmRlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByb3dJZEtleTogJ2lkJyxcbiAgICAgICAgICAgIHNvcnREaXJWYWx1ZXM6IHtcbiAgICAgICAgICAgICAgICBhc2M6ICdhc2MnLFxuICAgICAgICAgICAgICAgIGRlc2M6ICdkZXNjJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIFNlcnZlclRhYmxlKHRhYmxlSWQsIHRhYmxlQ29uZmlnKSB7XG4gICAgICAgICAgICB0aGlzLmFsbFNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmZpbHRlcnMgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuaWQgPSB0YWJsZUlkO1xuICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIHBhZ2U6IG51bGwsXG4gICAgICAgICAgICAgICAgbGltaXQ6IG51bGwsXG4gICAgICAgICAgICAgICAgdG90YWw6IG51bGxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLnBlbmRpbmdSZXF1ZXN0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnJlc291cmNlQ2FsbGJhY2sgPSBhbmd1bGFyLm5vb3A7XG4gICAgICAgICAgICB0aGlzLnJvd3MgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRSb3dzID0ge307XG4gICAgICAgICAgICB0aGlzLnNvcnRCeSA9ICcnO1xuICAgICAgICAgICAgdGhpcy5zb3J0RGlyID0gJyc7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMudGFibGVDb25maWcgPSBfLmlzT2JqZWN0KHRhYmxlQ29uZmlnKSA/IHRhYmxlQ29uZmlnIDoge307XG4gICAgICAgICAgICB0aGlzLnRhYmxlQ29uZmlnID0gXy5kZWZhdWx0cyh0aGlzLnRhYmxlQ29uZmlnLCBkZWZhdWx0VGFibGVDb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgU2VydmVyVGFibGUucHJvdG90eXBlID0ge1xuICAgICAgICAgICAgY3JlYXRlUGFyYW1zT2JqZWN0OiBjcmVhdGVQYXJhbXNPYmplY3QsXG4gICAgICAgICAgICBkZXNlbGVjdEFsbFJvd3M6IGRlc2VsZWN0QWxsUm93cyxcbiAgICAgICAgICAgIGZldGNoUmVzb3VyY2U6IGZldGNoUmVzb3VyY2UsXG4gICAgICAgICAgICBnZXRTZWxlY3RlZFJvd3M6IGdldFNlbGVjdGVkUm93cyxcbiAgICAgICAgICAgIGluaXQ6IGluaXQsXG4gICAgICAgICAgICBpc1Jvd1NlbGVjdGVkOiBpc1Jvd1NlbGVjdGVkLFxuICAgICAgICAgICAgbG9hZFN0YXRlUGFyYW1zOiBsb2FkU3RhdGVQYXJhbXMsXG4gICAgICAgICAgICBzZWxlY3RBbGxSb3dzOiBzZWxlY3RBbGxSb3dzLFxuICAgICAgICAgICAgc2V0UGFnaW5hdGlvblZhbHVlczogc2V0UGFnaW5hdGlvblZhbHVlcyxcbiAgICAgICAgICAgIHNldFJvd3M6IHNldFJvd3MsXG4gICAgICAgICAgICBzZXRTZWxlY3Rpb25Gb3JBbGxSb3dzOiBzZXRTZWxlY3Rpb25Gb3JBbGxSb3dzLFxuICAgICAgICAgICAgc2V0U29ydGluZ1ZhbHVlczogc2V0U29ydGluZ1ZhbHVlcyxcbiAgICAgICAgICAgIHVwZGF0ZVBhZ2U6IHVwZGF0ZVBhZ2UsXG4gICAgICAgICAgICB1cGRhdGVTb3J0OiB1cGRhdGVTb3J0LFxuICAgICAgICAgICAgdXBkYXRlVGFibGU6IHVwZGF0ZVRhYmxlLFxuICAgICAgICAgICAgdmFsaWRhdGVSZXNvdXJjZTogdmFsaWRhdGVSZXNvdXJjZVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZVBhcmFtc09iamVjdCgpIHtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB7fSxcbiAgICAgICAgICAgICAgICBxdWVyeUtleXMgPSB0aGlzLnRhYmxlQ29uZmlnLnF1ZXJ5S2V5cyxcbiAgICAgICAgICAgICAgICBxdWVyeVBhcmFtTWFwID0gW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5S2V5OiBxdWVyeUtleXMucGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLnBhZ2luYXRpb24ucGFnZVxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeUtleTogcXVlcnlLZXlzLmxpbWl0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMucGFnaW5hdGlvbi5saW1pdFxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeUtleTogcXVlcnlLZXlzLnNvcnRCeSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLnNvcnRCeVxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeUtleTogcXVlcnlLZXlzLnNvcnREaXIsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5zb3J0RGlyXG4gICAgICAgICAgICAgICAgICAgIH1dO1xuXG4gICAgICAgICAgICBfLmVhY2gocXVlcnlQYXJhbU1hcCwgZnVuY3Rpb24gcXVlcnlQYXJhbU1hcEVhY2gocGFyYW0pIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyYW0ucXVlcnlLZXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXNbcGFyYW0ucXVlcnlLZXldID0gcGFyYW0udmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIF8uZXh0ZW5kKHBhcmFtcywgdGhpcy5maWx0ZXJzKTtcblxuICAgICAgICAgICAgcmV0dXJuIHBhcmFtcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRlc2VsZWN0QWxsUm93cygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldFNlbGVjdGlvbkZvckFsbFJvd3MoZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmV0Y2hSZXNvdXJjZSgpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMucGVuZGluZ1JlcXVlc3QgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VDYWxsYmFjayh0aGlzLmNyZWF0ZVBhcmFtc09iamVjdCgpKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIHJlc291cmNlQ2FsbGJhY2tUaGVuKHJlc291cmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfdGhpcy52YWxpZGF0ZVJlc291cmNlKHJlc291cmNlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuc2V0Um93cyhyZXNvdXJjZS5yb3dzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnNldFBhZ2luYXRpb25WYWx1ZXMocmVzb3VyY2UucGFnaW5hdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gcmVzb3VyY2VDYWxsYmFja0NhdGNoKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICRsb2cuZXJyb3IoJ2JjLXNlcnZlci10YWJsZSBkaXJlY3RpdmU6IGZhaWxlZCB0byBmZXRjaCByZXNvdXJjZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZpbmFsbHkoZnVuY3Rpb24gcmVzb3VyY2VDYWxsYmFja0ZpbmFsbHkoKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnBlbmRpbmdSZXF1ZXN0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRTZWxlY3RlZFJvd3MoKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICByZXR1cm4gXy5maWx0ZXIodGhpcy5yb3dzLCBmdW5jdGlvbiBnZXRTZWxlY3RlZFJvd3NGaWx0ZXIocm93KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLmlzUm93U2VsZWN0ZWQocm93KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaW5pdChjb25maWcpIHtcbiAgICAgICAgICAgIGlmICghXy5pc09iamVjdChjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24oY29uZmlnLnJlc291cmNlQ2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUNhbGxiYWNrID0gY29uZmlnLnJlc291cmNlQ2FsbGJhY2s7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgICAgICAgICAgLmxvYWRTdGF0ZVBhcmFtcyhjb25maWcuc3RhdGVQYXJhbXMpXG4gICAgICAgICAgICAgICAgLmZldGNoUmVzb3VyY2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzUm93U2VsZWN0ZWQocm93KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZFJvd3Nbcm93W3RoaXMudGFibGVDb25maWcucm93SWRLZXldXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGxvYWRTdGF0ZVBhcmFtcyhzdGF0ZVBhcmFtcykge1xuICAgICAgICAgICAgdmFyIHF1ZXJ5S2V5cyA9IHRoaXMudGFibGVDb25maWcucXVlcnlLZXlzLFxuICAgICAgICAgICAgICAgIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgc3RhdGVQYXJhbXMgPSBzdGF0ZVBhcmFtcyB8fCAkc3RhdGVQYXJhbXM7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0UGFnaW5hdGlvblZhbHVlcyh7XG4gICAgICAgICAgICAgICAgcGFnZTogc3RhdGVQYXJhbXNbcXVlcnlLZXlzLnBhZ2VdLFxuICAgICAgICAgICAgICAgIGxpbWl0OiBzdGF0ZVBhcmFtc1txdWVyeUtleXMubGltaXRdXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5zZXRTb3J0aW5nVmFsdWVzKHN0YXRlUGFyYW1zW3F1ZXJ5S2V5cy5zb3J0QnldLCBzdGF0ZVBhcmFtc1txdWVyeUtleXMuc29ydERpcl0pO1xuXG4gICAgICAgICAgICAvLyBzZXQgZmlsdGVycyBmcm9tIHF1ZXJ5IHBhcmFtc1xuICAgICAgICAgICAgXy5lYWNoKHRoaXMudGFibGVDb25maWcuZmlsdGVycywgZnVuY3Rpb24gc2V0RmlsdGVyc0VhY2godmFsdWUpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5maWx0ZXJzW3ZhbHVlXSA9IHN0YXRlUGFyYW1zW3ZhbHVlXTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoaXMgaXMgYWN0dWFsbHkgYSB0b2dnbGUgbm90IGp1c3QgYSBzZWxlY3RcbiAgICAgICAgZnVuY3Rpb24gc2VsZWN0QWxsUm93cygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldFNlbGVjdGlvbkZvckFsbFJvd3MoIXRoaXMuYWxsU2VsZWN0ZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0UGFnaW5hdGlvblZhbHVlcyhwYWdpbmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRpb24gPSB0aGlzLnBhZ2luYXRpb24gfHwge307XG4gICAgICAgICAgICBfLmV4dGVuZCh0aGlzLnBhZ2luYXRpb24sIHBhZ2luYXRpb24pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldFJvd3Mocm93cykge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy5yb3dzID0gcm93cztcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRSb3dzID0gXy5yZWR1Y2Uocm93cywgZnVuY3Rpb24gaW5pdGlhbGl6ZVNlbGVjdGVkUm93c09iamVjdChhY2N1bSwgcm93KSB7XG4gICAgICAgICAgICAgICAgYWNjdW1bcm93W190aGlzLnRhYmxlQ29uZmlnLnJvd0lkS2V5XV0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjdW07XG4gICAgICAgICAgICB9LCB7fSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0U2VsZWN0aW9uRm9yQWxsUm93cyh2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgdmFsdWUgPSAhIXZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLmFsbFNlbGVjdGVkID0gdmFsdWU7XG5cbiAgICAgICAgICAgIF8uZWFjaCh0aGlzLnNlbGVjdGVkUm93cywgZnVuY3Rpb24gYWxsUm93c0l0ZXJhdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2VsZWN0ZWRSb3dzW2tleV0gPSBfdGhpcy5hbGxTZWxlY3RlZDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldFNvcnRpbmdWYWx1ZXMoc29ydEJ5LCBzb3J0RGlyKSB7XG4gICAgICAgICAgICB0aGlzLnNvcnRCeSA9IHNvcnRCeSB8fCB0aGlzLnNvcnRCeTtcbiAgICAgICAgICAgIHRoaXMuc29ydERpciA9IHNvcnREaXIgfHwgdGhpcy5zb3J0RGlyO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVBhZ2UocGFnZSwgbGltaXQsIHRvdGFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICAgICAgICAgIC5zZXRQYWdpbmF0aW9uVmFsdWVzKHBhZ2UsIGxpbWl0LCB0b3RhbClcbiAgICAgICAgICAgICAgICAudXBkYXRlVGFibGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVNvcnQoc29ydEJ5LCBzb3J0RGlyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICAgICAgICAgIC5zZXRTb3J0aW5nVmFsdWVzKHNvcnRCeSwgc29ydERpcilcbiAgICAgICAgICAgICAgICAuc2V0UGFnaW5hdGlvblZhbHVlcyh7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2U6IDFcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC51cGRhdGVUYWJsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlVGFibGUoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMucGVuZGluZ1JlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJHN0YXRlLmN1cnJlbnQubmFtZSwgdGhpcy5jcmVhdGVQYXJhbXNPYmplY3QoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdmFsaWRhdGVSZXNvdXJjZShyZXNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKCFfLmlzT2JqZWN0KHJlc291cmNlKSkge1xuICAgICAgICAgICAgICAgICRsb2cuZXJyb3IoJ2JjLXNlcnZlci10YWJsZSBkaXJlY3RpdmU6IFJlc291cmNlIGNhbGxiYWNrIG11c3QgcmV0dXJuIGFuIG9iamVjdCcpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFfLmlzQXJyYXkocmVzb3VyY2Uucm93cykpIHtcbiAgICAgICAgICAgICAgICAkbG9nLmVycm9yKCdiYy1zZXJ2ZXItdGFibGUgZGlyZWN0aXZlOiByZXR1cm5lZCBvYmplY3QgbXVzdCBjb250YWluIGEgcm93cyBwcm9wZXJ0eSB0aGF0IGlzIGFuIGFycmF5LicpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFfLmlzT2JqZWN0KHJlc291cmNlLnBhZ2luYXRpb24pKSB7XG4gICAgICAgICAgICAgICAgJGxvZy5lcnJvcignYmMtc2VydmVyLXRhYmxlIGRpcmVjdGl2ZTogcmV0dXJuZWQgb2JqZWN0IG11c3QgY29udGFpbiBhIHBhZ2luYXRpb24gcHJvcGVydHkgdGhhdCBpcyBhbiBvYmplY3QuJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBTZXJ2ZXJUYWJsZTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUtZmFjdG9yeS5zZXJ2aWNlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUuc2VydmljZSdcbl0pXG4gICAgLmZhY3RvcnkoJ2JjU2VydmVyVGFibGVGYWN0b3J5JywgZnVuY3Rpb24gYmNTZXJ2ZXJUYWJsZUZhY3RvcnkoJGxvZywgQmNTZXJ2ZXJUYWJsZSkge1xuICAgICAgICB2YXIgdGFibGVzID0ge30sXG4gICAgICAgICAgICBzZXJ2aWNlID0ge1xuICAgICAgICAgICAgICAgIGNyZWF0ZTogY3JlYXRlLFxuICAgICAgICAgICAgICAgIGdldDogZ2V0LFxuICAgICAgICAgICAgICAgIHJlbW92ZTogcmVtb3ZlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZSh0YWJsZUlkLCB0YWJsZUNvbmZpZykge1xuICAgICAgICAgICAgaWYgKHRhYmxlSWQgaW4gdGFibGVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2UuZ2V0KHRhYmxlSWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRhYmxlSWQpIHtcbiAgICAgICAgICAgICAgICB0YWJsZUlkID0gXy51bmlxdWVJZCgnYmMtc2VydmVyLXRhYmxlLWluc3RhbmNlLScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YWJsZXNbdGFibGVJZF0gPSBuZXcgQmNTZXJ2ZXJUYWJsZSh0YWJsZUlkLCB0YWJsZUNvbmZpZyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0YWJsZXNbdGFibGVJZF07XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXQodGFibGVJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRhYmxlc1t0YWJsZUlkXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZSh0YWJsZUlkKSB7XG4gICAgICAgICAgICBkZWxldGUgdGFibGVzW3RhYmxlSWRdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XG4gICAgfSk7XG4iLCIvKipcbiAqIEBuYW1lIGNjLWV4cGlyeSBkaXJlY3RpdmVcbiAqIEBkZXNjcmlwdGlvbiBBIGRpcmVjdGl2ZSBmb2xsb3dpbmcgYW5ndWxhci1jcmVkaXQtY2FyZCdzIGFwcHJvYWNoIHRvIHZhbGlkYXRpbmcvZm9ybWF0dGluZyBjcmVkaXQgY2FyZCBleHBpcmF0aW9uIGRhdGUuXG4gKiBFeHBlY3QgdGhlIGNjLWV4cGlyeSBuZ01vZGVsIHRvIGJlIGluIHRoZSBmb3JtYXQgb2YgYHsgbW9udGg6ICcwNScsIHllYXI6ICcyMDE3J31gLlxuICovXG5hbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQuY2MtZXhwaXJ5LmRpcmVjdGl2ZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ2NjRXhwaXJ5JywgZnVuY3Rpb24gY2NFeHBEaXJlY3RpdmUoJGZpbHRlcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gKHRFbGVtLCB0QXR0cikge1xuICAgICAgICAgICAgICAgIGNvbnN0IEVYUElSQVRJT05fTUFYX0xFTkdUSCA9IDc7IC8vIGxlbmd0aCBvZiBgTU0gLyB5eWBcblxuICAgICAgICAgICAgICAgIHRBdHRyLiRzZXQoJ2F1dG9jb21wbGV0ZScsICdjYy1leHAnKTtcbiAgICAgICAgICAgICAgICB0QXR0ci4kc2V0KCdtYXhsZW5ndGgnLCBFWFBJUkFUSU9OX01BWF9MRU5HVEgpO1xuICAgICAgICAgICAgICAgIHRBdHRyLiRzZXQoJ3BhdHRlcm4nLCAnWzAtOV0qJyk7IC8vIGZvciBtb2JpbGUga2V5Ym9hcmQgZGlzcGxheVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGNjRXhwaXJ5TGluayhzY29wZSwgdEVsZW0sIHRBdHRyLCBuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgICAgICAgICBpbml0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRwYXJzZXJzLnVuc2hpZnQocGFyc2VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRmb3JtYXR0ZXJzLnB1c2goZm9ybWF0dGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiR2YWxpZGF0b3JzLnZhbGlkRnV0dXJlRGF0ZSA9IHZhbGlkRnV0dXJlRGF0ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGdldFZpZXdWYWx1ZSwgcmVuZGVyRm9ybWF0dGVkVmlldyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogZ2V0IHRoZSBpbnB1dCdzIHZpZXcgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdldFZpZXdWYWx1ZSgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZ01vZGVsQ3RybC4kdmlld1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIGZvcm1hdHMgdGhlIGlucHV0IHZpZXcgdmFsdWUgdG8gYmUgdGhlIGZvcm1hdCBgTU0gLyB5eWAgYW5kIHJlLXJlbmRlcnMgdmlld1xuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcmVuZGVyRm9ybWF0dGVkVmlldyh2aWV3VmFsdWUsIHByZXZWaWV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdmlld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhIG5ldyB2YWx1ZSBpcyBhZGRlZCAoYXMgb3Bwb3NlZCB0byBwcmVzc2luZyBiYWNrc3BhY2UpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0FkZGl0aW9uID0gdmlld1ZhbHVlLmxlbmd0aCA+IHByZXZWaWV3VmFsdWUubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBuZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKGZvcm1hdCh2aWV3VmFsdWUsIGlzQWRkaXRpb24pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRyZW5kZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBWYWxpZGF0ZXMgd2hldGhlciB0aGUgZW50ZXJlZCBleHBpcmF0aW9uIGRhdGUgaXMgdmFsaWRcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHZhbGlkRnV0dXJlRGF0ZShtb2RlbFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7bW9udGgsIHllYXJ9ID0gbW9kZWxWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWREYXRlKG1vbnRoLCB5ZWFyKSAmJiAhaXNQYXN0KG1vbnRoLCB5ZWFyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBWYWxpZGF0ZXMgd2hldGhlciB0aGUgZ2l2ZW4gbW9udGggYW5kIHllYXIgYXJlIG51bWJlciBzdHJpbmdzIHdpdGggbGVuZ3RoIG9mIDIgYW5kIDQgcmVzcGVjdGl2ZWx5XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBpc1ZhbGlkRGF0ZShtb250aCwgeWVhcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9udGhSZWdleCA9IC9eWzAtOV17Mn0kLztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHllYXJSZWdleCA9IC9eWzAtOV17NH0kLztcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF8uaXNTdHJpbmcobW9udGgpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5pc1N0cmluZyh5ZWFyKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoUmVnZXgudGVzdChtb250aCkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5ZWFyUmVnZXgudGVzdCh5ZWFyKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzVmFsaWRNb250aChtb250aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIG1vbnRoIGlzIHZhbGlkXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBpc1ZhbGlkTW9udGgobW9udGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoID0gXy5wYXJzZUludChtb250aCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtb250aCA+IDAgJiYgbW9udGggPCAxMztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBDaGVja3Mgd2hldGhlciB0aGUgZ2l2ZW4gbW9udGggYW5kIGRhdGUgaXMgaW4gdGhlIHBhc3RcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGlzUGFzdChtb250aCwgeWVhcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldEN1cnJNb250aERhdGUoKSA+IG5ldyBEYXRlKHllYXIsIG1vbnRoIC0gMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogR2V0IHRoZSBkYXRlIG9iamVjdCBiYXNlZCBvbiBjdXJyZW50IG1vbnRoIGFuZCB5ZWFyXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBnZXRDdXJyTW9udGhEYXRlKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRlLmdldEZ1bGxZZWFyKCksIGRhdGUuZ2V0TW9udGgoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogVXNlcyBhbmd1bGFyIGRhdGUgZmlsdGVyIHRvIGZvcm1hdCBkYXRlIG1vZGVsIHRvIGNvcnJlc3BvbmRpbmcgdmlldyBmb3JtYXRcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGZvcm1hdHRlcihleHAgPSB7fSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9udGggPSBleHAubW9udGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB5ZWFyID0gZXhwLnllYXI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfLmlzRW1wdHkobW9udGgpICYmIF8uaXNFbXB0eSh5ZWFyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRmaWx0ZXIoJ2RhdGUnKShuZXcgRGF0ZSh5ZWFyLCBtb250aCAtIDEpLCAnTU0gLyB5eScpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFBhcnNlcyB0aGUgZm9ybWF0dGVkIHZpZXcgdmFsdWVzIHRvIG1vZGVsLiBDb252ZXJ0cyAyIGRpZ2l0IHllYXIgdG8gZnVsbCA0IGRpZ2l0IHllYXJcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIGV4cGlyYXRpb24ge29iamVjdH0gVGhlIGV4cGlyYXRpb24gb2JqZWN0IHttb250aCwgeWVhcn1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHBhcnNlcihleHBpcmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBiYXNlWWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpLnNsaWNlKDAsIDIpOyAvLyBgJzIwJ2BcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IGV4cGlyYXRpb24uc3BsaXQoJy8nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vbnRoID0gdmFsdWVzWzBdID8gdmFsdWVzWzBdLnRyaW0oKSA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeWVhciA9IHZhbHVlc1sxXSA/IGJhc2VZZWFyICsgdmFsdWVzWzFdLnRyaW0oKSA6ICcnO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBtb250aCwgeWVhciB9O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIGZvcm1hdHMgdGhlIHZpZXcgdmFsdWUgdG8gdGhlIGZvcm0gJ01NIC8geXknXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBmb3JtYXQoZXhwU3RyLCBpc0FkZGl0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBleHBTdHIuc3BsaXQoJy8nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vbnRoID0gdmFsdWVzWzBdID8gdmFsdWVzWzBdLnRyaW0oKSA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeWVhciA9IHZhbHVlc1sxXSA/IHZhbHVlc1sxXS50cmltKCkuc2xpY2UoLTIpIDogJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRvbid0IGFkZCBzbGFzaFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCghaXNBZGRpdGlvbiAmJiAheWVhcikgfHwgbW9udGgubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtb250aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkIHNsYXNoIGluIHRoZSByaWdodCBzcG90XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNBZGRpdGlvbiAmJiAheWVhciAmJiBtb250aC5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke21vbnRoLnNsaWNlKDAsIDIpfSAvICR7bW9udGguc2xpY2UoMil9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke21vbnRofSAvICR7eWVhcn1gO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXF1aXJlOiAnbmdNb2RlbCcsXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLmNjLWV4cGlyeScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQuY2MtZXhwaXJ5LmRpcmVjdGl2ZScsXG5dKTtcbiIsIi8qKlxuICogQG5hbWUgYmMtY3ZjIGRpcmVjdGl2ZVxuICogQGRlc2NyaXB0aW9uIEEgY3VzdG9tIGNvbXBsZW1lbnRhcnkgZGlyZWN0aXZlIHRvIGFuZ3VsYXItY3JlZGl0LWNhcmQncyBgY2NDdmNgIGRpcmVjdGl2ZS5cbiAqIFRvIHN1cHBvcnQgYWxsb3dpbmcgYW4gb3B0aW9uYWwgY3ZjIGZpZWxkIChpLmUuIFNlY3VyZW5ldCksIHRoaXMgZGlyZWN0aXZlIG11c3Qgb3ZlcnJpZGVcbiAqIHRoZSB2YWxpZGF0aW9uIHByb3ZpZGVkIGJ5IGNjQ3ZjIGRpcmVjdGl2ZS5cbiAqL1xuYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLmJjLWN2YycsIFtcbiAgICAnY3JlZGl0LWNhcmRzJyxcbl0pXG4gICAgLmRpcmVjdGl2ZSgnYmNDdmMnLCBmdW5jdGlvbiBiY0N2Y0RpcmVjdGl2ZSgkcGFyc2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIGJjQ3ZjTGluayhzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcywgbmdNb2RlbCkge1xuICAgICAgICAgICAgICAgIC8vIG92ZXJyaWRlIHRoZSB2YWxpZGF0aW9uIHRvIGFsd2F5cyByZXR1cm4gdmFsaWRcbiAgICAgICAgICAgICAgICAvLyBpZiBjdmMgaXMgbm90IHJlcXVpcmVkXG4gICAgICAgICAgICAgICAgaWYgKCEkcGFyc2UoYXR0cmlidXRlcy5uZ1JlcXVpcmVkKShzY29wZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbmdNb2RlbC4kdmFsaWRhdG9ycy5jY0N2YyA9ICgpID0+IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByaW9yaXR5OiA1LCAvLyBoaWdoZXIgcHJpb3JpdHkgdG8gZW5zdXJlIGNjQ3ZjJ3MgbGluayBpcyByYW4gZmlyc3RcbiAgICAgICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIH07XG4gICAgfSk7XG4iLCIvKipcbiAqIEBuYW1lIHRydXN0QXNIdG1sXG4gKiBAZGVzY3JpcHRpb24gU2ltcGxlIHV0aWxpdHkgZmlsdGVyIHRvIHJ1biB0aGUgZ2l2ZW4gaHRtbCBzdHJpbmcgdGhyb3VnaCBhbmd1bGFyJ3MgJHNjZS50cnVzdEFzSHRtbCBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dCBUaGUgaHRtbCBzdHJpbmcgdG8gdHJ1c3RcbiAqIEByZXR1cm4ge1N0cmluZ30gQW4gYW5ndWxhci10cnVzdGVkIG9iamVjdCBjb250YWluaW5nIHRoZSBodG1sXG4gKlxuICogQGV4YW1wbGUgYDxwIG5nLWJpbmQtaHRtbD1cInJhd0h0bWwgfCB0cnVzdEFzSHRtbFwiPjwvcD5gXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi51dGlsLnRydXN0QXNIdG1sJywgW10pXG4gICAgLmZpbHRlcigndHJ1c3RBc0h0bWwnLCBmdW5jdGlvbiB0cnVzdEFzSHRtbCgkc2NlKXtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiAkc2NlLnRydXN0QXNIdG1sKHRleHQpO1xuICAgICAgICB9O1xuICAgIH0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9