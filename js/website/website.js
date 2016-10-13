'use strict';

angular.module('website', ['bcapp-pattern-lab', 'mm.foundation', 'website-templates', 'ui.codemirror', 'ui.router',

// JS Components
'website.accordion', 'website.alerts', 'website.aside-header-toggle', 'website.aside-nav', 'website.banners', 'website.bc-datepicker', 'website.bc-dropdown', 'website.bc-pagination', 'website.bc-server-table', 'website.buttons', 'website.cards', 'website.color-picker-example', 'website.credit-card', 'website.loading-indicators', 'website.icons', 'website.modal', 'website.panels', 'website.prompt', 'website.switch', 'website.tables', 'website.tabs', 'website.tooltip', 'website.warning-button']).constant('BC_APP_CONFIG', {}).config(function ($stateProvider, svgRootPathProvider) {
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

angular.module('website.bc-dropdown', ['website.bc-dropdown.state']);
'use strict';

angular.module('website.bc-dropdown.state', ['ui.router']).config(function ($stateProvider) {
    $stateProvider.state('components.bc-dropdown', {
        url: '/bc-dropdown',
        templateUrl: 'src/website/js/examples/bc-dropdown/bc-dropdown.tpl.html'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFzaWRlSGVhZGVyVG9nZ2xlL2FzaWRlSGVhZGVyVG9nZ2xlLmNvbnRyb2xsZXIuanMiLCJhc2lkZUhlYWRlclRvZ2dsZS9hc2lkZUhlYWRlclRvZ2dsZS5kaXJlY3RpdmUuanMiLCJhc2lkZUhlYWRlclRvZ2dsZS9hc2lkZUhlYWRlclRvZ2dsZS5tb2R1bGUuanMiLCJhc2lkZU5hdi9hc2lkZU5hdi5jb250cm9sbGVyLmpzIiwiYXNpZGVOYXYvYXNpZGVOYXYubW9kdWxlLmpzIiwiaWNvbnMvaWNvbnMuY29udHJvbGxlci5qcyIsImljb25zL2ljb25zLmRpcmVjdGl2ZS5qcyIsImljb25zL2ljb25zLm1vZHVsZS5qcyIsInN3aXRjaC9zd2l0Y2guY29udHJvbGxlci5qcyIsInN3aXRjaC9zd2l0Y2gubW9kdWxlLmpzIiwiZXhhbXBsZXMvYWNjb3JkaW9uL2FjY29yZGlvbi5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvYWNjb3JkaW9uL2FjY29yZGlvbi5tb2R1bGUuanMiLCJleGFtcGxlcy9hY2NvcmRpb24vYWNjb3JkaW9uLnN0YXRlLmpzIiwiZXhhbXBsZXMvYmFubmVycy9iYW5uZXJzLmNvbnRyb2xsZXIuanMiLCJleGFtcGxlcy9iYW5uZXJzL2Jhbm5lcnMubW9kdWxlLmpzIiwiZXhhbXBsZXMvYmFubmVycy9iYW5uZXJzLnN0YXRlLmpzIiwiZXhhbXBsZXMvYWxlcnRzL2FsZXJ0cy5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvYWxlcnRzL2FsZXJ0cy5tb2R1bGUuanMiLCJleGFtcGxlcy9hbGVydHMvYWxlcnRzLnN0YXRlLmpzIiwiZXhhbXBsZXMvYmMtZHJvcGRvd24vYmMtZHJvcGRvd24ubW9kdWxlLmpzIiwiZXhhbXBsZXMvYmMtZHJvcGRvd24vYmMtZHJvcGRvd24uc3RhdGUuanMiLCJleGFtcGxlcy9iYy1kYXRlcGlja2VyL2JjLWRhdGVwaWNrZXIuY29udHJvbGxlci5qcyIsImV4YW1wbGVzL2JjLWRhdGVwaWNrZXIvYmMtZGF0ZXBpY2tlci5tb2R1bGUuanMiLCJleGFtcGxlcy9iYy1kYXRlcGlja2VyL2JjLWRhdGVwaWNrZXIuc3RhdGUuanMiLCJleGFtcGxlcy9iYy1wYWdpbmF0aW9uL2JjLXBhZ2luYXRpb24uY29udHJvbGxlci5qcyIsImV4YW1wbGVzL2JjLXBhZ2luYXRpb24vYmMtcGFnaW5hdGlvbi5tb2R1bGUuanMiLCJleGFtcGxlcy9iYy1wYWdpbmF0aW9uL2JjLXBhZ2luYXRpb24uc3RhdGUuanMiLCJleGFtcGxlcy9iYy1zZXJ2ZXItdGFibGUvYmMtc2VydmVyLXRhYmxlLmNvbnN0YW50cy5qcyIsImV4YW1wbGVzL2JjLXNlcnZlci10YWJsZS9iYy1zZXJ2ZXItdGFibGUuY29udHJvbGxlci5qcyIsImV4YW1wbGVzL2JjLXNlcnZlci10YWJsZS9iYy1zZXJ2ZXItdGFibGUubW9kdWxlLmpzIiwiZXhhbXBsZXMvYmMtc2VydmVyLXRhYmxlL2JjLXNlcnZlci10YWJsZS5zdGF0ZS5qcyIsImV4YW1wbGVzL2JjLXNlcnZlci10YWJsZS9lMmUtYmFja2VuZC5qcyIsImV4YW1wbGVzL2J1dHRvbnMvYnV0dG9ucy5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvYnV0dG9ucy9idXR0b25zLm1vZHVsZS5qcyIsImV4YW1wbGVzL2J1dHRvbnMvYnV0dG9ucy5zdGF0ZS5qcyIsImV4YW1wbGVzL2NhcmRzL2NhcmRzLmNvbnRyb2xsZXIuanMiLCJleGFtcGxlcy9jYXJkcy9jYXJkcy5tb2R1bGUuanMiLCJleGFtcGxlcy9jYXJkcy9jYXJkcy5zdGF0ZS5qcyIsImV4YW1wbGVzL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXIuY29udHJvbGxlci5qcyIsImV4YW1wbGVzL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXIubW9kdWxlLmpzIiwiZXhhbXBsZXMvY29sb3ItcGlja2VyL2NvbG9yLXBpY2tlci5zdGF0ZS5qcyIsImV4YW1wbGVzL2NyZWRpdC1jYXJkL2NyZWRpdC1jYXJkLmNvbnRyb2xsZXIuanMiLCJleGFtcGxlcy9jcmVkaXQtY2FyZC9jcmVkaXQtY2FyZC5tb2R1bGUuanMiLCJleGFtcGxlcy9jcmVkaXQtY2FyZC9jcmVkaXQtY2FyZC5zdGF0ZS5qcyIsImV4YW1wbGVzL2xvYWRpbmctaW5kaWNhdG9ycy9sb2FkaW5nLWluZGljYXRvcnMuY29udHJvbGxlci5qcyIsImV4YW1wbGVzL2xvYWRpbmctaW5kaWNhdG9ycy9sb2FkaW5nLWluZGljYXRvcnMubW9kdWxlLmpzIiwiZXhhbXBsZXMvbG9hZGluZy1pbmRpY2F0b3JzL2xvYWRpbmctaW5kaWNhdG9ycy5zdGF0ZS5qcyIsImV4YW1wbGVzL21vZGFsL21vZGFsLWNvbnRlbnQuY29udHJvbGxlci5qcyIsImV4YW1wbGVzL21vZGFsL21vZGFsLmNvbnRyb2xsZXIuanMiLCJleGFtcGxlcy9tb2RhbC9tb2RhbC5tb2R1bGUuanMiLCJleGFtcGxlcy9tb2RhbC9tb2RhbC5zdGF0ZS5qcyIsImV4YW1wbGVzL3BhbmVscy9wYW5lbHMuY29udHJvbGxlci5qcyIsImV4YW1wbGVzL3BhbmVscy9wYW5lbHMubW9kdWxlLmpzIiwiZXhhbXBsZXMvcGFuZWxzL3BhbmVscy5zdGF0ZS5qcyIsImV4YW1wbGVzL3Byb21wdC9wcm9tcHQtY29udGVudC5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvcHJvbXB0L3Byb21wdC5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvcHJvbXB0L3Byb21wdC5tb2R1bGUuanMiLCJleGFtcGxlcy9wcm9tcHQvcHJvbXB0LnN0YXRlLmpzIiwiZXhhbXBsZXMvdGFibGVzL3RhYmxlcy5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvdGFibGVzL3RhYmxlcy5tb2R1bGUuanMiLCJleGFtcGxlcy90YWJsZXMvdGFibGVzLnN0YXRlLmpzIiwiZXhhbXBsZXMvdGFicy90YWJzLmNvbnRyb2xsZXIuanMiLCJleGFtcGxlcy90YWJzL3RhYnMubW9kdWxlLmpzIiwiZXhhbXBsZXMvdGFicy90YWJzLnN0YXRlLmpzIiwiZXhhbXBsZXMvdG9vbHRpcC90b29sdGlwLm1vZHVsZS5qcyIsImV4YW1wbGVzL3Rvb2x0aXAvdG9vbHRpcC5zdGF0ZS5qcyIsImV4YW1wbGVzL3dhcm5pbmctYnV0dG9uL3dhcm5pbmctYnV0dG9uLm1vZHVsZS5qcyIsImV4YW1wbGVzL3dhcm5pbmctYnV0dG9uL3dhcm5pbmctYnV0dG9uLnN0YXRlLmpzIiwiZXhhbXBsZXMvYmMtc2VydmVyLXRhYmxlL3NlcnZpY2VzL2JjLXNlcnZlci10YWJsZS5zYW1wbGUtZGF0YS5zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FDdEIsbUJBQW1CLEVBQ25CLGVBQWUsRUFDZixtQkFBbUIsRUFDbkIsZUFBZSxFQUNmLFdBQVc7OztBQUdYLG1CQUFtQixFQUNuQixnQkFBZ0IsRUFDaEIsNkJBQTZCLEVBQzdCLG1CQUFtQixFQUNuQixpQkFBaUIsRUFDakIsdUJBQXVCLEVBQ3ZCLHFCQUFxQixFQUNyQix1QkFBdUIsRUFDdkIseUJBQXlCLEVBQ3pCLGlCQUFpQixFQUNqQixlQUFlLEVBQ2YsOEJBQThCLEVBQzlCLHFCQUFxQixFQUNyQiw0QkFBNEIsRUFDNUIsZUFBZSxFQUNmLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsZ0JBQWdCLEVBQ2hCLGdCQUFnQixFQUNoQixnQkFBZ0IsRUFDaEIsY0FBYyxFQUNkLGlCQUFpQixFQUNqQix3QkFBd0IsQ0FDM0IsQ0FBQyxDQUNHLFFBQVEsQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLENBRTdCLE1BQU0sQ0FBQyxVQUFTLGNBQWMsRUFBRSxtQkFBbUIsRUFBRTtBQUNsRCxrQkFBYyxDQUNULEtBQUssQ0FBQyxZQUFZLEVBQUU7QUFDakIsZ0JBQVEsRUFBRSxJQUFJO0FBQ2QsV0FBRyxFQUFFLGFBQWE7QUFDbEIsZ0JBQVEsRUFBRSxZQUFZO0tBQ3pCLENBQUMsQ0FBQzs7QUFFUCx1QkFBbUIsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7Q0FDbEQsQ0FBQyxDQUFDOzs7QUMzQ1As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YSxFQUFFLGFBQWE7S0FDL0IsQ0FBQzs7QUFFRixhQUFTLGFBQWEsQ0FBQyxXQUFXLEVBQUU7QUFDaEMsZUFBTyxLQUFLLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRTtBQUM1QixrQkFBTSxFQUFFLFdBQVc7U0FDdEIsQ0FBQyxDQUNHLElBQUksQ0FBQyxTQUFTLG9CQUFvQixDQUFDLFFBQVEsRUFBRTtBQUMxQyxtQkFBTztBQUNILG9CQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJO0FBQ3hCLDBCQUFVLEVBQUU7QUFDUix3QkFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUk7QUFDbkMseUJBQUssRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLO0FBQ3JDLHlCQUFLLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUTtpQkFDM0M7YUFDSixDQUFDO1NBQ0wsQ0FBQyxDQUFDO0tBQ1Y7O0FBRUQsV0FBTyxPQUFPLENBQUM7Q0FDbEIsQ0FBQyxDQUFDIiwiZmlsZSI6IndlYnNpdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZScsIFtcbiAgICAnYmNhcHAtcGF0dGVybi1sYWInLFxuICAgICdtbS5mb3VuZGF0aW9uJyxcbiAgICAnd2Vic2l0ZS10ZW1wbGF0ZXMnLFxuICAgICd1aS5jb2RlbWlycm9yJyxcbiAgICAndWkucm91dGVyJyxcblxuICAgIC8vIEpTIENvbXBvbmVudHNcbiAgICAnd2Vic2l0ZS5hY2NvcmRpb24nLFxuICAgICd3ZWJzaXRlLmFsZXJ0cycsXG4gICAgJ3dlYnNpdGUuYXNpZGUtaGVhZGVyLXRvZ2dsZScsXG4gICAgJ3dlYnNpdGUuYXNpZGUtbmF2JyxcbiAgICAnd2Vic2l0ZS5iYW5uZXJzJyxcbiAgICAnd2Vic2l0ZS5iYy1kYXRlcGlja2VyJyxcbiAgICAnd2Vic2l0ZS5iYy1kcm9wZG93bicsXG4gICAgJ3dlYnNpdGUuYmMtcGFnaW5hdGlvbicsXG4gICAgJ3dlYnNpdGUuYmMtc2VydmVyLXRhYmxlJyxcbiAgICAnd2Vic2l0ZS5idXR0b25zJyxcbiAgICAnd2Vic2l0ZS5jYXJkcycsXG4gICAgJ3dlYnNpdGUuY29sb3ItcGlja2VyLWV4YW1wbGUnLFxuICAgICd3ZWJzaXRlLmNyZWRpdC1jYXJkJyxcbiAgICAnd2Vic2l0ZS5sb2FkaW5nLWluZGljYXRvcnMnLFxuICAgICd3ZWJzaXRlLmljb25zJyxcbiAgICAnd2Vic2l0ZS5tb2RhbCcsXG4gICAgJ3dlYnNpdGUucGFuZWxzJyxcbiAgICAnd2Vic2l0ZS5wcm9tcHQnLFxuICAgICd3ZWJzaXRlLnN3aXRjaCcsXG4gICAgJ3dlYnNpdGUudGFibGVzJyxcbiAgICAnd2Vic2l0ZS50YWJzJyxcbiAgICAnd2Vic2l0ZS50b29sdGlwJyxcbiAgICAnd2Vic2l0ZS53YXJuaW5nLWJ1dHRvbidcbl0pXG4gICAgLmNvbnN0YW50KCdCQ19BUFBfQ09ORklHJywge30pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCBzdmdSb290UGF0aFByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMnLCB7XG4gICAgICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgdXJsOiAnL2NvbXBvbmVudHMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPHVpLXZpZXcvPidcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHN2Z1Jvb3RQYXRoUHJvdmlkZXIuc2V0Um9vdFBhdGgoJy9zdmcvaWNvbnMvJyk7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5hc2lkZS1oZWFkZXItdG9nZ2xlLmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdBc2lkZUhlYWRlclRvZ2dsZUN0cmwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGN0cmwgPSB0aGlzO1xuICAgICAgICBjdHJsLmNsaWNrSGFuZGxlciA9IGNsaWNrSGFuZGxlcjtcbiAgICAgICAgY3RybC5pc09wZW4gPSBmYWxzZTtcbiAgICAgICAgY3RybC5zZXRJc09wZW4gPSBzZXRJc09wZW47XG5cbiAgICAgICAgZnVuY3Rpb24gY2xpY2tIYW5kbGVyKCRldmVudCkge1xuICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAoY3RybC5pc09wZW4pe1xuICAgICAgICAgICAgICAgIGN0cmwuc2V0SXNPcGVuKGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY3RybC5zZXRJc09wZW4odHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRJc09wZW4odmFsdWUpIHtcbiAgICAgICAgICAgIGN0cmwuaXNPcGVuID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmFzaWRlLWhlYWRlci10b2dnbGUuZGlyZWN0aXZlJywgW1xuICAgICAgICAnd2Vic2l0ZS5hc2lkZS1oZWFkZXItdG9nZ2xlLmNvbnRyb2xsZXInXG4gICAgXSlcbiAgICAuZGlyZWN0aXZlKCdhc2lkZUhlYWRlclRvZ2dsZScsICAoKSA9PiB7XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0FzaWRlSGVhZGVyVG9nZ2xlQ3RybCcsXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdhc2lkZUhlYWRlclRvZ2dsZUN0cmwnLFxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICBzY29wZToge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnPSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2FzaWRlSGVhZGVyVG9nZ2xlL2FzaWRlSGVhZGVyVG9nZ2xlLnRwbC5odG1sJ1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYXNpZGUtaGVhZGVyLXRvZ2dsZScsIFtcbiAgICAnd2Vic2l0ZS5hc2lkZS1oZWFkZXItdG9nZ2xlLmRpcmVjdGl2ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYXNpZGUtbmF2LmNvbnRyb2xsZXInLCBbXSlcbiAgICAuY29udHJvbGxlcignQXNpZGVOYXZDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkd2luZG93KSB7XG4gICAgXHQkc2NvcGUuaXNBY3RpdmUgPSBmdW5jdGlvbiAodmlld0xvY2F0aW9uKSB7XG4gICAgXHRcdHJldHVybiAodmlld0xvY2F0aW9uID09PSAkd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKTtcblx0XHR9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYXNpZGUtbmF2JywgW1xuICAgICd3ZWJzaXRlLmFzaWRlLW5hdi5jb250cm9sbGVyJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5pY29ucy5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignSWNvbnNDdHJsJywgZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgICRzY29wZS5pY29ucyA9IHdpbmRvdy5pY29ucztcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmljb25zLmRpcmVjdGl2ZScsIFtcbiAgICAgICAgJ3dlYnNpdGUuaWNvbnMuY29udHJvbGxlcidcbiAgICBdKVxuICAgIC5kaXJlY3RpdmUoJ2ljb25zTGlzdCcsIGZ1bmN0aW9uIGJjSWNvbkRpcmVjdGl2ZSgpIHtcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2ljb25zL2ljb25zLnRwbC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdJY29uc0N0cmwgYXMgaWNvbnNDdHJsJ1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuaWNvbnMnLCBbXG4gICAgJ3dlYnNpdGUuaWNvbnMuZGlyZWN0aXZlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5zd2l0Y2guY29udHJvbGxlcicsIFtdKVxuXG4gICAgLmNvbnRyb2xsZXIoJ1BhdHRlcm5MYWJTd2l0Y2hDdHJsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjdHJsID0gdGhpcztcblxuICAgICAgICBjdHJsLnN3aXRjaE9uZSA9IGZhbHNlO1xuICAgICAgICBjdHJsLnN3aXRjaFR3byA9IHRydWU7XG4gICAgICAgIGN0cmwuc3dpdGNoVGhyZWUgPSBmYWxzZTtcbiAgICAgICAgY3RybC5zd2l0Y2hGb3VyID0gdHJ1ZTtcbiAgICAgICAgY3RybC5zd2l0Y2hGaXZlID0gZmFsc2U7XG4gICAgICAgIGN0cmwuc3dpdGNoU2l4ID0gZmFsc2U7XG4gICAgICAgIGN0cmwuaXNTd2l0Y2hTaXhEaXNhYmxlZCA9IHRydWU7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5zd2l0Y2gnLCBbXG4gICAgJ3dlYnNpdGUuc3dpdGNoLmNvbnRyb2xsZXInXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmFjY29yZGlvbi5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignQWNjb3JkaW9uQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgICAkc2NvcGUub25lQXRBVGltZSA9IHRydWU7XG5cbiAgICAgICAgJHNjb3BlLmdyb3VwcyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJ2R5bmFtaWMtMScsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiRHluYW1pYyBHcm91cCBIZWFkZXIgLSAxXCIsXG4gICAgICAgICAgICAgICAgY29udGVudDogXCJEeW5hbWljIEdyb3VwIEJvZHkgLSAxXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICdkeW5hbWljLTInLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIkR5bmFtaWMgR3JvdXAgSGVhZGVyIC0gMlwiLFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiRHluYW1pYyBHcm91cCBCb2R5IC0gMlwiXG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG5cbiAgICAgICAgJHNjb3BlLml0ZW1zID0gWydJdGVtIDEnLCAnSXRlbSAyJywgJ0l0ZW0gMyddO1xuXG4gICAgICAgICRzY29wZS5hZGRJdGVtID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgbmV3SXRlbU5vID0gJHNjb3BlLml0ZW1zLmxlbmd0aCArIDE7XG4gICAgICAgICAgICAkc2NvcGUuaXRlbXMucHVzaCgnSXRlbSAnICsgbmV3SXRlbU5vKTtcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmFjY29yZGlvbicsIFtcbiAgICAnd2Vic2l0ZS5hY2NvcmRpb24uc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmFjY29yZGlvbi5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnd2Vic2l0ZS5hY2NvcmRpb24uY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMuYWNjb3JkaW9uJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9hY2NvcmRpb24nLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvYWNjb3JkaW9uL2FjY29yZGlvbi50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FjY29yZGlvbkN0cmwgYXMgYWNjb3JkaW9uQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmFubmVycy5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignQmFubmVyc0N0cmwnLCBmdW5jdGlvbigpIHtcblxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmFubmVycycsIFtcbiAgICAnd2Vic2l0ZS5iYW5uZXJzLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5iYW5uZXJzLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICd3ZWJzaXRlLmJhbm5lcnMuY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMuYmFubmVycycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYmFubmVycycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9iYW5uZXJzL2Jhbm5lcnMudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCYW5uZXJzQ3RybCBhcyBiYW5uZXJzQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYWxlcnRzLmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdBbGVydHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgICRzY29wZS5hbGVydHMgPSBbXG4gICAgICAgICAgICB7IG1zZzogJ0dlbmVyaWMgYWxlcnQnIH0sXG4gICAgICAgICAgICB7IHR5cGU6ICdpbmZvJywgbXNnOiAnSW5mb3JtYXRpb25hbCBhbGVydCcgfSxcbiAgICAgICAgICAgIHsgdHlwZTogJ3N1Y2Nlc3MnLCBtc2c6ICdTdWNjZXNzIGFsZXJ0JyB9LFxuICAgICAgICAgICAgeyB0eXBlOiAnd2FybmluZycsIG1zZzogJ1dhcm5pbmcgYWxlcnQnIH0sXG4gICAgICAgICAgICB7IHR5cGU6ICdlcnJvcicsIG1zZzogJ0Vycm9yIGFsZXJ0JyB9XG4gICAgICAgIF07XG5cbiAgICAgICAgJHNjb3BlLm9wZW5BbGVydCA9ICB7IHR5cGU6ICdlcnJvcicsIG1zZzogJ0Vycm9yIGFsZXJ0IGluIGEgcGFuZWwnIH07XG5cbiAgICAgICAgJHNjb3BlLmFkZEFsZXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2NvcGUuYWxlcnRzLnB1c2goe21zZzogJ0Fub3RoZXIgZ2VuZXJpYyBhbGVydCEnfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLmNsb3NlQWxlcnQgPSBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgJHNjb3BlLmFsZXJ0cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYWxlcnRzJywgW1xuICAgICd3ZWJzaXRlLmFsZXJ0cy5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYWxlcnRzLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICd3ZWJzaXRlLmFsZXJ0cy5jb250cm9sbGVyJ1xuXSlcblxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29tcG9uZW50cy5hbGVydHMnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2FsZXJ0cycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9hbGVydHMvYWxlcnRzLnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQWxlcnRzQ3RybCBhcyBhbGVydHNDdHJsJ1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5iYy1kcm9wZG93bicsIFtcbiAgICAnd2Vic2l0ZS5iYy1kcm9wZG93bi5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmMtZHJvcGRvd24uc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMuYmMtZHJvcGRvd24nLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2JjLWRyb3Bkb3duJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL2JjLWRyb3Bkb3duL2JjLWRyb3Bkb3duLnRwbC5odG1sJ1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5iYy1kYXRlcGlja2VyLmNvbnRyb2xsZXInLCBbXSlcbiAgICAuY29udHJvbGxlcignQmNEYXRlcGlja2VyQ3RybCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY3RybCA9IHRoaXM7XG5cbiAgICAgICAgY3RybC5vcHRpb25zID0ge307XG4gICAgfSk7XG5cbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmJjLWRhdGVwaWNrZXInLCBbXG4gICAgJ3dlYnNpdGUuYmMtZGF0ZXBpY2tlci5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmMtZGF0ZXBpY2tlci5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnd2Vic2l0ZS5iYy1kYXRlcGlja2VyLmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLmJjLWRhdGVwaWNrZXInLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2JjLWRhdGVwaWNrZXInLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvYmMtZGF0ZXBpY2tlci9iYy1kYXRlcGlja2VyLnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQmNEYXRlcGlja2VyQ3RybCBhcyBiY0RhdGVwaWNrZXJDdHJsJ1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5iYy1wYWdpbmF0aW9uLmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdCY1BhZ2luYXRpb25DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9nKSB7XG4gICAgICAgICRzY29wZS50b3RhbEl0ZW1zID0gMjAwO1xuICAgICAgICAkc2NvcGUuY3VycmVudFBhZ2UgPSAxO1xuICAgICAgICAkc2NvcGUubWF4U2l6ZSA9IDU7XG4gICAgICAgICRzY29wZS5pdGVtc1BlclBhZ2UgPSAxMDtcbiAgICAgICAgJHNjb3BlLnNob3dMaW1pdHMgPSBmYWxzZTtcblxuICAgICAgICAkc2NvcGUub25TZWxlY3RQYWdlID0gZnVuY3Rpb24obmV3VmFsdWVzKSB7XG4gICAgICAgICAgICAkbG9nLmxvZygnTmV3IFZhbHVlcyBDb21ibzogJywgbmV3VmFsdWVzKTtcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuc2V0UGFnZSA9IGZ1bmN0aW9uKHBhZ2VObykge1xuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRQYWdlID0gcGFnZU5vO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5jdXN0b21MaW1pdHMgPSBbMTAsIDIwLCAzMCwgMTAwXTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmJjLXBhZ2luYXRpb24nLCBbXG4gICAgJ3dlYnNpdGUuYmMtcGFnaW5hdGlvbi5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmMtcGFnaW5hdGlvbi5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnd2Vic2l0ZS5iYy1wYWdpbmF0aW9uLmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLmJjLXBhZ2luYXRpb24nLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2JjLXBhZ2luYXRpb24nLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvYmMtcGFnaW5hdGlvbi9iYy1wYWdpbmF0aW9uLnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQmNQYWdpbmF0aW9uQ3RybCBhcyBiY1BhZ2luYXRpb25DdHJsJ1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5iYy1zZXJ2ZXItdGFibGUuY29uc3RhbnRzJywgW10pXG4gICAgLmNvbnN0YW50KCdERU1PX1RBQkxFX0NPTkZJRycsIHtcbiAgICAgICAgcXVlcnlLZXlzOiB7XG4gICAgICAgICAgICBwYWdlOiAncGFnZScsXG4gICAgICAgICAgICBsaW1pdDogJ2xpbWl0JyxcbiAgICAgICAgICAgIHNvcnRCeTogJ3NvcnQtYnknLFxuICAgICAgICAgICAgc29ydERpcjogJ3NvcnQtb3JkZXInXG4gICAgICAgIH0sXG4gICAgICAgIHNvcnREaXJWYWx1ZXM6IHtcbiAgICAgICAgICAgIGFzYzogJ2FzYycsXG4gICAgICAgICAgICBkZXNjOiAnZHNjJ1xuICAgICAgICB9LFxuICAgICAgICBmaWx0ZXJzOiBbJ3RpbWUnXSxcbiAgICAgICAgcm93SWRLZXk6ICduYW1lJ1xuICAgIH0pXG4gICAgLmNvbnN0YW50KCdERU1PX1RBQkxFX0lEJywgJ2RlbW8tdGFibGUnKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmJjLXNlcnZlci10YWJsZS5jb250cm9sbGVyJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICdiY2FwcC1wYXR0ZXJuLWxhYi5iYy1zZXJ2ZXItdGFibGUnLFxuICAgICdlMmUtYmFja2VuZCdcbl0pXG5cbiAgICAuY29udHJvbGxlcignQmNTZXJ2ZXJUYWJsZURlbW9DdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIGJjU2VydmVyVGFibGVGYWN0b3J5LCBkYXRhVGFibGUsIERFTU9fVEFCTEVfSUQpIHtcbiAgICAgICAgdmFyIGN0cmwgPSB0aGlzO1xuXG4gICAgICAgIGN0cmwuY2xlYXJUYWJsZSA9IGNsZWFyVGFibGU7XG4gICAgICAgIGN0cmwuYmNTZXJ2ZXJUYWJsZSA9IGJjU2VydmVyVGFibGVGYWN0b3J5LmdldChERU1PX1RBQkxFX0lEKTtcblxuICAgICAgICAvLyBUaGlzIG5lZWRzIHRvIGJlIGhlcmUgdW50aWwgdGhlIHBhZ2luYXRpb24gZGlyZWN0aXZlIGlzIHVwZGF0ZWRcbiAgICAgICAgLy8gdG8gcHJlc2VydmUgY29udGV4dCB3aGVuIGNhbGxpbmcgdGhlIG9uLWNoYW5nZSBmdW5jdGlvbi5cbiAgICAgICAgY3RybC5iY1NlcnZlclRhYmxlLnVwZGF0ZVBhZ2UgPSBfLmJpbmQoY3RybC5iY1NlcnZlclRhYmxlLnVwZGF0ZVBhZ2UsIGN0cmwuYmNTZXJ2ZXJUYWJsZSk7XG5cbiAgICAgICAgZnVuY3Rpb24gY2xlYXJUYWJsZSgkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCRzdGF0ZS5jdXJyZW50Lm5hbWUsIHsgcGFnZTogMSB9LCB7IGluaGVyaXQ6IGZhbHNlIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5iYy1zZXJ2ZXItdGFibGUnLCBbXG4gICAgJ3dlYnNpdGUuYmMtc2VydmVyLXRhYmxlLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5iYy1zZXJ2ZXItdGFibGUuc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUuYmMtc2VydmVyLXRhYmxlLmNvbnN0YW50cycsXG4gICAgJ3dlYnNpdGUuYmMtc2VydmVyLXRhYmxlLmNvbnRyb2xsZXInLFxuICAgICd3ZWJzaXRlLmJjLXNlcnZlci10YWJsZS5zYW1wbGUtZGF0YS5zZXJ2aWNlJ1xuXSlcblxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29tcG9uZW50cy5iYy1zZXJ2ZXItdGFibGUnLCB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0JjU2VydmVyVGFibGVEZW1vQ3RybCBhcyBiY1NlcnZlclRhYmxlRGVtb0N0cmwnLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVRhYmxlOiBmdW5jdGlvbiBkYXRhVGFibGVSZXNvbHZlKCRzdGF0ZVBhcmFtcywgYmNTZXJ2ZXJUYWJsZUZhY3RvcnksIERFTU9fVEFCTEVfQ09ORklHLCBERU1PX1RBQkxFX0lELCBzYW1wbGVEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmNTZXJ2ZXJUYWJsZUZhY3RvcnlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY3JlYXRlKERFTU9fVEFCTEVfSUQsIERFTU9fVEFCTEVfQ09ORklHKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5pbml0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVQYXJhbXM6ICRzdGF0ZVBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VDYWxsYmFjazogc2FtcGxlRGF0YS5nZXRTYW1wbGVEYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvYmMtc2VydmVyLXRhYmxlL2JjLXNlcnZlci10YWJsZS50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnL2JjLXNlcnZlci10YWJsZT9zb3J0LW9yZGVyJnNvcnQtYnkmcGFnZSZsaW1pdCZ0aW1lJm5hbWUnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdlMmUtYmFja2VuZCcsIFtcbiAgICAnbmdNb2NrRTJFJ1xuXSlcbiAgICAucnVuKGZ1bmN0aW9uKCRodHRwQmFja2VuZCkge1xuICAgICAgICAkaHR0cEJhY2tlbmQud2hlbkdFVCgvXFwvdGFibGUuanNvbi4qLykucmVzcG9uZChhcGlSZXNwb25zZSk7XG4gICAgICAgICRodHRwQmFja2VuZC53aGVuR0VUKC8uKi8pLnBhc3NUaHJvdWdoKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYXBpUmVzcG9uc2Uoc3RhdHVzLCBkYXRhKSB7XG4gICAgICAgICAgICB2YXIgaXRlbXMsIHBhZ2luYXRpb24sIHJvd3MsIHJvd1RvU2hvdywgc29ydEJ5LCBmcm9tUm93LCB0b1JvdywgbGltaXQsIHBhZ2U7XG4gICAgICAgICAgICByb3dzID0gW1xuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnUml0dWFsIENvZmZlZSBSb2FzdGVycycsICdzdGFyJzogJ+KYheKYheKYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdIYXllcyBWYWxsZXknfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0JsdWUgQm90dGxlJywgJ3N0YXInOiAn4piF4piF4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ0hheWVzIFZhbGxleScgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0NvZmZlZVNob3AnLCAnc3Rhcic6ICfimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnQmVybmFsIEhlaWdodHMnIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdTcGlrZVxcJ3MgQ29mZmVlICYgVGVhcycsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdDYXN0cm8nIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdMYSBCb3VsYW5nZScsICdzdGFyJzogJ+KYheKYhScsICdzZi1sb2NhdGlvbic6ICdDb2xlIFZhbGxleScgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0R5bmFtbyBEb251dCBhbmQgQ29mZmVlJywgJ3N0YXInOiAn4piF4piF4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ0NvdyBIb2xsb3cnIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdUaGUgTWlsbCcsICdzdGFyJzogJ+KYheKYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdEaXZpc2FkZXJvJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnUGljY2lubyBDb2ZmZWUgQmFyJywgJ3N0YXInOiAn4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ0RvZ3BhdGNoJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnUGhpbHonLCAnc3Rhcic6ICfimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnRG93bnRvd24nIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdEdWJvY2UgUGFyayBDYWZlJywgJ3N0YXInOiAn4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ0R1Ym9jZSBUcmlhbmdsZScgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0JsdWUgQm90dGxlJywgJ3N0YXInOiAn4piF4piF4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ0VtYmFyY2FkZXJvJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnRm91ciBCYXJyZWwnLCAnc3Rhcic6ICfimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnRXhjZWxzaW9yJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnQ29mZmVlIEJhcicsICdzdGFyJzogJ+KYheKYheKYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdGaURpJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnQmlzY29mZiBDb2ZmZWUgQ29ybmVyJywgJ3N0YXInOiAn4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ0Zpc2hlcm1hblxcJ3MgV2hhcmYnIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdGaWZ0eS9GaWZ0eSBDb2ZmZWUgYW5kIFRlYScsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdJbm5lciBSaWNobW9uZCcgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0JlYW5lcnknLCAnc3Rhcic6ICfimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnSW5uZXIgU3Vuc2V0JyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnQ2FmZSBkdSBTb2xlaWwnLCAnc3Rhcic6ICfimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnTG93ZXIgSGFpZ2h0JyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnUGVldFxcJ3MnLCAnc3Rhcic6ICfimIUnLCAnc2YtbG9jYXRpb24nOiAnVGhlIE1hcmluYScgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ1NpZ2h0Z2xhc3MnLCAnc3Rhcic6ICfimIXimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnVGhlIE1pc3Npb24nIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdDb250cmFiYW5kIENvZmZlZSBCYXInLCAnc3Rhcic6ICfimIXimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnTm9iIEhpbGwnIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdNYXJ0aGEgJiBCcm9zIENvZmZlZScsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdOb2UgVmFsbGV5JyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnUsOpdmVpbGxlJywgJ3N0YXInOiAn4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ05vcnRoIEJlYWNoJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnQ3VwIENvZmZlZSBCYXInLCAnc3Rhcic6ICfimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnT3V0ZXIgTWlzc2lvbicgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0dhcmRlbiBIb3VzZSBDYWZlJywgJ3N0YXInOiAn4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ091dGVyIFJpY2htb25kJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnQW5keXRvd24gQ29mZmVlIFJvYXN0ZXJzJywgJ3N0YXInOiAn4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ091dGVyIFN1bnNldCcgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0phbmUgb24gRmlsbG1vcmUnLCAnc3Rhcic6ICfimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnUGFjaWZpYyBIZWlnaHRzJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnU2FpbnQgRnJhbmsgQ29mZmVlJywgJ3N0YXInOiAn4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ1BvbGsnIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdGYXJsZXnigJlzJywgJ3N0YXInOiAn4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ1BvdHJlcm8gSGlsbCcgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0hvdXNlIG9mIFNuYWNrcycsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdUaGUgUHJlc2lkaW8nIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdUaGUgQnJldycsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdSdXNzaWFuIEhpbGwnIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdXaWNrZWQgR3JvdW5kcycsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdTT01BJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnU3RhcmJ1Y2tzJywgJ3N0YXInOiAn4piFJywgJ3NmLWxvY2F0aW9uJzogJ1VuaW9uIFNxdWFyZScgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0ZseXdoZWVsIENvZmZlZSBSb2FzdGVycycsICdzdGFyJzogJ+KYheKYheKYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdVcHBlciBIYWlnaHQnIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBsaW1pdCA9IHBhcnNlSW50KGdldFBhcmFtZXRlckJ5TmFtZSgnbGltaXQnKSwgMTApIHx8IDExO1xuICAgICAgICAgICAgcGFnZSA9IHBhcnNlSW50KGdldFBhcmFtZXRlckJ5TmFtZSgncGFnZScpLCAxMCkgfHwgMTtcblxuICAgICAgICAgICAgaWYgKGdldFBhcmFtZXRlckJ5TmFtZSgnc29ydC1ieScpKSB7XG4gICAgICAgICAgICAgICAgc29ydEJ5ID0gZ2V0UGFyYW1ldGVyQnlOYW1lKCdzb3J0LWJ5Jyk7XG4gICAgICAgICAgICAgICAgaWYgKGdldFBhcmFtZXRlckJ5TmFtZSgnc29ydC1vcmRlcicpID09PSAnZHNjJykge1xuICAgICAgICAgICAgICAgICAgICBzb3J0QnkgPSAnLScgKyBzb3J0Qnk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJvd3Muc29ydChkeW5hbWljU29ydChzb3J0QnkpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGFnaW5hdGlvbiA9IHtcbiAgICAgICAgICAgICAgICAnbGltaXQnOiBsaW1pdCxcbiAgICAgICAgICAgICAgICAncGFnZSc6IHBhZ2UsXG4gICAgICAgICAgICAgICAgJ3BhZ2VzJzogTWF0aC5jZWlsKHJvd3MubGVuZ3RoIC8gbGltaXQpLFxuICAgICAgICAgICAgICAgICdudW1JdGVtcyc6IHJvd3MubGVuZ3RoXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdG9Sb3cgPSBwYWdpbmF0aW9uLmxpbWl0ICogcGFnaW5hdGlvbi5wYWdlO1xuICAgICAgICAgICAgZnJvbVJvdyA9IHRvUm93IC0gcGFnaW5hdGlvbi5saW1pdDtcblxuICAgICAgICAgICAgaWYgKGZyb21Sb3cgPj0gMCAmJiB0b1JvdyA+PSAwKSB7XG4gICAgICAgICAgICAgICAgcm93VG9TaG93ID0gcm93cy5zbGljZShmcm9tUm93LCB0b1Jvdyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJvd1RvU2hvdyA9IHJvd3M7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGl0ZW1zID0ge1xuICAgICAgICAgICAgICAgICdyb3dzJzogcm93VG9TaG93LFxuICAgICAgICAgICAgICAgICdwYWdpbmF0aW9uJzogcGFnaW5hdGlvbixcbiAgICAgICAgICAgICAgICAnc29ydC1ieSc6IGdldFBhcmFtZXRlckJ5TmFtZSgnc29ydC1ieScpLFxuICAgICAgICAgICAgICAgICdzb3J0LW9yZGVyJzogZ2V0UGFyYW1ldGVyQnlOYW1lKCdzb3J0LW9yZGVyJylcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGR5bmFtaWNTb3J0KHByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNvcnRPcmRlciA9IDE7XG4gICAgICAgICAgICAgICAgaWYocHJvcGVydHlbMF0gPT09ICctJykge1xuICAgICAgICAgICAgICAgICAgICBzb3J0T3JkZXIgPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkgPSBwcm9wZXJ0eS5zdWJzdHIoMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYSxiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSAoYVtwcm9wZXJ0eV0gPCBiW3Byb3BlcnR5XSkgPyAtMSA6IChhW3Byb3BlcnR5XSA+IGJbcHJvcGVydHldKSA/IDEgOiAwO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0ICogc29ydE9yZGVyO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldFBhcmFtZXRlckJ5TmFtZShuYW1lKSB7XG4gICAgICAgICAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvW1xcW10vLCAnXFxcXFsnKS5yZXBsYWNlKC9bXFxdXS8sICdcXFxcXScpO1xuICAgICAgICAgICAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoJ1tcXFxcPyZdJyArIG5hbWUgKyAnPShbXiYjXSopJyksXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMgPSByZWdleC5leGVjKGRhdGEpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRzID09PSBudWxsID8gJycgOiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1sxXS5yZXBsYWNlKC9cXCsvZywgJyAnKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBbMjAwLCBpdGVtcywge31dO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5idXR0b25zLmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdCdXR0b25zQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgICAkc2NvcGUuc2luZ2xlTW9kZWwgPSAxO1xuXG4gICAgICAgICRzY29wZS5yYWRpb01vZGVsID0gJ01pZGRsZSc7XG5cbiAgICAgICAgJHNjb3BlLmNoZWNrTW9kZWwgPSB7XG4gICAgICAgICAgICBsZWZ0OiBmYWxzZSxcbiAgICAgICAgICAgIG1pZGRsZTogdHJ1ZSxcbiAgICAgICAgICAgIHJpZ2h0OiBmYWxzZVxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYnV0dG9ucycsIFtcbiAgICAnd2Vic2l0ZS5idXR0b25zLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5idXR0b25zLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICd3ZWJzaXRlLmJ1dHRvbnMuY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMuYnV0dG9ucycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYnV0dG9ucycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9idXR0b25zL2J1dHRvbnMudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCdXR0b25zQ3RybCBhcyBidXR0b25zQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuY2FyZHMuY29udHJvbGxlcicsIFtdKVxuXG4gICAgLmNvbnRyb2xsZXIoJ0NhcmRzQ3RybCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5jYXJkcycsIFtcbiAgICAnd2Vic2l0ZS5jYXJkcy5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuY2FyZHMuc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUuY2FyZHMuY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMuY2FyZHMnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2NhcmRzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL2NhcmRzL2NhcmRzLnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ2FyZHNDdHJsIGFzIGNhcmRzQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuY29sb3ItcGlja2VyLWV4YW1wbGUuY29udHJvbGxlcicsIFtdKVxuXG4gICAgLmNvbnRyb2xsZXIoJ0NvbG9yUGlja2VyRXhhbXBsZUN0cmwnLCBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgICAgJHNjb3BlLm1vZGVsVmFsdWUgPSAnI2NjY2NjYyc7XG5cbiAgICAgICAgJHNjb3BlLnBhbGV0dGUgPSBbXG4gICAgICAgICAgICAnIzAwQUJDOScsXG4gICAgICAgICAgICAnIzk1ZGI4OScsXG4gICAgICAgICAgICAnI2ZmYjgwMCcsXG4gICAgICAgICAgICAnI2RiNjM2YicsXG4gICAgICAgICAgICAnIzU1NjI3MycsXG4gICAgICAgICAgICAnIzIzMjgzMScsXG4gICAgICAgICAgICAnI2IxODZjYicsXG4gICAgICAgICAgICAnI2ZmODgwMCcsXG4gICAgICAgICAgICAnIzNlNjJhMScsXG4gICAgICAgICAgICAnI2U4OWZhZScsXG4gICAgICAgICAgICAnIzZlY2NmYycsXG4gICAgICAgIF07XG5cbiAgICAgICAgJHNjb3BlLmlucHV0TW9kZWxWYWx1ZSA9ICcjNmVjY2ZjJztcbiAgICAgICAgJHNjb3BlLmlucHV0TGFiZWxUZXh0ID0gJ0lucHV0IExhYmVsIFRleHQnO1xuICAgICAgICAkc2NvcGUuaW5wdXRQbGFjZWhvbGRlclRleHQgPSAnSW5wdXQgUGxhY2Vob2xkZXIgVGV4dCc7XG4gICAgICAgICRzY29wZS5pbnB1dFBhbGV0dGUgPSBbXG4gICAgICAgICAgICAnIzAwQUJDOScsXG4gICAgICAgICAgICAnI0U1RjZGOScsXG4gICAgICAgICAgICAnIzk1REI4OScsXG4gICAgICAgICAgICAnI0ZGQjgwMCdcbiAgICAgICAgXTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmNvbG9yLXBpY2tlci1leGFtcGxlJywgW1xuICAgICd3ZWJzaXRlLmNvbG9yLXBpY2tlci1leGFtcGxlLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5jb2xvci1waWNrZXItZXhhbXBsZS5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnd2Vic2l0ZS5jb2xvci1waWNrZXItZXhhbXBsZS5jb250cm9sbGVyJ1xuXSlcblxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29tcG9uZW50cy5jb2xvci1waWNrZXItZXhhbXBsZScsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvY29sb3ItcGlja2VyJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXIudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDb2xvclBpY2tlckV4YW1wbGVDdHJsIGFzIGNvbG9yUGlja2VyRXhhbXBsZUN0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmNyZWRpdC1jYXJkLmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdDcmVkaXRDYXJkQ3RybCcsIGZ1bmN0aW9uIENyZWRpdENhcmRDdHJsKCkge1xuICAgICAgICB2YXIgY3RybCA9IHRoaXM7XG5cbiAgICAgICAgY3RybC5jY0RhdGEgPSB7XG4gICAgICAgICAgICBjY051bWJlcjogJycsXG4gICAgICAgICAgICBjY0N2djogJycsXG4gICAgICAgICAgICBjY05hbWU6ICcnLFxuICAgICAgICAgICAgY2NFeHBpcnk6IHtcbiAgICAgICAgICAgICAgICBtb250aDogJycsXG4gICAgICAgICAgICAgICAgeWVhcjogJydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjY1R5cGU6ICcnLFxuICAgICAgICB9O1xuXG4gICAgICAgIGN0cmwuY2NDb25maWcgPSB7XG4gICAgICAgICAgICBjYXJkQ29kZTogdHJ1ZSxcbiAgICAgICAgICAgIGZ1bGxOYW1lOiB0cnVlLFxuICAgICAgICAgICAgc3VwcG9ydGVkVHlwZXM6IFsnQW1lcmljYW4gRXhwcmVzcycsICdEaW5lcnMgQ2x1YicsICdEaXNjb3ZlcicsICdNYXN0ZXJDYXJkJywgJ1Zpc2EnXSxcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmNyZWRpdC1jYXJkJywgW1xuICAgICd3ZWJzaXRlLmNyZWRpdC1jYXJkLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5jcmVkaXQtY2FyZC5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnd2Vic2l0ZS5jcmVkaXQtY2FyZC5jb250cm9sbGVyJ1xuXSlcblxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29tcG9uZW50cy5jcmVkaXQtY2FyZCcsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvY3JlZGl0LWNhcmQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvY3JlZGl0LWNhcmQvY3JlZGl0LWNhcmQudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDcmVkaXRDYXJkQ3RybCBhcyBjcmVkaXRDYXJkQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUubG9hZGluZy1pbmRpY2F0b3JzLmNvbnRyb2xsZXInLCBbXSlcbiAgICAuY29udHJvbGxlcignTG9hZGluZ0luZGljYXRvcnNDdHJsJywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHRpbWVvdXQpIHtcblxuICAgICAgICB2YXIgY3RybCA9IHRoaXM7XG5cbiAgICAgICAgY3RybC5mYWtlSHR0cFJlcXVlc3QgPSBmYWtlSHR0cFJlcXVlc3Q7XG4gICAgICAgIGN0cmwuZmFrZVN0YXRlVHJhbnNpdGlvbiA9IGZha2VTdGF0ZVRyYW5zaXRpb247XG4gICAgICAgIGN0cmwudG9nZ2xlTWFudWFsTG9hZGluZyA9IHRvZ2dsZU1hbnVhbExvYWRpbmc7XG5cbiAgICAgICAgZnVuY3Rpb24gZmFrZUh0dHBSZXF1ZXN0KCkge1xuICAgICAgICAgICAgLy8gSGVyZSB3ZSBhcmUgZW1pdHRpbmcgdGhlIGV2ZW50IG1hbnVhbGx5LCBpbiBhIHJlYWwgc2NlbmFyaW9cbiAgICAgICAgICAgIC8vIHlvdSBzaG91bGQgaW5qZWN0IHRoZSBhamF4UmVxdWVzdFN0YXR1cyBodHRwSW50ZXJjZXB0b3IgZnJvbSBuZy1jb21tb25cbiAgICAgICAgICAgIC8vIHdoaWNoIHdpbGwgZW1pdCB0aGVzZSBldmVudHMgYXV0b21hdGljYWxseSBvbiBub3JtYWwgJGh0dHAgcmVxdWVzdHNcbiAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoJ2FqYXhSZXF1ZXN0UnVubmluZycsIHRydWUpO1xuXG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KCdhamF4UmVxdWVzdFJ1bm5pbmcnLCBmYWxzZSk7XG4gICAgICAgICAgICB9LCAzMDAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZha2VTdGF0ZVRyYW5zaXRpb24oKSB7XG4gICAgICAgICAgICAvLyBIZXJlIHdlIGFyZSBlbWl0dGluZyB0aGUgZXZlbnQgbWFudWFsbHksIGluIGEgcmVhbCBzY2VuYXJpb1xuICAgICAgICAgICAgLy8geW91IHdvdWxkbnQgZG8gdGhpcy5cbiAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoJyRzdGF0ZUNoYW5nZVN0YXJ0JywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBmYWxzZSk7XG4gICAgICAgICAgICB9LCAzMDAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZU1hbnVhbExvYWRpbmcoKSB7XG4gICAgICAgICAgICBjdHJsLm1hbnVhbExvYWRpbmcgPSAhY3RybC5tYW51YWxMb2FkaW5nO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5sb2FkaW5nLWluZGljYXRvcnMnLCBbXG4gICAgJ3dlYnNpdGUubG9hZGluZy1pbmRpY2F0b3JzLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5sb2FkaW5nLWluZGljYXRvcnMuc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUubG9hZGluZy1pbmRpY2F0b3JzLmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLmxvYWRpbmcnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2xvYWRlcnMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvbG9hZGluZy1pbmRpY2F0b3JzL2xvYWRpbmctaW5kaWNhdG9ycy50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvYWRpbmdJbmRpY2F0b3JzQ3RybCBhcyBsb2FkaW5nSW5kaWNhdG9yc0N0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLm1vZGFsLWNvbnRlbnQuY29udHJvbGxlcicsIFtdKVxuXG4gICAgLmNvbnRyb2xsZXIoJ01vZGFsQ29udGVudEN0cmwnLCBmdW5jdGlvbigkbW9kYWxJbnN0YW5jZSkge1xuICAgICAgICB2YXIgY3RybCA9IHRoaXM7XG5cbiAgICAgICAgY3RybC5vayA9IG9rO1xuICAgICAgICBjdHJsLmNhbmNlbCA9IGNhbmNlbDtcblxuICAgICAgICBmdW5jdGlvbiBvaygkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgnT0snKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNhbmNlbCgkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdDYW5jZWxlZCcpO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5tb2RhbC5jb250cm9sbGVyJywgW1xuICAgJ3dlYnNpdGUubW9kYWwtY29udGVudC5jb250cm9sbGVyJ1xuXSlcbiAgICAuZGlyZWN0aXZlKCd0YWJzZXQnLCBmdW5jdGlvbigkdGltZW91dCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVxdWlyZTogJ3RhYnNldCcsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIHRhYnNldCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3QgPSB0YWJzZXQuc2VsZWN0O1xuXG4gICAgICAgICAgICAgICAgdGFic2V0LnNlbGVjdCA9IGZ1bmN0aW9uKHRhYikge1xuICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWIuaXNSZW5kZXJlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvZGVtaXJyb3JFbGVtZW50cyA9IGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvckFsbCgnLkNvZGVNaXJyb3InKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKGNvZGVtaXJyb3JFbGVtZW50cywgZnVuY3Rpb24oY29kZW1pcnJvckVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlbWlycm9yRWxlbWVudC5Db2RlTWlycm9yLnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWIuaXNSZW5kZXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxlY3QuYXBwbHkodGFic2V0LCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSlcblxuICAgIC5jb250cm9sbGVyKCdNb2RhbEN0cmwnLCBmdW5jdGlvbigkbW9kYWwpIHtcbiAgICAgICAgdmFyIGN0cmwgPSB0aGlzO1xuICAgICAgICBjdHJsLmhhbmRsZVRhYlNlbGVjdCA9IGhhbmRsZVRhYlNlbGVjdDtcbiAgICAgICAgY3RybC5pc1RhYkFjdGl2ZSA9IGlzVGFiQWN0aXZlO1xuICAgICAgICBjdHJsLm9wZW5VbmZvcm1hdHRlZE1vZGFsID0gb3BlblVuZm9ybWF0dGVkTW9kYWw7XG4gICAgICAgIGN0cmwub3BlbkZvcm1hdHRlZE1vZGFsID0gb3BlbkZvcm1hdHRlZE1vZGFsO1xuICAgICAgICBjdHJsLm9wZW5Qcm9tcHQgPSBvcGVuUHJvbXB0O1xuICAgICAgICBjdHJsLm9wZW5MYXJnZU1vZGFsID0gb3BlbkxhcmdlTW9kYWw7XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlVGFiU2VsZWN0KHRhYikge1xuICAgICAgICAgICAgY3RybC5jdXJyZW50VGFiID0gdGFiO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNUYWJBY3RpdmUodGFiKSB7XG4gICAgICAgICAgICByZXR1cm4gY3RybC5jdXJyZW50VGFiID09PSB0YWI7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBvcGVuVW5mb3JtYXR0ZWRNb2RhbCgkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJG1vZGFsLm9wZW4oe1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNb2RhbENvbnRlbnRDdHJsIGFzIG1vZGFsQ29udGVudEN0cmwnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvbW9kYWwvbW9kYWwtdW5mb3JtYXR0ZWQudHBsLmh0bWwnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG9wZW5Gb3JtYXR0ZWRNb2RhbCgkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJG1vZGFsLm9wZW4oe1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNb2RhbENvbnRlbnRDdHJsIGFzIG1vZGFsQ29udGVudEN0cmwnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvbW9kYWwvbW9kYWwtZm9ybWF0dGVkLnRwbC5odG1sJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBvcGVuUHJvbXB0KCRldmVudCkge1xuICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkbW9kYWwub3Blbih7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01vZGFsQ29udGVudEN0cmwgYXMgbW9kYWxDb250ZW50Q3RybCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9tb2RhbC9wcm9tcHQudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIHdpbmRvd0NsYXNzOiAncHJvbXB0J1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBvcGVuTGFyZ2VNb2RhbCgkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJG1vZGFsLm9wZW4oe1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNb2RhbENvbnRlbnRDdHJsIGFzIG1vZGFsQ29udGVudEN0cmwnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvbW9kYWwvbW9kYWwtZm9ybWF0dGVkLnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICB3aW5kb3dDbGFzczogJ21vZGFsLS1sYXJnZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5tb2RhbCcsIFtcbiAgICAnd2Vic2l0ZS5tb2RhbC5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUubW9kYWwuc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUubW9kYWwuY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMubW9kYWwnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL21vZGFsJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL21vZGFsL21vZGFsLnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTW9kYWxDdHJsIGFzIG1vZGFsQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUucGFuZWxzLmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdQYW5lbHNDdHJsJywgZnVuY3Rpb24oKSB7XG5cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnBhbmVscycsIFtcbiAgICAnd2Vic2l0ZS5wYW5lbHMuc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnBhbmVscy5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnd2Vic2l0ZS5wYW5lbHMuY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMucGFuZWxzJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9wYW5lbHMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvcGFuZWxzL3BhbmVscy50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1BhbmVsc0N0cmwgYXMgcGFuZWxzQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUucHJvbXB0LWNvbnRlbnQuY29udHJvbGxlcicsIFtdKVxuXG4gICAgLmNvbnRyb2xsZXIoJ1Byb21wdENvbnRlbnRDb250cm9sbGVyJywgZnVuY3Rpb24oJHByb21wdEluc3RhbmNlKSB7XG4gICAgICAgIHZhciBjdHJsID0gdGhpcztcblxuICAgICAgICBjdHJsLm9rID0gb2s7XG4gICAgICAgIGN0cmwuY2FuY2VsID0gY2FuY2VsO1xuXG4gICAgICAgIGZ1bmN0aW9uIG9rKCRldmVudCkge1xuICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICRwcm9tcHRJbnN0YW5jZS5jbG9zZSgnT0snKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNhbmNlbCgkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAkcHJvbXB0SW5zdGFuY2UuZGlzbWlzcygnQ2FuY2VsZWQnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUucHJvbXB0LmNvbnRyb2xsZXInLCBbXG4gICAnd2Vic2l0ZS5wcm9tcHQtY29udGVudC5jb250cm9sbGVyJ1xuXSlcbiAgICAuZGlyZWN0aXZlKCd0YWJzZXQnLCBmdW5jdGlvbigkdGltZW91dCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVxdWlyZTogJ3RhYnNldCcsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIHRhYnNldCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3QgPSB0YWJzZXQuc2VsZWN0O1xuXG4gICAgICAgICAgICAgICAgdGFic2V0LnNlbGVjdCA9IGZ1bmN0aW9uKHRhYikge1xuICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWIuaXNSZW5kZXJlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvZGVtaXJyb3JFbGVtZW50cyA9IGVsZW1lbnRbMF0ucXVlcnlTZWxlY3RvckFsbCgnLkNvZGVNaXJyb3InKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKGNvZGVtaXJyb3JFbGVtZW50cywgZnVuY3Rpb24oY29kZW1pcnJvckVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlbWlycm9yRWxlbWVudC5Db2RlTWlycm9yLnJlZnJlc2goKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWIuaXNSZW5kZXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxlY3QuYXBwbHkodGFic2V0LCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSlcblxuICAgIC5jb250cm9sbGVyKCdQcm9tcHRDdHJsJywgZnVuY3Rpb24oJHByb21wdCkge1xuICAgICAgICB2YXIgY3RybCA9IHRoaXM7XG4gICAgICAgIGN0cmwuaGFuZGxlVGFiU2VsZWN0ID0gaGFuZGxlVGFiU2VsZWN0O1xuICAgICAgICBjdHJsLmlzVGFiQWN0aXZlID0gaXNUYWJBY3RpdmU7XG4gICAgICAgIGN0cmwub3BlblByb21wdCA9IG9wZW5Qcm9tcHQ7XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlVGFiU2VsZWN0KHRhYikge1xuICAgICAgICAgICAgY3RybC5jdXJyZW50VGFiID0gdGFiO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNUYWJBY3RpdmUodGFiKSB7XG4gICAgICAgICAgICByZXR1cm4gY3RybC5jdXJyZW50VGFiID09PSB0YWI7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBvcGVuUHJvbXB0KCRldmVudCkge1xuICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkcHJvbXB0Lm9wZW4oe1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9tcHRDb250ZW50Q3RybCBhcyBwcm9tcHRDb250ZW50Q3RybCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9wcm9tcHQvcHJvbXB0LW1vZGFsLnRwbC5odG1sJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnByb21wdCcsIFtcbiAgICAnd2Vic2l0ZS5wcm9tcHQuc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnByb21wdC5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnd2Vic2l0ZS5wcm9tcHQuY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMucHJvbXB0Jywge1xuICAgICAgICAgICAgICAgIHVybDogJy9wcm9tcHQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvcHJvbXB0L3Byb21wdC50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Byb21wdEN0cmwgYXMgcHJvbXB0Q3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUudGFibGVzLmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdUYWJsZXNDdHJsJywgZnVuY3Rpb24oKSB7XG5cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnRhYmxlcycsIFtcbiAgICAnd2Vic2l0ZS50YWJsZXMuc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnRhYmxlcy5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnd2Vic2l0ZS50YWJsZXMuY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMudGFibGVzJywge1xuICAgICAgICAgICAgICAgIHVybDogJy90YWJsZXMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvdGFibGVzL3RhYmxlcy50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1RhYmxlc0N0cmwgYXMgdGFibGVzQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUudGFicy5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignVGFic0N0cmwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGN0cmwgPSB0aGlzO1xuXG4gICAgICAgIGN0cmwudGFicyA9IFtcbiAgICAgICAgICAgIHsgdGl0bGU6J0R5bmFtaWMgVGl0bGUgMScsIGNvbnRlbnQ6J0R5bmFtaWMgY29udGVudCAxJyB9LFxuICAgICAgICAgICAgeyB0aXRsZTonRHluYW1pYyBUaXRsZSAyJywgY29udGVudDonRHluYW1pYyBjb250ZW50IDInIH1cbiAgICAgICAgXTtcblxuICAgICAgICBjdHJsLnRhYkNsaWNrZWQgPSBmdW5jdGlvbiB0YWJDbGlja2VkKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RhYiBjbGlja2VkIScpO1xuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUudGFicycsIFtcbiAgICAnd2Vic2l0ZS50YWJzLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS50YWJzLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICd3ZWJzaXRlLnRhYnMuY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMudGFicycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvdGFicycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy90YWJzL3RhYnMudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdUYWJzQ3RybCBhcyB0YWJzQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUudG9vbHRpcCcsIFtcbiAgICAnd2Vic2l0ZS50b29sdGlwLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS50b29sdGlwLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLnRvb2x0aXAnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL3Rvb2x0aXAnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvdG9vbHRpcC90b29sdGlwLnRwbC5odG1sJ1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS53YXJuaW5nLWJ1dHRvbicsIFtcbiAgICAnd2Vic2l0ZS53YXJuaW5nLWJ1dHRvbi5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUud2FybmluZy1idXR0b24uc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUubW9kYWwuY29udHJvbGxlcicsXG5dKVxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29tcG9uZW50cy53YXJuaW5nLWJ1dHRvbicsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvd2FybmluZy1idXR0b24nLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvd2FybmluZy1idXR0b24vd2FybmluZy1idXR0b24udHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNb2RhbEN0cmwgYXMgbW9kYWxDdHJsJ1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5iYy1zZXJ2ZXItdGFibGUuc2FtcGxlLWRhdGEuc2VydmljZScsIFtdKVxuICAgIC5mYWN0b3J5KCdzYW1wbGVEYXRhJywgZnVuY3Rpb24gc2FtcGxlRGF0YSgkaHR0cCkge1xuICAgICAgICB2YXIgc2VydmljZSA9IHtcbiAgICAgICAgICAgIGdldFNhbXBsZURhdGE6IGdldFNhbXBsZURhdGFcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRTYW1wbGVEYXRhKHF1ZXJ5UGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvdGFibGUuanNvbicsIHtcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHF1ZXJ5UGFyYW1zXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIGdldFNhbXBsZURhdGFTdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzOiByZXNwb25zZS5kYXRhLnJvd3MsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogcmVzcG9uc2UuZGF0YS5wYWdpbmF0aW9uLnBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGltaXQ6IHJlc3BvbnNlLmRhdGEucGFnaW5hdGlvbi5saW1pdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbDogcmVzcG9uc2UuZGF0YS5wYWdpbmF0aW9uLm51bUl0ZW1zXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VydmljZTtcbiAgICB9KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==