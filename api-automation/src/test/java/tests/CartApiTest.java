package tests;

import config.ApiSpecs;
import config.Config;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;

/** NOTE: DummyJSON simulates cart changes (it does not store them), so we validate the responses. */
@DisplayName("Cart API: add, update, remove")
class CartApiTest extends BaseApiTest {

    private static Map<String, Object> cartBody(int userId, int productId, Object quantity) {
        return Map.of("userId", userId, "products", List.of(Map.of("id", productId, "quantity", quantity)));
    }

    @ParameterizedTest(name = "Add item with quantity {0}")
    @ValueSource(ints = {1, 4, 99})
    @DisplayName("Add item to cart (boundary: min / typical / large quantity)")
    void addToCart(int qty) {
        ApiSpecs.request()
                .body(cartBody(1, 144, qty))
        .when().post("/carts/add")
        .then()
                .statusCode(201)
                .time(lessThan(Config.MAX_RESPONSE_MS))
                .body("userId", equalTo(1))
                .body("products[0].id", equalTo(144))
                .body("products[0].quantity", equalTo(qty))
                .body("totalProducts", equalTo(1))
                .body("totalQuantity", equalTo(qty));
    }

    @Test
    @DisplayName("Update cart quantity")
    void updateQuantity() {
        ApiSpecs.request()
                .body(Map.of("merge", true, "products", List.of(Map.of("id", 144, "quantity", 3))))
        .when().put("/carts/1")
        .then()
                .statusCode(200)
                .body("id", equalTo(1))
                .body("products.find { it.id == 144 }.quantity", greaterThanOrEqualTo(3));
    }

    @Test
    @DisplayName("Remove (delete) cart")
    void removeCart() {
        ApiSpecs.request()
        .when().delete("/carts/1")
        .then()
                .statusCode(200)
                .body("id", equalTo(1))
                .body("isDeleted", is(true))
                .body("deletedOn", notNullValue());
    }

    @Test
    @DisplayName("Get carts of a user")
    void userCarts() {
        ApiSpecs.request()
        .when().get("/carts/user/6")
        .then()
                .statusCode(200)
                .body("carts.every { it.userId == 6 }", is(true));
    }

    @Test
    @DisplayName("Get cart with an unknown ID returns 404")
    void unknownCart() {
        ApiSpecs.request()
        .when().get("/carts/999999")
        .then()
                .statusCode(404)
                .body("message", not(emptyOrNullString()));
    }

    @Test
    @Tag("known-bug") // BUG-API-004: server answers 201 for a product that does not exist
    @DisplayName("Add an unknown product ID is rejected with a 4xx error")
    void addUnknownProduct() {
        ApiSpecs.request()
                .body(cartBody(1, 999999, 1))
        .when().post("/carts/add")
        .then()
                .statusCode(allOf(greaterThanOrEqualTo(400), lessThan(500)));
    }
}
