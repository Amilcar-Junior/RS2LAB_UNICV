const Home = httpVueLoader('./components/subcomponents/home.vue');
const Perfil = httpVueLoader('./components/subcomponents/Settings/perfil.vue');

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

const ListTipoSensor = httpVueLoader('./components/subcomponents/TipoSensor/View.vue');
const CreateTipoSensor = httpVueLoader('./components/subcomponents/TipoSensor/Create.vue');
const EditTipoSensor = httpVueLoader('./components/subcomponents/TipoSensor/Edit.vue');

const ListAreaDeAgricultura = httpVueLoader('./components/subcomponents/AreaDeAgricultura/View.vue');
const CreateAreaDeAgricultura = httpVueLoader('./components/subcomponents/AreaDeAgricultura/Create.vue');
const EditAreaDeAgricultura = httpVueLoader('./components/subcomponents/AreaDeAgricultura/Edit.vue');

const ListLocal = httpVueLoader('./components/subcomponents/Local/View.vue');
const CreateLocal = httpVueLoader('./components/subcomponents/Local/Create.vue');
const EditLocal = httpVueLoader('./components/subcomponents/Local/Edit.vue');

const ListSensor = httpVueLoader('./components/subcomponents/Sensor/View.vue');
const CreateSensor = httpVueLoader('./components/subcomponents/Sensor/Create.vue');
const EditSensor = httpVueLoader('./components/subcomponents/Sensor/Edit.vue');

const ListValorSensor = httpVueLoader('./components/subcomponents/ValorSensor/View.vue');
const CreateValorSensor = httpVueLoader('./components/subcomponents/ValorSensor/Create.vue');
const EditValorSensor = httpVueLoader('./components/subcomponents/ValorSensor/Edit.vue');

const Dashboard = httpVueLoader('./components/subcomponents/Dashboard/Dashboard.vue');

export default {

    routes: [
        {
            path: '/',
            name: 'Dashboard',
            component: Dashboard
        },
        {
            path: '/perfil/:ID',
            name: 'Perfil',
            component: Perfil,
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: Dashboard,
        },
        // {
        //     path:'/form',
        //     name:'Form',
        //     component: Form
        // },
        // {
        //     path:'/table',
        //     name:'Table',
        //     component: Table
        // },
        // {
        //     path:'/chart',
        //     name:'Chart',
        //     component: Chart
        // },
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
        
        {
            path:'/tiposensor',
            name:'ViewTipoSensor',
            component: ListTipoSensor
        },
        {
            path:'/tiposensor/create',
            name:'CreateTipoSensor',
            component: CreateTipoSensor
        },
        {
            path:'/tiposensor/:ID/edit',
            name:'EditTipoSensor',
            component: EditTipoSensor
        },
        
        {
            path:'/areadeagricultura',
            name:'ViewAreaDeAgricultura',
            component: ListAreaDeAgricultura
        },
        {
            path:'/areadeagricultura/create',
            name:'CreateAreaDeAgricultura',
            component: CreateAreaDeAgricultura
        },
        {
            path:'/areadeagricultura/:ID/edit',
            name:'EditAreaDeAgricultura',
            component: EditAreaDeAgricultura
        },
        {
            path:'/local',
            name:'ViewLocal',
            component: ListLocal
        },
        {
            path:'/local/create',
            name:'CreateLocal',
            component: CreateLocal
        },
        {
            path:'/local/:ID/edit',
            name:'EditLocal',
            component: EditLocal
        },
        {
            path:'/sensor',
            name:'ViewSensor',
            component: ListSensor
        },
        {
            path:'/sensor/create',
            name:'CreateSensor',
            component: CreateSensor
        },
        {
            path:'/sensor/:ID/edit',
            name:'EditSensor',
            component: EditSensor
        },
        {
            path:'/valorsensor',
            name:'ViewValorSensor',
            component: ListValorSensor
        },
        {
            path:'/valorsensor/create',
            name:'CreateValorSensor',
            component: CreateValorSensor
        },
        {
            path:'/valorsensor/:ID/edit',
            name:'EditValorSensor',
            component: EditValorSensor
        },
    ],
};