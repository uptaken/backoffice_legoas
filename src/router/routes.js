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
        component: () => import('../views/pages/account/change-password')
    },

    {
        path: '/custom',
        name: 'Custom',
        meta: { authRequired: true },
        component: () => import('../views/pages/custom')
    },

		{
				path: '/dictionary',
				name: 'Dictionary',
				meta: { authRequired: true },
				component: () => import('../views/pages/dictionary')
		},

		{
				path: '/location',
				name: 'Province & City',
				meta: { authRequired: true },
				component: () => import('../views/pages/location')
		},

		{
				path: '/role',
				name: 'Role',
				meta: { authRequired: true },
				component: () => import('../views/pages/roles')
		},

		{
				path: '/role/user',
				name: 'User Role',
				meta: { authRequired: true },
				component: () => import('../views/pages/user_roles')
		},

		{
				path: '/province',
				name: 'Province',
				meta: { authRequired: true },
				component: () => import('../views/pages/province')
		},

		{
				path: '/regency',
				name: 'Regency',
				meta: { authRequired: true },
				component: () => import('../views/pages/regency')
		},

		{
				path: '/partner',
				name: 'Partner',
				meta: { authRequired: true },
				component: () => import('../views/pages/partner')
		},

		{
				path: '/customer',
				name: 'Customer',
				meta: { authRequired: true },
				component: () => import('../views/pages/customer')
		},

		{
				path: '/office',
				name: 'Office',
				meta: { authRequired: true },
				component: () => import('../views/pages/office')
		},

		{
				path: '/customer',
				name: 'Customer',
				meta: { authRequired: true },
				component: () => import('../views/pages/customer')
		},

		{
				path: '/menu',
				name: 'Menu',
				meta: { authRequired: true },
				component: () => import('../views/pages/menu')
		},
]
