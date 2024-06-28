package com.daniel.wheesh.user;

public enum Role {
    user("user"),
    admin("admin");

    private final String text;

    /**
     * @param text
     */
    Role(final String text) {
        this.text = text;
    }

    /* (non-Javadoc)
     * @see java.lang.Enum#toString()
     */
    @Override
    public String toString() {
        return text;
    }
}
