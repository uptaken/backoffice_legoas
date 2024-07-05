<script>

// import CKEditor from 'ckeditor4-vue'

  import Layout from "../../../layouts/main";
  import CustomPleaseWait from "../../../layouts/CustomPleaseWait";
  import CustomEditor from "../../../layouts/CustomEditor";
  import Level2Modal from "./level2_modal";
  import PageHeader from "@/components/page-header";
  import appConfig from "@/app.config";
  import moment from 'moment'
  import $ from 'jquery'
  import imageBase from 'image-to-base64'
  import Base from "@/Utils/base";

  const base = new Base()

  import {
    required,

  } from "vuelidate/lib/validators";

// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * Navbar component
 */
  export default {
    page: {
      title: "Navbar",
      meta: [{ name: "description", content: appConfig.description }]
    },
    components: { Layout, PageHeader, CustomEditor, CustomPleaseWait, Level2Modal, },
    data() {
      return {
        base: new Base(),
        items: [
          {
            text: "Tables",
            href: "/"
          },
          {
            text: "Navbar",
            active: true
          }
        ],
        progress: 0,
        arr_level2: [],
        selected_level2: {},
        selected_level2_index: -1,
        name: '',
        is_view_only: false,
      };
    },
    watch: {
      arr_level2(val){
        console.log(val)
      },
    },
    mounted() {
      if (this.$route.params.id != null) {
        this.is_view_only = true
        this.get_data()
      }
    },
    methods: {
      async get_data() {
        var url = base.url_api + '/navbar/level1?id=' + this.$route.params.id
        var response = await base.request(url);
        if (response != null) {
          if (response.status == "success") {
            var response_data = response.data
            if (response_data != null) {
              response_data.created_at = moment(response_data.created_at).format('DD MMM YYYY')
              response_data.publish_date = (response_data.publish_at != null ? new Date(response_data.publish_at) : '')

              this.name = response_data.name
              for(var level2 of response_data.navbar_level2){
                level2.arr = level2.navbar_level3
              }
              this.arr_level2 = response_data.navbar_level2
            }
            else {
              window.history.back()
            }
          }
        }
      },
      async action_btn(type) {
        var url = base.url_api + '/navbar/level1'
        var data = {
          name: this.name,
          arr: this.arr_level2,
        }
        var response = {}
        if (type === 'edit') {
          if (this.is_view_only) 
            this.is_view_only = false
          else{
            var method = 'post'

            if (this.$route.params.id != null) {
              data.id = this.$route.params.id
              method = 'put'
            }

            response = await base.request(url, method, data);
            if (response != null) {
              if (response.status == "success") {
                window.location.href = '/navbar'
              }
            }
          }
        }
        else if (type === 'delete') {
          if (confirm('Are you sure want to delete this data?')) {
            response = await base.request(url, 'delete', data);

            if (response != null) {
              if (response.status == "success") {
                window.location.replace('/navbar')
              }
            }
          }
        }
        else if (type === 'back') {
          if(!this.is_view_only)
            this.is_view_only = true
          else
            window.history.back()
        }
      },
      onSubmitLevel2(name, arr1){        
        if(this.selected_level2_index >= 0){
          var arr = JSON.parse(JSON.stringify(this.arr_level2))
          arr[this.selected_level2_index].name = name
          arr[this.selected_level2_index].arr = arr1
          this.arr_level2 = arr
        }
        else
          this.arr_level2.push({ name: name, arr: arr1, })

        this.selected_level2_index = -1
        this.selected_level2 = {}
        $('#level2Modal').modal('hide')
      },
      onCancelLevel2(){
        this.selected_level2_index = -1
        this.selected_level2 = {}
        $('#level2Modal').modal('hide')
      },
      add_level2(){
        $('#level2Modal').modal('show')
      },
      edit_level2(index){
        this.selected_level2 = this.arr_level2[index]
        this.selected_level2_index = index
        $('#level2Modal').modal('show')
      },
      remove_level2(index){
        this.arr_level2.splice(index, 1)
      },
    }
  };
</script>

<template>
  <Layout>
    <PageHeader title="Navbar" :items="items" />
    <CustomPleaseWait :progress="progress"/>
    <Level2Modal :data="selected_level2" @onSubmit="(name, arr) => onSubmitLevel2(name, arr)" @onCancel="() => onCancelLevel2()"/>

    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-12">
            <div class="form-group">
              <label>Nama</label>
              <input v-model="name" type="text" class="form-control" placeholder="Nama" :readonly="is_view_only" />
            </div>
          </div>
          <div class="col-12">
            <div class="d-flex align-items-center">
              <label class="m-0">Level 2</label>

              <button class="btn btn-primary ml-3" v-show="!is_view_only" type="button" @click="add_level2()">Add</button>
            </div>
            <table class="table mt-3">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Jumlah Level 3</th>
                  <th v-show="!is_view_only">Action</th>
                </tr>
              </thead>
              <tbody v-if="arr_level2.length > 0">
                <tr v-for="(level2, index) in arr_level2" :key="index">
                  <td>{{ level2.name }}</td>
                  <td>{{ level2.arr.length }}</td>
                  <td v-show="!is_view_only">
                    <button class="btn btn-primary" type="button" @click="edit_level2(index)">Edit</button>
                    <button class="btn btn-danger ml-3" type="button" @click="remove_level2(index)">Delete</button>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="3" class="text-center">No Data Found</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="col-12 mt-3">
            <button class="btn btn-primary mr-1" v-on:click="action_btn('edit')">
              {{ is_view_only ? 'Edit': 'Save' }} Navbar
            </button>
            <button class="btn btn-danger ml-1" v-on:click="action_btn('delete')" v-if="this.$route.params.id != null">Delete Navbar</button>
            <button class="btn btn-warning ml-1" v-on:click="action_btn('back')">Cancel</button>
          </div>

        </div>
      </div>
    </div>
  </Layout>
</template>