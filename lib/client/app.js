import angular, { isArray, isObject } from 'angular';
import 'angular-resizable';
import 'angular-ui-router';
import 'json-schema-view';
import './less/index.less';

angular.module('app', ['ui.router', 'angularResizable', 'mohsen1.json-schema-view'])
.config(/* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/');

  var sidebar = {
    template: require('./templates/sidebar.html'),
    resolve: {
      /* @ngInject */
      schemas($http) {
        return $http.get('/schemas').then(response => response.data);
      }
    },
    /* @ngInject */
    controller($scope, schemas) {
      $scope.schemas = schemas;
    }
  };

  $stateProvider
    .state('home', {
      url: '/',
      views: {
        sidebar: sidebar,
        content: { template: require('./templates/empty.html') }
      },
    })
    .state('home.schema', {
      url: 'schemas/*schema',
      views: {
        'content@': {
          template: require('./templates/schema.html'),
          resolve: {
            /* @ngInject */
            schema($http, $stateParams) {
              return $http.get(`/schemas/${unescape($stateParams.schema)}`).then(response => response.data);
            }
          },
          /* @ngInject */
          controller($scope, $stateParams, schema) {
            $scope.schemaUrl = unescape($stateParams.schema);
            $scope.schema = schema;

            $scope.getType = (value) => isArray(value) ? 'array' : (isObject(value) ? 'object' : 'other');
          }
        }
      }
    })
})
.directive('schemaView', /* @ngInject */ ($templateCache) => {
  $templateCache.put('schemaViewTemplate', require('./templates/schema-view-tree.html'));

  return {
    controllerAs: 'schemaView',
    bindToController: {
      schema: '=schema'
    },
    scope: true,
    template: require('./templates/schema-view.html'),
    /* @ngInject */
    controller() {
      this.template = 'schemaViewTemplate';
      this.keys = Object.keys;
      this.isIterator = (value) => isObject(value) || isArray(value);
    }
  };
});
