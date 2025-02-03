import PropTypes from 'prop-types';

function Logo({ width = 20 }) {
  return (
    <div id="center" className="flex justify-center items-center">
      <img
        className={`max-h-screen object-contain mx-auto block`}
        style={{ maxWidth: `${width}rem` }}
        src="logo.svg"
        alt="Logo"
      />
    </div>
  );
}

Logo.propTypes = {
  width: PropTypes.number,
};

export default Logo;
