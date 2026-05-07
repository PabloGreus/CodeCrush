package com.example.BackEnd;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
public class Main {
    public static void main(String[] args) {
        try {

            Connection conexion = DriverManager.getConnection(Variables.url, Variables.user, Variables.password);
            Statement sentencia = conexion.createStatement();
            
            String sql = "SELECT * FROM usuario";
            ResultSet resultado = sentencia.executeQuery(sql);
            
            System.out.println("--- Lista de Usuarios ---");
            while (resultado.next()) {

                String nombre = resultado.getString("nombre");
                String email = resultado.getString("correo");
                
                System.out.println(" | Nombre: " + nombre);
                System.out.println(" | Email: " + email);
            }
            resultado.close();
            sentencia.close();
            conexion.close();

        } catch (Exception e) {
            System.out.println("¡Ups! Algo salió mal:");
            e.printStackTrace();
        }
    }
}

