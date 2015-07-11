app.factory('CircleFactory', function ($http) {

    var backgroundPage = chrome.extension.getBackgroundPage();
    var currentLoggedUser = backgroundPage.user.getLoggedInUser();
    var server = 'https://cryptoveil.herokuapp.com';
    
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

    return {
        // get user circle = background
        //create circle, update user too
        //get circle
        //update circle, for user remove, add
        //delete circle, updat user too
        //leave circle: get circle, delete user, update circle

        //CREATE CIRCLE
        createCircle: function(circleName) {
            return $http(composeRequest('POST', '/api/circles', {user:currentLoggedUser, 
                circleName: circleName
                }))
            .then(function(response){
                console.log('hit factory createcircle', response)
                return response.data;
            })
        },

        deleteCircle: function(circleId) {
            return $http(composeRequest('DELETE', '/api/circles/' + circleId))
            .then(function (response) {
            	console.log('inside CircleFactory', response);
              return response.data;
            })
        },

        editMember: function(circleId, memberEmail, edit){
            // edit is add or delete
            return $http(composeRequest('PUT', '/api/circles/' + circleId, {newEmail: memberEmail, edit: edit}))
            .then(function(response){
                return response.data;
            })
        }


    }
})