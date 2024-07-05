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
      selected_data: null,
      arr_index: -1,
    };
  },
  mounted(){
  },
  methods: {
  }
};
</script>

<template>
  <div class="card">
    <div class="card-body">
      <h4>League Group & Match</h4>
      <p class="">Kategori Olahraga ini belum memiliki Match. Apakah ingin melakukan Generate Match ?</p>
      <a href="/group-match/generate" class="btn btn-primary">Generate Match</a>
    </div>
  </div>
</template>