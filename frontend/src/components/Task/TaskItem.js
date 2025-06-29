import React from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'; // Import EditIcon

function TaskItem({ task, onDelete, onEdit }) {  // Receive onEdit prop
    return (
        <ListItem divider>
            <ListItemText
                primary={task.title}
                secondary={`${task.description} - Due: ${task.due_date}`}
            />
            <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => onEdit(task)}>  {/* Call onEdit */}
                    <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(task.id)}>
                    <DeleteIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
}

export default TaskItem;