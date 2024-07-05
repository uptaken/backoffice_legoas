<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-6">
          <div class="form-group">
            <label>Category</label>
            <input type="text" class="form-control" :value="data.category.name">
          </div>
        </div>
        <div class="col-6">
          <div class="form-group">
            <label>Sub Category</label>
            <input type="text" class="form-control" :value="data.sub_category.name">
          </div>
        </div>
        
        <div class="col-6">
          <div class="form-group">
            <label>Name</label>
            <input type="text" class="form-control" :value="data.name">
          </div>
        </div>
        
        <div class="col-6">
          <div class="form-group">
            <label>Description</label>
            <textarea class="form-control" :value="data.description"></textarea>
          </div>
        </div>
        
        <div class="col-6">
          <div class="form-group">
            <label>Price</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">Rp.</span>
              </div>
              <input type="text" class="form-control" :value="data.price.toLocaleString(base.locale_string)">
            </div>
          </div>
        </div>
        
        <div class="col-6">
          <div class="form-group">
            <label>Quantity</label>
            <div class="input-group">
              <input type="text" class="form-control" :value="data.quantity.toLocaleString(base.locale_string)">
              <div class="input-group-prepend">
                <span class="input-group-text">Pcs</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-6">
          <div class="form-group">
            <label>Image</label>
            <img :src="data.url_image" style="width: 10rem;"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomEditor from "@/views/layouts/CustomEditor";
import Base from "@/Utils/base";

export default {
  props: ["data", ],
  components: { CustomEditor, },
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