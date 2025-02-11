package RESTcontrollers;

import check.Checker;
import db.point.*;
import db.user.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
public class PointController {
    @Autowired
    private UserService userService;
    @Autowired
    private PointService pointService;

    static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @PostMapping("/checkpoint")
    public PointModel check(@RequestBody PointDTO pointDTO) {
        long startTime = System.nanoTime();

        UserModel userModel = userService.findByLogin(pointDTO.getLogin());
        if (userModel == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        boolean isHit = Checker.isHit(pointDTO.getX(), pointDTO.getY(), pointDTO.getR());

        PointModel pointModel = new PointModel();
        pointModel.setX(pointDTO.getX());
        pointModel.setY(pointDTO.getY());
        pointModel.setR(pointDTO.getR());
        pointModel.setHit(isHit);
        pointModel.setServerTime(formatter.format(LocalDateTime.now()));
        pointModel.setExecutionTime(System.nanoTime() - startTime);
        pointModel.setUser(userModel);

        return pointService.save(pointModel);
    }

    @PostMapping("/getPoints")
    public ResponseEntity<Page<PointModel>> getPoints(
            @RequestParam String login,
            @RequestBody UserDTO userDTO,
            @PageableDefault(sort = "serverTime", direction = Sort.Direction.DESC, size = 5) Pageable pageable
    ) {
        try {
            UserModel userModel = userService.findByLogin(login);

            Page<PointModel> points = pointService.findLastFive(userModel, pageable);
            if (points.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(points);
            }

            return ResponseEntity.ok(points);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
