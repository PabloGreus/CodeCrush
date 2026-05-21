package com.example.BackEnd;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
 
public class TecnologiaDAO {
 
    // ── Devuelve todas las tecnologías disponibles ──────────────────────────
    public List<Tecnologia> obtenerTodas() throws SQLException {
        List<Tecnologia> lista = new ArrayList<>();
        String sql = "SELECT id_tecnologia, nombre FROM Tecnologia ORDER BY nombre";
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                lista.add(new Tecnologia(rs.getInt("id_tecnologia"), rs.getString("nombre")));
            }
        }
        return lista;
    }
 
    // ── Devuelve las tecnologías de un usuario concreto ─────────────────────
    public List<Tecnologia> obtenerPorUsuario(int idUsuario) throws SQLException {
        List<Tecnologia> lista = new ArrayList<>();
        String sql = """
                SELECT t.id_tecnologia, t.nombre
                FROM Tecnologia t
                JOIN Usuarios_Tecnologias ut ON t.id_tecnologia = ut.id_tecnologia
                WHERE ut.id_usuario = ?
                ORDER BY t.nombre
                """;
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, idUsuario);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    lista.add(new Tecnologia(rs.getInt("id_tecnologia"), rs.getString("nombre")));
                }
            }
        }
        return lista;
    }
 
    // ── Busca una tecnología por nombre (null si no existe) ─────────────────
    public Tecnologia buscarPorNombre(String nombre) throws SQLException {
        String sql = "SELECT id_tecnologia, nombre FROM Tecnologia WHERE nombre = ?";
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, nombre);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new Tecnologia(rs.getInt("id_tecnologia"), rs.getString("nombre"));
                }
            }
        }
        return null;
    }
 
    // ── Inserta una tecnología nueva y devuelve su id ───────────────────────
    public int insertar(String nombre) throws SQLException {
        String sql = "INSERT INTO Tecnologia (nombre) VALUES (?)";
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, nombre);
            ps.executeUpdate();
            try (ResultSet keys = ps.getGeneratedKeys()) {
                keys.next();
                return keys.getInt(1);
            }
        }
    }
 
    // ── Obtiene el id de una tecnología, insertándola si no existe ──────────
    public int obtenerOInsertar(String nombre) throws SQLException {
        Tecnologia existente = buscarPorNombre(nombre);
        if (existente != null) return existente.getId();
        return insertar(nombre);
    }
 
    // ── Vincula una tecnología a un usuario en Usuarios_Tecnologias ─────────
    public void vincularUsuario(int idUsuario, int idTecnologia) throws SQLException {
        String sql = "INSERT IGNORE INTO Usuarios_Tecnologias (id_usuario, id_tecnologia) VALUES (?, ?)";
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, idUsuario);
            ps.setInt(2, idTecnologia);
            ps.executeUpdate();
        }
    }
 
    // ── Elimina todas las tecnologías vinculadas a un usuario ───────────────
    public void desvincularUsuario(int idUsuario) throws SQLException {
        String sql = "DELETE FROM Usuarios_Tecnologias WHERE id_usuario = ?";
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, idUsuario);
            ps.executeUpdate();
        }
    }
}