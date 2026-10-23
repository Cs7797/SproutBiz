const AboutUs = () => {
  return (
    <div className=" bg-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-6 sm:px-6">
            <h1 className="text-3xl font-extrabold text-gray-900">
              About Our funding Platform
            </h1>
            <p className="mt-4 text-gray-600">
              In today&apos;s digital era, startups often face financial
              challenges due to limited reach and accessibility of their ideas
              to a global audience. Our revolutionary funding platform
              leverages the power of blockchain technology and innovative
              authentication methods to connect entrepreneurs with investors
              worldwide.
            </p>
            <p className="mt-4 text-gray-600">
              Our platform aims to minimize the risk for investors while
              providing a secure and efficient funding mechanism for promising
              startup ventures.
            </p>
          </div>
          <div className="px-4 py-6 bg-gray-50 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900">Key Features</h2>
            <ul className="mt-4 list-disc list-inside text-gray-600">
              <li>
                Multi-currency investment including cryptocurrency and normal
                currencies like dollars.
              </li>
              <li>
                Advanced authentication methods based on work history and
                educational credentials.
              </li>
              <li>Batch funding model to minimize investor risk.</li>
              <li>
                Buffer system to ensure continued project support even if
                initial funding goals are exceeded.
              </li>
              <li>
                Transparent and user-friendly interface for both entrepreneurs
                and investors.
              </li>
              <li>
                Regular updates and progress tracking for investors to stay
                informed about project developments.
              </li>
              <li>
                Community engagement features to encourage collaboration and
                feedback among users.
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
          <p className="mt-4 text-gray-600">
            Our mission is to empower entrepreneurs and investors alike,
            fostering innovation and growth in the startup ecosystem. With our
            platform, entrepreneurs can realize their visions, and investors can
            support promising projects with confidence, driving economic
            prosperity and technological advancement.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
