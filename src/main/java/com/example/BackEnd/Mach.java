package com.example.BackEnd;

public class Mach {
    private int id;
    private int idUsuario1;
    private int idUsuario2;

    public Mach() {}

    public Mach(int idUsuario1, int idUsuario2) {
        this.idUsuario1 = idUsuario1;
        this.idUsuario2 = idUsuario2;
    }

    public int getId() { 
        return id; }
    
    public void setId(int id) { 
        this.id = id; }

    public int getIdUsuario1() { 
        return idUsuario1; }

    public void setIdUsuario1(int idUsuario1) { 
        this.idUsuario1 = idUsuario1; }

    public int getIdUsuario2() { 
        return idUsuario2; }

    public void setIdUsuario2(int idUsuario2) { 
        this.idUsuario2 = idUsuario2; }
}

