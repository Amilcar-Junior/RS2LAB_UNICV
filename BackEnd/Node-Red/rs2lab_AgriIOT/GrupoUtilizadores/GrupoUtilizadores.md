## GET All
msg.topic = `SELECT ID, Nome FROM rs2lab.GrupoUtilizadores;`;
return msg;

## GET by ID
msg.topic = `SELECT ID, Nome FROM rs2lab.GrupoUtilizadores WHERE ID = ${msg.req.params.ID};`;
return msg;
## Create
msg.topic = `INSERT INTO rs2lab.GrupoUtilizadores (Nome) VALUES ('${msg.payload.Nome}');`;
return msg;

## Update
msg.topic = `UPDATE rs2lab.GrupoUtilizadores SET Nome = '${msg.payload.Nome}' WHERE ID = ${msg.req.params.ID};`;
return msg;


## Delete
msg.topic = `DELETE FROM rs2lab.GrupoUtilizadores WHERE ID = ${msg.req.params.ID};`;
return msg;
