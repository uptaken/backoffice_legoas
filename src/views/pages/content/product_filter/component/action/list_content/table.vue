<template>
  <table class="table">
    <tr>
      <th>Name</th>
      <th>Action</th>
    </tr>
    <template v-if="arr.length > 0">
      <tr v-for="(data, index) in arr" :key="index">
        <td>{{ data.name }}</td>
        <td>
          <button class="btn btn-warning" @click="$emit('onEditClicked', index)">Edit</button>
          <button class="btn btn-danger ml-3" @click="$emit('onRemoveClicked', index)">Remove</button>
        </td>
      </tr>
    </template>
    <template v-else>
      <tr>
        <td colspan="2" class="text-center">No Data Found</td>
      </tr>
    </template>
  </table>
</template>

<script>
import Base from "@/Utils/base";

export default {
  props: ["arr", ],
  components: {  },
  data() {
    return {
      base: null,
    }
  },
  watch: {
    
  },
  mounted() {
    this.base = new Base()
  },
  methods: {
  },
};
</script>