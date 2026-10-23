const AboutBuffer = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-6 sm:px-6">
            <h1 className="text-3xl font-extrabold text-gray-900">
              How Our Buffer System Works
            </h1>
            <p className="mt-4 text-gray-600">
              Our funding platform features a unique buffer system designed
              to provide additional security and flexibility for both
              entrepreneurs and investors. This system ensures that projects can
              continue to receive support even after their initial funding goals
              are met, while also protecting investors&apos; interests.
            </p>
          </div>
          <div className="px-4 py-6 bg-gray-50 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Buffer System Overview
            </h2>
            <p className="mt-4 text-gray-600">
              The buffer system allows campaigns to receive additional
              investments beyond their initial funding goals. Here&apos;s how it
              works:
            </p>
            <ul className="mt-4 list-decimal list-inside text-gray-600">
              <li>
                <strong>Initial Funding Goal:</strong> When a campaign reaches
                its initial funding goal, it remains open for additional
                investments. This ensures that promising projects can continue
                to receive support from investors who see their potential.
              </li>
              <li>
                <strong>Additional Investments:</strong> Investors who
                contribute beyond the initial goal receive additional equity or
                rewards, incentivizing further investment. This buffer amount
                acts as an extra layer of financial support for the project.
              </li>
              <li>
                <strong>Utilization of Buffer Funds:</strong> If the project
                needs to utilize the buffer funds, the additional equity or
                rewards promised to these investors are honored. This ensures
                that investors are fairly compensated for their continued
                support.
              </li>
              <li>
                <strong>Refund Option:</strong> If the buffer funds are not
                needed or utilized, investors have the option to request a
                refund of their additional contributions. This flexibility helps
                maintain investor confidence and trust in the platform.
              </li>
            </ul>
          </div>
          <div className="px-4 py-6 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Benefits of the Buffer System
            </h2>
            <ul className="mt-4 list-disc list-inside text-gray-600">
              <li>
                Provides extra financial support for projects beyond the initial
                goal.
              </li>
              <li>
                Encourages ongoing investment by offering additional equity or
                rewards.
              </li>
              <li>
                Offers a safety net for projects to continue thriving even if
                unexpected costs arise.
              </li>
              <li>
                Maintains investor trust by allowing refunds for unused buffer
                contributions.
              </li>
            </ul>
          </div>
          <div className="px-4 py-6 bg-gray-50 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Example Scenario
            </h2>
            <p className="mt-4 text-gray-600">
              Suppose a startup sets an initial funding goal of $100,000. Once
              this goal is met, the campaign remains open for additional
              investments. If investors contribute an extra $20,000, these funds
              are held in the buffer. If the startup needs to use this buffer
              amount, the investors who contributed will receive additional
              equity. If the buffer is not used, these investors can choose to
              get their $20,000 back, ensuring their investments are protected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutBuffer;
