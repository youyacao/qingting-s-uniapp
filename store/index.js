import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import { User } from '@/common/api.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	getters,
	state: {
		systemInfo: null,
		appHide: false,
		userinfo: {
			avatar: '',
			username: '',
			nickname: '',
			desc: '',
			is_vip: 0
		},
		path: '/pages/home/home',
		pusherMode: 0
	},
	mutations: {
		setSystemInfo(state, data) {
			state.systemInfo = data
		},
		setAppHide(state, data) {
			state.appHide = data
		},
		setUserinfo(state, data) {
			state.userinfo = data
			uni.setStorage({
			    key: 'userinfo',
			    data,
			    success: () => {}
			})
		},
		setPath(state, path) {
			state.path = path
		},
		setPusherMode(state, data) {
			state.pusherMode = data
		}
	},
	actions: {
		updateUserinfo({ commit }) {
			User().then(({ code, data }) => {
				if (code === 200) {
					commit('setUserinfo', data)
				}
			})
		}
	}
})

export default store