import React from 'react';
import Portal from '../portal/Portal';
import { motion, AnimatePresence } from 'framer-motion';

const Alert = ({ showAlert, children, handleClose = () => { } }) => {
  return (
    <AnimatePresence>
      <Portal
        visible={showAlert}
        containerClassName="fixed inset-0 z-[999] flex items-center justify-center"
        contentClassName="z-50 w-full max-w-[300px] min-h-[150px] shadow-md"
        onClose={handleClose}
        classOverlay='bg-opacity-10'
      >
        <motion.div
          animate={{
            opacity: [0, 1],
            scale: [0.5, 1]
          }}
          key="cancelAlertError"
          exit={{
            opacity: [1, 0],
            scale: [1, 0.5]
          }}
        >
          {children}
        </motion.div>
      </Portal>
    </AnimatePresence>
  );
}

export default Alert;
