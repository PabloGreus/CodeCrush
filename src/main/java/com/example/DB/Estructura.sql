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


---------------------------CREAMOS LOS PROCEDIMIENTOS ALMACENADOS---------------------------
DELIMITER //
CREATE PROCEDURE insertar_usuario(
IN p_nombre VARCHAR(50),
IN p_correo VARCHAR(50),
IN p_bio TEXT,
in p_password VARCHAR(50)
)
BEGIN
INSERT INTO  usuario(nombre, correo, bio, password) Values (p_nombre, p_correo, p_bio, p_password);
END //
DELIMITER ;
-------------------------------------------------------------------------------------------
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
------------------------------------------------------------------------------------
--DELIMITER 
--CREATE PROCEDURE ContarMatches(IN p_id_usuario INT)
--BEGIN
--    SELECT 
--        u.id_usuario,
--        u.nombre,
--        COUNT(m.id_matches) AS total_matches
--    FROM usuario u
--    LEFT JOIN Matches m 
--        ON u.id_usuario = m.id_usuario1 
--        OR u.id_usuario = m.id_usuario2
--    WHERE u.id_usuario = p_id_usuario
--    GROUP BY u.id_usuario, u.nombre;
--END
--DELIMITER ;
------------------------------------------------------------------------------------
DELIMITER 
CREATE PROCEDURE CargarUsuario(
    IN p_nombre      VARCHAR(255),
    IN p_correo      VARCHAR(255),
    IN p_bio         TEXT
)
BEGIN
    IF p_nombre = '' OR p_nombre IS NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El nombre no puede estar vacío';
    END IF;

    IF p_correo = '' OR p_correo IS NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El correo no puede estar vacío';
    END IF;

    -- Verificar que el correo no esté ya registrado
    IF EXISTS (SELECT 1 FROM usuario WHERE correo = p_correo) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El correo ya está registrado';
    END IF;

    -- Insertar el nuevo usuario
    INSERT INTO usuario (nombre, correo, bio)
    VALUES (p_nombre, p_correo, p_bio);

    -- Retornar el usuario creado
    SELECT 
        id_usuario,
        nombre,
        correo,
        bio,
        fecha_registro
    FROM usuario
    WHERE id_usuario = LAST_INSERT_ID();
END
DELIMITER ;
------------------------------------------------------------------------------------
