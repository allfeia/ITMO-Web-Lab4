package db;

import db.point.PointModel;
import db.user.UserModel;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.springframework.stereotype.Component;

@Component
public class HibernateUtil {
    private SessionFactory sessionFactory;
    private Session session;

    private HibernateUtil() {

    }

    public SessionFactory getSessionFactory() {
        if (sessionFactory == null) {
            try {
                Configuration configuration = new Configuration().configure();
                configuration.addAnnotatedClass(UserModel.class);
                configuration.addAnnotatedClass(PointModel.class);
                StandardServiceRegistryBuilder builder = new StandardServiceRegistryBuilder().applySettings(configuration.getProperties());
                sessionFactory = configuration.buildSessionFactory(builder.build());

            } catch (Exception e) {
                System.out.println("Исключение!" + e);
            }
        }
        return sessionFactory;
    }
    public Session getCurrentSession() {
        if (session == null) {
            session = getSessionFactory().openSession();
        }
        System.out.println(session.toString());
        return session;
    }
}
