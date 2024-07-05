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
      name: '',
      arr_category_sport: [],
      arr_selected_category: [],
      start_date: '',
      end_date: '',
      is_publish: '0',
      is_first_time: true,
    };
  },
  watch: {
    data(val){
      if(val.name != null){
        this.is_publish = val.is_publish
        this.name = val.name
        this.arr_selected_category = val.arr_selected_category
        this.start_date = val.start_date_moment.toDate()
        this.end_date = val.end_date_moment.toDate()
      }
    },
    tab(val){
      if(this.index < val)
        this.validate()
    },
    arr_category_sport(val){
      if(this.is_first_time && val.length > 0 && this.arr_selected_category.length > 0)
        this.manage_selected_category()
    },
    arr_selected_category(val){
      if(this.is_first_time && val.length > 0 && this.arr_category_sport.length > 0)
        this.manage_selected_category()
    },
    // is_submit(val){
    //   if(val)
    //     this.validate()
    // },
  },
  mounted(){
    this.get_category_sport()
  },
  methods: {
    async get_category_sport() {
      var url = base.url_api + '/category-sport'
      var response = await base.request(url);
      if (response != null) {
        if (response.status == "success") {
          var response_data = response.data
          this.arr_category_sport = response_data
        }
        else
          base.show_error(response.message)
      }
      else
        base.show_error('Server Error')
    },
    manage_selected_category(){
      var arr = JSON.parse(JSON.stringify(this.arr_category_sport))
      for(let data of arr){
        var flag = false
        for(let selected_category of this.arr_selected_category){
          if(selected_category.category_sport.id == data.id){
            flag = true
            break
          }
        }
        data.selected = flag
      }
      this.is_first_time = false
      this.arr_category_sport = arr
    },
    disableStartDate(date){
      return (this.end_date == "" && momentTZ(date).isSameOrBefore(momentTZ())) || (this.end_date != "" && momentTZ(date).isSameOrAfter(momentTZ(this.end_date)))
    },
    disableEndDate(date){
      return this.start_date != "" && momentTZ(date).isSameOrBefore(momentTZ(this.start_date))
    },
    onCategorySportClicked(index){
      var category = this.arr_category_sport[index]
      category.selected = !category.selected
      this.$set(this.arr_category_sport, index, category)
    },
    validate(){
      var counter = 0
      var selected_category = []
      for(let category of this.arr_category_sport){
        if(category.selected){
          var id = null
          for(let selected_category of this.arr_selected_category){
            if(selected_category.category_sport.id == category.id){
              id = selected_category.id
              break
            }
          }

          selected_category.push({
            id: id,
            category_sport: category,
          })
        }
      }

      var message = ''
      if(this.name == "")
        message = 'Name is empty'
      else if(this.start_date == "")
        message = 'Start date is empty'
      else if(this.end_date == "")
        message = 'End date is empty'
      else if(selected_category.length == 0)
        message = 'Category sport is not selected'

      this.$emit('onValidate', message, {
        is_publish: this.is_publish,
        name: this.name,
        arr_category_sport: selected_category,
        start_date: momentTZ.tz(this.start_date, base.locale_timezone).format('YYYY-MM-DD HH:mm:ss'),
        end_date: momentTZ.tz(this.end_date, base.locale_timezone).format('YYYY-MM-DD HH:mm:ss'),
      })
    },
  }
};
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-12">
          <div class="form-group">
            <label>Status Publish</label>
            <div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="exampleRadios" id="radioNotPublish" value="0" v-model="is_publish">
                <label class="form-check-label" for="radioNotPublish">
                  Not Publish
                </label>
              </div>

              <div class="form-check">
                <input class="form-check-input" type="radio" name="exampleRadios" id="radioPublish" value="1" v-model="is_publish">
                <label class="form-check-label" for="radioPublish">
                  Publish
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="form-group">
            <label>Name</label>
            <input v-model="name" type="text" class="form-control" placeholder="Name" :readonly="is_view_only" />
          </div>
        </div>

        <div class="col-6">
          <div class="form-group">
            <label>Start Date</label>
            <date-picker v-model="start_date" type="date" input-class="form-control" :disabled="is_view_only" format="DD/MM/YYYY" :disabled-date="disableStartDate"/>
          </div>
        </div>

        <div class="col-6">
          <div class="form-group">
            <label>End Date</label>
            <date-picker v-model="end_date" type="date" input-class="form-control" :disabled="is_view_only" format="DD/MM/YYYY" :disabled-date="disableEndDate"/>
          </div>
        </div>

        <div class="col-12">
          <div class="form-group">
            <label>Category Sport</label>
            <div>
              <div v-for="(category_sport, index) in arr_category_sport" :key="index">
                <div class="form-check mb-3">
                  <input class="form-check-input" type="checkbox" :checked="category_sport.selected" :disabled="is_view_only" @click="onCategorySportClicked(index)" :id="'categorySport' + index" />
                  <label class="form-check-label" :for="'categorySport' + index">{{ category_sport.name }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>