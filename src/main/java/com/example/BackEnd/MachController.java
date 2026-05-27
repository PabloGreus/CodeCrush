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
public class MachController {
 
    private final MachDAO dao = new MachDAO();
 
    // GET /api/matches/{idUsuario} — devuelve los matches de un usuario con info del otro
    @GetMapping("/matches/{idUsuario}")
    public ResponseEntity<?> obtenerMatches(@PathVariable int idUsuario) {
        try {
            List<Map<String, Object>> matches = dao.obtenerMatchesConInfo(idUsuario);
            return ResponseEntity.ok(matches);
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
 
    // POST /api/matches — crea un match entre dos usuarios
    // Body: { "idUsuario1": 1, "idUsuario2": 2 }
    @PostMapping("/matches")
    public ResponseEntity<?> crearMatch(@RequestBody Map<String, Integer> body) {
        try {
            Integer u1 = body.get("idUsuario1");
            Integer u2 = body.get("idUsuario2");
 
            if (u1 == null || u2 == null)
                return ResponseEntity.badRequest().body(Map.of("error", "Faltan campos"));
 
            dao.crearMatch(u1, u2);
            return ResponseEntity.ok(Map.of("mensaje", "Match creado"));
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}