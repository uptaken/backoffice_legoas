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
import NoImage from '@/assets/no_image.png';

import CustomGroup from "@/views/layouts/CustomGroup";

const base = new Base()

/**
 * Event component
 */
export default {
  props: ['is_view_only', 'index', 'tab', 'data', 'is_submit', 'arr_group', ],
  components: {DatePicker, CustomGroup, },
  data() {
    return {
      base: null,
    };
  },
  mounted(){
    this.base = new Base()
  },
  methods: {
  }
};
</script>

<template>
  <div>
    <CustomGroup :arr="arr_group"/>
  </div>
</template>