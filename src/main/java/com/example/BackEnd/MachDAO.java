package com.example.BackEnd;
 
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
 
public class MachDAO {
 
    public void crearMatch(int usuario1, int usuario2) throws SQLException {
        int u1 = Math.min(usuario1, usuario2);
        int u2 = Math.max(usuario1, usuario2);
 
        if (yaExisteMatch(u1, u2)) return;
 
        String sql = "INSERT INTO Matches (id_usuario1, id_usuario2) VALUES (?, ?)";
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, u1);
            ps.setInt(2, u2);
            ps.executeUpdate();
            System.out.println("💞 ¡Match creado entre " + u1 + " y " + u2 + "!");
        }
    }
 
    public boolean yaExisteMatch(int u1, int u2) throws SQLException {
        String sql = "SELECT COUNT(*) FROM Matches WHERE id_usuario1 = ? AND id_usuario2 = ?";
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, Math.min(u1, u2));
            ps.setInt(2, Math.max(u1, u2));
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() && rs.getInt(1) > 0;
            }
        }
    }
 
    public List<Mach> obtenerMatchesDeUsuario(int idUsuario) throws SQLException {
        List<Mach> lista = new ArrayList<>();
        String sql = "SELECT * FROM Matches WHERE id_usuario1 = ? OR id_usuario2 = ?";
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, idUsuario);
            ps.setInt(2, idUsuario);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Mach m = new Mach(rs.getInt("id_usuario1"), rs.getInt("id_usuario2"));
                    m.setId(rs.getInt("id_match"));
                    lista.add(m);
                }
            }
        }
        return lista;
    }
 
    // ── Devuelve matches con toda la info del otro usuario ───────────────────
    public List<Map<String, Object>> obtenerMatchesConInfo(int idUsuario) throws SQLException {
        List<Map<String, Object>> lista = new ArrayList<>();
 
        String sql = """
            SELECT
                m.id_matches,
                m.fecha,
                u.id_usuario,
                u.nombre,
                u.correo,
                u.bio,
                GROUP_CONCAT(t.nombre SEPARATOR ', ') AS tecnologias
            FROM matches m
            JOIN usuario u ON u.id_usuario = CASE
                WHEN m.id_usuario1 = ? THEN m.id_usuario2
                ELSE m.id_usuario1
            END
            LEFT JOIN Usuarios_Tecnologias ut ON ut.id_usuario = u.id_usuario
            LEFT JOIN Tecnologia t ON t.id_tecnologia = ut.id_tecnologia
            WHERE m.id_usuario1 = ? OR m.id_usuario2 = ?
            GROUP BY m.id_matches, m.fecha, u.id_usuario, u.nombre, u.correo, u.bio
            ORDER BY m.fecha DESC
            """;
 
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, idUsuario);
            ps.setInt(2, idUsuario);
            ps.setInt(3, idUsuario);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    row.put("idMatch",     rs.getInt("id_matches"));
                    row.put("fecha",       rs.getString("fecha"));
                    row.put("idUsuario",   rs.getInt("id_usuario"));
                    row.put("nombre",      rs.getString("nombre"));
                    row.put("correo",      rs.getString("correo"));
                    row.put("bio",         rs.getString("bio") != null ? rs.getString("bio") : "");
                    row.put("tecnologias", rs.getString("tecnologias") != null ? rs.getString("tecnologias") : "");
                    lista.add(row);
                }
            }
        }
        return lista;
    }
}