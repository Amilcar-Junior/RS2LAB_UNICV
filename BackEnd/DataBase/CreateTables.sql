-- Criação da base de dados RS2LAB
CREATE DATABASE IF NOT EXISTS RS2LAB;

-- Usar a base de dados RS2LAB
USE RS2LAB;

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

-- Tabela Utilizador
CREATE TABLE IF NOT EXISTS Utilizador (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Senha VARCHAR(255) NOT NULL,
    Avatar BLOB,
    ID_TipoUtilizador INT,
    FOREIGN KEY (ID_TipoUtilizador) REFERENCES TipoUtilizador(ID)
);

-- Tabela UtilizadorGrupo
CREATE TABLE IF NOT EXISTS UtilizadorGrupo (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ID_Utilizador INT,
    ID_Grupo INT,
    FOREIGN KEY (ID_Utilizador) REFERENCES Utilizador(ID),
    FOREIGN KEY (ID_Grupo) REFERENCES GrupoUtilizadores(ID)
);

-- Tabela AreaDeAgricultura
CREATE TABLE IF NOT EXISTS AreaDeAgricultura (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    Localizacao VARCHAR(255) NOT NULL,
    ID_Grupo INT,
    FOREIGN KEY (ID_Grupo) REFERENCES GrupoUtilizadores(ID)
);

-- Tabela TipoSensor
CREATE TABLE IF NOT EXISTS TipoSensor (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL
);

-- Tabela Sensor
CREATE TABLE IF NOT EXISTS Sensor (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    area_ID INT,
    ID_TipoSensor INT,
    FOREIGN KEY (area_ID) REFERENCES AreaDeAgricultura(ID),
    FOREIGN KEY (ID_TipoSensor) REFERENCES TipoSensor(ID)
);

-- Tabela ValorSensor
CREATE TABLE IF NOT EXISTS ValorSensor (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Valor FLOAT NOT NULL,
    Data_Hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ID_Sensor INT,
    Topico VARCHAR(255),
    FOREIGN KEY (ID_Sensor) REFERENCES Sensor(ID)
);