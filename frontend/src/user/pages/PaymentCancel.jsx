import React from 'react'
import { Link } from 'react-router-dom'

function PaymentCancel() {

  return (

    <div className='min-h-screen flex justify-center items-center'>

      <div className='text-center'>

        <h1 className='text-4xl font-bold text-red-600'>
          Payment Cancelled
        </h1>

        <p className='my-5'>
          Payment was not completed
        </p>

        <Link
          to='/dashboard'
          className='bg-red-600 text-white px-5 py-3 rounded'
        >
          Back Dashboard
        </Link>

      </div>

    </div>
  )
}

export default PaymentCancel