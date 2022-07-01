import styles from '../styles/Home.module.css';
import Link from "next/link";
import { useState } from 'react';

import client from '../lib/sanity/client';

import { motion } from 'framer-motion';
import { container, content } from '../lib/motion/variants';

import useTranslation from '../hooks/useTranslation';

const Donate = () => {
	const { t } = useTranslation();

	// Donor must be above 18 to register:
	// Create new Date
	let date = new Date();
	date.setFullYear(date.getFullYear() - 18);
	let dateString = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
	
	const [name, setName] = useState('');
	const [birthDate, setBirthDate] = useState(dateString);
	const [bloodType, setBloodType] = useState('A+');
	const [phone, setPhone] = useState('');
	const [email, setEmail] = useState('');

	const [isSubmitting, setIsSubmitting] = useState(false)
	const [hasSubmitted, setHasSubmitted] = useState(false)

	const mail = async (e) => {
		try {
			await fetch("/api/sendmail", {
				"method": "POST",
				"headers": { "content-type": "application/json" },
				"body": JSON.stringify({
					"name": name,
					"birthDate": birthDate,
					"bloodType": bloodType,
					"phone": phone,
					"email": email,
				})
			})
		}
		catch (error) {
			console.log("Couldn't send mail: %e", error)
		}

	}

	const onSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true)
		client.create({
			_type: 'user',
			name,
			birthDate,
			bloodType,
			email,
			phone
		}).then(async (res) => {
			console.log(res);
			mail();
			setHasSubmitted(true);
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

	if (hasSubmitted)
		return (
			<motion.div className='form-box' style={{ paddingTop: '25%' }} initial='initial' animate='enter' exit='exit' variants={container}>
				<motion.h3 variants={content} style={{ textAlign: 'center' }}>{t('Thanks')}</motion.h3>
				<motion.div variants={content} className='group row justify-content-center'>
					<Link href='/'><a>{t('BackToHome')} &rarr;</a></Link>
				</motion.div>
			</motion.div>
		)

	return (
		<motion.div variants={container} initial='initial' animate='enter' exit='exit' >
			<div className={styles.main}>
				<form onSubmit={onSubmit} className="form-box">
					<motion.h1 variants={content}>{t('SignUpForBloodline')}</motion.h1>
					<div className="row justify-content-center">
						<div className="col-md-6">
							<motion.div variants={content} className="group">
								<label>{t('FullName')}*</label>
								<input type='text' required name='name' value={name} onChange={e => setName(e.target.value)} />
							</motion.div>
							<motion.div variants={content} className="group">
								<label>{t('BirthDate')}*</label>
								<input type='date' name='birthDate' required max={dateString} value={birthDate} onChange={e => setBirthDate(e.target.value)} />
							</motion.div>
							<motion.div variants={content} className="group">
								<label>{t('BloodType')}*</label>
								<select name='bloodType' value={bloodType} onChange={e => setBloodType(e.target.value)}>
									<option>A+</option>
									<option>A-</option>
									<option>B+</option>
									<option>B-</option>
									<option>AB+</option>
									<option>AB-</option>
									<option>0+</option>
									<option>0-</option>
								</select>
							</motion.div>
							<motion.div variants={content} className="group">
								<label>{t('PhoneNumber')}*</label>
								<input name='phone' type='text' required value={phone} onChange={e => setPhone(e.target.value)} />
							</motion.div>
							<motion.div variants={content} className="group">
								<label>{t('Email')}*</label>
								<input name='email' type='text' required value={email} onChange={e => setEmail(e.target.value)} />
							</motion.div>
							<motion.div variants={content}>
								<input type="submit" className="button" value={isSubmitting ? `${t('Saving')}` : `${t('Save')}`} />
							</motion.div>
						</div>
					</div>
					<br />
				</form>
			</div>
		</motion.div>
	);
}

export default Donate;