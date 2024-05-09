'use strict'

import router from './router.js';

const app = new Vue({
  el: '#app',
  components: {
    'myheader': httpVueLoader('./components/myheader.vue'),
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
  router: new VueRouter(router),
});
