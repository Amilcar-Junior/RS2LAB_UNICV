const Perfil = httpVueLoader("./components/agriIOT/Settings/perfil.vue");
const ChangePassword = httpVueLoader(
  "./components/agriIOT/Settings/ChangePassword.vue"
);
const PageNotFound = httpVueLoader("./components/PageNotFound.vue");
const PageNotPermited = httpVueLoader("./components/PageNotPermitted.vue");

const ListTipoUtilizador = httpVueLoader(
  "./components/agriIOT/TipoUtilizador/View.vue"
);
const CreateTipoUtilizador = httpVueLoader(
  "./components/agriIOT/TipoUtilizador/Create.vue"
);
const EditTipoUtilizador = httpVueLoader(
  "./components/agriIOT/TipoUtilizador/Edit.vue"
);

const ListGrupoUtilizadores = httpVueLoader(
  "./components/agriIOT/GrupoUtilizadores/View.vue"
);
const CreateGrupoUtilizadores = httpVueLoader(
  "./components/agriIOT/GrupoUtilizadores/Create.vue"
);
const EditGrupoUtilizadores = httpVueLoader(
  "./components/agriIOT/GrupoUtilizadores/Edit.vue"
);

const ListUtilizador = httpVueLoader(
  "./components/agriIOT/Utilizador/View.vue"
);
const CreateUtilizador = httpVueLoader(
  "./components/agriIOT/Utilizador/Create.vue"
);
const EditUtilizador = httpVueLoader(
  "./components/agriIOT/Utilizador/Edit.vue"
);

const ListTipoSensor = httpVueLoader(
  "./components/agriIOT/TipoSensor/View.vue"
);
const CreateTipoSensor = httpVueLoader(
  "./components/agriIOT/TipoSensor/Create.vue"
);
const EditTipoSensor = httpVueLoader(
  "./components/agriIOT/TipoSensor/Edit.vue"
);

const ListAreaDeAgricultura = httpVueLoader(
  "./components/agriIOT/AreaDeAgricultura/View.vue"
);
const CreateAreaDeAgricultura = httpVueLoader(
  "./components/agriIOT/AreaDeAgricultura/Create.vue"
);
const EditAreaDeAgricultura = httpVueLoader(
  "./components/agriIOT/AreaDeAgricultura/Edit.vue"
);

const ListLocal = httpVueLoader("./components/agriIOT/Local/View.vue");
const CreateLocal = httpVueLoader(
  "./components/agriIOT/Local/Create.vue"
);
const EditLocal = httpVueLoader("./components/agriIOT/Local/Edit.vue");

const ListSensor = httpVueLoader("./components/agriIOT/Sensor/View.vue");
const CreateSensor = httpVueLoader(
  "./components/agriIOT/Sensor/Create.vue"
);
const EditSensor = httpVueLoader("./components/agriIOT/Sensor/Edit.vue");

const ListValorSensor = httpVueLoader(
  "./components/agriIOT/ValorSensor/View.vue"
);
const CreateValorSensor = httpVueLoader(
  "./components/agriIOT/ValorSensor/Create.vue"
);
const EditValorSensor = httpVueLoader(
  "./components/agriIOT/ValorSensor/Edit.vue"
);

const Map = httpVueLoader("./components/agriIOT/Dashboard/Map.vue");
const Dashboard = httpVueLoader(
  "./components/agriIOT/Dashboard/Dashboard.vue"
);
const Relatorio = httpVueLoader(
  "./components/agriIOT/Dashboard/Relatorio.vue"
);

// BioSentry
const DashboardB = httpVueLoader('./components/biosEntry/Dashboard.vue');
const DeviceManagement = httpVueLoader('./components/biosEntry/DeviceManagement.vue');
const StudentsManagement = httpVueLoader('./components/biosEntry/StudentsManagement.vue');
const LogsStudents = httpVueLoader('./components/biosEntry/LogsStudents.vue');
const VisitManagement = httpVueLoader('./components/biosEntry/VisitManagement.vue');
const RelatorioLogs = httpVueLoader('./components/biosEntry/Relatorio.vue');

