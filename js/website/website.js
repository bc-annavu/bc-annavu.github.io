'use strict';

angular.module('website', ['bcapp-pattern-lab', 'mm.foundation', 'website-templates', 'ui.codemirror', 'ui.router',

// JS Components
'website.accordion', 'website.alerts', 'website.aside-header-toggle', 'website.aside-nav', 'website.banners', 'website.bc-datepicker', 'website.bc-dropdown', 'website.bc-pagination', 'website.bc-server-table', 'website.buttons', 'website.cards', 'website.color-picker-example', 'website.copy-clipboard', 'website.credit-card', 'website.global-message', 'website.loading-indicators', 'website.icons', 'website.modal', 'website.panels', 'website.prompt', 'website.switch', 'website.tables', 'website.tabs', 'website.tooltip', 'website.warning-button']).constant('BC_APP_CONFIG', {}).config(function ($stateProvider, svgRootPathProvider) {
    $stateProvider.state('components', {
        abstract: true,
        url: '/components',
        template: '<ui-view/>'
    });

    svgRootPathProvider.setRootPath('/svg/icons/');
});
'use strict';

angular.module('website.aside-header-toggle.controller', []).controller('AsideHeaderToggleCtrl', function () {
    var ctrl = this;
    ctrl.clickHandler = clickHandler;
    ctrl.isOpen = false;
    ctrl.setIsOpen = setIsOpen;

    function clickHandler($event) {
        $event.preventDefault();
        if (ctrl.isOpen) {
            ctrl.setIsOpen(false);
        } else {
            ctrl.setIsOpen(true);
        }
    }

    function setIsOpen(value) {
        ctrl.isOpen = value;
    }
});
'use strict';

angular.module('website.aside-header-toggle.directive', ['website.aside-header-toggle.controller']).directive('asideHeaderToggle', function () {
    var directive = {
        bindToController: true,
        controller: 'AsideHeaderToggleCtrl',
        controllerAs: 'asideHeaderToggleCtrl',
        replace: true,
        restrict: 'E',
        scope: {
            title: '='
        },
        templateUrl: 'src/website/js/asideHeaderToggle/asideHeaderToggle.tpl.html'
    };
    return directive;
});
'use strict';

angular.module('website.aside-header-toggle', ['website.aside-header-toggle.directive']);
'use strict';

angular.module('website.aside-nav.controller', []).controller('AsideNavCtrl', function ($scope, $window) {
    $scope.isActive = function (viewLocation) {
        return viewLocation === $window.location.pathname;
    };
});
'use strict';

angular.module('website.aside-nav', ['website.aside-nav.controller']);
'use strict';

angular.module('website.icons.controller', []).controller('IconsCtrl', function ($scope) {
    $scope.icons = window.icons;
});
'use strict';

angular.module('website.icons.directive', ['website.icons.controller']).directive('iconsList', function bcIconDirective() {
    var directive = {
        restrict: 'E',
        templateUrl: 'src/website/js/icons/icons.tpl.html',
        controller: 'IconsCtrl as iconsCtrl'
    };
    return directive;
});
'use strict';

angular.module('website.icons', ['website.icons.directive']);
'use strict';

angular.module('website.switch.controller', []).controller('PatternLabSwitchCtrl', function () {
    var ctrl = this;

    ctrl.switchOne = false;
    ctrl.switchTwo = true;
    ctrl.switchThree = false;
    ctrl.switchFour = true;
    ctrl.switchFive = false;
    ctrl.switchSix = false;
    ctrl.isSwitchSixDisabled = true;
});
'use strict';

angular.module('website.switch', ['website.switch.controller']);
'use strict';

angular.module('website.accordion.controller', []).controller('AccordionCtrl', function ($scope) {
    $scope.oneAtATime = true;

    $scope.groups = [{
        id: 'dynamic-1',
        title: "Dynamic Group Header - 1",
        content: "Dynamic Group Body - 1"
    }, {
        id: 'dynamic-2',
        title: "Dynamic Group Header - 2",
        content: "Dynamic Group Body - 2"
    }];

    $scope.items = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function () {
        var newItemNo = $scope.items.length + 1;
        $scope.items.push('Item ' + newItemNo);
    };
});
'use strict';

angular.module('website.accordion', ['website.accordion.state']);
'use strict';

angular.module('website.accordion.state', ['ui.router', 'website.accordion.controller']).config(function ($stateProvider) {
    $stateProvider.state('components.accordion', {
        url: '/accordion',
        templateUrl: 'src/website/js/examples/accordion/accordion.tpl.html',
        controller: 'AccordionCtrl as accordionCtrl'
    });
});
'use strict';

angular.module('website.alerts.controller', []).controller('AlertsCtrl', function ($scope) {
    $scope.alerts = [{ msg: 'Generic alert' }, { type: 'info', msg: 'Informational alert' }, { type: 'success', msg: 'Success alert' }, { type: 'warning', msg: 'Warning alert' }, { type: 'error', msg: 'Error alert' }];

    $scope.openAlert = { type: 'error', msg: 'Error alert in a panel' };

    $scope.addAlert = function () {
        $scope.alerts.push({ msg: 'Another generic alert!' });
    };

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };
});
'use strict';

angular.module('website.alerts', ['website.alerts.state']);
'use strict';

angular.module('website.alerts.state', ['ui.router', 'website.alerts.controller']).config(function ($stateProvider) {
    $stateProvider.state('components.alerts', {
        url: '/alerts',
        templateUrl: 'src/website/js/examples/alerts/alerts.tpl.html',
        controller: 'AlertsCtrl as alertsCtrl'
    });
});
'use strict';

angular.module('website.banners.controller', []).controller('BannersCtrl', function () {});
'use strict';

angular.module('website.banners', ['website.banners.state']);
'use strict';

angular.module('website.banners.state', ['ui.router', 'website.banners.controller']).config(function ($stateProvider) {
    $stateProvider.state('components.banners', {
        url: '/banners',
        templateUrl: 'src/website/js/examples/banners/banners.tpl.html',
        controller: 'BannersCtrl as bannersCtrl'
    });
});
'use strict';

angular.module('website.bc-datepicker.controller', []).controller('BcDatepickerCtrl', function () {
    var ctrl = this;

    ctrl.options = {};
});
'use strict';

angular.module('website.bc-datepicker', ['website.bc-datepicker.state']);
'use strict';

angular.module('website.bc-datepicker.state', ['ui.router', 'website.bc-datepicker.controller']).config(function ($stateProvider) {
    $stateProvider.state('components.bc-datepicker', {
        url: '/bc-datepicker',
        templateUrl: 'src/website/js/examples/bc-datepicker/bc-datepicker.tpl.html',
        controller: 'BcDatepickerCtrl as bcDatepickerCtrl'
    });
});
'use strict';

angular.module('website.bc-dropdown', ['website.bc-dropdown.state']);
'use strict';

angular.module('website.bc-dropdown.state', ['ui.router']).config(function ($stateProvider) {
    $stateProvider.state('components.bc-dropdown', {
        url: '/bc-dropdown',
        templateUrl: 'src/website/js/examples/bc-dropdown/bc-dropdown.tpl.html'
    });
});
'use strict';

angular.module('website.bc-pagination.controller', []).controller('BcPaginationCtrl', function ($scope, $log) {
    $scope.totalItems = 200;
    $scope.currentPage = 1;
    $scope.maxSize = 5;
    $scope.itemsPerPage = 10;
    $scope.showLimits = false;

    $scope.onSelectPage = function (newValues) {
        $log.log('New Values Combo: ', newValues);
    };

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.customLimits = [10, 20, 30, 100];
});
'use strict';

angular.module('website.bc-pagination', ['website.bc-pagination.state']);
'use strict';

angular.module('website.bc-pagination.state', ['ui.router', 'website.bc-pagination.controller']).config(function ($stateProvider) {
    $stateProvider.state('components.bc-pagination', {
        url: '/bc-pagination',
        templateUrl: 'src/website/js/examples/bc-pagination/bc-pagination.tpl.html',
        controller: 'BcPaginationCtrl as bcPaginationCtrl'
    });
});
'use strict';

angular.module('website.buttons.controller', []).controller('ButtonsCtrl', function ($scope) {
    $scope.singleModel = 1;

    $scope.radioModel = 'Middle';

    $scope.checkModel = {
        left: false,
        middle: true,
        right: false
    };
});
'use strict';

angular.module('website.buttons', ['website.buttons.state']);
'use strict';

angular.module('website.buttons.state', ['ui.router', 'website.buttons.controller']).config(function ($stateProvider) {
    $stateProvider.state('components.buttons', {
        url: '/buttons',
        templateUrl: 'src/website/js/examples/buttons/buttons.tpl.html',
        controller: 'ButtonsCtrl as buttonsCtrl'
    });
});
'use strict';

angular.module('website.bc-server-table.constants', []).constant('DEMO_TABLE_CONFIG', {
    queryKeys: {
        page: 'page',
        limit: 'limit',
        sortBy: 'sort-by',
        sortDir: 'sort-order'
    },
    sortDirValues: {
        asc: 'asc',
        desc: 'dsc'
    },
    filters: ['time'],
    rowIdKey: 'name'
}).constant('DEMO_TABLE_ID', 'demo-table');
'use strict';

angular.module('website.bc-server-table.controller', ['ui.router', 'bcapp-pattern-lab.bc-server-table', 'e2e-backend']).controller('BcServerTableDemoCtrl', function ($scope, $state, bcServerTableFactory, dataTable, DEMO_TABLE_ID) {
    var ctrl = this;

    ctrl.clearTable = clearTable;
    ctrl.bcServerTable = bcServerTableFactory.get(DEMO_TABLE_ID);

    // This needs to be here until the pagination directive is updated
    // to preserve context when calling the on-change function.
    ctrl.bcServerTable.updatePage = _.bind(ctrl.bcServerTable.updatePage, ctrl.bcServerTable);

    function clearTable($event) {
        $event.preventDefault();
        $state.go($state.current.name, { page: 1 }, { inherit: false });
    }
});
'use strict';

angular.module('website.bc-server-table', ['website.bc-server-table.state']);
'use strict';

angular.module('website.bc-server-table.state', ['ui.router', 'website.bc-server-table.constants', 'website.bc-server-table.controller', 'website.bc-server-table.sample-data.service']).config(function ($stateProvider) {
    $stateProvider.state('components.bc-server-table', {
        controller: 'BcServerTableDemoCtrl as bcServerTableDemoCtrl',
        resolve: {
            dataTable: function dataTableResolve($stateParams, bcServerTableFactory, DEMO_TABLE_CONFIG, DEMO_TABLE_ID, sampleData) {
                return bcServerTableFactory.create(DEMO_TABLE_ID, DEMO_TABLE_CONFIG).init({
                    stateParams: $stateParams,
                    resourceCallback: sampleData.getSampleData
                });
            }
        },
        templateUrl: 'src/website/js/examples/bc-server-table/bc-server-table.tpl.html',
        url: '/bc-server-table?sort-order&sort-by&page&limit&time&name'
    });
});
'use strict';

