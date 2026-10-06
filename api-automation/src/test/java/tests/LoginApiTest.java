package tests;

import config.ApiSpecs;
import config.Config;
import models.LoginRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import utils.AuthHelper;

import java.util.Map;

import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;
import static org.hamcrest.Matchers.*;

@DisplayName("Auth API: login, token and registration")
class LoginApiTest extends BaseApiTest {

    @Test
    @DisplayName("Valid login returns 200, token and user fields")
    void validLogin() {
        ApiSpecs.request()
                .body(new LoginRequest(Config.USERNAME, Config.PASSWORD))
        .when().post("/auth/login")
        .then()
                .statusCode(200)
                .header("Content-Type", containsString("application/json"))
                .time(lessThan(Config.MAX_RESPONSE_MS))
                .body("username", equalTo(Config.USERNAME))
                .body("accessToken", not(emptyOrNullString()))
                .body(matchesJsonSchemaInClasspath("schemas/login-schema.json"));
    }

    @ParameterizedTest(name = "Invalid credentials [{0} / {1}] are rejected with 400")
    @CsvSource(value = {"emilys|wrongpass", "nobody|emilyspass", "emilys|", "|emilyspass"}, delimiter = '|')
    void invalidCredentials(String username, String password) {
        ApiSpecs.request()
                .body(new LoginRequest(username, password))
        .when().post("/auth/login")
        .then()
                .statusCode(400)
                .body("message", not(emptyOrNullString()));
    }

    @Test
    @DisplayName("Missing password field returns 400 with an error message")
    void missingPasswordField() {
        ApiSpecs.request()
                .body(Map.of("username", Config.USERNAME))
        .when().post("/auth/login")
        .then()
                .statusCode(400)
                .body("message", not(emptyOrNullString()));
    }

    @Test
    @DisplayName("Token gives access to the current user profile")
    void tokenAccessesProfile() {
        String token = AuthHelper.loginAndGetToken();
        ApiSpecs.authorized(token)
        .when().get("/auth/me")
        .then()
                .statusCode(200)
                .body("username", equalTo(Config.USERNAME));
    }

    @Test
    @DisplayName("Request without token is unauthorized")
    void noToken() {
        ApiSpecs.request()
        .when().get("/auth/me")
        .then()
                .statusCode(anyOf(is(401), is(403)))
                .body("message", not(emptyOrNullString()));
    }

    @Test
    @Tag("known-bug") // BUG-API-003: server answers 500 instead of 401
    @DisplayName("Request with an invalid token is unauthorized")
    void badToken() {
        ApiSpecs.authorized("this.is.not-a-valid-token")
        .when().get("/auth/me")
        .then()
                .statusCode(anyOf(is(401), is(403)));
    }

    @Test
    @DisplayName("Registration: new user is created (simulated by DummyJSON)")
    void registerUser() {
        ApiSpecs.request()
                .body(Map.of("firstName", "Asha", "lastName", "Kumar", "age", 22))
        .when().post("/users/add")
        .then()
                .statusCode(201)
                .body("id", notNullValue())
                .body("firstName", equalTo("Asha"))
                .body("lastName", equalTo("Kumar"));
    }
}
