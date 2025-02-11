package db.point;

import db.user.UserModel;
import jakarta.persistence.*;

@Entity
@Table(name = "points")
public class PointModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false)
    private double x;
    @Column(nullable = false)
    private double y;
    @Column(nullable = false)
    private double r;
    @Column(name="is_hit", nullable = false)
    private boolean isHit;
    @Column(name="execution_time", nullable = false)
    private long executionTime;
    @Column(name="server_time", nullable = false)
    private String serverTime;
    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private UserModel user;

    public PointModel(double x, double y, double r, boolean isHit, long executionTime, String serverTime, UserModel user) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.isHit = isHit;
        this.executionTime = executionTime;
        this.serverTime = serverTime;
        this.user = user;
    }

    public PointModel(){

    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public double getR() {
        return r;
    }

    public void setR(double r) {
        this.r = r;
    }

    public boolean isHit() {
        return isHit;
    }

    public void setHit(boolean hit) {
        isHit = hit;
    }

    public long getExecutionTime() {
        return executionTime;
    }

    public void setExecutionTime(long executionTime) {
        this.executionTime = executionTime;
    }

    public String getServerTime() {
        return serverTime;
    }

    public void setServerTime(String serverTime) {
        this.serverTime = serverTime;
    }

    public UserModel getUser() {
        return user;
    }

    public void setUser(UserModel user) {
        this.user = user;
    }
}
