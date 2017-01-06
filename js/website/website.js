'use strict';

angular.module('website', ['bcapp-pattern-lab', 'mm.foundation', 'website-templates', 'ui.codemirror', 'ui.router',

// JS Components
'website.accordion', 'website.alerts', 'website.aside-nav', 'website.banners', 'website.bc-datepicker', 'website.bc-dropdown', 'website.bc-pagination', 'website.bc-server-table', 'website.buttons', 'website.cards', 'website.color-picker-example', 'website.copy-clipboard', 'website.credit-card', 'website.global-message', 'website.loading-indicators', 'website.icons', 'website.modal', 'website.panels', 'website.prompt', 'website.switch', 'website.tables', 'website.tabs', 'website.tooltip', 'website.warning-button']).constant('BC_APP_CONFIG', {}).config(function ($stateProvider, svgRootPathProvider) {
    $stateProvider.state('components', {
        abstract: true,
        url: '/components',
        template: '<ui-view/>'
    });

    svgRootPathProvider.setRootPath('/svg/icons/');
});
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
    $scope.alerts = [{
        msg: 'Generic alert'
    }, {
        type: 'info',
        msg: 'Informational alert',
        links: [{ title: 'Test', href: 'http://test.com', target: 'test' }]
    }, {
        type: 'success',
        msg: 'Success alert',
        links: [{ title: 'My New Window Test Link', href: 'http://test.com', target: '_blank' }]
    }, { type: 'warning', msg: 'Warning alert' }, {
        type: 'error',
        msg: 'Error alert containing many words to alert the user of this particular alert.',
        links: [{ title: 'Another Test Link', href: 'http://test.com' }]
    }];

    $scope.openAlert = {
        type: 'error',
        msg: 'Error alert in a panel'
    };

    $scope.addAlert = function () {
        $scope.alerts.push({
            msg: 'Another generic alert!'
        });
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
    ctrl.openFixedModal = openFixedModal;

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

    function openFixedModal($event) {
        $event.preventDefault();
        $modal.open({
            controller: 'ModalContentCtrl as modalContentCtrl',
            templateUrl: 'src/website/js/examples/modal/modal-fixed.tpl.html',
            windowClass: 'modal--fixed'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFzaWRlTmF2L2FzaWRlTmF2LmNvbnRyb2xsZXIuanMiLCJhc2lkZU5hdi9hc2lkZU5hdi5tb2R1bGUuanMiLCJpY29ucy9pY29ucy5jb250cm9sbGVyLmpzIiwiaWNvbnMvaWNvbnMuZGlyZWN0aXZlLmpzIiwiaWNvbnMvaWNvbnMubW9kdWxlLmpzIiwic3dpdGNoL3N3aXRjaC5jb250cm9sbGVyLmpzIiwic3dpdGNoL3N3aXRjaC5tb2R1bGUuanMiLCJleGFtcGxlcy9hY2NvcmRpb24vYWNjb3JkaW9uLmNvbnRyb2xsZXIuanMiLCJleGFtcGxlcy9hY2NvcmRpb24vYWNjb3JkaW9uLm1vZHVsZS5qcyIsImV4YW1wbGVzL2FjY29yZGlvbi9hY2NvcmRpb24uc3RhdGUuanMiLCJleGFtcGxlcy9hbGVydHMvYWxlcnRzLmNvbnRyb2xsZXIuanMiLCJleGFtcGxlcy9hbGVydHMvYWxlcnRzLm1vZHVsZS5qcyIsImV4YW1wbGVzL2FsZXJ0cy9hbGVydHMuc3RhdGUuanMiLCJleGFtcGxlcy9iYW5uZXJzL2Jhbm5lcnMuY29udHJvbGxlci5qcyIsImV4YW1wbGVzL2Jhbm5lcnMvYmFubmVycy5tb2R1bGUuanMiLCJleGFtcGxlcy9iYW5uZXJzL2Jhbm5lcnMuc3RhdGUuanMiLCJleGFtcGxlcy9iYy1kcm9wZG93bi9iYy1kcm9wZG93bi5tb2R1bGUuanMiLCJleGFtcGxlcy9iYy1kcm9wZG93bi9iYy1kcm9wZG93bi5zdGF0ZS5qcyIsImV4YW1wbGVzL2JjLWRhdGVwaWNrZXIvYmMtZGF0ZXBpY2tlci5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvYmMtZGF0ZXBpY2tlci9iYy1kYXRlcGlja2VyLm1vZHVsZS5qcyIsImV4YW1wbGVzL2JjLWRhdGVwaWNrZXIvYmMtZGF0ZXBpY2tlci5zdGF0ZS5qcyIsImV4YW1wbGVzL2JjLXBhZ2luYXRpb24vYmMtcGFnaW5hdGlvbi5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvYmMtcGFnaW5hdGlvbi9iYy1wYWdpbmF0aW9uLm1vZHVsZS5qcyIsImV4YW1wbGVzL2JjLXBhZ2luYXRpb24vYmMtcGFnaW5hdGlvbi5zdGF0ZS5qcyIsImV4YW1wbGVzL2JjLXNlcnZlci10YWJsZS9iYy1zZXJ2ZXItdGFibGUuY29uc3RhbnRzLmpzIiwiZXhhbXBsZXMvYmMtc2VydmVyLXRhYmxlL2JjLXNlcnZlci10YWJsZS5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvYmMtc2VydmVyLXRhYmxlL2JjLXNlcnZlci10YWJsZS5tb2R1bGUuanMiLCJleGFtcGxlcy9iYy1zZXJ2ZXItdGFibGUvYmMtc2VydmVyLXRhYmxlLnN0YXRlLmpzIiwiZXhhbXBsZXMvYmMtc2VydmVyLXRhYmxlL2UyZS1iYWNrZW5kLmpzIiwiZXhhbXBsZXMvYnV0dG9ucy9idXR0b25zLmNvbnRyb2xsZXIuanMiLCJleGFtcGxlcy9idXR0b25zL2J1dHRvbnMubW9kdWxlLmpzIiwiZXhhbXBsZXMvYnV0dG9ucy9idXR0b25zLnN0YXRlLmpzIiwiZXhhbXBsZXMvY2FyZHMvY2FyZHMuY29udHJvbGxlci5qcyIsImV4YW1wbGVzL2NhcmRzL2NhcmRzLm1vZHVsZS5qcyIsImV4YW1wbGVzL2NhcmRzL2NhcmRzLnN0YXRlLmpzIiwiZXhhbXBsZXMvY29sb3ItcGlja2VyL2NvbG9yLXBpY2tlci5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvY29sb3ItcGlja2VyL2NvbG9yLXBpY2tlci5tb2R1bGUuanMiLCJleGFtcGxlcy9jb2xvci1waWNrZXIvY29sb3ItcGlja2VyLnN0YXRlLmpzIiwiZXhhbXBsZXMvY29weS1jbGlwYm9hcmQvY29weS1jbGlwYm9hcmQubW9kdWxlLmpzIiwiZXhhbXBsZXMvY29weS1jbGlwYm9hcmQvY29weS1jbGlwYm9hcmQuc3RhdGUuanMiLCJleGFtcGxlcy9jcmVkaXQtY2FyZC9jcmVkaXQtY2FyZC5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvY3JlZGl0LWNhcmQvY3JlZGl0LWNhcmQubW9kdWxlLmpzIiwiZXhhbXBsZXMvY3JlZGl0LWNhcmQvY3JlZGl0LWNhcmQuc3RhdGUuanMiLCJleGFtcGxlcy9nbG9iYWwtbWVzc2FnZS9nbG9iYWwtbWVzc2FnZS5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvZ2xvYmFsLW1lc3NhZ2UvZ2xvYmFsLW1lc3NhZ2UubW9kdWxlLmpzIiwiZXhhbXBsZXMvZ2xvYmFsLW1lc3NhZ2UvZ2xvYmFsLW1lc3NhZ2Uuc3RhdGUuanMiLCJleGFtcGxlcy9sb2FkaW5nLWluZGljYXRvcnMvbG9hZGluZy1pbmRpY2F0b3JzLmNvbnRyb2xsZXIuanMiLCJleGFtcGxlcy9sb2FkaW5nLWluZGljYXRvcnMvbG9hZGluZy1pbmRpY2F0b3JzLm1vZHVsZS5qcyIsImV4YW1wbGVzL2xvYWRpbmctaW5kaWNhdG9ycy9sb2FkaW5nLWluZGljYXRvcnMuc3RhdGUuanMiLCJleGFtcGxlcy9tb2RhbC9tb2RhbC1jb250ZW50LmNvbnRyb2xsZXIuanMiLCJleGFtcGxlcy9tb2RhbC9tb2RhbC5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvbW9kYWwvbW9kYWwubW9kdWxlLmpzIiwiZXhhbXBsZXMvbW9kYWwvbW9kYWwuc3RhdGUuanMiLCJleGFtcGxlcy9wYW5lbHMvcGFuZWxzLmNvbnRyb2xsZXIuanMiLCJleGFtcGxlcy9wYW5lbHMvcGFuZWxzLm1vZHVsZS5qcyIsImV4YW1wbGVzL3BhbmVscy9wYW5lbHMuc3RhdGUuanMiLCJleGFtcGxlcy9wcm9tcHQvcHJvbXB0LWNvbnRlbnQuY29udHJvbGxlci5qcyIsImV4YW1wbGVzL3Byb21wdC9wcm9tcHQuY29udHJvbGxlci5qcyIsImV4YW1wbGVzL3Byb21wdC9wcm9tcHQubW9kdWxlLmpzIiwiZXhhbXBsZXMvcHJvbXB0L3Byb21wdC5zdGF0ZS5qcyIsImV4YW1wbGVzL3RhYmxlcy90YWJsZXMuY29udHJvbGxlci5qcyIsImV4YW1wbGVzL3RhYmxlcy90YWJsZXMubW9kdWxlLmpzIiwiZXhhbXBsZXMvdGFibGVzL3RhYmxlcy5zdGF0ZS5qcyIsImV4YW1wbGVzL3RhYnMvdGFicy5jb250cm9sbGVyLmpzIiwiZXhhbXBsZXMvdGFicy90YWJzLm1vZHVsZS5qcyIsImV4YW1wbGVzL3RhYnMvdGFicy5zdGF0ZS5qcyIsImV4YW1wbGVzL3Rvb2x0aXAvdG9vbHRpcC5tb2R1bGUuanMiLCJleGFtcGxlcy90b29sdGlwL3Rvb2x0aXAuc3RhdGUuanMiLCJleGFtcGxlcy93YXJuaW5nLWJ1dHRvbi93YXJuaW5nLWJ1dHRvbi5tb2R1bGUuanMiLCJleGFtcGxlcy93YXJuaW5nLWJ1dHRvbi93YXJuaW5nLWJ1dHRvbi5zdGF0ZS5qcyIsImV4YW1wbGVzL2JjLXNlcnZlci10YWJsZS9zZXJ2aWNlcy9iYy1zZXJ2ZXItdGFibGUuc2FtcGxlLWRhdGEuc2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQ3RCLG1CQUFtQixFQUNuQixlQUFlLEVBQ2YsbUJBQW1CLEVBQ25CLGVBQWUsRUFDZixXQUFXOzs7QUFHWCxtQkFBbUIsRUFDbkIsZ0JBQWdCLEVBQ2hCLG1CQUFtQixFQUNuQixpQkFBaUIsRUFDakIsdUJBQXVCLEVBQ3ZCLHFCQUFxQixFQUNyQix1QkFBdUIsRUFDdkIseUJBQXlCLEVBQ3pCLGlCQUFpQixFQUNqQixlQUFlLEVBQ2YsOEJBQThCLEVBQzlCLHdCQUF3QixFQUN4QixxQkFBcUIsRUFDckIsd0JBQXdCLEVBQ3hCLDRCQUE0QixFQUM1QixlQUFlLEVBQ2YsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixnQkFBZ0IsRUFDaEIsZ0JBQWdCLEVBQ2hCLGdCQUFnQixFQUNoQixjQUFjLEVBQ2QsaUJBQWlCLEVBQ2pCLHdCQUF3QixDQUMzQixDQUFDLENBQ0csUUFBUSxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUMsQ0FFN0IsTUFBTSxDQUFDLFVBQVMsY0FBYyxFQUFFLG1CQUFtQixFQUFFO0FBQ2xELGtCQUFjLENBQ1QsS0FBSyxDQUFDLFlBQVksRUFBRTtBQUNqQixnQkFBUSxFQUFFLElBQUk7QUFDZCxXQUFHLEVBQUUsYUFBYTtBQUNsQixnQkFBUSxFQUFFLFlBQVk7S0FDekIsQ0FBQyxDQUFDOztBQUVQLHVCQUFtQixDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztDQUNsRCxDQUFDLENBQUM7OztBQzVDUCxPQUFPLENBQUMsTUFBTSxDQUFDLDhCQUE4QixFQUFFLEVBQUUsQ0FBQyxDQUM3QyxVQUFVLENBQUMsY0FBYyxFQUFFLFVBQVMsTUFBTSxFQUFFLE9BQU8sRUFBRTtBQUNyRCxVQUFNLENBQUMsUUFBUSxHQUFHLFVBQVUsWUFBWSxFQUFFO0FBQ3pDLGVBQVEsWUFBWSxLQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFFO0tBQ3ZELENBQUM7Q0FDQyxDQUFDLENBQUM7OztBQ0xQLE9BQU8sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsQ0FDaEMsOEJBQThCLENBQ2pDLENBQUMsQ0FBQzs7O0FDRkgsT0FBTyxDQUFDLE1BQU0sQ0FBQywwQkFBMEIsRUFBRSxFQUFFLENBQUMsQ0FFekMsVUFBVSxDQUFDLFdBQVcsRUFBRSxVQUFTLE1BQU0sRUFBRTtBQUN0QyxVQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7Q0FDL0IsQ0FBQyxDQUFDOzs7QUNKUCxPQUFPLENBQUMsTUFBTSxDQUFDLHlCQUF5QixFQUFFLENBQ2xDLDBCQUEwQixDQUM3QixDQUFDLENBQ0QsU0FBUyxDQUFDLFdBQVcsRUFBRSxTQUFTLGVBQWUsR0FBRztBQUMvQyxRQUFJLFNBQVMsR0FBRztBQUNaLGdCQUFRLEVBQUUsR0FBRztBQUNiLG1CQUFXLEVBQUUscUNBQXFDO0FBQ2xELGtCQUFVLEVBQUUsd0JBQXdCO0tBQ3ZDLENBQUM7QUFDRixXQUFPLFNBQVMsQ0FBQztDQUNwQixDQUFDLENBQUM7OztBQ1ZQLE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQzVCLHlCQUF5QixDQUM1QixDQUFDLENBQUM7OztBQ0ZILE9BQU8sQ0FBQyxNQUFNLENBQUMsMkJBQTJCLEVBQUUsRUFBRSxDQUFDLENBRTFDLFVBQVUsQ0FBQyxzQkFBc0IsRUFBRSxZQUFXO0FBQzNDLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFaEIsUUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFDdkIsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDdEIsUUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7QUFDekIsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFDdkIsUUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDeEIsUUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFDdkIsUUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztDQUNuQyxDQUFDLENBQUM7OztBQ1pQLE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FDN0IsMkJBQTJCLENBQzlCLENBQUMsQ0FBQzs7O0FDRkgsT0FBTyxDQUFDLE1BQU0sQ0FBQyw4QkFBOEIsRUFBRSxFQUFFLENBQUMsQ0FFN0MsVUFBVSxDQUFDLGVBQWUsRUFBRSxVQUFTLE1BQU0sRUFBRTtBQUMxQyxVQUFNLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQzs7QUFFekIsVUFBTSxDQUFDLE1BQU0sR0FBRyxDQUNaO0FBQ0ksVUFBRSxFQUFFLFdBQVc7QUFDZixhQUFLLEVBQUUsMEJBQTBCO0FBQ2pDLGVBQU8sRUFBRSx3QkFBd0I7S0FDcEMsRUFDRDtBQUNJLFVBQUUsRUFBRSxXQUFXO0FBQ2YsYUFBSyxFQUFFLDBCQUEwQjtBQUNqQyxlQUFPLEVBQUUsd0JBQXdCO0tBQ3BDLENBQ0osQ0FBQzs7QUFFRixVQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQzs7QUFFOUMsVUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFXO0FBQ3hCLFlBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUN4QyxjQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLENBQUM7S0FDMUMsQ0FBQztDQUNMLENBQUMsQ0FBQzs7O0FDeEJQLE9BQU8sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsQ0FDaEMseUJBQXlCLENBQzVCLENBQUMsQ0FBQzs7O0FDRkgsT0FBTyxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRSxDQUN0QyxXQUFXLEVBQ1gsOEJBQThCLENBQ2pDLENBQUMsQ0FFRyxNQUFNLENBQUMsVUFBUyxjQUFjLEVBQUU7QUFDN0Isa0JBQWMsQ0FDVCxLQUFLLENBQUMsc0JBQXNCLEVBQUU7QUFDM0IsV0FBRyxFQUFFLFlBQVk7QUFDakIsbUJBQVcsRUFBRSxzREFBc0Q7QUFDbkUsa0JBQVUsRUFBRSxnQ0FBZ0M7S0FDL0MsQ0FBQyxDQUFDO0NBQ1YsQ0FBQyxDQUFDOzs7QUNaUCxPQUFPLENBQUMsTUFBTSxDQUFDLDJCQUEyQixFQUFFLEVBQUUsQ0FBQyxDQUMxQyxVQUFVLENBQUMsWUFBWSxFQUFFLFVBQVMsTUFBTSxFQUFFO0FBQ3ZDLFVBQU0sQ0FBQyxNQUFNLEdBQUcsQ0FDWjtBQUNJLFdBQUcsRUFBRSxlQUFlO0tBQ3ZCLEVBQ0Q7QUFDSSxZQUFJLEVBQUUsTUFBTTtBQUNaLFdBQUcsRUFBRSxxQkFBcUI7QUFDMUIsYUFBSyxFQUFFLENBQ0gsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQzdEO0tBQ0osRUFDRDtBQUNJLFlBQUksRUFBRSxTQUFTO0FBQ2YsV0FBRyxFQUFFLGVBQWU7QUFDcEIsYUFBSyxFQUFFLENBQ0gsRUFBRSxLQUFLLEVBQUUseUJBQXlCLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsQ0FDbEY7S0FDSixFQUNELEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsZUFBZSxFQUFFLEVBQ3pDO0FBQ0ksWUFBSSxFQUFFLE9BQU87QUFDYixXQUFHLEVBQUUsK0VBQStFO0FBQ3BGLGFBQUssRUFBRSxDQUNILEVBQUUsS0FBSyxFQUFFLG1CQUFtQixFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxDQUMxRDtLQUNKLENBQ0osQ0FBQzs7QUFFRixVQUFNLENBQUMsU0FBUyxHQUFJO0FBQ2hCLFlBQUksRUFBRSxPQUFPO0FBQ2IsV0FBRyxFQUFFLHdCQUF3QjtLQUNoQyxDQUFDOztBQUVGLFVBQU0sQ0FBQyxRQUFRLEdBQUcsWUFBVztBQUN6QixjQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNmLGVBQUcsRUFBRSx3QkFBd0I7U0FDaEMsQ0FBQyxDQUFDO0tBQ04sQ0FBQzs7QUFFRixVQUFNLENBQUMsVUFBVSxHQUFHLFVBQVMsS0FBSyxFQUFFO0FBQ2hDLGNBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNsQyxDQUFDO0NBQ0wsQ0FBQyxDQUFDOzs7QUM1Q1AsT0FBTyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxDQUM3QixzQkFBc0IsQ0FDekIsQ0FBQyxDQUFDOzs7QUNGSCxPQUFPLENBQUMsTUFBTSxDQUFDLHNCQUFzQixFQUFFLENBQ25DLFdBQVcsRUFDWCwyQkFBMkIsQ0FDOUIsQ0FBQyxDQUVHLE1BQU0sQ0FBQyxVQUFTLGNBQWMsRUFBRTtBQUM3QixrQkFBYyxDQUNULEtBQUssQ0FBQyxtQkFBbUIsRUFBRTtBQUN4QixXQUFHLEVBQUUsU0FBUztBQUNkLG1CQUFXLEVBQUUsZ0RBQWdEO0FBQzdELGtCQUFVLEVBQUUsMEJBQTBCO0tBQ3pDLENBQUMsQ0FBQztDQUNWLENBQUMsQ0FBQzs7O0FDWlAsT0FBTyxDQUFDLE1BQU0sQ0FBQyw0QkFBNEIsRUFBRSxFQUFFLENBQUMsQ0FFM0MsVUFBVSxDQUFDLGFBQWEsRUFBRSxZQUFXLEVBRXJDLENBQUMsQ0FBQzs7O0FDSlAsT0FBTyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxDQUM5Qix1QkFBdUIsQ0FDMUIsQ0FBQyxDQUFDOzs7QUNGSCxPQUFPLENBQUMsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQ3BDLFdBQVcsRUFDWCw0QkFBNEIsQ0FDL0IsQ0FBQyxDQUVHLE1BQU0sQ0FBQyxVQUFTLGNBQWMsRUFBRTtBQUM3QixrQkFBYyxDQUNULEtBQUssQ0FBQyxvQkFBb0IsRUFBRTtBQUN6QixXQUFHLEVBQUUsVUFBVTtBQUNmLG1CQUFXLEVBQUUsa0RBQWtEO0FBQy9ELGtCQUFVLEVBQUUsNEJBQTRCO0tBQzNDLENBQUMsQ0FBQztDQUNWLENBQUMsQ0FBQzs7O0FDWlAsT0FBTyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUNsQywyQkFBMkIsQ0FDOUIsQ0FBQyxDQUFDOzs7QUNGSCxPQUFPLENBQUMsTUFBTSxDQUFDLDJCQUEyQixFQUFFLENBQ3hDLFdBQVcsQ0FDZCxDQUFDLENBRUcsTUFBTSxDQUFDLFVBQVMsY0FBYyxFQUFFO0FBQzdCLGtCQUFjLENBQ1QsS0FBSyxDQUFDLHdCQUF3QixFQUFFO0FBQzdCLFdBQUcsRUFBRSxjQUFjO0FBQ25CLG1CQUFXLEVBQUUsMERBQTBEO0tBQzFFLENBQUMsQ0FBQztDQUNWLENBQUMsQ0FBQzs7O0FDVlAsT0FBTyxDQUFDLE1BQU0sQ0FBQyxrQ0FBa0MsRUFBRSxFQUFFLENBQUMsQ0FDakQsVUFBVSxDQUFDLGtCQUFrQixFQUFFLFlBQVc7QUFDdkMsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVoQixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztDQUNyQixDQUFDLENBQUM7OztBQ0xQLE9BQU8sQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FDcEMsNkJBQTZCLENBQ2hDLENBQUMsQ0FBQzs7O0FDRkgsT0FBTyxDQUFDLE1BQU0sQ0FBQyw2QkFBNkIsRUFBRSxDQUMxQyxXQUFXLEVBQ1gsa0NBQWtDLENBQ3JDLENBQUMsQ0FFRyxNQUFNLENBQUMsVUFBUyxjQUFjLEVBQUU7QUFDN0Isa0JBQWMsQ0FDVCxLQUFLLENBQUMsMEJBQTBCLEVBQUU7QUFDL0IsV0FBRyxFQUFFLGdCQUFnQjtBQUNyQixtQkFBVyxFQUFFLDhEQUE4RDtBQUMzRSxrQkFBVSxFQUFFLHNDQUFzQztLQUNyRCxDQUFDLENBQUM7Q0FDVixDQUFDLENBQUM7OztBQ1pQLE9BQU8sQ0FBQyxNQUFNLENBQUMsa0NBQWtDLEVBQUUsRUFBRSxDQUFDLENBRWpELFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxVQUFTLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFDbkQsVUFBTSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7QUFDeEIsVUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFDdkIsVUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDbkIsVUFBTSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7QUFDekIsVUFBTSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7O0FBRTFCLFVBQU0sQ0FBQyxZQUFZLEdBQUcsVUFBUyxTQUFTLEVBQUU7QUFDdEMsWUFBSSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxTQUFTLENBQUMsQ0FBQztLQUM3QyxDQUFDOztBQUVGLFVBQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxNQUFNLEVBQUU7QUFDOUIsY0FBTSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7S0FDL0IsQ0FBQzs7QUFFRixVQUFNLENBQUMsWUFBWSxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7Q0FDM0MsQ0FBQyxDQUFDOzs7QUNsQlAsT0FBTyxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxDQUNwQyw2QkFBNkIsQ0FDaEMsQ0FBQyxDQUFDOzs7QUNGSCxPQUFPLENBQUMsTUFBTSxDQUFDLDZCQUE2QixFQUFFLENBQzFDLFdBQVcsRUFDWCxrQ0FBa0MsQ0FDckMsQ0FBQyxDQUVHLE1BQU0sQ0FBQyxVQUFTLGNBQWMsRUFBRTtBQUM3QixrQkFBYyxDQUNULEtBQUssQ0FBQywwQkFBMEIsRUFBRTtBQUMvQixXQUFHLEVBQUUsZ0JBQWdCO0FBQ3JCLG1CQUFXLEVBQUUsOERBQThEO0FBQzNFLGtCQUFVLEVBQUUsc0NBQXNDO0tBQ3JELENBQUMsQ0FBQztDQUNWLENBQUMsQ0FBQzs7O0FDWlAsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQ0FBbUMsRUFBRSxFQUFFLENBQUMsQ0FDbEQsUUFBUSxDQUFDLG1CQUFtQixFQUFFO0FBQzNCLGFBQVMsRUFBRTtBQUNQLFlBQUksRUFBRSxNQUFNO0FBQ1osYUFBSyxFQUFFLE9BQU87QUFDZCxjQUFNLEVBQUUsU0FBUztBQUNqQixlQUFPLEVBQUUsWUFBWTtLQUN4QjtBQUNELGlCQUFhLEVBQUU7QUFDWCxXQUFHLEVBQUUsS0FBSztBQUNWLFlBQUksRUFBRSxLQUFLO0tBQ2Q7QUFDRCxXQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDakIsWUFBUSxFQUFFLE1BQU07Q0FDbkIsQ0FBQyxDQUNELFFBQVEsQ0FBQyxlQUFlLEVBQUUsWUFBWSxDQUFDLENBQUM7OztBQ2Y3QyxPQUFPLENBQUMsTUFBTSxDQUFDLG9DQUFvQyxFQUFFLENBQ2pELFdBQVcsRUFDWCxtQ0FBbUMsRUFDbkMsYUFBYSxDQUNoQixDQUFDLENBRUcsVUFBVSxDQUFDLHVCQUF1QixFQUFFLFVBQVMsTUFBTSxFQUFFLE1BQU0sRUFBRSxvQkFBb0IsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFO0FBQzFHLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFaEIsUUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7QUFDN0IsUUFBSSxDQUFDLGFBQWEsR0FBRyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7Ozs7QUFJN0QsUUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7O0FBRTFGLGFBQVMsVUFBVSxDQUFDLE1BQU0sRUFBRTtBQUN4QixjQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDeEIsY0FBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0tBQ25FO0NBQ0osQ0FBQyxDQUFDOzs7QUNwQlAsT0FBTyxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRSxDQUN0QywrQkFBK0IsQ0FDbEMsQ0FBQyxDQUFDOzs7QUNGSCxPQUFPLENBQUMsTUFBTSxDQUFDLCtCQUErQixFQUFFLENBQzVDLFdBQVcsRUFDWCxtQ0FBbUMsRUFDbkMsb0NBQW9DLEVBQ3BDLDZDQUE2QyxDQUNoRCxDQUFDLENBRUcsTUFBTSxDQUFDLFVBQVMsY0FBYyxFQUFFO0FBQzdCLGtCQUFjLENBQ1QsS0FBSyxDQUFDLDRCQUE0QixFQUFFO0FBQ2pDLGtCQUFVLEVBQUUsZ0RBQWdEO0FBQzVELGVBQU8sRUFBRTtBQUNMLHFCQUFTLEVBQUUsU0FBUyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsb0JBQW9CLEVBQUUsaUJBQWlCLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRTtBQUNuSCx1QkFBTyxvQkFBb0IsQ0FDdEIsTUFBTSxDQUFDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxDQUN4QyxJQUFJLENBQUM7QUFDRiwrQkFBVyxFQUFFLFlBQVk7QUFDekIsb0NBQWdCLEVBQUUsVUFBVSxDQUFDLGFBQWE7aUJBQzdDLENBQUMsQ0FBQzthQUNWO1NBQ0o7QUFDRCxtQkFBVyxFQUFFLGtFQUFrRTtBQUMvRSxXQUFHLEVBQUUsMERBQTBEO0tBQ2xFLENBQUMsQ0FBQztDQUNWLENBQUMsQ0FBQzs7O0FDeEJQLE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQzFCLFdBQVcsQ0FDZCxDQUFDLENBQ0csR0FBRyxDQUFDLFVBQVMsWUFBWSxFQUFFO0FBQ3hCLGdCQUFZLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzVELGdCQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDOztBQUV6QyxhQUFTLFdBQVcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFO0FBQy9CLFlBQUksS0FBSyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUM7QUFDNUUsWUFBSSxHQUFHLENBQ0gsRUFBRSxNQUFNLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFDLEVBQ25GLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxjQUFjLEVBQUUsRUFDekUsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixFQUFFLEVBQ3hFLEVBQUUsTUFBTSxFQUFFLHdCQUF3QixFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxFQUM1RSxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLEVBQ3JFLEVBQUUsTUFBTSxFQUFFLHlCQUF5QixFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxFQUNuRixFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFFLEVBQ25FLEVBQUUsTUFBTSxFQUFFLG9CQUFvQixFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxFQUMxRSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLEVBQzdELEVBQUUsTUFBTSxFQUFFLGtCQUFrQixFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLGlCQUFpQixFQUFFLEVBQzlFLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsRUFDeEUsRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxFQUNwRSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLEVBQ2hFLEVBQUUsTUFBTSxFQUFFLHVCQUF1QixFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLG9CQUFvQixFQUFFLEVBQ3ZGLEVBQUUsTUFBTSxFQUFFLDRCQUE0QixFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixFQUFFLEVBQ3hGLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxjQUFjLEVBQUUsRUFDbkUsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFFLEVBQ3pFLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsRUFDL0QsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxFQUN0RSxFQUFFLE1BQU0sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsRUFDOUUsRUFBRSxNQUFNLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFFLEVBQzlFLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsRUFDbkUsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsZUFBZSxFQUFFLEVBQzNFLEVBQUUsTUFBTSxFQUFFLG1CQUFtQixFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixFQUFFLEVBQy9FLEVBQUUsTUFBTSxFQUFFLDBCQUEwQixFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxFQUNwRixFQUFFLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxpQkFBaUIsRUFBRSxFQUM5RSxFQUFFLE1BQU0sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsRUFDdEUsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxFQUNwRSxFQUFFLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxjQUFjLEVBQUUsRUFDM0UsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxFQUNwRSxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsRUFDbEUsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxFQUNuRSxFQUFFLE1BQU0sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxjQUFjLEVBQUUsQ0FDekYsQ0FBQztBQUNGLGFBQUssR0FBRyxRQUFRLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3hELFlBQUksR0FBRyxRQUFRLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVyRCxZQUFJLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQy9CLGtCQUFNLEdBQUcsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkMsZ0JBQUksa0JBQWtCLENBQUMsWUFBWSxDQUFDLEtBQUssS0FBSyxFQUFFO0FBQzVDLHNCQUFNLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQzthQUN6QjtBQUNELGdCQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQ2xDOztBQUVELGtCQUFVLEdBQUc7QUFDVCxtQkFBTyxFQUFFLEtBQUs7QUFDZCxrQkFBTSxFQUFFLElBQUk7QUFDWixtQkFBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDdkMsc0JBQVUsRUFBRSxJQUFJLENBQUMsTUFBTTtTQUMxQixDQUFDO0FBQ0YsYUFBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztBQUMzQyxlQUFPLEdBQUcsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7O0FBRW5DLFlBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO0FBQzVCLHFCQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDMUMsTUFBTTtBQUNILHFCQUFTLEdBQUcsSUFBSSxDQUFDO1NBQ3BCOztBQUVELGFBQUssR0FBRztBQUNKLGtCQUFNLEVBQUUsU0FBUztBQUNqQix3QkFBWSxFQUFFLFVBQVU7QUFDeEIscUJBQVMsRUFBRSxrQkFBa0IsQ0FBQyxTQUFTLENBQUM7QUFDeEMsd0JBQVksRUFBRSxrQkFBa0IsQ0FBQyxZQUFZLENBQUM7U0FDakQsQ0FBQzs7QUFFRixpQkFBUyxXQUFXLENBQUMsUUFBUSxFQUFFO0FBQzNCLGdCQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsZ0JBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtBQUNwQix5QkFBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2Ysd0JBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2pDO0FBQ0QsbUJBQU8sVUFBVSxDQUFDLEVBQUMsQ0FBQyxFQUFFO0FBQ2xCLG9CQUFJLE1BQU0sR0FBRyxBQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUksQ0FBQyxDQUFDLEdBQUcsQUFBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEYsdUJBQU8sTUFBTSxHQUFHLFNBQVMsQ0FBQzthQUM3QixDQUFDO1NBQ0w7O0FBRUQsaUJBQVMsa0JBQWtCLENBQUMsSUFBSSxFQUFFO0FBQzlCLGdCQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMxRCxnQkFBSSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxXQUFXLENBQUM7Z0JBQ2pELE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLG1CQUFPLE9BQU8sS0FBSyxJQUFJLEdBQUcsRUFBRSxHQUFHLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDckY7O0FBRUQsZUFBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDM0I7Q0FDSixDQUFDLENBQUM7OztBQ2xHUCxPQUFPLENBQUMsTUFBTSxDQUFDLDRCQUE0QixFQUFFLEVBQUUsQ0FBQyxDQUUzQyxVQUFVLENBQUMsYUFBYSxFQUFFLFVBQVMsTUFBTSxFQUFFO0FBQ3hDLFVBQU0sQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDOztBQUV2QixVQUFNLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQzs7QUFFN0IsVUFBTSxDQUFDLFVBQVUsR0FBRztBQUNoQixZQUFJLEVBQUUsS0FBSztBQUNYLGNBQU0sRUFBRSxJQUFJO0FBQ1osYUFBSyxFQUFFLEtBQUs7S0FDZixDQUFDO0NBQ0wsQ0FBQyxDQUFDOzs7QUNaUCxPQUFPLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLENBQzlCLHVCQUF1QixDQUMxQixDQUFDLENBQUM7OztBQ0ZILE9BQU8sQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FDcEMsV0FBVyxFQUNYLDRCQUE0QixDQUMvQixDQUFDLENBRUcsTUFBTSxDQUFDLFVBQVMsY0FBYyxFQUFFO0FBQzdCLGtCQUFjLENBQ1QsS0FBSyxDQUFDLG9CQUFvQixFQUFFO0FBQ3pCLFdBQUcsRUFBRSxVQUFVO0FBQ2YsbUJBQVcsRUFBRSxrREFBa0Q7QUFDL0Qsa0JBQVUsRUFBRSw0QkFBNEI7S0FDM0MsQ0FBQyxDQUFDO0NBQ1YsQ0FBQyxDQUFDOzs7QUNaUCxPQUFPLENBQUMsTUFBTSxDQUFDLDBCQUEwQixFQUFFLEVBQUUsQ0FBQyxDQUV6QyxVQUFVLENBQUMsV0FBVyxFQUFFLFlBQVcsRUFFbkMsQ0FBQyxDQUFDOzs7QUNKUCxPQUFPLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUM1QixxQkFBcUIsQ0FDeEIsQ0FBQyxDQUFDOzs7QUNGSCxPQUFPLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQ2xDLFdBQVcsRUFDWCwwQkFBMEIsQ0FDN0IsQ0FBQyxDQUVHLE1BQU0sQ0FBQyxVQUFTLGNBQWMsRUFBRTtBQUM3QixrQkFBYyxDQUNULEtBQUssQ0FBQyxrQkFBa0IsRUFBRTtBQUN2QixXQUFHLEVBQUUsUUFBUTtBQUNiLG1CQUFXLEVBQUUsOENBQThDO0FBQzNELGtCQUFVLEVBQUUsd0JBQXdCO0tBQ3ZDLENBQUMsQ0FBQztDQUNWLENBQUMsQ0FBQzs7O0FDWlAsT0FBTyxDQUFDLE1BQU0sQ0FBQyx5Q0FBeUMsRUFBRSxFQUFFLENBQUMsQ0FFeEQsVUFBVSxDQUFDLHdCQUF3QixFQUFFLFVBQVMsTUFBTSxFQUFFO0FBQ25ELFVBQU0sQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDOztBQUU5QixVQUFNLENBQUMsT0FBTyxHQUFHLENBQ2IsU0FBUyxFQUNULFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULFNBQVMsQ0FDWixDQUFDOztBQUVGLFVBQU0sQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDO0FBQ25DLFVBQU0sQ0FBQyxjQUFjLEdBQUcsa0JBQWtCLENBQUM7QUFDM0MsVUFBTSxDQUFDLG9CQUFvQixHQUFHLHdCQUF3QixDQUFDO0FBQ3ZELFVBQU0sQ0FBQyxZQUFZLEdBQUcsQ0FDbEIsU0FBUyxFQUNULFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULFNBQVMsQ0FDWixDQUFDO0NBQ0wsQ0FBQyxDQUFDOzs7QUM3QlAsT0FBTyxDQUFDLE1BQU0sQ0FBQyw4QkFBOEIsRUFBRSxDQUMzQyxvQ0FBb0MsQ0FDdkMsQ0FBQyxDQUFDOzs7QUNGSCxPQUFPLENBQUMsTUFBTSxDQUFDLG9DQUFvQyxFQUFFLENBQ2pELFdBQVcsRUFDWCx5Q0FBeUMsQ0FDNUMsQ0FBQyxDQUVHLE1BQU0sQ0FBQyxVQUFTLGNBQWMsRUFBRTtBQUM3QixrQkFBYyxDQUNULEtBQUssQ0FBQyxpQ0FBaUMsRUFBRTtBQUN0QyxXQUFHLEVBQUUsZUFBZTtBQUNwQixtQkFBVyxFQUFFLDREQUE0RDtBQUN6RSxrQkFBVSxFQUFFLGtEQUFrRDtLQUNqRSxDQUFDLENBQUM7Q0FDVixDQUFDLENBQUM7OztBQ1pQLE9BQU8sQ0FBQyxNQUFNLENBQUMsd0JBQXdCLEVBQUUsQ0FDckMsOEJBQThCLENBQ2pDLENBQUMsQ0FBQzs7O0FDRkgsT0FBTyxDQUFDLE1BQU0sQ0FBQyw4QkFBOEIsRUFBRSxDQUMzQyxXQUFXLENBQ2QsQ0FBQyxDQUNHLE1BQU0sQ0FBQyxVQUFTLGNBQWMsRUFBRTtBQUM3QixrQkFBYyxDQUNULEtBQUssQ0FBQywyQkFBMkIsRUFBRTtBQUNoQyxXQUFHLEVBQUUsaUJBQWlCO0FBQ3RCLG1CQUFXLEVBQUUsZ0VBQWdFO0tBQ2hGLENBQUMsQ0FBQztDQUNWLENBQUMsQ0FBQzs7O0FDVFAsT0FBTyxDQUFDLE1BQU0sQ0FBQyxnQ0FBZ0MsRUFBRSxFQUFFLENBQUMsQ0FFL0MsVUFBVSxDQUFDLGdCQUFnQixFQUFFLFNBQVMsY0FBYyxHQUFHO0FBQ3BELFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFaEIsUUFBSSxDQUFDLE1BQU0sR0FBRztBQUNWLGdCQUFRLEVBQUUsRUFBRTtBQUNaLGFBQUssRUFBRSxFQUFFO0FBQ1QsY0FBTSxFQUFFLEVBQUU7QUFDVixnQkFBUSxFQUFFO0FBQ04saUJBQUssRUFBRSxFQUFFO0FBQ1QsZ0JBQUksRUFBRSxFQUFFO1NBQ1g7QUFDRCxjQUFNLEVBQUUsRUFBRTtLQUNiLENBQUM7O0FBRUYsUUFBSSxDQUFDLFFBQVEsR0FBRztBQUNaLGdCQUFRLEVBQUUsSUFBSTtBQUNkLGdCQUFRLEVBQUUsSUFBSTtBQUNkLHNCQUFjLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxNQUFNLENBQUM7S0FDeEYsQ0FBQztDQUNMLENBQUMsQ0FBQzs7O0FDckJQLE9BQU8sQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FDbEMsMkJBQTJCLENBQzlCLENBQUMsQ0FBQzs7O0FDRkgsT0FBTyxDQUFDLE1BQU0sQ0FBQywyQkFBMkIsRUFBRSxDQUN4QyxXQUFXLEVBQ1gsZ0NBQWdDLENBQ25DLENBQUMsQ0FFRyxNQUFNLENBQUMsVUFBUyxjQUFjLEVBQUU7QUFDN0Isa0JBQWMsQ0FDVCxLQUFLLENBQUMsd0JBQXdCLEVBQUU7QUFDN0IsV0FBRyxFQUFFLGNBQWM7QUFDbkIsbUJBQVcsRUFBRSwwREFBMEQ7QUFDdkUsa0JBQVUsRUFBRSxrQ0FBa0M7S0FDakQsQ0FBQyxDQUFDO0NBQ1YsQ0FBQyxDQUFDOzs7QUNaUCxPQUFPLENBQUMsTUFBTSxDQUFDLG1DQUFtQyxFQUFFLEVBQUUsQ0FBQyxDQUVsRCxVQUFVLENBQUMsbUJBQW1CLEVBQUUsWUFBVyxFQUUzQyxDQUFDLENBQUM7OztBQ0pQLE9BQU8sQ0FBQyxNQUFNLENBQUMsd0JBQXdCLEVBQUUsQ0FDckMsOEJBQThCLENBQ2pDLENBQUMsQ0FBQzs7O0FDRkgsT0FBTyxDQUFDLE1BQU0sQ0FBQyw4QkFBOEIsRUFBRSxDQUMzQyxXQUFXLEVBQ1gsbUNBQW1DLENBQ3RDLENBQUMsQ0FFRyxNQUFNLENBQUMsVUFBUyxjQUFjLEVBQUU7QUFDN0Isa0JBQWMsQ0FDVCxLQUFLLENBQUMsMkJBQTJCLEVBQUU7QUFDaEMsV0FBRyxFQUFFLGlCQUFpQjtBQUN0QixtQkFBVyxFQUFFLGdFQUFnRTtBQUM3RSxrQkFBVSxFQUFFLHdDQUF3QztLQUN2RCxDQUFDLENBQUM7Q0FDVixDQUFDLENBQUM7OztBQ1pQLE9BQU8sQ0FBQyxNQUFNLENBQUMsdUNBQXVDLEVBQUUsRUFBRSxDQUFDLENBQ3RELFVBQVUsQ0FBQyx1QkFBdUIsRUFBRSxVQUFTLFVBQVUsRUFBRSxRQUFRLEVBQUU7O0FBRWhFLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFaEIsUUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7QUFDdkMsUUFBSSxDQUFDLG1CQUFtQixHQUFHLG1CQUFtQixDQUFDO0FBQy9DLFFBQUksQ0FBQyxtQkFBbUIsR0FBRyxtQkFBbUIsQ0FBQzs7QUFFL0MsYUFBUyxlQUFlLEdBQUc7Ozs7QUFJdkIsa0JBQVUsQ0FBQyxLQUFLLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRTdDLGdCQUFRLENBQUMsWUFBVztBQUNoQixzQkFBVSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNqRCxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ1o7O0FBRUQsYUFBUyxtQkFBbUIsR0FBRzs7O0FBRzNCLGtCQUFVLENBQUMsS0FBSyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFDOztBQUU1QyxnQkFBUSxDQUFDLFlBQVc7QUFDaEIsc0JBQVUsQ0FBQyxLQUFLLENBQUMscUJBQXFCLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDbEQsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNaOztBQUVELGFBQVMsbUJBQW1CLEdBQUc7QUFDM0IsWUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7S0FDNUM7Q0FDSixDQUFDLENBQUM7OztBQ2pDUCxPQUFPLENBQUMsTUFBTSxDQUFDLDRCQUE0QixFQUFFLENBQ3pDLGtDQUFrQyxDQUNyQyxDQUFDLENBQUM7OztBQ0ZILE9BQU8sQ0FBQyxNQUFNLENBQUMsa0NBQWtDLEVBQUUsQ0FDL0MsV0FBVyxFQUNYLHVDQUF1QyxDQUMxQyxDQUFDLENBRUcsTUFBTSxDQUFDLFVBQVMsY0FBYyxFQUFFO0FBQzdCLGtCQUFjLENBQ1QsS0FBSyxDQUFDLG9CQUFvQixFQUFFO0FBQ3pCLFdBQUcsRUFBRSxVQUFVO0FBQ2YsbUJBQVcsRUFBRSx3RUFBd0U7QUFDckYsa0JBQVUsRUFBRSxnREFBZ0Q7S0FDL0QsQ0FBQyxDQUFDO0NBQ1YsQ0FBQyxDQUFDOzs7QUNaUCxPQUFPLENBQUMsTUFBTSxDQUFDLGtDQUFrQyxFQUFFLEVBQUUsQ0FBQyxDQUVqRCxVQUFVLENBQUMsa0JBQWtCLEVBQUUsVUFBUyxjQUFjLEVBQUU7QUFDckQsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVoQixRQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNiLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUVyQixhQUFTLEVBQUUsQ0FBQyxNQUFNLEVBQUU7QUFDaEIsY0FBTSxDQUFDLGNBQWMsRUFBRSxDQUFDOztBQUV4QixzQkFBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM5Qjs7QUFFRCxhQUFTLE1BQU0sQ0FBQyxNQUFNLEVBQUU7QUFDcEIsY0FBTSxDQUFDLGNBQWMsRUFBRSxDQUFDOztBQUV4QixzQkFBYyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUN0QztDQUNKLENBQUMsQ0FBQzs7O0FDbkJQLE9BQU8sQ0FBQyxNQUFNLENBQUMsMEJBQTBCLEVBQUUsQ0FDeEMsa0NBQWtDLENBQ3BDLENBQUMsQ0FDRyxTQUFTLENBQUMsUUFBUSxFQUFFLFVBQVMsUUFBUSxFQUFFO0FBQ3BDLFdBQU87QUFDSCxlQUFPLEVBQUUsUUFBUTtBQUNqQixZQUFJLEVBQUUsY0FBUyxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDMUMsZ0JBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7O0FBRTNCLGtCQUFNLENBQUMsTUFBTSxHQUFHLFVBQVMsR0FBRyxFQUFFO0FBQzFCLHdCQUFRLENBQUMsWUFBVztBQUNoQix3QkFBSSxHQUFHLENBQUMsVUFBVSxFQUFFO0FBQ2hCLCtCQUFPO3FCQUNWOztBQUVELHdCQUFJLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFcEUscUJBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsVUFBUyxpQkFBaUIsRUFBRTtBQUNuRCx5Q0FBaUIsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7cUJBQzFDLENBQUMsQ0FBQzs7QUFFSCx1QkFBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7aUJBQ3pCLENBQUMsQ0FBQzs7QUFFSCx1QkFBTyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQzthQUMxQyxDQUFDO1NBQ0w7S0FDSixDQUFDO0NBQ0wsQ0FBQyxDQUVELFVBQVUsQ0FBQyxXQUFXLEVBQUUsVUFBUyxNQUFNLEVBQUU7QUFDdEMsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO0FBQ3ZDLFFBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0FBQy9CLFFBQUksQ0FBQyxvQkFBb0IsR0FBRyxvQkFBb0IsQ0FBQztBQUNqRCxRQUFJLENBQUMsa0JBQWtCLEdBQUcsa0JBQWtCLENBQUM7QUFDN0MsUUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7QUFDN0IsUUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7O0FBRXJDLGFBQVMsZUFBZSxDQUFDLEdBQUcsRUFBRTtBQUMxQixZQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztLQUN6Qjs7QUFFRCxhQUFTLFdBQVcsQ0FBQyxHQUFHLEVBQUU7QUFDdEIsZUFBTyxJQUFJLENBQUMsVUFBVSxLQUFLLEdBQUcsQ0FBQztLQUNsQzs7QUFFRCxhQUFTLG9CQUFvQixDQUFDLE1BQU0sRUFBRTtBQUNsQyxjQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDeEIsY0FBTSxDQUFDLElBQUksQ0FBQztBQUNSLHNCQUFVLEVBQUUsc0NBQXNDO0FBQ2xELHVCQUFXLEVBQUUsMERBQTBEO1NBQzFFLENBQUMsQ0FBQztLQUNOOztBQUVELGFBQVMsa0JBQWtCLENBQUMsTUFBTSxFQUFFO0FBQ2hDLGNBQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUN4QixjQUFNLENBQUMsSUFBSSxDQUFDO0FBQ1Isc0JBQVUsRUFBRSxzQ0FBc0M7QUFDbEQsdUJBQVcsRUFBRSx3REFBd0Q7U0FDeEUsQ0FBQyxDQUFDO0tBQ047O0FBRUQsYUFBUyxVQUFVLENBQUMsTUFBTSxFQUFFO0FBQ3hCLGNBQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUN4QixjQUFNLENBQUMsSUFBSSxDQUFDO0FBQ1Isc0JBQVUsRUFBRSxzQ0FBc0M7QUFDbEQsdUJBQVcsRUFBRSwrQ0FBK0M7QUFDNUQsdUJBQVcsRUFBRSxRQUFRO1NBQ3hCLENBQUMsQ0FBQztLQUNOOztBQUVELGFBQVMsY0FBYyxDQUFDLE1BQU0sRUFBRTtBQUM1QixjQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDeEIsY0FBTSxDQUFDLElBQUksQ0FBQztBQUNSLHNCQUFVLEVBQUUsc0NBQXNDO0FBQ2xELHVCQUFXLEVBQUUsb0RBQW9EO0FBQ2pFLHVCQUFXLEVBQUUsY0FBYztTQUM5QixDQUFDLENBQUM7S0FDTjtDQUNKLENBQUMsQ0FBQzs7O0FDaEZQLE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQzVCLHFCQUFxQixDQUN4QixDQUFDLENBQUM7OztBQ0ZILE9BQU8sQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FDbEMsV0FBVyxFQUNYLDBCQUEwQixDQUM3QixDQUFDLENBRUcsTUFBTSxDQUFDLFVBQVMsY0FBYyxFQUFFO0FBQzdCLGtCQUFjLENBQ1QsS0FBSyxDQUFDLGtCQUFrQixFQUFFO0FBQ3ZCLFdBQUcsRUFBRSxRQUFRO0FBQ2IsbUJBQVcsRUFBRSw4Q0FBOEM7QUFDM0Qsa0JBQVUsRUFBRSx3QkFBd0I7S0FDdkMsQ0FBQyxDQUFDO0NBQ1YsQ0FBQyxDQUFDOzs7QUNaUCxPQUFPLENBQUMsTUFBTSxDQUFDLDJCQUEyQixFQUFFLEVBQUUsQ0FBQyxDQUUxQyxVQUFVLENBQUMsWUFBWSxFQUFFLFlBQVcsRUFFcEMsQ0FBQyxDQUFDOzs7QUNKUCxPQUFPLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLENBQzdCLHNCQUFzQixDQUN6QixDQUFDLENBQUM7OztBQ0ZILE9BQU8sQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUUsQ0FDbkMsV0FBVyxFQUNYLDJCQUEyQixDQUM5QixDQUFDLENBRUcsTUFBTSxDQUFDLFVBQVMsY0FBYyxFQUFFO0FBQzdCLGtCQUFjLENBQ1QsS0FBSyxDQUFDLG1CQUFtQixFQUFFO0FBQ3hCLFdBQUcsRUFBRSxTQUFTO0FBQ2QsbUJBQVcsRUFBRSxnREFBZ0Q7QUFDN0Qsa0JBQVUsRUFBRSwwQkFBMEI7S0FDekMsQ0FBQyxDQUFDO0NBQ1YsQ0FBQyxDQUFDOzs7QUNaUCxPQUFPLENBQUMsTUFBTSxDQUFDLG1DQUFtQyxFQUFFLEVBQUUsQ0FBQyxDQUVsRCxVQUFVLENBQUMseUJBQXlCLEVBQUUsVUFBUyxlQUFlLEVBQUU7QUFDN0QsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVoQixRQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNiLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUVyQixhQUFTLEVBQUUsQ0FBQyxNQUFNLEVBQUU7QUFDaEIsY0FBTSxDQUFDLGNBQWMsRUFBRSxDQUFDOztBQUV4Qix1QkFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMvQjs7QUFFRCxhQUFTLE1BQU0sQ0FBQyxNQUFNLEVBQUU7QUFDcEIsY0FBTSxDQUFDLGNBQWMsRUFBRSxDQUFDOztBQUV4Qix1QkFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUN2QztDQUNKLENBQUMsQ0FBQzs7O0FDbkJQLE9BQU8sQ0FBQyxNQUFNLENBQUMsMkJBQTJCLEVBQUUsQ0FDekMsbUNBQW1DLENBQ3JDLENBQUMsQ0FDRyxTQUFTLENBQUMsUUFBUSxFQUFFLFVBQVMsUUFBUSxFQUFFO0FBQ3BDLFdBQU87QUFDSCxlQUFPLEVBQUUsUUFBUTtBQUNqQixZQUFJLEVBQUUsY0FBUyxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDMUMsZ0JBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7O0FBRTNCLGtCQUFNLENBQUMsTUFBTSxHQUFHLFVBQVMsR0FBRyxFQUFFO0FBQzFCLHdCQUFRLENBQUMsWUFBVztBQUNoQix3QkFBSSxHQUFHLENBQUMsVUFBVSxFQUFFO0FBQ2hCLCtCQUFPO3FCQUNWOztBQUVELHdCQUFJLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFcEUscUJBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsVUFBUyxpQkFBaUIsRUFBRTtBQUNuRCx5Q0FBaUIsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7cUJBQzFDLENBQUMsQ0FBQzs7QUFFSCx1QkFBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7aUJBQ3pCLENBQUMsQ0FBQzs7QUFFSCx1QkFBTyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQzthQUMxQyxDQUFDO1NBQ0w7S0FDSixDQUFDO0NBQ0wsQ0FBQyxDQUVELFVBQVUsQ0FBQyxZQUFZLEVBQUUsVUFBUyxPQUFPLEVBQUU7QUFDeEMsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO0FBQ3ZDLFFBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0FBQy9CLFFBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDOztBQUU3QixhQUFTLGVBQWUsQ0FBQyxHQUFHLEVBQUU7QUFDMUIsWUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7S0FDekI7O0FBRUQsYUFBUyxXQUFXLENBQUMsR0FBRyxFQUFFO0FBQ3RCLGVBQU8sSUFBSSxDQUFDLFVBQVUsS0FBSyxHQUFHLENBQUM7S0FDbEM7O0FBRUQsYUFBUyxVQUFVLENBQUMsTUFBTSxFQUFFO0FBQ3hCLGNBQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUN4QixlQUFPLENBQUMsSUFBSSxDQUFDO0FBQ1Qsc0JBQVUsRUFBRSx3Q0FBd0M7QUFDcEQsdUJBQVcsRUFBRSxzREFBc0Q7U0FDdEUsQ0FBQyxDQUFDO0tBQ047Q0FDSixDQUFDLENBQUM7OztBQ25EUCxPQUFPLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLENBQzdCLHNCQUFzQixDQUN6QixDQUFDLENBQUM7OztBQ0ZILE9BQU8sQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUUsQ0FDbkMsV0FBVyxFQUNYLDJCQUEyQixDQUM5QixDQUFDLENBRUcsTUFBTSxDQUFDLFVBQVMsY0FBYyxFQUFFO0FBQzdCLGtCQUFjLENBQ1QsS0FBSyxDQUFDLG1CQUFtQixFQUFFO0FBQ3hCLFdBQUcsRUFBRSxTQUFTO0FBQ2QsbUJBQVcsRUFBRSxnREFBZ0Q7QUFDN0Qsa0JBQVUsRUFBRSwwQkFBMEI7S0FDekMsQ0FBQyxDQUFDO0NBQ1YsQ0FBQyxDQUFDOzs7QUNaUCxPQUFPLENBQUMsTUFBTSxDQUFDLDJCQUEyQixFQUFFLEVBQUUsQ0FBQyxDQUUxQyxVQUFVLENBQUMsWUFBWSxFQUFFLFlBQVcsRUFFcEMsQ0FBQyxDQUFDOzs7QUNKUCxPQUFPLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLENBQzdCLHNCQUFzQixDQUN6QixDQUFDLENBQUM7OztBQ0ZILE9BQU8sQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUUsQ0FDbkMsV0FBVyxFQUNYLDJCQUEyQixDQUM5QixDQUFDLENBRUcsTUFBTSxDQUFDLFVBQVMsY0FBYyxFQUFFO0FBQzdCLGtCQUFjLENBQ1QsS0FBSyxDQUFDLG1CQUFtQixFQUFFO0FBQ3hCLFdBQUcsRUFBRSxTQUFTO0FBQ2QsbUJBQVcsRUFBRSxnREFBZ0Q7QUFDN0Qsa0JBQVUsRUFBRSwwQkFBMEI7S0FDekMsQ0FBQyxDQUFDO0NBQ1YsQ0FBQyxDQUFDOzs7QUNaUCxPQUFPLENBQUMsTUFBTSxDQUFDLHlCQUF5QixFQUFFLEVBQUUsQ0FBQyxDQUV4QyxVQUFVLENBQUMsVUFBVSxFQUFFLFlBQVc7QUFDL0IsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVoQixRQUFJLENBQUMsSUFBSSxHQUFHLENBQ1IsRUFBRSxLQUFLLEVBQUMsaUJBQWlCLEVBQUUsT0FBTyxFQUFDLG1CQUFtQixFQUFFLEVBQ3hELEVBQUUsS0FBSyxFQUFDLGlCQUFpQixFQUFFLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxDQUMzRCxDQUFDOztBQUVGLFFBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxVQUFVLEdBQUc7QUFDcEMsZUFBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztLQUMvQixDQUFDO0NBQ0wsQ0FBQyxDQUFDOzs7QUNiUCxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUMzQixvQkFBb0IsQ0FDdkIsQ0FBQyxDQUFDOzs7QUNGSCxPQUFPLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFLENBQ2pDLFdBQVcsRUFDWCx5QkFBeUIsQ0FDNUIsQ0FBQyxDQUVHLE1BQU0sQ0FBQyxVQUFTLGNBQWMsRUFBRTtBQUM3QixrQkFBYyxDQUNULEtBQUssQ0FBQyxpQkFBaUIsRUFBRTtBQUN0QixXQUFHLEVBQUUsT0FBTztBQUNaLG1CQUFXLEVBQUUsNENBQTRDO0FBQ3pELGtCQUFVLEVBQUUsc0JBQXNCO0tBQ3JDLENBQUMsQ0FBQztDQUNWLENBQUMsQ0FBQzs7O0FDWlAsT0FBTyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxDQUM5Qix1QkFBdUIsQ0FDMUIsQ0FBQyxDQUFDOzs7QUNGSCxPQUFPLENBQUMsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQ3BDLFdBQVcsQ0FDZCxDQUFDLENBRUcsTUFBTSxDQUFDLFVBQVMsY0FBYyxFQUFFO0FBQzdCLGtCQUFjLENBQ1QsS0FBSyxDQUFDLG9CQUFvQixFQUFFO0FBQ3pCLFdBQUcsRUFBRSxVQUFVO0FBQ2YsbUJBQVcsRUFBRSxrREFBa0Q7S0FDbEUsQ0FBQyxDQUFDO0NBQ1YsQ0FBQyxDQUFDOzs7QUNWUCxPQUFPLENBQUMsTUFBTSxDQUFDLHdCQUF3QixFQUFFLENBQ3JDLDhCQUE4QixDQUNqQyxDQUFDLENBQUM7OztBQ0ZILE9BQU8sQ0FBQyxNQUFNLENBQUMsOEJBQThCLEVBQUUsQ0FDM0MsV0FBVyxFQUNYLDBCQUEwQixDQUM3QixDQUFDLENBQ0csTUFBTSxDQUFDLFVBQVMsY0FBYyxFQUFFO0FBQzdCLGtCQUFjLENBQ1QsS0FBSyxDQUFDLDJCQUEyQixFQUFFO0FBQ2hDLFdBQUcsRUFBRSxpQkFBaUI7QUFDdEIsbUJBQVcsRUFBRSxnRUFBZ0U7QUFDN0Usa0JBQVUsRUFBRSx3QkFBd0I7S0FDdkMsQ0FBQyxDQUFDO0NBQ1YsQ0FBQyxDQUFDOzs7QUNYUCxPQUFPLENBQUMsTUFBTSxDQUFDLDZDQUE2QyxFQUFFLEVBQUUsQ0FBQyxDQUM1RCxPQUFPLENBQUMsWUFBWSxFQUFFLFNBQVMsVUFBVSxDQUFDLEtBQUssRUFBRTtBQUM5QyxRQUFJLE9BQU8sR0FBRztBQUNWLHFCQUFhLEVBQUUsYUFBYTtLQUMvQixDQUFDOztBQUVGLGFBQVMsYUFBYSxDQUFDLFdBQVcsRUFBRTtBQUNoQyxlQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFO0FBQzVCLGtCQUFNLEVBQUUsV0FBVztTQUN0QixDQUFDLENBQ0csSUFBSSxDQUFDLFNBQVMsb0JBQW9CLENBQUMsUUFBUSxFQUFFO0FBQzFDLG1CQUFPO0FBQ0gsb0JBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUk7QUFDeEIsMEJBQVUsRUFBRTtBQUNSLHdCQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSTtBQUNuQyx5QkFBSyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUs7QUFDckMseUJBQUssRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRO2lCQUMzQzthQUNKLENBQUM7U0FDTCxDQUFDLENBQUM7S0FDVjs7QUFFRCxXQUFPLE9BQU8sQ0FBQztDQUNsQixDQUFDLENBQUMiLCJmaWxlIjoid2Vic2l0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlJywgW1xuICAgICdiY2FwcC1wYXR0ZXJuLWxhYicsXG4gICAgJ21tLmZvdW5kYXRpb24nLFxuICAgICd3ZWJzaXRlLXRlbXBsYXRlcycsXG4gICAgJ3VpLmNvZGVtaXJyb3InLFxuICAgICd1aS5yb3V0ZXInLFxuXG4gICAgLy8gSlMgQ29tcG9uZW50c1xuICAgICd3ZWJzaXRlLmFjY29yZGlvbicsXG4gICAgJ3dlYnNpdGUuYWxlcnRzJyxcbiAgICAnd2Vic2l0ZS5hc2lkZS1uYXYnLFxuICAgICd3ZWJzaXRlLmJhbm5lcnMnLFxuICAgICd3ZWJzaXRlLmJjLWRhdGVwaWNrZXInLFxuICAgICd3ZWJzaXRlLmJjLWRyb3Bkb3duJyxcbiAgICAnd2Vic2l0ZS5iYy1wYWdpbmF0aW9uJyxcbiAgICAnd2Vic2l0ZS5iYy1zZXJ2ZXItdGFibGUnLFxuICAgICd3ZWJzaXRlLmJ1dHRvbnMnLFxuICAgICd3ZWJzaXRlLmNhcmRzJyxcbiAgICAnd2Vic2l0ZS5jb2xvci1waWNrZXItZXhhbXBsZScsXG4gICAgJ3dlYnNpdGUuY29weS1jbGlwYm9hcmQnLFxuICAgICd3ZWJzaXRlLmNyZWRpdC1jYXJkJyxcbiAgICAnd2Vic2l0ZS5nbG9iYWwtbWVzc2FnZScsXG4gICAgJ3dlYnNpdGUubG9hZGluZy1pbmRpY2F0b3JzJyxcbiAgICAnd2Vic2l0ZS5pY29ucycsXG4gICAgJ3dlYnNpdGUubW9kYWwnLFxuICAgICd3ZWJzaXRlLnBhbmVscycsXG4gICAgJ3dlYnNpdGUucHJvbXB0JyxcbiAgICAnd2Vic2l0ZS5zd2l0Y2gnLFxuICAgICd3ZWJzaXRlLnRhYmxlcycsXG4gICAgJ3dlYnNpdGUudGFicycsXG4gICAgJ3dlYnNpdGUudG9vbHRpcCcsXG4gICAgJ3dlYnNpdGUud2FybmluZy1idXR0b24nXG5dKVxuICAgIC5jb25zdGFudCgnQkNfQVBQX0NPTkZJRycsIHt9KVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgc3ZnUm9vdFBhdGhQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzJywge1xuICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHVybDogJy9jb21wb25lbnRzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzx1aS12aWV3Lz4nXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBzdmdSb290UGF0aFByb3ZpZGVyLnNldFJvb3RQYXRoKCcvc3ZnL2ljb25zLycpO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYXNpZGUtbmF2LmNvbnRyb2xsZXInLCBbXSlcbiAgICAuY29udHJvbGxlcignQXNpZGVOYXZDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkd2luZG93KSB7XG4gICAgXHQkc2NvcGUuaXNBY3RpdmUgPSBmdW5jdGlvbiAodmlld0xvY2F0aW9uKSB7XG4gICAgXHRcdHJldHVybiAodmlld0xvY2F0aW9uID09PSAkd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKTtcblx0XHR9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYXNpZGUtbmF2JywgW1xuICAgICd3ZWJzaXRlLmFzaWRlLW5hdi5jb250cm9sbGVyJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5pY29ucy5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignSWNvbnNDdHJsJywgZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgICRzY29wZS5pY29ucyA9IHdpbmRvdy5pY29ucztcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmljb25zLmRpcmVjdGl2ZScsIFtcbiAgICAgICAgJ3dlYnNpdGUuaWNvbnMuY29udHJvbGxlcidcbiAgICBdKVxuICAgIC5kaXJlY3RpdmUoJ2ljb25zTGlzdCcsIGZ1bmN0aW9uIGJjSWNvbkRpcmVjdGl2ZSgpIHtcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2ljb25zL2ljb25zLnRwbC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdJY29uc0N0cmwgYXMgaWNvbnNDdHJsJ1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuaWNvbnMnLCBbXG4gICAgJ3dlYnNpdGUuaWNvbnMuZGlyZWN0aXZlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5zd2l0Y2guY29udHJvbGxlcicsIFtdKVxuXG4gICAgLmNvbnRyb2xsZXIoJ1BhdHRlcm5MYWJTd2l0Y2hDdHJsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjdHJsID0gdGhpcztcblxuICAgICAgICBjdHJsLnN3aXRjaE9uZSA9IGZhbHNlO1xuICAgICAgICBjdHJsLnN3aXRjaFR3byA9IHRydWU7XG4gICAgICAgIGN0cmwuc3dpdGNoVGhyZWUgPSBmYWxzZTtcbiAgICAgICAgY3RybC5zd2l0Y2hGb3VyID0gdHJ1ZTtcbiAgICAgICAgY3RybC5zd2l0Y2hGaXZlID0gZmFsc2U7XG4gICAgICAgIGN0cmwuc3dpdGNoU2l4ID0gZmFsc2U7XG4gICAgICAgIGN0cmwuaXNTd2l0Y2hTaXhEaXNhYmxlZCA9IHRydWU7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5zd2l0Y2gnLCBbXG4gICAgJ3dlYnNpdGUuc3dpdGNoLmNvbnRyb2xsZXInXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmFjY29yZGlvbi5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignQWNjb3JkaW9uQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgICAkc2NvcGUub25lQXRBVGltZSA9IHRydWU7XG5cbiAgICAgICAgJHNjb3BlLmdyb3VwcyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJ2R5bmFtaWMtMScsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiRHluYW1pYyBHcm91cCBIZWFkZXIgLSAxXCIsXG4gICAgICAgICAgICAgICAgY29udGVudDogXCJEeW5hbWljIEdyb3VwIEJvZHkgLSAxXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICdkeW5hbWljLTInLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIkR5bmFtaWMgR3JvdXAgSGVhZGVyIC0gMlwiLFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiRHluYW1pYyBHcm91cCBCb2R5IC0gMlwiXG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG5cbiAgICAgICAgJHNjb3BlLml0ZW1zID0gWydJdGVtIDEnLCAnSXRlbSAyJywgJ0l0ZW0gMyddO1xuXG4gICAgICAgICRzY29wZS5hZGRJdGVtID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgbmV3SXRlbU5vID0gJHNjb3BlLml0ZW1zLmxlbmd0aCArIDE7XG4gICAgICAgICAgICAkc2NvcGUuaXRlbXMucHVzaCgnSXRlbSAnICsgbmV3SXRlbU5vKTtcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmFjY29yZGlvbicsIFtcbiAgICAnd2Vic2l0ZS5hY2NvcmRpb24uc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmFjY29yZGlvbi5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnd2Vic2l0ZS5hY2NvcmRpb24uY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMuYWNjb3JkaW9uJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9hY2NvcmRpb24nLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvYWNjb3JkaW9uL2FjY29yZGlvbi50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FjY29yZGlvbkN0cmwgYXMgYWNjb3JkaW9uQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYWxlcnRzLmNvbnRyb2xsZXInLCBbXSlcbiAgICAuY29udHJvbGxlcignQWxlcnRzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICAgICAkc2NvcGUuYWxlcnRzID0gW1xuICAgICAgICAgICAgeyBcbiAgICAgICAgICAgICAgICBtc2c6ICdHZW5lcmljIGFsZXJ0JyBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nLCBcbiAgICAgICAgICAgICAgICBtc2c6ICdJbmZvcm1hdGlvbmFsIGFsZXJ0JywgXG4gICAgICAgICAgICAgICAgbGlua3M6IFtcbiAgICAgICAgICAgICAgICAgICAgeyB0aXRsZTogJ1Rlc3QnLCBocmVmOiAnaHR0cDovL3Rlc3QuY29tJywgdGFyZ2V0OiAndGVzdCcgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLCBcbiAgICAgICAgICAgICAgICBtc2c6ICdTdWNjZXNzIGFsZXJ0JyxcbiAgICAgICAgICAgICAgICBsaW5rczogW1xuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnTXkgTmV3IFdpbmRvdyBUZXN0IExpbmsnLCBocmVmOiAnaHR0cDovL3Rlc3QuY29tJywgdGFyZ2V0OiAnX2JsYW5rJyB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgdHlwZTogJ3dhcm5pbmcnLCBtc2c6ICdXYXJuaW5nIGFsZXJ0JyB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsIFxuICAgICAgICAgICAgICAgIG1zZzogJ0Vycm9yIGFsZXJ0IGNvbnRhaW5pbmcgbWFueSB3b3JkcyB0byBhbGVydCB0aGUgdXNlciBvZiB0aGlzIHBhcnRpY3VsYXIgYWxlcnQuJyxcbiAgICAgICAgICAgICAgICBsaW5rczogW1xuICAgICAgICAgICAgICAgICAgICB7IHRpdGxlOiAnQW5vdGhlciBUZXN0IExpbmsnLCBocmVmOiAnaHR0cDovL3Rlc3QuY29tJyB9XG4gICAgICAgICAgICAgICAgXSBcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcblxuICAgICAgICAkc2NvcGUub3BlbkFsZXJ0ID0gIHtcbiAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsIFxuICAgICAgICAgICAgbXNnOiAnRXJyb3IgYWxlcnQgaW4gYSBwYW5lbCdcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuYWRkQWxlcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzY29wZS5hbGVydHMucHVzaCh7XG4gICAgICAgICAgICAgICAgbXNnOiAnQW5vdGhlciBnZW5lcmljIGFsZXJ0ISdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5jbG9zZUFsZXJ0ID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgICRzY29wZS5hbGVydHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmFsZXJ0cycsIFtcbiAgICAnd2Vic2l0ZS5hbGVydHMuc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmFsZXJ0cy5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnd2Vic2l0ZS5hbGVydHMuY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMuYWxlcnRzJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9hbGVydHMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvYWxlcnRzL2FsZXJ0cy50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FsZXJ0c0N0cmwgYXMgYWxlcnRzQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmFubmVycy5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignQmFubmVyc0N0cmwnLCBmdW5jdGlvbigpIHtcblxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmFubmVycycsIFtcbiAgICAnd2Vic2l0ZS5iYW5uZXJzLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5iYW5uZXJzLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICd3ZWJzaXRlLmJhbm5lcnMuY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMuYmFubmVycycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYmFubmVycycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9iYW5uZXJzL2Jhbm5lcnMudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCYW5uZXJzQ3RybCBhcyBiYW5uZXJzQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmMtZHJvcGRvd24nLCBbXG4gICAgJ3dlYnNpdGUuYmMtZHJvcGRvd24uc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmJjLWRyb3Bkb3duLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLmJjLWRyb3Bkb3duJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9iYy1kcm9wZG93bicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9iYy1kcm9wZG93bi9iYy1kcm9wZG93bi50cGwuaHRtbCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmMtZGF0ZXBpY2tlci5jb250cm9sbGVyJywgW10pXG4gICAgLmNvbnRyb2xsZXIoJ0JjRGF0ZXBpY2tlckN0cmwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGN0cmwgPSB0aGlzO1xuXG4gICAgICAgIGN0cmwub3B0aW9ucyA9IHt9O1xuICAgIH0pO1xuXG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5iYy1kYXRlcGlja2VyJywgW1xuICAgICd3ZWJzaXRlLmJjLWRhdGVwaWNrZXIuc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmJjLWRhdGVwaWNrZXIuc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUuYmMtZGF0ZXBpY2tlci5jb250cm9sbGVyJ1xuXSlcblxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29tcG9uZW50cy5iYy1kYXRlcGlja2VyJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9iYy1kYXRlcGlja2VyJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL2JjLWRhdGVwaWNrZXIvYmMtZGF0ZXBpY2tlci50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0JjRGF0ZXBpY2tlckN0cmwgYXMgYmNEYXRlcGlja2VyQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmMtcGFnaW5hdGlvbi5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignQmNQYWdpbmF0aW9uQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGxvZykge1xuICAgICAgICAkc2NvcGUudG90YWxJdGVtcyA9IDIwMDtcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRQYWdlID0gMTtcbiAgICAgICAgJHNjb3BlLm1heFNpemUgPSA1O1xuICAgICAgICAkc2NvcGUuaXRlbXNQZXJQYWdlID0gMTA7XG4gICAgICAgICRzY29wZS5zaG93TGltaXRzID0gZmFsc2U7XG5cbiAgICAgICAgJHNjb3BlLm9uU2VsZWN0UGFnZSA9IGZ1bmN0aW9uKG5ld1ZhbHVlcykge1xuICAgICAgICAgICAgJGxvZy5sb2coJ05ldyBWYWx1ZXMgQ29tYm86ICcsIG5ld1ZhbHVlcyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJHNjb3BlLnNldFBhZ2UgPSBmdW5jdGlvbihwYWdlTm8pIHtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50UGFnZSA9IHBhZ2VObztcbiAgICAgICAgfTtcblxuICAgICAgICAkc2NvcGUuY3VzdG9tTGltaXRzID0gWzEwLCAyMCwgMzAsIDEwMF07XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5iYy1wYWdpbmF0aW9uJywgW1xuICAgICd3ZWJzaXRlLmJjLXBhZ2luYXRpb24uc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmJjLXBhZ2luYXRpb24uc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUuYmMtcGFnaW5hdGlvbi5jb250cm9sbGVyJ1xuXSlcblxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29tcG9uZW50cy5iYy1wYWdpbmF0aW9uJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9iYy1wYWdpbmF0aW9uJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL2JjLXBhZ2luYXRpb24vYmMtcGFnaW5hdGlvbi50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0JjUGFnaW5hdGlvbkN0cmwgYXMgYmNQYWdpbmF0aW9uQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmMtc2VydmVyLXRhYmxlLmNvbnN0YW50cycsIFtdKVxuICAgIC5jb25zdGFudCgnREVNT19UQUJMRV9DT05GSUcnLCB7XG4gICAgICAgIHF1ZXJ5S2V5czoge1xuICAgICAgICAgICAgcGFnZTogJ3BhZ2UnLFxuICAgICAgICAgICAgbGltaXQ6ICdsaW1pdCcsXG4gICAgICAgICAgICBzb3J0Qnk6ICdzb3J0LWJ5JyxcbiAgICAgICAgICAgIHNvcnREaXI6ICdzb3J0LW9yZGVyJ1xuICAgICAgICB9LFxuICAgICAgICBzb3J0RGlyVmFsdWVzOiB7XG4gICAgICAgICAgICBhc2M6ICdhc2MnLFxuICAgICAgICAgICAgZGVzYzogJ2RzYydcbiAgICAgICAgfSxcbiAgICAgICAgZmlsdGVyczogWyd0aW1lJ10sXG4gICAgICAgIHJvd0lkS2V5OiAnbmFtZSdcbiAgICB9KVxuICAgIC5jb25zdGFudCgnREVNT19UQUJMRV9JRCcsICdkZW1vLXRhYmxlJyk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5iYy1zZXJ2ZXItdGFibGUuY29udHJvbGxlcicsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnYmNhcHAtcGF0dGVybi1sYWIuYmMtc2VydmVyLXRhYmxlJyxcbiAgICAnZTJlLWJhY2tlbmQnXG5dKVxuXG4gICAgLmNvbnRyb2xsZXIoJ0JjU2VydmVyVGFibGVEZW1vQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlLCBiY1NlcnZlclRhYmxlRmFjdG9yeSwgZGF0YVRhYmxlLCBERU1PX1RBQkxFX0lEKSB7XG4gICAgICAgIHZhciBjdHJsID0gdGhpcztcblxuICAgICAgICBjdHJsLmNsZWFyVGFibGUgPSBjbGVhclRhYmxlO1xuICAgICAgICBjdHJsLmJjU2VydmVyVGFibGUgPSBiY1NlcnZlclRhYmxlRmFjdG9yeS5nZXQoREVNT19UQUJMRV9JRCk7XG5cbiAgICAgICAgLy8gVGhpcyBuZWVkcyB0byBiZSBoZXJlIHVudGlsIHRoZSBwYWdpbmF0aW9uIGRpcmVjdGl2ZSBpcyB1cGRhdGVkXG4gICAgICAgIC8vIHRvIHByZXNlcnZlIGNvbnRleHQgd2hlbiBjYWxsaW5nIHRoZSBvbi1jaGFuZ2UgZnVuY3Rpb24uXG4gICAgICAgIGN0cmwuYmNTZXJ2ZXJUYWJsZS51cGRhdGVQYWdlID0gXy5iaW5kKGN0cmwuYmNTZXJ2ZXJUYWJsZS51cGRhdGVQYWdlLCBjdHJsLmJjU2VydmVyVGFibGUpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNsZWFyVGFibGUoJGV2ZW50KSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygkc3RhdGUuY3VycmVudC5uYW1lLCB7IHBhZ2U6IDEgfSwgeyBpbmhlcml0OiBmYWxzZSB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmMtc2VydmVyLXRhYmxlJywgW1xuICAgICd3ZWJzaXRlLmJjLXNlcnZlci10YWJsZS5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmMtc2VydmVyLXRhYmxlLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICd3ZWJzaXRlLmJjLXNlcnZlci10YWJsZS5jb25zdGFudHMnLFxuICAgICd3ZWJzaXRlLmJjLXNlcnZlci10YWJsZS5jb250cm9sbGVyJyxcbiAgICAnd2Vic2l0ZS5iYy1zZXJ2ZXItdGFibGUuc2FtcGxlLWRhdGEuc2VydmljZSdcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMuYmMtc2VydmVyLXRhYmxlJywge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdCY1NlcnZlclRhYmxlRGVtb0N0cmwgYXMgYmNTZXJ2ZXJUYWJsZURlbW9DdHJsJyxcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFUYWJsZTogZnVuY3Rpb24gZGF0YVRhYmxlUmVzb2x2ZSgkc3RhdGVQYXJhbXMsIGJjU2VydmVyVGFibGVGYWN0b3J5LCBERU1PX1RBQkxFX0NPTkZJRywgREVNT19UQUJMRV9JRCwgc2FtcGxlRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJjU2VydmVyVGFibGVGYWN0b3J5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNyZWF0ZShERU1PX1RBQkxFX0lELCBERU1PX1RBQkxFX0NPTkZJRylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaW5pdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlUGFyYW1zOiAkc3RhdGVQYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlQ2FsbGJhY2s6IHNhbXBsZURhdGEuZ2V0U2FtcGxlRGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL2JjLXNlcnZlci10YWJsZS9iYy1zZXJ2ZXItdGFibGUudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIHVybDogJy9iYy1zZXJ2ZXItdGFibGU/c29ydC1vcmRlciZzb3J0LWJ5JnBhZ2UmbGltaXQmdGltZSZuYW1lJ1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnZTJlLWJhY2tlbmQnLCBbXG4gICAgJ25nTW9ja0UyRSdcbl0pXG4gICAgLnJ1bihmdW5jdGlvbigkaHR0cEJhY2tlbmQpIHtcbiAgICAgICAgJGh0dHBCYWNrZW5kLndoZW5HRVQoL1xcL3RhYmxlLmpzb24uKi8pLnJlc3BvbmQoYXBpUmVzcG9uc2UpO1xuICAgICAgICAkaHR0cEJhY2tlbmQud2hlbkdFVCgvLiovKS5wYXNzVGhyb3VnaCgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFwaVJlc3BvbnNlKHN0YXR1cywgZGF0YSkge1xuICAgICAgICAgICAgdmFyIGl0ZW1zLCBwYWdpbmF0aW9uLCByb3dzLCByb3dUb1Nob3csIHNvcnRCeSwgZnJvbVJvdywgdG9Sb3csIGxpbWl0LCBwYWdlO1xuICAgICAgICAgICAgcm93cyA9IFtcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ1JpdHVhbCBDb2ZmZWUgUm9hc3RlcnMnLCAnc3Rhcic6ICfimIXimIXimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnSGF5ZXMgVmFsbGV5J30sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdCbHVlIEJvdHRsZScsICdzdGFyJzogJ+KYheKYheKYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdIYXllcyBWYWxsZXknIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdDb2ZmZWVTaG9wJywgJ3N0YXInOiAn4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ0Jlcm5hbCBIZWlnaHRzJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnU3Bpa2VcXCdzIENvZmZlZSAmIFRlYXMnLCAnc3Rhcic6ICfimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnQ2FzdHJvJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnTGEgQm91bGFuZ2UnLCAnc3Rhcic6ICfimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnQ29sZSBWYWxsZXknIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdEeW5hbW8gRG9udXQgYW5kIENvZmZlZScsICdzdGFyJzogJ+KYheKYheKYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdDb3cgSG9sbG93JyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnVGhlIE1pbGwnLCAnc3Rhcic6ICfimIXimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnRGl2aXNhZGVybycgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ1BpY2Npbm8gQ29mZmVlIEJhcicsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdEb2dwYXRjaCcgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ1BoaWx6JywgJ3N0YXInOiAn4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ0Rvd250b3duJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnRHVib2NlIFBhcmsgQ2FmZScsICdzdGFyJzogJ+KYheKYhScsICdzZi1sb2NhdGlvbic6ICdEdWJvY2UgVHJpYW5nbGUnIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdCbHVlIEJvdHRsZScsICdzdGFyJzogJ+KYheKYheKYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdFbWJhcmNhZGVybycgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0ZvdXIgQmFycmVsJywgJ3N0YXInOiAn4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ0V4Y2Vsc2lvcicgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0NvZmZlZSBCYXInLCAnc3Rhcic6ICfimIXimIXimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnRmlEaScgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0Jpc2NvZmYgQ29mZmVlIENvcm5lcicsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdGaXNoZXJtYW5cXCdzIFdoYXJmJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnRmlmdHkvRmlmdHkgQ29mZmVlIGFuZCBUZWEnLCAnc3Rhcic6ICfimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnSW5uZXIgUmljaG1vbmQnIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdCZWFuZXJ5JywgJ3N0YXInOiAn4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ0lubmVyIFN1bnNldCcgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0NhZmUgZHUgU29sZWlsJywgJ3N0YXInOiAn4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ0xvd2VyIEhhaWdodCcgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ1BlZXRcXCdzJywgJ3N0YXInOiAn4piFJywgJ3NmLWxvY2F0aW9uJzogJ1RoZSBNYXJpbmEnIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdTaWdodGdsYXNzJywgJ3N0YXInOiAn4piF4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ1RoZSBNaXNzaW9uJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnQ29udHJhYmFuZCBDb2ZmZWUgQmFyJywgJ3N0YXInOiAn4piF4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ05vYiBIaWxsJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnTWFydGhhICYgQnJvcyBDb2ZmZWUnLCAnc3Rhcic6ICfimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnTm9lIFZhbGxleScgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ1LDqXZlaWxsZScsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdOb3J0aCBCZWFjaCcgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0N1cCBDb2ZmZWUgQmFyJywgJ3N0YXInOiAn4piF4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ091dGVyIE1pc3Npb24nIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdHYXJkZW4gSG91c2UgQ2FmZScsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdPdXRlciBSaWNobW9uZCcgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ0FuZHl0b3duIENvZmZlZSBSb2FzdGVycycsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdPdXRlciBTdW5zZXQnIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdKYW5lIG9uIEZpbGxtb3JlJywgJ3N0YXInOiAn4piF4piFJywgJ3NmLWxvY2F0aW9uJzogJ1BhY2lmaWMgSGVpZ2h0cycgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ1NhaW50IEZyYW5rIENvZmZlZScsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdQb2xrJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnRmFybGV54oCZcycsICdzdGFyJzogJ+KYheKYheKYhScsICdzZi1sb2NhdGlvbic6ICdQb3RyZXJvIEhpbGwnIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdIb3VzZSBvZiBTbmFja3MnLCAnc3Rhcic6ICfimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnVGhlIFByZXNpZGlvJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnVGhlIEJyZXcnLCAnc3Rhcic6ICfimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnUnVzc2lhbiBIaWxsJyB9LFxuICAgICAgICAgICAgICAgIHsgJ25hbWUnOiAnV2lja2VkIEdyb3VuZHMnLCAnc3Rhcic6ICfimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnU09NQScgfSxcbiAgICAgICAgICAgICAgICB7ICduYW1lJzogJ1N0YXJidWNrcycsICdzdGFyJzogJ+KYhScsICdzZi1sb2NhdGlvbic6ICdVbmlvbiBTcXVhcmUnIH0sXG4gICAgICAgICAgICAgICAgeyAnbmFtZSc6ICdGbHl3aGVlbCBDb2ZmZWUgUm9hc3RlcnMnLCAnc3Rhcic6ICfimIXimIXimIXimIXimIUnLCAnc2YtbG9jYXRpb24nOiAnVXBwZXIgSGFpZ2h0JyB9XG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgbGltaXQgPSBwYXJzZUludChnZXRQYXJhbWV0ZXJCeU5hbWUoJ2xpbWl0JyksIDEwKSB8fCAxMTtcbiAgICAgICAgICAgIHBhZ2UgPSBwYXJzZUludChnZXRQYXJhbWV0ZXJCeU5hbWUoJ3BhZ2UnKSwgMTApIHx8IDE7XG5cbiAgICAgICAgICAgIGlmIChnZXRQYXJhbWV0ZXJCeU5hbWUoJ3NvcnQtYnknKSkge1xuICAgICAgICAgICAgICAgIHNvcnRCeSA9IGdldFBhcmFtZXRlckJ5TmFtZSgnc29ydC1ieScpO1xuICAgICAgICAgICAgICAgIGlmIChnZXRQYXJhbWV0ZXJCeU5hbWUoJ3NvcnQtb3JkZXInKSA9PT0gJ2RzYycpIHtcbiAgICAgICAgICAgICAgICAgICAgc29ydEJ5ID0gJy0nICsgc29ydEJ5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByb3dzLnNvcnQoZHluYW1pY1NvcnQoc29ydEJ5KSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBhZ2luYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgJ2xpbWl0JzogbGltaXQsXG4gICAgICAgICAgICAgICAgJ3BhZ2UnOiBwYWdlLFxuICAgICAgICAgICAgICAgICdwYWdlcyc6IE1hdGguY2VpbChyb3dzLmxlbmd0aCAvIGxpbWl0KSxcbiAgICAgICAgICAgICAgICAnbnVtSXRlbXMnOiByb3dzLmxlbmd0aFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRvUm93ID0gcGFnaW5hdGlvbi5saW1pdCAqIHBhZ2luYXRpb24ucGFnZTtcbiAgICAgICAgICAgIGZyb21Sb3cgPSB0b1JvdyAtIHBhZ2luYXRpb24ubGltaXQ7XG5cbiAgICAgICAgICAgIGlmIChmcm9tUm93ID49IDAgJiYgdG9Sb3cgPj0gMCkge1xuICAgICAgICAgICAgICAgIHJvd1RvU2hvdyA9IHJvd3Muc2xpY2UoZnJvbVJvdywgdG9Sb3cpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByb3dUb1Nob3cgPSByb3dzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpdGVtcyA9IHtcbiAgICAgICAgICAgICAgICAncm93cyc6IHJvd1RvU2hvdyxcbiAgICAgICAgICAgICAgICAncGFnaW5hdGlvbic6IHBhZ2luYXRpb24sXG4gICAgICAgICAgICAgICAgJ3NvcnQtYnknOiBnZXRQYXJhbWV0ZXJCeU5hbWUoJ3NvcnQtYnknKSxcbiAgICAgICAgICAgICAgICAnc29ydC1vcmRlcic6IGdldFBhcmFtZXRlckJ5TmFtZSgnc29ydC1vcmRlcicpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBkeW5hbWljU29ydChwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgIHZhciBzb3J0T3JkZXIgPSAxO1xuICAgICAgICAgICAgICAgIGlmKHByb3BlcnR5WzBdID09PSAnLScpIHtcbiAgICAgICAgICAgICAgICAgICAgc29ydE9yZGVyID0gLTE7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gcHJvcGVydHkuc3Vic3RyKDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEsYikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gKGFbcHJvcGVydHldIDwgYltwcm9wZXJ0eV0pID8gLTEgOiAoYVtwcm9wZXJ0eV0gPiBiW3Byb3BlcnR5XSkgPyAxIDogMDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdCAqIHNvcnRPcmRlcjtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRQYXJhbWV0ZXJCeU5hbWUobmFtZSkge1xuICAgICAgICAgICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtdLywgJ1xcXFxbJykucmVwbGFjZSgvW1xcXV0vLCAnXFxcXF0nKTtcbiAgICAgICAgICAgICAgICB2YXIgcmVnZXggPSBuZXcgUmVnRXhwKCdbXFxcXD8mXScgKyBuYW1lICsgJz0oW14mI10qKScpLFxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzID0gcmVnZXguZXhlYyhkYXRhKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0cyA9PT0gbnVsbCA/ICcnIDogZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMV0ucmVwbGFjZSgvXFwrL2csICcgJykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gWzIwMCwgaXRlbXMsIHt9XTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYnV0dG9ucy5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignQnV0dG9uc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAgICAgJHNjb3BlLnNpbmdsZU1vZGVsID0gMTtcblxuICAgICAgICAkc2NvcGUucmFkaW9Nb2RlbCA9ICdNaWRkbGUnO1xuXG4gICAgICAgICRzY29wZS5jaGVja01vZGVsID0ge1xuICAgICAgICAgICAgbGVmdDogZmFsc2UsXG4gICAgICAgICAgICBtaWRkbGU6IHRydWUsXG4gICAgICAgICAgICByaWdodDogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmJ1dHRvbnMnLCBbXG4gICAgJ3dlYnNpdGUuYnV0dG9ucy5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYnV0dG9ucy5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnd2Vic2l0ZS5idXR0b25zLmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLmJ1dHRvbnMnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2J1dHRvbnMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvYnV0dG9ucy9idXR0b25zLnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQnV0dG9uc0N0cmwgYXMgYnV0dG9uc0N0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmNhcmRzLmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdDYXJkc0N0cmwnLCBmdW5jdGlvbigpIHtcblxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuY2FyZHMnLCBbXG4gICAgJ3dlYnNpdGUuY2FyZHMuc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmNhcmRzLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICd3ZWJzaXRlLmNhcmRzLmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLmNhcmRzJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9jYXJkcycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9jYXJkcy9jYXJkcy50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NhcmRzQ3RybCBhcyBjYXJkc0N0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmNvbG9yLXBpY2tlci1leGFtcGxlLmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdDb2xvclBpY2tlckV4YW1wbGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgICAgICRzY29wZS5tb2RlbFZhbHVlID0gJyNjY2NjY2MnO1xuXG4gICAgICAgICRzY29wZS5wYWxldHRlID0gW1xuICAgICAgICAgICAgJyMwMEFCQzknLFxuICAgICAgICAgICAgJyM5NWRiODknLFxuICAgICAgICAgICAgJyNmZmI4MDAnLFxuICAgICAgICAgICAgJyNkYjYzNmInLFxuICAgICAgICAgICAgJyM1NTYyNzMnLFxuICAgICAgICAgICAgJyMyMzI4MzEnLFxuICAgICAgICAgICAgJyNiMTg2Y2InLFxuICAgICAgICAgICAgJyNmZjg4MDAnLFxuICAgICAgICAgICAgJyMzZTYyYTEnLFxuICAgICAgICAgICAgJyNlODlmYWUnLFxuICAgICAgICAgICAgJyM2RUNDRkMnXG4gICAgICAgIF07XG5cbiAgICAgICAgJHNjb3BlLmlucHV0TW9kZWxWYWx1ZSA9ICcjNkVDQ0ZDJztcbiAgICAgICAgJHNjb3BlLmlucHV0TGFiZWxUZXh0ID0gJ0lucHV0IExhYmVsIFRleHQnO1xuICAgICAgICAkc2NvcGUuaW5wdXRQbGFjZWhvbGRlclRleHQgPSAnSW5wdXQgUGxhY2Vob2xkZXIgVGV4dCc7XG4gICAgICAgICRzY29wZS5pbnB1dFBhbGV0dGUgPSBbXG4gICAgICAgICAgICAnIzZFQ0NGQycsXG4gICAgICAgICAgICAnIzAwQUJDOScsXG4gICAgICAgICAgICAnI0U1RjZGOScsXG4gICAgICAgICAgICAnIzk1REI4OScsXG4gICAgICAgICAgICAnI0ZGQjgwMCdcbiAgICAgICAgXTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmNvbG9yLXBpY2tlci1leGFtcGxlJywgW1xuICAgICd3ZWJzaXRlLmNvbG9yLXBpY2tlci1leGFtcGxlLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5jb2xvci1waWNrZXItZXhhbXBsZS5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnd2Vic2l0ZS5jb2xvci1waWNrZXItZXhhbXBsZS5jb250cm9sbGVyJ1xuXSlcblxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29tcG9uZW50cy5jb2xvci1waWNrZXItZXhhbXBsZScsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvY29sb3ItcGlja2VyJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXIudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDb2xvclBpY2tlckV4YW1wbGVDdHJsIGFzIGNvbG9yUGlja2VyRXhhbXBsZUN0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmNvcHktY2xpcGJvYXJkJywgW1xuICAgICd3ZWJzaXRlLmNvcHktY2xpcGJvYXJkLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5jb3B5LWNsaXBib2FyZC5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbl0pXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLmNvcHktY2xpcGJvYXJkJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9jb3B5LWNsaXBib2FyZCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9jb3B5LWNsaXBib2FyZC9jb3B5LWNsaXBib2FyZC50cGwuaHRtbCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuY3JlZGl0LWNhcmQuY29udHJvbGxlcicsIFtdKVxuXG4gICAgLmNvbnRyb2xsZXIoJ0NyZWRpdENhcmRDdHJsJywgZnVuY3Rpb24gQ3JlZGl0Q2FyZEN0cmwoKSB7XG4gICAgICAgIHZhciBjdHJsID0gdGhpcztcblxuICAgICAgICBjdHJsLmNjRGF0YSA9IHtcbiAgICAgICAgICAgIGNjTnVtYmVyOiAnJyxcbiAgICAgICAgICAgIGNjQ3Z2OiAnJyxcbiAgICAgICAgICAgIGNjTmFtZTogJycsXG4gICAgICAgICAgICBjY0V4cGlyeToge1xuICAgICAgICAgICAgICAgIG1vbnRoOiAnJyxcbiAgICAgICAgICAgICAgICB5ZWFyOiAnJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNjVHlwZTogJycsXG4gICAgICAgIH07XG5cbiAgICAgICAgY3RybC5jY0NvbmZpZyA9IHtcbiAgICAgICAgICAgIGNhcmRDb2RlOiB0cnVlLFxuICAgICAgICAgICAgZnVsbE5hbWU6IHRydWUsXG4gICAgICAgICAgICBzdXBwb3J0ZWRUeXBlczogWydBbWVyaWNhbiBFeHByZXNzJywgJ0RpbmVycyBDbHViJywgJ0Rpc2NvdmVyJywgJ01hc3RlckNhcmQnLCAnVmlzYSddLFxuICAgICAgICB9O1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuY3JlZGl0LWNhcmQnLCBbXG4gICAgJ3dlYnNpdGUuY3JlZGl0LWNhcmQuc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmNyZWRpdC1jYXJkLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICd3ZWJzaXRlLmNyZWRpdC1jYXJkLmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLmNyZWRpdC1jYXJkJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9jcmVkaXQtY2FyZCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9jcmVkaXQtY2FyZC9jcmVkaXQtY2FyZC50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NyZWRpdENhcmRDdHJsIGFzIGNyZWRpdENhcmRDdHJsJ1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5nbG9iYWwtbWVzc2FnZS5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignR2xvYmFsTWVzc2FnZUN0cmwnLCBmdW5jdGlvbigpIHtcblxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuZ2xvYmFsLW1lc3NhZ2UnLCBbXG4gICAgJ3dlYnNpdGUuZ2xvYmFsLW1lc3NhZ2Uuc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmdsb2JhbC1tZXNzYWdlLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICd3ZWJzaXRlLmdsb2JhbC1tZXNzYWdlLmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLmdsb2JhbC1tZXNzYWdlJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9nbG9iYWwtbWVzc2FnZScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9nbG9iYWwtbWVzc2FnZS9nbG9iYWwtbWVzc2FnZS50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0dsb2JhbE1lc3NhZ2VDdHJsIGFzIGdsb2JhbE1lc3NhZ2VDdHJsJ1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5sb2FkaW5nLWluZGljYXRvcnMuY29udHJvbGxlcicsIFtdKVxuICAgIC5jb250cm9sbGVyKCdMb2FkaW5nSW5kaWNhdG9yc0N0cmwnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCAkdGltZW91dCkge1xuXG4gICAgICAgIHZhciBjdHJsID0gdGhpcztcblxuICAgICAgICBjdHJsLmZha2VIdHRwUmVxdWVzdCA9IGZha2VIdHRwUmVxdWVzdDtcbiAgICAgICAgY3RybC5mYWtlU3RhdGVUcmFuc2l0aW9uID0gZmFrZVN0YXRlVHJhbnNpdGlvbjtcbiAgICAgICAgY3RybC50b2dnbGVNYW51YWxMb2FkaW5nID0gdG9nZ2xlTWFudWFsTG9hZGluZztcblxuICAgICAgICBmdW5jdGlvbiBmYWtlSHR0cFJlcXVlc3QoKSB7XG4gICAgICAgICAgICAvLyBIZXJlIHdlIGFyZSBlbWl0dGluZyB0aGUgZXZlbnQgbWFudWFsbHksIGluIGEgcmVhbCBzY2VuYXJpb1xuICAgICAgICAgICAgLy8geW91IHNob3VsZCBpbmplY3QgdGhlIGFqYXhSZXF1ZXN0U3RhdHVzIGh0dHBJbnRlcmNlcHRvciBmcm9tIG5nLWNvbW1vblxuICAgICAgICAgICAgLy8gd2hpY2ggd2lsbCBlbWl0IHRoZXNlIGV2ZW50cyBhdXRvbWF0aWNhbGx5IG9uIG5vcm1hbCAkaHR0cCByZXF1ZXN0c1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdCgnYWpheFJlcXVlc3RSdW5uaW5nJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoJ2FqYXhSZXF1ZXN0UnVubmluZycsIGZhbHNlKTtcbiAgICAgICAgICAgIH0sIDMwMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmFrZVN0YXRlVHJhbnNpdGlvbigpIHtcbiAgICAgICAgICAgIC8vIEhlcmUgd2UgYXJlIGVtaXR0aW5nIHRoZSBldmVudCBtYW51YWxseSwgaW4gYSByZWFsIHNjZW5hcmlvXG4gICAgICAgICAgICAvLyB5b3Ugd291bGRudCBkbyB0aGlzLlxuICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdCgnJHN0YXRlQ2hhbmdlU3RhcnQnLCB0cnVlKTtcblxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdCgnJHN0YXRlQ2hhbmdlU3VjY2VzcycsIGZhbHNlKTtcbiAgICAgICAgICAgIH0sIDMwMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlTWFudWFsTG9hZGluZygpIHtcbiAgICAgICAgICAgIGN0cmwubWFudWFsTG9hZGluZyA9ICFjdHJsLm1hbnVhbExvYWRpbmc7XG4gICAgICAgIH1cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmxvYWRpbmctaW5kaWNhdG9ycycsIFtcbiAgICAnd2Vic2l0ZS5sb2FkaW5nLWluZGljYXRvcnMuc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLmxvYWRpbmctaW5kaWNhdG9ycy5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnd2Vic2l0ZS5sb2FkaW5nLWluZGljYXRvcnMuY29udHJvbGxlcidcbl0pXG5cbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMubG9hZGluZycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvbG9hZGVycycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9sb2FkaW5nLWluZGljYXRvcnMvbG9hZGluZy1pbmRpY2F0b3JzLnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9hZGluZ0luZGljYXRvcnNDdHJsIGFzIGxvYWRpbmdJbmRpY2F0b3JzQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUubW9kYWwtY29udGVudC5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignTW9kYWxDb250ZW50Q3RybCcsIGZ1bmN0aW9uKCRtb2RhbEluc3RhbmNlKSB7XG4gICAgICAgIHZhciBjdHJsID0gdGhpcztcblxuICAgICAgICBjdHJsLm9rID0gb2s7XG4gICAgICAgIGN0cmwuY2FuY2VsID0gY2FuY2VsO1xuXG4gICAgICAgIGZ1bmN0aW9uIG9rKCRldmVudCkge1xuICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCdPSycpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2FuY2VsKCRldmVudCkge1xuICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ0NhbmNlbGVkJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLm1vZGFsLmNvbnRyb2xsZXInLCBbXG4gICAnd2Vic2l0ZS5tb2RhbC1jb250ZW50LmNvbnRyb2xsZXInXG5dKVxuICAgIC5kaXJlY3RpdmUoJ3RhYnNldCcsIGZ1bmN0aW9uKCR0aW1lb3V0KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXF1aXJlOiAndGFic2V0JyxcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgdGFic2V0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdCA9IHRhYnNldC5zZWxlY3Q7XG5cbiAgICAgICAgICAgICAgICB0YWJzZXQuc2VsZWN0ID0gZnVuY3Rpb24odGFiKSB7XG4gICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhYi5pc1JlbmRlcmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29kZW1pcnJvckVsZW1lbnRzID0gZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yQWxsKCcuQ29kZU1pcnJvcicpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBfLmVhY2goY29kZW1pcnJvckVsZW1lbnRzLCBmdW5jdGlvbihjb2RlbWlycm9yRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGVtaXJyb3JFbGVtZW50LkNvZGVNaXJyb3IucmVmcmVzaCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYi5pc1JlbmRlcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGVjdC5hcHBseSh0YWJzZXQsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KVxuXG4gICAgLmNvbnRyb2xsZXIoJ01vZGFsQ3RybCcsIGZ1bmN0aW9uKCRtb2RhbCkge1xuICAgICAgICB2YXIgY3RybCA9IHRoaXM7XG4gICAgICAgIGN0cmwuaGFuZGxlVGFiU2VsZWN0ID0gaGFuZGxlVGFiU2VsZWN0O1xuICAgICAgICBjdHJsLmlzVGFiQWN0aXZlID0gaXNUYWJBY3RpdmU7XG4gICAgICAgIGN0cmwub3BlblVuZm9ybWF0dGVkTW9kYWwgPSBvcGVuVW5mb3JtYXR0ZWRNb2RhbDtcbiAgICAgICAgY3RybC5vcGVuRm9ybWF0dGVkTW9kYWwgPSBvcGVuRm9ybWF0dGVkTW9kYWw7XG4gICAgICAgIGN0cmwub3BlblByb21wdCA9IG9wZW5Qcm9tcHQ7XG4gICAgICAgIGN0cmwub3BlbkZpeGVkTW9kYWwgPSBvcGVuRml4ZWRNb2RhbDtcblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVUYWJTZWxlY3QodGFiKSB7XG4gICAgICAgICAgICBjdHJsLmN1cnJlbnRUYWIgPSB0YWI7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc1RhYkFjdGl2ZSh0YWIpIHtcbiAgICAgICAgICAgIHJldHVybiBjdHJsLmN1cnJlbnRUYWIgPT09IHRhYjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG9wZW5VbmZvcm1hdHRlZE1vZGFsKCRldmVudCkge1xuICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkbW9kYWwub3Blbih7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01vZGFsQ29udGVudEN0cmwgYXMgbW9kYWxDb250ZW50Q3RybCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9tb2RhbC9tb2RhbC11bmZvcm1hdHRlZC50cGwuaHRtbCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb3BlbkZvcm1hdHRlZE1vZGFsKCRldmVudCkge1xuICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkbW9kYWwub3Blbih7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01vZGFsQ29udGVudEN0cmwgYXMgbW9kYWxDb250ZW50Q3RybCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9tb2RhbC9tb2RhbC1mb3JtYXR0ZWQudHBsLmh0bWwnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG9wZW5Qcm9tcHQoJGV2ZW50KSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTW9kYWxDb250ZW50Q3RybCBhcyBtb2RhbENvbnRlbnRDdHJsJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL21vZGFsL3Byb21wdC50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgd2luZG93Q2xhc3M6ICdwcm9tcHQnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG9wZW5GaXhlZE1vZGFsKCRldmVudCkge1xuICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkbW9kYWwub3Blbih7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01vZGFsQ29udGVudEN0cmwgYXMgbW9kYWxDb250ZW50Q3RybCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9tb2RhbC9tb2RhbC1maXhlZC50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgd2luZG93Q2xhc3M6ICdtb2RhbC0tZml4ZWQnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUubW9kYWwnLCBbXG4gICAgJ3dlYnNpdGUubW9kYWwuc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLm1vZGFsLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICd3ZWJzaXRlLm1vZGFsLmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLm1vZGFsJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9tb2RhbCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvd2Vic2l0ZS9qcy9leGFtcGxlcy9tb2RhbC9tb2RhbC50cGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01vZGFsQ3RybCBhcyBtb2RhbEN0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnBhbmVscy5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignUGFuZWxzQ3RybCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5wYW5lbHMnLCBbXG4gICAgJ3dlYnNpdGUucGFuZWxzLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5wYW5lbHMuc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUucGFuZWxzLmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLnBhbmVscycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvcGFuZWxzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL3BhbmVscy9wYW5lbHMudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQYW5lbHNDdHJsIGFzIHBhbmVsc0N0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnByb21wdC1jb250ZW50LmNvbnRyb2xsZXInLCBbXSlcblxuICAgIC5jb250cm9sbGVyKCdQcm9tcHRDb250ZW50Q29udHJvbGxlcicsIGZ1bmN0aW9uKCRwcm9tcHRJbnN0YW5jZSkge1xuICAgICAgICB2YXIgY3RybCA9IHRoaXM7XG5cbiAgICAgICAgY3RybC5vayA9IG9rO1xuICAgICAgICBjdHJsLmNhbmNlbCA9IGNhbmNlbDtcblxuICAgICAgICBmdW5jdGlvbiBvaygkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAkcHJvbXB0SW5zdGFuY2UuY2xvc2UoJ09LJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjYW5jZWwoJGV2ZW50KSB7XG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgJHByb21wdEluc3RhbmNlLmRpc21pc3MoJ0NhbmNlbGVkJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnByb21wdC5jb250cm9sbGVyJywgW1xuICAgJ3dlYnNpdGUucHJvbXB0LWNvbnRlbnQuY29udHJvbGxlcidcbl0pXG4gICAgLmRpcmVjdGl2ZSgndGFic2V0JywgZnVuY3Rpb24oJHRpbWVvdXQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlcXVpcmU6ICd0YWJzZXQnLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCB0YWJzZXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ID0gdGFic2V0LnNlbGVjdDtcblxuICAgICAgICAgICAgICAgIHRhYnNldC5zZWxlY3QgPSBmdW5jdGlvbih0YWIpIHtcbiAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFiLmlzUmVuZGVyZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2RlbWlycm9yRWxlbWVudHMgPSBlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3JBbGwoJy5Db2RlTWlycm9yJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChjb2RlbWlycm9yRWxlbWVudHMsIGZ1bmN0aW9uKGNvZGVtaXJyb3JFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZW1pcnJvckVsZW1lbnQuQ29kZU1pcnJvci5yZWZyZXNoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGFiLmlzUmVuZGVyZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZWN0LmFwcGx5KHRhYnNldCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pXG5cbiAgICAuY29udHJvbGxlcignUHJvbXB0Q3RybCcsIGZ1bmN0aW9uKCRwcm9tcHQpIHtcbiAgICAgICAgdmFyIGN0cmwgPSB0aGlzO1xuICAgICAgICBjdHJsLmhhbmRsZVRhYlNlbGVjdCA9IGhhbmRsZVRhYlNlbGVjdDtcbiAgICAgICAgY3RybC5pc1RhYkFjdGl2ZSA9IGlzVGFiQWN0aXZlO1xuICAgICAgICBjdHJsLm9wZW5Qcm9tcHQgPSBvcGVuUHJvbXB0O1xuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVRhYlNlbGVjdCh0YWIpIHtcbiAgICAgICAgICAgIGN0cmwuY3VycmVudFRhYiA9IHRhYjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzVGFiQWN0aXZlKHRhYikge1xuICAgICAgICAgICAgcmV0dXJuIGN0cmwuY3VycmVudFRhYiA9PT0gdGFiO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb3BlblByb21wdCgkZXZlbnQpIHtcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJHByb21wdC5vcGVuKHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUHJvbXB0Q29udGVudEN0cmwgYXMgcHJvbXB0Q29udGVudEN0cmwnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvcHJvbXB0L3Byb21wdC1tb2RhbC50cGwuaHRtbCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5wcm9tcHQnLCBbXG4gICAgJ3dlYnNpdGUucHJvbXB0LnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS5wcm9tcHQuc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUucHJvbXB0LmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLnByb21wdCcsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvcHJvbXB0JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL3Byb21wdC9wcm9tcHQudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9tcHRDdHJsIGFzIHByb21wdEN0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnRhYmxlcy5jb250cm9sbGVyJywgW10pXG5cbiAgICAuY29udHJvbGxlcignVGFibGVzQ3RybCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS50YWJsZXMnLCBbXG4gICAgJ3dlYnNpdGUudGFibGVzLnN0YXRlJ1xuXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2Vic2l0ZS50YWJsZXMuc3RhdGUnLCBbXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ3dlYnNpdGUudGFibGVzLmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLnRhYmxlcycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvdGFibGVzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL3RhYmxlcy90YWJsZXMudHBsLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdUYWJsZXNDdHJsIGFzIHRhYmxlc0N0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnRhYnMuY29udHJvbGxlcicsIFtdKVxuXG4gICAgLmNvbnRyb2xsZXIoJ1RhYnNDdHJsJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjdHJsID0gdGhpcztcblxuICAgICAgICBjdHJsLnRhYnMgPSBbXG4gICAgICAgICAgICB7IHRpdGxlOidEeW5hbWljIFRpdGxlIDEnLCBjb250ZW50OidEeW5hbWljIGNvbnRlbnQgMScgfSxcbiAgICAgICAgICAgIHsgdGl0bGU6J0R5bmFtaWMgVGl0bGUgMicsIGNvbnRlbnQ6J0R5bmFtaWMgY29udGVudCAyJyB9XG4gICAgICAgIF07XG5cbiAgICAgICAgY3RybC50YWJDbGlja2VkID0gZnVuY3Rpb24gdGFiQ2xpY2tlZCgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0YWIgY2xpY2tlZCEnKTtcbiAgICAgICAgfTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnRhYnMnLCBbXG4gICAgJ3dlYnNpdGUudGFicy5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUudGFicy5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJyxcbiAgICAnd2Vic2l0ZS50YWJzLmNvbnRyb2xsZXInXG5dKVxuXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdjb21wb25lbnRzLnRhYnMnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL3RhYnMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3dlYnNpdGUvanMvZXhhbXBsZXMvdGFicy90YWJzLnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVGFic0N0cmwgYXMgdGFic0N0cmwnXG4gICAgICAgICAgICB9KTtcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLnRvb2x0aXAnLCBbXG4gICAgJ3dlYnNpdGUudG9vbHRpcC5zdGF0ZSdcbl0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUudG9vbHRpcC5zdGF0ZScsIFtcbiAgICAndWkucm91dGVyJ1xuXSlcblxuICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29tcG9uZW50cy50b29sdGlwJywge1xuICAgICAgICAgICAgICAgIHVybDogJy90b29sdGlwJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL3Rvb2x0aXAvdG9vbHRpcC50cGwuaHRtbCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUud2FybmluZy1idXR0b24nLCBbXG4gICAgJ3dlYnNpdGUud2FybmluZy1idXR0b24uc3RhdGUnXG5dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3ZWJzaXRlLndhcm5pbmctYnV0dG9uLnN0YXRlJywgW1xuICAgICd1aS5yb3V0ZXInLFxuICAgICd3ZWJzaXRlLm1vZGFsLmNvbnRyb2xsZXInLFxuXSlcbiAgICAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbXBvbmVudHMud2FybmluZy1idXR0b24nLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL3dhcm5pbmctYnV0dG9uJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy93ZWJzaXRlL2pzL2V4YW1wbGVzL3dhcm5pbmctYnV0dG9uL3dhcm5pbmctYnV0dG9uLnRwbC5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTW9kYWxDdHJsIGFzIG1vZGFsQ3RybCdcbiAgICAgICAgICAgIH0pO1xuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dlYnNpdGUuYmMtc2VydmVyLXRhYmxlLnNhbXBsZS1kYXRhLnNlcnZpY2UnLCBbXSlcbiAgICAuZmFjdG9yeSgnc2FtcGxlRGF0YScsIGZ1bmN0aW9uIHNhbXBsZURhdGEoJGh0dHApIHtcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XG4gICAgICAgICAgICBnZXRTYW1wbGVEYXRhOiBnZXRTYW1wbGVEYXRhXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0U2FtcGxlRGF0YShxdWVyeVBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL3RhYmxlLmpzb24nLCB7XG4gICAgICAgICAgICAgICAgcGFyYW1zOiBxdWVyeVBhcmFtc1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiBnZXRTYW1wbGVEYXRhU3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93czogcmVzcG9uc2UuZGF0YS5yb3dzLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IHJlc3BvbnNlLmRhdGEucGFnaW5hdGlvbi5wYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0OiByZXNwb25zZS5kYXRhLnBhZ2luYXRpb24ubGltaXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IHJlc3BvbnNlLmRhdGEucGFnaW5hdGlvbi5udW1JdGVtc1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XG4gICAgfSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=