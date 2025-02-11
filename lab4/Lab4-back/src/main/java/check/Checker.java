package check;

public class Checker {
    public static boolean isHit(double x, double y, double r) {
        if (x < 0 && y > 0) return false;
        else if (x >= 0 && y <= 0) return y >= x - r;
        else if (x >= 0 && y >= 0) return y <= r/2 && x <= r;
        else return x * x + y * y <= r * r;
    }
}
