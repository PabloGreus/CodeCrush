import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

import com.example.BackEnd.Tecnologia;

public class TestCrearTecnologia {
    @Test
    void testCrearTecnologia() {
        Tecnologia tech = new Tecnologia(1, "JavaScript");
 
        assertEquals(1, tech.getId());
        assertEquals("JavaScript", tech.getNombre());
 
        tech.setNombre("TypeScript");
        assertEquals("TypeScript", tech.getNombre());
    }
}
