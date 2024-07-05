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
    tab(val){
      if(this.index < val && !this.is_view_only)
        this.validate()
    },
  },
  mounted(){
    this.base = new Base()
    
    this.fill_content()
  },
  methods: {
    fill_content(){
      if(this.data.id != null)
        this.arr = this.data.arr_category
    },
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
    onDetailClicked(index){
      var data = this.arr[index]
      this.arr_index = index

      window.location.href = '/registration/category/' + data.id
    },
    onDownloadCertificateClicked(index){
      var data = this.arr[index]
      
      window.open(this.base.host + '/export/certificate/all?event_category_sport_category_id=' + data.id, '_blank')
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
            <th>Display Team</th>
            <th v-if="is_view_only">Total School Registration</th>
            <th v-if="is_view_only">Total Club Registration</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data1, index) in arr" :key="index">
            <td>{{ data1.name }}</td>
            <td>{{ data1.requirement }}</td>
            <td>{{ data1.min_player.toLocaleString(base.locale_string) }} - {{ data1.max_player.toLocaleString(base.locale_string) }}</td>
            <td>Rp. {{ data1.fee_registration.toLocaleString(base.locale_string) }}</td>
            <td>Rp. {{ data1.fee_per_match.toLocaleString(base.locale_string) }}</td>
            <td>{{ data1.display_team == 'team' ? 'Team Name' : 'Player Name' }}</td>
            <td v-if="is_view_only">{{ data1.total_school_registration_not_canceled.toLocaleString(base.locale_string) }} of {{ data1.max_total_team_per_school.toLocaleString(base.locale_string) }}</td>
            <td v-if="is_view_only">{{ data1.total_club_registration_not_canceled.toLocaleString(base.locale_string) }} of {{ data1.max_total_team_per_club.toLocaleString(base.locale_string) }}</td>
            <td >
              <div v-show="!is_view_only">
                <button class="btn btn-sm btn-primary rounded-circle mr-2" @click="onEditClicked(index)">
                  <i class="mdi mdi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger rounded-circle mr-2" @click="onRemoveClicked(index)">
                  <i class="mdi mdi-trash-can"></i>
                </button>
              </div>

              <div v-show="is_view_only" style="width: 10rem;">
                <div class="d-inline-block">
                  <button class="btn btn-sm btn-primary rounded-circle mr-2" @click="onDetailClicked(index)">
                    <i class="mdi mdi-eye"></i>
                  </button>
                  <button class="btn btn-sm btn-primary mr-2"  @click="onDownloadCertificateClicked(index)">
                    All Certificate
                  </button>
                </div>
              </div>
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