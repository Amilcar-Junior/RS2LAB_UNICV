const Home = httpVueLoader('./components/subcomponents/home.vue');
const Form = httpVueLoader('./components/subcomponents/form.vue');
const Table = httpVueLoader('./components/subcomponents/table.vue');
const Chart = httpVueLoader('./components/subcomponents/chart.vue');
const ListTipoUtilizador = httpVueLoader('./components/subcomponents/TipoUtilizador/View.vue');
const CreateTipoUtilizador = httpVueLoader('./components/subcomponents/TipoUtilizador/Create.vue');

export default {

    routes: [
        {
            path: '/',
            name: 'Home',
            components: Home
        },
        {
            path:'/home',
            name:'Home',
            component: Home
        },
        {
            path:'/form',
            name:'Form',
            component: Form
        },
        {
            path:'/table',
            name:'Table',
            component: Table
        },
        {
            path:'/chart',
            name:'Chart',
            component: Chart
        },
        {
            path:'/tipoutilizador',
            name:'ViewTipoUtilizador',
            component: ListTipoUtilizador
        },
        {
            path:'/tipoutilizador/create',
            name:'CreateTipoUtilizador',
            component: CreateTipoUtilizador
        },
    ],
};