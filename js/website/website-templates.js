(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/icons/icons.tpl.html",
    "<form action=\"#\" class=\"form labPanel-content\">\n" +
    "    <fieldset class=\"form-fieldset\">\n" +
    "        <div class=\"form-field\">\n" +
    "            <label for=\"icons\" class=\"form-label\">Filter:</label>\n" +
    "            <input\n" +
    "                type=\"text\"\n" +
    "                class=\"form-input\"\n" +
    "                id=\"icons\"\n" +
    "                placeholder=\"Filter the list below by icon name\"\n" +
    "                ng-model=\"iconName\">\n" +
    "        </div>\n" +
    "    </fieldset>\n" +
    "</form>\n" +
    "\n" +
    "<ul class=\"iconExample test\">\n" +
    "    <li class=\"iconExample-item\" ng-repeat=\"icon in icons | filter:iconName\">\n" +
    "        <img class=\"iconExample-glyph\" src=\"/svg/icons/{{ icon.src }}\">\n" +
    "        {{ icon.name }}\n" +
    "    </li>\n" +
    "</ul>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/alerts/alerts.tpl.html",
    "<div class=\"container\">\n" +
    "    <section class=\"panel labPanel\">\n" +
    "        <h1>Alerts</h1>\n" +
    "        <div class=\"labPanel-content\">\n" +
    "            <alert ng-repeat=\"alert in alerts\" type=\"alert.type\" close=\"closeAlert($index)\" links=\"alert.links\">{{ alert.msg }}</alert>\n" +
    "            <button class=\"button\" ng-click=\"addAlert()\">Add Alert</button>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"labPanel-content\">\n" +
    "            <h3>More complex example uses</h3>\n" +
    "            <alert type=\"'warning'\">\n" +
    "                For the best experience, please do not add new business policies or change these policies directly from your eBay account.\n" +
    "            </alert>\n" +
    "            <alert type=\"'success'\" close=\"closeAlert($index)\">\n" +
    "                <h2 class=\"alertBox-heading\">Cool! You've received an order where your customer paid by PayPal!</h2>\n" +
    "                To claim your funds, follow the instructions in the email Paypal has just sent you.\n" +
    "            </alert>\n" +
    "\n" +
    "            <alert type=\"'warning'\" close=\"closeAlert($index)\">\n" +
    "                <h2 class=\"alertBox-heading\">You have used 80B (80%) of your 100B monthly storage allowance</h2>\n" +
    "                You can avoid charges and get extra features by <a href=\"#\">upgrading your plan</a>.\n" +
    "            </alert>\n" +
    "\n" +
    "            <alert type=\"'error'\" close=\"closeAlert($index)\">\n" +
    "                <h2 class=\"alertBox-heading\">Hey, the BigCommerce account owner has an unpaid invoice.</h2>\n" +
    "                <ul>\n" +
    "                    <li>The invoice is overdue</li>\n" +
    "                    <li>They should pay the invoice</li>\n" +
    "                    <li>More invoices may follow if the invoice is left unpaid</li>\n" +
    "                </ul>\n" +
    "                To avoid account suspension or termination, please pay your invoice or call <strong>1-808-699-0911 (US)</strong>.\n" +
    "            </alert>\n" +
    "\n" +
    "            <alert type=\"'info'\" close=\"closeAlert($index)\">\n" +
    "                Analytics just got a whole lot smarter. <button class=\"button button--primary button--small\">Learn More</button>\n" +
    "            </alert>\n" +
    "\n" +
    "            <alert close=\"closeAlert($index)\">\n" +
    "                You're cool\n" +
    "            </alert>\n" +
    "        </div>\n" +
    "    </section>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/banners/banners.tpl.html",
    "<section class=\"container\">\n" +
    "    <div class=\"panel labPanel\">\n" +
    "        <h1>Banner Component Demo</h1>\n" +
    "\n" +
    "        <div class=\"banner\">\n" +
    "            <div class=\"banner-figure\">\n" +
    "                <img src=\"https://placehold.it/250x120\" alt=\"\" width=\"250\" height=\"120\" />\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"banner-column banner-body\">\n" +
    "                <h4 class=\"banner-title\">Banner Title</h4>\n" +
    "                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut lore et dolore.</p>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"banner-column banner-actions\">\n" +
    "                <a href=\"#\" class=\"button button--marketing\">Learn More</a>\n" +
    "                <p><button data-role=\"data-gsc-dismiss-XXX\" class=\"button-dismiss\">Dismiss</button></p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        <div class=\"banner\" data-notice=\"bc_inproduct_shipstation_02092017\">\n" +
    "            <div class=\"banner-figure\">\n" +
    "                <img src=\"https://s3.amazonaws.com/getsmartcontent-cdn/67H3XDDT/1486661168.ShipStation_InProduct_2447_FINAL_250X115_ST.png\" alt=\"\" width=\"291\" height=\"140\">\n" +
    "            </div>\n" +
    "            <div class=\"banner-column banner-body\">\n" +
    "                <h4 class=\"banner-title\">Get a free ShipStation account with USPS label printing</h4>\n" +
    "                <p class=\"banner-description\">Set-up ShipStation for free and receive a free USPS postage account with the best rates thanks to Commercial Plus Pricing </p>\n" +
    "            </div>\n" +
    "            <div class=\"banner-column banner-actions\">\n" +
    "                <a class=\"gsc-track gsc-tracking-code-MTIxMS4xMDM2MS44NDMwMS4xNTU2NTE=  button button--marketing\" href=\"/manage/marketplace/apps/96\" target=\"_blank\" data-gsc=\"MTIxMS4xMDM2MS44NDMwMS4xNTU2NTE=\">Install</a>\n" +
    "                <p><button data-role=\"data-gsc-dismiss\" class=\"banner-dismiss\">Dismiss</button></p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        <div class=\"banner\" data-notice=\"bc_inproduct_amazonpay100_02062017\">\n" +
    "            <div class=\"banner-figure\">\n" +
    "                <img src=\"https://s3.amazonaws.com/getsmartcontent-cdn/67H3XDDT/1486406219.Amazon-Pay-Offer-in-product-banner_2560_asset_BS.jpg\" alt=\"\" width=\"291\" height=\"140\" />\n" +
    "            </div>\n" +
    "            <div class=\"banner-column banner-body\">\n" +
    "                <h4 class=\"banner-title\">Add Amazon Pay and get a $100 Amazon.com Gift Card</h4>\n" +
    "                <p class=\"banner-description\">Amazon Pay helps boost conversion by streamlining checkout. Add it by March 15 to receive your gift card.</p>\n" +
    "            </div>\n" +
    "            <div class=\"banner-column banner-actions\">\n" +
    "                <a class=\"gsc-track button button--marketing\" href=\" https://pages.payments.amazon.com/BigCommerce-Launch-Offer_BigCommerce-Amazon-Pay-Launch-Offer.html\" target=\"_blank\">Learn more</a>\n" +
    "                <p><button data-role=\"data-gsc-dismiss\" class=\"banner-dismiss\">Dismiss</button></p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"banner\" data-notice=\"bc_inproduct_signifyd_02032017a\">\n" +
    "    <div class=\"banner-figure\">\n" +
    "        <img src=\"https://s3.amazonaws.com/getsmartcontent-cdn/67H3XDDT/1486141169.unnamed-11.png\" alt=\"\" width=\"291\" height=\"140\" />\n" +
    "    </div>\n" +
    "    <div class=\"banner-column banner-body\">\n" +
    "        <h4 class=\"banner-title\">Get 5% off fraud protection from Signifyd\n" +
    "</h4>\n" +
    "        <p class=\"banner-description\">Prevent chargebacks with guaranteed fraud protection from Signifyd, plus get 5% off your first year of coverage.\n" +
    "\n" +
    " </p>\n" +
    "    </div>\n" +
    "    <div class=\"banner-column banner-actions\">\n" +
    "        <a class=\"gsc-track button button--marketing\" href=\"http://grow.bigcommerce.com/Signifyd-Offer-Page.html\" target=\"_blank\">Contact me</a>\n" +
    "        <p><button data-role=\"data-gsc-dismiss\" class=\"banner-dismiss\">Dismiss</button></p>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"banner\" data-notice=\"bc_promos_TEST\">\n" +
    "\n" +
    "    <div class=\"banner-column banner-body\">\n" +
    "        <h4 class=\"banner-title\">Improved tiered discount rules\n" +
    "\n" +
    "</h4>\n" +
    "        <p class=\"banner-description\">We’ve simplified tiered discounting by consolidating our bulk/tier rules into one Order rule (based on order value) and one Category rule (based on item quantity).\n" +
    "\n" +
    "</p>\n" +
    "    </div>\n" +
    "    <div class=\"banner-column banner-actions\">\n" +
    "        <a class=\"gsc-track button button--marketing\" href=\"https://support.bigcommerce.com/articles/Public/Possible-Discounts-Offer\" target=\"_blank\">Learn more</a>\n" +
    "        <p><button data-role=\"data-gsc-dismiss\" class=\"banner-dismiss\">Dismiss</button></p>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"banner\" data-notice=\"bc_square_au_inproduct_01102016\">\n" +
    "    <div class=\"banner-figure\">\n" +
    "        <img src=\"https://s3.amazonaws.com/getsmartcontent-cdn/67H3XDDT/1484080328.Square-Inproduct_2482_250x115_ST.png\" alt=\"\" width=\"291\" height=\"140\" />\n" +
    "    </div>\n" +
    "    <div class=\"banner-column banner-body\">\n" +
    "        <h4 class=\"banner-title\">Square is now available in Australia\n" +
    "\n" +
    "</h4>\n" +
    "        <p class=\"banner-description\">Sync your online and in-store inventory to grow sales while eliminating manual updates, data entry errors and overselling\n" +
    "\n" +
    ". </p>\n" +
    "    </div>\n" +
    "    <div class=\"banner-column banner-actions\">\n" +
    "        <a class=\"gsc-track button button--marketing\" href=\"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\" target=\"_blank\">Get Started</a>\n" +
    "        <p><button data-role=\"data-gsc-dismiss\" class=\"banner-dismiss\">Dismiss</button></p>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"banner\" data-notice=\"bc_message_townhall_inproduct_01092016\">\n" +
    "    <div class=\"banner-figure\">\n" +
    "        <img src=\"https://s3.amazonaws.com/getsmartcontent-cdn/67H3XDDT/1476296312.townhall-inapp-banners.png\" alt=\"\" width=\"291\" height=\"140\" />\n" +
    "    </div>\n" +
    "    <div class=\"banner-column banner-body\">\n" +
    "        <h4 class=\"banner-title\">Thursday January 26, 2017, 2 - 3 PM CT\n" +
    "</h4>\n" +
    "        <p class=\"banner-description\">Learn about recent platform enhancements and updates by BigCommerce CEO Brent Bellm and the BigCommerce Product Team\n" +
    "\n" +
    ". </p>\n" +
    "    </div>\n" +
    "    <div class=\"banner-column banner-actions\">\n" +
    "        <a class=\"gsc-track button button--marketing\" href=\"https://attendee.gotowebinar.com/register/1298607174635775490\" target=\"_blank\">Register now</a>\n" +
    "        <p><button data-role=\"data-gsc-dismiss\" class=\"banner-dismiss\">Dismiss</button></p>\n" +
    "    </div>\n" +
    "</div><div class=\"banner\" data-notice=\"bc_inproduct_stencil_uppate_01052017\">\n" +
    "    <div class=\"banner-figure\">\n" +
    "        <img src=\"https://s3.amazonaws.com/getsmartcontent-cdn/67H3XDDT/1483655897.Theme-marketplace-in-product-banner_2339_image-asset_BS.jpg\" alt=\"\" width=\"291\" height=\"140\" />\n" +
    "    </div>\n" +
    "    <div class=\"banner-column banner-body\">\n" +
    "        <h4 class=\"banner-title\">Grow sales by upgrading your theme\n" +
    "</h4>\n" +
    "        <p class=\"banner-description\">Our new themes can increase your sales and enhance your brand with new responsive layouts, the latest conversion features and more\n" +
    ". </p>\n" +
    "    </div>\n" +
    "    <div class=\"banner-column banner-actions\">\n" +
    "        <a class=\"gsc-track button button--marketing\" href=\"manage/marketplace/themes\" target=\"_blank\">Browse themes</a>\n" +
    "        <p><button data-role=\"data-gsc-dismiss\" class=\"banner-dismiss\">Dismiss</button></p>\n" +
    "    </div>\n" +
    "</div><div class=\"banner\" data-notice=\"bc_inproduct_stencil_upgradeto_01052017\">\n" +
    "    <div class=\"banner-figure\">\n" +
    "        <img src=\"https://s3.amazonaws.com/getsmartcontent-cdn/67H3XDDT/1483655897.Theme-marketplace-in-product-banner_2339_image-asset_BS.jpg\" alt=\"\" width=\"291\" height=\"140\" />\n" +
    "    </div>\n" +
    "    <div class=\"banner-column banner-body\">\n" +
    "        <h4 class=\"banner-title\">Boost sales with a responsive premium theme\n" +
    "</h4>\n" +
    "        <p class=\"banner-description\">Increase your sales and enhance your brand with new layout options, easy customization and more\n" +
    ". </p>\n" +
    "    </div>\n" +
    "    <div class=\"banner-column banner-actions\">\n" +
    "        <a class=\"gsc-track button button--marketing\" href=\"manage/marketplace/themes\" target=\"_blank\">Browse themes</a>\n" +
    "        <p><button data-role=\"data-gsc-dismiss\" class=\"banner-dismiss\">Dismiss</button></p>\n" +
    "    </div>\n" +
    "</div><div class=\"banner\" data-notice=\"bc_message_square_auth_inproductUSv2_113016\">\n" +
    "    <div class=\"banner-figure\">\n" +
    "        <img src=\"https://s3.amazonaws.com/getsmartcontent-cdn/67H3XDDT/1480526545.Square-Authnet-in-product-banner_2439_asset_BS.jpg\" alt=\"\" width=\"250\" height=\"120\" />\n" +
    "    </div>\n" +
    "    <div class=\"banner-column banner-body\">\n" +
    "        <h4 class=\"banner-title\">Free processing and special rates from Square\n" +
    "\n" +
    "\n" +
    "\n" +
    "</h4>\n" +
    "        <p class=\"banner-description\">For a limited time, get special payment rates and free processing on $5,000 in sales from BigCommerce and Square\n" +
    "\n" +
    "\n" +
    "  </p>\n" +
    "    </div>\n" +
    "    <div class=\"banner-column banner-actions\">\n" +
    "        <a class=\"gsc-track button button--marketing\" href=\"http://about.bigcommerce.com/Y0U0j0sT000000023JJ0PT7\" target=\"_Parent\">Call 1-800-218-7872</a>\n" +
    "        <p><button data-role=\"data-gsc-dismiss\" class=\"banner-dismiss\">Dismiss</button></p>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"banner\" data-notice=\"bc_ebay_Inproducttest_11162016\">\n" +
    "    <div class=\"banner-figure\">\n" +
    "        <img src=\"https://s3.amazonaws.com/getsmartcontent-cdn/67H3XDDT/1479756631.eBay-in-product-banner-asset_2341_BS.jpg\" alt=\"\" width=\"250\" height=\"120\" />\n" +
    "    </div>\n" +
    "    <div class=\"banner-column banner-body\">\n" +
    "        <h4 class=\"banner-title\">Reach 165 million eBay shoppers\n" +
    "\n" +
    "</h4>\n" +
    "        <p class=\"banner-description\">Effortlessly increase sales with our new eBay integration. Special savings on a Premium Store Subscription for new eBay sellers!\n" +
    "  </p>\n" +
    "    </div>\n" +
    "    <div class=\"banner-column banner-actions\">\n" +
    "        <a class=\"gsc-track button button--marketing\" href=\"manage/channels/ebay/about\" target=\"_parent\">Activate</a>\n" +
    "        <p><button data-role=\"data-gsc-dismiss\" class=\"banner-dismiss\">Dismiss</button></p>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"banner\" data-notice=\"bc_message_PayPalEC_inproduct_110916\">\n" +
    "    <div class=\"banner-figure\">\n" +
    "        <img src=\"https://s3.amazonaws.com/getsmartcontent-cdn/67H3XDDT/1478731164.Express-checkout-in-product-banner_2376_image-asset_BS.jpg\" alt=\"\" width=\"250\" height=\"120\" />\n" +
    "    </div>\n" +
    "    <div class=\"banner-column banner-body\">\n" +
    "        <h4 class=\"banner-title\">Boost holiday online sales by offering more ways to pay\n" +
    "</h4>\n" +
    "        <p class=\"banner-description\">Add PayPal Express Checkout to help increase conversion  </p>\n" +
    "    </div>\n" +
    "    <div class=\"banner-column banner-actions\">\n" +
    "        <a class=\"gsc-track button button--marketing\" href=\"/manage/settings/payment/paypalexpress\" target=\"_Parent\">Activate</a>\n" +
    "        <p><button data-role=\"data-gsc-dismiss\" class=\"banner-dismiss\">Dismiss</button></p>\n" +
    "    </div>\n" +
    "</div><div class=\"banner\" data-notice=\"bc_message_applepaynoimage_inproduct_110116\">\n" +
    "    <div class=\"banner-column banner-body\">\n" +
    "        <h4 class=\"banner-title\">BigCommerce introduces Apple Pay for Web integration</h4>\n" +
    "        <p class=\"banner-description\">A simple, secure way to reduce cart abandonment and streamline checkout. </p>\n" +
    "    </div>\n" +
    "    <div class=\"banner-column banner-actions\">\n" +
    "        <a class=\"gsc-track button button--marketing\" href=\"../manage/settings/payment/applepay\" target=\"_blank\">Activate Apple Pay</a>\n" +
    "        <p><button data-role=\"data-gsc-dismiss\" class=\"banner-dismiss\">Dismiss</button></p>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "</section>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/accordion/accordion-example.tpl.html",
    "<accordion close-others=\"oneAtATime\">\n" +
    "    <accordion-group heading=\"Static Header, initially expanded\" is-open=\"true\">\n" +
    "        This content is straight in the template.\n" +
    "    </accordion-group>\n" +
    "    <accordion-group heading=\"{{group.title}}\" ng-repeat=\"group in groups\">\n" +
    "        {{group.content}}\n" +
    "    </accordion-group>\n" +
    "    <accordion-group heading=\"Single accordion panel, start open\" is-open=\"true\">\n" +
    "        This content is straight in the template.\n" +
    "    </accordion-group>\n" +
    "    <accordion-group heading=\"Dynamic Body Content\">\n" +
    "        <p>The body of the accordion group grows to fit the contents</p>\n" +
    "        <button class=\"button small\" ng-click=\"addItem()\">Add Item</button>\n" +
    "        <div ng-repeat=\"item in items\">{{item}}</div>\n" +
    "    </accordion-group>\n" +
    "    <accordion-group is-open=\"isopen\">\n" +
    "        <accordion-heading>\n" +
    "            I can have markup, too! <small>I'm small</small>\n" +
    "        </accordion-heading>\n" +
    "        This is just some content to illustrate fancy headings.\n" +
    "    </accordion-group>\n" +
    "</accordion>\n" +
    "\n" +
    "\n" +
    "<accordion>\n" +
    "    <accordion-group heading=\"Single accordion panel, start closed\">\n" +
    "        This content is straight in the template.\n" +
    "    </accordion-group>\n" +
    "</accordion>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/accordion/accordion-minor-example.tpl.html",
    "<accordion class=\"accordion--minor\" close-others=\"oneAtATime\">\n" +
    "    <accordion-group heading=\"Accordion Minor Example\" is-open=\"true\">\n" +
    "        Content for a minor accordion is spaced tighter than normal accordions\n" +
    "    </accordion-group>\n" +
    "    <accordion-group heading=\"Another minor section\">\n" +
    "        <p>The body of the accordion group grows to fit the contents</p>\n" +
    "        <button class=\"button small\" ng-click=\"addItem()\">Add Item</button>\n" +
    "        <div ng-repeat=\"item in items\">{{item}}</div>\n" +
    "    </accordion-group>\n" +
    "</accordion>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/accordion/accordion.tpl.html",
    "<section class=\"container\">\n" +
    "    <div class=\"panel labPanel\">\n" +
    "        <h1>Accordion Demo</h1>\n" +
    "\n" +
    "        <div class=\"panel-body\">\n" +
    "            <p>\n" +
    "                <label class=\"checkbox\">\n" +
    "                    <input type=\"checkbox\" ng-model=\"oneAtATime\">\n" +
    "                    Open only one at a time\n" +
    "                </label>\n" +
    "            </p>\n" +
    "\n" +
    "            <div ng-include=\"'src/website/js/examples/accordion/accordion-example.tpl.html'\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</section>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/bc-datepicker/bc-datepicker.tpl.html",
    "<div class=\"container\">\n" +
    "    <section class=\"panel labPanel\">\n" +
    "        <h1>Datepicker</h1>\n" +
    "        <div class=\"panel-body\">\n" +
    "\n" +
    "            <p>\n" +
    "                Datepickers are added with an attribute directive to a input element.\n" +
    "                It can also be displayed in line if the directive is in a non-input element.\n" +
    "            </p>\n" +
    "\n" +
    "            <div class=\"labPanel-row\">\n" +
    "                <div class=\"labPanel-column\">\n" +
    "                    <div class=\"labBlock\">\n" +
    "                        <div class=\"labBlock-preview\">\n" +
    "                            <form action=\"#\" class=\"form\">\n" +
    "                                <fieldset class=\"form-fieldset\">\n" +
    "                                    <div class=\"form-field\">\n" +
    "                                        <label class=\"form-label\" for=\"datepicker\">Select a Date</label>\n" +
    "                                        <input class=\"form-input has-action\" id=\"datepicker\" type=\"text\" bc-datepicker ng-model=\"date\" options=\"bcDatepickerCtrl.options\"/>\n" +
    "                                        <button class=\"button button--icon button--inputAction\">\n" +
    "                                            <span class=\"u-hiddenVisually\">Select a Date</span>\n" +
    "                                            <icon glyph=\"ic-event\"></icon>\n" +
    "                                        </button>\n" +
    "                                    </div>\n" +
    "                                </fieldset>\n" +
    "                            </form>\n" +
    "                            <h5>Selected date: <span class=\"selected-date\">{{date}}</span></h5>\n" +
    "                        </div>\n" +
    "                        <pre class=\"labBlock-example u-bgGreysLightest\">input type=\"text\" bc-datepicker ng-model=\"date\"</pre>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"labPanel-column\">\n" +
    "                    <div class=\"labBlock\">\n" +
    "                        <div class=\"labBlock-preview\">\n" +
    "                            <div bc-datepicker ng-model=\"date2\"></div>\n" +
    "                        </div>\n" +
    "                        <pre class=\"labBlock-example u-bgGreysLightest\">div bc-datepicker ng-model=\"date2\"</pre>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </section>\n" +
    "</div>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/bc-dropdown/bc-dropdown.tpl.html",
    "\n" +
    "<section class=\"container\">\n" +
    "    <div class=\"panel labPanel\">\n" +
    "        <h1>Dropdown Menu Demo</h1>\n" +
    "        <div class=\"panel-body\">\n" +
    "\n" +
    "        <ul class=\"inlineList\">\n" +
    "\n" +
    "            <li>\n" +
    "                <span>Default</span>\n" +
    "                <div id=\"dropdown-standard\" bc-dropdown>\n" +
    "                    <button type=\"button\" class=\"button dropdown-button\" bc-dropdown-toggle>Click</button>\n" +
    "                    <ul bc-dropdown-menu>\n" +
    "                        <li class=\"dropdown-menu-item\"><a href=\"#\" ng-click=\"$event.preventDefault()\">One</a></li>\n" +
    "                        <li class=\"dropdown-menu-item\"><a href=\"#\" ng-click=\"$event.preventDefault()\">Two</a></li>\n" +
    "                        <li class=\"dropdown-menu-item\"><a href=\"#\" ng-click=\"$event.preventDefault()\">Three</a></li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "\n" +
    "            <li>\n" +
    "                <span>Primary</span>\n" +
    "                <div bc-dropdown>\n" +
    "                    <button type=\"button\" class=\"button button--primary dropdown-button\" bc-dropdown-toggle>Click</button>\n" +
    "                    <ul bc-dropdown-menu>\n" +
    "                        <li class=\"dropdown-menu-item\"><a href=\"#\" ng-click=\"$event.preventDefault()\">One</a></li>\n" +
    "                        <li class=\"dropdown-menu-item\"><a href=\"#\" ng-click=\"$event.preventDefault()\">Two</a></li>\n" +
    "                        <li class=\"dropdown-menu-item\"><a href=\"#\" ng-click=\"$event.preventDefault()\">Three</a></li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "\n" +
    "            <li>\n" +
    "                <span>Icons</span>\n" +
    "                <div id=\"dropdown-image\" bc-dropdown>\n" +
    "                    <a style=\"display: inline-block\" href=\"#\" bc-dropdown-toggle>\n" +
    "                        <icon glyph=\"ic-settings\"></icon>\n" +
    "                    </a>\n" +
    "                    <ul bc-dropdown-menu>\n" +
    "                        <li class=\"dropdown-menu-item\"><a href=\"#\" ng-click=\"$event.preventDefault()\">One</a></li>\n" +
    "                        <li class=\"dropdown-menu-item\"><a href=\"#\" ng-click=\"$event.preventDefault()\">Two</a></li>\n" +
    "                        <li class=\"dropdown-menu-item\"><a href=\"#\" ng-click=\"$event.preventDefault()\">Three</a></li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "\n" +
    "            <li>\n" +
    "                <span>Link</span>\n" +
    "                <div bc-dropdown>\n" +
    "                    <a bc-dropdown-toggle class=\"dropdown-button\">Click here for a dropdown</a>\n" +
    "                    <ul bc-dropdown-menu>\n" +
    "                        <li class=\"dropdown-menu-item\"><a href=\"#\" ng-click=\"$event.preventDefault()\">One</a></li>\n" +
    "                        <li class=\"dropdown-menu-item\"><a href=\"#\" ng-click=\"$event.preventDefault()\">Two</a></li>\n" +
    "                        <li class=\"dropdown-menu-item\"><a href=\"#\" ng-click=\"$event.preventDefault()\">Three</a></li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "        </div>\n" +
    "\n" +
    "</section>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/bc-pagination/bc-pagination.tpl.html",
    "<section class=\"container\">\n" +
    "    <div class=\"panel labPanel\">\n" +
    "        <h1>Pagination Demo</h1>\n" +
    "        <div class=\"panel-body\">\n" +
    "            <div class=\"labPanel-content\">\n" +
    "                <bc-pagination\n" +
    "                    total-items=\"totalItems\"\n" +
    "                    page=\"currentPage\"\n" +
    "                    items-per-page=\"itemsPerPage\"\n" +
    "                    on-change=\"onSelectPage\"\n" +
    "                    rotate=\"false\"\n" +
    "                    boundary-links=\"true\"\n" +
    "                    max-size=\"maxSize\"\n" +
    "                    show-limits=\"false\"\n" +
    "                    class=\"pagination\">\n" +
    "                </bc-pagination>\n" +
    "            </div>\n" +
    "            <div class=\"labPanel-content\">\n" +
    "                <div class=\"form-field\">\n" +
    "                    <label for=\"total\" class=\"form-label\">Total Items</label>\n" +
    "                    <input type=\"text\" class=\"form-input\" id=\"total\" ng-model=\"totalItems\">\n" +
    "                </div>\n" +
    "                <div class=\"form-field\">\n" +
    "                    <label for=\"items\" class=\"form-label\">Items per page</label>\n" +
    "                    <input type=\"text\" class=\"form-input\" id=\"items\" ng-model=\"itemsPerPage\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</section>\n" +
    "\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/bc-server-table/bc-server-table.tpl.html",
    "<div class=\"container\">\n" +
    "    <section class=\"panel labPanel\" id=\"standard\">\n" +
    "        <h1>Data Table</h1>\n" +
    "\n" +
    "        <h2>Standard Data Table</h2>\n" +
    "\n" +
    "        <table class=\"table\">\n" +
    "            <thead class=\"table-thead\">\n" +
    "                <th><input ng-click=\"bcServerTableDemoCtrl.bcServerTable.selectAllRows()\" ng-checked=\"bcServerTableDemoCtrl.bcServerTable.allSelected\" type=\"checkbox\"/></th>\n" +
    "                <th><bc-sort-by table-id=\"{{ bcServerTableDemoCtrl.bcServerTable.id }}\" id=\"sortByName\" sort-value=\"name\" column-name=\"Name\"></bc-sort-by></th>\n" +
    "                <th><bc-sort-by table-id=\"{{ bcServerTableDemoCtrl.bcServerTable.id }}\" id=\"sortByStar\" sort-value=\"star\" column-name=\"Star\"></bc-sort-by></th>\n" +
    "                <th><bc-sort-by table-id=\"{{ bcServerTableDemoCtrl.bcServerTable.id }}\" id=\"sortByLocation\" sort-value=\"sf-location\" column-name=\"SF Location\"></bc-sort-by></th>\n" +
    "            </thead>\n" +
    "            <tbody class=\"table-tbody\">\n" +
    "                <tr id=\"row-{{ $index }}\" class=\"tableRow\" ng-repeat=\"row in bcServerTableDemoCtrl.bcServerTable.rows\">\n" +
    "                    <td><input ng-model=\"bcServerTableDemoCtrl.bcServerTable.selectedRows[row[bcServerTableDemoCtrl.bcServerTable.tableConfig.rowIdKey]]\" type=\"checkbox\"/></td>\n" +
    "                    <td>{{row.name}}</td>\n" +
    "                    <td>{{row.star}}</td>\n" +
    "                    <td>{{row['sf-location']}}</td>\n" +
    "                </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </section>\n" +
    "\n" +
    "    <section class=\"panel labPanel\" id=\"emptyTreatment\">\n" +
    "        <h2>Empty Data Table</h2>\n" +
    "\n" +
    "        <table class=\"table\">\n" +
    "            <tbody class=\"table-tbody\">\n" +
    "                <tr class=\"tableRow\">\n" +
    "                    <td class=\"tableCol emptyTable\">\n" +
    "                        <img class=\"emptyTable-image\" src=\"images/empty_table_illustration.png\">\n" +
    "                        <strong class=\"emptyTable-title\">No Store Performance available yet.</strong>\n" +
    "                        <p class=\"emptyTable-description\">Once you begin to receive visitors and orders, information about your store performance will be displayed in this section.</p>\n" +
    "                        <a href=\"http://cp-pattern-lab.bigcommerce.net\" target=\"_blank\" class=\"emptyTable-action\">Learn More</a>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </section>\n" +
    "</div>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/buttons/buttons.tpl.html",
    "<h3>Buttons</h3>\n" +
    "<div>\n" +
    "    <h4>Single toggle</h4>\n" +
    "    <pre>{{singleModel}}</pre>\n" +
    "    <button type=\"button\" class=\"button\" ng-model=\"singleModel\" btn-checkbox btn-checkbox-true=\"1\" btn-checkbox-false=\"0\">\n" +
    "        Single Toggle\n" +
    "    </button>\n" +
    "    <h4>Checkbox</h4>\n" +
    "    <pre>{{checkModel}}</pre>\n" +
    "    <div class=\"buttonGroup\">\n" +
    "        <button class=\"button\" ng-model=\"checkModel.left\" btn-checkbox>Left</button>\n" +
    "        <button class=\"button\" ng-model=\"checkModel.middle\" btn-checkbox>Middle</button>\n" +
    "        <button class=\"button\" ng-model=\"checkModel.right\" btn-checkbox>Right</button>\n" +
    "    </div>\n" +
    "    <h4>Radio</h4>\n" +
    "    <pre>{{radioModel}}</pre>\n" +
    "    <div class=\"buttonGroup\">\n" +
    "        <button class=\"button\" ng-model=\"radioModel\" btn-radio=\"'Left'\">Left</button>\n" +
    "        <button class=\"button\" ng-model=\"radioModel\" btn-radio=\"'Middle'\">Middle</button>\n" +
    "        <button class=\"button\" ng-model=\"radioModel\" btn-radio=\"'Right'\">Right</button>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/cards/cards.tpl.html",
    "\n" +
    "<section class=\"container\">\n" +
    "    <div class=\"panel labPanel\">\n" +
    "        <h1>Card Component Demo</h1>\n" +
    "        <div class=\"panel-body\">\n" +
    "        <div class=\"labPanel-row\">\n" +
    "            <div class=\"labPanel-column\">\n" +
    "                <article class=\"card\">\n" +
    "                    <figure class=\"card-figure\">\n" +
    "                        <a href=\"#\">\n" +
    "                            <img class=\"card-image\" src=\"http://unsplash.it/601/361/\" alt=\"Example card image\">\n" +
    "                        </a>\n" +
    "                    </figure>\n" +
    "                    <div class=\"card-body\">\n" +
    "                        <h2 class=\"card-title\"><a href=\"#\">Card Title</a></h2>\n" +
    "                        <p class=\"card-text\">This card image has an anchor tag for a title</p>\n" +
    "                    </div>\n" +
    "                </article>\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"labPanel-column\">\n" +
    "\n" +
    "                <article class=\"card\">\n" +
    "                    <figure class=\"card-figure\">\n" +
    "                        <img class=\"card-image\" src=\"http://unsplash.it/601/361/?random\" alt=\"Example card image\">\n" +
    "                        <figcaption class=\"card-figcaption\">\n" +
    "                            <div class=\"card-figcaption-body\">\n" +
    "                                <a href=\"#\" class=\"button card-figcaption-button\">Learn more</a>\n" +
    "                            </div>\n" +
    "                        </figcaption>\n" +
    "                    </figure>\n" +
    "                    <div class=\"card-body\">\n" +
    "                        <h2 class=\"card-title\">Card title</h2>\n" +
    "                        <p class=\"card-text\">This card shows an action on hover</p>\n" +
    "                    </div>\n" +
    "                </article>\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"labPanel-column\">\n" +
    "\n" +
    "                    <article class=\"card\">\n" +
    "                        <figure class=\"card-figure\">\n" +
    "                            <img class=\"card-image\" src=\"http://unsplash.it/g/599/359\" alt=\"Example card image\">\n" +
    "                            <figcaption class=\"card-figcaption\">\n" +
    "                                <a class=\"card-figcaption-action\" href=\"#\">\n" +
    "                                    <div class=\"card-figcaption-body\">\n" +
    "                                        <p class=\"card-text\">This entire figure is clickable</p>\n" +
    "                                    </div>\n" +
    "                                </a>\n" +
    "                            </figcaption>\n" +
    "                        </figure>\n" +
    "                        <div class=\"card-body\">\n" +
    "                            <h2 class=\"card-title\">Card title</h2>\n" +
    "                            <p class=\"card-text\">This card has a clickable figure overlay</p>\n" +
    "                        </div>\n" +
    "                    </article>\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"labPanel-column\">\n" +
    "\n" +
    "                <article class=\"card\">\n" +
    "                    <figure class=\"card-figure\">\n" +
    "                        <img class=\"card-image\" src=\"http://unsplash.it/g/602/362\" alt=\"Example card image\">\n" +
    "                    </figure>\n" +
    "                    <div class=\"card-body\">\n" +
    "                        <h2 class=\"card-title\">Card title</h2>\n" +
    "                        <h3 class=\"card-subTitle\">Card Subtitle</h3>\n" +
    "                        <p class=\"card-text\">\n" +
    "                            This card shows both a subtitle, and a card footer.\n" +
    "                        </p>\n" +
    "                    </div>\n" +
    "                    <footer class=\"card-footer\">\n" +
    "                        <a href=\"#\" class=\"card-button button button--primary\">Learn More</a>\n" +
    "                    </footer>\n" +
    "                </article>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</section>");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/color-picker/color-picker.tpl.html",
    "<div class=\"container\">\n" +
    "    <section class=\"panel labPanel\">\n" +
    "        <h1>Color Picker</h1>\n" +
    "        <div class=\"panel-body\">\n" +
    "            <div class=\"labPanel-content\">\n" +
    "                <form-input-color\n" +
    "                    label-text=\"inputLabelText\"\n" +
    "                    ng-model=\"inputModelValue\"\n" +
    "                    palette=\"inputPalette\"\n" +
    "                    placeholder-text=\"inputPlaceholderText\"\n" +
    "                >\n" +
    "                </form-input-color>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </section>\n" +
    "</div>");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/copy-clipboard/copy-clipboard.tpl.html",
    "<section class=\"container\">\n" +
    "    <div class=\"panel labPanel\">\n" +
    "        <h1>Copy to Clipboard Demo</h1>\n" +
    "        <div class=\"panel-body\">\n" +
    "            <div class=\"labPanel-row\">\n" +
    "                <div class=\"labPanel-column\">\n" +
    "                    <copy-clipboard\n" +
    "                        copy-text=\"Editable input with text to be copied\">\n" +
    "                    </copy-clipboard>\n" +
    "                </div>\n" +
    "                <div class=\"labPanel-column\">\n" +
    "                    <copy-clipboard\n" +
    "                        copy-text=\"Readonly input with text to be copied\"\n" +
    "                        readonly=\"true\">\n" +
    "                    </copy-clipboard>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</section>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/global-message/global-message.tpl.html",
    "<section class=\"container\">\n" +
    "    <div class=\"panel labPanel\">\n" +
    "        <h1>Global Message Demo</h1>\n" +
    "\n" +
    "        <section class=\"panel-body\">\n" +
    "            <global-message ng-if=\"globalMessageCtrl.showDemoA\">{{globalMessageCtrl.message}}</global-message>\n" +
    "            Demo of the global message with no actions\n" +
    "            <button class=\"button--primary\" ng-click=\"globalMessageCtrl.showDemoA = !globalMessageCtrl.showDemoA\">Toggle</button>\n" +
    "        </section>\n" +
    "\n" +
    "        <section class=\"panel-body\">\n" +
    "            <global-message ng-if=\"globalMessageCtrl.showDemoB\" action=\"{{globalMessageCtrl.action}}\" action-callback=\"globalMessageCtrl.actionCallback()\">{{globalMessageCtrl.message}}</global-message>\n" +
    "            Demo of the global message with one action\n" +
    "            <button class=\"button--primary\" ng-click=\"globalMessageCtrl.showDemoB = !globalMessageCtrl.showDemoB\">Toggle</button>\n" +
    "        </section>\n" +
    "\n" +
    "        <section class=\"panel-body\">\n" +
    "            <global-message ng-if=\"globalMessageCtrl.showDemoC\" dismiss-callback=\"globalMessageCtrl.dismissCallback()\">{{globalMessageCtrl.message}}</global-message>\n" +
    "            Demo of the global message with one \"dismiss\" action\n" +
    "            <button class=\"button--primary\" ng-click=\"globalMessageCtrl.showDemoC = !globalMessageCtrl.showDemoC\">Toggle</button>\n" +
    "        </section>\n" +
    "\n" +
    "        <section class=\"panel-body\">\n" +
    "            <global-message ng-if=\"globalMessageCtrl.showDemoD\" action=\"{{globalMessageCtrl.action}}\" action-callback=\"globalMessageCtrl.actionCallback()\" dismiss-callback=\"globalMessageCtrl.dismissCallback()\">{{globalMessageCtrl.message}}</global-message>\n" +
    "            Demo of the global message with two actions\n" +
    "            <button class=\"button--primary\" ng-click=\"globalMessageCtrl.showDemoD = !globalMessageCtrl.showDemoD\">Toggle</button>\n" +
    "        </section>\n" +
    "    </div>\n" +
    "</section>");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/credit-card/credit-card-example.tpl.html",
    "<form>\n" +
    "    <fieldset class=\"form-fieldset\">\n" +
    "        <legend class=\"form-legend\">Payment details</legend>\n" +
    "        <div class=\"form-body\">\n" +
    "\n" +
    "            <!-- optional separate component: credit-card-types -->\n" +
    "            <credit-card-types\n" +
    "                    selected-type=\"creditCardCtrl.ccData.ccType\"\n" +
    "                    supported-types=\"creditCardCtrl.ccConfig.supportedTypes\">\n" +
    "            </credit-card-types>\n" +
    "\n" +
    "            <!-- Credit Card component can live anywhere in a form -->\n" +
    "            <credit-card\n" +
    "                eager-type=\"true\"\n" +
    "                cc-data=\"creditCardCtrl.ccData\"\n" +
    "                cc-config=\"creditCardCtrl.ccConfig\">\n" +
    "            </credit-card>\n" +
    "            <!-- Credit Card -->\n" +
    "\n" +
    "            <div class=\"form-actions\">\n" +
    "                <a href=\"#\">Cancel</a>\n" +
    "                <button class=\"button button--primary\" type=\"submit\">Submit</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </fieldset>\n" +
    "</form>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/credit-card/credit-card.tpl.html",
    "<div class=\"container\">\n" +
    "<section class=\"panel labPanel\">\n" +
    "    <h1>Credit Card Payment Pattern</h1>\n" +
    "    <div class=\"panel-body\" id=\"labExampleCreditCard\">\n" +
    "\n" +
    "        <form>\n" +
    "    <fieldset class=\"form-fieldset\">\n" +
    "        <legend class=\"form-legend\">Payment details</legend>\n" +
    "        <div class=\"form-body\">\n" +
    "\n" +
    "            <!-- optional separate component: credit-card-types -->\n" +
    "            <credit-card-types\n" +
    "                    selected-type=\"creditCardCtrl.ccData.ccType\"\n" +
    "                    supported-types=\"creditCardCtrl.ccConfig.supportedTypes\">\n" +
    "            </credit-card-types>\n" +
    "\n" +
    "            <!-- Credit Card component can live anywhere in a form -->\n" +
    "            <credit-card\n" +
    "                eager-type=\"true\"\n" +
    "                cc-data=\"creditCardCtrl.ccData\"\n" +
    "                cc-config=\"creditCardCtrl.ccConfig\">\n" +
    "            </credit-card>\n" +
    "            <!-- Credit Card -->\n" +
    "\n" +
    "            <div class=\"form-actions\">\n" +
    "                <a href=\"#\">Cancel</a>\n" +
    "                <button class=\"button button--primary\" type=\"submit\">Submit</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </fieldset>\n" +
    "</form>\n" +
    "\n" +
    "        <hr>\n" +
    "    <div class=\"labPanel-content\">\n" +
    "        <textarea ui-codemirror=\"{\n" +
    "        'lineNumbers': true,\n" +
    "        'theme':'default',\n" +
    "        'readOnly': 'true',\n" +
    "        'lineWrapping' : false,\n" +
    "        'mode': 'text/html',\n" +
    "        autoClearEmptyLines: true\n" +
    "        }\">\n" +
    "<form>\n" +
    "    <fieldset class=\"form-fieldset\">\n" +
    "        <legend class=\"form-legend\">Payment details</legend>\n" +
    "        <div class=\"form-body\">\n" +
    "\n" +
    "            <!-- optional separate component: credit-card-types -->\n" +
    "            <credit-card-types\n" +
    "                    selected-type=\"creditCardCtrl.ccData.ccType\"\n" +
    "                    supported-types=\"creditCardCtrl.ccConfig.supportedTypes\">\n" +
    "            </credit-card-types>\n" +
    "\n" +
    "            <!-- Credit Card component can live anywhere in a form -->\n" +
    "            <credit-card\n" +
    "                eager-type=\"true\"\n" +
    "                cc-data=\"creditCardCtrl.ccData\"\n" +
    "                cc-config=\"creditCardCtrl.ccConfig\">\n" +
    "            </credit-card>\n" +
    "            <!-- Credit Card -->\n" +
    "\n" +
    "            <div class=\"form-actions\">\n" +
    "                <a href=\"#\">Cancel</a>\n" +
    "                <button class=\"button button--primary\" type=\"submit\">Submit</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </fieldset>\n" +
    "</form></textarea>\n" +
    "\n" +
    "        <br>\n" +
    "\n" +
    "        <textarea ui-codemirror=\"{\n" +
    "        'lineNumbers': true,\n" +
    "        'theme':'default',\n" +
    "        'readOnly': 'true',\n" +
    "        'lineWrapping' : false,\n" +
    "        'mode': 'text/html',\n" +
    "        autoClearEmptyLines: true\n" +
    "        }\">\n" +
    "ctrl.ccData = {\n" +
    "    ccNumber: '',\n" +
    "    ccCvv: '',\n" +
    "    ccName: '',\n" +
    "    ccExpiry: {\n" +
    "        month: '',\n" +
    "        year: ''\n" +
    "    },\n" +
    "    ccType: '',\n" +
    "};\n" +
    "\n" +
    "ctrl.ccConfig = {\n" +
    "    cardCode: true,\n" +
    "    fullName: true,\n" +
    "};</textarea>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"labPanel-content\">\n" +
    "        <h5>Notes:</h5>\n" +
    "        <p>\n" +
    "            The credit card component relies on <a href=\"https://github.com/bendrucker/angular-credit-cards\" target=\"_blank\">angular-credit-cards</a>\n" +
    "            for <code>ccNumber</code> and <code>ccCvc</code>. The <code>ccExpiry</code> directive is a custom directive that formats/validates\n" +
    "            the expiration date in a MM / YY format. Also, the credit card type is not explicitly entered but deduced from the credit card number.\n" +
    "        </p>\n" +
    "        <ul>\n" +
    "            <li><code>ccData</code>: an object containing the credit card data bound to the directive</li>\n" +
    "            <li><code>ccConfig</code>: an object with the configuration for the credit-card directive\n" +
    "                <ul>\n" +
    "                    <li><code>cardCode</code>: boolean value indicating whether cvv is shown (default true)</li>\n" +
    "                    <li><code>cardCodeRequired</code>: boolean value indicating whether the card code field is required. This only matters if <code>cardCode</code> is true. (default true)</li>\n" +
    "                    <li><code>fullName</code>: boolean value indicating whether the full name field is required/shown (default true)</li>\n" +
    "                </ul>\n" +
    "            </li>\n" +
    "            <li><code>eagerType</code>: an optional boolean value indicating whether eager type detection\n" +
    "                (infer and expose the credit card type before the full number is entered) is enabled. (default true)\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "\n" +
    "        <p>\n" +
    "            The credit-card-types display in the example exists as a separate component, but will most likely be used alongside the credit-card component.\n" +
    "            The component displays the list of supported card types. Once a card type has been selected (or detected by the credit-card component), all\n" +
    "            the credit card types other than the selected one becomes greyed-out.\n" +
    "        </p>\n" +
    "        <ul>\n" +
    "            <li><code>selectedType</code>: string value indicating the card type: 'American Express', 'Diners Club', 'Discover', 'MasterCard', 'Visa'. Note that these values\n" +
    "                are the same as the ones that are detected by the credit-card directive.\n" +
    "            </li>\n" +
    "            <li><code>supportedTypes</code>: an array of a selection of supported credit card types. This has the same strings representing the card types:\n" +
    "                'American Express', 'Diners Club', 'Discover', 'MasterCard', 'Visa'.\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "\n" +
    "        <div class=\"form-field\">\n" +
    "            <label class=\"form-label\">Form Display Options</label>\n" +
    "            <input class=\"form-checkbox\" type=\"checkbox\" id=\"creditCardForm_cvv\" ng-model=\"creditCardCtrl.ccConfig.cardCode\">\n" +
    "            <label for=\"creditCardForm_cvv\" class=\"form-label\">Show CVV field</label>\n" +
    "            <input class=\"form-checkbox\" type=\"checkbox\" id=\"creditCardForm_fullName\" ng-model=\"creditCardCtrl.ccConfig.fullName\">\n" +
    "            <label for=\"creditCardForm_fullName\" class=\"form-label\">Show Name field</label>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    </div>\n" +
    "\n" +
    "</section>\n" +
    "</div>");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/loading-indicators/loading-indicators.tpl.html",
    "<div class=\"container\">\n" +
    "<section class=\"panel labPanel\">\n" +
    "    <h1>Loading Notification</h1>\n" +
    "\n" +
    "    <div class=\"panel-body\">\n" +
    "        <button class=\"loading-request button\" ng-click=\"loadingIndicatorsCtrl.fakeHttpRequest()\">Simulate minor update</button>\n" +
    "        <loading-notification></loading-notification>\n" +
    "\n" +
    "        <div class=\"labPanel-content\">\n" +
    "\n" +
    "<textarea ui-codemirror=\"{\n" +
    "    'lineNumbers': true,\n" +
    "    'theme':'default',\n" +
    "    'readOnly': 'true',\n" +
    "    'lineWrapping' : false,\n" +
    "    'mode': 'text/html',\n" +
    "    autoClearEmptyLines: true\n" +
    "}\">\n" +
    "\n" +
    "<loading-notification></loading-notification>\n" +
    "</textarea>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"labPanel-content\">\n" +
    "            <h5>Notes:</h5>\n" +
    "            <p>\n" +
    "                The loading notification should be used anywhere an interaction may\n" +
    "                cause a small delay, but doesn't stop the user interacting with the page.\n" +
    "            </p>\n" +
    "            <p>\n" +
    "                This will automatically listen for <code>ajaxRequestRunning</code> from\n" +
    "                <code>ng-common</code> when placed on the page. Placement should be near the top.\n" +
    "            </p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "</section>\n" +
    "\n" +
    "\n" +
    "<section class=\"panel labPanel\">\n" +
    "    <h3>Loading Overlay</h3>\n" +
    "\n" +
    "    <div class=\"panel-body\">\n" +
    "        <form class=\"form\" id=\"loadingOverlay-example1\">\n" +
    "            <fieldset class=\"form-fieldset\">\n" +
    "\n" +
    "                <legend class=\"form-legend\">\n" +
    "                    <a class=\"e2e-toggleLoading button\" ng-click=\"loadingIndicatorsCtrl.toggleManualLoading()\">Toggle a loading state on this form</a>\n" +
    "                </legend>\n" +
    "\n" +
    "                <div class=\"form-body\" loading-overlay=\"loadingIndicatorsCtrl.manualLoading\">\n" +
    "\n" +
    "                    <div class=\"form-field\">\n" +
    "                        <label class=\"form-label\" for=\"input12\">Input Label</label>\n" +
    "                        <input class=\"form-input\" id=\"input12\" type=\"text\" placeholder=\"Placeholder text\">\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-field\">\n" +
    "                        <label class=\"form-label\" for=\"input4\">Prefixed Label <small>(Inc. tax)</small></label>\n" +
    "                        <div class=\"form-prefixPostfix\">\n" +
    "                            <span class=\"form-prefixPostfix-label form-prefixPostfix-label--prefix\" id=\"prefixDesc1\">AUD $</span>\n" +
    "                            <input class=\"form-input form-prefixPostfix-input\" id=\"input4\" type=\"text\" placeholder=\"Placeholder text\" aria-describedby=\"prefixDesc1\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-field\">\n" +
    "                        <label class=\"form-label\" for=\"input7\">Postfixed Button</label>\n" +
    "                        <div class=\"form-prefixPostfix\">\n" +
    "                            <input class=\"form-input\" id=\"input7\" type=\"text\" placeholder=\"Placeholder text\">\n" +
    "                            <input class=\"button form-prefixPostfix-button--postfix\" type=\"submit\" value=\"Save\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "\n" +
    "            </fieldset>\n" +
    "        </form>\n" +
    "\n" +
    "\n" +
    "\n" +
    "        <form class=\"form\" id=\"loadingOverlay-example2\">\n" +
    "            <fieldset class=\"form-fieldset\">\n" +
    "\n" +
    "                <legend class=\"form-legend\">\n" +
    "                    <a class=\"e2e-triggerStateChange button\" ng-click=\"loadingIndicatorsCtrl.fakeStateTransition()\">Initiate a fake state transition on this form</a>\n" +
    "                </legend>\n" +
    "\n" +
    "                <div class=\"form-body\" loading-overlay use-ui-router=\"true\">\n" +
    "\n" +
    "                    <div class=\"form-field\">\n" +
    "                        <label class=\"form-label\" for=\"input12\">Input Label</label>\n" +
    "                        <input class=\"form-input\" id=\"input12\" type=\"text\" placeholder=\"Placeholder text\">\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-field\">\n" +
    "                        <label class=\"form-label\" for=\"input4\">Prefixed Label <small>(Inc. tax)</small></label>\n" +
    "                        <div class=\"form-prefixPostfix\">\n" +
    "                            <span class=\"form-prefixPostfix-label form-prefixPostfix-label--prefix\" id=\"prefixDesc1\">AUD $</span>\n" +
    "                            <input class=\"form-input form-prefixPostfix-input\" id=\"input4\" type=\"text\" placeholder=\"Placeholder text\" aria-describedby=\"prefixDesc1\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-field\">\n" +
    "                        <label class=\"form-label\" for=\"input7\">Postfixed Button</label>\n" +
    "                        <div class=\"form-prefixPostfix\">\n" +
    "                            <input class=\"form-input\" id=\"input7\" type=\"text\" placeholder=\"Placeholder text\">\n" +
    "                            <input class=\"button form-prefixPostfix-button--postfix\" type=\"submit\" value=\"Save\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "\n" +
    "            </fieldset>\n" +
    "        </form>\n" +
    "\n" +
    "        <div class=\"labPanel-content\">\n" +
    "\n" +
    "<textarea ui-codemirror=\"{\n" +
    "'lineNumbers': true,\n" +
    "'theme':'default',\n" +
    "'readOnly': 'true',\n" +
    "'lineWrapping' : false,\n" +
    "'mode': 'text/html',\n" +
    "autoClearEmptyLines: true\n" +
    "}\"><div class=\"your-container\" loading-overlay=\"loadingIndicatorsCtrl.manualLoading\">\n" +
    "&hellip;\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"form-body\" loading-overlay use-ui-router=\"true\">\n" +
    "&hellip;\n" +
    "</div></textarea>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"labPanel-content\">\n" +
    "            <h5>Notes:</h5>\n" +
    "            <p>\n" +
    "                The <code>loading-overlay</code> <em>should</em> be able to be placed on any\n" +
    "                container, modal or panel.\n" +
    "            </p>\n" +
    "            <p>\n" +
    "                It is used to indicate a section change, page load, or full panel refresh,\n" +
    "                where the user will not be able to interact with the page during that change.\n" +
    "            </p>\n" +
    "            <p>\n" +
    "                You can manually set the loading state by passing the directive a boolean.\n" +
    "                Or you set it to <code>use-ui-router</code>, where it will listen for\n" +
    "                <code>$stateChangeStart</code>, <code>$stateChangeSuccess</code> and <code>$stateChangeError</code>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</section>\n" +
    "</div>");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/modal/modal-fixed.tpl.html",
    "<div class=\"modal-header\">\n" +
    "    <h2 class=\"modal-header-title\">A Fixed Height Modal</h2>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <p>\n" +
    "        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore\n" +
    "    </p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <a class=\"modal-footer-link\" ng-click=\"modalContentCtrl.cancel($event)\" href=\"#\">Cancel</a>\n" +
    "    <a class=\"button button--small button--primary modal-footer-button\" ng-click=\"modalContentCtrl.ok($event)\" href=\"#\">OK</a>\n" +
    "</div>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/modal/modal-formatted.tpl.html",
    "<div class=\"modal-header\">\n" +
    "    <h2 class=\"modal-header-title\">A Modal Title</h2>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <h4>Some Modal Content</h4>\n" +
    "    <p>\n" +
    "        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore\n" +
    "        necessitatibus consequuntur quo totam quos, odio impedit. Nostrum pariatur,\n" +
    "        culpa blanditiis. Nostrum ipsam maiores sed dolores adipisci qui itaque,\n" +
    "        commodi accusantium.\n" +
    "    </p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <a class=\"modal-footer-link\" ng-click=\"modalContentCtrl.cancel($event)\" href=\"#\">\n" +
    "        Cancel modal\n" +
    "    </a>\n" +
    "    <a class=\"button button--small button--primary\" ng-click=\"modalContentCtrl.ok($event)\" href=\"#\">\n" +
    "        Primary modal action\n" +
    "    </a>\n" +
    "</div>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/modal/modal-unformatted.tpl.html",
    "<div>\n" +
    "    <p>\n" +
    "        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore necessitatibus consequuntur quo totam quos, odio impedit. Nostrum pariatur, culpa blanditiis. Nostrum ipsam maiores sed dolores adipisci qui itaque, commodi accusantium.\n" +
    "    </p>\n" +
    "</div>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/modal/modal.tpl.html",
    "<section class=\"container\">\n" +
    "    <div class=\"panel labPanel\">\n" +
    "        <h1>Modal Component Demo</h1>\n" +
    "\n" +
    "        <div class=\"panel-body\">\n" +
    "            <div class=\"labPanel-content\">\n" +
    "                <a\n" +
    "                    class=\"button\"\n" +
    "                    id=\"openModal--formatted\"\n" +
    "                    ng-click=\"modalCtrl.openFormattedModal($event)\"\n" +
    "                    href=\"#\">\n" +
    "                    Default modal\n" +
    "                </a>\n" +
    "                <a\n" +
    "                    class=\"button\"\n" +
    "                    id=\"openModal--formatted\"\n" +
    "                    ng-click=\"modalCtrl.openFixedModal($event)\"\n" +
    "                    href=\"#\">\n" +
    "                    Fixed modal\n" +
    "                </a>\n" +
    "                <a\n" +
    "                    class=\"button\"\n" +
    "                    id=\"openModal--formatted\"\n" +
    "                    ng-click=\"modalCtrl.openPrompt($event)\"\n" +
    "                    href=\"#\">\n" +
    "                    Prompt\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</section>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/modal/prompt.tpl.html",
    "<div class=\"prompt-body\">\n" +
    "    <p>\n" +
    "        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore\n" +
    "    </p>\n" +
    "</div>\n" +
    "<div class=\"prompt-footer\">\n" +
    "    <a class=\"prompt-footer-link\" ng-click=\"modalContentCtrl.cancel($event)\" href=\"#\">Cancel</a>\n" +
    "    <a class=\"button button--small button--primary prompt-footer-button\" ng-click=\"modalContentCtrl.ok($event)\" href=\"#\">OK</a>\n" +
    "</div>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/panels/panels.tpl.html",
    "<section class=\"container\">\n" +
    "    <div class=\"panel labPanel\">\n" +
    "        <h1>Panels Component Demo</h1>\n" +
    "\n" +
    "        <div class=\"panel\">\n" +
    "            <div class=\"panel-header\">\n" +
    "                <h2 class=\"panel-title\">Panel Title</h2>\n" +
    "            </div>\n" +
    "            <div class=\"panel-body\">\n" +
    "                <h2>Some Panel Content</h2>\n" +
    "                <p>Should be able to handle any type of content.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</section>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/prompt/prompt-modal.tpl.html",
    "<div class=\"modal-body\">\n" +
    "    <p>\n" +
    "        Are you sure you want to resend the invoice for order 12345678 to cindymayweather@gmail.com?\n" +
    "    </p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <a class=\"modal-footer-link\" ng-click=\"modalContentCtrl.cancel($event)\" href=\"#\">cancel</a>\n" +
    "    <a class=\"button button--small button--primary modal-footer-button\" ng-click=\"promptContentCtrl.ok($event)\" href=\"#\">Resend</a>\n" +
    "</div>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/prompt/prompt.tpl.html",
    "<section class=\"container\">\n" +
    "    <div class=\"panel labPanel\">\n" +
    "        <h1>Modal Component Demo</h1>\n" +
    "\n" +
    "        <div class=\"panel-body\">\n" +
    "            <a\n" +
    "                class=\"button\"\n" +
    "                id=\"openPrompt\"\n" +
    "                ng-click=\"promptCtrl.openPrompt($event)\"\n" +
    "                href=\"#\">\n" +
    "                Open Prompt\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</section>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/tables/tables.tpl.html",
    "<section class=\"container\">\n" +
    "    <div class=\"panel labPanel\">\n" +
    "        <h1>Table Component Demo</h1>\n" +
    "\n" +
    "        <table class=\"table\">\n" +
    "            <thead class=\"table-thead\">\n" +
    "                <tr>\n" +
    "                    <th>Table Header</th>\n" +
    "                    <th>Table Header</th>\n" +
    "                    <th>Table Header</th>\n" +
    "                    <th scope=\"column\" class=\"table-header--numericData\">Totals</th>\n" +
    "                </tr>\n" +
    "            </thead>\n" +
    "            <tbody class=\"table-tbody\">\n" +
    "                <tr>\n" +
    "                    <td>Content Goes Here</td>\n" +
    "                    <td>This is longer content Donec id elit non mi porta gravida at eget metus.</td>\n" +
    "                    <td><a href=\"#\">Links in tables</a></td>\n" +
    "                    <td class=\"table-cell--numericData\">$10</td>\n" +
    "                </tr>\n" +
    "                <tr>\n" +
    "                    <td>Content Goes Here</td>\n" +
    "                    <td>This is longer Content Goes Here Donec id elit non mi porta gravida at eget metus.</td>\n" +
    "                    <td><a href=\"#\">Links in tables</a></td>\n" +
    "                    <td class=\"table-cell--numericData\">$20</td>\n" +
    "                </tr>\n" +
    "                <tr>\n" +
    "                    <td>Content Goes Here</td>\n" +
    "                    <td>This is longer Content Goes Here Donec id elit non mi porta gravida at eget metus.</td>\n" +
    "                    <td><a href=\"#\">Links in tables</a></td>\n" +
    "                    <td class=\"table-cell--numericData\">$30</td>\n" +
    "                </tr>\n" +
    "            </tbody>\n" +
    "            <tfoot class=\"table-tfoot\">\n" +
    "                <tr>\n" +
    "                    <td class=\"table-cell--numericData\" colspan=\"3\">Subtotal:</td>\n" +
    "                    <td class=\"table-cell--numericData\">$60</td>\n" +
    "                </tr>\n" +
    "            </tfoot>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</section>");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/tabs/tabs.tpl.html",
    "<section class=\"container\">\n" +
    "    <div class=\"panel labPanel\">\n" +
    "    <h1>Tabs Demo</h1>\n" +
    "\n" +
    "    <div class=\"panel-body\">\n" +
    "        <tabset>\n" +
    "            <tab heading=\"Static title\">Static content</tab>\n" +
    "            <tab ng-repeat=\"tab in tabsCtrl.tabs\" heading=\"{{tab.title}}\" active=\"tab.active\">\n" +
    "                {{tab.content}}\n" +
    "            </tab>\n" +
    "            <tab select=\"tabsCtrl.tabClicked()\" heading=\"Log!\">\n" +
    "                <tab-heading>Log!</tab-heading>\n" +
    "                I've got an HTML heading, and a select callback. Pretty cool!\n" +
    "            </tab>\n" +
    "        </tabset>\n" +
    "    </div>\n" +
    "\n" +
    "    <h2>Button Group Tabs</h2>\n" +
    "\n" +
    "    <tabset buttons=\"true\">\n" +
    "        <tab>\n" +
    "            <tab-heading>One</tab-heading>\n" +
    "            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quis aliquet tortor. Ut quis aliquam lacus, at ultrices risus. Donec ornare ex neque, vitae consequat nunc laoreet vel. Pellentesque id dolor id velit maximus scelerisque sed eu diam. Integer et ligula tincidunt, lobortis ligula ut, malesuada lectus. Donec pellentesque ultrices velit, at pulvinar orci interdum at. Phasellus ornare id nulla non laoreet. Maecenas ante eros, porttitor sit amet lacus vel, pretium accumsan justo. Duis dapibus, tortor vel pulvinar consequat, nunc lectus interdum ex, eget condimentum dolor nisi nec magna. Nunc pharetra eget tellus vel tincidunt. Donec efficitur tortor non quam dignissim dictum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut sit amet ex id nisi accumsan placerat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed ut sodales dolor.\n" +
    "        </tab>\n" +
    "        <tab>\n" +
    "            <tab-heading>Two</tab-heading>\n" +
    "            Pellentesque ac volutpat leo, ut viverra risus. Phasellus maximus arcu non ipsum vestibulum, et bibendum orci vehicula. Praesent vestibulum purus odio, et malesuada tellus placerat et. Sed sem diam, fringilla quis diam vel, fringilla blandit erat. Integer ultrices tortor tellus, a iaculis augue imperdiet ac. Fusce eleifend augue rhoncus enim malesuada aliquet. Vestibulum tortor eros, convallis sit amet tempus eget, tincidunt sodales risus. Ut eget orci aliquet, efficitur dui vitae, egestas purus. Mauris scelerisque ante lacus, imperdiet hendrerit ex congue sit amet. Mauris non justo neque.\n" +
    "        </tab>\n" +
    "        <tab>\n" +
    "            <tab-heading>Three</tab-heading>\n" +
    "            Curabitur at velit cursus, bibendum purus sit amet, volutpat magna. Nulla mauris dui, blandit eu risus vel, molestie viverra ex. Nullam in dapibus lectus. Curabitur vitae suscipit nibh. Suspendisse pretium at lacus vel mollis. Sed eu interdum lacus. Etiam quis dapibus lacus. Sed eu sapien a nisi condimentum placerat. Sed vestibulum, leo sed malesuada efficitur, diam massa condimentum nulla, vulputate lobortis nisl velit vitae nisi.\n" +
    "        </tab>\n" +
    "    </tabset>\n" +
    "\n" +
    "\n" +
    "</section>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/warning-button/warning-button.tpl.html",
    "<section class=\"container\">\n" +
    "    <div class=\"panel labPanel\">\n" +
    "        <h1>Warning Button Demo</h1>\n" +
    "        <div class=\"panel-body\">\n" +
    "            <a\n" +
    "                class=\"button button--warning\"\n" +
    "                id=\"openModal--formatted\"\n" +
    "                ng-click=\"modalCtrl.openPrompt($event)\"\n" +
    "                href=\"#\">\n" +
    "                View Demo\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</section>\n" +
    "");
}]);
})();

