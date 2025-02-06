import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/dropdown";
import MenuHamburger from '@icons/menuHamburger';
import { Button } from '@heroui/button';
import Logo from '@components/logo';
import { useNavigate } from 'react-router';

export default function Header() {
  const navigate = useNavigate();

  return (
    <div className='flex z-50 absolute top-2 justify-around w-screen items-center'>
      <Logo width={2} />
      <h1 className="text-white text-[1rem] font-bold">HackTheLove</h1>
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly variant="bordered" className='rounded-lg'>
            <MenuHamburger width={50} height={50} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem key="new" className='text-white bg-[#DD016D] rounded-lg' onPress={() => navigate('/')}>Home</DropdownItem>
          <DropdownItem key="new" className='text-white bg-[#DD016D] rounded-lg' onPress={() => navigate('/profile')}>Profilo</DropdownItem>
          <DropdownItem key="new" className='text-white bg-[#DD016D] rounded-lg' onPress={() => navigate('/bio')}>Modifica bio</DropdownItem>
          <DropdownItem key="new" className='text-white bg-[#DD016D] rounded-lg' onPress={() => navigate('/likes')}>Guarda i likes</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
