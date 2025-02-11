package RESTcontrollers;

import db.user.UserDTO;
import db.user.UserModel;
import db.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public UserDTO login(@RequestBody UserDTO userDTO) {
        UserModel userModel = userService.findByLogin(userDTO.getLogin());
        if (userModel == null){
            userDTO.setExist(false);

        } else {
            boolean passwordMatches = passwordEncoder.matches(userDTO.getPassword(), userModel.getPassword());
            userDTO.setExist(passwordMatches);
        }
        return userDTO;
    }

    @PostMapping("/registration")
    public UserDTO registration(@RequestBody UserDTO userDTO) {
        UserModel existingUser = userService.findByLogin(userDTO.getLogin());
        if (existingUser == null){
            UserModel newUser = new UserModel();
            newUser.setLogin(userDTO.getLogin());
            String hashedPassword = passwordEncoder.encode(userDTO.getPassword());
            newUser.setPassword(hashedPassword);
            userService.save(newUser);
            userDTO.setExist(true);

        } else userDTO.setExist(false);
        return userDTO;
    }
}
