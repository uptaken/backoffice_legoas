import axios from 'axios'
import moment from 'moment'
import $ from 'jquery'
import * as Realm from "realm-web"

export default class Base {
	host = "https://venust-api.quantumtri.com"
	url_api1 = ''
	// host = "https://student-open-api.quantumtri.com"
	// host = ""
	authorization = "Basic YXV0aGVudGljYXRpb246c3VwZXJzZWNyZXQ="
	url_api = this.host + "/api"
	version = ""
	locale_string = "id-ID"
	locale_timezone = "Asia/Jakarta"
	local_currency = "Rp."
	local_area_phone = "+62"
	wait_time = 50
	chunk_text_size = 28
	thread_total = 3
	date_format = 'DD-MM-YYYY'
	arr_lang_manual = []
	app_version = "0.0.0001"

	// mongodb_app_id = "application-0-viofrzf"
	// mongodb_token = ""
	// mongodb_user_email = "jbuwono@gmail.com"
	// mongodb_user_password = "123456789"
	// mongodb_service_name = "TestServiceName"

	mongodb_app_id = "fe-backoffice-ivuwfdf"
	// mongodb_token = "tBWH7QzbGoYcE6wYQyalbzEVA8J5uXb8NGTKnFlHb5phEfYEOY7qfmEBjAYHVTvn"
	mongodb_token = "FERrKK877KxNOBiX3ArYxpL4hMgYqNdILEZAZWb5dN615pbjfQh8IEdyMOvc5u7s"
	mongodb_user_email = ""
	mongodb_user_password = ""
	mongodb_service_name = "mongodb-atlas"

	no_profile_picture = require('../assets/png/no_profile_picture.png');
	img_500x300 = require('../assets/png/img_500x300.png');

	editorConfig = {
		height: '400px',
		extraPlugins: 'font, colorbutton, colordialog',
		colorButton_enableAutomatic: false,
		colorButton_enableMore: 'Automatic',
		resize_enabled: false
	}

	editorOption = {
		debug: 'info',
		placeholder: 'Type Here...',
		readOnly: true,
		theme: 'snow',
		modules: {
			toolbar: false
		},
	}

	constructor() {
		this.redirect_to_login()

		// this.host = "https://api.student-open.com"
    // this.host = "http://20.198.220.250:8080"
		this.url_api1 = process.env.VUE_APP_BACKEND_URL
    this.url_api = process.env.VUE_APP_BACKEND_ANONYMOUS_URL
		this.locale_timezone = process.env.VUE_APP_DEFAULT_TZ
	}

	async connect_mongodb(){
		const app = new Realm.App({ id: process.env.VUE_APP_MONGODB_APP_ID, timeout: 3600000, })
		if(app.currentUser == null){
			if(process.env.VUE_APP_MONGODB_TOKEN != '')
				await app.logIn(Realm.Credentials.apiKey(process.env.VUE_APP_MONGODB_TOKEN))
			else
				await app.logIn(Realm.Credentials.emailPassword(process.env.VUE_APP_MONGODB_USER_EMAIL, process.env.VUE_APP_MONGODB_USER_PASSWORD))
		}

		const mongo = app.currentUser.mongoClient(process.env.VUE_APP_MONGODB_SERVICE_NAME)

		return mongo
	}

