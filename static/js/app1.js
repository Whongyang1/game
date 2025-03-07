
var vw = new Vue({
  el: "#container",
  data: {
    nowIndex: 0,
    othersShow: true,
    copyBtn: null //存储初始化复制按钮事件
  },
  created: function created() {},
  methods: {
    showMoreGift: function showMoreGift() {
      this.othersShow = !this.othersShow;
    },
    backtop: function backtop() {
      let backTop = document.getElementById("container");
      backTop.scrollIntoView();
      // 动画效果
      backTop.scrollIntoView({ behavior: "smooth" });
    },
    goGift: function goGift() {
      let giftTop = document.getElementById("sshc_content_gifts");
      giftTop.scrollIntoView(false);
      // 动画效果
      giftTop.scrollIntoView({ behavior: "smooth" });
    },
    copyLink: function copyLink() {
      let _this = this;
      let clipboard = _this.copyBtn;
      clipboard.on("success", function() {
        console.log("复制成功");
      });
      clipboard.on("error", function() {
        console.log("复制失败");
      });
    },
    getCode: async function getCode(e) {
      let codeId = e.target.dataset.giftid;
      let gameName = e.target.dataset.gamename;
      let access_token = this.Util.Cookie().get("access_token");
      if (access_token == "undefined" || access_token == "") {
        window.location.href =
          window.Config.host +
          "/user/login?redirect=gamesite&gamename=" +
          gameName;
        return false;
      }
      let opt = {
        url: "/web/card/get",
        type: "POST",
        data: {
          access_token: access_token,
          card_id: codeId
        }
      };

      const result = await this.Util.getFetch(this, opt);
      if (result.code == 1) {
        //复制方法
        this.$refs.copyinput.value = result.data.card_code;

        if (this.Util.checkUA() == "ios") {
          this.$dialog
            .alert({
              title: "请长按复制兑换码，前往对应游戏内领取",
              message: result.data.card_code
            })
            .then(() => {
              this.$refs.copydata.click();
            });
        } else {
          this.$dialog
            .alert({
              title: "",
              message: "兑换码复制成功，请前往对应游戏内领取"
            })
            .then(() => {
              this.$refs.copydata.click();
            });
        }
      } else {
        this.$toast(result.msg);
      }
    },
    getGamename: function() {
      if (window.GlOBAL.PLATFORM_NAME) {
        return window.GlOBAL.PLATFORM_NAME;
      } else {
        return `梦玩游戏`;
      }
    },
    goDownload: function goDownload(e) {
      let ios_url = e.target.dataset.ios;
      let android_url = e.target.dataset.android;
      if (this.Util.checkUA() == "ios") {
        window.location.href = ios_url;
      } else {
        window.location.href = android_url;
      }
    }
  },
  mounted: function mounted() {
    //游戏特色轮播图片
    var swiper2 = new Swiper("#sshc_content_yxts", {
      slidesPerView: 3,
      spaceBetween: -10,
      centeredSlides: true,
      loop: true,
      autoplay: 3000,
      autoplayDisableOnInteraction: false,
      pagination: "#sshc_content_yxts .swiper-pagination",
      paginationClickable: true
    });

    //渲染复制组件
    this.copyBtn = new ClipboardJS(this.$refs.copydata);
    //引入JS
    this.Util = new util();
  }
});
