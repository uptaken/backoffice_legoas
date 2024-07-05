<script>
import Layout from "../../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import moment from 'moment'
import Base from "@/Utils/base";

// import { tableData } from "../../../tables/dataAdvancedtable";

const base = new Base()

/**
 * Artikel Lelang component
 */
export default {
    page: {
        title: "Artikel Lelang",
        meta: [{ name: "description", content: appConfig.description }]
    },
    components: { Layout, PageHeader },
    data() {
        return {
            tableData: [],
            title: "Artikel Lelang",
            items: [
                {
                    text: "Tables",
                    href: "/"
                },
                {
                    text: "Artikel Lelang",
                    active: true
                }
            ],
            totalRows: 1,
            currentPage: 1,
            perPage: 10,
            pageOptions: [10, 25, 50, 100],
            filter: null,
            filterOn: [],
            sortBy: "age",
            sortDesc: false,
            fields: [
                { key: "ID", sortable: true },
                { key: "Judul", sortable: true },
                { key: "Created Date", sortable: true },
                { key: "Publish Date", sortable: true },
                { key: "Status Publish", sortable: true },
                { key: "Primary", sortable: true },
                { key: "Action", sortable: false }
            ]
        };
    },
    computed: {
        /**
         * Total no. of records
         */
        rows() {
            return this.tableData.length;
        }
    },
    async mounted() {
        // Set the initial number of items
        await this.get_data()
    },
    methods: {
        /**
         * Search the table data with search input
         */
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
        async table_action_btn(type, row) {
            console.log(type)
            console.log(row)
            if(type === 'edit'){
                window.location.href = '/info-lelang/artikel-lelang/action/edit/' + row.item.ID
            }
            else if (type === 'delete') {
                var flag_delete = 1

                if (confirm('Are you sure want to delete this data?') == true) {
                    flag_delete = 1
                }
                else {
                    flag_delete = 0
                }

                if (flag_delete) {
                    var url = base.url_api + '/article'
                    var response = await base.request(url, "delete", {
                        id: row.item.ID,
                    });
                    if (response != null) {
                        if (response.status == "success") {
                            this.tableData.splice(row.index, 1);
                            window.location.reload()
                        }
                    }
                }
            }
        },
        async get_data() {
            var url = base.url_api + '/article'
            var response = await base.request(url);
            if (response != null) {
                if (response.status == "success") {
                    var response_data = response.data
                    var arr = []
                    for (var x in response_data) {
                        arr.push({
                            'ID': response_data[x].id,
                            'Judul': response_data[x].title,
                            'Created Date': moment(response_data[x].created_at).format('DD MMM YYYY'),
                            'Publish Date': moment(response_data[x].publish_at).format('DD MMM YYYY HH:mm'),
                            'Status Publish': (response_data[x].is_publish ? 'Published' : 'Not Publish'),
                            'Primary' : (response_data[x].is_primary ? 'Primary' : '-'),
                            'action': ''
                        })
                    }

                    this.tableData = arr
                    this.totalRows = arr.length;
                }
            }
        },
    }
};
</script>

<template>
    <Layout>
        <PageHeader :title="title" :items="items" />

        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div class="row mt-4">
                            <!-- Search -->
                            <div class="col-sm-12 col-md-6">
                                <div id="tickets-table_filter" class="dataTables_filter">
                                    <label class="d-inline-flex align-items-center">
                                        Search:
                                        <b-form-input v-model="filter" type="search" placeholder="Search..."
                                            class="form-control form-control-sm ml-2"></b-form-input>
                                    </label>
                                </div>
                            </div>
                            <!-- End search -->
                            <div class="col-sm-12 col-md-6">
                                <div class="text-md-right">
                                    <a href="/info-lelang/artikel-lelang/action/add" class="btn btn-sm btn-primary">Add
                                        Artikel</a>
                                </div>
                            </div>
                        </div>
                        <!-- Table -->
                        <div class="table-responsive mb-0 mt-3">
                            <b-table :items="tableData" :fields="fields" responsive="sm" :per-page="perPage"
                                :current-page="currentPage" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
                                :filter="filter" :filter-included-fields="filterOn" @filtered="onFiltered">
                                <template #cell(action)="row">
                                    <button class="btn btn-sm btn-primary rounded-circle mr-2"
                                        v-on:click="table_action_btn('edit', row)"><i class="mdi mdi-pencil"></i></button>
                                    <button class="btn btn-sm btn-danger rounded-circle mr-2"
                                        v-on:click="table_action_btn('delete', row)"><i
                                            class="mdi mdi-trash-can"></i></button>
                                </template>
                            </b-table>
                        </div>
                        <div class="row">
                            <div class="col">
                                <div class="dataTables_paginate paging_simple_numbers float-right">
                                    <ul class="pagination pagination-rounded mb-0">
                                        <!-- pagination -->
                                        <b-pagination v-model="currentPage" :total-rows="rows"
                                            :per-page="perPage"></b-pagination>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>