package com.example.BackEnd;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
public class App {
    public static void main(String[] args) {
        String host = "Localhost";// ip de la máquina virtual
        int port = 3306; // puerto para acceder a mariaDB, por defecto 3306
        String database = "LoveCode"; //nombre de tu base de datos
        String user = "root"; // usuario creado 
        String password = "root"; // password 
        String url = "jdbc:mysql://" + host + ":" + port + "/" + database;
        try (Connection conn = DriverManager.getConnection(url, user, password);
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT 1 AS resultado"))
        {
            rs.next();
            System.out.println("Conexión exitosa. Resultado: " + rs.getInt("resultado"));
        } catch (Exception e)
        {
            System.err.println("Error al conectar con MariaDB:");
            e.printStackTrace();
        }
    }
}