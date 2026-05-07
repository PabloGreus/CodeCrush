package com.example.BackEnd;

public class Usuario {
    protected int id;
    protected String nombre;
    protected String correo;
    protected String password;
    protected String bio;
    protected String tecnologias;


    public Usuario() {
    }

    
    public Usuario(String correo, String nombre, String password, String bio, String tecnologias) {
        this.correo = correo;
        this.nombre = nombre;
        this.password = password;
        this.bio = bio;
        this.tecnologias = tecnologias;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getTecnologias() {
        return tecnologias;
    }

    public void setTecnologias(String tecnologias) {
        this.tecnologias = tecnologias;
    }
}
