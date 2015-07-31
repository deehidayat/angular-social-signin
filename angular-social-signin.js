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

                  // Load GPlus Client Library. Your Application must enable this API from developer console
                  gapi.client.load('plus','v1').then(function() {
                      // Retrieve the singleton for the GoogleAuth library and setup the client.
                      gapi.auth2.init({
                        client_id: selfModule.config.google.id,
                        cookiepolicy: 'single_host_origin',
                        fetch_basic_profile: false,
                        scope: 'https://www.googleapis.com/auth/plus.login'
                      }).then(function (){
                        self.auth2 = gapi.auth2.getAuthInstance();
                      });
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

        signIn: function(params) {
          return this.auth2.signIn();
        },

        signOut: function() {
          return this.auth2.signOut();
        },
        
        grantAccess: function(params) {
          return this.auth2.grantOfflineAccess();
        },

        revokeAccess: function(params) {
          return this.auth2.disconnect();
        },

        getProfile: function() {
          return gapi.client.plus.people.get({
            'userId': 'me'
          });
        }
      }

      function FacebookSignin() {
        var self = this;

        // Facebook SDK
        $window.fbAsyncInit = function() {
          FB.init({
              appId: selfModule.config.facebook.id, // App ID
              channelUrl:'/channel.html', // Channel File
              status:true, // check login status
              cookie:true, // enable cookies to allow the server to access the
              // session
              xfbml:true, // parse XFBML
              version: 'v2.4'
          });
          FB.Event.subscribe('auth.authResponseChange', function(response) {
              self.auth2 = response;
          });
        }; 
        ( function(d) {
            var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement('script');
            js.id = id;
            js.async = true;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            ref.parentNode.insertBefore(js, ref);
        }(document));

      }

      FacebookSignin.prototype = {
        auth2: null,

        signIn: function() {
          var defered = $q.defer();
          FB.login(function(response) {
            defered.resolve(response);
          }, { scope: 'public_profile,email,user_friends' });
          return defered.promise;  
        },

        signOut: function() {
          var defered = $q.defer();
          FB.logout(function(response) {
              defered.resolve(response);
          });
          return defered.promise;
        },

        getProfile: function() {
          var defered = $q.defer();
          FB.api('/me', function(response) {
            defered.resolve(response);
          });
          return defered.promise;
        }
      }

      return {
        google: new GoogleSignin(),
        facebook: new FacebookSignin()
      }
    };
  });
