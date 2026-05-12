package com.marketplace.socket;

import com.google.gson.JsonObject;
import java.io.PrintWriter;

public interface CommandHandler {

    void handle(Session session, JsonObject request, PrintWriter out);
}
