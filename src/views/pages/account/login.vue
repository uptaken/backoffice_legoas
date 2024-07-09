<script>
import { required, email } from "vuelidate/lib/validators";
import moment from 'moment'

import {
  authMethods,
  authFackMethods,
  notificationMethods
} from "@/state/helpers";
import Base from "@/Utils/base";

import {RequestAnonymous, } from "@/proto/authentication_pb.js"
import {AuthenticationServiceClient, } from "@/proto/authentication_grpc_web_pb.js"

import {HelloRequest, } from "@/proto/helloworld_pb.js"
import {GreeterClient, GreeterPromiseClient } from "@/proto/helloworld_grpc_web_pb.js"

const base = new Base()

export default {
  data() {
    return {
      email: "",
      password: "",
      submitted: false,
      is_please_wait: false,
    };
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    }
  },
  async created() {
    // var token = localStorage.getItem('token')

    // if (token != null) {
    //   this.$router.push(
    //     this.$route.query.redirectFrom || { name: "home" }
    //   );
    // }
    // await localStorage.clear()
    document.body.classList.add("auth-body-bg");
		this.test_grpc1()
  },
  validations: {
    email: { required, email },
    password: { required }
  },
  methods: {
    ...authMethods,
    ...authFackMethods,
    ...notificationMethods,
		async test_grpc(){
			var client = new AuthenticationServiceClient('http://20.198.220.250:50052', null, null);
			const enableDevTools = window.__GRPCWEB_DEVTOOLS__ || (() => {});
			enableDevTools([
				client,
			]);
		
			
			var request = new RequestAnonymous();
			request.setPartnerCode('lgs');
			
			client.anonymousToken(request, {
				authorization: 'Basic YXV0aGVudGljYXRpb246c3VwZXJzZWNyZXQ=',
				'content-type': 'application/grpc-web-text',
			}, (err, response) => {
				console.log(JSON.stringify(err))
			})
			
		},
		async test_grpc1(){
			var client = new GreeterClient('http://172.104.189.236:50052', null, {
				
			});
			const enableDevTools = window.__GRPCWEB_DEVTOOLS__ || (() => {});
			enableDevTools([
				client,
			]);
		
			
			var request = new HelloRequest();
			request.setName('World bmqbebqwe qeqweq');
			
			client.sayHello(request, {
				Authorization: 'Basic YXV0aGVudGljYXRpb246c3VwZXJzZWNyZXQ=',
				'one-time-password': 42,
				test: 'test',
				// 'content-type': 'application/grpc-web-text',
			}, (err, response) => {
				console.log(response)
			})
			
		},
    // Try to log the user in with the username
    // and password they provided.
    async tryToLogIn() {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();

      if (this.$v.$invalid) {
        return;
      }
      else {
        if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
          this.tryingToLogIn = true;
          // Reset the authError if it existed.
          this.authError = null;
          return (
            this.logIn({
              email: this.email,
              password: this.password
            })
              // eslint-disable-next-line no-unused-vars
              .then(token => {
                this.tryingToLogIn = false;
                this.isAuthError = false;
                // Redirect to the originally requested page, or to the home page
                this.$router.push(
                  this.$route.query.redirectFrom || { name: "home" }
                );
              })
              .catch(error => {
                this.tryingToLogIn = false;
                this.authError = error ? error : "";
                this.isAuthError = true;
              })
          );
        } else {
					window.localStorage.setItem('token', 'test')
					window.localStorage.setItem('token_expired', moment().add(1, 'd').format('YYYY-MM-DD HH:mm:ss'))
					this.$router.push(this.$route.query.redirectFrom || { name: "otp" })
//           this.is_please_wait = true
//           var url = base.url_api + '/auth/login'
//           const { email, password } = this;
//           var data = {
//             type: 'web_admin',
//             email: email,
//             password: password
//           }
// 
//           var response = await base.request(url, 'post', data)
//           this.is_please_wait = false
// 
//           if (response != null) {
//             if (response.status == 'success') {
//               await localStorage.setItem('token', response.token)
//               window.localStorage.setItem('token_expired', moment().add(1, 'd').format('YYYY-MM-DD HH:mm:ss'))
//               await localStorage.setItem('user', JSON.stringify(response.user))
//               // window.location.href = '/'
//               this.$router.push(
//                 this.$route.query.redirectFrom || { name: "otp" }
//               );
//             }
//             else
//               base.show_error(response.message)
//           }
//           else
//             base.show_error("Server Error")
        }
      }
    }
  }
};
</script>

<template>
  <div>
    <!-- <div class="home-btn d-none d-sm-block">
      <a href="/">
        <i class="mdi mdi-home-variant h2 text-white"></i>
      </a>
    </div> -->
    <div>
      <div class="container-fluid p-0">
        <div class="row no-gutters">

          <div class="col-lg-6 position-relative">
            <div style="background-color: #015057;" class="w-100 h-100">
              <!-- <img src="@/assets/auth_logo.png" class="position-absolute" style="bottom: 0;"> -->
            </div>
          </div>

          <div class="col-lg-6">
            <div class="authentication-page-content p-4 d-flex align-items-center min-vh-100" style="background-color: #F5F5F5;">
              <div class="w-100">
                <div class="row justify-content-center">
                  <div class="col-lg-9">
                    <div>
                      <div class="">
                        <h4 class="font-size-18 mt-4">Login</h4>
                        <p class="text-muted">Super Admin</p>
                      </div>

                      <b-alert variant="danger" class="mt-3" v-if="notification.message" show dismissible>{{
                        notification.message }}</b-alert>

                      <div class="p-2 mt-3">
                        <form class="form-horizontal" @submit.prevent="tryToLogIn">
                          <div class="form-group auth-form-group-custom mb-4">
                            <i class="ri-mail-line auti-custom-input-icon"></i>
                            <label for="email">Email</label>
                            <input type="email" v-model="email" class="form-control" id="email" placeholder="Enter email"
                              :class="{ 'is-invalid': submitted && $v.email.$error }" />
                            <div v-if="submitted && $v.email.$error" class="invalid-feedback">
                              <span v-if="!$v.email.required">Email is required.</span>
                              <span v-if="!$v.email.email">Please enter valid email.</span>
                            </div>
                          </div>

                          <div class="form-group auth-form-group-custom mb-2">
                            <i class="ri-lock-2-line auti-custom-input-icon"></i>
                            <label for="userpassword">Password</label>
                            <input v-model="password" type="password" class="form-control" id="userpassword"
                              placeholder="Enter password" :class="{ 'is-invalid': submitted && $v.password.$error }" />
                            <div v-if="submitted && !$v.password.required" class="invalid-feedback">Password is required.
                            </div>
                          </div>

                          <div class="mt-4 text-center">
                            <button class="btn text-white w-md waves-effect waves-light w-100" style="background-color: #FECA03;" type="submit">
                              <div v-show="!is_please_wait">
                                Log In
                              </div>
                              <div v-show="is_please_wait" class="spinner-border text-primary" role="status">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </button>
                          </div>


                        </form>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>