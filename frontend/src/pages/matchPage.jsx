import { useEffect, useState } from 'react'
import { getLikesMatches, getUserByParams, getPhotosByParams } from '@api/api'
import CardLike from '@components/cardLike'
import Header from '@components/header'
import { Spacer } from "@heroui/spacer";
export default function MatchPage() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getLikesMatches()
        if (!response.likes_by || response.likes_by.length === 0) {
          console.log("No match with like found.")
          return
        }

        const [usersData, imagesData] = await Promise.all([
          Promise.all(response.likes_by.map(email => getUserByParams(email))),
          Promise.all(response.likes_by.map(email => getPhotosByParams(email)))
        ])

        const usersWithImages = usersData.map((user, index) => {
          const image = imagesData[index]?.images?.[0] || ''
          return {
            ...user,
            image: image.startsWith('data:image') ? image : `data:image/jpeg;base64,${image}`
          }
        })

        setUsers(usersWithImages)

      } catch (error) {
        console.error("Errore nel recupero dei match:", error)
      }
    }

    fetchUsers()
    console.log(users)
  }, [])

  return (
    <div>
      <Header />
      <Spacer y={20} />
      {users.length === 0 ? (
        <p className='text-center m-3'>Sembra che nessuno abbia ancora ricambiato il tuo like!</p>
      ) : (
        users.map((user, index) => (
          <CardLike userInfo={user} key={index} />
        ))
      )}
    </div>
  )
}
