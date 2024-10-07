<script>
import { required, email } from "vuelidate/lib/validators";
import moment from 'moment'

import {
  authMethods,
  authFackMethods,
  notificationMethods
} from "@/state/helpers";
import Base from "@/Utils/base";

const base = new Base()

export default {
  data() {
    return {
			base: null,
      username: "",
      password: "",
      submitted: false,
      is_please_wait: false,
			temp_token: '',
    };
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    }
  },
  async created() {
		this.base = new Base()
    // var token = localStorage.getItem('token')

    // if (token != null) {
    //   this.$router.push(
    //     this.$route.query.redirectFrom || { name: "home" }
    //   );
    // }
    // await localStorage.clear()
    document.body.classList.add("auth-body-bg");

		var token = await window.localStorage.getItem('token')
		var temp_token = await window.localStorage.getItem('temp_token')
		if(token != null)
			this.get_profile()
		else if(token == null && temp_token == null)
			this.get_token()
  },
  validations: {
    email: { required, email },
    password: { required }
  },
  methods: {
    ...authMethods,
    ...authFackMethods,
    ...notificationMethods,
		async get_token(){
			var response = await base.request(base.url_api + '/authentication/anonymous/lgs', 'post', {
				// req: {
				// 	partner_code: "lgs",
				// },
			})

      if (response != null) {
        if (response.data.code == 200) {
					window.localStorage.setItem('temp_token', 'Bearer ' + response.arrCustomResponseHeader['grpc-metadata-token'])
        }
        else
          base.show_error(response.data.message)
      }
      else
        base.show_error("Server Error")

		},
		async get_profile(){
			var response = await base.request(base.url_api + '/admin/profile')

			if (response != null) {
				console.log(JSON.stringify(response.data))
			}
			else
				base.show_error("Server Error")

		},
    // Try to log the user in with the username
    // and password they provided.
    async tryToLogIn() {
			if(this.username == '')
				base.show_error('Username is Empty')
			else if(this.password == '')
				base.show_error('Password is Empty')
			else{
				this.is_please_wait = true
				var response = await base.request(base.url_api + '/authentication/login/admin', 'post', {
					username: this.username,
					password: this.password,
				})
				this.is_please_wait = false

				if (response != null) {
					if (response.data.code == 200) {
						window.localStorage.removeItem('temp_token')

						window.localStorage.setItem('token', 'Bearer ' + response.arrCustomResponseHeader['grpc-metadata-token'])
						window.localStorage.setItem('token_expired', moment().add(6, 'h').format('YYYY-MM-DD HH:mm:ss'))

						window.location.href = "/choose-role"
					}
					else
						base.show_error(response.data.message)
				}
				else
					base.show_error("Server Error")
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
                            <label for="email">Username</label>
                            <input type="text" v-model="username" class="form-control" id="username" placeholder="Enter username"/>
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