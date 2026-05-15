import React, { useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { makePremiumAPI } from '../../services/allAPI'
import { FaCrown } from 'react-icons/fa'
import { useAppContext } from '../../context/AppContext'

function PaymentSuccess() {

    const [searchParams] = useSearchParams()

    const { fetchUser } = useAppContext()

    useEffect(() => {

        const makePremium = async () => {

            try {

                const email = searchParams.get('email')

                if (email) {

                    const result = await makePremiumAPI({ email })

                    console.log(result)

                    if (result.status === 200) {

                        // REFRESH USER FROM DATABASE
                        await fetchUser()

                        console.log("Premium Updated Successfully")
                    }
                }

            } catch (err) {
                console.log(err)
            }
        }

        makePremium()

    }, [])

    return (

        <div className='min-h-screen flex justify-center items-center bg-gray-100'>

            <div className='bg-white shadow-lg rounded-lg p-10 text-center w-[400px]'>

                <div className='flex justify-center mb-4 text-green-600 text-5xl'>
                    <FaCrown />
                </div>

                <h1 className='text-3xl font-bold text-green-600 mb-4'>
                    Payment Successful
                </h1>

                <div className='flex justify-center items-center gap-2 text-gray-700 font-semibold mb-6'>
                    <FaCrown className='text-yellow-500' />
                    <span>You are now a Premium User</span>
                </div>

                <p className='text-gray-500 mb-8'>
                    Premium report access has been activated successfully.
                </p>

                <Link
                    to='/dashboard'
                    className='bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded inline-block'
                >
                    Go Dashboard
                </Link>

            </div>

        </div>
    )
}

export default PaymentSuccess