'use strict';

angular.module('bcapp-pattern-lab', ['gettext', 'ngAnimate', 'ngclipboard', 'ngMessages', 'mm.foundation', 'bcapp-pattern-lab-templates', 'bcapp-pattern-lab.bc-datepicker', 'bcapp-pattern-lab.bc-dropdown', 'bcapp-pattern-lab.bc-modal', 'bcapp-pattern-lab.bc-pagination', 'bcapp-pattern-lab.bc-server-table', 'bcapp-pattern-lab.checkbox-list', 'bcapp-pattern-lab.color-picker', 'bcapp-pattern-lab.copy-clipboard', 'bcapp-pattern-lab.credit-card', 'bcapp-pattern-lab.credit-card-types', 'bcapp-pattern-lab.form', 'bcapp-pattern-lab.form-field', 'bcapp-pattern-lab.form-input-color', 'bcapp-pattern-lab.html5Mode', 'bcapp-pattern-lab.icon', 'bcapp-pattern-lab.loading-notification', 'bcapp-pattern-lab.loading-overlay', 'bcapp-pattern-lab.services', 'bcapp-pattern-lab.sprite', 'bcapp-pattern-lab.switch', 'bcapp-pattern-lab.util']).config(['$tooltipProvider', function ($tooltipProvider) {
    $tooltipProvider.setTriggers({ 'tooltipTriggerOpen': 'tooltipTriggerClose' });
}]);
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

            // Sanitize urls so that an #anchor-hash doesn't break the colorpicker
            var pageUrl = $location.absUrl();
            var pageUrlHash = $location.hash();
            var sanitizeUrl = pageUrlHash ? pageUrl.split('#' + pageUrlHash)[0] : pageUrl;

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

                            elem.attr('fill', 'url(' + sanitizeUrl + newFill + ')');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJpZ2NvbW1lcmNlL2JjYXBwLXBhdHRlcm4tbGFiLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2JjLWRhdGVwaWNrZXIvYmMtZGF0ZXBpY2tlci5jb25zdGFudHMuanMiLCJiaWdjb21tZXJjZS9iYy1kYXRlcGlja2VyL2JjLWRhdGVwaWNrZXIuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvYmMtZGF0ZXBpY2tlci9iYy1kYXRlcGlja2VyLmpzIiwiYmlnY29tbWVyY2UvYmMtZHJvcGRvd24vYmMtZHJvcGRvd24tbWVudS5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9iYy1kcm9wZG93bi9iYy1kcm9wZG93bi10b2dnbGUuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvYmMtZHJvcGRvd24vYmMtZHJvcGRvd24uY29udHJvbGxlci5qcyIsImJpZ2NvbW1lcmNlL2JjLWRyb3Bkb3duL2JjLWRyb3Bkb3duLmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2JjLWRyb3Bkb3duL2JjLWRyb3Bkb3duLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2JjLXBhZ2luYXRpb24vYmMtcGFnaW5hdGlvbi5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9iYy1wYWdpbmF0aW9uL2JjLXBhZ2luYXRpb24ubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvYmMtc2VydmVyLXRhYmxlL2JjLXNlcnZlci10YWJsZS5jb250cm9sbGVyLmpzIiwiYmlnY29tbWVyY2UvYmMtc2VydmVyLXRhYmxlL2JjLXNlcnZlci10YWJsZS5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9iYy1zZXJ2ZXItdGFibGUvYmMtc2VydmVyLXRhYmxlLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2JjLXNlcnZlci10YWJsZS9iYy1zb3J0LWJ5LmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2NoZWNrYm94LWxpc3QvY2hlY2tib3gtbGlzdC5jb250cm9sbGVyLmpzIiwiYmlnY29tbWVyY2UvY2hlY2tib3gtbGlzdC9jaGVja2JveC1saXN0LmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2NoZWNrYm94LWxpc3QvY2hlY2tib3gtbGlzdC5tb2R1bGUuanMiLCJiaWdjb21tZXJjZS9jb2xvci1waWNrZXIvY29sb3ItcGlja2VyLXBhbGV0dGUuY29udHJvbGxlci5qcyIsImJpZ2NvbW1lcmNlL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXItcGFsZXR0ZS5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9jb2xvci1waWNrZXIvY29sb3ItcGlja2VyLmNvbnRyb2xsZXIuanMiLCJiaWdjb21tZXJjZS9jb2xvci1waWNrZXIvY29sb3ItcGlja2VyLmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXIubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvY29weS1jbGlwYm9hcmQvY29weS1jbGlwYm9hcmQuY29uc3RhbnQuanMiLCJiaWdjb21tZXJjZS9jb3B5LWNsaXBib2FyZC9jb3B5LWNsaXBib2FyZC5jb250cm9sbGVyLmpzIiwiYmlnY29tbWVyY2UvY29weS1jbGlwYm9hcmQvY29weS1jbGlwYm9hcmQuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvY29weS1jbGlwYm9hcmQvY29weS1jbGlwYm9hcmQubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQvY3JlZGl0LWNhcmQuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQvY3JlZGl0LWNhcmQubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQtdHlwZXMvY3JlZGl0LWNhcmQtdHlwZXMuY29uc3RhbnQuanMiLCJiaWdjb21tZXJjZS9jcmVkaXQtY2FyZC10eXBlcy9jcmVkaXQtY2FyZC10eXBlcy5jb250cm9sbGVyLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQtdHlwZXMvY3JlZGl0LWNhcmQtdHlwZXMuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQtdHlwZXMvY3JlZGl0LWNhcmQtdHlwZXMubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS9mb3JtLmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2Zvcm0vZm9ybS5tb2R1bGUuanMiLCJiaWdjb21tZXJjZS9mb3JtLWZpZWxkL2Zvcm0tZmllbGQuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS1maWVsZC9mb3JtLWZpZWxkLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2Zvcm0tZmllbGQtZXJyb3IvZm9ybS1maWVsZC1lcnJvci5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9mb3JtLWZpZWxkLWVycm9yL2Zvcm0tZmllbGQtZXJyb3IubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS1maWVsZC1lcnJvcnMvZm9ybS1maWVsZC1lcnJvcnMuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS1maWVsZC1lcnJvcnMvZm9ybS1maWVsZC1lcnJvcnMubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS1pbnB1dC1jb2xvci9mb3JtLWlucHV0LWNvbG9yLmNvbnRyb2xsZXIuanMiLCJiaWdjb21tZXJjZS9mb3JtLWlucHV0LWNvbG9yL2Zvcm0taW5wdXQtY29sb3IuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS1pbnB1dC1jb2xvci9mb3JtLWlucHV0LWNvbG9yLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2h0bWw1TW9kZS9odG1sNU1vZGUubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvaHRtbDVNb2RlL2h0bWw1TW9kZS5zZXJ2aWNlLmpzIiwiYmlnY29tbWVyY2UvaWNvbi9pY29uLmNvbnRyb2xsZXIuanMiLCJiaWdjb21tZXJjZS9pY29uL2ljb24uZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvaWNvbi9pY29uLmpzIiwiYmlnY29tbWVyY2UvaWNvbi9pY29uLnN2Z1Jvb3RQYXRoLmpzIiwiYmlnY29tbWVyY2UvbG9hZGluZy1ub3RpZmljYXRpb24vbG9hZGluZy1ub3RpZmljYXRpb24uZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvbG9hZGluZy1ub3RpZmljYXRpb24vbG9hZGluZy1ub3RpZmljYXRpb24uanMiLCJiaWdjb21tZXJjZS9sb2FkaW5nLW92ZXJsYXkvbG9hZGluZy1vdmVybGF5LmNvbnRyb2xsZXIuanMiLCJiaWdjb21tZXJjZS9sb2FkaW5nLW92ZXJsYXkvbG9hZGluZy1vdmVybGF5LmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2xvYWRpbmctb3ZlcmxheS9sb2FkaW5nLW92ZXJsYXkuanMiLCJiaWdjb21tZXJjZS9tb2RhbC9iYy1tb2RhbC5tb2RhbFN0YWNrLnNlcnZpY2UuanMiLCJiaWdjb21tZXJjZS9tb2RhbC9iYy1tb2RhbC5tb2R1bGUuanMiLCJiaWdjb21tZXJjZS9zZXJ2aWNlcy9kZXZpY2Uuc2VydmljZS5qcyIsImJpZ2NvbW1lcmNlL3NlcnZpY2VzL3NlcnZpY2VzLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL3Nwcml0ZS9zcHJpdGUuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2Uvc3ByaXRlL3Nwcml0ZS5qcyIsImJpZ2NvbW1lcmNlL3N3aXRjaC9zd2l0Y2guZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2Uvc3dpdGNoL3N3aXRjaC5tb2R1bGUuanMiLCJiaWdjb21tZXJjZS91dGlsL3V0aWwubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvYmMtc2VydmVyLXRhYmxlL2JjLXNlcnZlci10YWJsZS9iYy1zZXJ2ZXItdGFibGUuc2VydmljZS5qcyIsImJpZ2NvbW1lcmNlL2JjLXNlcnZlci10YWJsZS9iYy1zZXJ2ZXItdGFibGUtZmFjdG9yeS9iYy1zZXJ2ZXItdGFibGUtZmFjdG9yeS5zZXJ2aWNlLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQvY2MtZXhwaXJ5L2NjLWV4cGlyeS5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9jcmVkaXQtY2FyZC9jYy1leHBpcnkvY2MtZXhwaXJ5Lm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2NyZWRpdC1jYXJkL2NyZWRpdC1jYXJkLWN2di9iYy1jdmMuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvdXRpbC90cnVzdEFzSHRtbC90cnVzdEFzSHRtbC5maWx0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLENBQ2hDLFNBQVMsRUFDVCxXQUFXLEVBQ1gsYUFBYSxFQUNiLFlBQVksRUFDWixlQUFlLEVBQ2YsNkJBQTZCLEVBQzdCLGlDQUFpQyxFQUNqQywrQkFBK0IsRUFDL0IsNEJBQTRCLEVBQzVCLGlDQUFpQyxFQUNqQyxtQ0FBbUMsRUFDbkMsaUNBQWlDLEVBQ2pDLGdDQUFnQyxFQUNoQyxrQ0FBa0MsRUFDbEMsK0JBQStCLEVBQy9CLHFDQUFxQyxFQUNyQyx3QkFBd0IsRUFDeEIsOEJBQThCLEVBQzlCLG9DQUFvQyxFQUNwQyw2QkFBNkIsRUFDN0Isd0JBQXdCLEVBQ3hCLHdDQUF3QyxFQUN4QyxtQ0FBbUMsRUFDbkMsNEJBQTRCLEVBQzVCLDBCQUEwQixFQUMxQiwwQkFBMEIsRUFDMUIsd0JBQXdCLENBQzNCLENBQUMsQ0FDRCxNQUFNLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxVQUFTLGdCQUFnQixFQUFFO0FBQ3BELG9CQUFnQixDQUFDLFdBQVcsQ0FBQyxFQUFDLG9CQUFvQixFQUFFLHFCQUFxQixFQUFDLENBQUMsQ0FBQztDQUMvRSxDQUFDLENBQUMsQ0FBQzs7OztBQzlCSixPQUFPLENBQUMsTUFBTSxDQUFDLDJDQUEyQyxFQUFFLEVBQUUsQ0FBQyxDQUMxRCxRQUFRLENBQUMsd0JBQXdCLEVBQUU7QUFDaEMsYUFBUyxFQUFFLEdBQUc7QUFDZCxlQUFXLEVBQUUsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUM7QUFDcEQsVUFBTSxFQUFFO0FBQ0osWUFBSSxFQUFFLGlCQUFpQjtBQUN2QixpQkFBUyxFQUFFLFlBQVk7QUFDdkIsWUFBSSxFQUFFLGlCQUFpQjtBQUN2Qixl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eUNBQXlDLEVBQUUsQ0FDdEQsbURBQW1ELENBQ3RELENBQUMsQ0FBQzs7Ozs7Ozs7O0FDSUgsT0FBTyxDQUFDLE1BQU0sQ0FBQyxzQ0FBc0MsRUFBRSxDQUNuRCxjQUFjLENBQ2pCLENBQUMsQ0FDRyxTQUFTLENBQUMsT0FBTyxFQUFFLFNBQVMsY0FBYyxDQUFDLE1BQU0sRUFBRTtBQUNoRCxXQUFPO0FBQ0gsWUFBSSxFQUFFLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRTs7O0FBRzFELGdCQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUN2Qyx1QkFBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUc7MkJBQU0sSUFBSTtpQkFBQSxDQUFDO2FBQzFDO1NBQ0o7QUFDRCxnQkFBUSxFQUFFLENBQUM7QUFDWCxlQUFPLEVBQUUsU0FBUztBQUNsQixnQkFBUSxFQUFFLEdBQUc7S0FDaEIsQ0FBQztDQUNMLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7O0FDYlAsT0FBTyxDQUFDLE1BQU0sQ0FBQyxvQ0FBb0MsRUFBRSxFQUFFLENBQUMsQ0FDbkQsTUFBTSxDQUFDLGFBQWEsRUFBRSxTQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUM7QUFDN0MsV0FBTyxVQUFTLElBQUksRUFBRTtBQUNsQixlQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDakMsQ0FBQztDQUNMLENBQUMsQ0FBQyIsImZpbGUiOiJiY2FwcC1wYXR0ZXJuLWxhYi1jb21wb25lbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiJywgW1xuICAgICdnZXR0ZXh0JyxcbiAgICAnbmdBbmltYXRlJyxcbiAgICAnbmdjbGlwYm9hcmQnLFxuICAgICduZ01lc3NhZ2VzJyxcbiAgICAnbW0uZm91bmRhdGlvbicsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLXRlbXBsYXRlcycsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRhdGVwaWNrZXInLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1kcm9wZG93bicsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLW1vZGFsJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtcGFnaW5hdGlvbicsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXNlcnZlci10YWJsZScsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNoZWNrYm94LWxpc3QnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jb2xvci1waWNrZXInLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jb3B5LWNsaXBib2FyZCcsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQtdHlwZXMnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1maWVsZCcsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0taW5wdXQtY29sb3InLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5odG1sNU1vZGUnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5pY29uJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIubG9hZGluZy1ub3RpZmljYXRpb24nLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5sb2FkaW5nLW92ZXJsYXknLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5zZXJ2aWNlcycsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLnNwcml0ZScsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLnN3aXRjaCcsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLnV0aWwnXG5dKVxuLmNvbmZpZyhbJyR0b29sdGlwUHJvdmlkZXInLCBmdW5jdGlvbigkdG9vbHRpcFByb3ZpZGVyKSB7XG4gICAgJHRvb2x0aXBQcm92aWRlci5zZXRUcmlnZ2Vycyh7J3Rvb2x0aXBUcmlnZ2VyT3Blbic6ICd0b29sdGlwVHJpZ2dlckNsb3NlJ30pO1xufV0pO1xuIiwiLyogZ2xvYmFscyBtb21lbnQgKi9cbmFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1kYXRlcGlja2VyLmNvbnN0YW50cycsIFtdKVxuICAgIC5jb25zdGFudCgnQkNfREFURVBJQ0tFUl9ERUZBVUxUUycsIHtcbiAgICAgICAgZGF5Rm9ybWF0OiAnRCcsXG4gICAgICAgIGlucHV0Rm9ybWF0OiBtb21lbnQubG9jYWxlRGF0YSgpLmxvbmdEYXRlRm9ybWF0KCdMJyksXG4gICAgICAgIHN0eWxlczoge1xuICAgICAgICAgICAgYmFjazogJ2RhdGVwaWNrZXItYmFjaycsXG4gICAgICAgICAgICBjb250YWluZXI6ICdkYXRlcGlja2VyJyxcbiAgICAgICAgICAgIGRhdGU6ICdkYXRlcGlja2VyLWRhdGUnLFxuICAgICAgICAgICAgZGF5Qm9keTogJ2RhdGVwaWNrZXItZGF5cy1ib2R5JyxcbiAgICAgICAgICAgIGRheUJvZHlFbGVtOiAnZGF0ZXBpY2tlci1kYXknLFxuICAgICAgICAgICAgZGF5Q29uY2VhbGVkOiAnZGF0ZXBpY2tlci1kYXktY29uY2VhbGVkJyxcbiAgICAgICAgICAgIGRheURpc2FibGVkOiAnaXMtZGlzYWJsZWQnLFxuICAgICAgICAgICAgZGF5SGVhZDogJ2RhdGVwaWNrZXItZGF5cy1oZWFkJyxcbiAgICAgICAgICAgIGRheUhlYWRFbGVtOiAnZGF0ZXBpY2tlci1kYXktbmFtZScsXG4gICAgICAgICAgICBkYXlQcmV2TW9udGg6ICdkYXRlcGlja2VyLWRheS1wcmV2LW1vbnRoJyxcbiAgICAgICAgICAgIGRheU5leHRNb250aDogJ2RhdGVwaWNrZXItZGF5LW5leHQtbW9udGgnLFxuICAgICAgICAgICAgZGF5Um93OiAnZGF0ZXBpY2tlci1kYXlzLXJvdycsXG4gICAgICAgICAgICBkYXlUYWJsZTogJ2RhdGVwaWNrZXItZGF5cycsXG4gICAgICAgICAgICBtb250aDogJ2RhdGVwaWNrZXItbW9udGgnLFxuICAgICAgICAgICAgbW9udGhMYWJlbDogJ2RhdGVwaWNrZXItbW9udGgnLFxuICAgICAgICAgICAgbmV4dDogJ2RhdGVwaWNrZXItbmV4dCcsXG4gICAgICAgICAgICBwb3NpdGlvbmVkOiAnZGF0ZXBpY2tlci1hdHRhY2htZW50JyxcbiAgICAgICAgICAgIHNlbGVjdGVkRGF5OiAnaXMtc2VsZWN0ZWQnLFxuICAgICAgICAgICAgc2VsZWN0ZWRUaW1lOiAnZGF0ZXBpY2tlci10aW1lLXNlbGVjdGVkJyxcbiAgICAgICAgICAgIHRpbWU6ICdkYXRlcGlja2VyLXRpbWUnLFxuICAgICAgICAgICAgdGltZUxpc3Q6ICdkYXRlcGlja2VyLXRpbWUtbGlzdCcsXG4gICAgICAgICAgICB0aW1lT3B0aW9uOiAnZGF0ZXBpY2tlci10aW1lLW9wdGlvbidcbiAgICAgICAgfSxcbiAgICAgICAgdGltZTogZmFsc2UsXG4gICAgICAgIHdlZWtkYXlGb3JtYXQ6ICdzaG9ydCdcbiAgICB9KTtcbiIsIi8qIGdsb2JhbHMgcm9tZSAqL1xuYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRhdGVwaWNrZXIuZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1kYXRlcGlja2VyLmNvbnN0YW50cydcbl0pXG4gICAgLmRpcmVjdGl2ZSgnYmNEYXRlcGlja2VyJywgZnVuY3Rpb24gYmNEYXRlcGlja2VyRGlyZWN0aXZlKEJDX0RBVEVQSUNLRVJfREVGQVVMVFMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICByZXF1aXJlOiAnbmdNb2RlbCcsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIG9wdGlvbnM6ICc9PydcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIGRhdGVwaWNrZXJMaW5rRnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLm9wdGlvbnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5vcHRpb25zID0ge307XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gQWRkIGRlZmF1bHRzIHRvIHRoZSBvcHRpb25zIG9iamVjdFxuICAgICAgICAgICAgICAgIF8uZGVmYXVsdHMoc2NvcGUub3B0aW9ucywgQkNfREFURVBJQ0tFUl9ERUZBVUxUUyk7XG5cbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYSBuZXcgcm9tZSAoY2FsZW5kYXIpIGluc3RhbmNlXG4gICAgICAgICAgICAgICAgc2NvcGUuY2FsZW5kYXIgPSByb21lKGVsZW1lbnRbMF0sIHNjb3BlLm9wdGlvbnMpO1xuXG4gICAgICAgICAgICAgICAgLy8gT24gJ2RhdGEnIGV2ZW50IHNldCBuZ01vZGVsIHRvIHRoZSBwYXNzZWQgdmFsdWVcbiAgICAgICAgICAgICAgICBzY29wZS5jYWxlbmRhci5vbignZGF0YScsIGZ1bmN0aW9uIG9uRGF0YSh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBuZ01vZGVsLiRzZXRWaWV3VmFsdWUodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHNjb3BlLmNhbGVuZGFyLm9uKCdyZWFkeScsIGZ1bmN0aW9uIG9uUmVhZHkob3B0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cnMucGxhY2Vob2xkZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMuJHNldCgncGxhY2Vob2xkZXInLCBvcHRpb25zLmlucHV0Rm9ybWF0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZpbmcgY2FsZW5kYXIgZXZlbnQgbGlzdGVuZXJzXG4gICAgICAgICAgICAgICAgZWxlbWVudC5vbignJGRlc3Ryb3knLCBmdW5jdGlvbiBvbkRlc3Ryb3koKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmNhbGVuZGFyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1kYXRlcGlja2VyJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1kYXRlcGlja2VyLmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRyb3Bkb3duLW1lbnUuZGlyZWN0aXZlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnYmNEcm9wZG93bk1lbnUnLCAoKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgcmVxdWlyZTogJ15iY0Ryb3Bkb3duJyxcbiAgICAgICAgICAgIGNvbXBpbGU6ICh0RWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRFbGVtZW50LmFkZENsYXNzKCdkcm9wZG93bi1tZW51Jyk7XG4gICAgICAgICAgICAgICAgdEVsZW1lbnQuYXR0cigncm9sZScsICdsaXN0Ym94Jyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgYmNEcm9wZG93bkN0cmwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyKCdpZCcsIGJjRHJvcGRvd25DdHJsLmdldFVuaXF1ZUlkKCkpO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBiY0Ryb3Bkb3duQ3RybC5nZXRJc09wZW4oKSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGxpc3RlbiBmb3IgZHJvcGRvd25zIGJlaW5nIG9wZW5lZCBhbmQgdG9nZ2xlIGFyaWEtZXhwYW5kZWQgdG8gcmVmbGVjdCBjdXJyZW50IHN0YXRlXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLiRvbigndG9nZ2xlVGhpc0Ryb3Bkb3duJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgYmNEcm9wZG93bkN0cmwuZ2V0SXNPcGVuKCkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRyb3Bkb3duLXRvZ2dsZS5kaXJlY3RpdmUnLCBbXSlcbiAgICAuZGlyZWN0aXZlKCdiY0Ryb3Bkb3duVG9nZ2xlJywgKCRjb21waWxlKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgdGVybWluYWw6IHRydWUsXG4gICAgICAgICAgICBwcmlvcml0eTogMTAwMSwgLy8gc2V0IGhpZ2hlciB0aGFuIG5nLXJlcGVhdCB0byBwcmV2ZW50IGRvdWJsZSBjb21waWxhdGlvblxuICAgICAgICAgICAgcmVxdWlyZTogJ15iY0Ryb3Bkb3duJyxcbiAgICAgICAgICAgIGNvbXBpbGU6ICh0RWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRFbGVtZW50LnJlbW92ZUF0dHIoJ2JjLWRyb3Bkb3duLXRvZ2dsZScpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGJjRHJvcGRvd25DdHJsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cignZHJvcGRvd24tdG9nZ2xlJywgJyMnICsgYmNEcm9wZG93bkN0cmwuZ2V0VW5pcXVlSWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cignYXJpYS1jb250cm9scycsIGJjRHJvcGRvd25DdHJsLmdldFVuaXF1ZUlkKCkpO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50Lm9uKCdjbGljaycsIGJjRHJvcGRvd25DdHJsLnRvZ2dsZUlzT3Blbik7XG4gICAgICAgICAgICAgICAgICAgICRjb21waWxlKGVsZW1lbnQpKHNjb3BlKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRyb3Bkb3duLmNvbnRyb2xsZXInLCBbXSlcbiAgICAuY29udHJvbGxlcignQmNEcm9wZG93bkNvbnRyb2xsZXInLCBmdW5jdGlvbiBiY0Ryb3Bkb3duQ29udHJvbGxlcigkc2NvcGUsICRyb290U2NvcGUpIHtcbiAgICAgICAgY29uc3QgY3RybCA9IHRoaXM7XG4gICAgICAgIGxldCBpc09wZW4gPSBmYWxzZTtcbiAgICAgICAgbGV0IHVuaXF1ZUlkO1xuXG4gICAgICAgIGN0cmwuY2xvc2VEcm9wZG93biA9IGNsb3NlRHJvcGRvd247XG4gICAgICAgIGN0cmwuZ2V0SXNPcGVuID0gZ2V0SXNPcGVuO1xuICAgICAgICBjdHJsLmdldFVuaXF1ZUlkID0gZ2V0VW5pcXVlSWQ7XG4gICAgICAgIGN0cmwuc2V0SXNPcGVuID0gc2V0SXNPcGVuO1xuICAgICAgICBjdHJsLnRvZ2dsZUlzT3BlbiA9IHRvZ2dsZUlzT3BlbjtcblxuICAgICAgICAvLyBsaXN0ZW4gZm9yIG90aGVyIGRyb3Bkb3ducyBiZWluZyBvcGVuZWQgaW4gdGhlIGFwcC5cbiAgICAgICAgJHNjb3BlLiRvbignYmNEcm9wZG93blRvZ2dsZScsIChldmVudCwgdHJpZ2dlcmluZ0lEKSA9PiB7XG4gICAgICAgICAgICAvLyBpZiBJJ20gb3BlbiBhbmQgbm90IHRoZSBkcm9wZG93biBiZWluZyB0cmlnZ2VyZWQsIHRoZW4gSSBzaG91bGQgY2xvc2VcbiAgICAgICAgICAgIGlmIChpc09wZW4gJiYgdHJpZ2dlcmluZ0lEICE9PSB1bmlxdWVJZCkge1xuICAgICAgICAgICAgICAgIGN0cmwuY2xvc2VEcm9wZG93bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBjbG9zZURyb3Bkb3duKCkge1xuICAgICAgICAgICAgY3RybC5zZXRJc09wZW4oZmFsc2UpO1xuICAgICAgICAgICAgJHNjb3BlLiRicm9hZGNhc3QoJ3RvZ2dsZVRoaXNEcm9wZG93bicpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0SXNPcGVuKCkge1xuICAgICAgICAgICAgcmV0dXJuIGlzT3BlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFVuaXF1ZUlkKCkge1xuICAgICAgICAgICAgaWYgKCF1bmlxdWVJZCkge1xuICAgICAgICAgICAgICAgIHVuaXF1ZUlkID0gXy51bmlxdWVJZCgnYmMtZHJvcGRvd24tJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdW5pcXVlSWQ7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRJc09wZW4odmFsKSB7XG4gICAgICAgICAgICBpc09wZW4gPSB2YWw7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVJc09wZW4oKSB7XG4gICAgICAgICAgICBpc09wZW4gPSAhaXNPcGVuO1xuICAgICAgICAgICAgLy8gdGVsbCBjaGlsZCBkaXJlY3RpdmVzIGEgdG9nZ2xlIGluIG9wZW4gc3RhdHVzIGhhcyBvY2N1cnJlZFxuICAgICAgICAgICAgJHNjb3BlLiRicm9hZGNhc3QoJ3RvZ2dsZVRoaXNEcm9wZG93bicpO1xuICAgICAgICAgICAgLy8gdGVsbCBhcHBsaWNhdGlvbiB0aGF0IGEgZHJvcGRvd24gaGFzIGJlZW4gb3BlbmVkIHNvIG90aGVycyBjYW4gY2xvc2VcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnYmNEcm9wZG93blRvZ2dsZScsIHVuaXF1ZUlkKTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRyb3Bkb3duLmRpcmVjdGl2ZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtZHJvcGRvd24uY29udHJvbGxlcidcbl0pXG4gICAgLmRpcmVjdGl2ZSgnYmNEcm9wZG93bicsICgkZG9jdW1lbnQpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQmNEcm9wZG93bkNvbnRyb2xsZXInLFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYmNEcm9wZG93bkNvbnRyb2xsZXInLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICAgICAgICBjb21waWxlOiAodEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICB0RWxlbWVudC5hdHRyKCdyb2xlJywgJ2NvbWJvYm94Jyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gKCRzY29wZSwgJGVsZW1lbnQsIGF0dHJzLCBjdHJsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgZGlyZWN0aXZlIGlzIGEgY29tcG9zaXRlIG9mIDIgc2VwYXJhdGUgRm91bmRhdGlvbiBkaXJlY3RpdmVzXG4gICAgICAgICAgICAgICAgICAgIC8vIHdoaWNoIGRvbid0IHByb3ZpZGUgaG9va3MgdG8ga25vdyB3aGVuIGl0J3MgY2xpY2tlZCBvciBvcGVuZWRcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhleSBkbyBob3dldmVyIGRlYWwgd2l0aCBwcm9wYWdhdGlvbiBvZiBldmVudHMgc28gdGhpcywgc29tZXdoYXQgYmxpbmRcbiAgICAgICAgICAgICAgICAgICAgLy8gZG9jdW1lbnQgZXZlbnQgaXMgc2FmZS4gQWxsIGl0IGRvZXMgaXMgc3dhcCBhcmlhIHN0YXRlcyBhdCB0aGUgbW9tZW50XG4gICAgICAgICAgICAgICAgICAgIC8vIGluIGEgY2hlYXAgd2F5IHRvIGtlZXAgdGhpcyBkaXJlY3RpdmUgaW4gc3luYyB3aXRoIGl0J3MgY2hpbGQgZGlyZWN0aXZlXG4gICAgICAgICAgICAgICAgICAgICRkb2N1bWVudC5vbignY2xpY2snLCBjdHJsLmNsb3NlRHJvcGRvd24pO1xuXG4gICAgICAgICAgICAgICAgICAgICRlbGVtZW50Lm9uKCckZGVzdHJveScsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRkb2N1bWVudC5vZmYoJ2NsaWNrJywgY3RybC5jbG9zZURyb3Bkb3duKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1kcm9wZG93bicsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtZHJvcGRvd24uZGlyZWN0aXZlJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtZHJvcGRvd24tdG9nZ2xlLmRpcmVjdGl2ZScsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRyb3Bkb3duLW1lbnUuZGlyZWN0aXZlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtcGFnaW5hdGlvbi5kaXJlY3RpdmUnLCBbXSlcbiAgICAuZGlyZWN0aXZlKCdiY1BhZ2luYXRpb24nLCBmdW5jdGlvbiBiY1BhZ2luYXRpb25EaXJlY3RpdmUoJHBhcnNlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgc2NvcGU6IHRydWUsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9qcy9iaWdjb21tZXJjZS9iYy1wYWdpbmF0aW9uL2JjLXBhZ2luYXRpb24udHBsLmh0bWwnLFxuXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiBiY1BhZ2luYXRpb25Db21waWxlKHRFbGVtZW50LCB0QXR0cnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0ck9iaiA9IHt9O1xuXG4gICAgICAgICAgICAgICAgLy8gU2luY2UgdGhpcyBpcyBhIHdyYXBwZXIgb2YgYW5ndWxhci1mb3VuZGF0aW9uJ3MgcGFnaW5hdGlvbiBkaXJlY3RpdmUgd2UgbmVlZCB0byBjb3B5IGFsbFxuICAgICAgICAgICAgICAgIC8vIG9mIHRoZSBhdHRyaWJ1dGVzIHBhc3NlZCB0byBvdXIgZGlyZWN0aXZlIGFuZCBzdG9yZSB0aGVtIGluIHRoZSBhdHRyT2JqLlxuICAgICAgICAgICAgICAgIF8uZWFjaCh0QXR0cnMuJGF0dHIsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ICE9PSAnY2xhc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyT2JqW2tleV0gPSB0RWxlbWVudC5hdHRyKGtleSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIEFkZGluZyBvdXIgY3VzdG9tIGNhbGxiYWNrIHRvIHRoZSBhdHRyT2JqLCBhbmd1bGFyLWZvdW5kYXRpb24gd2lsbCBjYWxsIHRoaXMgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAvLyB3aGVuIGEgcGFnZSBudW1iZXIgaXMgY2xpY2tlZCBpbiB0aGUgcGFnaW5hdGlvbi5cbiAgICAgICAgICAgICAgICBhdHRyT2JqWydvbi1zZWxlY3QtcGFnZSddID0gJ3BhZ2luYXRpb25DYWxsYmFjayhwYWdlKSc7XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgYWxsIHRoZSBhdHRyaWJ1dGVzIHRvIGFuZ3VsYXItZm91bmRhdGlvbidzIHBhZ2luYXRpb24gZGlyZWN0aXZlXG4gICAgICAgICAgICAgICAgdEVsZW1lbnQuZmluZCgncGFnaW5hdGlvbicpLmF0dHIoYXR0ck9iaik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gYmNQYWdpbmF0aW9uTGluaygkc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvbkNoYW5nZVBhcnNlR2V0dGVyID0gJHBhcnNlKGF0dHJzLm9uQ2hhbmdlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRMaW1pdHMgPSBbMTAsIDIwLCAzMCwgNTAsIDEwMF07XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNldExpbWl0ID0gZnVuY3Rpb24obGltaXQsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGltaXQgPSBfLnBhcnNlSW50KGxpbWl0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRwYXJzZShhdHRycy5pdGVtc1BlclBhZ2UpLmFzc2lnbigkc2NvcGUuJHBhcmVudCwgbGltaXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnBhZ2luYXRpb25DYWxsYmFjaygxLCBsaW1pdCk7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmdldEN1cnJlbnRQYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHBhcnNlKGF0dHJzLnBhZ2UpKCRzY29wZS4kcGFyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZ2V0Q3VycmVudExpbWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHBhcnNlKGF0dHJzLml0ZW1zUGVyUGFnZSkoJHNjb3BlLiRwYXJlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5nZXRJdGVtc1BlclBhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcGFyc2UoYXR0cnMuaXRlbXNQZXJQYWdlKSgkc2NvcGUuJHBhcmVudCkgfHwgMDtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZ2V0VG90YWxJdGVtcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRwYXJzZShhdHRycy50b3RhbEl0ZW1zKSgkc2NvcGUuJHBhcmVudCkgfHwgMDtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc2hvdyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRwYXJzZShhdHRycy5hbHdheXNTaG93KSgkc2NvcGUuJHBhcmVudCkgfHwgJHNjb3BlLmdldFRvdGFsSXRlbXMoKSA+ICRzY29wZS5nZXRJdGVtc1BlclBhZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc2hvd0xpbWl0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRzY29wZS5zaG93KCkgJiYgJHBhcnNlKGF0dHJzLnNob3dMaW1pdHMpKCRzY29wZS4kcGFyZW50KSAhPT0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmdldExpbWl0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpbWl0cyA9ICRwYXJzZShhdHRycy5saW1pdHMpKCRzY29wZS4kcGFyZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGxpbWl0cykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVmYXVsdExpbWl0cztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpbWl0cztcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucGFnaW5hdGlvbkNhbGxiYWNrID0gZnVuY3Rpb24ocGFnZSwgbGltaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhZGRpdGlvbmFsU2NvcGVQcm9wZXJ0aWVzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW1pdDogbGltaXQgfHwgJHNjb3BlLmdldEN1cnJlbnRMaW1pdCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiBwYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZVBhcnNlUmVzdWx0O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkcGFyc2UoYXR0cnMucGFnZSkuYXNzaWduKCRzY29wZS4kcGFyZW50LCBwYWdlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2VQYXJzZVJlc3VsdCA9IG9uQ2hhbmdlUGFyc2VHZXR0ZXIoJHNjb3BlLCBhZGRpdGlvbmFsU2NvcGVQcm9wZXJ0aWVzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIG9uQ2hhbmdlIHN0cmluZyBpcyBhIGZ1bmN0aW9uIGFuZCBub3QgYW4gZXhwcmVzc2lvbjogY2FsbCBpdCB3aXRoIHRoZSBhZGRpdGlvbmFsU2NvcGVQcm9wZXJ0aWVzIG9iaiAoZm9yIGJhY2t3YXJkcyBjb21wYXRhYmlsaXR5KVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZWxzZSB0aGUgZXhwcmVzc2lvbiBoYXMgYWxyZWFkeSBiZWVuIHJhbjogZG8gbm90aGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvbkNoYW5nZVBhcnNlUmVzdWx0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2VQYXJzZVJlc3VsdChhZGRpdGlvbmFsU2NvcGVQcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXBhZ2luYXRpb24nLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXBhZ2luYXRpb24uZGlyZWN0aXZlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtc2VydmVyLXRhYmxlLmNvbnRyb2xsZXInLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXNlcnZlci10YWJsZS5zZXJ2aWNlJ1xuXSlcblxuICAgIC5jb250cm9sbGVyKCdCY1NlcnZlclRhYmxlQ3RybCcsIGZ1bmN0aW9uIEJjU2VydmVyVGFibGVDdHJsKCRhdHRycywgJGxvZywgJHBhcnNlLCAkc2NvcGUsIEJjU2VydmVyVGFibGUpIHtcbiAgICAgICAgdmFyIGN0cmwgPSB0aGlzLFxuICAgICAgICAgICAgYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZSA9IEJjU2VydmVyVGFibGUucHJvdG90eXBlO1xuXG4gICAgICAgIC8vIENhbGwgdGhlIEJjU2VydmVyVGFibGUgY29uc3RydWN0b3Igb24gdGhlIGNvbnRyb2xsZXJcbiAgICAgICAgLy8gaW4gb3JkZXIgdG8gc2V0IGFsbCB0aGUgY29udHJvbGxlciBwcm9wZXJ0aWVzIGRpcmVjdGx5LlxuICAgICAgICAvLyBUaGlzIGlzIGhlcmUgZm9yIGJhY2t3YXJkcyBjb21wYXRhYmlsaXR5IHB1cnBvc2VzLlxuICAgICAgICBCY1NlcnZlclRhYmxlLmNhbGwoY3RybCwgbnVsbCwgKCRwYXJzZSgkYXR0cnMudGFibGVDb25maWcpKCRzY29wZSkpKTtcblxuICAgICAgICAvLyBjb250cm9sbGVyIGZ1bmN0aW9uc1xuICAgICAgICBjdHJsLmNyZWF0ZVBhcmFtc09iamVjdCA9IGJjU2VydmVyVGFibGVQcm90b3R5cGUuY3JlYXRlUGFyYW1zT2JqZWN0O1xuICAgICAgICBjdHJsLmRlc2VsZWN0QWxsUm93cyA9IGJjU2VydmVyVGFibGVQcm90b3R5cGUuZGVzZWxlY3RBbGxSb3dzO1xuICAgICAgICBjdHJsLmZldGNoUmVzb3VyY2UgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLmZldGNoUmVzb3VyY2U7XG4gICAgICAgIGN0cmwuZ2V0U2VsZWN0ZWRSb3dzID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS5nZXRTZWxlY3RlZFJvd3M7XG4gICAgICAgIGN0cmwuaW5pdCA9IGJjU2VydmVyVGFibGVQcm90b3R5cGUuaW5pdDtcbiAgICAgICAgY3RybC5pc1Jvd1NlbGVjdGVkID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS5pc1Jvd1NlbGVjdGVkO1xuICAgICAgICBjdHJsLmxvYWRTdGF0ZVBhcmFtcyA9IGJjU2VydmVyVGFibGVQcm90b3R5cGUubG9hZFN0YXRlUGFyYW1zO1xuICAgICAgICBjdHJsLnNlbGVjdEFsbFJvd3MgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLnNlbGVjdEFsbFJvd3M7XG4gICAgICAgIGN0cmwuc2V0UGFnaW5hdGlvblZhbHVlcyA9IGJjU2VydmVyVGFibGVQcm90b3R5cGUuc2V0UGFnaW5hdGlvblZhbHVlcztcbiAgICAgICAgY3RybC5zZXRSb3dzID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS5zZXRSb3dzO1xuICAgICAgICBjdHJsLnNldFNlbGVjdGlvbkZvckFsbFJvd3MgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLnNldFNlbGVjdGlvbkZvckFsbFJvd3M7XG4gICAgICAgIGN0cmwuc2V0U29ydGluZ1ZhbHVlcyA9IGJjU2VydmVyVGFibGVQcm90b3R5cGUuc2V0U29ydGluZ1ZhbHVlcztcbiAgICAgICAgY3RybC51cGRhdGVQYWdlID0gXy5iaW5kKGJjU2VydmVyVGFibGVQcm90b3R5cGUudXBkYXRlUGFnZSwgY3RybCk7XG4gICAgICAgIGN0cmwudXBkYXRlU29ydCA9IGJjU2VydmVyVGFibGVQcm90b3R5cGUudXBkYXRlU29ydDtcbiAgICAgICAgY3RybC51cGRhdGVUYWJsZSA9IGJjU2VydmVyVGFibGVQcm90b3R5cGUudXBkYXRlVGFibGU7XG4gICAgICAgIGN0cmwudmFsaWRhdGVSZXNvdXJjZSA9IGJjU2VydmVyVGFibGVQcm90b3R5cGUudmFsaWRhdGVSZXNvdXJjZTtcblxuICAgICAgICBpbml0KCk7XG5cbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICAgIHZhciByZXNvdXJjZUNhbGxiYWNrO1xuXG4gICAgICAgICAgICByZXNvdXJjZUNhbGxiYWNrID0gJHBhcnNlKCRhdHRycy5yZXNvdXJjZUNhbGxiYWNrKSgkc2NvcGUpO1xuICAgICAgICAgICAgaWYgKCFfLmlzRnVuY3Rpb24ocmVzb3VyY2VDYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICAkbG9nLmVycm9yKCdiYy1zZXJ2ZXItdGFibGUgZGlyZWN0aXZlOiByZXNvdXJjZS1jYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3RybC5yZXNvdXJjZUNhbGxiYWNrID0gcmVzb3VyY2VDYWxsYmFjaztcblxuICAgICAgICAgICAgY3RybC5pbml0KCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUuZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUuY29udHJvbGxlcicsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXNlcnZlci10YWJsZS5zb3J0LWJ5LmRpcmVjdGl2ZScsXG4gICAgJ3VpLnJvdXRlcidcbl0pXG4gICAgLyoqXG4gICAgICogVGhlIGJjLXNlcnZlci10YWJsZSBkaXJlY3RpdmUgY3JlYXRlcyBhIGRhdGEgdGFibGUgdGhhdCBoYW5kbGVzXG4gICAgICogc2VydmVyIHNpZGUgcGFnaW5hdGlvbiwgc29ydGluZywgYW5kIGZpbHRlcmluZy4gSXQgZXhwb3NlcyBhIGZldyBzY29wZSB2YXJpYWJsZXMsXG4gICAgICogdGhhdCBjYW4gYmUgdXNlZCB0byBkaXNwbGF5IHRoZSB0YWJsZSBjb250ZW50IHdpdGggY3VzdG9tIG1hcmt1cCAoc2VlIGV4YW1wbGVcbiAgICAgKiBpbiB0aGUgcGF0dGVybiBsYWIgZm9yIGFuIGFjdHVhbCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgYmMtc2VydmVyLXRhYmxlKS5cbiAgICAgKlxuICAgICAqIFRoZSBmb2xsb3dpbmcgYXR0cmlidXRlcyBjYW4gYmUgcGFzc2VkIGluIG9yZGVyIHRvIGNvbmZpZ3VyZSB0aGUgYmMtc2VydmVyLXRhYmxlOlxuICAgICAqIC0gcmVzb3VyY2UtY2FsbGJhY2sgKHJlcXVpcmVkKVxuICAgICAqIC0gdGFibGVDb25maWcgKG9wdGlvbmFsKVxuICAgICAqXG4gICAgICogLSByZXNvdXJjZS1jYWxsYmFjayAtIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcHJvbWlzZSB3aGljaCBpcyByZXNvdmxlZFxuICAgICAqIHdpdGggYW4gb2JqZWN0IG9mIHRoZSBmb2xsb3dpbmcgZm9ybWF0OlxuICAgICAqICAgICAge1xuICAgICAqICAgICAgICAgIHJvd3M6IEFycmF5LFxuICAgICAqICAgICAgICAgIHBhZ2luYXRpb246IHtcbiAgICAgKiAgICAgICAgICAgICAgcGFnZTogTnVtYmVyLFxuICAgICAqICAgICAgICAgICAgICBsaW1pdDogTnVtYmVyLFxuICAgICAqICAgICAgICAgICAgICB0b3RhbDogTnVtYmVyXG4gICAgICogICAgICAgICAgfVxuICAgICAqICAgICAgfVxuICAgICAqXG4gICAgICogVGhpcyBkaXJlY3RpdmUgZXhwb3NlcyBhIHNjb3BlIHZhcmlhYmxlIGNhbGxlZCBiY1NlcnZlclRhYmxlIHRoYXRcbiAgICAgKiBjYW4gYmUgdXNlZCB0byBkaXNwbGF5IGNvbnRlbnQsIGFuZCBpbXBsZW1lbnQgYWRkaXRpb25hbCBmdW5jdGlvbmFsaXR5XG4gICAgICogdG8gdGhlIHRhYmxlIChzdWNoIGFzIHBhZ2luYXRpb24sIHNvcnRpbmcsIGFuZCBzZWxlY3Rpb24gbG9naWMpLlxuICAgICAqXG4gICAgICogLSBiY1NlcnZlclRhYmxlLnJvd3NcbiAgICAgKiAgICAgIC0gQ2FuIGJlIHVzZWQgd2l0aCBuZy1yZXBlYXQgdG8gZGlzcGxheSB0aGUgZGF0YVxuICAgICAqIC0gYmNTZXJ2ZXJUYWJsZS5maWx0ZXJzXG4gICAgICogICAgICAtIENhbiBiZSB1c2VkIHRvIGNoYW5nZS91cGRhdGUgZmlsdGVycy4gVGhlc2UgZmlsdGVycyBtdXN0IGFwcGVhclxuICAgICAqICAgICAgICBpbiB0aGUgc3RhdGUgZGVmaW5pdGlvbiBpbiBvcmRlciB0byB3b3JrIGNvcnJlY3RseS5cbiAgICAgKiAtIGJjU2VydmVyVGFibGUudXBkYXRlVGFibGUoKVxuICAgICAqICAgICAgLSBQZXJmb3JtIGEgc3RhdGUgdHJhbnNpc3Rpb24gd2l0aCB0aGUgY3VycmVudCB0YWJsZSBpbmZvXG4gICAgICogLSBiY1NlcnZlclRhYmxlLnBhZ2luYXRpb25cbiAgICAgKiAgICAgIC0gZXhwb3NlcyBwYWdlLCBsaW1pdCwgYW5kIHRvdGFsXG4gICAgICogLSBiY1NlcnZlclRhYmxlLnNldFBhZ2luYXRpb25WYWx1ZXMocGFnaW5hdGlvbilcbiAgICAgKiAgICAgIC0gY29udmVuaWVuY2UgbWV0aG9kIGZvciBzZXR0aW5nIHBhZ2luYXRpb24gdmFsdWVzIGF0IG9uY2UuXG4gICAgICpcbiAgICAgKiAtIGJjU2VydmVyVGFibGUuc2VsZWN0ZWRSb3dzXG4gICAgICogICAgICAtIGFuIG1hcCBvYmplY3Qgd2l0aCB1bmlxdWUgaWQncyBhcyBrZXlzIGFuZCBib29sZWFuIHZhbHVlcyBhcyB0aGUgc2VsZWN0ZWQgc3RhdGVcbiAgICAgKiAtIGJjU2VydmVyVGFibGUuYWxsU2VsZWN0ZWRcbiAgICAgKiAgICAgIC0gYSBib29sZWFuIHZhbHVlIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIGFsbCByb3dzIHdlcmUgc2VsZWN0ZWQgb3IgY2xlYXJlZFxuICAgICAqIC0gYmNTZXJ2ZXJUYWJsZS5zZWxlY3RBbGxSb3dzKClcbiAgICAgKiAgICAgIC0gdG9nZ2xlIGFsbCByb3dzIHNlbGVjdGlvbiBzdGF0ZVxuICAgICAqIC0gYmNTZXJ2ZXJUYWJsZS5pc1Jvd1NlbGVjdGVkKHJvdylcbiAgICAgKiAgICAgIC0gaGVscGVyIGZ1bmN0aW9uIHRvIGRldGVybWluZSBpZiBhIHJvdyBpcyBzZWxlY3RlZFxuICAgICAqIC0gYmNTZXJ2ZXJUYWJsZS5nZXRTZWxlY3RlZFJvd3MoKVxuICAgICAqICAgICAgLSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gYXJyYXkgb2Ygcm93IG9iamVjdHMgdGhhdCBhcmUgY3VycmVudGx5IHNlbGVjdGVkXG4gICAgICpcbiAgICAgKi9cbiAgICAuZGlyZWN0aXZlKCdiY1NlcnZlclRhYmxlJywgZnVuY3Rpb24gYmNTZXJ2ZXJUYWJsZURpcmVjdGl2ZSgkcGFyc2UpIHtcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0JjU2VydmVyVGFibGVDdHJsIGFzIGJjU2VydmVyVGFibGUnLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gYmNTZXJ2ZXJUYWJsZUxpbmsoJHNjb3BlLCBlbGVtZW50LCBhdHRycywgYmNTZXJ2ZXJUYWJsZUN0cmwpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXR0cnMudGFibGVDb250cm9sbGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGV4cG9zZSBiY1NlcnZlclRhYmxlQ3RybCB0byB0YWJsZUNvbnRyb2xsZXIgaWYgaXQgZXhpc3RzXG4gICAgICAgICAgICAgICAgICAgICRwYXJzZShhdHRycy50YWJsZUNvbnRyb2xsZXIpLmFzc2lnbigkc2NvcGUsIGJjU2VydmVyVGFibGVDdHJsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXNlcnZlci10YWJsZS5kaXJlY3RpdmUnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUuc29ydC1ieS5kaXJlY3RpdmUnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUtZmFjdG9yeS5zZXJ2aWNlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtc2VydmVyLXRhYmxlLnNvcnQtYnkuZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUtZmFjdG9yeS5zZXJ2aWNlJ1xuXSlcbiAgICAuZGlyZWN0aXZlKCdiY1NvcnRCeScsIGZ1bmN0aW9uIGJjU29ydEJ5RGlyZWN0aXZlKCRsb2csIGJjU2VydmVyVGFibGVGYWN0b3J5KSB7XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9qcy9iaWdjb21tZXJjZS9iYy1zZXJ2ZXItdGFibGUvYmMtc29ydC1ieS50cGwuaHRtbCcsXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgc29ydFZhbHVlOiAnQCcsXG4gICAgICAgICAgICAgICAgY29sdW1uTmFtZTogJ0AnLFxuICAgICAgICAgICAgICAgIHRhYmxlSWQ6ICdAJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlcXVpcmU6ICc/Xl5iY1NlcnZlclRhYmxlJyxcbiAgICAgICAgICAgIGxpbms6IGJjU29ydEJ5RGlyZWN0aXZlTGlua1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGJjU29ydEJ5RGlyZWN0aXZlTGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMsIGJjU2VydmVyVGFibGVDdHJsKSB7XG4gICAgICAgICAgICB2YXIgYmNTZXJ2ZXJUYWJsZSxcbiAgICAgICAgICAgICAgICBzb3J0RGlyVmFsdWVzO1xuXG4gICAgICAgICAgICBpZiAoc2NvcGUudGFibGVJZCkge1xuICAgICAgICAgICAgICAgIGJjU2VydmVyVGFibGUgPSBiY1NlcnZlclRhYmxlRmFjdG9yeS5nZXQoc2NvcGUudGFibGVJZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJjU2VydmVyVGFibGVDdHJsKSB7XG4gICAgICAgICAgICAgICAgYmNTZXJ2ZXJUYWJsZSA9IGJjU2VydmVyVGFibGVDdHJsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkbG9nLmVycm9yKCdiYy1zb3J0LWJ5IGRpcmVjdGl2ZSByZXF1aXJlcyBhIHRhYmxlLWlkLCBvciBhIHBhcmVudCBiY1NlcnZlclRhYmxlQ3RybCBkaXJlY3RpdmUuJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNvcnREaXJWYWx1ZXMgPSBiY1NlcnZlclRhYmxlLnRhYmxlQ29uZmlnLnNvcnREaXJWYWx1ZXM7XG5cbiAgICAgICAgICAgIHNjb3BlLmFzYyA9IHNvcnREaXJWYWx1ZXMuYXNjO1xuICAgICAgICAgICAgc2NvcGUuZGVzYyA9IHNvcnREaXJWYWx1ZXMuZGVzYztcbiAgICAgICAgICAgIHNjb3BlLnNvcnRCeSA9IGJjU2VydmVyVGFibGUuc29ydEJ5O1xuICAgICAgICAgICAgc2NvcGUuc29ydERpciA9IGJjU2VydmVyVGFibGUuc29ydERpcjtcbiAgICAgICAgICAgIHNjb3BlLnNvcnQgPSBzb3J0O1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBzb3J0KCRldmVudCkge1xuICAgICAgICAgICAgICAgIHZhciBzb3J0QnksXG4gICAgICAgICAgICAgICAgICAgIHNvcnREaXI7XG5cbiAgICAgICAgICAgICAgICBpZiAoJGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChiY1NlcnZlclRhYmxlLnNvcnRCeSA9PT0gc2NvcGUuc29ydFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNvcnRCeSA9IGJjU2VydmVyVGFibGUuc29ydEJ5O1xuICAgICAgICAgICAgICAgICAgICBzb3J0RGlyID0gYmNTZXJ2ZXJUYWJsZS5zb3J0RGlyID09PSBzY29wZS5hc2MgPyBzY29wZS5kZXNjIDogc2NvcGUuYXNjO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNvcnRCeSA9IHNjb3BlLnNvcnRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgc29ydERpciA9IHNjb3BlLmFzYztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBiY1NlcnZlclRhYmxlLnVwZGF0ZVNvcnQoc29ydEJ5LCBzb3J0RGlyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY2hlY2tib3gtbGlzdC5jb250cm9sbGVyJywgW10pXG4gICAgLmNvbnRyb2xsZXIoJ0NoZWNrYm94TGlzdEN0cmwnLCBmdW5jdGlvbiBDaGVja2JveExpc3RDdHJsKCRhdHRycywgJGVsZW1lbnQsICRsb2csICRwYXJzZSwgJHNjb3BlKSB7XG4gICAgICAgIHZhciBjdHJsID0gdGhpcyxcbiAgICAgICAgICAgIGZhbHNlVmFsdWUgPSAkcGFyc2UoJGF0dHJzLm5nRmFsc2VWYWx1ZSkoY3RybCkgfHwgZmFsc2UsXG4gICAgICAgICAgICB0cnVlVmFsdWUgPSAkcGFyc2UoJGF0dHJzLm5nVHJ1ZVZhbHVlKShjdHJsKSB8fCB0cnVlLFxuICAgICAgICAgICAgbmdNb2RlbCA9ICRlbGVtZW50LmNvbnRyb2xsZXIoJ25nTW9kZWwnKTtcblxuICAgICAgICBpbml0KCk7XG5cbiAgICAgICAgLy8gR2V0dGVyc1xuICAgICAgICBmdW5jdGlvbiBnZXRNb2RlbFZhbHVlKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5nTW9kZWwuJG1vZGVsVmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRWYWx1ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiBjdHJsLnZhbHVlIHx8IGN0cmwubmdWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFNlbGVjdGVkVmFsdWVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIGN0cmwuc2VsZWN0ZWRWYWx1ZXM7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXR0ZXJzXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZU1vZGVsVmFsdWUobW9kZWxWYWx1ZSkge1xuICAgICAgICAgICAgbmdNb2RlbC4kc2V0Vmlld1ZhbHVlKG1vZGVsVmFsdWUpO1xuICAgICAgICAgICAgbmdNb2RlbC4kY29tbWl0Vmlld1ZhbHVlKCk7XG4gICAgICAgICAgICBuZ01vZGVsLiRyZW5kZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVNlbGVjdGVkVmFsdWVzKG1vZGVsVmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChtb2RlbFZhbHVlID09PSB0cnVlVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBhZGRUb1NlbGVjdGVkVmFsdWVzKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1vZGVsVmFsdWUgPT09IGZhbHNlVmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZW1vdmVGcm9tU2VsZWN0ZWRWYWx1ZXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFkZFRvU2VsZWN0ZWRWYWx1ZXMoKSB7XG4gICAgICAgICAgICB2YXIgaXNJbmNsdWRlZCA9IF8uaW5jbHVkZShjdHJsLnNlbGVjdGVkVmFsdWVzLCBnZXRWYWx1ZSgpKTtcblxuICAgICAgICAgICAgaWYgKCFpc0luY2x1ZGVkKSB7XG4gICAgICAgICAgICAgICAgY3RybC5zZWxlY3RlZFZhbHVlcy5wdXNoKGdldFZhbHVlKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlRnJvbVNlbGVjdGVkVmFsdWVzKCkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gXy5pbmRleE9mKGN0cmwuc2VsZWN0ZWRWYWx1ZXMsIGdldFZhbHVlKCkpO1xuXG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgY3RybC5zZWxlY3RlZFZhbHVlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gV2F0Y2hlcnNcbiAgICAgICAgZnVuY3Rpb24gbW9kZWxWYWx1ZVdhdGNoKG1vZGVsVmFsdWUsIG9sZE1vZGVsVmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBvbGRTZWxlY3RlZFZhbHVlcyxcbiAgICAgICAgICAgICAgICBzZWxlY3RlZFZhbHVlc0NoYW5nZWQ7XG5cbiAgICAgICAgICAgIC8vIFdoZW4gbmdNb2RlbCB2YWx1ZSBjaGFuZ2VzXG4gICAgICAgICAgICBpZiAoXy5pc1VuZGVmaW5lZChtb2RlbFZhbHVlKSB8fCBtb2RlbFZhbHVlID09PSBvbGRNb2RlbFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBSZXRhaW4gYSBzaGFsbG93IGNvcHkgb2Ygc2VsZWN0ZWRWYWx1ZXMgYmVmb3JlIHVwZGF0ZVxuICAgICAgICAgICAgb2xkU2VsZWN0ZWRWYWx1ZXMgPSBjdHJsLnNlbGVjdGVkVmFsdWVzLnNsaWNlKCk7XG5cbiAgICAgICAgICAgIC8vIFVwZGF0ZSBzZWxlY3RlZFZhbHVlc1xuICAgICAgICAgICAgdXBkYXRlU2VsZWN0ZWRWYWx1ZXMobW9kZWxWYWx1ZSk7XG5cbiAgICAgICAgICAgIC8vIERldGVybWluZSBpZiBzZWxlY3RlZFZhbHVlcyBhcnJheSBoYXMgY2hhbmdlZFxuICAgICAgICAgICAgc2VsZWN0ZWRWYWx1ZXNDaGFuZ2VkID0gISFfLnhvcihjdHJsLnNlbGVjdGVkVmFsdWVzLCBvbGRTZWxlY3RlZFZhbHVlcykubGVuZ3RoO1xuXG4gICAgICAgICAgICAvLyBJZiBjaGFuZ2VkLCBldm9rZSBkZWxlZ2F0ZSBtZXRob2QgKGlmIGRlZmluZWQpXG4gICAgICAgICAgICBpZiAoY3RybC5vbkNoYW5nZSAmJiBzZWxlY3RlZFZhbHVlc0NoYW5nZWQpIHtcbiAgICAgICAgICAgICAgICBjdHJsLm9uQ2hhbmdlKHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRWYWx1ZXM6IGN0cmwuc2VsZWN0ZWRWYWx1ZXMsXG4gICAgICAgICAgICAgICAgICAgIG9sZFNlbGVjdGVkVmFsdWVzOiBvbGRTZWxlY3RlZFZhbHVlc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2VsZWN0ZWRWYWx1ZXNXYXRjaChzZWxlY3RlZFZhbHVlcykge1xuICAgICAgICAgICAgLy8gV2hlbiBzZWxlY3RlZFZhbHVlcyBjb2xsZWN0aW9uIGNoYW5nZXNcbiAgICAgICAgICAgIHZhciBpc0luY2x1ZGVkID0gXy5pbmNsdWRlKHNlbGVjdGVkVmFsdWVzLCBnZXRWYWx1ZSgpKSxcbiAgICAgICAgICAgICAgICBtb2RlbFZhbHVlID0gZ2V0TW9kZWxWYWx1ZSgpO1xuXG4gICAgICAgICAgICBpZiAoaXNJbmNsdWRlZCAmJiBtb2RlbFZhbHVlICE9PSB0cnVlVmFsdWUpIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVNb2RlbFZhbHVlKHRydWVWYWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFpc0luY2x1ZGVkICYmIG1vZGVsVmFsdWUgIT09IGZhbHNlVmFsdWUpIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVNb2RlbFZhbHVlKGZhbHNlVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSW5pdGlhbGl6ZXJcbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICAgIGlmICgkYXR0cnMudHlwZSAhPT0gJ2NoZWNrYm94Jykge1xuICAgICAgICAgICAgICAgICRsb2cuZXJyb3IoJ2NoZWNrYm94LWxpc3QgZGlyZWN0aXZlOiBlbGVtZW50IG11c3QgYmUgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiPicpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkc2NvcGUuJHdhdGNoKGdldE1vZGVsVmFsdWUsIG1vZGVsVmFsdWVXYXRjaCk7XG4gICAgICAgICAgICAkc2NvcGUuJHdhdGNoQ29sbGVjdGlvbihnZXRTZWxlY3RlZFZhbHVlcywgc2VsZWN0ZWRWYWx1ZXNXYXRjaCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jaGVja2JveC1saXN0LmRpcmVjdGl2ZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY2hlY2tib3gtbGlzdC5jb250cm9sbGVyJ1xuXSlcblxuICAgIC8qKlxuICAgICAqIEEgZGlyZWN0aXZlIGZvciBjb2xsYXRpbmcgdmFsdWVzIGZyb20gYW4gYXJyYXkgb2YgY2hlY2tib3hlcy5cbiAgICAgKlxuICAgICAqIEByZXF1aXJlIG5nTW9kZWxcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmd8bnVtYmVyfE9iamVjdD59IGNoZWNrYm94TGlzdCAtIEFycmF5IHRvIGhvbGQgc2VsZWN0ZWQgdmFsdWVzXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSAtIFZhbHVlIHRvIGFkZCB0byBjaGVja2JveExpc3RcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKHNlbGVjdGVkVmFsdWVzLCBvbGRTZWxlY3RlZFZhbHVlc30gW2NoZWNrYm94TGlzdENoYW5nZV0gLSBPcHRpb25hbCBvbkNoYW5nZSBjYWxsYmFja1xuICAgICAqXG4gICAgICogQGV4YW1wbGU6XG4gICAgICogYGBgaHRtbFxuICAgICAqIDxkaXYgbmctcmVwZWF0PVwib3B0aW9uIGluIG9wdGlvbnNcIj5cbiAgICAgKiAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIFxuICAgICAqICAgICAgICAgbmFtZT1cIm9wdGlvbnt7IG9wdGlvbi5pZCB9fVwiXG4gICAgICogICAgICAgICB2YWx1ZT1cIm9wdGlvbi5pZFwiIFxuICAgICAqICAgICAgICAgY2hlY2tib3gtbGlzdD1cInNlbGVjdGVkVmFsdWVzXCIgXG4gICAgICogICAgICAgICBjaGVja2JveC1saXN0LWNoYW5nZT1cIm9uQ2hhbmdlKHNlbGVjdGVkVmFsdWVzKVwiIFxuICAgICAqICAgICAgICAgbmctbW9kZWw9XCJvcHRpb24uY2hlY2tlZFwiXG4gICAgICogICAgIC8+XG4gICAgICogPC9kaXY+XG4gICAgICogYGBgXG4gICAgICogXG4gICAgICogYGBganNcbiAgICAgKiBzY29wZS5zZWxlY3RlZFZhbHVlcyA9IFtdO1xuICAgICAqIHNjb3BlLm9wdGlvbnMgPSBbXG4gICAgICogICAgIHtcbiAgICAgKiAgICAgICAgIGlkOiAxLFxuICAgICAqICAgICAgICAgbGFiZWw6ICdPcHRpb24gMSdcbiAgICAgKiAgICAgfSxcbiAgICAgKiAgICAge1xuICAgICAqICAgICAgICAgaWQ6IDIsXG4gICAgICogICAgICAgICBsYWJlbDogJ09wdGlvbiAyJ1xuICAgICAqICAgICB9LFxuICAgICAqICAgICB7XG4gICAgICogICAgICAgICBpZDogMyxcbiAgICAgKiAgICAgICAgIGxhYmVsOiAnT3B0aW9uIDMnXG4gICAgICogICAgIH1cbiAgICAgKiBdO1xuICAgICAqIFxuICAgICAqIHNjb3BlLm9uQ2hhbmdlID0gZnVuY3Rpb24gb25DaGFuZ2Uoc2VsZWN0ZWRWYWx1ZXMpIHtcbiAgICAgKiAgICAgY29uc29sZS5sb2coc2VsZWN0ZWRWYWx1ZXMpO1xuICAgICAqIH07XG4gICAgICogYGBgXG4gICAgICogXG4gICAgICogV2hlbiBvcHRpb25zWzBdIGFuZCBvcHRpb25zWzFdIGFyZSBjaGVja2VkLCBzZWxlY3RlZFZhbHVlcyBzaG91bGQgYmUgWzEsIDJdXG4gICAgICogYW5kIG9uQ2hhbmdlIHdpbGwgYmUgZXZva2VkLiBUaGlzIGRpcmVjdGl2ZSBhbHNvIHdvcmtzIHdpdGggYW4gYXJyYXkgb2YgcHJpbWl0aXZlIHZhbHVlcy5cbiAgICAgKiBpLmUuOiBzY29wZS5vcHRpb25zID0gW1wiYVwiLCBcImJcIiwgXCJjXCJdLlxuICAgICAqL1xuXG4gICAgLmRpcmVjdGl2ZSgnY2hlY2tib3hMaXN0JywgZnVuY3Rpb24gY2hlY2tib3hMaXN0RGlyZWN0aXZlKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDaGVja2JveExpc3RDdHJsJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2NoZWNrYm94TGlzdEN0cmwnLFxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U6ICcmY2hlY2tib3hMaXN0Q2hhbmdlJyxcbiAgICAgICAgICAgICAgICBzZWxlY3RlZFZhbHVlczogJz1jaGVja2JveExpc3QnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiAnPScsXG4gICAgICAgICAgICAgICAgbmdWYWx1ZTogJz0nXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY2hlY2tib3gtbGlzdCcsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY2hlY2tib3gtbGlzdC5kaXJlY3RpdmUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jb2xvci1waWNrZXItcGFsZXR0ZS5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignQ29sb3JQaWNrZXJQYWxldHRlQ3RybCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgY3RybCA9IHRoaXM7XG5cbiAgICAgICAgY3RybC5jcmVhdGVOZXdDb2xvciA9IGNyZWF0ZU5ld0NvbG9yO1xuICAgICAgICBjdHJsLnJlbW92ZUV4aXN0aW5nQ29sb3IgPSByZW1vdmVFeGlzdGluZ0NvbG9yO1xuICAgICAgICBjdHJsLmlzQWN0aXZlID0gaXNBY3RpdmU7XG5cbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlTmV3Q29sb3IoJGV2ZW50KSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgY3RybC5jcmVhdGVOZXdQYWxldHRlQ29sb3IoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZUV4aXN0aW5nQ29sb3IoJGV2ZW50KSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgY3RybC5yZW1vdmVQYWxldHRlQ29sb3IoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzQWN0aXZlKGNvbG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gY29sb3IgPT09IGN0cmwuc2VsZWN0ZWRDb2xvcjtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNvbG9yLXBpY2tlci1wYWxldHRlLmRpcmVjdGl2ZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY29sb3ItcGlja2VyLXBhbGV0dGUuY29udHJvbGxlcidcbl0pXG5cbiAgICAuZGlyZWN0aXZlKCdjb2xvclBpY2tlclBhbGV0dGUnLCBmdW5jdGlvbiBjb2xvclBpY2tlclBhbGV0dGVEaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0NvbG9yUGlja2VyUGFsZXR0ZUN0cmwnLFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY29sb3JQaWNrZXJQYWxldHRlQ3RybCcsXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBjb2xvcnM6ICc9JyxcbiAgICAgICAgICAgICAgICBjcmVhdGVOZXdQYWxldHRlQ29sb3I6ICc9JyxcbiAgICAgICAgICAgICAgICByZW1vdmVQYWxldHRlQ29sb3I6ICc9JyxcbiAgICAgICAgICAgICAgICBzZXROZXdDb2xvcjogJz0nLFxuICAgICAgICAgICAgICAgIHNlbGVjdGVkQ29sb3I6ICdAJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL2JpZ2NvbW1lcmNlL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXItcGFsZXR0ZS50cGwuaHRtbCcsXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiBjb2xvclBpY2tlclBhbGV0dGVEaXJlY3RpdmVDb21waWxlKHRFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdEVsZW1lbnQuYWRkQ2xhc3MoJ2NvbG9yUGlja2VyLXBhbGV0dGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsIi8qIGdsb2JhbHMgQ29sb3JQaWNrZXIgKi9cbmFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jb2xvci1waWNrZXIuY29udHJvbGxlcicsIFtdKVxuICAgIC5jb250cm9sbGVyKCdDb2xvclBpY2tlckN0cmwnLCBmdW5jdGlvbiBDb2xvclBpY2tlckN0cmwoJGVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgY3RybCA9IHRoaXM7XG5cbiAgICAgICAgbGV0IGNvbG9yU2VsZWN0aW9uO1xuICAgICAgICBsZXQgY29sb3JTZWxlY3Rpb25JbmRpY2F0b3I7XG4gICAgICAgIGxldCBjb2xvclNsaWRlcjtcbiAgICAgICAgbGV0IGNvbG9yU2xpZGVySW5kaWNhdG9yO1xuXG4gICAgICAgIGN0cmwuY3JlYXRlQ29sb3JQaWNrZXIgPSBjcmVhdGVDb2xvclBpY2tlcjtcbiAgICAgICAgY3RybC5jcmVhdGVOZXdQYWxldHRlQ29sb3IgPSBjcmVhdGVOZXdQYWxldHRlQ29sb3I7XG4gICAgICAgIGN0cmwucmVtb3ZlUGFsZXR0ZUNvbG9yID0gcmVtb3ZlUGFsZXR0ZUNvbG9yO1xuICAgICAgICBjdHJsLnNldE1vZGVsQ3RybCA9IHNldE1vZGVsQ3RybDtcbiAgICAgICAgY3RybC5zZXROZXdDb2xvciA9IHNldE5ld0NvbG9yO1xuICAgICAgICBjdHJsLmdldFNlbGVjdGVkQ29sb3IgPSBnZXRTZWxlY3RlZENvbG9yO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbG9yUGlja2VyKCkge1xuICAgICAgICAgICAgY29sb3JTZWxlY3Rpb24gPSAkZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yKCdbZGF0YS1iYy1waWNrZXJdJyk7XG4gICAgICAgICAgICBjb2xvclNlbGVjdGlvbkluZGljYXRvciA9ICRlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWJjLXBpY2tlci1pbmRpY2F0b3JdJyk7XG4gICAgICAgICAgICBjb2xvclNsaWRlciA9ICRlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWJjLXNsaWRlcl0nKTtcbiAgICAgICAgICAgIGNvbG9yU2xpZGVySW5kaWNhdG9yID0gJGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignW2RhdGEtYmMtc2xpZGVyLWluZGljYXRvcl0nKTtcblxuICAgICAgICAgICAgQ29sb3JQaWNrZXIuZml4SW5kaWNhdG9ycyhcbiAgICAgICAgICAgICAgICBjb2xvclNsaWRlckluZGljYXRvcixcbiAgICAgICAgICAgICAgICBjb2xvclNlbGVjdGlvbkluZGljYXRvcik7XG5cbiAgICAgICAgICAgIGN0cmwuY3AgPSBuZXcgQ29sb3JQaWNrZXIoXG4gICAgICAgICAgICAgICAgY29sb3JTbGlkZXIsXG4gICAgICAgICAgICAgICAgY29sb3JTZWxlY3Rpb24sXG4gICAgICAgICAgICAgICAgcGlja05ld0NvbG9yXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlTmV3UGFsZXR0ZUNvbG9yKCkge1xuICAgICAgICAgICAgaWYgKGN0cmwucGFsZXR0ZS5pbmRleE9mKGdldFNlbGVjdGVkQ29sb3IoKSkgPCAwKSB7XG4gICAgICAgICAgICAgICAgY3RybC5wYWxldHRlLnB1c2goZ2V0U2VsZWN0ZWRDb2xvcigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZVBhbGV0dGVDb2xvcigpIHtcbiAgICAgICAgICAgIGlmIChjdHJsLnBhbGV0dGUuaW5kZXhPZihnZXRTZWxlY3RlZENvbG9yKCkpID4gLTEpIHtcbiAgICAgICAgICAgICAgICBjdHJsLnBhbGV0dGUuc3BsaWNlKGN0cmwucGFsZXR0ZS5pbmRleE9mKGdldFNlbGVjdGVkQ29sb3IoKSksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0U2VsZWN0ZWRDb2xvcigpIHtcbiAgICAgICAgICAgIHJldHVybiBjdHJsLmNvbG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcGlja05ld0NvbG9yKGhleCwgaHN2LCByZ2IsIHBpY2tlckNvb3JkaW5hdGUsIHNsaWRlckNvb3JkaW5hdGUpIHtcbiAgICAgICAgICAgIENvbG9yUGlja2VyLnBvc2l0aW9uSW5kaWNhdG9ycyhcbiAgICAgICAgICAgICAgICBjb2xvclNsaWRlckluZGljYXRvcixcbiAgICAgICAgICAgICAgICBjb2xvclNlbGVjdGlvbkluZGljYXRvcixcbiAgICAgICAgICAgICAgICBzbGlkZXJDb29yZGluYXRlLCBwaWNrZXJDb29yZGluYXRlXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjdHJsLm5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUoaGV4KTtcbiAgICAgICAgICAgIGN0cmwubmdNb2RlbEN0cmwuJHJlbmRlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICAgICAgY3RybC5jb2xvciA9IGN0cmwubmdNb2RlbEN0cmwuJHZpZXdWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldE1vZGVsQ3RybChuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgY3RybC5uZ01vZGVsQ3RybCA9IG5nTW9kZWxDdHJsO1xuICAgICAgICAgICAgY3RybC5uZ01vZGVsQ3RybC4kcmVuZGVyID0gcmVuZGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0TmV3Q29sb3IoJGV2ZW50LCBuZXdDb2xvcikge1xuICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGN0cmwuY3Auc2V0SGV4KG5ld0NvbG9yKTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNvbG9yLXBpY2tlci5kaXJlY3RpdmUnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNvbG9yLXBpY2tlci5jb250cm9sbGVyJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuaHRtbDVNb2RlJyxcbl0pXG5cbiAgICAuZGlyZWN0aXZlKCdjb2xvclBpY2tlcicsIGZ1bmN0aW9uIGNvbG9yUGlja2VyRGlyZWN0aXZlKCRsb2NhdGlvbiwgaHRtbDVNb2RlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0NvbG9yUGlja2VyQ3RybCcsXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjb2xvclBpY2tlckN0cmwnLFxuICAgICAgICAgICAgcmVxdWlyZTogWydjb2xvclBpY2tlcicsICdebmdNb2RlbCddLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgcGFsZXR0ZTogJz0nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL2JpZ2NvbW1lcmNlL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXIudHBsLmh0bWwnLFxuXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiBjb2xvclBpY2tlckRpcmVjdGl2ZUNvbXBpbGUodEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0RWxlbWVudC5hZGRDbGFzcygnY29sb3JQaWNrZXInKTtcblxuICAgICAgICAgICAgICAgIC8vIFNhbml0aXplIHVybHMgc28gdGhhdCBhbiAjYW5jaG9yLWhhc2ggZG9lc24ndCBicmVhayB0aGUgY29sb3JwaWNrZXJcbiAgICAgICAgICAgICAgICBjb25zdCBwYWdlVXJsID0gJGxvY2F0aW9uLmFic1VybCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhZ2VVcmxIYXNoID0gJGxvY2F0aW9uLmhhc2goKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzYW5pdGl6ZVVybCA9IHBhZ2VVcmxIYXNoID8gcGFnZVVybC5zcGxpdCgnIycgKyBwYWdlVXJsSGFzaClbMF0gOiBwYWdlVXJsO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGNvbG9yUGlja2VyRGlyZWN0aXZlTGluaygkc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJscykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdHJsID0gY3RybHNbMF07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5nTW9kZWxDdHJsID0gY3RybHNbMV07XG5cbiAgICAgICAgICAgICAgICAgICAgY3RybC5zZXRNb2RlbEN0cmwobmdNb2RlbEN0cmwpO1xuICAgICAgICAgICAgICAgICAgICBjdHJsLmNyZWF0ZUNvbG9yUGlja2VyKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQXBwcyB0aGF0IGhhdmUgYSA8YmFzZT4gdGFnIHJlcXVpcmUgdG8gaGF2ZSBhYnNvbHV0ZSBwYXRoc1xuICAgICAgICAgICAgICAgICAgICAvLyB3aGVuIHVzaW5nIHN2ZyB1cmwgcmVmZXJlbmNlc1xuICAgICAgICAgICAgICAgICAgICBpZiAoaHRtbDVNb2RlLmVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tmaWxsXScpLCBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJldHdlZW5QYXJlbnRoZXNpcyA9IC9cXCgoW14pXSspXFwpLztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlbGVtID0gYW5ndWxhci5lbGVtZW50KGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50RmlsbCA9IGVsZW0uYXR0cignZmlsbCcpO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXy5jb250YWlucyhjdXJyZW50RmlsbCwgJ3VybCgjJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3RmlsbCA9IGJldHdlZW5QYXJlbnRoZXNpcy5leGVjKGN1cnJlbnRGaWxsKVsxXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtLmF0dHIoJ2ZpbGwnLCAndXJsKCcgKyBzYW5pdGl6ZVVybCArIG5ld0ZpbGwgKyAnKScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiR3YXRjaChnZXRNb2RlbFZhbHVlLCBmdW5jdGlvbiBtb2RlbFdhdGNoKG5ld1ZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1ZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0cmwuY3Auc2V0SGV4KG5ld1ZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdldE1vZGVsVmFsdWUoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3RybC5uZ01vZGVsQ3RybC4kbW9kZWxWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY29sb3ItcGlja2VyJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jb2xvci1waWNrZXIuZGlyZWN0aXZlJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY29sb3ItcGlja2VyLXBhbGV0dGUuZGlyZWN0aXZlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY29weS1jbGlwYm9hcmQuY29uc3RhbnQnLCBbXSlcbiAgICAuZmFjdG9yeSgnQ0xJUEJPQVJEX1RPT0xUSVAnLCBmdW5jdGlvbiAoZ2V0dGV4dENhdGFsb2cpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiBnZXR0ZXh0Q2F0YWxvZy5nZXRTdHJpbmcoJ0NvcGllZCEnKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICAgICAgbW9iaWxlOiBnZXR0ZXh0Q2F0YWxvZy5nZXRTdHJpbmcoJ1RhcCBkb3duIGFuZCBob2xkIHRvIGNvcHknKSxcbiAgICAgICAgICAgICAgICBtYWM6IGdldHRleHRDYXRhbG9nLmdldFN0cmluZygnUHJlc3Mg4oyYLUMgdG8gY29weScpLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGdldHRleHRDYXRhbG9nLmdldFN0cmluZygnUHJlc3MgQ3RybC1DIHRvIGNvcHknKVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNvcHktY2xpcGJvYXJkLmNvbnRyb2xsZXInLCBbXSlcbiAgICAuY29udHJvbGxlcignQ29weUNsaXBib2FyZEN0cmwnLCBmdW5jdGlvbiBDb3B5Q2xpcGJvYXJkQ3RybChDTElQQk9BUkRfVE9PTFRJUCwgZGV2aWNlU2VydmljZSwgJHRpbWVvdXQpe1xuICAgICAgICB2YXIgY3RybCA9IHRoaXM7XG5cbiAgICAgICAgY3RybC50aW1lb3V0ID0gJHRpbWVvdXQ7XG4gICAgICAgIGN0cmwub25FcnJvciA9IG9uRXJyb3I7XG4gICAgICAgIGN0cmwub25TdWNjZXNzID0gb25TdWNjZXNzO1xuXG4gICAgICAgIGluaXQoKTtcblxuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICAgY3RybC51bmlxdWVJZCA9IF8udW5pcXVlSWQoJ2NsaXBib2FyZC0nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG9uU3VjY2VzcygpIHtcbiAgICAgICAgICAgIGN0cmwuZHluYW1pY1Rvb2x0aXAgPSBDTElQQk9BUkRfVE9PTFRJUC5zdWNjZXNzLmRlZmF1bHQ7XG4gICAgICAgICAgICBzaG93VG9vbHRpcChjdHJsLnVuaXF1ZUlkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG9uRXJyb3IoKXtcbiAgICAgICAgICAgIHZhciB0b29sdGlwTWVzc2FnZTtcblxuICAgICAgICAgICAgaWYgKGRldmljZVNlcnZpY2UuaXNJT1NEZXZpY2UoKSB8fCBkZXZpY2VTZXJ2aWNlLmlzTW9iaWxlRGV2aWNlKCkpIHtcbiAgICAgICAgICAgICAgICB0b29sdGlwTWVzc2FnZSA9IENMSVBCT0FSRF9UT09MVElQLmVycm9yLm1vYmlsZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGV2aWNlU2VydmljZS5pc01hY09TRGV2aWNlKCkpIHtcbiAgICAgICAgICAgICAgICB0b29sdGlwTWVzc2FnZSA9IENMSVBCT0FSRF9UT09MVElQLmVycm9yLm1hYztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdG9vbHRpcE1lc3NhZ2UgPSBDTElQQk9BUkRfVE9PTFRJUC5lcnJvci5kZWZhdWx0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdHJsLmR5bmFtaWNUb29sdGlwID0gdG9vbHRpcE1lc3NhZ2U7XG4gICAgICAgICAgICBzaG93VG9vbHRpcChjdHJsLnVuaXF1ZUlkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNob3dUb29sdGlwKGlkKSB7XG4gICAgICAgICAgICB2YXIgdG9vbHRpcEVsZW1lbnQgPSBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpKTtcblxuICAgICAgICAgICAgY3RybC50aW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICB0b29sdGlwRWxlbWVudC50cmlnZ2VySGFuZGxlcigndG9vbHRpcFRyaWdnZXJPcGVuJyk7XG4gICAgICAgICAgICAgICAgY3RybC50aW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdG9vbHRpcEVsZW1lbnQudHJpZ2dlckhhbmRsZXIoJ3Rvb2x0aXBUcmlnZ2VyQ2xvc2UnKTtcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY29weS1jbGlwYm9hcmQuZGlyZWN0aXZlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnY29weUNsaXBib2FyZCcsIGZ1bmN0aW9uIGNvcHlDbGlwYm9hcmREaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0NvcHlDbGlwYm9hcmRDdHJsIGFzIGNvcHlDbGlwYm9hcmRDdHJsJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIGNvcHlUZXh0OiAnQCcsXG4gICAgICAgICAgICAgICAgcmVhZG9ubHk6ICdAJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL2JpZ2NvbW1lcmNlL2NvcHktY2xpcGJvYXJkL2NvcHktY2xpcGJvYXJkLnRwbC5odG1sJyxcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jb3B5LWNsaXBib2FyZCcsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY29weS1jbGlwYm9hcmQuY29uc3RhbnQnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jb3B5LWNsaXBib2FyZC5jb250cm9sbGVyJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY29weS1jbGlwYm9hcmQuZGlyZWN0aXZlJ1xuXSk7XG4iLCIvKipcbiAqIEBuYW1lIGNyZWRpdC1jYXJkIGRpcmVjdGl2ZVxuICogQGRlc2NyaXB0aW9uIENvbXBvbmVudCBjb250YWluaW5nIGNjIG51bWJlciwgY3ZjLCBuYW1lLCBhbmQgZXhwaXJ5LiBIYXMgYW4gaXNvbGF0ZWQgc2NvcGUgd2l0aCBubyBjb250cm9sbGVyLlxuICogQHJlcXVpcmUgZm9ybVxuICpcbiAqIEBwYXJhbSBjY0RhdGEge29iamVjdH0gQ29udGFpbnMgY2NOdW1iZXIsIGNjVHlwZSwgY2NFeHBpcnksIGFuZCBjY05hbWVcbiAqIEBwYXJhbSBjY0NvbmZpZyB7b2JqZWN0fSBUaGUgY29uZmlndXJhdGlvbiBvYmplY3QuIEN1cnJlbnRseSBzdXBwb3J0aW5nOlxuICogIC0gY2FyZENvZGUge2Jvb2xlYW59IEluZGljYXRlcyB3aGV0aGVyIHRoZSBjdnYgZmllbGQgc2hvdWxkIGJlIHNob3duLiBEZWZhdWx0IHRydWUuXG4gKiAgLSBjYXJkQ29kZVJlcXVpcmVkIHtib29sZWFufSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgY3Z2IGZpZWxkIGlzIHJlcXVpcmVkLiBUaGlzIG9ubHkgbWF0dGVycyB3aGVuIGNhcmRDb2RlIGlzIHNldCB0byB0cnVlLiBEZWZhdWx0IHRydWUuXG4gKiAgLSBmdWxsTmFtZSB7Ym9vbGVhbn0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG5hbWUgZmllbGQgc2hvdWxkIGJlIHNob3duLiBEZWZhdWx0IHRydWUuXG4gKiBAcGFyYW0gZWFnZXJUeXBlIHtib29sZWFufSBJZiB0aGlzIGF0dHJpYnV0ZSBpcyBzZXQgdG8gZmFsc2UsIHRoZW4gZGlzYWJsZSBlYWdlciB0eXBlIGRldGVjdGlvbi4gRGVmYXVsdHMgdHJ1ZS5cbiAqL1xuYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLmRpcmVjdGl2ZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuaWNvbidcbl0pXG4gICAgLmRpcmVjdGl2ZSgnY3JlZGl0Q2FyZCcsIGZ1bmN0aW9uIGNyZWRpdENhcmREaXJlY3RpdmUoJGNvbXBpbGUsICRwYXJzZSwgJHRlbXBsYXRlQ2FjaGUpIHtcbiAgICAgICAgY29uc3QgY3Z2VG9vbHRpcFRlbXBsYXRlID0gJHRlbXBsYXRlQ2FjaGUuZ2V0KCdzcmMvanMvYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQvY3JlZGl0LWNhcmQtY3Z2L3Rvb2x0aXAudHBsLmh0bWwnKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gY3JlZGl0Q2FyZENvbXBpbGUodEVsZW0sIHRBdHRycyl7XG4gICAgICAgICAgICAgICAgbGV0IGlzRWFnZXJUeXBlID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGlmICh0QXR0cnMuZWFnZXJUeXBlICYmICRwYXJzZSh0QXR0cnMuZWFnZXJUeXBlKSgpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjY051bWJlciA9IHRFbGVtWzBdLnF1ZXJ5U2VsZWN0b3IoJyNjY051bWJlcicpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNjTnVtYmVyLnJlbW92ZUF0dHJpYnV0ZSgnY2NFYWdlclR5cGUnKTtcbiAgICAgICAgICAgICAgICAgICAgaXNFYWdlclR5cGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gY3JlZGl0Q2FyZExpbmsoc2NvcGUsIGVsZW0sIGF0dHIsIGZvcm1DdHJsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN2dlRvb2x0aXBFbGVtZW50ID0gJGNvbXBpbGUoY3Z2VG9vbHRpcFRlbXBsYXRlKShzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRDb25maWcgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJkQ29kZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcmRDb2RlUmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxsTmFtZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBzY29wZS5nZXRDdnZUb29sdGlwSHRtbCA9IGdldEN2dlRvb2x0aXBIdG1sO1xuXG4gICAgICAgICAgICAgICAgICAgIGluaXQoKTtcblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuZm9ybUN0cmwgPSBmb3JtQ3RybDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmNjQ29uZmlnID0gXy5kZWZhdWx0cyhzY29wZS5jY0NvbmZpZywgZGVmYXVsdENvbmZpZyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgICAgICogVGhlIGNyZWRpdCBjYXJkIHR5cGUgaXMgZGVkdWNlZCBieSB0aGUgYGNjTnVtYmVyYCBkaXJlY3RpdmUuIFRoaXMgaXMgaW4gdHVybiBleHBvc2VkXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBhcyBlaXRoZXIgYCRjY0VhZ2VyVHlwZWAgb3IgYCRjY1R5cGVgIG9uIHRoZSBpbnB1dCBjb250cm9sIGVsZW1lbnQuIFdhdGNoIGZvciBjaGFuZ2VzIGFuZCBiaW5kIHRoZSB0eXBlIHRvIHRoZSBjb3JyZXNwb25kaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiB2YWx1ZSBvbiBjY0RhdGEuXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaChnZXREZXRlY3RlZENjVHlwZSwgc2V0Q2NUeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBSZXR1cm4gdGhlIGh0bWwgZm9yIHRoZSB0b29sdGlwLiBVc2luZyBvdXRlckhUTUwgdG8gYWxzbyBpbmNsdWRlIHRoZSByb290IGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7U3RyaW5nfSBIdG1sIHN0cmluZyBmb3IgdGhlIGN2diB0b29sdGlwIHRlbXBsYXRlXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBnZXRDdnZUb29sdGlwSHRtbCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjdnZUb29sdGlwRWxlbWVudFswXS5vdXRlckhUTUw7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogR2V0IHRoZSBkZXRlY3RlZCBjcmVkaXQgY2FyZCB0eXBlIGV4cG9zZWQgb24gdGhlIGZvcm0gY29udHJvbCBieSB0aGUgY2NOdW1iZXIgY2hpbGQgZGlyZWN0aXZlLlxuICAgICAgICAgICAgICAgICAgICAgKiBUaGlzIHZhbHVlIHdpbGwgYmUgZXhwb3NlZCBhcyAkY2NFYWdlclR5cGUgb3IgJGNjVHlwZSBkZXBlbmRpbmcgb24gd2hldGhlciB0aGlzIGZlYXR1cmUgaXMgZW5hYmxlZC5cbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7c3RyaW5nfG51bGx9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBnZXREZXRlY3RlZENjVHlwZSgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpc0VhZ2VyVHlwZSA/IGZvcm1DdHJsLmNjTnVtYmVyLiRjY0VhZ2VyVHlwZSA6IGZvcm1DdHJsLmNjTnVtYmVyLiRjY1R5cGU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogU2V0IGNjRGF0YS5jY1R5cGVcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd8bnVsbH0gdHlwZSBUaGUgY3JlZGl0IGNhcmQgdHlwZSwgaS5lLiAndmlzYSdcbiAgICAgICAgICAgICAgICAgICAgICogQHJldHVybiB7c3RyaW5nfG51bGx9IHR5cGVcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHNldENjVHlwZSh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5jY0RhdGEuY2NUeXBlID0gdHlwZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlcXVpcmU6ICdeZm9ybScsXG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgY2NEYXRhOiAnPScsXG4gICAgICAgICAgICAgICAgY2NDb25maWc6ICc9JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9qcy9iaWdjb21tZXJjZS9jcmVkaXQtY2FyZC9jcmVkaXQtY2FyZC50cGwuaHRtbCdcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZCcsIFtcbiAgICAnY3JlZGl0LWNhcmRzJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQuYmMtY3ZjJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQuY2MtZXhwaXJ5JyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQuZGlyZWN0aXZlJyxcbiAgICAnZ2V0dGV4dCcsXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC10eXBlcy5jb25zdGFudCcsIFtdKVxuICAgIC5jb25zdGFudCgnQ0NfVFlQRVMnLCB7XG4gICAgICAgICdBbWVyaWNhbiBFeHByZXNzJzogJ2FtZXgnLFxuICAgICAgICAnRGluZXJzIENsdWInOiAnZGluZXJzY2x1YicsXG4gICAgICAgICdEaXNjb3Zlcic6ICdkaXNjb3ZlcicsXG4gICAgICAgICdNYXN0ZXJDYXJkJzogJ21hc3RlcmNhcmQnLFxuICAgICAgICAnVmlzYSc6ICd2aXNhJyxcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC10eXBlcy5jb250cm9sbGVyJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC10eXBlcy5jb25zdGFudCcsXG5dKVxuICAgIC5jb250cm9sbGVyKCdDcmVkaXRDYXJkVHlwZXNDdHJsJywgZnVuY3Rpb24gQ3JlZGl0Q2FyZFR5cGVzQ3RybCgkZWxlbWVudCwgQ0NfVFlQRVMpIHtcbiAgICAgICAgY29uc3QgY3RybCA9IHRoaXM7XG5cbiAgICAgICAgY3RybC5oYXNTZWxlY3RlZFR5cGUgPSBoYXNTZWxlY3RlZFR5cGU7XG4gICAgICAgIGN0cmwuaXNTZWxlY3RlZFR5cGUgPSBpc1NlbGVjdGVkVHlwZTtcbiAgICAgICAgY3RybC5tYXBUb1N2ZyA9IG1hcFRvU3ZnO1xuXG4gICAgICAgIGluaXQoKTtcblxuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ2NyZWRpdENhcmRUeXBlcycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrcyB3aGV0aGVyIGEgdHlwZSBoYXMgYmVlbiBzZWxlY3RlZCAob3IgZGV0ZWN0ZWQgYnkgdGhlIGNyZWRpdC1jYXJkIGNvbXBvbmVudClcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGhhc1NlbGVjdGVkVHlwZSgpIHtcbiAgICAgICAgICAgIHJldHVybiAhXy5pc0VtcHR5KGN0cmwuZ2V0U2VsZWN0ZWRUeXBlKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrcyBpZiB0aGUgcGFzc2VkIGluIGNjVHlwZSBpcyB0aGUgc2FtZSBhcyB0aGUgc2VsZWN0ZWQgY2NUeXBlXG4gICAgICAgICAqIEBwYXJhbSBjY1R5cGUge1N0cmluZ31cbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGlzU2VsZWN0ZWRUeXBlKGNjVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNjVHlwZSA9PT0gY3RybC5nZXRTZWxlY3RlZFR5cGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNYXAgdGhlIGNjVHlwZSB0byBhIGNvcnJlc3BvbmRpbmcgc3ZnIG5hbWVcbiAgICAgICAgICogQHBhcmFtIGNjVHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBtYXBUb1N2ZyhjY1R5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBDQ19UWVBFU1tjY1R5cGVdO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCIvKipcbiAqIEBuYW1lIGNyZWRpdC1jYXJkLXR5cGVzIGRpcmVjdGl2ZVxuICogQGRlc2NyaXB0aW9uIENvbXBvbmVudCBkaXNwbGF5aW5nIGFuZCBncmV5aW5nIG91dCBjcmVkaXQgY2FyZCB0eXBlIGljb25zIGJhc2VkIG9uIHRoZSBzZWxlY3RlZCBjcmVkaXQgY2FyZCB0eXBlLlxuICogYC5pcy1hY3RpdmVgIGlzIGFkZGVkIHRvIHRoZSBjb3JyZXNwb25kaW5nIHNlbGVjdGVkIGNyZWRpdCBjYXJkIHR5cGUuIGAubm90LWFjdGl2ZWAgaXMgYWRkZWQgZm9yIHRoZSBvdGhlclxuICogdHlwZXMuIElmIG5vIGNyZWRpdCBjYXJkIHR5cGVzIGhhcyBiZWVuIHNlbGVjdGVkLCB0aGVuIG5laXRoZXIgYC5pcy1hY3RpdmVgIGFuZCBgLm5vdC1hY3RpdmVgIHdpbGwgYmUgYWRkZWQgYXQgYWxsLlxuICpcbiAqIEBwYXJhbSBzZWxlY3RlZFR5cGUge1N0cmluZ30gQ3JlZGl0IGNhcmQgdHlwZS4gVmFsaWQgdHlwZXMgYXJlICdWaXNhJywgJ01hc3RlckNhcmQnLCAnRGluZXJzIENsdWInLCAnRGlzY292ZXInLCBhbmQgJ0FtZXJpY2FuIEV4cHJlc3MnXG4gKiBAcGFyYW0gc3VwcG9ydGVkVHlwZXMge0FycmF5fSBBcnJheSBvZiBjcmVkaXQgY2FyZCB0eXBlcyB0byBkaXNwbGF5LiBUaGUgY2FyZCB0eXBlcyB1c2UgdGhlIHNhbWUgc3RyaW5nczogJ0FtZXJpY2FuIEV4cHJlc3MnLCAnRGlzY292ZXInLCAnTWFzdGVyQ2FyZCcsICdWaXNhJ1xuICovXG5hbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQtdHlwZXMuZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC10eXBlcy5jb250cm9sbGVyJyxcbl0pXG4gICAgLmRpcmVjdGl2ZSgnY3JlZGl0Q2FyZFR5cGVzJywgZnVuY3Rpb24gY3JlZGl0Q2FyZFR5cGVzRGlyZWN0aXZlKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDcmVkaXRDYXJkVHlwZXNDdHJsIGFzIGNyZWRpdENhcmRUeXBlc0N0cmwnLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgZ2V0U2VsZWN0ZWRUeXBlOiAnJnNlbGVjdGVkVHlwZScsXG4gICAgICAgICAgICAgICAgZ2V0U3VwcG9ydGVkVHlwZXM6ICcmc3VwcG9ydGVkVHlwZXMnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvanMvYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQtdHlwZXMvY3JlZGl0LWNhcmQtdHlwZXMudHBsLmh0bWwnXG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQtdHlwZXMnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLXR5cGVzLmNvbnN0YW50JyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQtdHlwZXMuY29udHJvbGxlcicsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLXR5cGVzLmRpcmVjdGl2ZScsXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLmRpcmVjdGl2ZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ2Zvcm0nLCBmdW5jdGlvbiBmb3JtRGlyZWN0aXZlKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIGZvcm1MaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2Zvcm0nKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmF0dHIoJ25vdmFsaWRhdGUnLCAnJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBVc2UgZGlzYWJsZS1hdXRvLWZvY3VzPVwidHJ1ZVwiIHRvIHR1cm4gb2ZmIGF1dG9tYXRpYyBlcnJvciBmb2N1c2luZ1xuICAgICAgICAgICAgICAgIGlmICghYXR0cnMuZGlzYWJsZUF1dG9Gb2N1cykge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50Lm9uKCdzdWJtaXQnLCBmdW5jdGlvbiBmb3JtQXV0b0ZvY3VzU3VibWl0SGFuZGxlcigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbnZhbGlkRmllbGQgPSBlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJy5uZy1pbnZhbGlkJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnZhbGlkRmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZhbGlkRmllbGQuZm9jdXMoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEF1dG8tc2VsZWN0IGV4aXN0aW5nIHRleHQgZm9yIGZpZWxkcyB0aGF0IHN1cHBvcnQgaXQgKHRleHQsIGVtYWlsLCBwYXNzd29yZCwgZXRjLilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW52YWxpZEZpZWxkLnNlbGVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZhbGlkRmllbGQuc2VsZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuZm9ybScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS5kaXJlY3RpdmUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWZpZWxkLmRpcmVjdGl2ZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ2Zvcm1GaWVsZCcsIGZ1bmN0aW9uIGZvcm1GaWVsZERpcmVjdGl2ZSgkbG9nKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXF1aXJlOiAnXmZvcm0nLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICAgICAgICBzY29wZTogdHJ1ZSxcbiAgICAgICAgICAgIGxpbms6IHtcbiAgICAgICAgICAgICAgICBwcmU6IGZ1bmN0aW9uIGZvcm1GaWVsZExpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEluaGVyaXRlZCBieSB0aGUgZm9ybS1maWVsZC1lcnJvcnMgZGlyZWN0aXZlIHRvIGF2b2lkIHJlZGVjbGFyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvcGVydHkgPSBhdHRycy5wcm9wZXJ0eTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgcG9zdDogZnVuY3Rpb24gZm9ybUZpZWxkTGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMsIGZvcm1DdHJsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIExvY2F0ZXMgYW5kIHdhdGNoZXMgdGhlIG1hdGNoaW5nIGlucHV0L3NlbGVjdC9ldGMgKGJhc2VkIG9uIGl0cyBuYW1lIGF0dHJpYnV0ZSkgaW4gdGhlIHBhcmVudCBmb3JtXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IGF0dHJzLnByb3BlcnR5O1xuXG4gICAgICAgICAgICAgICAgICAgIGluaXQoKTtcblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnZm9ybS1maWVsZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBhIHByb3BlcnR5IHdhc24ndCBwcm92aWRlZCwgd2UgY2FuJ3QgZG8gbXVjaCBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIGludGVyZmFjZSBpZiB0aGUgZm9ybSBpcyBzdWJtaXR0ZWQgb3IgdGhlIHByb3BlcnR5J3MgdmFsaWRpdHkgc3RhdGUgY2hhbmdlc1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGlzU3VibWl0dGVkLCBjaGVja1ZhbGlkaXR5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaChpc0ludmFsaWQsIGNoZWNrVmFsaWRpdHkpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gY2hlY2tWYWxpZGl0eSgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIGEgcHJvcGVydHkgd2FzIHByb3ZpZGVkLCBidXQgbm8gbmctbW9kZWwgd2FzIGRlZmluZWQgZm9yIHRoZSBmaWVsZCwgdmFsaWRhdGlvbiB3b24ndCB3b3JrXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWhhc01vZGVsKCkgJiYgaXNTdWJtaXR0ZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkbG9nLmluZm8oJ0Zvcm0gZmllbGRzIGNvbnRhaW5pbmcgaW5wdXRzIHdpdGhvdXQgYW4gbmctbW9kZWwgcHJvcGVydHkgd2lsbCBub3QgYmUgdmFsaWRhdGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9ubHkgc2hvdyBhbiBlcnJvciBpZiB0aGUgdXNlciBoYXMgYWxyZWFkeSBhdHRlbXB0ZWQgdG8gc3VibWl0IHRoZSBmb3JtXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnRvZ2dsZUNsYXNzKCdmb3JtLWZpZWxkLS1lcnJvcicsIGlzU3VibWl0dGVkKCkgJiYgaXNJbnZhbGlkKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFzTW9kZWwoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gISFmb3JtQ3RybFtwcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBpc1N1Ym1pdHRlZCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmb3JtQ3RybC4kc3VibWl0dGVkO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gaXNJbnZhbGlkKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFoYXNNb2RlbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm9ybUN0cmxbcHJvcGVydHldLiRpbnZhbGlkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0tZmllbGQnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0tZmllbGQuZGlyZWN0aXZlJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1maWVsZC1lcnJvcicsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0tZmllbGQtZXJyb3JzJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1maWVsZC1lcnJvci5kaXJlY3RpdmUnLCBbXSlcbiAgICAuZGlyZWN0aXZlKCdmb3JtRmllbGRFcnJvcicsIGZ1bmN0aW9uIGZvcm1GaWVsZEVycm9yRGlyZWN0aXZlKCRjb21waWxlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwcmlvcml0eTogMTAsXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9qcy9iaWdjb21tZXJjZS9mb3JtLWZpZWxkLWVycm9yL2Zvcm0tZmllbGQtZXJyb3IudHBsLmh0bWwnLFxuICAgICAgICAgICAgdGVybWluYWw6IHRydWUsXG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gZm9ybUZpZWxkRXJyb3JDb21waWxlKHRFbGVtZW50LCB0QXR0cnMpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgdHJhbnNsYXRlIHByb3BlcnR5IHdpcGVzIG91dCBvdXIgbmctbWVzc2FnZSBsb2dpYyBpbiB0aGUgcG9zdCBsaW5rIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgLy8gVGhlIHByaW9yaXR5IGFuZCB0ZXJtaW5hbCBwcm9wZXJ0aWVzIGFib3ZlIGVuc3VyZSB0aGlzIGNoZWNrIG9jY3Vyc1xuICAgICAgICAgICAgICAgIGlmICh0RWxlbWVudC5hdHRyKCd0cmFuc2xhdGUnKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICdUaGUgdHJhbnNsYXRlIGF0dHJpYnV0ZSBjYW5ub3QgYmUgdXNlZCB3aXRoIHRoZSBmb3JtLWZpZWxkLWVycm9yIGRpcmVjdGl2ZS4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnVXNlIHRoZSB0cmFuc2xhdGUgZmlsdGVyIGluc3RlYWQgKGV4YW1wbGU6IHt7IFwibXkgZXJyb3IgbWVzc2FnZVwiIHwgdHJhbnNsYXRlIH19KS4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnVmFsaWRhdG9yOiAnICsgdEF0dHJzLnZhbGlkYXRlXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zdDogZnVuY3Rpb24gZm9ybUZpZWxkRXJyb3JQb3N0TGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXJzLCB0cmFuc2NsdWRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5wcm9wZXJ0eSA9IHNjb3BlLnByb3BlcnR5IHx8IGF0dHJzLnByb3BlcnR5O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2NsdWRlKGZ1bmN0aW9uIGZvcm1GaWVsZEVycm9yVHJhbnNjbHVkZShlcnJvckNsb25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhYmVsRWxlbWVudCA9IGFuZ3VsYXIuZWxlbWVudCgnPGxhYmVsPicpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmdNZXNzYWdlIGRvZXNuJ3QgcGxheSB3ZWxsIHdpdGggZHluYW1pYyBtZXNzYWdlIGluc2VydGlvbiwgdHJhbnNsYXRpb24sIG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWVzc2FnZSBleHByZXNzaW9ucywgc28gd2UgYnVpbGQgaXRzIGVsZW1lbnQgdXAgaGVyZSBhbmQgaW5qZWN0IGl0IGludG8gdGhlIERPTVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsRWxlbWVudC5hdHRyKCdmb3InLCBzY29wZS5wcm9wZXJ0eSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxFbGVtZW50LmF0dHIoJ25nLW1lc3NhZ2UnLCBhdHRycy52YWxpZGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxFbGVtZW50LmF0dHIoJ3JvbGUnLCAnYWxlcnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbEVsZW1lbnQuYWRkQ2xhc3MoJ2Zvcm0taW5saW5lTWVzc2FnZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIGVycm9yIHNwYW4gc2hvdWxkIGFscmVhZHkgaGF2ZSBhIHRyYW5zbGF0aW9uIHdhdGNoZXIgb24gaXQgYnkgbm93LCB1c2luZyBhIGZpbHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsRWxlbWVudC5hcHBlbmQoZXJyb3JDbG9uZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFwcGVuZChsYWJlbEVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGNvbXBpbGUoZWxlbWVudCkoc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0tZmllbGQtZXJyb3InLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0tZmllbGQtZXJyb3IuZGlyZWN0aXZlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1maWVsZC1lcnJvcnMuZGlyZWN0aXZlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnZm9ybUZpZWxkRXJyb3JzJywgZnVuY3Rpb24gZm9ybUZpZWxkRXJyb3JzRGlyZWN0aXZlKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHJlcXVpcmU6ICdeZm9ybScsXG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL2JpZ2NvbW1lcmNlL2Zvcm0tZmllbGQtZXJyb3JzL2Zvcm0tZmllbGQtZXJyb3JzLnRwbC5odG1sJyxcbiAgICAgICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgICAgICAgICBsaW5rOiB7XG4gICAgICAgICAgICAgICAgLy8gUHJlLWxpbmsgaXMgcmVxdWlyZWQsIGFzIHdlIGhhdmUgdG8gaW5qZWN0IG91ciBzY29wZSBwcm9wZXJ0aWVzIGJlZm9yZSB0aGUgY2hpbGRcbiAgICAgICAgICAgICAgICAvLyBmb3JtLWZpZWxkLWVycm9yIGRpcmVjdGl2ZSAoYW5kIGl0cyBpbnRlcm5hbCBuZy1tZXNzYWdlIGRpcmVjdGl2ZSdzKSBwb3N0LWxpbmsgZnVuY3Rpb25zXG4gICAgICAgICAgICAgICAgcHJlOiBmdW5jdGlvbiBmb3JtRmllbGRFcnJvcnNQcmVMaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycywgZm9ybUN0cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gUHJvcGVydHkgbmFtZSBjYW4gYmUgaW5oZXJpdGVkIGZyb20gcGFyZW50IHNjb3BlLCBzdWNoIGFzIGZyb20gdGhlIGZvcm0tZmllbGQgZGlyZWN0aXZlXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IHNjb3BlLnByb3BlcnR5IHx8IGF0dHJzLnByb3BlcnR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlGaWVsZCA9IGZvcm1DdHJsW3Byb3BlcnR5XTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBJbmhlcml0ZWQgYnkgZm9ybS1maWVsZC1lcnJvciBkaXJlY3RpdmUuIExpdmVzIGRpcmVjdGx5IG9uIHNjb3BlIGJlY2F1c2UgdGhlIHJlcXVpcmVcbiAgICAgICAgICAgICAgICAgICAgLy8gcHJvcGVydHkgZG9lcyBub3Qgd29yayB3ZWxsIHdpdGggZGlyZWN0aXZlIGNvbnRyb2xsZXIgaW5zdGFuY2VzXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmZvcm1DdHJsID0gZm9ybUN0cmw7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnByb3BlcnR5ID0gcHJvcGVydHk7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnByb3BlcnR5RmllbGQgPSBwcm9wZXJ0eUZpZWxkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWZpZWxkLWVycm9ycycsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1maWVsZC1lcnJvcnMuZGlyZWN0aXZlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1pbnB1dC1jb2xvci5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignRm9ybUlucHV0Q29sb3JDdHJsJywgZnVuY3Rpb24oJGVsZW1lbnQsICRyb290U2NvcGUsICRzY29wZSkge1xuICAgICAgICBjb25zdCBjdHJsID0gdGhpcztcbiAgICAgICAgY29uc3QgaGV4Q29sb3JSZWdleCA9IC9eIygoWzAtOWEtZkEtRl17Mn0pezN9fChbMC05YS1mQS1GXSl7M30pJC87XG5cbiAgICAgICAgbGV0IGlzVmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgIGN0cmwuYmx1ckV2ZW50SGFuZGxlciA9IGJsdXJFdmVudEhhbmRsZXI7XG4gICAgICAgIGN0cmwuZm9jdXNFdmVudEhhbmRsZXIgPSBmb2N1c0V2ZW50SGFuZGxlcjtcbiAgICAgICAgY3RybC5oaWRlUGlja2VyID0gaGlkZVBpY2tlcjtcbiAgICAgICAgY3RybC5pc1BpY2tlclZpc2libGUgPSBpc1BpY2tlclZpc2libGU7XG4gICAgICAgIGN0cmwub25DaGFuZ2UgPSBvbkNoYW5nZTtcbiAgICAgICAgY3RybC5zZXRNb2RlbEN0cmwgPSBzZXRNb2RlbEN0cmw7XG4gICAgICAgIGN0cmwuc2hvd1BpY2tlciA9IHNob3dQaWNrZXI7XG4gICAgICAgIGN0cmwudW5pcXVlSWQgPSBnZXRVbmlxdWVJRCgnZm9ybUlucHV0Q29sb3ItJyk7XG5cbiAgICAgICAgJHNjb3BlLiRvbignYmNDb2xvclBpY2tlck9wZW5lZCcsIChldmVudCwgdHJpZ2dlcmluZ0VsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIGlmICgkZWxlbWVudCA9PT0gdHJpZ2dlcmluZ0VsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGN0cmwuaGlkZVBpY2tlcigpO1xuICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBibHVyRXZlbnRIYW5kbGVyKCRldmVudCkge1xuICAgICAgICAgICAgaWYgKCRlbGVtZW50WzBdLmNvbnRhaW5zKCRldmVudC5yZWxhdGVkVGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3RybC5oaWRlUGlja2VyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmb2N1c0V2ZW50SGFuZGxlcigkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY3RybC5zaG93UGlja2VyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRVbmlxdWVJRChpZFByZWZpeCkge1xuICAgICAgICAgICAgcmV0dXJuIF8udW5pcXVlSWQoaWRQcmVmaXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaGlkZVBpY2tlcigpIHtcbiAgICAgICAgICAgIGlmIChjdHJsLmlzUGlja2VyVmlzaWJsZSgpKSB7XG4gICAgICAgICAgICAgICAgY3RybC5pc1BpY2tlclZpc2libGUoZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNQaWNrZXJWaXNpYmxlKGlzVmlzaWJsZVRvU2V0KSB7XG4gICAgICAgICAgICBpZiAoaXNWaXNpYmxlVG9TZXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlzVmlzaWJsZSA9IGlzVmlzaWJsZVRvU2V0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gaXNWaXNpYmxlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb25DaGFuZ2UoKSB7XG4gICAgICAgICAgICBpZiAoaGV4Q29sb3JSZWdleC50ZXN0KGN0cmwuY29sb3IpKSB7XG4gICAgICAgICAgICAgICAgY3RybC5sYXN0VmFsaWRDb2xvciA9IGN0cmwuY29sb3I7XG4gICAgICAgICAgICAgICAgY3RybC5uZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKGN0cmwuY29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICAgICAgY3RybC5jb2xvciA9IGN0cmwubmdNb2RlbEN0cmwuJHZpZXdWYWx1ZTtcbiAgICAgICAgICAgIGN0cmwubGFzdFZhbGlkQ29sb3IgPSBjdHJsLmNvbG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0TW9kZWxDdHJsKG5nTW9kZWxDdHJsKSB7XG4gICAgICAgICAgICBjdHJsLm5nTW9kZWxDdHJsID0gbmdNb2RlbEN0cmw7XG4gICAgICAgICAgICBjdHJsLm5nTW9kZWxDdHJsLiRyZW5kZXIgPSByZW5kZXI7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzaG93UGlja2VyKCkge1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdiY0NvbG9yUGlja2VyT3BlbmVkJywgJGVsZW1lbnQpO1xuICAgICAgICAgICAgY3RybC5pc1BpY2tlclZpc2libGUodHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWlucHV0LWNvbG9yLmRpcmVjdGl2ZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1pbnB1dC1jb2xvci5jb250cm9sbGVyJyxcbl0pXG5cbiAgICAuZGlyZWN0aXZlKCdmb3JtSW5wdXRDb2xvcicsIGZ1bmN0aW9uIGZvcm1JbnB1dENvbG9yRGlyZWN0aXZlKCRkb2N1bWVudCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdGb3JtSW5wdXRDb2xvckN0cmwnLFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnZm9ybUlucHV0Q29sb3JDdHJsJyxcbiAgICAgICAgICAgIHJlcXVpcmU6IFsnZm9ybUlucHV0Q29sb3InLCAnXm5nTW9kZWwnXSxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIGxhYmVsVGV4dDogJz0nLFxuICAgICAgICAgICAgICAgIHBhbGV0dGU6ICc9JyxcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlclRleHQ6ICc9JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9qcy9iaWdjb21tZXJjZS9mb3JtLWlucHV0LWNvbG9yL2Zvcm0taW5wdXQtY29sb3IudHBsLmh0bWwnLFxuXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiBmb3JtSW5wdXRDb2xvckRpcmVjdGl2ZUNvbXBpbGUodEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0RWxlbWVudC5hZGRDbGFzcygnZm9ybS1pbnB1dENvbG9yJyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gZm9ybUlucHV0Q29sb3JEaXJlY3RpdmVMaW5rKCRzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmxzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN0cmwgPSBjdHJsc1swXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmdNb2RlbEN0cmwgPSBjdHJsc1sxXTtcblxuICAgICAgICAgICAgICAgICAgICBjdHJsLnNldE1vZGVsQ3RybChuZ01vZGVsQ3RybCk7XG5cbiAgICAgICAgICAgICAgICAgICAgJGRvY3VtZW50Lm9uKCdrZXlkb3duJywga2V5ZG93bkV2ZW50SGFuZGxlcik7XG4gICAgICAgICAgICAgICAgICAgICRkb2N1bWVudC5vbignbW91c2Vkb3duJywgbW91c2VEb3duRXZlbnRIYW5kbGVyKTtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJG9uKCckZGVzdHJveScsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRkb2N1bWVudC5vZmYoJ21vdXNlZG93bicsIG1vdXNlRG93bkV2ZW50SGFuZGxlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZG9jdW1lbnQub2ZmKCdrZXlkb3duJywga2V5ZG93bkV2ZW50SGFuZGxlcik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGtleWRvd25FdmVudEhhbmRsZXIgKCRldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRldmVudC53aGljaCA9PT0gMjcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RybC5oaWRlUGlja2VyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBtb3VzZURvd25FdmVudEhhbmRsZXIoJGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudFswXS5jb250YWlucygkZXZlbnQudGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0cmwuaGlkZVBpY2tlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWlucHV0LWNvbG9yJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWlucHV0LWNvbG9yLmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmh0bWw1TW9kZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuaHRtbDVNb2RlLnNlcnZpY2UnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5odG1sNU1vZGUuc2VydmljZScsIFtdKVxuICAgIC5wcm92aWRlcignaHRtbDVNb2RlJywgZnVuY3Rpb24gaHRtbDVNb2RlUHJvdmlkZXIoJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgICAgICAgdGhpcy4kZ2V0ID0gZnVuY3Rpb24gaHRtbDVNb2RlU2VydmljZSgpIHtcbiAgICAgICAgICAgIHJldHVybiAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoKTtcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5pY29uLmNvbnRyb2xsZXInLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmh0bWw1TW9kZScsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmljb24uc3ZnUm9vdFBhdGgnXG5dKVxuICAgIC5jb250cm9sbGVyKCdJY29uQ3RybCcsIGZ1bmN0aW9uIGljb25EaXJlY3RpdmVDb250cm9sbGVyKCRodHRwLCAkbG9jYXRpb24sICR0ZW1wbGF0ZUNhY2hlLCBodG1sNU1vZGUsIHN2Z1Jvb3RQYXRoKSB7XG4gICAgICAgIGNvbnN0IGFic1VybCA9ICRsb2NhdGlvbi5hYnNVcmwoKTtcbiAgICAgICAgY29uc3QgY3RybCA9IHRoaXM7XG5cbiAgICAgICAgY3RybC5jaGFuZ2VVcmxzVG9BYnNvbHV0ZSA9IGNoYW5nZVVybHNUb0Fic29sdXRlO1xuICAgICAgICBjdHJsLmNoYW5nZVhsaW5rc1RvQWJzb2x1dGUgPSBjaGFuZ2VYbGlua3NUb0Fic29sdXRlO1xuICAgICAgICBjdHJsLnVwZGF0ZUdseXBoID0gdXBkYXRlR2x5cGg7XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlR2x5cGgoZ2x5cGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGZ1bGxTdmdQYXRoID0gc3ZnUm9vdFBhdGggKyBnbHlwaCArICcuc3ZnJztcblxuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChmdWxsU3ZnUGF0aCwgeyBjYWNoZTogJHRlbXBsYXRlQ2FjaGUgfSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiBpY29uRGlyZWN0aXZlSHR0cFN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0cmluZ2lmaWVkRWxlbWVudCA9IHJlc3BvbnNlLmRhdGE7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGh0bWw1TW9kZS5lbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmdpZmllZEVsZW1lbnQgPSBjaGFuZ2VVcmxzVG9BYnNvbHV0ZShzdHJpbmdpZmllZEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5naWZpZWRFbGVtZW50ID0gY2hhbmdlWGxpbmtzVG9BYnNvbHV0ZShzdHJpbmdpZmllZEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0cmluZ2lmaWVkRWxlbWVudDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNoYW5nZVVybHNUb0Fic29sdXRlKHN0cmluZ2lmaWVkRWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0cmluZ2lmaWVkRWxlbWVudC5yZXBsYWNlKC91cmxcXCgoWydcIl0/KSMvZ2ksICd1cmwoJDEnICsgYWJzVXJsICsgJyMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNoYW5nZVhsaW5rc1RvQWJzb2x1dGUoc3RyaW5naWZpZWRFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyaW5naWZpZWRFbGVtZW50LnJlcGxhY2UoL3hsaW5rOmhyZWY9KFsnXCJdPykjL2dpLCAneGxpbms6aHJlZj0kMScgKyBhYnNVcmwgKyAnIycpO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCIvKipcbiAqIEBkZXNjcmlwdGlvbiBJY29uIGRpcmVjdGl2ZSB1c2VkIHRvIGxvYWQgYW4gaW5saW5lIHN2ZyBpY29uLCBzaW1saWFyIHRvIGljb25cbiAqICAgICAgICAgICAgICBmb250IG1ldGhvZHMgb2YgcGFzdCA8aSBjbGFzcz1cImljb24tZm9vLWJhclwiPjwvaT5cbiAqIEBleGFtcGxlXG4gKiA8aWNvbiBnbHlwaD1cImljLWFkZC1jaXJjbGVcIj48L2ljb24+XG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5pY29uLmRpcmVjdGl2ZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuaWNvbi5jb250cm9sbGVyJ1xuXSlcbiAgICAuZGlyZWN0aXZlKCdpY29uJywgZnVuY3Rpb24gaWNvbkRpcmVjdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnSWNvbkN0cmwgYXMgaWNvbkN0cmwnLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgZ2x5cGg6ICdAJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGljb25EaXJlY3RpdmVDb21waWxlKHRFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdEVsZW1lbnQuYWRkQ2xhc3MoJ2ljb24nKTtcbiAgICAgICAgICAgICAgICB0RWxlbWVudC5hdHRyKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGljb25EaXJlY3RpdmVMaW5rKCRzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCgnaWNvbkN0cmwuZ2x5cGgnLCBmdW5jdGlvbiBpY29uRGlyZWN0aXZlTGlua1dhdGNoKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHJsLnVwZGF0ZUdseXBoKG5ld1ZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIGljb25VcGRhdGVHbHlwaFRoZW4oc3ZnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuaHRtbChzdmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmljb24nLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmljb24uZGlyZWN0aXZlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuaWNvbi5zdmdSb290UGF0aCcsIFtdKVxuICAgIC5wcm92aWRlcignc3ZnUm9vdFBhdGgnLCBmdW5jdGlvbiBzdmdSb290UGF0aFByb3ZpZGVyQ29uZmlnKCkge1xuICAgICAgICB0aGlzLnNldFJvb3RQYXRoID0gc2V0Um9vdFBhdGg7XG4gICAgICAgIHRoaXMuJGdldCA9IGZ1bmN0aW9uIHN2Z1Jvb3RQYXRoUHJvdmlkZXJHZXQoJGxvZykge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3ZnUm9vdFBhdGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICRsb2cuZXJyb3IoJ05vIHN2Z1Jvb3RQYXRoIHByb3ZpZGVkLiBQbGVhc2UgY29uZmlndXJlIHRoaXMgdXNpbmcgdGhlIHN2Z1Jvb3RQYXRoUHJvdmlkZXInKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ZnUm9vdFBhdGg7XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0Um9vdFBhdGgobmV3Um9vdFBhdGgpIHtcbiAgICAgICAgICAgIHRoaXMuc3ZnUm9vdFBhdGggPSBuZXdSb290UGF0aDtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmxvYWRpbmctbm90aWZpY2F0aW9uLmRpcmVjdGl2ZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ2xvYWRpbmdOb3RpZmljYXRpb24nLCBmdW5jdGlvbiBsb2FkaW5nTm90aWZpY2F0aW9uRGlyZWN0aXZlKCRyb290U2NvcGUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9qcy9iaWdjb21tZXJjZS9sb2FkaW5nLW5vdGlmaWNhdGlvbi9sb2FkaW5nLW5vdGlmaWNhdGlvbi50cGwuaHRtbCcsXG5cbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJ2FqYXhSZXF1ZXN0UnVubmluZycsIGZ1bmN0aW9uKGV2ZW50LCB2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucmVxdWVzdEluUHJvZ3Jlc3MgPSB2YWw7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIubG9hZGluZy1ub3RpZmljYXRpb24nLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmxvYWRpbmctbm90aWZpY2F0aW9uLmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmxvYWRpbmctb3ZlcmxheS5jb250cm9sbGVyJywgW10pXG4gICAgLmNvbnRyb2xsZXIoJ0xvYWRpbmdPdmVybGF5Q3RybCcsIGZ1bmN0aW9uIExvYWRpbmdPdmVybGF5Q3RybCgkcm9vdFNjb3BlLCAkdGltZW91dCkge1xuICAgICAgICB2YXIgY3RybCA9IHRoaXMsXG4gICAgICAgICAgICBkZWZhdWx0RGVib3VuY2UgPSAxMDAsXG4gICAgICAgICAgICB0aW1lb3V0O1xuXG4gICAgICAgIGlmIChjdHJsLmRlYm91bmNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGN0cmwuZGVib3VuY2UgPSBkZWZhdWx0RGVib3VuY2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3RybC51c2VVaVJvdXRlcikge1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0Jywgc3RhcnRMb2FkaW5nKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgc3RvcExvYWRpbmcpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZUVycm9yJywgc3RvcExvYWRpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc3RhcnRMb2FkaW5nKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGltZW91dCA9ICR0aW1lb3V0KGZ1bmN0aW9uIHN0YXJ0TG9hZGluZ1RpbWVyKCkge1xuICAgICAgICAgICAgICAgIGN0cmwubG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICB9LCBjdHJsLmRlYm91bmNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHN0b3BMb2FkaW5nKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVvdXQpO1xuICAgICAgICAgICAgY3RybC5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5sb2FkaW5nLW92ZXJsYXkuZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5sb2FkaW5nLW92ZXJsYXkuY29udHJvbGxlcidcbl0pXG4gICAgLmRpcmVjdGl2ZSgnbG9hZGluZ092ZXJsYXknLCBmdW5jdGlvbiBsb2FkaW5nT3ZlcmxheSgkY29tcGlsZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2FkaW5nT3ZlcmxheUN0cmwgYXMgbG9hZGluZ092ZXJsYXlDdHJsJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIGRlYm91bmNlOiAnPT8nLFxuICAgICAgICAgICAgICAgIGxvYWRpbmc6ICc9P2xvYWRpbmdPdmVybGF5JyxcbiAgICAgICAgICAgICAgICB1c2VVaVJvdXRlcjogJz0/J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGxvYWRpbmdPdmVybGF5Q29tcGlsZShlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnbG9hZGluZ092ZXJsYXktY29udGFpbmVyJyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gbG9hZGluZ092ZXJsYXlMaW5rKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG92ZXJsYXkgPSAkY29tcGlsZSgnPGRpdiBjbGFzcz1cImxvYWRpbmdPdmVybGF5XCIgbmctaWY9XCJsb2FkaW5nT3ZlcmxheUN0cmwubG9hZGluZ1wiPjwvZGl2PicpKHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hcHBlbmQob3ZlcmxheSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5sb2FkaW5nLW92ZXJsYXknLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmxvYWRpbmctb3ZlcmxheS5kaXJlY3RpdmUnXG5dKTtcbiIsIi8qXG4gKiBPdmVycmlkZSBhbmd1bGFyIGZvdW5kYXRpb24ncyAkbW9kYWxTdGFjayBzZXJ2aWNlIHRvIHJlbW92ZSB0aGUgYHRvcGAgY3NzIHByb3BlcnR5LlxuICogY2Fubm90IHVzZSBhIGRlY29yYXRvciBiZWNhdXNlIHRoZSBgb3BlbmAgcmVsaWVzIG9uIGNsb3N1cmVzIGFuZCBkb2VzIG5vdCByZXR1cm4gdGhlIGNvbXBpbGVkIGVsZW1lbnQuXG4gKiBDaGFuZ2VzIGFyZSBiZXR3ZWVuIGAvLyBDaGFuZ2VzYCBjb21tZW50c1xuKi9cbmFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1tb2RhbC5tb2RhbFN0YWNrLnNlcnZpY2UnLCBbXG5cbl0pXG4gIC5mYWN0b3J5KCckbW9kYWxTdGFjaycsIFsnJHdpbmRvdycsICckdHJhbnNpdGlvbicsICckdGltZW91dCcsICckZG9jdW1lbnQnLCAnJGNvbXBpbGUnLCAnJHJvb3RTY29wZScsICckJHN0YWNrZWRNYXAnLFxuICAgIGZ1bmN0aW9uICgkd2luZG93LCAkdHJhbnNpdGlvbiwgJHRpbWVvdXQsICRkb2N1bWVudCwgJGNvbXBpbGUsICRyb290U2NvcGUsICQkc3RhY2tlZE1hcCkge1xuICAgICAgLy8gQ2hhbmdlczogY2hhbmdlIGZyb20gYG1vZGFsLW9wZW5gIHRvIGBoYXMtYWN0aXZlTW9kYWxgXG4gICAgICB2YXIgT1BFTkVEX01PREFMX0NMQVNTID0gJ2hhcy1hY3RpdmVNb2RhbCc7XG4gICAgICAvLyBDaGFuZ2VzXG5cbiAgICAgIHZhciBiYWNrZHJvcERvbUVsLCBiYWNrZHJvcFNjb3BlO1xuICAgICAgdmFyIG9wZW5lZFdpbmRvd3MgPSAkJHN0YWNrZWRNYXAuY3JlYXRlTmV3KCk7XG4gICAgICB2YXIgJG1vZGFsU3RhY2sgPSB7fTtcblxuICAgICAgZnVuY3Rpb24gYmFja2Ryb3BJbmRleCgpIHtcbiAgICAgICAgdmFyIHRvcEJhY2tkcm9wSW5kZXggPSAtMTtcbiAgICAgICAgdmFyIG9wZW5lZCA9IG9wZW5lZFdpbmRvd3Mua2V5cygpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9wZW5lZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChvcGVuZWRXaW5kb3dzLmdldChvcGVuZWRbaV0pLnZhbHVlLmJhY2tkcm9wKSB7XG4gICAgICAgICAgICB0b3BCYWNrZHJvcEluZGV4ID0gaTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRvcEJhY2tkcm9wSW5kZXg7XG4gICAgICB9XG5cbiAgICAgICRyb290U2NvcGUuJHdhdGNoKGJhY2tkcm9wSW5kZXgsIGZ1bmN0aW9uKG5ld0JhY2tkcm9wSW5kZXgpe1xuICAgICAgICBpZiAoYmFja2Ryb3BTY29wZSkge1xuICAgICAgICAgIGJhY2tkcm9wU2NvcGUuaW5kZXggPSBuZXdCYWNrZHJvcEluZGV4O1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgZnVuY3Rpb24gcmVtb3ZlTW9kYWxXaW5kb3cobW9kYWxJbnN0YW5jZSkge1xuICAgICAgICB2YXIgYm9keSA9ICRkb2N1bWVudC5maW5kKCdib2R5JykuZXEoMCk7XG4gICAgICAgIHZhciBtb2RhbFdpbmRvdyA9IG9wZW5lZFdpbmRvd3MuZ2V0KG1vZGFsSW5zdGFuY2UpLnZhbHVlO1xuXG4gICAgICAgIC8vY2xlYW4gdXAgdGhlIHN0YWNrXG4gICAgICAgIG9wZW5lZFdpbmRvd3MucmVtb3ZlKG1vZGFsSW5zdGFuY2UpO1xuXG4gICAgICAgIC8vcmVtb3ZlIHdpbmRvdyBET00gZWxlbWVudFxuICAgICAgICByZW1vdmVBZnRlckFuaW1hdGUobW9kYWxXaW5kb3cubW9kYWxEb21FbCwgbW9kYWxXaW5kb3cubW9kYWxTY29wZSwgMzAwLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBtb2RhbFdpbmRvdy5tb2RhbFNjb3BlLiRkZXN0cm95KCk7XG4gICAgICAgICAgYm9keS50b2dnbGVDbGFzcyhPUEVORURfTU9EQUxfQ0xBU1MsIG9wZW5lZFdpbmRvd3MubGVuZ3RoKCkgPiAwKTtcbiAgICAgICAgICBjaGVja1JlbW92ZUJhY2tkcm9wKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBjaGVja1JlbW92ZUJhY2tkcm9wKCkge1xuICAgICAgICAvL3JlbW92ZSBiYWNrZHJvcCBpZiBubyBsb25nZXIgbmVlZGVkXG4gICAgICAgIGlmIChiYWNrZHJvcERvbUVsICYmIGJhY2tkcm9wSW5kZXgoKSA9PSAtMSkge1xuICAgICAgICAgIHZhciBiYWNrZHJvcFNjb3BlUmVmID0gYmFja2Ryb3BTY29wZTtcbiAgICAgICAgICByZW1vdmVBZnRlckFuaW1hdGUoYmFja2Ryb3BEb21FbCwgYmFja2Ryb3BTY29wZSwgMTUwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBiYWNrZHJvcFNjb3BlUmVmLiRkZXN0cm95KCk7XG4gICAgICAgICAgICBiYWNrZHJvcFNjb3BlUmVmID0gbnVsbDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBiYWNrZHJvcERvbUVsID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGJhY2tkcm9wU2NvcGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcmVtb3ZlQWZ0ZXJBbmltYXRlKGRvbUVsLCBzY29wZSwgZW11bGF0ZVRpbWUsIGRvbmUpIHtcbiAgICAgICAgLy8gQ2xvc2luZyBhbmltYXRpb25cbiAgICAgICAgc2NvcGUuYW5pbWF0ZSA9IGZhbHNlO1xuXG4gICAgICAgIHZhciB0cmFuc2l0aW9uRW5kRXZlbnROYW1lID0gJHRyYW5zaXRpb24udHJhbnNpdGlvbkVuZEV2ZW50TmFtZTtcbiAgICAgICAgaWYgKHRyYW5zaXRpb25FbmRFdmVudE5hbWUpIHtcbiAgICAgICAgICAvLyB0cmFuc2l0aW9uIG91dFxuICAgICAgICAgIHZhciB0aW1lb3V0ID0gJHRpbWVvdXQoYWZ0ZXJBbmltYXRpbmcsIGVtdWxhdGVUaW1lKTtcblxuICAgICAgICAgIGRvbUVsLmJpbmQodHJhbnNpdGlvbkVuZEV2ZW50TmFtZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHRpbWVvdXQuY2FuY2VsKHRpbWVvdXQpO1xuICAgICAgICAgICAgYWZ0ZXJBbmltYXRpbmcoKTtcbiAgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEVuc3VyZSB0aGlzIGNhbGwgaXMgYXN5bmNcbiAgICAgICAgICAkdGltZW91dChhZnRlckFuaW1hdGluZywgMCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhZnRlckFuaW1hdGluZygpIHtcbiAgICAgICAgICBpZiAoYWZ0ZXJBbmltYXRpbmcuZG9uZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBhZnRlckFuaW1hdGluZy5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIGRvbUVsLnJlbW92ZSgpO1xuICAgICAgICAgIGlmIChkb25lKSB7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgICRkb2N1bWVudC5iaW5kKCdrZXlkb3duJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICB2YXIgbW9kYWw7XG5cbiAgICAgICAgaWYgKGV2dC53aGljaCA9PT0gMjcpIHtcbiAgICAgICAgICBtb2RhbCA9IG9wZW5lZFdpbmRvd3MudG9wKCk7XG4gICAgICAgICAgaWYgKG1vZGFsICYmIG1vZGFsLnZhbHVlLmtleWJvYXJkKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICRtb2RhbFN0YWNrLmRpc21pc3MobW9kYWwua2V5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgICRtb2RhbFN0YWNrLm9wZW4gPSBmdW5jdGlvbiAobW9kYWxJbnN0YW5jZSwgbW9kYWwpIHtcblxuICAgICAgICBvcGVuZWRXaW5kb3dzLmFkZChtb2RhbEluc3RhbmNlLCB7XG4gICAgICAgICAgZGVmZXJyZWQ6IG1vZGFsLmRlZmVycmVkLFxuICAgICAgICAgIG1vZGFsU2NvcGU6IG1vZGFsLnNjb3BlLFxuICAgICAgICAgIGJhY2tkcm9wOiBtb2RhbC5iYWNrZHJvcCxcbiAgICAgICAgICBrZXlib2FyZDogbW9kYWwua2V5Ym9hcmRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGJvZHkgPSAkZG9jdW1lbnQuZmluZCgnYm9keScpLmVxKDApLFxuICAgICAgICAgICAgY3VyckJhY2tkcm9wSW5kZXggPSBiYWNrZHJvcEluZGV4KCk7XG5cbiAgICAgICAgaWYgKGN1cnJCYWNrZHJvcEluZGV4ID49IDAgJiYgIWJhY2tkcm9wRG9tRWwpIHtcbiAgICAgICAgICBiYWNrZHJvcFNjb3BlID0gJHJvb3RTY29wZS4kbmV3KHRydWUpO1xuICAgICAgICAgIGJhY2tkcm9wU2NvcGUuaW5kZXggPSBjdXJyQmFja2Ryb3BJbmRleDtcbiAgICAgICAgICBiYWNrZHJvcERvbUVsID0gJGNvbXBpbGUoJzxkaXYgbW9kYWwtYmFja2Ryb3A+PC9kaXY+JykoYmFja2Ryb3BTY29wZSk7XG4gICAgICAgICAgYm9keS5hcHBlbmQoYmFja2Ryb3BEb21FbCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGFuZ2VzOiBkZWxldGlvbiBvZiBjc3MgdG9wIHByb3BlcnR5IGNhbGN1bGF0aW9uXG4gICAgICAgIHZhciBhbmd1bGFyRG9tRWwgPSBhbmd1bGFyLmVsZW1lbnQoJzxkaXYgbW9kYWwtd2luZG93IHN0eWxlPVwidmlzaWJpbGl0eTogdmlzaWJsZTsgZGlzcGxheTogYmxvY2tcIj48L2Rpdj4nKTtcbiAgICAgICAgYW5ndWxhckRvbUVsLmF0dHIoJ3dpbmRvdy1jbGFzcycsIG1vZGFsLndpbmRvd0NsYXNzKTtcbiAgICAgICAgYW5ndWxhckRvbUVsLmF0dHIoJ2luZGV4Jywgb3BlbmVkV2luZG93cy5sZW5ndGgoKSAtIDEpO1xuICAgICAgICBhbmd1bGFyRG9tRWwuYXR0cignYW5pbWF0ZScsICdhbmltYXRlJyk7XG4gICAgICAgIGFuZ3VsYXJEb21FbC5odG1sKG1vZGFsLmNvbnRlbnQpO1xuXG4gICAgICAgIHZhciBtb2RhbERvbUVsID0gJGNvbXBpbGUoYW5ndWxhckRvbUVsKShtb2RhbC5zY29wZSk7XG4gICAgICAgIG9wZW5lZFdpbmRvd3MudG9wKCkudmFsdWUubW9kYWxEb21FbCA9IG1vZGFsRG9tRWw7XG4gICAgICAgIGJvZHkuYXBwZW5kKG1vZGFsRG9tRWwpO1xuICAgICAgICBib2R5LmFkZENsYXNzKE9QRU5FRF9NT0RBTF9DTEFTUyk7XG4gICAgICB9O1xuXG4gICAgICAkbW9kYWxTdGFjay5jbG9zZSA9IGZ1bmN0aW9uIChtb2RhbEluc3RhbmNlLCByZXN1bHQpIHtcbiAgICAgICAgdmFyIG1vZGFsV2luZG93ID0gb3BlbmVkV2luZG93cy5nZXQobW9kYWxJbnN0YW5jZSkudmFsdWU7XG4gICAgICAgIGlmIChtb2RhbFdpbmRvdykge1xuICAgICAgICAgIG1vZGFsV2luZG93LmRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICByZW1vdmVNb2RhbFdpbmRvdyhtb2RhbEluc3RhbmNlKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgJG1vZGFsU3RhY2suZGlzbWlzcyA9IGZ1bmN0aW9uIChtb2RhbEluc3RhbmNlLCByZWFzb24pIHtcbiAgICAgICAgdmFyIG1vZGFsV2luZG93ID0gb3BlbmVkV2luZG93cy5nZXQobW9kYWxJbnN0YW5jZSkudmFsdWU7XG4gICAgICAgIGlmIChtb2RhbFdpbmRvdykge1xuICAgICAgICAgIG1vZGFsV2luZG93LmRlZmVycmVkLnJlamVjdChyZWFzb24pO1xuICAgICAgICAgIHJlbW92ZU1vZGFsV2luZG93KG1vZGFsSW5zdGFuY2UpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAkbW9kYWxTdGFjay5kaXNtaXNzQWxsID0gZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICB2YXIgdG9wTW9kYWwgPSB0aGlzLmdldFRvcCgpO1xuICAgICAgICB3aGlsZSAodG9wTW9kYWwpIHtcbiAgICAgICAgICB0aGlzLmRpc21pc3ModG9wTW9kYWwua2V5LCByZWFzb24pO1xuICAgICAgICAgIHRvcE1vZGFsID0gdGhpcy5nZXRUb3AoKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgJG1vZGFsU3RhY2suZ2V0VG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gb3BlbmVkV2luZG93cy50b3AoKTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiAkbW9kYWxTdGFjaztcbiAgICB9XSk7XG5cbiIsIi8qXG4gKiBUaGlzIG1vZHVsZSBtb2RpZmllcyBhbmd1bGFyIGZvdW5kYXRpb24ncyBtb2RhbCBpbXBsZW1lbnRhdGlvbi4gVGhpcyBkb2VzIG5vdCBjcmVhdGUgYSBuZXcgbW9kYWwgc2VydmljZS9kaXJlY3RpdmUuXG4gKlxuKi9cbmFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1tb2RhbCcsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtbW9kYWwubW9kYWxTdGFjay5zZXJ2aWNlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuc2VydmljZXMuZGV2aWNlLnNlcnZpY2UnLCBbXSlcbiAgICAuZmFjdG9yeSgnZGV2aWNlU2VydmljZScsIGZ1bmN0aW9uIGRldmljZVNlcnZpY2UoJHdpbmRvdykge1xuICAgICAgICBjb25zdCBzZXJ2aWNlID0ge1xuICAgICAgICAgICAgaXNJT1NEZXZpY2UsXG4gICAgICAgICAgICBpc01hY09TRGV2aWNlLFxuICAgICAgICAgICAgaXNNb2JpbGVEZXZpY2VcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBpc0lPU0RldmljZSgpIHtcbiAgICAgICAgICAgIGNvbnN0IGRldmljZUxpc3QgPSBbJ2lwYWQnLCAnaXBob25lJ107XG4gICAgICAgICAgICBjb25zdCB1YSA9ICR3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgICByZXR1cm4gXy5zb21lKGRldmljZUxpc3QsIChkZXZpY2UpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXy5jb250YWlucyh1YSwgZGV2aWNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNNb2JpbGVEZXZpY2UoKSB7XG4gICAgICAgICAgICByZXR1cm4gL01vYmkvaS50ZXN0KCR3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc01hY09TRGV2aWNlKCkge1xuICAgICAgICAgICAgcmV0dXJuIC9NYWMvaS50ZXN0KCR3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VydmljZTtcbiAgICB9KTsiLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuc2VydmljZXMnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLnNlcnZpY2VzLmRldmljZS5zZXJ2aWNlJ1xuXSk7XG4iLCIvKipcbiAqIEBkZXNjcmlwdGlvbiBTcHJpdGUgZGlyZWN0aXZlIHVzZWQgdG8gbG9hZCBhbiBpY29uIGZyb20gYW4gaW1hZ2Ugc3ByaXRlLFxuICogICAgICAgICAgICAgIHNpbWxpYXIgdG8gdGhlIGljb24gZGlyZWN0aXZlIGJ1dCBsZXNzIFNWR1xuICogQGV4YW1wbGVcbiAqIDxzcHJpdGUgZ2x5cGg9XCJpYy1hbWV4XCI+PC9zcHJpdGU+XG4gKi9cblxuYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLnNwcml0ZS5kaXJlY3RpdmUnLCBbXSlcbiAgICAuZGlyZWN0aXZlKCdzcHJpdGUnLCBmdW5jdGlvbiBzcHJpdGVEaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBnbHlwaDogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29tcGlsZTogc3ByaXRlRGlyZWN0aXZlQ29tcGlsZVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIHNwcml0ZURpcmVjdGl2ZUNvbXBpbGUodEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRFbGVtZW50LmFkZENsYXNzKCdzcHJpdGUnKTtcbiAgICAgICAgICAgIHRFbGVtZW50LmF0dHIoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBzcHJpdGVEaXJlY3RpdmVMaW5rKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICBhdHRycy4kb2JzZXJ2ZSgnZ2x5cGgnLCAobmV3VmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyKCdjbGFzcycsICdzcHJpdGUgc3ByaXRlLS0nICsgbmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLnNwcml0ZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuc3ByaXRlLmRpcmVjdGl2ZSdcbl0pO1xuIiwiLyoqXG4gKiBAZGVzY3JpcHRpb24gVXNlZCB0byBjcmVhdGUgYSB0b2dnbGUgc3dpdGNoIGZvciBmb3Jtc1xuICogQGV4YW1wbGVcbiAgICA8c3dpdGNoIG5nLW1vZGVsPVwiY3RybC5zd2l0Y2hNb2RlbDFcIj48L3N3aXRjaD5cblxuICAgIDxzd2l0Y2hcbiAgICAgICAgdG9nZ2xlLW9mZi10ZXh0PVwiT2ZmXCJcbiAgICAgICAgdG9nZ2xlLW9uLXRleHQ9XCJPblwiXG4gICAgICAgIG5nLW1vZGVsPVwiY3RybC5zd2l0Y2hNb2RlbDJcIj5cbiAgICA8L3N3aXRjaD5cblxuICAgIDxzd2l0Y2hcbiAgICAgICAgaGFzLWljb25cbiAgICAgICAgbmctbW9kZWw9XCJjdHJsLnN3aXRjaE1vZGVsM1wiPlxuICAgIDwvc3dpdGNoPlxuXG4gICAgPHN3aXRjaFxuICAgICAgICBpcy1pbXBvcnRhbnRcbiAgICAgICAgbGVmdC1sYWJlbD1cIkRvd24gZm9yIE1haW50ZW5hbmNlXCJcbiAgICAgICAgcmlnaHQtbGFiZWw9XCJPcGVuXCJcbiAgICAgICAgbmctbW9kZWw9XCJjdHJsLnN3aXRjaE1vZGVsNFwiPlxuICAgIDwvc3dpdGNoPlxuICovXG5hbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuc3dpdGNoLmRpcmVjdGl2ZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ3N3aXRjaCcsIGZ1bmN0aW9uIHN3aXRjaERpcmVjdGl2ZSgpIHtcblxuICAgICAgICBmdW5jdGlvbiBnZXRVbmlxdWVJRChpZFByZWZpeCkge1xuICAgICAgICAgICAgcmV0dXJuIF8udW5pcXVlSWQoaWRQcmVmaXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9qcy9iaWdjb21tZXJjZS9zd2l0Y2gvc3dpdGNoLnRwbC5odG1sJyxcbiAgICAgICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgYXJpYURlc2NyaXB0aW9uOiAnQCcsXG4gICAgICAgICAgICAgICAgaXNEaXNhYmxlZDogJz1uZ0Rpc2FibGVkJyxcbiAgICAgICAgICAgICAgICBsYWJlbFRleHQ6ICdAJyxcbiAgICAgICAgICAgICAgICBsZWZ0RGVzY3JpcHRpb246ICdAJyxcbiAgICAgICAgICAgICAgICBuZ0ZhbHNlVmFsdWU6ICdAJyxcbiAgICAgICAgICAgICAgICBuZ1RydWVWYWx1ZTogJ0AnLFxuICAgICAgICAgICAgICAgIHJpZ2h0RGVzY3JpcHRpb246ICdAJyxcbiAgICAgICAgICAgICAgICB0b2dnbGVPZmZMYWJlbDogJ0AnLFxuICAgICAgICAgICAgICAgIHRvZ2dsZU9uTGFiZWw6ICdAJyxcbiAgICAgICAgICAgICAgICB1bmlxdWVJZDogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3N3aXRjaEN0cmwnLFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gc3dpdGNoRGlyZWN0aXZlQ29tcGlsZSh0RWxlbSwgdEF0dHJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNoZWNrYm94RWxlbSA9IHRFbGVtLmZpbmQoJ2lucHV0Jyk7XG5cbiAgICAgICAgICAgICAgICBpZiAodEF0dHJzLm5nRmFsc2VWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjaGVja2JveEVsZW0uYXR0cignbmctZmFsc2UtdmFsdWUnLCB0QXR0cnMubmdGYWxzZVZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodEF0dHJzLm5nVHJ1ZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrYm94RWxlbS5hdHRyKCduZy10cnVlLXZhbHVlJywgdEF0dHJzLm5nVHJ1ZVZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gc3dpdGNoRGlyZWN0aXZlUG9zdExpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5zd2l0Y2hDdHJsLmluaXQobmdNb2RlbEN0cmwpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gc3dpdGNoRGlyZWN0aXZlQ3RybCgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3RybCA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICAvLyBzdGF0ZVxuICAgICAgICAgICAgICAgIGN0cmwuaXNJbXBvcnRhbnQgPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMuaXNJbXBvcnRhbnQpICYmICRhdHRycy5pc0ltcG9ydGFudCAhPT0gJ2ZhbHNlJztcbiAgICAgICAgICAgICAgICBjdHJsLmhhc0ljb24gPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMuaGFzSWNvbikgJiYgJGF0dHJzLmhhc0ljb24gIT09ICdmYWxzZSc7XG5cbiAgICAgICAgICAgICAgICAvLyBsYWJlbHNcbiAgICAgICAgICAgICAgICBjdHJsLmxhYmVsVGV4dCA9ICRhdHRycy50b2dnbGVPZmZMYWJlbDtcblxuICAgICAgICAgICAgICAgIC8vIGlkc1xuICAgICAgICAgICAgICAgIGN0cmwudW5pcXVlSWQgPSBnZXRVbmlxdWVJRCgnc3dpdGNoLScpO1xuICAgICAgICAgICAgICAgIGN0cmwuYXJpYURlc2NyaXB0aW9uSUQgPSBnZXRVbmlxdWVJRCgnc3dpdGNoLWFyaWFEZXNjcmlwdGlvbi0nKTtcblxuICAgICAgICAgICAgICAgIGN0cmwuaW5pdCA9IGluaXQ7XG4gICAgICAgICAgICAgICAgY3RybC51cGRhdGVNb2RlbCA9IHVwZGF0ZU1vZGVsO1xuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdChuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgICAgICAgICBjdHJsLm5nTW9kZWxDdHJsID0gbmdNb2RlbEN0cmw7XG4gICAgICAgICAgICAgICAgICAgIGN0cmwudmFsdWUgPSBjdHJsLm5nTW9kZWxDdHJsLiRtb2RlbFZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ3N3aXRjaEN0cmwubmdNb2RlbEN0cmwuJG1vZGVsVmFsdWUnLCBmdW5jdGlvbiBzd2l0Y2hWYWx1ZUNoYW5nZWQobmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0cmwudmFsdWUgPSBuZXdWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY3RybC5pc0NoZWNrZWQgPSBfLmlzU3RyaW5nKG5ld1ZhbHVlKSA/IFwiJ1wiICsgbmV3VmFsdWUgKyBcIidcIiA9PT0gY3RybC5uZ1RydWVWYWx1ZSA6IG5ld1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3RybC5sYWJlbFRleHQgPSAhIWN0cmwuaXNDaGVja2VkID8gY3RybC50b2dnbGVPbkxhYmVsOiBjdHJsLnRvZ2dsZU9mZkxhYmVsO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGVNb2RlbCgpIHtcbiAgICAgICAgICAgICAgICAgICAgY3RybC5uZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKGN0cmwudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLnN3aXRjaCcsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuc3dpdGNoLmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLnV0aWwnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLnV0aWwudHJ1c3RBc0h0bWwnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUuc2VydmljZScsIFtcbiAgICAndWkucm91dGVyJ1xuXSlcbiAgICAuZmFjdG9yeSgnQmNTZXJ2ZXJUYWJsZScsIGZ1bmN0aW9uIGJjU2VydmVyVGFibGUoJGxvZywgJHEsICRzdGF0ZSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHZhciBkZWZhdWx0VGFibGVDb25maWcgPSB7XG4gICAgICAgICAgICBmaWx0ZXJzOiBbXSxcbiAgICAgICAgICAgIHF1ZXJ5S2V5czoge1xuICAgICAgICAgICAgICAgIHBhZ2U6ICdwYWdlJyxcbiAgICAgICAgICAgICAgICBsaW1pdDogJ2xpbWl0JyxcbiAgICAgICAgICAgICAgICBzb3J0Qnk6ICdzb3J0LWJ5JyxcbiAgICAgICAgICAgICAgICBzb3J0RGlyOiAnc29ydC1vcmRlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByb3dJZEtleTogJ2lkJyxcbiAgICAgICAgICAgIHNvcnREaXJWYWx1ZXM6IHtcbiAgICAgICAgICAgICAgICBhc2M6ICdhc2MnLFxuICAgICAgICAgICAgICAgIGRlc2M6ICdkZXNjJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIFNlcnZlclRhYmxlKHRhYmxlSWQsIHRhYmxlQ29uZmlnKSB7XG4gICAgICAgICAgICB0aGlzLmFsbFNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmZpbHRlcnMgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuaWQgPSB0YWJsZUlkO1xuICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIHBhZ2U6IG51bGwsXG4gICAgICAgICAgICAgICAgbGltaXQ6IG51bGwsXG4gICAgICAgICAgICAgICAgdG90YWw6IG51bGxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLnBlbmRpbmdSZXF1ZXN0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnJlc291cmNlQ2FsbGJhY2sgPSBhbmd1bGFyLm5vb3A7XG4gICAgICAgICAgICB0aGlzLnJvd3MgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRSb3dzID0ge307XG4gICAgICAgICAgICB0aGlzLnNvcnRCeSA9ICcnO1xuICAgICAgICAgICAgdGhpcy5zb3J0RGlyID0gJyc7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMudGFibGVDb25maWcgPSBfLmlzT2JqZWN0KHRhYmxlQ29uZmlnKSA/IHRhYmxlQ29uZmlnIDoge307XG4gICAgICAgICAgICB0aGlzLnRhYmxlQ29uZmlnID0gXy5kZWZhdWx0cyh0aGlzLnRhYmxlQ29uZmlnLCBkZWZhdWx0VGFibGVDb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgU2VydmVyVGFibGUucHJvdG90eXBlID0ge1xuICAgICAgICAgICAgY3JlYXRlUGFyYW1zT2JqZWN0OiBjcmVhdGVQYXJhbXNPYmplY3QsXG4gICAgICAgICAgICBkZXNlbGVjdEFsbFJvd3M6IGRlc2VsZWN0QWxsUm93cyxcbiAgICAgICAgICAgIGZldGNoUmVzb3VyY2U6IGZldGNoUmVzb3VyY2UsXG4gICAgICAgICAgICBnZXRTZWxlY3RlZFJvd3M6IGdldFNlbGVjdGVkUm93cyxcbiAgICAgICAgICAgIGluaXQ6IGluaXQsXG4gICAgICAgICAgICBpc1Jvd1NlbGVjdGVkOiBpc1Jvd1NlbGVjdGVkLFxuICAgICAgICAgICAgbG9hZFN0YXRlUGFyYW1zOiBsb2FkU3RhdGVQYXJhbXMsXG4gICAgICAgICAgICBzZWxlY3RBbGxSb3dzOiBzZWxlY3RBbGxSb3dzLFxuICAgICAgICAgICAgc2V0UGFnaW5hdGlvblZhbHVlczogc2V0UGFnaW5hdGlvblZhbHVlcyxcbiAgICAgICAgICAgIHNldFJvd3M6IHNldFJvd3MsXG4gICAgICAgICAgICBzZXRTZWxlY3Rpb25Gb3JBbGxSb3dzOiBzZXRTZWxlY3Rpb25Gb3JBbGxSb3dzLFxuICAgICAgICAgICAgc2V0U29ydGluZ1ZhbHVlczogc2V0U29ydGluZ1ZhbHVlcyxcbiAgICAgICAgICAgIHVwZGF0ZVBhZ2U6IHVwZGF0ZVBhZ2UsXG4gICAgICAgICAgICB1cGRhdGVTb3J0OiB1cGRhdGVTb3J0LFxuICAgICAgICAgICAgdXBkYXRlVGFibGU6IHVwZGF0ZVRhYmxlLFxuICAgICAgICAgICAgdmFsaWRhdGVSZXNvdXJjZTogdmFsaWRhdGVSZXNvdXJjZVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZVBhcmFtc09iamVjdCgpIHtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB7fSxcbiAgICAgICAgICAgICAgICBxdWVyeUtleXMgPSB0aGlzLnRhYmxlQ29uZmlnLnF1ZXJ5S2V5cyxcbiAgICAgICAgICAgICAgICBxdWVyeVBhcmFtTWFwID0gW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5S2V5OiBxdWVyeUtleXMucGFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLnBhZ2luYXRpb24ucGFnZVxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeUtleTogcXVlcnlLZXlzLmxpbWl0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMucGFnaW5hdGlvbi5saW1pdFxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeUtleTogcXVlcnlLZXlzLnNvcnRCeSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLnNvcnRCeVxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeUtleTogcXVlcnlLZXlzLnNvcnREaXIsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5zb3J0RGlyXG4gICAgICAgICAgICAgICAgICAgIH1dO1xuXG4gICAgICAgICAgICBfLmVhY2gocXVlcnlQYXJhbU1hcCwgZnVuY3Rpb24gcXVlcnlQYXJhbU1hcEVhY2gocGFyYW0pIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyYW0ucXVlcnlLZXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXNbcGFyYW0ucXVlcnlLZXldID0gcGFyYW0udmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIF8uZXh0ZW5kKHBhcmFtcywgdGhpcy5maWx0ZXJzKTtcblxuICAgICAgICAgICAgcmV0dXJuIHBhcmFtcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRlc2VsZWN0QWxsUm93cygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldFNlbGVjdGlvbkZvckFsbFJvd3MoZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmV0Y2hSZXNvdXJjZSgpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMucGVuZGluZ1JlcXVlc3QgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VDYWxsYmFjayh0aGlzLmNyZWF0ZVBhcmFtc09iamVjdCgpKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIHJlc291cmNlQ2FsbGJhY2tUaGVuKHJlc291cmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfdGhpcy52YWxpZGF0ZVJlc291cmNlKHJlc291cmNlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuc2V0Um93cyhyZXNvdXJjZS5yb3dzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnNldFBhZ2luYXRpb25WYWx1ZXMocmVzb3VyY2UucGFnaW5hdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gcmVzb3VyY2VDYWxsYmFja0NhdGNoKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICRsb2cuZXJyb3IoJ2JjLXNlcnZlci10YWJsZSBkaXJlY3RpdmU6IGZhaWxlZCB0byBmZXRjaCByZXNvdXJjZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZpbmFsbHkoZnVuY3Rpb24gcmVzb3VyY2VDYWxsYmFja0ZpbmFsbHkoKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnBlbmRpbmdSZXF1ZXN0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRTZWxlY3RlZFJvd3MoKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICByZXR1cm4gXy5maWx0ZXIodGhpcy5yb3dzLCBmdW5jdGlvbiBnZXRTZWxlY3RlZFJvd3NGaWx0ZXIocm93KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLmlzUm93U2VsZWN0ZWQocm93KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaW5pdChjb25maWcpIHtcbiAgICAgICAgICAgIGlmICghXy5pc09iamVjdChjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24oY29uZmlnLnJlc291cmNlQ2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUNhbGxiYWNrID0gY29uZmlnLnJlc291cmNlQ2FsbGJhY2s7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgICAgICAgICAgLmxvYWRTdGF0ZVBhcmFtcyhjb25maWcuc3RhdGVQYXJhbXMpXG4gICAgICAgICAgICAgICAgLmZldGNoUmVzb3VyY2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzUm93U2VsZWN0ZWQocm93KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZFJvd3Nbcm93W3RoaXMudGFibGVDb25maWcucm93SWRLZXldXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGxvYWRTdGF0ZVBhcmFtcyhzdGF0ZVBhcmFtcykge1xuICAgICAgICAgICAgdmFyIHF1ZXJ5S2V5cyA9IHRoaXMudGFibGVDb25maWcucXVlcnlLZXlzLFxuICAgICAgICAgICAgICAgIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgc3RhdGVQYXJhbXMgPSBzdGF0ZVBhcmFtcyB8fCAkc3RhdGVQYXJhbXM7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0UGFnaW5hdGlvblZhbHVlcyh7XG4gICAgICAgICAgICAgICAgcGFnZTogc3RhdGVQYXJhbXNbcXVlcnlLZXlzLnBhZ2VdLFxuICAgICAgICAgICAgICAgIGxpbWl0OiBzdGF0ZVBhcmFtc1txdWVyeUtleXMubGltaXRdXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5zZXRTb3J0aW5nVmFsdWVzKHN0YXRlUGFyYW1zW3F1ZXJ5S2V5cy5zb3J0QnldLCBzdGF0ZVBhcmFtc1txdWVyeUtleXMuc29ydERpcl0pO1xuXG4gICAgICAgICAgICAvLyBzZXQgZmlsdGVycyBmcm9tIHF1ZXJ5IHBhcmFtc1xuICAgICAgICAgICAgXy5lYWNoKHRoaXMudGFibGVDb25maWcuZmlsdGVycywgZnVuY3Rpb24gc2V0RmlsdGVyc0VhY2godmFsdWUpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5maWx0ZXJzW3ZhbHVlXSA9IHN0YXRlUGFyYW1zW3ZhbHVlXTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoaXMgaXMgYWN0dWFsbHkgYSB0b2dnbGUgbm90IGp1c3QgYSBzZWxlY3RcbiAgICAgICAgZnVuY3Rpb24gc2VsZWN0QWxsUm93cygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldFNlbGVjdGlvbkZvckFsbFJvd3MoIXRoaXMuYWxsU2VsZWN0ZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0UGFnaW5hdGlvblZhbHVlcyhwYWdpbmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2luYXRpb24gPSB0aGlzLnBhZ2luYXRpb24gfHwge307XG4gICAgICAgICAgICBfLmV4dGVuZCh0aGlzLnBhZ2luYXRpb24sIHBhZ2luYXRpb24pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldFJvd3Mocm93cykge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgdGhpcy5yb3dzID0gcm93cztcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRSb3dzID0gXy5yZWR1Y2Uocm93cywgZnVuY3Rpb24gaW5pdGlhbGl6ZVNlbGVjdGVkUm93c09iamVjdChhY2N1bSwgcm93KSB7XG4gICAgICAgICAgICAgICAgYWNjdW1bcm93W190aGlzLnRhYmxlQ29uZmlnLnJvd0lkS2V5XV0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjdW07XG4gICAgICAgICAgICB9LCB7fSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0U2VsZWN0aW9uRm9yQWxsUm93cyh2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgdmFsdWUgPSAhIXZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLmFsbFNlbGVjdGVkID0gdmFsdWU7XG5cbiAgICAgICAgICAgIF8uZWFjaCh0aGlzLnNlbGVjdGVkUm93cywgZnVuY3Rpb24gYWxsUm93c0l0ZXJhdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2VsZWN0ZWRSb3dzW2tleV0gPSBfdGhpcy5hbGxTZWxlY3RlZDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldFNvcnRpbmdWYWx1ZXMoc29ydEJ5LCBzb3J0RGlyKSB7XG4gICAgICAgICAgICB0aGlzLnNvcnRCeSA9IHNvcnRCeSB8fCB0aGlzLnNvcnRCeTtcbiAgICAgICAgICAgIHRoaXMuc29ydERpciA9IHNvcnREaXIgfHwgdGhpcy5zb3J0RGlyO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVBhZ2UocGFnZSwgbGltaXQsIHRvdGFsKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICAgICAgICAgIC5zZXRQYWdpbmF0aW9uVmFsdWVzKHBhZ2UsIGxpbWl0LCB0b3RhbClcbiAgICAgICAgICAgICAgICAudXBkYXRlVGFibGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVNvcnQoc29ydEJ5LCBzb3J0RGlyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICAgICAgICAgIC5zZXRTb3J0aW5nVmFsdWVzKHNvcnRCeSwgc29ydERpcilcbiAgICAgICAgICAgICAgICAuc2V0UGFnaW5hdGlvblZhbHVlcyh7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2U6IDFcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC51cGRhdGVUYWJsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlVGFibGUoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMucGVuZGluZ1JlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJHN0YXRlLmN1cnJlbnQubmFtZSwgdGhpcy5jcmVhdGVQYXJhbXNPYmplY3QoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdmFsaWRhdGVSZXNvdXJjZShyZXNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKCFfLmlzT2JqZWN0KHJlc291cmNlKSkge1xuICAgICAgICAgICAgICAgICRsb2cuZXJyb3IoJ2JjLXNlcnZlci10YWJsZSBkaXJlY3RpdmU6IFJlc291cmNlIGNhbGxiYWNrIG11c3QgcmV0dXJuIGFuIG9iamVjdCcpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFfLmlzQXJyYXkocmVzb3VyY2Uucm93cykpIHtcbiAgICAgICAgICAgICAgICAkbG9nLmVycm9yKCdiYy1zZXJ2ZXItdGFibGUgZGlyZWN0aXZlOiByZXR1cm5lZCBvYmplY3QgbXVzdCBjb250YWluIGEgcm93cyBwcm9wZXJ0eSB0aGF0IGlzIGFuIGFycmF5LicpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFfLmlzT2JqZWN0KHJlc291cmNlLnBhZ2luYXRpb24pKSB7XG4gICAgICAgICAgICAgICAgJGxvZy5lcnJvcignYmMtc2VydmVyLXRhYmxlIGRpcmVjdGl2ZTogcmV0dXJuZWQgb2JqZWN0IG11c3QgY29udGFpbiBhIHBhZ2luYXRpb24gcHJvcGVydHkgdGhhdCBpcyBhbiBvYmplY3QuJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBTZXJ2ZXJUYWJsZTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUtZmFjdG9yeS5zZXJ2aWNlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUuc2VydmljZSdcbl0pXG4gICAgLmZhY3RvcnkoJ2JjU2VydmVyVGFibGVGYWN0b3J5JywgZnVuY3Rpb24gYmNTZXJ2ZXJUYWJsZUZhY3RvcnkoJGxvZywgQmNTZXJ2ZXJUYWJsZSkge1xuICAgICAgICB2YXIgdGFibGVzID0ge30sXG4gICAgICAgICAgICBzZXJ2aWNlID0ge1xuICAgICAgICAgICAgICAgIGNyZWF0ZTogY3JlYXRlLFxuICAgICAgICAgICAgICAgIGdldDogZ2V0LFxuICAgICAgICAgICAgICAgIHJlbW92ZTogcmVtb3ZlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZSh0YWJsZUlkLCB0YWJsZUNvbmZpZykge1xuICAgICAgICAgICAgaWYgKHRhYmxlSWQgaW4gdGFibGVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2UuZ2V0KHRhYmxlSWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRhYmxlSWQpIHtcbiAgICAgICAgICAgICAgICB0YWJsZUlkID0gXy51bmlxdWVJZCgnYmMtc2VydmVyLXRhYmxlLWluc3RhbmNlLScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YWJsZXNbdGFibGVJZF0gPSBuZXcgQmNTZXJ2ZXJUYWJsZSh0YWJsZUlkLCB0YWJsZUNvbmZpZyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0YWJsZXNbdGFibGVJZF07XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXQodGFibGVJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRhYmxlc1t0YWJsZUlkXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZSh0YWJsZUlkKSB7XG4gICAgICAgICAgICBkZWxldGUgdGFibGVzW3RhYmxlSWRdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XG4gICAgfSk7XG4iLCIvKipcbiAqIEBuYW1lIGNjLWV4cGlyeSBkaXJlY3RpdmVcbiAqIEBkZXNjcmlwdGlvbiBBIGRpcmVjdGl2ZSBmb2xsb3dpbmcgYW5ndWxhci1jcmVkaXQtY2FyZCdzIGFwcHJvYWNoIHRvIHZhbGlkYXRpbmcvZm9ybWF0dGluZyBjcmVkaXQgY2FyZCBleHBpcmF0aW9uIGRhdGUuXG4gKiBFeHBlY3QgdGhlIGNjLWV4cGlyeSBuZ01vZGVsIHRvIGJlIGluIHRoZSBmb3JtYXQgb2YgYHsgbW9udGg6ICcwNScsIHllYXI6ICcyMDE3J31gLlxuICovXG5hbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQuY2MtZXhwaXJ5LmRpcmVjdGl2ZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ2NjRXhwaXJ5JywgZnVuY3Rpb24gY2NFeHBEaXJlY3RpdmUoJGZpbHRlcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gKHRFbGVtLCB0QXR0cikge1xuICAgICAgICAgICAgICAgIGNvbnN0IEVYUElSQVRJT05fTUFYX0xFTkdUSCA9IDc7IC8vIGxlbmd0aCBvZiBgTU0gLyB5eWBcblxuICAgICAgICAgICAgICAgIHRBdHRyLiRzZXQoJ2F1dG9jb21wbGV0ZScsICdjYy1leHAnKTtcbiAgICAgICAgICAgICAgICB0QXR0ci4kc2V0KCdtYXhsZW5ndGgnLCBFWFBJUkFUSU9OX01BWF9MRU5HVEgpO1xuICAgICAgICAgICAgICAgIHRBdHRyLiRzZXQoJ3BhdHRlcm4nLCAnWzAtOV0qJyk7IC8vIGZvciBtb2JpbGUga2V5Ym9hcmQgZGlzcGxheVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGNjRXhwaXJ5TGluayhzY29wZSwgdEVsZW0sIHRBdHRyLCBuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgICAgICAgICBpbml0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRwYXJzZXJzLnVuc2hpZnQocGFyc2VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRmb3JtYXR0ZXJzLnB1c2goZm9ybWF0dGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiR2YWxpZGF0b3JzLnZhbGlkRnV0dXJlRGF0ZSA9IHZhbGlkRnV0dXJlRGF0ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGdldFZpZXdWYWx1ZSwgcmVuZGVyRm9ybWF0dGVkVmlldyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogZ2V0IHRoZSBpbnB1dCdzIHZpZXcgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdldFZpZXdWYWx1ZSgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZ01vZGVsQ3RybC4kdmlld1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIGZvcm1hdHMgdGhlIGlucHV0IHZpZXcgdmFsdWUgdG8gYmUgdGhlIGZvcm1hdCBgTU0gLyB5eWAgYW5kIHJlLXJlbmRlcnMgdmlld1xuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcmVuZGVyRm9ybWF0dGVkVmlldyh2aWV3VmFsdWUsIHByZXZWaWV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdmlld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhIG5ldyB2YWx1ZSBpcyBhZGRlZCAoYXMgb3Bwb3NlZCB0byBwcmVzc2luZyBiYWNrc3BhY2UpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0FkZGl0aW9uID0gdmlld1ZhbHVlLmxlbmd0aCA+IHByZXZWaWV3VmFsdWUubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBuZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKGZvcm1hdCh2aWV3VmFsdWUsIGlzQWRkaXRpb24pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRyZW5kZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBWYWxpZGF0ZXMgd2hldGhlciB0aGUgZW50ZXJlZCBleHBpcmF0aW9uIGRhdGUgaXMgdmFsaWRcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHZhbGlkRnV0dXJlRGF0ZShtb2RlbFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7bW9udGgsIHllYXJ9ID0gbW9kZWxWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWREYXRlKG1vbnRoLCB5ZWFyKSAmJiAhaXNQYXN0KG1vbnRoLCB5ZWFyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBWYWxpZGF0ZXMgd2hldGhlciB0aGUgZ2l2ZW4gbW9udGggYW5kIHllYXIgYXJlIG51bWJlciBzdHJpbmdzIHdpdGggbGVuZ3RoIG9mIDIgYW5kIDQgcmVzcGVjdGl2ZWx5XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBpc1ZhbGlkRGF0ZShtb250aCwgeWVhcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9udGhSZWdleCA9IC9eWzAtOV17Mn0kLztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHllYXJSZWdleCA9IC9eWzAtOV17NH0kLztcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF8uaXNTdHJpbmcobW9udGgpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5pc1N0cmluZyh5ZWFyKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoUmVnZXgudGVzdChtb250aCkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5ZWFyUmVnZXgudGVzdCh5ZWFyKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzVmFsaWRNb250aChtb250aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIG1vbnRoIGlzIHZhbGlkXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBpc1ZhbGlkTW9udGgobW9udGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoID0gXy5wYXJzZUludChtb250aCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtb250aCA+IDAgJiYgbW9udGggPCAxMztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBDaGVja3Mgd2hldGhlciB0aGUgZ2l2ZW4gbW9udGggYW5kIGRhdGUgaXMgaW4gdGhlIHBhc3RcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGlzUGFzdChtb250aCwgeWVhcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldEN1cnJNb250aERhdGUoKSA+IG5ldyBEYXRlKHllYXIsIG1vbnRoIC0gMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogR2V0IHRoZSBkYXRlIG9iamVjdCBiYXNlZCBvbiBjdXJyZW50IG1vbnRoIGFuZCB5ZWFyXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBnZXRDdXJyTW9udGhEYXRlKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRlLmdldEZ1bGxZZWFyKCksIGRhdGUuZ2V0TW9udGgoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogVXNlcyBhbmd1bGFyIGRhdGUgZmlsdGVyIHRvIGZvcm1hdCBkYXRlIG1vZGVsIHRvIGNvcnJlc3BvbmRpbmcgdmlldyBmb3JtYXRcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGZvcm1hdHRlcihleHAgPSB7fSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9udGggPSBleHAubW9udGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB5ZWFyID0gZXhwLnllYXI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfLmlzRW1wdHkobW9udGgpICYmIF8uaXNFbXB0eSh5ZWFyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRmaWx0ZXIoJ2RhdGUnKShuZXcgRGF0ZSh5ZWFyLCBtb250aCAtIDEpLCAnTU0gLyB5eScpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFBhcnNlcyB0aGUgZm9ybWF0dGVkIHZpZXcgdmFsdWVzIHRvIG1vZGVsLiBDb252ZXJ0cyAyIGRpZ2l0IHllYXIgdG8gZnVsbCA0IGRpZ2l0IHllYXJcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIGV4cGlyYXRpb24ge29iamVjdH0gVGhlIGV4cGlyYXRpb24gb2JqZWN0IHttb250aCwgeWVhcn1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHBhcnNlcihleHBpcmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBiYXNlWWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpLnNsaWNlKDAsIDIpOyAvLyBgJzIwJ2BcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IGV4cGlyYXRpb24uc3BsaXQoJy8nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vbnRoID0gdmFsdWVzWzBdID8gdmFsdWVzWzBdLnRyaW0oKSA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeWVhciA9IHZhbHVlc1sxXSA/IGJhc2VZZWFyICsgdmFsdWVzWzFdLnRyaW0oKSA6ICcnO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBtb250aCwgeWVhciB9O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIGZvcm1hdHMgdGhlIHZpZXcgdmFsdWUgdG8gdGhlIGZvcm0gJ01NIC8geXknXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBmb3JtYXQoZXhwU3RyLCBpc0FkZGl0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBleHBTdHIuc3BsaXQoJy8nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vbnRoID0gdmFsdWVzWzBdID8gdmFsdWVzWzBdLnRyaW0oKSA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeWVhciA9IHZhbHVlc1sxXSA/IHZhbHVlc1sxXS50cmltKCkuc2xpY2UoLTIpIDogJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRvbid0IGFkZCBzbGFzaFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCghaXNBZGRpdGlvbiAmJiAheWVhcikgfHwgbW9udGgubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtb250aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkIHNsYXNoIGluIHRoZSByaWdodCBzcG90XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNBZGRpdGlvbiAmJiAheWVhciAmJiBtb250aC5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke21vbnRoLnNsaWNlKDAsIDIpfSAvICR7bW9udGguc2xpY2UoMil9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke21vbnRofSAvICR7eWVhcn1gO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXF1aXJlOiAnbmdNb2RlbCcsXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLmNjLWV4cGlyeScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQuY2MtZXhwaXJ5LmRpcmVjdGl2ZScsXG5dKTtcbiIsIi8qKlxuICogQG5hbWUgYmMtY3ZjIGRpcmVjdGl2ZVxuICogQGRlc2NyaXB0aW9uIEEgY3VzdG9tIGNvbXBsZW1lbnRhcnkgZGlyZWN0aXZlIHRvIGFuZ3VsYXItY3JlZGl0LWNhcmQncyBgY2NDdmNgIGRpcmVjdGl2ZS5cbiAqIFRvIHN1cHBvcnQgYWxsb3dpbmcgYW4gb3B0aW9uYWwgY3ZjIGZpZWxkIChpLmUuIFNlY3VyZW5ldCksIHRoaXMgZGlyZWN0aXZlIG11c3Qgb3ZlcnJpZGVcbiAqIHRoZSB2YWxpZGF0aW9uIHByb3ZpZGVkIGJ5IGNjQ3ZjIGRpcmVjdGl2ZS5cbiAqL1xuYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLmJjLWN2YycsIFtcbiAgICAnY3JlZGl0LWNhcmRzJyxcbl0pXG4gICAgLmRpcmVjdGl2ZSgnYmNDdmMnLCBmdW5jdGlvbiBiY0N2Y0RpcmVjdGl2ZSgkcGFyc2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIGJjQ3ZjTGluayhzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcywgbmdNb2RlbCkge1xuICAgICAgICAgICAgICAgIC8vIG92ZXJyaWRlIHRoZSB2YWxpZGF0aW9uIHRvIGFsd2F5cyByZXR1cm4gdmFsaWRcbiAgICAgICAgICAgICAgICAvLyBpZiBjdmMgaXMgbm90IHJlcXVpcmVkXG4gICAgICAgICAgICAgICAgaWYgKCEkcGFyc2UoYXR0cmlidXRlcy5uZ1JlcXVpcmVkKShzY29wZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbmdNb2RlbC4kdmFsaWRhdG9ycy5jY0N2YyA9ICgpID0+IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByaW9yaXR5OiA1LCAvLyBoaWdoZXIgcHJpb3JpdHkgdG8gZW5zdXJlIGNjQ3ZjJ3MgbGluayBpcyByYW4gZmlyc3RcbiAgICAgICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIH07XG4gICAgfSk7XG4iLCIvKipcbiAqIEBuYW1lIHRydXN0QXNIdG1sXG4gKiBAZGVzY3JpcHRpb24gU2ltcGxlIHV0aWxpdHkgZmlsdGVyIHRvIHJ1biB0aGUgZ2l2ZW4gaHRtbCBzdHJpbmcgdGhyb3VnaCBhbmd1bGFyJ3MgJHNjZS50cnVzdEFzSHRtbCBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dCBUaGUgaHRtbCBzdHJpbmcgdG8gdHJ1c3RcbiAqIEByZXR1cm4ge1N0cmluZ30gQW4gYW5ndWxhci10cnVzdGVkIG9iamVjdCBjb250YWluaW5nIHRoZSBodG1sXG4gKlxuICogQGV4YW1wbGUgYDxwIG5nLWJpbmQtaHRtbD1cInJhd0h0bWwgfCB0cnVzdEFzSHRtbFwiPjwvcD5gXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi51dGlsLnRydXN0QXNIdG1sJywgW10pXG4gICAgLmZpbHRlcigndHJ1c3RBc0h0bWwnLCBmdW5jdGlvbiB0cnVzdEFzSHRtbCgkc2NlKXtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiAkc2NlLnRydXN0QXNIdG1sKHRleHQpO1xuICAgICAgICB9O1xuICAgIH0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9