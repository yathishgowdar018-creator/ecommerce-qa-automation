package tests;

import config.ApiSpecs;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;

/**
 * Negative / invalid-input tests.
 *
 * Tests tagged "known-bug" describe the CORRECT behaviour (reject bad input with 4xx).
 * The demo API accepts them, so they fail. They are excluded from the default run so CI stays green
 * and are documented in /bug-reports. Run them with:  mvn test -DexcludedGroups=none
 */
@DisplayName("Error handling and invalid input")
class ErrorHandlingApiTest extends BaseApiTest {

    private static Map<String, Object> cart(Object quantity) {
        return Map.of("userId", 1, "products", List.of(Map.of("id", 144, "quantity", quantity)));
    }

    @Test
    @Tag("known-bug")
    @DisplayName("BUG-API-001: negative quantity (-5) must be rejected")
    void negativeQuantity() {
        ApiSpecs.request().body(cart(-5))
        .when().post("/carts/add")
        .then()
                .statusCode(allOf(greaterThanOrEqualTo(400), lessThan(500)))
                .body("message", not(emptyOrNullString()));
    }

    @Test
    @Tag("known-bug")
    @DisplayName("BUG-API-002: zero quantity must be rejected")
    void zeroQuantity() {
        ApiSpecs.request().body(cart(0))
        .when().post("/carts/add")
        .then()
                .statusCode(allOf(greaterThanOrEqualTo(400), lessThan(500)));
    }

    @Test
    @Tag("known-bug")
    @DisplayName("BUG-API-003: non-numeric quantity must be rejected")
    void stringQuantity() {
        ApiSpecs.request().body(cart("abc"))
        .when().post("/carts/add")
        .then()
                .statusCode(allOf(greaterThanOrEqualTo(400), lessThan(500)));
    }

    @Test
    @DisplayName("Cart without products field is rejected with a 4xx error")
    void missingProducts() {
        ApiSpecs.request().body(Map.of("userId", 1))
        .when().post("/carts/add")
        .then()
                .statusCode(allOf(greaterThanOrEqualTo(400), lessThan(500)));
    }

    @Test
    @DisplayName("Malformed JSON body returns an error status")
    void malformedJson() {
        ApiSpecs.request().body("{ this is not json")
        .when().post("/auth/login")
        .then()
                .statusCode(greaterThanOrEqualTo(400));
    }

    @ParameterizedTest(name = "Negative pagination value [{0}] does not crash the server")
    @ValueSource(strings = {"-1", "abc", "99999999999"})
    void badLimit(String limit) {
        ApiSpecs.request().queryParam("limit", limit)
        .when().get("/products")
        .then()
                .statusCode(lessThan(500));
    }

    @Test
    @DisplayName("Unknown endpoint returns 404")
    void unknownEndpoint() {
        ApiSpecs.request()
        .when().get("/this-does-not-exist")
        .then()
                .statusCode(404);
    }
}
