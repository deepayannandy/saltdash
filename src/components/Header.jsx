import React, { Fragment ,useEffect} from 'react'
import { Menu, Transition } from '@headlessui/react'
import { HiOutlineSearch } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import avatar from '../assets/astronaut.png'

function Header() {
    const navigate = useNavigate()
	const [username, setusername] = React.useState([]);
	
	useEffect(()=>{
		let token= localStorage.getItem('username');
		setusername(token)
	}, [])
	
  return (
    <div className='sticky top-0 bg-teal-600 h-16 px-4  flex justify-between items-center border-b border-gray-300 z-10'>
      <div className='relative'>
      <HiOutlineSearch fontSize={20} className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"/>
        <input type='text' placeholder='Search...'className='text-sm focus:outline-none active:outline-none h-10 w-[15rem] border border-gray-300 rounded-lg pl-11 pr-4'/>
      </div>
      <div className="flex items-center gap-2 mr-2">
				<Menu as="div" className="relative">
					<div>
						<Menu.Button className="ml-2 bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400">
							<span className="sr-only"></span>
							<div
								className="h-10 w-10 rounded-full bg-teal-600 bg-cover bg-no-repeat bg-center"
								style={{ backgroundImage: `url(${avatar})` }}
							>
								<span className="sr-only">Marc Backes</span>
							</div>
						</Menu.Button>
					</div>
					<Transition
						as={Fragment}
						enter="transition ease-out duration-100"
						enterFrom="transform opacity-0 scale-95"
						enterTo="transform opacity-100 scale-100"
						leave="transition ease-in duration-75"
						leaveFrom="transform opacity-100 scale-100"
						leaveTo="transform opacity-0 scale-95"
					>
						<Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-lg shadow-md p-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
							<Menu.Item>
								{({ active }) => (
									<div
										onClick={() => navigate('/profile')}
										className={classNames(
											active && 'bg-gray-100',
											'active:bg-gray-200 rounded-lg px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200'
										)}
									>
										Your Profile
									</div>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<div
										onClick={() => navigate('/settings')}
										className={classNames(
											active && 'bg-gray-100',
											'active:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200'
										)}
									>
										Settings
									</div>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<div
                                        onClick={() => {
											localStorage.clear();
											window.location.reload(false);
   											navigate('/Login');
										}}
										className={classNames(
											active && 'bg-gray-100',
											'active:bg-gray-200 rounded-sm px-4 py-2 text-gray-700 cursor-pointer focus:bg-gray-200'
										)}
									>
										Sign out
									</div>
								)}
							</Menu.Item>
						</Menu.Items>
					</Transition>
				</Menu>
				<div className='flex'>
				<label className="block text-gray-200 text-sm font-bold mb-2">Hey, </label>
				<label className="block text-gray-200 text-sm font-bold mb-2">{username}</label>
				</div>
            </div>
    </div>
  )
}

export default Header;
