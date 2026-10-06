package config;

import io.restassured.RestAssured;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;

/** Reusable request specification so every test starts from the same base settings. */
public final class ApiSpecs {
    private ApiSpecs() {}

    public static RequestSpecification base() {
        return new RequestSpecBuilder()
                .setBaseUri(Config.BASE_URI)
                .setContentType(ContentType.JSON)
                .setAccept(ContentType.JSON)
                .build();
    }

    /** Shortcut: given().spec(base()) */
    public static RequestSpecification request() {
        return RestAssured.given().spec(base());
    }

    public static RequestSpecification authorized(String token) {
        return request().header("Authorization", "Bearer " + token);
    }
}
