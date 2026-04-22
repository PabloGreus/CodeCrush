CREATE DATABASE LoveCode;
USE LoveCode;
-----------------------------------------------------------------------------------
CREATE TABLE IF NOT exists usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    bio text,
    fecha_registro datetime not null default now()
);
-----------------------------------------------------------------------------------
CREATE TABLE Tecnologia (
    id_tecnologia INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre  VARCHAR(50)  NOT NULL UNIQUE,
);
-----------------------------------------------------------------------------------
CREATE TABLE Usuarios_Tecnologias (
    id_usuario INT  NOT NULL,
    id_tecnologia INT NOT NULL,
    PRIMARY KEY (id_usuario, id_tecnologia),

    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) 
    REFERENCES usuario(id_usuario) 
    ON DELETE CASCADE,
        
    CONSTRAINT fk_tecnologia FOREIGN KEY (id_tecnologia) 
    REFERENCES Tecnologia(id_tecnologia) 
    ON DELETE CASCADE
);
-----------------------------------------------------------------------------------
CREATE TABLE Likes (
    id_like INT NOT NULL AUTO_INCREMENT,
    id_emisor INT NOT NULL,
    id_receptor INT NOT NULL,
    fecha DATETIME NOT NULL DEFAULT NOW(),

    PRIMARY KEY (id_like),
    UNIQUE (id_emisor, id_receptor),

    CONSTRAINT fk_emisor FOREIGN KEY (id_emisor)   
    REFERENCES usuario(id_usuario) ON DELETE CASCADE,
        
    CONSTRAINT fk_receptor FOREIGN KEY (id_receptor) 
    REFERENCES usuario(id_usuario) ON DELETE CASCADE
);
-----------------------------------------------------------------------------------
CREATE TABLE Matches (
    id_matches INT NOT NULL AUTO_INCREMENT,
    id_usuario1 INT NOT NULL,   
    id_usuario2 INT NOT NULL,   
    fecha DATETIME NOT NULL DEFAULT NOW(),

    PRIMARY KEY (id),
    UNIQUE (id_usuario1, id_usuario2),

    CONSTRAINT fk_match_u1 FOREIGN KEY (id_usuario1) 
        REFERENCES usuario(id_usuario) ON DELETE CASCADE,
        
    CONSTRAINT fk_match_u2 FOREIGN KEY (id_usuario2) 
        REFERENCES usuario(id_usuario) ON DELETE CASCADE
);
-----------------------------------------------------------------------------------
Create user 'lector@%' IDENTIFIED BY 'lector';
GRANT SELECT ON LoveCode.* TO 'lector@%';
FLUSH PRIVILEGES;
-- Creamos un usuario solo lectura.
-----------------------------------------------------------------------------------
Create user 'Desarrollador@%' IDENTIFIED BY 'desarrollador';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX,
ALTER ON LoveCode.* TO 'Desarrollador@%';
FLUSH PRIVILEGES;
-- Creamos un usuario con permisos de desarrollador
------------------------------------------------------------------------------------
DELIMITER
CREATE PROCEDURE BorrarUsuario(IN p_id_usuario INT)
BEGIN

    IF NOT EXISTS (SELECT 1 FROM usuario WHERE id_usuario = p_id_usuario) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El usuario no existe';
    END IF;

    DELETE FROM usuario
    WHERE id_usuario = p_id_usuario;

    SELECT CONCAT('Usuario ', p_id_usuario, ' eliminado correctamente') AS mensaje;
END
DELIMITER ;