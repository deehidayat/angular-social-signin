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

      return {
        google: new GoogleSignin()
      }
    };
  });
