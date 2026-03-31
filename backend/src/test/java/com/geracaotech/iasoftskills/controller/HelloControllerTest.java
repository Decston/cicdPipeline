package com.geracaotech.iasoftskills.controller;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class HelloControllerTest {

    @Test
    void shouldReturnHello() {
        String response = "Hello World";
        assertEquals("Hello World", response);
    }

}
