'use strict'

import router from './router.js';

// eslint-disable-next-line no-unused-vars
const app1 = new Vue({
    el: '#app',
    components: {
        'myheader':httpVueLoader('./components/myheader.vue'),
    },
    data(){
        return { };
    }, 
    computed:{
    },
    methods: {
    }, 
    mounted: function(){
        // Verifica se o caminho atual é diferente de '/'
        if (this.$route.path !== '/') {
          // Navega para o caminho atual apenas se não for '/'
          this.$router.push(this.$route.path);
        }
        uibuilder.start();
        var vueApp = this;
        uibuilder.onChange('msg', function(newVal) {
        });
      },
    router: new VueRouter(router),
})
