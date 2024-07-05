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
import ModalCategory from "@/views/pages/content/category_sport/component/modal_category";

const base = new Base()

/**
 * Event component
 */
export default {
  props: ['is_view_only', 'index', 'tab', 'data', 'is_submit',],
  components: {DatePicker, ModalCategory, },
  data() {
    return {
      base: null,
      arr: [],
      selected_data: null,
      arr_index: -1,
    };
  },
  watch: {
    data(val){
      if(val != null){
        this.arr = val.arr_category
      }
    },
    tab(val){
      if(this.index < val)
        this.validate()
    },
  },
  mounted(){
    this.base = new Base()
  },
  methods: {
    validate(){
      var message = ''
      if(this.arr.length == 0)
        message = 'List Category is empty'

      this.$emit('onValidate', message, {
        arr_category: this.arr,
      })
    },
    onAddClicked(){
      this.selected_data = null
      this.arr_index = -1
      $('#editCategorySport').modal('show')
    },
    onEditClicked(index){
      this.selected_data = this.arr[index]
      this.arr_index = index
      $('#editCategorySport').modal('show')
    },
    onRemoveClicked(index){
      this.arr.splice(index, 1)
    },
    onSubmit(data){
      // console.log(data)
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
        <button class="btn btn-sm btn-primary  mr-2" @click="onAddClicked">
          Add Category
        </button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Requirement</th>
            <th>Player</th>
            <th>Fee Registration</th>
            <th>Fee per Match</th>
            <th v-show="is_view_only">Total School Registration</th>
            <th v-show="is_view_only">Total Club Registration</th>
            <th v-show="!is_view_only">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in arr" :key="index">
            <td>{{ data.name }}</td>
            <td>{{ data.requirement }}</td>
            <td>{{ data.min_player.toLocaleString(base.locale_string) }} - {{ data.max_player.toLocaleString(base.locale_string) }}</td>
            <td>Rp. {{ data.fee_registration.toLocaleString(base.locale_string) }}</td>
            <td>Rp. {{ data.fee_per_match.toLocaleString(base.locale_string) }}</td>
            <td>{{ data.total_school_registration.toLocaleString(base.locale_string) }} of {{ data.max_total_team_per_school.toLocaleString(base.locale_string) }}</td>
            <td>{{ data.total_club_registration.toLocaleString(base.locale_string) }} of {{ data.max_total_team_per_club.toLocaleString(base.locale_string) }}</td>
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
      <ModalCategory
        v-show="!is_view_only"
        :data="selected_data"
        @onSubmit="onSubmit"/>
    </div>
  </div>
</template>