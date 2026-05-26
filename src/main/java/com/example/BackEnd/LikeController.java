package com.example.BackEnd;
 
import java.sql.SQLException;
import java.util.Map;
 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
 
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class LikeController {
 
    private final LikeDAO dao = new LikeDAO();

    @PostMapping("/likes")
    public ResponseEntity<?> darLike(@RequestBody Map<String, Integer> body) {
        try {
            Integer origen  = body.get("idOrigen");
            Integer destino = body.get("idDestino");
 
            if (origen == null || destino == null)
                return ResponseEntity.badRequest().body(Map.of("error", "Faltan campos"));
 
            if (origen.equals(destino))
                return ResponseEntity.badRequest().body(Map.of("error", "No puedes darte like a ti mismo"));
 
            boolean ok = dao.darLike(origen, destino);
 
            
            boolean esMatch = dao.yaExisteLike(destino, origen);
 
            return ResponseEntity.ok(Map.of(
                "insertado", ok,
                "match",     ok && esMatch
            ));
 
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}