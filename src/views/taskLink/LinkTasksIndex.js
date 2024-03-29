import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../hooks/useAuth';
import TaskCreate from '../tasks/TaskCreate'
import LinkCreateTasks from './LinkCreateTasks'
import { Actions as ActionNotification } from '../../redux/notifications'

import {
    BreadcrumbHeader,
    Loading,
    Error,
    NoItems,
    AddButton,
    RelationButton
} from '../../reusable'

import {
    TaskComponent,
} from "../../components"

export default function LinkTasksIndex({ linkId }) {

    const dispatch = useDispatch()

    const { authUser } = useAuth()

    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState([])

    const [tasks, setTasks] = useState([])

    const fetchTasks = useCallback(async () => {
        try {
            const { data: tasks, errorTasks } = await supabase
                .from("task_links")
                .select("task_id, tasks(*)")
                .eq('link_id', linkId)
                .order("created_at", { ascending: false });
            if (errorTasks) {
                setErrors(prev => [...prev, errorTasks.message])
            } else {
                const parsedTasks = Object.entries(tasks).map(([key, value]) => {
                    return value.tasks
                })
                setTasks(parsedTasks)
            }
        } catch (error) {
            setErrors(prev => [...prev, error.message])
        }
        setLoading(false)
    }, [linkId])

    useEffect(() => {
        fetchTasks()
    }, [fetchTasks])

    function addTask(task) {
        setTasks(tasks => [task, ...tasks])
    }

    function removeTask(item) {
        setTasks(tasks => tasks.filter(task => task.id !== item.id))
    }

    async function handleCreateRelationTaskLink(task) {
        try {
            const { error } = await supabase
                .from("task_links")
                .insert({
                    link_id: linkId,
                    task_id: task.id,
                    user_id: authUser.id
                })
                .single();
            if (error) {
                alert("Não foi possivel salvar a informação. Motivo: ", error.message)
                return;
            } else {
                addTask(task)
                dispatch(ActionNotification.addOne({
                    header: 'Link adicionada a Tarefa:',
                    body: task.name,
                    id: task.id,
                }))
            }
        } catch (error) {
            alert("Não foi possivel salvar a informação. Motivo: ", error.message)
            return;
        }
    }

    if (loading) return (<Loading />)

    if (errors.length > 0) return (<Error errors={errors} />)

    return (
        <>
            <BreadcrumbHeader title="Tarefas do Link" quantidade={tasks.length} >
                <RelationButton
                    component={
                        <LinkCreateTasks linkId={linkId}
                            add={task => addTask(task)}
                            remove={task => removeTask(task)}
                        />
                    }
                />
                <AddButton component={<TaskCreate add={task => handleCreateRelationTaskLink(task)} />} />
            </BreadcrumbHeader>
            {tasks <= 0 ? <NoItems /> :
                tasks.map(task => (<TaskComponent key={task.id} task={task} />))
            }
        </>
    )
}