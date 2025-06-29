package com.hussein.Backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Override
    public void run(String... args) throws Exception {
        // Create sample users
        User alice = new User();
        alice.setUsername("alice");
        alice.setPassword("password123");
        alice.setEmail("alice@example.com");
        userRepository.save(alice);

        User bob = new User();
        bob.setUsername("bob");
        bob.setPassword("password456");
        bob.setEmail("bob@example.com");
        userRepository.save(bob);

        // Create sample projects
        Project personalProject = new Project();
        personalProject.setName("Personal");
        personalProject.setDescription("Personal tasks and reminders");
        personalProject.setUser(alice);
        projectRepository.save(personalProject);

        Project workProject = new Project();
        workProject.setName("Work");
        workProject.setDescription("Work-related projects");
        workProject.setUser(alice);
        projectRepository.save(workProject);

        Project readingProject = new Project();
        readingProject.setName("Reading");
        readingProject.setDescription("Books to read");
        readingProject.setUser(bob);
        projectRepository.save(readingProject);

        // Create sample tasks
        Task task1 = new Task();
        task1.setTitle("Buy groceries");
        task1.setDescription("Milk, Bread, Eggs");
        task1.setStatus("pending");
        task1.setProject(personalProject);
        taskRepository.save(task1);

        Task task2 = new Task();
        task2.setTitle("Finish project");
        task2.setDescription("Complete the Spring Boot backend");
        task2.setStatus("in progress");
        task2.setProject(workProject);
        taskRepository.save(task2);

        Task task3 = new Task();
        task3.setTitle("Read a book");
        task3.setDescription("Read Clean Code by Robert C. Martin");
        task3.setStatus("pending");
        task3.setProject(readingProject);
        taskRepository.save(task3);

        System.out.println("Sample data initialized successfully!");
    }
} 