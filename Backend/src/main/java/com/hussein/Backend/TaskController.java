package com.hussein.Backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    @Autowired
    private TaskService taskService;
    
    @Autowired
    private ProjectService projectService;
    
    @Autowired
    private AuthService authService;

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Task createTask(@RequestBody Task task, @RequestHeader("Authorization") String authHeader) {
        // Set the project if projectId is provided
        if (task.getProjectId() != null) {
            Optional<Project> project = projectService.getProjectById(task.getProjectId());
            project.ifPresent(task::setProject);
        }
        
        // Set the current user as the task owner (if needed in the future)
        User currentUser = authService.getCurrentUser(authHeader);
        
        return taskService.createTask(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task task) {
        try {
            // Set the project if projectId is provided
            if (task.getProjectId() != null) {
                Optional<Project> project = projectService.getProjectById(task.getProjectId());
                project.ifPresent(task::setProject);
            }
            
            return ResponseEntity.ok(taskService.updateTask(id, task));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
} 