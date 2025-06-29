import React from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
    Chip,
    Box,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { styled } from '@mui/material/styles';

const TaskListContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

function TaskList({ tasks, onDelete, onEdit, onView }) {
    const getStatusChip = (status) => {
        let color = 'default';
        if (status === 'completed') {
            color = 'success';
        } else if (status === 'pending') {
            color = 'warning';
        }

        return <Chip label={status} color={color} size="small" />;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No due date';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <TaskListContainer>
            <Typography variant="h6" gutterBottom>
                Tasks
            </Typography>
            <TableContainer>
                <Table aria-label="task table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell component="th" scope="row">
                                    {task.title}
                                </TableCell>
                                <TableCell>{task.description}</TableCell>
                                <TableCell>{getStatusChip(task.status)}</TableCell>
                                <TableCell>{formatDate(task.dueDate)}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="View">
                                        <IconButton aria-label="view" onClick={() => onView(task)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit">
                                        <IconButton aria-label="edit" onClick={() => onEdit(task)}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton
                                            aria-label="delete"
                                            onClick={() => onDelete(task.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </TaskListContainer>
    );
}

export default TaskList;