"use strict";

/*
全局组件
Jinlian

说明
冒泡组件

版本
1.0

依赖
statics/css/wap/gamesite/cshcan/common.css
vue.js

案例
<HeaderTop></HeaderTop>
*/
Vue.component("Headertop", {
	template: '<div><div class="seven_header_container" id="SevenHeader"><div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom"><div class="van-nav-bar__left" @click="toLogin"><i class="logo van-icon van-icon-undefined"></i></div><div class="van-nav-bar__title van-ellipsis"></div><div class="van-nav-bar__right"><a href="javascript:;" class="person_icon seven_header_container_right" @click="changeToast"></a><a href="javascript:;" class="setting_icon seven_header_container_right" @click="Util.jumplink(\'kefu\')"></a><div v-if="isShow" class="seven_header_container_toast"><ul><li><i class="icon_person"></i><p>{{username}}</p></li><li @click="Util.jumplink(\'user/center\')"><i class="icon_setting"></i><p>我的设置</p></li><li @click="checkIdcard"><i class="icon_idcard"></i><p>实名认证</p></li><li @click="toQuick"><i class="icon_quit"></i><p>退出登录</p></li></ul></div></div></div></div><div class="dialog_modal" v-if="isEnable"><div data-type="close" class="dialog_modal_marker"></div><div class="dialog_modal_content"><div class="dialog_modal_body"><div class="dialog_div"><span></span><p>你已经实名验证成功</p></div></div><div class="dialog_modal_footer"><a data-type="confirm" class="confirm_but" @click="confirmClose">知道了</a></div></div></div></div>',
	data: function data() {
		return {
			isLogin: false,
			username: "",
			isShow: false,
			isEnable: false
		};
	},
	methods: {
		checkIdcard: function checkIdcard() {
			if (window.userInfo.id_card) {
                this.isEnable = true;
			} else {
				window.location.href = window.Config.wapHost + "/user/trueName";
			}
		},
		confirmClose: function confirmClose() {
			this.isEnable = false;
		},
		judgeLogin: async function judgeLogin() {
			let access_token = this.Util.Cookie().get("access_token");
			if (access_token == "undefined" || access_token == "") {
				return false;
			}
			let opt = {
				url: "/web/user/userInfo",
				type: "POST",
				data: {
					access_token: access_token
				}
			};

			const res = await this.Util.getFetch(this, opt);
			if (res.code == 1) {
				this.isLogin = true;
				window.userInfo = res.data;
				this.username = res.data.username;
			} else {
				this.$toast(res.msg);
			}
		},
		toLogin: function toLogin() {
			window.location.href = window.Config.wapHost + "/user/login?redirect=gamesite&gamename=" +
			window.GlOBAL.GAME_ENNAME;
		},
		changeToast: function changeToast() {
			if (this.isLogin) {
				this.isShow = !this.isShow;
			} else {
        window.location.href =
          window.Config.wapHost +
          "/user/login?redirect=gamesite&gamename=" +
          window.GlOBAL.GAME_ENNAME;
			}
		},
		toQuick: async function toQuick() {
			//退出登录
			let access_token = this.Util.Cookie().get("access_token");
			if (access_token == "undefined" || access_token == "") {
				return false;
			}
			let opt = {
				url: "/web/user/loginOut",
				type: "POST",
				data: {
					access_token: access_token
				}
			};

			const res = await this.Util.getFetch(this, opt);
			if (res.code == 1) {
				//退出成功
				this.isLogin = false;
				window.userInfo = null;
				this.Util.Cookie().removeNet("access_token", window.Config.wapHost.replace(/^(http||https):\/\//, ""));
				window.location.reload();
			} else {
				this.$toast(res.msg);
			}
		}
	},
	mounted: function mounted() {
		//引入JS
		this.Util = new util();
		this.judgeLogin();
	}
});
