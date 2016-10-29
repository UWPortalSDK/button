angular.module('portalApp')
.controller('buttonCtrl', ['$scope', '$interval', '$http', '$animate', '$timeout', function ($scope, $interval, $http, $animate, $timeout) {
	
    //Date d = new Date();
    //d.setMilliseconds(d.getMilliseconds() + (1000 * 60 * 60));
    //$scope.finishTime = new Date();
   
	
    var formatTime = function(time) {
        var secondsLeft = Math.ceil((time.getTime() - (new Date().getTime())) / 1000);
        var min = Math.floor(secondsLeft / 60);
        secondsLeft -= min * 60;
        var sec = secondsLeft;
       
        min = ('0' + min).slice(-2);
        sec = ('0' + sec).slice(-2);
        
        return min + ":" + sec;
    }
    
    var getColor = function(time) {
        var secondsLeft = Math.ceil((time.getSeconds - new Date().getSeconds()));
        if (secondsLeft >= 50 * 60) {
            return 'black';
        } else if (secondsLeft >= 30 * 60) {
        	return 'blue';    
        } else if (secondsLeft >= 20 * 60) {
            return 'yellow';
        } else {
       		return 'red';
        }
    }
    
    var refresh = function() {
        //alert($scope.timeString);
        $scope.timeString = formatTime($scope.finishTime);
        $scope.color = getColor($scope.finishTime);
    }
   
	// Show main view in the first column as soon as controller loads
	$scope.portalHelpers.showView('buttonMain.html', 1);
    
    $scope.onClick = function() {
        $http.get('/Develop/GetProxy?url=http://owl.dog:8000/reset')
        	.success(function(response){
            	var d = new Date(response.finishTime);
            	if (d.getTime() !== $scope.finishTime.getTime()) {
               		$scope.finishTime = d;
            		refresh();
                }
            });
    }
    
    var getFinishTime = function() {
    	$http.get('/Develop/GetProxy?url=http://owl.dog:8000/button')
			.success(function(response){
            	var d = new Date(response.finishTime);
            	if (!$scope.finishTime || d.getTime() !== $scope.finishTime.getTime()) {
                    if ($scope.finishTime) {
                        $scope.click = true;
                    	$timeout(function () { $scope.click = false ;}, 100);
                    }
               		$scope.finishTime = d;
            		refresh();
                }
            });
    }
    
    getFinishTime();
    
    $interval(refresh, 1000);
    $interval(getFinishTime, 1000);
}]);