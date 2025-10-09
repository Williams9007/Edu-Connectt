import React from "react";
import {
  FaBookOpen,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  // ✅ Updated Role Click Handler
  const handleRoleClick = (role) => {
    // lowercase role just for consistency
    const selectedRole = role.toLowerCase();

    // Instead of saving only to localStorage, we navigate with state
   navigate(`/register-course/${selectedRole}`); // dynamic route

  };

  const packages = [
    {
      title: "After School Classes",
      description: "Enhance your learning after school.",
      img: "https://source.unsplash.com/400x300/?school,students",
    },
    {
      title: "Home Tuition",
      description: "Private lessons at home.",
      img: "https://source.unsplash.com/400x300/?home,tutoring",
    },
    {
      title: "Vacation Classes",
      description: "Learn and have fun during vacations.",
      img: "https://source.unsplash.com/400x300/?summer,classes",
    },
    {
      title: "One on One Classes",
      description: "Personalized teaching for you.",
      img: "https://source.unsplash.com/400x300/?one-on-one,tutoring",
    },
    {
      title: "Remedial Classes",
      description: "Extra help for struggling students.",
      img: "https://source.unsplash.com/400x300/?remedial,learning",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-100 text-gray-900">
      {/* Hero Section */}
      <section className="relative h-screen">
        <img
          src="https://source.unsplash.com/1600x900/?education,classroom"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-6 left-6 flex items-center gap-2 text-3xl font-bold">
          <FaBookOpen className="text-yellow-400 animate-pulse" />
          <span className="text-primary">EduConnect</span>
        </div>
      </section>

      {/* About Us */}
      <section className="py-16 px-4 md:px-20 text-center">
        <h2 className="text-3xl font-bold mb-4">About Us</h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          EduConnect bridges students and teachers, offering accessible
          learning, real-time resources, and academic guidance for every level.
        </p>
      </section>

      {/* Packages Section */}
      <section className="py-16 px-4 md:px-20 bg-gradient-to-r from-cyan-100 to-blue-50">
        <h2 className="text-3xl font-bold text-center mb-10">Our Packages</h2>
        <Slider {...settings}>
          {packages.map((pkg) => (
            <div key={pkg.title} className="p-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transform transition-transform duration-300 w-60 md:w-64">
                <img
                  src={pkg.img}
                  alt={pkg.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{pkg.title}</h3>
                  <p className="text-gray-600 text-sm">{pkg.description}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Role Selection */}
      <section className="py-16 bg-gradient-to-r from-blue-100 to-cyan-200">
        <h2 className="text-3xl font-bold text-center mb-10">Choose Your Role</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 px-4 md:px-20">
          {[
            {
              name: "Student",
              icon: <FaUserGraduate size={48} className="text-blue-600" />,
            },
            {
              name: "Teacher",
              icon: <FaChalkboardTeacher size={48} className="text-blue-600" />,
            },
          ].map((role) => (
            <div
              key={role.name}
              onClick={() => handleRoleClick(role.name)}
              className="cursor-pointer bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center gap-4 transform transition-transform duration-300 hover:scale-110 hover:shadow-2xl w-64 md:w-72"
            >
              {role.icon}
              <h3 className="text-xl font-semibold">{role.name}</h3>
              <p className="text-center text-gray-600">
                Click to register as a {role.name.toLowerCase()}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-gray-800 text-white text-center">
        <p className="mb-4">Follow us on social media</p>
        <div className="flex justify-center gap-6 text-2xl">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
            <FaTwitter />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500"
          >
            <FaInstagram />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
