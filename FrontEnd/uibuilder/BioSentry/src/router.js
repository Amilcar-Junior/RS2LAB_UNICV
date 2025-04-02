


const Perfil = httpVueLoader('./components/Pages/Settings/perfil.vue');
const ChangePassword = httpVueLoader('./components/Pages/Settings/ChangePassword.vue');
const PageNotFound = httpVueLoader('./components/PageNotFound.vue');

const ListTipoUtilizador = httpVueLoader('./components/Pages/TipoUtilizador/View.vue');
const CreateTipoUtilizador = httpVueLoader('./components/Pages/TipoUtilizador/Create.vue');
const EditTipoUtilizador = httpVueLoader('./components/Pages/TipoUtilizador/Edit.vue');


const ListUtilizador = httpVueLoader('./components/Pages/Utilizador/View.vue');
const CreateUtilizador = httpVueLoader('./components/Pages/Utilizador/Create.vue');
const EditUtilizador = httpVueLoader('./components/Pages/Utilizador/Edit.vue');


// BioSentry
const Dashboard = httpVueLoader('./components/Pages/Dashboard.vue');
const DeviceManagement = httpVueLoader('./components/Pages/DeviceManagement.vue');
const StudentsManagement = httpVueLoader('./components/Pages/StudentsManagement.vue');
const LogsStudents = httpVueLoader('./components/Pages/LogsStudents.vue');
const VisitManagement = httpVueLoader('./components/Pages/VisitManagement.vue');
const Relatorio = httpVueLoader('./components/Pages/Relatorio.vue');
export default {

    routes: [
        {
            path: '/',
            name: 'Dashboard', 
            component: Dashboard
        },
        {
            path: '*',
            name: 'PageNotFound',
            component: PageNotFound,
          },
        {
            path: '/perfil/:ID',
            name: 'Perfil',
            component: Perfil,
        },
        {
            path: '/alterarsenha/:ID',
            name: 'ChangePassword',
            component: ChangePassword,
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
        // {
        //     path:'/biosentry/dashboard',
        //     name:'DashboardB',
        //     component: DashboardB
        // },
        {
            path:'/biosentry/dispositivos',
            name:'DeviceManagement',
            component: DeviceManagement
        },
        {
            path:'/biosentry/gestao-alunos',
            name:'StudentsManagement',
            component: StudentsManagement
        },
        {
            path:'/biosentry/historico-acesso',
            name:'LogsStudents',
            component: LogsStudents
        },
        {
            path:'/biosentry/gestao-visitantes',
            name:'VisitManagement',
            component: VisitManagement
        },
        {
            path:'/biosentry/gerar-relatorio',
            name: 'Relatorio',
            component: Relatorio
        },

        
    ],
};