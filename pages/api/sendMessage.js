
import twilio from 'twilio';

export default function sendMessage(req, res) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID ;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, token);
  const message = `\n \n \nBlood donation request from hospital ${req.body.hospital}\n\nOperator: ${req.body.operator}\nBlood type: ${req.body.bloodType}
  `;

  // client.messages
  //   .create({
  //     body: message,
  //     from: '+12055709150',
  //     to: '+38979298135',
  //   })
  //   .then((message) =>
  //     res.json({
  //       success: true,
  //     })
  //   )
  //   .catch((error) => {
  //     console.log(error);
  //     res.json({
  //       success: false,
  //     });
  //   });
}