	async request(url, method = 'get', data = {}, with_modal = true, onUploadProgress = () => { }) {
		try {
			axios.defaults.headers.common['Accept'] = null

			var context = this
			var header = {
				"Content-Type": "application/json",
			}

			var token = await window.localStorage.getItem('token')
			var temp_token = await window.localStorage.getItem('temp_token')
			if (token != null && token != '')
				header['Authorization'] = token
			else if (temp_token != null && temp_token != '')
				header['Authorization'] = temp_token
			else
				header['Authorization'] = this.authorization


			var response
			if (method === 'get') {
				for (let x in data)
					url += (url.includes('?') ? '&' : '?') + x + "=" + (Array.isArray(data[x]) ? JSON.stringify(data[x]) : data[x])

				response = await axios.get(url, {
					headers: header,
				})
					.catch(function (error) {
						if(error.response.status == 401){
							window.localStorage.clear()
							window.location.href = '/login'
						}
						else if (error.response) {
							context.show_error(JSON.stringify(error.response.data))
						}
					})
			}
			else if (method === 'post') {
				response = await axios.post(url, data, {
					headers: header,
					onUploadProgress
				})
					.catch(function (error) {
						if(error.response.status == 401){
							window.localStorage.clear()
							window.location.href = '/login'
						}
						else if (error.response) {
							context.show_error(JSON.stringify(error.response.data))
						}
					})

			}
			else if (method === 'put') {
				response = await axios.put(url, data, {
					headers: header,
					onUploadProgress
				})
					.catch(function (error) {
						if(error.response.status == 401){
							window.localStorage.clear()
							window.location.href = '/login'
						}
						else if (error.response) {
							context.show_error(JSON.stringify(error.response.data))
						}
					})
			}
			else if (method === 'delete') {
				response = await axios.delete(url, {
					// data: data,
					headers: header,
				})
					.catch(function (error) {
						if(error.response.status == 401){
							window.localStorage.clear()
							window.location.href = '/login'
						}
						else if (error.response) {
							context.show_error(JSON.stringify(error.response.data))
						}
					})
			}

			if (with_modal) {
				setTimeout(() => {
				}, 500)
			}

			// axios.interceptors.response.use(function(response) {
			// 	console.log(response.headers); // "2.0.0"
			// 	return response; // continue with response
			// });

			var arr_header = {}
			for(let header of Object.entries(response.headers)){
				arr_header[header[0]] = header[1]

			}
			response.arrCustomResponseHeader = arr_header

			if (response.status !== 401) {
				return response
			}
			else {
				window.localStorage.clear()
				window.location.href = '/login'
			}
		} catch (error) {
			// console.log(error)
			// console.log(response)
			// console.log(error.response.data)
		}
	}

	async save_current_page(title, is_reset = false){
		var arr_pages = await window.localStorage.getItem('arr_pages')
		arr_pages = arr_pages != null && !is_reset ? JSON.parse(arr_pages) : []

		var counter = 0
		for(let page of arr_pages){
			if(title == page.name)
				break
			counter++
		}

		if(counter == arr_pages.length)
			arr_pages.push({
				name: title,
				url: window.location.href,
			})
		window.localStorage.setItem('arr_pages', JSON.stringify(arr_pages))
	}

	async back_page(with_redirect = true, how_many = 1){
		var arr_pages = await window.localStorage.getItem('arr_pages')
		arr_pages = JSON.parse(arr_pages)

		for(let x = 1; x <= how_many; x++)
			arr_pages.pop()
		var obj = arr_pages[arr_pages.length - 1]

		window.localStorage.setItem('arr_pages', JSON.stringify(arr_pages))

		if(with_redirect)
			window.location.href = obj.url
	}

	async save_tab(title, tab_data, selected_index = 0){
		var arr_pages = await window.localStorage.getItem('arr_pages')
		arr_pages = arr_pages != null ? JSON.parse(arr_pages) : []

		for(let page of arr_pages){
			if(title == page.name){
				var arr_menu = []
				if(page.arr_menu != null)
					arr_menu = page.arr_menu

				arr_menu[selected_index] = tab_data
				page.arr_menu = arr_menu
				break
			}
		}

		window.localStorage.setItem('arr_pages', JSON.stringify(arr_pages))
	}

	async get_tab(title, arr_tabs, selected_index = 0){
		var arr_pages = await window.localStorage.getItem('arr_pages')
		arr_pages = arr_pages != null ? JSON.parse(arr_pages) : []

		var selected_page = {}
		for(let page of arr_pages){
			if(title == page.name){
				selected_page = page
			}
		}

		var index = 0
		if(selected_page.arr_menu[selected_index] != null){
			for(let x in arr_tabs){
				if(arr_tabs[x].id == selected_page.arr_menu[selected_index].id){
					index = x
					break
				}
			}
		}

		return index
	}

