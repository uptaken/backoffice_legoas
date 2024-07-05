<template>
  <div>
    <div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" :disabled="readOnly" :id="'contentTypeEditor' + id" v-model="content_type" value="editor">
        <label class="form-check-label" :for="'contentTypeEditor' + id">Editor</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" :disabled="readOnly" :id="'contentTypeRaw' + id" v-model="content_type" value="raw">
        <label class="form-check-label" :for="'contentTypeRaw' + id">Raw</label>
      </div>
    </div>
    <div>
      <div :id="'container-editor-' + id">
        <div :id="'editor' + (id != null ? id : '')" ref="editor" v-show="content_type == 'editor'"></div>
      </div>
      <div class="form-group" v-show="content_type == 'raw'">
        <textarea class="form-control" v-model="content" style="height: 20rem;" :readonly="readOnly"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["readOnly", "value", "element", "id", "contentType", "forceReload", ],
  data() {
    return {
      editor: null,
      is_first_time: true,
      content_type: 'editor',
      content: "",
    };
  },
  watch: {
    readOnly(val) {
      if (this.editor != null) {
        if (val) this.editor.enableReadOnlyMode("editor");
        else this.editor.disableReadOnlyMode("editor");
      }
    },
    // withFirstTime(val){
    //   console.log(val)
    // },
    is_first_time(val){
      if(this.value != null && this.value != "" && this.editor != null && val){
        this.editor.setData(this.value)
        this.content = this.value
      }
      this.is_first_time = false
    },
    forceReload(val){
      if(!val)
        this.is_first_time = true
    },
    value(val){
      if(val != null && val != "" && this.editor != null && this.is_first_time){

        this.editor.setData(val)
        this.content = val
      }
      this.is_first_time = false
    },
    editor(val){
      if(val != null){
        if(this.readOnly != null){
          if (this.readOnly) val.enableReadOnlyMode("editor");
          else val.disableReadOnlyMode("editor");
        }

        if(this.value != null && this.value != ''){
          val.setData(this.value)
          this.content = this.value
          this.is_first_time = false
        }

        val.model.document.on( 'change:data', () => {
          // console.log(val.getData())
          this.$emit("onDataChanged", val.getData())
        });
      }
    },
    contentType(val){
      this.content_type = val
    },
    content_type(val){
      if(val == "editor") window.$('#container-editor-' + this.id).removeClass('d-none')
      else window.$('#container-editor-' + this.id).addClass('d-none')
      this.$emit("onContentTypeChanged", val)
    },
  },
  mounted() {
    var context = this;
    window.CKEDITOR.ClassicEditor.create(
      this.$refs.editor,
      {
        toolbar: {
          items: [
            "exportPDF",
            "exportWord",
            "|",
            "findAndReplace",
            "selectAll",
            "|",
            "heading",
            "|",
            "bold",
            "italic",
            "strikethrough",
            "underline",
            "code",
            "subscript",
            "superscript",
            "removeFormat",
            "|",
            "bulletedList",
            "numberedList",
            "todoList",
            "|",
            "outdent",
            "indent",
            "|",
            "undo",
            "redo",
            "-",
            "fontSize",
            "fontFamily",
            "fontColor",
            "fontBackgroundColor",
            "highlight",
            "|",
            "alignment",
            "|",
            "link",
            "insertImage",
            "blockQuote",
            "insertTable",
            "mediaEmbed",
            "codeBlock",
            "htmlEmbed",
            "|",
            "specialCharacters",
            "horizontalLine",
            "pageBreak",
            "|",
            "textPartLanguage",
            "|",
            "sourceEditing",
          ],
          shouldNotGroupWhenFull: true,
        },
        // Changing the language of the interface requires loading the language file using the <script> tag.
        // language: 'es',
        list: {
          properties: {
            styles: true,
            startIndex: true,
            reversed: true,
          },
        },
        // https://ckeditor.com/docs/ckeditor5/latest/features/headings.html#configuration
        heading: {
          options: [
            {
              model: "paragraph",
              title: "Paragraph",
              class: "ck-heading_paragraph",
            },
            {
              model: "heading1",
              view: "h1",
              title: "Heading 1",
              class: "ck-heading_heading1",
            },
            {
              model: "heading2",
              view: "h2",
              title: "Heading 2",
              class: "ck-heading_heading2",
            },
            {
              model: "heading3",
              view: "h3",
              title: "Heading 3",
              class: "ck-heading_heading3",
            },
            {
              model: "heading4",
              view: "h4",
              title: "Heading 4",
              class: "ck-heading_heading4",
            },
            {
              model: "heading5",
              view: "h5",
              title: "Heading 5",
              class: "ck-heading_heading5",
            },
            {
              model: "heading6",
              view: "h6",
              title: "Heading 6",
              class: "ck-heading_heading6",
            },
          ],
        },
        // https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-family-feature
        fontFamily: {
          options: [
            "default",
            "Arial, Helvetica, sans-serif",
            "Courier New, Courier, monospace",
            "Georgia, serif",
            "Lucida Sans Unicode, Lucida Grande, sans-serif",
            "Tahoma, Geneva, sans-serif",
            "Times New Roman, Times, serif",
            "Trebuchet MS, Helvetica, sans-serif",
            "Verdana, Geneva, sans-serif",
          ],
          supportAllValues: true,
        },
        // https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-size-feature
        fontSize: {
          options: [10, 12, 14, "default", 18, 20, 22],
          supportAllValues: true,
        },
        // Be careful with the setting below. It instructs CKEditor to accept ALL HTML markup.
        // https://ckeditor.com/docs/ckeditor5/latest/features/general-html-support.html#enabling-all-html-features
        htmlSupport: {
          allow: [
            {
              name: /.*/,
              attributes: true,
              classes: true,
              styles: true,
            },
          ],
        },
        // Be careful with enabling previews
        // https://ckeditor.com/docs/ckeditor5/latest/features/html-embed.html#content-previews
        htmlEmbed: {
          showPreviews: true,
        },
        // https://ckeditor.com/docs/ckeditor5/latest/features/link.html#custom-link-attributes-decorators
        link: {
          decorators: {
            addTargetToExternalLinks: true,
            defaultProtocol: "https://",
            toggleDownloadable: {
              mode: "manual",
              label: "Downloadable",
              attributes: {
                download: "file",
              },
            },
          },
        },
        // https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html#configuration
        mention: {
          feeds: [
            {
              marker: "@",
              feed: [
                "@apple",
                "@bears",
                "@brownie",
                "@cake",
                "@cake",
                "@candy",
                "@canes",
                "@chocolate",
                "@cookie",
                "@cotton",
                "@cream",
                "@cupcake",
                "@danish",
                "@donut",
                "@dragée",
                "@fruitcake",
                "@gingerbread",
                "@gummi",
                "@ice",
                "@jelly-o",
                "@liquorice",
                "@macaroon",
                "@marzipan",
                "@oat",
                "@pie",
                "@plum",
                "@pudding",
                "@sesame",
                "@snaps",
                "@soufflé",
                "@sugar",
                "@sweet",
                "@topping",
                "@wafer",
              ],
              minimumCharacters: 1,
            },
          ],
        },
        // The "super-build" contains more premium features that require additional configuration, disable them below.
        // Do not turn them on unless you read the documentation and know how to configure them and setup the editor.
        removePlugins: [
          // These two are commercial, but you can try them out without registering to a trial.
          // 'ExportPdf',
          // 'ExportWord',
          "CKBox",
          "CKFinder",
          "EasyImage",
          "SourceEditing",
          // This sample uses the Base64UploadAdapter to handle image uploads as it requires no configuration.
          // https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/base64-upload-adapter.html
          // Storing images as Base64 is usually a very bad idea.
          // Replace it on production website with other solutions:
          // https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/image-upload.html
          // 'Base64UploadAdapter',
          "RealTimeCollaborativeComments",
          "RealTimeCollaborativeTrackChanges",
          "RealTimeCollaborativeRevisionHistory",
          "PresenceList",
          "Comments",
          "TrackChanges",
          "TrackChangesData",
          "RevisionHistory",
          "Pagination",
          "WProofreader",
          // Careful, with the Mathtype plugin CKEditor will not load when loading this sample
          // from a local file system (file://) - load this site via HTTP server if you enable MathType.
          "MathType",
          // The following features are part of the Productivity Pack and require additional license.
          "SlashCommand",
          "Template",
          "DocumentOutline",
          "FormatPainter",
          "TableOfContents",
          "PasteFromOfficeEnhanced",
        ],
        value: "test",
      }
    )
      .then((newEditor) => {
        context.editor = newEditor;
      })
      .catch((error) => {
        console.error(error);
      });
  },
};
</script>