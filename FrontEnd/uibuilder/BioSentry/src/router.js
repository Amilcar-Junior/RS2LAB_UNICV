


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

const routes = [
        {
            path: '/',
            name: 'Dashboard', 
            component: Dashboard,
            meta: {
                requiresAuth: false,
                roles: [
                  'AdminBiosEntry'
                ],
              },
            
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
            component: ListTipoUtilizador,
            meta: {
                requiresAuth: false,
                roles: [
                  'AdminBiosEntry'
                ],
              },
        },
        {
            path:'/tipoutilizador/create',
            name:'CreateTipoUtilizador',
            component: CreateTipoUtilizador,
            meta: {
                requiresAuth: false,
                roles: [
                  'AdminBiosEntry'
                ],
              },
        },
        {
            path:'/tipoutilizador/:ID/edit',
            name:'EditTipoUtilizador',
            component: EditTipoUtilizador,
            meta: {
                requiresAuth: false,
                roles: [
                  'AdminBiosEntry'
                ],
              },
        },
        {
            path:'/utilizador',
            name:'ViewUtilizador',
            component: ListUtilizador,
            meta: {
                requiresAuth: false,
                roles: [
                  'AdminBiosEntry'
                ],
              },
        },
        {
            path:'/utilizador/create',
            name:'CreateUtilizador',
            component: CreateUtilizador,
            meta: {
                requiresAuth: false,
                roles: [
                  'AdminBiosEntry'
                ],
              },
        },
        {
            path:'/utilizador/:ID/edit',
            name:'EditUtilizador',
            component: EditUtilizador,
            meta: {
                requiresAuth: false,
                roles: [
                  'AdminBiosEntry'
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
              requiresAuth: false,
              roles: [
                'AdminBiosEntry'
              ],
            },
        },
        {
            path:'/biosentry/gestao-alunos',
            name:'StudentsManagement',
            component: StudentsManagement,
            meta: {
              requiresAuth: false,
              roles: [
                'AdminBiosEntry'
              ],
            },
        },
        {
            path:'/biosentry/historico-acesso',
            name:'LogsStudents',
            component: LogsStudents,
            meta: {
              requiresAuth: false,
              roles: [
                'AdminBiosEntry'
                
              ],
            },
        },
        {
            path:'/biosentry/gestao-visitantes',
            name:'VisitManagement',
            component: VisitManagement,
            meta: {
              requiresAuth: false,
              roles: [
                'AdminBiosEntry'
                
              ],
            },
        },
        {
            path:'/biosentry/gerar-relatorio',
            name: 'Relatorio',
            component: Relatorio,
            meta: {
              requiresAuth: false,
              roles: [
                'AdminBiosEntry'
                
              ],
            },
        },
        
    ];

    // Configuração do router
const router = new VueRouter({
    mode: "hash",
    routes,
  });
  
  export default router; // Add this line to export the router instance
  
  // Verificação de permissões no `beforeEach`
  
  router.beforeEach((to, from, next) => {
    
      // Obter os dados do utilizador logado do localStorage ou do sistema global
      const loggedUser = JSON.parse(localStorage.getItem("user"));
    
      // Verificar se a rota requer autenticação
      if (to.matched.some((record) => record.meta.requiresAuth)) {
    
        if (!loggedUser || !loggedUser.islogged) {
          console.warn("Acesso negado: utilizador não autenticado.");
          next({ path: "/page-not-permitted" });
        } else {
          // Check for AdminBiosEntry user type
          if (loggedUser.TipoUtilizador_Nome === 'AdminBiosEntry') {
            next({ path: '/biosentry/dashboard' }); // Redirect AdminBiosEntry to DashboardB
          } else {
            // Verificar se o utilizador tem permissão para a rota
            const allowedRoles = to.meta.roles || []; 
    
            if (allowedRoles.includes(loggedUser.TipoUtilizador_Nome)) {
              next(); // Tem permissão, continua
            } else {
              console.warn(
                "Acesso negado: função não permitida.",
                "Utilizador:",
                loggedUser.TipoUtilizador_Nome,
                "Rota:",
                to.fullPath
              );
              next({ path: "/page-not-permitted" });
            }
          }
        }
      } else {
        next(); // Para rotas públicas
      }
    });
  
