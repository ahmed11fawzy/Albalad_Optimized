
import React from 'react'
import { motion } from "framer-motion";
import BundleOffersSection from '../compenets/BundleOffersSection';
import SuperOffersCard from '../compenets/SuperOffersCard';
const Offers = () => {
    const variants = {
    hiddenLeft: { opacity: 0, x: -120 },
    hiddenRight: { opacity: 0, x: 120 },
    visible: { opacity: 1, x: 0 },
  };
  return (
    <div className="container">
        <div className="offers-two-column-grid">
            {/* Bundle Offers Card */}
                 <motion.div
                    variants={variants}
                    initial="hiddenRight"
                    whileInView="visible"
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.3 }}
                >

                    <BundleOffersSection />    
                </motion.div>
            {/* super Offers Card */}
                <motion.div
                variants={variants}
                initial="hiddenLeft"
                whileInView="visible"
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.3 }}
                >

              <SuperOffersCard />
            </motion.div>
              {/* by x get y */}
        </div>
    </div>      
  )
}

export default Offers