import Link from 'next/link';
import { motion } from 'framer-motion';
import { content } from '../lib/motion/variants';

import useTranslation from '../hooks/useTranslation';

import styles from '../styles/Home.module.css';
import Background from '../components/background/Background';


const Home = () => {
	const { t } = useTranslation();
	return (
		<motion.div initial='initial' animate='enter' exit='exit'>
			<div className={styles.main}>
				<motion.div variants={content}  className={styles.backgroundContainer}>
					<Background />
				</motion.div>
				<motion.div variants={content}  className={`${styles.landingmessage} noisy`}>
					<h1 style={{fontWeight: '300'}}>{t("Slogan_one")}<span style={{fontWeight: '600', color: 'darkred'}}>{t("Slogan_drop")}</span>{t("Slogan_fromYou")}<br />{t("Slogan_an")}<span style={{fontWeight: '600', color: '#0a7e8c'}}>{t("Slogan_ocean")}</span>{t("Slogan_for")}</h1>
					<Link href='/donate'><a className='button'>{t("GetStarted")} &rarr;</a></Link>
				</motion.div>
			</div>
		</motion.div>
	);
}

export default Home;
