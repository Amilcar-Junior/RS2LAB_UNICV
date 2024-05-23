-- Criação da base de dados RS2LAB
CREATE DATABASE IF NOT EXISTS RS2LAB;

-- Usar a base de dados RS2LAB
USE RS2LAB;

-- Criação da tabela TipoUtilizador
CREATE TABLE IF NOT EXISTS TipoUtilizador (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    Descricao TEXT
);

-- Criação da tabela GrupoUtilizadores
CREATE TABLE IF NOT EXISTS GrupoUtilizadores (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL
);

-- Criação da tabela Utilizador
CREATE TABLE IF NOT EXISTS Utilizador (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Senha VARCHAR(255) NOT NULL,
    image TEXT,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    ID_TipoUtilizador INT,
    FOREIGN KEY (ID_TipoUtilizador) REFERENCES TipoUtilizador(ID)
);

-- Criação da tabela UtilizadorGrupo
CREATE TABLE IF NOT EXISTS UtilizadorGrupo (
    ID_Utilizador INT,
    ID_Grupo INT,
    PRIMARY KEY (ID_Utilizador, ID_Grupo),
    FOREIGN KEY (ID_Utilizador) REFERENCES Utilizador(ID),
    FOREIGN KEY (ID_Grupo) REFERENCES GrupoUtilizadores(ID)
);

-- Criação da tabela AreaDeAgricultura
CREATE TABLE IF NOT EXISTS AreaDeAgricultura (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    Localizacao MEDIUMTEXT NOT NULL,
    ID_Grupo INT,
    ID_Local INT,
    FOREIGN KEY (ID_Grupo) REFERENCES GrupoUtilizadores(ID),
    FOREIGN KEY (ID_Local) REFERENCES Local(ID)
);

-- Criação da tabela Local
CREATE TABLE IF NOT EXISTS Local (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL
);

-- Criação da tabela TipoSensor
CREATE TABLE IF NOT EXISTS TipoSensor (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    icon MEDIUMTEXT
);