	async check_token_expired() {
		var token_expired = window.localStorage.getItem('token_expired')
		if (window.location.pathname !== '/login') {
			if (token_expired != null) {
				token_expired = moment(token_expired)

				if (moment() <= token_expired) {
					window.localStorage.setItem('token_expired', moment().add(1, 'd').format('YYYY-MM-DD HH:mm:ss'))
				}
				else {
					return false
				}
			}
			else {
				return false
			}
		}
		return true
	}

	async getRouteNoAuth(){
		var arr = ['/login', '/otp', '/choose-role']
		var flag = false
		for(let route of arr){
			if(window.location.pathname == route){
				flag = true
				break
			}
		}
		return flag
	}

	async redirect_to_login() {
		var token = await window.localStorage.getItem('token')
		var response = await this.check_token_expired()
		var routeNoAuth = await this.getRouteNoAuth()

		if ((token === '' || token == null || !response) && !routeNoAuth) {
			window.localStorage.clear()
			window.location.href = '/login'
		}
	}

	url_photo(type, file_name) {
		var image_url = this.host + '/media/' + type + '?file_name=' + file_name + '&random=' + new Date().getTime()
		return image_url
	}

	validate_email(email) {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
	}

	check_phone_format(data) {
		return data.length > 0 && data[data.length - 1].match(/^[\d\s]+$/g) == null ? data.substring(0, data.length - 1) : data
	}

	str_to_double(data, default_value = '0') {
		var value
		if (data != '')
			value = parseFloat(data.replace(/\./g, '').replace(/,/g, '.'))
		else
			value = default_value
		return value
	}

	responsive_scroll_threshold(value, additional_margin = 0) {
		if (window.screen.width < 720)
			value = value * (12 / 16) + additional_margin
		else if (window.screen.width >= 720 && window.screen.width < 960)
			value = value * (12 / 16) + additional_margin
		return value
	}

	phone_validation(data, max_length = 12) {
		data = String(this.str_to_double(data, ''))
		if (isNaN(data))
			data = '0'
		if (data.charAt(0) === '0')
			data = data.slice(1)
		if (max_length > 0 && data.length > max_length)
			data = data.substring(0, max_length)
		return data
	}

	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	async request_chunk(url, method, data, onProgressChanged, typeOnSuccess = "redirect", redirectUrl = ""){
		// data.content = "<asdasdasdasdasdasdasdasdasdas style=\"adasdasd\""

		if(data.content != null){
			data.content = data.content.replace(/&nbsp;/g, ' ')
			var arr_chunk = []
			for(let x = 0; x < data.content.length; x++){
				if(x == (arr_chunk.length + 1) * this.chunk_text_size)
					arr_chunk.push(data.content.substring(arr_chunk.length * this.chunk_text_size, (arr_chunk.length + 1) * this.chunk_text_size))
				else if(x == data.content.length - 1)
					arr_chunk.push(data.content.substring(arr_chunk.length * this.chunk_text_size))
			}
		}
    // var total_per_thread = arr_chunk.length / this.thread_total

    $('#please_wait_modal').modal('show')

    var response = await this.request(url, method, data);
    if (response != null) {
      if (response.status == "success") {
				if(typeOnSuccess == "redirect")
					window.location.href = redirectUrl
				else if(typeOnSuccess == "reload")
					window.location.reload()
      }
      else if (response.status == "error"){
        $('#please_wait_modal').modal('hide')
        this.show_error(response.message)
      }
    }
    else{
      $('#please_wait_modal').modal('hide')
      this.show_error('Server Error')
    }

    // var response_data = {}
    // var counter = 0
    // var is_inside_tag = false
    // data.content = null
    // for(let chunk of arr_chunk){
		// 	var chunk_format = ""
		// 	var index = 0
		// 	var is_first_space = true
		// 	for(let x in chunk){
		// 		if(chunk[x] != " "){
		// 			index = x
		// 			is_first_space = false
		// 		}

		// 		if(chunk[x] == "<")
		// 			is_inside_tag = true
		// 		else if(chunk[x] == ">")
		// 			is_inside_tag = false

		// 		if(!is_inside_tag && is_first_space)
		// 			chunk_format += "&nbsp;"
		// 	}
		// 	chunk_format += chunk.substring(index)
    //   data.chunk_content = '(' + chunk_format + ')'
    //   data.index = counter

    //   var response = await this.request(url, counter == 0 ? method : 'put', data);

    //   if (response != null) {
    //     if (response.status == "success") {
    //       data.id = response.data.id
    //     }
    //     else if (response.status == "error"){
    //       window.$('#please_wait_modal').modal('hide')
    //       this.show_error(response.message)
    //       break
    //     }
    //   }
    //   else{
    //     window.$('#please_wait_modal').modal('hide')
    //     this.show_error('Server Error')

		// 		// if(typeOnSuccess == "redirect")
		// 		// 	window.location.href = redirectUrl
		// 		// else if(typeOnSuccess == "reload")
		// 		// 	window.location.reload()

    //     break
    //   }
    //   counter++
    //   onProgressChanged(counter / arr_chunk.length * 100)
    // }

    // if(counter == arr_chunk.length){
    //   if(typeOnSuccess == "redirect")
    //     window.location.href = redirectUrl
    //   else if(typeOnSuccess == "reload")
    //     window.location.reload()
    // }
	}

