'use strict';

angular.module('bcapp-pattern-lab', ['gettext', 'ngAnimate', 'ngclipboard', 'ngMessages', 'mm.foundation', 'bcapp-pattern-lab-templates', 'bcapp-pattern-lab.sticky-class', 'bcapp-pattern-lab.bc-datepicker', 'bcapp-pattern-lab.bc-dropdown', 'bcapp-pattern-lab.bc-modal', 'bcapp-pattern-lab.bc-pagination', 'bcapp-pattern-lab.bc-server-table', 'bcapp-pattern-lab.checkbox-list', 'bcapp-pattern-lab.color-picker', 'bcapp-pattern-lab.copy-clipboard', 'bcapp-pattern-lab.credit-card', 'bcapp-pattern-lab.credit-card-types', 'bcapp-pattern-lab.form', 'bcapp-pattern-lab.form-field', 'bcapp-pattern-lab.form-input-color', 'bcapp-pattern-lab.html5Mode', 'bcapp-pattern-lab.icon', 'bcapp-pattern-lab.loading-notification', 'bcapp-pattern-lab.loading-overlay', 'bcapp-pattern-lab.services', 'bcapp-pattern-lab.sprite', 'bcapp-pattern-lab.switch', 'bcapp-pattern-lab.util']).config(['$tooltipProvider', function ($tooltipProvider) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJpZ2NvbW1lcmNlL2JjYXBwLXBhdHRlcm4tbGFiLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2JjLWRhdGVwaWNrZXIvYmMtZGF0ZXBpY2tlci5jb25zdGFudHMuanMiLCJiaWdjb21tZXJjZS9iYy1kYXRlcGlja2VyL2JjLWRhdGVwaWNrZXIuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvYmMtZGF0ZXBpY2tlci9iYy1kYXRlcGlja2VyLmpzIiwiYmlnY29tbWVyY2UvYmMtZHJvcGRvd24vYmMtZHJvcGRvd24tbWVudS5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9iYy1kcm9wZG93bi9iYy1kcm9wZG93bi10b2dnbGUuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvYmMtZHJvcGRvd24vYmMtZHJvcGRvd24uY29udHJvbGxlci5qcyIsImJpZ2NvbW1lcmNlL2JjLWRyb3Bkb3duL2JjLWRyb3Bkb3duLmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2JjLWRyb3Bkb3duL2JjLWRyb3Bkb3duLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2JjLXBhZ2luYXRpb24vYmMtcGFnaW5hdGlvbi5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9iYy1wYWdpbmF0aW9uL2JjLXBhZ2luYXRpb24ubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvYmMtc2VydmVyLXRhYmxlL2JjLXNlcnZlci10YWJsZS5jb250cm9sbGVyLmpzIiwiYmlnY29tbWVyY2UvYmMtc2VydmVyLXRhYmxlL2JjLXNlcnZlci10YWJsZS5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9iYy1zZXJ2ZXItdGFibGUvYmMtc2VydmVyLXRhYmxlLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2JjLXNlcnZlci10YWJsZS9iYy1zb3J0LWJ5LmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2NoZWNrYm94LWxpc3QvY2hlY2tib3gtbGlzdC5jb250cm9sbGVyLmpzIiwiYmlnY29tbWVyY2UvY2hlY2tib3gtbGlzdC9jaGVja2JveC1saXN0LmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2NoZWNrYm94LWxpc3QvY2hlY2tib3gtbGlzdC5tb2R1bGUuanMiLCJiaWdjb21tZXJjZS9jb2xvci1waWNrZXIvY29sb3ItcGlja2VyLXBhbGV0dGUuY29udHJvbGxlci5qcyIsImJpZ2NvbW1lcmNlL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXItcGFsZXR0ZS5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9jb2xvci1waWNrZXIvY29sb3ItcGlja2VyLmNvbnRyb2xsZXIuanMiLCJiaWdjb21tZXJjZS9jb2xvci1waWNrZXIvY29sb3ItcGlja2VyLmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXIubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvY29weS1jbGlwYm9hcmQvY29weS1jbGlwYm9hcmQuY29uc3RhbnQuanMiLCJiaWdjb21tZXJjZS9jb3B5LWNsaXBib2FyZC9jb3B5LWNsaXBib2FyZC5jb250cm9sbGVyLmpzIiwiYmlnY29tbWVyY2UvY29weS1jbGlwYm9hcmQvY29weS1jbGlwYm9hcmQuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvY29weS1jbGlwYm9hcmQvY29weS1jbGlwYm9hcmQubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQvY3JlZGl0LWNhcmQuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQvY3JlZGl0LWNhcmQubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQtdHlwZXMvY3JlZGl0LWNhcmQtdHlwZXMuY29uc3RhbnQuanMiLCJiaWdjb21tZXJjZS9jcmVkaXQtY2FyZC10eXBlcy9jcmVkaXQtY2FyZC10eXBlcy5jb250cm9sbGVyLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQtdHlwZXMvY3JlZGl0LWNhcmQtdHlwZXMuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQtdHlwZXMvY3JlZGl0LWNhcmQtdHlwZXMubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS9mb3JtLmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2Zvcm0vZm9ybS5tb2R1bGUuanMiLCJiaWdjb21tZXJjZS9mb3JtLWZpZWxkL2Zvcm0tZmllbGQuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS1maWVsZC9mb3JtLWZpZWxkLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2Zvcm0tZmllbGQtZXJyb3IvZm9ybS1maWVsZC1lcnJvci5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9mb3JtLWZpZWxkLWVycm9yL2Zvcm0tZmllbGQtZXJyb3IubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS1maWVsZC1lcnJvcnMvZm9ybS1maWVsZC1lcnJvcnMuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS1maWVsZC1lcnJvcnMvZm9ybS1maWVsZC1lcnJvcnMubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS1pbnB1dC1jb2xvci9mb3JtLWlucHV0LWNvbG9yLmNvbnRyb2xsZXIuanMiLCJiaWdjb21tZXJjZS9mb3JtLWlucHV0LWNvbG9yL2Zvcm0taW5wdXQtY29sb3IuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvZm9ybS1pbnB1dC1jb2xvci9mb3JtLWlucHV0LWNvbG9yLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2h0bWw1TW9kZS9odG1sNU1vZGUubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvaHRtbDVNb2RlL2h0bWw1TW9kZS5zZXJ2aWNlLmpzIiwiYmlnY29tbWVyY2UvaWNvbi9pY29uLmNvbnRyb2xsZXIuanMiLCJiaWdjb21tZXJjZS9pY29uL2ljb24uZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvaWNvbi9pY29uLmpzIiwiYmlnY29tbWVyY2UvaWNvbi9pY29uLnN2Z1Jvb3RQYXRoLmpzIiwiYmlnY29tbWVyY2UvbG9hZGluZy1ub3RpZmljYXRpb24vbG9hZGluZy1ub3RpZmljYXRpb24uZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvbG9hZGluZy1ub3RpZmljYXRpb24vbG9hZGluZy1ub3RpZmljYXRpb24uanMiLCJiaWdjb21tZXJjZS9sb2FkaW5nLW92ZXJsYXkvbG9hZGluZy1vdmVybGF5LmNvbnRyb2xsZXIuanMiLCJiaWdjb21tZXJjZS9sb2FkaW5nLW92ZXJsYXkvbG9hZGluZy1vdmVybGF5LmRpcmVjdGl2ZS5qcyIsImJpZ2NvbW1lcmNlL2xvYWRpbmctb3ZlcmxheS9sb2FkaW5nLW92ZXJsYXkuanMiLCJiaWdjb21tZXJjZS9tb2RhbC9iYy1tb2RhbC5tb2RhbFN0YWNrLnNlcnZpY2UuanMiLCJiaWdjb21tZXJjZS9tb2RhbC9iYy1tb2RhbC5tb2R1bGUuanMiLCJiaWdjb21tZXJjZS9zZXJ2aWNlcy9kZXZpY2Uuc2VydmljZS5qcyIsImJpZ2NvbW1lcmNlL3NlcnZpY2VzL3NlcnZpY2VzLm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL3Nwcml0ZS9zcHJpdGUuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2Uvc3ByaXRlL3Nwcml0ZS5qcyIsImJpZ2NvbW1lcmNlL3N0aWNreS1jbGFzcy9zdGlja3ktY2xhc3MuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2Uvc3RpY2t5LWNsYXNzL3N0aWNreS1jbGFzcy5qcyIsImJpZ2NvbW1lcmNlL3N3aXRjaC9zd2l0Y2guZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2Uvc3dpdGNoL3N3aXRjaC5tb2R1bGUuanMiLCJiaWdjb21tZXJjZS91dGlsL3V0aWwubW9kdWxlLmpzIiwiYmlnY29tbWVyY2UvYmMtc2VydmVyLXRhYmxlL2JjLXNlcnZlci10YWJsZS1mYWN0b3J5L2JjLXNlcnZlci10YWJsZS1mYWN0b3J5LnNlcnZpY2UuanMiLCJiaWdjb21tZXJjZS9iYy1zZXJ2ZXItdGFibGUvYmMtc2VydmVyLXRhYmxlL2JjLXNlcnZlci10YWJsZS5zZXJ2aWNlLmpzIiwiYmlnY29tbWVyY2UvY3JlZGl0LWNhcmQvY2MtZXhwaXJ5L2NjLWV4cGlyeS5kaXJlY3RpdmUuanMiLCJiaWdjb21tZXJjZS9jcmVkaXQtY2FyZC9jYy1leHBpcnkvY2MtZXhwaXJ5Lm1vZHVsZS5qcyIsImJpZ2NvbW1lcmNlL2NyZWRpdC1jYXJkL2NyZWRpdC1jYXJkLWN2di9iYy1jdmMuZGlyZWN0aXZlLmpzIiwiYmlnY29tbWVyY2UvdXRpbC90cnVzdEFzSHRtbC90cnVzdEFzSHRtbC5maWx0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLENBQ2hDLFNBQVMsRUFDVCxXQUFXLEVBQ1gsYUFBYSxFQUNiLFlBQVksRUFDWixlQUFlLEVBQ2YsNkJBQTZCLEVBQzdCLGdDQUFnQyxFQUNoQyxpQ0FBaUMsRUFDakMsK0JBQStCLEVBQy9CLDRCQUE0QixFQUM1QixpQ0FBaUMsRUFDakMsbUNBQW1DLEVBQ25DLGlDQUFpQyxFQUNqQyxnQ0FBZ0MsRUFDaEMsa0NBQWtDLEVBQ2xDLCtCQUErQixFQUMvQixxQ0FBcUMsRUFDckMsd0JBQXdCLEVBQ3hCLDhCQUE4QixFQUM5QixvQ0FBb0MsRUFDcEMsNkJBQTZCLEVBQzdCLHdCQUF3QixFQUN4Qix3Q0FBd0MsRUFDeEMsbUNBQW1DLEVBQ25DLDRCQUE0QixFQUM1QiwwQkFBMEIsRUFDMUIsMEJBQTBCLEVBQzFCLHdCQUF3QixDQUMzQixDQUFDLENBQ0QsTUFBTSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsVUFBUyxnQkFBZ0IsRUFBRTtBQUNwRCxvQkFBZ0IsQ0FBQyxXQUFXLENBQUMsRUFBQyxvQkFBb0IsRUFBRSxxQkFBcUIsRUFBQyxDQUFDLENBQUM7Q0FDL0UsQ0FBQyxDQUFDLENBQUM7Ozs7QUMvQkosT0FBTyxDQUFDLE1BQU0sQ0FBQywyQ0FBMkMsRUFBRSxFQUFFLENBQUMsQ0FDMUQsUUFBUSxDQUFDLHdCQUF3QixFQUFFO0FBQ2hDLGFBQVMsRUFBRSxHQUFHO0FBQ2QsZUFBVyxFQUFFLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxj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Ozs7QUFNRCx5QkFBUyxNQUFNLENBQUMsVUFBVSxFQUFFO0FBQ3hCLHdCQUFNLFFBQVEsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakUsd0JBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckMsd0JBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2hELHdCQUFNLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7O0FBRTFELDJCQUFPLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLENBQUM7aUJBQzFCOzs7OztBQUtELHlCQUFTLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFO0FBQ2hDLHdCQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2pDLHdCQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNoRCx3QkFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7OztBQUd6RCx3QkFBSSxBQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsSUFBSSxJQUFLLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQzVDLCtCQUFPLEtBQUssQ0FBQztxQkFDaEI7OztBQUdELHdCQUFJLFVBQVUsSUFBSSxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUN6QywrQkFBVSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBTSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFHO3FCQUNyRDs7QUFFRCwyQkFBVSxLQUFLLFdBQU0sSUFBSSxDQUFHO2lCQUMvQjthQUNKLENBQUM7U0FDTDtBQUNELGVBQU8sRUFBRSxTQUFTO0FBQ2xCLGdCQUFRLEVBQUUsR0FBRztLQUNoQixDQUFDO0NBQ0wsQ0FBQyxDQUFDOzs7QUNwSlAsT0FBTyxDQUFDLE1BQU0sQ0FBQyx5Q0FBeUMsRUFBRSxDQUN0RCxtREFBbUQsQ0FDdEQsQ0FBQyxDQUFDOzs7Ozs7Ozs7QUNJSCxPQUFPLENBQUMsTUFBTSxDQUFDLHNDQUFzQyxFQUFFLENBQ25ELGNBQWMsQ0FDakIsQ0FBQyxDQUNHLFNBQVMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxjQUFjLENBQUMsTUFBTSxFQUFFO0FBQ2hELFdBQU87QUFDSCxZQUFJLEVBQUUsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFOzs7QUFHMUQsZ0JBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ3ZDLHVCQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssR0FBRzsyQkFBTSxJQUFJO2lCQUFBLENBQUM7YUFDMUM7U0FDSjtBQUNELGdCQUFRLEVBQUUsQ0FBQztBQUNYLGVBQU8sRUFBRSxTQUFTO0FBQ2xCLGdCQUFRLEVBQUUsR0FBRztLQUNoQixDQUFDO0NBQ0wsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7QUNiUCxPQUFPLENBQUMsTUFBTSxDQUFDLG9DQUFvQyxFQUFFLEVBQUUsQ0FBQyxDQUNuRCxNQUFNLENBQUMsYUFBYSxFQUFFLFNBQVMsV0FBVyxDQUFDLElBQUksRUFBQztBQUM3QyxXQUFPLFVBQVMsSUFBSSxFQUFFO0FBQ2xCLGVBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNqQyxDQUFDO0NBQ0wsQ0FBQyxDQUFDIiwiZmlsZSI6ImJjYXBwLXBhdHRlcm4tbGFiLWNvbXBvbmVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWInLCBbXG4gICAgJ2dldHRleHQnLFxuICAgICduZ0FuaW1hdGUnLFxuICAgICduZ2NsaXBib2FyZCcsXG4gICAgJ25nTWVzc2FnZXMnLFxuICAgICdtbS5mb3VuZGF0aW9uJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWItdGVtcGxhdGVzJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuc3RpY2t5LWNsYXNzJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtZGF0ZXBpY2tlcicsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRyb3Bkb3duJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtbW9kYWwnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1wYWdpbmF0aW9uJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtc2VydmVyLXRhYmxlJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY2hlY2tib3gtbGlzdCcsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNvbG9yLXBpY2tlcicsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNvcHktY2xpcGJvYXJkJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC10eXBlcycsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0nLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWZpZWxkJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1pbnB1dC1jb2xvcicsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmh0bWw1TW9kZScsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmljb24nLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5sb2FkaW5nLW5vdGlmaWNhdGlvbicsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmxvYWRpbmctb3ZlcmxheScsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLnNlcnZpY2VzJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuc3ByaXRlJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuc3dpdGNoJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIudXRpbCdcbl0pXG4uY29uZmlnKFsnJHRvb2x0aXBQcm92aWRlcicsIGZ1bmN0aW9uKCR0b29sdGlwUHJvdmlkZXIpIHtcbiAgICAkdG9vbHRpcFByb3ZpZGVyLnNldFRyaWdnZXJzKHsndG9vbHRpcFRyaWdnZXJPcGVuJzogJ3Rvb2x0aXBUcmlnZ2VyQ2xvc2UnfSk7XG59XSk7XG4iLCIvKiBnbG9iYWxzIG1vbWVudCAqL1xuYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRhdGVwaWNrZXIuY29uc3RhbnRzJywgW10pXG4gICAgLmNvbnN0YW50KCdCQ19EQVRFUElDS0VSX0RFRkFVTFRTJywge1xuICAgICAgICBkYXlGb3JtYXQ6ICdEJyxcbiAgICAgICAgaW5wdXRGb3JtYXQ6IG1vbWVudC5sb2NhbGVEYXRhKCkubG9uZ0RhdGVGb3JtYXQoJ0wnKSxcbiAgICAgICAgc3R5bGVzOiB7XG4gICAgICAgICAgICBiYWNrOiAnZGF0ZXBpY2tlci1iYWNrJyxcbiAgICAgICAgICAgIGNvbnRhaW5lcjogJ2RhdGVwaWNrZXInLFxuICAgICAgICAgICAgZGF0ZTogJ2RhdGVwaWNrZXItZGF0ZScsXG4gICAgICAgICAgICBkYXlCb2R5OiAnZGF0ZXBpY2tlci1kYXlzLWJvZHknLFxuICAgICAgICAgICAgZGF5Qm9keUVsZW06ICdkYXRlcGlja2VyLWRheScsXG4gICAgICAgICAgICBkYXlDb25jZWFsZWQ6ICdkYXRlcGlja2VyLWRheS1jb25jZWFsZWQnLFxuICAgICAgICAgICAgZGF5RGlzYWJsZWQ6ICdpcy1kaXNhYmxlZCcsXG4gICAgICAgICAgICBkYXlIZWFkOiAnZGF0ZXBpY2tlci1kYXlzLWhlYWQnLFxuICAgICAgICAgICAgZGF5SGVhZEVsZW06ICdkYXRlcGlja2VyLWRheS1uYW1lJyxcbiAgICAgICAgICAgIGRheVByZXZNb250aDogJ2RhdGVwaWNrZXItZGF5LXByZXYtbW9udGgnLFxuICAgICAgICAgICAgZGF5TmV4dE1vbnRoOiAnZGF0ZXBpY2tlci1kYXktbmV4dC1tb250aCcsXG4gICAgICAgICAgICBkYXlSb3c6ICdkYXRlcGlja2VyLWRheXMtcm93JyxcbiAgICAgICAgICAgIGRheVRhYmxlOiAnZGF0ZXBpY2tlci1kYXlzJyxcbiAgICAgICAgICAgIG1vbnRoOiAnZGF0ZXBpY2tlci1tb250aCcsXG4gICAgICAgICAgICBtb250aExhYmVsOiAnZGF0ZXBpY2tlci1tb250aCcsXG4gICAgICAgICAgICBuZXh0OiAnZGF0ZXBpY2tlci1uZXh0JyxcbiAgICAgICAgICAgIHBvc2l0aW9uZWQ6ICdkYXRlcGlja2VyLWF0dGFjaG1lbnQnLFxuICAgICAgICAgICAgc2VsZWN0ZWREYXk6ICdpcy1zZWxlY3RlZCcsXG4gICAgICAgICAgICBzZWxlY3RlZFRpbWU6ICdkYXRlcGlja2VyLXRpbWUtc2VsZWN0ZWQnLFxuICAgICAgICAgICAgdGltZTogJ2RhdGVwaWNrZXItdGltZScsXG4gICAgICAgICAgICB0aW1lTGlzdDogJ2RhdGVwaWNrZXItdGltZS1saXN0JyxcbiAgICAgICAgICAgIHRpbWVPcHRpb246ICdkYXRlcGlja2VyLXRpbWUtb3B0aW9uJ1xuICAgICAgICB9LFxuICAgICAgICB0aW1lOiBmYWxzZSxcbiAgICAgICAgd2Vla2RheUZvcm1hdDogJ3Nob3J0J1xuICAgIH0pO1xuIiwiLyogZ2xvYmFscyByb21lICovXG5hbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtZGF0ZXBpY2tlci5kaXJlY3RpdmUnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRhdGVwaWNrZXIuY29uc3RhbnRzJ1xuXSlcbiAgICAuZGlyZWN0aXZlKCdiY0RhdGVwaWNrZXInLCBmdW5jdGlvbiBiY0RhdGVwaWNrZXJEaXJlY3RpdmUoQkNfREFURVBJQ0tFUl9ERUZBVUxUUykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgb3B0aW9uczogJz0/J1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gZGF0ZXBpY2tlckxpbmtGdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIG5nTW9kZWwpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUub3B0aW9ucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLm9wdGlvbnMgPSB7fTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgZGVmYXVsdHMgdG8gdGhlIG9wdGlvbnMgb2JqZWN0XG4gICAgICAgICAgICAgICAgXy5kZWZhdWx0cyhzY29wZS5vcHRpb25zLCBCQ19EQVRFUElDS0VSX0RFRkFVTFRTKTtcblxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhIG5ldyByb21lIChjYWxlbmRhcikgaW5zdGFuY2VcbiAgICAgICAgICAgICAgICBzY29wZS5jYWxlbmRhciA9IHJvbWUoZWxlbWVudFswXSwgc2NvcGUub3B0aW9ucyk7XG5cbiAgICAgICAgICAgICAgICAvLyBPbiAnZGF0YScgZXZlbnQgc2V0IG5nTW9kZWwgdG8gdGhlIHBhc3NlZCB2YWx1ZVxuICAgICAgICAgICAgICAgIHNjb3BlLmNhbGVuZGFyLm9uKCdkYXRhJywgZnVuY3Rpb24gb25EYXRhKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIG5nTW9kZWwuJHNldFZpZXdWYWx1ZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgc2NvcGUuY2FsZW5kYXIub24oJ3JlYWR5JywgZnVuY3Rpb24gb25SZWFkeShvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRycy5wbGFjZWhvbGRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy4kc2V0KCdwbGFjZWhvbGRlcicsIG9wdGlvbnMuaW5wdXRGb3JtYXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBSZW1vdmluZyBjYWxlbmRhciBldmVudCBsaXN0ZW5lcnNcbiAgICAgICAgICAgICAgICBlbGVtZW50Lm9uKCckZGVzdHJveScsIGZ1bmN0aW9uIG9uRGVzdHJveSgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2FsZW5kYXIuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRhdGVwaWNrZXInLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRhdGVwaWNrZXIuZGlyZWN0aXZlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtZHJvcGRvd24tbWVudS5kaXJlY3RpdmUnLCBbXSlcbiAgICAuZGlyZWN0aXZlKCdiY0Ryb3Bkb3duTWVudScsICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICByZXF1aXJlOiAnXmJjRHJvcGRvd24nLFxuICAgICAgICAgICAgY29tcGlsZTogKHRFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdEVsZW1lbnQuYWRkQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUnKTtcbiAgICAgICAgICAgICAgICB0RWxlbWVudC5hdHRyKCdyb2xlJywgJ2xpc3Rib3gnKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBiY0Ryb3Bkb3duQ3RybCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmF0dHIoJ2lkJywgYmNEcm9wZG93bkN0cmwuZ2V0VW5pcXVlSWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cignYXJpYS1leHBhbmRlZCcsIGJjRHJvcGRvd25DdHJsLmdldElzT3BlbigpKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gbGlzdGVuIGZvciBkcm9wZG93bnMgYmVpbmcgb3BlbmVkIGFuZCB0b2dnbGUgYXJpYS1leHBhbmRlZCB0byByZWZsZWN0IGN1cnJlbnQgc3RhdGVcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuJG9uKCd0b2dnbGVUaGlzRHJvcGRvd24nLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBiY0Ryb3Bkb3duQ3RybC5nZXRJc09wZW4oKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtZHJvcGRvd24tdG9nZ2xlLmRpcmVjdGl2ZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ2JjRHJvcGRvd25Ub2dnbGUnLCAoJGNvbXBpbGUpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICB0ZXJtaW5hbDogdHJ1ZSxcbiAgICAgICAgICAgIHByaW9yaXR5OiAxMDAxLCAvLyBzZXQgaGlnaGVyIHRoYW4gbmctcmVwZWF0IHRvIHByZXZlbnQgZG91YmxlIGNvbXBpbGF0aW9uXG4gICAgICAgICAgICByZXF1aXJlOiAnXmJjRHJvcGRvd24nLFxuICAgICAgICAgICAgY29tcGlsZTogKHRFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdEVsZW1lbnQucmVtb3ZlQXR0cignYmMtZHJvcGRvd24tdG9nZ2xlJyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgYmNEcm9wZG93bkN0cmwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyKCdkcm9wZG93bi10b2dnbGUnLCAnIycgKyBiY0Ryb3Bkb3duQ3RybC5nZXRVbmlxdWVJZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hdHRyKCdhcmlhLWNvbnRyb2xzJywgYmNEcm9wZG93bkN0cmwuZ2V0VW5pcXVlSWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgYmNEcm9wZG93bkN0cmwudG9nZ2xlSXNPcGVuKTtcbiAgICAgICAgICAgICAgICAgICAgJGNvbXBpbGUoZWxlbWVudCkoc2NvcGUpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtZHJvcGRvd24uY29udHJvbGxlcicsIFtdKVxuICAgIC5jb250cm9sbGVyKCdCY0Ryb3Bkb3duQ29udHJvbGxlcicsIGZ1bmN0aW9uIGJjRHJvcGRvd25Db250cm9sbGVyKCRzY29wZSwgJHJvb3RTY29wZSkge1xuICAgICAgICBjb25zdCBjdHJsID0gdGhpcztcbiAgICAgICAgbGV0IGlzT3BlbiA9IGZhbHNlO1xuICAgICAgICBsZXQgdW5pcXVlSWQ7XG5cbiAgICAgICAgY3RybC5jbG9zZURyb3Bkb3duID0gY2xvc2VEcm9wZG93bjtcbiAgICAgICAgY3RybC5nZXRJc09wZW4gPSBnZXRJc09wZW47XG4gICAgICAgIGN0cmwuZ2V0VW5pcXVlSWQgPSBnZXRVbmlxdWVJZDtcbiAgICAgICAgY3RybC5zZXRJc09wZW4gPSBzZXRJc09wZW47XG4gICAgICAgIGN0cmwudG9nZ2xlSXNPcGVuID0gdG9nZ2xlSXNPcGVuO1xuXG4gICAgICAgIC8vIGxpc3RlbiBmb3Igb3RoZXIgZHJvcGRvd25zIGJlaW5nIG9wZW5lZCBpbiB0aGUgYXBwLlxuICAgICAgICAkc2NvcGUuJG9uKCdiY0Ryb3Bkb3duVG9nZ2xlJywgKGV2ZW50LCB0cmlnZ2VyaW5nSUQpID0+IHtcbiAgICAgICAgICAgIC8vIGlmIEknbSBvcGVuIGFuZCBub3QgdGhlIGRyb3Bkb3duIGJlaW5nIHRyaWdnZXJlZCwgdGhlbiBJIHNob3VsZCBjbG9zZVxuICAgICAgICAgICAgaWYgKGlzT3BlbiAmJiB0cmlnZ2VyaW5nSUQgIT09IHVuaXF1ZUlkKSB7XG4gICAgICAgICAgICAgICAgY3RybC5jbG9zZURyb3Bkb3duKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNsb3NlRHJvcGRvd24oKSB7XG4gICAgICAgICAgICBjdHJsLnNldElzT3BlbihmYWxzZSk7XG4gICAgICAgICAgICAkc2NvcGUuJGJyb2FkY2FzdCgndG9nZ2xlVGhpc0Ryb3Bkb3duJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRJc09wZW4oKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNPcGVuO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0VW5pcXVlSWQoKSB7XG4gICAgICAgICAgICBpZiAoIXVuaXF1ZUlkKSB7XG4gICAgICAgICAgICAgICAgdW5pcXVlSWQgPSBfLnVuaXF1ZUlkKCdiYy1kcm9wZG93bi0nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB1bmlxdWVJZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldElzT3Blbih2YWwpIHtcbiAgICAgICAgICAgIGlzT3BlbiA9IHZhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZUlzT3BlbigpIHtcbiAgICAgICAgICAgIGlzT3BlbiA9ICFpc09wZW47XG4gICAgICAgICAgICAvLyB0ZWxsIGNoaWxkIGRpcmVjdGl2ZXMgYSB0b2dnbGUgaW4gb3BlbiBzdGF0dXMgaGFzIG9jY3VycmVkXG4gICAgICAgICAgICAkc2NvcGUuJGJyb2FkY2FzdCgndG9nZ2xlVGhpc0Ryb3Bkb3duJyk7XG4gICAgICAgICAgICAvLyB0ZWxsIGFwcGxpY2F0aW9uIHRoYXQgYSBkcm9wZG93biBoYXMgYmVlbiBvcGVuZWQgc28gb3RoZXJzIGNhbiBjbG9zZVxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdiY0Ryb3Bkb3duVG9nZ2xlJywgdW5pcXVlSWQpO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtZHJvcGRvd24uZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1kcm9wZG93bi5jb250cm9sbGVyJ1xuXSlcbiAgICAuZGlyZWN0aXZlKCdiY0Ryb3Bkb3duJywgKCRkb2N1bWVudCkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCY0Ryb3Bkb3duQ29udHJvbGxlcicsXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdiY0Ryb3Bkb3duQ29udHJvbGxlcicsXG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgIGNvbXBpbGU6ICh0RWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRFbGVtZW50LmF0dHIoJ3JvbGUnLCAnY29tYm9ib3gnKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAoJHNjb3BlLCAkZWxlbWVudCwgYXR0cnMsIGN0cmwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBkaXJlY3RpdmUgaXMgYSBjb21wb3NpdGUgb2YgMiBzZXBhcmF0ZSBGb3VuZGF0aW9uIGRpcmVjdGl2ZXNcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hpY2ggZG9uJ3QgcHJvdmlkZSBob29rcyB0byBrbm93IHdoZW4gaXQncyBjbGlja2VkIG9yIG9wZW5lZFxuICAgICAgICAgICAgICAgICAgICAvLyB0aGV5IGRvIGhvd2V2ZXIgZGVhbCB3aXRoIHByb3BhZ2F0aW9uIG9mIGV2ZW50cyBzbyB0aGlzLCBzb21ld2hhdCBibGluZFxuICAgICAgICAgICAgICAgICAgICAvLyBkb2N1bWVudCBldmVudCBpcyBzYWZlLiBBbGwgaXQgZG9lcyBpcyBzd2FwIGFyaWEgc3RhdGVzIGF0IHRoZSBtb21lbnRcbiAgICAgICAgICAgICAgICAgICAgLy8gaW4gYSBjaGVhcCB3YXkgdG8ga2VlcCB0aGlzIGRpcmVjdGl2ZSBpbiBzeW5jIHdpdGggaXQncyBjaGlsZCBkaXJlY3RpdmVcbiAgICAgICAgICAgICAgICAgICAgJGRvY3VtZW50Lm9uKCdjbGljaycsIGN0cmwuY2xvc2VEcm9wZG93bik7XG5cbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQub24oJyRkZXN0cm95JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGRvY3VtZW50Lm9mZignY2xpY2snLCBjdHJsLmNsb3NlRHJvcGRvd24pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLWRyb3Bkb3duJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1kcm9wZG93bi5kaXJlY3RpdmUnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1kcm9wZG93bi10b2dnbGUuZGlyZWN0aXZlJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtZHJvcGRvd24tbWVudS5kaXJlY3RpdmUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1wYWdpbmF0aW9uLmRpcmVjdGl2ZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ2JjUGFnaW5hdGlvbicsIGZ1bmN0aW9uIGJjUGFnaW5hdGlvbkRpcmVjdGl2ZSgkcGFyc2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICBzY29wZTogdHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL2JpZ2NvbW1lcmNlL2JjLXBhZ2luYXRpb24vYmMtcGFnaW5hdGlvbi50cGwuaHRtbCcsXG5cbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGJjUGFnaW5hdGlvbkNvbXBpbGUodEVsZW1lbnQsIHRBdHRycykge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyT2JqID0ge307XG5cbiAgICAgICAgICAgICAgICAvLyBTaW5jZSB0aGlzIGlzIGEgd3JhcHBlciBvZiBhbmd1bGFyLWZvdW5kYXRpb24ncyBwYWdpbmF0aW9uIGRpcmVjdGl2ZSB3ZSBuZWVkIHRvIGNvcHkgYWxsXG4gICAgICAgICAgICAgICAgLy8gb2YgdGhlIGF0dHJpYnV0ZXMgcGFzc2VkIHRvIG91ciBkaXJlY3RpdmUgYW5kIHN0b3JlIHRoZW0gaW4gdGhlIGF0dHJPYmouXG4gICAgICAgICAgICAgICAgXy5lYWNoKHRBdHRycy4kYXR0ciwgZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkgIT09ICdjbGFzcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJPYmpba2V5XSA9IHRFbGVtZW50LmF0dHIoa2V5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gQWRkaW5nIG91ciBjdXN0b20gY2FsbGJhY2sgdG8gdGhlIGF0dHJPYmosIGFuZ3VsYXItZm91bmRhdGlvbiB3aWxsIGNhbGwgdGhpcyBmdW5jdGlvblxuICAgICAgICAgICAgICAgIC8vIHdoZW4gYSBwYWdlIG51bWJlciBpcyBjbGlja2VkIGluIHRoZSBwYWdpbmF0aW9uLlxuICAgICAgICAgICAgICAgIGF0dHJPYmpbJ29uLXNlbGVjdC1wYWdlJ10gPSAncGFnaW5hdGlvbkNhbGxiYWNrKHBhZ2UpJztcblxuICAgICAgICAgICAgICAgIC8vIEFkZCBhbGwgdGhlIGF0dHJpYnV0ZXMgdG8gYW5ndWxhci1mb3VuZGF0aW9uJ3MgcGFnaW5hdGlvbiBkaXJlY3RpdmVcbiAgICAgICAgICAgICAgICB0RWxlbWVudC5maW5kKCdwYWdpbmF0aW9uJykuYXR0cihhdHRyT2JqKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBiY1BhZ2luYXRpb25MaW5rKCRzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9uQ2hhbmdlUGFyc2VHZXR0ZXIgPSAkcGFyc2UoYXR0cnMub25DaGFuZ2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdExpbWl0cyA9IFsxMCwgMjAsIDMwLCA1MCwgMTAwXTtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc2V0TGltaXQgPSBmdW5jdGlvbihsaW1pdCwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW1pdCA9IF8ucGFyc2VJbnQobGltaXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHBhcnNlKGF0dHJzLml0ZW1zUGVyUGFnZSkuYXNzaWduKCRzY29wZS4kcGFyZW50LCBsaW1pdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucGFnaW5hdGlvbkNhbGxiYWNrKDEsIGxpbWl0KTtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZ2V0Q3VycmVudFBhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcGFyc2UoYXR0cnMucGFnZSkoJHNjb3BlLiRwYXJlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5nZXRDdXJyZW50TGltaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcGFyc2UoYXR0cnMuaXRlbXNQZXJQYWdlKSgkc2NvcGUuJHBhcmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmdldEl0ZW1zUGVyUGFnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRwYXJzZShhdHRycy5pdGVtc1BlclBhZ2UpKCRzY29wZS4kcGFyZW50KSB8fCAwO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5nZXRUb3RhbEl0ZW1zID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHBhcnNlKGF0dHJzLnRvdGFsSXRlbXMpKCRzY29wZS4kcGFyZW50KSB8fCAwO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zaG93ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHBhcnNlKGF0dHJzLmFsd2F5c1Nob3cpKCRzY29wZS4kcGFyZW50KSB8fCAkc2NvcGUuZ2V0VG90YWxJdGVtcygpID4gJHNjb3BlLmdldEl0ZW1zUGVyUGFnZSgpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zaG93TGltaXRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHNjb3BlLnNob3coKSAmJiAkcGFyc2UoYXR0cnMuc2hvd0xpbWl0cykoJHNjb3BlLiRwYXJlbnQpICE9PSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZ2V0TGltaXRzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGltaXRzID0gJHBhcnNlKGF0dHJzLmxpbWl0cykoJHNjb3BlLiRwYXJlbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkobGltaXRzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWZhdWx0TGltaXRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGltaXRzO1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wYWdpbmF0aW9uQ2FsbGJhY2sgPSBmdW5jdGlvbihwYWdlLCBsaW1pdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFkZGl0aW9uYWxTY29wZVByb3BlcnRpZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0OiBsaW1pdCB8fCAkc2NvcGUuZ2V0Q3VycmVudExpbWl0KCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IHBhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlUGFyc2VSZXN1bHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICRwYXJzZShhdHRycy5wYWdlKS5hc3NpZ24oJHNjb3BlLiRwYXJlbnQsIHBhZ2UpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZVBhcnNlUmVzdWx0ID0gb25DaGFuZ2VQYXJzZUdldHRlcigkc2NvcGUsIGFkZGl0aW9uYWxTY29wZVByb3BlcnRpZXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgb25DaGFuZ2Ugc3RyaW5nIGlzIGEgZnVuY3Rpb24gYW5kIG5vdCBhbiBleHByZXNzaW9uOiBjYWxsIGl0IHdpdGggdGhlIGFkZGl0aW9uYWxTY29wZVByb3BlcnRpZXMgb2JqIChmb3IgYmFja3dhcmRzIGNvbXBhdGFiaWxpdHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlbHNlIHRoZSBleHByZXNzaW9uIGhhcyBhbHJlYWR5IGJlZW4gcmFuOiBkbyBub3RoaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9uQ2hhbmdlUGFyc2VSZXN1bHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZVBhcnNlUmVzdWx0KGFkZGl0aW9uYWxTY29wZVByb3BlcnRpZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtcGFnaW5hdGlvbicsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtcGFnaW5hdGlvbi5kaXJlY3RpdmUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUuY29udHJvbGxlcicsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtc2VydmVyLXRhYmxlLnNlcnZpY2UnXG5dKVxuXG4gICAgLmNvbnRyb2xsZXIoJ0JjU2VydmVyVGFibGVDdHJsJywgZnVuY3Rpb24gQmNTZXJ2ZXJUYWJsZUN0cmwoJGF0dHJzLCAkbG9nLCAkcGFyc2UsICRzY29wZSwgQmNTZXJ2ZXJUYWJsZSkge1xuICAgICAgICB2YXIgY3RybCA9IHRoaXMsXG4gICAgICAgICAgICBiY1NlcnZlclRhYmxlUHJvdG90eXBlID0gQmNTZXJ2ZXJUYWJsZS5wcm90b3R5cGU7XG5cbiAgICAgICAgLy8gQ2FsbCB0aGUgQmNTZXJ2ZXJUYWJsZSBjb25zdHJ1Y3RvciBvbiB0aGUgY29udHJvbGxlclxuICAgICAgICAvLyBpbiBvcmRlciB0byBzZXQgYWxsIHRoZSBjb250cm9sbGVyIHByb3BlcnRpZXMgZGlyZWN0bHkuXG4gICAgICAgIC8vIFRoaXMgaXMgaGVyZSBmb3IgYmFja3dhcmRzIGNvbXBhdGFiaWxpdHkgcHVycG9zZXMuXG4gICAgICAgIEJjU2VydmVyVGFibGUuY2FsbChjdHJsLCBudWxsLCAoJHBhcnNlKCRhdHRycy50YWJsZUNvbmZpZykoJHNjb3BlKSkpO1xuXG4gICAgICAgIC8vIGNvbnRyb2xsZXIgZnVuY3Rpb25zXG4gICAgICAgIGN0cmwuY3JlYXRlUGFyYW1zT2JqZWN0ID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS5jcmVhdGVQYXJhbXNPYmplY3Q7XG4gICAgICAgIGN0cmwuZGVzZWxlY3RBbGxSb3dzID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS5kZXNlbGVjdEFsbFJvd3M7XG4gICAgICAgIGN0cmwuZmV0Y2hSZXNvdXJjZSA9IGJjU2VydmVyVGFibGVQcm90b3R5cGUuZmV0Y2hSZXNvdXJjZTtcbiAgICAgICAgY3RybC5nZXRTZWxlY3RlZFJvd3MgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLmdldFNlbGVjdGVkUm93cztcbiAgICAgICAgY3RybC5pbml0ID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS5pbml0O1xuICAgICAgICBjdHJsLmlzUm93U2VsZWN0ZWQgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLmlzUm93U2VsZWN0ZWQ7XG4gICAgICAgIGN0cmwubG9hZFN0YXRlUGFyYW1zID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS5sb2FkU3RhdGVQYXJhbXM7XG4gICAgICAgIGN0cmwuc2VsZWN0QWxsUm93cyA9IGJjU2VydmVyVGFibGVQcm90b3R5cGUuc2VsZWN0QWxsUm93cztcbiAgICAgICAgY3RybC5zZXRQYWdpbmF0aW9uVmFsdWVzID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS5zZXRQYWdpbmF0aW9uVmFsdWVzO1xuICAgICAgICBjdHJsLnNldFJvd3MgPSBiY1NlcnZlclRhYmxlUHJvdG90eXBlLnNldFJvd3M7XG4gICAgICAgIGN0cmwuc2V0U2VsZWN0aW9uRm9yQWxsUm93cyA9IGJjU2VydmVyVGFibGVQcm90b3R5cGUuc2V0U2VsZWN0aW9uRm9yQWxsUm93cztcbiAgICAgICAgY3RybC5zZXRTb3J0aW5nVmFsdWVzID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS5zZXRTb3J0aW5nVmFsdWVzO1xuICAgICAgICBjdHJsLnVwZGF0ZVBhZ2UgPSBfLmJpbmQoYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS51cGRhdGVQYWdlLCBjdHJsKTtcbiAgICAgICAgY3RybC51cGRhdGVTb3J0ID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS51cGRhdGVTb3J0O1xuICAgICAgICBjdHJsLnVwZGF0ZVRhYmxlID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS51cGRhdGVUYWJsZTtcbiAgICAgICAgY3RybC52YWxpZGF0ZVJlc291cmNlID0gYmNTZXJ2ZXJUYWJsZVByb3RvdHlwZS52YWxpZGF0ZVJlc291cmNlO1xuXG4gICAgICAgIGluaXQoKTtcblxuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICAgdmFyIHJlc291cmNlQ2FsbGJhY2s7XG5cbiAgICAgICAgICAgIHJlc291cmNlQ2FsbGJhY2sgPSAkcGFyc2UoJGF0dHJzLnJlc291cmNlQ2FsbGJhY2spKCRzY29wZSk7XG4gICAgICAgICAgICBpZiAoIV8uaXNGdW5jdGlvbihyZXNvdXJjZUNhbGxiYWNrKSkge1xuICAgICAgICAgICAgICAgICRsb2cuZXJyb3IoJ2JjLXNlcnZlci10YWJsZSBkaXJlY3RpdmU6IHJlc291cmNlLWNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdHJsLnJlc291cmNlQ2FsbGJhY2sgPSByZXNvdXJjZUNhbGxiYWNrO1xuXG4gICAgICAgICAgICBjdHJsLmluaXQoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXNlcnZlci10YWJsZS5kaXJlY3RpdmUnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXNlcnZlci10YWJsZS5jb250cm9sbGVyJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtc2VydmVyLXRhYmxlLnNvcnQtYnkuZGlyZWN0aXZlJyxcbiAgICAndWkucm91dGVyJ1xuXSlcbiAgICAvKipcbiAgICAgKiBUaGUgYmMtc2VydmVyLXRhYmxlIGRpcmVjdGl2ZSBjcmVhdGVzIGEgZGF0YSB0YWJsZSB0aGF0IGhhbmRsZXNcbiAgICAgKiBzZXJ2ZXIgc2lkZSBwYWdpbmF0aW9uLCBzb3J0aW5nLCBhbmQgZmlsdGVyaW5nLiBJdCBleHBvc2VzIGEgZmV3IHNjb3BlIHZhcmlhYmxlcyxcbiAgICAgKiB0aGF0IGNhbiBiZSB1c2VkIHRvIGRpc3BsYXkgdGhlIHRhYmxlIGNvbnRlbnQgd2l0aCBjdXN0b20gbWFya3VwIChzZWUgZXhhbXBsZVxuICAgICAqIGluIHRoZSBwYXR0ZXJuIGxhYiBmb3IgYW4gYWN0dWFsIGltcGxlbWVudGF0aW9uIG9mIHRoZSBiYy1zZXJ2ZXItdGFibGUpLlxuICAgICAqXG4gICAgICogVGhlIGZvbGxvd2luZyBhdHRyaWJ1dGVzIGNhbiBiZSBwYXNzZWQgaW4gb3JkZXIgdG8gY29uZmlndXJlIHRoZSBiYy1zZXJ2ZXItdGFibGU6XG4gICAgICogLSByZXNvdXJjZS1jYWxsYmFjayAocmVxdWlyZWQpXG4gICAgICogLSB0YWJsZUNvbmZpZyAob3B0aW9uYWwpXG4gICAgICpcbiAgICAgKiAtIHJlc291cmNlLWNhbGxiYWNrIC0gYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlIHdoaWNoIGlzIHJlc292bGVkXG4gICAgICogd2l0aCBhbiBvYmplY3Qgb2YgdGhlIGZvbGxvd2luZyBmb3JtYXQ6XG4gICAgICogICAgICB7XG4gICAgICogICAgICAgICAgcm93czogQXJyYXksXG4gICAgICogICAgICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAqICAgICAgICAgICAgICBwYWdlOiBOdW1iZXIsXG4gICAgICogICAgICAgICAgICAgIGxpbWl0OiBOdW1iZXIsXG4gICAgICogICAgICAgICAgICAgIHRvdGFsOiBOdW1iZXJcbiAgICAgKiAgICAgICAgICB9XG4gICAgICogICAgICB9XG4gICAgICpcbiAgICAgKiBUaGlzIGRpcmVjdGl2ZSBleHBvc2VzIGEgc2NvcGUgdmFyaWFibGUgY2FsbGVkIGJjU2VydmVyVGFibGUgdGhhdFxuICAgICAqIGNhbiBiZSB1c2VkIHRvIGRpc3BsYXkgY29udGVudCwgYW5kIGltcGxlbWVudCBhZGRpdGlvbmFsIGZ1bmN0aW9uYWxpdHlcbiAgICAgKiB0byB0aGUgdGFibGUgKHN1Y2ggYXMgcGFnaW5hdGlvbiwgc29ydGluZywgYW5kIHNlbGVjdGlvbiBsb2dpYykuXG4gICAgICpcbiAgICAgKiAtIGJjU2VydmVyVGFibGUucm93c1xuICAgICAqICAgICAgLSBDYW4gYmUgdXNlZCB3aXRoIG5nLXJlcGVhdCB0byBkaXNwbGF5IHRoZSBkYXRhXG4gICAgICogLSBiY1NlcnZlclRhYmxlLmZpbHRlcnNcbiAgICAgKiAgICAgIC0gQ2FuIGJlIHVzZWQgdG8gY2hhbmdlL3VwZGF0ZSBmaWx0ZXJzLiBUaGVzZSBmaWx0ZXJzIG11c3QgYXBwZWFyXG4gICAgICogICAgICAgIGluIHRoZSBzdGF0ZSBkZWZpbml0aW9uIGluIG9yZGVyIHRvIHdvcmsgY29ycmVjdGx5LlxuICAgICAqIC0gYmNTZXJ2ZXJUYWJsZS51cGRhdGVUYWJsZSgpXG4gICAgICogICAgICAtIFBlcmZvcm0gYSBzdGF0ZSB0cmFuc2lzdGlvbiB3aXRoIHRoZSBjdXJyZW50IHRhYmxlIGluZm9cbiAgICAgKiAtIGJjU2VydmVyVGFibGUucGFnaW5hdGlvblxuICAgICAqICAgICAgLSBleHBvc2VzIHBhZ2UsIGxpbWl0LCBhbmQgdG90YWxcbiAgICAgKiAtIGJjU2VydmVyVGFibGUuc2V0UGFnaW5hdGlvblZhbHVlcyhwYWdpbmF0aW9uKVxuICAgICAqICAgICAgLSBjb252ZW5pZW5jZSBtZXRob2QgZm9yIHNldHRpbmcgcGFnaW5hdGlvbiB2YWx1ZXMgYXQgb25jZS5cbiAgICAgKlxuICAgICAqIC0gYmNTZXJ2ZXJUYWJsZS5zZWxlY3RlZFJvd3NcbiAgICAgKiAgICAgIC0gYW4gbWFwIG9iamVjdCB3aXRoIHVuaXF1ZSBpZCdzIGFzIGtleXMgYW5kIGJvb2xlYW4gdmFsdWVzIGFzIHRoZSBzZWxlY3RlZCBzdGF0ZVxuICAgICAqIC0gYmNTZXJ2ZXJUYWJsZS5hbGxTZWxlY3RlZFxuICAgICAqICAgICAgLSBhIGJvb2xlYW4gdmFsdWUgdXNlZCB0byBkZXRlcm1pbmUgaWYgYWxsIHJvd3Mgd2VyZSBzZWxlY3RlZCBvciBjbGVhcmVkXG4gICAgICogLSBiY1NlcnZlclRhYmxlLnNlbGVjdEFsbFJvd3MoKVxuICAgICAqICAgICAgLSB0b2dnbGUgYWxsIHJvd3Mgc2VsZWN0aW9uIHN0YXRlXG4gICAgICogLSBiY1NlcnZlclRhYmxlLmlzUm93U2VsZWN0ZWQocm93KVxuICAgICAqICAgICAgLSBoZWxwZXIgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGlmIGEgcm93IGlzIHNlbGVjdGVkXG4gICAgICogLSBiY1NlcnZlclRhYmxlLmdldFNlbGVjdGVkUm93cygpXG4gICAgICogICAgICAtIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBhcnJheSBvZiByb3cgb2JqZWN0cyB0aGF0IGFyZSBjdXJyZW50bHkgc2VsZWN0ZWRcbiAgICAgKlxuICAgICAqL1xuICAgIC5kaXJlY3RpdmUoJ2JjU2VydmVyVGFibGUnLCBmdW5jdGlvbiBiY1NlcnZlclRhYmxlRGlyZWN0aXZlKCRwYXJzZSkge1xuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQmNTZXJ2ZXJUYWJsZUN0cmwgYXMgYmNTZXJ2ZXJUYWJsZScsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiBiY1NlcnZlclRhYmxlTGluaygkc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBiY1NlcnZlclRhYmxlQ3RybCkge1xuICAgICAgICAgICAgICAgIGlmIChhdHRycy50YWJsZUNvbnRyb2xsZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZXhwb3NlIGJjU2VydmVyVGFibGVDdHJsIHRvIHRhYmxlQ29udHJvbGxlciBpZiBpdCBleGlzdHNcbiAgICAgICAgICAgICAgICAgICAgJHBhcnNlKGF0dHJzLnRhYmxlQ29udHJvbGxlcikuYXNzaWduKCRzY29wZSwgYmNTZXJ2ZXJUYWJsZUN0cmwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXNlcnZlci10YWJsZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtc2VydmVyLXRhYmxlLmRpcmVjdGl2ZScsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXNlcnZlci10YWJsZS5zb3J0LWJ5LmRpcmVjdGl2ZScsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXNlcnZlci10YWJsZS1mYWN0b3J5LnNlcnZpY2UnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUuc29ydC1ieS5kaXJlY3RpdmUnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLXNlcnZlci10YWJsZS1mYWN0b3J5LnNlcnZpY2UnXG5dKVxuICAgIC5kaXJlY3RpdmUoJ2JjU29ydEJ5JywgZnVuY3Rpb24gYmNTb3J0QnlEaXJlY3RpdmUoJGxvZywgYmNTZXJ2ZXJUYWJsZUZhY3RvcnkpIHtcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL2JpZ2NvbW1lcmNlL2JjLXNlcnZlci10YWJsZS9iYy1zb3J0LWJ5LnRwbC5odG1sJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBzb3J0VmFsdWU6ICdAJyxcbiAgICAgICAgICAgICAgICBjb2x1bW5OYW1lOiAnQCcsXG4gICAgICAgICAgICAgICAgdGFibGVJZDogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVxdWlyZTogJz9eXmJjU2VydmVyVGFibGUnLFxuICAgICAgICAgICAgbGluazogYmNTb3J0QnlEaXJlY3RpdmVMaW5rXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gYmNTb3J0QnlEaXJlY3RpdmVMaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycywgYmNTZXJ2ZXJUYWJsZUN0cmwpIHtcbiAgICAgICAgICAgIHZhciBiY1NlcnZlclRhYmxlLFxuICAgICAgICAgICAgICAgIHNvcnREaXJWYWx1ZXM7XG5cbiAgICAgICAgICAgIGlmIChzY29wZS50YWJsZUlkKSB7XG4gICAgICAgICAgICAgICAgYmNTZXJ2ZXJUYWJsZSA9IGJjU2VydmVyVGFibGVGYWN0b3J5LmdldChzY29wZS50YWJsZUlkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYmNTZXJ2ZXJUYWJsZUN0cmwpIHtcbiAgICAgICAgICAgICAgICBiY1NlcnZlclRhYmxlID0gYmNTZXJ2ZXJUYWJsZUN0cmw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRsb2cuZXJyb3IoJ2JjLXNvcnQtYnkgZGlyZWN0aXZlIHJlcXVpcmVzIGEgdGFibGUtaWQsIG9yIGEgcGFyZW50IGJjU2VydmVyVGFibGVDdHJsIGRpcmVjdGl2ZS4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc29ydERpclZhbHVlcyA9IGJjU2VydmVyVGFibGUudGFibGVDb25maWcuc29ydERpclZhbHVlcztcblxuICAgICAgICAgICAgc2NvcGUuYXNjID0gc29ydERpclZhbHVlcy5hc2M7XG4gICAgICAgICAgICBzY29wZS5kZXNjID0gc29ydERpclZhbHVlcy5kZXNjO1xuICAgICAgICAgICAgc2NvcGUuc29ydEJ5ID0gYmNTZXJ2ZXJUYWJsZS5zb3J0Qnk7XG4gICAgICAgICAgICBzY29wZS5zb3J0RGlyID0gYmNTZXJ2ZXJUYWJsZS5zb3J0RGlyO1xuICAgICAgICAgICAgc2NvcGUuc29ydCA9IHNvcnQ7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHNvcnQoJGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNvcnRCeSxcbiAgICAgICAgICAgICAgICAgICAgc29ydERpcjtcblxuICAgICAgICAgICAgICAgIGlmICgkZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGJjU2VydmVyVGFibGUuc29ydEJ5ID09PSBzY29wZS5zb3J0VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgc29ydEJ5ID0gYmNTZXJ2ZXJUYWJsZS5zb3J0Qnk7XG4gICAgICAgICAgICAgICAgICAgIHNvcnREaXIgPSBiY1NlcnZlclRhYmxlLnNvcnREaXIgPT09IHNjb3BlLmFzYyA/IHNjb3BlLmRlc2MgOiBzY29wZS5hc2M7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc29ydEJ5ID0gc2NvcGUuc29ydFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBzb3J0RGlyID0gc2NvcGUuYXNjO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJjU2VydmVyVGFibGUudXBkYXRlU29ydChzb3J0QnksIHNvcnREaXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jaGVja2JveC1saXN0LmNvbnRyb2xsZXInLCBbXSlcbiAgICAuY29udHJvbGxlcignQ2hlY2tib3hMaXN0Q3RybCcsIGZ1bmN0aW9uIENoZWNrYm94TGlzdEN0cmwoJGF0dHJzLCAkZWxlbWVudCwgJGxvZywgJHBhcnNlLCAkc2NvcGUpIHtcbiAgICAgICAgdmFyIGN0cmwgPSB0aGlzLFxuICAgICAgICAgICAgZmFsc2VWYWx1ZSA9ICRwYXJzZSgkYXR0cnMubmdGYWxzZVZhbHVlKShjdHJsKSB8fCBmYWxzZSxcbiAgICAgICAgICAgIHRydWVWYWx1ZSA9ICRwYXJzZSgkYXR0cnMubmdUcnVlVmFsdWUpKGN0cmwpIHx8IHRydWUsXG4gICAgICAgICAgICBuZ01vZGVsID0gJGVsZW1lbnQuY29udHJvbGxlcignbmdNb2RlbCcpO1xuXG4gICAgICAgIGluaXQoKTtcblxuICAgICAgICAvLyBHZXR0ZXJzXG4gICAgICAgIGZ1bmN0aW9uIGdldE1vZGVsVmFsdWUoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmdNb2RlbC4kbW9kZWxWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFZhbHVlKCkge1xuICAgICAgICAgICAgcmV0dXJuIGN0cmwudmFsdWUgfHwgY3RybC5uZ1ZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0U2VsZWN0ZWRWYWx1ZXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gY3RybC5zZWxlY3RlZFZhbHVlcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldHRlcnNcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlTW9kZWxWYWx1ZShtb2RlbFZhbHVlKSB7XG4gICAgICAgICAgICBuZ01vZGVsLiRzZXRWaWV3VmFsdWUobW9kZWxWYWx1ZSk7XG4gICAgICAgICAgICBuZ01vZGVsLiRjb21taXRWaWV3VmFsdWUoKTtcbiAgICAgICAgICAgIG5nTW9kZWwuJHJlbmRlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlU2VsZWN0ZWRWYWx1ZXMobW9kZWxWYWx1ZSkge1xuICAgICAgICAgICAgaWYgKG1vZGVsVmFsdWUgPT09IHRydWVWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGFkZFRvU2VsZWN0ZWRWYWx1ZXMoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobW9kZWxWYWx1ZSA9PT0gZmFsc2VWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHJlbW92ZUZyb21TZWxlY3RlZFZhbHVlcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYWRkVG9TZWxlY3RlZFZhbHVlcygpIHtcbiAgICAgICAgICAgIHZhciBpc0luY2x1ZGVkID0gXy5pbmNsdWRlKGN0cmwuc2VsZWN0ZWRWYWx1ZXMsIGdldFZhbHVlKCkpO1xuXG4gICAgICAgICAgICBpZiAoIWlzSW5jbHVkZWQpIHtcbiAgICAgICAgICAgICAgICBjdHJsLnNlbGVjdGVkVmFsdWVzLnB1c2goZ2V0VmFsdWUoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZW1vdmVGcm9tU2VsZWN0ZWRWYWx1ZXMoKSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBfLmluZGV4T2YoY3RybC5zZWxlY3RlZFZhbHVlcywgZ2V0VmFsdWUoKSk7XG5cbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBjdHJsLnNlbGVjdGVkVmFsdWVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXYXRjaGVyc1xuICAgICAgICBmdW5jdGlvbiBtb2RlbFZhbHVlV2F0Y2gobW9kZWxWYWx1ZSwgb2xkTW9kZWxWYWx1ZSkge1xuICAgICAgICAgICAgdmFyIG9sZFNlbGVjdGVkVmFsdWVzLFxuICAgICAgICAgICAgICAgIHNlbGVjdGVkVmFsdWVzQ2hhbmdlZDtcblxuICAgICAgICAgICAgLy8gV2hlbiBuZ01vZGVsIHZhbHVlIGNoYW5nZXNcbiAgICAgICAgICAgIGlmIChfLmlzVW5kZWZpbmVkKG1vZGVsVmFsdWUpIHx8IG1vZGVsVmFsdWUgPT09IG9sZE1vZGVsVmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFJldGFpbiBhIHNoYWxsb3cgY29weSBvZiBzZWxlY3RlZFZhbHVlcyBiZWZvcmUgdXBkYXRlXG4gICAgICAgICAgICBvbGRTZWxlY3RlZFZhbHVlcyA9IGN0cmwuc2VsZWN0ZWRWYWx1ZXMuc2xpY2UoKTtcblxuICAgICAgICAgICAgLy8gVXBkYXRlIHNlbGVjdGVkVmFsdWVzXG4gICAgICAgICAgICB1cGRhdGVTZWxlY3RlZFZhbHVlcyhtb2RlbFZhbHVlKTtcblxuICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIGlmIHNlbGVjdGVkVmFsdWVzIGFycmF5IGhhcyBjaGFuZ2VkXG4gICAgICAgICAgICBzZWxlY3RlZFZhbHVlc0NoYW5nZWQgPSAhIV8ueG9yKGN0cmwuc2VsZWN0ZWRWYWx1ZXMsIG9sZFNlbGVjdGVkVmFsdWVzKS5sZW5ndGg7XG5cbiAgICAgICAgICAgIC8vIElmIGNoYW5nZWQsIGV2b2tlIGRlbGVnYXRlIG1ldGhvZCAoaWYgZGVmaW5lZClcbiAgICAgICAgICAgIGlmIChjdHJsLm9uQ2hhbmdlICYmIHNlbGVjdGVkVmFsdWVzQ2hhbmdlZCkge1xuICAgICAgICAgICAgICAgIGN0cmwub25DaGFuZ2Uoe1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZFZhbHVlczogY3RybC5zZWxlY3RlZFZhbHVlcyxcbiAgICAgICAgICAgICAgICAgICAgb2xkU2VsZWN0ZWRWYWx1ZXM6IG9sZFNlbGVjdGVkVmFsdWVzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZWxlY3RlZFZhbHVlc1dhdGNoKHNlbGVjdGVkVmFsdWVzKSB7XG4gICAgICAgICAgICAvLyBXaGVuIHNlbGVjdGVkVmFsdWVzIGNvbGxlY3Rpb24gY2hhbmdlc1xuICAgICAgICAgICAgdmFyIGlzSW5jbHVkZWQgPSBfLmluY2x1ZGUoc2VsZWN0ZWRWYWx1ZXMsIGdldFZhbHVlKCkpLFxuICAgICAgICAgICAgICAgIG1vZGVsVmFsdWUgPSBnZXRNb2RlbFZhbHVlKCk7XG5cbiAgICAgICAgICAgIGlmIChpc0luY2x1ZGVkICYmIG1vZGVsVmFsdWUgIT09IHRydWVWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHVwZGF0ZU1vZGVsVmFsdWUodHJ1ZVZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWlzSW5jbHVkZWQgJiYgbW9kZWxWYWx1ZSAhPT0gZmFsc2VWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHVwZGF0ZU1vZGVsVmFsdWUoZmFsc2VWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbml0aWFsaXplclxuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAgICAgaWYgKCRhdHRycy50eXBlICE9PSAnY2hlY2tib3gnKSB7XG4gICAgICAgICAgICAgICAgJGxvZy5lcnJvcignY2hlY2tib3gtbGlzdCBkaXJlY3RpdmU6IGVsZW1lbnQgbXVzdCBiZSA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCI+Jyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goZ2V0TW9kZWxWYWx1ZSwgbW9kZWxWYWx1ZVdhdGNoKTtcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2hDb2xsZWN0aW9uKGdldFNlbGVjdGVkVmFsdWVzLCBzZWxlY3RlZFZhbHVlc1dhdGNoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNoZWNrYm94LWxpc3QuZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jaGVja2JveC1saXN0LmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLyoqXG4gICAgICogQSBkaXJlY3RpdmUgZm9yIGNvbGxhdGluZyB2YWx1ZXMgZnJvbSBhbiBhcnJheSBvZiBjaGVja2JveGVzLlxuICAgICAqXG4gICAgICogQHJlcXVpcmUgbmdNb2RlbFxuICAgICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZ3xudW1iZXJ8T2JqZWN0Pn0gY2hlY2tib3hMaXN0IC0gQXJyYXkgdG8gaG9sZCBzZWxlY3RlZCB2YWx1ZXNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIC0gVmFsdWUgdG8gYWRkIHRvIGNoZWNrYm94TGlzdFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oc2VsZWN0ZWRWYWx1ZXMsIG9sZFNlbGVjdGVkVmFsdWVzfSBbY2hlY2tib3hMaXN0Q2hhbmdlXSAtIE9wdGlvbmFsIG9uQ2hhbmdlIGNhbGxiYWNrXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZTpcbiAgICAgKiBgYGBodG1sXG4gICAgICogPGRpdiBuZy1yZXBlYXQ9XCJvcHRpb24gaW4gb3B0aW9uc1wiPlxuICAgICAqICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgXG4gICAgICogICAgICAgICBuYW1lPVwib3B0aW9ue3sgb3B0aW9uLmlkIH19XCJcbiAgICAgKiAgICAgICAgIHZhbHVlPVwib3B0aW9uLmlkXCIgXG4gICAgICogICAgICAgICBjaGVja2JveC1saXN0PVwic2VsZWN0ZWRWYWx1ZXNcIiBcbiAgICAgKiAgICAgICAgIGNoZWNrYm94LWxpc3QtY2hhbmdlPVwib25DaGFuZ2Uoc2VsZWN0ZWRWYWx1ZXMpXCIgXG4gICAgICogICAgICAgICBuZy1tb2RlbD1cIm9wdGlvbi5jaGVja2VkXCJcbiAgICAgKiAgICAgLz5cbiAgICAgKiA8L2Rpdj5cbiAgICAgKiBgYGBcbiAgICAgKiBcbiAgICAgKiBgYGBqc1xuICAgICAqIHNjb3BlLnNlbGVjdGVkVmFsdWVzID0gW107XG4gICAgICogc2NvcGUub3B0aW9ucyA9IFtcbiAgICAgKiAgICAge1xuICAgICAqICAgICAgICAgaWQ6IDEsXG4gICAgICogICAgICAgICBsYWJlbDogJ09wdGlvbiAxJ1xuICAgICAqICAgICB9LFxuICAgICAqICAgICB7XG4gICAgICogICAgICAgICBpZDogMixcbiAgICAgKiAgICAgICAgIGxhYmVsOiAnT3B0aW9uIDInXG4gICAgICogICAgIH0sXG4gICAgICogICAgIHtcbiAgICAgKiAgICAgICAgIGlkOiAzLFxuICAgICAqICAgICAgICAgbGFiZWw6ICdPcHRpb24gMydcbiAgICAgKiAgICAgfVxuICAgICAqIF07XG4gICAgICogXG4gICAgICogc2NvcGUub25DaGFuZ2UgPSBmdW5jdGlvbiBvbkNoYW5nZShzZWxlY3RlZFZhbHVlcykge1xuICAgICAqICAgICBjb25zb2xlLmxvZyhzZWxlY3RlZFZhbHVlcyk7XG4gICAgICogfTtcbiAgICAgKiBgYGBcbiAgICAgKiBcbiAgICAgKiBXaGVuIG9wdGlvbnNbMF0gYW5kIG9wdGlvbnNbMV0gYXJlIGNoZWNrZWQsIHNlbGVjdGVkVmFsdWVzIHNob3VsZCBiZSBbMSwgMl1cbiAgICAgKiBhbmQgb25DaGFuZ2Ugd2lsbCBiZSBldm9rZWQuIFRoaXMgZGlyZWN0aXZlIGFsc28gd29ya3Mgd2l0aCBhbiBhcnJheSBvZiBwcmltaXRpdmUgdmFsdWVzLlxuICAgICAqIGkuZS46IHNjb3BlLm9wdGlvbnMgPSBbXCJhXCIsIFwiYlwiLCBcImNcIl0uXG4gICAgICovXG5cbiAgICAuZGlyZWN0aXZlKCdjaGVja2JveExpc3QnLCBmdW5jdGlvbiBjaGVja2JveExpc3REaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0NoZWNrYm94TGlzdEN0cmwnLFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY2hlY2tib3hMaXN0Q3RybCcsXG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBvbkNoYW5nZTogJyZjaGVja2JveExpc3RDaGFuZ2UnLFxuICAgICAgICAgICAgICAgIHNlbGVjdGVkVmFsdWVzOiAnPWNoZWNrYm94TGlzdCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6ICc9JyxcbiAgICAgICAgICAgICAgICBuZ1ZhbHVlOiAnPSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jaGVja2JveC1saXN0JywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jaGVja2JveC1saXN0LmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNvbG9yLXBpY2tlci1wYWxldHRlLmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdDb2xvclBpY2tlclBhbGV0dGVDdHJsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBjdHJsID0gdGhpcztcblxuICAgICAgICBjdHJsLmNyZWF0ZU5ld0NvbG9yID0gY3JlYXRlTmV3Q29sb3I7XG4gICAgICAgIGN0cmwucmVtb3ZlRXhpc3RpbmdDb2xvciA9IHJlbW92ZUV4aXN0aW5nQ29sb3I7XG4gICAgICAgIGN0cmwuaXNBY3RpdmUgPSBpc0FjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVOZXdDb2xvcigkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBjdHJsLmNyZWF0ZU5ld1BhbGV0dGVDb2xvcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlRXhpc3RpbmdDb2xvcigkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBjdHJsLnJlbW92ZVBhbGV0dGVDb2xvcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNBY3RpdmUoY29sb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBjb2xvciA9PT0gY3RybC5zZWxlY3RlZENvbG9yO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY29sb3ItcGlja2VyLXBhbGV0dGUuZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jb2xvci1waWNrZXItcGFsZXR0ZS5jb250cm9sbGVyJ1xuXSlcblxuICAgIC5kaXJlY3RpdmUoJ2NvbG9yUGlja2VyUGFsZXR0ZScsIGZ1bmN0aW9uIGNvbG9yUGlja2VyUGFsZXR0ZURpcmVjdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQ29sb3JQaWNrZXJQYWxldHRlQ3RybCcsXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjb2xvclBpY2tlclBhbGV0dGVDdHJsJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIGNvbG9yczogJz0nLFxuICAgICAgICAgICAgICAgIGNyZWF0ZU5ld1BhbGV0dGVDb2xvcjogJz0nLFxuICAgICAgICAgICAgICAgIHJlbW92ZVBhbGV0dGVDb2xvcjogJz0nLFxuICAgICAgICAgICAgICAgIHNldE5ld0NvbG9yOiAnPScsXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRDb2xvcjogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvanMvYmlnY29tbWVyY2UvY29sb3ItcGlja2VyL2NvbG9yLXBpY2tlci1wYWxldHRlLnRwbC5odG1sJyxcbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGNvbG9yUGlja2VyUGFsZXR0ZURpcmVjdGl2ZUNvbXBpbGUodEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0RWxlbWVudC5hZGRDbGFzcygnY29sb3JQaWNrZXItcGFsZXR0ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiLyogZ2xvYmFscyBDb2xvclBpY2tlciAqL1xuYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNvbG9yLXBpY2tlci5jb250cm9sbGVyJywgW10pXG4gICAgLmNvbnRyb2xsZXIoJ0NvbG9yUGlja2VyQ3RybCcsIGZ1bmN0aW9uIENvbG9yUGlja2VyQ3RybCgkZWxlbWVudCkge1xuICAgICAgICBjb25zdCBjdHJsID0gdGhpcztcblxuICAgICAgICBsZXQgY29sb3JTZWxlY3Rpb247XG4gICAgICAgIGxldCBjb2xvclNlbGVjdGlvbkluZGljYXRvcjtcbiAgICAgICAgbGV0IGNvbG9yU2xpZGVyO1xuICAgICAgICBsZXQgY29sb3JTbGlkZXJJbmRpY2F0b3I7XG5cbiAgICAgICAgY3RybC5jcmVhdGVDb2xvclBpY2tlciA9IGNyZWF0ZUNvbG9yUGlja2VyO1xuICAgICAgICBjdHJsLmNyZWF0ZU5ld1BhbGV0dGVDb2xvciA9IGNyZWF0ZU5ld1BhbGV0dGVDb2xvcjtcbiAgICAgICAgY3RybC5yZW1vdmVQYWxldHRlQ29sb3IgPSByZW1vdmVQYWxldHRlQ29sb3I7XG4gICAgICAgIGN0cmwuc2V0TW9kZWxDdHJsID0gc2V0TW9kZWxDdHJsO1xuICAgICAgICBjdHJsLnNldE5ld0NvbG9yID0gc2V0TmV3Q29sb3I7XG4gICAgICAgIGN0cmwuZ2V0U2VsZWN0ZWRDb2xvciA9IGdldFNlbGVjdGVkQ29sb3I7XG5cbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlQ29sb3JQaWNrZXIoKSB7XG4gICAgICAgICAgICBjb2xvclNlbGVjdGlvbiA9ICRlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWJjLXBpY2tlcl0nKTtcbiAgICAgICAgICAgIGNvbG9yU2VsZWN0aW9uSW5kaWNhdG9yID0gJGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignW2RhdGEtYmMtcGlja2VyLWluZGljYXRvcl0nKTtcbiAgICAgICAgICAgIGNvbG9yU2xpZGVyID0gJGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignW2RhdGEtYmMtc2xpZGVyXScpO1xuICAgICAgICAgICAgY29sb3JTbGlkZXJJbmRpY2F0b3IgPSAkZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yKCdbZGF0YS1iYy1zbGlkZXItaW5kaWNhdG9yXScpO1xuXG4gICAgICAgICAgICBDb2xvclBpY2tlci5maXhJbmRpY2F0b3JzKFxuICAgICAgICAgICAgICAgIGNvbG9yU2xpZGVySW5kaWNhdG9yLFxuICAgICAgICAgICAgICAgIGNvbG9yU2VsZWN0aW9uSW5kaWNhdG9yKTtcblxuICAgICAgICAgICAgY3RybC5jcCA9IG5ldyBDb2xvclBpY2tlcihcbiAgICAgICAgICAgICAgICBjb2xvclNsaWRlcixcbiAgICAgICAgICAgICAgICBjb2xvclNlbGVjdGlvbixcbiAgICAgICAgICAgICAgICBwaWNrTmV3Q29sb3JcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVOZXdQYWxldHRlQ29sb3IoKSB7XG4gICAgICAgICAgICBpZiAoY3RybC5wYWxldHRlLmluZGV4T2YoZ2V0U2VsZWN0ZWRDb2xvcigpKSA8IDApIHtcbiAgICAgICAgICAgICAgICBjdHJsLnBhbGV0dGUucHVzaChnZXRTZWxlY3RlZENvbG9yKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlUGFsZXR0ZUNvbG9yKCkge1xuICAgICAgICAgICAgaWYgKGN0cmwucGFsZXR0ZS5pbmRleE9mKGdldFNlbGVjdGVkQ29sb3IoKSkgPiAtMSkge1xuICAgICAgICAgICAgICAgIGN0cmwucGFsZXR0ZS5zcGxpY2UoY3RybC5wYWxldHRlLmluZGV4T2YoZ2V0U2VsZWN0ZWRDb2xvcigpKSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRTZWxlY3RlZENvbG9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIGN0cmwuY29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBwaWNrTmV3Q29sb3IoaGV4LCBoc3YsIHJnYiwgcGlja2VyQ29vcmRpbmF0ZSwgc2xpZGVyQ29vcmRpbmF0ZSkge1xuICAgICAgICAgICAgQ29sb3JQaWNrZXIucG9zaXRpb25JbmRpY2F0b3JzKFxuICAgICAgICAgICAgICAgIGNvbG9yU2xpZGVySW5kaWNhdG9yLFxuICAgICAgICAgICAgICAgIGNvbG9yU2VsZWN0aW9uSW5kaWNhdG9yLFxuICAgICAgICAgICAgICAgIHNsaWRlckNvb3JkaW5hdGUsIHBpY2tlckNvb3JkaW5hdGVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGN0cmwubmdNb2RlbEN0cmwuJHNldFZpZXdWYWx1ZShoZXgpO1xuICAgICAgICAgICAgY3RybC5uZ01vZGVsQ3RybC4kcmVuZGVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgICAgICBjdHJsLmNvbG9yID0gY3RybC5uZ01vZGVsQ3RybC4kdmlld1ZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0TW9kZWxDdHJsKG5nTW9kZWxDdHJsKSB7XG4gICAgICAgICAgICBjdHJsLm5nTW9kZWxDdHJsID0gbmdNb2RlbEN0cmw7XG4gICAgICAgICAgICBjdHJsLm5nTW9kZWxDdHJsLiRyZW5kZXIgPSByZW5kZXI7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXROZXdDb2xvcigkZXZlbnQsIG5ld0NvbG9yKSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgY3RybC5jcC5zZXRIZXgobmV3Q29sb3IpO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY29sb3ItcGlja2VyLmRpcmVjdGl2ZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY29sb3ItcGlja2VyLmNvbnRyb2xsZXInLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5odG1sNU1vZGUnLFxuXSlcblxuICAgIC5kaXJlY3RpdmUoJ2NvbG9yUGlja2VyJywgZnVuY3Rpb24gY29sb3JQaWNrZXJEaXJlY3RpdmUoJGxvY2F0aW9uLCBodG1sNU1vZGUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQ29sb3JQaWNrZXJDdHJsJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2NvbG9yUGlja2VyQ3RybCcsXG4gICAgICAgICAgICByZXF1aXJlOiBbJ2NvbG9yUGlja2VyJywgJ15uZ01vZGVsJ10sXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBwYWxldHRlOiAnPScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvanMvYmlnY29tbWVyY2UvY29sb3ItcGlja2VyL2NvbG9yLXBpY2tlci50cGwuaHRtbCcsXG5cbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGNvbG9yUGlja2VyRGlyZWN0aXZlQ29tcGlsZSh0RWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRFbGVtZW50LmFkZENsYXNzKCdjb2xvclBpY2tlcicpO1xuXG4gICAgICAgICAgICAgICAgLy8gU2FuaXRpemUgdXJscyBzbyB0aGF0IGFuICNhbmNob3ItaGFzaCBkb2Vzbid0IGJyZWFrIHRoZSBjb2xvcnBpY2tlclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhZ2VVcmwgPSAkbG9jYXRpb24uYWJzVXJsKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFnZVVybEhhc2ggPSAkbG9jYXRpb24uaGFzaCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNhbml0aXplVXJsID0gcGFnZVVybEhhc2ggPyBwYWdlVXJsLnNwbGl0KCcjJyArIHBhZ2VVcmxIYXNoKVswXSA6IHBhZ2VVcmw7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gY29sb3JQaWNrZXJEaXJlY3RpdmVMaW5rKCRzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmxzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN0cmwgPSBjdHJsc1swXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmdNb2RlbEN0cmwgPSBjdHJsc1sxXTtcblxuICAgICAgICAgICAgICAgICAgICBjdHJsLnNldE1vZGVsQ3RybChuZ01vZGVsQ3RybCk7XG4gICAgICAgICAgICAgICAgICAgIGN0cmwuY3JlYXRlQ29sb3JQaWNrZXIoKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBBcHBzIHRoYXQgaGF2ZSBhIDxiYXNlPiB0YWcgcmVxdWlyZSB0byBoYXZlIGFic29sdXRlIHBhdGhzXG4gICAgICAgICAgICAgICAgICAgIC8vIHdoZW4gdXNpbmcgc3ZnIHVybCByZWZlcmVuY2VzXG4gICAgICAgICAgICAgICAgICAgIGlmIChodG1sNU1vZGUuZW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvckFsbCgnW2ZpbGxdJyksIGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYmV0d2VlblBhcmVudGhlc2lzID0gL1xcKChbXildKylcXCkvO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVsZW0gPSBhbmd1bGFyLmVsZW1lbnQoZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRGaWxsID0gZWxlbS5hdHRyKCdmaWxsJyk7XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfLmNvbnRhaW5zKGN1cnJlbnRGaWxsLCAndXJsKCMnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdGaWxsID0gYmV0d2VlblBhcmVudGhlc2lzLmV4ZWMoY3VycmVudEZpbGwpWzFdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW0uYXR0cignZmlsbCcsICd1cmwoJyArIHNhbml0aXplVXJsICsgbmV3RmlsbCArICcpJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJHdhdGNoKGdldE1vZGVsVmFsdWUsIGZ1bmN0aW9uIG1vZGVsV2F0Y2gobmV3VmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3VmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RybC5jcC5zZXRIZXgobmV3VmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZ2V0TW9kZWxWYWx1ZSgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjdHJsLm5nTW9kZWxDdHJsLiRtb2RlbFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jb2xvci1waWNrZXInLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNvbG9yLXBpY2tlci5kaXJlY3RpdmUnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jb2xvci1waWNrZXItcGFsZXR0ZS5kaXJlY3RpdmUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jb3B5LWNsaXBib2FyZC5jb25zdGFudCcsIFtdKVxuICAgIC5mYWN0b3J5KCdDTElQQk9BUkRfVE9PTFRJUCcsIGZ1bmN0aW9uIChnZXR0ZXh0Q2F0YWxvZykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3VjY2Vzczoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGdldHRleHRDYXRhbG9nLmdldFN0cmluZygnQ29waWVkIScpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgICAgICBtb2JpbGU6IGdldHRleHRDYXRhbG9nLmdldFN0cmluZygnVGFwIGRvd24gYW5kIGhvbGQgdG8gY29weScpLFxuICAgICAgICAgICAgICAgIG1hYzogZ2V0dGV4dENhdGFsb2cuZ2V0U3RyaW5nKCdQcmVzcyDijJgtQyB0byBjb3B5JyksXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogZ2V0dGV4dENhdGFsb2cuZ2V0U3RyaW5nKCdQcmVzcyBDdHJsLUMgdG8gY29weScpXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY29weS1jbGlwYm9hcmQuY29udHJvbGxlcicsIFtdKVxuICAgIC5jb250cm9sbGVyKCdDb3B5Q2xpcGJvYXJkQ3RybCcsIGZ1bmN0aW9uIENvcHlDbGlwYm9hcmRDdHJsKENMSVBCT0FSRF9UT09MVElQLCBkZXZpY2VTZXJ2aWNlLCAkdGltZW91dCl7XG4gICAgICAgIHZhciBjdHJsID0gdGhpcztcblxuICAgICAgICBjdHJsLnRpbWVvdXQgPSAkdGltZW91dDtcbiAgICAgICAgY3RybC5vbkVycm9yID0gb25FcnJvcjtcbiAgICAgICAgY3RybC5vblN1Y2Nlc3MgPSBvblN1Y2Nlc3M7XG5cbiAgICAgICAgaW5pdCgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICBjdHJsLnVuaXF1ZUlkID0gXy51bmlxdWVJZCgnY2xpcGJvYXJkLScpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb25TdWNjZXNzKCkge1xuICAgICAgICAgICAgY3RybC5keW5hbWljVG9vbHRpcCA9IENMSVBCT0FSRF9UT09MVElQLnN1Y2Nlc3MuZGVmYXVsdDtcbiAgICAgICAgICAgIHNob3dUb29sdGlwKGN0cmwudW5pcXVlSWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb25FcnJvcigpe1xuICAgICAgICAgICAgdmFyIHRvb2x0aXBNZXNzYWdlO1xuXG4gICAgICAgICAgICBpZiAoZGV2aWNlU2VydmljZS5pc0lPU0RldmljZSgpIHx8IGRldmljZVNlcnZpY2UuaXNNb2JpbGVEZXZpY2UoKSkge1xuICAgICAgICAgICAgICAgIHRvb2x0aXBNZXNzYWdlID0gQ0xJUEJPQVJEX1RPT0xUSVAuZXJyb3IubW9iaWxlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkZXZpY2VTZXJ2aWNlLmlzTWFjT1NEZXZpY2UoKSkge1xuICAgICAgICAgICAgICAgIHRvb2x0aXBNZXNzYWdlID0gQ0xJUEJPQVJEX1RPT0xUSVAuZXJyb3IubWFjO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0b29sdGlwTWVzc2FnZSA9IENMSVBCT0FSRF9UT09MVElQLmVycm9yLmRlZmF1bHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGN0cmwuZHluYW1pY1Rvb2x0aXAgPSB0b29sdGlwTWVzc2FnZTtcbiAgICAgICAgICAgIHNob3dUb29sdGlwKGN0cmwudW5pcXVlSWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2hvd1Rvb2x0aXAoaWQpIHtcbiAgICAgICAgICAgIHZhciB0b29sdGlwRWxlbWVudCA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkpO1xuXG4gICAgICAgICAgICBjdHJsLnRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRvb2x0aXBFbGVtZW50LnRyaWdnZXJIYW5kbGVyKCd0b29sdGlwVHJpZ2dlck9wZW4nKTtcbiAgICAgICAgICAgICAgICBjdHJsLnRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0b29sdGlwRWxlbWVudC50cmlnZ2VySGFuZGxlcigndG9vbHRpcFRyaWdnZXJDbG9zZScpO1xuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jb3B5LWNsaXBib2FyZC5kaXJlY3RpdmUnLCBbXSlcbiAgICAuZGlyZWN0aXZlKCdjb3B5Q2xpcGJvYXJkJywgZnVuY3Rpb24gY29weUNsaXBib2FyZERpcmVjdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQ29weUNsaXBib2FyZEN0cmwgYXMgY29weUNsaXBib2FyZEN0cmwnLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgY29weVRleHQ6ICdAJyxcbiAgICAgICAgICAgICAgICByZWFkb25seTogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvanMvYmlnY29tbWVyY2UvY29weS1jbGlwYm9hcmQvY29weS1jbGlwYm9hcmQudHBsLmh0bWwnLFxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNvcHktY2xpcGJvYXJkJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jb3B5LWNsaXBib2FyZC5jb25zdGFudCcsXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNvcHktY2xpcGJvYXJkLmNvbnRyb2xsZXInLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jb3B5LWNsaXBib2FyZC5kaXJlY3RpdmUnXG5dKTtcbiIsIi8qKlxuICogQG5hbWUgY3JlZGl0LWNhcmQgZGlyZWN0aXZlXG4gKiBAZGVzY3JpcHRpb24gQ29tcG9uZW50IGNvbnRhaW5pbmcgY2MgbnVtYmVyLCBjdmMsIG5hbWUsIGFuZCBleHBpcnkuIEhhcyBhbiBpc29sYXRlZCBzY29wZSB3aXRoIG5vIGNvbnRyb2xsZXIuXG4gKiBAcmVxdWlyZSBmb3JtXG4gKlxuICogQHBhcmFtIGNjRGF0YSB7b2JqZWN0fSBDb250YWlucyBjY051bWJlciwgY2NUeXBlLCBjY0V4cGlyeSwgYW5kIGNjTmFtZVxuICogQHBhcmFtIGNjQ29uZmlnIHtvYmplY3R9IFRoZSBjb25maWd1cmF0aW9uIG9iamVjdC4gQ3VycmVudGx5IHN1cHBvcnRpbmc6XG4gKiAgLSBjYXJkQ29kZSB7Ym9vbGVhbn0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGN2diBmaWVsZCBzaG91bGQgYmUgc2hvd24uIERlZmF1bHQgdHJ1ZS5cbiAqICAtIGNhcmRDb2RlUmVxdWlyZWQge2Jvb2xlYW59IEluZGljYXRlcyB3aGV0aGVyIHRoZSBjdnYgZmllbGQgaXMgcmVxdWlyZWQuIFRoaXMgb25seSBtYXR0ZXJzIHdoZW4gY2FyZENvZGUgaXMgc2V0IHRvIHRydWUuIERlZmF1bHQgdHJ1ZS5cbiAqICAtIGZ1bGxOYW1lIHtib29sZWFufSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgbmFtZSBmaWVsZCBzaG91bGQgYmUgc2hvd24uIERlZmF1bHQgdHJ1ZS5cbiAqIEBwYXJhbSBlYWdlclR5cGUge2Jvb2xlYW59IElmIHRoaXMgYXR0cmlidXRlIGlzIHNldCB0byBmYWxzZSwgdGhlbiBkaXNhYmxlIGVhZ2VyIHR5cGUgZGV0ZWN0aW9uLiBEZWZhdWx0cyB0cnVlLlxuICovXG5hbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQuZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5pY29uJ1xuXSlcbiAgICAuZGlyZWN0aXZlKCdjcmVkaXRDYXJkJywgZnVuY3Rpb24gY3JlZGl0Q2FyZERpcmVjdGl2ZSgkY29tcGlsZSwgJHBhcnNlLCAkdGVtcGxhdGVDYWNoZSkge1xuICAgICAgICBjb25zdCBjdnZUb29sdGlwVGVtcGxhdGUgPSAkdGVtcGxhdGVDYWNoZS5nZXQoJ3NyYy9qcy9iaWdjb21tZXJjZS9jcmVkaXQtY2FyZC9jcmVkaXQtY2FyZC1jdnYvdG9vbHRpcC50cGwuaHRtbCcpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiBjcmVkaXRDYXJkQ29tcGlsZSh0RWxlbSwgdEF0dHJzKXtcbiAgICAgICAgICAgICAgICBsZXQgaXNFYWdlclR5cGUgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRBdHRycy5lYWdlclR5cGUgJiYgJHBhcnNlKHRBdHRycy5lYWdlclR5cGUpKCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNjTnVtYmVyID0gdEVsZW1bMF0ucXVlcnlTZWxlY3RvcignI2NjTnVtYmVyJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgY2NOdW1iZXIucmVtb3ZlQXR0cmlidXRlKCdjY0VhZ2VyVHlwZScpO1xuICAgICAgICAgICAgICAgICAgICBpc0VhZ2VyVHlwZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBjcmVkaXRDYXJkTGluayhzY29wZSwgZWxlbSwgYXR0ciwgZm9ybUN0cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3Z2VG9vbHRpcEVsZW1lbnQgPSAkY29tcGlsZShjdnZUb29sdGlwVGVtcGxhdGUpKHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcmRDb2RlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FyZENvZGVSZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGxOYW1lOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmdldEN2dlRvb2x0aXBIdG1sID0gZ2V0Q3Z2VG9vbHRpcEh0bWw7XG5cbiAgICAgICAgICAgICAgICAgICAgaW5pdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5mb3JtQ3RybCA9IGZvcm1DdHJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2NDb25maWcgPSBfLmRlZmF1bHRzKHNjb3BlLmNjQ29uZmlnLCBkZWZhdWx0Q29uZmlnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBUaGUgY3JlZGl0IGNhcmQgdHlwZSBpcyBkZWR1Y2VkIGJ5IHRoZSBgY2NOdW1iZXJgIGRpcmVjdGl2ZS4gVGhpcyBpcyBpbiB0dXJuIGV4cG9zZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIGFzIGVpdGhlciBgJGNjRWFnZXJUeXBlYCBvciBgJGNjVHlwZWAgb24gdGhlIGlucHV0IGNvbnRyb2wgZWxlbWVudC4gV2F0Y2ggZm9yIGNoYW5nZXMgYW5kIGJpbmQgdGhlIHR5cGUgdG8gdGhlIGNvcnJlc3BvbmRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIHZhbHVlIG9uIGNjRGF0YS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGdldERldGVjdGVkQ2NUeXBlLCBzZXRDY1R5cGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFJldHVybiB0aGUgaHRtbCBmb3IgdGhlIHRvb2x0aXAuIFVzaW5nIG91dGVySFRNTCB0byBhbHNvIGluY2x1ZGUgdGhlIHJvb3QgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IEh0bWwgc3RyaW5nIGZvciB0aGUgY3Z2IHRvb2x0aXAgdGVtcGxhdGVcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdldEN2dlRvb2x0aXBIdG1sKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN2dlRvb2x0aXBFbGVtZW50WzBdLm91dGVySFRNTDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBHZXQgdGhlIGRldGVjdGVkIGNyZWRpdCBjYXJkIHR5cGUgZXhwb3NlZCBvbiB0aGUgZm9ybSBjb250cm9sIGJ5IHRoZSBjY051bWJlciBjaGlsZCBkaXJlY3RpdmUuXG4gICAgICAgICAgICAgICAgICAgICAqIFRoaXMgdmFsdWUgd2lsbCBiZSBleHBvc2VkIGFzICRjY0VhZ2VyVHlwZSBvciAkY2NUeXBlIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRoaXMgZmVhdHVyZSBpcyBlbmFibGVkLlxuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd8bnVsbH1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdldERldGVjdGVkQ2NUeXBlKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzRWFnZXJUeXBlID8gZm9ybUN0cmwuY2NOdW1iZXIuJGNjRWFnZXJUeXBlIDogZm9ybUN0cmwuY2NOdW1iZXIuJGNjVHlwZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBTZXQgY2NEYXRhLmNjVHlwZVxuICAgICAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ3xudWxsfSB0eXBlIFRoZSBjcmVkaXQgY2FyZCB0eXBlLCBpLmUuICd2aXNhJ1xuICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd8bnVsbH0gdHlwZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gc2V0Q2NUeXBlKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmNjRGF0YS5jY1R5cGUgPSB0eXBlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHlwZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVxdWlyZTogJ15mb3JtJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBjY0RhdGE6ICc9JyxcbiAgICAgICAgICAgICAgICBjY0NvbmZpZzogJz0nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL2JpZ2NvbW1lcmNlL2NyZWRpdC1jYXJkL2NyZWRpdC1jYXJkLnRwbC5odG1sJ1xuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkJywgW1xuICAgICdjcmVkaXQtY2FyZHMnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC5iYy1jdmMnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC5jYy1leHBpcnknLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC5kaXJlY3RpdmUnLFxuICAgICdnZXR0ZXh0Jyxcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLXR5cGVzLmNvbnN0YW50JywgW10pXG4gICAgLmNvbnN0YW50KCdDQ19UWVBFUycsIHtcbiAgICAgICAgJ0FtZXJpY2FuIEV4cHJlc3MnOiAnYW1leCcsXG4gICAgICAgICdEaW5lcnMgQ2x1Yic6ICdkaW5lcnNjbHViJyxcbiAgICAgICAgJ0Rpc2NvdmVyJzogJ2Rpc2NvdmVyJyxcbiAgICAgICAgJ01hc3RlckNhcmQnOiAnbWFzdGVyY2FyZCcsXG4gICAgICAgICdWaXNhJzogJ3Zpc2EnLFxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLXR5cGVzLmNvbnRyb2xsZXInLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLXR5cGVzLmNvbnN0YW50Jyxcbl0pXG4gICAgLmNvbnRyb2xsZXIoJ0NyZWRpdENhcmRUeXBlc0N0cmwnLCBmdW5jdGlvbiBDcmVkaXRDYXJkVHlwZXNDdHJsKCRlbGVtZW50LCBDQ19UWVBFUykge1xuICAgICAgICBjb25zdCBjdHJsID0gdGhpcztcblxuICAgICAgICBjdHJsLmhhc1NlbGVjdGVkVHlwZSA9IGhhc1NlbGVjdGVkVHlwZTtcbiAgICAgICAgY3RybC5pc1NlbGVjdGVkVHlwZSA9IGlzU2VsZWN0ZWRUeXBlO1xuICAgICAgICBjdHJsLm1hcFRvU3ZnID0gbWFwVG9Tdmc7XG5cbiAgICAgICAgaW5pdCgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygnY3JlZGl0Q2FyZFR5cGVzJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2hlY2tzIHdoZXRoZXIgYSB0eXBlIGhhcyBiZWVuIHNlbGVjdGVkIChvciBkZXRlY3RlZCBieSB0aGUgY3JlZGl0LWNhcmQgY29tcG9uZW50KVxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gaGFzU2VsZWN0ZWRUeXBlKCkge1xuICAgICAgICAgICAgcmV0dXJuICFfLmlzRW1wdHkoY3RybC5nZXRTZWxlY3RlZFR5cGUoKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2hlY2tzIGlmIHRoZSBwYXNzZWQgaW4gY2NUeXBlIGlzIHRoZSBzYW1lIGFzIHRoZSBzZWxlY3RlZCBjY1R5cGVcbiAgICAgICAgICogQHBhcmFtIGNjVHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gaXNTZWxlY3RlZFR5cGUoY2NUeXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gY2NUeXBlID09PSBjdHJsLmdldFNlbGVjdGVkVHlwZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1hcCB0aGUgY2NUeXBlIHRvIGEgY29ycmVzcG9uZGluZyBzdmcgbmFtZVxuICAgICAgICAgKiBAcGFyYW0gY2NUeXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG1hcFRvU3ZnKGNjVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIENDX1RZUEVTW2NjVHlwZV07XG4gICAgICAgIH1cbiAgICB9KTtcbiIsIi8qKlxuICogQG5hbWUgY3JlZGl0LWNhcmQtdHlwZXMgZGlyZWN0aXZlXG4gKiBAZGVzY3JpcHRpb24gQ29tcG9uZW50IGRpc3BsYXlpbmcgYW5kIGdyZXlpbmcgb3V0IGNyZWRpdCBjYXJkIHR5cGUgaWNvbnMgYmFzZWQgb24gdGhlIHNlbGVjdGVkIGNyZWRpdCBjYXJkIHR5cGUuXG4gKiBgLmlzLWFjdGl2ZWAgaXMgYWRkZWQgdG8gdGhlIGNvcnJlc3BvbmRpbmcgc2VsZWN0ZWQgY3JlZGl0IGNhcmQgdHlwZS4gYC5ub3QtYWN0aXZlYCBpcyBhZGRlZCBmb3IgdGhlIG90aGVyXG4gKiB0eXBlcy4gSWYgbm8gY3JlZGl0IGNhcmQgdHlwZXMgaGFzIGJlZW4gc2VsZWN0ZWQsIHRoZW4gbmVpdGhlciBgLmlzLWFjdGl2ZWAgYW5kIGAubm90LWFjdGl2ZWAgd2lsbCBiZSBhZGRlZCBhdCBhbGwuXG4gKlxuICogQHBhcmFtIHNlbGVjdGVkVHlwZSB7U3RyaW5nfSBDcmVkaXQgY2FyZCB0eXBlLiBWYWxpZCB0eXBlcyBhcmUgJ1Zpc2EnLCAnTWFzdGVyQ2FyZCcsICdEaW5lcnMgQ2x1YicsICdEaXNjb3ZlcicsIGFuZCAnQW1lcmljYW4gRXhwcmVzcydcbiAqIEBwYXJhbSBzdXBwb3J0ZWRUeXBlcyB7QXJyYXl9IEFycmF5IG9mIGNyZWRpdCBjYXJkIHR5cGVzIHRvIGRpc3BsYXkuIFRoZSBjYXJkIHR5cGVzIHVzZSB0aGUgc2FtZSBzdHJpbmdzOiAnQW1lcmljYW4gRXhwcmVzcycsICdEaXNjb3ZlcicsICdNYXN0ZXJDYXJkJywgJ1Zpc2EnXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC10eXBlcy5kaXJlY3RpdmUnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLXR5cGVzLmNvbnRyb2xsZXInLFxuXSlcbiAgICAuZGlyZWN0aXZlKCdjcmVkaXRDYXJkVHlwZXMnLCBmdW5jdGlvbiBjcmVkaXRDYXJkVHlwZXNEaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0NyZWRpdENhcmRUeXBlc0N0cmwgYXMgY3JlZGl0Q2FyZFR5cGVzQ3RybCcsXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBnZXRTZWxlY3RlZFR5cGU6ICcmc2VsZWN0ZWRUeXBlJyxcbiAgICAgICAgICAgICAgICBnZXRTdXBwb3J0ZWRUeXBlczogJyZzdXBwb3J0ZWRUeXBlcydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9qcy9iaWdjb21tZXJjZS9jcmVkaXQtY2FyZC10eXBlcy9jcmVkaXQtY2FyZC10eXBlcy50cGwuaHRtbCdcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC10eXBlcycsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQtdHlwZXMuY29uc3RhbnQnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5jcmVkaXQtY2FyZC10eXBlcy5jb250cm9sbGVyJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQtdHlwZXMuZGlyZWN0aXZlJyxcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0uZGlyZWN0aXZlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnZm9ybScsIGZ1bmN0aW9uIGZvcm1EaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gZm9ybUxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnZm9ybScpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cignbm92YWxpZGF0ZScsICcnKTtcblxuICAgICAgICAgICAgICAgIC8vIFVzZSBkaXNhYmxlLWF1dG8tZm9jdXM9XCJ0cnVlXCIgdG8gdHVybiBvZmYgYXV0b21hdGljIGVycm9yIGZvY3VzaW5nXG4gICAgICAgICAgICAgICAgaWYgKCFhdHRycy5kaXNhYmxlQXV0b0ZvY3VzKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uIGZvcm1BdXRvRm9jdXNTdWJtaXRIYW5kbGVyKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGludmFsaWRGaWVsZCA9IGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvcignLm5nLWludmFsaWQnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGludmFsaWRGaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmFsaWRGaWVsZC5mb2N1cygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXV0by1zZWxlY3QgZXhpc3RpbmcgdGV4dCBmb3IgZmllbGRzIHRoYXQgc3VwcG9ydCBpdCAodGV4dCwgZW1haWwsIHBhc3N3b3JkLCBldGMuKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbnZhbGlkRmllbGQuc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmFsaWRGaWVsZC5zZWxlY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0tZmllbGQuZGlyZWN0aXZlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnZm9ybUZpZWxkJywgZnVuY3Rpb24gZm9ybUZpZWxkRGlyZWN0aXZlKCRsb2cpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlcXVpcmU6ICdeZm9ybScsXG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgIHNjb3BlOiB0cnVlLFxuICAgICAgICAgICAgbGluazoge1xuICAgICAgICAgICAgICAgIHByZTogZnVuY3Rpb24gZm9ybUZpZWxkTGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSW5oZXJpdGVkIGJ5IHRoZSBmb3JtLWZpZWxkLWVycm9ycyBkaXJlY3RpdmUgdG8gYXZvaWQgcmVkZWNsYXJhdGlvblxuICAgICAgICAgICAgICAgICAgICBzY29wZS5wcm9wZXJ0eSA9IGF0dHJzLnByb3BlcnR5O1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBwb3N0OiBmdW5jdGlvbiBmb3JtRmllbGRMaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycywgZm9ybUN0cmwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTG9jYXRlcyBhbmQgd2F0Y2hlcyB0aGUgbWF0Y2hpbmcgaW5wdXQvc2VsZWN0L2V0YyAoYmFzZWQgb24gaXRzIG5hbWUgYXR0cmlidXRlKSBpbiB0aGUgcGFyZW50IGZvcm1cbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gYXR0cnMucHJvcGVydHk7XG5cbiAgICAgICAgICAgICAgICAgICAgaW5pdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdmb3JtLWZpZWxkJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIGEgcHJvcGVydHkgd2Fzbid0IHByb3ZpZGVkLCB3ZSBjYW4ndCBkbyBtdWNoIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgaW50ZXJmYWNlIGlmIHRoZSBmb3JtIGlzIHN1Ym1pdHRlZCBvciB0aGUgcHJvcGVydHkncyB2YWxpZGl0eSBzdGF0ZSBjaGFuZ2VzXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goaXNTdWJtaXR0ZWQsIGNoZWNrVmFsaWRpdHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGlzSW52YWxpZCwgY2hlY2tWYWxpZGl0eSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBjaGVja1ZhbGlkaXR5KCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgYSBwcm9wZXJ0eSB3YXMgcHJvdmlkZWQsIGJ1dCBubyBuZy1tb2RlbCB3YXMgZGVmaW5lZCBmb3IgdGhlIGZpZWxkLCB2YWxpZGF0aW9uIHdvbid0IHdvcmtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaGFzTW9kZWwoKSAmJiBpc1N1Ym1pdHRlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRsb2cuaW5mbygnRm9ybSBmaWVsZHMgY29udGFpbmluZyBpbnB1dHMgd2l0aG91dCBhbiBuZy1tb2RlbCBwcm9wZXJ0eSB3aWxsIG5vdCBiZSB2YWxpZGF0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gT25seSBzaG93IGFuIGVycm9yIGlmIHRoZSB1c2VyIGhhcyBhbHJlYWR5IGF0dGVtcHRlZCB0byBzdWJtaXQgdGhlIGZvcm1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudG9nZ2xlQ2xhc3MoJ2Zvcm0tZmllbGQtLWVycm9yJywgaXNTdWJtaXR0ZWQoKSAmJiBpc0ludmFsaWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBoYXNNb2RlbCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAhIWZvcm1DdHJsW3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGlzU3VibWl0dGVkKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1DdHJsLiRzdWJtaXR0ZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBpc0ludmFsaWQoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWhhc01vZGVsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmb3JtQ3RybFtwcm9wZXJ0eV0uJGludmFsaWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1maWVsZCcsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1maWVsZC5kaXJlY3RpdmUnLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWZpZWxkLWVycm9yJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1maWVsZC1lcnJvcnMnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWZpZWxkLWVycm9yLmRpcmVjdGl2ZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ2Zvcm1GaWVsZEVycm9yJywgZnVuY3Rpb24gZm9ybUZpZWxkRXJyb3JEaXJlY3RpdmUoJGNvbXBpbGUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHByaW9yaXR5OiAxMCxcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL2JpZ2NvbW1lcmNlL2Zvcm0tZmllbGQtZXJyb3IvZm9ybS1maWVsZC1lcnJvci50cGwuaHRtbCcsXG4gICAgICAgICAgICB0ZXJtaW5hbDogdHJ1ZSxcbiAgICAgICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbiBmb3JtRmllbGRFcnJvckNvbXBpbGUodEVsZW1lbnQsIHRBdHRycykge1xuICAgICAgICAgICAgICAgIC8vIFRoZSB0cmFuc2xhdGUgcHJvcGVydHkgd2lwZXMgb3V0IG91ciBuZy1tZXNzYWdlIGxvZ2ljIGluIHRoZSBwb3N0IGxpbmsgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAvLyBUaGUgcHJpb3JpdHkgYW5kIHRlcm1pbmFsIHByb3BlcnRpZXMgYWJvdmUgZW5zdXJlIHRoaXMgY2hlY2sgb2NjdXJzXG4gICAgICAgICAgICAgICAgaWYgKHRFbGVtZW50LmF0dHIoJ3RyYW5zbGF0ZScpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgJ1RoZSB0cmFuc2xhdGUgYXR0cmlidXRlIGNhbm5vdCBiZSB1c2VkIHdpdGggdGhlIGZvcm0tZmllbGQtZXJyb3IgZGlyZWN0aXZlLiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdVc2UgdGhlIHRyYW5zbGF0ZSBmaWx0ZXIgaW5zdGVhZCAoZXhhbXBsZToge3sgXCJteSBlcnJvciBtZXNzYWdlXCIgfCB0cmFuc2xhdGUgfX0pLiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdWYWxpZGF0b3I6ICcgKyB0QXR0cnMudmFsaWRhdGVcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBwb3N0OiBmdW5jdGlvbiBmb3JtRmllbGRFcnJvclBvc3RMaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcnMsIHRyYW5zY2x1ZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnByb3BlcnR5ID0gc2NvcGUucHJvcGVydHkgfHwgYXR0cnMucHJvcGVydHk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zY2x1ZGUoZnVuY3Rpb24gZm9ybUZpZWxkRXJyb3JUcmFuc2NsdWRlKGVycm9yQ2xvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWxFbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KCc8bGFiZWw+Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBuZ01lc3NhZ2UgZG9lc24ndCBwbGF5IHdlbGwgd2l0aCBkeW5hbWljIG1lc3NhZ2UgaW5zZXJ0aW9uLCB0cmFuc2xhdGlvbiwgb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtZXNzYWdlIGV4cHJlc3Npb25zLCBzbyB3ZSBidWlsZCBpdHMgZWxlbWVudCB1cCBoZXJlIGFuZCBpbmplY3QgaXQgaW50byB0aGUgRE9NXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxFbGVtZW50LmF0dHIoJ2ZvcicsIHNjb3BlLnByb3BlcnR5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbEVsZW1lbnQuYXR0cignbmctbWVzc2FnZScsIGF0dHJzLnZhbGlkYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbEVsZW1lbnQuYXR0cigncm9sZScsICdhbGVydCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsRWxlbWVudC5hZGRDbGFzcygnZm9ybS1pbmxpbmVNZXNzYWdlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgZXJyb3Igc3BhbiBzaG91bGQgYWxyZWFkeSBoYXZlIGEgdHJhbnNsYXRpb24gd2F0Y2hlciBvbiBpdCBieSBub3csIHVzaW5nIGEgZmlsdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxFbGVtZW50LmFwcGVuZChlcnJvckNsb25lKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kKGxhYmVsRWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY29tcGlsZShlbGVtZW50KShzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1maWVsZC1lcnJvcicsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuZm9ybS1maWVsZC1lcnJvci5kaXJlY3RpdmUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWZpZWxkLWVycm9ycy5kaXJlY3RpdmUnLCBbXSlcbiAgICAuZGlyZWN0aXZlKCdmb3JtRmllbGRFcnJvcnMnLCBmdW5jdGlvbiBmb3JtRmllbGRFcnJvcnNEaXJlY3RpdmUoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgcmVxdWlyZTogJ15mb3JtJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvanMvYmlnY29tbWVyY2UvZm9ybS1maWVsZC1lcnJvcnMvZm9ybS1maWVsZC1lcnJvcnMudHBsLmh0bWwnLFxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgICAgIGxpbms6IHtcbiAgICAgICAgICAgICAgICAvLyBQcmUtbGluayBpcyByZXF1aXJlZCwgYXMgd2UgaGF2ZSB0byBpbmplY3Qgb3VyIHNjb3BlIHByb3BlcnRpZXMgYmVmb3JlIHRoZSBjaGlsZFxuICAgICAgICAgICAgICAgIC8vIGZvcm0tZmllbGQtZXJyb3IgZGlyZWN0aXZlIChhbmQgaXRzIGludGVybmFsIG5nLW1lc3NhZ2UgZGlyZWN0aXZlJ3MpIHBvc3QtbGluayBmdW5jdGlvbnNcbiAgICAgICAgICAgICAgICBwcmU6IGZ1bmN0aW9uIGZvcm1GaWVsZEVycm9yc1ByZUxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBmb3JtQ3RybCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBQcm9wZXJ0eSBuYW1lIGNhbiBiZSBpbmhlcml0ZWQgZnJvbSBwYXJlbnQgc2NvcGUsIHN1Y2ggYXMgZnJvbSB0aGUgZm9ybS1maWVsZCBkaXJlY3RpdmVcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gc2NvcGUucHJvcGVydHkgfHwgYXR0cnMucHJvcGVydHksXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eUZpZWxkID0gZm9ybUN0cmxbcHJvcGVydHldO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEluaGVyaXRlZCBieSBmb3JtLWZpZWxkLWVycm9yIGRpcmVjdGl2ZS4gTGl2ZXMgZGlyZWN0bHkgb24gc2NvcGUgYmVjYXVzZSB0aGUgcmVxdWlyZVxuICAgICAgICAgICAgICAgICAgICAvLyBwcm9wZXJ0eSBkb2VzIG5vdCB3b3JrIHdlbGwgd2l0aCBkaXJlY3RpdmUgY29udHJvbGxlciBpbnN0YW5jZXNcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuZm9ybUN0cmwgPSBmb3JtQ3RybDtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvcGVydHkgPSBwcm9wZXJ0eTtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUucHJvcGVydHlGaWVsZCA9IHByb3BlcnR5RmllbGQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0tZmllbGQtZXJyb3JzJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWZpZWxkLWVycm9ycy5kaXJlY3RpdmUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWlucHV0LWNvbG9yLmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdGb3JtSW5wdXRDb2xvckN0cmwnLCBmdW5jdGlvbigkZWxlbWVudCwgJHJvb3RTY29wZSwgJHNjb3BlKSB7XG4gICAgICAgIGNvbnN0IGN0cmwgPSB0aGlzO1xuICAgICAgICBjb25zdCBoZXhDb2xvclJlZ2V4ID0gL14jKChbMC05YS1mQS1GXXsyfSl7M318KFswLTlhLWZBLUZdKXszfSkkLztcblxuICAgICAgICBsZXQgaXNWaXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgY3RybC5ibHVyRXZlbnRIYW5kbGVyID0gYmx1ckV2ZW50SGFuZGxlcjtcbiAgICAgICAgY3RybC5mb2N1c0V2ZW50SGFuZGxlciA9IGZvY3VzRXZlbnRIYW5kbGVyO1xuICAgICAgICBjdHJsLmhpZGVQaWNrZXIgPSBoaWRlUGlja2VyO1xuICAgICAgICBjdHJsLmlzUGlja2VyVmlzaWJsZSA9IGlzUGlja2VyVmlzaWJsZTtcbiAgICAgICAgY3RybC5vbkNoYW5nZSA9IG9uQ2hhbmdlO1xuICAgICAgICBjdHJsLnNldE1vZGVsQ3RybCA9IHNldE1vZGVsQ3RybDtcbiAgICAgICAgY3RybC5zaG93UGlja2VyID0gc2hvd1BpY2tlcjtcbiAgICAgICAgY3RybC51bmlxdWVJZCA9IGdldFVuaXF1ZUlEKCdmb3JtSW5wdXRDb2xvci0nKTtcblxuICAgICAgICAkc2NvcGUuJG9uKCdiY0NvbG9yUGlja2VyT3BlbmVkJywgKGV2ZW50LCB0cmlnZ2VyaW5nRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKCRlbGVtZW50ID09PSB0cmlnZ2VyaW5nRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3RybC5oaWRlUGlja2VyKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIGJsdXJFdmVudEhhbmRsZXIoJGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoJGVsZW1lbnRbMF0uY29udGFpbnMoJGV2ZW50LnJlbGF0ZWRUYXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdHJsLmhpZGVQaWNrZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZvY3VzRXZlbnRIYW5kbGVyKCRldmVudCkge1xuICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjdHJsLnNob3dQaWNrZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFVuaXF1ZUlEKGlkUHJlZml4KSB7XG4gICAgICAgICAgICByZXR1cm4gXy51bmlxdWVJZChpZFByZWZpeCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoaWRlUGlja2VyKCkge1xuICAgICAgICAgICAgaWYgKGN0cmwuaXNQaWNrZXJWaXNpYmxlKCkpIHtcbiAgICAgICAgICAgICAgICBjdHJsLmlzUGlja2VyVmlzaWJsZShmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc1BpY2tlclZpc2libGUoaXNWaXNpYmxlVG9TZXQpIHtcbiAgICAgICAgICAgIGlmIChpc1Zpc2libGVUb1NldCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaXNWaXNpYmxlID0gaXNWaXNpYmxlVG9TZXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBpc1Zpc2libGU7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBvbkNoYW5nZSgpIHtcbiAgICAgICAgICAgIGlmIChoZXhDb2xvclJlZ2V4LnRlc3QoY3RybC5jb2xvcikpIHtcbiAgICAgICAgICAgICAgICBjdHJsLmxhc3RWYWxpZENvbG9yID0gY3RybC5jb2xvcjtcbiAgICAgICAgICAgICAgICBjdHJsLm5nTW9kZWxDdHJsLiRzZXRWaWV3VmFsdWUoY3RybC5jb2xvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgICAgICBjdHJsLmNvbG9yID0gY3RybC5uZ01vZGVsQ3RybC4kdmlld1ZhbHVlO1xuICAgICAgICAgICAgY3RybC5sYXN0VmFsaWRDb2xvciA9IGN0cmwuY29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRNb2RlbEN0cmwobmdNb2RlbEN0cmwpIHtcbiAgICAgICAgICAgIGN0cmwubmdNb2RlbEN0cmwgPSBuZ01vZGVsQ3RybDtcbiAgICAgICAgICAgIGN0cmwubmdNb2RlbEN0cmwuJHJlbmRlciA9IHJlbmRlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNob3dQaWNrZXIoKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2JjQ29sb3JQaWNrZXJPcGVuZWQnLCAkZWxlbWVudCk7XG4gICAgICAgICAgICBjdHJsLmlzUGlja2VyVmlzaWJsZSh0cnVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0taW5wdXQtY29sb3IuZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5mb3JtLWlucHV0LWNvbG9yLmNvbnRyb2xsZXInLFxuXSlcblxuICAgIC5kaXJlY3RpdmUoJ2Zvcm1JbnB1dENvbG9yJywgZnVuY3Rpb24gZm9ybUlucHV0Q29sb3JEaXJlY3RpdmUoJGRvY3VtZW50KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0Zvcm1JbnB1dENvbG9yQ3RybCcsXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdmb3JtSW5wdXRDb2xvckN0cmwnLFxuICAgICAgICAgICAgcmVxdWlyZTogWydmb3JtSW5wdXRDb2xvcicsICdebmdNb2RlbCddLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgbGFiZWxUZXh0OiAnPScsXG4gICAgICAgICAgICAgICAgcGFsZXR0ZTogJz0nLFxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyVGV4dDogJz0nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL2JpZ2NvbW1lcmNlL2Zvcm0taW5wdXQtY29sb3IvZm9ybS1pbnB1dC1jb2xvci50cGwuaHRtbCcsXG5cbiAgICAgICAgICAgIGNvbXBpbGU6IGZ1bmN0aW9uIGZvcm1JbnB1dENvbG9yRGlyZWN0aXZlQ29tcGlsZSh0RWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRFbGVtZW50LmFkZENsYXNzKCdmb3JtLWlucHV0Q29sb3InKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBmb3JtSW5wdXRDb2xvckRpcmVjdGl2ZUxpbmsoJHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3RybCA9IGN0cmxzWzBdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZ01vZGVsQ3RybCA9IGN0cmxzWzFdO1xuXG4gICAgICAgICAgICAgICAgICAgIGN0cmwuc2V0TW9kZWxDdHJsKG5nTW9kZWxDdHJsKTtcblxuICAgICAgICAgICAgICAgICAgICAkZG9jdW1lbnQub24oJ2tleWRvd24nLCBrZXlkb3duRXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICAgICAgJGRvY3VtZW50Lm9uKCdtb3VzZWRvd24nLCBtb3VzZURvd25FdmVudEhhbmRsZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kb24oJyRkZXN0cm95JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGRvY3VtZW50Lm9mZignbW91c2Vkb3duJywgbW91c2VEb3duRXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRkb2N1bWVudC5vZmYoJ2tleWRvd24nLCBrZXlkb3duRXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24ga2V5ZG93bkV2ZW50SGFuZGxlciAoJGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJGV2ZW50LndoaWNoID09PSAyNykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS4kYXBwbHkoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHJsLmhpZGVQaWNrZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIG1vdXNlRG93bkV2ZW50SGFuZGxlcigkZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50WzBdLmNvbnRhaW5zKCRldmVudC50YXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3RybC5oaWRlUGlja2VyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0taW5wdXQtY29sb3InLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmZvcm0taW5wdXQtY29sb3IuZGlyZWN0aXZlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuaHRtbDVNb2RlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5odG1sNU1vZGUuc2VydmljZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmh0bWw1TW9kZS5zZXJ2aWNlJywgW10pXG4gICAgLnByb3ZpZGVyKCdodG1sNU1vZGUnLCBmdW5jdGlvbiBodG1sNU1vZGVQcm92aWRlcigkbG9jYXRpb25Qcm92aWRlcikge1xuICAgICAgICB0aGlzLiRnZXQgPSBmdW5jdGlvbiBodG1sNU1vZGVTZXJ2aWNlKCkge1xuICAgICAgICAgICAgcmV0dXJuICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSgpO1xuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmljb24uY29udHJvbGxlcicsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuaHRtbDVNb2RlJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuaWNvbi5zdmdSb290UGF0aCdcbl0pXG4gICAgLmNvbnRyb2xsZXIoJ0ljb25DdHJsJywgZnVuY3Rpb24gaWNvbkRpcmVjdGl2ZUNvbnRyb2xsZXIoJGh0dHAsICRsb2NhdGlvbiwgJHRlbXBsYXRlQ2FjaGUsIGh0bWw1TW9kZSwgc3ZnUm9vdFBhdGgpIHtcbiAgICAgICAgY29uc3QgYWJzVXJsID0gJGxvY2F0aW9uLmFic1VybCgpO1xuICAgICAgICBjb25zdCBjdHJsID0gdGhpcztcblxuICAgICAgICBjdHJsLmNoYW5nZVVybHNUb0Fic29sdXRlID0gY2hhbmdlVXJsc1RvQWJzb2x1dGU7XG4gICAgICAgIGN0cmwuY2hhbmdlWGxpbmtzVG9BYnNvbHV0ZSA9IGNoYW5nZVhsaW5rc1RvQWJzb2x1dGU7XG4gICAgICAgIGN0cmwudXBkYXRlR2x5cGggPSB1cGRhdGVHbHlwaDtcblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVHbHlwaChnbHlwaCkge1xuICAgICAgICAgICAgY29uc3QgZnVsbFN2Z1BhdGggPSBzdmdSb290UGF0aCArIGdseXBoICsgJy5zdmcnO1xuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGZ1bGxTdmdQYXRoLCB7IGNhY2hlOiAkdGVtcGxhdGVDYWNoZSB9KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIGljb25EaXJlY3RpdmVIdHRwU3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc3RyaW5naWZpZWRFbGVtZW50ID0gcmVzcG9uc2UuZGF0YTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaHRtbDVNb2RlLmVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZ2lmaWVkRWxlbWVudCA9IGNoYW5nZVVybHNUb0Fic29sdXRlKHN0cmluZ2lmaWVkRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmdpZmllZEVsZW1lbnQgPSBjaGFuZ2VYbGlua3NUb0Fic29sdXRlKHN0cmluZ2lmaWVkRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyaW5naWZpZWRFbGVtZW50O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2hhbmdlVXJsc1RvQWJzb2x1dGUoc3RyaW5naWZpZWRFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyaW5naWZpZWRFbGVtZW50LnJlcGxhY2UoL3VybFxcKChbJ1wiXT8pIy9naSwgJ3VybCgkMScgKyBhYnNVcmwgKyAnIycpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2hhbmdlWGxpbmtzVG9BYnNvbHV0ZShzdHJpbmdpZmllZEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmdpZmllZEVsZW1lbnQucmVwbGFjZSgveGxpbms6aHJlZj0oWydcIl0/KSMvZ2ksICd4bGluazpocmVmPSQxJyArIGFic1VybCArICcjJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiIsIi8qKlxuICogQGRlc2NyaXB0aW9uIEljb24gZGlyZWN0aXZlIHVzZWQgdG8gbG9hZCBhbiBpbmxpbmUgc3ZnIGljb24sIHNpbWxpYXIgdG8gaWNvblxuICogICAgICAgICAgICAgIGZvbnQgbWV0aG9kcyBvZiBwYXN0IDxpIGNsYXNzPVwiaWNvbi1mb28tYmFyXCI+PC9pPlxuICogQGV4YW1wbGVcbiAqIDxpY29uIGdseXBoPVwiaWMtYWRkLWNpcmNsZVwiPjwvaWNvbj5cbiAqL1xuYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmljb24uZGlyZWN0aXZlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5pY29uLmNvbnRyb2xsZXInXG5dKVxuICAgIC5kaXJlY3RpdmUoJ2ljb24nLCBmdW5jdGlvbiBpY29uRGlyZWN0aXZlKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdJY29uQ3RybCBhcyBpY29uQ3RybCcsXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICBnbHlwaDogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gaWNvbkRpcmVjdGl2ZUNvbXBpbGUodEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0RWxlbWVudC5hZGRDbGFzcygnaWNvbicpO1xuICAgICAgICAgICAgICAgIHRFbGVtZW50LmF0dHIoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gaWNvbkRpcmVjdGl2ZUxpbmsoJHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybCkge1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdpY29uQ3RybC5nbHlwaCcsIGZ1bmN0aW9uIGljb25EaXJlY3RpdmVMaW5rV2F0Y2gobmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0cmwudXBkYXRlR2x5cGgobmV3VmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gaWNvblVwZGF0ZUdseXBoVGhlbihzdmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5odG1sKHN2Zyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuaWNvbicsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuaWNvbi5kaXJlY3RpdmUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5pY29uLnN2Z1Jvb3RQYXRoJywgW10pXG4gICAgLnByb3ZpZGVyKCdzdmdSb290UGF0aCcsIGZ1bmN0aW9uIHN2Z1Jvb3RQYXRoUHJvdmlkZXJDb25maWcoKSB7XG4gICAgICAgIHRoaXMuc2V0Um9vdFBhdGggPSBzZXRSb290UGF0aDtcbiAgICAgICAgdGhpcy4kZ2V0ID0gZnVuY3Rpb24gc3ZnUm9vdFBhdGhQcm92aWRlckdldCgkbG9nKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdmdSb290UGF0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgJGxvZy5lcnJvcignTm8gc3ZnUm9vdFBhdGggcHJvdmlkZWQuIFBsZWFzZSBjb25maWd1cmUgdGhpcyB1c2luZyB0aGUgc3ZnUm9vdFBhdGhQcm92aWRlcicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdmdSb290UGF0aDtcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBzZXRSb290UGF0aChuZXdSb290UGF0aCkge1xuICAgICAgICAgICAgdGhpcy5zdmdSb290UGF0aCA9IG5ld1Jvb3RQYXRoO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIubG9hZGluZy1ub3RpZmljYXRpb24uZGlyZWN0aXZlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnbG9hZGluZ05vdGlmaWNhdGlvbicsIGZ1bmN0aW9uIGxvYWRpbmdOb3RpZmljYXRpb25EaXJlY3RpdmUoJHJvb3RTY29wZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2pzL2JpZ2NvbW1lcmNlL2xvYWRpbmctbm90aWZpY2F0aW9uL2xvYWRpbmctbm90aWZpY2F0aW9uLnRwbC5odG1sJyxcblxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignYWpheFJlcXVlc3RSdW5uaW5nJywgZnVuY3Rpb24oZXZlbnQsIHZhbCkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5yZXF1ZXN0SW5Qcm9ncmVzcyA9IHZhbDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5sb2FkaW5nLW5vdGlmaWNhdGlvbicsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIubG9hZGluZy1ub3RpZmljYXRpb24uZGlyZWN0aXZlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIubG9hZGluZy1vdmVybGF5LmNvbnRyb2xsZXInLCBbXSlcbiAgICAuY29udHJvbGxlcignTG9hZGluZ092ZXJsYXlDdHJsJywgZnVuY3Rpb24gTG9hZGluZ092ZXJsYXlDdHJsKCRyb290U2NvcGUsICR0aW1lb3V0KSB7XG4gICAgICAgIHZhciBjdHJsID0gdGhpcyxcbiAgICAgICAgICAgIGRlZmF1bHREZWJvdW5jZSA9IDEwMCxcbiAgICAgICAgICAgIHRpbWVvdXQ7XG5cbiAgICAgICAgaWYgKGN0cmwuZGVib3VuY2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY3RybC5kZWJvdW5jZSA9IGRlZmF1bHREZWJvdW5jZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjdHJsLnVzZVVpUm91dGVyKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBzdGFydExvYWRpbmcpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBzdG9wTG9hZGluZyk7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlRXJyb3InLCBzdG9wTG9hZGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzdGFydExvYWRpbmcoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aW1lb3V0ID0gJHRpbWVvdXQoZnVuY3Rpb24gc3RhcnRMb2FkaW5nVGltZXIoKSB7XG4gICAgICAgICAgICAgICAgY3RybC5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIH0sIGN0cmwuZGVib3VuY2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc3RvcExvYWRpbmcoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkdGltZW91dC5jYW5jZWwodGltZW91dCk7XG4gICAgICAgICAgICBjdHJsLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmxvYWRpbmctb3ZlcmxheS5kaXJlY3RpdmUnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLmxvYWRpbmctb3ZlcmxheS5jb250cm9sbGVyJ1xuXSlcbiAgICAuZGlyZWN0aXZlKCdsb2FkaW5nT3ZlcmxheScsIGZ1bmN0aW9uIGxvYWRpbmdPdmVybGF5KCRjb21waWxlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvYWRpbmdPdmVybGF5Q3RybCBhcyBsb2FkaW5nT3ZlcmxheUN0cmwnLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgZGVib3VuY2U6ICc9PycsXG4gICAgICAgICAgICAgICAgbG9hZGluZzogJz0/bG9hZGluZ092ZXJsYXknLFxuICAgICAgICAgICAgICAgIHVzZVVpUm91dGVyOiAnPT8nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gbG9hZGluZ092ZXJsYXlDb21waWxlKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdsb2FkaW5nT3ZlcmxheS1jb250YWluZXInKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBsb2FkaW5nT3ZlcmxheUxpbmsoc2NvcGUsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3ZlcmxheSA9ICRjb21waWxlKCc8ZGl2IGNsYXNzPVwibG9hZGluZ092ZXJsYXlcIiBuZy1pZj1cImxvYWRpbmdPdmVybGF5Q3RybC5sb2FkaW5nXCI+PC9kaXY+Jykoc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFwcGVuZChvdmVybGF5KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmxvYWRpbmctb3ZlcmxheScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIubG9hZGluZy1vdmVybGF5LmRpcmVjdGl2ZSdcbl0pO1xuIiwiLypcbiAqIE92ZXJyaWRlIGFuZ3VsYXIgZm91bmRhdGlvbidzICRtb2RhbFN0YWNrIHNlcnZpY2UgdG8gcmVtb3ZlIHRoZSBgdG9wYCBjc3MgcHJvcGVydHkuXG4gKiBjYW5ub3QgdXNlIGEgZGVjb3JhdG9yIGJlY2F1c2UgdGhlIGBvcGVuYCByZWxpZXMgb24gY2xvc3VyZXMgYW5kIGRvZXMgbm90IHJldHVybiB0aGUgY29tcGlsZWQgZWxlbWVudC5cbiAqIENoYW5nZXMgYXJlIGJldHdlZW4gYC8vIENoYW5nZXNgIGNvbW1lbnRzXG4qL1xuYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLW1vZGFsLm1vZGFsU3RhY2suc2VydmljZScsIFtcblxuXSlcbiAgLmZhY3RvcnkoJyRtb2RhbFN0YWNrJywgWyckd2luZG93JywgJyR0cmFuc2l0aW9uJywgJyR0aW1lb3V0JywgJyRkb2N1bWVudCcsICckY29tcGlsZScsICckcm9vdFNjb3BlJywgJyQkc3RhY2tlZE1hcCcsXG4gICAgZnVuY3Rpb24gKCR3aW5kb3csICR0cmFuc2l0aW9uLCAkdGltZW91dCwgJGRvY3VtZW50LCAkY29tcGlsZSwgJHJvb3RTY29wZSwgJCRzdGFja2VkTWFwKSB7XG4gICAgICAvLyBDaGFuZ2VzOiBjaGFuZ2UgZnJvbSBgbW9kYWwtb3BlbmAgdG8gYGhhcy1hY3RpdmVNb2RhbGBcbiAgICAgIHZhciBPUEVORURfTU9EQUxfQ0xBU1MgPSAnaGFzLWFjdGl2ZU1vZGFsJztcbiAgICAgIC8vIENoYW5nZXNcblxuICAgICAgdmFyIGJhY2tkcm9wRG9tRWwsIGJhY2tkcm9wU2NvcGU7XG4gICAgICB2YXIgb3BlbmVkV2luZG93cyA9ICQkc3RhY2tlZE1hcC5jcmVhdGVOZXcoKTtcbiAgICAgIHZhciAkbW9kYWxTdGFjayA9IHt9O1xuXG4gICAgICBmdW5jdGlvbiBiYWNrZHJvcEluZGV4KCkge1xuICAgICAgICB2YXIgdG9wQmFja2Ryb3BJbmRleCA9IC0xO1xuICAgICAgICB2YXIgb3BlbmVkID0gb3BlbmVkV2luZG93cy5rZXlzKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3BlbmVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKG9wZW5lZFdpbmRvd3MuZ2V0KG9wZW5lZFtpXSkudmFsdWUuYmFja2Ryb3ApIHtcbiAgICAgICAgICAgIHRvcEJhY2tkcm9wSW5kZXggPSBpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdG9wQmFja2Ryb3BJbmRleDtcbiAgICAgIH1cblxuICAgICAgJHJvb3RTY29wZS4kd2F0Y2goYmFja2Ryb3BJbmRleCwgZnVuY3Rpb24obmV3QmFja2Ryb3BJbmRleCl7XG4gICAgICAgIGlmIChiYWNrZHJvcFNjb3BlKSB7XG4gICAgICAgICAgYmFja2Ryb3BTY29wZS5pbmRleCA9IG5ld0JhY2tkcm9wSW5kZXg7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBmdW5jdGlvbiByZW1vdmVNb2RhbFdpbmRvdyhtb2RhbEluc3RhbmNlKSB7XG4gICAgICAgIHZhciBib2R5ID0gJGRvY3VtZW50LmZpbmQoJ2JvZHknKS5lcSgwKTtcbiAgICAgICAgdmFyIG1vZGFsV2luZG93ID0gb3BlbmVkV2luZG93cy5nZXQobW9kYWxJbnN0YW5jZSkudmFsdWU7XG5cbiAgICAgICAgLy9jbGVhbiB1cCB0aGUgc3RhY2tcbiAgICAgICAgb3BlbmVkV2luZG93cy5yZW1vdmUobW9kYWxJbnN0YW5jZSk7XG5cbiAgICAgICAgLy9yZW1vdmUgd2luZG93IERPTSBlbGVtZW50XG4gICAgICAgIHJlbW92ZUFmdGVyQW5pbWF0ZShtb2RhbFdpbmRvdy5tb2RhbERvbUVsLCBtb2RhbFdpbmRvdy5tb2RhbFNjb3BlLCAzMDAsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIG1vZGFsV2luZG93Lm1vZGFsU2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgICAgICBib2R5LnRvZ2dsZUNsYXNzKE9QRU5FRF9NT0RBTF9DTEFTUywgb3BlbmVkV2luZG93cy5sZW5ndGgoKSA+IDApO1xuICAgICAgICAgIGNoZWNrUmVtb3ZlQmFja2Ryb3AoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGNoZWNrUmVtb3ZlQmFja2Ryb3AoKSB7XG4gICAgICAgIC8vcmVtb3ZlIGJhY2tkcm9wIGlmIG5vIGxvbmdlciBuZWVkZWRcbiAgICAgICAgaWYgKGJhY2tkcm9wRG9tRWwgJiYgYmFja2Ryb3BJbmRleCgpID09IC0xKSB7XG4gICAgICAgICAgdmFyIGJhY2tkcm9wU2NvcGVSZWYgPSBiYWNrZHJvcFNjb3BlO1xuICAgICAgICAgIHJlbW92ZUFmdGVyQW5pbWF0ZShiYWNrZHJvcERvbUVsLCBiYWNrZHJvcFNjb3BlLCAxNTAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGJhY2tkcm9wU2NvcGVSZWYuJGRlc3Ryb3koKTtcbiAgICAgICAgICAgIGJhY2tkcm9wU2NvcGVSZWYgPSBudWxsO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGJhY2tkcm9wRG9tRWwgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgYmFja2Ryb3BTY29wZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiByZW1vdmVBZnRlckFuaW1hdGUoZG9tRWwsIHNjb3BlLCBlbXVsYXRlVGltZSwgZG9uZSkge1xuICAgICAgICAvLyBDbG9zaW5nIGFuaW1hdGlvblxuICAgICAgICBzY29wZS5hbmltYXRlID0gZmFsc2U7XG5cbiAgICAgICAgdmFyIHRyYW5zaXRpb25FbmRFdmVudE5hbWUgPSAkdHJhbnNpdGlvbi50cmFuc2l0aW9uRW5kRXZlbnROYW1lO1xuICAgICAgICBpZiAodHJhbnNpdGlvbkVuZEV2ZW50TmFtZSkge1xuICAgICAgICAgIC8vIHRyYW5zaXRpb24gb3V0XG4gICAgICAgICAgdmFyIHRpbWVvdXQgPSAkdGltZW91dChhZnRlckFuaW1hdGluZywgZW11bGF0ZVRpbWUpO1xuXG4gICAgICAgICAgZG9tRWwuYmluZCh0cmFuc2l0aW9uRW5kRXZlbnROYW1lLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkdGltZW91dC5jYW5jZWwodGltZW91dCk7XG4gICAgICAgICAgICBhZnRlckFuaW1hdGluZygpO1xuICAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRW5zdXJlIHRoaXMgY2FsbCBpcyBhc3luY1xuICAgICAgICAgICR0aW1lb3V0KGFmdGVyQW5pbWF0aW5nLCAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFmdGVyQW5pbWF0aW5nKCkge1xuICAgICAgICAgIGlmIChhZnRlckFuaW1hdGluZy5kb25lKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGFmdGVyQW5pbWF0aW5nLmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgZG9tRWwucmVtb3ZlKCk7XG4gICAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgJGRvY3VtZW50LmJpbmQoJ2tleWRvd24nLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIHZhciBtb2RhbDtcblxuICAgICAgICBpZiAoZXZ0LndoaWNoID09PSAyNykge1xuICAgICAgICAgIG1vZGFsID0gb3BlbmVkV2luZG93cy50b3AoKTtcbiAgICAgICAgICBpZiAobW9kYWwgJiYgbW9kYWwudmFsdWUua2V5Ym9hcmQpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgJG1vZGFsU3RhY2suZGlzbWlzcyhtb2RhbC5rZXkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgJG1vZGFsU3RhY2sub3BlbiA9IGZ1bmN0aW9uIChtb2RhbEluc3RhbmNlLCBtb2RhbCkge1xuXG4gICAgICAgIG9wZW5lZFdpbmRvd3MuYWRkKG1vZGFsSW5zdGFuY2UsIHtcbiAgICAgICAgICBkZWZlcnJlZDogbW9kYWwuZGVmZXJyZWQsXG4gICAgICAgICAgbW9kYWxTY29wZTogbW9kYWwuc2NvcGUsXG4gICAgICAgICAgYmFja2Ryb3A6IG1vZGFsLmJhY2tkcm9wLFxuICAgICAgICAgIGtleWJvYXJkOiBtb2RhbC5rZXlib2FyZFxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYm9keSA9ICRkb2N1bWVudC5maW5kKCdib2R5JykuZXEoMCksXG4gICAgICAgICAgICBjdXJyQmFja2Ryb3BJbmRleCA9IGJhY2tkcm9wSW5kZXgoKTtcblxuICAgICAgICBpZiAoY3VyckJhY2tkcm9wSW5kZXggPj0gMCAmJiAhYmFja2Ryb3BEb21FbCkge1xuICAgICAgICAgIGJhY2tkcm9wU2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcodHJ1ZSk7XG4gICAgICAgICAgYmFja2Ryb3BTY29wZS5pbmRleCA9IGN1cnJCYWNrZHJvcEluZGV4O1xuICAgICAgICAgIGJhY2tkcm9wRG9tRWwgPSAkY29tcGlsZSgnPGRpdiBtb2RhbC1iYWNrZHJvcD48L2Rpdj4nKShiYWNrZHJvcFNjb3BlKTtcbiAgICAgICAgICBib2R5LmFwcGVuZChiYWNrZHJvcERvbUVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoYW5nZXM6IGRlbGV0aW9uIG9mIGNzcyB0b3AgcHJvcGVydHkgY2FsY3VsYXRpb25cbiAgICAgICAgdmFyIGFuZ3VsYXJEb21FbCA9IGFuZ3VsYXIuZWxlbWVudCgnPGRpdiBtb2RhbC13aW5kb3cgc3R5bGU9XCJ2aXNpYmlsaXR5OiB2aXNpYmxlOyBkaXNwbGF5OiBibG9ja1wiPjwvZGl2PicpO1xuICAgICAgICBhbmd1bGFyRG9tRWwuYXR0cignd2luZG93LWNsYXNzJywgbW9kYWwud2luZG93Q2xhc3MpO1xuICAgICAgICBhbmd1bGFyRG9tRWwuYXR0cignaW5kZXgnLCBvcGVuZWRXaW5kb3dzLmxlbmd0aCgpIC0gMSk7XG4gICAgICAgIGFuZ3VsYXJEb21FbC5hdHRyKCdhbmltYXRlJywgJ2FuaW1hdGUnKTtcbiAgICAgICAgYW5ndWxhckRvbUVsLmh0bWwobW9kYWwuY29udGVudCk7XG5cbiAgICAgICAgdmFyIG1vZGFsRG9tRWwgPSAkY29tcGlsZShhbmd1bGFyRG9tRWwpKG1vZGFsLnNjb3BlKTtcbiAgICAgICAgb3BlbmVkV2luZG93cy50b3AoKS52YWx1ZS5tb2RhbERvbUVsID0gbW9kYWxEb21FbDtcbiAgICAgICAgYm9keS5hcHBlbmQobW9kYWxEb21FbCk7XG4gICAgICAgIGJvZHkuYWRkQ2xhc3MoT1BFTkVEX01PREFMX0NMQVNTKTtcbiAgICAgIH07XG5cbiAgICAgICRtb2RhbFN0YWNrLmNsb3NlID0gZnVuY3Rpb24gKG1vZGFsSW5zdGFuY2UsIHJlc3VsdCkge1xuICAgICAgICB2YXIgbW9kYWxXaW5kb3cgPSBvcGVuZWRXaW5kb3dzLmdldChtb2RhbEluc3RhbmNlKS52YWx1ZTtcbiAgICAgICAgaWYgKG1vZGFsV2luZG93KSB7XG4gICAgICAgICAgbW9kYWxXaW5kb3cuZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgIHJlbW92ZU1vZGFsV2luZG93KG1vZGFsSW5zdGFuY2UpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAkbW9kYWxTdGFjay5kaXNtaXNzID0gZnVuY3Rpb24gKG1vZGFsSW5zdGFuY2UsIHJlYXNvbikge1xuICAgICAgICB2YXIgbW9kYWxXaW5kb3cgPSBvcGVuZWRXaW5kb3dzLmdldChtb2RhbEluc3RhbmNlKS52YWx1ZTtcbiAgICAgICAgaWYgKG1vZGFsV2luZG93KSB7XG4gICAgICAgICAgbW9kYWxXaW5kb3cuZGVmZXJyZWQucmVqZWN0KHJlYXNvbik7XG4gICAgICAgICAgcmVtb3ZlTW9kYWxXaW5kb3cobW9kYWxJbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgICRtb2RhbFN0YWNrLmRpc21pc3NBbGwgPSBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIHZhciB0b3BNb2RhbCA9IHRoaXMuZ2V0VG9wKCk7XG4gICAgICAgIHdoaWxlICh0b3BNb2RhbCkge1xuICAgICAgICAgIHRoaXMuZGlzbWlzcyh0b3BNb2RhbC5rZXksIHJlYXNvbik7XG4gICAgICAgICAgdG9wTW9kYWwgPSB0aGlzLmdldFRvcCgpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAkbW9kYWxTdGFjay5nZXRUb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBvcGVuZWRXaW5kb3dzLnRvcCgpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuICRtb2RhbFN0YWNrO1xuICAgIH1dKTtcblxuIiwiLypcbiAqIFRoaXMgbW9kdWxlIG1vZGlmaWVzIGFuZ3VsYXIgZm91bmRhdGlvbidzIG1vZGFsIGltcGxlbWVudGF0aW9uLiBUaGlzIGRvZXMgbm90IGNyZWF0ZSBhIG5ldyBtb2RhbCBzZXJ2aWNlL2RpcmVjdGl2ZS5cbiAqXG4qL1xuYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmJjLW1vZGFsJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1tb2RhbC5tb2RhbFN0YWNrLnNlcnZpY2UnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5zZXJ2aWNlcy5kZXZpY2Uuc2VydmljZScsIFtdKVxuICAgIC5mYWN0b3J5KCdkZXZpY2VTZXJ2aWNlJywgZnVuY3Rpb24gZGV2aWNlU2VydmljZSgkd2luZG93KSB7XG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSB7XG4gICAgICAgICAgICBpc0lPU0RldmljZSxcbiAgICAgICAgICAgIGlzTWFjT1NEZXZpY2UsXG4gICAgICAgICAgICBpc01vYmlsZURldmljZVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGlzSU9TRGV2aWNlKCkge1xuICAgICAgICAgICAgY29uc3QgZGV2aWNlTGlzdCA9IFsnaXBhZCcsICdpcGhvbmUnXTtcbiAgICAgICAgICAgIGNvbnN0IHVhID0gJHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIHJldHVybiBfLnNvbWUoZGV2aWNlTGlzdCwgKGRldmljZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBfLmNvbnRhaW5zKHVhLCBkZXZpY2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc01vYmlsZURldmljZSgpIHtcbiAgICAgICAgICAgIHJldHVybiAvTW9iaS9pLnRlc3QoJHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzTWFjT1NEZXZpY2UoKSB7XG4gICAgICAgICAgICByZXR1cm4gL01hYy9pLnRlc3QoJHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xuICAgIH0pOyIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5zZXJ2aWNlcycsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuc2VydmljZXMuZGV2aWNlLnNlcnZpY2UnXG5dKTtcbiIsIi8qKlxuICogQGRlc2NyaXB0aW9uIFNwcml0ZSBkaXJlY3RpdmUgdXNlZCB0byBsb2FkIGFuIGljb24gZnJvbSBhbiBpbWFnZSBzcHJpdGUsXG4gKiAgICAgICAgICAgICAgc2ltbGlhciB0byB0aGUgaWNvbiBkaXJlY3RpdmUgYnV0IGxlc3MgU1ZHXG4gKiBAZXhhbXBsZVxuICogPHNwcml0ZSBnbHlwaD1cImljLWFtZXhcIj48L3Nwcml0ZT5cbiAqL1xuXG5hbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuc3ByaXRlLmRpcmVjdGl2ZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ3Nwcml0ZScsIGZ1bmN0aW9uIHNwcml0ZURpcmVjdGl2ZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIGdseXBoOiAnQCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb21waWxlOiBzcHJpdGVEaXJlY3RpdmVDb21waWxlXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gc3ByaXRlRGlyZWN0aXZlQ29tcGlsZSh0RWxlbWVudCkge1xuICAgICAgICAgICAgdEVsZW1lbnQuYWRkQ2xhc3MoJ3Nwcml0ZScpO1xuICAgICAgICAgICAgdEVsZW1lbnQuYXR0cignYXJpYS1oaWRkZW4nLCB0cnVlKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIHNwcml0ZURpcmVjdGl2ZUxpbmsoJHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgICAgIGF0dHJzLiRvYnNlcnZlKCdnbHlwaCcsIChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmF0dHIoJ2NsYXNzJywgJ3Nwcml0ZSBzcHJpdGUtLScgKyBuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuc3ByaXRlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5zcHJpdGUuZGlyZWN0aXZlJ1xuXSk7XG4iLCIvKipcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIEBleGFtcGxlXG4gKlxuICovXG5cbmFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5zdGlja3ktY2xhc3MuZGlyZWN0aXZlJywgW10pXG4gICAgLmRpcmVjdGl2ZSgnc3RpY2t5Q2xhc3MnLCBmdW5jdGlvbiBzdGlja3lDbGFzcygkZG9jdW1lbnQsICR0aW1lb3V0LCAkd2luZG93KSB7XG4gICAgICAgICduZ0luamVjdCc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgICAgICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQsIGF0dHIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCAkd2luZG93RWxlbSA9IGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KTtcbiAgICAgICAgICAgICAgICBjb25zdCB0aHJvdHRsZWRPblNjcm9sbCA9IF8udGhyb3R0bGUob25TY3JvbGwsIDEwKTtcblxuICAgICAgICAgICAgICAgIGxldCBvZmZzZXRUb3A7XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBjbGVhblVwKCkge1xuICAgICAgICAgICAgICAgICAgICAkd2luZG93RWxlbS5vZmYoJ3Njcm9sbCcsIHRocm90dGxlZE9uU2Nyb2xsKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBvblNjcm9sbCgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCR3aW5kb3cucGFnZVlPZmZzZXQgPj0gb2Zmc2V0VG9wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKGF0dHIuc3RpY2t5Q2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcyhhdHRyLnN0aWNreUNsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZG9jdW1lbnRUb3AgPSAkZG9jdW1lbnRbMF0uYm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRUb3AgPSBlbGVtZW50WzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcblxuICAgICAgICAgICAgICAgICAgICBvZmZzZXRUb3AgPSBlbGVtZW50VG9wIC0gZG9jdW1lbnRUb3A7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhyb3R0bGVkT25TY3JvbGwoKTtcblxuICAgICAgICAgICAgICAgICAgICAkd2luZG93RWxlbS5vbignc2Nyb2xsJywgdGhyb3R0bGVkT25TY3JvbGwpO1xuICAgICAgICAgICAgICAgICAgICBzY29wZS4kb24oJyRkZXN0cm95JywgY2xlYW5VcCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLnN0aWNreS1jbGFzcycsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuc3RpY2t5LWNsYXNzLmRpcmVjdGl2ZSdcbl0pO1xuIiwiLyoqXG4gKiBAZGVzY3JpcHRpb24gVXNlZCB0byBjcmVhdGUgYSB0b2dnbGUgc3dpdGNoIGZvciBmb3Jtc1xuICogQGV4YW1wbGVcbiAgICA8c3dpdGNoIG5nLW1vZGVsPVwiY3RybC5zd2l0Y2hNb2RlbDFcIj48L3N3aXRjaD5cblxuICAgIDxzd2l0Y2hcbiAgICAgICAgdG9nZ2xlLW9mZi10ZXh0PVwiT2ZmXCJcbiAgICAgICAgdG9nZ2xlLW9uLXRleHQ9XCJPblwiXG4gICAgICAgIG5nLW1vZGVsPVwiY3RybC5zd2l0Y2hNb2RlbDJcIj5cbiAgICA8L3N3aXRjaD5cblxuICAgIDxzd2l0Y2hcbiAgICAgICAgaGFzLWljb25cbiAgICAgICAgbmctbW9kZWw9XCJjdHJsLnN3aXRjaE1vZGVsM1wiPlxuICAgIDwvc3dpdGNoPlxuXG4gICAgPHN3aXRjaFxuICAgICAgICBpcy1pbXBvcnRhbnRcbiAgICAgICAgbGVmdC1sYWJlbD1cIkRvd24gZm9yIE1haW50ZW5hbmNlXCJcbiAgICAgICAgcmlnaHQtbGFiZWw9XCJPcGVuXCJcbiAgICAgICAgbmctbW9kZWw9XCJjdHJsLnN3aXRjaE1vZGVsNFwiPlxuICAgIDwvc3dpdGNoPlxuICovXG5hbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuc3dpdGNoLmRpcmVjdGl2ZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ3N3aXRjaCcsIGZ1bmN0aW9uIHN3aXRjaERpcmVjdGl2ZSgpIHtcblxuICAgICAgICBmdW5jdGlvbiBnZXRVbmlxdWVJRChpZFByZWZpeCkge1xuICAgICAgICAgICAgcmV0dXJuIF8udW5pcXVlSWQoaWRQcmVmaXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9qcy9iaWdjb21tZXJjZS9zd2l0Y2gvc3dpdGNoLnRwbC5odG1sJyxcbiAgICAgICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgYXJpYURlc2NyaXB0aW9uOiAnQCcsXG4gICAgICAgICAgICAgICAgaXNEaXNhYmxlZDogJz1uZ0Rpc2FibGVkJyxcbiAgICAgICAgICAgICAgICBsYWJlbFRleHQ6ICdAJyxcbiAgICAgICAgICAgICAgICBsZWZ0RGVzY3JpcHRpb246ICdAJyxcbiAgICAgICAgICAgICAgICBuZ0ZhbHNlVmFsdWU6ICdAJyxcbiAgICAgICAgICAgICAgICBuZ1RydWVWYWx1ZTogJ0AnLFxuICAgICAgICAgICAgICAgIHJpZ2h0RGVzY3JpcHRpb246ICdAJyxcbiAgICAgICAgICAgICAgICB0b2dnbGVPZmZMYWJlbDogJ0AnLFxuICAgICAgICAgICAgICAgIHRvZ2dsZU9uTGFiZWw6ICdAJyxcbiAgICAgICAgICAgICAgICB1bmlxdWVJZDogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3N3aXRjaEN0cmwnLFxuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gc3dpdGNoRGlyZWN0aXZlQ29tcGlsZSh0RWxlbSwgdEF0dHJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNoZWNrYm94RWxlbSA9IHRFbGVtLmZpbmQoJ2lucHV0Jyk7XG5cbiAgICAgICAgICAgICAgICBpZiAodEF0dHJzLm5nRmFsc2VWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjaGVja2JveEVsZW0uYXR0cignbmctZmFsc2UtdmFsdWUnLCB0QXR0cnMubmdGYWxzZVZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodEF0dHJzLm5nVHJ1ZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrYm94RWxlbS5hdHRyKCduZy10cnVlLXZhbHVlJywgdEF0dHJzLm5nVHJ1ZVZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gc3dpdGNoRGlyZWN0aXZlUG9zdExpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS5zd2l0Y2hDdHJsLmluaXQobmdNb2RlbEN0cmwpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gc3dpdGNoRGlyZWN0aXZlQ3RybCgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3RybCA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICAvLyBzdGF0ZVxuICAgICAgICAgICAgICAgIGN0cmwuaXNJbXBvcnRhbnQgPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMuaXNJbXBvcnRhbnQpICYmICRhdHRycy5pc0ltcG9ydGFudCAhPT0gJ2ZhbHNlJztcbiAgICAgICAgICAgICAgICBjdHJsLmhhc0ljb24gPSBhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMuaGFzSWNvbikgJiYgJGF0dHJzLmhhc0ljb24gIT09ICdmYWxzZSc7XG5cbiAgICAgICAgICAgICAgICAvLyBsYWJlbHNcbiAgICAgICAgICAgICAgICBjdHJsLmxhYmVsVGV4dCA9ICRhdHRycy50b2dnbGVPZmZMYWJlbDtcblxuICAgICAgICAgICAgICAgIC8vIGlkc1xuICAgICAgICAgICAgICAgIGN0cmwudW5pcXVlSWQgPSBnZXRVbmlxdWVJRCgnc3dpdGNoLScpO1xuICAgICAgICAgICAgICAgIGN0cmwuYXJpYURlc2NyaXB0aW9uSUQgPSBnZXRVbmlxdWVJRCgnc3dpdGNoLWFyaWFEZXNjcmlwdGlvbi0nKTtcblxuICAgICAgICAgICAgICAgIGN0cmwuaW5pdCA9IGluaXQ7XG4gICAgICAgICAgICAgICAgY3RybC51cGRhdGVNb2RlbCA9IHVwZGF0ZU1vZGVsO1xuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdChuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgICAgICAgICBjdHJsLm5nTW9kZWxDdHJsID0gbmdNb2RlbEN0cmw7XG4gICAgICAgICAgICAgICAgICAgIGN0cmwudmFsdWUgPSBjdHJsLm5nTW9kZWxDdHJsLiRtb2RlbFZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ3N3aXRjaEN0cmwubmdNb2RlbEN0cmwuJG1vZGVsVmFsdWUnLCBmdW5jdGlvbiBzd2l0Y2hWYWx1ZUNoYW5nZWQobmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0cmwudmFsdWUgPSBuZXdWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY3RybC5pc0NoZWNrZWQgPSBfLmlzU3RyaW5nKG5ld1ZhbHVlKSA/IFwiJ1wiICsgbmV3VmFsdWUgKyBcIidcIiA9PT0gY3RybC5uZ1RydWVWYWx1ZSA6IG5ld1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3RybC5sYWJlbFRleHQgPSAhIWN0cmwuaXNDaGVja2VkID8gY3RybC50b2dnbGVPbkxhYmVsOiBjdHJsLnRvZ2dsZU9mZkxhYmVsO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGVNb2RlbCgpIHtcbiAgICAgICAgICAgICAgICAgICAgY3RybC5uZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKGN0cmwudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLnN3aXRjaCcsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuc3dpdGNoLmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLnV0aWwnLCBbXG4gICAgJ2JjYXBwLXBhdHRlcm4tbGFiLnV0aWwudHJ1c3RBc0h0bWwnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUtZmFjdG9yeS5zZXJ2aWNlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUuc2VydmljZSdcbl0pXG4gICAgLmZhY3RvcnkoJ2JjU2VydmVyVGFibGVGYWN0b3J5JywgZnVuY3Rpb24gYmNTZXJ2ZXJUYWJsZUZhY3RvcnkoJGxvZywgQmNTZXJ2ZXJUYWJsZSkge1xuICAgICAgICB2YXIgdGFibGVzID0ge30sXG4gICAgICAgICAgICBzZXJ2aWNlID0ge1xuICAgICAgICAgICAgICAgIGNyZWF0ZTogY3JlYXRlLFxuICAgICAgICAgICAgICAgIGdldDogZ2V0LFxuICAgICAgICAgICAgICAgIHJlbW92ZTogcmVtb3ZlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZSh0YWJsZUlkLCB0YWJsZUNvbmZpZykge1xuICAgICAgICAgICAgaWYgKHRhYmxlSWQgaW4gdGFibGVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlcnZpY2UuZ2V0KHRhYmxlSWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRhYmxlSWQpIHtcbiAgICAgICAgICAgICAgICB0YWJsZUlkID0gXy51bmlxdWVJZCgnYmMtc2VydmVyLXRhYmxlLWluc3RhbmNlLScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0YWJsZXNbdGFibGVJZF0gPSBuZXcgQmNTZXJ2ZXJUYWJsZSh0YWJsZUlkLCB0YWJsZUNvbmZpZyk7XG5cbiAgICAgICAgICAgIHJldHVybiB0YWJsZXNbdGFibGVJZF07XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXQodGFibGVJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRhYmxlc1t0YWJsZUlkXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZSh0YWJsZUlkKSB7XG4gICAgICAgICAgICBkZWxldGUgdGFibGVzW3RhYmxlSWRdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuYmMtc2VydmVyLXRhYmxlLnNlcnZpY2UnLCBbXG4gICAgJ3VpLnJvdXRlcidcbl0pXG4gICAgLmZhY3RvcnkoJ0JjU2VydmVyVGFibGUnLCBmdW5jdGlvbiBiY1NlcnZlclRhYmxlKCRsb2csICRxLCAkc3RhdGUsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICB2YXIgZGVmYXVsdFRhYmxlQ29uZmlnID0ge1xuICAgICAgICAgICAgZmlsdGVyczogW10sXG4gICAgICAgICAgICBxdWVyeUtleXM6IHtcbiAgICAgICAgICAgICAgICBwYWdlOiAncGFnZScsXG4gICAgICAgICAgICAgICAgbGltaXQ6ICdsaW1pdCcsXG4gICAgICAgICAgICAgICAgc29ydEJ5OiAnc29ydC1ieScsXG4gICAgICAgICAgICAgICAgc29ydERpcjogJ3NvcnQtb3JkZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcm93SWRLZXk6ICdpZCcsXG4gICAgICAgICAgICBzb3J0RGlyVmFsdWVzOiB7XG4gICAgICAgICAgICAgICAgYXNjOiAnYXNjJyxcbiAgICAgICAgICAgICAgICBkZXNjOiAnZGVzYydcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBTZXJ2ZXJUYWJsZSh0YWJsZUlkLCB0YWJsZUNvbmZpZykge1xuICAgICAgICAgICAgdGhpcy5hbGxTZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5maWx0ZXJzID0ge307XG4gICAgICAgICAgICB0aGlzLmlkID0gdGFibGVJZDtcbiAgICAgICAgICAgIHRoaXMucGFnaW5hdGlvbiA9IHtcbiAgICAgICAgICAgICAgICBwYWdlOiBudWxsLFxuICAgICAgICAgICAgICAgIGxpbWl0OiBudWxsLFxuICAgICAgICAgICAgICAgIHRvdGFsOiBudWxsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5wZW5kaW5nUmVxdWVzdCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5yZXNvdXJjZUNhbGxiYWNrID0gYW5ndWxhci5ub29wO1xuICAgICAgICAgICAgdGhpcy5yb3dzID0gW107XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkUm93cyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5zb3J0QnkgPSAnJztcbiAgICAgICAgICAgIHRoaXMuc29ydERpciA9ICcnO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLnRhYmxlQ29uZmlnID0gXy5pc09iamVjdCh0YWJsZUNvbmZpZykgPyB0YWJsZUNvbmZpZyA6IHt9O1xuICAgICAgICAgICAgdGhpcy50YWJsZUNvbmZpZyA9IF8uZGVmYXVsdHModGhpcy50YWJsZUNvbmZpZywgZGVmYXVsdFRhYmxlQ29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIFNlcnZlclRhYmxlLnByb3RvdHlwZSA9IHtcbiAgICAgICAgICAgIGNyZWF0ZVBhcmFtc09iamVjdDogY3JlYXRlUGFyYW1zT2JqZWN0LFxuICAgICAgICAgICAgZGVzZWxlY3RBbGxSb3dzOiBkZXNlbGVjdEFsbFJvd3MsXG4gICAgICAgICAgICBmZXRjaFJlc291cmNlOiBmZXRjaFJlc291cmNlLFxuICAgICAgICAgICAgZ2V0U2VsZWN0ZWRSb3dzOiBnZXRTZWxlY3RlZFJvd3MsXG4gICAgICAgICAgICBpbml0OiBpbml0LFxuICAgICAgICAgICAgaXNSb3dTZWxlY3RlZDogaXNSb3dTZWxlY3RlZCxcbiAgICAgICAgICAgIGxvYWRTdGF0ZVBhcmFtczogbG9hZFN0YXRlUGFyYW1zLFxuICAgICAgICAgICAgc2VsZWN0QWxsUm93czogc2VsZWN0QWxsUm93cyxcbiAgICAgICAgICAgIHNldFBhZ2luYXRpb25WYWx1ZXM6IHNldFBhZ2luYXRpb25WYWx1ZXMsXG4gICAgICAgICAgICBzZXRSb3dzOiBzZXRSb3dzLFxuICAgICAgICAgICAgc2V0U2VsZWN0aW9uRm9yQWxsUm93czogc2V0U2VsZWN0aW9uRm9yQWxsUm93cyxcbiAgICAgICAgICAgIHNldFNvcnRpbmdWYWx1ZXM6IHNldFNvcnRpbmdWYWx1ZXMsXG4gICAgICAgICAgICB1cGRhdGVQYWdlOiB1cGRhdGVQYWdlLFxuICAgICAgICAgICAgdXBkYXRlU29ydDogdXBkYXRlU29ydCxcbiAgICAgICAgICAgIHVwZGF0ZVRhYmxlOiB1cGRhdGVUYWJsZSxcbiAgICAgICAgICAgIHZhbGlkYXRlUmVzb3VyY2U6IHZhbGlkYXRlUmVzb3VyY2VcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVQYXJhbXNPYmplY3QoKSB7XG4gICAgICAgICAgICB2YXIgcGFyYW1zID0ge30sXG4gICAgICAgICAgICAgICAgcXVlcnlLZXlzID0gdGhpcy50YWJsZUNvbmZpZy5xdWVyeUtleXMsXG4gICAgICAgICAgICAgICAgcXVlcnlQYXJhbU1hcCA9IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeUtleTogcXVlcnlLZXlzLnBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5wYWdpbmF0aW9uLnBhZ2VcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlLZXk6IHF1ZXJ5S2V5cy5saW1pdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLnBhZ2luYXRpb24ubGltaXRcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlLZXk6IHF1ZXJ5S2V5cy5zb3J0QnksXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5zb3J0QnlcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlLZXk6IHF1ZXJ5S2V5cy5zb3J0RGlyLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuc29ydERpclxuICAgICAgICAgICAgICAgICAgICB9XTtcblxuICAgICAgICAgICAgXy5lYWNoKHF1ZXJ5UGFyYW1NYXAsIGZ1bmN0aW9uIHF1ZXJ5UGFyYW1NYXBFYWNoKHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtLnF1ZXJ5S2V5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zW3BhcmFtLnF1ZXJ5S2V5XSA9IHBhcmFtLnZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBfLmV4dGVuZChwYXJhbXMsIHRoaXMuZmlsdGVycyk7XG5cbiAgICAgICAgICAgIHJldHVybiBwYXJhbXM7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZXNlbGVjdEFsbFJvd3MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTZWxlY3Rpb25Gb3JBbGxSb3dzKGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZldGNoUmVzb3VyY2UoKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGlzLnBlbmRpbmdSZXF1ZXN0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlQ2FsbGJhY2sodGhpcy5jcmVhdGVQYXJhbXNPYmplY3QoKSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiByZXNvdXJjZUNhbGxiYWNrVGhlbihyZXNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoX3RoaXMudmFsaWRhdGVSZXNvdXJjZShyZXNvdXJjZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnNldFJvd3MocmVzb3VyY2Uucm93cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5zZXRQYWdpbmF0aW9uVmFsdWVzKHJlc291cmNlLnBhZ2luYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIHJlc291cmNlQ2FsbGJhY2tDYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAkbG9nLmVycm9yKCdiYy1zZXJ2ZXItdGFibGUgZGlyZWN0aXZlOiBmYWlsZWQgdG8gZmV0Y2ggcmVzb3VyY2UnKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5maW5hbGx5KGZ1bmN0aW9uIHJlc291cmNlQ2FsbGJhY2tGaW5hbGx5KCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5wZW5kaW5nUmVxdWVzdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0U2VsZWN0ZWRSb3dzKCkge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgcmV0dXJuIF8uZmlsdGVyKHRoaXMucm93cywgZnVuY3Rpb24gZ2V0U2VsZWN0ZWRSb3dzRmlsdGVyKHJvdykge1xuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5pc1Jvd1NlbGVjdGVkKHJvdyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoY29uZmlnKSB7XG4gICAgICAgICAgICBpZiAoIV8uaXNPYmplY3QoY29uZmlnKSkge1xuICAgICAgICAgICAgICAgIGNvbmZpZyA9IHt9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGNvbmZpZy5yZXNvdXJjZUNhbGxiYWNrKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzb3VyY2VDYWxsYmFjayA9IGNvbmZpZy5yZXNvdXJjZUNhbGxiYWNrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICAgICAgICAgIC5sb2FkU3RhdGVQYXJhbXMoY29uZmlnLnN0YXRlUGFyYW1zKVxuICAgICAgICAgICAgICAgIC5mZXRjaFJlc291cmNlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc1Jvd1NlbGVjdGVkKHJvdykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRSb3dzW3Jvd1t0aGlzLnRhYmxlQ29uZmlnLnJvd0lkS2V5XV07XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBsb2FkU3RhdGVQYXJhbXMoc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgICAgIHZhciBxdWVyeUtleXMgPSB0aGlzLnRhYmxlQ29uZmlnLnF1ZXJ5S2V5cyxcbiAgICAgICAgICAgICAgICBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHN0YXRlUGFyYW1zID0gc3RhdGVQYXJhbXMgfHwgJHN0YXRlUGFyYW1zO1xuXG4gICAgICAgICAgICB0aGlzLnNldFBhZ2luYXRpb25WYWx1ZXMoe1xuICAgICAgICAgICAgICAgIHBhZ2U6IHN0YXRlUGFyYW1zW3F1ZXJ5S2V5cy5wYWdlXSxcbiAgICAgICAgICAgICAgICBsaW1pdDogc3RhdGVQYXJhbXNbcXVlcnlLZXlzLmxpbWl0XVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0U29ydGluZ1ZhbHVlcyhzdGF0ZVBhcmFtc1txdWVyeUtleXMuc29ydEJ5XSwgc3RhdGVQYXJhbXNbcXVlcnlLZXlzLnNvcnREaXJdKTtcblxuICAgICAgICAgICAgLy8gc2V0IGZpbHRlcnMgZnJvbSBxdWVyeSBwYXJhbXNcbiAgICAgICAgICAgIF8uZWFjaCh0aGlzLnRhYmxlQ29uZmlnLmZpbHRlcnMsIGZ1bmN0aW9uIHNldEZpbHRlcnNFYWNoKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuZmlsdGVyc1t2YWx1ZV0gPSBzdGF0ZVBhcmFtc1t2YWx1ZV07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGlzIGlzIGFjdHVhbGx5IGEgdG9nZ2xlIG5vdCBqdXN0IGEgc2VsZWN0XG4gICAgICAgIGZ1bmN0aW9uIHNlbGVjdEFsbFJvd3MoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTZWxlY3Rpb25Gb3JBbGxSb3dzKCF0aGlzLmFsbFNlbGVjdGVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldFBhZ2luYXRpb25WYWx1ZXMocGFnaW5hdGlvbikge1xuICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uID0gdGhpcy5wYWdpbmF0aW9uIHx8IHt9O1xuICAgICAgICAgICAgXy5leHRlbmQodGhpcy5wYWdpbmF0aW9uLCBwYWdpbmF0aW9uKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRSb3dzKHJvd3MpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoaXMucm93cyA9IHJvd3M7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkUm93cyA9IF8ucmVkdWNlKHJvd3MsIGZ1bmN0aW9uIGluaXRpYWxpemVTZWxlY3RlZFJvd3NPYmplY3QoYWNjdW0sIHJvdykge1xuICAgICAgICAgICAgICAgIGFjY3VtW3Jvd1tfdGhpcy50YWJsZUNvbmZpZy5yb3dJZEtleV1dID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjY3VtO1xuICAgICAgICAgICAgfSwge30pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldFNlbGVjdGlvbkZvckFsbFJvd3ModmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZhbHVlID0gISF2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5hbGxTZWxlY3RlZCA9IHZhbHVlO1xuXG4gICAgICAgICAgICBfLmVhY2godGhpcy5zZWxlY3RlZFJvd3MsIGZ1bmN0aW9uIGFsbFJvd3NJdGVyYXRpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgIF90aGlzLnNlbGVjdGVkUm93c1trZXldID0gX3RoaXMuYWxsU2VsZWN0ZWQ7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRTb3J0aW5nVmFsdWVzKHNvcnRCeSwgc29ydERpcikge1xuICAgICAgICAgICAgdGhpcy5zb3J0QnkgPSBzb3J0QnkgfHwgdGhpcy5zb3J0Qnk7XG4gICAgICAgICAgICB0aGlzLnNvcnREaXIgPSBzb3J0RGlyIHx8IHRoaXMuc29ydERpcjtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVQYWdlKHBhZ2UsIGxpbWl0LCB0b3RhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgICAgICAgICAuc2V0UGFnaW5hdGlvblZhbHVlcyhwYWdlLCBsaW1pdCwgdG90YWwpXG4gICAgICAgICAgICAgICAgLnVwZGF0ZVRhYmxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVTb3J0KHNvcnRCeSwgc29ydERpcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgICAgICAgICAuc2V0U29ydGluZ1ZhbHVlcyhzb3J0QnksIHNvcnREaXIpXG4gICAgICAgICAgICAgICAgLnNldFBhZ2luYXRpb25WYWx1ZXMoe1xuICAgICAgICAgICAgICAgICAgICBwYWdlOiAxXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudXBkYXRlVGFibGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVRhYmxlKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnBlbmRpbmdSZXF1ZXN0KSB7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCRzdGF0ZS5jdXJyZW50Lm5hbWUsIHRoaXMuY3JlYXRlUGFyYW1zT2JqZWN0KCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHZhbGlkYXRlUmVzb3VyY2UocmVzb3VyY2UpIHtcbiAgICAgICAgICAgIGlmICghXy5pc09iamVjdChyZXNvdXJjZSkpIHtcbiAgICAgICAgICAgICAgICAkbG9nLmVycm9yKCdiYy1zZXJ2ZXItdGFibGUgZGlyZWN0aXZlOiBSZXNvdXJjZSBjYWxsYmFjayBtdXN0IHJldHVybiBhbiBvYmplY3QnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghXy5pc0FycmF5KHJlc291cmNlLnJvd3MpKSB7XG4gICAgICAgICAgICAgICAgJGxvZy5lcnJvcignYmMtc2VydmVyLXRhYmxlIGRpcmVjdGl2ZTogcmV0dXJuZWQgb2JqZWN0IG11c3QgY29udGFpbiBhIHJvd3MgcHJvcGVydHkgdGhhdCBpcyBhbiBhcnJheS4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghXy5pc09iamVjdChyZXNvdXJjZS5wYWdpbmF0aW9uKSkge1xuICAgICAgICAgICAgICAgICRsb2cuZXJyb3IoJ2JjLXNlcnZlci10YWJsZSBkaXJlY3RpdmU6IHJldHVybmVkIG9iamVjdCBtdXN0IGNvbnRhaW4gYSBwYWdpbmF0aW9uIHByb3BlcnR5IHRoYXQgaXMgYW4gb2JqZWN0LicpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gU2VydmVyVGFibGU7XG4gICAgfSk7XG4iLCIvKipcbiAqIEBuYW1lIGNjLWV4cGlyeSBkaXJlY3RpdmVcbiAqIEBkZXNjcmlwdGlvbiBBIGRpcmVjdGl2ZSBmb2xsb3dpbmcgYW5ndWxhci1jcmVkaXQtY2FyZCdzIGFwcHJvYWNoIHRvIHZhbGlkYXRpbmcvZm9ybWF0dGluZyBjcmVkaXQgY2FyZCBleHBpcmF0aW9uIGRhdGUuXG4gKiBFeHBlY3QgdGhlIGNjLWV4cGlyeSBuZ01vZGVsIHRvIGJlIGluIHRoZSBmb3JtYXQgb2YgYHsgbW9udGg6ICcwNScsIHllYXI6ICcyMDE3J31gLlxuICovXG5hbmd1bGFyLm1vZHVsZSgnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQuY2MtZXhwaXJ5LmRpcmVjdGl2ZScsIFtdKVxuICAgIC5kaXJlY3RpdmUoJ2NjRXhwaXJ5JywgZnVuY3Rpb24gY2NFeHBEaXJlY3RpdmUoJGZpbHRlcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tcGlsZTogZnVuY3Rpb24gKHRFbGVtLCB0QXR0cikge1xuICAgICAgICAgICAgICAgIGNvbnN0IEVYUElSQVRJT05fTUFYX0xFTkdUSCA9IDc7IC8vIGxlbmd0aCBvZiBgTU0gLyB5eWBcblxuICAgICAgICAgICAgICAgIHRBdHRyLiRzZXQoJ2F1dG9jb21wbGV0ZScsICdjYy1leHAnKTtcbiAgICAgICAgICAgICAgICB0QXR0ci4kc2V0KCdtYXhsZW5ndGgnLCBFWFBJUkFUSU9OX01BWF9MRU5HVEgpO1xuICAgICAgICAgICAgICAgIHRBdHRyLiRzZXQoJ3BhdHRlcm4nLCAnWzAtOV0qJyk7IC8vIGZvciBtb2JpbGUga2V5Ym9hcmQgZGlzcGxheVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGNjRXhwaXJ5TGluayhzY29wZSwgdEVsZW0sIHRBdHRyLCBuZ01vZGVsQ3RybCkge1xuICAgICAgICAgICAgICAgICAgICBpbml0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRwYXJzZXJzLnVuc2hpZnQocGFyc2VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRmb3JtYXR0ZXJzLnB1c2goZm9ybWF0dGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiR2YWxpZGF0b3JzLnZhbGlkRnV0dXJlRGF0ZSA9IHZhbGlkRnV0dXJlRGF0ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGdldFZpZXdWYWx1ZSwgcmVuZGVyRm9ybWF0dGVkVmlldyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogZ2V0IHRoZSBpbnB1dCdzIHZpZXcgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdldFZpZXdWYWx1ZSgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZ01vZGVsQ3RybC4kdmlld1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIGZvcm1hdHMgdGhlIGlucHV0IHZpZXcgdmFsdWUgdG8gYmUgdGhlIGZvcm1hdCBgTU0gLyB5eWAgYW5kIHJlLXJlbmRlcnMgdmlld1xuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcmVuZGVyRm9ybWF0dGVkVmlldyh2aWV3VmFsdWUsIHByZXZWaWV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdmlld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhIG5ldyB2YWx1ZSBpcyBhZGRlZCAoYXMgb3Bwb3NlZCB0byBwcmVzc2luZyBiYWNrc3BhY2UpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0FkZGl0aW9uID0gdmlld1ZhbHVlLmxlbmd0aCA+IHByZXZWaWV3VmFsdWUubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBuZ01vZGVsQ3RybC4kc2V0Vmlld1ZhbHVlKGZvcm1hdCh2aWV3VmFsdWUsIGlzQWRkaXRpb24pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nTW9kZWxDdHJsLiRyZW5kZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBWYWxpZGF0ZXMgd2hldGhlciB0aGUgZW50ZXJlZCBleHBpcmF0aW9uIGRhdGUgaXMgdmFsaWRcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHZhbGlkRnV0dXJlRGF0ZShtb2RlbFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7bW9udGgsIHllYXJ9ID0gbW9kZWxWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWREYXRlKG1vbnRoLCB5ZWFyKSAmJiAhaXNQYXN0KG1vbnRoLCB5ZWFyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBWYWxpZGF0ZXMgd2hldGhlciB0aGUgZ2l2ZW4gbW9udGggYW5kIHllYXIgYXJlIG51bWJlciBzdHJpbmdzIHdpdGggbGVuZ3RoIG9mIDIgYW5kIDQgcmVzcGVjdGl2ZWx5XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBpc1ZhbGlkRGF0ZShtb250aCwgeWVhcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9udGhSZWdleCA9IC9eWzAtOV17Mn0kLztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHllYXJSZWdleCA9IC9eWzAtOV17NH0kLztcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF8uaXNTdHJpbmcobW9udGgpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5pc1N0cmluZyh5ZWFyKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoUmVnZXgudGVzdChtb250aCkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5ZWFyUmVnZXgudGVzdCh5ZWFyKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzVmFsaWRNb250aChtb250aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIG1vbnRoIGlzIHZhbGlkXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBpc1ZhbGlkTW9udGgobW9udGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoID0gXy5wYXJzZUludChtb250aCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtb250aCA+IDAgJiYgbW9udGggPCAxMztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBDaGVja3Mgd2hldGhlciB0aGUgZ2l2ZW4gbW9udGggYW5kIGRhdGUgaXMgaW4gdGhlIHBhc3RcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGlzUGFzdChtb250aCwgeWVhcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldEN1cnJNb250aERhdGUoKSA+IG5ldyBEYXRlKHllYXIsIG1vbnRoIC0gMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogR2V0IHRoZSBkYXRlIG9iamVjdCBiYXNlZCBvbiBjdXJyZW50IG1vbnRoIGFuZCB5ZWFyXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBnZXRDdXJyTW9udGhEYXRlKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRlLmdldEZ1bGxZZWFyKCksIGRhdGUuZ2V0TW9udGgoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogVXNlcyBhbmd1bGFyIGRhdGUgZmlsdGVyIHRvIGZvcm1hdCBkYXRlIG1vZGVsIHRvIGNvcnJlc3BvbmRpbmcgdmlldyBmb3JtYXRcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGZvcm1hdHRlcihleHAgPSB7fSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9udGggPSBleHAubW9udGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB5ZWFyID0gZXhwLnllYXI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfLmlzRW1wdHkobW9udGgpICYmIF8uaXNFbXB0eSh5ZWFyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRmaWx0ZXIoJ2RhdGUnKShuZXcgRGF0ZSh5ZWFyLCBtb250aCAtIDEpLCAnTU0gLyB5eScpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFBhcnNlcyB0aGUgZm9ybWF0dGVkIHZpZXcgdmFsdWVzIHRvIG1vZGVsLiBDb252ZXJ0cyAyIGRpZ2l0IHllYXIgdG8gZnVsbCA0IGRpZ2l0IHllYXJcbiAgICAgICAgICAgICAgICAgICAgICogQHBhcmFtIGV4cGlyYXRpb24ge29iamVjdH0gVGhlIGV4cGlyYXRpb24gb2JqZWN0IHttb250aCwgeWVhcn1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHBhcnNlcihleHBpcmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBiYXNlWWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpLnNsaWNlKDAsIDIpOyAvLyBgJzIwJ2BcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IGV4cGlyYXRpb24uc3BsaXQoJy8nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vbnRoID0gdmFsdWVzWzBdID8gdmFsdWVzWzBdLnRyaW0oKSA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeWVhciA9IHZhbHVlc1sxXSA/IGJhc2VZZWFyICsgdmFsdWVzWzFdLnRyaW0oKSA6ICcnO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBtb250aCwgeWVhciB9O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIGZvcm1hdHMgdGhlIHZpZXcgdmFsdWUgdG8gdGhlIGZvcm0gJ01NIC8geXknXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBmb3JtYXQoZXhwU3RyLCBpc0FkZGl0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBleHBTdHIuc3BsaXQoJy8nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vbnRoID0gdmFsdWVzWzBdID8gdmFsdWVzWzBdLnRyaW0oKSA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeWVhciA9IHZhbHVlc1sxXSA/IHZhbHVlc1sxXS50cmltKCkuc2xpY2UoLTIpIDogJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRvbid0IGFkZCBzbGFzaFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCghaXNBZGRpdGlvbiAmJiAheWVhcikgfHwgbW9udGgubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtb250aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkIHNsYXNoIGluIHRoZSByaWdodCBzcG90XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNBZGRpdGlvbiAmJiAheWVhciAmJiBtb250aC5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke21vbnRoLnNsaWNlKDAsIDIpfSAvICR7bW9udGguc2xpY2UoMil9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke21vbnRofSAvICR7eWVhcn1gO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXF1aXJlOiAnbmdNb2RlbCcsXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLmNjLWV4cGlyeScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuY3JlZGl0LWNhcmQuY2MtZXhwaXJ5LmRpcmVjdGl2ZScsXG5dKTtcbiIsIi8qKlxuICogQG5hbWUgYmMtY3ZjIGRpcmVjdGl2ZVxuICogQGRlc2NyaXB0aW9uIEEgY3VzdG9tIGNvbXBsZW1lbnRhcnkgZGlyZWN0aXZlIHRvIGFuZ3VsYXItY3JlZGl0LWNhcmQncyBgY2NDdmNgIGRpcmVjdGl2ZS5cbiAqIFRvIHN1cHBvcnQgYWxsb3dpbmcgYW4gb3B0aW9uYWwgY3ZjIGZpZWxkIChpLmUuIFNlY3VyZW5ldCksIHRoaXMgZGlyZWN0aXZlIG11c3Qgb3ZlcnJpZGVcbiAqIHRoZSB2YWxpZGF0aW9uIHByb3ZpZGVkIGJ5IGNjQ3ZjIGRpcmVjdGl2ZS5cbiAqL1xuYW5ndWxhci5tb2R1bGUoJ2JjYXBwLXBhdHRlcm4tbGFiLmNyZWRpdC1jYXJkLmJjLWN2YycsIFtcbiAgICAnY3JlZGl0LWNhcmRzJyxcbl0pXG4gICAgLmRpcmVjdGl2ZSgnYmNDdmMnLCBmdW5jdGlvbiBiY0N2Y0RpcmVjdGl2ZSgkcGFyc2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIGJjQ3ZjTGluayhzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcywgbmdNb2RlbCkge1xuICAgICAgICAgICAgICAgIC8vIG92ZXJyaWRlIHRoZSB2YWxpZGF0aW9uIHRvIGFsd2F5cyByZXR1cm4gdmFsaWRcbiAgICAgICAgICAgICAgICAvLyBpZiBjdmMgaXMgbm90IHJlcXVpcmVkXG4gICAgICAgICAgICAgICAgaWYgKCEkcGFyc2UoYXR0cmlidXRlcy5uZ1JlcXVpcmVkKShzY29wZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbmdNb2RlbC4kdmFsaWRhdG9ycy5jY0N2YyA9ICgpID0+IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByaW9yaXR5OiA1LCAvLyBoaWdoZXIgcHJpb3JpdHkgdG8gZW5zdXJlIGNjQ3ZjJ3MgbGluayBpcyByYW4gZmlyc3RcbiAgICAgICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIH07XG4gICAgfSk7XG4iLCIvKipcbiAqIEBuYW1lIHRydXN0QXNIdG1sXG4gKiBAZGVzY3JpcHRpb24gU2ltcGxlIHV0aWxpdHkgZmlsdGVyIHRvIHJ1biB0aGUgZ2l2ZW4gaHRtbCBzdHJpbmcgdGhyb3VnaCBhbmd1bGFyJ3MgJHNjZS50cnVzdEFzSHRtbCBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dCBUaGUgaHRtbCBzdHJpbmcgdG8gdHJ1c3RcbiAqIEByZXR1cm4ge1N0cmluZ30gQW4gYW5ndWxhci10cnVzdGVkIG9iamVjdCBjb250YWluaW5nIHRoZSBodG1sXG4gKlxuICogQGV4YW1wbGUgYDxwIG5nLWJpbmQtaHRtbD1cInJhd0h0bWwgfCB0cnVzdEFzSHRtbFwiPjwvcD5gXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdiY2FwcC1wYXR0ZXJuLWxhYi51dGlsLnRydXN0QXNIdG1sJywgW10pXG4gICAgLmZpbHRlcigndHJ1c3RBc0h0bWwnLCBmdW5jdGlvbiB0cnVzdEFzSHRtbCgkc2NlKXtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiAkc2NlLnRydXN0QXNIdG1sKHRleHQpO1xuICAgICAgICB9O1xuICAgIH0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9