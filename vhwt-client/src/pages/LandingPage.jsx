import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Users, MapPin, Activity, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function LandingPage() {
  const navigate = useNavigate();

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const Section = ({ children }) => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });
    return (
      <motion.section
        ref={ref}
        variants={fadeUp}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="py-24 px-6"
      >
        {children}
      </motion.section>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 text-gray-800">
      {/* Hero Section */}
      <Section>
        <div className="relative py-24 px-6 text-center overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1588776814546-ecf6fddfe3b0?auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-20 animate-floating"
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          ></motion.div>
          <div className="relative z-10">
            <motion.h1
              className="text-5xl md:text-6xl font-extrabold text-indigo-700 mb-4 drop-shadow-lg"
              variants={fadeUp}
            >
              Village Health Worker Tracker
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-6"
              variants={fadeUp}
            >
              Empowering ASHA Workers & Doctors to transform rural healthcare.
            </motion.p>
            <div className="mt-8 flex justify-center gap-6">
              <motion.button
                onClick={() => navigate("/login")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg"
              >
                Login
              </motion.button>
              <motion.button
                onClick={() => navigate("/signup")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-indigo-50 shadow-lg"
              >
                Sign Up
              </motion.button>
            </div>
          </div>
        </div>
      </Section>

      {/* Features Section */}
      <Section>
        <h2 className="text-4xl font-bold text-center text-indigo-700 mb-16">
          Core Features
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <FeatureCard icon={<ShieldCheck size={36} />} title="Emergency Alerts" desc="Send instant location-based SOS messages via WhatsApp." />
          <FeatureCard icon={<Users size={36} />} title="Role-Based Dashboards" desc="Custom dashboards for ASHA workers and doctors." />
          <FeatureCard icon={<MapPin size={36} />} title="Geo-tagged Visits" desc="Automatically log visit locations using GPS." />
          <FeatureCard icon={<Activity size={36} />} title="Health Monitoring" desc="Track patient history, medication, and follow-ups securely." />
        </div>
      </Section>

      {/* How It Works Section */}
      <Section>
        <h2 className="text-4xl font-bold text-center text-indigo-700 mb-16">
          How It Works
        </h2>
        <div className="max-w-5xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
          {["Register as Worker or Doctor", "Add & Track Patients", "Send Emergency Alerts", "Monitor Health Reports"].map((step, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-indigo-500 hover:shadow-xl"
            >
              <h3 className="text-2xl font-bold text-indigo-700 mb-2">
                Step {index + 1}
              </h3>
              <p className="text-sm text-gray-600">{step}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* About Us Section */}
      <Section>
        <h2 className="text-4xl font-bold text-center text-indigo-700 mb-12">
          About Us
        </h2>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6 animate-bounce">
            <HeartHandshake size={48} className="text-indigo-600" />
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            We are a passionate team committed to transforming healthcare access in rural India. By bridging the digital divide with intuitive tools and real-time monitoring, we aim to empower ASHA workers and doctors to provide timely, effective, and personalized care in even the remotest villages.
          </p>
        </div>
      </Section>

      {/* CTA Section */}
      <Section>
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-gray-600 mb-6">
            Join hands in revolutionizing rural healthcare. Start your journey with VHWT today.
          </p>
          <motion.button
            onClick={() => navigate("/signup")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 text-white px-10 py-4 rounded-full font-semibold hover:bg-indigo-700 shadow-xl"
          >
            Get Started
          </motion.button>
        </div>
      </Section>

      {/* Footer */}
      <footer className="bg-indigo-700 py-10 text-white text-center mt-10">
        <p className="text-sm">© {new Date().getFullYear()} Village Health Worker Tracker · All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
          <a href="/terms" className="hover:underline">Terms</a>
          <a href="/contact" className="hover:underline">Contact</a>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
      className="bg-indigo-50 rounded-xl p-6 text-center shadow-md hover:shadow-xl transition"
    >
      <div className="text-indigo-600 mb-4 mx-auto">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </motion.div>
  );
}