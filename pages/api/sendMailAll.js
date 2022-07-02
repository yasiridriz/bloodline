import sgMail from '@sendgrid/mail';
import client from '../../lib/sanity/client'
import groq from 'groq'

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async (req, res) => {
    const { hospital, bloodType } = req.body;
    console.log(bloodType, hospital)
    await client.fetch(groq`*[_type=="donor"&&bloodType=="A+"]{"email": email}`)
        .then((r) => {
            if (r) {
                console.log(r)
                r.map(async user => {
                    const msg = {
                        to: user.email,
                        from: 'bloodlinemacedonia@gmail.com',
                        subject: 'Help save a life!',
                        text: "There is a request for blood at",
                        html: `<ul>
                                    <li>
                                        Hospital Acibadem Sistina
                                    </li>
                                    <li>
                                        of your blood type A+
                                    </li>
                                </ul>`,
                    }
                    try {
                        return await sgMail.send(msg).then(() => {
                            return res.json({ message: `Email has been sent to ${user.email}` })
                        }).catch(() => {
                            return res.status(500).json({ "error": "Couldn't send mail." })
                        });
                    } 
                    catch (error) {
                        console.log(error)
                    }    
                })
            }
        })
    .catch((error => {
        console.log(error)
    }))
}
    
    
    
