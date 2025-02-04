import { useState } from 'react';
import ArrowRight from '@icons/arrowRight';
import Logo from '@components/logo';
export default function ProfilePage() {
  const [user] = useState({
    name: 'User Name',
    bio: 'Lorem ipsum dolor sit amet.',
    age: 17,
    sex: 'M',
    match: 10,
  });

  return (
    <div className="">
      <Logo width={6} />
      <div className="mt-20 bg-blue-900 w-100 rounded-2xl p-6 shadow-lg relative ml-4">
        <div className="w-full ">
          <h2 className="text-center text-3xl font-bold text-white mb-5 ">
            PROFILO
          </h2>
        </div>
        <div className="mt-10 relative mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <img>
            </img>
        </div>
        <div className="text-center mt-10">
          <h3 className="text-xl font-bold text-white">{user.name}</h3>
          <p className="text-white text-sm">{user.bio}</p>

          <div className="flex justify-between mt-10 px-10 text-white">
            <div className="text-center">
              <p className="text-sm font-bold">AGE</p>
              <p>{user.age}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold">SEX</p>
              <p>{user.sex}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold">MATCH</p>
              <p>{user.match}</p>
            </div>
          </div>
          <div className='mt-10'>
            <p className='font-bold text-left'>IMAGES:</p>
            <img></img>
          </div>
          <div className="w-full mt-20 flex justify-center">
            <button className="w-[80vw] h-[43px] rounded-4xl bg-white text-black flex items-center justify-center gap-2 shadow-md">
              <span className="font-bold">Modifica</span>
              <ArrowRight className="text-xl" width="30" height="25" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
