angular.module('backend', ['ngResource']).
    factory('User', function($resource) {
      var User = $resource('/api/user');
      return User;
    });

angular.module('Freader', ['backend'])
	.config(function ($routeProvider) {
		$routeProvider.
			when("/", {controller: epaperCtrl, template: document.getElementById('epaper').text}).
			
			otherwise({redirectTo:'/'});
	});

function epaperCtrl($scope,$resource,$location)
{
    $scope.text="sndkjnsfdfjs";
    var list_editions=["blr","chn"];
    var list_dates=["30092014","29092014"];
    $scope.editions=list_editions;
    $scope.myedition=$scope.editions[0];
    $scope.dates=list_dates
    $scope.mydate=$scope.dates[0];
    $scope.intialize=function(){
        $scope.text="connected1";
    }
    $scope.load_page=function(){
        alert("laoding the required page"+"\nedition : "+$scope.myedition+"\ndate: "+$scope.mydate);
      

    }
    $scope.edition_change=function(){
        alert("edition changed");
        alert($scope.myedition);
        //load dates
        /*
        list_dates=//oad date;
        $scope.dates=list_dates;
        $scope.mydate=$scope.dates[0];
        */
    }
    $scope.date_change=function(){
        alert("date changed");
        alert("new date:"+$scope.mydate);
    }
}

function loginCtrl($scope, $resource, $location) {
	if (connected)
		return $location.path("/feeds");

	var action = "login";
	var loginText = {
		action: "Login",
		changeAction: "No account ? Register here"
	};
	var registerText = {
		action: "Register",
		changeAction: "Already have an account ? Login here"
	};

	$scope.text = (action == "login") ? loginText : registerText;

	$scope.changeAction = function() {
		action = (action == "login") ? "register" : "login";
		$scope.text = (action == "login") ? loginText : registerText;
	};

	$scope.action = function() {
		delete $scope.errorMsg;
		var infos = {
			email: $scope.email,
			password: $scope.password
		}
		if (action == "login")
			$resource('/api/today').get(infos, actionSuccess, actionFail);
		else
			$resource('/api/user').save(infos, actionSuccess, actionFail);
	}

	actionSuccess = function() {
		connected = true;
		$location.path("/feeds");
	}
	actionFail = function (response) {
		if (action == "login" && response.status == 401)
			$scope.errorMsg = "Wrong email or password";
		else if (action == "register" && response.status == 409)
			$scope.errorMsg = "Email already registered";
		else
			$scope.errorMsg = "Can't connect to server";
		console.log('Fail !');
	}
}
/*
function feedsCtrl($scope, $resource, $location) {
	if (!connected)
		return $location.path("/");


	$scope.disconnect = function() {
		$resource('/api/login').delete({}, function () {
			connected = false;
			$location.path("/");
		});
	}

	$scope.feeds = $resource('/api/feeds').query();

	$scope.addFeed = function() {
		$scope.addFeedLoading = true;
		var newFeed = $resource('/api/feed').save({url: $scope.newFeedUrl}, function () {
			console.log("Feed added !");
			delete $scope.addErrorText;
			$scope.feeds.push(newFeed);
			$scope.showNewFeed = false;
			$scope.newFeedUrl = "";
			$scope.addFeedLoading = false;
		}, function (response) {
			if (response.status == 400)
				$scope.addErrorText = response.data;
			else
				$scope.addErrorText = "Cannot connect to server";
			$scope.addFeedLoading = false;
		});
		return true;
	}

	$scope.deleteFeed = function(feed) {
		$resource('/api/feed/' + feed._id).delete({}, function() {
			var indexof = $scope.feeds.indexOf(feed);
			$scope.feeds.splice(indexof, 1);
		});
	}

}*/
