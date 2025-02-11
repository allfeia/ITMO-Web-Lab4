package db.point;

import db.user.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import repositories.PointRepository;

@Service
public class PointService {
    @Autowired
    private PointRepository pointRepository;


    public PointModel save(PointModel pointModel) {
        return pointRepository.save(pointModel);
    }


    public Page<PointModel> findLastFive(UserModel userModel, Pageable pageable) {
        return pointRepository.findFiveByUserOrderByServerTimeDesc(userModel, pageable);
    }
}
