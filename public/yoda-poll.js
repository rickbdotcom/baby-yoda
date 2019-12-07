var app = angular.module('YodaPoll', []);

app.controller('YodaPollController', function($scope) {
	try {
		let app = firebase.app();
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				firebase.database().ref('/images').once('value').then(function(snapshot) {
					var images = [];
					snapshot.forEach(function(child) {
						images.push({ id: child.key, url: "/poll-images/" + child.val() });
					});
					$scope.matchups = shuffle(generateMatchups(images));
					$scope.nextMatchup();					
					$scope.$apply();
				});
			}
		});
		firebase.auth().signInAnonymously();
	} catch (e) {
		console.error(e);
	}
	
	$scope.matchupIndex = -1;
	
	$scope.selected = function(image) {
		$scope.recordResult(image);
		$scope.nextMatchup();
	}
	
	$scope.recordResult = function(image) {
		let matchup = $scope.currentMatchup();
		let resultPath = "poll-results/" + firebase.auth().currentUser.uid + "/" + matchup[0].id + "-" + matchup[1].id;
		firebase.database().ref(resultPath).set(image.id);
	}
	
	$scope.currentMatchup = function() {
		return $scope.matchups[$scope.matchupIndex];
	}
	
	$scope.nextMatchup = function() {
		$scope.matchupIndex++;

		if ($scope.matchupIndex < $scope.matchups.length) {
			let matchup = $scope.currentMatchup();
			$scope.image1 = matchup[0];
			$scope.image2 = matchup[1];
		} else {
			alert('all done!');
		}
	}
});

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function generateMatchups(images) {
	var matchups = [];
	for (i = 0; i < images.length; i++) {
		for(j = i + 1; j < images.length; j++) {
			matchups.push([images[i], images[j]]);
		}
	}
	return matchups;
} 