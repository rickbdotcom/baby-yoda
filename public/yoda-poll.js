var app = angular.module('YodaPoll', []);

app.controller('YodaPollController', function($scope) {
	try {
		let app = firebase.app();
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				firebase.database().ref('/images').once('value').then(function(snapshot) {
					var images = [];
					snapshot.forEach(function(child) {
						images.push({id: child.key, url: "/poll-images/" + child.val() });
					});
					
					$scope.images = images;
					$scope.shuffleImages();					
					$scope.$apply();
				});
			}
		});
		firebase.auth().signInAnonymously();
	} catch (e) {
		console.error(e);
	}
	
	$scope.selected = function(image) {
		$scope.shuffleImages();
	}
	
	$scope.shuffleImages = function() {
		let shuffledImages = shuffle($scope.images);
		$scope.image1 = shuffledImages[0];
		$scope.image2 = shuffledImages[1];
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