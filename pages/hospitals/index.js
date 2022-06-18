import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { container, content } from '../../lib/motion/variants';

import client from '../../lib/sanity/client';
import { getSession, useSession } from 'next-auth/react';
import useTranslation from '../../hooks/useTranslation';
import useSanity from '../../hooks/useSanity';

import styles from '../../styles/Home.module.css';

const Hospitals = (props) => {
    const { t } = useTranslation(); // t function from translation hook.
    const { data: session, status: authstatus } = useSession(); // session from next-auth/react.

    // Get requests, isLoading state, and any Error from custom hook.
    const requestsQuery = '*[_type == "request"]';
    const { data: requests, isLoading: requestLoading, isError: requestError, mutate: mutateRequests } = useSanity(requestsQuery);

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
    let hospitalName = '';
    let locations = [];
    if (hospitalData) {
        hospitalName = hospitalData.hospital.name;
        locations = hospitalData.hospital.locations;
    }

    // Form fields: 
    const [bloodType, setBloodType] = useState('A+')
    const [location, setLocation] = useState(locations[0])
    const [hospital, setHospital] = useState(hospitalName)
    const [status, setStatus] = useState('1')

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [hasSubmitted, setHasSubmitted] = useState(false)

    const handleSend = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        client.create({
            _type: 'request',
            hospital: hospital,
            bloodType: bloodType,
            location: location,
            status: status
        }).then(async (res) => {
            mutateRequests();
            setIsSubmitting(false);
            setHasSubmitted(true);
        }).catch((err) => {
            console.log(err);
            return (
                <motion.div className='form-box' style={{ paddingTop: '25%' }} initial='initial' animate='enter' exit='exit' variants={container}>
                    <motion.h3 variants={content} style={{ textAlign: 'center', color: 'darkred' }}>There was a problem while saving your information, please try again later.</motion.h3>
                    <motion.div variants={content} className='group row justify-content-center'>
                        <Link href='/'><a>Go back to the homepage &rarr;</a></Link>
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
                        Manage your requests
                        <br /><br />
                        <b>{props.session.user.name}</b>
                        <br />
                        <span style={{ fontSize: '80%' }}>{hospitalName}</span>
                    </motion.h1>
                    <div className='row justify-content-center' >
                        <motion.div variants={content} className='col-md-7' style={{ margin: '3em 0' }}>
                            <h2> New Request </h2>
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
                                <input type="submit" className="button" value={isSubmitting ? 'Sending...' : 'Send'} disabled={isSubmitting ? "true" : ""} />
                            </form>
                        </motion.div>
                        <motion.div variants={content} className='col-md-7' style={{ margin: '3em 0' }}>
                            <motion.h2> Previous Requests </motion.h2>
                            <ul className="list">
                                {requestError && (
                                    <motion.h3 variants={content} style={{ textAlign: 'center', color: 'darkred' }}>Failed loading requests. Please try again later.</motion.h3>
                                )}
                                {requestLoading && (
                                    <motion.h3 variants={content} style={{ textAlign: 'center' }}>Loading...</motion.h3>
                                )}
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
                                                            <button className='button small' onClick={() => handleDeactivate(request._id)}>Deactivate</button>
                                                        )}
                                                        <button className='button small' onClick={() => handleDelete(request._id)} disabled={isDeleting ? 'true' : ''}>{isDeleting ? "..." : t("Delete") }</button>
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
            session
        }
    };
}

export default Hospitals;
