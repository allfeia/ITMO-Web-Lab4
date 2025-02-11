package repositories;

import db.point.PointModel;
import db.user.UserModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PointRepository extends JpaRepository<PointModel, Integer> {
    Page<PointModel> findFiveByUserOrderByServerTimeDesc(UserModel user, Pageable pageable);
}
