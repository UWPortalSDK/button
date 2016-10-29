angular.module('portalApp')
    .controller('buttonCtrl', ['$scope', '$interval', '$http', '$animate', '$timeout', function($scope, $interval, $http, $animate, $timeout) {
		$scope.canClick = true;
        //Date d = new Date();
        //d.setMilliseconds(d.getMilliseconds() + (1000 * 60 * 60));
        //$scope.finishTime = new Date();


        var formatTime = function(time) {
            var delta = (time.getTime() - (new Date().getTime()));
            var secondsLeft = delta / 1000.0;
            secondsLeft = Math.round(secondsLeft);
            var min = Math.floor(secondsLeft / 60.0);
            secondsLeft = Math.round(secondsLeft - (min * 60.0));
            var sec = secondsLeft;

            if ((min == 0 && sec <= 0) || (min < 0)) {
                $scope.isExpired = true;
            }

            min = ('0' + min).slice(-2);
            sec = ('0' + sec).slice(-2);

            return min + ":" + sec;
        }

        var getColor = function(time) {
            var secondsLeft = Math.ceil((time.getTime() - (new Date().getTime())) / 1000);
            if (secondsLeft >= 40) {
                return 'white';
            } else if (secondsLeft >= 20) {
                return 'yellow';
            } else {
                return 'red';
            }
        }

        var refresh = function() {
            $scope.timeString = formatTime($scope.finishTime);
            $scope.color = getColor($scope.finishTime);

            if ($scope.isExpired) {
                window.location = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
            }
        }

        // Show main view in the first column as soon as controller loads
        $scope.portalHelpers.showView('buttonMain.html', 1);

        $scope.onClick = function() {
            $scope.portalHelpers.invokeServerFunction("submitClick")
                .then(function(data) {
                    var finishTime = new Date(data.finishTime);
                    if (finishTime.getTime() !== $scope.finishTime.getTime()) {
                        $scope.finishTime = finishTime;
                        refresh();
                    }
                });
        }

        var getFinishTime = function() {
            $scope.portalHelpers.invokeServerFunction("getFinishTime")
                .then(function(data) {
                    var finishTime = new Date(data.finishTime);

                    $scope.secondsClicked = data.secondsClicked;
                    $scope.canClick = data.canClick;

                    if (!$scope.finishTime || finishTime.getTime() !== $scope.finishTime.getTime()) {
                        if ($scope.finishTime) {
                            $scope.click = true;
                            $timeout(function() {
                                $scope.click = false;
                            }, 100);
                        }
                        $scope.finishTime = finishTime;
                        refresh();
                    }
                });
        }

        getFinishTime();

        $interval(refresh, 500);
        $interval(getFinishTime, 500);
    }]);