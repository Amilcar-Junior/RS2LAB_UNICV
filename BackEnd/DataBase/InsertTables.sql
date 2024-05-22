-- Inserir dados na tabela TipoUtilizador
INSERT INTO TipoUtilizador (Nome, Descricao) VALUES
('Administrador', 'Usuário com permissões administrativas'),
('Agricultor', 'Usuário responsável pela área de agricultura'),
('Gerente', 'Usuário com funções de gerenciamento');

-- Inserir dados na tabela GrupoUtilizadores
INSERT INTO GrupoUtilizadores (Nome) VALUES
('Grupo A'),
('Grupo B'),
('Grupo C');

-- Inserir dados na tabela Utilizador
INSERT INTO Utilizador (Nome, Email, Senha, isActive, ID_TipoUtilizador) VALUES
('João', 'joao@example.com', 'senha123', True, 1),
('Maria', 'maria@example.com', 'senha456', True, 2),
('Pedro', 'pedro@example.com', 'senha789', True, 2),
('Ana', 'ana@example.com', 'senhaabc', True, 3);

-- Inserir dados na tabela UtilizadorGrupo
INSERT INTO UtilizadorGrupo (ID_Utilizador, ID_Grupo) VALUES
(1, 1), -- João no Grupo A
(2, 1), -- Maria no Grupo A
(2, 2), -- Maria no Grupo B
(3, 2), -- Pedro no Grupo B
(4, 3); -- Ana no Grupo C

-- Inserir dados na tabela AreaDeAgricultura
INSERT INTO AreaDeAgricultura (Nome, Localizacao, ID_Grupo) VALUES
('Fazenda X', 'Local A', 1),
('Chácara Y', 'Local B', 2),
('Sítio Z', 'Local C', 3);

-- Inserir dados na tabela TipoSensor
INSERT INTO TipoSensor (Nome) VALUES
('Sensor de Temperatura'),
('Sensor de Umidade');

-- Inserir dados na tabela Sensor
INSERT INTO Sensor (Nome, area_ID, ID_TipoSensor) VALUES
('Sensor 1', 1, 1),
('Sensor 2', 1, 2),
('Sensor 3', 2, 1),
('Sensor 4', 3, 2);

-- Inserir dados na tabela ValorSensor
INSERT INTO ValorSensor (Valor, Data_Hora, ID_Sensor, Topico) VALUES
(25.5, '2024-03-20 08:00:00', 1, 'Temperatura'),
(70.0, '2024-03-20 08:00:00', 2, 'Umidade'),
(26.0, '2024-03-20 08:00:00', 3, 'Temperatura'),
(65.0, '2024-03-20 08:00:00', 4, 'Umidade');


INSERT INTO Local (Nome, lat, lng) VALUES
('Santo Antão', 17.065, -25.171),
('São Vicente', 16.864, -25.007),
('Santa Luzia', 16.753, -24.760),
('São Nicolau', 16.524, -24.281),
('Sal', 16.726, -22.929),
('Boa Vista', 16.136, -22.888),
('Maio', 15.196, -23.213),
('Santiago', 15.089, -23.680),
('Fogo', 14.944, -24.416),
('Brava', 14.872, -24.701);