angular.module('e2e-backend', ['ngMockE2E']).run(function ($httpBackend) {
    $httpBackend.whenGET(/\/table.json.*/).respond(apiResponse);
    $httpBackend.whenGET(/.*/).passThrough();

    function apiResponse(status, data) {
        var items, pagination, rows, rowToShow, sortBy, fromRow, toRow, limit, page;
        rows = [{ 'name': 'Ritual Coffee Roasters', 'star': '★★★★★', 'sf-location': 'Hayes Valley' }, { 'name': 'Blue Bottle', 'star': '★★★★★', 'sf-location': 'Hayes Valley' }, { 'name': 'CoffeeShop', 'star': '★★★', 'sf-location': 'Bernal Heights' }, { 'name': 'Spike\'s Coffee & Teas', 'star': '★★★', 'sf-location': 'Castro' }, { 'name': 'La Boulange', 'star': '★★', 'sf-location': 'Cole Valley' }, { 'name': 'Dynamo Donut and Coffee', 'star': '★★★★★', 'sf-location': 'Cow Hollow' }, { 'name': 'The Mill', 'star': '★★★★', 'sf-location': 'Divisadero' }, { 'name': 'Piccino Coffee Bar', 'star': '★★★', 'sf-location': 'Dogpatch' }, { 'name': 'Philz', 'star': '★★★', 'sf-location': 'Downtown' }, { 'name': 'Duboce Park Cafe', 'star': '★★', 'sf-location': 'Duboce Triangle' }, { 'name': 'Blue Bottle', 'star': '★★★★★', 'sf-location': 'Embarcadero' }, { 'name': 'Four Barrel', 'star': '★★★', 'sf-location': 'Excelsior' }, { 'name': 'Coffee Bar', 'star': '★★★★★', 'sf-location': 'FiDi' }, { 'name': 'Biscoff Coffee Corner', 'star': '★★★', 'sf-location': 'Fisherman\'s Wharf' }, { 'name': 'Fifty/Fifty Coffee and Tea', 'star': '★★★', 'sf-location': 'Inner Richmond' }, { 'name': 'Beanery', 'star': '★★★', 'sf-location': 'Inner Sunset' }, { 'name': 'Cafe du Soleil', 'star': '★★', 'sf-location': 'Lower Haight' }, { 'name': 'Peet\'s', 'star': '★', 'sf-location': 'The Marina' }, { 'name': 'Sightglass', 'star': '★★★★', 'sf-location': 'The Mission' }, { 'name': 'Contraband Coffee Bar', 'star': '★★★★', 'sf-location': 'Nob Hill' }, { 'name': 'Martha & Bros Coffee', 'star': '★★★', 'sf-location': 'Noe Valley' }, { 'name': 'Réveille', 'star': '★★★', 'sf-location': 'North Beach' }, { 'name': 'Cup Coffee Bar', 'star': '★★★', 'sf-location': 'Outer Mission' }, { 'name': 'Garden House Cafe', 'star': '★★★', 'sf-location': 'Outer Richmond' }, { 'name': 'Andytown Coffee Roasters', 'star': '★★★', 'sf-location': 'Outer Sunset' }, { 'name': 'Jane on Fillmore', 'star': '★★', 'sf-location': 'Pacific Heights' }, { 'name': 'Saint Frank Coffee', 'star': '★★★', 'sf-location': 'Polk' }, { 'name': 'Farley’s', 'star': '★★★', 'sf-location': 'Potrero Hill' }, { 'name': 'House of Snacks', 'star': '★★★', 'sf-location': 'The Presidio' }, { 'name': 'The Brew', 'star': '★★★', 'sf-location': 'Russian Hill' }, { 'name': 'Wicked Grounds', 'star': '★★★', 'sf-location': 'SOMA' }, { 'name': 'Starbucks', 'star': '★', 'sf-location': 'Union Square' }, { 'name': 'Flywheel Coffee Roasters', 'star': '★★★★★', 'sf-location': 'Upper Haight' }];
        limit = parseInt(getParameterByName('limit'), 10) || 11;
        page = parseInt(getParameterByName('page'), 10) || 1;

        if (getParameterByName('sort-by')) {
            sortBy = getParameterByName('sort-by');
            if (getParameterByName('sort-order') === 'dsc') {
                sortBy = '-' + sortBy;
            }
            rows.sort(dynamicSort(sortBy));
        }

        pagination = {
            'limit': limit,
            'page': page,
            'pages': Math.ceil(rows.length / limit),
            'numItems': rows.length
        };
        toRow = pagination.limit * pagination.page;
        fromRow = toRow - pagination.limit;

        if (fromRow >= 0 && toRow >= 0) {
            rowToShow = rows.slice(fromRow, toRow);
        } else {
            rowToShow = rows;
        }

        items = {
            'rows': rowToShow,
            'pagination': pagination,
            'sort-by': getParameterByName('sort-by'),
            'sort-order': getParameterByName('sort-order')
        };

        function dynamicSort(property) {
            var sortOrder = 1;
            if (property[0] === '-') {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a, b) {
                var result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
                return result * sortOrder;
            };
        }

        function getParameterByName(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
                results = regex.exec(data);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        }

        return [200, items, {}];
    }
});
'use strict';

angular.module('website.cards.controller', []).controller('CardsCtrl', function () {});
'use strict';

angular.module('website.cards', ['website.cards.state']);
'use strict';

angular.module('website.cards.state', ['ui.router', 'website.cards.controller']).config(function ($stateProvider) {
    $stateProvider.state('components.cards', {
        url: '/cards',
        templateUrl: 'src/website/js/examples/cards/cards.tpl.html',
        controller: 'CardsCtrl as cardsCtrl'
    });
});
'use strict';

angular.module('website.color-picker-example.controller', []).controller('ColorPickerExampleCtrl', function ($scope) {
    $scope.modelValue = '#cccccc';

    $scope.palette = ['#00ABC9', '#95db89', '#ffb800', '#db636b', '#556273', '#232831', '#b186cb', '#ff8800', '#3e62a1', '#e89fae', '#6ECCFC'];

    $scope.inputModelValue = '#6ECCFC';
    $scope.inputLabelText = 'Input Label Text';
    $scope.inputPlaceholderText = 'Input Placeholder Text';
    $scope.inputPalette = ['#6ECCFC', '#00ABC9', '#E5F6F9', '#95DB89', '#FFB800'];
});
'use strict';

angular.module('website.color-picker-example', ['website.color-picker-example.state']);
'use strict';

angular.module('website.color-picker-example.state', ['ui.router', 'website.color-picker-example.controller']).config(function ($stateProvider) {
    $stateProvider.state('components.color-picker-example', {
        url: '/color-picker',
        templateUrl: 'src/website/js/examples/color-picker/color-picker.tpl.html',
        controller: 'ColorPickerExampleCtrl as colorPickerExampleCtrl'
    });
});
'use strict';

angular.module('website.copy-clipboard', ['website.copy-clipboard.state']);
'use strict';

angular.module('website.copy-clipboard.state', ['ui.router']).config(function ($stateProvider) {
    $stateProvider.state('components.copy-clipboard', {
        url: '/copy-clipboard',
        templateUrl: 'src/website/js/examples/copy-clipboard/copy-clipboard.tpl.html'
    });
});
'use strict';

angular.module('website.credit-card.controller', []).controller('CreditCardCtrl', function CreditCardCtrl() {
    var ctrl = this;

    ctrl.ccData = {
        ccNumber: '',
        ccCvv: '',
        ccName: '',
        ccExpiry: {
            month: '',
            year: ''
        },
        ccType: ''
    };

    ctrl.ccConfig = {
        cardCode: true,
        fullName: true,
        supportedTypes: ['American Express', 'Diners Club', 'Discover', 'MasterCard', 'Visa']
    };
});
'use strict';

angular.module('website.credit-card', ['website.credit-card.state']);
'use strict';

angular.module('website.credit-card.state', ['ui.router', 'website.credit-card.controller']).config(function ($stateProvider) {
    $stateProvider.state('components.credit-card', {
        url: '/credit-card',
        templateUrl: 'src/website/js/examples/credit-card/credit-card.tpl.html',
        controller: 'CreditCardCtrl as creditCardCtrl'
    });
});
'use strict';

angular.module('website.global-message.controller', []).controller('GlobalMessageCtrl', function () {});
'use strict';

angular.module('website.global-message', ['website.global-message.state']);
'use strict';

angular.module('website.global-message.state', ['ui.router', 'website.global-message.controller']).config(function ($stateProvider) {
    $stateProvider.state('components.global-message', {
        url: '/global-message',
        templateUrl: 'src/website/js/examples/global-message/global-message.tpl.html',
        controller: 'GlobalMessageCtrl as globalMessageCtrl'
    });
});
'use strict';

angular.module('website.loading-indicators.controller', []).controller('LoadingIndicatorsCtrl', function ($rootScope, $timeout) {

    var ctrl = this;

    ctrl.fakeHttpRequest = fakeHttpRequest;
    ctrl.fakeStateTransition = fakeStateTransition;
    ctrl.toggleManualLoading = toggleManualLoading;

    function fakeHttpRequest() {
        // Here we are emitting the event manually, in a real scenario
        // you should inject the ajaxRequestStatus httpInterceptor from ng-common
        // which will emit these events automatically on normal $http requests
        $rootScope.$emit('ajaxRequestRunning', true);

        $timeout(function () {
            $rootScope.$emit('ajaxRequestRunning', false);
        }, 3000);
    }

    function fakeStateTransition() {
        // Here we are emitting the event manually, in a real scenario
        // you wouldnt do this.
        $rootScope.$emit('$stateChangeStart', true);

        $timeout(function () {
            $rootScope.$emit('$stateChangeSuccess', false);
        }, 3000);
    }

    function toggleManualLoading() {
        ctrl.manualLoading = !ctrl.manualLoading;
    }
});
'use strict';

angular.module('website.loading-indicators', ['website.loading-indicators.state']);
'use strict';

angular.module('website.loading-indicators.state', ['ui.router', 'website.loading-indicators.controller']).config(function ($stateProvider) {
    $stateProvider.state('components.loading', {
        url: '/loaders',
        templateUrl: 'src/website/js/examples/loading-indicators/loading-indicators.tpl.html',
        controller: 'LoadingIndicatorsCtrl as loadingIndicatorsCtrl'
    });
});
'use strict';

angular.module('website.modal-content.controller', []).controller('ModalContentCtrl', function ($modalInstance) {
    var ctrl = this;

    ctrl.ok = ok;
    ctrl.cancel = cancel;

    function ok($event) {
        $event.preventDefault();

        $modalInstance.close('OK');
    }

    function cancel($event) {
        $event.preventDefault();

        $modalInstance.dismiss('Canceled');
    }
});
'use strict';

angular.module('website.modal.controller', ['website.modal-content.controller']).directive('tabset', function ($timeout) {
    return {
        require: 'tabset',
        link: function link(scope, element, attrs, tabset) {
            var select = tabset.select;

            tabset.select = function (tab) {
                $timeout(function () {
                    if (tab.isRendered) {
                        return;
                    }

                    var codemirrorElements = element[0].querySelectorAll('.CodeMirror');

                    _.each(codemirrorElements, function (codemirrorElement) {
                        codemirrorElement.CodeMirror.refresh();
                    });

                    tab.isRendered = true;
                });

                return select.apply(tabset, arguments);
            };
        }
    };
}).controller('ModalCtrl', function ($modal) {
    var ctrl = this;
    ctrl.handleTabSelect = handleTabSelect;
    ctrl.isTabActive = isTabActive;
    ctrl.openUnformattedModal = openUnformattedModal;
    ctrl.openFormattedModal = openFormattedModal;
    ctrl.openPrompt = openPrompt;
    ctrl.openLargeModal = openLargeModal;

    function handleTabSelect(tab) {
        ctrl.currentTab = tab;
    }

    function isTabActive(tab) {
        return ctrl.currentTab === tab;
    }

    function openUnformattedModal($event) {
        $event.preventDefault();
        $modal.open({
            controller: 'ModalContentCtrl as modalContentCtrl',
            templateUrl: 'src/website/js/examples/modal/modal-unformatted.tpl.html'
        });
    }

    function openFormattedModal($event) {
        $event.preventDefault();
        $modal.open({
            controller: 'ModalContentCtrl as modalContentCtrl',
            templateUrl: 'src/website/js/examples/modal/modal-formatted.tpl.html'
        });
    }

    function openPrompt($event) {
        $event.preventDefault();
        $modal.open({
            controller: 'ModalContentCtrl as modalContentCtrl',
            templateUrl: 'src/website/js/examples/modal/prompt.tpl.html',
            windowClass: 'prompt'
        });
    }

    function openLargeModal($event) {
        $event.preventDefault();
        $modal.open({
            controller: 'ModalContentCtrl as modalContentCtrl',
            templateUrl: 'src/website/js/examples/modal/modal-formatted.tpl.html',
            windowClass: 'modal--large'
        });
    }
});
'use strict';

