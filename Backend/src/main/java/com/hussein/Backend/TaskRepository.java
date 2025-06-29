package com.hussein.Backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    
    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.project")
    List<Task> findAllWithProjects();
    
    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.project WHERE t.id = :id")
    Optional<Task> findByIdWithProject(Long id);
} 