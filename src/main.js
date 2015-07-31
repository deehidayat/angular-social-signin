'use strict';

angular.module('angular-social-signin', [])
  .provider('angularSocialSignin', function() {

    this.config = {};
    this.setConfig = function (config) {
      return this.config = config;
    };
    this.$get = function ($window, $http, $q) {
      var selfModule = this;
      function GoogleSignin() {
          var self = this;

          $window.googleInit = function() {
              gapi.load('auth2', function(){
                  // Retrieve the singleton for the GoogleAuth library and setup the client.
                  gapi.auth2.init({
                    client_id: selfModule.config.google.id,
                    cookiepolicy: 'single_host_origin',
                    fetch_basic_profile: false,
                    scope: 'https://www.googleapis.com/auth/plus.profile.emails.read'
                  }).then(function (){
                    console.log('Google SDK Initialized');
                    self.auth2 = gapi.auth2.getAuthInstance();
                  });
              });
          }; 
          (function(d) {
              var js, id = 'google-jssdk', ref = d.getElementsByTagName('script')[0];
              if (d.getElementById(id)) {
                  return;
              }
              js = d.createElement('script');
              js.id = id;
              js.async = true;
              js.defer = true;
              js.src = "https://apis.google.com/js/client:platform.js?onload=googleInit";
              ref.parentNode.insertBefore(js, ref);
          }(document));
      }

      GoogleSignin.prototype = {
        auth2: {},
        login: function(params) {
          var deferred = $q.defer();
          this.auth2.grantOfflineAccess().then(function(response){
            deferred.resolve(response);
          });
          return deferred.promise;
        }
      }

      return {
        google: new GoogleSignin()
      }
    };
  });
