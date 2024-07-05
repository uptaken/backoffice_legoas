<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import moment from 'moment'
import Base from "@/Utils/base";
import CustomTextareaArray from "@/views/layouts/CustomTextareaArray";


const base = new Base()
// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * Payment Method component
 */
export default {
    page: {
        title: "Payment Method",
        meta: [{ name: "description", content: appConfig.description }]
    },
    components: { Layout, PageHeader, CustomTextareaArray, },
    data() {
        return {
            tableData: [],
            title: "Payment Method",
            items: [
                {
                    text: "Tables",
                    href: "/"
                },
                {
                    text: "Payment Method",
                    active: true
                }
            ],
            arr_form: [
              {
                id: 'title',
                label: 'Title',
                type: 'text',
                num_prefix: 'Step ',
              },
              {
                id: 'content',
                label: 'Description',
                content_type_id: 'content_type',
                type: 'textarea',
              },
            ],
            progress: 0,
        };
    },
    created(){
      base.save_current_page('Payment Method', true)
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
        label="Payment Method" 
        url_path="how-payment"
        :with_image="false"
        :arr_form="arr_form"/>
    </div>
  </Layout>
</template>