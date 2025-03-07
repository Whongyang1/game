var vw = new Vue({
  el: "#container",
  data: {
    //Action
  },
  methods: {
    back_one: function back_one() {
      window.history.go(-1);
    },
    goGift: function goGift(e) {
      let gameId = e.target.dataset.gameid;
      window.location.href = window.Config.host + "/gift?gameid=" + gameId;
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
    //引入JS
    this.Util = new util();
  }
});
