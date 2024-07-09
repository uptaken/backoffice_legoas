<script>
import $ from 'jquery'
import { required, email } from "vuelidate/lib/validators";

import Base from "@/Utils/base";

export default {
  data() {
    return {
      base: null,
			arrOTP: [
				{ value: '' },
				{ value: '' },
				{ value: '' },
				{ value: '' },
				{ value: '' },
				{ value: '' },
			],
			index: -1,
			resendTimeLeft: 30,
    };
  },
	watch: {
		arrOTP: {
			handler(newValue, oldValue) {
				var counter = 0
				for(let val of newValue){
					if(val.value == '')
						break
					counter++
				}
				
				if(counter == newValue.length)
					this.onSubmit()
			},
			deep: true,
		},
	},
  created() {
		this.base = new Base()
		
		var context = this
		setInterval(() => {
			if(context.resendTimeLeft > 0)
				context.resendTimeLeft--
		}, 1000)
  },
  methods: {
		onKeyUp(e, index){
			var index1 = index
			var type = e.keyCode != 8 ? 'next' : 'prev'
			
			if((parseInt(index1) >= 0 && parseInt(index1) < this.arrOTP.length - 1 && type == 'next') || (parseInt(index1) > 0 && parseInt(index1) <= this.arrOTP.length - 1 && type == 'prev')){
				if(type == 'next')
					this.$refs['inputOTP' + (parseInt(index) + 1)][0].focus()
				else if(type == 'prev')
					this.$refs['inputOTP' + (parseInt(index) - 1)][0].focus()
			}
		},
		onSubmit(){
			var message = ''
			for(let x in this.arrOTP){
				if(this.arrOTP[x].value == ''){
					message = 'OTP ' + (parseInt(x) + 1) + ' is Empty'
					break
				}
			}
			
			if(message != '')
				this.base.show_error(message)
			else{
				this.$router.push({ name: "Choose Role" })
			}
		},
		onResend(){
			this.resendTimeLeft = 30
		},
  }
};
</script>

<template>
  <div class="container p-0 h-100">
    <div class="row authentication-page-content">
      <div class="col-lg-12 d-flex align-items-center">
        
				<div class="card">
					<div class="card-header">
						<p class="text-center m-0">Activation Code</p>
					</div>
					<div class="card-body">
						<div class="d-flex mb-3">
							<div v-for="(otp, index) in arrOTP" :key="index" :class="{'mr-3': index < arrOTP.length - 1}" :style="{'width': (100 / arrOTP.length) + '%'}" >
								<input type="number" v-model="otp.value" class="form-control w-100 text-center" :index="index" :ref="'inputOTP' + index" @keyup="onKeyUp($event, index)"/>
							</div>
						</div>
						
						<div class="mb-3">
							<p class="w-100 text-center m-0" v-show="resendTimeLeft > 0">Kirim ulang kode aktivasi dalam waktu {{resendTimeLeft}} detik</p>
							<button class="btn btn-primary w-100" @click="onResend" v-show="resendTimeLeft == 0">Kirim Ulang OTP</button>
						</div>
						
						<div>
							<button class="btn btn-primary w-100" @click="onSubmit">Submit</button>
						</div>
					</div>
				</div>
				
      </div>
    </div>
  </div>
</template>