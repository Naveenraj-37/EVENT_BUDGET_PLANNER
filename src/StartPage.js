import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserPlus, FaSignInAlt, FaUserShield } from 'react-icons/fa';
import { IoIosArrowRoundForward } from 'react-icons/io';

function StartPage() {
  const navigate = useNavigate();

  // Card data
  const cards = [
    {
      title: "Create Account",
      description: "Start your journey with our comprehensive budgeting platform.",
      icon: <FaUserPlus className="text-2xl" />,
      color: "#D58893",
      bgColor: "#25344F",
      action: "Get started",
      route: "/signup"
    },
    {
      title: "User Login",
      description: "Access your existing account and continue your planning.",
      icon: <FaSignInAlt className="text-2xl" />,
      color: "white",
      bgColor: "#617891",
      action: "Sign in",
      route: "/login"
    },
    {
      title: "Admin Portal",
      description: "Administrative access for comprehensive oversight.",
      icon: <FaUserShield className="text-2xl" />,
      color: "white",
      bgColor: "#632024",
      action: "Admin login",
      route: "/admin-login"
    }
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardItem = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#25344F] to-[#617891] relative overflow-hidden font-sans">
      {/* Header */}
      <header className="w-full py-6 px-8 absolute top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.h1 
            className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#D58893]">Event</span>Budget Pro
          </motion.h1>
          <motion.span 
            className="text-sm text-white/70 hidden sm:block font-light"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Precision Financial Management
          </motion.span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-20 relative z-10">
        <div className="w-full max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span className="text-[#D58893]">Elevate</span> Your Event Budgeting
            </motion.h2>
            <motion.p
              className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Professional tools to manage your event finances with confidence and clarity.
            </motion.p>
          </motion.div>

          {/* Cards Container */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {cards.map((card, index) => (
              <motion.div
                key={index}
                className="flex flex-col"
                variants={cardItem}
                whileHover={{ 
                  y: -10,
                  transition: { 
                    type: "spring",
                    stiffness: 300,
                    damping: 15
                  } 
                }}
              >
                <div 
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 flex-grow flex flex-col cursor-pointer h-full transition-all duration-300 hover:border-opacity-50"
                  style={{ 
                    borderColor: card.color,
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
                  }}
                  onClick={() => navigate(card.route)}
                >
                  <div 
                    className="flex items-center justify-center w-16 h-16 rounded-full mb-6 mx-auto"
                    style={{ backgroundColor: card.bgColor }}
                  >
                    {card.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4 text-center">{card.title}</h3>
                  <p className="text-white/70 mb-6 text-center font-light flex-grow">
                    {card.description}
                  </p>
                  <div className="flex items-center justify-center group">
                    <span 
                      className="text-sm font-medium mr-1 group-hover:mr-2 transition-all"
                      style={{ color: card.color }}
                    >
                      {card.action}
                    </span>
                    <IoIosArrowRoundForward 
                      className="text-xl transition-all group-hover:translate-x-1" 
                      style={{ color: card.color }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-8 relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div 
              className="text-white/50 text-sm mb-4 md:mb-0 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              © 2025 EventBudget Pro. All rights reserved.
            </motion.div>
            <motion.div 
              className="flex space-x-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              <a href="#" className="text-white/50 hover:text-[#D58893] transition-colors text-sm font-light">Privacy</a>
              <a href="#" className="text-white/50 hover:text-[#617891] transition-colors text-sm font-light">Terms</a>
              <a href="#" className="text-white/50 hover:text-[#632024] transition-colors text-sm font-light">Contact</a>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default StartPage;