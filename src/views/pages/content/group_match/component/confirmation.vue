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

const base = new Base()

/**
 * Event component
 */
export default {
  props: ['is_view_only', 'index', 'tab', 'data', 'is_submit',],
  components: {DatePicker, },
  data() {
    return {
      is_first_time: true,
    };
  },
  watch: {
  },
  mounted(){
  },
  methods: {
    onBackClicked(){
      base.back_page()
    },
  }
};
</script>

<template>
  <div class="card">
    <div class="card-body">
      <h4>Generate Group & Match Berhasil !</h4>
      <p>Kategori Olahraga {{ this.data.name }}, sudah berhasil di Generate Group & Match nya. Lanjutkan proses mengisi, WAKTU MATCH & VENUE MATCH </p>
      <div class="d-flex">
        <button class="btn btn-primary ml-3" @click="onBackClicked">Back</button>
      </div>
    </div>
  </div>
</template>