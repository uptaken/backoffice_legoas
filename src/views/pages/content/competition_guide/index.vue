<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import moment from 'moment'
import $ from 'jquery'
import Base from "@/Utils/base";
import CustomTextareaArray from "@/views/layouts/CustomTextareaArray";

const base = new Base()
// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * Competition Guide component
 */
export default {
    page: {
        title: "Competition Guide",
        meta: [{ name: "description", content: appConfig.description }]
    },
    components: { Layout, PageHeader, CustomTextareaArray, },
    data() {
        return {
            tableData: [],
            title: "Competition Guide",
            items: [
                {
                    text: "Tables",
                    href: "/"
                },
                {
                    text: "Competition Guide",
                    active: true
                }
            ],
            arr_form: [
              {
                id: 'title',
                label: 'Title',
                type: 'text',
              },
              {
                id: 'document',
                label: 'Document',
                type: 'file',
              },
            ],
            progress: 0,
        };
    },
    created(){
      base.save_current_page('Competition Guide', true)
    },
    methods: {

    }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    

    <div>
      <CustomTextareaArray 
        label="Competition Guide" 
        url_path="competition-guide"
        :with_image="true"
        :arr_form="arr_form"/>
    </div>
  </Layout>
</template>