package tests;

import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeAll;

public abstract class BaseApiTest {
    @BeforeAll
    static void setUpLogging() {
        // Print full request/response ONLY when an assertion fails -> clean logs, easy debugging
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
    }
}
