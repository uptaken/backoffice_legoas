import store from '@/state/store'

export default [
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/pages/account/login'),
        meta: {
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters['auth/loggedIn']) {
                    // Redirect to the home page instead
                    next({ name: 'home' })
                } else {
                    // Continue to the login page
                    next()
                }
            },
        },
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/pages/account/register'),
        meta: {
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters['auth/loggedIn']) {
                    // Redirect to the home page instead
                    next({ name: 'home' })
                } else {
                    // Continue to the login page
                    next()
                }
            },
        },
    },
    {
        path: '/forgot-password',
        name: 'Forgot-password',
        component: () => import('../views/pages/account/forgot-password'),
        meta: {
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters['auth/loggedIn']) {
                    // Redirect to the home page instead
                    next({ name: 'home' })
                } else {
                    // Continue to the login page
                    next()
                }
            },
        },
    },
    {
        path: '/logout',
        name: 'logout',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
                    store.dispatch('auth/logOut')
                } else {
                    store.dispatch('authfack/logout')
                }
                const authRequiredOnPreviousRoute = routeFrom.matched.some(
                    (route) => route.push('/login')
                )
                // Navigate back to previous page, or home as a fallback
                next(authRequiredOnPreviousRoute ? { name: 'home' } : { ...routeFrom })
            },
        },
    },
    {
				path: '/otp',
				name: 'otp',
				component: () => import('../views/pages/account/OTP')
		},
		{
				path: '/choose-role',
				name: 'Choose Role',
				component: () => import('../views/pages/account/chooseRole')
		},
		{
        path: '/',
        name: 'home',
        meta: {
            authRequired: true,
        },
        component: () => import('../views/pages/dashboard/index')
    },

    {
        path: '/change-password',
        name: 'Change Password',
        meta: { authRequired: true },
        component: () => import('../views/pages/master/change-password')
    },


    {
        path: '/cms/home',
        name: 'Home',
        meta: { authRequired: true },
        component: () => import('../views/pages/master/cms/home')
    },
    {
        path: '/cms/logo',
        name: 'Logo',
        meta: { authRequired: true },
        component: () => import('../views/pages/master/cms/image_home_logo')
    },
    {
        path: '/cms/home/image-top',
        name: 'Home',
        meta: { authRequired: true },
        component: () => import('../views/pages/master/cms/image_home_top')
    },
    {
        path: '/cms/home/image-level3',
        name: 'Home',
        meta: { authRequired: true },
        component: () => import('../views/pages/master/cms/image_home_level3')
    },
    {
        path: '/cms/home/image-level2',
        name: 'Home',
        meta: { authRequired: true },
        component: () => import('../views/pages/master/cms/image_home_level2')
    },
    {
        path: '/cms/about-us',
        name: 'About Us',
        meta: { authRequired: true },
        component: () => import('../views/pages/master/cms/about_us')
    },
    {
        path: '/cms/setting',
        name: 'Setting',
        meta: { authRequired: true },
        component: () => import('../views/pages/master/cms/setting')
    },

    {
        path: '/banner',
        name: 'Banner',
        meta: { authRequired: true },
        component: () => import('../views/pages/content/banner')
    },
    {
        path: '/banner/action/add',
        name: 'Banner Form Add',
        meta: { authRequired: true },
        component: () => import('../views/pages/content/banner/form')
    },
    {
        path: '/banner/action/edit/:id',
        name: 'Banner Form Edit',
        meta: { authRequired: true },
        component: () => import('../views/pages/content/banner/form')
    },

    {
        path: '/setting',
        name: 'Setting',
        meta: { authRequired: true },
        component: () => import('../views/pages/content/setting')
    },
    
    {
        path: '/wa-number',
        name: 'WA Number',
        meta: { authRequired: true },
        component: () => import('../views/pages/content/wa_number')
    },
    {
        path: '/wa-number/action/add',
        name: 'WA Number Form Add',
        meta: { authRequired: true },
        component: () => import('../views/pages/content/wa_number/form')
    },
    {
        path: '/wa-number/action/edit/:id',
        name: 'WA Number Form Edit',
        meta: { authRequired: true },
        component: () => import('../views/pages/content/wa_number/form')
    },
    
    {
        path: '/category',
        name: 'Category',
        meta: { authRequired: true },
        component: () => import('../views/pages/content/category')
    },
    {
        path: '/category/action/add',
        name: 'Category Form Add',
        meta: { authRequired: true },
        component: () => import('../views/pages/content/category/action')
    },
    {
        path: '/category/action/edit/:id',
        name: 'Category Form Edit',
        meta: { authRequired: true },
        component: () => import('../views/pages/content/category/action')
    },
    
    {
        path: '/product-filter',
        name: 'Product Filter',
        meta: { authRequired: true },
        component: () => import('../views/pages/content/product_filter')
    },
    {
        path: '/product-filter/action/add',
        name: 'Product Filter Form Add',
        meta: { authRequired: true },
        component: () => import('../views/pages/content/product_filter/action')
    },
    {
        path: '/product-filter/action/edit/:id',
        name: 'Product Filter Form Edit',
        meta: { authRequired: true },
        component: () => import('../views/pages/content/product_filter/action')
    },
    
    {
        path: '/product',
        name: 'Product',
        meta: { authRequired: true },
        component: () => import('../views/pages/content/product')
    },
    {
        path: '/product/action/add',
        name: 'Product Form Add',
        meta: { authRequired: true },
        component: () => import('../views/pages/content/product/action')
    },
    {
        path: '/product/action/edit/:id',
        name: 'Product Form Edit',
        meta: { authRequired: true },
        component: () => import('../views/pages/content/product/action')
    },
    {
        path: '/product/detail/:id',
        name: 'Product Detail',
        meta: { authRequired: true },
        component: () => import('../views/pages/content/product/detail')
    },
]
