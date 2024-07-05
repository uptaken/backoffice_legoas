<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import $ from 'jquery'

import imageBase from 'image-to-base64'
// const {imageBase} = require('image-to-base64')

import {
  required,
  email,
  numeric
} from "vuelidate/lib/validators";
import Base from "@/Utils/base";

const base = new Base()

export default {
  page: {
    title: "Lokasi Lelang",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: "Lokasi Lelang",
      items: [
        {
          text: "Forms",
          href: "/"
        },
        {
          text: "Lokasi Lelang",
          active: true
        }
      ],
      form: {
        address: "",
        email: "",
        phone: "",
        maps_coordinate: "",
      },
      submitted: false,
      submitform: false,
      submit: false,
      typesubmit: false,
      is_view_only: true,
      is_image_view_only: true,
      image_arr: []
    };
  },
  validations: {
    form: {
      address: { required },
      email: { required, email },
      phone: { required, numeric },
      maps_coordinate: { required },
    },
  },
  async created() {
    await this.get_data()
    await this.get_data('image')
  },
  methods: {
    // formSubmit() {
    //     this.submitted = true;
    //     this.$v.$touch();
    //     console.log(this.$v.$touch)
    // },
    async get_data(type = '') {
      var url = base.url_api
      if (type === '') {
        url += "/setting"
      }
      else {
        url += '/location/image'
      }

      var response = await base.request(url);
      if (response != null) {
        if (response.status == "success") {
          var response_data = response.data
          var x = 0

          if (type === '') {
            var form_data = this.form
            for (x in response_data) {
              form_data[response_data[x].key] = response_data[x].value

              form_data['maps_coordinate'] = form_data['latitude'] + ',' + form_data['longitude']
            }

            this.form = form_data
          }
          else if (type === 'image') {
            console.log(response_data)
            for (x in response_data) {
              response_data[x].image_display = base.url_photo('location', response_data[x].file_name)
            }

            this.image_arr = response_data
          }
        }
      }
    },
    async edit_btn(type) {
      var response = {}
      var data = {}
      var url = base.url_api
      var x = 0
      if (type === 'content') {
        if (this.is_view_only) {
          this.is_view_only = false
        }
        else {
          this.submitted = true;
          this.$v.$touch();

          if (this.$v.$invalid) {
            return;
          }
          else {
            url += "/setting"
  
            var split_coordinate = this.form['maps_coordinate'].split(',')
            var latitude = split_coordinate[0]
            var longitude = split_coordinate[1]
  
            data = {
              arr_setting: [
                {
                  "key": "address",
                  "value": this.form.address
                },
                {
                  "key": "email",
                  "value": this.form.email
                },
                {
                  "key": "phone",
                  "value": this.form.phone
                },
                {
                  "key": "latitude",
                  "value": latitude
                },
                {
                  "key": "longitude",
                  "value": longitude
                },
              ]
            }  
  
            response = await base.request(url, 'put', data);
            if (response != null) {
              if (response.status == "success") {
                window.location.reload()
              }
            }
          }
        }
      }
      else if (type === 'image') {
        if (this.is_image_view_only) {
          this.is_image_view_only = false
        }
        else {
          url += '/location/image'
          console.log(url)
          var arr_img = this.image_arr

          for (x in arr_img) {
            arr_img[x].is_publish = 1
            arr_img[x].image = {
              file: arr_img[x].data_image
            }
          }

          data = {
            arr_file: arr_img
          }

          response = await base.request(url, 'post', data);
          if (response != null) {
            if (response.status == "success") {
              window.location.reload()
            }
          }
        }
      }
    },
    choose_image() {
      $('#input_image').trigger('click')
    },
    async change_image(event) {
      for (var x in event.target.files) {
        if (x < 4) {
          if (this.image_arr.length < 4) {
            this.image_arr.push({
              image_display: URL.createObjectURL(event.target.files[x]),
              data_image: await imageBase(URL.createObjectURL(event.target.files[x]))
            })
          }
        }
      }
    },
    async remove_image(index) {
      // this.image_arr.splice(index, 1)
      var flag_delete = 1

      if (confirm('Are you sure want to delete this data?') == true) {
        flag_delete = 1
      }
      else {
        flag_delete = 0
      }

      if (flag_delete) {
        if(this.image_arr[index].id != null){
          var url = base.url_api + '/location/image'
          var response = await base.request(url, "delete", {
            id: this.image_arr[index].id,
          });
          if (response != null) {
            if (response.status == "success") {
              this.image_arr.splice(index, 1);
            }
          }
        }
        else{
          this.image_arr.splice(index, 1);
        }
      }
    },
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <form class="needs-validation" @submit.prevent="formSubmit">
              <div class="row">
                <div class="col-12">
                  <div class="form-group">
                    <label>Alamat</label>
                    <textarea v-model="form.address" class="form-control" name="textarea"
                      :class="{ 'is-invalid': submitted && $v.form.address.$error }" rows="3" style="resize: none"
                      :readonly="is_view_only"></textarea>
                    <div v-if="submitted && $v.form.address.$error" class="invalid-feedback">
                      <span v-if="!$v.form.address.required">This value is required.</span>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-group">
                    <label>Email</label>
                    <input v-model="form.email" type="text" class="form-control" placeholder="email@email.com"
                      value="Otto" :class="{ 'is-invalid': submitted && $v.form.email.$error }"
                      :readonly="is_view_only" />
                    <div v-if="submitted && $v.form.email.$error" class="invalid-feedback">
                      <span v-if="!$v.form.email.required">This value is required.</span>
                      <span v-if="!$v.form.email.email">This value should be a valid email.</span>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-group">
                    <label>Phone</label>
                    <input v-model="form.phone" type="text" class="form-control" placeholder="Phone"
                      :class="{ 'is-invalid': submitted && $v.form.phone.$error }" :readonly="is_view_only" />
                    <div v-if="submitted && $v.form.phone.$error" class="invalid-feedback">
                      <span v-if="!$v.form.phone.required">This value is required.</span>
                      <span v-if="!$v.form.phone.numeric">This value should be a valid number.</span>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-group">
                    <label>Google Map Coordinate</label>
                    <input v-model="form.maps_coordinate" type="text" class="form-control"
                      placeholder="Google Map Coordinate" :class="{
                        'is-invalid': submitted && $v.form.maps_coordinate.$error,
                      }" :readonly="is_view_only" />
                    <div v-if="submitted && $v.form.maps_coordinate.$error" class="invalid-feedback">
                      <span v-if="!$v.form.maps_coordinate.required">This value is required.</span>
                    </div>
                  </div>
                </div>
              </div>

              <button class="btn btn-primary" type="button" v-on:click="edit_btn('content')">
                {{ is_view_only ? "Edit" : "Save" }} Content
              </button>
            </form>
          </div>

          <div class="card-body">
            <div class="row">
              <div class="col-12">
                <label>4 Image Di Page Lokasi Lelang</label>

                <div class="row">
                  <div class="col-6 col-lg-3" v-for="(data, index) in image_arr" :key="index">
                    <div class="row">
                      <div class="col-12">
                        <img class="rounded mr-2" alt="200x200" width="100%" :src="data.image_display"
                          data-holder-rendered="true" />
                      </div>
                      <div class="col-12 mt-2 text-center" v-if="!is_image_view_only">
                        <button type="button" class="btn btn-danger" v-on:click="remove_image(index)">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12 mt-3" v-if="!is_image_view_only && image_arr.length < 4">
                <input type="file" accept="image/*" multiple class="d-none" id="input_image"
                  v-on:change="change_image($event)" />
                <button class="btn btn-primary" type="button" v-on:click="choose_image">
                  Choose Image
                </button>
              </div>
              <div class="col-12 mt-3">
                <button class="btn btn-primary" type="button" v-on:click="edit_btn('image')">
                  {{ is_image_view_only ? "Edit" : "Save" }} Image
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
