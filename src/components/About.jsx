import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const SocialButton = ({ platform, link, bgColor }) => {
  let icon;
  
  if (platform === "GitHub") {
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 15 15" className="w-5">
        <path clipRule="evenodd" fillRule="evenodd" fill="currentColor" d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z" />
      </svg>
    );
  } else if (platform === "LinkedIn") {
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1.1em" viewBox="0 0 512 512" strokeWidth={0} fill="currentColor" stroke="currentColor" className="w-5 h-5">
        <path d="M444.17 32H70.28C49.85 32 32 46.7 32 66.89v374.72C32 461.91 49.85 480 70.28 480h373.78c20.54 0 35.94-18.21 35.94-38.39V66.89C480.12 46.7 464.6 32 444.17 32zm-273.3 373.43h-64.18V205.88h64.18zM141 175.54h-.46c-20.54 0-33.84-15.29-33.84-34.43 0-19.49 13.65-34.42 34.65-34.42s33.85 14.82 34.31 34.42c-.01 19.14-13.31 34.43-34.66 34.43zm264.43 229.89h-64.18V296.32c0-26.14-9.34-44-32.56-44-17.74 0-28.24 12-32.91 23.69-1.75 4.2-2.22 9.92-2.22 15.76v113.66h-64.18V205.88h64.18v27.77c9.34-13.3 23.93-32.44 57.88-32.44 42.13 0 74 27.77 74 87.64z" />
      </svg>
    );
  } else if (platform === "Instagram") {
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1.2em" viewBox="0 0 24 24" strokeWidth={1} fill="currentColor" stroke="currentColor" className="w-5">
        <path d="M12.001 9C10.3436 9 9.00098 10.3431 9.00098 12C9.00098 13.6573 10.3441 15 12.001 15C13.6583 15 15.001 13.6569 15.001 12C15.001 10.3427 13.6579 9 12.001 9ZM12.001 7C14.7614 7 17.001 9.2371 17.001 12C17.001 14.7605 14.7639 17 12.001 17C9.24051 17 7.00098 14.7629 7.00098 12C7.00098 9.23953 9.23808 7 12.001 7ZM18.501 6.74915C18.501 7.43926 17.9402 7.99917 17.251 7.99917C16.5609 7.99917 16.001 7.4384 16.001 6.74915C16.001 6.0599 16.5617 5.5 17.251 5.5C17.9393 5.49913 18.501 6.0599 18.501 6.74915ZM12.001 4C9.5265 4 9.12318 4.00655 7.97227 4.0578C7.18815 4.09461 6.66253 4.20007 6.17416 4.38967C5.74016 4.55799 5.42709 4.75898 5.09352 5.09255C4.75867 5.4274 4.55804 5.73963 4.3904 6.17383C4.20036 6.66332 4.09493 7.18811 4.05878 7.97115C4.00703 9.0752 4.00098 9.46105 4.00098 12C4.00098 14.4745 4.00753 14.8778 4.05877 16.0286C4.0956 16.8124 4.2012 17.3388 4.39034 17.826C4.5591 18.2606 4.7605 18.5744 5.09246 18.9064C5.42863 19.2421 5.74179 19.4434 6.17187 19.6094C6.66619 19.8005 7.19148 19.9061 7.97212 19.9422C9.07618 19.9939 9.46203 20 12.001 20C14.4755 20 14.8788 19.9934 16.0296 19.9422C16.8117 19.9055 17.3385 19.7996 17.827 19.6106C18.2604 19.4423 18.5752 19.2402 18.9074 18.9085C19.2436 18.5718 19.4445 18.2594 19.6107 17.8283C19.8013 17.3358 19.9071 16.8098 19.9432 16.0289C19.9949 14.9248 20.001 14.5389 20.001 12C20.001 9.52552 19.9944 9.12221 19.9432 7.97137C19.9064 7.18906 19.8005 6.66149 19.6113 6.17318C19.4434 5.74038 19.2417 5.42635 18.9084 5.09255C18.573 4.75715 18.2616 4.55693 17.8271 4.38942C17.338 4.19954 16.8124 4.09396 16.0298 4.05781C14.9258 4.00605 14.5399 4 12.001 4ZM12.001 2C14.7176 2 15.0568 2.01 16.1235 2.06C17.1876 2.10917 17.9135 2.2775 18.551 2.525C19.2101 2.77917 19.7668 3.1225 20.3226 3.67833C20.8776 4.23417 21.221 4.7925 21.476 5.45C21.7226 6.08667 21.891 6.81333 21.941 7.8775C21.9885 8.94417 22.001 9.28333 22.001 12C22.001 14.7167 21.991 15.0558 21.941 16.1225C21.8918 17.1867 21.7226 17.9125 21.476 18.55C21.2218 19.2092 20.8776 19.7658 20.3226 20.3217C19.7668 20.8767 19.2076 21.22 18.551 21.475C17.9135 21.7217 17.1876 21.89 16.1235 21.94C15.0568 21.9875 14.7176 22 12.001 22C9.28431 22 8.94514 21.99 7.87848 21.94C6.81431 21.8908 6.08931 21.7217 5.45098 21.475C4.79264 21.2208 4.23514 20.8767 3.67931 20.3217C3.12348 19.7658 2.78098 19.2067 2.52598 18.55C2.27848 17.9125 2.11098 17.1867 2.06098 16.1225C2.01348 15.0558 2.00098 14.7167 2.00098 12C2.00098 9.28333 2.01098 8.94417 2.06098 7.8775C2.11014 6.8125 2.27848 6.0875 2.52598 5.45C2.78014 4.79167 3.12348 4.23417 3.67931 3.67833C4.23514 3.1225 4.79348 2.78 5.45098 2.525C6.08848 2.2775 6.81348 2.11 7.87848 2.06C8.94514 2.0125 9.28431 2 12.001 2Z" />
      </svg>
    );
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex justify-center p-2 rounded-md ${bgColor} text-white`}
      title={platform}
    >
      {icon}
    </a>
  );
};

const About = () => {
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const teamRef = useRef(null);
  const meteorRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.fromTo(
        aboutRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );

      gsap.fromTo(
        ".feature-item",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.8,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".team-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.3,
          duration: 0.8,
          scrollTrigger: {
            trigger: teamRef.current,
            start: "top 80%",
          },
        }
      );

      const createMeteor = () => {
        if (!meteorRef.current) return;

        const meteor = document.createElement("div");
        meteor.className = "meteor";

        const size = Math.random() * 3 + 1;
        const posX = Math.random() * window.innerWidth;
        const posY = (Math.random() * window.innerHeight) / 2;
        const duration = Math.random() * 1 + 0.8;

        meteor.style.width = `${size}px`;
        meteor.style.height = `${size * 15}px`;
        meteor.style.left = `${posX}px`;
        meteor.style.top = `${posY}px`;

        meteorRef.current.appendChild(meteor);

        gsap.to(meteor, {
          x: -300,
          y: 300,
          opacity: 0,
          duration: duration,
          ease: "none",
          onComplete: () => {
            meteor.remove();
          },
        });
      };

      const meteorInterval = setInterval(createMeteor, 400);
      return () => clearInterval(meteorInterval);
    }
  }, []);

  const teamMembers = [
    {
      name: "Atanu Saha",
      role: "FrontEnd Developer",
      specialty: "Frontend Architecture",
      linkedin: "https://www.linkedin.com/in/atanu-saha-aab9b0282/",
      github: "https://github.com/Atanu2k4",
      instagram: "https://instagram.com/okayez123",
    },
    {
      name: "Shreyas Saha",
      role: "Full-Stack Developer",
      specialty: "ReactJS,Firebase,API Integration",
      linkedin: "https://linkedin.com/in/shreyas-saha",
      github: "https://github.com/Shreyas0017",
      instagram: "https://instagram.com/shreyas17_op",
    },
    {
      name: "Aninda Debta",
      role: "UI/UX Designer",
      specialty: "User Experience",
      linkedin: "https://linkedin.com/in/aninda01",
      github: "https://github.com/aninda8680",
      instagram: "https://instagram.com/_the_aninda_",
    },
  ];

  const features = [
    "Secure online ordering",
    "Instant order confirmation",
    "Fast pick-up experience",
  ];

  return (
    <section
      id="about"
      ref={aboutRef}
      className="relative py-16 md:py-24 text-white overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #000000 30%, #ff6b00 300%)",
      }}
    >
      <div
        ref={meteorRef}
        className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      ></div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-0"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="text-center mb-12 md:mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 1.5, type: "spring" }}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-orange-500 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30">
              <span className="text-2xl md:text-3xl">🍽️</span>
            </div>
          </motion.div>
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 text-orange-500"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            About Us
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl mb-8 md:mb-12 max-w-2xl mx-auto text-gray-300 leading-relaxed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Welcome to our online food ordering platform! We provide a seamless
            experience, allowing you to place orders effortlessly and pick them
            up hassle-free.
          </motion.p>
        </motion.div>

        <motion.div
          ref={featuresRef}
          className="mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-orange-500">
            Our Features
          </h3>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="feature-item w-full sm:w-auto px-4 py-3 bg-black/40 backdrop-blur-sm rounded-lg border border-orange-500/20 shadow-lg shadow-orange-600/10 flex items-center"
                whileHover={{
                  scale: 1.03,
                  borderColor: "rgba(249, 115, 22, 0.4)",
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-orange-500 mr-2 text-lg">→</span>
                <span className="text-gray-200">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div ref={teamRef} className="mb-12 md:mb-16">
          <motion.h3
            className="text-2xl md:text-3xl font-bold mb-8 text-center text-orange-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Meet Our Team
          </motion.h3>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="team-card w-full sm:w-64 text-center p-6 rounded-xl bg-black/50 backdrop-blur-sm border border-orange-500/30 shadow-lg shadow-orange-600/5"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(249, 115, 22, 0.2)",
                }}
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-2xl md:text-3xl text-white shadow-inner">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl text-white font-semibold mt-4">
                  {member.name}
                </h3>
                <p className="text-orange-400 font-medium">{member.role}</p>
                <p className="text-gray-400 text-sm mt-2">
                  {member.specialty}
                </p>
                <div className="mt-4 flex justify-center space-x-3">
                  <SocialButton 
                    platform="GitHub" 
                    link={member.github} 
                    bgColor="bg-gray-800 hover:bg-gray-700" 
                  />
                  <SocialButton 
                    platform="LinkedIn" 
                    link={member.linkedin} 
                    bgColor="bg-[#0077b5] hover:bg-[#0077b5]/80" 
                  />
                  <SocialButton 
                    platform="Instagram" 
                    link={member.instagram} 
                    bgColor="bg-[#a21caf] hover:bg-[#a21caf]/80" 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .meteor {
          position: absolute;
          background: linear-gradient(white, transparent);
          transform: rotate(45deg);
          border-radius: 50% 0 0 0;
          opacity: 0.8;
          filter: blur(1px);
          z-index: 1;
        }
      `}</style>
    </section>
  );
};

export default About;