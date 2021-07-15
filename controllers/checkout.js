const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


exports.checkout = async (req, res) => {
    const user = req.user;
    const products = req.body.products;
    const poroductCounts = req.body.productCounts,

    const transformedProducts = products.map((product, index) => ({
        description: product.description,
        quantity: productCounts[index] * 1,
        price_data: {
            currency: "inr",
            product_data: {
                name: item.title, 
                images: [item.image]
            },
            unit_amount: product.price * 100
        }
    }))


    const session = await Stripe.checkout.sessions.create({
        payment_methods_types: ["card"],
        shipping_rates: ["shr_1IzE3ASB6xVY9FmUnXNaS9lP"],
        shipping_address_collection: {
            allowed_contries: ["IN"],
        },
        line_items: transformedProducts,
        mode: "payment",
        success_url: `/success`,
        cancel_url: `/checkout`,
        metadata: {
            email: user.email,
            images: JSON.stringify(products.map(product => product.images))
        }
    })
    res.status(200).json({id: session.id});
}