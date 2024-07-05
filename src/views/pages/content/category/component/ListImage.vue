<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-3" v-for="(image, index) in data.image" :key="index">
          <img src="image.url_image" width="100%"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Base from "@/Utils/base";

export default {
  props: ["data", ],
  components: { },
  data() {
    return {
      base: null,
    }
  },
  mounted() {
    this.base = new Base()
  },
  methods: {
  },
};
</script>