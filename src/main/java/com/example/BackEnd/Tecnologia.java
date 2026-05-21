package com.example.BackEnd;
 
public class Tecnologia {
 
    private int id;
    private String nombre;
 
    public Tecnologia() {}
 
    public Tecnologia(int id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }
 
    public Tecnologia(String nombre) {
        this.nombre = nombre;
    }
 
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
 
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}
 