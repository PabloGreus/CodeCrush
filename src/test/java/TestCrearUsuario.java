import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

import com.example.BackEnd.Usuario;

public class TestCrearUsuario {
    @Test
    void testCrearUsuario() {
        Usuario u = new Usuario("test@correo.com", "Carlos", "1234", "Dev apasionado", "Java, Python");
 
        assertEquals("Carlos", u.getNombre());
        assertEquals("test@correo.com", u.getCorreo());
        assertEquals("1234", u.getPassword());
        assertEquals("Dev apasionado", u.getBio());
        assertEquals("Java, Python", u.getTecnologias());
    }
}