	async init_editor(element = 'editor') {
		var editor = await window.CKEDITOR.ClassicEditor
			.create(document.querySelector('#' + element), {
				toolbar: {
					items: [
						'exportPDF', 'exportWord', '|',
						'findAndReplace', 'selectAll', '|',
						'heading', '|',
						'bold', 'italic', 'strikethrough', 'underline', 'code', 'subscript', 'superscript', 'removeFormat', '|',
						'bulletedList', 'numberedList', 'todoList', '|',
						'outdent', 'indent', '|',
						'undo', 'redo',
						'-',
						'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'highlight', '|',
						'alignment', '|',
						'link', 'insertImage', 'blockQuote', 'insertTable', 'mediaEmbed', 'codeBlock', 'htmlEmbed', '|',
						'specialCharacters', 'horizontalLine', 'pageBreak', '|',
						'textPartLanguage', '|',
						'sourceEditing'
					],
					shouldNotGroupWhenFull: true
				},
				// Changing the language of the interface requires loading the language file using the <script> tag.
				// language: 'es',
				list: {
					properties: {
						styles: true,
						startIndex: true,
						reversed: true
					}
				},
				// https://ckeditor.com/docs/ckeditor5/latest/features/headings.html#configuration
				heading: {
					options: [
						{ model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
						{ model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
						{ model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
						{ model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
						{ model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
						{ model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
						{ model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
					]
				},
				// https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-family-feature
				fontFamily: {
					options: [
						'default',
						'Arial, Helvetica, sans-serif',
						'Courier New, Courier, monospace',
						'Georgia, serif',
						'Lucida Sans Unicode, Lucida Grande, sans-serif',
						'Tahoma, Geneva, sans-serif',
						'Times New Roman, Times, serif',
						'Trebuchet MS, Helvetica, sans-serif',
						'Verdana, Geneva, sans-serif'
					],
					supportAllValues: true
				},
				// https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-size-feature
				fontSize: {
					options: [10, 12, 14, 'default', 18, 20, 22],
					supportAllValues: true
				},
				// Be careful with the setting below. It instructs CKEditor to accept ALL HTML markup.
				// https://ckeditor.com/docs/ckeditor5/latest/features/general-html-support.html#enabling-all-html-features
				htmlSupport: {
					allow: [
						{
							name: /.*/,
							attributes: true,
							classes: true,
							styles: true
						}
					]
				},
				// Be careful with enabling previews
				// https://ckeditor.com/docs/ckeditor5/latest/features/html-embed.html#content-previews
				htmlEmbed: {
					showPreviews: true
				},
				// https://ckeditor.com/docs/ckeditor5/latest/features/link.html#custom-link-attributes-decorators
				link: {
					decorators: {
						addTargetToExternalLinks: true,
						defaultProtocol: 'https://',
						toggleDownloadable: {
							mode: 'manual',
							label: 'Downloadable',
							attributes: {
								download: 'file'
							}
						}
					}
				},
				// https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html#configuration
				mention: {
					feeds: [
						{
							marker: '@',
							feed: [
								'@apple', '@bears', '@brownie', '@cake', '@cake', '@candy', '@canes', '@chocolate', '@cookie', '@cotton', '@cream',
								'@cupcake', '@danish', '@donut', '@dragée', '@fruitcake', '@gingerbread', '@gummi', '@ice', '@jelly-o',
								'@liquorice', '@macaroon', '@marzipan', '@oat', '@pie', '@plum', '@pudding', '@sesame', '@snaps', '@soufflé',
								'@sugar', '@sweet', '@topping', '@wafer'
							],
							minimumCharacters: 1
						}
					]
				},
				// The "super-build" contains more premium features that require additional configuration, disable them below.
				// Do not turn them on unless you read the documentation and know how to configure them and setup the editor.
				removePlugins: [
					// These two are commercial, but you can try them out without registering to a trial.
					// 'ExportPdf',
					// 'ExportWord',
					'CKBox',
					'CKFinder',
					'EasyImage',
					// This sample uses the Base64UploadAdapter to handle image uploads as it requires no configuration.
					// https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/base64-upload-adapter.html
					// Storing images as Base64 is usually a very bad idea.
					// Replace it on production website with other solutions:
					// https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/image-upload.html
					// 'Base64UploadAdapter',
					'RealTimeCollaborativeComments',
					'RealTimeCollaborativeTrackChanges',
					'RealTimeCollaborativeRevisionHistory',
					'PresenceList',
					'Comments',
					'TrackChanges',
					'TrackChangesData',
					'RevisionHistory',
					'Pagination',
					'WProofreader',
					// Careful, with the Mathtype plugin CKEditor will not load when loading this sample
					// from a local file system (file://) - load this site via HTTP server if you enable MathType.
					'MathType',
					// The following features are part of the Productivity Pack and require additional license.
					'SlashCommand',
					'Template',
					'DocumentOutline',
					'FormatPainter',
					'TableOfContents',
					'PasteFromOfficeEnhanced'
				],
				value: 'test',
			})
			.catch(error => {
				console.error(error);
			});

		return editor
	}

	to_currency_format(data, max_number = 100000000, max_comma_length = 2) {
		var value = data

		if (value[value.length - 1] !== ",") {
			var is_include_comma = false
			var is_convert_double = true
			var index_comma = 0
			for (let x = 0; x < value.length; x++) {
				if (value[x] === ",") {
					is_include_comma = true
					index_comma = x
				}
				else if (is_include_comma && x == value.length - 1 && value[x] === "0")
					is_convert_double = false
			}

			if (is_include_comma) {
				is_convert_double = value.length - index_comma > max_comma_length && value[value.length - 2] !== "0"
				value = value.substring(0, index_comma + 1 + max_comma_length)
			}


			if (is_convert_double) {
				value = this.str_to_double(value)
				if (isNaN(value))
					value = 0
				if (value > max_number)
					value = max_number
			}
		}

		return value.toLocaleString(this.locale_string)
	}

	show_error(message = "") {
		// showSnackBar({
		//   message: message,
		//   textColor: '#FFF',      // message text color
		//   position: 'top',  // enum(top/bottom).
		//   confirmText: '', // button text.
		//   duration: 2000,   // (in ms), duartion for which snackbar is visible.
		// })
		alert(message)
		// this.$toasted.show(message)
		sessionStorage.removeItem('message')
	}
}
