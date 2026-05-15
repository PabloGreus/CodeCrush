package com.example.BackEnd;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class UsuarioDAO {
    
    /*public boolean existeNombre(String nombre) throws SQLException {
        String sql = "SELECT COUNT(*) FROM usuario WHERE nombre = ?";
        try (Connection con = DriverManager.getConnection( Variables.url, Variables.user, Variables.password);
            PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, nombre);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() && rs.getInt(1) > 0;
            }
        }
    }
    public boolean existeCorreo(String correo) throws SQLException {
        String sql = "SELECT COUNT(*) FROM usuario WHERE correo = ?";
        try (Connection con = DriverManager.getConnection( Variables.url, Variables.user, Variables.password);
            PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, correo);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() && rs.getInt(1) > 0;
            }
        }
    }

    public boolean insertarUsuario(Usuario usuario) throws SQLException {
        if (existeNombre(usuario.getNombre())) {
            System.out.println("  [!] Ya existe un usuario con el nombre: " + usuario.getNombre());
            return false;
        }
        if (existeCorreo(usuario.getCorreo())) {
            System.out.println("  [!] Ya existe un usuario con el correo: " + usuario.getCorreo());
            return false;
        }

        String sql = "INSERT INTO usuario (nombre, correo, password, bio) VALUES (?, ?, ?, ?)";
        try (Connection con = DriverManager.getConnection( Variables.url, Variables.user, Variables.password);
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, usuario.getNombre());
            ps.setString(2, usuario.getCorreo());
            ps.setString(3, usuario.getPassword());
            ps.setString(4, usuario.getBio());
            ps.setString(5, usuario.getTecnologias());

            ps.executeUpdate();

            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) usuario.setId(keys.getInt(1));
            }
            return true;
        }
    }

    public List<Usuario> listarUsuarios() throws SQLException {
        List<Usuario> lista = new ArrayList<>();
        String sql = "SELECT * FROM usuario ORDER BY apellidos, nombre;";
        try (Connection con = DriverManager.getConnection( Variables.url, Variables.user, Variables.password);
            PreparedStatement ps = con.prepareStatement(sql);
            ResultSet rs = ps.executeQuery()) {
            while (rs.next()) lista.add(mapear(rs));
        }
        return lista;
    }

    public Usuario buscarPorId(int id) throws SQLException {
        String sql = "SELECT * FROM usuario WHERE id_usuario = ?";
        try (Connection con = DriverManager.getConnection( Variables.url, Variables.user, Variables.password);
            PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? mapear(rs) : null;
            }
        }
    }

    protected Usuario mapear(ResultSet rs) throws SQLException {
        Usuario u = new Usuario();
        u.setId(rs.getInt("id_usuario"));
        u.setNombre(rs.getString("nombre"));
        u.setCorreo(rs.getString("correo"));
        u.setBio(rs.getString("bio"));                 
        u.setTecnologias(rs.getString("tecnologias")); 
        return u;
    }

    public boolean eliminarUsuario(int id) throws SQLException {
        String sql = "DELETE FROM usuario WHERE id_usuario = ?";
        try (Connection con = DriverManager.getConnection( Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        }
    }

    /*public Usuario buscarPorNombreYPassword(String email, String password) throws SQLException {
    String sql = "SELECT * FROM usuarios WHERE nombre = ? AND password = ?";
    try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
         PreparedStatement ps = con.prepareStatement(sql)) {
        ps.setString(1, email);
        ps.setString(2, password);
        try (ResultSet rs = ps.executeQuery()) {
            return rs.next() ? mapear(rs) : null;
            }
        }
    }*//*
   public Usuario login(String correo, String password) throws SQLException {
    String sql = "SELECT * FROM usuario WHERE correo = ? AND password = ?";
    try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
         PreparedStatement ps = con.prepareStatement(sql)) {
        ps.setString(1, correo);    // ← busca por correo
        ps.setString(2, password);
        try (ResultSet rs = ps.executeQuery()) {
            return rs.next() ? mapear(rs) : null;
        }
    }
    }
    public Usuario obtenerUsuarioPorCorreo(String correo) throws SQLException {
        String sql = "SELECT * FROM usuario WHERE correo = ?";
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, correo);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? mapear(rs) : null;
            }
        }
    }*/

    public boolean existeNombre(String nombre) throws SQLException {
        String sql = "SELECT COUNT(*) FROM usuario WHERE nombre = ?";
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, nombre);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() && rs.getInt(1) > 0;
            }
        }
    }

    public boolean existeCorreo(String correo) throws SQLException {
        String sql = "SELECT COUNT(*) FROM usuario WHERE correo = ?";
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, correo);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() && rs.getInt(1) > 0;
            }
        }
    }

    
    public boolean insertarUsuario(Usuario usuario) throws SQLException {
        if (existeNombre(usuario.getNombre())) {
            System.out.println("  [!] Ya existe un usuario con el nombre: " + usuario.getNombre());
            return false;
        }
        if (existeCorreo(usuario.getCorreo())) {
            System.out.println("  [!] Ya existe un usuario con el correo: " + usuario.getCorreo());
            return false;
        }

        String sql = "INSERT INTO usuario (nombre, correo, password, bio) VALUES (?, ?, ?, ?)";
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, usuario.getNombre());
            ps.setString(2, usuario.getCorreo());
            ps.setString(3, usuario.getPassword());
            ps.setString(4, usuario.getBio());
            ps.executeUpdate();

            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) usuario.setId(keys.getInt(1));
            }
        }

        if (usuario.getTecnologias() != null && !usuario.getTecnologias().isEmpty()) {
            for (String tech : usuario.getTecnologias().split(",")) {
                insertarTecnologiaUsuario(usuario.getId(), tech.trim());
            }
        }
        return true;
    }

    private void insertarTecnologiaUsuario(int idUsuario, String nombreTech) throws SQLException {
        int idTech;
        String sqlSelect = "SELECT id_tecnologia FROM Tecnologia WHERE nombre = ?";
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sqlSelect)) {
            ps.setString(1, nombreTech);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    idTech = rs.getInt("id_tecnologia");
                } else {
                    String sqlInsert = "INSERT INTO Tecnologia (nombre) VALUES (?)";
                    try (PreparedStatement ps2 = con.prepareStatement(sqlInsert, Statement.RETURN_GENERATED_KEYS)) {
                        ps2.setString(1, nombreTech);
                        ps2.executeUpdate();
                        try (ResultSet keys = ps2.getGeneratedKeys()) {
                            keys.next();
                            idTech = keys.getInt(1);
                        }
                    }
                }
            }
        }

        String sqlRel = "INSERT IGNORE INTO Usuarios_Tecnologias (id_usuario, id_tecnologia) VALUES (?, ?)";
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sqlRel)) {
            ps.setInt(1, idUsuario);
            ps.setInt(2, idTech);
            ps.executeUpdate();
        }
    }

    public Usuario obtenerUsuarioPorCorreo(String correo) throws SQLException {
        String sql = """
            SELECT u.id_usuario, u.nombre, u.correo, u.bio,
                   GROUP_CONCAT(t.nombre SEPARATOR ', ') AS tecnologias
            FROM usuario u
            LEFT JOIN Usuarios_Tecnologias ut ON u.id_usuario = ut.id_usuario
            LEFT JOIN Tecnologia t ON ut.id_tecnologia = t.id_tecnologia
            WHERE u.correo = ?
            GROUP BY u.id_usuario
            """;
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, correo);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Usuario u = new Usuario();
                    u.setId(rs.getInt("id_usuario"));
                    u.setNombre(rs.getString("nombre"));
                    u.setCorreo(rs.getString("correo"));
                    u.setBio(rs.getString("bio"));
                    u.setTecnologias(rs.getString("tecnologias"));
                    return u;
                }
                return null;
            }
        }
    }

    public List<Usuario> listarUsuarios() throws SQLException {
        List<Usuario> lista = new ArrayList<>();
        String sql = "SELECT * FROM usuario ORDER BY nombre"; 
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) lista.add(mapear(rs));
        }
        return lista;
    }

    public Usuario buscarPorId(int id) throws SQLException {
        String sql = "SELECT * FROM usuario WHERE id_usuario = ?";
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? mapear(rs) : null;
            }
        }
    }

    protected Usuario mapear(ResultSet rs) throws SQLException {
        Usuario u = new Usuario();
        u.setId(rs.getInt("id_usuario"));
        u.setNombre(rs.getString("nombre"));
        u.setCorreo(rs.getString("correo"));
        u.setBio(rs.getString("bio"));
        return u;
    }

    public boolean eliminarUsuario(int id) throws SQLException {
        String sql = "DELETE FROM usuario WHERE id_usuario = ?";
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        }
    }

    public Usuario login(String correo, String password) throws SQLException {
        String sql = "SELECT * FROM usuario WHERE correo = ? AND password = ?";
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, correo);
            ps.setString(2, password);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? mapear(rs) : null;
            }
        }
    }

}
