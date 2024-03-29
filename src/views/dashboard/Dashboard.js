import React, { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../hooks/useAuth';
import { bringDate } from '../../services/FormatDate'

import {
    Loading,
    BreadcrumbHeader,
    NosignalAlert,
    Error,
    Avisos
} from '../../reusable/'

import {
    CCardFooter,
    CCol,
    CLink,
    CRow,
    CWidgetIcon,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'

export default function Dashboard() {

    const { authUser } = useAuth()

    const sinal = navigator.onLine
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState([])

    const [links, setLinks] = useState([])
    const [tasks, setTasks] = useState([])
    const [lists, setLists] = useState([])
    const [tasksConcluidas, setTasksConcluidas] = useState(0)
    const [tasksAtrasadas, setTasksAtrasadas] = useState(0)
    const [tasksHoje, setTasksHoje] = useState(0)
    const [tasksOk, setTasksOk] = useState(0)
    const [profile, setProfile] = useState({})

    const fetchLinks = useCallback(async () => {
        try {
            const { data: linksSearch, error } = await supabase
                .from("links")
                .select("*")
                .eq('user_id', authUser.id)
                .order("created_at", { ascending: false });
            if (error) {
                setErrors(prev => [...prev, error.message])
            }
            else {
                setLinks(linksSearch)
            }
        } catch (error) {
            setErrors(prev => [...prev, error.message])
        }
    }, [authUser.id])

    const fetchTasks = useCallback(async () => {
        try {
            const { data: tasksSearch, error } = await supabase
                .from("tasks")
                .select("*")
                .eq('user_id', authUser.id)
                .order("created_at", { ascending: false });
            if (error) {
                setErrors(prev => [...prev, error.message])
            }
            else {
                setTasks(tasksSearch)
            }
        } catch (error) {
            setErrors(prev => [...prev, error.message])
        }
    }, [authUser.id])

    const fetchLists = useCallback(async () => {
        try {
            const { data: listsSearch, error } = await supabase
                .from("lists")
                .select("*")
                .eq('user_id', authUser.id)
                .order("created_at", { ascending: false });
            if (error) {
                setErrors(prev => [...prev, error.message])
            }
            else {
                setLists(listsSearch)
            }
        } catch (error) {
            setErrors(prev => [...prev, error.message])
        }
    }, [authUser.id])

    const fetchProfile = useCallback(async () => {
        try {
            const { data: profile, error } = await supabase
                .from("profiles")
                .select("*")
                .eq('user_id', authUser.id)
                .single()
            if (error) {
                setErrors(prev => [...prev, error.message])
            }
            else {
                setProfile(profile)
            }
        } catch (error) {
            setErrors(prev => [...prev, error.message])
        }
    }, [authUser.id])


    useEffect(() => {
        if (sinal) {
            fetchLinks()
            fetchTasks()
            fetchLists()
            fetchProfile()
        }
        setLoading(false)
    }, [sinal, fetchLinks, fetchTasks, fetchLists, fetchProfile])

    useEffect(() => {
        tasks.forEach(task => {
            if (task.conclusion) {
                setTasksConcluidas(prev => prev + 1)
            } else {
                if (task.day_of) {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    const [ano, mes, dia] = bringDate(task.day_of)
                    const day_of = new Date(ano, mes, dia)
                    if (today.getTime() === day_of.getTime()) {
                        setTasksHoje(prev => prev + 1)
                    } else if (today.getTime() > day_of.getTime()) {
                        setTasksAtrasadas(prev => prev + 1)
                    } else {
                        setTasksOk(prev => prev + 1)
                    }
                } else {
                    setTasksOk(prev => prev + 1)
                }
            }
        })
    }, [tasks])

    if (loading) return (<Loading />)

    if (errors.length > 0) return (<Error errors={errors} />)

    return (
        <>
            <CRow>
                <CCol xs="12" sm="12" md="12">
                    <BreadcrumbHeader title='Informações' />
                </CCol>
                <CCol xs="12" sm="6" lg="4">
                    <CWidgetIcon
                        text="Links"
                        header={'' + links.length}
                        color="info"
                        iconPadding={false}
                        footerSlot={
                            <CCardFooter className="card-footer px-3 py-2">
                                <CLink
                                    className="font-weight-bold font-xs btn-block text-muted"
                                    rel="noopener norefferer"
                                    to='/links'
                                >
                                    Ver
                                    <CIcon name="cil-arrow-right" className="float-right" width="16" />
                                </CLink>
                            </CCardFooter>
                        }
                    >
                        <CIcon width={24} name="cil-cursor" className="mx-5" />
                    </CWidgetIcon>
                </CCol>
                <CCol xs="12" sm="6" lg="4">
                    <CWidgetIcon
                        text="Tarefas"
                        header={'' + tasks.length}
                        color="info"
                        iconPadding={false}
                        footerSlot={
                            <CCardFooter className="card-footer px-3 py-2">
                                <CLink
                                    className="font-weight-bold font-xs btn-block text-muted"
                                    rel="noopener norefferer"
                                    to='/tasks'
                                >
                                    Ver
                                    <CIcon name="cil-arrow-right" className="float-right" width="16" />
                                </CLink>
                            </CCardFooter>
                        }
                    >
                        <CIcon width={24} name="cil-task" className="mx-5" />
                    </CWidgetIcon>
                </CCol>
                <CCol xs="12" sm="6" lg="4">
                    <CWidgetIcon
                        text="Listas"
                        header={'' + lists.length}
                        color="info"
                        iconPadding={false}
                        footerSlot={
                            <CCardFooter className="card-footer px-3 py-2">
                                <CLink
                                    className="font-weight-bold font-xs btn-block text-muted"
                                    rel="noopener norefferer"
                                    to='/lists'
                                >
                                    Ver
                                    <CIcon name="cil-arrow-right" className="float-right" width="16" />
                                </CLink>
                            </CCardFooter>
                        }
                    >
                        <CIcon width={24} name="cil-list" className="mx-5" />
                    </CWidgetIcon>
                </CCol>
            </CRow>

            <CRow>
                <CCol xs="12" sm="12" md="12">
                    <BreadcrumbHeader title='Avisos' />
                    {!sinal ? (<NosignalAlert />) : <>
                        {tasksHoje === 0 ?
                            <Avisos text={'Você possui não possui tarefas hoje!'} tipo='info' /> :
                            <Avisos text={'Você possui ' + tasksHoje + ' tarefa(s) hoje'} tipo='warning' />
                        }
                        {tasksAtrasadas === 0 ?
                            <Avisos text={'Você possui ' + tasksAtrasadas + ' tarefa(s) atrasadas'} tipo='success' /> :
                            <Avisos text={'Você possui ' + tasksAtrasadas + ' tarefa(s) atrasadas'} tipo='danger' />
                        }
                        <Avisos text={'Você possui ' + tasksConcluidas + ' tarefa(s) concluídas'} tipo='success' />
                        {tasksOk > 0 ? <Avisos text={'Você possui ' + tasksOk + ' tarefa(s) com tempo'} tipo='info' /> : <></>}
                        {profile.id === undefined ? <Avisos text={'Você ainda não criou seu perfil !'} tipo='warning' /> : <></>}

                    </>}

                </CCol>
            </CRow>
        </>
    )
}