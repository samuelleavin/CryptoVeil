app.factory('BackgroundFactory', function ($http, $q) {

    var backgroundPage = chrome.extension.getBackgroundPage();
    var currentUser = backgroundPage.user;
    var server = 'http://127.0.0.1:1337';
    
    var composeRequest = function (method, url, data) {
        return {
            method: method,
            url: server + url,
            // headers: {
            //   'Access-Control-Allow-Origin': '*',
            //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            //   'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
            // },
            data: data
        }
    };

    var setUser = function(info) {
      currentUser.setLoggedInUser(info);
      return currentUser.getLoggedInUser();
    };

    return {

        setSelectedCircle: function (circle) {
            currentUser.setSelectedCircle(circle);
        },

        getSelectedCircle: function () {
            return $q.when(currentUser.getSelectedCircle());
        },

        getBackgroundPage: function () {
            return chrome.extension.getBackgroundPage();
        },

        getUserCircles: function () {
            // var promiseForCircles = new Promise(function (resolve, reject) {
            //     resolve(
            // });
            
            // return promiseForCircles;
            return $q.when(currentUser.getLoggedInUser().myCircles);
        },

        registerUser: function(signUpInfo) {
            return $http(composeRequest('POST','/api/users', { nickname: signUpInfo.nickname, email: signUpInfo.email, password: signUpInfo.password }))
            .then(function (response) {
                var registeredUser = response.data.user;
                setUser(registeredUser);
                return registeredUser;
            });
        },

        logInUser: function(info) {
            return $http(composeRequest('POST', '/login', { email: info.email, password: info.password }))
            .then(function (response) {
                chrome.tabs.query({url: '*://mail.google.com/*'}, function (tabs) {
                    if (tabs) {
                        tabs.forEach(function(tab) {
                            chrome.tabs.reload(tab.id)
                        });
                    }
                });

                chrome.tabs.query({title: 'CryptoVeil'}, function (tabs) {
                    if (tabs.length) {
                        tabs.forEach(function(tab) {
                            chrome.tabs.reload(tab.id)
                        });
                    };
                });

                var returnedUser = response.data.user;
                setUser(returnedUser);
                return returnedUser;
            });
        },

        logOutUser: function() {
            return $http(composeRequest('GET', '/logout'))
            .then(function (response) {

                chrome.browserAction.setIcon({path: "/red128.png"});
                chrome.tabs.query({title: 'CryptoVeil'}, function (tabs) {
                    if (tabs) {
                        tabs.forEach(function(tab) {
                            chrome.tabs.reload(tab.id)
                        });
                    };
                });

                chrome.tabs.query({url: '*://mail.google.com/*'}, function (tabs) {
                    if (tabs) {
                        tabs.forEach(function(tab) {
                            chrome.tabs.reload(tab.id)
                        });
                    }
                });
                
                currentUser.setLogOutUser();
                return response.status;
            });
        },

        checkLoggedIn: function() {

            return $http(composeRequest('GET', '/session'))
            .then(function (response) {
                return response.data;
            });
        },

        isLoggedIn: function () {

            return backgroundPage.user.isLoggedIn();
        }
    }
});
