package db.user;

public class UserDTO {
    private String login;
    private String password;
    private boolean isExist;

    public UserDTO(String login, String password, boolean isExist) {
        this.login = login;
        this.password = password;
        this.isExist = isExist;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isExist() {
        return isExist;
    }

    public void setExist(boolean exist) {
        isExist = exist;
    }
}

