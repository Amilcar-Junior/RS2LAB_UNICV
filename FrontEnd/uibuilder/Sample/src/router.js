

const Perfil = httpVueLoader("./components/subcomponents/Settings/perfil.vue");
const ChangePassword = httpVueLoader(
  "./components/subcomponents/Settings/ChangePassword.vue"
);
const PageNotFound = httpVueLoader("./components/PageNotFound.vue");
const PageNotPermited = httpVueLoader("./components/PageNotPermitted.vue");

const ListTipoUtilizador = httpVueLoader(
  "./components/subcomponents/TipoUtilizador/View.vue"
);
const CreateTipoUtilizador = httpVueLoader(
  "./components/subcomponents/TipoUtilizador/Create.vue"
);
const EditTipoUtilizador = httpVueLoader(
  "./components/subcomponents/TipoUtilizador/Edit.vue"
);

const ListGrupoUtilizadores = httpVueLoader(
  "./components/subcomponents/GrupoUtilizadores/View.vue"
);
const CreateGrupoUtilizadores = httpVueLoader(
  "./components/subcomponents/GrupoUtilizadores/Create.vue"
);
const EditGrupoUtilizadores = httpVueLoader(
  "./components/subcomponents/GrupoUtilizadores/Edit.vue"
);

const ListUtilizador = httpVueLoader(
  "./components/subcomponents/Utilizador/View.vue"
);
const CreateUtilizador = httpVueLoader(
  "./components/subcomponents/Utilizador/Create.vue"
);
const EditUtilizador = httpVueLoader(
  "./components/subcomponents/Utilizador/Edit.vue"
);

const ListTipoSensor = httpVueLoader(
  "./components/subcomponents/TipoSensor/View.vue"
);
const CreateTipoSensor = httpVueLoader(
  "./components/subcomponents/TipoSensor/Create.vue"
);
const EditTipoSensor = httpVueLoader(
  "./components/subcomponents/TipoSensor/Edit.vue"
);

const ListAreaDeAgricultura = httpVueLoader(
  "./components/subcomponents/AreaDeAgricultura/View.vue"
);
const CreateAreaDeAgricultura = httpVueLoader(
  "./components/subcomponents/AreaDeAgricultura/Create.vue"
);
const EditAreaDeAgricultura = httpVueLoader(
  "./components/subcomponents/AreaDeAgricultura/Edit.vue"
);

const ListLocal = httpVueLoader("./components/subcomponents/Local/View.vue");
const CreateLocal = httpVueLoader(
  "./components/subcomponents/Local/Create.vue"
);
const EditLocal = httpVueLoader("./components/subcomponents/Local/Edit.vue");

const ListSensor = httpVueLoader("./components/subcomponents/Sensor/View.vue");
const CreateSensor = httpVueLoader(
  "./components/subcomponents/Sensor/Create.vue"
);
const EditSensor = httpVueLoader("./components/subcomponents/Sensor/Edit.vue");

const ListValorSensor = httpVueLoader(
  "./components/subcomponents/ValorSensor/View.vue"
);
const CreateValorSensor = httpVueLoader(
  "./components/subcomponents/ValorSensor/Create.vue"
);
const EditValorSensor = httpVueLoader(
  "./components/subcomponents/ValorSensor/Edit.vue"
);

const Map = httpVueLoader("./components/subcomponents/Dashboard/Map.vue");
const Dashboard = httpVueLoader(
  "./components/subcomponents/Dashboard/Dashboard.vue"
);
const Relatorio = httpVueLoader(
  "./components/subcomponents/Dashboard/Relatorio.vue"
);

const routes = [
  {
    path: "/",
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
];

// Configuração do router
const router = new VueRouter({
  mode: "hash",
  routes,
});

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
    } else {
      next(); // Para rotas públicas
    }
  });
  
  export default router;
  
