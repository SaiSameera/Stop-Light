var appCityRoads = angular.module('cityRoads', []).run(function() {});

appCityRoads.controller('MainController', ["$scope", "$interval", "$timeout", "stopLightService",
                                    function ($scope, $interval, $timeout, stopLightService) {

  $scope.activeTrafficDirection = stopLightService.getDirection();
  $scope.northSouthGo = true;
  $scope.eastWestGo = false;

  // Toggles the visual stop lights.
  $scope.toggleStopLights = function() {
    if ($scope.interval) {
      alert("Stop interval traffic first");
    } else {
      $scope.toggleTrafficDirection();
      $scope.toggleLights();
    }
  }

  // Toggles the flow of traffic and sets the current active traffic direction using the service.
    $scope.toggleTrafficDirection = function() {
    stopLightService.toggleTrafficDirection($scope.activeTrafficDirection);
    $scope.activeTrafficDirection = stopLightService.getDirection();
  }

  // Toggles which lights will turn green or red.
  $scope.toggleLights = function() {
    if ($scope.activeTrafficDirection == "NS") {
      $scope.northSouthGo = true;
    } else {
      $scope.northSouthGo = false;
    }

    $scope.eastWestGo = !$scope.northSouthGo;
  }

  // Starts the interval traffic process.
  $scope.startIntervalTraffic = function() {
    $scope.interval = $interval(function() {
      // Switch the flow of traffic
      $scope.toggleTrafficDirection();

      // Onward traffic flow about to go and the opposite getting ready to stop.
      $timeout(function() {
        if ($scope.activeTrafficDirection == "NS") {
          $scope.eastWestReadyToStop = true;
        } else {
          $scope.northSouthReadyToStop = true;
        }

        // Onward traffic went and the opposite stopped.
        $timeout(function() {
          $scope.toggleLights();
          $scope.northSouthReadyToStop = false;
          $scope.eastWestReadyToStop = false;
        }, 2000);
      }, 1000);
    }, 5000);
  }

  // Stops the interval traffice process.
  $scope.stopIntervalTraffic = function() {
    $interval.cancel($scope.interval);
    $scope.interval = false;
  }
}]);

appCityRoads.service('stopLightService', function() {
  // Initial direction is NS
  // NS = North/South
  // EW = East/West
  var trafficDirection = "NS";

  // Togles the traffic direction
  var toggleTrafficDirection = function() {
    if (trafficDirection === "NS") {
      trafficDirection = "EW";
    } else {
      trafficDirection = "NS";
    }
  }

  // Returns the current direction of traffic.
  var getDirection = function() {
    return trafficDirection;
  }

  return {
    toggleTrafficDirection: toggleTrafficDirection,
    getDirection: getDirection
  }
});

appCityRoads.directive('stopLightDirective', function() {
  return {
    templateUrl: function(element, attribute) {
      return 'templates/stoplight-' + attribute.direction + '.html';
    }
  }
});

appCityRoads.directive('stopLightSwitchDirective', function() {
  return {
    template: function(element, attribute) {
      var button = angular.fromJson(attribute.buttonInfo);
      return '<button class="btn btn-primary" ng-click="' + button.type + '();">' + button.name + '</button>'
    }
  }
});