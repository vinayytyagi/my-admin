import React from 'react'
import Client from '../_components/Client'

export default async function Page({ params }) {
  const { id } = await params;
  return <Client defaultId={id} />
}