angular.module('website.modal', ['website.modal.state']);
'use strict';

angular.module('website.modal.state', ['ui.router', 'website.modal.controller']).config(function ($stateProvider) {
    $stateProvider.state('components.modal', {
        url: '/modal',
        templateUrl: 'src/website/js/examples/modal/modal.tpl.html',
        controller: 'ModalCtrl as modalCtrl'
    });
});
'use strict';

angular.module('website.panels.controller', []).controller('PanelsCtrl', function () {});
'use strict';

angular.module('website.panels', ['website.panels.state']);
'use strict';

angular.module('website.panels.state', ['ui.router', 'website.panels.controller']).config(function ($stateProvider) {
    $stateProvider.state('components.panels', {
        url: '/panels',
        templateUrl: 'src/website/js/examples/panels/panels.tpl.html',
        controller: 'PanelsCtrl as panelsCtrl'
    });
});
'use strict';

angular.module('website.prompt-content.controller', []).controller('PromptContentController', function ($promptInstance) {
    var ctrl = this;

    ctrl.ok = ok;
    ctrl.cancel = cancel;

    function ok($event) {
        $event.preventDefault();

        $promptInstance.close('OK');
    }

    function cancel($event) {
        $event.preventDefault();

        $promptInstance.dismiss('Canceled');
    }
});
'use strict';

angular.module('website.prompt.controller', ['website.prompt-content.controller']).directive('tabset', function ($timeout) {
    return {
        require: 'tabset',
        link: function link(scope, element, attrs, tabset) {
            var select = tabset.select;

            tabset.select = function (tab) {
                $timeout(function () {
                    if (tab.isRendered) {
                        return;
                    }

                    var codemirrorElements = element[0].querySelectorAll('.CodeMirror');

                    _.each(codemirrorElements, function (codemirrorElement) {
                        codemirrorElement.CodeMirror.refresh();
                    });

                    tab.isRendered = true;
                });

                return select.apply(tabset, arguments);
            };
        }
    };
}).controller('PromptCtrl', function ($prompt) {
    var ctrl = this;
    ctrl.handleTabSelect = handleTabSelect;
    ctrl.isTabActive = isTabActive;
    ctrl.openPrompt = openPrompt;

    function handleTabSelect(tab) {
        ctrl.currentTab = tab;
    }

    function isTabActive(tab) {
        return ctrl.currentTab === tab;
    }

    function openPrompt($event) {
        $event.preventDefault();
        $prompt.open({
            controller: 'PromptContentCtrl as promptContentCtrl',
            templateUrl: 'src/website/js/examples/prompt/prompt-modal.tpl.html'
        });
    }
});
'use strict';

angular.module('website.prompt', ['website.prompt.state']);
'use strict';

angular.module('website.prompt.state', ['ui.router', 'website.prompt.controller']).config(function ($stateProvider) {
    $stateProvider.state('components.prompt', {
        url: '/prompt',
        templateUrl: 'src/website/js/examples/prompt/prompt.tpl.html',
        controller: 'PromptCtrl as promptCtrl'
    });
});
'use strict';

angular.module('website.tables.controller', []).controller('TablesCtrl', function () {});
'use strict';

angular.module('website.tables', ['website.tables.state']);
'use strict';

angular.module('website.tables.state', ['ui.router', 'website.tables.controller']).config(function ($stateProvider) {
    $stateProvider.state('components.tables', {
        url: '/tables',
        templateUrl: 'src/website/js/examples/tables/tables.tpl.html',
        controller: 'TablesCtrl as tablesCtrl'
    });
});
'use strict';

angular.module('website.tabs.controller', []).controller('TabsCtrl', function () {
    var ctrl = this;

    ctrl.tabs = [{ title: 'Dynamic Title 1', content: 'Dynamic content 1' }, { title: 'Dynamic Title 2', content: 'Dynamic content 2' }];

    ctrl.tabClicked = function tabClicked() {
        console.log('tab clicked!');
    };
});
'use strict';

angular.module('website.tabs', ['website.tabs.state']);
'use strict';

angular.module('website.tabs.state', ['ui.router', 'website.tabs.controller']).config(function ($stateProvider) {
    $stateProvider.state('components.tabs', {
        url: '/tabs',
        templateUrl: 'src/website/js/examples/tabs/tabs.tpl.html',
        controller: 'TabsCtrl as tabsCtrl'
    });
});
'use strict';

angular.module('website.tooltip', ['website.tooltip.state']);
'use strict';

angular.module('website.tooltip.state', ['ui.router']).config(function ($stateProvider) {
    $stateProvider.state('components.tooltip', {
        url: '/tooltip',
        templateUrl: 'src/website/js/examples/tooltip/tooltip.tpl.html'
    });
});
'use strict';

angular.module('website.warning-button', ['website.warning-button.state']);
'use strict';

angular.module('website.warning-button.state', ['ui.router', 'website.modal.controller']).config(function ($stateProvider) {
    $stateProvider.state('components.warning-button', {
        url: '/warning-button',
        templateUrl: 'src/website/js/examples/warning-button/warning-button.tpl.html',
        controller: 'ModalCtrl as modalCtrl'
    });
});
'use strict';

