package db.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import repositories.UserRepository;


@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;


    public void save(UserModel usermodel) {
        userRepository.save(usermodel);
    }

    public UserModel findByLogin(String login) {
        return userRepository.findByLogin(login);

    }
}
