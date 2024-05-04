## GET All
msg.topic = 'SELECT ID, Nome, Descricao FROM rs2lab.TipoUtilizador;';
return msg;

## GET by ID
msg.topic = `SELECT ID, Nome, Descricao FROM rs2lab.TipoUtilizador WHERE ID = ${msg.req.params.ID};`;
return msg;

## Create
msg.topic = `INSERT INTO rs2lab.TipoUtilizador (Nome, Descricao) VALUES ('${msg.payload.Nome}', '${msg.payload.Descricao}');`;
return msg;

## Update
msg.topic = `UPDATE rs2lab.TipoUtilizador SET Nome = '${msg.payload.Nome}', Descricao = '${msg.payload.Descricao}' WHERE ID = ${msg.req.params.ID};`;
return msg;

## Delete
msg.topic = `DELETE FROM rs2lab.TipoUtilizador WHERE ID = ${msg.req.params.ID};`;
return msg;