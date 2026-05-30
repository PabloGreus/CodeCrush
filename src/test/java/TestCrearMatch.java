import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

import com.example.BackEnd.Mach;

public class TestCrearMatch {
     @Test
    void testCrearMatch() {
        Mach match = new Mach(3, 7);
 
        assertEquals(3, match.getIdUsuario1());
        assertEquals(7, match.getIdUsuario2());
    }
}
