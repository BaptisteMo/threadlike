"use client"

import React from 'react'

interface Props {
    user:{
        id: string;
        objectiId: string;
        username: string;
        name: string;
        bio: string;
        image: string;       
    };
    btnTitle : string;
}

export const AccountProfile = ({user, btnTitle}: Props) => {
  return (
        <div className="">
            Account profil
        </div>
    )
}


export default AccountProfile;