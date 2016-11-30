(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/js/bigcommerce/bc-pagination/bc-pagination.tpl.html",
    "<pagination ng-show=\"show()\"></pagination>\n" +
    "\n" +
    "<div bc-dropdown class=\"pagination-limits\" ng-show=\"showLimits()\">\n" +
    "    <a bc-dropdown-toggle class=\"dropdown-button dropdown-button--tiny\" translate>View {{ getCurrentLimit() }}</a>\n" +
    "    <ul bc-dropdown-menu class=\"pagination-limits-list\">\n" +
    "        <li class=\"dropdown-menu-item pagination-limits-item\" ng-repeat=\"limit in getLimits()\">\n" +
    "            <a href=\"#\" ng-click=\"setLimit(limit, $event)\">{{ limit }}</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/js/bigcommerce/bc-server-table/bc-sort-by.tpl.html",
    "<a href=\"#\" ng-click=\"sort($event)\">\n" +
    "    {{ columnName }}\n" +
    "    <icon glyph=\"ic-expand-less\" ng-if=\"sortBy === sortValue && sortDir === asc\"></icon>\n" +
    "    <icon glyph=\"ic-expand-more\" ng-if=\"sortBy === sortValue && sortDir === desc\"></icon>\n" +
    "</a>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/js/bigcommerce/color-picker/color-picker-palette.tpl.html",
    "<div class=\"colorPicker-label\">\n" +
    "    <label class=\"colorPicker-label-column colorPicker-label-body\" translate>\n" +
    "    Set Colors:\n" +
    "    </label>\n" +
    "    <a class=\"colorPicker-label-column colorPicker-label-actions\"\n" +
    "      ng-click=\"colorPickerPaletteCtrl.removeExistingColor($event)\"\n" +
    "      ng-hide=\"colorPickerPaletteCtrl.colors.length < 1\"\n" +
    "      href=\"#\">\n" +
    "        <span class=\"is-srOnly\" translate>Remove color from palette</span>\n" +
    "        <icon glyph=\"ic-delete\" class=\"colorPicker-label-action-icon\"></icon>\n" +
    "    </a>\n" +
    "</div>\n" +
    "<ul class=\"colorPicker-palette-list\">\n" +
    "    <li class=\"colorPicker-palette-item\"\n" +
    "        ng-repeat=\"color in colorPickerPaletteCtrl.colors\">\n" +
    "        <a class=\"colorPicker-palette-action\"\n" +
    "            href=\"#\"\n" +
    "            ng-class=\"{ 'active' : colorPickerPaletteCtrl.isActive(color) }\"\n" +
    "            ng-click=\"colorPickerPaletteCtrl.setNewColor($event, color)\"\n" +
    "            ng-style=\"{ 'background-color': color }\">\n" +
    "        </a>\n" +
    "    </li>\n" +
    "    <li class=\"colorPicker-palette-item\">\n" +
    "        <a class=\"colorPicker-palette-action colorPicker-palette-action--icon\"\n" +
    "            href=\"#\"\n" +
    "            ng-click=\"colorPickerPaletteCtrl.createNewColor($event)\">\n" +
    "            <span class=\"is-srOnly\" translate>Add color to palette</span>\n" +
    "            <icon glyph=\"ic-add\"></icon>\n" +
    "        </a>\n" +
    "    </li>\n" +
    "</ul>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/js/bigcommerce/color-picker/color-picker.tpl.html",
    "<div class=\"colorPicker-selection\">\n" +
    "    <div class=\"colorPicker-selection-pane\" data-bc-picker tabindex=\"0\"></div>\n" +
    "    <div class=\"colorPicker-selection-indicator\" data-bc-picker-indicator></div>\n" +
    "</div>\n" +
    "<div class=\"colorPicker-slider\">\n" +
    "    <div class=\"colorPicker-slider-pane\" data-bc-slider tabindex=\"0\"></div>\n" +
    "    <div class=\"colorPicker-slider-indicator\" data-bc-slider-indicator></div>\n" +
    "</div>\n" +
    "\n" +
    "<color-picker-palette\n" +
    "    ng-if=\"colorPickerCtrl.palette\"\n" +
    "    colors=\"colorPickerCtrl.palette\"\n" +
    "    set-new-color=\"colorPickerCtrl.setNewColor\"\n" +
    "    create-new-palette-color=\"colorPickerCtrl.createNewPaletteColor\"\n" +
    "    remove-palette-color=\"colorPickerCtrl.removePaletteColor\"\n" +
    "    is-active-color=\"colorPickerCtrl.isActiveColor\"\n" +
    "    selected-color=\"{{ colorPickerCtrl.getSelectedColor() }}\">\n" +
    "</color-picker-palette>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/js/bigcommerce/copy-clipboard/copy-clipboard.tpl.html",
    "<div class=\"form-prefixPostfix\">\n" +
    "    <input\n" +
    "        class=\"form-input\"\n" +
    "        type=\"text\"\n" +
    "        id=\"{{copyClipboardCtrl.uniqueId}}\"\n" +
    "        ng-model=\"copyClipboardCtrl.copyText\"\n" +
    "        ng-readonly=\"copyClipboardCtrl.readonly\"\n" +
    "        tooltip-placement=\"bottom\"\n" +
    "        tooltip=\"{{copyClipboardCtrl.dynamicTooltip}}\"\n" +
    "        tooltip-trigger=\"tooltipTriggerOpen\"\n" +
    "    />\n" +
    "    <button\n" +
    "        class=\"form-prefixPostfix-button--postfix button button--icon\"\n" +
    "        data-clipboard-target=\"{{'#' + copyClipboardCtrl.uniqueId}}\"\n" +
    "        ngclipboard\n" +
    "        ngclipboard-success=\"copyClipboardCtrl.onSuccess()\"\n" +
    "        ngclipboard-error=\"copyClipboardCtrl.onError()\">\n" +
    "            <icon glyph=\"ic-content-paste\" alt=\"Copy to Clipboard\"></icon>\n" +
    "            <span class=\"is-srOnly\" translate>Copy to Clipboard</span>\n" +
    "    </button>\n" +
    "</div>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/js/bigcommerce/credit-card/credit-card.tpl.html",
    "<div class=\"form-ccFields\">\n" +
    "    <form-field class=\"form-field--ccNumber\" property=\"ccNumber\">\n" +
    "        <label class=\"form-label\" for=\"ccNumber\" translate>\n" +
    "            Credit Card Number\n" +
    "        </label>\n" +
    "        <input autocomplete=\"cc-number\"\n" +
    "               cc-eager-type\n" +
    "               cc-format\n" +
    "               cc-number\n" +
    "               class=\"form-input has-icon\"\n" +
    "               id=\"ccNumber\"\n" +
    "               name=\"ccNumber\"\n" +
    "               ng-model=\"ccData.ccNumber\"\n" +
    "               ng-required=\"true\"\n" +
    "               type=\"text\"/>\n" +
    "\n" +
    "        <icon glyph=\"ic-lock\"></icon>\n" +
    "\n" +
    "        <form-field-errors>\n" +
    "            <form-field-error validate=\"ccNumber\">{{ 'Credit Card Number must be valid' | translate }}</form-field-error>\n" +
    "            <form-field-error validate=\"required\">{{ 'Credit Card Number is required' | translate }}</form-field-error>\n" +
    "        </form-field-errors>\n" +
    "    </form-field>\n" +
    "\n" +
    "    <form-field class=\"form-field--ccExpiry\" property=\"ccExpiry\">\n" +
    "        <label class=\"form-label\" for=\"ccExpiry\" translate>\n" +
    "            Expiration\n" +
    "        </label>\n" +
    "        <input autocomplete=\"cc-exp\"\n" +
    "               cc-expiry\n" +
    "               class=\"form-input\"\n" +
    "               id=\"ccExpiry\"\n" +
    "               name=\"ccExpiry\"\n" +
    "               ng-model=\"ccData.ccExpiry\"\n" +
    "               ng-required=\"true\"\n" +
    "               placeholder=\"MM / YY\"\n" +
    "               type=\"text\"/>\n" +
    "\n" +
    "        <form-field-errors>\n" +
    "            <form-field-error validate=\"validFutureDate\">{{ 'Expiration date must be a valid future date in MM / YY format' | translate }}</form-field-error>\n" +
    "            <form-field-error validate=\"required\">{{ 'Expiration Date is required' | translate }}</form-field-error>\n" +
    "        </form-field-errors>\n" +
    "    </form-field>\n" +
    "\n" +
    "    <form-field class=\"form-field--ccName\" ng-if=\"ccConfig.fullName\" property=\"ccName\">\n" +
    "        <label class=\"form-label\" for=\"ccName\" translate>\n" +
    "            Name on Card\n" +
    "        </label>\n" +
    "        <input autocomplete=\"cc-name\"\n" +
    "               class=\"form-input\"\n" +
    "               id=\"ccName\"\n" +
    "               name=\"ccName\"\n" +
    "               maxlength=\"200\"\n" +
    "               ng-model=\"ccData.ccName\"\n" +
    "               ng-required=\"true\"\n" +
    "               type=\"text\"/>\n" +
    "\n" +
    "        <form-field-errors>\n" +
    "            <form-field-error validate=\"required\">{{ 'Full name is required' | translate }}</form-field-error>\n" +
    "        </form-field-errors>\n" +
    "    </form-field>\n" +
    "\n" +
    "    <form-field class=\"form-field--ccCvv\" ng-if=\"ccConfig.cardCode\" property=\"ccCvv\">\n" +
    "        <label class=\"form-label\" for=\"ccCvv\" translate>\n" +
    "            CVV\n" +
    "            <span class=\"has-tip\"\n" +
    "                  popover-append-to-body=\"true\"\n" +
    "                  popover-placement=\"top\"\n" +
    "                  popover-trigger=\"mouseenter\"\n" +
    "                  popover=\"{{ getCvvTooltipHtml() }}\">\n" +
    "                <icon glyph=\"ic-help\"></icon>\n" +
    "            </span>\n" +
    "        </label>\n" +
    "        <input autocomplete=\"cc-csc\"\n" +
    "               bc-cvc\n" +
    "               cc-cvc\n" +
    "               class=\"form-input has-icon\"\n" +
    "               id=\"ccCvv\"\n" +
    "               name=\"ccCvv\"\n" +
    "               ng-model=\"ccData.ccCvv\"\n" +
    "               ng-required=\"ccConfig.cardCodeRequired\"\n" +
    "               type=\"text\"/>\n" +
    "\n" +
    "        <icon glyph=\"ic-lock\"></icon>\n" +
    "\n" +
    "        <form-field-errors>\n" +
    "            <form-field-error validate=\"ccCvc\">{{ 'CVV must be valid' | translate }}</form-field-error>\n" +
    "            <form-field-error validate=\"required\">{{ 'CVV is required' | translate }}</form-field-error>\n" +
    "        </form-field-errors>\n" +
    "    </form-field>\n" +
    "</div>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/js/bigcommerce/credit-card-types/credit-card-types.tpl.html",
    "<ul class=\"creditCardTypes-list\">\n" +
    "    <li class=\"creditCardTypes-list-item\"\n" +
    "        ng-class=\"{\n" +
    "            'is-active'  : creditCardTypesCtrl.hasSelectedType() && creditCardTypesCtrl.isSelectedType(ccType),\n" +
    "            'not-active' : creditCardTypesCtrl.hasSelectedType() && !creditCardTypesCtrl.isSelectedType(ccType)\n" +
    "        }\"\n" +
    "        ng-repeat=\"ccType in creditCardTypesCtrl.getSupportedTypes()\">\n" +
    "        <icon class=\"icon--medium\"\n" +
    "              glyph=\"ic-payment-{{:: creditCardTypesCtrl.mapToSvg(ccType) }}\">\n" +
    "        </icon>\n" +
    "    </li>\n" +
    "</ul>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/js/bigcommerce/form-field-error/form-field-error.tpl.html",
    "<li class=\"form-field-error\">\n" +
    "    <!-- translated, message-enabled label is transclued here -->\n" +
    "</li>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/js/bigcommerce/form-field-errors/form-field-errors.tpl.html",
    "<ul class=\"form-field-errors\"\n" +
    "    ng-messages=\"propertyField.$error\"\n" +
    "    ng-show=\"formCtrl.$submitted && propertyField.$invalid\"\n" +
    "    ng-transclude>\n" +
    "</ul>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/js/bigcommerce/form-input-color/form-input-color.tpl.html",
    "<label class=\"form-label\"\n" +
    "       for=\"{{formInputColorCtrl.uniqueId}}\">\n" +
    "    {{formInputColorCtrl.labelText}}\n" +
    "</label>\n" +
    "\n" +
    "<div class=\"form-prefixPostfix\">\n" +
    "    <input class=\"form-input form-prefixPostfix-input\"\n" +
    "           id=\"{{formInputColorCtrl.uniqueId}}\"\n" +
    "           ng-blur=\"formInputColorCtrl.blurEventHandler($event)\"\n" +
    "           ng-change=\"formInputColorCtrl.onChange()\"\n" +
    "           ng-focus=\"formInputColorCtrl.focusEventHandler($event)\"\n" +
    "           ng-model=\"formInputColorCtrl.color\"\n" +
    "           placeholder=\"{{formInputColorCtrl.placeholderText}}\"\n" +
    "           type=\"text\" />\n" +
    "\n" +
    "    <span class=\"form-prefixPostfix-label form-prefixPostfix-label--postfix\"\n" +
    "          ng-click=\"formInputColorCtrl.showPicker($event)\"\n" +
    "          ng-style=\"{ 'background-color': formInputColorCtrl.lastValidColor }\">\n" +
    "    </span>\n" +
    "</div>\n" +
    "\n" +
    "<color-picker ng-model=\"formInputColorCtrl.color\"\n" +
    "              ng-if=\"formInputColorCtrl.isPickerVisible()\"\n" +
    "              ng-change=\"formInputColorCtrl.onChange()\"\n" +
    "              palette=\"formInputColorCtrl.palette\">\n" +
    "</color-picker>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/js/bigcommerce/loading-notification/loading-notification.tpl.html",
    "<div class=\"loadingNotification\" ng-show=\"requestInProgress\">\n" +
    "    <div class=\"loadingNotification-label\" translate>Loading&hellip;</div>\n" +
    "</div>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/js/bigcommerce/switch/switch.tpl.html",
    "<div\n" +
    "    class=\"switch\"\n" +
    "    ng-class=\"{'switch--important': switchCtrl.isImportant, 'switch--checked': switchCtrl.isChecked, 'switch--disabled': switchCtrl.isDisabled }\">\n" +
    "\n" +
    "    <span\n" +
    "        class=\"switch-description--off\"\n" +
    "        ng-if=\"!!switchCtrl.leftDescription\">{{ switchCtrl.leftDescription }}</span>\n" +
    "\n" +
    "\n" +
    "    <input\n" +
    "        class=\"switch-checkbox\"\n" +
    "        type=\"checkbox\"\n" +
    "        id=\"{{ switchCtrl.uniqueId }}\"\n" +
    "        aria-describedby=\"{{ switchCtrl.ariaDescriptionID }}\"\n" +
    "        ng-change=\"switchCtrl.updateModel()\"\n" +
    "        ng-disabled=\"switchCtrl.isDisabled\"\n" +
    "        ng-model=\"switchCtrl.value\">\n" +
    "\n" +
    "    <label class=\"switch-toggle\" for=\"{{ switchCtrl.uniqueId }}\">\n" +
    "\n" +
    "        <span class=\"switch-label\" ng-if=\"switchCtrl.labelText && !switchCtrl.hasIcon\">{{ switchCtrl.labelText }}</span>\n" +
    "        <icon\n" +
    "            class=\"switch-label switch-label--icon\"\n" +
    "            icon\n" +
    "            glyph=\"ic-check\"\n" +
    "            ng-if=\"switchCtrl.hasIcon\"\n" +
    "            ng-show=\"switchCtrl.isChecked\"></icon>\n" +
    "        <icon\n" +
    "            class=\"switch-label switch-label--icon\"\n" +
    "            icon\n" +
    "            glyph=\"ic-close\"\n" +
    "            ng-if=\"switchCtrl.hasIcon\"\n" +
    "            ng-show=\"!switchCtrl.isChecked\"></icon>\n" +
    "\n" +
    "    </label>\n" +
    "\n" +
    "    <span\n" +
    "        class=\"switch-description--on\"\n" +
    "        ng-if=\"!!switchCtrl.rightDescription\">{{ switchCtrl.rightDescription }}</span>\n" +
    "\n" +
    "    <span\n" +
    "        id=\"{{ switchCtrl.ariaDescriptionID }}\"\n" +
    "        ng-class=\"{'switch-ariaDescription': switchCtrl.ariaDescription }\">\n" +
    "        {{ switchCtrl.ariaDescription || 'Please use aria-description to describe this switch to screen readers' }}\n" +
    "    </span>\n" +
    "</div>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/js/bigcommerce/credit-card/credit-card-cvv/tooltip.tpl.html",
    "<div class=\"form-ccFields-cvvExample\">\n" +
    "    <div class=\"form-ccFields-cvvExampleDescription\">\n" +
    "        <p translate>\n" +
    "            For VISA and Mastercard, the CVV is a three-digit code printed on the back. For American Express it is the four-digit code printed on the front. The CVV is a security measure to ensure that you are in possession of the card.\n" +
    "        </p>\n" +
    "    </div>\n" +
    "    <div class=\"form-ccFields-cvvExampleFigures\">\n" +
    "        <figure>\n" +
    "            <icon class=\"icon icon--large\" glyph=\"ic-payment-cvv-visa\"></icon>\n" +
    "        </figure>\n" +
    "        <figure>\n" +
    "            <icon class=\"icon icon--large\" glyph=\"ic-payment-cvv-amex\"></icon>\n" +
    "        </figure>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("template/accordion/accordion-group.html",
    "<article ng-class=\"{ 'is-open': isOpen }\">\n" +
    "    <h2 class=\"accordion-navigation\"  ng-class=\"{ 'is-open': isOpen }\">\n" +
    "        <a href=\"javascript:void(0)\" class=\"accordion-title\" ng-click=\"isOpen = !isOpen\">\n" +
    "            <span accordion-transclude=\"heading\">\n" +
    "                {{heading}}\n" +
    "            </span>\n" +
    "            <icon class=\"accordion-indicator\" glyph=\"{{ isOpen ? 'ic-remove' : 'ic-add' }}\"></icon>\n" +
    "        </a>\n" +
    "    </h2>\n" +
    "    <div class=\"accordion-content\" ng-class=\"{ 'is-open': isOpen }\" ng-transclude></div>\n" +
    "</article>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("template/accordion/accordion.html",
    "<section class=\"accordion\" ng-transclude></section>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("template/alert/alert.html",
    "<div class=\"alertBox\" ng-class=\"type ? 'alertBox--' + type : ''\">\n" +
    "    <div class=\"alertBox-column alertBox-icon\" ng-switch=\"type\">\n" +
    "        <icon ng-switch-when=\"info\" glyph=\"ic-info\"></icon>\n" +
    "        <icon ng-switch-when=\"success\" glyph=\"ic-check-circle\"></icon>\n" +
    "        <icon ng-switch-when=\"warning\" glyph=\"ic-error\"></icon>\n" +
    "        <icon ng-switch-when=\"error\" glyph=\"ic-error\"></icon>\n" +
    "        <icon ng-switch-default glyph=\"ic-info\"></icon>\n" +
    "    </div>\n" +
    "    <div class=\"alertBox-column alertBox-message\" ng-transclude></div>\n" +
    "    <a ng-show=\"closeable\" class=\"alertBox-column alertBox-close\" ng-click=\"close(); $event.preventDefault();\" tabindex=\"0\" href=\"#\">\n" +
    "        <icon glyph=\"ic-close\"></icon>\n" +
    "    </a>\n" +
    "</div>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("template/modal/backdrop.html",
    "<div class=\"modal-background\" ng-class=\"{'is-active': animate}\" ng-click=\"close($event)\"></div>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("template/modal/window.html",
    "<section class=\"modal fade {{ windowClass }}\"\n" +
    "    ng-class=\"{'is-active': animate}\"\n" +
    "    tabindex=\"-1\"\n" +
    "    ng-transclude\n" +
    "></section>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("template/pagination/pager.html",
    "<ul class=\"pagination-list\">\n" +
    "    <li\n" +
    "        ng-repeat=\"page in pages\"\n" +
    "        class=\"arrow\"\n" +
    "        ng-class=\"{unavailable: page.disabled, left: page.previous, right: page.next}\">\n" +
    "            <a class=\"pagination-link\" ng-click=\"selectPage(page.number)\">\n" +
    "                {{page.text}}\n" +
    "            </a>\n" +
    "    </li>\n" +
    "</ul>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("template/pagination/pagination.html",
    "<ul class=\"pagination-list\">\n" +
    "    <li\n" +
    "        class=\"pagination-item\"\n" +
    "        ng-repeat=\"page in pages\"\n" +
    "        ng-class=\"{'pagination-item--arrow': $first || $last, 'pagination-item--current': page.active, 'pagination-item--unavailable': page.disabled}\"\n" +
    "        ng-hide=\"$first && pages[$index + 1].active || $last && pages[$index - 1].active\"\n" +
    "    >\n" +
    "        <a class=\"pagination-link\" href=\"#\" ng-click=\"selectPage(page.number); $event.preventDefault();\">\n" +
    "            {{page.text}}\n" +
    "        </a>\n" +
    "    </li>\n" +
    "</ul>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("template/popover/popover.html",
    "<div class=\"dropdown-menu dropdown-menu--content\">\n" +
    "    <h4 ng-bind=\"title\" ng-show=\"title\"></h4>\n" +
    "    <p ng-bind-html=\"content | trustAsHtml\"></p>\n" +
    "</div>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("template/progressbar/bar.html",
    "<span class=\"progress-meter\" ng-transclude></span>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("template/progressbar/progress.html",
    "<div class=\"progress\" ng-class=\"type\" ng-transclude></div>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("template/progressbar/progressbar.html",
    "<div class=\"progress\" ng-class=\"['progress--' + type]\">\n" +
    "  <span class=\"progress-meter\" ng-transclude></span>\n" +
    "</div>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("template/rating/rating.html",
    "<span ng-mouseleave=\"reset()\">\n" +
    "  <i ng-repeat=\"r in range\" ng-mouseenter=\"enter($index + 1)\" ng-click=\"rate($index + 1)\" class=\"fa\"\n" +
    "    ng-class=\"$index < val && (r.stateOn || 'fa-star') || (r.stateOff || 'fa-star-o')\"></i>\n" +
    "</span>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("template/tabs/tab.html",
    "<li ng-class=\"{'is-active': active}\" class=\"tab\" role=\"presentation\">\n" +
    "    <a ng-click=\"select()\"\n" +
    "        href=\"javascript:void(0)\"\n" +
    "        role=\"tab\"\n" +
    "        aria-selected=\"{{active ? true : false}}\"\n" +
    "        class=\"tab-title\"\n" +
    "        tab-heading-transclude>{{heading}}</a>\n" +
    "</li>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("template/tabs/tabset.html",
    "<tabbed-content>\n" +
    "    <ul class=\"tabs\" ng-class=\"{'tabs--vertical': vertical}\" role=\"tablist\" ng-transclude></ul>\n" +
    "    <div class=\"tabs-contents\" ng-class=\"{'tabs-contents--vertical': vertical}\">\n" +
    "        <div class=\"tab-content\"\n" +
    "            ng-repeat=\"tab in tabs\"\n" +
    "            ng-class=\"{'is-active': tab.active}\"\n" +
    "            role=\"tabpanel\"\n" +
    "            aria-hidden=\"{{tab.active ? false : true}}\"\n" +
    "            tab-content-transclude=\"tab\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</tabbed-content>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("template/tooltip/tooltip-html-unsafe-popup.html",
    "<span class=\"tooltip tip-{{placement}}\"\n" +
    "  ng-class=\"{ in: isOpen(), fade: animation() }\"\n" +
    "  style=\"width: auto\">\n" +
    "  <span bind-html-unsafe=\"content\"></span>\n" +
    "  <span class=\"nub\"></span>\n" +
    "</span>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("template/tooltip/tooltip-popup.html",
    "<span class=\"tooltip tip-{{placement}}\"\n" +
    "  ng-class=\"{ in: isOpen(), fade: animation() }\"\n" +
    "  style=\"width: auto\">\n" +
    "  <span ng-bind=\"content\"></span>\n" +
    "  <span class=\"nub\"></span>\n" +
    "</span>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("template/topbar/has-dropdown.html",
    "<li class=\"has-dropdown\" ng-transclude></li>");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("template/topbar/toggle-top-bar.html",
    "<li class=\"toggle-topbar menu-icon\" ng-transclude></li>");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("template/topbar/top-bar-dropdown.html",
    "<ul class=\"dropdown\" ng-transclude></ul>");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("template/topbar/top-bar-section.html",
    "<section class=\"top-bar-section\" ng-transclude></section>");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("template/topbar/top-bar.html",
    "<nav class=\"top-bar\" ng-transclude></nav>");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("template/tour/tour.html",
    "<div class=\"joyride-tip-guide\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
    "  <span class=\"joyride-nub\" ng-class=\"{\n" +
    "    bottom: placement === 'top',\n" +
    "    left: placement === 'right',\n" +
    "    right: placement === 'left',\n" +
    "    top: placement === 'bottom'\n" +
    "  }\"></span>\n" +
    "  <div class=\"joyride-content-wrapper\">\n" +
    "    <h4 ng-bind=\"title\" ng-show=\"title\"></h4>\n" +
    "    <p ng-bind=\"content\"></p>\n" +
    "    <a class=\"small button joyride-next-tip\" ng-show=\"!isLastStep()\" ng-click=\"nextStep()\">Next</a>\n" +
    "    <a class=\"small button joyride-next-tip\" ng-show=\"isLastStep()\" ng-click=\"endTour()\">End</a>\n" +
    "    <a class=\"joyride-close-tip\" ng-click=\"endTour()\">&times;</a>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("template/typeahead/typeahead-match.html",
    "<a tabindex=\"-1\" bind-html-unsafe=\"match.label | typeaheadHighlight:query\"></a>");
}]);
})();

(function(module) {
try { module = angular.module("bcapp-pattern-lab-templates"); }
catch(err) { module = angular.module("bcapp-pattern-lab-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("template/typeahead/typeahead-popup.html",
    "<ul class=\"f-dropdown\" ng-style=\"{display: isOpen()&&'block' || 'none', top: position.top+'px', left: position.left+'px'}\">\n" +
    "    <li ng-repeat=\"match in matches\" ng-class=\"{active: isActive($index) }\" ng-mouseenter=\"selectActive($index)\" ng-click=\"selectMatch($index)\">\n" +
    "        <div typeahead-match index=\"$index\" match=\"match\" query=\"query\" template-url=\"templateUrl\"></div>\n" +
    "    </li>\n" +
    "</ul>\n" +
    "");
}]);
})();
