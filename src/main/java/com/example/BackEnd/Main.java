package com.example.BackEnd;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

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
                
                System.out.println(" | Nombre: " + nombre);
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

