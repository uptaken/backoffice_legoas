<template>
  <div class="modal fade" id="please_wait_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Notice</h5>
        </div>
        <div class="modal-body">
          Please Wait {{ progress.toFixed(2).toLocaleString(base.locale_string) }}%
          <div class="progress" style="height: 1rem">
            <div class="progress-bar" role="progressbar" :style="{width: progress + '%'}" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Base from "@/Utils/base";

export default {
  props: ["progress",],
  data() {
    return {
      base: new Base(),
    };
  },
  watch: {
    progress(val){
      console.log(val)
    }
  },
  mounted() {
  }
};
</script>