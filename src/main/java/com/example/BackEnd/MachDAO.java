package com.example.BackEnd;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class MachDAO {

    public void crearMatch(int usuario1, int usuario2) throws SQLException {
        // Los IDs siempre en orden menor-mayor para evitar duplicados (1,2) == (2,1)
        int u1 = Math.min(usuario1, usuario2);
        int u2 = Math.max(usuario1, usuario2);

        if (yaExisteMatch(u1, u2)) return;

        String sql = "INSERT INTO matches (id_usuario1, id_usuario2) VALUES (?, ?)";
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, u1);
            ps.setInt(2, u2);
            ps.executeUpdate();
            System.out.println("💞 ¡Match creado entre " + u1 + " y " + u2 + "!");
        }
    }

    public boolean yaExisteMatch(int u1, int u2) throws SQLException {
        String sql = "SELECT COUNT(*) FROM matches WHERE id_usuario1 = ? AND id_usuario2 = ?";
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
        String sql = "SELECT * FROM matches WHERE id_usuario1 = ? OR id_usuario2 = ?";
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
}
