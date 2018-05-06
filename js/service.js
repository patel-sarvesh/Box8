angular.module('portal')

.factory ('getService', ['$http', function($http) {

	return {
		getResult: function() {
			return $http.get('https://itunes.apple.com/in/rss/topalbums/limit=100/json');
		}
	};

}])