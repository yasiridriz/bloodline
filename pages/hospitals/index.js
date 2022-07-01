import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { container, content } from '../../lib/motion/variants';

import client from '../../lib/sanity/client';
import groq from 'groq';
import { getSession, useSession } from 'next-auth/react';
import useTranslation from '../../hooks/useTranslation';
import useSanity from '../../hooks/useSanity';

import styles from '../../styles/Home.module.css';

const Hospitals = (props) => {
    const { t } = useTranslation(); // t function from translation hook.
    const { data: session, status: authstatus } = useSession(); // session from next-auth/react.

    // Get institute and its locations from user's institution.
    let hospitalQuery;
    if (authstatus == 'authenticated') {
        hospitalQuery = `*[_type=="user" && email=="${session.user.email}"][0]{
            "hospital": *[_type=='institute' && references(^._id)][0]{ 
                name,
                locations
              }
          }`;
    }
    const { data: hospitalData, isLoading: hospitalLoading, isError: hospitalError } = useSanity(hospitalQuery);
    let locations = [];

    // // Get requests, isLoading state, and any Error from custom hook.
    // const requestsQuery = `*[_type == "request" && hospital == "${hospitalName}" ]`;
    // const { data: requests, isLoading: requestLoading, isError: requestError, mutate: mutateRequests } = useSanity(requestsQuery);
    const requests = props.requests;

    // Form fields: 
    const [bloodType, setBloodType] = useState('A+')
    const [location, setLocation] = useState('Karpoš')
    const [hospital, setHospital] = useState('Acibadem Sistina')
    const [status, setStatus] = useState('1')
    const [priority, setPriority] = useState('1')

    if (!hospitalLoading) {
        locations = hospitalData.hospital.locations
        hospitalName = hospitalData.hospital.name
    }

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [hasSubmitted, setHasSubmitted] = useState(false)

    const mail = async (e) => {
		try {
			await fetch("/api/sendMailAll", {
				method: "POST",
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					bloodType: bloodType,
                    hospital: hospital,
				}),
			})
		}
		catch (error) {
			console.log('couldnt send mail: %e', error)
		}
	}

    const handleSend = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        client.create({
            _type: 'request',
            hospital: hospital,
            bloodType: bloodType,
            location: location,
            status: status,
            priority: priority,
        }).then(async (res) => {
            mutateRequests();
            mail();
            setIsSubmitting(false);
            setHasSubmitted(true);
            const messageRes = await fetch('/api/sendMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ operator: session.user.name, bloodType: bloodType, hospital: hospitalName, priority: priority }),
            });
            const apiResponse = await messageRes.json();

            if (apiResponse.success) {
                console.log('SMS sent successfully.')
            } else {
                console.log('SMS failed to send.')
            }
        }).catch((err) => {
            console.log(err);
            return (
                <motion.div className='form-box' style={{ paddingTop: '25%' }} initial='initial' animate='enter' exit='exit' variants={container}>
                    <motion.h3 variants={content} style={{ textAlign: 'center', color: 'darkred' }}>{t('ProblemSaving')}</motion.h3>
                    <motion.div variants={content} className='group row justify-content-center'>
                        <Link href='/'><a>{t('BackToHome')} &rarr;</a></Link>
                    </motion.div>
                </motion.div>
            )
        })
    }

    function handleDeactivate(id) {
        client
            .patch(`${id}`) // Document ID to patch
            .set({ status: '0' }) // set status to 0
            .commit() // Perform the patch and return a promise
            .then((updatedRequest) => {
                alert("The request is deactivated.", updatedRequest);

            })
            .catch((err) => {
                alert("Deactivation failed.")
                console.error('Oh no, the update failed: ', err.message)
            })
    }

    const [isDeleting, setIsDeleting] = useState(false)
    function handleDelete(id) {
        setIsDeleting(true);
        client
            .delete(id)
            .then(() => {
                setIsDeleting(false);
                alert("Request deleted.")
            })
    }

    return (
        <motion.div variants={container} initial='initial' animate='enter' exit='exit' >
            <div className={styles.main}>
                <div className="form-box">
                    <motion.h1 variants={content}>
                        {t('ManageRequests')}
                        <br /><br />
                        <b>{props.session.user.name}</b>
                        <br />
                        <span style={{ fontSize: '80%' }}>{hospitalName}</span>
                    </motion.h1>
                    <div className='row justify-content-center' >
                        <motion.div variants={content} className='col-md-7' style={{ margin: '3em 0' }}>
                            <h2> {t('NewRequest')} </h2>
                            <form onSubmit={handleSend}>
                                {hospitalData && (
                                    <div className="group">
                                        <label>{t('Location')}</label>
                                        <select onChange={(e) => setLocation(e.target.value)} value={location} name='location'>
                                            {locations.map((location, index) => (
                                                <option key={index} value={location}>{location}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <div variants={content} className="group">
                                    <label>{t('BloodType')}*</label>
                                    <select onChange={(e) => setBloodType(e.target.value)} value={bloodType} name='bloodType'>
                                        <option>A+</option>
                                        <option>A-</option>
                                        <option>B+</option>
                                        <option>B-</option>
                                        <option>AB+</option>
                                        <option>AB-</option>
                                        <option>0+</option>
                                        <option>0-</option>
                                    </select>
                                </div>
                                <div variants={content} className="group">
                                    <label>{t('Priority')}</label>
                                    <select onChange={(e) => setPriority(e.target.value)} value={priority} name='priority'>
                                        <option value={"1"}>{t('Level1')}</option>
                                        <option value={"2"}>{t('Level2')}</option>
                                        <option value={"3"}>{t('Level3')}</option>
                                    </select>
                                </div>
                                <input type="submit" className="button" value={isSubmitting ? t('Sending') : t('Send')} disabled={isSubmitting ? "true" : ""} />
                            </form>
                        </motion.div>
                        <motion.div variants={content} className='col-md-7' style={{ margin: '3em 0' }}>
                            <motion.h2> {t('PreviousRequests')} </motion.h2>
                            <ul className="list">
                                {/* {requestError && (
                                    <motion.h3 variants={content} style={{ textAlign: 'center', color: 'darkred' }}>{t('FailedLoadingRequests')}</motion.h3>
                                )}
                                {requestLoading && (
                                    <motion.h3 variants={content} style={{ textAlign: 'center' }}>{t('Loading')}</motion.h3>
                                )} */}
                                {requests && (
                                    requests.map((request) => (
                                        <li key={request._id}>
                                            <div className="row li">
                                                <div className="col-md-4">
                                                    <p> {t('BloodType')} </p>
                                                    <h2 style={{ fontWeight: '700', color: '#DA3237' }}>{request.bloodType}</h2>
                                                </div>
                                                <div className="col-md-4">
                                                    <p> {t('Location')} </p>
                                                    <h2><span>{request.location}</span> </h2>
                                                </div>
                                                <div className="col-md-4">
                                                    <p> {t('Status')} </p>
                                                    <h5>
                                                        {request.status == "1" && (
                                                            <span style={{ background: 'green', color: 'white', borderRadius: '7px', padding: '.2em .5em', display: 'inline-block' }}> {t('Active')}</span>
                                                        ) || (
                                                                <span style={{ background: 'darkred', color: 'white', borderRadius: '7px', padding: '.2em .5em', display: 'inline-block' }} >{t('Completed')}</span>
                                                            )}
                                                    </h5>
                                                </div>
                                                <div className='row justify-content-start'>
                                                    <div className='buttons'>
                                                        {request.status == "1" && (
                                                            <button className='button small' onClick={() => handleDeactivate(request._id)}>{t('Deactivate')}</button>
                                                        )}
                                                        <button className='button small' onClick={() => handleDelete(request._id)} disabled={isDeleting ? 'true' : ''}>{isDeleting ? "..." : t("Delete")}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div >
    );
}

export async function getServerSideProps(context) {
    const session = await getSession({ req: context.req });
    const res = await client.fetch(groq`*[_type == requests && hospital=="Acibadem Sistina" ]`);
    var requests;
    if (res)
        requests = res.Data;
    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    return {
        props: {
            session: session,
            requests: requests
        }
    };
}

export default Hospitals;
