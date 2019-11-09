export default {
    state: {
        test: true, //this.$store.state.moduleOfSwitch.test
    },
    mutations: {
        // this.$store.commit("test");
        test: function(state) {
            console.log(123);
        }
    },
  }