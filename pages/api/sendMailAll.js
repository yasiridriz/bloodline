import sgMail from '@sendgrid/mail';
import client from '../../lib/sanity/client'
import groq from 'groq'

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


export default async (req, res) => {
    const { hospital, bloodType } = req.body;
    const response = await client.fetch(groq`*[_type=="donor"&&bloodType=="${bloodType}"]{"email": email}`)
    if (response) {
        response.map(async user => {
            const msg = {
                to: user.email,
                from: 'bloodlinemacedonia@gmail.com',
                subject: 'Help save a life!',
                text: "There is a request for blood at",
                html: `<ul>
                            <li>
                                ${hospital}
                            </li>
                            <li>
                                of your blood type ${bloodType}
                            </li>
                        </ul>`,
            }
            try {
                await sgMail.send(msg);
                res.json({ message: `Email has been sent to ${user.email}` })
            } 
            catch (error) {
                res.status(500).json({ "error": "Couldn't send mail." })
            }    
        })
    }
    
    
    
}