## GET All
msg.topic = `SELECT ID, Nome, Email, Senha, Avatar, ID_TipoUtilizador, isActive FROM rs2lab.Utilizador;`;
return msg;

## GET by ID
msg.topic = `SELECT ID, Nome, Email, Senha, Avatar, ID_TipoUtilizador, isActive FROM rs2lab.Utilizador WHERE ID = ${msg.req.params.ID};`;
return msg;

## Create
msg.topic = `INSERT INTO rs2lab.Utilizador (Nome, Email, Senha, Avatar, ID_TipoUtilizador, isActive) VALUES ('${msg.payload.Nome}', '${msg.payload.Email}', '${msg.payload.Senha}', '${msg.payload.Avatar}', ${msg.payload.ID_TipoUtilizador}, ${msg.payload.isActive});`;
return msg;

## Update
msg.topic = `UPDATE rs2lab.Utilizador SET Nome = '${msg.payload.Nome}', Email = '${msg.payload.Email}', Senha = '${msg.payload.Senha}', Avatar = '${msg.payload.Avatar}', ID_TipoUtilizador = ${msg.payload.ID_TipoUtilizador}, isActive = ${msg.payload.isActive} WHERE ID = ${msg.req.params.ID};`;
return msg;

## Delete
msg.topic = `DELETE FROM rs2lab.Utilizador WHERE ID = ${msg.req.params.ID};`;
return msg;