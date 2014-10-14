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
    var list_editions;
    var list_dates=["30092014","29092014"];
    var edition_json;
    var date_json;
    $scope.dates=list_dates;
    $scope.mydate=$scope.dates[0];
    $scope.pages;// contains all pages of a section
    $scope.path_name;//the path name for finding files
    $scope.page_image;
    $scope.current_page;
    var getKeys = function(obj){
        alert('funciton');
        var keys = [];
        for(var key in obj){
           alert(key);
        }
        return keys;
    }
    $scope.text="connecting";

    //load dates for corresponding edition
    function get_dates()
    {
        var load_dates_resource = $resource('/api/edition_dates');
        load_dates_resource.query({edition: $scope.myedition}, function (data) {
            // success handler
            edition_json=data;
            list_dates = [];
            for (var x in data) {
                list_dates.push(data[x]['date']);
            }
            $scope.dates = list_dates;
            $scope.mydate = $scope.dates[0];


        }, function (error) {
            alert("Error ");
            alert(error);
            // error handler
        });
    }

    //list all editions from the edition.json
    function load_edition()
    {
        var get_edition_resource = $resource('/api/get_edition');
        get_edition_resource.query(function(data) {
            // success handler
            list_editions=[];
            for(var x in data)
            {
                for (var y in data[x]['edition'])
                    list_editions.push(data[x]['edition'][y]);
            }
            $scope.editions=list_editions;
            $scope.myedition=$scope.editions[0];
            get_dates();
        }, function(error) {
            alert("Error ");
            alert(error);
            // error handler
        });

    }

    //get json file contents for a particular date
    function get_date_json()
    {
        var date_json_file_name;
        var date_json_path;
        for(var k=0;k<edition_json.length;k++)
        {
            if(edition_json[k]['date']==$scope.mydate)
            {
                date_json_file_name=edition_json[k]['file_name'];
                date_json_path=edition_json[k]['path'];
                break;
            }
        }
        //alert(date_json_file_name+" "+date_json_path);
        var get_date_json_resource = $resource('/api/date_json');
        //{'date':$scope.mydate,'file_name':date_json_file_name,'path_name':date_json_path}
        get_date_json_resource.query({'date':$scope.mydate,'file_name':date_json_file_name,'path_name':date_json_path},
            function(data) {
            // success handler
                //alert("success");
                date_json=data;
                load_sections();
                load_first_page();
                $scope.download_text="Download PDF ";

            }, function(error) {
            // error handler
            alert("Error ");
            alert(error);

        });
    }

    function load_sections()
    {
        $scope.sections;
        $scope.mysection;
        //load the sections for a particular date
        //alert("load_sections");
        $scope.sections=[];

        //alert(date_json["date"]);
        for(var k=0;k<date_json.length;k++)
        {
            //alert(date_json[k]["section_name"]);
            $scope.sections.push(date_json[k]["section_name"]);
        }
        if($scope.sections.length==0)
        {
            alert("error");
        }
        else{
            $scope.mysection=$scope.sections[0];
            $scope.section_text="Sections :";
            //load the sections in the left main tab
            load_thumbnails($scope.mysection);
        }
    }



    function load_thumbnails(section)
    {
        //alert("load_thumbnails");
        //alert(date_json.length);
        for(var k=0;k<date_json.length;k++)
        {
            if(date_json[k]["section_name"]==section)
            {
                $scope.path_name=date_json[k]["path"];
                //alert("section matched");
                $scope.pages=date_json[k]["pages"];

            }
        }

        //search the sections in date_json
        //get list_of pages & load thumbnails . Also load the first page

    }

    $scope.initialize=function(){
        $scope.text="connected1";
        load_edition();
    }

    $scope.load_orignal_page=function(a)
    {
        //loads the page content from given thumbnail
        //alert("load page");
        //alert(a);
        $scope.current_page=a;
        $scope.page_image=$scope.path_name+a.image;
    }

    $scope.load_page=function(){
        /*
        Action for GO () button
         */

        //alert("laoding the required page"+"\nedition : "+$scope.myedition+"\ndate: "+$scope.mydate+"\n "+date_json_file_name+" "+ date_json_path);
        get_date_json();
        //alert("loading json for reqested date");
    }

    $scope.section_change=function(){
        alert("section_chang");
        alert($scope.mysection);
        load_thumbnails($scope.mysection);

    }

    function load_first_page(section)
    {
        //$scope.current_page=$scope.pages[0];
        $scope.load_orignal_page($scope.pages[0])
    }

    function search_for_page_no(page_no)
    {
        //alert("search for page");
        //alert($scope.pages.length);
        var flag=false;
        //alert(page_no);
        for(var k=0;k<$scope.pages.length;k++)
        {
            if($scope.pages[k]['page_no']==page_no)
            {
                /*
                Page no found ! load the page
                 */
                $scope.current_page=$scope.pages[k];
                $scope.page_image=$scope.path_name+$scope.current_page['image'];
                flag=true;
                return;
               // alert($scope.path_name+$scope.current_page['image']);
            }
        }
        if(!flag)
        {
            if(page_no==0)
                alert("You are viewing the first page!")
            else
                alert("You are viewing the last page!")
        }
    }

    $scope.next_page=function()
    {
        /*
        funciton handling next button clicks
         */
        var current_page=$scope.current_page.page_no;
        //alert(current_page);
        current_page++;
        search_for_page_no(current_page);
    }

    $scope.prev_page=function()
    {
        /*
         funciton handling previos page button clicks
         */
        var current_page=$scope.current_page.page_no;
        current_page--;
        search_for_page_no(current_page);
    }
    $scope.load_article=function(article)
    {

        var image_file=$scope.path_name+article["jpeg"];
        var pdf_file=$scope.path_name+article["pdf"];
        var myWindow = window.open('','', 'width=500,height=500,scrollbars=1');
        var html='<script src="jquery-1.6.2.min.js"></script><table width="100%" height="10%" border="0"><tr width="100%" height="100%"><td width="33%"><button width="200px" onclick="load('+"'text'"+')" >text</button></td><td width="33%"><button onclick="load('+"'img'"+')" width="100%" >image</button></td><td width="33%"><button onclick="load('+"'pdf'"+')" width="100%" >pdf</button></td></tr></table><div id="article_container" width="100%" height="90%"></div>';
        myWindow.document.write(html);
        var script='<script type="text/javascript">';
        script+='function load(a){$("#article_container").empty();';
        script+='if(a=="text"){$("#article_container").append("'+article["article_txt"]+'")}';
        script+='else if(a=="img"){$("#article_container").append('+"'"+'<img src="'+image_file+'" width="400px">'+"'"+');}';
        script+='else{$("#article_container").append('+"'"+'<embed src="'+pdf_file+'" width="100%" height="100%">'+"'"+');}';
        script+="}load('img')</script>";
        myWindow.document.write(script);

        //myWindow.document.write('<div id="download_pdf" width="100%" height="30px"><a href= "'+pdf_file+'" >Download as PDF</a></div>');
        //myWindow.document.write("<p><img src="+image_file+" width='400' /></p>");
        //myWindow.document.write('<embed src="'+pdf_file+'" width="100%" height="100%">');
        myWindow.document.close();
        myWindow.focus();
        //myWindow.close();

    }

    $scope.edition_change=function(){
        //load dates
        get_dates();

    }
    $scope.date_change=function(){
        //alert("date changed");
        //alert("new date:"+$scope.mydate);
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
