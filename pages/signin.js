import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { container, content } from '../lib/motion/variants';
import { signIn } from 'next-auth/react';
import useTranslation from '../hooks/useTranslation';
import styles from '../styles/Home.module.css';

const Login = () => {
	const { t } = useTranslation();
	// Form fields:
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [isSubmitting, setIsSubmitting] = useState(false)

	const router = useRouter();
	const onSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		const status = await signIn('credentials', {
			redirect: false,
			email: email,
			password: password,
		});
		console.log(status);
		if (status && status.ok) {
			router.push('/');
		}
	}

	return (
		<motion.div variants={container} initial='initial' animate='enter' exit='exit' >
			<div className={styles.main}>
				<form onSubmit={onSubmit} className="form-box">
					<motion.h1 variants={content}>{t("SignIn")}</motion.h1>
					<div className="row justify-content-center">
						<div className="col-md-7">
							<motion.div variants={content} className="group">
								<label>{t('Email')}*</label>
								<input name='email' type='text' required value={email} onChange={e => setEmail(e.target.value)} />
							</motion.div>
							<motion.div variants={content} className="group">
								<label>{t('Password')}*</label>
								<input name='password' type='password' required value={password} onChange={e => setPassword(e.target.value)} />
							</motion.div>
							<motion.div variants={content}>
								{isSubmitting && (
									<input type="submit" className="button" value={t('SigningIn')} disabled />
								) || (
										<input type="submit" className="button" value={t('SignIn')} />
									)}
							</motion.div>
						</div>
					</div>
					<br />
				</form>
			</div>
		</motion.div>
	);
}

export default Login;