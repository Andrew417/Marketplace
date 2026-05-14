package com.marketplace.socket;

import com.google.gson.JsonObject;
import org.junit.jupiter.api.Test;

import javax.sql.DataSource;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.logging.Logger;

import static org.junit.jupiter.api.Assertions.assertEquals;

class CommandRouterTest {

    @Test
    void dispatchReturnsNotFoundForMissingHandlerPipeFormat() {
        CommandRouter router = new CommandRouter(new NoopDataSource(), false);

        String response = router.dispatch("UNKNOWN|{}");
        JsonObject body = JsonUtil.gson().fromJson(response, JsonObject.class);

        assertEquals(404, body.get("status").getAsInt());
        assertEquals("Unknown command: UNKNOWN", body.get("message").getAsString());
    }

    @Test
    void dispatchReturnsNotFoundForMissingHandlerJsonFormat() {
        CommandRouter router = new CommandRouter(new NoopDataSource(), false);

        String response = router.dispatch("{\"cmd\":\"UNKNOWN\"}");
        JsonObject body = JsonUtil.gson().fromJson(response, JsonObject.class);

        assertEquals(404, body.get("status").getAsInt());
        assertEquals("Unknown command: UNKNOWN", body.get("message").getAsString());
    }

    private static class NoopDataSource implements DataSource {

        @Override
        public Connection getConnection() throws SQLException {
            throw new UnsupportedOperationException("Not used in this test");
        }

        @Override
        public Connection getConnection(String username, String password) throws SQLException {
            throw new UnsupportedOperationException("Not used in this test");
        }

        @Override
        public PrintWriter getLogWriter() {
            throw new UnsupportedOperationException("Not used in this test");
        }

        @Override
        public void setLogWriter(PrintWriter out) {
            throw new UnsupportedOperationException("Not used in this test");
        }

        @Override
        public void setLoginTimeout(int seconds) {
            throw new UnsupportedOperationException("Not used in this test");
        }

        @Override
        public int getLoginTimeout() {
            throw new UnsupportedOperationException("Not used in this test");
        }

        @Override
        public Logger getParentLogger() {
            throw new UnsupportedOperationException("Not used in this test");
        }

        @Override
        public <T> T unwrap(Class<T> iface) {
            throw new UnsupportedOperationException("Not used in this test");
        }

        @Override
        public boolean isWrapperFor(Class<?> iface) {
            return false;
        }
    }
}
