import { motion } from 'framer-motion';
import { container, content } from '../lib/motion/variants';
import styles from '../styles/Home.module.css';

import useSanity from '../hooks/useSanity';

import useTranslation from '../hooks/useTranslation';

const Requests = () => {
    const { t } = useTranslation();
    const query = `*[_type == "request" && status == "1"]`;
    const { data: requests, isLoading, isError } = useSanity(query)

    return (
        <motion.div variants={container} initial='initial' animate='enter' exit='exit' >
            <div className={styles.main}>
                <div className='form-box'>
                    <motion.h1 variants={content} style={{ textAlign: 'center' }}>{t("Latest")}</motion.h1>
                    <div className="row justify-content-center">
                        <div className="col-md-7">
                            <motion.div variants={content} className="form-box">
                                <ul className="list">
                                    {isError && (
                                        <motion.h3 variants={content} style={{ textAlign: 'center', color: 'darkred' }}>{t('FailedLoadingRequests')}</motion.h3>
                                    )}
                                    {isLoading && (
                                        <motion.h3 variants={content} style={{ textAlign: 'center' }}>{t('Loading')}</motion.h3>
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
                                                                <span className='status'> {t('Active')}</span>
                                                            ) || (
                                                                    <span className='status completed' >{t('Completed')}</span>
                                                                )}
                                                        </h5>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <p> {t('Priority')} </p>
                                                        <h2>
                                                            <span>{request.priority}</span> 
                                                        </h2>
                                                    </div>
                                                </div>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </motion.div>
                        </div>
                    </div >
                </div >
                <br />
            </div >
        </motion.div >
    );
}

export default Requests;