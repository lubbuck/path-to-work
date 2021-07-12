import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../hooks/useAuth';
import TaskCreate from './TaskCreate'
import { TaskComponent } from '../../components/'

import {
  AddButton,
  BreadcrumbHeader,
  Loading,
  NoItems
} from '../../reusable'

export default function TaskIndex() {

  const { authUser } = useAuth()

  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState([])

  const fetchTasks = useCallback(async () => {
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("*")
      .eq('user_id', authUser.id)
      .order("created_at", { ascending: false });
    if (error) {
      console.log("error", error);
    }
    else {
      setTasks(tasks)
    }
    setLoading(false)
  }, [authUser.id])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  if (loading) return (<Loading />)

  return (
    <>
      <BreadcrumbHeader title="Tarefas" quantidade={tasks.length} >
        <AddButton component={<TaskCreate add={task => setTasks([task, ...tasks])} />} />
      </BreadcrumbHeader>
      {tasks <= 0 ? <NoItems /> :
        tasks.map(task => (<TaskComponent key={task.id} task={task} />))
      }
    </>
  )
}