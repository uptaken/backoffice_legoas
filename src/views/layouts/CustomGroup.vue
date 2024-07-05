<template>
  <div>
    <div v-for="(group, index) in arr" :key="index" class="mb-5">
      <h4>
        {{ Array.isArray(group) ? group[0].user.type.name : group.member[0].user.type.name }} / 
        {{ Array.isArray(group) ? group[0].event_category_sport_category.name : group.event_category_sport_category.name }} / 
        {{ Array.isArray(group) ? group[0].group_name : group.name }}
      </h4>
      <div v-for="(member, index1) in (Array.isArray(group) ? group : group.member)" :key="index1" class="row">
        <div class="col-12 col-md-6">
          <div class="d-flex align-items-center">
            <img :src="member.url_image" style="width: 5rem" />
            <div class="ml-3">
              <p>{{ Array.isArray(group) ? (group[0].event_category_sport_category.display_team == 'team' ? member.team_name : member.player[0].name) : (group.event_category_sport_category.display_team == 'team' ? member.registration_event.team_name : member.registration_event.player[0].name) }}</p>
              <p class="m-0">{{ member.user.name }}</p>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6" style="overflow-y: scroll; overflox-x: none;">
          <div  class="d-flex align-items-center">
            <div v-for="(opponent, index2) in member.arr_opponent" :key="index2" class="ml-3">
              <img :src="opponent.url_image" style="width: 5rem" />
              <p class="text-center mt-3">{{ opponent.date.format('DD/MMM') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Base from "@/Utils/base";

export default {
  props: ["arr",],
  data() {
    return {
      base: new Base(),
    };
  },
  mounted() {
  }
};
</script>