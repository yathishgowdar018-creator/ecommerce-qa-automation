package models;

/** POJO (record) for the login request body. REST Assured turns it into JSON automatically. */
public record LoginRequest(String username, String password) {}
