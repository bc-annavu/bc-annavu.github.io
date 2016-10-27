'use strict';

angular.module('website', ['bcapp-pattern-lab', 'mm.foundation', 'website-templates', 'ui.codemirror', 'ui.router',

// JS Components
'website.accordion', 'website.alerts', 'website.aside-header-toggle', 'website.aside-nav', 'website.banners', 'website.bc-datepicker', 'website.bc-dropdown', 'website.bc-pagination', 'website.bc-server-table', 'website.buttons', 'website.cards', 'website.color-picker-example', 'website.credit-card', 'website.global-message', 'website.loading-indicators', 'website.icons', 'website.modal', 'website.panels', 'website.prompt', 'website.switch', 'website.tables', 'website.tabs', 'website.tooltip', 'website.warning-button']).constant('BC_APP_CONFIG', {}).config(function ($stateProvider, svgRootPathProvider) {
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

    $scope.palette = ['#00ABC9', '#95db89', '#ffb800', '#db636b', '#556273', '#232831', '#b186cb', '#ff8800', '#3e62a1', '#e89fae', '#6eccfc'];

    $scope.inputModelValue = '#6eccfc';
    $scope.inputLabelText = 'Input Label Text';
    $scope.inputPlaceholderText = 'Input Placeholder Text';
    $scope.inputPalette = ['#00ABC9', '#E5F6F9', '#95DB89', '#FFB800'];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFzaWRlSGVhZGVyVG9nZ2xlL2FzaWRlSGVhZGVyVG9nZ2xlLmNvbnRyb2xsZXIuanMiLCJhc2lkZUhlYWRlclRvZ2dsZS9hc2lkZUhlYWRlclRvZ2dsZS5kaXJlY3RpdmUuanMiLCJhc2lkZUhlYWRlclRvZ2dsZS9hc2lkZUhlYWRlclRvZ2dsZS5tb2R1bGUuanMiLCJhc2lkZU5hdi9hc2lkZU5hdi5jb250cm9sbGVyLmpzIiwiYXNpZGVOYXYvYXNpZGVOYXYubW9kdWxlLmpzIiwiaWNvbnMvaWNvbnMuY29udHJvbGxlci5qcyIsImljb25zL2ljb25zLmRpcmVjdGl2ZS5qcyIsImljb25zL2ljb25zLm1vZHVsZS5qcyIsInN3aXRjaC9zd2l0Y2guY29udHJvbGxlci5qcyIsInN3aXRjaC9zd2l0Y2gubW9kdWxlLmpzIiwiZXhhbXBsZXMvYWNjb3JkaW9uL2FjY29yZGlvbi5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvYWNjb3JkaW9uL2FjY29yZGlvbi5tb2R1bGUuanMiLCJleGFtcGxlcy9hY2NvcmRpb24vYWNjb3JkaW9uLnN0YXRlLmpzIiwiZXhhbXBsZXMvYWxlcnRzL2FsZXJ0cy5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvYWxlcnRzL2FsZXJ0cy5tb2R1bGUuanMiLCJleGFtcGxlcy9hbGVydHMvYWxlcnRzLnN0YXRlLmpzIiwiZXhhbXBsZXMvYmFubmVycy9iYW5uZXJzLmNvbnRyb2xsZXIuanMiLCJleGFtcGxlcy9iYW5uZXJzL2Jhbm5lcnMubW9kdWxlLmpzIiwiZXhhbXBsZXMvYmFubmVycy9iYW5uZXJzLnN0YXRlLmpzIiwiZXhhbXBsZXMvYmMtZGF0ZXBpY2tlci9iYy1kYXRlcGlja2VyLmNvbnRyb2xsZXIuanMiLCJleGFtcGxlcy9iYy1kYXRlcGlja2VyL2JjLWRhdGVwaWNrZXIubW9kdWxlLmpzIiwiZXhhbXBsZXMvYmMtZGF0ZXBpY2tlci9iYy1kYXRlcGlja2VyLnN0YXRlLmpzIiwiZXhhbXBsZXMvYmMtZHJvcGRvd24vYmMtZHJvcGRvd24ubW9kdWxlLmpzIiwiZXhhbXBsZXMvYmMtZHJvcGRvd24vYmMtZHJvcGRvd24uc3RhdGUuanMiLCJleGFtcGxlcy9iYy1wYWdpbmF0aW9uL2JjLXBhZ2luYXRpb24uY29udHJvbGxlci5qcyIsImV4YW1wbGVzL2JjLXBhZ2luYXRpb24vYmMtcGFnaW5hdGlvbi5tb2R1bGUuanMiLCJleGFtcGxlcy9iYy1wYWdpbmF0aW9uL2JjLXBhZ2luYXRpb24uc3RhdGUuanMiLCJleGFtcGxlcy9iYy1zZXJ2ZXItdGFibGUvYmMtc2VydmVyLXRhYmxlLmNvbnN0YW50cy5qcyIsImV4YW1wbGVzL2JjLXNlcnZlci10YWJsZS9iYy1zZXJ2ZXItdGFibGUuY29udHJvbGxlci5qcyIsImV4YW1wbGVzL2JjLXNlcnZlci10YWJsZS9iYy1zZXJ2ZXItdGFibGUubW9kdWxlLmpzIiwiZXhhbXBsZXMvYmMtc2VydmVyLXRhYmxlL2JjLXNlcnZlci10YWJsZS5zdGF0ZS5qcyIsImV4YW1wbGVzL2JjLXNlcnZlci10YWJsZS9lMmUtYmFja2VuZC5qcyIsImV4YW1wbGVzL2J1dHRvbnMvYnV0dG9ucy5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvYnV0dG9ucy9idXR0b25zLm1vZHVsZS5qcyIsImV4YW1wbGVzL2J1dHRvbnMvYnV0dG9ucy5zdGF0ZS5qcyIsImV4YW1wbGVzL2NhcmRzL2NhcmRzLmNvbnRyb2xsZXIuanMiLCJleGFtcGxlcy9jYXJkcy9jYXJkcy5tb2R1bGUuanMiLCJleGFtcGxlcy9jYXJkcy9jYXJkcy5zdGF0ZS5qcyIsImV4YW1wbGVzL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXIuY29udHJvbGxlci5qcyIsImV4YW1wbGVzL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXIubW9kdWxlLmpzIiwiZXhhbXBsZXMvY29sb3ItcGlja2VyL2NvbG9yLXBpY2tlci5zdGF0ZS5qcyIsImV4YW1wbGVzL2NyZWRpdC1jYXJkL2NyZWRpdC1jYXJkLmNvbnRyb2xsZXIuanMiLCJleGFtcGxlcy9jcmVkaXQtY2FyZC9jcmVkaXQtY2FyZC5tb2R1bGUuanMiLCJleGFtcGxlcy9jcmVkaXQtY2FyZC9jcmVkaXQtY2FyZC5zdGF0ZS5qcyIsImV4YW1wbGVzL2dsb2JhbC1tZXNzYWdlL2dsb2JhbC1tZXNzYWdlLmNvbnRyb2xsZXIuanMiLCJleGFtcGxlcy9nbG9iYWwtbWVzc2FnZS9nbG9iYWwtbWVzc2FnZS5tb2R1bGUuanMiLCJleGFtcGxlcy9nbG9iYWwtbWVzc2FnZS9nbG9iYWwtbWVzc2FnZS5zdGF0ZS5qcyIsImV4YW1wbGVzL2xvYWRpbmctaW5kaWNhdG9ycy9sb2FkaW5nLWluZGljYXRvcnMuY29udHJvbGxlci5qcyIsImV4YW1wbGVzL2xvYWRpbmctaW5kaWNhdG9ycy9sb2FkaW5nLWluZGljYXRvcnMubW9kdWxlLmpzIiwiZXhhbXBsZXMvbG9hZGluZy1pbmRpY2F0b3JzL2xvYWRpbmctaW5kaWNhdG9ycy5zdGF0ZS5qcyIsImV4YW1wbGVzL21vZGFsL21vZGFsLWNvbnRlbnQuY29udHJvbGxlci5qcyIsImV4YW1wbGVzL21vZGFsL21vZGFsLmNvbnRyb2xsZXIuanMiLCJleGFtcGxlcy9tb2RhbC9tb2RhbC5tb2R1bGUuanMiLCJleGFtcGxlcy9tb2RhbC9tb2RhbC5zdGF0ZS5qcyIsImV4YW1wbGVzL3BhbmVscy9wYW5lbHMuY29udHJvbGxlci5qcyIsImV4YW1wbGVzL3BhbmVscy9wYW5lbHMubW9kdWxlLmpzIiwiZXhhbXBsZXMvcGFuZWxzL3BhbmVscy5zdGF0ZS5qcyIsImV4YW1wbGVzL3Byb21wdC9wcm9tcHQtY29udGVudC5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvcHJvbXB0L3Byb21wdC5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvcHJvbXB0L3Byb21wdC5tb2R1bGUuanMiLCJleGFtcGxlcy9wcm9tcHQvcHJvbXB0LnN0YXRlLmpzIiwiZXhhbXBsZXMvdGFibGVzL3RhYmxlcy5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvdGFibGVzL3RhYmxlcy5tb2R1bGUuanMiLCJleGFtcGxlcy90YWJsZXMvdGFibGVzLnN0YXRlLmpzIiwiZXhhbXBsZXMvdGFicy90YWJzLmNvbnRyb2xsZXIuanMiLCJleGFtcGxlcy90YWJzL3RhYnMubW9kdWxlLmpzIiwiZXhhbXBsZXMvdGFicy90YWJzLnN0YXRlLmpzIiwiZXhhbXBsZXMvdG9vbHRpcC90b29sdGlwLm1vZHVsZS5qcyIsImV4YW1wbGVzL3Rvb2x0aXAvdG9vbHRpcC5zdGF0ZS5qcyIsImV4YW1wbGVzL3dhcm5pbmctYnV0dG9uL3dhcm5pbmctYnV0dG9uLm1vZHVsZS5qcyIsImV4YW1wbGVzL3dhcm5pbmctYnV0dG9uL3dhcm5pbmctYnV0dG9uLnN0YXRlLmpzIiwiZXhhbXBsZXMvYmMtc2VydmVyLXRhYmxlL3NlcnZpY2VzL2JjLXNlcnZlci10YWJsZS5zYW1wbGUtZGF0YS5zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FDdEIsbUJBQW1CLEVBQ25CLGVBQWUsRUFDZixtQkFBbUIsRUFDbkIsZUFBZSxFQUNmLFdBQVc7OztBQUdYLG1CQUFtQixFQUNuQixnQkFBZ0IsRUFDaEIsNkJBQTZCLEVBQzdCLG1CQUFtQixFQUNuQixpQkFBaUIsRUFDakIsdUJBQXVCLEVBQ3ZCLHFCQUFxQixFQUNyQix1QkFBdUIsRUFDdkIseUJBQXlCLEVBQ3pCLGlCQUFpQixFQUNqQixlQUFlLEVBQ2YsOEJBQThCLEVBQzlCLHFCQUFxQixFQUNyQix3QkFBd0IsRUFDeEIsNEJBQTRCLEVBQzVCLGVBQWUsRUFDZixlQUFlLEVBQ2YsZ0JBQWdCLEVBQ2hCLGdCQUFnQixFQUNoQixnQkFBZ0IsRUFDaEIsZ0JBQWdCLEVBQ2hCLGNBQWMsRUFDZCxpQkFBaUIsRUFDakIsd0JBQXdCLENBQzNCLENBQUMsQ0FDRyxRQUFRLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxDQUU3QixNQUFNLENBQUMsVUFBUyxjQUFjLEVBQUUsbUJBQW1CLEVBQUU7QUFDbEQsa0JBQWMsQ0FD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SSxDQUFDLFVBQVUsQ0FBQyxLQUFLO0FBQ3JDLHlCQUFLLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUTtpQkFDM0M7YUFDSixDQUFDO1NBQ0wsQ0FBQyxDQUFDO0tBQ1Y7O0FBRUQsV0FBTyxPQUFPLENBQUM7Q0FDbEIsQ0FBQyxDQUFDIiwiZmlsZSI6IndlYnNpdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWInLFxuICAgICdtbS5mb3VuZGF0aW9uJyxcbiAgICAnd2Vic2l0ZS10ZW1wbGF0ZXMnLFxuICAgICd1aS5jb2RlbWlycm9yJyxcbiAgICAndWkucm91dGVyJyxcblxuICAgIC8vIEpTIENvbXBvbmVudHNcbiAgICAnd2Vic2l0ZS5hY2NvcmRpb24nLFxuICAgICd3ZWJzaXRlLmFsZXJ0cycsXG4gICAgJ3dlYnNpdGUuYXNpZGUtaGVhZGVyLXRvZ2dsZScsXG4gICAgJ3dlYnNpdGUuYXNpZGUtbmF2JyxcbiAgICAnd2Vic2l0ZS5iYW5uZXJzJyxcbiAgICAnd2Vic2l0ZS5iYy1kYXRlcGlja2VyJyxcbiAgICAnd2Vic2l0ZS5iYy1kcm9wZG93bicsXG4gICAgJ3dlYnNpdGUuYmMtcGFnaW5hdGlvbicsXG4gICAgJ3dlYnNpdGUuYmMtc2VydmVyLXRhYmxlJyxcbiAgICAnd2Vic2l0ZS5idXR0b25zJyxcbiAgICAnd2Vic2l0ZS5jYXJkcycsXG4gICAgJ3dlYnNpdGUuY29sb3ItcGlja2VyLWV4YW1wbGUnLFxuICAgICd3ZWJzaXRlLmNyZWRpdC1jYXJkJyxcbiAgICAnd2Vic2l0ZS5nbG9iYWwtbWVzc2FnZScsXG4gICAgJ3dlYnNpdGUubG9hZGluZy1pbmRpY2F0b3JzJyxcbiAgICAnd2Vic2l0ZS5pY29ucycsXG4gICAgJ3dlYnNpdGUubW9kYWwnLFxuICAgICd3ZWJzaXRlLnBhbmVscycsXG4gICAgJ3dlYnNpdGUucHJvbXB0JyxcbiAgICAnd2Vic2l0ZS5zd2l0Y2gnLFxuICAgICd3ZWJzaXRlLnRhYmxlcycsXG4gICAgJ3dlYnNpdGUudGFicycsXG4gICAgJ3dlYnNpdGUudG9vbHRpcCcsXG4gICAgJ3dlYnNpdGUud2FybmluZy1idXR0b24nXG5dKVxuICAgIC5jb25zdGFudCgnQkNfQVBQX0NPTkZJRycsIHt9KVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgc3ZnUm9vdFBhdGhQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzJywge1xuICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHVybDogJy9jb21wb25lbnRzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzx1aS12aWV3Lz4nXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBzdmdSb290UGF0aFByb3ZpZGVyLnNldFJvb3RQYXRoKCcvc3ZnL2ljb25zLycpO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYXNpZGUtaGVhZGVyLXRvZ2dsZS5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignQXNpZGVIZWFkZXJUb2dnbGVDdHJsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBjdHJsID0gdGhpcztcbiAgICAgICAgY3RybC5jbGlja0hhbmRsZXIgPSBjbGlja0hhbmRsZXI7XG4gICAgICAgIGN0cmwuaXNPcGVuID0gZmFsc2U7XG4gICAgICAgIGN0cmwuc2V0SXNPcGVuID0gc2V0SXNPcGVuO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNsaWNrSGFuZGxlcigkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgaWYgKGN0cmwuaXNPcGVuKXtcbiAgICAgICAgICAgICAgICBjdHJsLnNldElzT3BlbihmYWxzZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGN0cmwuc2V0SXNPcGVuKHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0SXNPcGVuKHZhbHVlKSB7XG4gICAgICAgICAgICBjdHJsLmlzT3BlbiA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5hc2lkZS1oZWFkZXItdG9nZ2xlLmRpcmVjdGl2ZScsIFtcbiAgICAgICAgJ3dlYnNpdGUuYXNpZGUtaGVhZGVyLXRvZ2dsZS5jb250cm9sbGVyJ1xuICAgIF0pXG4gICAgLmRpcmVjdGl2ZSgnYXNpZGVIZWFkZXJUb2dnbGUnLCAgKCkgPT4ge1xuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBc2lkZUhlYWRlclRvZ2dsZUN0cmwnLFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYXNpZGVIZWFkZXJUb2dnbGVDdHJsJyxcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJz0nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9hc2lkZUhlYWRlclRvZ2dsZS9hc2lkZUhlYWRlclRvZ2dsZS50cGwuaHRtbCdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmFzaWRlLWhlYWRlci10b2dnbGUnLCBbXG4gICAgJ3dlYnNpdGUuYXNpZGUtaGVhZGVyLXRvZ2dsZS5kaXJlY3RpdmUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmFzaWRlLW5hdi5jb250cm9sbGVyJywgW10pXG4gICAgLmNvbnRyb2xsZXIoJ0FzaWRlTmF2Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHdpbmRvdykge1xuICAgIFx0JHNjb3BlLmlzQWN0aXZlID0gZnVuY3Rpb24gKHZpZXdMb2NhdGlvbikge1xuICAgIFx0XHRyZXR1cm4gKHZpZXdMb2NhdGlvbiA9PT0gJHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSk7XG5cdFx0fTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmFzaWRlLW5hdicsIFtcbiAgICAnd2Vic2l0ZS5hc2lkZS1uYXYuY29udHJvbGxlcidcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuaWNvbnMuY29udHJvbGxlcicsIFtdKVxuXG4gICAgLmNvbnRyb2xsZXIoJ0ljb25zQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgICAkc2NvcGUuaWNvbnMgPSB3aW5kb3cuaWNvbnM7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5pY29ucy5kaXJlY3RpdmUnLCBbXG4gICAgICAgICd3ZWJzaXRlLmljb25zLmNvbnRyb2xsZXInXG4gICAgXSlcbiAgICAuZGlyZWN0aXZlKCdpY29uc0xpc3QnLCBmdW5jdGlvbiBiY0ljb25EaXJlY3RpdmUoKSB7XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9pY29ucy9pY29ucy50cGwuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnSWNvbnNDdHJsIGFzIGljb25zQ3RybCdcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmljb25zJywgW1xuICAgICd3ZWJzaXRlLmljb25zLmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuc3dpdGNoLmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdQYXR0ZXJuTGFiU3dpdGNoQ3RybCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY3RybCA9IHRoaXM7XG5cbiAgICAgICAgY3RybC5zd2l0Y2hPbmUgPSBmYWxzZTtcbiAgICAgICAgY3RybC5zd2l0Y2hUd28gPSB0cnVlO1xuICAgICAgICBjdHJsLnN3aXRjaFRocmVlID0gZmFsc2U7XG4gICAgICAgIGN0cmwuc3dpdGNoRm91ciA9IHRydWU7XG4gICAgICAgIGN0cmwuc3dpdGNoRml2ZSA9IGZhbHNlO1xuICAgICAgICBjdHJsLnN3aXRjaFNpeCA9IGZhbHNlO1xuICAgICAgICBjdHJsLmlzU3dpdGNoU2l4RGlzYWJsZWQgPSB0cnVlO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuc3dpdGNoJywgW1xuICAgICd3ZWJzaXRlLnN3aXRjaC5jb250cm9sbGVyJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5hY2NvcmRpb24uY29udHJvbGxlcicsIFtdKVxuXG4gICAgLmNvbnRyb2xsZXIoJ0FjY29yZGlvbkN0cmwnLCBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgICAgJHNjb3BlLm9uZUF0QVRpbWUgPSB0cnVlO1xuXG4gICAgICAgICRzY29wZS5ncm91cHMgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICdkeW5hbWljLTEnLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIkR5bmFtaWMgR3JvdXAgSGVhZGVyIC0gMVwiLFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiRHluYW1pYyBHcm91cCBCb2R5IC0gMVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiAnZHluYW1pYy0yJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJEeW5hbWljIEdyb3VwIEhlYWRlciAtIDJcIixcbiAgICAgICAgICAgICAgICBjb250ZW50OiBcIkR5bmFtaWMgR3JvdXAgQm9keSAtIDJcIlxuICAgICAgICAgICAgfVxuICAgICAgICBdO1xuXG4gICAgICAgICRzY29wZS5pdGVtcyA9IFsnSXRlbSAxJywgJ0l0ZW0gMicsICdJdGVtIDMnXTtcblxuICAgICAgICAkc2NvcGUuYWRkSXRlbSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG5ld0l0ZW1ObyA9ICRzY29wZS5pdGVtcy5sZW5ndGggKyAxO1xuICAgICAgICAgICAgJHNjb3BlLml0ZW1zLnB1c2goJ0l0ZW0gJyArIG5ld0l0ZW1Obyk7XG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5hY2NvcmRpb24nLCBbXG4gICAgJ3dlYnNpdGUuYWNjb3JkaW9uLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5hY2NvcmRpb24uc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUuYWNjb3JkaW9uLmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLmFjY29yZGlvbicsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYWNjb3JkaW9uJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL2FjY29yZGlvbi9hY2NvcmRpb24udHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBY2NvcmRpb25DdHJsIGFzIGFjY29yZGlvbkN0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmFsZXJ0cy5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignQWxlcnRzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgICAkc2NvcGUuYWxlcnRzID0gW1xuICAgICAgICAgICAgeyBtc2c6ICdHZW5lcmljIGFsZXJ0JyB9LFxuICAgICAgICAgICAgeyB0eXBlOiAnaW5mbycsIG1zZzogJ0luZm9ybWF0aW9uYWwgYWxlcnQnIH0sXG4gICAgICAgICAgICB7IHR5cGU6ICdzdWNjZXNzJywgbXNnOiAnU3VjY2VzcyBhbGVydCcgfSxcbiAgICAgICAgICAgIHsgdHlwZTogJ3dhcm5pbmcnLCBtc2c6ICdXYXJuaW5nIGFsZXJ0JyB9LFxuICAgICAgICAgICAgeyB0eXBlOiAnZXJyb3InLCBtc2c6ICdFcnJvciBhbGVydCcgfVxuICAgICAgICBdO1xuXG4gICAgICAgICRzY29wZS5vcGVuQWxlcnQgPSAgeyB0eXBlOiAnZXJyb3InLCBtc2c6ICdFcnJvciBhbGVydCBpbiBhIHBhbmVsJyB9O1xuXG4gICAgICAgICRzY29wZS5hZGRBbGVydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNjb3BlLmFsZXJ0cy5wdXNoKHttc2c6ICdBbm90aGVyIGdlbmVyaWMgYWxlcnQhJ30pO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5jbG9zZUFsZXJ0ID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgICRzY29wZS5hbGVydHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmFsZXJ0cycsIFtcbiAgICAnd2Vic2l0ZS5hbGVydHMuc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmFsZXJ0cy5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnd2Vic2l0ZS5hbGVydHMuY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMuYWxlcnRzJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9hbGVydHMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvYWxlcnRzL2FsZXJ0cy50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FsZXJ0c0N0cmwgYXMgYWxlcnRzQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmFubmVycy5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignQmFubmVyc0N0cmwnLCBmdW5jdGlvbigpIHtcblxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmFubmVycycsIFtcbiAgICAnd2Vic2l0ZS5iYW5uZXJzLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5iYW5uZXJzLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICd3ZWJzaXRlLmJhbm5lcnMuY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMuYmFubmVycycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYmFubmVycycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9iYW5uZXJzL2Jhbm5lcnMudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCYW5uZXJzQ3RybCBhcyBiYW5uZXJzQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmMtZGF0ZXBpY2tlci5jb250cm9sbGVyJywgW10pXG4gICAgLmNvbnRyb2xsZXIoJ0JjRGF0ZXBpY2tlckN0cmwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGN0cmwgPSB0aGlzO1xuXG4gICAgICAgIGN0cmwub3B0aW9ucyA9IHt9O1xuICAgIH0pO1xuXG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5iYy1kYXRlcGlja2VyJywgW1xuICAgICd3ZWJzaXRlLmJjLWRhdGVwaWNrZXIuc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmJjLWRhdGVwaWNrZXIuc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUuYmMtZGF0ZXBpY2tlci5jb250cm9sbGVyJ1xuXSlcblxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29tcG9uZW50cy5iYy1kYXRlcGlja2VyJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9iYy1kYXRlcGlja2VyJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL2JjLWRhdGVwaWNrZXIvYmMtZGF0ZXBpY2tlci50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0JjRGF0ZXBpY2tlckN0cmwgYXMgYmNEYXRlcGlja2VyQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmMtZHJvcGRvd24nLCBbXG4gICAgJ3dlYnNpdGUuYmMtZHJvcGRvd24uc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmJjLWRyb3Bkb3duLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLmJjLWRyb3Bkb3duJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9iYy1kcm9wZG93bicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9iYy1kcm9wZG93bi9iYy1kcm9wZG93bi50cGwuaHRtbCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmMtcGFnaW5hdGlvbi5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignQmNQYWdpbmF0aW9uQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGxvZykge1xuICAgICAgICAkc2NvcGUudG90YWxJdGVtcyA9IDIwMDtcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRQYWdlID0gMTtcbiAgICAgICAgJHNjb3BlLm1heFNpemUgPSA1O1xuICAgICAgICAkc2NvcGUuaXRlbXNQZXJQYWdlID0gMTA7XG4gICAgICAgICRzY29wZS5zaG93TGltaXRzID0gZmFsc2U7XG5cbiAgICAgICAgJHNjb3BlLm9uU2VsZWN0UGFnZSA9IGZ1bmN0aW9uKG5ld1ZhbHVlcykge1xuICAgICAgICAgICAgJGxvZy5sb2coJ05ldyBWYWx1ZXMgQ29tYm86ICcsIG5ld1ZhbHVlcyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLnNldFBhZ2UgPSBmdW5jdGlvbihwYWdlTm8pIHtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50UGFnZSA9IHBhZ2VObztcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuY3VzdG9tTGltaXRzID0gWzEwLCAyMCwgMzAsIDEwMF07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5iYy1wYWdpbmF0aW9uJywgW1xuICAgICd3ZWJzaXRlLmJjLXBhZ2luYXRpb24uc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmJjLXBhZ2luYXRpb24uc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUuYmMtcGFnaW5hdGlvbi5jb250cm9sbGVyJ1xuXSlcblxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29tcG9uZW50cy5iYy1wYWdpbmF0aW9uJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9iYy1wYWdpbmF0aW9uJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL2JjLXBhZ2luYXRpb24vYmMtcGFnaW5hdGlvbi50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0JjUGFnaW5hdGlvbkN0cmwgYXMgYmNQYWdpbmF0aW9uQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmMtc2VydmVyLXRhYmxlLmNvbnN0YW50cycsIFtdKVxuICAgIC5jb25zdGFudCgnREVNT19UQUJMRV9DT05GSUcnLCB7XG4gICAgICAgIHF1ZXJ5S2V5czoge1xuICAgICAgICAgICAgcGFnZTogJ3BhZ2UnLFxuICAgICAgICAgICAgbGltaXQ6ICdsaW1pdCcsXG4gICAgICAgICAgICBzb3J0Qnk6ICdzb3J0LWJ5JyxcbiAgICAgICAgICAgIHNvcnREaXI6ICdzb3J0LW9yZGVyJ1xuICAgICAgICB9LFxuICAgICAgICBzb3J0RGlyVmFsdWVzOiB7XG4gICAgICAgICAgICBhc2M6ICdhc2MnLFxuICAgICAgICAgICAgZGVzYzogJ2RzYydcbiAgICAgICAgfSxcbiAgICAgICAgZmlsdGVyczogWyd0aW1lJ10sXG4gICAgICAgIHJvd0lkS2V5OiAnbmFtZSdcbiAgICB9KVxuICAgIC5jb25zdGFudCgnREVNT19UQUJMRV9JRCcsICdkZW1vLXRhYmxlJyk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5iYy1zZXJ2ZXItdGFibGUuY29udHJvbGxlcicsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtc2VydmVyLXRhYmxlJyxcbiAgICAnZTJlLWJhY2tlbmQnXG5dKVxuXG4gICAgLmNvbnRyb2xsZXIoJ0JjU2VydmVyVGFibGVEZW1vQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBiY1NlcnZlclRhYmxlRmFjdG9yeSwgZGF0YVRhYmxlLCBERU1PX1RBQkxFX0lEKSB7XG4gICAgICAgIHZhciBjdHJsID0gdGhpcztcblxuICAgICAgICBjdHJsLmNsZWFyVGFibGUgPSBjbGVhclRhYmxlO1xuICAgICAgICBjdHJsLmJjU2VydmVyVGFibGUgPSBiY1NlcnZlclRhYmxlRmFjdG9yeS5nZXQoREVNT19UQUJMRV9JRCk7XG5cbiAgICAgICAgLy8gVGhpcyBuZWVkcyB0byBiZSBoZXJlIHVudGlsIHRoZSBwYWdpbmF0aW9uIGRpcmVjdGl2ZSBpcyB1cGRhdGVkXG4gICAgICAgIC8vIHRvIHByZXNlcnZlIGNvbnRleHQgd2hlbiBjYWxsaW5nIHRoZSBvbi1jaGFuZ2UgZnVuY3Rpb24uXG4gICAgICAgIGN0cmwuYmNTZXJ2ZXJUYWJsZS51cGRhdGVQYWdlID0gXy5iaW5kKGN0cmwuYmNTZXJ2ZXJUYWJsZS51cGRhdGVQYWdlLCBjdHJsLmJjU2VydmVyVGFibGUpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNsZWFyVGFibGUoJGV2ZW50KSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygkc3RhdGUuY3VycmVudC5uYW1lLCB7IHBhZ2U6IDEgfSwgeyBpbmhlcml0OiBmYWxzZSB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmMtc2VydmVyLXRhYmxlJywgW1xuICAgICd3ZWJzaXRlLmJjLXNlcnZlci10YWJsZS5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmMtc2VydmVyLXRhYmxlLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICd3ZWJzaXRlLmJjLXNlcnZlci10YWJsZS5jb25zdGFudHMnLFxuICAgICd3ZWJzaXRlLmJjLXNlcnZlci10YWJsZS5jb250cm9sbGVyJyxcbiAgICAnd2Vic2l0ZS5iYy1zZXJ2ZXItdGFibGUuc2FtcGxlLWRhdGEuc2VydmljZSdcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMuYmMtc2VydmVyLXRhYmxlJywge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCY1NlcnZlclRhYmxlRGVtb0N0cmwgYXMgYmNTZXJ2ZXJUYWJsZURlbW9DdHJsJyxcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFUYWJsZTogZnVuY3Rpb24gZGF0YVRhYmxlUmVzb2x2ZSgkc3RhdGVQYXJhbXMsIGJjU2VydmVyVGFibGVGYWN0b3J5LCBERU1PX1RBQkxFX0NPTkZJRywgREVNT19UQUJMRV9JRCwgc2FtcGxlRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJjU2VydmVyVGFibGVGYWN0b3J5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNyZWF0ZShERU1PX1RBQkxFX0lELCBERU1PX1RBQkxFX0NPTkZJRylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaW5pdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlUGFyYW1zOiAkc3RhdGVQYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlQ2FsbGJhY2s6IHNhbXBsZURhdGEuZ2V0U2FtcGxlRGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL2JjLXNlcnZlci10YWJsZS9iYy1zZXJ2ZXItdGFibGUudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIHVybDogJy9iYy1zZXJ2ZXItdGFibGU/c29ydC1vcmRlciZzb3J0LWJ5JnBhZ2UmbGltaXQmdGltZSZuYW1lJ1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnZTJlLWJhY2tlbmQnLCBbXG4gICAgJ25nTW9ja0UyRSdcbl0pXG4gICAgLnJ1bihmdW5jdGlvbigkaHR0cEJhY2tlbmQpIHtcbiAgICAgICAgJGh0dHBCYWNrZW5kLndoZW5HRVQoL1xcL3RhYmxlLmpzb24uKi8pLnJlc3BvbmQoYXBpUmVzcG9uc2UpO1xuICAgICAgICAkaHR0cEJhY2tlbmQud2hlbkdFVCgvLiovKS5wYXNzVGhyb3VnaCgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFwaVJlc3BvbnNlKHN0YXR1cywgZGF0YSkge1xuICAgICAgICAgICAgdmFyIGl0ZW1zLCBwYWdpbmF0aW9uLCByb3dzLCByb3dUb1Nob3csIHNvcnRCeSwgZnJvbVJvdywgdG9Sb3csIGxpbWl0LCBwYWdlO1xuICAgICAgICAgICAgcm93cyA9IFtcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ1JpdHVhbCBDb2ZmZWUgUm9hc3RlcnMnLCAnc3Rhcic6ICfimIXimIXimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnSGF5ZXMgVmFsbGV5J30sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdCbHVlIEJvdHRsZScsICdzdGFyJzogJ+KYheKYheKYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdIYXllcyBWYWxsZXknIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdDb2ZmZWVTaG9wJywgJ3N0YXInOiAn4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ0Jlcm5hbCBIZWlnaHRzJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnU3Bpa2VcXCdzIENvZmZlZSAmIFRlYXMnLCAnc3Rhcic6ICfimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnQ2FzdHJvJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnTGEgQm91bGFuZ2UnLCAnc3Rhcic6ICfimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnQ29sZSBWYWxsZXknIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdEeW5hbW8gRG9udXQgYW5kIENvZmZlZScsICdzdGFyJzogJ+KYheKYheKYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdDb3cgSG9sbG93JyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnVGhlIE1pbGwnLCAnc3Rhcic6ICfimIXimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnRGl2aXNhZGVybycgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ1BpY2Npbm8gQ29mZmVlIEJhcicsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdEb2dwYXRjaCcgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ1BoaWx6JywgJ3N0YXInOiAn4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ0Rvd250b3duJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnRHVib2NlIFBhcmsgQ2FmZScsICdzdGFyJzogJ+KYheKYhScsICdzZi1sb2NhdGlvbic6ICdEdWJvY2UgVHJpYW5nbGUnIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdCbHVlIEJvdHRsZScsICdzdGFyJzogJ+KYheKYheKYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdFbWJhcmNhZGVybycgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0ZvdXIgQmFycmVsJywgJ3N0YXInOiAn4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ0V4Y2Vsc2lvcicgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0NvZmZlZSBCYXInLCAnc3Rhcic6ICfimIXimIXimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnRmlEaScgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0Jpc2NvZmYgQ29mZmVlIENvcm5lcicsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdGaXNoZXJtYW5cXCdzIFdoYXJmJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnRmlmdHkvRmlmdHkgQ29mZmVlIGFuZCBUZWEnLCAnc3Rhcic6ICfimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnSW5uZXIgUmljaG1vbmQnIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdCZWFuZXJ5JywgJ3N0YXInOiAn4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ0lubmVyIFN1bnNldCcgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0NhZmUgZHUgU29sZWlsJywgJ3N0YXInOiAn4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ0xvd2VyIEhhaWdodCcgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ1BlZXRcXCdzJywgJ3N0YXInOiAn4piFJywgJ3NmLWxvY2F0aW9uJzogJ1RoZSBNYXJpbmEnIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdTaWdodGdsYXNzJywgJ3N0YXInOiAn4piF4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ1RoZSBNaXNzaW9uJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnQ29udHJhYmFuZCBDb2ZmZWUgQmFyJywgJ3N0YXInOiAn4piF4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ05vYiBIaWxsJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnTWFydGhhICYgQnJvcyBDb2ZmZWUnLCAnc3Rhcic6ICfimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnTm9lIFZhbGxleScgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ1LDqXZlaWxsZScsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdOb3J0aCBCZWFjaCcgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0N1cCBDb2ZmZWUgQmFyJywgJ3N0YXInOiAn4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ091dGVyIE1pc3Npb24nIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdHYXJkZW4gSG91c2UgQ2FmZScsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdPdXRlciBSaWNobW9uZCcgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0FuZHl0b3duIENvZmZlZSBSb2FzdGVycycsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdPdXRlciBTdW5zZXQnIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdKYW5lIG9uIEZpbGxtb3JlJywgJ3N0YXInOiAn4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ1BhY2lmaWMgSGVpZ2h0cycgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ1NhaW50IEZyYW5rIENvZmZlZScsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdQb2xrJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnRmFybGV54oCZcycsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdQb3RyZXJvIEhpbGwnIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdIb3VzZSBvZiBTbmFja3MnLCAnc3Rhcic6ICfimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnVGhlIFByZXNpZGlvJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnVGhlIEJyZXcnLCAnc3Rhcic6ICfimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnUnVzc2lhbiBIaWxsJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnV2lja2VkIEdyb3VuZHMnLCAnc3Rhcic6ICfimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnU09NQScgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ1N0YXJidWNrcycsICdzdGFyJzogJ+KYhScsICdzZi1sb2NhdGlvbic6ICdVbmlvbiBTcXVhcmUnIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdGbHl3aGVlbCBDb2ZmZWUgUm9hc3RlcnMnLCAnc3Rhcic6ICfimIXimIXimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnVXBwZXIgSGFpZ2h0JyB9XG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgbGltaXQgPSBwYXJzZUludChnZXRQYXJhbWV0ZXJCeU5hbWUoJ2xpbWl0JyksIDEwKSB8fCAxMTtcbiAgICAgICAgICAgIHBhZ2UgPSBwYXJzZUludChnZXRQYXJhbWV0ZXJCeU5hbWUoJ3BhZ2UnKSwgMTApIHx8IDE7XG5cbiAgICAgICAgICAgIGlmIChnZXRQYXJhbWV0ZXJCeU5hbWUoJ3NvcnQtYnknKSkge1xuICAgICAgICAgICAgICAgIHNvcnRCeSA9IGdldFBhcmFtZXRlckJ5TmFtZSgnc29ydC1ieScpO1xuICAgICAgICAgICAgICAgIGlmIChnZXRQYXJhbWV0ZXJCeU5hbWUoJ3NvcnQtb3JkZXInKSA9PT0gJ2RzYycpIHtcbiAgICAgICAgICAgICAgICAgICAgc29ydEJ5ID0gJy0nICsgc29ydEJ5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByb3dzLnNvcnQoZHluYW1pY1NvcnQoc29ydEJ5KSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBhZ2luYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgJ2xpbWl0JzogbGltaXQsXG4gICAgICAgICAgICAgICAgJ3BhZ2UnOiBwYWdlLFxuICAgICAgICAgICAgICAgICdwYWdlcyc6IE1hdGguY2VpbChyb3dzLmxlbmd0aCAvIGxpbWl0KSxcbiAgICAgICAgICAgICAgICAnbnVtSXRlbXMnOiByb3dzLmxlbmd0aFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRvUm93ID0gcGFnaW5hdGlvbi5saW1pdCAqIHBhZ2luYXRpb24ucGFnZTtcbiAgICAgICAgICAgIGZyb21Sb3cgPSB0b1JvdyAtIHBhZ2luYXRpb24ubGltaXQ7XG5cbiAgICAgICAgICAgIGlmIChmcm9tUm93ID49IDAgJiYgdG9Sb3cgPj0gMCkge1xuICAgICAgICAgICAgICAgIHJvd1RvU2hvdyA9IHJvd3Muc2xpY2UoZnJvbVJvdywgdG9Sb3cpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByb3dUb1Nob3cgPSByb3dzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpdGVtcyA9IHtcbiAgICAgICAgICAgICAgICAncm93cyc6IHJvd1RvU2hvdyxcbiAgICAgICAgICAgICAgICAncGFnaW5hdGlvbic6IHBhZ2luYXRpb24sXG4gICAgICAgICAgICAgICAgJ3NvcnQtYnknOiBnZXRQYXJhbWV0ZXJCeU5hbWUoJ3NvcnQtYnknKSxcbiAgICAgICAgICAgICAgICAnc29ydC1vcmRlcic6IGdldFBhcmFtZXRlckJ5TmFtZSgnc29ydC1vcmRlcicpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBkeW5hbWljU29ydChwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgIHZhciBzb3J0T3JkZXIgPSAxO1xuICAgICAgICAgICAgICAgIGlmKHByb3BlcnR5WzBdID09PSAnLScpIHtcbiAgICAgICAgICAgICAgICAgICAgc29ydE9yZGVyID0gLTE7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gcHJvcGVydHkuc3Vic3RyKDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEsYikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gKGFbcHJvcGVydHldIDwgYltwcm9wZXJ0eV0pID8gLTEgOiAoYVtwcm9wZXJ0eV0gPiBiW3Byb3BlcnR5XSkgPyAxIDogMDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdCAqIHNvcnRPcmRlcjtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRQYXJhbWV0ZXJCeU5hbWUobmFtZSkge1xuICAgICAgICAgICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtdLywgJ1xcXFxbJykucmVwbGFjZSgvW1xcXV0vLCAnXFxcXF0nKTtcbiAgICAgICAgICAgICAgICB2YXIgcmVnZXggPSBuZXcgUmVnRXhwKCdbXFxcXD8mXScgKyBuYW1lICsgJz0oW14mI10qKScpLFxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzID0gcmVnZXguZXhlYyhkYXRhKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0cyA9PT0gbnVsbCA/ICcnIDogZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMV0ucmVwbGFjZSgvXFwrL2csICcgJykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gWzIwMCwgaXRlbXMsIHt9XTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYnV0dG9ucy5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignQnV0dG9uc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgICAgJHNjb3BlLnNpbmdsZU1vZGVsID0gMTtcblxuICAgICAgICAkc2NvcGUucmFkaW9Nb2RlbCA9ICdNaWRkbGUnO1xuXG4gICAgICAgICRzY29wZS5jaGVja01vZGVsID0ge1xuICAgICAgICAgICAgbGVmdDogZmFsc2UsXG4gICAgICAgICAgICBtaWRkbGU6IHRydWUsXG4gICAgICAgICAgICByaWdodDogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmJ1dHRvbnMnLCBbXG4gICAgJ3dlYnNpdGUuYnV0dG9ucy5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYnV0dG9ucy5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnd2Vic2l0ZS5idXR0b25zLmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLmJ1dHRvbnMnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2J1dHRvbnMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvYnV0dG9ucy9idXR0b25zLnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQnV0dG9uc0N0cmwgYXMgYnV0dG9uc0N0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmNhcmRzLmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdDYXJkc0N0cmwnLCBmdW5jdGlvbigpIHtcblxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuY2FyZHMnLCBbXG4gICAgJ3dlYnNpdGUuY2FyZHMuc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmNhcmRzLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICd3ZWJzaXRlLmNhcmRzLmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLmNhcmRzJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9jYXJkcycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9jYXJkcy9jYXJkcy50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NhcmRzQ3RybCBhcyBjYXJkc0N0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmNvbG9yLXBpY2tlci1leGFtcGxlLmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdDb2xvclBpY2tlckV4YW1wbGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgICRzY29wZS5tb2RlbFZhbHVlID0gJyNjY2NjY2MnO1xuXG4gICAgICAgICRzY29wZS5wYWxldHRlID0gW1xuICAgICAgICAgICAgJyMwMEFCQzknLFxuICAgICAgICAgICAgJyM5NWRiODknLFxuICAgICAgICAgICAgJyNmZmI4MDAnLFxuICAgICAgICAgICAgJyNkYjYzNmInLFxuICAgICAgICAgICAgJyM1NTYyNzMnLFxuICAgICAgICAgICAgJyMyMzI4MzEnLFxuICAgICAgICAgICAgJyNiMTg2Y2InLFxuICAgICAgICAgICAgJyNmZjg4MDAnLFxuICAgICAgICAgICAgJyMzZTYyYTEnLFxuICAgICAgICAgICAgJyNlODlmYWUnLFxuICAgICAgICAgICAgJyM2ZWNjZmMnLFxuICAgICAgICBdO1xuXG4gICAgICAgICRzY29wZS5pbnB1dE1vZGVsVmFsdWUgPSAnIzZlY2NmYyc7XG4gICAgICAgICRzY29wZS5pbnB1dExhYmVsVGV4dCA9ICdJbnB1dCBMYWJlbCBUZXh0JztcbiAgICAgICAgJHNjb3BlLmlucHV0UGxhY2Vob2xkZXJUZXh0ID0gJ0lucHV0IFBsYWNlaG9sZGVyIFRleHQnO1xuICAgICAgICAkc2NvcGUuaW5wdXRQYWxldHRlID0gW1xuICAgICAgICAgICAgJyMwMEFCQzknLFxuICAgICAgICAgICAgJyNFNUY2RjknLFxuICAgICAgICAgICAgJyM5NURCODknLFxuICAgICAgICAgICAgJyNGRkI4MDAnXG4gICAgICAgIF07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5jb2xvci1waWNrZXItZXhhbXBsZScsIFtcbiAgICAnd2Vic2l0ZS5jb2xvci1waWNrZXItZXhhbXBsZS5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuY29sb3ItcGlja2VyLWV4YW1wbGUuc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUuY29sb3ItcGlja2VyLWV4YW1wbGUuY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMuY29sb3ItcGlja2VyLWV4YW1wbGUnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2NvbG9yLXBpY2tlcicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9jb2xvci1waWNrZXIvY29sb3ItcGlja2VyLnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ29sb3JQaWNrZXJFeGFtcGxlQ3RybCBhcyBjb2xvclBpY2tlckV4YW1wbGVDdHJsJ1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5jcmVkaXQtY2FyZC5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignQ3JlZGl0Q2FyZEN0cmwnLCBmdW5jdGlvbiBDcmVkaXRDYXJkQ3RybCgpIHtcbiAgICAgICAgdmFyIGN0cmwgPSB0aGlzO1xuXG4gICAgICAgIGN0cmwuY2NEYXRhID0ge1xuICAgICAgICAgICAgY2NOdW1iZXI6ICcnLFxuICAgICAgICAgICAgY2NDdnY6ICcnLFxuICAgICAgICAgICAgY2NOYW1lOiAnJyxcbiAgICAgICAgICAgIGNjRXhwaXJ5OiB7XG4gICAgICAgICAgICAgICAgbW9udGg6ICcnLFxuICAgICAgICAgICAgICAgIHllYXI6ICcnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2NUeXBlOiAnJyxcbiAgICAgICAgfTtcblxuICAgICAgICBjdHJsLmNjQ29uZmlnID0ge1xuICAgICAgICAgICAgY2FyZENvZGU6IHRydWUsXG4gICAgICAgICAgICBmdWxsTmFtZTogdHJ1ZSxcbiAgICAgICAgICAgIHN1cHBvcnRlZFR5cGVzOiBbJ0FtZXJpY2FuIEV4cHJlc3MnLCAnRGluZXJzIENsdWInLCAnRGlzY292ZXInLCAnTWFzdGVyQ2FyZCcsICdWaXNhJ10sXG4gICAgICAgIH07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5jcmVkaXQtY2FyZCcsIFtcbiAgICAnd2Vic2l0ZS5jcmVkaXQtY2FyZC5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuY3JlZGl0LWNhcmQuc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUuY3JlZGl0LWNhcmQuY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMuY3JlZGl0LWNhcmQnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2NyZWRpdC1jYXJkJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL2NyZWRpdC1jYXJkL2NyZWRpdC1jYXJkLnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ3JlZGl0Q2FyZEN0cmwgYXMgY3JlZGl0Q2FyZEN0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmdsb2JhbC1tZXNzYWdlLmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdHbG9iYWxNZXNzYWdlQ3RybCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5nbG9iYWwtbWVzc2FnZScsIFtcbiAgICAnd2Vic2l0ZS5nbG9iYWwtbWVzc2FnZS5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuZ2xvYmFsLW1lc3NhZ2Uuc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUuZ2xvYmFsLW1lc3NhZ2UuY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMuZ2xvYmFsLW1lc3NhZ2UnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2dsb2JhbC1tZXNzYWdlJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL2dsb2JhbC1tZXNzYWdlL2dsb2JhbC1tZXNzYWdlLnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnR2xvYmFsTWVzc2FnZUN0cmwgYXMgZ2xvYmFsTWVzc2FnZUN0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmxvYWRpbmctaW5kaWNhdG9ycy5jb250cm9sbGVyJywgW10pXG4gICAgLmNvbnRyb2xsZXIoJ0xvYWRpbmdJbmRpY2F0b3JzQ3RybCcsIGZ1bmN0aW9uKCRyb290U2NvcGUsICR0aW1lb3V0KSB7XG5cbiAgICAgICAgdmFyIGN0cmwgPSB0aGlzO1xuXG4gICAgICAgIGN0cmwuZmFrZUh0dHBSZXF1ZXN0ID0gZmFrZUh0dHBSZXF1ZXN0O1xuICAgICAgICBjdHJsLmZha2VTdGF0ZVRyYW5zaXRpb24gPSBmYWtlU3RhdGVUcmFuc2l0aW9uO1xuICAgICAgICBjdHJsLnRvZ2dsZU1hbnVhbExvYWRpbmcgPSB0b2dnbGVNYW51YWxMb2FkaW5nO1xuXG4gICAgICAgIGZ1bmN0aW9uIGZha2VIdHRwUmVxdWVzdCgpIHtcbiAgICAgICAgICAgIC8vIEhlcmUgd2UgYXJlIGVtaXR0aW5nIHRoZSBldmVudCBtYW51YWxseSwgaW4gYSByZWFsIHNjZW5hcmlvXG4gICAgICAgICAgICAvLyB5b3Ugc2hvdWxkIGluamVjdCB0aGUgYWpheFJlcXVlc3RTdGF0dXMgaHR0cEludGVyY2VwdG9yIGZyb20gbmctY29tbW9uXG4gICAgICAgICAgICAvLyB3aGljaCB3aWxsIGVtaXQgdGhlc2UgZXZlbnRzIGF1dG9tYXRpY2FsbHkgb24gbm9ybWFsICRodHRwIHJlcXVlc3RzXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KCdhamF4UmVxdWVzdFJ1bm5pbmcnLCB0cnVlKTtcblxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdCgnYWpheFJlcXVlc3RSdW5uaW5nJywgZmFsc2UpO1xuICAgICAgICAgICAgfSwgMzAwMCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmYWtlU3RhdGVUcmFuc2l0aW9uKCkge1xuICAgICAgICAgICAgLy8gSGVyZSB3ZSBhcmUgZW1pdHRpbmcgdGhlIGV2ZW50IG1hbnVhbGx5LCBpbiBhIHJlYWwgc2NlbmFyaW9cbiAgICAgICAgICAgIC8vIHlvdSB3b3VsZG50IGRvIHRoaXMuXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KCckc3RhdGVDaGFuZ2VTdGFydCcsIHRydWUpO1xuXG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgZmFsc2UpO1xuICAgICAgICAgICAgfSwgMzAwMCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVNYW51YWxMb2FkaW5nKCkge1xuICAgICAgICAgICAgY3RybC5tYW51YWxMb2FkaW5nID0gIWN0cmwubWFudWFsTG9hZGluZztcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUubG9hZGluZy1pbmRpY2F0b3JzJywgW1xuICAgICd3ZWJzaXRlLmxvYWRpbmctaW5kaWNhdG9ycy5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUubG9hZGluZy1pbmRpY2F0b3JzLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICd3ZWJzaXRlLmxvYWRpbmctaW5kaWNhdG9ycy5jb250cm9sbGVyJ1xuXSlcblxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29tcG9uZW50cy5sb2FkaW5nJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9sb2FkZXJzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL2xvYWRpbmctaW5kaWNhdG9ycy9sb2FkaW5nLWluZGljYXRvcnMudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2FkaW5nSW5kaWNhdG9yc0N0cmwgYXMgbG9hZGluZ0luZGljYXRvcnNDdHJsJ1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5tb2RhbC1jb250ZW50LmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdNb2RhbENvbnRlbnRDdHJsJywgZnVuY3Rpb24oJG1vZGFsSW5zdGFuY2UpIHtcbiAgICAgICAgdmFyIGN0cmwgPSB0aGlzO1xuXG4gICAgICAgIGN0cmwub2sgPSBvaztcbiAgICAgICAgY3RybC5jYW5jZWwgPSBjYW5jZWw7XG5cbiAgICAgICAgZnVuY3Rpb24gb2soJGV2ZW50KSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UoJ09LJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjYW5jZWwoJGV2ZW50KSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnQ2FuY2VsZWQnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUubW9kYWwuY29udHJvbGxlcicsIFtcbiAgICd3ZWJzaXRlLm1vZGFsLWNvbnRlbnQuY29udHJvbGxlcidcbl0pXG4gICAgLmRpcmVjdGl2ZSgndGFic2V0JywgZnVuY3Rpb24oJHRpbWVvdXQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlcXVpcmU6ICd0YWJzZXQnLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCB0YWJzZXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ID0gdGFic2V0LnNlbGVjdDtcblxuICAgICAgICAgICAgICAgIHRhYnNldC5zZWxlY3QgPSBmdW5jdGlvbih0YWIpIHtcbiAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFiLmlzUmVuZGVyZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2RlbWlycm9yRWxlbWVudHMgPSBlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3JBbGwoJy5Db2RlTWlycm9yJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChjb2RlbWlycm9yRWxlbWVudHMsIGZ1bmN0aW9uKGNvZGVtaXJyb3JFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZW1pcnJvckVsZW1lbnQuQ29kZU1pcnJvci5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGFiLmlzUmVuZGVyZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZWN0LmFwcGx5KHRhYnNldCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pXG5cbiAgICAuY29udHJvbGxlcignTW9kYWxDdHJsJywgZnVuY3Rpb24oJG1vZGFsKSB7XG4gICAgICAgIHZhciBjdHJsID0gdGhpcztcbiAgICAgICAgY3RybC5oYW5kbGVUYWJTZWxlY3QgPSBoYW5kbGVUYWJTZWxlY3Q7XG4gICAgICAgIGN0cmwuaXNUYWJBY3RpdmUgPSBpc1RhYkFjdGl2ZTtcbiAgICAgICAgY3RybC5vcGVuVW5mb3JtYXR0ZWRNb2RhbCA9IG9wZW5VbmZvcm1hdHRlZE1vZGFsO1xuICAgICAgICBjdHJsLm9wZW5Gb3JtYXR0ZWRNb2RhbCA9IG9wZW5Gb3JtYXR0ZWRNb2RhbDtcbiAgICAgICAgY3RybC5vcGVuUHJvbXB0ID0gb3BlblByb21wdDtcbiAgICAgICAgY3RybC5vcGVuTGFyZ2VNb2RhbCA9IG9wZW5MYXJnZU1vZGFsO1xuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVRhYlNlbGVjdCh0YWIpIHtcbiAgICAgICAgICAgIGN0cmwuY3VycmVudFRhYiA9IHRhYjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzVGFiQWN0aXZlKHRhYikge1xuICAgICAgICAgICAgcmV0dXJuIGN0cmwuY3VycmVudFRhYiA9PT0gdGFiO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb3BlblVuZm9ybWF0dGVkTW9kYWwoJGV2ZW50KSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTW9kYWxDb250ZW50Q3RybCBhcyBtb2RhbENvbnRlbnRDdHJsJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL21vZGFsL21vZGFsLXVuZm9ybWF0dGVkLnRwbC5odG1sJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBvcGVuRm9ybWF0dGVkTW9kYWwoJGV2ZW50KSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTW9kYWxDb250ZW50Q3RybCBhcyBtb2RhbENvbnRlbnRDdHJsJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL21vZGFsL21vZGFsLWZvcm1hdHRlZC50cGwuaHRtbCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb3BlblByb21wdCgkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJG1vZGFsLm9wZW4oe1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNb2RhbENvbnRlbnRDdHJsIGFzIG1vZGFsQ29udGVudEN0cmwnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvbW9kYWwvcHJvbXB0LnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICB3aW5kb3dDbGFzczogJ3Byb21wdCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb3BlbkxhcmdlTW9kYWwoJGV2ZW50KSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTW9kYWxDb250ZW50Q3RybCBhcyBtb2RhbENvbnRlbnRDdHJsJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL21vZGFsL21vZGFsLWZvcm1hdHRlZC50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgd2luZG93Q2xhc3M6ICdtb2RhbC0tbGFyZ2UnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUubW9kYWwnLCBbXG4gICAgJ3dlYnNpdGUubW9kYWwuc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLm1vZGFsLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICd3ZWJzaXRlLm1vZGFsLmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLm1vZGFsJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9tb2RhbCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9tb2RhbC9tb2RhbC50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01vZGFsQ3RybCBhcyBtb2RhbEN0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnBhbmVscy5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignUGFuZWxzQ3RybCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5wYW5lbHMnLCBbXG4gICAgJ3dlYnNpdGUucGFuZWxzLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5wYW5lbHMuc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUucGFuZWxzLmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLnBhbmVscycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvcGFuZWxzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL3BhbmVscy9wYW5lbHMudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQYW5lbHNDdHJsIGFzIHBhbmVsc0N0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnByb21wdC1jb250ZW50LmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdQcm9tcHRDb250ZW50Q29udHJvbGxlcicsIGZ1bmN0aW9uKCRwcm9tcHRJbnN0YW5jZSkge1xuICAgICAgICB2YXIgY3RybCA9IHRoaXM7XG5cbiAgICAgICAgY3RybC5vayA9IG9rO1xuICAgICAgICBjdHJsLmNhbmNlbCA9IGNhbmNlbDtcblxuICAgICAgICBmdW5jdGlvbiBvaygkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAkcHJvbXB0SW5zdGFuY2UuY2xvc2UoJ09LJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjYW5jZWwoJGV2ZW50KSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgJHByb21wdEluc3RhbmNlLmRpc21pc3MoJ0NhbmNlbGVkJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnByb21wdC5jb250cm9sbGVyJywgW1xuICAgJ3dlYnNpdGUucHJvbXB0LWNvbnRlbnQuY29udHJvbGxlcidcbl0pXG4gICAgLmRpcmVjdGl2ZSgndGFic2V0JywgZnVuY3Rpb24oJHRpbWVvdXQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlcXVpcmU6ICd0YWJzZXQnLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCB0YWJzZXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ID0gdGFic2V0LnNlbGVjdDtcblxuICAgICAgICAgICAgICAgIHRhYnNldC5zZWxlY3QgPSBmdW5jdGlvbih0YWIpIHtcbiAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFiLmlzUmVuZGVyZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2RlbWlycm9yRWxlbWVudHMgPSBlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3JBbGwoJy5Db2RlTWlycm9yJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChjb2RlbWlycm9yRWxlbWVudHMsIGZ1bmN0aW9uKGNvZGVtaXJyb3JFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZW1pcnJvckVsZW1lbnQuQ29kZU1pcnJvci5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGFiLmlzUmVuZGVyZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZWN0LmFwcGx5KHRhYnNldCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pXG5cbiAgICAuY29udHJvbGxlcignUHJvbXB0Q3RybCcsIGZ1bmN0aW9uKCRwcm9tcHQpIHtcbiAgICAgICAgdmFyIGN0cmwgPSB0aGlzO1xuICAgICAgICBjdHJsLmhhbmRsZVRhYlNlbGVjdCA9IGhhbmRsZVRhYlNlbGVjdDtcbiAgICAgICAgY3RybC5pc1RhYkFjdGl2ZSA9IGlzVGFiQWN0aXZlO1xuICAgICAgICBjdHJsLm9wZW5Qcm9tcHQgPSBvcGVuUHJvbXB0O1xuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVRhYlNlbGVjdCh0YWIpIHtcbiAgICAgICAgICAgIGN0cmwuY3VycmVudFRhYiA9IHRhYjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzVGFiQWN0aXZlKHRhYikge1xuICAgICAgICAgICAgcmV0dXJuIGN0cmwuY3VycmVudFRhYiA9PT0gdGFiO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb3BlblByb21wdCgkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJHByb21wdC5vcGVuKHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvbXB0Q29udGVudEN0cmwgYXMgcHJvbXB0Q29udGVudEN0cmwnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvcHJvbXB0L3Byb21wdC1tb2RhbC50cGwuaHRtbCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5wcm9tcHQnLCBbXG4gICAgJ3dlYnNpdGUucHJvbXB0LnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5wcm9tcHQuc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUucHJvbXB0LmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLnByb21wdCcsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvcHJvbXB0JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL3Byb21wdC9wcm9tcHQudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9tcHRDdHJsIGFzIHByb21wdEN0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnRhYmxlcy5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignVGFibGVzQ3RybCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS50YWJsZXMnLCBbXG4gICAgJ3dlYnNpdGUudGFibGVzLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS50YWJsZXMuc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUudGFibGVzLmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLnRhYmxlcycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvdGFibGVzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL3RhYmxlcy90YWJsZXMudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdUYWJsZXNDdHJsIGFzIHRhYmxlc0N0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnRhYnMuY29udHJvbGxlcicsIFtdKVxuXG4gICAgLmNvbnRyb2xsZXIoJ1RhYnNDdHJsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjdHJsID0gdGhpcztcblxuICAgICAgICBjdHJsLnRhYnMgPSBbXG4gICAgICAgICAgICB7IHRpdGxlOidEeW5hbWljIFRpdGxlIDEnLCBjb250ZW50OidEeW5hbWljIGNvbnRlbnQgMScgfSxcbiAgICAgICAgICAgIHsgdGl0bGU6J0R5bmFtaWMgVGl0bGUgMicsIGNvbnRlbnQ6J0R5bmFtaWMgY29udGVudCAyJyB9XG4gICAgICAgIF07XG5cbiAgICAgICAgY3RybC50YWJDbGlja2VkID0gZnVuY3Rpb24gdGFiQ2xpY2tlZCgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0YWIgY2xpY2tlZCEnKTtcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnRhYnMnLCBbXG4gICAgJ3dlYnNpdGUudGFicy5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUudGFicy5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnd2Vic2l0ZS50YWJzLmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLnRhYnMnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL3RhYnMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvdGFicy90YWJzLnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVGFic0N0cmwgYXMgdGFic0N0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnRvb2x0aXAnLCBbXG4gICAgJ3dlYnNpdGUudG9vbHRpcC5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUudG9vbHRpcC5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJ1xuXSlcblxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29tcG9uZW50cy50b29sdGlwJywge1xuICAgICAgICAgICAgICAgIHVybDogJy90b29sdGlwJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL3Rvb2x0aXAvdG9vbHRpcC50cGwuaHRtbCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUud2FybmluZy1idXR0b24nLCBbXG4gICAgJ3dlYnNpdGUud2FybmluZy1idXR0b24uc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLndhcm5pbmctYnV0dG9uLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICd3ZWJzaXRlLm1vZGFsLmNvbnRyb2xsZXInLFxuXSlcbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMud2FybmluZy1idXR0b24nLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL3dhcm5pbmctYnV0dG9uJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL3dhcm5pbmctYnV0dG9uL3dhcm5pbmctYnV0dG9uLnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTW9kYWxDdHJsIGFzIG1vZGFsQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmMtc2VydmVyLXRhYmxlLnNhbXBsZS1kYXRhLnNlcnZpY2UnLCBbXSlcbiAgICAuZmFjdG9yeSgnc2FtcGxlRGF0YScsIGZ1bmN0aW9uIHNhbXBsZURhdGEoJGh0dHApIHtcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XG4gICAgICAgICAgICBnZXRTYW1wbGVEYXRhOiBnZXRTYW1wbGVEYXRhXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0U2FtcGxlRGF0YShxdWVyeVBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL3RhYmxlLmpzb24nLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiBxdWVyeVBhcmFtc1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiBnZXRTYW1wbGVEYXRhU3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93czogcmVzcG9uc2UuZGF0YS5yb3dzLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IHJlc3BvbnNlLmRhdGEucGFnaW5hdGlvbi5wYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0OiByZXNwb25zZS5kYXRhLnBhZ2luYXRpb24ubGltaXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IHJlc3BvbnNlLmRhdGEucGFnaW5hdGlvbi5udW1JdGVtc1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XG4gICAgfSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=