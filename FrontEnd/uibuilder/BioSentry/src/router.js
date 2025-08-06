


const Perfil = httpVueLoader('./components/pages/Settings/perfil.vue');
const ChangePassword = httpVueLoader('./components/pages/Settings/ChangePassword.vue');
const PageNotFound = httpVueLoader('./components/PageNotFound.vue');
const PageNotPermited = httpVueLoader("./components/PageNotPermitted.vue");
const ListTipoUtilizador = httpVueLoader('./components/pages/TipoUtilizador/View.vue');
const CreateTipoUtilizador = httpVueLoader('./components/pages/TipoUtilizador/Create.vue');
const EditTipoUtilizador = httpVueLoader('./components/pages/TipoUtilizador/Edit.vue');


const ListUtilizador = httpVueLoader('./components/pages/Utilizador/View.vue');
const CreateUtilizador = httpVueLoader('./components/pages/Utilizador/Create.vue');
const EditUtilizador = httpVueLoader('./components/pages/Utilizador/Edit.vue');


// BioSentry
const Dashboard = httpVueLoader('./components/pages/Dashboard.vue');
const DeviceManagement = httpVueLoader('./components/pages/DeviceManagement.vue');
const StudentsManagement = httpVueLoader('./components/pages/StudentsManagement.vue');
const LogsStudents = httpVueLoader('./components/pages/LogsStudents.vue');
const VisitManagement = httpVueLoader('./components/pages/VisitManagement.vue');
const Relatorio = httpVueLoader('./components/pages/Relatorio.vue');

const routes = [
        {
            path: '/',
            name: 'Dashboard', 
            component: Dashboard,
            // meta: {
            //     requiresAuth: fa,
            //     roles: [
            //       'AdminBiosEntry'
            //     ],
            //   },
            
        },
        {
            path: '*',
            name: 'PageNotFound',
            component: PageNotFound,
          },
            {
              path: "/page-not-permitted",
              name: "PageNotPermited",
              component: PageNotPermited,
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
            component: ListTipoUtilizador,
            meta: {
                requiresAuth: true,
                roles: [
                   'AdminBiosEntry','Administrador', 'Gestor'
                ],
              },
        },
        {
            path:'/tipoutilizador/create',
            name:'CreateTipoUtilizador',
            component: CreateTipoUtilizador,
            meta: {
                requiresAuth: true,
                roles: [
                   'AdminBiosEntry','Administrador', 'Gestor'
                ],
              },
        },
        {
            path:'/tipoutilizador/:ID/edit',
            name:'EditTipoUtilizador',
            component: EditTipoUtilizador,
            meta: {
                requiresAuth: true,
                roles: [
                   'AdminBiosEntry','Administrador', 'Gestor'
                ],
              },
        },
        {
            path:'/biosentry/utilizador',
            name:'ViewUtilizador',
            component: ListUtilizador,
            meta: {
                requiresAuth: true,
                roles: [
                   'AdminBiosEntry','Administrador', 'Gestor'
                ],
              },
        },
        {
            path:'/biosentry/utilizador/create',
            name:'CreateUtilizador',
            component: CreateUtilizador,
            meta: {
                requiresAuth: true,
                roles: [
                   'AdminBiosEntry','Administrador', 'Gestor'
                ],
              },
        },
        {
            path:'/biosentry/utilizador/:ID/edit',
            name:'EditUtilizador',
            component: EditUtilizador,
            meta: {
                requiresAuth: true,
                roles: [
                   'AdminBiosEntry','Administrador', 'Gestor'
                ],
              },
        },
        // {
        //     path:'/biosentry/dashboard',
        //     name:'DashboardB',
        //     component: DashboardB
        // },
        {
            path:'/biosentry/dispositivos',
            name:'DeviceManagement',
            component: DeviceManagement,
            meta: {
              requiresAuth: true,
              roles: [
                'AdminBiosEntry','Administrador', 'Gestor'
              ],
            },
        },
        {
            path:'/biosentry/gestao-alunos',
            name:'StudentsManagement',
            component: StudentsManagement,
            meta: {
              requiresAuth: true,
              roles: [
                'AdminBiosEntry','Administrador', 'Gestor', 'Guarda'
              ],
            },
        },
        {
            path:'/biosentry/historico-acesso',
            name:'LogsStudents',
            component: LogsStudents,
            meta: {
              requiresAuth: true,
              roles: [
                 'AdminBiosEntry','Administrador', 'Gestor', 'Guarda'
                
              ],
            },
        },
        {
            path:'/biosentry/gestao-visitantes',
            name:'VisitManagement',
            component: VisitManagement,
            meta: {
              requiresAuth: true,
              roles: [
                 'AdminBiosEntry','Administrador', 'Gestor', 'Guarda'
                
              ],
            },
        },
        {
            path:'/biosentry/gerar-relatorio',
            name: 'Relatorio',
            component: Relatorio,
            meta: {
              requiresAuth: true,
              roles: [
                 'AdminBiosEntry','Administrador', 'Gestor', 'Guarda'
                
              ],
            },
        },
        
    ];

// Configuração do router
const router = new VueRouter({
  mode: "hash",
  routes,
});

// Verificação de permissões no `beforeEach`
router.beforeEach((to, from, next) => {
  // Obter os dados do utilizador logado do localStorage
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  // Verificar se a rota requer autenticação
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Se não há utilizador logado ou não está autenticado
    if (!loggedUser || !loggedUser.islogged) {
      console.warn("Acesso negado: utilizador não autenticado.");
      return next({ path: "/page-not-permitted" });
    }

    // Verificar se a rota tem restrições de papéis
    const allowedRoles = to.meta.roles || [];

    // Se o utilizador tem uma função permitida, prosseguir
    if (allowedRoles.includes(loggedUser.TipoUtilizador_Nome)) {
      return next();
    } else {
      console.warn(
        "Acesso negado: função não permitida.",
        "Utilizador:",
        loggedUser.TipoUtilizador_Nome,
        "Rota:",
        to.fullPath
      );
      return next({ path: "/page-not-permitted" });
    }
  }

  // Para rotas públicas
  return next();
});

export default router;