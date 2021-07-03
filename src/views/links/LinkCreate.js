import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Actions as ActionNotification } from '../../redux/notifications'
import { useAuth } from '../../hooks/useAuth';
import { supabase } from 'src/services/supabase';

import {
  CButton,
  CCol,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormGroup,
  CInput,
  CTextarea,
  CLabel,
  CInputCheckbox
} from '@coreui/react'

import {
  cilStar,
} from '@coreui/icons'

import CIcon from '@coreui/icons-react'

export default function LinkCreate({ add }) {

  const dispatch = useDispatch()

  const { user } = useAuth()

  const [load, setLoad] = useState(true)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [is_favorite, setIs_favorite] = useState(false)
  const [description, setDescription] = useState('')

  const color = is_favorite ? 'text-warning' : 'text-black'

  async function handleCreate(e) {
    e.preventDefault();
    setLoad(false)
    const { data: link, error } = await supabase
      .from("links")
      .insert({
        name,
        url,
        is_favorite,
        description,
        user_id: user.id
      })
      .single();
    if (error) {
      alert("error", error)
      return;
    } else {
      add(link)
      dispatch(ActionNotification.addOne({
        header: 'Link adicionado:',
        body: link.name,
        id: link.id,
      }))
    }
    setLoad(true)
  }

  return (
    <>
      <CModalHeader closeButton>
        <CModalTitle>Novo Link</CModalTitle>
      </CModalHeader >
      <CForm onSubmit={handleCreate} className="form-horizontal">
        <CModalBody>
          <CFormGroup row>
            <CCol xs="10" md="10">
              <CInput
                id="text-input"
                name="text-input"
                placeholder="Nome"
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </CCol>
            <CCol xs="2" md="2">
              <CFormGroup variant="custom-checkbox" inline>
                <CInputCheckbox
                  custom
                  id="inline-checkbox1"
                  name="inline-checkbox1"
                  value={is_favorite}
                  onChange={e => setIs_favorite(prev => !prev)}
                />
                <CLabel variant="custom-checkbox" htmlFor="inline-checkbox1">
                  <CIcon className={'float-right text-decoration-none ' + color}
                    width={18} content={cilStar} />
                </CLabel>
              </CFormGroup>
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol xs="12" md="12">
              <CInput
                id="text-input"
                name="text-input"
                placeholder="Url"
                type='url'
                required
                value={url}
                onChange={e => setUrl(e.target.value)}
              />
            </CCol>
          </CFormGroup>
          <CFormGroup row>
            <CCol xs="12" md="12">
              <CTextarea
                name="textarea-input"
                id="textarea-input"
                rows="3"
                maxLength='500'
                placeholder="Descrição..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </CCol>
          </CFormGroup>
        </CModalBody>
        <CModalFooter>
          <CButton type="submit" color="success" disabled={!load}>
            {
              load ? 'Adicionar' : (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />)
            }
          </CButton>
        </CModalFooter>
      </CForm>
    </>
  )
}