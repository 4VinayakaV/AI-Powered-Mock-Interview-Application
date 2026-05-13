import React from 'react'
import Header from './_components/Header'

function Dashboardlayout({children}) {
  return (
    <div className='min-h-screen bg-slate-50'>
      <Header/>
      <main className='mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8'> 
        {children}
      </main>
        
    </div>
  )
}

export default Dashboardlayout
