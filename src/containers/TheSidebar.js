import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Actions as ActionSidebar } from '../redux/sidebar'

import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavItem,
} from '@coreui/react'

import {
  cilBriefcase,
  cilCursor,
  cilHome,
  cilList,
  cilContact,
  cilTask
} from '@coreui/icons'

import CIcon from '@coreui/icons-react'

const TheSidebar = () => {

  const dispatch = useDispatch()
  const sidebar = useSelector(state => state.sidebar)

  return (
    <CSidebar
      show={sidebar}
      onShowChange={(val) => dispatch(ActionSidebar.showSwitch(val))}
    >
      <CSidebarBrand
        to='/'
        className="d-md-down-none text-center text-decoration-none"
      >
        Link Work
      </CSidebarBrand>
      <CSidebarNav>
        <CSidebarNavItem
          name="Dashboard"
          to="/dashboard"
          icon={<CIcon content={cilHome} customClasses="c-sidebar-nav-icon" />}
        />
        <CSidebarNavTitle>Link</CSidebarNavTitle>
        <CSidebarNavItem
          name="Links"
          to="/links"
          icon={<CIcon content={cilCursor} customClasses="c-sidebar-nav-icon" />}
        />
        <CSidebarNavItem
          name="Social"
          to="/social"
          icon={<CIcon content={cilContact} customClasses="c-sidebar-nav-icon" />}
        />
        <CSidebarNavItem
          name="Categorias"
          to="/links"
          icon={<CIcon content={cilList} customClasses="c-sidebar-nav-icon" />}
        />
        <CSidebarNavTitle>Tarefa</CSidebarNavTitle>
        <CSidebarNavItem
          name="Tarefas"
          to="/tasks"
          icon={<CIcon content={cilTask} customClasses="c-sidebar-nav-icon" />}
        />
        <CSidebarNavTitle>Projetos</CSidebarNavTitle>
        <CSidebarNavItem
          name="Todos Projetos"
          to="/projects"
          icon={<CIcon content={cilBriefcase} customClasses="c-sidebar-nav-icon" />}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  )
}

export default TheSidebar