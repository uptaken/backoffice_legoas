<template>
  <div>
    <div v-for="(group, index) in arr_group" :key="index" class="mb-5">
      <h4>
        {{ group[0].user.type.name }} / 
        {{ group[0].event_category_sport_category.name }} / 
        {{ group[0].group_name }}
      </h4>
      <div v-for="(member, index1) in group" :key="index1" class="row">
        <div class="col-12">
          <select class="form-control" :value="member.id" @change="onChange(index, index1, $event)">
            <option v-for="(member1, index2) in arr_member" :key="index2" :value="member1.id">{{ member1.team_name }} ({{ member1.user.name }})</option>
          </select>
        </div>
      </div>
    </div>

    <div class="d-flex">
      <button class="btn btn-outline-primary" @click="onSaveClicked">Save</button>
    </div>
  </div>
</template>

<script>
import Base from "@/Utils/base";
import momentTZ from 'moment-timezone'

export default {
  props: ["arr", "match", ],
  data() {
    return {
      base: new Base(),
      arr_group: [],
      arr_member: [],
      arr_match: [],
    };
  },
  mounted() {
    this.arr_group = JSON.parse(JSON.stringify(this.arr))
    this.arr_match = JSON.parse(JSON.stringify(this.match))

    var arr_member = []
    for(let group of this.arr){
      for(let member of group){
        arr_member.push(member)
      }
    }
    this.arr_member = arr_member
  },
  methods: {
    onChange(index, index1, event){
      var arr_group = JSON.parse(JSON.stringify(this.arr_group))
      var arr_match = JSON.parse(JSON.stringify(this.arr_match))
      var oldValue = arr_group[index][index1].id
      var newValue = event.target.value
      var oldIndex = -1
      var oldIndex1 = -1
      var newIndex = index
      var newIndex1 = index1

      for(let x in arr_group){
        for(let y in arr_group[x]){
          if(arr_group[x][y].id == newValue){
            newValue = arr_group[x][y]
            oldIndex = x
            oldIndex1 = y
          }
          else if(arr_group[x][y].id == oldValue){
            oldValue = arr_group[x][y]
          }
        }
      }

      newValue.group_name = newIndex + 1
      oldValue.group_name = oldIndex + 1

      arr_group[oldIndex][oldIndex1] = oldValue
      arr_group[newIndex][newIndex1] = newValue

      for(let match of arr_match[oldIndex]){
        if(match.member1.id == newValue.id)
          match.member1 = oldValue
        else if(match.member2.id == newValue.id)
          match.member2 = oldValue
      }
      for(let match of arr_match[newIndex]){
        if(match.member1.id == oldValue.id)
          match.member1 = newValue
        else if(match.member2.id == oldValue.id)
          match.member2 = newValue
      }

      for(let member of arr_group[oldIndex]){
        var arr_opponent = []
        var opponent = {}
        for(let match of arr_match[oldIndex]){
          if(match.member1.id == member.id){
            opponent = match.member2
            opponent.match_date = match.date
            arr_opponent.push(opponent)
          }
          else if(match.member2.id == member.id){
            opponent = match.member1
            opponent.match_date = match.date
            arr_opponent.push(opponent)
          }
        }
        member.arr_opponent = arr_opponent
      }
      for(let member of arr_group[newIndex]){
        arr_opponent = [];
        opponent = {}
        for(let match of arr_match[newIndex]){
          if(match.member1.id == member.id){
            opponent = match.member2
            opponent.match_date = momentTZ(match.date)
            arr_opponent.push(opponent)
          }
          else if(match.member2.id == member.id){
            opponent = match.member1
            opponent.match_date = momentTZ(match.date)
            arr_opponent.push(opponent)
          }
        }
        member.arr_opponent = arr_opponent
      }

      this.arr_group = arr_group
      this.arr_match = arr_match
    },
    onSaveClicked(){
      this.$emit('onSaveClicked', this.arr_group, this.arr_match)
    },
  },
};
</script>