app.config(function ($stateProvider) {

    $stateProvider.state('home', {
        url: '/home',
        controller: 'homeController',
        templateUrl: 'js/application/states/home/home.html',
        resolve: {
            toggleState: function (BackgroundFactory) {
              return BackgroundFactory.getBackgroundPage().encryptionState.getState()
            },

            selectedCircle: function (BackgroundFactory) {
              return BackgroundFactory.getSelectedCircle();
            }
        }
    });
});

app.controller('homeController', function ($scope, BackgroundFactory, $log, toggleState, selectedCircle) {

	var encryptionOffMessage, encryptionOnMessage, backgroundPage;

  backgroundPage = BackgroundFactory.getBackgroundPage();
  $scope.encryptionState = toggleState;
  encryptionOffMessage = 'Encryption is now OFF';
  encryptionOnMessage = 'Encryption is now ON';

  if (toggleState) {
    $scope.stateMsg = encryptionOnMessage;
  } else {
    $scope.stateMsg = encryptionOffMessage;
  }

  if (selectedCircle.name) {
    $scope.currentCircle = selectedCircle.name;
  } else {
    $scope.currentCircle = 'Select a Circle';
  }

  BackgroundFactory.checkLoggedIn()
  .then(function (resp) {
    $scope.userCircles = resp.user.myCircles;
  })
  .then(null, $log.info);

  $scope.encryptionToggle = function () {

    if ($scope.encryptionState) {
      $scope.stateMsg = encryptionOffMessage;
      chrome.browserAction.setIcon({path: "/red128.png"})
    } else {
      $scope.stateMsg = encryptionOnMessage;
      chrome.browserAction.setIcon({path: "/green128.png"})
    }

    backgroundPage.encryptionToggle();

  };// End encryptionToggle

  $scope.setEncryptionCircle = function (pickedCircle) {
    $scope.currentCircle = pickedCircle.name;
    BackgroundFactory.setSelectedCircle(pickedCircle);
  };

});
