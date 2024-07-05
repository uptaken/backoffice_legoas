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
      arr_category_sport: [],
      arr_selected_category: [],
      arr_scoring_type: [],
      arr_display_team: [
        {
          id: 'team',
          name: 'Team Name',
        },
        {
          id: 'player',
          name: 'Player Name',
        },
      ],
      is_first_time: true,
    };
  },
  watch: {
    data(val){
      if(val.start_date != null){
        this.arr_selected_category = val.arr_selected_category
        this.get_category_sport()
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
    this.get_scoring_type()

    // if(this.data.id == null)
    //   this.get_category_sport()
  },
  methods: {
    async get_category_sport() {
      var url = base.url_api + '/category-sport'
      var response = await base.request(url);
      if (response != null) {
        if (response.status == "success") {
          var response_data = response.data
          for(let category_sport of response.data){
            for(let scoring_type of category_sport.scoring_type){
              if(scoring_type.event_id == this.data.id){
                category_sport.selected_scoring_type_id = scoring_type.scoring_type.id
                category_sport.display_team = scoring_type.display_team
                break
              }
            }
          }
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
    async get_scoring_type() {
      var url = base.url_api + '/scoring-type'
      var response = await base.request(url);
      if (response != null) {
        if (response.status == "success") {
          var response_data = response.data
          this.arr_scoring_type = response_data
        }
        else
          base.show_error(response.message)
      }
      else
        base.show_error('Server Error')
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
      if(selected_category.length == 0)
        message = 'Category sport is not selected'

      this.$emit('onValidate', message, {
        arr_category_sport: selected_category,
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
            <label>Category Sport</label>
            <div>
              <div v-for="(category_sport, index) in arr_category_sport" :key="index">
                <div class="form-check mb-3">
                  <input class="form-check-input" type="checkbox" :checked="category_sport.selected" :disabled="is_view_only" @click="onCategorySportClicked(index)" :id="'categorySport' + index" />
                  <label class="form-check-label" :for="'categorySport' + index">{{ category_sport.name }}</label>
                </div>

                <div class="form-group" v-show="category_sport.selected">
                  <label>Scoring Type</label>
                  <select v-model="category_sport.selected_scoring_type_id" class="form-control" :disabled="is_view_only">
                    <option value="">Choose Scoring Type</option>
                    <option v-for="(scoring_type, index) in arr_scoring_type" :key="index" :value="scoring_type.id">{{ scoring_type.name }}</option>
                  </select>
                </div>

                <!-- <div class="form-group" v-show="category_sport.selected">
                  <label>Display Team</label>
                  <select v-model="category_sport.display_team" class="form-control" :disabled="is_view_only">
                    <option value="">Choose Display Team</option>
                    <option v-for="(display_team, index) in arr_display_team" :key="index" :value="display_team.id">{{ display_team.name }}</option>
                  </select>
                </div> -->
                
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>