import { openModal } from '@/lib/utils/modalUtils';
import { useTranslations } from 'next-intl';
import { Button } from '../ui/button';
import { useEffect } from 'react';
import Spinner from '../shared/skeletons/spinner';
import { useMainContext } from '@/providers/mainContext';
import { motion } from 'framer-motion';

const Intro = () => {
  const t = useTranslations();
  const context = useMainContext();

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.5 } },
  };

  return (
    context.loading ? <Spinner size={10}/> : (
      <div className='bg-transparent text-center'>
        <motion.h2
          className='h2-medium items-center checkDarkTheme-Text text-2xl sm:text-4xl md:text-5xl lg:text-6xl'
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          {t('Intro.title')}
        </motion.h2>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={buttonVariants}
        >
          <Button
            variant='outline'
            size='lg'
            className='flex mx-auto mt-24 justify-center text-lg w-40 h-16 bg-white text-black hover:bg-black hover:text-white hover:border-black transition-colors duration-300'
            onClick={() => openModal(context, 'playModal')}
          >
            {t('Intro.playBtn')}
          </Button>
        </motion.div>
      </div>
    )
  );
}

export default Intro;
