package com.hussein.Backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AuthService {
    
    @Autowired
    private UserService userService;
    
    public User getCurrentUser(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            // In a real application, you'd decode the JWT token to get the user ID
            // For now, we'll use a simple approach to get the current user
            try {
                // Get the first user as a fallback (in a real app, decode JWT)
                List<User> users = userService.getAllUsers();
                if (!users.isEmpty()) {
                    return users.get(0);
                }
            } catch (Exception e) {
                // If no users exist, create a default user
                User defaultUser = new User();
                defaultUser.setUsername("default_user");
                defaultUser.setEmail("default@example.com");
                defaultUser.setPassword("password"); // In real app, this would be hashed
                return userService.createUser(defaultUser);
            }
        }
        return null;
    }
} 