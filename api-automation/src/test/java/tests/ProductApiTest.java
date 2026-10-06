package tests;

import config.ApiSpecs;
import config.Config;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;
import static org.hamcrest.Matchers.*;

@DisplayName("Products API")
class ProductApiTest extends BaseApiTest {

    @Test
    @DisplayName("Get products: 200, default page of 30, valid fields")
    void getAllProducts() {
        ApiSpecs.request()
        .when().get("/products")
        .then()
                .statusCode(200)
                .header("Content-Type", containsString("application/json"))
                .time(lessThan(Config.MAX_RESPONSE_MS))
                .body("products", hasSize(30))
                .body("limit", equalTo(30))
                .body("total", greaterThan(30))
                .body("products.every { it.id != null && it.title != null && it.price > 0 }", is(true));
    }

    @ParameterizedTest(name = "Get product by ID {0}")
    @ValueSource(ints = {1, 5, 10, 50})
    void getProductById(int id) {
        ApiSpecs.request()
        .when().get("/products/{id}", id)
        .then()
                .statusCode(200)
                .body("id", equalTo(id))
                .body("title", not(blankOrNullString()))
                .body(matchesJsonSchemaInClasspath("schemas/product-schema.json"));
    }

    @ParameterizedTest(name = "Invalid product ID [{0}] returns a 4xx error")
    @ValueSource(strings = {"999999", "0", "-1", "abc"})
    void invalidProductId(String id) {
        ApiSpecs.request()
        .when().get("/products/{id}", id)
        .then()
                .statusCode(allOf(greaterThanOrEqualTo(400), lessThan(500)))
                .body("message", not(emptyOrNullString()));
    }

    @Test
    @DisplayName("Search by keyword returns matching products")
    void searchProducts() {
        ApiSpecs.request().queryParam("q", "phone")
        .when().get("/products/search")
        .then()
                .statusCode(200)
                .body("total", greaterThan(0))
                .body("products", not(empty()));
    }

    @Test
    @DisplayName("Search with a nonsense keyword returns an empty list, not an error")
    void searchNoResults() {
        ApiSpecs.request().queryParam("q", "zzzzxxxxqqqq")
        .when().get("/products/search")
        .then()
                .statusCode(200)
                .body("products", empty())
                .body("total", equalTo(0));
    }

    @Test
    @DisplayName("Pagination: limit and skip are respected")
    void pagination() {
        ApiSpecs.request().queryParam("limit", 5).queryParam("skip", 10)
        .when().get("/products")
        .then()
                .statusCode(200)
                .body("products", hasSize(5))
                .body("limit", equalTo(5))
                .body("skip", equalTo(10));
    }

    @Test
    @DisplayName("Boundary: skip beyond the last product returns an empty page")
    void skipBeyondEnd() {
        ApiSpecs.request().queryParam("skip", 100000)
        .when().get("/products")
        .then()
                .statusCode(200)
                .body("products", empty());
    }

    @Test
    @DisplayName("Data consistency: list item equals the same product fetched by ID")
    void listMatchesDetail() {
        var list = ApiSpecs.request().queryParam("limit", 1)
                .when().get("/products")
                .then().statusCode(200).extract().jsonPath();
        int id = list.getInt("products[0].id");
        String title = list.getString("products[0].title");
        float price = list.getFloat("products[0].price");

        ApiSpecs.request()
        .when().get("/products/{id}", id)
        .then()
                .statusCode(200)
                .body("title", equalTo(title))
                .body("price", equalTo(price));
    }
}
