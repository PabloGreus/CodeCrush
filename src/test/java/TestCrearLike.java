import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

import com.example.BackEnd.Like;

public class TestCrearLike {
    @Test
    void testCrearLike() {
        Like like = new Like(1, 2);
 
        assertEquals(1, like.getIdUsuarioOrigen());
        assertEquals(2, like.getIdUsuarioDestino());
    }
}
