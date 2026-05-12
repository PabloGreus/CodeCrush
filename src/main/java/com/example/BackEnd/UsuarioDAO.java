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
    
    public boolean existeNombre(String nombre) throws SQLException {
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

        String sql = "INSERT INTO usuario (nombre, correo, password) VALUES (?, ?, ?)";
        try (Connection con = DriverManager.getConnection( Variables.url, Variables.user, Variables.password);
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, usuario.getNombre());
            ps.setString(2, usuario.getCorreo());
            ps.setString(3, usuario.getPassword());

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
    }*/
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
}
