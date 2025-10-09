// RegisterCoursePage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const RegisterCoursePage = () => {
  const { role } = useParams(); // student or teacher
  const navigate = useNavigate();
  const [selectedCurriculum, setSelectedCurriculum] = useState(null);

  // Curricula definitions
  const curricula = [
    {
      name: "GES",
      description: "Ghana Education Service Curriculum",
      gradient: "from-yellow-400 to-yellow-500",
      packageGradient: "from-yellow-100 to-yellow-200",
    },
    {
      name: "Cambridge",
      description: "Cambridge International Curriculum",
      gradient: "from-blue-400 to-purple-500",
      packageGradient: "from-blue-100 to-purple-100",
    },
  ];

  // Packages for students only
  const curriculumPackages = {
    GES: [
      { name: "After School Classes", description: "Enhance your learning after school.", img: "https://source.unsplash.com/400x300/?school,students" },
      { name: "Home Tuition", description: "Private lessons at home.", img: "https://source.unsplash.com/400x300/?home,tutoring" },
      { name: "Vacation Classes", description: "Learn and have fun during vacations.", img: "https://source.unsplash.com/400x300/?summer,classes" },
    ],
    Cambridge: [
      { name: "One on One Classes", description: "Personalized teaching for you.", img: "https://source.unsplash.com/400x300/?one-on-one,tutoring" },
      { name: "Remedial Classes", description: "Extra help for struggling students.", img: "https://source.unsplash.com/400x300/?remedial,learning" },
    ],
  };

  // Handle curriculum selection
  const handleCurriculumSelect = (curriculumName) => {
    setSelectedCurriculum(curriculumName);

    // If role is teacher, go directly to auth form (no packages)
    if (role === "teacher") {
      navigate(`/auth-form/${role}`, {
        state: { role, curriculum: curriculumName },
      });
    }
  };

  // Handle package selection (students only)
  const handlePackageSelect = (packageName) => {
    navigate(`/auth-form/${role}`, {
      state: { role, curriculum: selectedCurriculum, packageName },
    });
  };

  const currentTheme = curricula.find((c) => c.name === selectedCurriculum);

  return (
    <div
      className={`min-h-screen flex flex-col items-center py-16 px-4 ${
        selectedCurriculum
          ? "bg-gray-50"
          : "bg-gradient-to-b from-cyan-50 to-blue-50"
      }`}
    >
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-gray-900">
        {!selectedCurriculum
          ? `Select Curriculum (${role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"})`
          : role === "student"
          ? `${selectedCurriculum} Packages`
          : `${selectedCurriculum} Curriculum`}
      </h2>

      {/* Curriculum Selection */}
      {!selectedCurriculum && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-6xl">
          {curricula.map((curriculum) => (
            <div
              key={curriculum.name}
              onClick={() => handleCurriculumSelect(curriculum.name)}
              className={`cursor-pointer w-full h-64 rounded-3xl shadow-xl transform transition-transform hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${curriculum.gradient} flex flex-col justify-center items-center text-white p-6`}
            >
              <h3 className="text-3xl font-extrabold mb-3">{curriculum.name}</h3>
              <p className="text-center text-lg">{curriculum.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Package Selection (students only) */}
      {selectedCurriculum && role === "student" && (
        <>
          <button
            onClick={() => setSelectedCurriculum(null)}
            className="px-5 py-2 mb-6 rounded-lg shadow-md font-semibold text-gray-800 hover:bg-gray-300 self-start"
          >
            &larr; Back to Curriculum
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
            {curriculumPackages[selectedCurriculum].map((pkg) => (
              <div
                key={pkg.name}
                onClick={() => handlePackageSelect(pkg.name)}
                className={`cursor-pointer bg-gradient-to-br ${currentTheme.packageGradient} rounded-xl shadow-lg hover:scale-105 transform transition-transform overflow-hidden`}
              >
                <img
                  src={pkg.img}
                  alt={pkg.name}
                  className="w-full h-44 object-cover"
                />
                <div className="p-5">
                  <h4 className="text-xl font-bold mb-2 text-gray-800">{pkg.name}</h4>
                  <p className="text-gray-700">{pkg.description}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RegisterCoursePage;