(function(module) {
try { module = angular.module("website-templates"); }
catch(err) { module = angular.module("website-templates", []); }
module.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/website/js/examples/tooltip/tooltip.tpl.html",
    "<div class=\"container\">\n" +
    "<section class=\"panel labPanel\">\n" +
    "    <h1>Tooltips</h1>\n" +
    "\n" +
    "    <p>\n" +
    "        Tooltips can be placed on any elements via custom attributes. The content\n" +
    "        and positioning of the tooltip are also set via these attributes.\n" +
    "    </p>\n" +
    "\n" +
    "    <div class=\"panel-body\">\n" +
    "\n" +
    "\n" +
    "        <div class=\"labPanel-row\">\n" +
    "\n" +
    "            <div class=\"labPanel-column\">\n" +
    "                <div class=\"labBlock\">\n" +
    "                    <div class=\"labBlock-preview\">\n" +
    "                        <a href=\"#\" class=\"has-tip\" tooltip-append-to-body=\"true\" tooltip-placement=\"left\" tooltip=\"On the Left!\">Tooltip left</a>\n" +
    "                    </div>\n" +
    "                    <pre class=\"labBlock-example u-bgGreysLightest\">tooltip-placement=\"left\" tooltip=\"On the Left!\"</pre>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"labPanel-column\">\n" +
    "                <div class=\"labBlock\">\n" +
    "                    <div class=\"labBlock-preview\">\n" +
    "                        <a href=\"#\" class=\"has-tip\" tooltip-append-to-body=\"true\" tooltip-placement=\"right\" tooltip=\"On the Right!\">Tooltip right</a>\n" +
    "                    </div>\n" +
    "                    <pre class=\"labBlock-example u-bgGreysLightest\">tooltip-placement=\"right\" tooltip=\"On the Right!\"</pre>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"labPanel-column\">\n" +
    "                <div class=\"labBlock\">\n" +
    "                    <div class=\"labBlock-preview\">\n" +
    "                        <a href=\"#\" class=\"has-tip\" tooltip-append-to-body=\"true\" tooltip-placement=\"bottom\" tooltip=\"On the Bottom!\">Tooltip bottom</a>\n" +
    "                    </div>\n" +
    "                    <pre class=\"labBlock-example u-bgGreysLightest\">tooltip-placement=\"bottom\" tooltip=\"On the Bottom!\"</pre>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"labPanel-column\">\n" +
    "                <div class=\"labBlock\">\n" +
    "                    <div class=\"labBlock-preview\">\n" +
    "                        <a href=\"#\" class=\"has-tip\" tooltip-append-to-body=\"true\" tooltip-placement=\"top\" tooltip=\"On the Top!\">Tooltip top</a>\n" +
    "                    </div>\n" +
    "                    <pre class=\"labBlock-example u-bgGreysLightest\">tooltip-placement=\"top\" tooltip=\"On the Top!\"</pre>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    <div class=\"labPanel-content\">\n" +
    "\n" +
    "<textarea ui-codemirror=\"{\n" +
    "'lineNumbers': true,\n" +
    "'theme':'default',\n" +
    "'readOnly': 'true',\n" +
    "'lineWrapping' : false,\n" +
    "'mode': 'text/html',\n" +
    "autoClearEmptyLines: true\n" +
    "}\">\n" +
    "<a\n" +
    "    href=\"#\"\n" +
    "    class=\"has-tip\"\n" +
    "    tooltip-append-to-body=\"true\"\n" +
    "    tooltip-placement=\"left\"\n" +
    "    tooltip=\"On the Left!\"\n" +
    ">Tooltip left</a></textarea>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"labPanel-content\">\n" +
    "        <h5>Notes:</h5>\n" +
    "        <p>\n" +
    "            The content of the tooltip is set via the <code>tooltip</code> attribute.\n" +
    "        </p>\n" +
    "        <p>\n" +
    "            Basic positioning of tooltips is achieved via the <code>tooltip-placement</code>\n" +
    "            attribute, which can be 1 of 4 values: left, right, top or bottom.\n" +
    "        </p>\n" +
    "        <p>\n" +
    "            <strong>N.B. Please always use</strong> <code>tooltip-append-to-body=\"true\"</code>.\n" +
    "            You cannot guarantee your tooltip is wrapped in a close enough\n" +
    "            parent that is relatively positioned, for the inline tooltip to\n" +
    "            have the correctly calculated <code>top</code> value.\n" +
    "        </p>\n" +
    "        <p>\n" +
    "            This is a naive default by Angular Foundation, which Foundation itself doesn't do.\n" +
    "        </p>\n" +
    "    </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "</section>\n" +
    "\n" +
    "<section class=\"panel labPanel\">\n" +
    "    <h3>Advanced Tooltips</h3>\n" +
    "\n" +
    "    <div class=\"panel-body\">\n" +
    "        <div class=\"labPanel-row\">\n" +
    "            <div class=\"labPanel-column--thirds\">\n" +
    "                <div class=\"labBlock\">\n" +
    "                    <div class=\"labBlock-preview\">\n" +
    "                        <a href=\"#\" class=\"has-tip\" tooltip-append-to-body=\"true\" tooltip-animation=\"false\" tooltip=\"I don't fade. :-(\">Not animated</a>\n" +
    "                    </div>\n" +
    "                    <pre class=\"labBlock-example u-bgGreysLightest\">tooltip-animation=\"false\"</pre>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"labPanel-column--thirds\">\n" +
    "                <div class=\"labBlock\">\n" +
    "                    <div class=\"labBlock-preview\">\n" +
    "                        <a href=\"#\" class=\"has-tip\" tooltip-append-to-body=\"true\" tooltip-popup-delay=\"1000\" tooltip=\"appears with delay\">Delayed</a>\n" +
    "                    </div>\n" +
    "                    <pre class=\"labBlock-example u-bgGreysLightest\">tooltip-popup-delay=\"1000\"</pre>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"labPanel-column--thirds\">\n" +
    "                <div class=\"labBlock\">\n" +
    "                    <div class=\"labBlock-preview\">\n" +
    "                        <a href=\"#\" class=\"has-tip\" tooltip-append-to-body=\"true\" tooltip-html-unsafe=\"I've been made <b>bold</b>!\">HTML contents</a>\n" +
    "                    </div>\n" +
    "                    <pre class=\"labBlock-example u-bgGreysLightest\">tooltip-html-unsafe=\"I've been made &lt;b&gt;bold&lt;/b&gt;!\"</pre>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "    <div class=\"labPanel-content\">\n" +
    "\n" +
    "<textarea ui-codemirror=\"{\n" +
    "'lineNumbers': true,\n" +
    "'theme':'default',\n" +
    "'readOnly': 'true',\n" +
    "'lineWrapping' : false,\n" +
    "'mode': 'text/html',\n" +
    "autoClearEmptyLines: true\n" +
    "}\">\n" +
    "<a href=\"#\" class=\"has-tip\" tooltip-append-to-body=\"true\" tooltip-animation=\"false\" tooltip=\"I don't fade. :-(\">Not animated</a>\n" +
    "\n" +
    "<a href=\"#\" class=\"has-tip\" tooltip-append-to-body=\"true\" tooltip-popup-delay=\"1000\" tooltip=\"appears with delay\">Delayed</a>\n" +
    "\n" +
    "<a href=\"#\" class=\"has-tip\" tooltip-append-to-body=\"true\" tooltip-html-unsafe=\"I've been made <b>bold</b>!\">HTML contents</a></textarea>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"labPanel-content\">\n" +
    "        <h5>Notes:</h5>\n" +
    "        <p>\n" +
    "            Provided are 2 extra display options that can remove animations via\n" +
    "            <code>tooltip-animation</code> and delay the display of a particular\n" +
    "            tooltip via <code>tooltip-popup-deplay</code>\n" +
    "        </p>\n" +
    "        <p>\n" +
    "            An alternative for the <code>tooltip</code> attribute is the\n" +
    "            <code>tooltip-html-unsafe</code>, where you can pass unsanitised\n" +
    "            HTML strings to be displayed as the tooltip content.\n" +
    "        </p>\n" +
    "        <p>\n" +
    "            <strong>N.B. Animation helpers have yet to make it to Pattern-Lab.</strong>\n" +
    "        </p>\n" +
    "    </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "</section>\n" +
    "\n" +
    "<section class=\"panel labPanel\">\n" +
    "    <h3>Tooltips Triggers</h3>\n" +
    "\n" +
    "    <div class=\"panel-body\">\n" +
    "\n" +
    "\n" +
    "        <div class=\"labPanel-row\">\n" +
    "            <div class=\"labPanel-column--thirds\">\n" +
    "                <div class=\"labBlock is-light\">\n" +
    "                    <div class=\"labBlock-preview\">\n" +
    "                        <label class=\"form-label\" for=\"tooltip1\">Focus Trigger</label>\n" +
    "                        <input type=\"text\" tooltip=\"See? Now click away...\" tooltip-append-to-body=\"true\" tooltip-trigger=\"focus\" tooltip-placement=\"right\" placeholder=\"Focus in me&hellip;\" class=\"form-input\" id=\"tooltip1\" />\n" +
    "                    </div>\n" +
    "                    <pre class=\"labBlock-example u-bgGreysLightest\">tooltip-trigger=\"focus\"</pre>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"labPanel-column--thirds\">\n" +
    "                <div class=\"labBlock is-light\">\n" +
    "                    <div class=\"labBlock-preview\">\n" +
    "                        <label class=\"form-label\" for=\"tooltip2\">Mouse Trigger</label>\n" +
    "                        <input type=\"text\" tooltip=\"Now move your mouse away...\" tooltip-append-to-body=\"true\" tooltip-trigger=\"mouseenter\" tooltip-placement=\"top\" placeholder=\"Hover over me&hellip;\" class=\"form-input\" id=\"tooltip2\" />\n" +
    "                    </div>\n" +
    "                    <pre class=\"labBlock-example u-bgGreysLightest\">tooltip-trigger=\"mouseenter\"</pre>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"labPanel-column--thirds\">\n" +
    "                <div class=\"labBlock is-light\">\n" +
    "                    <div class=\"labBlock-preview\">\n" +
    "                        <label class=\"form-label\" for=\"tooltip3\">Click Trigger <small class=\"has-tip\" tooltip-append-to-body=\"true\" tooltip=\"Click again to dismiss...\" tooltip-trigger=\"click\" tooltip-placement=\"right\" >What is this?</small></label>\n" +
    "                        <input type=\"text\" class=\"form-input\" id=\"tooltip3\" />\n" +
    "                    </div>\n" +
    "                    <pre class=\"labBlock-example u-bgGreysLightest\">tooltip-trigger=\"click\"</pre>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    <div class=\"labPanel-content\">\n" +
    "\n" +
    "<textarea ui-codemirror=\"{\n" +
    "'lineNumbers': true,\n" +
    "'theme':'default',\n" +
    "'readOnly': 'true',\n" +
    "'lineWrapping' : false,\n" +
    "'mode': 'text/html',\n" +
    "autoClearEmptyLines: true\n" +
    "}\">\n" +
    "<input\n" +
    "    tooltip-trigger=\"focus\"\n" +
    "    tooltip=\"See? Now click away...\"\n" +
    "    tooltip-append-to-body=\"true\"\n" +
    "    tooltip-placement=\"right\"\n" +
    "    type=\"text\"\n" +
    "    placeholder=\"Focus in me&hellip;\"\n" +
    "    class=\"form-input\" /></textarea>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"labPanel-content\">\n" +
    "        <h5>Notes:</h5>\n" +
    "        <p>\n" +
    "            By default tooltips are triggered by the <code>mouseenter</code> event,\n" +
    "            but there maybe times when you require additional control.\n" +
    "        </p>\n" +
    "        <p>\n" +
    "            By using the <code>tooltip-trigger</code> attribute, you can opt to display\n" +
    "            a tooltip via <code>focus</code>, <code>click</code> or <code>mouseenter</code> events manually, depending on your need.\n" +
    "        </p>\n" +
    "    </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "</section>\n" +
    "</div>");
}]);
})();
