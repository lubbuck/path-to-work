import React, { useState, useEffect, useCallback } from 'react'
import { LinkComponent } from '../../components/'
import { supabase } from '../../services/supabase'
import { BreadcrumbHeader, Loading, NoItems } from '../../reusable/'
import LinkCreate from './LinkCreate'

export default function LinkIndex() {

  const [loading, setLoading] = useState(true)
  const [links, setLinks] = useState([])

  const fetchLinks = useCallback(async () => {
    const { data: links, error } = await supabase
      .from("links")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.log("error", error);
    }
    else {
      setLinks(links)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  if (loading) return (<Loading />)

  return (
    <>
      <BreadcrumbHeader title="Links" quantidade={links.length} component={<LinkCreate add={link => setLinks([...links, link])} />} />
      {links <= 0 ? <NoItems /> :
        links.map(link => (<LinkComponent key={link.id} link={link} />))
      }
    </>
  )
}