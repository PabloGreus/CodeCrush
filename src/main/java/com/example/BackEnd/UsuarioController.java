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
public class UsuarioController {

    private final UsuarioDAO dao = new UsuarioDAO();

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody Map<String, String> body) {
        try {
            String nombre = body.get("nombre");
            String email  = body.get("email");
            String pass   = body.get("contraseña");
            String bio    = body.get("bio");
            String tecnologias = body.get("tecnologias");

            if (nombre == null || email == null || pass == null || bio == null || tecnologias == null)
                return ResponseEntity.badRequest().body(Map.of("error", "Faltan campos"));

            Usuario u = new Usuario(email, nombre, pass, bio, tecnologias);
            boolean ok = dao.insertarUsuario(u);

            if (!ok)
                return ResponseEntity.status(409).body(Map.of("error", "Usuario o correo ya existe"));

            return ResponseEntity.ok(Map.of("mensaje", "Registro exitoso", "id", u.getId()));

        } catch (SQLException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
            try {
                String correo = body.get("correo");    // ← recibe "correo"
                String pass   = body.get("password");

                if (correo == null || pass == null)
                    return ResponseEntity.badRequest().body(Map.of("error", "Faltan campos"));

                Usuario u = dao.login(correo, pass);

                if (u == null)
                    return ResponseEntity.status(401).body(Map.of("error", "Correo o contraseña incorrectos"));

                return ResponseEntity.ok(Map.of(
                    "mensaje", "Login exitoso",
                    "id",      u.getId(),
                    "nombre",  u.getNombre(),
                    "correo",  u.getCorreo()
                ));

                } catch (SQLException e) {
                    return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
                }
}
}