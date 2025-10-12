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
    const selectedRole = role.toLowerCase();
    navigate(`/register-course/${selectedRole}`);
  };

  const handleLoginClick = () => {
    navigate("/login");
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
          <span className="text-primary">EduConnectt</span>
        </div>

        {/* ✅ Login Button Top-Right */}
        <button
          onClick={handleLoginClick}
          className="absolute top-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      </section>

   {/* About Us */}
<section className="py-16 px-4 md:px-20 bg-cyan-50">
  <div className="max-w-3xl mx-auto text-center">
    <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-black-600">
      About Us
    </h2>
    <p>EduConnectt is an online platform that connects teachers and students for virtual after-school classes. We offer both GES and Cambridge curricula. 
EduConnectt is designed for parents and guardians who want to register their children for online after-school classes. Our platform allows educators to focus on teaching, providing parents with a good return on their investment. We also offer easy access to children's academic performance and mitigate issues associated with traditional home tuition. Additionally, students can enhance their tech skills.</p>

    <h3 className="text-gray-700 text-lg md:text-xl leading-relaxed mb-6">Register today for tracked results!</h3>
  </div>
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
        <p className="text-sm text-gray-500 text-center mt-6">
  © 2025 EduConnect. All rights reserved.
</p>

      </footer>
    </div>
  );
};

export default LandingPage;
