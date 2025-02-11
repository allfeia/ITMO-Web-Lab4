package db.user;

import db.point.PointModel;
import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "users")
public class UserModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false, unique = true)
    private String login;
    @Column(nullable = false)
    private String password;

    @OneToMany(mappedBy="user")
    private Set<PointModel> points;

    public UserModel(int id, String login, String password) {
        this.id = id;
        this.login = login;
        this.password = password;
    }

    public UserModel(){

    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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
}