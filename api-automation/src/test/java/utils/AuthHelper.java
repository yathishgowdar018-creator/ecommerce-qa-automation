package utils;

import config.ApiSpecs;
import config.Config;
import models.LoginRequest;

public final class AuthHelper {
    private AuthHelper() {}

    /** Logs in with the demo user and returns the access token. */
    public static String loginAndGetToken() {
        return ApiSpecs.request()
                .body(new LoginRequest(Config.USERNAME, Config.PASSWORD))
                .when().post("/auth/login")
                .then().statusCode(200)
                .extract().path("accessToken");
    }
}
