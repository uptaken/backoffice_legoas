<script>

// import CKEditor from 'ckeditor4-vue'

import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import momentTZ from 'moment-timezone'
import $ from 'jquery'
import imageBase from 'image-to-base64'
import Base from "@/Utils/base";
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import ModalCoordinator from "@/views/pages/content/category_sport/component/modal_coordinator";

const base = new Base()

/**
 * Event component
 */
export default {
  props: ['is_view_only', 'index', 'tab', 'data', 'is_submit',],
  components: {DatePicker, ModalCoordinator, },
  data() {
    return {
      arr: [],
      selected_data: null,
      arr_index: -1,
    };
  },
  watch: {
    data(val){
      if(val != null){
        this.arr = val.arr_coordinator
      }
    },
    tab(val){
      if(this.index < val)
        this.validate()
    },
    is_submit(val){
      if(val)
        this.validate()
    },
  },
  mounted(){
  },
  methods: {
    validate(){
      var message = ''
      // if(this.arr.length == 0)
      //   message = 'List Coordinator is empty'

      this.$emit('onValidate', message, {
        arr_coordinator: this.arr,
      })
    },
    onAddClicked(){
      this.selected_data = null
      this.arr_index = -1
      $('#editCoordinator').modal('show')
    },
    onEditClicked(index){
      this.selected_data = this.arr[index]
      this.arr_index = index
      $('#editCoordinator').modal('show')
    },
    onRemoveClicked(index){
      this.arr.splice(index, 1)
    },
    onSubmit(data){
      if(this.arr_index < 0)
        this.arr.push(data)
      else
        this.$set(this.arr, this.arr_index, data)
    },
  }
};
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div v-show="!is_view_only">
        <button class="btn btn-sm btn-primary mr-2" @click="onAddClicked">
          Add Coordinator
        </button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>Email</th>
            <th>Phone</th>
            <th v-show="!is_view_only">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in arr" :key="index">
            <td>{{ data.name }}</td>
            <td>{{ data.gender }}</td>
            <td>{{ data.email }}</td>
            <td>{{ data.phone }}</td>
            <td v-show="!is_view_only">
              <button class="btn btn-sm btn-primary rounded-circle mr-2" @click="onEditClicked(index)">
                <i class="mdi mdi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-danger rounded-circle mr-2" @click="onRemoveClicked(index)">
                <i class="mdi mdi-trash-can"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <ModalCoordinator
        v-show="!is_view_only"
        :data="selected_data"
        @onSubmit="onSubmit"/>
    </div>
  </div>
</template>