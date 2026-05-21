package com.example.BackEnd;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class LikeDAO {
     public boolean darLike(int origen, int destino) throws SQLException {
        // Evitar like duplicado
        if (yaExisteLike(origen, destino)) return false;

        String sql = "INSERT INTO likes (id_origen, id_destino) VALUES (?, ?)";
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setInt(1, origen);
            ps.setInt(2, destino);
            ps.executeUpdate();

            // ¿El otro también nos dio like? → Match
            if (yaExisteLike(destino, origen)) {
                MachDAO machDAO = new MachDAO();
                machDAO.crearMatch(origen, destino);
            }
            return true;
        }
    }

    public boolean yaExisteLike(int origen, int destino) throws SQLException {
        String sql = "SELECT COUNT(*) FROM likes WHERE id_origen = ? AND id_destino = ?";
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, origen);
            ps.setInt(2, destino);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() && rs.getInt(1) > 0;
            }
        }
    }

    public List<Integer> obtenerLikesRecibidos(int idUsuario) throws SQLException {
        List<Integer> lista = new ArrayList<>();
        String sql = "SELECT id_origen FROM likes WHERE id_destino = ?";
        try (Connection con = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, idUsuario);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) lista.add(rs.getInt("id_origen"));
            }
        }
        return lista;
    }
}
