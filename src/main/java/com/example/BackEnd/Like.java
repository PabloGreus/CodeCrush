package com.example.BackEnd;

public class Like {
    private int id;
    private int idUsuarioOrigen;
    private int idUsuarioDestino;
    
    public Like() {}

    public Like(int idUsuarioOrigen, int idUsuarioDestino) {
        this.idUsuarioOrigen = idUsuarioOrigen;
        this.idUsuarioDestino = idUsuarioDestino;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getIdUsuarioOrigen() { 
        return idUsuarioOrigen; }
    public void setIdUsuarioOrigen(int idUsuarioOrigen) { 
        this.idUsuarioOrigen = idUsuarioOrigen; }

    public int getIdUsuarioDestino() { 
        return idUsuarioDestino; }
    public void setIdUsuarioDestino(int idUsuarioDestino) { 
        this.idUsuarioDestino = idUsuarioDestino; }
}
