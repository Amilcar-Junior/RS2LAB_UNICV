-- Criação da base de dados
CREATE DATABASE IF NOT EXISTS rs2lab;

-- Usar a base de dados rs2lab
USE rs2lab;

-- Tabela TipoUtilizador
CREATE TABLE IF NOT EXISTS TipoUtilizador (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    Descricao TEXT
);

-- Tabela GrupoUtilizadores
CREATE TABLE IF NOT EXISTS GrupoUtilizadores (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL
);

-- Tabela Local
CREATE TABLE IF NOT EXISTS Local (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL
);

-- Tabela Utilizador
CREATE TABLE IF NOT EXISTS Utilizador (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Senha VARCHAR(255) NOT NULL,
    image MEDIUMTEXT,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    ID_TipoUtilizador INT,
    FOREIGN KEY (ID_TipoUtilizador) REFERENCES TipoUtilizador(ID)
);

-- Tabela UtilizadorGrupo
CREATE TABLE IF NOT EXISTS UtilizadorGrupo (
    ID_Utilizador INT,
    ID_Grupo INT,
    PRIMARY KEY (ID_Utilizador, ID_Grupo),
    FOREIGN KEY (ID_Utilizador) REFERENCES Utilizador(ID),
    FOREIGN KEY (ID_Grupo) REFERENCES GrupoUtilizadores(ID)
);

-- Tabela AreaDeAgricultura
CREATE TABLE IF NOT EXISTS AreaDeAgricultura (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    Localizacao MEDIUMTEXT NOT NULL,
    ID_Grupo INT,
    ID_Local INT,
    FOREIGN KEY (ID_Grupo) REFERENCES GrupoUtilizadores(ID),
    FOREIGN KEY (ID_Local) REFERENCES Local(ID)
);

-- Tabela TipoSensor
CREATE TABLE IF NOT EXISTS TipoSensor (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    icon MEDIUMTEXT
);

-- Tabela ValorSensor
CREATE TABLE IF NOT EXISTS ValorSensor (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Valor FLOAT NOT NULL,
    Data_Hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Topico VARCHAR(255) NOT NULL
);

-- Tabela Sensor
CREATE TABLE IF NOT EXISTS Sensor (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    area_ID INT,
    ID_TipoSensor INT,
    coordenada VARCHAR(255),
    ID_ValorSensor INT,
    FOREIGN KEY (area_ID) REFERENCES AreaDeAgricultura(ID),
    FOREIGN KEY (ID_TipoSensor) REFERENCES TipoSensor(ID),
    FOREIGN KEY (ID_ValorSensor) REFERENCES ValorSensor(ID)
);
