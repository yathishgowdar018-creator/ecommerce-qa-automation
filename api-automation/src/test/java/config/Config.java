package config;

/** Central place for settings. Override on the command line: mvn test -DbaseUri=https://dummyjson.com */
public final class Config {
    private Config() {}

    public static final String BASE_URI = System.getProperty("baseUri", "https://dummyjson.com");

    /** Max allowed response time in milliseconds for the "fast enough" assertions. */
    public static final long MAX_RESPONSE_MS = Long.getLong("maxResponseMs", 8000L);

    // Demo credentials from the DummyJSON docs (public test data, not real secrets)
    public static final String USERNAME = "emilys";
    public static final String PASSWORD = "emilyspass";
}