angular.module('website.bc-server-table.sample-data.service', []).factory('sampleData', function sampleData($http) {
    var service = {
        getSampleData: getSampleData
    };

    function getSampleData(queryParams) {
        return $http.get('/table.json', {
            params: queryParams
        }).then(function getSampleDataSuccess(response) {
            return {
                rows: response.data.rows,
                pagination: {
                    page: response.data.pagination.page,
                    limit: response.data.pagination.limit,
                    total: response.data.pagination.numItems
                }
            };
        });
    }

    return service;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFzaWRlSGVhZGVyVG9nZ2xlL2FzaWRlSGVhZGVyVG9nZ2xlLmNvbnRyb2xsZXIuanMiLCJhc2lkZUhlYWRlclRvZ2dsZS9hc2lkZUhlYWRlclRvZ2dsZS5kaXJlY3RpdmUuanMiLCJhc2lkZUhlYWRlclRvZ2dsZS9hc2lkZUhlYWRlclRvZ2dsZS5tb2R1bGUuanMiLCJhc2lkZU5hdi9hc2lkZU5hdi5jb250cm9sbGVyLmpzIiwiYXNpZGVOYXYvYXNpZGVOYXYubW9kdWxlLmpzIiwiaWNvbnMvaWNvbnMuY29udHJvbGxlci5qcyIsImljb25zL2ljb25zLmRpcmVjdGl2ZS5qcyIsImljb25zL2ljb25zLm1vZHVsZS5qcyIsInN3aXRjaC9zd2l0Y2guY29udHJvbGxlci5qcyIsInN3aXRjaC9zd2l0Y2gubW9kdWxlLmpzIiwiZXhhbXBsZXMvYWNjb3JkaW9uL2FjY29yZGlvbi5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvYWNjb3JkaW9uL2FjY29yZGlvbi5tb2R1bGUuanMiLCJleGFtcGxlcy9hY2NvcmRpb24vYWNjb3JkaW9uLnN0YXRlLmpzIiwiZXhhbXBsZXMvYWxlcnRzL2FsZXJ0cy5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvYWxlcnRzL2FsZXJ0cy5tb2R1bGUuanMiLCJleGFtcGxlcy9hbGVydHMvYWxlcnRzLnN0YXRlLmpzIiwiZXhhbXBsZXMvYmFubmVycy9iYW5uZXJzLmNvbnRyb2xsZXIuanMiLCJleGFtcGxlcy9iYW5uZXJzL2Jhbm5lcnMubW9kdWxlLmpzIiwiZXhhbXBsZXMvYmFubmVycy9iYW5uZXJzLnN0YXRlLmpzIiwiZXhhbXBsZXMvYmMtZGF0ZXBpY2tlci9iYy1kYXRlcGlja2VyLmNvbnRyb2xsZXIuanMiLCJleGFtcGxlcy9iYy1kYXRlcGlja2VyL2JjLWRhdGVwaWNrZXIubW9kdWxlLmpzIiwiZXhhbXBsZXMvYmMtZGF0ZXBpY2tlci9iYy1kYXRlcGlja2VyLnN0YXRlLmpzIiwiZXhhbXBsZXMvYmMtZHJvcGRvd24vYmMtZHJvcGRvd24ubW9kdWxlLmpzIiwiZXhhbXBsZXMvYmMtZHJvcGRvd24vYmMtZHJvcGRvd24uc3RhdGUuanMiLCJleGFtcGxlcy9iYy1wYWdpbmF0aW9uL2JjLXBhZ2luYXRpb24uY29udHJvbGxlci5qcyIsImV4YW1wbGVzL2JjLXBhZ2luYXRpb24vYmMtcGFnaW5hdGlvbi5tb2R1bGUuanMiLCJleGFtcGxlcy9iYy1wYWdpbmF0aW9uL2JjLXBhZ2luYXRpb24uc3RhdGUuanMiLCJleGFtcGxlcy9idXR0b25zL2J1dHRvbnMuY29udHJvbGxlci5qcyIsImV4YW1wbGVzL2J1dHRvbnMvYnV0dG9ucy5tb2R1bGUuanMiLCJleGFtcGxlcy9idXR0b25zL2J1dHRvbnMuc3RhdGUuanMiLCJleGFtcGxlcy9iYy1zZXJ2ZXItdGFibGUvYmMtc2VydmVyLXRhYmxlLmNvbnN0YW50cy5qcyIsImV4YW1wbGVzL2JjLXNlcnZlci10YWJsZS9iYy1zZXJ2ZXItdGFibGUuY29udHJvbGxlci5qcyIsImV4YW1wbGVzL2JjLXNlcnZlci10YWJsZS9iYy1zZXJ2ZXItdGFibGUubW9kdWxlLmpzIiwiZXhhbXBsZXMvYmMtc2VydmVyLXRhYmxlL2JjLXNlcnZlci10YWJsZS5zdGF0ZS5qcyIsImV4YW1wbGVzL2JjLXNlcnZlci10YWJsZS9lMmUtYmFja2VuZC5qcyIsImV4YW1wbGVzL2NhcmRzL2NhcmRzLmNvbnRyb2xsZXIuanMiLCJleGFtcGxlcy9jYXJkcy9jYXJkcy5tb2R1bGUuanMiLCJleGFtcGxlcy9jYXJkcy9jYXJkcy5zdGF0ZS5qcyIsImV4YW1wbGVzL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXIuY29udHJvbGxlci5qcyIsImV4YW1wbGVzL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXIubW9kdWxlLmpzIiwiZXhhbXBsZXMvY29sb3ItcGlja2VyL2NvbG9yLXBpY2tlci5zdGF0ZS5qcyIsImV4YW1wbGVzL2NvcHktY2xpcGJvYXJkL2NvcHktY2xpcGJvYXJkLm1vZHVsZS5qcyIsImV4YW1wbGVzL2NvcHktY2xpcGJvYXJkL2NvcHktY2xpcGJvYXJkLnN0YXRlLmpzIiwiZXhhbXBsZXMvY3JlZGl0LWNhcmQvY3JlZGl0LWNhcmQuY29udHJvbGxlci5qcyIsImV4YW1wbGVzL2NyZWRpdC1jYXJkL2NyZWRpdC1jYXJkLm1vZHVsZS5qcyIsImV4YW1wbGVzL2NyZWRpdC1jYXJkL2NyZWRpdC1jYXJkLnN0YXRlLmpzIiwiZXhhbXBsZXMvZ2xvYmFsLW1lc3NhZ2UvZ2xvYmFsLW1lc3NhZ2UuY29udHJvbGxlci5qcyIsImV4YW1wbGVzL2dsb2JhbC1tZXNzYWdlL2dsb2JhbC1tZXNzYWdlLm1vZHVsZS5qcyIsImV4YW1wbGVzL2dsb2JhbC1tZXNzYWdlL2dsb2JhbC1tZXNzYWdlLnN0YXRlLmpzIiwiZXhhbXBsZXMvbG9hZGluZy1pbmRpY2F0b3JzL2xvYWRpbmctaW5kaWNhdG9ycy5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvbG9hZGluZy1pbmRpY2F0b3JzL2xvYWRpbmctaW5kaWNhdG9ycy5tb2R1bGUuanMiLCJleGFtcGxlcy9sb2FkaW5nLWluZGljYXRvcnMvbG9hZGluZy1pbmRpY2F0b3JzLnN0YXRlLmpzIiwiZXhhbXBsZXMvbW9kYWwvbW9kYWwtY29udGVudC5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvbW9kYWwvbW9kYWwuY29udHJvbGxlci5qcyIsImV4YW1wbGVzL21vZGFsL21vZGFsLm1vZHVsZS5qcyIsImV4YW1wbGVzL21vZGFsL21vZGFsLnN0YXRlLmpzIiwiZXhhbXBsZXMvcGFuZWxzL3BhbmVscy5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvcGFuZWxzL3BhbmVscy5tb2R1bGUuanMiLCJleGFtcGxlcy9wYW5lbHMvcGFuZWxzLnN0YXRlLmpzIiwiZXhhbXBsZXMvcHJvbXB0L3Byb21wdC1jb250ZW50LmNvbnRyb2xsZXIuanMiLCJleGFtcGxlcy9wcm9tcHQvcHJvbXB0LmNvbnRyb2xsZXIuanMiLCJleGFtcGxlcy9wcm9tcHQvcHJvbXB0Lm1vZHVsZS5qcyIsImV4YW1wbGVzL3Byb21wdC9wcm9tcHQuc3RhdGUuanMiLCJleGFtcGxlcy90YWJsZXMvdGFibGVzLmNvbnRyb2xsZXIuanMiLCJleGFtcGxlcy90YWJsZXMvdGFibGVzLm1vZHVsZS5qcyIsImV4YW1wbGVzL3RhYmxlcy90YWJsZXMuc3RhdGUuanMiLCJleGFtcGxlcy90YWJzL3RhYnMuY29udHJvbGxlci5qcyIsImV4YW1wbGVzL3RhYnMvdGFicy5tb2R1bGUuanMiLCJleGFtcGxlcy90YWJzL3RhYnMuc3RhdGUuanMiLCJleGFtcGxlcy90b29sdGlwL3Rvb2x0aXAubW9kdWxlLmpzIiwiZXhhbXBsZXMvdG9vbHRpcC90b29sdGlwLnN0YXRlLmpzIiwiZXhhbXBsZXMvd2FybmluZy1idXR0b24vd2FybmluZy1idXR0b24ubW9kdWxlLmpzIiwiZXhhbXBsZXMvd2FybmluZy1idXR0b24vd2FybmluZy1idXR0b24uc3RhdGUuanMiLCJleGFtcGxlcy9iYy1zZXJ2ZXItdGFibGUvc2VydmljZXMvYmMtc2VydmVyLXRhYmxlLnNhbXBsZS1kYXRhLnNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUN0QixtQkFBbUIsRUFDbkIsZUFBZSxFQUNmLG1CQUFtQixFQUNuQixlQUFlLEVBQ2YsV0FBVzs7O0FBR1gsbUJBQW1CLEVBQ25CLGdCQUFnQixFQUNoQiw2QkFBNkIsRUFDN0IsbUJBQW1CLEVBQ25CLGlCQUFpQixFQUNqQix1QkFBdUIsRUFDdkIscUJBQXFCLEVBQ3JCLHVCQUF1QixFQUN2Qix5QkFBeUIsRUFDekIsaUJBQWlCLEVBQ2pCLGVBQWUsRUFDZiw4QkFBOEIsRUFDOUIsd0JBQXdCLEVBQ3hCLHFCQUFxQixFQUNyQix3QkFBd0IsRUFDeEIsNEJBQTRCLEVBQzVCLGVBQWUsRUFDZixlQUFlLEVBQ2YsZ0JBQWdCLEVBQ2hCLGdCQUFnQixFQUNoQixnQkFBZ0IsRUFDaEIsZ0JBQWdCLEVBQ2hCLGNBQWMsRUFDZCxpQkFBaUIsRUFD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NUQsT0FBTyxDQUFDLFlBQVksRUFBRSxTQUFTLFVBQVUsQ0FBQyxLQUFLLEVBQUU7QUFDOUMsUUFBSSxPQUFPLEdBQUc7QUFDVixxQkFBYSxFQUFFLGFBQWE7S0FDL0IsQ0FBQzs7QUFFRixhQUFTLGFBQWEsQ0FBQyxXQUFXLEVBQUU7QUFDaEMsZUFBTyxLQUFLLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRTtBQUM1QixrQkFBTSxFQUFFLFdBQVc7U0FDdEIsQ0FBQyxDQUNHLElBQUksQ0FBQyxTQUFTLG9CQUFvQixDQUFDLFFBQVEsRUFBRTtBQUMxQyxtQkFBTztBQUNILG9CQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJO0FBQ3hCLDBCQUFVLEVBQUU7QUFDUix3QkFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUk7QUFDbkMseUJBQUssRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLO0FBQ3JDLHlCQUFLLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUTtpQkFDM0M7YUFDSixDQUFDO1NBQ0wsQ0FBQyxDQUFDO0tBQ1Y7O0FBRUQsV0FBTyxPQUFPLENBQUM7Q0FDbEIsQ0FBQyxDQUFDIiwiZmlsZSI6IndlYnNpdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWInLFxuICAgICdtbS5mb3VuZGF0aW9uJyxcbiAgICAnd2Vic2l0ZS10ZW1wbGF0ZXMnLFxuICAgICd1aS5jb2RlbWlycm9yJyxcbiAgICAndWkucm91dGVyJyxcblxuICAgIC8vIEpTIENvbXBvbmVudHNcbiAgICAnd2Vic2l0ZS5hY2NvcmRpb24nLFxuICAgICd3ZWJzaXRlLmFsZXJ0cycsXG4gICAgJ3dlYnNpdGUuYXNpZGUtaGVhZGVyLXRvZ2dsZScsXG4gICAgJ3dlYnNpdGUuYXNpZGUtbmF2JyxcbiAgICAnd2Vic2l0ZS5iYW5uZXJzJyxcbiAgICAnd2Vic2l0ZS5iYy1kYXRlcGlja2VyJyxcbiAgICAnd2Vic2l0ZS5iYy1kcm9wZG93bicsXG4gICAgJ3dlYnNpdGUuYmMtcGFnaW5hdGlvbicsXG4gICAgJ3dlYnNpdGUuYmMtc2VydmVyLXRhYmxlJyxcbiAgICAnd2Vic2l0ZS5idXR0b25zJyxcbiAgICAnd2Vic2l0ZS5jYXJkcycsXG4gICAgJ3dlYnNpdGUuY29sb3ItcGlja2VyLWV4YW1wbGUnLFxuICAgICd3ZWJzaXRlLmNvcHktY2xpcGJvYXJkJyxcbiAgICAnd2Vic2l0ZS5jcmVkaXQtY2FyZCcsXG4gICAgJ3dlYnNpdGUuZ2xvYmFsLW1lc3NhZ2UnLFxuICAgICd3ZWJzaXRlLmxvYWRpbmctaW5kaWNhdG9ycycsXG4gICAgJ3dlYnNpdGUuaWNvbnMnLFxuICAgICd3ZWJzaXRlLm1vZGFsJyxcbiAgICAnd2Vic2l0ZS5wYW5lbHMnLFxuICAgICd3ZWJzaXRlLnByb21wdCcsXG4gICAgJ3dlYnNpdGUuc3dpdGNoJyxcbiAgICAnd2Vic2l0ZS50YWJsZXMnLFxuICAgICd3ZWJzaXRlLnRhYnMnLFxuICAgICd3ZWJzaXRlLnRvb2x0aXAnLFxuICAgICd3ZWJzaXRlLndhcm5pbmctYnV0dG9uJ1xuXSlcbiAgICAuY29uc3RhbnQoJ0JDX0FQUF9DT05GSUcnLCB7fSlcblxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsIHN2Z1Jvb3RQYXRoUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29tcG9uZW50cycsIHtcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB1cmw6ICcvY29tcG9uZW50cycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8dWktdmlldy8+J1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgc3ZnUm9vdFBhdGhQcm92aWRlci5zZXRSb290UGF0aCgnL3N2Zy9pY29ucy8nKTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmFzaWRlLWhlYWRlci10b2dnbGUuY29udHJvbGxlcicsIFtdKVxuXG4gICAgLmNvbnRyb2xsZXIoJ0FzaWRlSGVhZGVyVG9nZ2xlQ3RybCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgY3RybCA9IHRoaXM7XG4gICAgICAgIGN0cmwuY2xpY2tIYW5kbGVyID0gY2xpY2tIYW5kbGVyO1xuICAgICAgICBjdHJsLmlzT3BlbiA9IGZhbHNlO1xuICAgICAgICBjdHJsLnNldElzT3BlbiA9IHNldElzT3BlbjtcblxuICAgICAgICBmdW5jdGlvbiBjbGlja0hhbmRsZXIoJGV2ZW50KSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlmIChjdHJsLmlzT3Blbil7XG4gICAgICAgICAgICAgICAgY3RybC5zZXRJc09wZW4oZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjdHJsLnNldElzT3Blbih0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldElzT3Blbih2YWx1ZSkge1xuICAgICAgICAgICAgY3RybC5pc09wZW4gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYXNpZGUtaGVhZGVyLXRvZ2dsZS5kaXJlY3RpdmUnLCBbXG4gICAgICAgICd3ZWJzaXRlLmFzaWRlLWhlYWRlci10b2dnbGUuY29udHJvbGxlcidcbiAgICBdKVxuICAgIC5kaXJlY3RpdmUoJ2FzaWRlSGVhZGVyVG9nZ2xlJywgICgpID0+IHtcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQXNpZGVIZWFkZXJUb2dnbGVDdHJsJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2FzaWRlSGVhZGVyVG9nZ2xlQ3RybCcsXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICc9J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvYXNpZGVIZWFkZXJUb2dnbGUvYXNpZGVIZWFkZXJUb2dnbGUudHBsLmh0bWwnXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5hc2lkZS1oZWFkZXItdG9nZ2xlJywgW1xuICAgICd3ZWJzaXRlLmFzaWRlLWhlYWRlci10b2dnbGUuZGlyZWN0aXZlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5hc2lkZS1uYXYuY29udHJvbGxlcicsIFtdKVxuICAgIC5jb250cm9sbGVyKCdBc2lkZU5hdkN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICR3aW5kb3cpIHtcbiAgICBcdCRzY29wZS5pc0FjdGl2ZSA9IGZ1bmN0aW9uICh2aWV3TG9jYXRpb24pIHtcbiAgICBcdFx0cmV0dXJuICh2aWV3TG9jYXRpb24gPT09ICR3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpO1xuXHRcdH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5hc2lkZS1uYXYnLCBbXG4gICAgJ3dlYnNpdGUuYXNpZGUtbmF2LmNvbnRyb2xsZXInXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmljb25zLmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdJY29uc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgICAgJHNjb3BlLmljb25zID0gd2luZG93Lmljb25zO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuaWNvbnMuZGlyZWN0aXZlJywgW1xuICAgICAgICAnd2Vic2l0ZS5pY29ucy5jb250cm9sbGVyJ1xuICAgIF0pXG4gICAgLmRpcmVjdGl2ZSgnaWNvbnNMaXN0JywgZnVuY3Rpb24gYmNJY29uRGlyZWN0aXZlKCkge1xuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvaWNvbnMvaWNvbnMudHBsLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0ljb25zQ3RybCBhcyBpY29uc0N0cmwnXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5pY29ucycsIFtcbiAgICAnd2Vic2l0ZS5pY29ucy5kaXJlY3RpdmUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnN3aXRjaC5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignUGF0dGVybkxhYlN3aXRjaEN0cmwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGN0cmwgPSB0aGlzO1xuXG4gICAgICAgIGN0cmwuc3dpdGNoT25lID0gZmFsc2U7XG4gICAgICAgIGN0cmwuc3dpdGNoVHdvID0gdHJ1ZTtcbiAgICAgICAgY3RybC5zd2l0Y2hUaHJlZSA9IGZhbHNlO1xuICAgICAgICBjdHJsLnN3aXRjaEZvdXIgPSB0cnVlO1xuICAgICAgICBjdHJsLnN3aXRjaEZpdmUgPSBmYWxzZTtcbiAgICAgICAgY3RybC5zd2l0Y2hTaXggPSBmYWxzZTtcbiAgICAgICAgY3RybC5pc1N3aXRjaFNpeERpc2FibGVkID0gdHJ1ZTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnN3aXRjaCcsIFtcbiAgICAnd2Vic2l0ZS5zd2l0Y2guY29udHJvbGxlcidcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYWNjb3JkaW9uLmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdBY2NvcmRpb25DdHJsJywgZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgICRzY29wZS5vbmVBdEFUaW1lID0gdHJ1ZTtcblxuICAgICAgICAkc2NvcGUuZ3JvdXBzID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAnZHluYW1pYy0xJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJEeW5hbWljIEdyb3VwIEhlYWRlciAtIDFcIixcbiAgICAgICAgICAgICAgICBjb250ZW50OiBcIkR5bmFtaWMgR3JvdXAgQm9keSAtIDFcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJ2R5bmFtaWMtMicsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiRHluYW1pYyBHcm91cCBIZWFkZXIgLSAyXCIsXG4gICAgICAgICAgICAgICAgY29udGVudDogXCJEeW5hbWljIEdyb3VwIEJvZHkgLSAyXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcblxuICAgICAgICAkc2NvcGUuaXRlbXMgPSBbJ0l0ZW0gMScsICdJdGVtIDInLCAnSXRlbSAzJ107XG5cbiAgICAgICAgJHNjb3BlLmFkZEl0ZW0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBuZXdJdGVtTm8gPSAkc2NvcGUuaXRlbXMubGVuZ3RoICsgMTtcbiAgICAgICAgICAgICRzY29wZS5pdGVtcy5wdXNoKCdJdGVtICcgKyBuZXdJdGVtTm8pO1xuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYWNjb3JkaW9uJywgW1xuICAgICd3ZWJzaXRlLmFjY29yZGlvbi5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYWNjb3JkaW9uLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICd3ZWJzaXRlLmFjY29yZGlvbi5jb250cm9sbGVyJ1xuXSlcblxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29tcG9uZW50cy5hY2NvcmRpb24nLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2FjY29yZGlvbicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9hY2NvcmRpb24vYWNjb3JkaW9uLnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQWNjb3JkaW9uQ3RybCBhcyBhY2NvcmRpb25DdHJsJ1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5hbGVydHMuY29udHJvbGxlcicsIFtdKVxuXG4gICAgLmNvbnRyb2xsZXIoJ0FsZXJ0c0N0cmwnLCBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgICAgJHNjb3BlLmFsZXJ0cyA9IFtcbiAgICAgICAgICAgIHsgbXNnOiAnR2VuZXJpYyBhbGVydCcgfSxcbiAgICAgICAgICAgIHsgdHlwZTogJ2luZm8nLCBtc2c6ICdJbmZvcm1hdGlvbmFsIGFsZXJ0JyB9LFxuICAgICAgICAgICAgeyB0eXBlOiAnc3VjY2VzcycsIG1zZzogJ1N1Y2Nlc3MgYWxlcnQnIH0sXG4gICAgICAgICAgICB7IHR5cGU6ICd3YXJuaW5nJywgbXNnOiAnV2FybmluZyBhbGVydCcgfSxcbiAgICAgICAgICAgIHsgdHlwZTogJ2Vycm9yJywgbXNnOiAnRXJyb3IgYWxlcnQnIH1cbiAgICAgICAgXTtcblxuICAgICAgICAkc2NvcGUub3BlbkFsZXJ0ID0gIHsgdHlwZTogJ2Vycm9yJywgbXNnOiAnRXJyb3IgYWxlcnQgaW4gYSBwYW5lbCcgfTtcblxuICAgICAgICAkc2NvcGUuYWRkQWxlcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5hbGVydHMucHVzaCh7bXNnOiAnQW5vdGhlciBnZW5lcmljIGFsZXJ0ISd9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuY2xvc2VBbGVydCA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICAkc2NvcGUuYWxlcnRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5hbGVydHMnLCBbXG4gICAgJ3dlYnNpdGUuYWxlcnRzLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5hbGVydHMuc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUuYWxlcnRzLmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLmFsZXJ0cycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYWxlcnRzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL2FsZXJ0cy9hbGVydHMudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBbGVydHNDdHJsIGFzIGFsZXJ0c0N0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmJhbm5lcnMuY29udHJvbGxlcicsIFtdKVxuXG4gICAgLmNvbnRyb2xsZXIoJ0Jhbm5lcnNDdHJsJywgZnVuY3Rpb24oKSB7XG5cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmJhbm5lcnMnLCBbXG4gICAgJ3dlYnNpdGUuYmFubmVycy5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmFubmVycy5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnd2Vic2l0ZS5iYW5uZXJzLmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLmJhbm5lcnMnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2Jhbm5lcnMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvYmFubmVycy9iYW5uZXJzLnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQmFubmVyc0N0cmwgYXMgYmFubmVyc0N0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmJjLWRhdGVwaWNrZXIuY29udHJvbGxlcicsIFtdKVxuICAgIC5jb250cm9sbGVyKCdCY0RhdGVwaWNrZXJDdHJsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjdHJsID0gdGhpcztcblxuICAgICAgICBjdHJsLm9wdGlvbnMgPSB7fTtcbiAgICB9KTtcblxuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmMtZGF0ZXBpY2tlcicsIFtcbiAgICAnd2Vic2l0ZS5iYy1kYXRlcGlja2VyLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5iYy1kYXRlcGlja2VyLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICd3ZWJzaXRlLmJjLWRhdGVwaWNrZXIuY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMuYmMtZGF0ZXBpY2tlcicsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYmMtZGF0ZXBpY2tlcicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9iYy1kYXRlcGlja2VyL2JjLWRhdGVwaWNrZXIudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCY0RhdGVwaWNrZXJDdHJsIGFzIGJjRGF0ZXBpY2tlckN0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmJjLWRyb3Bkb3duJywgW1xuICAgICd3ZWJzaXRlLmJjLWRyb3Bkb3duLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5iYy1kcm9wZG93bi5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJ1xuXSlcblxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29tcG9uZW50cy5iYy1kcm9wZG93bicsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYmMtZHJvcGRvd24nLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvYmMtZHJvcGRvd24vYmMtZHJvcGRvd24udHBsLmh0bWwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmJjLXBhZ2luYXRpb24uY29udHJvbGxlcicsIFtdKVxuXG4gICAgLmNvbnRyb2xsZXIoJ0JjUGFnaW5hdGlvbkN0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRsb2cpIHtcbiAgICAgICAgJHNjb3BlLnRvdGFsSXRlbXMgPSAyMDA7XG4gICAgICAgICRzY29wZS5jdXJyZW50UGFnZSA9IDE7XG4gICAgICAgICRzY29wZS5tYXhTaXplID0gNTtcbiAgICAgICAgJHNjb3BlLml0ZW1zUGVyUGFnZSA9IDEwO1xuICAgICAgICAkc2NvcGUuc2hvd0xpbWl0cyA9IGZhbHNlO1xuXG4gICAgICAgICRzY29wZS5vblNlbGVjdFBhZ2UgPSBmdW5jdGlvbihuZXdWYWx1ZXMpIHtcbiAgICAgICAgICAgICRsb2cubG9nKCdOZXcgVmFsdWVzIENvbWJvOiAnLCBuZXdWYWx1ZXMpO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5zZXRQYWdlID0gZnVuY3Rpb24ocGFnZU5vKSB7XG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudFBhZ2UgPSBwYWdlTm87XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmN1c3RvbUxpbWl0cyA9IFsxMCwgMjAsIDMwLCAxMDBdO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmMtcGFnaW5hdGlvbicsIFtcbiAgICAnd2Vic2l0ZS5iYy1wYWdpbmF0aW9uLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5iYy1wYWdpbmF0aW9uLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICd3ZWJzaXRlLmJjLXBhZ2luYXRpb24uY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMuYmMtcGFnaW5hdGlvbicsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYmMtcGFnaW5hdGlvbicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9iYy1wYWdpbmF0aW9uL2JjLXBhZ2luYXRpb24udHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCY1BhZ2luYXRpb25DdHJsIGFzIGJjUGFnaW5hdGlvbkN0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmJ1dHRvbnMuY29udHJvbGxlcicsIFtdKVxuXG4gICAgLmNvbnRyb2xsZXIoJ0J1dHRvbnNDdHJsJywgZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgICRzY29wZS5zaW5nbGVNb2RlbCA9IDE7XG5cbiAgICAgICAgJHNjb3BlLnJhZGlvTW9kZWwgPSAnTWlkZGxlJztcblxuICAgICAgICAkc2NvcGUuY2hlY2tNb2RlbCA9IHtcbiAgICAgICAgICAgIGxlZnQ6IGZhbHNlLFxuICAgICAgICAgICAgbWlkZGxlOiB0cnVlLFxuICAgICAgICAgICAgcmlnaHQ6IGZhbHNlXG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5idXR0b25zJywgW1xuICAgICd3ZWJzaXRlLmJ1dHRvbnMuc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmJ1dHRvbnMuc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUuYnV0dG9ucy5jb250cm9sbGVyJ1xuXSlcblxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29tcG9uZW50cy5idXR0b25zJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9idXR0b25zJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL2J1dHRvbnMvYnV0dG9ucy50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0J1dHRvbnNDdHJsIGFzIGJ1dHRvbnNDdHJsJ1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5iYy1zZXJ2ZXItdGFibGUuY29uc3RhbnRzJywgW10pXG4gICAgLmNvbnN0YW50KCdERU1PX1RBQkxFX0NPTkZJRycsIHtcbiAgICAgICAgcXVlcnlLZXlzOiB7XG4gICAgICAgICAgICBwYWdlOiAncGFnZScsXG4gICAgICAgICAgICBsaW1pdDogJ2xpbWl0JyxcbiAgICAgICAgICAgIHNvcnRCeTogJ3NvcnQtYnknLFxuICAgICAgICAgICAgc29ydERpcjogJ3NvcnQtb3JkZXInXG4gICAgICAgIH0sXG4gICAgICAgIHNvcnREaXJWYWx1ZXM6IHtcbiAgICAgICAgICAgIGFzYzogJ2FzYycsXG4gICAgICAgICAgICBkZXNjOiAnZHNjJ1xuICAgICAgICB9LFxuICAgICAgICBmaWx0ZXJzOiBbJ3RpbWUnXSxcbiAgICAgICAgcm93SWRLZXk6ICduYW1lJ1xuICAgIH0pXG4gICAgLmNvbnN0YW50KCdERU1PX1RBQkxFX0lEJywgJ2RlbW8tdGFibGUnKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmJjLXNlcnZlci10YWJsZS5jb250cm9sbGVyJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUnLFxuICAgICdlMmUtYmFja2VuZCdcbl0pXG5cbiAgICAuY29udHJvbGxlcignQmNTZXJ2ZXJUYWJsZURlbW9DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIGJjU2VydmVyVGFibGVGYWN0b3J5LCBkYXRhVGFibGUsIERFTU9fVEFCTEVfSUQpIHtcbiAgICAgICAgdmFyIGN0cmwgPSB0aGlzO1xuXG4gICAgICAgIGN0cmwuY2xlYXJUYWJsZSA9IGNsZWFyVGFibGU7XG4gICAgICAgIGN0cmwuYmNTZXJ2ZXJUYWJsZSA9IGJjU2VydmVyVGFibGVGYWN0b3J5LmdldChERU1PX1RBQkxFX0lEKTtcblxuICAgICAgICAvLyBUaGlzIG5lZWRzIHRvIGJlIGhlcmUgdW50aWwgdGhlIHBhZ2luYXRpb24gZGlyZWN0aXZlIGlzIHVwZGF0ZWRcbiAgICAgICAgLy8gdG8gcHJlc2VydmUgY29udGV4dCB3aGVuIGNhbGxpbmcgdGhlIG9uLWNoYW5nZSBmdW5jdGlvbi5cbiAgICAgICAgY3RybC5iY1NlcnZlclRhYmxlLnVwZGF0ZVBhZ2UgPSBfLmJpbmQoY3RybC5iY1NlcnZlclRhYmxlLnVwZGF0ZVBhZ2UsIGN0cmwuYmNTZXJ2ZXJUYWJsZSk7XG5cbiAgICAgICAgZnVuY3Rpb24gY2xlYXJUYWJsZSgkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCRzdGF0ZS5jdXJyZW50Lm5hbWUsIHsgcGFnZTogMSB9LCB7IGluaGVyaXQ6IGZhbHNlIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5iYy1zZXJ2ZXItdGFibGUnLCBbXG4gICAgJ3dlYnNpdGUuYmMtc2VydmVyLXRhYmxlLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5iYy1zZXJ2ZXItdGFibGUuc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUuYmMtc2VydmVyLXRhYmxlLmNvbnN0YW50cycsXG4gICAgJ3dlYnNpdGUuYmMtc2VydmVyLXRhYmxlLmNvbnRyb2xsZXInLFxuICAgICd3ZWJzaXRlLmJjLXNlcnZlci10YWJsZS5zYW1wbGUtZGF0YS5zZXJ2aWNlJ1xuXSlcblxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29tcG9uZW50cy5iYy1zZXJ2ZXItdGFibGUnLCB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0JjU2VydmVyVGFibGVEZW1vQ3RybCBhcyBiY1NlcnZlclRhYmxlRGVtb0N0cmwnLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVRhYmxlOiBmdW5jdGlvbiBkYXRhVGFibGVSZXNvbHZlKCRzdGF0ZVBhcmFtcywgYmNTZXJ2ZXJUYWJsZUZhY3RvcnksIERFTU9fVEFCTEVfQ09ORklHLCBERU1PX1RBQkxFX0lELCBzYW1wbGVEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmNTZXJ2ZXJUYWJsZUZhY3RvcnlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3JlYXRlKERFTU9fVEFCTEVfSUQsIERFTU9fVEFCTEVfQ09ORklHKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5pbml0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVQYXJhbXM6ICRzdGF0ZVBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VDYWxsYmFjazogc2FtcGxlRGF0YS5nZXRTYW1wbGVEYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvYmMtc2VydmVyLXRhYmxlL2JjLXNlcnZlci10YWJsZS50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnL2JjLXNlcnZlci10YWJsZT9zb3J0LW9yZGVyJnNvcnQtYnkmcGFnZSZsaW1pdCZ0aW1lJm5hbWUnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdlMmUtYmFja2VuZCcsIFtcbiAgICAnbmdNb2NrRTJFJ1xuXSlcbiAgICAucnVuKGZ1bmN0aW9uKCRodHRwQmFja2VuZCkge1xuICAgICAgICAkaHR0cEJhY2tlbmQud2hlbkdFVCgvXFwvdGFibGUuanNvbi4qLykucmVzcG9uZChhcGlSZXNwb25zZSk7XG4gICAgICAgICRodHRwQmFja2VuZC53aGVuR0VUKC8uKi8pLnBhc3NUaHJvdWdoKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYXBpUmVzcG9uc2Uoc3RhdHVzLCBkYXRhKSB7XG4gICAgICAgICAgICB2YXIgaXRlbXMsIHBhZ2luYXRpb24sIHJvd3MsIHJvd1RvU2hvdywgc29ydEJ5LCBmcm9tUm93LCB0b1JvdywgbGltaXQsIHBhZ2U7XG4gICAgICAgICAgICByb3dzID0gW1xuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnUml0dWFsIENvZmZlZSBSb2FzdGVycycsICdzdGFyJzogJ+KYheKYheKYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdIYXllcyBWYWxsZXknfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0JsdWUgQm90dGxlJywgJ3N0YXInOiAn4piF4piF4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ0hheWVzIFZhbGxleScgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0NvZmZlZVNob3AnLCAnc3Rhcic6ICfimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnQmVybmFsIEhlaWdodHMnIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdTcGlrZVxcJ3MgQ29mZmVlICYgVGVhcycsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdDYXN0cm8nIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdMYSBCb3VsYW5nZScsICdzdGFyJzogJ+KYheKYhScsICdzZi1sb2NhdGlvbic6ICdDb2xlIFZhbGxleScgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0R5bmFtbyBEb251dCBhbmQgQ29mZmVlJywgJ3N0YXInOiAn4piF4piF4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ0NvdyBIb2xsb3cnIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdUaGUgTWlsbCcsICdzdGFyJzogJ+KYheKYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdEaXZpc2FkZXJvJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnUGljY2lubyBDb2ZmZWUgQmFyJywgJ3N0YXInOiAn4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ0RvZ3BhdGNoJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnUGhpbHonLCAnc3Rhcic6ICfimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnRG93bnRvd24nIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdEdWJvY2UgUGFyayBDYWZlJywgJ3N0YXInOiAn4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ0R1Ym9jZSBUcmlhbmdsZScgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0JsdWUgQm90dGxlJywgJ3N0YXInOiAn4piF4piF4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ0VtYmFyY2FkZXJvJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnRm91ciBCYXJyZWwnLCAnc3Rhcic6ICfimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnRXhjZWxzaW9yJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnQ29mZmVlIEJhcicsICdzdGFyJzogJ+KYheKYheKYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdGaURpJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnQmlzY29mZiBDb2ZmZWUgQ29ybmVyJywgJ3N0YXInOiAn4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ0Zpc2hlcm1hblxcJ3MgV2hhcmYnIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdGaWZ0eS9GaWZ0eSBDb2ZmZWUgYW5kIFRlYScsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdJbm5lciBSaWNobW9uZCcgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0JlYW5lcnknLCAnc3Rhcic6ICfimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnSW5uZXIgU3Vuc2V0JyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnQ2FmZSBkdSBTb2xlaWwnLCAnc3Rhcic6ICfimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnTG93ZXIgSGFpZ2h0JyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnUGVldFxcJ3MnLCAnc3Rhcic6ICfimIUnLCAnc2YtbG9jYXRpb24nOiAnVGhlIE1hcmluYScgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ1NpZ2h0Z2xhc3MnLCAnc3Rhcic6ICfimIXimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnVGhlIE1pc3Npb24nIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdDb250cmFiYW5kIENvZmZlZSBCYXInLCAnc3Rhcic6ICfimIXimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnTm9iIEhpbGwnIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdNYXJ0aGEgJiBCcm9zIENvZmZlZScsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdOb2UgVmFsbGV5JyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnUsOpdmVpbGxlJywgJ3N0YXInOiAn4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ05vcnRoIEJlYWNoJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnQ3VwIENvZmZlZSBCYXInLCAnc3Rhcic6ICfimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnT3V0ZXIgTWlzc2lvbicgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0dhcmRlbiBIb3VzZSBDYWZlJywgJ3N0YXInOiAn4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ091dGVyIFJpY2htb25kJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnQW5keXRvd24gQ29mZmVlIFJvYXN0ZXJzJywgJ3N0YXInOiAn4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ091dGVyIFN1bnNldCcgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0phbmUgb24gRmlsbG1vcmUnLCAnc3Rhcic6ICfimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnUGFjaWZpYyBIZWlnaHRzJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnU2FpbnQgRnJhbmsgQ29mZmVlJywgJ3N0YXInOiAn4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ1BvbGsnIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdGYXJsZXnigJlzJywgJ3N0YXInOiAn4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ1BvdHJlcm8gSGlsbCcgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0hvdXNlIG9mIFNuYWNrcycsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdUaGUgUHJlc2lkaW8nIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdUaGUgQnJldycsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdSdXNzaWFuIEhpbGwnIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdXaWNrZWQgR3JvdW5kcycsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdTT01BJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnU3RhcmJ1Y2tzJywgJ3N0YXInOiAn4piFJywgJ3NmLWxvY2F0aW9uJzogJ1VuaW9uIFNxdWFyZScgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0ZseXdoZWVsIENvZmZlZSBSb2FzdGVycycsICdzdGFyJzogJ+KYheKYheKYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdVcHBlciBIYWlnaHQnIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBsaW1pdCA9IHBhcnNlSW50KGdldFBhcmFtZXRlckJ5TmFtZSgnbGltaXQnKSwgMTApIHx8IDExO1xuICAgICAgICAgICAgcGFnZSA9IHBhcnNlSW50KGdldFBhcmFtZXRlckJ5TmFtZSgncGFnZScpLCAxMCkgfHwgMTtcblxuICAgICAgICAgICAgaWYgKGdldFBhcmFtZXRlckJ5TmFtZSgnc29ydC1ieScpKSB7XG4gICAgICAgICAgICAgICAgc29ydEJ5ID0gZ2V0UGFyYW1ldGVyQnlOYW1lKCdzb3J0LWJ5Jyk7XG4gICAgICAgICAgICAgICAgaWYgKGdldFBhcmFtZXRlckJ5TmFtZSgnc29ydC1vcmRlcicpID09PSAnZHNjJykge1xuICAgICAgICAgICAgICAgICAgICBzb3J0QnkgPSAnLScgKyBzb3J0Qnk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJvd3Muc29ydChkeW5hbWljU29ydChzb3J0QnkpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGFnaW5hdGlvbiA9IHtcbiAgICAgICAgICAgICAgICAnbGltaXQnOiBsaW1pdCxcbiAgICAgICAgICAgICAgICAncGFnZSc6IHBhZ2UsXG4gICAgICAgICAgICAgICAgJ3BhZ2VzJzogTWF0aC5jZWlsKHJvd3MubGVuZ3RoIC8gbGltaXQpLFxuICAgICAgICAgICAgICAgICdudW1JdGVtcyc6IHJvd3MubGVuZ3RoXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdG9Sb3cgPSBwYWdpbmF0aW9uLmxpbWl0ICogcGFnaW5hdGlvbi5wYWdlO1xuICAgICAgICAgICAgZnJvbVJvdyA9IHRvUm93IC0gcGFnaW5hdGlvbi5saW1pdDtcblxuICAgICAgICAgICAgaWYgKGZyb21Sb3cgPj0gMCAmJiB0b1JvdyA+PSAwKSB7XG4gICAgICAgICAgICAgICAgcm93VG9TaG93ID0gcm93cy5zbGljZShmcm9tUm93LCB0b1Jvdyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJvd1RvU2hvdyA9IHJvd3M7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGl0ZW1zID0ge1xuICAgICAgICAgICAgICAgICdyb3dzJzogcm93VG9TaG93LFxuICAgICAgICAgICAgICAgICdwYWdpbmF0aW9uJzogcGFnaW5hdGlvbixcbiAgICAgICAgICAgICAgICAnc29ydC1ieSc6IGdldFBhcmFtZXRlckJ5TmFtZSgnc29ydC1ieScpLFxuICAgICAgICAgICAgICAgICdzb3J0LW9yZGVyJzogZ2V0UGFyYW1ldGVyQnlOYW1lKCdzb3J0LW9yZGVyJylcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGR5bmFtaWNTb3J0KHByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNvcnRPcmRlciA9IDE7XG4gICAgICAgICAgICAgICAgaWYocHJvcGVydHlbMF0gPT09ICctJykge1xuICAgICAgICAgICAgICAgICAgICBzb3J0T3JkZXIgPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkgPSBwcm9wZXJ0eS5zdWJzdHIoMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYSxiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSAoYVtwcm9wZXJ0eV0gPCBiW3Byb3BlcnR5XSkgPyAtMSA6IChhW3Byb3BlcnR5XSA+IGJbcHJvcGVydHldKSA/IDEgOiAwO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0ICogc29ydE9yZGVyO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldFBhcmFtZXRlckJ5TmFtZShuYW1lKSB7XG4gICAgICAgICAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvW1xcW10vLCAnXFxcXFsnKS5yZXBsYWNlKC9bXFxdXS8sICdcXFxcXScpO1xuICAgICAgICAgICAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoJ1tcXFxcPyZdJyArIG5hbWUgKyAnPShbXiYjXSopJyksXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMgPSByZWdleC5leGVjKGRhdGEpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRzID09PSBudWxsID8gJycgOiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1sxXS5yZXBsYWNlKC9cXCsvZywgJyAnKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBbMjAwLCBpdGVtcywge31dO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5jYXJkcy5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignQ2FyZHNDdHJsJywgZnVuY3Rpb24oKSB7XG5cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmNhcmRzJywgW1xuICAgICd3ZWJzaXRlLmNhcmRzLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5jYXJkcy5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnd2Vic2l0ZS5jYXJkcy5jb250cm9sbGVyJ1xuXSlcblxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29tcG9uZW50cy5jYXJkcycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvY2FyZHMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvY2FyZHMvY2FyZHMudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDYXJkc0N0cmwgYXMgY2FyZHNDdHJsJ1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5jb2xvci1waWNrZXItZXhhbXBsZS5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignQ29sb3JQaWNrZXJFeGFtcGxlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgICAkc2NvcGUubW9kZWxWYWx1ZSA9ICcjY2NjY2NjJztcblxuICAgICAgICAkc2NvcGUucGFsZXR0ZSA9IFtcbiAgICAgICAgICAgICcjMDBBQkM5JyxcbiAgICAgICAgICAgICcjOTVkYjg5JyxcbiAgICAgICAgICAgICcjZmZiODAwJyxcbiAgICAgICAgICAgICcjZGI2MzZiJyxcbiAgICAgICAgICAgICcjNTU2MjczJyxcbiAgICAgICAgICAgICcjMjMyODMxJyxcbiAgICAgICAgICAgICcjYjE4NmNiJyxcbiAgICAgICAgICAgICcjZmY4ODAwJyxcbiAgICAgICAgICAgICcjM2U2MmExJyxcbiAgICAgICAgICAgICcjZTg5ZmFlJyxcbiAgICAgICAgICAgICcjNkVDQ0ZDJ1xuICAgICAgICBdO1xuXG4gICAgICAgICRzY29wZS5pbnB1dE1vZGVsVmFsdWUgPSAnIzZFQ0NGQyc7XG4gICAgICAgICRzY29wZS5pbnB1dExhYmVsVGV4dCA9ICdJbnB1dCBMYWJlbCBUZXh0JztcbiAgICAgICAgJHNjb3BlLmlucHV0UGxhY2Vob2xkZXJUZXh0ID0gJ0lucHV0IFBsYWNlaG9sZGVyIFRleHQnO1xuICAgICAgICAkc2NvcGUuaW5wdXRQYWxldHRlID0gW1xuICAgICAgICAgICAgJyM2RUNDRkMnLFxuICAgICAgICAgICAgJyMwMEFCQzknLFxuICAgICAgICAgICAgJyNFNUY2RjknLFxuICAgICAgICAgICAgJyM5NURCODknLFxuICAgICAgICAgICAgJyNGRkI4MDAnXG4gICAgICAgIF07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5jb2xvci1waWNrZXItZXhhbXBsZScsIFtcbiAgICAnd2Vic2l0ZS5jb2xvci1waWNrZXItZXhhbXBsZS5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuY29sb3ItcGlja2VyLWV4YW1wbGUuc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUuY29sb3ItcGlja2VyLWV4YW1wbGUuY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMuY29sb3ItcGlja2VyLWV4YW1wbGUnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2NvbG9yLXBpY2tlcicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9jb2xvci1waWNrZXIvY29sb3ItcGlja2VyLnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ29sb3JQaWNrZXJFeGFtcGxlQ3RybCBhcyBjb2xvclBpY2tlckV4YW1wbGVDdHJsJ1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5jb3B5LWNsaXBib2FyZCcsIFtcbiAgICAnd2Vic2l0ZS5jb3B5LWNsaXBib2FyZC5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuY29weS1jbGlwYm9hcmQuc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG5dKVxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29tcG9uZW50cy5jb3B5LWNsaXBib2FyZCcsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvY29weS1jbGlwYm9hcmQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvY29weS1jbGlwYm9hcmQvY29weS1jbGlwYm9hcmQudHBsLmh0bWwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmNyZWRpdC1jYXJkLmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdDcmVkaXRDYXJkQ3RybCcsIGZ1bmN0aW9uIENyZWRpdENhcmRDdHJsKCkge1xuICAgICAgICB2YXIgY3RybCA9IHRoaXM7XG5cbiAgICAgICAgY3RybC5jY0RhdGEgPSB7XG4gICAgICAgICAgICBjY051bWJlcjogJycsXG4gICAgICAgICAgICBjY0N2djogJycsXG4gICAgICAgICAgICBjY05hbWU6ICcnLFxuICAgICAgICAgICAgY2NFeHBpcnk6IHtcbiAgICAgICAgICAgICAgICBtb250aDogJycsXG4gICAgICAgICAgICAgICAgeWVhcjogJydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjY1R5cGU6ICcnLFxuICAgICAgICB9O1xuXG4gICAgICAgIGN0cmwuY2NDb25maWcgPSB7XG4gICAgICAgICAgICBjYXJkQ29kZTogdHJ1ZSxcbiAgICAgICAgICAgIGZ1bGxOYW1lOiB0cnVlLFxuICAgICAgICAgICAgc3VwcG9ydGVkVHlwZXM6IFsnQW1lcmljYW4gRXhwcmVzcycsICdEaW5lcnMgQ2x1YicsICdEaXNjb3ZlcicsICdNYXN0ZXJDYXJkJywgJ1Zpc2EnXSxcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmNyZWRpdC1jYXJkJywgW1xuICAgICd3ZWJzaXRlLmNyZWRpdC1jYXJkLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5jcmVkaXQtY2FyZC5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnd2Vic2l0ZS5jcmVkaXQtY2FyZC5jb250cm9sbGVyJ1xuXSlcblxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29tcG9uZW50cy5jcmVkaXQtY2FyZCcsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvY3JlZGl0LWNhcmQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvY3JlZGl0LWNhcmQvY3JlZGl0LWNhcmQudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDcmVkaXRDYXJkQ3RybCBhcyBjcmVkaXRDYXJkQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuZ2xvYmFsLW1lc3NhZ2UuY29udHJvbGxlcicsIFtdKVxuXG4gICAgLmNvbnRyb2xsZXIoJ0dsb2JhbE1lc3NhZ2VDdHJsJywgZnVuY3Rpb24oKSB7XG5cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmdsb2JhbC1tZXNzYWdlJywgW1xuICAgICd3ZWJzaXRlLmdsb2JhbC1tZXNzYWdlLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5nbG9iYWwtbWVzc2FnZS5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnd2Vic2l0ZS5nbG9iYWwtbWVzc2FnZS5jb250cm9sbGVyJ1xuXSlcblxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29tcG9uZW50cy5nbG9iYWwtbWVzc2FnZScsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvZ2xvYmFsLW1lc3NhZ2UnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvZ2xvYmFsLW1lc3NhZ2UvZ2xvYmFsLW1lc3NhZ2UudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdHbG9iYWxNZXNzYWdlQ3RybCBhcyBnbG9iYWxNZXNzYWdlQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUubG9hZGluZy1pbmRpY2F0b3JzLmNvbnRyb2xsZXInLCBbXSlcbiAgICAuY29udHJvbGxlcignTG9hZGluZ0luZGljYXRvcnNDdHJsJywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHRpbWVvdXQpIHtcblxuICAgICAgICB2YXIgY3RybCA9IHRoaXM7XG5cbiAgICAgICAgY3RybC5mYWtlSHR0cFJlcXVlc3QgPSBmYWtlSHR0cFJlcXVlc3Q7XG4gICAgICAgIGN0cmwuZmFrZVN0YXRlVHJhbnNpdGlvbiA9IGZha2VTdGF0ZVRyYW5zaXRpb247XG4gICAgICAgIGN0cmwudG9nZ2xlTWFudWFsTG9hZGluZyA9IHRvZ2dsZU1hbnVhbExvYWRpbmc7XG5cbiAgICAgICAgZnVuY3Rpb24gZmFrZUh0dHBSZXF1ZXN0KCkge1xuICAgICAgICAgICAgLy8gSGVyZSB3ZSBhcmUgZW1pdHRpbmcgdGhlIGV2ZW50IG1hbnVhbGx5LCBpbiBhIHJlYWwgc2NlbmFyaW9cbiAgICAgICAgICAgIC8vIHlvdSBzaG91bGQgaW5qZWN0IHRoZSBhamF4UmVxdWVzdFN0YXR1cyBodHRwSW50ZXJjZXB0b3IgZnJvbSBuZy1jb21tb25cbiAgICAgICAgICAgIC8vIHdoaWNoIHdpbGwgZW1pdCB0aGVzZSBldmVudHMgYXV0b21hdGljYWxseSBvbiBub3JtYWwgJGh0dHAgcmVxdWVzdHNcbiAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoJ2FqYXhSZXF1ZXN0UnVubmluZycsIHRydWUpO1xuXG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KCdhamF4UmVxdWVzdFJ1bm5pbmcnLCBmYWxzZSk7XG4gICAgICAgICAgICB9LCAzMDAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZha2VTdGF0ZVRyYW5zaXRpb24oKSB7XG4gICAgICAgICAgICAvLyBIZXJlIHdlIGFyZSBlbWl0dGluZyB0aGUgZXZlbnQgbWFudWFsbHksIGluIGEgcmVhbCBzY2VuYXJpb1xuICAgICAgICAgICAgLy8geW91IHdvdWxkbnQgZG8gdGhpcy5cbiAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoJyRzdGF0ZUNoYW5nZVN0YXJ0JywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBmYWxzZSk7XG4gICAgICAgICAgICB9LCAzMDAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZU1hbnVhbExvYWRpbmcoKSB7XG4gICAgICAgICAgICBjdHJsLm1hbnVhbExvYWRpbmcgPSAhY3RybC5tYW51YWxMb2FkaW5nO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5sb2FkaW5nLWluZGljYXRvcnMnLCBbXG4gICAgJ3dlYnNpdGUubG9hZGluZy1pbmRpY2F0b3JzLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5sb2FkaW5nLWluZGljYXRvcnMuc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUubG9hZGluZy1pbmRpY2F0b3JzLmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLmxvYWRpbmcnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2xvYWRlcnMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvbG9hZGluZy1pbmRpY2F0b3JzL2xvYWRpbmctaW5kaWNhdG9ycy50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvYWRpbmdJbmRpY2F0b3JzQ3RybCBhcyBsb2FkaW5nSW5kaWNhdG9yc0N0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLm1vZGFsLWNvbnRlbnQuY29udHJvbGxlcicsIFtdKVxuXG4gICAgLmNvbnRyb2xsZXIoJ01vZGFsQ29udGVudEN0cmwnLCBmdW5jdGlvbigkbW9kYWxJbnN0YW5jZSkge1xuICAgICAgICB2YXIgY3RybCA9IHRoaXM7XG5cbiAgICAgICAgY3RybC5vayA9IG9rO1xuICAgICAgICBjdHJsLmNhbmNlbCA9IGNhbmNlbDtcblxuICAgICAgICBmdW5jdGlvbiBvaygkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgnT0snKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNhbmNlbCgkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdDYW5jZWxlZCcpO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5tb2RhbC5jb250cm9sbGVyJywgW1xuICAgJ3dlYnNpdGUubW9kYWwtY29udGVudC5jb250cm9sbGVyJ1xuXSlcbiAgICAuZGlyZWN0aXZlKCd0YWJzZXQnLCBmdW5jdGlvbigkdGltZW91dCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVxdWlyZTogJ3RhYnNldCcsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIHRhYnNldCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3QgPSB0YWJzZXQuc2VsZWN0O1xuXG4gICAgICAgICAgICAgICAgdGFic2V0LnNlbGVjdCA9IGZ1bmN0aW9uKHRhYikge1xuICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWIuaXNSZW5kZXJlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvZGVtaXJyb3JFbGVtZW50cyA9IGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvckFsbCgnLkNvZGVNaXJyb3InKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKGNvZGVtaXJyb3JFbGVtZW50cywgZnVuY3Rpb24oY29kZW1pcnJvckVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlbWlycm9yRWxlbWVudC5Db2RlTWlycm9yLnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWIuaXNSZW5kZXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxlY3QuYXBwbHkodGFic2V0LCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSlcblxuICAgIC5jb250cm9sbGVyKCdNb2RhbEN0cmwnLCBmdW5jdGlvbigkbW9kYWwpIHtcbiAgICAgICAgdmFyIGN0cmwgPSB0aGlzO1xuICAgICAgICBjdHJsLmhhbmRsZVRhYlNlbGVjdCA9IGhhbmRsZVRhYlNlbGVjdDtcbiAgICAgICAgY3RybC5pc1RhYkFjdGl2ZSA9IGlzVGFiQWN0aXZlO1xuICAgICAgICBjdHJsLm9wZW5VbmZvcm1hdHRlZE1vZGFsID0gb3BlblVuZm9ybWF0dGVkTW9kYWw7XG4gICAgICAgIGN0cmwub3BlbkZvcm1hdHRlZE1vZGFsID0gb3BlbkZvcm1hdHRlZE1vZGFsO1xuICAgICAgICBjdHJsLm9wZW5Qcm9tcHQgPSBvcGVuUHJvbXB0O1xuICAgICAgICBjdHJsLm9wZW5MYXJnZU1vZGFsID0gb3BlbkxhcmdlTW9kYWw7XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlVGFiU2VsZWN0KHRhYikge1xuICAgICAgICAgICAgY3RybC5jdXJyZW50VGFiID0gdGFiO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNUYWJBY3RpdmUodGFiKSB7XG4gICAgICAgICAgICByZXR1cm4gY3RybC5jdXJyZW50VGFiID09PSB0YWI7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBvcGVuVW5mb3JtYXR0ZWRNb2RhbCgkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJG1vZGFsLm9wZW4oe1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNb2RhbENvbnRlbnRDdHJsIGFzIG1vZGFsQ29udGVudEN0cmwnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvbW9kYWwvbW9kYWwtdW5mb3JtYXR0ZWQudHBsLmh0bWwnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG9wZW5Gb3JtYXR0ZWRNb2RhbCgkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJG1vZGFsLm9wZW4oe1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNb2RhbENvbnRlbnRDdHJsIGFzIG1vZGFsQ29udGVudEN0cmwnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvbW9kYWwvbW9kYWwtZm9ybWF0dGVkLnRwbC5odG1sJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBvcGVuUHJvbXB0KCRldmVudCkge1xuICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkbW9kYWwub3Blbih7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01vZGFsQ29udGVudEN0cmwgYXMgbW9kYWxDb250ZW50Q3RybCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9tb2RhbC9wcm9tcHQudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIHdpbmRvd0NsYXNzOiAncHJvbXB0J1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBvcGVuTGFyZ2VNb2RhbCgkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJG1vZGFsLm9wZW4oe1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNb2RhbENvbnRlbnRDdHJsIGFzIG1vZGFsQ29udGVudEN0cmwnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvbW9kYWwvbW9kYWwtZm9ybWF0dGVkLnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICB3aW5kb3dDbGFzczogJ21vZGFsLS1sYXJnZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5tb2RhbCcsIFtcbiAgICAnd2Vic2l0ZS5tb2RhbC5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUubW9kYWwuc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUubW9kYWwuY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMubW9kYWwnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL21vZGFsJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL21vZGFsL21vZGFsLnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTW9kYWxDdHJsIGFzIG1vZGFsQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUucGFuZWxzLmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdQYW5lbHNDdHJsJywgZnVuY3Rpb24oKSB7XG5cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnBhbmVscycsIFtcbiAgICAnd2Vic2l0ZS5wYW5lbHMuc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnBhbmVscy5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnd2Vic2l0ZS5wYW5lbHMuY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMucGFuZWxzJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9wYW5lbHMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvcGFuZWxzL3BhbmVscy50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1BhbmVsc0N0cmwgYXMgcGFuZWxzQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUucHJvbXB0LWNvbnRlbnQuY29udHJvbGxlcicsIFtdKVxuXG4gICAgLmNvbnRyb2xsZXIoJ1Byb21wdENvbnRlbnRDb250cm9sbGVyJywgZnVuY3Rpb24oJHByb21wdEluc3RhbmNlKSB7XG4gICAgICAgIHZhciBjdHJsID0gdGhpcztcblxuICAgICAgICBjdHJsLm9rID0gb2s7XG4gICAgICAgIGN0cmwuY2FuY2VsID0gY2FuY2VsO1xuXG4gICAgICAgIGZ1bmN0aW9uIG9rKCRldmVudCkge1xuICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICRwcm9tcHRJbnN0YW5jZS5jbG9zZSgnT0snKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNhbmNlbCgkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAkcHJvbXB0SW5zdGFuY2UuZGlzbWlzcygnQ2FuY2VsZWQnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUucHJvbXB0LmNvbnRyb2xsZXInLCBbXG4gICAnd2Vic2l0ZS5wcm9tcHQtY29udGVudC5jb250cm9sbGVyJ1xuXSlcbiAgICAuZGlyZWN0aXZlKCd0YWJzZXQnLCBmdW5jdGlvbigkdGltZW91dCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVxdWlyZTogJ3RhYnNldCcsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIHRhYnNldCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3QgPSB0YWJzZXQuc2VsZWN0O1xuXG4gICAgICAgICAgICAgICAgdGFic2V0LnNlbGVjdCA9IGZ1bmN0aW9uKHRhYikge1xuICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWIuaXNSZW5kZXJlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvZGVtaXJyb3JFbGVtZW50cyA9IGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvckFsbCgnLkNvZGVNaXJyb3InKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKGNvZGVtaXJyb3JFbGVtZW50cywgZnVuY3Rpb24oY29kZW1pcnJvckVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlbWlycm9yRWxlbWVudC5Db2RlTWlycm9yLnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWIuaXNSZW5kZXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxlY3QuYXBwbHkodGFic2V0LCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSlcblxuICAgIC5jb250cm9sbGVyKCdQcm9tcHRDdHJsJywgZnVuY3Rpb24oJHByb21wdCkge1xuICAgICAgICB2YXIgY3RybCA9IHRoaXM7XG4gICAgICAgIGN0cmwuaGFuZGxlVGFiU2VsZWN0ID0gaGFuZGxlVGFiU2VsZWN0O1xuICAgICAgICBjdHJsLmlzVGFiQWN0aXZlID0gaXNUYWJBY3RpdmU7XG4gICAgICAgIGN0cmwub3BlblByb21wdCA9IG9wZW5Qcm9tcHQ7XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlVGFiU2VsZWN0KHRhYikge1xuICAgICAgICAgICAgY3RybC5jdXJyZW50VGFiID0gdGFiO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNUYWJBY3RpdmUodGFiKSB7XG4gICAgICAgICAgICByZXR1cm4gY3RybC5jdXJyZW50VGFiID09PSB0YWI7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBvcGVuUHJvbXB0KCRldmVudCkge1xuICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkcHJvbXB0Lm9wZW4oe1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9tcHRDb250ZW50Q3RybCBhcyBwcm9tcHRDb250ZW50Q3RybCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9wcm9tcHQvcHJvbXB0LW1vZGFsLnRwbC5odG1sJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnByb21wdCcsIFtcbiAgICAnd2Vic2l0ZS5wcm9tcHQuc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnByb21wdC5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnd2Vic2l0ZS5wcm9tcHQuY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMucHJvbXB0Jywge1xuICAgICAgICAgICAgICAgIHVybDogJy9wcm9tcHQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvcHJvbXB0L3Byb21wdC50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Byb21wdEN0cmwgYXMgcHJvbXB0Q3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUudGFibGVzLmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdUYWJsZXNDdHJsJywgZnVuY3Rpb24oKSB7XG5cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnRhYmxlcycsIFtcbiAgICAnd2Vic2l0ZS50YWJsZXMuc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnRhYmxlcy5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnd2Vic2l0ZS50YWJsZXMuY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMudGFibGVzJywge1xuICAgICAgICAgICAgICAgIHVybDogJy90YWJsZXMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvdGFibGVzL3RhYmxlcy50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1RhYmxlc0N0cmwgYXMgdGFibGVzQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUudGFicy5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignVGFic0N0cmwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGN0cmwgPSB0aGlzO1xuXG4gICAgICAgIGN0cmwudGFicyA9IFtcbiAgICAgICAgICAgIHsgdGl0bGU6J0R5bmFtaWMgVGl0bGUgMScsIGNvbnRlbnQ6J0R5bmFtaWMgY29udGVudCAxJyB9LFxuICAgICAgICAgICAgeyB0aXRsZTonRHluYW1pYyBUaXRsZSAyJywgY29udGVudDonRHluYW1pYyBjb250ZW50IDInIH1cbiAgICAgICAgXTtcblxuICAgICAgICBjdHJsLnRhYkNsaWNrZWQgPSBmdW5jdGlvbiB0YWJDbGlja2VkKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RhYiBjbGlja2VkIScpO1xuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUudGFicycsIFtcbiAgICAnd2Vic2l0ZS50YWJzLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS50YWJzLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICd3ZWJzaXRlLnRhYnMuY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMudGFicycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvdGFicycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy90YWJzL3RhYnMudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdUYWJzQ3RybCBhcyB0YWJzQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUudG9vbHRpcCcsIFtcbiAgICAnd2Vic2l0ZS50b29sdGlwLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS50b29sdGlwLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLnRvb2x0aXAnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL3Rvb2x0aXAnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvdG9vbHRpcC90b29sdGlwLnRwbC5odG1sJ1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS53YXJuaW5nLWJ1dHRvbicsIFtcbiAgICAnd2Vic2l0ZS53YXJuaW5nLWJ1dHRvbi5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUud2FybmluZy1idXR0b24uc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUubW9kYWwuY29udHJvbGxlcicsXG5dKVxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29tcG9uZW50cy53YXJuaW5nLWJ1dHRvbicsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvd2FybmluZy1idXR0b24nLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvd2FybmluZy1idXR0b24vd2FybmluZy1idXR0b24udHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNb2RhbEN0cmwgYXMgbW9kYWxDdHJsJ1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5iYy1zZXJ2ZXItdGFibGUuc2FtcGxlLWRhdGEuc2VydmljZScsIFtdKVxuICAgIC5mYWN0b3J5KCdzYW1wbGVEYXRhJywgZnVuY3Rpb24gc2FtcGxlRGF0YSgkaHR0cCkge1xuICAgICAgICB2YXIgc2VydmljZSA9IHtcbiAgICAgICAgICAgIGdldFNhbXBsZURhdGE6IGdldFNhbXBsZURhdGFcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRTYW1wbGVEYXRhKHF1ZXJ5UGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvdGFibGUuanNvbicsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHF1ZXJ5UGFyYW1zXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIGdldFNhbXBsZURhdGFTdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzOiByZXNwb25zZS5kYXRhLnJvd3MsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogcmVzcG9uc2UuZGF0YS5wYWdpbmF0aW9uLnBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGltaXQ6IHJlc3BvbnNlLmRhdGEucGFnaW5hdGlvbi5saW1pdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbDogcmVzcG9uc2UuZGF0YS5wYWdpbmF0aW9uLm51bUl0ZW1zXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VydmljZTtcbiAgICB9KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==