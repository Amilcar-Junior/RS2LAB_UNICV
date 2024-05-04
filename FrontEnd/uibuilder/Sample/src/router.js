const Home = httpVueLoader('./components/subcomponents/home.vue');
const Form = httpVueLoader('./components/subcomponents/form.vue');
const Table = httpVueLoader('./components/subcomponents/table.vue');
const Chart = httpVueLoader('./components/subcomponents/chart.vue');

const ListTipoUtilizador = httpVueLoader('./components/subcomponents/TipoUtilizador/View.vue');
const CreateTipoUtilizador = httpVueLoader('./components/subcomponents/TipoUtilizador/Create.vue');
const EditTipoUtilizador = httpVueLoader('./components/subcomponents/TipoUtilizador/Edit.vue');

const ListGrupoUtilizadores = httpVueLoader('./components/subcomponents/GrupoUtilizadores/View.vue');
const CreateGrupoUtilizadores = httpVueLoader('./components/subcomponents/GrupoUtilizadores/Create.vue');
const EditGrupoUtilizadores = httpVueLoader('./components/subcomponents/GrupoUtilizadores/Edit.vue');

const ListUtilizador = httpVueLoader('./components/subcomponents/Utilizador/View.vue');
const CreateUtilizador = httpVueLoader('./components/subcomponents/Utilizador/Create.vue');
const EditUtilizador = httpVueLoader('./components/subcomponents/Utilizador/Edit.vue');

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
        {
            path:'/tipoutilizador/:ID/edit',
            name:'EditTipoUtilizador',
            component: EditTipoUtilizador
        },
        {
            path:'/grupoutilizadores',
            name:'ViewGrupoUtilizadores',
            component: ListGrupoUtilizadores
        },
        {
            path:'/grupoutilizadores/create',
            name:'CreateGrupoUtilizadores',
            component: CreateGrupoUtilizadores
        },
        {
            path:'/grupoutilizadores/:ID/edit',
            name:'EditGrupoUtilizadores',
            component: EditGrupoUtilizadores
        },
        {
            path:'/utilizador',
            name:'ViewUtilizador',
            component: ListUtilizador
        },
        {
            path:'/utilizador/create',
            name:'CreateUtilizador',
            component: CreateUtilizador
        },
        {
            path:'/utilizador/:ID/edit',
            name:'EditUtilizador',
            component: EditUtilizador
        },
    ],
};