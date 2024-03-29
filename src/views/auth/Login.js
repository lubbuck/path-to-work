import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import OAuth from './OAuth'
import { Error, Form } from '../../reusable'

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'

import CIcon from '@coreui/icons-react'

const Login = () => {

  const [errors, setErrors] = useState([])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin() {
    setErrors([])
    if (password.length < 9 || password.trim() === '') {
      setErrors(prev => [...prev, 'A senha deve ter no minimo 10 digitos'])
    } else {
      try {
        const { error } = await supabase.auth.signIn({ email, password })
        if (error) {
          setErrors(prev => [...prev, error.message])
        }
      } catch (error) {
        setErrors(prev => [...prev, error.message])
      }
    }
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="6">
            <CCard className="p-4">
              <CCardBody>
                <Form onSubmit={handleLogin}>
                  <h1>Login</h1>
                  <p className="text-muted">Entre com sua conta</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-user" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput
                      type="password"
                      placeholder="Senha"
                      value={password}
                      valid={password.length > 9 && password.trim() !== ''}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </CInputGroup>
                  {errors.length > 0 ? <Error errors={errors} /> : <></>}
                  <CRow>
                    <CCol xs="6">
                      <CButton type='submit' color="primary" className="px-4">Login</CButton>
                    </CCol>
                    <CCol xs="6" className="text-right">
                      <OAuth />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol xs="12" className="text-right">
                      <Link to="/register">
                        Não possui conta? Registre-se agora!
                      </Link>
                    </CCol>
                  </CRow>
                </Form>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