const routes = [
  {
    path: "/",
    name: "Map",
    component: Map,
    meta: {
      requiresAuth: false,
      roles: [
        'Administrador',
        'Gestor',
        'Agricultor',
      ],
    },
  },
  {
    path: "*",
    name: "PageNotFound",
    component: PageNotFound,
  },
  {
    path: "/page-not-permitted",
    name: "PageNotPermited",
    component: PageNotPermited,
  },
  {
    path: "/perfil/:ID",
    name: "Perfil",
    component: Perfil,
  },
  {
    path: "/alterarsenha/:ID",
    name: "ChangePassword",
    component: ChangePassword,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true,
      roles: [
        'Administrador',
        'Gestor',
        'Agricultor',
      ],
    },
  },
  {
    path: "/map",
    name: "Map",
    component: Map,
    meta: {
      requiresAuth: true,
      roles: [
        'Administrador',
        'Gestor',
        'Agricultor',
      ],
    },
  },
  {
    path: "/relatorio",
    name: "Relatorio",
    component: Relatorio,
    meta: {
      requiresAuth: true,
      roles: [
        'Administrador',
        'Gestor',
        'Agricultor',
      ],
    },
  },
  {
    path: "/tipoutilizador",
    name: "ViewTipoUtilizador",
    component: ListTipoUtilizador,
    meta: { requiresAuth: true, roles: ['Administrador'] },
  },
  {
    path: "/tipoutilizador/create",
    name: "CreateTipoUtilizador",
    component: CreateTipoUtilizador,
    meta: { requiresAuth: true, roles: ['Administrador'] },
  },
  {
    path: "/tipoutilizador/:ID/edit",
    name: "EditTipoUtilizador",
    component: EditTipoUtilizador,
    meta: { requiresAuth: true, roles: ['Administrador'] },
  },
  {
    path: "/grupoutilizadores",
    name: "ViewGrupoUtilizadores",
    component: ListGrupoUtilizadores,
    meta: {
      requiresAuth: true,
      roles: ['Administrador', 'Gestor'],
    },
  },
  {
    path: "/grupoutilizadores/create",
    name: "CreateGrupoUtilizadores",
    component: CreateGrupoUtilizadores,
    meta: { requiresAuth: true, roles: ['Administrador'] },
  },
  {
    path: "/grupoutilizadores/:ID/edit",
    name: "EditGrupoUtilizadores",
    component: EditGrupoUtilizadores,
    meta: { requiresAuth: true, roles: ['Administrador'] },
  },
  {
    path: "/utilizador",
    name: "ViewUtilizador",
    component: ListUtilizador,
    meta: { requiresAuth: true, roles: ['Administrador'] },
  },
  {
    path: "/utilizador/create",
    name: "CreateUtilizador",
    component: CreateUtilizador,
    meta: { requiresAuth: true, roles: ['Administrador'] },
  },
  {
    path: "/utilizador/:ID/edit",
    name: "EditUtilizador",
    component: EditUtilizador,
    meta: { requiresAuth: true, roles: ['Administrador'] },
  },

  {
    path: "/tiposensor",
    name: "ViewTipoSensor",
    component: ListTipoSensor,
    meta: { requiresAuth: true, roles: ['Administrador'] },
  },
  {
    path: "/tiposensor/create",
    name: "CreateTipoSensor",
    component: CreateTipoSensor,
    meta: { requiresAuth: true, roles: ['Administrador'] },
  },
  {
    path: "/tiposensor/:ID/edit",
    name: "EditTipoSensor",
    component: EditTipoSensor,
    meta: { requiresAuth: true, roles: ['Administrador'] },
  },

  {
    path: "/areadeagricultura",
    name: "ViewAreaDeAgricultura",
    component: ListAreaDeAgricultura,
    meta: {
      requiresAuth: true,
      roles: ['Administrador', 'Gestor'],
    },
  },
  {
    path: "/areadeagricultura/create",
    name: "CreateAreaDeAgricultura",
    component: CreateAreaDeAgricultura,
    meta: {
      requiresAuth: true,
      roles: ['Administrador', 'Gestor'],
    },
  },
  {
    path: "/areadeagricultura/:ID/edit",
    name: "EditAreaDeAgricultura",
    component: EditAreaDeAgricultura,
    meta: {
      requiresAuth: true,
      roles: ['Administrador', 'Gestor'],
    },
  },
  {
    path: "/local",
    name: "ViewLocal",
    component: ListLocal,
    meta: { requiresAuth: true, roles: ['Administrador'] },
  },
  {
    path: "/local/create",
    name: "CreateLocal",
    component: CreateLocal,
    meta: { requiresAuth: true, roles: ['Administrador'] },
  },
  {
    path: "/local/:ID/edit",
    name: "EditLocal",
    component: EditLocal,
    meta: { requiresAuth: true, roles: ['Administrador'] },
  },
  {
    path: "/sensor",
    name: "ViewSensor",
    component: ListSensor,
    meta: {
      requiresAuth: true,
      roles: ['Administrador', 'Gestor'],
    },
  },
  {
    path: "/sensor/create",
    name: "CreateSensor",
    component: CreateSensor,
    meta: {
      requiresAuth: true,
      roles: ['Administrador', 'Gestor'],
    },
  },
  {
    path: "/sensor/:ID/edit",
    name: "EditSensor",
    component: EditSensor,
    meta: {
      requiresAuth: true,
      roles: ['Administrador', 'Gestor'],
    },
  },
  {
    path: "/topico",
    name: "ViewValorSensor",
    component: ListValorSensor,
    meta: {
      requiresAuth: true,
      roles: ['Administrador', 'Gestor'],
    },
  },
  {
    path: "/topico/create",
    name: "CreateValorSensor",
    component: CreateValorSensor,
    meta: {
      requiresAuth: true,
      roles: ['Administrador', 'Gestor'],
    },
  },
  {
    path: "/topico/:ID/edit",
    name: "EditValorSensor",
    component: EditValorSensor,
    meta: {
      requiresAuth: true,
      roles: ['Administrador', 'Gestor'],
    },
  },
  {
    path:'/biosentry/dashboard',
    name:'DashboardB',
    component: DashboardB,
    meta: {
      requiresAuth: false,
      roles: [
        'AdminBiosEntry'
        
      ],
    },
},
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
    component: RelatorioLogs,
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
