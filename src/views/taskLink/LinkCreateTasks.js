import React, { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../hooks/useAuth';
import { Loading } from '../../reusable'
import { SearchComponent } from '../../components'

import {
    CModalBody,
    CModalHeader,
    CModalTitle,
    CFormGroup,
    CCol
} from '@coreui/react'

export default function LinkCreateTasks({ linkId, add, remove }) {

    const { user } = useAuth()

    const [loading, setLoading] = useState(true)
    const [tasks, setTasks] = useState([])

    const fetchTasks = useCallback(async () => {
        const { data: allTasks, error } = await supabase
            .from("tasks")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) {
            console.log("error", error);
        }
        else {
            const { data: allRelations, errorRelations } = await supabase
                .from("task_links")
                .select("task_id, tasks(*)")
                .eq('link_id', linkId)
                .order("created_at", { ascending: false });
            if (errorRelations) {
                console.log("errorRelations", errorRelations);
            } else {
                const partsedRelations = Object.entries(allRelations).map(([key, value]) => {
                    return value.tasks
                })
                setTasks(allTasks.map(task => {
                    if (partsedRelations.some(relation => relation.id === task.id)) {
                        return { ...task, 'selected': true }
                    }
                    return task
                }))
            }
            setLoading(false)
        }
    }, [linkId])

    async function toogleSelect(e, task) {
        e.preventDefault();
        if (task.selected) {
            await removeRelation(task)
        } else {
            await addRelation(task)
        }
    }

    async function removeRelation(task) {
        const { error } = await supabase
            .from('task_links')
            .delete()
            .eq('link_id', linkId)
            .eq('task_id', task.id)
        if (error) {
            console.log("error: ", error)
        } else {
            remove(task)
            redoAfterToogle(task)
        }
    }

    async function addRelation(task) {
        const { error } = await supabase
            .from("task_links")
            .insert({
                link_id: linkId,
                task_id: task.id,
                user_id: user.id
            })
            .single();
        if (error) {
            alert("error", error)
            return;
        } else {
            add(task)
            redoAfterToogle(task)
        }
    }

    function redoAfterToogle(data) {
        setTasks(tasks.map(task => {
            if (task.id === data.id) {
                return { ...data, 'selected': !data.selected }
            }
            return { ...task }
        }))
    }

    useEffect(() => {
        fetchTasks()
    }, [fetchTasks])

    if (loading) return (<><Loading /></>)

    return (
        <>
            <CModalHeader closeButton>
                <CModalTitle>Adicionar Lista</CModalTitle>
            </CModalHeader >
            <CModalBody>
                <CFormGroup row>
                    <CCol md="12">
                        {
                            tasks.map(task => <SearchComponent key={task.id} data={task} toogleSelect={toogleSelect} />)
                        }
                    </CCol>
                </CFormGroup>
            </CModalBody>
        </>
    )
}