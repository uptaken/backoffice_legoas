<script>
import Base from '@/Utils/base';
import CustomEditor from "../views/layouts/CustomEditor";
import 'quill/dist/quill.snow.css'
import { quillEditor } from 'vue-quill-editor'

import CKEditor from 'ckeditor4-vue'

const base = new Base()

export default {
    components: { quillEditor, CustomEditor, },
    props: {
        data_arr: {
            type: Array
        },
        action_btn: {
            type: Function
        },
        add_new_btn: {
            type: Function
        },
        id: String,
    },
    data() {
        return {
            editorOption: base.editorOption
        }
    },
    mounted(){
        console.log(this.id)
    },
    methods: {
    }
};
</script>

<template>
    <div class="row">
        <div class="col-12 mb-3" v-for="(data, index_data) in data_arr" :key="index_data">
            <div class="row">
                <div class="col-lg-1">
                    <h5 class="bg-primary text-center text-white" style="border-radius: 4px; padding: 1rem">
                        {{ index_data + 1 }}
                    </h5>
                </div>
                <div class="col-lg-9 mt-3 mt-lg-0">
                    <div class="row">
                        <div class="col-12">
                            <input for="text" v-model="data.title" class="form-control" :readonly="data.is_view_only" />
                        </div>
                        <div class="col-12 mt-3">
                            <!-- <ckeditor :editor="editor" v-model="data.content" :disabled="data.is_view_only" row></ckeditor> -->
                            <!-- <quill-editor v-model="data.content" :options="editorOption" :disabled="data.is_view_only" /> -->
                            <CustomEditor :id="(id != null ? id + '_' : '') + 'input_content' + index_data" :readOnly="data.is_view_only" :value="data.content" @onDataChanged="(val) => data.content = val"/>
                            <!-- <ckeditor v-model="data.content" :readOnly="data.is_view_only" :config="{
                                height: '100px',
                                extraPlugins: 'font, colorbutton, colordialog, easyimage',
                                colorButton_enableAutomatic: false,
                                colorButton_enableMore: 'Automatic',
                                resize_enabled: false,
                                removePlugins: 'elementspath, wsc,scayt, blockquote',
                                removeButtons: 'Anchor',
                                easyimage_uploadUrl: '/upload-image',
                                easyimage_jsonp: true,
                                basePath: '/public/',
                                contentsCss: ['/css/app.css'],
                                font_names: 'Arial; Times New Roman; Comic Sans MS; Courier New; Georgia; Tahoma; Verdana; Overpass; Poppins-Regular; Poppins-Italic; Poppins-Thin; Poppins-ThinItalic; Poppins-ExtraLight; Poppins-ExtraLightItalic; Poppins-Light; Poppins-LightItalic; Poppins-Medium; Poppins-MediumItalic; Poppins-SemiBold; Poppins-SemiBoldItalic; Poppins-Bold; Poppins-BoldItalic; Poppins-ExtraBold; Poppins-ExtraBoldItalic; Poppins-Black; Poppins-BlackItalic; impact; GothamBold; GothamBoldItalic; GothamBook; GothamBookItalic; GothamLight; GothamLightItalic; GothamMedium; GothamMediumItalic',
                            }" /> -->
                        </div>
                    </div>
                </div>
                <div class="col-lg-2 mt-3 mt-lg-0">
                    <button class="btn btn-primary rounded-circle mr-1 "
                        v-on:click="action_btn(index_data, (data.is_view_only ? 'edit' : 'save'))"><i
                            :class="(data.is_view_only ? 'mdi mdi-pencil' : 'mdi mdi-content-save')"></i></button>

                    <button v-if="data.id != null" class="btn rounded-circle ml-1 "
                        :class="(data.is_view_only ? 'btn-danger' : 'btn-warning')"
                        v-on:click="action_btn(index_data, data.is_view_only ? 'delete' : 'cancel')"><i class="mdi "
                            :class="(data.is_view_only ? 'mdi-trash-can' : 'mdi-close')"></i></button>
                    <button v-else class="btn rounded-circle ml-1 "
                        :class="(data.is_view_only ? 'btn-danger' : 'btn-warning')"
                        v-on:click="action_btn(index_data, 'delete')"><i class="mdi "
                            :class="(data.is_view_only ? 'mdi-trash-can' : 'mdi-close')"></i></button>
                </div>
            </div>
        </div>

        <div class="col-12 mt-2">
            <button class="btn btn-outline-primary w-100" style="border-style: dashed;" v-on:click="add_new_btn()">Add
                New</button>
        </div>
    </div>
</template>