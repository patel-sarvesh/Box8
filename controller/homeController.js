angular.module('portal')

	.controller('homeCtrl', function ($scope, getService, toastr) {

		$scope.uniqueCategoryList = [];
		$scope.uniqueArtistList = [];
		$scope.filterSongList = [];
		var tempDate, tempPrice;

		// get function
		(function getSongsList() {
			$scope.filterSongList.length=0;
			$scope.filterItemListShow = false;
			$('.group').removeClass('display-none')
			getService.getResult().then(function successCallback(res) {
				$('.group').addClass('display-none')
				$scope.topSongsList = res.data.feed.entry;
				$scope.uniqueCategoryList.length = 0;
				$scope.uniqueArtistList.length = 0;
				// console.log($scope.topSongsList);
				getUniqueData();
			}, function errorCallback(err) {
				$('.group').addClass('display-none')
				toastr.error('Please Try Again Later');
			})
		})();

		// filter for dropdown
		function getUniqueData() {
			$scope.uniqueCategoryList = _.uniqBy($scope.topSongsList, 'category.attributes.label');
			$scope.uniqueArtistList = _.uniqBy($scope.topSongsList, "['im:artist'].label");
		}


		$scope.dateFilter = function (selectedDate) {
			if(tempPrice != undefined && tempDate != undefined) {
				toastr.warning('Please Clear The Filter Fisrt!');
			}
			else {
				tempDate = selectedDate;
				if (selectedDate < 31) {
					var todayDate = new Date();
					var givenDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - selectedDate);
					var dd = givenDate.getDate();
					dd = (dd < 10) ? '0' + dd : dd;
					var mm = givenDate.getMonth() + 1;
					mm = (mm < 10) ? '0' + mm : mm;
					var yy = givenDate.getFullYear();
					var finalDate = yy + '-' + mm + '-' + dd;
					$scope.filterSongList = getFilterItemDateWise1(finalDate);
					$('#dateText').text('Date Less Than : ' + finalDate + ' , ');
				} else {
					var startDate = selectedDate + '-12-31';
					var endDate = selectedDate + '-01-01';
					$scope.filterSongList = getFilterItemDateWise(startDate, endDate);
					$('#dateText').text('Year : ' + selectedDate + ' , ');
				}
			}
			
		}


		$scope.removeFilters = function () {
			$('#dateText').text('');
			$('#priceText').text('');
			tempDate = null;
			tempPrice = null;
			$scope.filterSongList.length=0;
			$scope.filterItemListShow = false;
		}


		function getFilterItemDateWise1(inputDate) {
			if($scope.filterSongList.length > 0 && tempPrice) {
				var tempArray = [];
				for (var i = 0; i < $scope.filterSongList.length; i++) {
					var dateArray = $scope.filterSongList[i]['im:releaseDate'].label.split('T');
					var releaseDate = dateArray[0];
					if (releaseDate >= inputDate) {
						tempArray.push($scope.filterSongList[i]);
					}
				}
				$scope.filterItemListShow = true;
				if (tempArray.length == 0) {
					toastr.error('Sorry No Data Found');
					return $scope.filterSongList;
				} else {
					return tempArray;
				}
			}else {
				var tempArray = [];
				for (var i = 0; i < $scope.topSongsList.length; i++) {
					var dateArray = $scope.topSongsList[i]['im:releaseDate'].label.split('T');
					var releaseDate = dateArray[0];
					if (releaseDate >= inputDate) {
						tempArray.push($scope.topSongsList[i]);
					}
				}
				$scope.filterItemListShow = true;
				if (tempArray.length == 0) {
					toastr.error('Sorry No Data Found');
					return $scope.topSongsList;
				} else {
					return tempArray;
				}
			}

		}

		function getFilterItemDateWise(sd, ed) {
			if($scope.filterSongList.length > 0 && tempPrice) {
				var tempArray = [];
				for (var i = 0; i < $scope.filterSongList.length; i++) {
					var dateArray = $scope.filterSongList[i]['im:releaseDate'].label.split('T');
					var releaseDate = dateArray[0];
					if (releaseDate >= ed && releaseDate <= sd) {
						tempArray.push($scope.filterSongList[i]);
					}
				}
				$scope.filterItemListShow = true;
				if (tempArray.length == 0) {
					toastr.error('Sorry No Data Found');
					return $scope.filterSongList;
				} else {
					return tempArray;
				}
			} else {
				var tempArray = [];
				for (var i = 0; i < $scope.topSongsList.length; i++) {
					var dateArray = $scope.topSongsList[i]['im:releaseDate'].label.split('T');
					var releaseDate = dateArray[0];
					if (releaseDate >= ed && releaseDate <= sd) {
						tempArray.push($scope.topSongsList[i]);
					}
				}
				$scope.filterItemListShow = true;
				if (tempArray.length == 0) {
					toastr.error('Sorry No Data Found');
					return $scope.topSongsList;
				} else {
					return tempArray;
				}
			}

		}
		
		$scope.priceFilter = function(givenPrice) {
			var tempArray = [];
			if(tempPrice && tempDate) {
				toastr.warning('Please Clear The Filter Fisrt!');
			}
			else if($scope.filterSongList.length > 0 && tempDate) {
				tempPrice = givenPrice;
				for(var p=0; p<$scope.filterSongList.length; p++) {
					if(givenPrice > $scope.filterSongList[p]['im:price'].attributes.amount){
							tempArray.push($scope.filterSongList[p]);
					}
				}
				$('#priceText').text('Price Less Than : ' + givenPrice);
				if (tempArray.length == 0) {
					toastr.error('Sorry No Data Found');		
				} else {
					
					$scope.filterItemListShow = true;
					$scope.filterSongList = tempArray;
				}
			} else {
				tempPrice = givenPrice;
				for(var p=0; p<$scope.topSongsList.length; p++) {
					if(givenPrice > $scope.topSongsList[p]['im:price'].attributes.amount){
							tempArray.push($scope.topSongsList[p]);
					}
				}
				$scope.filterSongList = tempArray;
				// console.log($scope.filterSongList);
				$('#priceText').text('Price Less Than : ' + givenPrice);
				if ($scope.filterSongList.length == 0) {
					toastr.error('Sorry No Data Found');
					$scope.filterItemListShow = false;
				} else {
					$scope.filterItemListShow = true;
				}
			}
			
		}

	})