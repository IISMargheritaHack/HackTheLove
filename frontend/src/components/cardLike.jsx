import PropTypes from 'prop-types';
import WhatsAppIcon from '@icons/whatsAppIcon';
import { Button } from '@heroui/button';
import { useNavigate } from 'react-router';

export default function CardLike({ userInfo }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3 m-4 w-[90vw] bg-white rounded-lg justify-around">
      <img src={userInfo.image} loading='lazy' alt="profile" className="size-10 m-2 rounded-full object-cover" />
      <h2 onClick={() => navigate(`/profile?email=${btoa(userInfo.user.email)}`)} className="text-lg text-black">{userInfo.user.family_name}{' '}{userInfo.user.given_name}</h2>
      <Button isIconOnly onPress={() => {
        window.open(`https://wa.me/${userInfo.user_info.phone}`, '_blank');
      }}>
        <WhatsAppIcon width={40} height={30} />
      </Button>
    </div>
  );
}

CardLike.propTypes = {
  userInfo: PropTypes.shape({
    image: PropTypes.string.isRequired,
    user: PropTypes.shape({
      email: PropTypes.string.isRequired,
      family_name: PropTypes.string.isRequired,
      given_name: PropTypes.string.isRequired,
    }).isRequired,
    user_info: PropTypes.shape({
      phone: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
