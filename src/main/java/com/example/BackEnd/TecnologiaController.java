package com.example.BackEnd;
 
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
 
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TecnologiaController {
 
    private final TecnologiaDAO dao = new TecnologiaDAO();
 
    // GET /api/tecnologias — lista todas las tecnologías disponibles
    @GetMapping("/tecnologias")
    public ResponseEntity<?> listarTodas() {
        try {
            List<Tecnologia> lista = dao.obtenerTodas();
            return ResponseEntity.ok(lista);
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
 
    // GET /api/tecnologias/{idUsuario} — tecnologías de un usuario concreto
    @GetMapping("/tecnologias/{idUsuario}")
    public ResponseEntity<?> listarPorUsuario(@PathVariable int idUsuario) {
        try {
            List<Tecnologia> lista = dao.obtenerPorUsuario(idUsuario);
            return ResponseEntity.ok(lista);
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
 
    // POST /api/tecnologias — añade una tecnología nueva manualmente
    // Body: { "nombre": "React" }
    @PostMapping("/tecnologias")
    public ResponseEntity<?> insertar(@RequestBody Map<String, String> body) {
        try {
            String nombre = body.get("nombre");
            if (nombre == null || nombre.isBlank())
                return ResponseEntity.badRequest().body(Map.of("error", "Falta el nombre"));
 
            int id = dao.obtenerOInsertar(nombre.trim());
            return ResponseEntity.ok(Map.of("id", id, "nombre", nombre.trim()));
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
 
    // POST /api/tecnologias/vincular — vincula tecnologías a un usuario
    // Body: { "idUsuario": 1, "tecnologias": "Java, React, SQL" }
    @PostMapping("/tecnologias/vincular")
    public ResponseEntity<?> vincular(@RequestBody Map<String, String> body) {
        try {
            String idStr = body.get("idUsuario");
            String techs = body.get("tecnologias");
 
            if (idStr == null || techs == null)
                return ResponseEntity.badRequest().body(Map.of("error", "Faltan campos"));
 
            int idUsuario = Integer.parseInt(idStr);
 
            // Borra las anteriores y vuelve a vincular (útil para editar perfil)
            dao.desvincularUsuario(idUsuario);
 
            for (String t : techs.split(",")) {
                String nombre = t.trim();
                if (!nombre.isEmpty()) {
                    int idTech = dao.obtenerOInsertar(nombre);
                    dao.vincularUsuario(idUsuario, idTech);
                }
            }
 
            return ResponseEntity.ok(Map.of("mensaje", "Tecnologías actualizadas"));
        } catch (SQLException | NumberFormatException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}