<template>
  <div>
    <div v-for="(match, index) in arr" :key="index" class="mb-5">
      <div class="d-flex justify-content-between">
        <div class="d-flex align-items-center">
          <button class="rounded-circle mr-2 btn-primary" @click="onEdit(index)" style="height: 3rem; width: 3rem;" >
            <i class="mdi mdi-pencil"></i>
          </button>
          <button class="rounded-circle mr-2 btn-primary" @click="onDetail(index)" style="height: 3rem; width: 3rem;" >
            <i class="mdi mdi-eye"></i>
          </button>
          <div>
            <p class="m-0">{{ match.name }}</p>
            <p class="m-0">{{ match.group != null ? match.group.event_category_sport_category.name : match.tournament.event_category_sport_category.name }} / {{ match.group != null ? match.group.name : match.tournament.name }}</p>
          </div>
        </div>
        <div class="d-flex flex-column align-items-center">
          <p class="m-0">{{ match.date.format('DD/MM/YYYY') }}</p>
          <p class="m-0">{{ match.date.format('HH:mm') }}</p>
        </div>
        <div class="text-right">
          <p class="m-0">{{ match.event_category_sport_venue != null ? match.event_category_sport_venue.venue.name : 'No Venue' }}</p>
          <p class="m-0">{{ match.event_category_sport_venue != null ? match.event_category_sport_venue.court : 'No Court' }}</p>
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center mt-3">
        <div class="d-flex align-items-center">
          <img :src="match.member1.registration_event != null ? match.member1.registration_event.url_image : '@/assets/no_image.png'" style="width: 5rem" />
          <div class="ml-3">
            <p class="m-0">{{ match.member1.registration_event != null ? match.member1.registration_event.user.name : '-' }}</p>
            <p class="m-0">{{ match.member1.registration_event != null ? match.member1.registration_event.team_name : '-' }}</p>
            <p class="m-0">{{ match.member1.registration_event != null ? match.member1.registration_event.jersey_team : '-' }}</p>
          </div>
        </div>
        <div class="d-flex">
          <h4>{{ match.group_member1_score }}</h4>
          <h4 class="mx-3">-</h4>
          <h4>{{ match.group_member2_score }}</h4>
        </div>
        <div class="d-flex align-items-center justify-content-end">
          <div class="text-right mr-3">
            <p class="m-0">{{ match.member2.registration_event != null ? match.member2.registration_event.user.name : '-' }}</p>
            <p class="m-0">{{ match.member2.registration_event != null ? match.member2.registration_event.team_name : '-' }}</p>
            <p class="m-0">{{ match.member2.registration_event != null ? match.member2.registration_event.jersey_team : '-' }}</p>
          </div>
          <img :src="match.member2.registration_event != null ? match.member2.registration_event.url_image : '@/assets/no_image.png'" style="width: 5rem"/>
        </div>
      </div>
    </div>

    <ModalMatch :match="selected_match" :data="data" :onShow="is_show_modal" @onForceReload="onForceReload"/>
  </div>
</template>

<script>
import $ from 'jquery'
import Base from "@/Utils/base";
import ModalMatch from "@/views/layouts/modal_match";
import NoImage from '@/assets/no_image.png';

export default {
  props: ["arr", 'data', ],
  components: {ModalMatch, },
  data() {
    return {
      base: new Base(),
      selected_match: {},
      is_show_modal: false,
    };
  },
  mounted() {
  },
  methods: {
    onForceReload(){
      this.$emit('onForceReload')
    },
    onEdit(index){
      this.selected_match = this.arr[index]
      this.is_show_modal = true
      $('#editMatch').modal('show')
    },
    onDetail(index){
      window.location.href = "/match/detail/" + this.arr[index].id
    },
  },
};
</script>