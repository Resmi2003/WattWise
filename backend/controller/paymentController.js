const Stripe = require('stripe')
const users = require('../model/userModel')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

exports.createCheckoutSessionController = async (req, res) => {

    console.log("inside payment controller")

    try {

        // GET LOGGED USER
        const loggedUser = await users.findById(req.payload)  // get loggedin user using jwt payload

        const session = await stripe.checkout.sessions.create({

            payment_method_types: ['card'],

            line_items: [
                {
                    price_data: {
                        currency: 'usd',

                        product_data: {
                            name: 'WattWise Premium',
                            description: 'Premium Report Access'
                        },

                        unit_amount: 499
                    },

                    quantity: 1
                }
            ],

            mode: 'payment',

            success_url: `${process.env.CLIENT_URL}/payment-success?email=${loggedUser.email}`,

            cancel_url: `${process.env.CLIENT_URL}/payment-cancel`
        })

        res.status(200).json({
            url: session.url
        })

    }
    catch (error) {

        console.log(error)

        res.status(500).json(error)
    }
}



exports.makePremiumController = async (req, res) => {

    console.log("inside make premium controller")

    const { email } = req.body

    try {

        const updatedUser = await users.findOneAndUpdate(

            { email },

            {
                isPremium: true
            },

            {
                new: true
            }
        )

        res.status(200).json(updatedUser)

    }
    catch (error) {

        console.log(error)

        res.status(500).json(error)
    }

}